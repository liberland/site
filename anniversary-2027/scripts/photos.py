"""
Builds every photograph used by the page from its documented source.

    python3 scripts/photos.py --publish --cleared # every photo marked `cleared: true` in src/data/anniversary.ts → public/images/
    python3 scripts/photos.py --publish NAME ...  # named photos → public/images/ (published)
    python3 scripts/photos.py NAME ...            # → public/_reference/ (local review only, git-ignored)

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
DOCS = "https://raw.githubusercontent.com/liberland/docs/master/media/"
FORUM = "https://liberland-forum-uploads.s3.dualstack.eu-central-1.amazonaws.com/original/1X/"
# Sources that cannot be downloaded anonymously: put the original in scripts/.cache/<name> first.
LOCAL = "local:"

# name → source. crop = (left, top, width, height) in source pixels, applied before resizing.
PHOTOS = {
    # --- 11th anniversary, April 2026 (Liberland forum report on the Order of Merit ceremony) ---
    "a26-group":     {"url": FORUM + "a664c7743311d06a3c20b376ae6129015573d642.jpeg", "widths": [600, 900]},
    "a26-honoured":  {"url": FORUM + "4c246496562745a25dc3143da8e354028099d0f0.jpeg", "widths": [600, 900]},
    "a26-awards":    {"url": FORUM + "af091dad5c8ac00fa0855b6191fe7f605c3600cc.jpeg", "widths": [400, 600]},
    "a26-formal":    {"url": FORUM + "dba98d36ba9248f3e1fe714fc0cd9ad24125dac3.jpeg", "widths": [400]},
    "a26-federico":  {"url": FORUM + "2921ba70e234ad066fcdb946e541b62c147931f4.jpeg", "widths": [600, 900]},
    "a26-recipient": {"url": FORUM + "18601085627985a864d2c8e07addf695ea482d57.jpeg", "widths": [400, 600]},
    "a26-speaker":   {"url": FORUM + "45bea2c5fa8f4ef42d4953a3cab403f2a053dec3.jpeg", "widths": [400]},
    # --- Liberland press kit (github.com/liberland/docs/media), Ark Village ---
    "ark-conference": {"url": DOCS + "IMG_4008.jpeg", "widths": [800, 1400, 2000]},
    "ark-dinner":     {"url": DOCS + "IMG_3938.jpeg", "widths": [800, 1400, 2000]},
    "ark-lounge":     {"url": DOCS + "IMG_3897.jpeg", "widths": [800, 1400, 2000]},
    "ark-lawn":       {"url": DOCS + "IMG_3902.jpeg", "widths": [800, 1400, 2000]},
    # --- Ark Village's own website (ark.ll.land) ---
    "danube-boat":     {"url": "https://ark.ll.land/hero-poster.webp", "widths": [800, 1280]},
    "ark-lodge-dusk":  {"url": ARK + "d434dd57-8bcb-4812-918c-1b7df3d7b5a1", "widths": [800, 1400, 2048]},
    "ark-a-frames":    {"url": ARK + "e2d15220-e0ae-4b22-b6ee-e25d5061302c", "widths": [800, 1400, 2000]},
    "ark-flag-beach":  {"url": ARK + "649e5d97-0598-4d39-a576-05dc75243f49", "widths": [800, 1600]},
    # --- Project Google Drive, file "ark.jpg" (id 17SV5VN86VKr123abTeIKtYwO1TnwLXDY) ---
    "ark-boardwalk":   {"url": LOCAL + "drive-ark.jpg", "widths": [800, 1600]},
    # --- Portraits (round crops) ---
    "vit-jedlicka":  {"url": DOCS + "vit-jedlicka.png", "crop": (162, 30, 560, 560), "widths": [200, 400]},
    # Official "6th Liberland Congress elected" graphic (30 March 2026), x.com/Liberland_org/status/2038994526539317653
    "balazs-magyar": {"url": "https://pbs.twimg.com/media/HEv2KxdasAADi39.jpg?name=orig", "crop": (1857, 1444, 386, 386), "widths": [200, 400]},
    # Official "8th Liberland Congress elected" graphic, liberland.org/news/801-official-announcement-congressional-election-results
    "jan-schluter":  {"url": "https://cdn.liberland.org/files/raw/19a9d2728f32df479c61419c06169f82548ba3aa/17907051933440.8125678538108698-congress-all-2026.9..jpg",
                      "crop": (2014, 1565, 412, 412), "widths": [200, 400]},
}


def fetch(url):
    os.makedirs(CACHE, exist_ok=True)
    if url.startswith(LOCAL):
        path = os.path.join(CACHE, url[len(LOCAL):])
        if not os.path.exists(path):
            raise SystemExit(f"{url}: place the original file at {os.path.relpath(path, ROOT)} (see ASSETS.md)")
        return path
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
