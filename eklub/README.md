# eKLUB — web

Nový web jazykové školy eKLUB (Hradec Králové), postavený od nuly podle dodaného designu
(`eklub-web.html`). Čisté statické HTML/CSS/JS: žádný WordPress, žádný framework, žádný build
nutný k provozu.

## Struktura

```
index.html                 jediná stránka (one-page)
assets/css/fonts.css       @font-face, fonty jsou self-hostované (žádné Google Fonts)
assets/css/tokens.css      barvy, světlý + tmavý motiv (design tokens)
assets/css/components.css  komponenty ek-* (tlačítka, bubliny, karty, formulář…)
assets/css/page.css        rozložení stránky w-* + mobilní menu
assets/js/eklub.js         ikony, logo, „ručně kreslené“ obrysy (z designu)
assets/js/main.js          mobilní menu, kontaktní formulář
assets/fonts/              Bricolage Grotesque, DM Sans, DM Mono, Caveat (woff2, SIL OFL)
assets/img/                ilustrace (SVG), favicon
build.py                   sbalí web do jednoho souboru dist/eklub.html
```

## Spuštění

```
python3 -m http.server     # pak http://localhost:8000
```

Na hosting stačí nahrát obsah složky (bez `build.py` a `dist/`). Pro Netlify je přiložen
`netlify.toml`.

Jednosouborová verze (vše vložené, otevře se i offline dvojklikem, dá se poslat e-mailem):

```
python3 build.py           # → dist/eklub.html
```

## Odchylky od designu

Design je převzatý 1:1 (markup, třídy, tokeny, ilustrace, fonty). Změněno bylo jen to, bez čeho
by web nefungoval:

- **Tlačítko „Menu“** na mobilu otevírá navigaci (v designu nedělalo nic).
- **Kontaktní formulář** odesílá: otevře e-mailového klienta návštěvníka s vyplněnou zprávou na
  `eklub@eklub.cz`. Jméno a e-mail jsou povinné. Pro odesílání bez e-mailového klienta stačí
  doplnit backend (např. Netlify Forms nebo Formspree) do atributu `action` formuláře.
- **Mrtvé odkazy** (`href="#"` v patičce, „Termíny táborů“, „Nezávazná cenová nabídka“) vedou
  na příslušné sekce; e-mail a telefony v patičce jsou klikací; mustwatch.eu odkazuje na web.
- Odkazy „Jazykový audit zdarma“, „Ukázková hodina“ a „Nezávazná cenová nabídka“ ve formuláři
  předvolí téma („Pro firmu“ / „Překlad“).
- Doplněny meta značky pro sdílení (Open Graph).

## K doplnění od klienta

- Termíny letních táborů (dnes vedou na kontakt).
- Případně fotografie lektorů místo ilustrací (slot `.ek-photo` je v CSS připravený).
