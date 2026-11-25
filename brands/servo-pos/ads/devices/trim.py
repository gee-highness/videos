"""Crops each transparent device render in ./shots to the device itself (and its soft shadow) -> ./shots/trim.
Run after capture.js:  python3 ads/devices/trim.py"""
import os, json
from PIL import Image
here = os.path.dirname(os.path.abspath(__file__))
src, dst = os.path.join(here, "shots"), os.path.join(here, "shots", "trim")
os.makedirs(dst, exist_ok=True)
sizes = {}
for f in sorted(os.listdir(src)):
    if not f.endswith(".png"):
        continue
    im = Image.open(os.path.join(src, f)).convert("RGBA")
    bbox = im.getchannel("A").point(lambda a: 255 if a > 10 else 0).getbbox()
    if not bbox:
        continue
    m = 8
    bbox = (max(0, bbox[0] - m), max(0, bbox[1] - m), min(im.width, bbox[2] + m), min(im.height, bbox[3] + m))
    im = im.crop(bbox)
    im.save(os.path.join(dst, f), optimize=True)
    sizes[f[:-4]] = [im.width, im.height]
json.dump(sizes, open(os.path.join(dst, "sizes.json"), "w"), indent=1)
print(len(sizes), "shots trimmed")
