# reformy.cz – stránka „O spolku“ (`/o-spolku/`)

Balíček k nasazení nové stránky **https://reformy.cz/o-spolku/** na stávající web reformy.cz
podle návrhu `reformy-spolek-design.html`, plus sjednocení právních údajů na `/about/`.

**Stránka je celá v angličtině** (rozhodnutí z 30. 10. 2026). Návrh měl českou verzi a anglickou
sekci; česká verze byla vypuštěna a celý obsah přeložen do angličtiny. České názvy z rejstříku
(adresa, soud, „spolek“, původní znění účelu) zůstávají v originále a jsou označené `lang="cs"`.
Barevné pásy jdou přes celou šířku okna, text je ve sloupci max. 1 240 px.

Web reformy.cz **není v tomto repozitáři**. Běží na WordPressu u SiteGround, mimo tento repozitář.
Tady je jen připravený balíček a návod. Nic z toho zatím není nasazeno.

> **Nejdřív přečtěte [`BEZPECNOSTNI-NALEZ.md`](BEZPECNOSTNI-NALEZ.md).** Na webu je potvrzený
> vložený spamový odkaz („Free Porn“ → fapjunk.com) ve všech stránkách. Novou stránku nasazujte
> až po vyčištění. Jinak by na ní byl ten odkaz také a do kompromitovaného webu by se instaloval
> nový kód.

## Zjištěná technologie webu (30. 10. 2026)

| | |
|---|---|
| CMS | WordPress 7.1.4, hosting SiteGround (nginx, SG CDN a cache) |
| Šablona | **Newspaper 10.3.4** (tagDiv), bez child theme; hlavička a patička jsou šablony tagDiv Cloud (`tdb_templates`) |
| Pluginy (viditelné) | tagDiv Composer, tagDiv Cloud Library, tagDiv Standard Pack, wpDiscuz; maskované cesty (`/ozusoamt/` = pluginy), přihlášení na `/prihlaseni/` |
| SEO plugin | žádný (stránky nemají meta description) |
| Menu | hlavní menu WordPressu, položka **REFORMY.CZ** s podmenu O NÁS, VZDĚLÁNÍ (Filmy, Citáty, Přednášky pro školy, Knihy) |
| `/about/` | stránka ID 2, klasický editor, šablona „default“ se sidebarem |

## Obsah balíčku

```
reformy-cz/
├── plugin/reformy-o-spolku/        plugin WordPressu (nahrát jako ZIP)
│   ├── reformy-o-spolku.php        title, meta description, JSON-LD (NGO), CSS, třída body
│   ├── o-spolku.css                styly stránky, vše vázané na #rz-spolek
│   └── fonts/                      Playfair Display, Archivo, IBM Plex Mono (latin + latin-ext, SIL OFL)
├── reformy-o-spolku.zip            totéž zabalené k nahrání přes administraci
├── content/
│   ├── o-spolku.html               obsah nové stránky (blok „Vlastní HTML“)
│   ├── about-upraveny-obsah.html   nový obsah stránky /about/
│   └── about-puvodni-obsah.html    původní obsah /about/ (záloha pro návrat)
└── tests/
    ├── plugin-smoke.php            test pluginu bez WordPressu (php tests/plugin-smoke.php)
    ├── build_preview.py            náhled nad skutečným HTML šablony z produkce
    └── qa.js                       Playwright: šířky 320–1920 px, chyby JS, obsah, přístupnost
```

### Proč plugin, a ne child theme nebo úprava šablony

- **Child theme:** přepnutí na child theme by u Newspaperu ztratilo nastavení šablony
  (theme mods jsou vázané na šablonu) a mohlo rozbít hlavičku a patičku tagDiv. Proto ne.
- **Úpravy souborů Newspaperu:** zmizely by při aktualizaci šablony, která je kvůli bezpečnosti nutná.
- **Malý plugin:** nic jiného na webu nemění. Kód běží jen na stránce se slugem `o-spolku`.
  Deaktivací se vše vrátí. Obsah stránky zůstává běžnou WordPress stránkou, kterou lze editovat.

