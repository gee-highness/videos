"""
Fails if any captured device shot is clipped by its canvas: solid (alpha > 150) pixels in the outermost 2 rows or columns mean the device runs off the frame.
Run after capturing and before composing:  python3 ads/devices/check-crop.py   (exit code 1 when something is cut)
"""
import glob
import os
import sys

import numpy as np
from PIL import Image

here = os.path.join(os.path.dirname(os.path.abspath(__file__)), "shots")
bad = 0
for f in sorted(glob.glob(os.path.join(here, "*.png"))):
    a = np.asarray(Image.open(f).convert("RGBA"))[..., 3]
    edges = {"top": a[:2].max(), "bottom": a[-2:].max(), "left": a[:, :2].max(), "right": a[:, -2:].max()}
    cut = [k for k, v in edges.items() if v > 150]
    if cut:
        bad += 1
        print(f"CUT {os.path.basename(f)}: {', '.join(cut)}")
print("all shots clear of the frame edge" if not bad else f"{bad} shot(s) are clipped")
sys.exit(1 if bad else 0)
