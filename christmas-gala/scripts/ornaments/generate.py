"""
Procedural Christmas ornamentation for the gala page.

Draws fir garlands needle by needle, glass baubles, warm lights, holly and a
velvet bow as SVG. `render.mjs` turns the SVGs into transparent PNGs and
`encode.py` into the WebP files in src/assets/ornaments/. Original work —
no third-party imagery — so it can be published freely.

    python3 scripts/ornaments/generate.py          # → scripts/ornaments/out/*.svg (+ lights.json)
    node scripts/ornaments/render.mjs               # → out/*.png   (needs Playwright + Chromium)
    python3 scripts/ornaments/encode.py             # → src/assets/ornaments/*.webp

Deterministic: the same seed always produces the same artwork.
"""
import json
import math
import os
import random

OUT = os.path.join(os.path.dirname(__file__), "out")
os.makedirs(OUT, exist_ok=True)

# needle palettes, back → front
GREENS_BACK = ["#0b2117", "#0e281b", "#113020", "#123422"]
GREENS_MID = ["#143a26", "#18422b", "#1b472f", "#1f4e37", "#183f2c", "#1d4a3a"]
GREENS_FRONT = ["#1f4f35", "#245a3c", "#2a6343", "#316c49", "#3a7650", "#21533a"]
TIP = ["#4f8a58", "#5c9663", "#47805a"]


def fmt(v):
    return f"{v:.1f}"


