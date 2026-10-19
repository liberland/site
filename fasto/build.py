#!/usr/bin/env python3
"""Generate the Fasto pages: index.html (cs), en/index.html and hr/index.html.

One template, three translations. Edit the copy in T below, then run
    python3 fasto/build.py
and commit the generated HTML. There is no build step on deploy.
"""
import html
import json
import re
from pathlib import Path

HERE = Path(__file__).parent
BASE = "https://liberlandlimited.com/fasto/"
PHONE = "+420 608 131 130"
PHONE_HREF = "tel:+420608131130"
REGISTRY = "https://or.justice.cz/ias/ui/rejstrik-firma.vysledky?subjektId=119037&amp;typ=UPLNY"
MAP_PRAHA = "https://mapy.cz/zakladni?q=Loret%C3%A1nsk%C3%A9%20n%C3%A1m%C4%9Bst%C3%AD%20109%2F3%2C%20Praha"
MAP_BATINA = "https://www.google.com/maps/search/?api=1&amp;query=Trg%20slobode%202%2C%2031300%20Batina%2C%20Croatia"

LANGS = [
    # code, path from BASE, og locale, flag file, flag label
    ("cs", "", "cs_CZ", "cz", "Čeština"),
    ("en", "en/", "en_GB", "gb", "English"),
    ("hr", "hr/", "hr_HR", "hr", "Hrvatski"),
]

T = {}

T["cs"] = dict(
    title="Nábytek, který není toxický, a skříně na míru bez dřevotřísky – Fasto",
    description="Nábytek bez přidaného formaldehydu a skříně na míru bez dřevotřísky. Renovace a stavba zomes v Česku, Chorvatsku i v Liberlandu. Prodejna v Batině.",
    skip="Přeskočit na obsah", home="Fasto, úvod", menu="Menu", nav_label="Hlavní", lang_label="Jazyk",
    nav=["Nábytek", "Skříně", "Renovace", "Zomes", "Prodejna", "Novinky"],
    news_eyebrow="Novinky", news_title="Co je u nás nového", news_photos="fotek", news_open="Otevřít galerii", news_photo="Fotka",
    lb_close="Zavřít", lb_prev="Předchozí fotka", lb_next="Další fotka",
    cta_short="Poptat",
    eyebrow="Nábytek · Skříně na míru · Renovace · Zomes",
    h1=["Nábytek,", "který není", "toxický."],
    lead="Navrhujeme a vyrábíme nábytek do interiéru bez přidaného formaldehydu a skříně na míru bez dřevotřísky. Rekonstruujeme byty a domy a stavíme nové zomes – v Česku, v Chorvatsku i v Liberlandu.",
    cta_main="Poptat zakázku", cta_zomes="Zobrazit zomes",
    strip=["Nábytek bez formaldehydu", "Skříně na míru bez dřevotřísky", "Renovace", "Stavba nových zomes"],
    offers_eyebrow="Co děláme", offers_title="Tři věci, které umíme dobře",
    offers=[
        ("Nábytek", "Nábytek bez formaldehydu", "Skříně, kuchyně a police do interiéru z materiálů s doloženým původem a lepidly bez přidaného formaldehydu.", "Zjistit, z čeho je"),
        ("Renovace", "Renovace", "Rekonstrukce bytů a domů od návrhu po předání, s jedním kontaktem pro celou zakázku.", "Prohlédnout postup"),
        ("Zomes", "Stavba nových zomes", "Kupolové stavby s dřevěným rámem a prosklenými poli. Stavíme v Česku, Chorvatsku i v Liberlandu.", "Zjistit víc o zomes"),
    ],
    mat_eyebrow="01 · Nábytek, který není toxický",
    mat_title="Nábytek, který nevoní chemií",
    mat_lead="U každého výrobku řekneme, z čeho je a čím je slepený. Technické listy přikládáme k nabídce, ne až na požádání.",
    mat_note="Netoxický u nás znamená konkrétní věci: žádná dřevotříska, lepidla a povrchy bez přidaného formaldehydu, vše doložené technickým listem nebo prohlášením výrobce. Dřevo samo obsahuje přirozené stopy formaldehydu.",
    mat_list=[
        ("Desky a masiv", "Uvádíme druh dřeva nebo desky a jeho původ."),
        ("Lepidla", "Lepidla bez přidaného formaldehydu, s prohlášením výrobce."),
        ("Povrchy", "Oleje, vosky a laky s technickým listem."),
        ("Doklady", "Technické listy jsou přílohou nabídky."),
    ],
    tox_eyebrow='Proč na tom záleží',
    tox_title='Proč je formaldehyd toxický',
    tox_lead='Formaldehyd je součástí močovino-formaldehydových pryskyřic, kterými se lepí dřevotříska a další aglomerované desky. Z nich se postupně uvolňuje do vzduchu jako plyn – nejvíc u nového nábytku a v teplém nebo vlhkém prostředí. Jeho vliv na zdraví závisí na koncentraci ve vzduchu a na délce expozice.',
    tox_short_tag='Krátkodobé účinky',
    tox_short_title='Při vyšších koncentracích v místnosti',
    tox_short=[('Podráždění sliznic', 'pálení, řezání a slzení očí, podráždění nosu a krku.'), ('Respirační potíže', 'kašel, dušnost, sípání nebo tíseň na hrudi.'), ('Kožní reakce', 'u citlivějších lidí alergické dermatitidy a vyrážky.'), ('Neurologické příznaky', 'bolesti hlavy, nevolnost a neobvyklá únava.')],
    tox_long_tag='Dlouhodobé účinky',
    tox_long_title='Při dlouhodobém vdechování',
    tox_long=[('Dýchací cesty', 'i nižší koncentrace mohou vést k rozvoji astmatu nebo zhoršení jeho příznaků, zejména u dětí.'), ('Karcinogenita', 'Mezinárodní agentura pro výzkum rakoviny (IARC) při WHO řadí formaldehyd mezi prokázané karcinogeny pro člověka (skupina 1). Dlouhodobá expozice zvyšuje riziko rakoviny nosohltanu a je spojována s vyšším rizikem leukémie. Týká se to hlavně dlouhodobé profesní expozice v průmyslu, i doma je ale rozumné držet koncentrace co nejníž.')],
    tox_tips_title='Jak riziko doma snížit',
    tox_tips=[('Větrejte', 'Nový dřevotřískový nábytek nebo podlahy první týdny intenzivně odvětrávejte.'), ('Sledujte emisní třídy', 'Vybírejte materiály s emisní třídou E1 (evropský standard), ještě lépe E0 nebo bez přidaného formaldehydu.'), ('Hlídejte klima', 'Spíš nižší teplota a mírná vlhkost. Teplo a vlhko uvolňování formaldehydu výrazně urychlují.'), ('Uzavřete povrchy', 'Všechny hrany dřevotřískových desek, i ty skryté na zadní straně skříní, mají být olepené, zalaminované nebo nalakované.')],
    tox_source='Zdroj klasifikace: <a href="https://monographs.iarc.who.int/list-of-classifications/" rel="noopener">IARC Monographs, seznam klasifikací</a>.',
    tox_cta_text='Nejjednodušší je formaldehyd domů vůbec nepřinést. Proto naše skříně na míru nemají žádnou dřevotřísku.',
    tox_cta='Skříně bez dřevotřísky',
    faq_extra=('Proč je formaldehyd škodlivý?', 'Ve vyšších koncentracích dráždí oči, nos a dýchací cesty a může způsobit bolesti hlavy. Dlouhodobé vdechování souvisí s astmatem a IARC při WHO řadí formaldehyd mezi prokázané karcinogeny pro člověka (skupina 1).'),
    sk_eyebrow="Skříně na míru",
    sk_title="Skříně na míru bez dřevotřísky",
    sk_lead="Dřevotřísková deska drží pohromadě díky pryskyřicím, které často obsahují formaldehyd. Ten se z desky může uvolňovat do vzduchu v místnosti ještě roky. Proto naše skříně na míru dřevotřísku nepoužívají vůbec.",
    sk_list=[
        ("Přesně do Vašeho prostoru", "Vestavěné skříně do výklenku, pod šikminu i přes celou stěnu. Zaměříme na místě."),
        ("Masiv místo dřevotřísky", "Korpus i dvířka z masivního dřeva a desek s doloženým složením."),
        ("Bez přidaného formaldehydu", "Lepidla, oleje a vosky s technickým listem ke každému materiálu."),
        ("Výroba i montáž", "Vyrobíme, dovezeme a smontujeme. Jeden kontakt od zaměření po předání."),
    ],
    sk_cta="Poptat skříň na míru",
    ren_eyebrow="02 · Renovace",
    ren_title='Renovace od návrhu <span class="accent-pond">po předání</span>',
    ren_lead="Rekonstruujeme byty a domy. Prostor nejdřív prohlédneme, pak navrhneme řešení a zakázku vedeme až do předání. Máte jeden kontakt pro celou zakázku.",
    ren_list=[
        ("Prohlídka", "Přijedeme, změříme a vyslechneme, co potřebujete."),
        ("Návrh a cena", "Pošleme návrh a rozpočet s materiály."),
        ("Realizace", "Řídíme stavbu a řemesla, nábytek vyrábíme sami."),
        ("Předání", "Předáme hotový interiér a doklady k materiálům."),
    ],
    z_eyebrow="03 · Stavba nových zomes",
    z_title='Kupole z dřeva <span class="accent-leaf">a světla</span>',
    z_lead="Zome má dřevěný rám z kosočtverců, prosklená pole a tmavou falcovanou střechu. Stavíme ji u vody, na zahradě nebo jako společný prostor – v Česku, v Chorvatsku a také v Liberlandu.",
    z_alt="Zome s dřevěným rámem z kosočtverců, prosklenými poli a tmavou falcovanou střechou na louce u rybníka",
    z_caption="Vizualizace zome u rybníka",
    z_facts=[("Rám", "dřevěný, z kosočtverců"), ("Střecha", "tmavá, falcovaná"), ("Kde stavíme", "Česko, Chorvatsko, Liberland")],
    z_plan_title="Od půdorysu po stavbu", z_plan_text="Půdorys komunity s kupolemi, ukázkový podklad.",
    z_plan_alt="Sépiový půdorys masterplanu komunity s kupolemi",
    steps_eyebrow="Postup", steps_title="Jak probíhá zakázka",
    steps=[
        ("Poptávka", "Zavoláte nebo se zastavíte v prodejně a řeknete, co potřebujete."),
        ("Návrh a nabídka", "Prohlédneme prostor a pošleme návrh s cenou a technickými listy."),
        ("Výroba a realizace", "Vyrábíme, opravujeme nebo stavíme podle odsouhlasení."),
        ("Předání", "Předáme hotové dílo a doklady k materiálům."),
    ],
    loc_eyebrow="Kde nás najdete", loc_title="Praha a prodejna v Batině",
    loc_lead="Nábytek můžete koupit v naší prodejně v Batině, kousek od Liberlandu. Zakázky v Česku řešíme z Prahy.",
    loc_praha_tag="Česko", loc_praha_name="Praha", loc_praha_addr="Loretánské náměstí 3<br>118 00 Praha 1",
    loc_batina_alt='Prodejna Fasto v Batině, Trg slobode 2',
    loc_batina_tag="Chorvatsko", loc_batina_name="Prodejna Batina", loc_batina_addr="Trg slobode 2<br>31300 Batina, Chorvatsko",
    loc_map="Ukázat na mapě",
    faq_eyebrow="Časté otázky", faq_title="Na co se nás ptáte",
    faq=[
        ("Je nábytek z dřevotřísky toxický?", "Dřevotřísková deska se lepí pryskyřicemi, které často obsahují formaldehyd, a ten se z ní může postupně uvolňovat do vzduchu. Množství závisí na třídě desky a stáří nábytku. My dřevotřísku nepoužíváme vůbec, takže tuto otázku u našeho nábytku řešit nemusíte."),
        ("Z čeho vyrábíte skříně na míru?", "Z masivního dřeva a desek s doloženým složením, s lepidly a povrchy bez přidaného formaldehydu. Ke každému materiálu přikládáme technický list."),
        ("Co přesně znamená „bez přidaného formaldehydu“?", "Že deska, lepidlo ani povrchová úprava neobsahují formaldehyd přidaný při výrobě. Dřevo samo obsahuje přirozené stopy, proto neslibujeme „nulové emise“, ale dokládáme konkrétní materiály."),
        ("Kde stavíte zomes?", "V Česku, v Chorvatsku a také v Liberlandu. Napište nám, kde chcete stavět, a domluvíme prohlídku pozemku."),
        ("Kde můžu nábytek koupit?", "V prodejně v Batině na adrese Trg slobode 2, 31300 Batina, Chorvatsko. Pro zakázky v Česku nám zavolejte na +420 608 131 130."),
    ],
    close_eyebrow="Kontakt", close_title="Ozvěte se nám.",
    close_lead="Nábytek, skříň na míru, renovace nebo zome: zavolejte a domluvíme prohlídku nebo schůzku.",
    call="Zavolat", map_praha="Praha na mapě", map_batina="Batina na mapě",
    foot_offer="Nabídka", foot_company="Firma",
    foot_links=["Nábytek bez formaldehydu", "Skříně na míru bez dřevotřísky", "Renovace", "Stavba nových zomes"],
    foot_company_links=["Postup", "Prodejna Batina", "Časté otázky"],
    registry="Výpis z obchodního rejstříku",
    legal="FASTO s.r.o., IČO 252 65 474, sídlo Loretánské náměstí 109/3, Hradčany, 118 00 Praha 1. Zapsána v obchodním rejstříku vedeném Městským soudem v Praze, oddíl C, vložka 353965.",
    hero_alt="Vizualizace zome s dřevěným rámem u rybníka",
)

