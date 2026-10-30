# Bezpečnostní nález: skrytý spamový odkaz na reformy.cz

Zjištěno 30. 10. 2026 z veřejně dostupného HTML, bez přístupu do administrace a na server.
**Závěr: jde o potvrzený neautorizovaný obsah (SEO spam injection) a o známku kompromitace webu.
Než se nasadí nová stránka, je potřeba web vyčistit (postup níže).**

## Co přesně je na webu

Na každé stránce vykreslené šablonou je v `<head>`, hned za značkou `<style id="tdw-css-placeholder">`, vložen tento kód:

```html
<style id="tdw-css-placeholder"></style><span style="position: absolute; left: -9655px;">
<a href="https://www.fapjunk.com" title="Porn Videos">Free Porn</a></span>
<div></style></head>
```

- Odkaz je posunutý 9 655 px mimo obrazovku. Návštěvník ho nevidí, vyhledávače ho ale přečtou.
  Je to typický „link injection“ pro cizí SEO.
- Nalezen na `/`, `/about/`, `/vzdelani/`, na článku (`/pad-evropy/`) i na chybové stránce 404. Je tedy
  v celé šabloně, ne v obsahu jednotlivých stránek. RSS (`/feed/`) ho neobsahuje.
- Googlebot (testováno s jeho User-Agentem) dostává stejný kód, nic dalšího navíc. Maskování obsahu
  pro vyhledávače (cloaking) jsem nezjistil.
- Útočníkův řetězec začíná `</style>`, tedy zavírá stylovou značku a vkládá HTML. Text tedy prošel
  pole, které šablona vypisuje dovnitř `<style>`. To odpovídá **uloženému vlastnímu CSS šablony
  Newspaper / tagDiv Composer** v databázi (tabulka `wp_options`), ne souboru jádra WordPressu.

## Pravděpodobná příčina

- Web běží na šabloně **Newspaper 10.3.4** (rok 2020) s pluginy tagDiv Composer a tagDiv Cloud Library
  (`td-composer`, `td-cloud-library`). Tak stará verze obsahuje veřejně známé zranitelnosti tagDiv
  Composeru, mimo jiné uložené XSS **CVE-2023-3169** (opraveno v tagDiv Composer 4.2), které v letech
  2023–2024 hromadně zneužívala kampaň „Balada Injector“ právě ke vkládání kódu do nastavení šablony.
- Že to tak bylo i zde, z venku dokázat nelze. Proto to považujte za nejpravděpodobnější hypotézu,
  ne za zjištěný fakt. Kampaně tohoto typu navíc často zakládají skryté administrátorské účty
  a zadní vrátka v souborech. Samotné smazání odkazu proto nestačí.

Další pozorování (nejde o kompromitaci, ale stojí za opravu):

- Na živém webu je chyba JavaScriptu `Can only be used on: https://www.reformy.cz`. Pochází ze skriptu
  šablony a vyskytuje se i na stránce `/about/` beze změn. Nová stránka ji nezpůsobuje.
- `https://reformy.cz/readme.html` je veřejně dostupný.
- Šablony tagDiv Cloud jsou v sitemapě (`wp-sitemap-posts-tdb_templates-1.xml`) a tedy indexovatelné.
- Pozitivní: přihlášení je přesunuto na `/prihlaseni/`, `/wp-admin/` vrací 403, výpis uživatelů
  přes REST je zakázán (401), cesty k pluginům jsou maskované, WordPress je aktuální (7.1.4).

## Bezpečná náprava (nic nevratného bez zálohy)

1. **Záloha.** V SiteGround Site Tools → Security → Backups vytvořte ruční zálohu
   (soubory i databáze). Navíc si stáhněte export databáze (Site Tools → MySQL → phpMyAdmin → Export).
   Zálohu uchovejte i jako forenzní kopii kompromitovaného stavu.
2. **Najděte, kde odkaz leží**, a zatím nic neměňte. V phpMyAdmin:
   ```sql
   SELECT option_id, option_name, LENGTH(option_value)
     FROM wp_options WHERE option_value LIKE '%fapjunk%';
   SELECT ID, post_type, post_status, post_title
     FROM wp_posts   WHERE post_content LIKE '%fapjunk%';
   SELECT meta_id, post_id, meta_key
     FROM wp_postmeta WHERE meta_value LIKE '%fapjunk%';
   ```
   (Prefix tabulek může být jiný než `wp_`.) Pokud je k dispozici WP-CLI:
   `wp db search fapjunk --all-tables`.
   Nejpravděpodobnější výsledek je volba šablony (např. `td_011` nebo volba s živým CSS tagDiv).
   Pozor: `td_011` je serializované pole. **Neupravujte ho přímo v SQL**, rozbili byste délky řetězců.
3. **Odstranění odkazu.** Vložený text smažte v administraci šablony
   (Newspaper → Theme Panel → Custom CSS, popř. tagDiv Composer → živé CSS / Custom CSS stránky).
   Pokud je hodnota v serializovaném poli a v administraci není vidět, použijte
   `wp search-replace` s ochranou serializace, nejprve s `--dry-run`.
4. **Zjistěte, kudy se útočník dostal**, ještě než odkaz zmizí z očí:
   - seznam uživatelů s rolí Administrátor: neznámé účty zablokujte, ale nemažte, než zjistíte,
     kdy vznikly;
   - soubory upravené v posledních měsících (`find . -name '*.php' -newer wp-config.php` apod.)
     a PHP soubory ve složce uploadů, kam nepatří;
   - `wp core verify-checksums` a `wp plugin verify-checksums --all`;
   - kontrola SiteGround Site Scanner / Sucuri SiteCheck / Wordfence.
5. **Uzavření díry:** aktualizujte šablonu Newspaper a pluginy tagDiv na aktuální verze (vyžaduje
   platnou licenci). Pokud to nejde hned, deaktivujte aspoň tagDiv Composer, nebo omezte přístup
   k jeho AJAX/REST koncovým bodům na přihlášené administrátory.
6. **Po vyčištění:** změňte hesla všech administrátorů, hesla k databázi, SFTP a hostingu,
   obnovte bezpečnostní klíče v `wp-config.php` (tím se odhlásí všechny relace) a zapněte 2FA.
7. **Kontrola:** `curl -s https://reformy.cz/ | grep -c fapjunk` musí vrátit `0`, stejně tak
   pro `/about/` a pro libovolnou stránku 404. Pak vymažte cache (SiteGround Speed → Caching → Flush).
8. **Google:** v Search Console zkontrolujte Zabezpečení a ruční akce. Pokud tam něco je, po
   vyčištění požádejte o přezkoumání.

Do produkce jsem nic neposílal ani nic neměnil. Popsaný postup musí provést někdo s přístupem
k hostingu SiteGround a do administrace WordPressu.