class Canvas:
    def __init__(self, w, h, seed):
        self.w, self.h = w, h
        self.rng = random.Random(seed)
        self.layers = {"shadow": [], "back": [], "mid": [], "front": [], "lights": [], "deco": [], "top": []}
        self.lights = []

    # ------------------------------------------------------------------ fir
    def twig(self, x, y, ang, length, scale, layer):
        r = self.rng
        pal = {"back": GREENS_BACK, "mid": GREENS_MID, "front": GREENS_FRONT}[layer]
        bend = r.uniform(-0.25, 0.25)
        pts = []
        steps = max(7, int(length / 3.2))
        a = ang
        px, py = x, y
        for i in range(steps + 1):
            pts.append((px, py, a))
            a += bend / steps
            px += math.cos(a) * length / steps
            py += math.sin(a) * length / steps
        out = self.layers[layer]
        stem = " ".join(("M" if i == 0 else "L") + f"{fmt(p[0])} {fmt(p[1])}" for i, p in enumerate(pts))
        out.append(f'<path d="{stem}" stroke="#2b2a1a" stroke-width="{fmt(1.3*scale)}" fill="none" stroke-linecap="round"/>')
        for i, (sx, sy, sa) in enumerate(pts[1:], 1):
            t = i / steps
            for side in (-1, 1):
                na = sa + side * math.radians(r.uniform(48, 68))
                nl = r.uniform(12, 19) * scale * (1.05 - 0.4 * t)
                ex, ey = sx + math.cos(na) * nl, sy + math.sin(na) * nl
                cx = sx + math.cos(na + side * 0.18) * nl * 0.55
                cy = sy + math.sin(na + side * 0.18) * nl * 0.55
                col = r.choice(pal)
                if layer == "front" and t > 0.75 and r.random() < 0.3:
                    col = r.choice(TIP)
                out.append(
                    f'<path d="M{fmt(sx)} {fmt(sy)}Q{fmt(cx)} {fmt(cy)} {fmt(ex)} {fmt(ey)}" stroke="{col}" '
                    f'stroke-width="{fmt(r.uniform(1.7, 2.5)*scale)}" fill="none" stroke-linecap="round"/>'
                )
        # a tuft at the tip
        tx, ty, ta = pts[-1]
        for k in range(3):
            na = ta + math.radians(r.uniform(-25, 25))
            nl = r.uniform(6, 10) * scale
            out.append(
                f'<path d="M{fmt(tx)} {fmt(ty)}L{fmt(tx+math.cos(na)*nl)} {fmt(ty+math.sin(na)*nl)}" '
                f'stroke="{r.choice(pal)}" stroke-width="{fmt(1.6*scale)}" stroke-linecap="round"/>'
            )

    def sprig(self, x, y, ang, length, scale, layer):
        """A branch with two side twigs — the unit garlands are built from."""
        r = self.rng
        self.twig(x, y, ang, length, scale, layer)
        for side in (-1, 1):
            if r.random() < 0.85:
                f = r.uniform(0.25, 0.55)
                bx, by = x + math.cos(ang) * length * f, y + math.sin(ang) * length * f
                self.twig(bx, by, ang + side * math.radians(r.uniform(30, 50)), length * r.uniform(0.45, 0.7), scale * 0.9, layer)

    def garland_along(self, path_pts, thickness, scale=1.0, density=1.0):
        """Lay sprigs along a polyline so it reads as a thick, lush rope of fir."""
        r = self.rng
        segs = []
        total = 0
        for (x1, y1), (x2, y2) in zip(path_pts, path_pts[1:]):
            d = math.hypot(x2 - x1, y2 - y1)
            segs.append((x1, y1, x2, y2, d, total))
            total += d

        def at(s):
            for x1, y1, x2, y2, d, s0 in segs:
                if s <= s0 + d or (x2, y2) == path_pts[-1]:
                    t = 0 if d == 0 else (s - s0) / d
                    return x1 + (x2 - x1) * t, y1 + (y2 - y1) * t, math.atan2(y2 - y1, x2 - x1)
            x1, y1, x2, y2, d, s0 = segs[-1]
            return x2, y2, math.atan2(y2 - y1, x2 - x1)

        for layer, step, off, ln in (("back", 10, 0.6, 64), ("mid", 8, 0.5, 58), ("front", 9, 0.38, 50)):
            s = r.uniform(0, step)
            while s < total:
                x, y, a = at(s)
                n = (-math.sin(a), math.cos(a))
                o = r.uniform(-off, off) * thickness
                direction = a + (math.pi if r.random() < 0.5 else 0) + r.uniform(-0.9, 0.9)
                self.sprig(x + n[0] * o, y + n[1] * o, direction, ln * r.uniform(0.75, 1.15) * scale, scale * r.uniform(0.9, 1.1), layer)
                s += step / density * r.uniform(0.7, 1.3)
        # shadow under the whole rope
        d = " ".join(("M" if i == 0 else "L") + f"{fmt(x)} {fmt(y+10)}" for i, (x, y) in enumerate(path_pts))
        self.layers["shadow"].append(
            f'<path d="{d}" stroke="#000" stroke-opacity=".55" stroke-width="{fmt(thickness*1.25)}" fill="none" stroke-linecap="round" filter="url(#soft)"/>'
        )
        return at, total

    # ------------------------------------------------------------- baubles
    def bauble(self, cx, cy, rad, kind, hang_from=None, layer="deco"):
        out = self.layers[layer]
        if hang_from:
            hx, hy = hang_from
            out.append(f'<path d="M{fmt(hx)} {fmt(hy)}L{fmt(cx)} {fmt(cy-rad*1.15)}" stroke="#c9a35a" stroke-width="1.3"/>')
        gid = {"burgundy": "gB", "gold": "gG", "ivory": "gI", "red": "gR", "green": "gE"}[kind]
        out.append(f'<ellipse cx="{fmt(cx+rad*0.12)}" cy="{fmt(cy+rad*0.25)}" rx="{fmt(rad*1.02)}" ry="{fmt(rad*0.98)}" fill="#000" opacity=".35" filter="url(#soft)"/>')
        out.append(f'<circle cx="{fmt(cx)}" cy="{fmt(cy)}" r="{fmt(rad)}" fill="url(#{gid})"/>')
        # fine engraved band on some baubles
        if self.rng.random() < 0.45:
            out.append(
                f'<ellipse cx="{fmt(cx)}" cy="{fmt(cy+rad*0.05)}" rx="{fmt(rad*0.98)}" ry="{fmt(rad*0.28)}" fill="none" stroke="#f3dc9c" stroke-opacity=".55" stroke-width="{fmt(max(1,rad*0.05))}"/>'
            )
        out.append(f'<circle cx="{fmt(cx)}" cy="{fmt(cy)}" r="{fmt(rad)}" fill="url(#rim)"/>')
        out.append(f'<ellipse cx="{fmt(cx-rad*0.38)}" cy="{fmt(cy-rad*0.42)}" rx="{fmt(rad*0.26)}" ry="{fmt(rad*0.16)}" fill="#fff" opacity=".75" transform="rotate(-35 {fmt(cx-rad*0.38)} {fmt(cy-rad*0.42)})" filter="url(#tiny)"/>')
        out.append(f'<path d="M{fmt(cx+rad*0.55)} {fmt(cy+rad*0.35)}A{fmt(rad*0.75)} {fmt(rad*0.75)} 0 0 1 {fmt(cx+rad*0.05)} {fmt(cy+rad*0.82)}" stroke="#fff" stroke-opacity=".22" stroke-width="{fmt(rad*0.07)}" fill="none" stroke-linecap="round"/>')
        cw, ch = rad * 0.5, rad * 0.32
        out.append(f'<rect x="{fmt(cx-cw/2)}" y="{fmt(cy-rad-ch*0.75)}" width="{fmt(cw)}" height="{fmt(ch)}" rx="{fmt(ch*0.25)}" fill="url(#cap)"/>')
        out.append(f'<path d="M{fmt(cx-cw*0.35)} {fmt(cy-rad-ch*0.75)}a{fmt(cw*0.35)} {fmt(ch*0.9)} 0 0 1 {fmt(cw*0.7)} 0" fill="none" stroke="#b8924f" stroke-width="{fmt(max(1,rad*0.06))}"/>')

    # -------------------------------------------------------------- lights
    def light(self, x, y, size=1.0):
        out = self.layers["lights"]
        out.append(f'<circle cx="{fmt(x)}" cy="{fmt(y)}" r="{fmt(22*size)}" fill="url(#glow)"/>')
        out.append(f'<circle cx="{fmt(x)}" cy="{fmt(y)}" r="{fmt(3.4*size)}" fill="#fff8e0"/>')
        self.lights.append((x / self.w, y / self.h, size))

    # --------------------------------------------------------------- holly
    def holly_leaf(self, x, y, ang, length, layer="deco"):
        r = self.rng
        w = length * 0.36
        spikes = 4
        pts = []
        for side in (1, -1):
            rng_pts = []
            for k in range(spikes + 1):
                t = k / spikes
                along = t * length
                half = w * math.sin(math.pi * min(1, t * 1.05)) * (0.9 if k % 2 else 1.0)
                rng_pts.append((along, side * half))
            pts.append(rng_pts)
        right, left = pts
        d = f"M0 0"
        for (a1, h1), (a2, h2) in zip(right, right[1:]):
            mx, my = (a1 + a2) / 2, (h1 + h2) / 2 * 0.62
            d += f" Q{fmt(mx)} {fmt(my)} {fmt(a2)} {fmt(h2 if a2 < length else 0)}"
        for (a1, h1), (a2, h2) in zip(list(reversed(left))[:-1], list(reversed(left))[1:]):
            mx, my = (a1 + a2) / 2, (h1 + h2) / 2 * 0.62
            d += f" Q{fmt(mx)} {fmt(my)} {fmt(a2)} {fmt(h2)}"
        d += " Z"
        deg = math.degrees(ang)
        g = f'transform="translate({fmt(x)} {fmt(y)}) rotate({fmt(deg)})"'
        out = self.layers[layer]
        out.append(f'<path d="{d}" fill="#000" opacity=".35" {g} filter="url(#soft)"/>')
        out.append(f'<path d="{d}" fill="url(#leaf)" stroke="#0a2015" stroke-width="1.2" {g}/>')
        out.append(f'<path d="{d}" fill="url(#leafsheen)" {g}/>')
        out.append(f'<path d="M2 0 Q{fmt(length*0.5)} {fmt(r.uniform(-3,3))} {fmt(length*0.95)} 0" stroke="#7fa877" stroke-opacity=".55" stroke-width="1.4" fill="none" {g}/>')

    def berry(self, x, y, rad):
        out = self.layers["deco"]
        out.append(f'<circle cx="{fmt(x+1.5)}" cy="{fmt(y+2.5)}" r="{fmt(rad)}" fill="#000" opacity=".4" filter="url(#tiny)"/>')
        out.append(f'<circle cx="{fmt(x)}" cy="{fmt(y)}" r="{fmt(rad)}" fill="url(#berry)"/>')
        out.append(f'<circle cx="{fmt(x-rad*0.35)}" cy="{fmt(y-rad*0.38)}" r="{fmt(rad*0.22)}" fill="#fff" opacity=".8"/>')
        out.append(f'<circle cx="{fmt(x+rad*0.3)}" cy="{fmt(y+rad*0.35)}" r="{fmt(rad*0.12)}" fill="#2a0a0e" opacity=".7"/>')

    def holly(self, x, y, ang, size):
        r = self.rng
        for k, da in enumerate((-0.75, 0.1, 0.85)):
            self.holly_leaf(x, y, ang + da + r.uniform(-0.1, 0.1), size * r.uniform(0.85, 1.05))
        for k in range(r.randint(3, 5)):
            a = r.uniform(0, 2 * math.pi)
            d = r.uniform(0, size * 0.12)
            self.berry(x + math.cos(a) * d, y + math.sin(a) * d, size * r.uniform(0.085, 0.11))

    # ---------------------------------------------------------------- bow
    def bow(self, x, y, s):
        o = self.layers["top"]
        g = f'transform="translate({fmt(x)} {fmt(y)}) scale({fmt(s)})"'
        o.append(f'<g {g}>'
                 '<g filter="url(#soft)" opacity=".45" transform="translate(4 8)">'
                 '<path d="M0 0C-40 -46 -96 -40 -92 -6C-88 24 -40 22 0 0Z"/><path d="M0 0C40 -46 96 -40 92 -6C88 24 40 22 0 0Z"/>'
                 '<path d="M-6 6L-46 92L-30 84L-20 100L8 10Z"/><path d="M6 6L46 92L30 84L20 100L-8 10Z"/></g>'
                 '<path d="M-6 6L-46 92L-30 84L-20 100L8 10Z" fill="url(#velvet2)"/>'
                 '<path d="M6 6L46 92L30 84L20 100L-8 10Z" fill="url(#velvet2)"/>'
                 '<path d="M0 0C-40 -46 -96 -40 -92 -6C-88 24 -40 22 0 0Z" fill="url(#velvet)"/>'
                 '<path d="M0 0C40 -46 96 -40 92 -6C88 24 40 22 0 0Z" fill="url(#velvet)"/>'
                 '<path d="M-6 -2C-34 -30 -74 -30 -76 -8" stroke="#a84a57" stroke-opacity=".5" stroke-width="3" fill="none"/>'
                 '<path d="M6 -2C34 -30 74 -30 76 -8" stroke="#a84a57" stroke-opacity=".5" stroke-width="3" fill="none"/>'
                 '<path d="M-2 2C-30 10 -58 12 -80 2" stroke="#3a0d14" stroke-opacity=".5" stroke-width="3" fill="none"/>'
                 '<path d="M2 2C30 10 58 12 80 2" stroke="#3a0d14" stroke-opacity=".5" stroke-width="3" fill="none"/>'
                 '<rect x="-15" y="-15" width="30" height="30" rx="9" fill="url(#velvet)"/>'
                 '<path d="M-15 -4H15M-15 4H15" stroke="#d8b36a" stroke-opacity=".7" stroke-width="1.5"/>'
                 '</g>')

    # --------------------------------------------------------------- output
    def svg(self):
        defs = """
<defs>
  <filter id="soft" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="7"/></filter>
  <filter id="tiny"><feGaussianBlur stdDeviation="1.4"/></filter>
  <radialGradient id="glow"><stop offset="0" stop-color="#ffe7a8" stop-opacity=".95"/><stop offset=".35" stop-color="#ffcf72" stop-opacity=".45"/><stop offset="1" stop-color="#ffb84a" stop-opacity="0"/></radialGradient>
  <radialGradient id="gB" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#c2505f"/><stop offset=".45" stop-color="#8a2a37"/><stop offset="1" stop-color="#3d0f17"/></radialGradient>
  <radialGradient id="gR" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#e2636a"/><stop offset=".45" stop-color="#a8202f"/><stop offset="1" stop-color="#4c0a12"/></radialGradient>
  <radialGradient id="gG" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#fff0c0"/><stop offset=".4" stop-color="#d8b36a"/><stop offset="1" stop-color="#6e4f1d"/></radialGradient>
  <radialGradient id="gI" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#ffffff"/><stop offset=".45" stop-color="#efe2c4"/><stop offset="1" stop-color="#9c8458"/></radialGradient>
  <radialGradient id="gE" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#5f9a74"/><stop offset=".45" stop-color="#1f4d38"/><stop offset="1" stop-color="#0a1f16"/></radialGradient>
  <radialGradient id="rim" cx=".5" cy=".5" r=".5"><stop offset=".72" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".35"/></radialGradient>
  <linearGradient id="cap" x1="0" x2="1"><stop offset="0" stop-color="#7a5a26"/><stop offset=".35" stop-color="#f6dd9c"/><stop offset=".6" stop-color="#c79b4f"/><stop offset="1" stop-color="#6b4d1f"/></linearGradient>
  <linearGradient id="leaf" x1="0" y1="-1" x2="0" y2="1"><stop offset="0" stop-color="#2f6a45"/><stop offset=".5" stop-color="#174a2e"/><stop offset="1" stop-color="#0c2b1b"/></linearGradient>
  <linearGradient id="leafsheen" x1="0" y1="-1" x2=".4" y2=".3"><stop offset="0" stop-color="#fff" stop-opacity=".28"/><stop offset=".5" stop-color="#fff" stop-opacity="0"/></linearGradient>
  <radialGradient id="berry" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#ff6b6b"/><stop offset=".5" stop-color="#c0172a"/><stop offset="1" stop-color="#520812"/></radialGradient>
  <linearGradient id="velvet" x1="0" y1="-1" x2="0" y2="1" gradientUnits="objectBoundingBox"><stop offset="0" stop-color="#a23a4a"/><stop offset=".5" stop-color="#762b36"/><stop offset="1" stop-color="#3f121a"/></linearGradient>
  <linearGradient id="velvet2" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#8a3040"/><stop offset="1" stop-color="#4a141e"/></linearGradient>
</defs>"""
        body = "".join(
            f'<g class="{k}">' + "".join(v) + "</g>" for k, v in self.layers.items()
        )
        return f'<svg xmlns="http://www.w3.org/2000/svg" width="{self.w}" height="{self.h}" viewBox="0 0 {self.w} {self.h}">{defs}{body}</svg>'


