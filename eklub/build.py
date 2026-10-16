#!/usr/bin/env python3
"""Bundle the site into one self-contained HTML file: dist/eklub.html.

Every stylesheet, script, font and image is inlined, so the file opens offline
by double-click and can be sent to anyone as a single attachment.
Usage: python3 build.py
"""
import base64, pathlib, re

ROOT = pathlib.Path(__file__).resolve().parent
MIME = {'.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp'}


def data_uri(path):
    return f'data:{MIME[path.suffix]};base64,' + base64.b64encode(path.read_bytes()).decode()


def css(href):
    path = ROOT / href
    text = path.read_text(encoding='utf-8')
    return re.sub(r'url\("(\.\./[^"]+)"\)', lambda m: f'url("{data_uri((path.parent / m.group(1)).resolve())}")', text)


def main():
    html = (ROOT / 'index.html').read_text(encoding='utf-8')
    html = re.sub(r'<link rel="preload"[^>]*>\n', '', html)
    html = re.sub(r'<link rel="stylesheet" href="([^"]+)">', lambda m: f'<style>\n{css(m.group(1))}</style>', html)
    html = re.sub(r'<script src="([^"]+)"></script>', lambda m: f'<script>\n{(ROOT / m.group(1)).read_text(encoding="utf-8")}</script>', html)
    html = re.sub(r'(src|href)="(assets/img/[^"]+)"', lambda m: f'{m.group(1)}="{data_uri(ROOT / m.group(2))}"', html)
    assert 'assets/' not in html, 'unresolved asset reference'
    out = ROOT / 'dist' / 'eklub.html'
    out.parent.mkdir(exist_ok=True)
    out.write_text(html, encoding='utf-8')
    print(f'{out.relative_to(ROOT)}  {out.stat().st_size / 1024:.0f} kB')


if __name__ == '__main__':
    main()
