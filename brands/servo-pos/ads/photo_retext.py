"""Re-letters the owner's mock-ups so the edit cannot be seen: the old words are inpainted out of the paint banners (the banner
texture is rebuilt from its surroundings), then the new words are drawn in the same brush lettering, tilted, softened and grained
like the rest of the picture. Screens are placed inside the photo's own phones. Originals: ads/photos/originals, output: ads/photos/edited.
Usage: python3 ads/photo_retext.py [prefix ...]      (edit the JOBS table at the bottom, then view the result at 100%)"""
import math, os, sys
import cv2, numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter

HERE = os.path.dirname(os.path.abspath(__file__))
SRC, OUT, RAW = (os.path.join(HERE, "photos", "originals"), os.path.join(HERE, "photos", "edited"), os.path.join(HERE, "one-screen", "raw"))
TRIM = os.path.join(HERE, "devices", "shots", "trim")
BRUSH = os.path.join(HERE, "fonts", "Caveat_Brush.ttf")
HAND = os.path.join(HERE, "fonts", "Kalam.ttf")
SANS = "/usr/share/fonts/truetype/inter/Inter-ExtraBold.ttf"
if not os.path.exists(SANS):
    import glob
    SANS = (glob.glob("/usr/share/fonts/**/Inter*ExtraBold*.ttf", recursive=True) or glob.glob("/usr/share/fonts/**/Inter*.ttf", recursive=True) or [BRUSH])[0]
WHITE, YELLOW = (255, 255, 255), (255, 214, 10)


def erase(arr, box, kind="light", grow=4, thr=150, pur_rule=True):
    """Inpaint the lettering inside box (x0,y0,x1,y1). kind: light = pale text on dark, dark = dark text on a light banner, any = both."""
    x0, y0, x1, y1 = box
    sub = arr[y0:y1, x0:x1]
    g = sub.min(axis=2) if kind in ("light", "ink", "dy") else sub.max(axis=2)
    if kind == "ink":  # white or yellow lettering on a flat banner
        m = (sub[..., 0] > thr) & (sub[..., 1] > thr - 40)
    elif kind == "dy":  # dark ink and yellow underline on white paint
        m = (sub.max(axis=2) < thr) | ((sub[..., 0] > 200) & (sub[..., 1] > 150) & (sub[..., 2] < 140))
    elif kind == "light":
        m = (g > thr)
    elif kind == "dark":
        m = (g < 150)
    else:
        m = (sub.min(axis=2) > 150) | (sub.max(axis=2) < 110)
    m = m.astype(np.uint8)
    if pur_rule and kind in ("ink", "light") and thr > 190:  # lettering sits on purple paint: ignore bright pixels that are not next to purple (sky, glare, skin)
        pur = ((sub[..., 2].astype(int) - sub[..., 1] > 40) & (sub[..., 0] < 130)).astype(np.uint8)
        m = m & cv2.dilate(pur, np.ones((9, 9), np.uint8))
    if kind == "light" and thr > 190:  # text strokes are thin: keep only thin bright marks so bright background (sky, glare) is left alone
        m = m & ~cv2.morphologyEx(m, cv2.MORPH_OPEN, np.ones((11, 11), np.uint8)).astype(bool).astype(np.uint8)
    m = cv2.dilate(m * 255, np.ones((grow, grow), np.uint8), iterations=3)
    arr[y0:y1, x0:x1] = cv2.inpaint(np.ascontiguousarray(sub), m, 6, cv2.INPAINT_TELEA)
    return arr


