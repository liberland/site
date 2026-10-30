"""
Builds the medallion portraits in public/images/faces/ from their documented sources.

    python3 scripts/portraits/build.py

Downloads any missing source image once (raw files are kept next to this script,
git-ignored), crops a square around the face, applies the same gentle warm grade
to every portrait, and writes 560×560 WebP files. The source, author and licence
of each image are recorded in ASSETS.md and shown in the page credits.
"""
import os, sys, urllib.request
from PIL import Image, ImageEnhance

HERE = os.path.dirname(os.path.abspath(__file__))
DST = os.path.join(HERE, "..", "..", "public", "images", "faces")
UA = "LiberlandGalaSite/1.0 (https://liberlandlimited.com/christmas/)"

# box = (left, top, size) in source pixels — a square around the head and shoulders
PORTRAITS = {
    "vit-jedlicka": {
        "raw": "vit-jedlicka.raw.jpg",
        "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/Vit_Jedlicka_by_Gage_Skidmore.jpg/960px-Vit_Jedlicka_by_Gage_Skidmore.jpg",
        "box": (110, 30, 740),
    },
    "balazs-magyar": {
        "raw": "congress-2026.raw.jpg",
        "url": "https://cdn.liberland.org/files/raw/19a9d2728f32df479c61419c06169f82548ba3aa/17907051933440.8125678538108698-congress-all-2026.9..jpg",
        "box": (892, 1586, 368),
    },
    "jan-schluter": {
        "raw": "congress-2026.raw.jpg",
        "url": "https://cdn.liberland.org/files/raw/19a9d2728f32df479c61419c06169f82548ba3aa/17907051933440.8125678538108698-congress-all-2026.9..jpg",
        "box": (2034, 1582, 368),
    },
    "roger-ver": {
        "raw": "roger-ver.raw.jpg",
        "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/Roger_Ver.jpg/960px-Roger_Ver.jpg",
        "box": (270, 20, 450),
    },
}


def fetch(p):
    path = os.path.join(HERE, p["raw"])
    if not os.path.exists(path):
        req = urllib.request.Request(p["url"], headers={"User-Agent": UA})
        with urllib.request.urlopen(req, timeout=60) as r, open(path, "wb") as f:
            f.write(r.read())
    return path


def grade(im):
    im = ImageEnhance.Color(im).enhance(0.92)
    im = ImageEnhance.Contrast(im).enhance(1.04)
    r, g, b = im.split()
    r = r.point(lambda v: min(255, int(v * 1.035 + 3)))
    b = b.point(lambda v: int(v * 0.95))
    return Image.merge("RGB", (r, g, b))


os.makedirs(DST, exist_ok=True)
for slug, p in PORTRAITS.items():
    try:
        im = Image.open(fetch(p)).convert("RGB")
    except Exception as e:  # network or rate limit: leave the placeholder in place
        print(f"skip {slug}: {e}", file=sys.stderr)
        continue
    if p["box"] == "auto-top":
        s = min(im.width, im.height)
        x, y = (im.width - s) // 2, int(im.height * 0.04)
        box = (x, y, x + s, y + s)
    else:
        x, y, s = p["box"]
        box = (x, y, x + s, y + s)
    out = grade(im.crop(box).resize((560, 560), Image.LANCZOS))
    out.save(os.path.join(DST, f"{slug}.webp"), "WEBP", quality=84, method=6)
    print("wrote", slug)