def catenary(x1, x2, y, sag, n=40):
    pts = []
    for i in range(n + 1):
        t = i / n
        pts.append((x1 + (x2 - x1) * t, y + sag * 4 * t * (1 - t)))
    return pts


def save(name, c, extra=None):
    with open(os.path.join(OUT, name + ".svg"), "w") as f:
        f.write(c.svg())
    meta = {"w": c.w, "h": c.h, "lights": [[round(x, 4), round(y, 4), s] for x, y, s in c.lights]}
    if extra:
        meta.update(extra)
    with open(os.path.join(OUT, name + ".json"), "w") as f:
        json.dump(meta, f)
    print(name, sum(len(v) for v in c.layers.values()), "elements")


# ------------------------------------------------------------------ swag
def make_swag():
    c = Canvas(2400, 560, seed=1218)
    r = c.rng
    anchors = [0, 800, 1600, 2400]
    top = 58
    kinds = ["burgundy", "gold", "ivory", "red", "gold", "burgundy"]
    for a, b in zip(anchors, anchors[1:]):
        pts = catenary(a - 30 if a == 0 else a, b + 30 if b == 2400 else b, top, 175)
        at, total = c.garland_along(pts, 84)
        for k in range(14):
            s = (k + r.uniform(0.2, 0.8)) / 14 * total
            x, y, _ = at(s)
            c.light(x + r.uniform(-22, 22), y + r.uniform(-22, 22), r.uniform(0.85, 1.2))
        # hanging baubles from the low part of each swag
        mid = (a + b) / 2
        for dx, drop, rad in ((-150, 60, 22), (-60, 130, 30), (40, 95, 26), (130, 55, 20)):
            x = mid + dx + r.uniform(-15, 15)
            y0 = top + 175 * 4 * ((x - a) / (b - a)) * (1 - (x - a) / (b - a)) + 18
            c.bauble(x, y0 + drop, rad, r.choice(kinds), hang_from=(x, y0))
        # nestled baubles
        for k in range(4):
            s = r.uniform(0.15, 0.85) * total
            x, y, _ = at(s)
            c.bauble(x + r.uniform(-10, 10), y + r.uniform(4, 20), r.uniform(13, 18), r.choice(kinds))
    for a in anchors[1:-1]:
        c.holly(a - 34, top + 22, math.radians(200), 70)
        c.holly(a + 34, top + 22, math.radians(-20), 70)
        c.bow(a, top + 10, 1.05)
    save("garland-swag", c)


