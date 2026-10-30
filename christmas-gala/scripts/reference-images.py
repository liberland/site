"""
Downloads Le Palais Art Hotel photographs for LOCAL design reference only.

    python3 scripts/reference-images.py      # → public/_reference/*.webp (git-ignored)
    npm run dev:reference                    # page shows them, each tagged "not cleared"

These images are © Le Palais Art Hotel Prague. They are never committed and
never part of a production build (scripts/prerender.mjs deletes dist/_reference
unless VITE_REFERENCE_IMAGES=1). Once the hotel grants written permission, put
the approved files in public/images/venue/<id>.webp (+ <id>-800.webp) and set
`cleared: true` for that photo in src/data/event.ts.
"""
import io, os, urllib.request
from PIL import Image

B = "https://www.lepalaishotel.eu/wp-content/uploads/sites/218"
PHOTOS = {  # id → source on lepalaishotel.eu (ids match src/data/event.ts)
    "facade-dusk": "2025/02/le_palais_art_gallery_hotel_03.jpg",
    "entrance-canopy": "2025/02/le_palais_art_gallery_hotel_05.jpg",
    "entrance": "2025/02/le_palais_art_gallery_hotel_04.jpg",
    "christmas-lobby": "2026/10/LePalais-Vanocni-foceni-11.jpg",
    "golden-lobby": "2025/02/le_palais_slide_01.jpg",
    "marold-salon": "2025/02/le_palais_art_gallery_01.jpg",
    "corridor": "2025/02/le_palais_slide_06.jpg",
    "library": "2025/02/le_palais_slide_03.jpg",
    "artista": "2025/02/le_palais_art_gallery_restaurant_artista_01.jpg",
    "reception": "2025/02/le_palais_art_gallery_reception_01.jpg",
    "staircase": "2025/02/le_palais_art_gallery_hotel_02.jpg",
}
DST = os.path.join(os.path.dirname(__file__), "..", "public", "_reference")
os.makedirs(DST, exist_ok=True)
for pid, path in PHOTOS.items():
    req = urllib.request.Request(f"{B}/{path}", headers={"User-Agent": "LiberlandGalaSite/1.0 (design reference)"})
    with urllib.request.urlopen(req, timeout=60) as r:
        im = Image.open(io.BytesIO(r.read())).convert("RGB")
    for w, suffix in ((min(im.width, 2000), ""), (800, "-800")):
        out = im if im.width <= w else im.resize((w, round(im.height * w / im.width)), Image.LANCZOS)
        out.save(os.path.join(DST, f"{pid}{suffix}.webp"), "WEBP", quality=80, method=6)
    print(pid, im.size)