T["en"] = dict(
    title="Non-toxic furniture and fitted wardrobes without chipboard – Fasto",
    description="Furniture with no added formaldehyde and fitted wardrobes without chipboard. Renovations and zome construction in Czechia, Croatia and Liberland. Shop in Batina.",
    skip="Skip to content", home="Fasto, home", menu="Menu", nav_label="Main", lang_label="Language",
    nav=["Furniture", "Wardrobes", "Renovation", "Zomes", "Shop", "News"],
    news_eyebrow="News", news_title="What’s new", news_photos="photos", news_open="Open gallery", news_photo="Photo",
    lb_close="Close", lb_prev="Previous photo", lb_next="Next photo",
    cta_short="Enquire",
    eyebrow="Furniture · Fitted wardrobes · Renovation · Zomes",
    h1=["Furniture", "that isn’t", "toxic."],
    lead="We design and make interior furniture with no added formaldehyde and fitted wardrobes without chipboard. We renovate flats and houses and build new zomes – in Czechia, in Croatia and in Liberland.",
    cta_main="Request a quote", cta_zomes="See the zomes",
    strip=["Formaldehyde-free furniture", "Fitted wardrobes without chipboard", "Renovation", "New zomes"],
    offers_eyebrow="What we do", offers_title="Three things we do well",
    offers=[
        ("Furniture", "Formaldehyde-free furniture", "Wardrobes, kitchens and shelving made from materials of documented origin, with glues that contain no added formaldehyde.", "See what it’s made of"),
        ("Renovation", "Renovation", "Flats and houses renovated from design to handover, with one contact for the whole job.", "See how it works"),
        ("Zomes", "New zomes", "Domed buildings with a timber frame and glazed panels. We build in Czechia, Croatia and Liberland.", "More about zomes"),
    ],
    mat_eyebrow="01 · Non-toxic furniture",
    mat_title="Furniture that doesn’t smell of chemicals",
    mat_lead="For every piece we tell you what it is made of and what holds it together. Technical data sheets come with the quote, not on request.",
    mat_note="For us, non-toxic means specific things: no chipboard, glues and finishes with no added formaldehyde, each backed by a technical data sheet or a manufacturer’s declaration. Wood itself contains natural traces of formaldehyde.",
    mat_list=[
        ("Boards and solid wood", "We name the species or board and where it comes from."),
        ("Glues", "Glues with no added formaldehyde, with the manufacturer’s declaration."),
        ("Finishes", "Oils, waxes and lacquers with a technical data sheet."),
        ("Documents", "Technical data sheets are attached to the quote."),
    ],
    tox_eyebrow='Why it matters',
    tox_title='Why formaldehyde is toxic',
    tox_lead='Formaldehyde is part of the urea-formaldehyde resins used to bond chipboard and other composite boards. It is gradually released from them into the air as a gas – most of all from new furniture and in warm or humid rooms. Its effect on health depends on the concentration in the air and how long you are exposed.',
    tox_short_tag='Short-term effects',
    tox_short_title='At higher indoor concentrations',
    tox_short=[('Irritated mucous membranes', 'burning, stinging and watering eyes, irritated nose and throat.'), ('Breathing problems', 'coughing, shortness of breath, wheezing or a tight chest.'), ('Skin reactions', 'allergic dermatitis and rashes in more sensitive people.'), ('Neurological symptoms', 'headaches, nausea and unusual tiredness.')],
    tox_long_tag='Long-term effects',
    tox_long_title='With prolonged breathing',
    tox_long=[('Airways', 'even lower concentrations can lead to asthma or make its symptoms worse, especially in children.'), ('Cancer', 'The WHO’s International Agency for Research on Cancer (IARC) classifies formaldehyde as carcinogenic to humans (Group 1). Long-term exposure raises the risk of nasopharyngeal cancer and is associated with a higher risk of leukaemia. This mainly concerns long-term occupational exposure in industry, but at home it is still sensible to keep concentrations as low as possible.')],
    tox_tips_title='How to lower the risk at home',
    tox_tips=[('Ventilate', 'Air out new chipboard furniture or flooring thoroughly for the first few weeks.'), ('Check emission classes', 'Choose materials in emission class E1 (the European standard), or better, E0 or no added formaldehyde.'), ('Mind the climate', 'Keep rooms on the cooler side with moderate humidity. Heat and humidity speed up the release considerably.'), ('Seal the surfaces', 'Every edge of a chipboard panel, including hidden ones at the back of wardrobes, should be edged, laminated or lacquered.')],
    tox_source='Source of the classification: <a href="https://monographs.iarc.who.int/list-of-classifications/" rel="noopener">IARC Monographs, list of classifications</a>.',
    tox_cta_text='The simplest way is not to bring formaldehyde home at all. That is why our fitted wardrobes contain no chipboard.',
    tox_cta='Wardrobes without chipboard',
    faq_extra=('Why is formaldehyde harmful?', 'At higher concentrations it irritates the eyes, nose and airways and can cause headaches. Long-term inhalation is linked to asthma, and the WHO’s IARC classifies formaldehyde as carcinogenic to humans (Group 1).'),
    sk_eyebrow="Fitted wardrobes",
    sk_title="Fitted wardrobes without chipboard",
    sk_lead="Chipboard is held together by resins that often contain formaldehyde, which can be released into the room’s air for years. That is why our fitted wardrobes use no chipboard at all.",
    sk_list=[
        ("Made for your space", "Built-in wardrobes for alcoves, under sloping ceilings or wall to wall. We measure on site."),
        ("Solid wood, not chipboard", "Carcass and doors in solid wood and boards of documented composition."),
        ("No added formaldehyde", "Glues, oils and waxes with a technical data sheet for every material."),
        ("Made and fitted", "We make, deliver and install. One contact from measuring to handover."),
    ],
    sk_cta="Ask about a fitted wardrobe",
    ren_eyebrow="02 · Renovation",
    ren_title='Renovation from design <span class="accent-pond">to handover</span>',
    ren_lead="We renovate flats and houses. We visit first, then propose a solution and run the job through to handover. You have one contact for the whole job.",
    ren_list=[
        ("Site visit", "We come, measure and listen to what you need."),
        ("Design and price", "We send a design and a budget with the materials."),
        ("Build", "We manage the works and trades, and make the furniture ourselves."),
        ("Handover", "We hand over the finished interior with the material documents."),
    ],
    z_eyebrow="03 · New zomes",
    z_title='Domes of wood <span class="accent-leaf">and light</span>',
    z_lead="A zome has a timber frame of rhombuses, glazed panels and a dark standing-seam roof. We build them by the water, in gardens or as shared spaces – in Czechia, in Croatia and in Liberland.",
    z_alt="Zome with a rhombus timber frame, glazed panels and a dark standing-seam roof in a meadow by a pond",
    z_caption="Visualisation of a zome by a pond",
    z_facts=[("Frame", "timber, rhombus pattern"), ("Roof", "dark, standing seam"), ("Where we build", "Czechia, Croatia, Liberland")],
    z_plan_title="From plan to build", z_plan_text="Plan of a community with domes, sample drawing.",
    z_plan_alt="Sepia masterplan of a community with domes",
    steps_eyebrow="Process", steps_title="How a job runs",
    steps=[
        ("Enquiry", "Call us or drop by the shop and tell us what you need."),
        ("Design and quote", "We look at the space and send a design with the price and data sheets."),
        ("Making and building", "We make, repair or build as agreed."),
        ("Handover", "We hand over the finished work and the material documents."),
    ],
    loc_eyebrow="Find us", loc_title="Prague and our shop in Batina",
    loc_lead="You can buy the furniture in our shop in Batina, a short way from Liberland. Jobs in Czechia are run from Prague.",
    loc_praha_tag="Czechia", loc_praha_name="Prague", loc_praha_addr="Loretánské náměstí 3<br>118 00 Prague 1",
    loc_batina_alt='The Fasto shop in Batina, Trg slobode 2',
    loc_batina_tag="Croatia", loc_batina_name="Batina shop", loc_batina_addr="Trg slobode 2<br>31300 Batina, Croatia",
    loc_map="Show on map",
    faq_eyebrow="FAQ", faq_title="What people ask us",
    faq=[
        ("Is chipboard furniture toxic?", "Chipboard is bonded with resins that often contain formaldehyde, which can gradually be released into the air. How much depends on the board grade and the age of the furniture. We don’t use chipboard at all, so it is not a question with our furniture."),
        ("What are your fitted wardrobes made of?", "Solid wood and boards of documented composition, with glues and finishes that contain no added formaldehyde. Every material comes with a technical data sheet."),
        ("What exactly does “no added formaldehyde” mean?", "That no formaldehyde was added to the board, glue or finish during manufacture. Wood itself contains natural traces, so we don’t promise “zero emissions”; we document the specific materials instead."),
        ("Where do you build zomes?", "In Czechia, in Croatia and in Liberland. Tell us where you want to build and we will arrange a site visit."),
        ("Where can I buy the furniture?", "In our shop at Trg slobode 2, 31300 Batina, Croatia. For jobs in Czechia, call +420 608 131 130."),
    ],
    close_eyebrow="Contact", close_title="Get in touch.",
    close_lead="Furniture, a fitted wardrobe, a renovation or a zome: call us and we will arrange a visit or a meeting.",
    call="Call", map_praha="Prague on map", map_batina="Batina on map",
    foot_offer="What we do", foot_company="Company",
    foot_links=["Formaldehyde-free furniture", "Fitted wardrobes without chipboard", "Renovation", "New zomes"],
    foot_company_links=["Process", "Batina shop", "FAQ"],
    registry="Czech commercial register entry",
    legal="FASTO s.r.o., Company ID 252 65 474, registered office Loretánské náměstí 109/3, Hradčany, 118 00 Prague 1, Czech Republic. Registered in the Commercial Register kept by the Municipal Court in Prague, Section C, File 353965.",
    hero_alt="Visualisation of a timber-framed zome by a pond",
)

