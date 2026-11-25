#!/usr/bin/env python3
"""Wikimedia Commons: search and download free-licence pictures and videos with the licence and credit.
   python3 essay/tools/commons.py search "Katherine Ryan"            -> title | size | licence | author   (add --video for videos)
   python3 essay/tools/commons.py get "Katherine Ryan, Scoundrels, 2012(cropped).jpg" out.jpg [--width 1280]
   python3 essay/tools/commons.py credit "File title.jpg"            -> one line for image-credits.md and the on-screen credit
Rules learned the hard way (see docs/MEDIA_SOURCES.md): Commons answers 429 when you go fast. Always send a User-Agent,
wait 5 s or more between calls, use the standard thumbnail widths (320, 500, 960, 1280, 1920, 3840), and back off 45 s on a 429."""
import json, re, sys, time, urllib.parse, urllib.request
UA = {"User-Agent": "videos-project/1.0 (editorial video research; contact via GitHub repo gee-highness/videos)"}
API = "https://commons.wikimedia.org/w/api.php"
def call(url, tries=6, binary=False):
    for t in range(tries):
        try:
            r = urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=90).read()
            return r if binary else json.loads(r)
        except Exception as e:
            wait = 45 if "429" in str(e) else 8
            print(f"  retry {t + 1}: {str(e)[:60]} (waiting {wait}s)", file=sys.stderr); time.sleep(wait)
    raise SystemExit("gave up")
def strip(v): return re.sub(r"<[^>]+>", "", v or "").replace("&amp;", "&").strip()
def info(title):
    q = f"{API}?action=query&format=json&prop=imageinfo&iiprop=url|extmetadata|size|mime&titles={urllib.parse.quote('File:' + title.removeprefix('File:'))}"
    p = list(call(q)["query"]["pages"].values())[0]
    if "imageinfo" not in p: raise SystemExit("not found: " + title)
    i = p["imageinfo"][0]; m = i["extmetadata"]
    return dict(title=p["title"], url=i["url"], w=i["width"], h=i["height"], mime=i["mime"], lic=strip(m.get("LicenseShortName", {}).get("value")),
                author=strip(m.get("Artist", {}).get("value")), page="https://commons.wikimedia.org/wiki/" + p["title"].replace(" ", "_"))
def search(term, video=False, n=10):
    t = ("filetype:video " if video else "filetype:bitmap ") + term
    q = f"{API}?action=query&format=json&generator=search&gsrnamespace=6&gsrlimit={n}&gsrsearch={urllib.parse.quote(t)}&prop=imageinfo&iiprop=url|extmetadata|size"
    for p in sorted(call(q).get("query", {}).get("pages", {}).values(), key=lambda x: x.get("index", 0)):
        i = p["imageinfo"][0]; m = i["extmetadata"]
        print(f'{p["title"][5:]} | {i["width"]}x{i["height"]} | {strip(m.get("LicenseShortName", {}).get("value"))} | {strip(m.get("Artist", {}).get("value"))[:40]}')
def get(title, out, width=1280):
    d = info(title); time.sleep(5)
    url = d["url"] if d["w"] <= width or not d["mime"].startswith("image/") else "https://commons.wikimedia.org/wiki/Special:FilePath/" + urllib.parse.quote(title.removeprefix("File:")) + f"?width={width}"
    open(out, "wb").write(call(url, binary=True)); print(out, d["lic"], d["author"], d["page"])
def credit(title):
    d = info(title); print(f'{d["author"]}, {d["lic"]}, via Wikimedia Commons | {d["page"]}')
if __name__ == "__main__":
    a = sys.argv[1:]
    if not a: print(__doc__); sys.exit(1)
    w = int(a[a.index("--width") + 1]) if "--width" in a else 1280
    if a[0] == "search": search(a[1], "--video" in a)
    elif a[0] == "get": get(a[1], a[2], w)
    elif a[0] == "credit": credit(a[1])