### Co plugin dělá (jen na `/o-spolku/`)

- načte `o-spolku.css` a lokální fonty: žádné externí služby, žádné trackery, **žádný JavaScript**;
- `<title>About the association – Reformy.cz z.s.</title>` a anglický `<meta name="description">`;
- JSON-LD `NGO` (název, IČO, sídlo, datum vzniku podle rejstříku, e-mail, odkaz na rejstřík) a `AboutPage`;
- přidá `body.rz-o-spolku`, aby se skryl duplicitní nadpis šablony (stránka má vlastní H1) a sidebar
  a aby šly barevné pásy přes celou šířku okna (`width:100vw`, vodorovný přesah se ořízne);
- vypne automatické odstavce (`wpautop`) pro tuto stránku, aby WordPress nevkládal `<p>`/`<br>` do HTML.

Stránka je obyčejné serverově vykreslené HTML, celý text je ve zdrojovém kódu. Nic se nedokresluje
JavaScriptem a nic není skryto před vyhledávači (žádné `noindex`).

## Úpravy oproti návrhu a proč

| Návrh | Implementace | Důvod |
|---|---|---|
| vlastní hlavička, menu a patička | hlavička, menu a patička webu reformy.cz | stránka má působit jako součást webu |
| interní lišta, žluté značky „k ověření“, tlačítko „skrýt poznámky“ | odstraněno | interní pomůcky, ne veřejný obsah |
| blok „K internímu potvrzení“: *Google Workspace na gov.ll.land spravuje Reformy.cz z.s.* (CZ i EN) | **vynecháno** | tvrzení o správě gov.ll.land nemám doložené. Doplnit lze po potvrzení, viz níže. |
| karta gov.ll.land: „Kdo: viz poznámka níže / Web: bez veřejného webu“ | „Účel: pracovní nástroje pro spolupráci / Web: bez vlastního obsahu, adresa přesměrovává na liberland.org“ | poznámka byla vynechána; gov.ll.land ve skutečnosti přesměrovává na liberland.org (ověřeno 30. 10. 2026) |
| Google Fonts | stejné fonty, hostované lokálně (s češtinou) | žádné neověřené třetí strany |
| JavaScript: animace, běžící pás, tlačítko „Kopírovat IČO“, menu | žádný JavaScript; pás údajů je statický | zbytečný JS; IČO jde označit a zkopírovat |
| česká verze + anglická sekce | jen angličtina, celý obsah přeložen; obal obsahu má `lang="en"` | rozhodnutí zadavatele |
| `hreflang` na `#en` | vypuštěno | stránka je jednojazyčná |
| nadpisy domén `h3` uvnitř `h3` | `h4` | správná hierarchie nadpisů |
| odkaz menu `/category/ekonomika/` | (menu je z webu) | na webu je `/tema/ekonomika/` |
| texty | přeloženy do angličtiny bez změny smyslu (anglické pasáže z návrhu převzaty doslova) | přidány odkazy na existující stránky Klubu, Vzdělávání, Filmy, Citáty, Knihy, Přednášky |

Volitelná věta o Google Workspace, až bude doložena (vložit do `content/o-spolku.html` do bloku `.why`):

```html
<p>The Google Workspace environment on gov.ll.land is administered by Reformy.cz z.s. and used for its nonprofit activities and for the cooperation described on this page.</p>
```

## Ověření právních údajů