T["hr"] = dict(
    title="Namještaj koji nije toksičan i ormari po mjeri bez iverice – Fasto",
    description="Namještaj bez dodanog formaldehida i ormari po mjeri bez iverice. Renovacije i gradnja zomea u Češkoj, Hrvatskoj i Liberlandu. Prodavaonica u Batini.",
    skip="Preskoči na sadržaj", home="Fasto, početna", menu="Izbornik", nav_label="Glavni", lang_label="Jezik",
    nav=["Namještaj", "Ormari", "Renovacije", "Zomei", "Prodavaonica", "Novosti"],
    news_eyebrow="Novosti", news_title="Što je novo kod nas", news_photos="fotografija", news_open="Otvori galeriju", news_photo="Fotografija",
    lb_close="Zatvori", lb_prev="Prethodna fotografija", lb_next="Sljedeća fotografija",
    cta_short="Upit",
    eyebrow="Namještaj · Ormari po mjeri · Renovacije · Zomei",
    h1=["Namještaj", "koji nije", "toksičan."],
    lead="Projektiramo i izrađujemo namještaj za interijer bez dodanog formaldehida i ormare po mjeri bez iverice. Renoviramo stanove i kuće i gradimo nove zomee – u Češkoj, u Hrvatskoj i u Liberlandu.",
    cta_main="Zatražite ponudu", cta_zomes="Pogledajte zomee",
    strip=["Namještaj bez formaldehida", "Ormari po mjeri bez iverice", "Renovacije", "Gradnja novih zomea"],
    offers_eyebrow="Što radimo", offers_title="Tri stvari koje radimo dobro",
    offers=[
        ("Namještaj", "Namještaj bez formaldehida", "Ormari, kuhinje i police za interijer od materijala dokazanog podrijetla, s ljepilima bez dodanog formaldehida.", "Od čega je izrađen"),
        ("Renovacije", "Renovacije", "Obnova stanova i kuća od projekta do primopredaje, s jednom osobom za kontakt za cijeli posao.", "Kako radimo"),
        ("Zomei", "Gradnja novih zomea", "Kupolaste građevine s drvenim okvirom i ostakljenim poljima. Gradimo u Češkoj, Hrvatskoj i Liberlandu.", "Više o zomeima"),
    ],
    mat_eyebrow="01 · Namještaj koji nije toksičan",
    mat_title="Namještaj koji ne miriše na kemiju",
    mat_lead="Za svaki komad kažemo od čega je izrađen i čime je zalijepljen. Tehničke listove prilažemo uz ponudu, a ne tek na zahtjev.",
    mat_note="Netoksično kod nas znači konkretne stvari: bez iverice, ljepila i površinske obrade bez dodanog formaldehida, sve potkrijepljeno tehničkim listom ili izjavom proizvođača. Drvo samo po sebi sadrži prirodne tragove formaldehida.",
    mat_list=[
        ("Ploče i masiv", "Navodimo vrstu drva ili ploče i njihovo podrijetlo."),
        ("Ljepila", "Ljepila bez dodanog formaldehida, uz izjavu proizvođača."),
        ("Površine", "Ulja, voskovi i lakovi s tehničkim listom."),
        ("Dokumenti", "Tehnički listovi prilog su ponudi."),
    ],
    tox_eyebrow='Zašto je to važno',
    tox_title='Zašto je formaldehid toksičan',
    tox_lead='Formaldehid je sastavni dio urea-formaldehidnih smola kojima se lijepe iverica i druge aglomerirane ploče. Iz njih se postupno otpušta u zrak kao plin – najviše iz novog namještaja te u toplim ili vlažnim prostorijama. Njegov utjecaj na zdravlje ovisi o koncentraciji u zraku i trajanju izloženosti.',
    tox_short_tag='Kratkoročni učinci',
    tox_short_title='Pri višim koncentracijama u prostoriji',
    tox_short=[('Nadražena sluznica', 'peckanje, rezanje i suzenje očiju, nadražen nos i grlo.'), ('Tegobe s disanjem', 'kašalj, otežano disanje, piskanje ili stezanje u prsima.'), ('Reakcije kože', 'kod osjetljivijih osoba alergijski dermatitis i osipi.'), ('Neurološki simptomi', 'glavobolja, mučnina i neuobičajen umor.')],
    tox_long_tag='Dugoročni učinci',
    tox_long_title='Pri dugotrajnom udisanju',
    tox_long=[('Dišni putovi', 'i niže koncentracije mogu dovesti do razvoja astme ili pogoršanja njezinih simptoma, osobito kod djece.'), ('Kancerogenost', 'Međunarodna agencija za istraživanje raka (IARC) pri WHO-u svrstava formaldehid među dokazane kancerogene za ljude (skupina 1). Dugotrajna izloženost povećava rizik od raka nazofarinksa i povezuje se s većim rizikom od leukemije. To se ponajprije odnosi na dugotrajnu profesionalnu izloženost u industriji, no i kod kuće je razumno držati koncentracije što nižima.')],
    tox_tips_title='Kako smanjiti rizik kod kuće',
    tox_tips=[('Prozračujte', 'Novi namještaj od iverice ili podove prvih nekoliko tjedana temeljito prozračujte.'), ('Pratite emisijske klase', 'Birajte materijale emisijske klase E1 (europski standard), još bolje E0 ili bez dodanog formaldehida.'), ('Pazite na klimu', 'Radije nižu temperaturu i umjerenu vlagu. Toplina i vlaga znatno ubrzavaju otpuštanje formaldehida.'), ('Zatvorite površine', 'Svi rubovi ploča od iverice, i oni skriveni na stražnjoj strani ormara, trebaju biti obrubljeni, laminirani ili lakirani.')],
    tox_source='Izvor klasifikacije: <a href="https://monographs.iarc.who.int/list-of-classifications/" rel="noopener">IARC Monographs, popis klasifikacija</a>.',
    tox_cta_text='Najjednostavnije je formaldehid uopće ne unijeti u dom. Zato u našim ormarima po mjeri nema iverice.',
    tox_cta='Ormari bez iverice',
    faq_extra=('Zašto je formaldehid štetan?', 'Pri višim koncentracijama nadražuje oči, nos i dišne putove i može uzrokovati glavobolju. Dugotrajno udisanje povezuje se s astmom, a IARC pri WHO-u svrstava formaldehid među dokazane kancerogene za ljude (skupina 1).'),
    sk_eyebrow="Ormari po mjeri",
    sk_title="Ormari po mjeri bez iverice",
    sk_lead="Iverica se drži zajedno smolama koje često sadrže formaldehid, a on se iz ploče može godinama otpuštati u zrak prostorije. Zato u našim ormarima po mjeri iverice uopće nema.",
    sk_list=[
        ("Točno za vaš prostor", "Ugradbeni ormari u nišu, ispod kosine ili preko cijelog zida. Mjerimo na licu mjesta."),
        ("Masiv umjesto iverice", "Korpus i vrata od masivnog drva i ploča dokazanog sastava."),
        ("Bez dodanog formaldehida", "Ljepila, ulja i voskovi s tehničkim listom za svaki materijal."),
        ("Izrada i montaža", "Izradimo, dovezemo i montiramo. Jedna osoba za kontakt od mjerenja do primopredaje."),
    ],
    sk_cta="Upit za ormar po mjeri",
    ren_eyebrow="02 · Renovacije",
    ren_title='Renovacija od projekta <span class="accent-pond">do primopredaje</span>',
    ren_lead="Renoviramo stanove i kuće. Prvo pregledamo prostor, zatim predložimo rješenje i vodimo posao do primopredaje. Imate jednu osobu za kontakt za cijeli posao.",
    ren_list=[
        ("Pregled", "Dođemo, izmjerimo i saslušamo što vam treba."),
        ("Projekt i cijena", "Pošaljemo projekt i troškovnik s materijalima."),
        ("Izvedba", "Vodimo radove i obrtnike, a namještaj izrađujemo sami."),
        ("Primopredaja", "Predajemo gotov interijer i dokumente o materijalima."),
    ],
    z_eyebrow="03 · Gradnja novih zomea",
    z_title='Kupole od drva <span class="accent-leaf">i svjetla</span>',
    z_lead="Zome ima drveni okvir od rombova, ostakljena polja i tamni krov na falc. Gradimo ga uz vodu, u vrtu ili kao zajednički prostor – u Češkoj, u Hrvatskoj i u Liberlandu.",
    z_alt="Zome s drvenim okvirom od rombova, ostakljenim poljima i tamnim krovom na falc na livadi uz ribnjak",
    z_caption="Vizualizacija zomea uz ribnjak",
    z_facts=[("Okvir", "drveni, od rombova"), ("Krov", "tamni, na falc"), ("Gdje gradimo", "Češka, Hrvatska, Liberland")],
    z_plan_title="Od tlocrta do gradnje", z_plan_text="Tlocrt zajednice s kupolama, oglední nacrt.",
    z_plan_alt="Tlocrt zajednice s kupolama u sepiji",
    steps_eyebrow="Postupak", steps_title="Kako teče posao",
    steps=[
        ("Upit", "Nazovete nas ili svratite u prodavaonicu i kažete što vam treba."),
        ("Projekt i ponuda", "Pregledamo prostor i pošaljemo projekt s cijenom i tehničkim listovima."),
        ("Izrada i izvedba", "Izrađujemo, popravljamo ili gradimo prema dogovoru."),
        ("Primopredaja", "Predajemo gotov rad i dokumente o materijalima."),
    ],
    loc_eyebrow="Gdje smo", loc_title="Prag i prodavaonica u Batini",
    loc_lead="Namještaj možete kupiti u našoj prodavaonici u Batini, nedaleko od Liberlanda. Poslove u Češkoj vodimo iz Praga.",
    loc_praha_tag="Češka", loc_praha_name="Prag", loc_praha_addr="Loretánské náměstí 3<br>118 00 Prag 1, Češka",
    loc_batina_alt='Prodavaonica Fasto u Batini, Trg slobode 2',
    loc_batina_tag="Hrvatska", loc_batina_name="Prodavaonica Batina", loc_batina_addr="Trg slobode 2<br>31300 Batina",
    loc_map="Prikaži na karti",
    faq_eyebrow="Česta pitanja", faq_title="Što nas pitate",
    faq=[
        ("Je li namještaj od iverice toksičan?", "Iverica se lijepi smolama koje često sadrže formaldehid, a on se iz nje može postupno otpuštati u zrak. Količina ovisi o klasi ploče i starosti namještaja. Mi ivericu uopće ne koristimo, pa kod našeg namještaja to nije pitanje."),
        ("Od čega izrađujete ormare po mjeri?", "Od masivnog drva i ploča dokazanog sastava, s ljepilima i površinskom obradom bez dodanog formaldehida. Uz svaki materijal prilažemo tehnički list."),
        ("Što točno znači „bez dodanog formaldehida“?", "Da ploča, ljepilo ni površinska obrada ne sadrže formaldehid dodan u proizvodnji. Drvo samo sadrži prirodne tragove, zato ne obećavamo „nulte emisije“, nego dokumentiramo konkretne materijale."),
        ("Gdje gradite zomee?", "U Češkoj, u Hrvatskoj i u Liberlandu. Javite nam gdje želite graditi i dogovorit ćemo pregled zemljišta."),
        ("Gdje mogu kupiti namještaj?", "U prodavaonici na adresi Trg slobode 2, 31300 Batina. Za poslove u Češkoj nazovite +420 608 131 130."),
    ],
    close_eyebrow="Kontakt", close_title="Javite nam se.",
    close_lead="Namještaj, ormar po mjeri, renovacija ili zome: nazovite nas i dogovorit ćemo pregled ili sastanak.",
    call="Nazovite", map_praha="Prag na karti", map_batina="Batina na karti",
    foot_offer="Ponuda", foot_company="Tvrtka",
    foot_links=["Namještaj bez formaldehida", "Ormari po mjeri bez iverice", "Renovacije", "Gradnja novih zomea"],
    foot_company_links=["Postupak", "Prodavaonica Batina", "Česta pitanja"],
    registry="Izvadak iz češkog trgovačkog registra",
    legal="FASTO s.r.o., matični broj (IČO) 252 65 474, sjedište Loretánské náměstí 109/3, Hradčany, 118 00 Prag 1, Češka. Upisano u trgovački registar Gradskog suda u Pragu, odjel C, uložak 353965.",
    hero_alt="Vizualizacija zomea s drvenim okvirom uz ribnjak",
)