# ------------------------------------------------------------------ rope
def make_rope():
    c = Canvas(2400, 230, seed=2026)
    r = c.rng
    pts = [(-40 + i * 61.5, 115 + math.sin(i * 0.55) * 9) for i in range(42)]
    at, total = c.garland_along(pts, 74, scale=0.95)
    for k in range(34):
        s = (k + r.uniform(0.2, 0.8)) / 34 * total
        x, y, _ = at(s)
        c.light(x + r.uniform(-20, 20), y + r.uniform(-24, 24), r.uniform(0.8, 1.15))
    kinds = ["burgundy", "gold", "ivory", "red"]
    for k in range(16):
        s = (k + r.uniform(0.15, 0.85)) / 16 * total
        x, y, _ = at(s)
        c.bauble(x, y + r.uniform(-8, 14), r.uniform(14, 21), r.choice(kinds))
    for xh in (380, 1200, 2020):
        c.holly(xh, 112, math.radians(r.uniform(-30, 30)), 62)
    save("garland-rope", c)


# ---------------------------------------------------------------- wreath
def make_wreath():
    c = Canvas(1100, 1100, seed=1912)
    r = c.rng
    cx = cy = 540
    R = 360
    pts = [(cx + math.cos(t) * R, cy + math.sin(t) * R) for t in [i / 72 * 2 * math.pi for i in range(73)]]
    at, total = c.garland_along(pts, 150, scale=1.15, density=1.2)
    for k in range(40):
        s = (k + r.uniform(0.2, 0.8)) / 40 * total
        x, y, _ = at(s)
        d = r.uniform(-55, 55)
        ang = math.atan2(y - cy, x - cx)
        c.light(x + math.cos(ang) * d, y + math.sin(ang) * d, r.uniform(0.9, 1.25))
    kinds = ["burgundy", "gold", "ivory", "red", "gold"]
    for k in range(22):
        t = (k + r.uniform(0.1, 0.9)) / 22 * 2 * math.pi
        d = R + r.uniform(-50, 50)
        c.bauble(cx + math.cos(t) * d, cy + math.sin(t) * d, r.uniform(17, 30), r.choice(kinds))
    for t in (0.15, 1.9, 3.3, 4.6):
        c.holly(cx + math.cos(t) * R, cy + math.sin(t) * R, t + math.pi / 2, 80)
    c.bow(cx, cy + R + 20, 1.45)
    save("wreath", c)


