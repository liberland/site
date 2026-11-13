"""Writes src/styles/noto-serif-sc.css (woff2-only, unicode-range sliced) from @fontsource/noto-serif-sc/400.css."""
import os, re
root = os.path.join(os.path.dirname(__file__), '..')
src = open(os.path.join(root, 'node_modules/@fontsource/noto-serif-sc/400.css')).read()
out = ['/* Noto Serif SC 400 (SIL OFL 1.1), from @fontsource/noto-serif-sc — Chinese page only.',
       '   Sliced by unicode-range: the browser downloads only the slices holding characters on the page.',
       '   woff2 only. Regenerate with scripts/zh-font-css.py after updating the package. */']
for block in re.findall(r'@font-face\s*\{.*?\}', src, re.S):
    ur = re.search(r'unicode-range:\s*([^;]+);', block)
    f = re.search(r"url\(\./files/([^)]+?\.woff2)\)", block)
    if not f:
        continue
    out.append("@font-face {\n  font-family: 'Noto Serif SC';\n  font-style: normal;\n  font-display: swap;\n  font-weight: 400;\n"
               f"  src: url('@fontsource/noto-serif-sc/files/{f.group(1)}') format('woff2');\n"
               + (f"  unicode-range: {ur.group(1).strip()};\n" if ur else '') + '}')
open(os.path.join(root, 'src/styles/noto-serif-sc.css'), 'w').write('\n'.join(out) + '\n')
