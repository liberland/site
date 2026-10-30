"""Testovací náhled stránky O spolku pro liberlandlimited.com/reformy/.

Nejde o produkci: skutečná stránka bude na https://reformy.cz/o-spolku/ uvnitř
šablony Newspaper. Tady je stejný obsah a stejné CSS pluginu v jednoduchém obalu,
s noindex a canonical na budoucí adresu, aby kopie nesoutěžila ve vyhledávačích.

Použití: python3 reformy-cz/build_test_page.py _site/reformy
"""
import pathlib
import shutil
import sys

ROOT = pathlib.Path(__file__).resolve().parent
PLUGIN = ROOT / "plugin" / "reformy-o-spolku"

PAGE = """<!doctype html>
<html lang="{lang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{title}</title>
<meta name="robots" content="noindex, nofollow">
<link rel="canonical" href="{canonical}">
<link rel="stylesheet" href="{css}">
<style>
body{{margin:0;background:#fff;color:#0a0a0b;font-family:"RZ Archivo",system-ui,-apple-system,"Segoe UI",Arial,sans-serif}}
.rz-test-bar{{margin:0;background:#fff3d6;color:#6b3f00;border-bottom:1px solid #d99a2b;font-size:14px;line-height:1.45;padding:10px 16px;text-align:center}}
.rz-test-bar a{{color:#6b3f00}}
.rz-test-wrap{{margin:0}}
.rz-test-about{{max-width:700px;margin:32px auto 0;padding:0 16px;font:15px/1.75 Verdana,Geneva,sans-serif;color:#111}}
.rz-test-about h1{{font:400 32px/1.2 "Open Sans",Arial,sans-serif;margin:0 0 20px}}
.rz-test-about p{{margin:0 0 26px}}
.rz-test-about a{{color:#1a73c4}}
</style>
</head>
<body class="{body_class}">
<p class="rz-test-bar" role="note"><strong>{bar}</strong> {extra}</p>
<main class="rz-test-wrap" id="obsah">
{content}
</main>
</body>
</html>
"""


def main():
    out = pathlib.Path(sys.argv[1])
    (out / "about").mkdir(parents=True, exist_ok=True)
    shutil.copy(PLUGIN / "o-spolku.css", out / "o-spolku.css")
    shutil.copytree(PLUGIN / "fonts", out / "fonts", dirs_exist_ok=True)

    content = (ROOT / "content" / "o-spolku.html").read_text(encoding="utf-8")
    (out / "index.html").write_text(PAGE.format(
        lang="en", title="Test: About the association – Reformy.cz z.s.", canonical="https://reformy.cz/o-spolku/",
        css="o-spolku.css",
        bar="Test preview.", extra='The live page will be at <a href="https://reformy.cz/o-spolku/">reformy.cz/o-spolku/</a>, inside the reformy.cz header and footer.', content=content, body_class="rz-o-spolku"), encoding="utf-8")

    about = (ROOT / "content" / "about-upraveny-obsah.html").read_text(encoding="utf-8")
    about = '<div class="rz-test-about"><h1>O nás</h1>\n' + about + "</div>"
    (out / "about" / "index.html").write_text(PAGE.format(
        lang="cs", title="Test: O nás | Reformy.cz", canonical="https://reformy.cz/about/",
        css="../o-spolku.css",
        bar="Testovací náhled.", extra='Ostrá stránka bude na <a href="https://reformy.cz/about/">reformy.cz/about/</a>. Nová stránka O spolku: <a href="../">náhled</a>.', content=about, body_class=""), encoding="utf-8")
    print(out / "index.html")
    print(out / "about" / "index.html")


if __name__ == "__main__":
    main()
