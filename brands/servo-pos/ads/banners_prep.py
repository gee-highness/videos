"""Stage 1 for ads/banners.js: put real Servo screens into the blank (lavender) device screens of the owner's clean photos.
The blank screen is found by colour, its corner quad is fitted, and the app screen is perspective-warped into it, softened and grained.
Output: ads/banners/base/<name>.png (photos with no lettering). Usage: python3 ads/banners_prep.py"""
import os, cv2, numpy as np
HERE = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(HERE, "photos", "originals"); OUT = os.path.join(HERE, "banners", "base")
RAW = os.path.join(HERE, "one-screen", "raw"); TRIM = os.path.join(HERE, "devices", "shots", "trim")
os.makedirs(OUT, exist_ok=True)

def screen_to_quad(im, quad, screen_path, aspect, glare=22, grow=1.0, clip=None, inset=None):
    """Perspective-map an app screenshot (cropped to `aspect` = width/height from the top) onto quad (TL, TR, BR, BL), keep fingers in front."""
    s = cv2.imread(screen_path, cv2.IMREAD_UNCHANGED)
    if s.shape[2] == 4:
        a = s[..., 3:] / 255.0; s = (s[..., :3] * a + 255 * (1 - a)).astype(np.uint8)
    if inset:  # drop the device bezel of a rendered device shot
        ih, iw = s.shape[:2]; s = s[int(ih * inset[1]):ih - int(ih * inset[1]), int(iw * inset[0]):iw - int(iw * inset[0])]
    h, w = s.shape[:2]
    cw = min(w, int(h * aspect)); ch = int(cw / aspect)
    s = s[0:ch, (w - cw) // 2:(w - cw) // 2 + cw]
    s = cv2.resize(s, (600, int(600 / aspect)), interpolation=cv2.INTER_AREA)
    src = np.float32([[0, 0], [s.shape[1], 0], [s.shape[1], s.shape[0]], [0, s.shape[0]]])
    q = np.float32(quad); c0 = q.mean(axis=0)
    dst = (c0 + (q - c0) * grow).astype(np.float32)
    M = cv2.getPerspectiveTransform(src, dst)
    H, W = im.shape[:2]
    warp = cv2.warpPerspective(s, M, (W, H), flags=cv2.INTER_AREA)
    mask = cv2.warpPerspective(np.full(s.shape[:2], 255, np.uint8), M, (W, H))
    mask = cv2.GaussianBlur(mask, (3, 3), 0).astype(np.float32) / 255
    # fingers / anything warm in the original stay in front of the screen
    o = im.astype(int)
    skin = ((o[..., 2] > o[..., 0] + 14) | (o[..., 2] > 150) & (o[..., 1] > 100) & (o[..., 0] < 120)).astype(np.uint8)  # BGR: R is index 2
    skin = cv2.GaussianBlur(cv2.morphologyEx(skin * 255, cv2.MORPH_OPEN, np.ones((3, 3), np.uint8)), (5, 5), 0).astype(np.float32) / 255
    if clip is not None:  # keep the content inside the real screen outline (the photo's screen edge is not a perfect quad)
        cm = np.zeros((H, W), np.uint8); cv2.fillPoly(cm, [np.int32(clip)], 255)
        mask = mask * (cv2.GaussianBlur(cv2.dilate(cm, np.ones((5, 5), np.uint8)), (3, 3), 0).astype(np.float32) / 255)
    mask = mask * (1 - skin)
    w2 = cv2.GaussianBlur(warp, (3, 3), 0.6).astype(np.float32) * 0.95 + 8
    yy, xx = np.mgrid[0:H, 0:W]
    x, y, bw, bh = cv2.boundingRect(dst.astype(np.int32))
    w2 += (np.clip(1 - (((xx - x) / bw) * .8 + ((yy - y) / bh) * .7), 0, 1) * glare)[..., None] - 4
    w2 += np.random.default_rng(5).normal(0, 2.6, w2.shape)
    a = mask[..., None]
    return (w2 * a + im * (1 - a)).clip(0, 255).astype(np.uint8)


JOBS = [
    ("19-counter-customer-phone.png", [[621, 556], [710, 559], [637, 740], [544, 734]], os.path.join(RAW, "guest-menu.png"), 0.49),
    ("21-waiter-tablet-floor.png", [[812, 553], [952, 571], [806, 779], [704, 742]], os.path.join(TRIM, "waiter_server_phone_front.png"), 0.64, 1.0, [[949, 575], [803, 775], [749, 761], [761, 647], [828, 560]]),
]
if __name__ == "__main__":
    for name, quad, shot, asp, *g in [(*j, 1.0, None) if len(j) == 4 else j for j in JOBS]:
        im = cv2.imread(os.path.join(SRC, name))
        cv2.imwrite(os.path.join(OUT, name), screen_to_quad(im, quad, shot, asp, grow=g[0], clip=g[1], inset=(0.075, 0.095) if 'waiter' in shot else None)); print("done", name)