def draw(base, lines, center, size, rot=0, color=WHITE, font=BRUSH, align="center", alpha=1.0, line_gap=0.92, colors=None):
    """Draw text lines centred on `center`, rotated by rot degrees (counter-clockwise), at 3x then reduced for soft edges."""
    k = 3
    f = ImageFont.truetype(font, int(size * k))
    runs = [t if isinstance(t, list) else [(t, None)] for t in lines]
    ws = [sum(f.getlength(tx) for tx, _ in r) for r in runs]
    lh = size * k * line_gap * 1.25
    W, H = int(max(ws) + 40 * k), int(lh * len(lines) + 40 * k)
    layer = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    for i, t in enumerate(lines):
        x = (W - ws[i]) / 2 if align == "center" else 20 * k
        for tx, c in runs[i]:
            d.text((x, 20 * k + i * lh), tx, font=f, fill=(c or (colors[i] if colors else color)) + (int(255 * alpha),))
            x += f.getlength(tx)
    layer = layer.rotate(rot, resample=Image.BICUBIC, expand=True).filter(ImageFilter.GaussianBlur(0.9 * k / 3))
    layer = layer.resize((layer.width // k, layer.height // k), Image.LANCZOS)
    ox, oy = int(center[0] - layer.width / 2), int(center[1] - layer.height / 2)
    base.alpha_composite(layer, (max(ox, 0), max(oy, 0)))


def screen(base, path, box, rot=0, radius=18, inset=(0.0, 0.0), crop_top=True, orig=None):
    """Place an app screen INSIDE a phone already in the photo: clipped to box, tilted, softened, grained, glazed."""
    x, y, w, h = box
    im = Image.open(path).convert("RGB")
    iw, ih = im.size
    ix, iy = int(iw * inset[0]), int(ih * inset[1])
    im = im.crop((ix, iy, iw - ix, ih - iy))
    s = max(w / im.width, h / im.height)
    im = im.resize((int(im.width * s), int(im.height * s)), Image.LANCZOS)
    im = im.crop((0, 0, w, h)) if crop_top else im.crop(((im.width - w) // 2, (im.height - h) // 2, (im.width + w) // 2, (im.height + h) // 2))
    a = np.asarray(im).astype(np.float32)
    a = a * 0.96 + 6
    gy, gx = np.mgrid[0:h, 0:w]
    glare = np.clip(1 - (gx / w * .8 + gy / h * .6), 0, 1) * 26
    a = np.clip(a + glare[..., None] - 6, 0, 255)
    a += np.random.default_rng(3).normal(0, 3.2, a.shape)
    im = Image.fromarray(np.clip(a, 0, 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(0.55))
    mask = Image.new("L", (w, h), 0)
    ImageDraw.Draw(mask).rounded_rectangle((0, 0, w - 1, h - 1), radius, fill=255)
    rgba = im.convert("RGBA"); rgba.putalpha(mask)
    rgba = rgba.rotate(rot, resample=Image.BICUBIC, expand=True)
    px, py = int(x + w / 2 - rgba.width / 2), int(y + h / 2 - rgba.height / 2)
    if orig is not None:  # leave fingers and anything warm-coloured in front of the screen untouched
        win = orig[max(py, 0):py + rgba.height, max(px, 0):px + rgba.width].astype(int)
        hand = (win[..., 0] > win[..., 2] + 22).astype(np.uint8)
        hand = cv2.dilate(hand, np.ones((3, 3), np.uint8))
        al = np.asarray(rgba.getchannel("A")).copy()
        al[:hand.shape[0], :hand.shape[1]][hand > 0] = 0
        rgba.putalpha(Image.fromarray(al))
    base.alpha_composite(rgba, (px, py))


def run(name, ops):
    f = next(x for x in os.listdir(SRC) if x.startswith(name))
    arr = np.asarray(Image.open(os.path.join(SRC, f)).convert("RGB")).copy()
    for op in ops:
        if op[0] == "erase":
            erase(arr, *op[1:])
    base = Image.fromarray(arr).convert("RGBA")
    for op in ops:
        if op[0] == "draw":
            draw(base, *op[1], **op[2])
        elif op[0] == "screen":
            screen(base, *op[1], orig=arr, **op[2])
    os.makedirs(OUT, exist_ok=True)
    base.convert("RGB").save(os.path.join(OUT, os.path.splitext(f)[0] + ".png"))
    print("done", f)


def E(box, kind="light", thr=150, grow=4, pur=True): return ("erase", box, kind, grow, thr, pur)
def T(lines, center, size, rot=0, **kw): return ("draw", (lines, center), dict(size=size, rot=rot, **kw))
def S(path, box, **kw): return ("screen", (path, box), kw)


PUR = (42, 10, 112)
CH = dict(font=HAND, color=(222, 222, 222), alpha=.88)
URL = "servo-pos.vercel.app/demo"


def chalk(boxes, prices, size=34):
    ops = [E(b, thr=110, grow=6) for b in boxes]
    ops += [T([f"E{v}"], ((b[0] + b[2]) // 2, (b[1] + b[3]) // 2), size, 0, **CH) for b, v in zip(boxes, prices)]
    return ops


def labels(items, thr=212, pur=True, grow=4, **kw):
    ops = [E(b, thr=thr, pur=pur, grow=grow) for b, _, _ in items]
    return ops + [T(t, c, **kw) for _, t, c in items]


JOBS = {
    "09-": chalk([(790, 84, 885, 136), (792, 162, 885, 212), (795, 244, 885, 296), (797, 326, 885, 378)], ["40", "35", "25", "15"], 40) + [
        E((1078, 50, 1200, 135), thr=212), E((1078, 135, 1225, 235), thr=212), E((1078, 262, 1235, 345), thr=212), E((1078, 380, 1254, 470), thr=212),
        T(["Cash works", "straight away"], (1140, 92), 25, 6), T(["Your data", "kept separate"], (1150, 188), 25, 6),
        T(["Guests order", "by table QR"], (1148, 306), 25, 6), T(["Reports on", "your phone"], (1162, 424), 25, 6),
        E((1015, 490, 1225, 700), thr=200), T(["Simple", "Clear", "Live"], (1105, 595), 50, 14),
        E((842, 1100, 1165, 1192), thr=190), T([URL], (1002, 1148), 29, 8),
    ],
    "10-": [
        E((1005, 75, 1240, 250), thr=205, grow=4, pur=False), T(["Simple.", "Clear.", "Live."], (1120, 165), 56, 12),
        *labels([((125, 435, 300, 495), ["Cash works", "straight away"], (195, 465)), ((125, 530, 300, 595), ["Your data", "kept separate"], (195, 562)),
                 ((125, 622, 300, 690), ["Guests order", "by table QR"], (195, 655)), ((125, 722, 305, 785), ["Reports on", "your phone"], (195, 752))], thr=205, size=27, pur=False),
        E((880, 1142, 1150, 1210), "dy", thr=170, grow=7), T([URL], (1010, 1170), 29, 8, color=PUR),
    ],
    "11-": chalk([(786, 222, 860, 266), (790, 306, 860, 352), (788, 400, 860, 446), (790, 490, 860, 536)], ["50", "30", "25", "15"], 38) + [
        *labels([((1018, 60, 1150, 130), ["Cash works", "straight away"], (1085, 95)), ((1018, 155, 1150, 228), ["Your data", "kept separate"], (1085, 192)),
                 ((1018, 262, 1150, 335), ["Guests order", "by table QR"], (1085, 298)), ((1018, 368, 1225, 440), ["Reports on", "your phone"], (1100, 404))], thr=170, size=27, pur=False, grow=6),
        E((985, 455, 1215, 700), thr=190), T(["Simple", "Clear", "Live"], (1098, 590), 50, 14),
        E((870, 1135, 1165, 1200), thr=200), T([URL], (1015, 1168), 28, 8),
    ],
    "08-": [
        E((28, 30, 460, 375), "ink", thr=200), T(["First 5 restaurants:", "6 months FREE!"], (235, 150), 50, 9, colors=[WHITE, YELLOW]), T(["Restaurants 6 to 10:", "3 months free"], (225, 285), 31, 9),
        E((885, 55, 1195, 255), "ink", thr=205), T(["Cash works", "straight away.", "Card once connected."], (1040, 150), 38, 9),
        *labels([((1042, 312, 1195, 375), ["6 months free", "(first 5)"], (1118, 343)), ((1045, 422, 1195, 485), ["Your data", "kept separate"], (1118, 453)),
                 ((1048, 528, 1200, 590), ["Guests order", "by table QR"], (1122, 560)), ((1045, 632, 1225, 695), ["Reports on", "your phone"], (1130, 664))], thr=212, size=26, align="center"),
        E((45, 925, 375, 1085), "ink", thr=200), T(["Less shouting.", "More serving."], (200, 1000), 50, 12),
        E((925, 1030, 1150, 1100), "dark", thr=140), T(["No app to download"], (1040, 1066), 34, 7, color=PUR),
        E((955, 1136, 1160, 1200), thr=200), T([URL], (1062, 1166), 27, 8),
    ],
    "01-": [
        E((125, 35, 385, 115), "ink", thr=200), T([[("Servo ", WHITE), ("POS", YELLOW)]], (250, 62), 46, 0, font=SANS), T(["Till · Kitchen · Reports"], (250, 99), 19, 0, font=SANS),
        E((28, 125, 600, 365), "ink", thr=200), T(["Your menu on", "your guests' phones!"], (310, 245), 62, 9, colors=[WHITE, YELLOW]),
        E((95, 380, 350, 525), thr=205), T(["Guests browse your menu", "with pictures and order", "from their phone."], (225, 452), 27, 9),
        E((1085, 460, 1215, 535), thr=205), T(["Daily", "reports"], (1148, 497), 34, 9),
        E((40, 945, 430, 1085), "dark", thr=140), T(["Your menu,", "your own app"], (235, 1000), 46, 9, color=PUR), T(["Standard and Multi-branch"], (235, 1058), 22, 9, color=PUR),
        E((880, 1108, 1195, 1212), "dark", thr=140), T([URL], (1040, 1158), 27, 7, color=PUR),
        *chalk([(926, 440, 975, 478), (926, 478, 975, 516), (926, 516, 975, 554), (926, 553, 975, 591), (926, 592, 975, 630)], ["30", "25", "20", "15", "12"], 25),
        S(os.path.join(RAW, "guest-menu.png"), (228, 620, 192, 318), rot=7, radius=18), S(os.path.join(RAW, "guest-home.png"), (996, 640, 216, 420), rot=3, radius=14),
    ],
    "16-": [
        E((112, 30, 315, 100), "ink", thr=200), T([[("Servo ", WHITE), ("POS", YELLOW)]], (212, 52), 36, 0, font=SANS), T(["Till · Kitchen · Reports"], (212, 86), 15, 0, font=SANS),
        E((742, 30, 945, 100), "ink", thr=200), T([[("Servo ", WHITE), ("POS", YELLOW)]], (842, 52), 36, 0, font=SANS), T(["Till · Kitchen · Reports"], (842, 86), 15, 0, font=SANS),
        S(os.path.join(TRIM, "manager_reports_phone_front.png"), (388, 303, 204, 330), rot=1, radius=14, inset=(0.05, 0.03)),
        S(os.path.join(TRIM, "waiter_server_phone_front.png"), (1000, 700, 202, 338), rot=5, radius=22, inset=(0.05, 0.03)),
        E((238, 1140, 450, 1205), "dark", thr=140), T(["Try the live demo", URL], (340, 1172), 27, 9, color=PUR),
        E((868, 1140, 1085, 1205), "dark", thr=140), T(["Try the live demo", URL], (975, 1170), 27, 9, color=PUR),
        E((828, 1072, 950, 1110), thr=200), T(["Kitchen", "Screen"], (888, 1090), 20, 0, color=WHITE, font=SANS),
    ],
}

if __name__ == "__main__":
    want = sys.argv[1:]
    for n, ops in JOBS.items():
        if not want or any(n.startswith(w) for w in want):
            run(n, ops)