Ověřeno 30. 10. 2026 ve [veřejném rejstříku](https://or.justice.cz/ias/ui/rejstrik-$firma?ico=22874046)
(výpis platných údajů, subjektId 758043) a v ARES:

| údaj | rejstřík | stránka |
|---|---|---|
| název | Reformy.cz z.s. (do 9. 6. 2017 Reformy.cz o.s.) | ✔ |
| právní forma | spolek | ✔ |
| IČO | 228 74 046 | ✔ |
| sídlo | Loretánské náměstí 109/3, Hradčany, 118 00 Praha 1 (od 4. 12. 2024) | ✔ |
| spisová značka | L 21391 vedená u Městského soudu v Praze | ✔ |
| účel | „Účelem spolku je vzdělávání v oblasti ekonomie a šíření myšlenek svobody a tržního hospodářství.“ | ✔ doslovně |
| předseda výkonného výboru | Mgr. Vít Jedlička | ✔ |
| místopředsedové | Bc. Alexander Kossev, Bc. Petr Křovina (od 21. 5. 2020); **Mgr. Martin Košut funkce zanikla 21. 5. 2020** | na `/about/` opraveno |
| datum vzniku | 31. 3. 2010 | jen v JSON-LD |

Odkaz `https://or.justice.cz/ias/ui/rejstrik-$firma?ico=22874046` **funguje** (HTTP 200, vrací záznam spolku),
proto zůstal. Pod ním je i návod k ručnímu hledání podle IČO.

**Nemohl jsem ověřit z veřejných zdrojů:** datovou schránku `ctgairr` (veřejné vyhledávání ISDS je
přesunuté). Prosím ověřte ji před publikací. Dále body, které návrh označil „k ověření / k upřesnění“
a které jsem převzal beze změny, protože je podporuje stávající obsah webu:

- Klub Reformy.cz 2011 a konference z ledna 2011: doloženo na `/about/` a `/about/klub-reformy-cz/`;
- sekce Vzdělávání (filmy, citáty, knihy): stránky existují;
- „přednášky pro školy na vyžádání“: stránka `/prednasky-pro-skoly/` existuje, je ale z roku 2012 (nabídka Petra Macha). Zvažte, zda nabídka platí;
- „Díky ní se naše … činnost dostává k lidem v mnoha zemích“ a „služby spojené s členstvím a podporovatelským Klubem Reformy.cz“: Klub i podmínky členství na webu existují, rozsah služeb potvrďte.

## Nasazení (po vyčištění webu)

### 0. Záloha
SiteGround Site Tools → Security → Backups → **Create backup**. Návrat celého webu = obnova této zálohy.

### 1. Plugin
Administrace → Pluginy → Instalace pluginů → **Nahrát plugin** → `reformy-o-spolku.zip` → Instalovat → **Aktivovat**.
(Alternativa: nahrát složku `plugin/reformy-o-spolku/` přes SFTP do adresáře pluginů a aktivovat.)
Plugin sám nic neviditelného nemění, dokud neexistuje stránka `o-spolku`.

### 2. Stránka „O spolku“
1. Stránky → Přidat novou. Titulek **O spolku**, nadřazená stránka **žádná**, URL (slug) **`o-spolku`**.
2. Obsah:
   - **blokový editor:** přidat blok *Vlastní HTML* a vložit celý `content/o-spolku.html`;
   - **klasický editor:** záložka *Text* (ne *Vizuální*) a vložit celý `content/o-spolku.html`.
     Po uložení do záložky *Vizuální* nepřepínejte, mohla by upravit HTML.
3. V nastavení stránky Newspaper zvolte rozložení **No sidebar**, pokud je nabídnuto. CSS sidebar skryje i tak.
4. Viditelnost **Veřejná**, nezaškrtávat žádné „noindex“. Publikovat.
5. Vlastní HTML musí uložit administrátor (role s oprávněním `unfiltered_html`).

### 3. Menu
Vzhled → Menu → hlavní menu → přidat stránku **O spolku** jako podpoložku **REFORMY.CZ**, hned pod **O NÁS**.
Popisek: **O spolku**. Uložit. Zkontrolovat i mobilní menu (používá stejné menu).

### 4. Stránka `/about/`
Stránky → O nás → záložka *Text* → nahradit obsah souborem `content/about-upraveny-obsah.html` → Aktualizovat.
Změny oproti původnímu obsahu (vše ostatní zůstává):

- „Občanské sdružení Reformy.cz“ → „**Reformy.cz z.s.** – spolek (do 9. června 2017 občanské sdružení Reformy.cz o.s.)“;
- nový odkaz „**O spolku – právní informace a poslání**“ na `/o-spolku/`;
- blok „Mgr. Martin Košut, místopředseda“ (funkce zanikla 21. 5. 2020) nahrazen odkazem na veřejný rejstřík s aktuálním složením výboru;
- adresa „Loretánské náměstí 3, 11800 Praha 1“ → „Loretánské náměstí 109/3, 118 00 Praha 1 – Hradčany“;
- doplněno „Spolek zapsaný ve spolkovém rejstříku vedeném Městským soudem v Praze, spisová značka L 21391“.

Historický text, odkazy na články a údaje o Klubu zůstávají. Návrat: vložit `content/about-puvodni-obsah.html`
nebo obnovit předchozí revizi stránky.

### 5. Patička (doporučeno)
Patička je šablona tagDiv Cloud „footer-template-default-pro“. V tagDiv Composeru (Cloud Templates →
Footer → Edit) do textového bloku „ABOUT US“ pod větu „Zprávy, které se jinde nedočtete.“ přidat:

```html
<a href="https://reformy.cz/o-spolku/">O spolku – právní informace a poslání</a>
```

a řádek „© Reformy.CZ“ případně změnit na „© Reformy.cz z.s. · IČO 22874046“. Do rozvržení patičky
nic dalšího nepřidávat.

### 6. Cache
SiteGround Speed → Caching → **Flush cache**.

## Kontrola po nasazení

```bash
curl -sS -o /dev/null -w "%{http_code} %{url_effective}\n" https://reformy.cz/o-spolku/
```

```bash
curl -sS https://reformy.cz/o-spolku/ | grep -c -e 22874046 -e "Loretánské náměstí 109/3" -e "gov.ll.land" -e "application/ld+json"
```

```bash
curl -sS https://reformy.cz/o-spolku/ | grep -c -i -e noindex -e fapjunk
```

Očekávané výsledky: `200`, nenulový počet, `0`. Dále:

- https://search.google.com/test/rich-results nebo https://validator.schema.org/ pro `https://reformy.cz/o-spolku/` (Organization/NGO bez chyb);
- menu REFORMY.CZ → O spolku na desktopu i mobilu, odkaz na `/about/` a v patičce;
- Search Console → Kontrola URL → Požádat o indexování.

Nasazení samo o sobě neznamená splnění podmínek Google for Nonprofits. Stránka jen veřejně a srozumitelně
dokládá identitu spolku a popisuje, k čemu slouží doména gov.ll.land.

## Návrat (rollback)

| krok | návrat |
|---|---|
| plugin | Pluginy → Deaktivovat (a smazat) |
| stránka O spolku | Stránky → Do koše (nebo změnit na Koncept) |
| menu | odebrat položku O spolku |
| `/about/` | obnovit předchozí revizi / vložit `content/about-puvodni-obsah.html` |
| vše | obnova zálohy ze SiteGround |

## Testy (lokálně, bez přístupu k produkci)

```bash
php reformy-cz/tests/plugin-smoke.php
```

```bash
curl -sS https://reformy.cz/about/ -o /tmp/about-live.html && python3 reformy-cz/tests/build_preview.py /tmp/about-live.html /tmp/rz-preview
```

```bash
node reformy-cz/tests/qa.js /tmp/rz-preview
```

`qa.js` potřebuje Playwright s Chromiem. Náhled se servíruje na skutečné adrese `https://reformy.cz/o-spolku/`
(požadavek se obslouží lokálně), takže CSS a JS šablony Newspaper běží jako v produkci. Spamový odkaz
z produkce se v náhledu odstraní a jeho načtení je zablokované.

## Testovací náhled

Při každém deployi GitHub Pages se staví testovací kopie stránky na
**https://liberlandlimited.com/reformy/** (a upravené `/about/` na `/reformy/about/`).
Používá stejný obsah a stejné CSS pluginu, ale bez šablony reformy.cz. Má `noindex` a canonical
na budoucí adresu na reformy.cz, aby kopie nesoutěžila ve vyhledávačích s ostrou stránkou.
Sestavuje ji `reformy-cz/build_test_page.py` (krok v `.github/workflows/deploy-pages.yml`).