# Fixed non-breaking spaces after one-letter prepositions and conjunctions (Czech and Croatian typography).
NBSP_RE = re.compile(r"(?<![\w&;<])([ksvzouaiKSVZOUAI]) ")


def nbsp(value, lang):
    if lang == "en":
        return value
    if isinstance(value, str):
        return NBSP_RE.sub(r"\1&nbsp;", value)
    if isinstance(value, (list, tuple)):
        return type(value)(nbsp(v, lang) for v in value)
    return value


ACCENT = ' class="accent-timber"'


def attr(s):
    return html.escape(strip_tags(s))


def strip_tags(s):
    return html.unescape(re.sub(r"<[^>]+>", " ", s)).replace("\xa0", " ").replace("  ", " ").strip()


def json_ld(lang, t, url):
    data = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "HomeAndConstructionBusiness",
                "@id": BASE + "#fasto",
                "name": "Fasto",
                "legalName": "FASTO s.r.o.",
                "url": url,
                "logo": BASE + "assets/fasto-logo-charcoal.svg",
                "image": BASE + "assets/zome-u-rybnika.webp",
                "description": t["description"],
                "telephone": PHONE,
                "taxID": "25265474",
                "address": {
                    "@type": "PostalAddress",
                    "streetAddress": "Loretánské náměstí 109/3",
                    "postalCode": "118 00",
                    "addressLocality": "Praha",
                    "addressCountry": "CZ",
                },
                "areaServed": [
                    {"@type": "Country", "name": "Czech Republic"},
                    {"@type": "Country", "name": "Croatia"},
                    {"@type": "Place", "name": "Liberland"},
                ],
                "knowsAbout": [strip_tags(x) for x in t["strip"]],
                "sameAs": ["https://or.justice.cz/ias/ui/rejstrik-firma.vysledky?subjektId=119037&typ=UPLNY"],
            },
            {
                "@type": "FurnitureStore",
                "@id": BASE + "#batina",
                "name": "Fasto – " + strip_tags(t["loc_batina_name"]),
                "brand": {"@type": "Brand", "name": "Fasto"},
                "url": url + "#prodejna",
                "image": BASE + "assets/prodejna-batina.webp",
                "address": {
                    "@type": "PostalAddress",
                    "streetAddress": "Trg slobode 2",
                    "postalCode": "31300",
                    "addressLocality": "Batina",
                    "addressCountry": "HR",
                },
            },
            {
                "@type": "FAQPage",
                "inLanguage": lang,
                "mainEntity": [
                    {
                        "@type": "Question",
                        "name": strip_tags(q),
                        "acceptedAnswer": {"@type": "Answer", "text": strip_tags(a)},
                    }
                    for q, a in [t["faq"][0], t["faq_extra"], *t["faq"][1:]]
                ],
            },
        ],
    }
    return json.dumps(data, ensure_ascii=False, indent=1).replace("</", "<\\/")