# ----------------------------------------------------------------- sprig
def make_corner():
    """Fir and holly spray for section corners (drawn for the top-left; mirror in CSS)."""
    c = Canvas(900, 640, seed=77)
    r = c.rng
    for layer in ("back", "mid", "front"):
        for k in range(9):
            ang = math.radians(r.uniform(-5, 75))
            c.sprig(r.uniform(-40, 40), r.uniform(-40, 40), ang, r.uniform(240, 430), 1.15, layer)
    for k in range(14):
        ang = math.radians(r.uniform(5, 60))
        c.sprig(r.uniform(-20, 120), r.uniform(-20, 120), ang, r.uniform(150, 260), 1.05, r.choice(["mid", "front"]))
    for x, y in ((230, 150), (170, 260), (330, 90)):
        c.light(x + r.uniform(-30, 30), y + r.uniform(-30, 30))
    c.holly(250, 210, math.radians(30), 96)
    c.bauble(330, 300, 34, "burgundy", hang_from=(300, 150))
    c.bauble(150, 330, 26, "gold", hang_from=(140, 200))
    c.bauble(420, 200, 22, "ivory", hang_from=(400, 80))
    save("corner-spray", c)


# ---------------------------------------------------------------- bauble
def make_baubles():
    for kind in ("burgundy", "gold", "red", "ivory"):
        c = Canvas(200, 230, seed=hash(kind) % 1000)
        c.bauble(100, 130, 80, kind)
        save(f"bauble-{kind}", c)


if __name__ == "__main__":
    make_swag()
    make_rope()
    make_wreath()
    make_corner()
    make_baubles()
