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
assets/css/motion.css      animace (nájezdy při scrollu, hover efekty)
assets/js/eklub.js         ikony, logo, „ručně kreslené“ obrysy (z designu)
assets/js/main.js          mobilní menu, kontaktní formulář
assets/js/motion.js        animace při scrollu, počítadla, zvýraznění sekce v menu
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

## Animace

Animace z designu (běžící pás, pohupující se nálepka a ilustrace, hover tlačítek a karet) zůstaly.
Navíc, ve stejném „pop“ stylu (`--ease-pop`):

- obsah při scrollu postupně najíždí (karty, kurzy, důvody, klienti, formulář), hero při načtení
  stránky, nálepka „1. hodina zdarma“ doskočí jako poslední;
- chatové bubliny se objevují postupně jako v konverzaci;
- čísla se dopočítají (20, 13), cena první hodiny spadne na 0 Kč a pak se dopíše „fakt!“;
- žlutý zvýrazňovač se „natře“, vlnka Labe pod slovy proteče;
- ilustrace v hero se vznáší, řetěz postaviček se pohupuje;
- v menu se podtržení přesouvá podle sekce, kterou čtete; hlavička dostane při scrollu stín;
- hover: šipky se posunou, ilustrace na kartách se natočí, kurzy a pole formuláře „vyskočí“;
  běžící pás se pod myší zastaví.

Kdo má v systému zapnuté „omezit pohyb“, nebo nemá JavaScript, uvidí statický web přesně podle
designu.

## K doplnění od klienta

- Termíny letních táborů (dnes vedou na kontakt).
- Případně fotografie lektorů místo ilustrací (slot `.ek-photo` je v CSS připravený).