NEWS = json.loads((HERE / "news" / "news.json").read_text(encoding="utf-8"))
CATEGORIES = json.loads((HERE / "news" / "categories.json").read_text(encoding="utf-8"))
MONTHS_EN = ["January", "February", "March", "April", "May", "June", "July",
             "August", "September", "October", "November", "December"]
PIN = ('<svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" '
       'd="M12 2a7 7 0 0 0-7 7c0 5.2 7 13 7 13s7-7.8 7-13a7 7 0 0 0-7-7zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5z"/></svg>')


def fmt_date(iso, lang):
    y, m, d = (int(x) for x in iso.split("-"))
    if lang == "en":
        return f"{d} {MONTHS_EN[m - 1]} {y}"
    return f"{d}. {m}. {y}" + ("." if lang == "hr" else "")


def pick(field, lang):
    """A translated field, falling back to Czech when a translation is empty."""
    return (field.get(lang) or field.get("cs") or "").strip()


def render_news(lang, t, R):
    items = sorted(NEWS.get("items", []), key=lambda i: i.get("date", ""), reverse=True)
    if not items:
        return ""
    cards = []
    for n, it in enumerate(items):
        title = html.escape(pick(it["title"], lang))
        paras = [html.escape(p.strip()) for p in pick(it.get("text", {}), lang).split("\n\n") if p.strip()]
        text = "".join(f"<p>{nbsp(p.replace(chr(10), '<br>'), lang)}</p>" for p in paras)
        cat = CATEGORIES.get(it.get("category"), CATEGORIES["obecne"])
        loc = html.escape(it.get("location", "").strip())
        imgs = it.get("images", [])
        gallery = ""
        if imgs:
            shown = imgs[:5]
            thumbs = []
            for k, im in enumerate(shown):
                alt = html.escape(im.get("alt", {}).get(lang) or f'{pick(it["title"], lang)} – {t["news_photo"]} {k + 1}')
                more = len(imgs) - len(shown)
                extra = f'<span class="news__more">+{more}</span>' if k == len(shown) - 1 and more > 0 else ""
                thumbs.append(
                    f'<button class="news__shot{" news__shot--main" if k == 0 else ""}" type="button" data-full="{R}{im["src"]}" data-alt="{alt}">'
                    f'<img src="{R}{im["src"]}" width="{im.get("w", 1200)}" height="{im.get("h", 900)}" loading="lazy" alt="{alt}">{extra}</button>'
                )
            hidden = "".join(
                f'<button class="news__shot" type="button" hidden data-full="{R}{im["src"]}" '
                f'data-alt="{html.escape(pick(it["title"], lang))} – {t["news_photo"]} {k + 6}"></button>'
                for k, im in enumerate(imgs[5:])
            )
            gallery = f'<div class="news__gallery" data-count="{len(shown)}">{"".join(thumbs)}{hidden}</div>'
        meta = (f'<span class="tag tag--{cat["color"]}">{html.escape(cat[lang])}</span>'
                f'<time datetime="{it["date"]}">{fmt_date(it["date"], lang)}</time>'
                + (f'<span class="news__loc">{PIN}{loc}</span>' if loc else ""))
        count = f'<p class="news__count">{len(imgs)} {t["news_photos"]}</p>' if len(imgs) > 1 else ""
        cards.append(f'''   <article class="news__item reveal" id="novinka-{html.escape(it["id"])}" style="--d:{min(n, 3) * .08:.2f}s">
    {gallery}
    <div class="news__body">
     <div class="news__meta">{meta}</div>
     <h3 class="news__title">{nbsp(title, lang)}</h3>
     <div class="news__text">{text}</div>
     {count}
    </div>
   </article>''')
    body = "\n".join(cards)
    return f'''<section class="sec sand" id="novinky" aria-labelledby="novinky-title">
 <div class="wrap">
  <span class="eyebrow reveal">{t["news_eyebrow"]}</span>
  <h2 class="display-lg reveal" id="novinky-title" style="--d:.08s">{t["news_title"]}</h2>
  <div class="news">
{body}
  </div>
 </div>
</section>
'''


