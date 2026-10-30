"""Encodes the rendered ornament PNGs to WebP (full + half size) in src/assets/ornaments/."""
import json, os, glob
from PIL import Image

HERE = os.path.dirname(__file__)
DST = os.path.join(HERE, "..", "..", "src", "assets", "ornaments")
os.makedirs(DST, exist_ok=True)
meta = {}
for png in sorted(glob.glob(os.path.join(HERE, "out", "*.png"))):
    name = os.path.basename(png)[:-4]
    im = Image.open(png).convert("RGBA")
    im = im.crop(im.getbbox()) if name.startswith("bauble") else im
    im.save(os.path.join(DST, f"{name}.webp"), "WEBP", quality=82, method=6)
    if im.width >= 800:
        im.resize((im.width // 2, im.height // 2), Image.LANCZOS).save(os.path.join(DST, f"{name}-half.webp"), "WEBP", quality=82, method=6)
    j = json.load(open(os.path.join(HERE, "out", name + ".json")))
    meta[name] = {"w": im.width, "h": im.height, "lights": j["lights"]}
json.dump(meta, open(os.path.join(DST, "ornaments.json"), "w"), separators=(",", ":"))
for f in sorted(os.listdir(DST)):
    print(f, os.path.getsize(os.path.join(DST, f)) // 1024, "KB")
