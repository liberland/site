"""Sestaví lokální náhledy stránek nad skutečným HTML šablony z reformy.cz.

Vezme uloženou živou stránku /about/ (hlavička, menu, patička a CSS šablony
Newspaper zůstanou z produkce), odstraní z ní nalezený spamový odkaz a do
obsahové části vloží:
  - preview-o-spolku.html: obsah content/o-spolku.html + CSS pluginu,
    třídu body.rz-o-spolku, titulek, meta description a JSON-LD,
  - preview-about.html: upravený obsah content/about-upraveny-obsah.html.

Náhledy otevírá qa.js na skutečných adresách reformy.cz (požadavky na
/o-spolku/, /about/ a soubory pluginu obslouží lokálně), aby skripty šablony
běžely na své doméně jako v produkci.

Použití:
  curl -sS https://reformy.cz/about/ -o about-live.html
  python3 reformy-cz/tests/build_preview.py about-live.html VYSTUPNI_SLOZKA
"""
import json
import pathlib
import re
import sys

ROOT = pathlib.Path(__file__).resolve().parents[1]
# qa.js tuto adresu obslouží souborem z plugin/reformy-o-spolku/.
PLUGIN_URL = "https://reformy.cz/wp-content/plugins/reformy-o-spolku/"
SPAM = re.compile(r'<span style="position: absolute; left: -9655px;">\s*<a href="https://www\.fapjunk\.com"[^>]*>[^<]*</a></span>\s*<div>', re.S)
CONTENT = re.compile(r'(<div class="td-page-content tagdiv-type">)(.*?)(\s*</div>\s*</div>\s*</div>\s*<div class="td-pb-span4 td-main-sidebar")', re.S)


def build(live, content, title, crumb, page_extra_head="", body_class=""):
    html, n = SPAM.subn("", live)
    if n != 1:
        sys.exit("spamový odkaz nenalezen právě jednou (%d)" % n)
    html, n = CONTENT.subn(lambda m: m.group(1) + "\n" + content + m.group(3), html)
    if n != 1:
        sys.exit("obsahová část stránky nenalezena")
    html = re.sub(r"<title>.*?</title>", "<title>%s</title>" % title, html, count=1, flags=re.S)
    html = html.replace('<span class="td-bred-no-url-last">O nás</span>', '<span class="td-bred-no-url-last">%s</span>' % crumb)
    html = html.replace("<span>O nás</span>\n", "<span>%s</span>\n" % crumb, 1)
    if body_class:
        html = re.sub(r'(<body class=")', r"\1%s " % body_class, html, count=1)
    return html.replace("</head>", page_extra_head + "</head>", 1)


def main():
    live = pathlib.Path(sys.argv[1]).read_text(encoding="utf-8")
    out = pathlib.Path(sys.argv[2])
    out.mkdir(parents=True, exist_ok=True)
    desc = ("Reformy.cz z.s. is an independent Czech nonprofit association for education in economics and the ideas "
            "of freedom and the market economy. Reg. no. (IČO) 22874046, Loretánské náměstí 109/3, Prague 1.")
    ld = {"@context": "https://schema.org", "@type": "NGO", "legalName": "Reformy.cz z.s.",
          "identifier": {"@type": "PropertyValue", "propertyID": "IČO", "value": "22874046"}}
    head = ('<meta name="description" content="%s">\n'
            '<script type="application/ld+json">%s</script>\n'
            '<link rel="stylesheet" href="%s">\n') % (desc, json.dumps(ld, ensure_ascii=False), PLUGIN_URL + "o-spolku.css")
    page = build(live, (ROOT / "content" / "o-spolku.html").read_text(encoding="utf-8"),
                 "About the association – Reformy.cz z.s.", "O spolku", head, "rz-o-spolku")
    (out / "preview-o-spolku.html").write_text(page, encoding="utf-8")
    about = build(live, (ROOT / "content" / "about-upraveny-obsah.html").read_text(encoding="utf-8"),
                  "O nás | Reformy.cz", "O nás")
    (out / "preview-about.html").write_text(about, encoding="utf-8")
    print(out / "preview-o-spolku.html")
    print(out / "preview-about.html")


if __name__ == "__main__":
    main()