def lang_redirect(lang):
    """Inline script: send first-time visitors to their language.

    Czech time zone -> Czech, Croatian time zone -> Croatian, anywhere else -> English.
    A language picked with the flags is remembered and wins. Crawlers and navigation
    inside the site are never redirected, so every language stays indexable.
    """
    return (
        "(function(){try{"
        f"var cur='{lang}',P={{cs:'/fasto/',en:'/fasto/en/',hr:'/fasto/hr/'}};"
        "if(/bot|crawl|spider|slurp|preview|lighthouse|headless/i.test(navigator.userAgent))return;"
        "var r=document.referrer;if(r&&r.indexOf(location.origin+'/fasto/')===0)return;"
        "var want=null;try{want=localStorage.getItem('fasto-lang')}catch(e){}"
        "if(!P[want]){var tz=Intl.DateTimeFormat().resolvedOptions().timeZone||'';"
        "want=tz==='Europe/Prague'?'cs':tz==='Europe/Zagreb'?'hr':'en'}"
        "if(want!==cur)location.replace(P[want]+location.search+location.hash)"
        "}catch(e){}})();"
    )


def render(lang, path, locale):
    t = {k: nbsp(v, lang) for k, v in T[lang].items()}
    R = "../" * path.count("/")  # relative prefix back to /fasto/
    url = BASE + path
    home = "./" if not R else R

    alternates = "\n".join(
        f'<link rel="alternate" hreflang="{c}" href="{BASE + p}">' for c, p, *_ in LANGS
    ) + f'\n<link rel="alternate" hreflang="x-default" href="{BASE}en/">'
    og_alt = "\n".join(
        f'<meta property="og:locale:alternate" content="{loc}">' for c, p, loc, *_ in LANGS if c != lang
    )

    def flag(c, p, flagfile, label):
        href = (R + p) if (R + p) else "./"
        cur = ' aria-current="true"' if c == lang else ""
        return (f'<a class="flag" href="{href}" hreflang="{c}" lang="{c}" title="{label}"{cur}>'
                f'<img src="{R}assets/flags/{flagfile}.svg" width="24" height="16" alt="{label}"></a>')

    flags = "".join(flag(c, p, f, lbl) for c, p, _, f, lbl in LANGS)
    nav_ids = ["nabytek", "skrine", "renovace", "zomes", "prodejna", "novinky"]
    nav = "\n".join(
        f'    <li><a class="nav__link" href="#{i}">{n}</a></li>' for i, n in zip(nav_ids, t["nav"])
    )
    last = len(t["h1"]) - 1
    h1 = "\n".join(
        f'   <span class="hero__line" style="--i:{i}"><span{ACCENT if i == last else ""}>{w}</span></span>'
        for i, w in enumerate(t["h1"])
    )
    strip_colors = ["timber", "timber-soft", "pond", "leaf"]
    strip_items = "".join(
        f'<span class="strip__item">{s} <i style="background:var(--{c})"></i></span>'
        for s, c in zip(t["strip"], strip_colors)
    )
    offer_meta = [("nabytek", "timber"), ("renovace", "pond"), ("zomes", "leaf")]
    offers = "\n".join(
        f'''   <li class="reveal" style="--d:{.05 + i * .1:.2f}s">
    <a class="offer" href="#{href}" style="--bar:var(--{col})">
     <div class="offer__head" aria-hidden="true"><span class="offer__num">0{i + 1}</span></div>
     <div class="offer__body">
      <span><span class="tag tag--{col}">{tag}</span></span>
      <h3 class="offer__title">{title}</h3>
      <p class="offer__text">{text}</p>
      <span class="offer__more">{more} <span class="arr" aria-hidden="true">→</span></span>
     </div>
    </a>
   </li>'''
        for i, ((href, col), (tag, title, text, more)) in enumerate(zip(offer_meta, t["offers"]))
    )

    def numbered(items, cls=""):
        return "\n".join(
            f'   <li class="reveal" style="--d:{i * .08:.2f}s"><span class="n">0{i + 1}</span><div><b>{a}</b>{b}</div></li>'
            for i, (a, b) in enumerate(items)
        )

    facts = "\n".join(f"    <li><b>{a}</b>{b}</li>" for a, b in t["z_facts"])
    steps = "\n".join(
        f'   <li class="step reveal" style="--d:{i * .12:.2f}s"><span class="k">0{i + 1}</span><h3>{a}</h3><p>{b}</p></li>'
        for i, (a, b) in enumerate(t["steps"])
    )
    faq_items = [t["faq"][0], t["faq_extra"], *t["faq"][1:]]
    faq = "\n".join(
        f'''   <details class="faq__item reveal" style="--d:{i * .06:.2f}s"{" open" if i == 0 else ""}>
    <summary><h3>{q}</h3><span class="faq__icon" aria-hidden="true"></span></summary>
    <div class="faq__a"><p>{a}</p></div>
   </details>'''
        for i, (q, a) in enumerate(faq_items)
    )
    foot_offer_ids = ["nabytek", "skrine", "renovace", "zomes"]
    foot_offer = "\n".join(f'     <li><a href="#{i}">{n}</a></li>' for i, n in zip(foot_offer_ids, t["foot_links"]))
    foot_company_ids = ["postup", "prodejna", "faq"]
    foot_company = "\n".join(f'     <li><a href="#{i}">{n}</a></li>' for i, n in zip(foot_company_ids, t["foot_company_links"]))
    bullets = lambda items: "\n".join(f"     <li><b>{a}:</b> {b}</li>" for a, b in items)
    tips = "\n".join(
        f'   <li class="reveal" style="--d:{i * .08:.2f}s"><span class="n">0{i + 1}</span><b>{a}</b><p>{b}</p></li>'
        for i, (a, b) in enumerate(t["tox_tips"])
    )
    phone = PHONE.replace(" ", "&nbsp;")

    return f'''<!doctype html>
<html lang="{lang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>{attr(t["title"])}</title>
<meta name="description" content="{attr(t["description"])}">
<link rel="canonical" href="{url}">
{alternates}
<meta property="og:type" content="website">
<meta property="og:site_name" content="Fasto">
<meta property="og:title" content="{attr(t["title"])}">
<meta property="og:description" content="{attr(t["description"])}">
<meta property="og:url" content="{url}">
<meta property="og:image" content="{BASE}assets/zome-u-rybnika.webp">
<meta property="og:image:alt" content="{attr(t["hero_alt"])}">
<meta property="og:locale" content="{locale}">
{og_alt}
<meta name="twitter:card" content="summary_large_image">
<meta name="theme-color" content="#fbf9f5" media="(prefers-color-scheme: light)">
<meta name="theme-color" content="#1c1b1a" media="(prefers-color-scheme: dark)">
<link rel="icon" href="{R}assets/fasto-stripes-charcoal.svg" type="image/svg+xml">
<link rel="preload" href="{R}fonts/poppins-700-italic.ttf" as="font" type="font/ttf" crossorigin>
<link rel="preload" href="{R}assets/zome-u-rybnika.webp" as="image">
<link rel="stylesheet" href="{R}styles.css">
<script>document.documentElement.classList.add('js')</script>
<script>{lang_redirect(lang)}</script>
<script type="application/ld+json">
{json_ld(lang, T[lang], url)}
</script>
</head>
<body>
<a class="skip" href="#obsah">{t["skip"]}</a>
<div class="progress" aria-hidden="true"></div>

<header class="header">
 <div class="wrap header__in">
  <a class="logo" href="{home}" aria-label="{t["home"]}">
   <img class="on-light" src="{R}assets/fasto-wordmark-charcoal.svg" alt="Fasto" width="116" height="24">
   <img class="on-dark" src="{R}assets/fasto-wordmark-white.svg" alt="Fasto" width="116" height="24">
  </a>
  <nav class="nav" aria-label="{t["nav_label"]}">
   <ul class="nav__links" id="menu">
{nav}
   </ul>
   <div class="flags" role="group" aria-label="{t["lang_label"]}">{flags}</div>
   <button class="menu-btn" type="button" aria-expanded="false" aria-controls="menu">{t["menu"]}</button>
   <a class="btn btn--sm nav__cta" href="#kontakt">{t["cta_short"]}</a>
  </nav>
 </div>
</header>

<main id="obsah">

<section class="hero" aria-labelledby="hero-title">
 <div class="hero__text">
  <span class="eyebrow hero__fade">{t["eyebrow"]}</span>
  <h1 class="display" id="hero-title" style="margin-top:24px">
{h1}
  </h1>
  <p class="lead hero__fade">{t["lead"]}</p>
  <div class="hero__actions hero__fade">
   <a class="btn" href="#kontakt">{t["cta_main"]} <span class="arr" aria-hidden="true">→</span></a>
   <a class="btn btn--ghost" href="#zomes">{t["cta_zomes"]}</a>
  </div>
 </div>
 <div class="hero__art" aria-hidden="true">
  <span class="band band--ink" style="--i:0"></span>
  <span class="band band--ink" style="--i:1"></span>
  <span class="band band--ink" style="--i:2"></span>
  <span class="band band--timber" style="--i:3"></span>
  <span class="band band--pond" style="--i:4"></span>
  <span class="band band--leaf" style="--i:5"></span>
  <span class="band band--soft" style="--i:6"></span>
  <span class="band band--photo" style="--i:7"><img src="{R}assets/zome-u-rybnika.webp" width="1084" height="941" alt=""></span>
 </div>
</section>

<div class="strip" aria-hidden="true">
 <div class="strip__track">{strip_items}{strip_items}</div>
</div>

<section class="sec" id="nabidka" aria-labelledby="nabidka-title">
 <div class="wrap">
  <span class="eyebrow reveal">{t["offers_eyebrow"]}</span>
  <h2 class="display-lg reveal" id="nabidka-title" style="--d:.08s">{t["offers_title"]}</h2>
  <ul class="three">
{offers}
  </ul>
 </div>
</section>

<section class="sec sand" id="nabytek" aria-labelledby="nabytek-title">
 <div class="wrap two">
  <div class="sticky">
   <span class="eyebrow reveal">{t["mat_eyebrow"]}</span>
   <h2 class="display-lg reveal" id="nabytek-title" style="--d:.08s">{t["mat_title"]}</h2>
   <p class="lead reveal" style="--d:.16s">{t["mat_lead"]}</p>
   <p class="note reveal" style="--d:.24s">{t["mat_note"]}</p>
  </div>
  <ol class="list">
{numbered(t["mat_list"])}
  </ol>
 </div>
</section>

<section class="sec tox surface-ink" id="formaldehyd" aria-labelledby="tox-title">
 <div class="wrap">
  <span class="eyebrow reveal">{t["tox_eyebrow"]}</span>
  <h2 class="display-lg reveal" id="tox-title" style="--d:.08s">{t["tox_title"]}</h2>
  <p class="lead reveal" style="--d:.16s">{t["tox_lead"]}</p>
  <div class="tox__grid">
   <article class="tox__card reveal" style="--d:.1s">
    <span class="tag tag--timber">{t["tox_short_tag"]}</span>
    <h3>{t["tox_short_title"]}</h3>
    <ul class="tox__list">
{bullets(t["tox_short"])}
    </ul>
   </article>
   <article class="tox__card reveal" style="--d:.2s">
    <span class="tag tag--danger">{t["tox_long_tag"]}</span>
    <h3>{t["tox_long_title"]}</h3>
    <ul class="tox__list">
{bullets(t["tox_long"])}
    </ul>
   </article>
  </div>
  <h3 class="tox__tips-title reveal">{t["tox_tips_title"]}</h3>
  <ol class="tox__tips">
{tips}
  </ol>
  <p class="tox__source reveal">{t["tox_source"]}</p>
  <div class="tox__cta reveal">
   <p>{t["tox_cta_text"]}</p>
   <a class="btn" href="#skrine">{t["tox_cta"]} <span class="arr" aria-hidden="true">→</span></a>
  </div>
 </div>
</section>

<section class="sec skrine" id="skrine" aria-labelledby="skrine-title">
 <div class="skrine__bg" aria-hidden="true"></div>
 <div class="wrap two">
  <div class="sticky">
   <span class="eyebrow reveal">{t["sk_eyebrow"]}</span>
   <h2 class="display-lg reveal" id="skrine-title" style="--d:.08s">{t["sk_title"]}</h2>
   <p class="lead reveal" style="--d:.16s">{t["sk_lead"]}</p>
   <div class="reveal" style="--d:.24s;margin-top:32px"><a class="btn" href="#kontakt">{t["sk_cta"]} <span class="arr" aria-hidden="true">→</span></a></div>
  </div>
  <ol class="list">
{numbered(t["sk_list"])}
  </ol>
 </div>
</section>

<section class="sec sand" id="renovace" aria-labelledby="renovace-title">
 <div class="wrap two">
  <div class="sticky">
   <span class="eyebrow reveal">{t["ren_eyebrow"]}</span>
   <h2 class="display-lg reveal" id="renovace-title" style="--d:.08s">{t["ren_title"]}</h2>
   <p class="lead reveal" style="--d:.16s">{t["ren_lead"]}</p>
  </div>
  <ol class="list list--pond">
{numbered(t["ren_list"])}
  </ol>
 </div>
</section>

<section class="sec zomes" id="zomes" aria-labelledby="zomes-title">
 <div class="wrap two">
  <figure class="reveal">
   <div class="zomes__img"><img src="{R}assets/zome-u-rybnika.webp" width="1084" height="941" loading="lazy" alt="{t["z_alt"]}"></div>
   <figcaption>{t["z_caption"]}</figcaption>
  </figure>
  <div>
   <span class="eyebrow reveal">{t["z_eyebrow"]}</span>
   <h2 class="display-lg reveal" id="zomes-title" style="--d:.08s">{t["z_title"]}</h2>
   <p class="lead reveal" style="--d:.16s">{t["z_lead"]}</p>
   <ul class="facts reveal" style="--d:.24s">
{facts}
   </ul>
   <div class="plan reveal" style="--d:.32s">
    <img src="{R}assets/masterplan-apatin.webp" width="356" height="494" loading="lazy" alt="{t["z_plan_alt"]}">
    <div>
     <span class="tag tag--leaf">{t["offers"][2][0]}</span>
     <h3 class="h3" style="margin-top:12px">{t["z_plan_title"]}</h3>
     <p>{t["z_plan_text"]}</p>
    </div>
   </div>
  </div>
 </div>
</section>

<section class="sec sand" id="postup" aria-labelledby="postup-title">
 <div class="wrap">
  <span class="eyebrow reveal">{t["steps_eyebrow"]}</span>
  <h2 class="display-lg reveal" id="postup-title" style="--d:.08s">{t["steps_title"]}</h2>
  <ol class="steps">
{steps}
  </ol>
 </div>
</section>

<section class="sec" id="prodejna" aria-labelledby="prodejna-title">
 <div class="wrap">
  <span class="eyebrow reveal">{t["loc_eyebrow"]}</span>
  <h2 class="display-lg reveal" id="prodejna-title" style="--d:.08s">{t["loc_title"]}</h2>
  <p class="lead reveal" style="--d:.16s">{t["loc_lead"]}</p>
  <div class="locs">
   <article class="loc loc--main reveal" style="--d:.1s">
    <img class="loc__photo" src="{R}assets/prodejna-batina.webp" width="1400" height="646" loading="lazy" alt="{t["loc_batina_alt"]}">
    <span class="tag tag--timber">{t["loc_batina_tag"]}</span>
    <h3 class="loc__name">{t["loc_batina_name"]}</h3>
    <address>{t["loc_batina_addr"]}</address>
    <a class="btn btn--ghost btn--sm" href="{MAP_BATINA}" rel="noopener">{t["loc_map"]} <span class="arr" aria-hidden="true">→</span></a>
   </article>
   <article class="loc reveal" style="--d:.2s">
    <span class="tag tag--pond">{t["loc_praha_tag"]}</span>
    <h3 class="loc__name">{t["loc_praha_name"]}</h3>
    <address>{t["loc_praha_addr"]}<br><a href="{PHONE_HREF}">{phone}</a></address>
    <a class="btn btn--ghost btn--sm" href="{MAP_PRAHA}" rel="noopener">{t["loc_map"]} <span class="arr" aria-hidden="true">→</span></a>
   </article>
  </div>
 </div>
</section>

{render_news(lang, t, R)}
<section class="sec" id="faq" aria-labelledby="faq-title">
 <div class="wrap two faq">
  <div class="sticky">
   <span class="eyebrow reveal">{t["faq_eyebrow"]}</span>
   <h2 class="display-lg reveal" id="faq-title" style="--d:.08s">{t["faq_title"]}</h2>
  </div>
  <div class="faq__list">
{faq}
  </div>
 </div>
</section>

<section class="close surface-ink" id="kontakt" aria-labelledby="kontakt-title">
 <div class="close__bars" aria-hidden="true"></div>
 <div class="wrap close__in">
  <span class="eyebrow reveal">{t["close_eyebrow"]}</span>
  <h2 class="reveal" id="kontakt-title" style="--d:.08s">{t["close_title"]}</h2>
  <p class="reveal" style="--d:.16s">{t["close_lead"]}</p>
  <div class="close__actions reveal" style="--d:.24s">
   <a class="btn" href="{PHONE_HREF}">{t["call"]} {phone} <span class="arr" aria-hidden="true">→</span></a>
   <a class="btn btn--ghost" href="{MAP_BATINA}" rel="noopener">{t["map_batina"]}</a>
  </div>
  <address class="reveal" style="--d:.32s">Fasto · {t["loc_batina_name"]}, Trg slobode 2, 31300 Batina · {t["loc_praha_name"]}, Loretánské náměstí 3</address>
 </div>
</section>

</main>

<footer class="footer">
 <div class="wrap">
  <div class="footer__grid">
   <div>
    <span class="logo" style="height:32px">
     <img class="on-light" src="{R}assets/fasto-logo-charcoal.svg" alt="Fasto s.r.o." width="185" height="32">
     <img class="on-dark" src="{R}assets/fasto-logo-white.svg" alt="Fasto s.r.o." width="185" height="32">
    </span>
    <p>{t["loc_praha_addr"]}<br>tel.: <a href="{PHONE_HREF}">{phone}</a></p>
    <p style="margin-top:12px">{t["loc_batina_name"]}<br>{t["loc_batina_addr"]}</p>
   </div>
   <div>
    <h2>{t["foot_offer"]}</h2>
    <ul>
{foot_offer}
    </ul>
   </div>
   <div>
    <h2>{t["foot_company"]}</h2>
    <ul>
{foot_company}
     <li><a href="{REGISTRY}" rel="noopener">{t["registry"]}</a></li>
    </ul>
    <div class="flags flags--foot" role="group" aria-label="{t["lang_label"]}">{flags}</div>
   </div>
  </div>
  <p class="footer__legal">{t["legal"]}</p>
 </div>
</footer>

<dialog class="lightbox" aria-label="{t["news_open"]}">
 <button class="lightbox__close" type="button" aria-label="{t["lb_close"]}">×</button>
 <button class="lightbox__nav lightbox__prev" type="button" aria-label="{t["lb_prev"]}">←</button>
 <figure class="lightbox__fig"><img alt=""><figcaption></figcaption></figure>
 <button class="lightbox__nav lightbox__next" type="button" aria-label="{t["lb_next"]}">→</button>
</dialog>

<script src="{R}site.js"></script>
</body>
</html>
'''


def main():
    for lang, path, locale, *_ in LANGS:
        out = HERE / path / "index.html"
        out.parent.mkdir(parents=True, exist_ok=True)
        out.write_text(render(lang, path, locale), encoding="utf-8")
        print("wrote", out.relative_to(HERE.parent))


if __name__ == "__main__":
    main()
