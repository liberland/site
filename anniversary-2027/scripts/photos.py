"""
Builds every photograph used by the page from its documented source.

    python3 scripts/photos.py                     # all photos → public/_reference/   (local design review, git-ignored)
    python3 scripts/photos.py --publish NAME ...  # named photos → public/images/     (published; ONLY with written permission)
    python3 scripts/photos.py --publish --cleared # every photo whose `cleared` is true in src/data/anniversary.ts

Then set `cleared: true` for the photo in src/data/anniversary.ts and rebuild.

Raw downloads are cached in scripts/.cache/ (git-ignored). Each photograph is resized (never
upscaled beyond the source unless the slot needs it), optionally cropped, and written as WebP at the
widths listed here — the same widths as in anniversary.ts. No filters, grading or retouching: the
design brief asks for natural light. Sources, owners and rights are recorded in ASSETS.md.
"""
import argparse
import os
import re
import sys
import time
import urllib.request

from PIL import Image

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
CACHE = os.path.join(HERE, ".cache")
UA = "LiberlandAnniversarySite/1.0 (https://anniversary.ll.land/; anniversary@liberland.org)"
ARK = "https://ark.ll.land/api/images/"

# name → source. crop = (left, top, width, height) in source pixels, applied before resizing.
PHOTOS = {
    # --- Ark Village (© Ark Village, ark.ll.land gallery) — NOT cleared ---
    "ark-pier-reflection":    {"url": ARK + "abba1a49-6255-46bd-b4a5-aec6e1feabd7", "widths": [800, 1400, 2048]},  # IMG-01 hero
    "ark-flag-beach":         {"url": ARK + "649e5d97-0598-4d39-a576-05dc75243f49", "widths": [800, 1600]},        # IMG-02
    "ark-tables-under-trees": {"url": ARK + "d2928a34-89e3-461c-a399-fc2220a73b7c", "widths": [800, 1400, 2000]},  # IMG-04
    "ark-canoe":              {"url": ARK + "d654840e-1a90-4b73-af71-0796622accb2", "widths": [800, 1400, 2000]},  # IMG-05
    "ark-a-frames":           {"url": ARK + "e2d15220-e0ae-4b22-b6ee-e25d5061302c", "widths": [800, 1400, 2000]},  # IMG-06
    "ark-lodge-dusk":         {"url": ARK + "d434dd57-8bcb-4812-918c-1b7df3d7b5a1", "widths": [800, 1400, 2048]},  # IMG-07
    "ark-beach":              {"url": ARK + "c87f3878-1708-4c2d-be66-3b0ae5e7cd51", "widths": [800, 1600]},        # IMG-08
    "ark-fire-circle":        {"url": ARK + "f9970078-b8e8-4950-a2af-5c8388c11899", "widths": [800, 1400, 2000]},  # IMG-09
    "ark-paddleboard":        {"url": ARK + "4dcddb24-d31d-4074-afe9-1b7fb98aa95e", "widths": [800, 1366]},        # IMG-10
    # --- Portraits, 4:5 ---
    # Wikimedia Commons, Gage Skidmore, CC BY-SA 3.0 — cleared (attribution in the footer).
    "vit-jedlicka": {
        "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/Vit_Jedlicka_by_Gage_Skidmore.jpg/960px-Vit_Jedlicka_by_Gage_Skidmore.jpg",
        "crop": (77, 20, 800, 1000), "widths": [400, 800],
    },
    # Official "8th Liberland Congress elected" graphic (Office of the President, 27 Sept 2026) — NOT cleared,
    # and only ~280 px wide: reference only. Ask for proper portraits (see ASSETS.md).
    "balazs-magyar": {
        "url": "https://cdn.liberland.org/files/raw/19a9d2728f32df479c61419c06169f82548ba3aa/17907051933440.8125678538108698-congress-all-2026.9..jpg",
        "crop": (936, 1601, 280, 350), "widths": [400, 800],
    },
    "jan-schluter": {
        "url": "https://cdn.liberland.org/files/raw/19a9d2728f32df479c61419c06169f82548ba3aa/17907051933440.8125678538108698-congress-all-2026.9..jpg",
        "crop": (2078, 1597, 280, 350), "widths": [400, 800],
    },
}


def fetch(url):
    os.makedirs(CACHE, exist_ok=True)
    path = os.path.join(CACHE, re.sub(r"[^A-Za-z0-9._-]", "_", url)[-120:])
    if not os.path.exists(path):
        for attempt in range(5):
            try:
                req = urllib.request.Request(url, headers={"User-Agent": UA})
                with urllib.request.urlopen(req, timeout=60) as r, open(path + ".part", "wb") as f:
                    f.write(r.read())
                os.replace(path + ".part", path)
                break
            except Exception as e:  # rate limits (Wikimedia answers 429) — back off and retry
                if attempt == 4:
                    raise
                print(f"  retry {url[:60]}…: {e}", file=sys.stderr)
                time.sleep(2 ** (attempt + 1))
    return path


def build(name, out_dir):
    p = PHOTOS[name]
    im = Image.open(fetch(p["url"])).convert("RGB")
    if "crop" in p:
        x, y, w, h = p["crop"]
        im = im.crop((x, y, x + w, y + h))
    os.makedirs(out_dir, exist_ok=True)
    for w in p["widths"]:
        h = round(im.height * w / im.width)
        out = im.resize((w, h), Image.LANCZOS)
        out.save(os.path.join(out_dir, f"{name}-{w}.webp"), "WEBP", quality=80, method=6)
    print(f"wrote {os.path.relpath(out_dir, ROOT)}/{name}-{{{','.join(map(str, p['widths']))}}}.webp  (source {im.width}×{im.height})")


def cleared_in_config():
    """Names whose photo entry says `cleared: true` in src/data/anniversary.ts (simple text scan)."""
    src = open(os.path.join(ROOT, "src", "data", "anniversary.ts"), encoding="utf-8").read()
    names = []
    for m in re.finditer(r"file:\s*'([^']+)'[^}]*?cleared:\s*true", src, re.S):
        names.append(m.group(1))
    return names


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("names", nargs="*", help="photo names (default: all)")
    ap.add_argument("--publish", action="store_true", help="write to public/images/ (published) instead of public/_reference/")
    ap.add_argument("--cleared", action="store_true", help="with --publish: every photo marked cleared in anniversary.ts")
    a = ap.parse_args()
    names = a.names or (cleared_in_config() if a.cleared else list(PHOTOS))
    unknown = [n for n in names if n not in PHOTOS]
    if unknown:
        sys.exit(f"unknown photo name(s): {', '.join(unknown)}. Known: {', '.join(PHOTOS)}")
    if a.publish and not a.names and not a.cleared:
        sys.exit("--publish needs explicit names or --cleared: only publish photographs with written permission.")
    out = os.path.join(ROOT, "public", "images" if a.publish else "_reference")
    for n in names:
        build(n, out)


if __name__ == "__main__":
    main()
