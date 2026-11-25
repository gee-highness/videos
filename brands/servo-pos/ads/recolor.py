"""
Retint the purple background of finished promo images with a palette from ads/theme.js, for sets that have no generator script
(the launch posts). Only the large purple region that touches the image border is changed: white text, cards, screenshots, device frames
and yellow chips stay exactly as they are, and the original lighting (soft blobs, gradient) is kept.

    python3 ads/recolor.py ads/launch/images [--first 0] [--palettes ember,amber,teal,berry,ocean]

Images are rewritten in place (git has the originals). Palette n is used for the n-th image (sorted by name), cycling.
"""
import argparse
import json
import re
import subprocess
import sys
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFilter


def palettes():
    js = Path(__file__).with_name("theme.js")
    out = subprocess.run(["node", "-e", f"console.log(JSON.stringify(require({json.dumps(str(js))}).PALETTES))"], capture_output=True, text=True, check=True).stdout
    return json.loads(out)


def hexrgb(h):
    h = h.lstrip("#")
    return np.array([int(h[i:i + 2], 16) for i in (0, 2, 4)], dtype=np.float32)


def hsv(a):
    mx, mn = a.max(-1), a.min(-1)
    d = mx - mn
    s = np.where(mx > 0, d / np.maximum(mx, 1e-6), 0)
    r, g, b = a[..., 0], a[..., 1], a[..., 2]
    h = np.zeros_like(mx)
    m = d > 1e-6
    h = np.where(m & (mx == r), ((g - b) / np.maximum(d, 1e-6)) % 6, h)
    h = np.where(m & (mx == g), (b - r) / np.maximum(d, 1e-6) + 2, h)
    h = np.where(m & (mx == b), (r - g) / np.maximum(d, 1e-6) + 4, h)
    return h * 60, s, mx


def dilate(mask, px):
    img = Image.fromarray((mask * 255).astype(np.uint8)).copy()
    for _ in range(max(1, px // 4)):
        img = img.filter(ImageFilter.MaxFilter(9))
    return np.asarray(img) > 0


def recolor(path, pal):
    im = Image.open(path).convert("RGB")
    a = np.asarray(im).astype(np.float32) / 255
    h, s, v = hsv(a)
    violet = (h >= 235) & (h <= 295) & (v > 0.12)
    light_text = violet & (v >= 0.80) & (s < 0.45)  # the pale lilac body and brand text: made cream below, not turned into background
    core = violet & (s > 0.30) & (v < 0.97) & ~light_text
    # keep only the core region(s) that touch the border and are big: that is the background, not a purple button on a screenshot
    mask_img = Image.fromarray((core * 255).astype(np.uint8)).copy()  # copy: the array-backed image is read-only and floodfill would silently do nothing
    H, W = core.shape
    seeds = [(x, 0) for x in range(0, W, 8)] + [(x, H - 1) for x in range(0, W, 8)] + [(0, y) for y in range(0, H, 8)] + [(W - 1, y) for y in range(0, H, 8)]
    for x, y in seeds:
        if mask_img.getpixel((x, y)) == 255:
            ImageDraw.floodfill(mask_img, (x, y), 128)
    bg = np.asarray(mask_img) == 128
    if bg.mean() < 0.05:
        return 0.0
    # small enclosed purple pockets near the background are the holes inside big letters (e, o, a): background too. Bigger ones are real UI.
    lum_all = 0.2126 * a[..., 0] + 0.7152 * a[..., 1] + 0.0722 * a[..., 2]
    light = lum_all > 0.62
    chip_cache = {}

    def in_chip(region):
        """True when the light pixels around this region form a big blob (a chip), not a thin letter stroke."""
        # start just ABOVE the region's top edge: a centre point would land inside a letter's own counter (O, a, d) and misjudge it
        top = min(region)
        y, x = top
        start = None
        for r in range(1, 40):
            if y - r >= 0 and light[y - r, x]:
                start = (y - r, x)
                break
        if start is None:
            return False
        if start in chip_cache:
            return chip_cache[start]
        seen2, stack = {start}, [start]
        while stack and len(seen2) <= 11000:
            yy, xx = stack.pop()
            for y2, x2 in ((yy - 1, xx), (yy + 1, xx), (yy, xx - 1), (yy, xx + 1)):
                if 0 <= y2 < H and 0 <= x2 < W and light[y2, x2] and (y2, x2) not in seen2:
                    seen2.add((y2, x2))
                    stack.append((y2, x2))
        big_blob = len(seen2) > 11000
        for q in list(seen2)[:50]:
            chip_cache[q] = big_blob
        return big_blob

    near = dilate(bg, 40)
    visited = bg.copy()
    pocket = np.zeros_like(bg)
    big = Image.fromarray((core * 255).astype(np.uint8)).copy()
    for y0, x0 in np.argwhere(core & near & ~bg):
        if visited[y0, x0]:
            continue
        seen, stack, small = {(y0, x0)}, [(y0, x0)], True
        while stack:
            y, x = stack.pop()
            for yy, xx in ((y - 1, x), (y + 1, x), (y, x - 1), (y, x + 1)):
                if 0 <= yy < H and 0 <= xx < W and core[yy, xx] and (yy, xx) not in seen:
                    seen.add((yy, xx))
                    stack.append((yy, xx))
            if len(seen) > 4000:
                small = False
                break
        if small:
            ys, xs = zip(*seen)
            visited[list(ys), list(xs)] = True
            # inside a big light region (a white or yellow chip) it is chip text and stays as drawn; inside a letter stroke it is a hole: background
            if not in_chip(seen):
                pocket[list(ys), list(xs)] = True
        else:  # a real UI region: mark all of it visited so it is not walked again from each of its pixels
            ImageDraw.floodfill(big, (int(x0), int(y0)), 99)
            visited |= np.asarray(big) == 99
    solid = bg | pocket
    # grow a few pixels over the anti-aliased edges so no purple halo is left round the text
    grown = dilate(solid, 6)
    mask = solid | (grown & violet & (s > 0.22) & ~light_text)
    lum = 0.2126 * a[..., 0] + 0.7152 * a[..., 1] + 0.0722 * a[..., 2]
    t = np.clip((lum - 0.07) / (0.44 - 0.07), 0, 1)[..., None]
    c1, c2, c3 = hexrgb(pal["c1"]) / 255, hexrgb(pal["c2"]) / 255, hexrgb(pal["c3"]) / 255
    lo = c1 + (c2 - c1) * np.clip(t / 0.58, 0, 1)
    hi = c2 + (c3 - c2) * np.clip((t - 0.58) / 0.42, 0, 1)
    new = np.where(t < 0.58, lo, hi)
    soft = np.asarray(Image.fromarray((mask * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(0.8))).astype(np.float32)[..., None] / 255
    out = a * (1 - soft) + new * soft
    # lilac text next to the background becomes a warm cream (white stays white)
    text = light_text & dilate(solid, 12) & (s > 0.02)
    cream = v[..., None] * np.array([1.0, 0.955, 0.90], dtype=np.float32)
    k = (np.clip(s / 0.15, 0, 1) * text)[..., None]
    out = out * (1 - k) + cream * k
    Image.fromarray((np.clip(out, 0, 1) * 255).astype(np.uint8)).save(path)
    return float(mask.mean())


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("folder")
    ap.add_argument("--first", type=int, default=0, help="palette number the first image starts at")
    ap.add_argument("--palettes", default="", help="comma list of palette names to cycle (default: all)")
    a = ap.parse_args()
    pals = palettes()
    if a.palettes:
        want = a.palettes.split(",")
        pals = [p for p in pals if p["name"] in want]
    files = sorted(p for p in Path(a.folder).glob("*.png") if re.match(r"^[a-z]\d", p.name))
    for n, f in enumerate(files):
        pal = pals[(n + a.first) % len(pals)]
        share = recolor(f, pal)
        print(f"{f.name}: {pal['name']} ({share * 100:.0f}% retinted)" if share else f"{f.name}: no purple background found, left alone")


if __name__ == "__main__":
    sys.exit(main())
