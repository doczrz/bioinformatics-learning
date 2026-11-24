# 0.4 | Python-code leren lezen en begrijpen: de basissyntaxis

Stel dat je Codex een tabel geeft met kwaliteitsmaten per cel en vraagt welke cellen je kunt behouden. Codex geeft de volgende Python-code:

In dit voorbeeld is `cell_metadata.csv` een fictieve tabel met celmetadata. Elke rij staat voor een cel die nog door de kwaliteitscontrole moet. `cell_id` identificeert de cel, `sample_id` het biologische monster. `n_genes` is het aantal gedetecteerde genen in die cel. `percent_mito` geeft aan welk percentage van de totale tellingen aan mitochondriale genen is toegewezen. De waarde `10` betekent dus 10%, niet 0,10. De veldnamen en drempels gelden voor deze oefening. Controleer ze voor echte gegevens aan de hand van de objectdocumentatie, het experimentele protocol en de eenheden.

```python
from pathlib import Path

import pandas as pd

metadata_path = Path("cell_metadata.csv")
cells = pd.read_csv(metadata_path)

required_columns = {"cell_id", "sample_id", "n_genes", "percent_mito"}
missing_columns = required_columns - set(cells.columns)
if missing_columns:
    raise ValueError(f"Missing required columns: {sorted(missing_columns)}")

keep = (
    cells["n_genes"].notna()
    & cells["percent_mito"].notna()
    & (cells["n_genes"] >= 500)
    & (cells["percent_mito"] < 10)
)

filtered_cells = cells.loc[keep].copy()
average_genes = filtered_cells["n_genes"].mean()
print(average_genes)
```

We gebruiken deze code in de hele les als voorbeeld. We bekijken achtereenvolgens de volgende punten:

- De gegevens komen uit `cell_metadata.csv`.
- `cells`, `missing_columns`, `keep` en `filtered_cells` verwijzen naar objecten in verschillende stadia.
- Inspringing bepaalt of `raise` tot het `if` blok behoort.
- De filtervoorwaarden bepalen samen welke rijen worden behouden en hoe ontbrekende waarden worden verwerkt.
- De buitenste haakjes laten een lange voorwaarde meerdere regels overspannen, terwijl de haakjes rond de vergelijkingsexpressies ervoor zorgen dat `&` de rij-voor-rij resultaten combineert zoals bedoeld.
- `.loc`, `.copy()` en `.mean()` voeren respectievelijk selectie, kopiëren en berekening uit.
- `500` en `10` zijn drempels die een onderzoeker nog moet beoordelen tegen de huidige gegevens.

Alleen als je deze aanwijzingen in gewone taal kunt uitleggen, kun je beoordelen of de code het juiste bestand leest, de juiste kolommen gebruikt of een redelijk biologisch signaal verwijdert alsof het gegevens van lage kwaliteit zijn.

Het doel van deze les is niet om je Python syntaxis te laten onthouden of een programma uit het geheugen te reproduceren zonder documentatie. Je moet code-leesvaardigheid ontwikkelen: wanneer je Python-code ziet, moet je in staat zijn om te identificeren waar gegevens binnenkomen, hoe ze veranderen, waar de output naartoe gaat en welke rekenkundige beslissingen de verantwoordelijkheid van de onderzoeker blijven.

Deze les gaat ervan uit dat je al weet dat Python een programmeertaal is die vaak wordt gebruikt voor gegevensverwerking, automatisering en bioinformatica-analyse, en dat pakketten en projektomgevingen van invloed zijn op of code kan worden uitgevoerd. U hoeft vooraf geen software te installeren en er is geen programmeerervaring vereist.

De codeblokken in deze les zijn voornamelijk bedoeld om te lezen; je hoeft ze nu niet uit te voeren. Als je mee wilt doen, bevestig dan eerst waar de code zal draaien: een interactieve Python-interpreter, een script met de `.py` extensie of een Jupyter notebook. Een bestandsnaam zonder volledig pad, zoals `"cell_metadata.csv"`, wordt opgezocht ten opzichte van de huidige werkmap. In Python kun je `Path.cwd()` gebruiken om die locatie te zien.

Bij je eerste lezing kun je het materiaal in twee niveaus verdelen:

- **Dit moet je begrijpen:** inspringing, namen en toewijzing, veelgebruikte gegevenstypen, lijsten en dictionaries, indexering en slicing, functies en methoden, vergelijkingen en logische voorwaarden, ontbrekende waarden, imports en het filteren van tabellen.
- **Voorlopig is herkennen genoeg:** list comprehensions, generatoren, contextmanagers, decorators, klassen, typeannotaties, NumPy-arrays, ijle matrices en AnnData. Kom je zo’n constructie tegen, vraag de AI dan om uitleg of raadpleeg de officiële documentatie.

Als dit je eerste lezing is, volg dan vier korte paden door de les. Begrijp eerst uitvoeringslocaties, de delen van een coderegel en inspringing. Vervolgens begrijp je namen, objecten, basistypen, lijsten, woordenboeken en sets. Ga vervolgens naar functies, methoden, import, gewone logica en rij-voor-rij pandas logica. Lees ten slotte de secties over ontbrekende waarden en DataFrame-filtering, gevolgd door het volledige voorbeeld aan het einde. Bij een eerste doorgang hoef je alleen tuples, `while`, lijstbegrip en de gedetailleerde lijst van risicovolle bewerkingen te herkennen; je hoeft ze niet uit het hoofd te leren of op te schrijven.

Met uitzondering van de sectie die het openingsvoorbeeld volledig voorleest, zijn de kortere codeblokken in deze les voornamelijk fragmenten die afhankelijk zijn van objecten die eerder zijn geïntroduceerd. Ga er niet vanuit dat elk fragment een compleet script is dat op zichzelf kan draaien.

## Ook bij ‘vibe coding’ moet je Python kunnen lezen

"Vibe coding" is een informele term. Het betekent meestal het beschrijven van een taak in natuurlijke taal en AI laten genereren, wijzigen en uitvoeren van de code, zonder dat de gebruiker elke instructie karakter voor karakter hoeft te typen.

Deze manier van werken vermindert echt de last van het onthouden van syntaxis. U kunt Codex vragen om:

- Python-code genereren voor een taak;
- Een traceback uitleggen, wat het aanroeppad is dat wordt getoond wanneer er een fout optreedt;
- Herhaalde stappen organiseren in een script;
- Zoeken waar een naam is toegewezen of gewijzigd;
- Functieargumenten controleren tegen de officiële documentatie;
- Voer code uit en toon belangrijke tussentijdse resultaten.

Daarom is het vermogen om alles vanaf nul te schrijven niet langer de enige maatstaf van analytische vaardigheid.

Natuurlijke taalverzoeken worden echter nog steeds omgezet in exacte bewerkingen. Een computer begrijpt niet automatisch het experimentele ontwerp achter "verwijder cellen van lage kwaliteit". Het voert alleen een voorwaarde uit zoals "behoud rijen waar `n_genes >= 500` en `percent_mito < 10`." Als AI een kolomnaam, percentage-eenheid, ontbrekende waarde of vergelijkingsrichting verkeerd begrijpt, kan de code nog steeds met succes worden uitgevoerd.

Om die reden vraagt deze cursus beginners om te voldoen aan de volgende standaard:

> Je hoeft Python niet uit je hoofd te schrijven, maar je moet wel belangrijke code kunnen vertalen naar gewone taal en controleren of die vertaling overeenkomt met de onderzoeksvraag.

Dit betekent niet dat je elk intern mechanisme in Python moet begrijpen. U kunt beginnen met het leren van de meest voorkomende structuren in analysecode en de documentatie raadplegen wanneer dat nodig is.

## Waar wordt de Python-code uitgevoerd?

Dezelfde Python-code kan op verschillende plaatsen verschijnen. De uitvoeringslocatie is van invloed op de manier waarop u het invoert, de werkmap, welke objecten al bestaan en hoe resultaten worden weergegeven.

### De interactieve interpreter

Het invoeren van `python`, of `python3` op sommige systemen, in een terminal kan de interactieve Python-interpreter starten. Een veelvoorkomende prompt is:

```text
>>>
```

In een tutorial betekent `>>>` "input begint hier"; het is geen onderdeel van de code. Kopieer de prompt niet wanneer u een voorbeeld kopieert.

In de interactieve interpreter zal het direct invoeren van een expressie meestal het resultaat weergeven:

```python
2 + 3
```

```text
5
```

In een `.py`-script verschijnt een resultaat niet vanzelf doordat er een uitdrukking op een regel staat. Wilt u de uitvoer kunnen zien, gebruik dan `print()`, schrijf het resultaat naar een log of sla het expliciet in een bestand op.

### Een Python-script

Een tekstbestand met de extensie `.py` wordt gewoonlijk een Python-script genoemd. Bijvoorbeeld:

```text
filter_cells.py
```

Een script is geschikt voor het opslaan van een reeks stappen die herhaaldelijk kunnen worden uitgevoerd. Het terminalopdracht kan zijn:

```text
python filter_cells.py
```

Dit is een terminalopdracht en mag niet in een Python-code blok geplaatst worden. Of het script kan worden uitgevoerd hangt ook af van welke Python de terminal daadwerkelijk aanroept, of de vereiste pakketten zijn geïnstalleerd in de huidige omgeving en of de huidige werkdirectory correct is.

### Een Jupyter-notebook

Een Jupyter-notebook verdeelt de code over cellen die u afzonderlijk kunt uitvoeren. Dat is handig wanneer u gegevens stap voor stap verkent. De uitvoervolgorde kan daarbij afwijken van de volgorde op de pagina.

Een naam die alleen in het geheugen van de huidige kernel bestaat, verdwijnt wanneer u de kernel herstart. Voert u een cel onderaan uit en wijzigt u daarna een eerdere cel, dan kunt u uit de volgorde op de pagina niet meer aflezen in welke volgorde de code is uitgevoerd.

Controleer daarom bij het beoordelen van een notitieboek:

- of het in orde kan draaien vanuit een nieuwe kernel;
- Welke cel maakt eerst elke naam aan;
- Of downstream resultaten worden herberekend na een upstream cel veranderingen;
- Of belangrijke resultaten alleen in het geheugen bestaan.

### De versie en de werkmap controleren

Het volgende is een terminalopdracht:

```text
python --version
```

Het volgende is Python-code:

```python
import sys
from pathlib import Path

print(sys.version)
print(Path.cwd())
```

Ga er niet vanuit dat een codevenster de versie en omgeving gebruikt die je verwacht, alleen omdat de titel "Python" zegt. De versie, het interpreterpad, de projectomgeving en de werkmap kunnen allemaal van invloed zijn op het resultaat.

## De onderdelen van een regel Python-code

Overweeg deze regel:

```python
average_genes = filtered_cells["n_genes"].mean()
```

Je kunt het van rechts naar links lezen:

1. `filtered_cells["n_genes"]`: neem de kolom genaamd `n_genes` uit de tabel;
2. `.mean()`: roep de methode aan die door die kolom wordt aangeboden om het gemiddelde te berekenen;
3. `=`: bind het resultaat rechts aan de naam links;
4. `average_genes`: gebruik deze naam om later naar het berekende resultaat te verwijzen.

In gewone taal:

> Neem de kolom `n_genes` uit de gefilterde celtabel, bereken het gemiddelde en laat de naam `average_genes` verwijzen naar dat resultaat.

U kunt functienamen en methodeparameters opzoeken in de documentatie, maar u moet nog steeds de input, actie en resultaat kunnen uitleggen.

## Inspringing: hoe Python codeblokken herkent

Veel programmeertalen geven met accolades aan welke regels bij elkaar horen. In Python ziet u aan de inspringing aan het begin van een regel tot welk codeblok die behoort.

```python
if cell_count == 0:
    print("No cells are available for analysis")

print("Check complete")
```

Deze code betekent:

- Als `cell_count == 0` de waarde `True` heeft, wordt de ingesprongen `print()` uitgevoerd.
- De laatste regel staat weer op het buitenste niveau en wordt in beide gevallen uitgevoerd.

De dubbele punt `:` aan het einde van de regel met `if` kondigt een codeblok aan. Geef regels op hetzelfde niveau binnen dat blok dezelfde inspringing. Gebruikelijk zijn vier spaties per niveau.

De volgende twee stukjes code kunnen allebei geldige Python zijn, maar ze betekenen verschillende dingen.

```python
if cell_count == 0:
    print("No cells are available for analysis")
    raise ValueError("The filtering result is empty")
```

```python
if cell_count == 0:
    print("No cells are available for analysis")

raise ValueError("The filtering result is empty")
```

Het eerste fragment stopt het programma alleen als het aantal cellen nul is. Het tweede stopt het programma altijd. Als een AI de inspringing wijzigt, kan de code dus op een ander moment worden uitgevoerd zonder dat er een syntaxisfout optreedt.

Gebruik in een bestand niet afwisselend tabs en spaties om in te springen. Sommige combinaties veroorzaken een `TabError`. Het kan ook lijken alsof regels in de editor gelijk inspringen terwijl ze in werkelijkheid op andere niveaus staan dan u bedoelde.

## Namen, objecten en toewijzing

Getallen, tekst, lijsten, functies en tabellen in Python kunnen allemaal als objecten worden behandeld. Een naam laat code weer verwijzen naar een object.

```python
gene_name = "MS4A1"
cell_count = 1200
```

Hier:

- `"MS4A1"` is een string object;
- `1200` is een integer object;
- `gene_name` en `cell_count` zijn namen;
- `=` voert de toewijzing uit, waarbij de naam links verwijst naar het object rechts.

Python vereist niet dat je verklaart dat "deze naam vanaf nu alleen een integer kan bevatten." Dezelfde naam kan opnieuw worden toegewezen:

```python
cell_count = 1200
cell_count = "1200"
```

Na de tweede regel verwijst `cell_count` naar de tekst `"1200"`. Het getal `1200` en een tekenreeks met die vier tekens gedragen zich anders in berekeningen. De toewijzing is geldig, maar een volgende bewerking kan een andere uitkomst of een fout opleveren.

### `=` wijst toe, `==` vergelijkt

```python
cell_count = 1200
cell_count == 1200
```

De eerste regel kent een waarde toe aan een naam. De tweede vergelijkt twee waarden en levert `True` op als ze gelijk zijn of `False` als ze verschillen.

Controleer bij het beoordelen van een aandoening vooral of AI `=` met `==` heeft verward.

### Het verschil tussen opnieuw toewijzen en kopiëren

```python
genes = ["MS4A1", "CD3D"]
selected_genes = genes
selected_genes.append("NKG7")
```

Nu verwijzen `genes` en `selected_genes` naar dezelfde lijst. Als u de lijst via de ene naam wijzigt, ziet u die wijziging ook wanneer u de andere naam gebruikt.

```python
print(genes)
```

```text
['MS4A1', 'CD3D', 'NKG7']
```

Als je een aparte buitenste lijst nodig hebt, maak de kopie expliciet:

```python
selected_genes = genes.copy()
```

De elementen in dit voorbeeld zijn onveranderlijke tekenreeksen. Als u een nieuw gen aan de kopie `selected_genes` toevoegt, blijft `genes` dus intact. Wel kopieert `list.copy()` alleen de buitenste lijst. Bevat de lijst zelf weer veranderlijke objecten, dan kunnen beide lijsten nog naar diezelfde objecten verwijzen.

Een bruikbaar eerste beeld van toewijzing is dat een object er een naam bij krijgt. Het geheugenbeheer van Python omvat meer dan dat. Onthoud vooral dat u bij een veranderlijk object met `a = b` nog geen zelfstandige kopie krijgt die u los van het origineel kunt wijzigen.

## Commentaar, tekenreeksen en opgemaakte tekst

### Tekst na `#` is meestal commentaar

```python
# Lees de celmetadata in
cells = pd.read_csv("cell_metadata.csv")
```

Een opmerking wordt niet uitgevoerd als onderdeel van de berekening, maar opmerkingen kunnen verouderd raken. Als de code en een commentaar niet overeenkomen, oordeel dan op basis van de code die daadwerkelijk wordt uitgevoerd, de objectstructuur en het resultaat in plaats van alleen het commentaar te vertrouwen.

Als `#` tussen aanhalingstekens verschijnt, is het gewoon een deel van een tekenreeks:

```python
color = "#2855c5"
```

### Tekenreeksen staan tussen aanhalingstekens

```python
gene_name = "MS4A1"
sample_name = 'sample_A'
```

Zowel enkele als dubbele aanhalingstekens kunnen gewone tekenreeksen voorstellen. Als je aanhalingstekens toevoegt rond cijfers, worden deze omgezet in tekst:

```python
threshold_number = 500
threshold_text = "500"
```

Met `threshold_number` kunt u rechtstreeks getallen vergelijken. `threshold_text` bevat tekst. Controleer ook na het inlezen van een CSV-bestand of elke kolom het verwachte type heeft.

### Met een f-string voeg je waarden in tekst in

```python
cell_count = 1200
message = f"Retained {cell_count} cells"
print(message)
```

Het `f` voorvoegsel betekent dat `{cell_count}` in de string wordt vervangen door zijn huidige waarde.

```text
Retained 1200 cells
```

Een f-string is handig voor logs en foutmeldingen. De inhoud tussen haakjes wordt nog steeds uitgevoerd, dus behandel deze niet als statische tekst.

## Basistypen: getallen, tekst, waarheidswaarden en de afwezigheid van een waarde

| Type | Voorbeeld | Wat stelt de waarde voor? |
| --- | --- | --- |
| `int` | `1200` | Een geheel getal |
| `float` | `7.5` | Een getal met een decimaal deel |
| `str` | `"MS4A1"` | Een tekenreeks, dus tekst |
| `bool` | `True`, `False` | De logische waarden waar en onwaar |
| `NoneType` | `None` | De speciale Python-waarde die aangeeft dat een object ontbreekt |

U kunt `type()` gebruiken om het type van een object te inspecteren:

```python
print(type(1200))
print(type("1200"))
```

```text
<class 'int'>
<class 'str'>
```

In echte analyses zul je ook typen tegenkomen die door NumPy en pandas worden geleverd, zoals `int64`, `float64`, `category` en null string types. Ze zijn niet noodzakelijk identiek aan Python's ingebouwde types. Bevestig voorlopig eerst of een object numeriek, tekstueel, logisch of ontbrekend is en of dat type geschikt is voor de huidige berekening.

### Het verschil tussen typeconversie en gegevenscontrole

```python
cell_count = int("1200")
```

Dit converteert de tekst `"1200"` naar een geheel getal. Echter:

```python
cell_count = int("twelve hundred")
```

Hij haalt een `ValueError` op.

Zelfs een succesvolle conversie bewijst niet dat de oorspronkelijke waarde biologisch redelijk is. Het omzetten van `"999999"` naar een geheel getal bewijst niet automatisch dat de steekproef echt zoveel cellen bevat.

## Containers: meerdere waarden groeperen

### Lijst (`list`)

Een lijst gebruikt haakjes, behoudt de volgorde van elementen en kan worden gewijzigd.

```python
marker_genes = ["MS4A1", "CD3D", "NKG7"]
```

Veelvoorkomende operaties omvatten:

```python
marker_genes.append("LYZ")
gene_count = len(marker_genes)
```

`.append()` wijzigt de oorspronkelijke lijst; `len()` retourneert het aantal elementen.

### Tuple (`tuple`)

Een tuple gebruikt meestal haakjes en laat je niet toe om de elementen te vervangen op dezelfde manier als een lijst nadat deze is gemaakt.

```python
matrix_shape = (1200, 20000)
```

Dit kan betekenen dat een matrix 1.200 rijen en 20.000 kolommen heeft. Zoek in de documentatie en de code op of de rijen cellen en de kolommen genen voorstellen, of juist andersom. Dat volgt niet uit de twee aantallen.

### Dictionary (`dict`)

Een woordenboek koppelt een sleutel aan een waarde.

```python
sample_to_group = {
    "sample_A": "control",
    "sample_B": "treated",
}
```

Een waarde ophalen door sleutel:

```python
group = sample_to_group["sample_A"]
```

Als de sleutel niet bestaat, wordt bij het opzoeken tussen vierkante haken een `KeyError` gegenereerd. Sommige code maakt gebruik van `.get()`:

```python
group = sample_to_group.get("sample_C")
```

Vindt `.get()` de sleutel niet, dan geeft het standaard `None` terug. Zo ontstaat er misschien geen directe foutmelding, maar kan de ontbrekende informatie onopgemerkt naar een volgende stap gaan. Controleer wat de code met de teruggegeven `None` doet.

### Verzameling (`set`)

Een set slaat unieke elementen op en wordt meestal geschreven met haakjes.

```python
required_columns = {"cell_id", "sample_id", "n_genes", "percent_mito"}
observed_columns = {"cell_id", "n_genes", "sample_id"}
missing_columns = required_columns - observed_columns
```

Hier betekent het minteken het verschil instellen. `missing_columns` bevat kolommen die verplicht zijn, maar niet worden nageleefd:

```text
{'percent_mito'}
```

Een set is niet geschikt om een rijvolgorde uit te drukken die moet worden behouden. Als de uitvoervolgorde van invloed is op een resultaat of record, sorteer deze dan expliciet.

## Indexeren en slicen: Python telt doorgaans vanaf 0

### Eén element op positie selecteren

```python
genes = ["MS4A1", "CD3D", "NKG7"]
first_gene = genes[0]
last_gene = genes[-1]
```

De resultaten zijn:

```text
MS4A1
NKG7
```

Met `[0]` selecteert u het eerste element. Met `[-1]` telt u vanaf het einde en selecteert u het laatste. Vraagt u een niet-bestaande positie op, dan krijgt u een `IndexError`.

### Bij een slice telt de beginpositie doorgaans mee en de eindpositie niet

```python
genes[0:2]
```

Het resultaat bevat de eerste twee elementen:

```text
['MS4A1', 'CD3D']
```

De slice `0:2` komt overeen met het interval `[0, 2)`. De posities 0 en 1 vallen erin, positie 2 valt erbuiten.

```python
genes[:2]
genes[1:]
```

Laat u de begingrens weg, dan begint de slice bij het eerste element. Laat u de eindgrens weg, dan loopt de slice door tot en met het laatste element.

### In pandas selecteren op label of op positie

Voor een pandas-tabel geldt:

- Met `.loc[...]` selecteert u vooral op rijlabels, kolomlabels of logische voorwaarden.
- Met `.iloc[...]` selecteert u op posities, aangegeven met gehele getallen.

```python
cells.loc[keep, ["cell_id", "n_genes"]]
cells.iloc[:5, :2]
```

De eerste regel selecteert rijen op basis van een voorwaarde en kiest twee kolommen op naam. De tweede selecteert op positie de eerste vijf rijen en de eerste twee kolommen.

De grenzen in `.loc[0:2]` zijn labels. Een bereik van labels kan ook het eindlabel bevatten en volgt dus andere regels dan een gewone positionele slice in Python. Controleer de indexlabels en de documentatie van het object.

## Functies: invoer verwerken en resultaten teruggeven

```python
rounded_value = round(7.456, ndigits=2)
```

Deze lijn bevat:

- De functie van `round`;
- Eerste input doorgegeven aan de functie: `7.456`;
- Parameternaam: `ndigits`;
- Waarde die voor die parameter is verstrekt: `2`;
- Gegeven resultaat: `7.46`;
- De naam die het resultaat opslaat: `rounded_value`.

Een parameter is een invoernaam in een functiedefinitie. De waarde die daadwerkelijk wordt geleverd bij het aanroepen van een functie wordt vaak een argument genoemd. Op een inleidend niveau is het belangrijker om te identificeren "welke input controleert welk gedrag" dan om de terminologie uit het hoofd te leren.

### Positionele argumenten en sleutelwoordargumenten

```python
rounded_value = round(7.456, 2)
rounded_value = round(7.456, ndigits=2)
```

Beide lijnen kunnen hetzelfde resultaat opleveren. De tweede schrijft de parameternaam expliciet en is vaak gemakkelijker te lezen.

Echter, niet elke parameter kan vrij worden gewijzigd in trefwoordvorm. Voordat u een functie van derden aanroept, controleert u de functiehandtekening en officiële documentatie voor de huidige versie.

### Een terugkeerwaarde opslaan of expliciet tonen

```python
average_genes = filtered_cells["n_genes"].mean()
print(average_genes)
```

De eerste regel slaat het berekende resultaat op en de tweede toont het.

Als u alleen schrijft:

```python
filtered_cells["n_genes"].mean()
```

Het resultaat wordt meestal weergegeven in een interactieve interpreter of aan het einde van een notitieboekcel. Een script moet niet vertrouwen op deze automatische weergave. Een betrouwbare analyse moet belangrijke resultaten expliciet opslaan, afdrukken, loggen of schrijven.

In pandas gebruikt `Series.mean()` standaard `skipna=True`. Ontbrekende waarden tellen dan niet mee bij het gemiddelde. In dit voorbeeld eist het filter al dat `n_genes` een waarde heeft. Blijven er geen rijen over, dan verschijnt `NaN` als gemiddelde en valt er geen gemiddelde te interpreteren. Controleer eerst of `filtered_cells.empty` gelijk is aan `False` en leg het aantal behouden rijen vast. De uitkomst is een numerieke scalair. Of die uit Python, NumPy of pandas komt, hangt af van het kolomtype en de softwareversie.

### Bij een eigen functie eerst kijken naar invoer, terugkeerwaarde en neveneffecten

```python
def keep_high_gene_cells(table, minimum_genes):
    keep = table["n_genes"].notna() & (table["n_genes"] >= minimum_genes)
    return table.loc[keep].copy()
```

Bij het lezen van de functie, zoek eerst:

1. De functienaam na `def`;
2. de invoerparameters tussen haakjes;
3. Wat de ingesprongen code doet;
4. Wat `return` retourneert;
5. Of de functie ook een extern object, bestand of omgeving wijzigt.

Ook zonder `return` kan een functie een bestand schrijven, een meegegeven object wijzigen of de globale toestand veranderen. Let bij het lezen ook op die effecten.

## Methoden en attributen: wat betekent de punt achter een object?

```python
cells.columns
cells["n_genes"].notna()
```

Beide lijnen gebruiken een punt, maar ze betekenen verschillende dingen.

- `.columns` is een attribuut dat informatie bevat die door het object wordt gedragen; hier bevat het de kolomlabels.
- `.notna()` is een methode, een operatie die door het object wordt geleverd en hier wordt aangeroepen.

Het meest zichtbare verschil is dat methode-aanroepen meestal haakjes hebben, terwijl attribuuttoegang dat meestal niet heeft.

Je kunt echter geen wetenschappelijke betekenis afleiden uit haakjes alleen. Gebruik het objecttype en de documentatie om precies te bepalen wat een attribuut of methode retourneert.

### Een methode met dezelfde naam kan per type anders werken

```python
genes.copy()
cells.copy()
```

Als `genes` een Python-lijst is, roept de eerste regel een lijstmethode aan. Als `cells` een pandas-DataFrame is, roept de tweede een pandas-methode aan. Beide heten `.copy()`. Wat precies wordt gekopieerd en hoe diep die kopie gaat, hangt af van het objecttype.

Bij het lezen van `object.method()` moet je daarom eerst het type van het object links van de stip bepalen.

Ook `DataFrame.copy()` maakt niet van elk onderdeel recursief een kopie. Zo worden Python-objecten in een kolom van het type `object` niet recursief gekopieerd. Bij een oppervlakkige kopie met bijvoorbeeld `deep=False` spelen de pandas-versie en het gedrag van Copy-on-Write mee. Ziet u `.copy()`, bepaal dan het type van het object links van de punt en raadpleeg de documentatie van de gebruikte versie.

## Modules, pakketten en `import`

Python organiseert herbruikbare code in modules en pakketten.

```python
from pathlib import Path
import pandas as pd
```

De eerste regel betekent: `Path` importeren uit de standaard-bibliotheek module `pathlib`.

Het tweede betekent: importeer het pakket `pandas` van derden en gebruik de korte naam `pd` in de huidige code.

Daarom:

```python
pd.read_csv("cell_metadata.csv")
```

Dit betekent het aanroepen van de `read_csv()` functie geleverd door pandas.

### Veelgebruikte manieren om te importeren

```python
import pandas
import pandas as pd
from pathlib import Path
```

Ze creëren niet precies dezelfde namen:

- Na `import pandas` schrijf je normaal gesproken `pandas.read_csv(...)`;
- Na `import pandas as pd` schrijf je normaal gesproken `pd.read_csv(...)`;
- Na `from pathlib import Path`, kunt u `Path(...)` direct schrijven.

### Het verschil tussen een pakket installeren en importeren

`python -m pip install pandas` is een terminalopdracht dat een softwareomgeving verandert, en deze les vereist niet dat je het uitvoert. Je moet overwegen om een installatieopdracht alleen uit te voeren nadat je bevestigd hebt dat deze `python` de interpreter is die gebruikt wordt door de doel projectomgeving. `import pandas` is Python-code die een reeds geïnstalleerd pakket in het huidige Python proces laadt.

Als installatie en uitvoering verschillende Python omgevingen gebruiken, kan het zijn dat je na een succesvolle installatie nog steeds het volgende ziet:

```text
ModuleNotFoundError: No module named 'pandas'
```

In die situatie moet je eerst het pad van de interpreter en de projectomgeving bevestigen in plaats van een reeks verschillende installatieopdracht's te proberen.

## Vergelijkingen en logische voorwaarden

### Veelgebruikte vergelijkingsoperatoren

| Schrijfwijze | Betekenis |
| --- | --- |
| `x == y` | Zijn de waarden gelijk? |
| `x != y` | Zijn de waarden verschillend? |
| `x < y` | Is `x` kleiner dan `y`? |
| `x <= y` | Is `x` kleiner dan of gelijk aan `y`? |
| `x > y` | Is `x` groter dan `y`? |
| `x >= y` | Is `x` groter dan of gelijk aan `y`? |

Een vergelijking produceert meestal `True` of `False`.

```python
n_genes = 800
n_genes >= 500
```

Het resultaat is:

```text
True
```

### Afzonderlijke voorwaarden combineren met `and`, `or` en `not`

```python
n_genes = 800
percent_mito = 6.5

keep = n_genes >= 500 and percent_mito < 10
```

Dit is geschikt voor twee afzonderlijke logische waarden.

```python
has_cells = True
has_required_columns = False

ready = has_cells and has_required_columns
```

`ready` is `False`.

### Met `in` nagaan of een element voorkomt in een verzameling

```python
gene_name = "MS4A1"
marker_genes = ["MS4A1", "CD3D", "NKG7"]

is_marker = gene_name in marker_genes
```

Voor een woordenboek controleert `in` standaard sleutels, niet waarden:

```python
"sample_A" in sample_to_group
```

### Met `is None` controleren of een object `None` is

```python
sample_name = None

if sample_name is None:
    print("Sample name is missing")
```

Met `is` controleert u of twee verwijzingen hetzelfde object aanduiden. Vergelijk getallen of tekenreeksen op waarde met `==`. Dat een identiteitstest in één geval dezelfde uitkomst geeft, maakt `is` nog niet geschikt voor een waardevergelijking.

Onderscheid bij het filteren met pandas twee structuren. Een DataFrame is een tweedimensionale tabel met rijen, kolommen en labels. Een Series bevat één dimensie met gegevens en heeft een index. Selecteert u één kolom van een DataFrame, dan krijgt u meestal een Series. Bij één getal levert `n_genes >= 500` doorgaans één `bool` op. De vergelijking `cells["n_genes"] >= 500` levert een logische Series op met één waarde per tabelrij.

## Waarom gebruiken filters in pandas `&` in plaats van `and`?

Wanneer u een hele kolom vergelijkt:

```python
cells["n_genes"] >= 500
```

Het resultaat bevat een logische waarde voor elke rij. U krijgt dus een hele kolom met antwoorden in plaats van één `True` of `False`.

```text
0     True
1    False
2     True
dtype: bool
```

Om twee kolomvoorwaarden rij voor rij te combineren, gebruikt pandas meestal:

- `&`: element-wise "en"
- `|`: element-wijs "of"
- `~`: element-wise "niet"

```python
keep = (
    (cells["n_genes"] >= 500)
    & (cells["percent_mito"] < 10)
)
```

Zet elke vergelijking afzonderlijk tussen haakjes. Daardoor worden eerst de vergelijkingen uitgevoerd en kan de voorrang van de operatoren de bedoelde betekenis niet veranderen.

Kopieer het volgende formulier niet rechtstreeks naar een pandas-kolomfilter:

```python
keep = cells["n_genes"] >= 500 and cells["percent_mito"] < 10
```

`and` heeft voor de hele kolom één waarheidswaarde nodig. Omdat een Series een waarde per rij bevat, meldt pandas doorgaans dat de waarheidswaarde van de Series niet eenduidig is.

Bekijk wat er aan weerszijden van de operator staat. Om twee logische kolommen per rij te combineren gebruikt u doorgaans `&`. Gaat het om twee losse booleaanse waarden, dan gebruikt u meestal `and`, ook in een script dat met pandas werkt.

## Ontbrekende waarden: het verschil tussen `None`, `NaN` en `pd.NA`

Reële gegevens kunnen ontbrekende waarden op verschillende manieren weergeven:

- `None` is de speciale Python-waarde waarmee wordt aangegeven dat er geen object als resultaat of invoer beschikbaar is.
- `NaN` wordt in numerieke gegevens vaak gebruikt om een ontbrekende waarde aan te duiden.
- `pd.NA` is de aanduiding voor een ontbrekende waarde bij bepaalde pandas-typen die ontbrekende waarden ondersteunen.
- `NaT` komt vaak voor als aanduiding voor een ontbrekende datum of tijd.

Gebruik geen gewone gelijkheidsvergelijkingen als een universele test voor al deze ontbrekende waarden.

```python
value = None
value is None
```

Voor pandas-objecten, gemeenschappelijke vormen zijn:

```python
cells["n_genes"].isna()
cells["n_genes"].notna()
```

Besteed bijzondere aandacht aan het volgende:

- Een lege tekenreeks `""` wordt niet door elke controle automatisch als ontbrekend aangemerkt.
- Of de tekenreeks `"NA"` bij het inlezen als ontbrekende waarde geldt, kan afhangen van de inleesinstellingen.
- oneindigheid is niet hetzelfde als een gewone ontbrekende waarde;
- Of een ontbrekende waarde moet worden verwijderd, gevuld of behouden, moet worden beslist op basis van de betekenis van de gegevens en het analytische doel.

In het kwaliteitscontrole voorbeeld:

```python
cells["n_genes"].notna() & cells["percent_mito"].notna()
```

Deze voorwaarde vereist dat de rij in beide kolommen een bekende waarde heeft. Daarmee ligt de behandeling van ontbrekende waarden vast voordat het filter wordt toegepast.

## DataFrame: een tabel met rijen en kolommen

Een pandas DataFrame is een tweedimensionale tabel. Op een inleidend niveau kun je het als volgt zien:

- Elke rij vertegenwoordigt meestal één waarneming;
- Elke kolom vertegenwoordigt een variabele;
- De rijindex identificeert rijposities of labels;
- Kolomnamen beschrijven wat elke kolom betekent.

Een tabel met celmetagegevens kan bijvoorbeeld het volgende zijn:

| cell_id | sample_id | n_genes | percent_mito |
| --- | --- | ---: | ---: |
| AAAC-1 | sample_A | 900 | 4.1 |
| AAAG-1 | sample_A | 650 | 8.2 |
| AAAT-1 | sample_B | 350 | 3.2 |

Een DataFrame garandeert echter niet automatisch dat "elke rij één cel vertegenwoordigt". Een rij kan in plaats daarvan een monster, gen, ruimtelijke locatie of vergelijking vertegenwoordigen. U moet de gegevensbeschrijving, id's en objectvorm controleren.

### Eerst de structuur bekijken, dan de filtervoorwaarde schrijven

```python
print(cells.shape)
print(cells.columns.tolist())
print(cells.head())
print(cells.dtypes)
```

Deze lijnen helpen u inspecteren, respectievelijk:

- Het aantal rijen en kolommen;
- De kolomnamen;
- de eerste paar rijen;
- Het gegevenstype van elke kolom.

`head()` toont slechts een klein aantal rijen en kan niet bewijzen dat de rest van de tabel geen problemen bevat. Afhankelijk van de taak moet u ook het aantal ontbrekende waarden, unieke id's, dubbele rijen, numerieke bereiken en de verdeling binnen elke steekproef controleren.

### Rijen filteren met `.loc[keep]` en een logische voorwaarde

```python
filtered_cells = cells.loc[keep].copy()
```

Hier:

- `keep` is een logische voorwaarde die overeenkomt met de tabelrijen;
- `.loc[keep]` selecteert rijen waar de voorwaarde waar is;
- `.copy()` maakt expliciet een nieuw DataFrame-object aan, waardoor het gefilterde resultaat gemakkelijker te onderscheiden is van de oorspronkelijke tabel.

Een logische Series wordt via de indexlabels uitgelijnd met het DataFrame. Hier is `keep` opgebouwd uit kolommen van `cells` en hoort het dus bij de rijen van die tabel. Controleer de identificatoren als u het masker op een andere tabel toepast. Dezelfde standaardindex `0, 1, 2, ...` bewijst niet dat de cellen of hun volgorde overeenkomen. Kan pandas de indexen niet uitlijnen, dan kan er een foutmelding volgen. Komen de labels toevallig overeen terwijl ze andere waarnemingen voorstellen, dan kan het filter ongemerkt de verkeerde cellen selecteren.

## `if`, lussen en comprehensies: welke code wordt uitgevoerd?

### `if`: code uitvoeren als aan een voorwaarde is voldaan

```python
if missing_columns:
    raise ValueError(f"Missing required columns: {sorted(missing_columns)}")
```

Een verzameling met minstens één element geldt in een voorwaarde als waar en een lege verzameling als onwaar. De fout treedt hier dus alleen op als er daadwerkelijk een verplichte kolom ontbreekt.

Deze vorm is beknopt, maar een beginner moet het vertalen naar een volledige conditie:

> Stop het programma als `missing_columns` elementen bevat en meld welke kolommen ontbreken.

### `for`: elementen één voor één verwerken

```python
for column_name in ["n_genes", "percent_mito"]:
    print(column_name)
```

Bij elke herhaling verwijst `column_name` naar het volgende element van de lijst. De ingesprongen regels vormen het lichaam van de lus.

Als een lus een lijst, tabel of bestand wijzigt, controleer dan of die wijzigingen accumuleren en of elke iteratie een cel, sample of gen verwerkt.

### `while`: een bewerking herhalen zolang de voorwaarde waar is

```python
attempt = 0

while attempt < 3:
    print(attempt)
    attempt = attempt + 1
```

Blijft de voorwaarde waar, dan kan de lus eindeloos doorgaan. Zoek bij een door AI gegenereerde `while`-lus welke bewerking er uiteindelijk voor zorgt dat de voorwaarde onwaar wordt.

### Eerst een list comprehension leren lezen

```python
uppercase_genes = [gene.upper() for gene in marker_genes]
```

U kunt het uitbreiden als:

```python
uppercase_genes = []

for gene in marker_genes:
    uppercase_genes.append(gene.upper())
```

Een comprehension kan code vereenvoudigen, maar het kan ook meerdere voorwaarden in één regel comprimeren. Als een lijn moeilijk uit te leggen is, vraag je AI dan op een inleidend niveau om het uit te breiden tot een gewone lus voordat je het bekijkt.

## Fouten, waarschuwingen en logberichten onderscheiden

| Verschijnsel | Gebruikelijke betekenis | Controleer eerst |
| --- | --- | --- |
| `SyntaxError` | Python kan de syntaxis van de code niet ontleden | Bekijk de gemelde regel en de regel ervoor. Controleer haakjes, dubbele punten en aanhalingstekens. |
| `IndentationError` of `TabError` | De inspringniveaus kloppen niet | Controleer spaties, tabs en de grenzen van elk codeblok |
| `NameError` | De code gebruikt een naam die nog niet is gedefinieerd | Zoek de regel of notebookcel die de naam had moeten definiëren |
| `TypeError` | De bewerking past niet bij het type van het object | Controleer het werkelijke objecttype en de invoer van de functie |
| `KeyError` | De sleutel ontbreekt in de dictionary of de kolomnaam ontbreekt in de tabel | Toon de sleutels of kolomnamen en controleer de spelling en spaties |
| `FileNotFoundError` | Het bestand is niet gevonden op het opgegeven pad | Controleer de werkmap, het pad en de bestandsnaam |
| `ModuleNotFoundError` | De huidige interpreter kan de module niet vinden | Controleer welke Python-interpreter en welke projectomgeving actief zijn |

Een niet-behandelde uitzondering stopt meestal de huidige uitvoering. De laatste regel van een traceback geeft meestal het type uitzondering en de onmiddellijke uitleg, terwijl de voorafgaande inhoud toont welke bestanden, functies en regels code werden doorlopen.

Geef Codex niet alleen de laatste regel. De volledige traceback, uitvoeringscommando, Python-versie, werkmap en input-objectstructuur bieden meer bewijs voor het lokaliseren van de oorzaak.

Een waarschuwing stopt een programma meestal niet onmiddellijk, maar kan aangeven dat:

- Een interface gaat veranderen;
- een gegevenstype werd automatisch geconverteerd;
- Een berekening heeft een numeriek probleem;
- De huidige bewerking kan een dubbelzinnig resultaat opleveren.

Een log of gewone uitvoer is gewoon informatie die het programma opzettelijk weergeeft; het is niet automatisch een fout. Of het betrouwbaar is, hangt nog steeds af van wat de code heeft vastgelegd en of de belangrijke controles daadwerkelijk zijn uitgevoerd.

## Python-code van AI stapsgewijs controleren

### 1. De uitvoerlocatie en de omgeving controleren

Noteer de Python-versie, het interpreterpad, de projectomgeving, de pakketversies, de script- of notitiebloknaam en de huidige werkmap.

### 2. Alle externe invoer vinden

Zoek naar bewerkingen die gegevens kunnen lezen, zoals:

```python
pd.read_csv(...)
pd.read_excel(...)
Path(...).read_text(...)
open(...)
```

Bevestig het pad, de bestandsindeling, het scheidingsteken, de codering, het voorbeeld en de versie van referentiegegevens.

### 3. Belangrijke namen en de typen van hun objecten noteren

Bijvoorbeeld:

```text
metadata_path → Path, het pad naar het invoerbestand
cells → DataFrame, de oorspronkelijke metadata van de cellen
keep → Series, één waarheidswaarde per rij
filtered_cells → DataFrame, het gefilterde resultaat
average_genes → numerieke scalair, vaak weergegeven als decimaal getal: het gemiddelde aantal gedetecteerde genen over de behouden rijen
```

Als u niet kunt uitleggen waarnaar een naam verwijst, controleert u eerst waar deze is gemaakt, de `type()`, vorm, kolomnamen en een klein aantal voorbeeldwaarden.

### 4. Nagaan waar een object verandert of een naam opnieuw wordt toegewezen

Controleer:

- of dezelfde naam later opnieuw wordt toegewezen;
- of een methode een object op zijn plaats wijzigt;
- of twee namen verwijzen naar hetzelfde veranderlijke object;
- of een notitieboekje afhankelijk is van de oude celstatus;
- Of filteren een nieuw object maakt of het origineel overschrijft.

### 5. Elke voorwaarde in woorden uitdrukken

Vertalen:

```python
(cells["n_genes"] >= 500) & (cells["percent_mito"] < 10)
```

als:

> Behoud een rij alleen als `n_genes` minstens 500 is en `percent_mito` lager is dan 10.

Ga vervolgens verder met vragen over de basis voor de drempels, eenheden, ontbrekende waardebeleid en distributies over steekproeven.

### 6. Bewerkingen vinden die bestanden schrijven, het netwerk gebruiken of de omgeving wijzigen

Zoek naar: Zoeken

```python
to_csv(...)
write_text(...)
unlink(...)
shutil.rmtree(...)
subprocess.run(...)
os.environ[...]
```

Bevestig voor de uitvoering het doelpad, overschrijfgedrag, opdrachtinhoud, downloadbron en verwerking van referenties.

### 7. De belangrijkste tussenresultaten bekijken

Inspecteer minimaal:

- de invoertabelvorm en kolomnamen;
- of identificatiemiddelen uniek zijn;
- het aantal ontbrekende waarden;
- Hoeveel rijen elke voorwaarde op zichzelf behoudt;
- Hoeveel rijen de gecombineerde voorwaarden behouden;
- hoeveel cellen voor elk biologisch monster worden bewaard;
- Of de uitvoerindex overeenkomt met geassocieerde objecten.

Door alleen naar de uiteindelijke plot of het uiteindelijke gemiddelde te kijken, kan niet worden onthuld of een volledige steekproef tijdens een tussenstap is verloren gegaan.

### 8. Tot slot de wetenschappelijke betekenis beoordelen

Succesvolle uitvoering vertelt je alleen dat Python de instructies heeft geaccepteerd. Het bewijst niet automatisch dat:

- de drempelwaarden passen bij het huidige weefsel- en experimentele protocol;
- de percentage-eenheid correct werd begrepen;
- Elke rij vertegenwoordigt echt een cel in plaats van een kern of ruimtelijke locatie;
- er zijn voldoende biologische replicaten om de conclusie te ondersteunen;
- Filtering sluit niet systematisch een celtype uit;
- het referentiegenoom, de annotatie en de kenmerkidentificatoren zijn correct;
- De statistische conclusie beantwoordt de oorspronkelijke biologische vraag.

## Codex om een controleerbare uitleg van Python-code vragen

Een zwak verzoek:

```text
Leg deze Python-code uit.
```

Een verzoek dat gemakkelijker te verifiëren is:

```text
Beoordeel deze Python-code als bio-informatische analyse en licht de keuzes achter de code toe.

1. Leg eerst uit of de code in een terminal, een Python-script of een notebook hoort.
2. Noteer alle externe invoer, uitvoerpaden en bewerkingen die de omgeving wijzigen.
3. Geef voor elke belangrijke naam het objecttype, de dimensies, de index en de kolomnamen.
4. Beschrijf elke filtervoorwaarde in gewone taal en leg uit wat haakjes, ontbrekende waarden en operatoren doen.
5. Maak onderscheid tussen gewone booleaanse waarden in Python en elementsgewijze logische bewerkingen in pandas en NumPy.
6. Geef aan welke regels bestaande objecten wijzigen en welke nieuwe objecten maken.
7. Geef de minimale code om de uitkomst alleen-lezen te controleren, zonder de oorspronkelijke gegevens of bestanden te overschrijven.
8. Controleer belangrijk gedrag in de officiële documentatie voor de gebruikte versies van Python, pandas en de relevante pakketten.
9. Noteer ten slotte welke biologische aannames de onderzoeker zelf moet beoordelen.
```

De AI-verklaring vereist ook verificatie. Objecttypes, functiehandtekeningen, pakketversies, standaardparameters en het gedrag van ontbrekende waarden moeten worden gecontroleerd tegen de werkelijke omgeving en officiële documentatie.

## Welke door AI voorgestelde bewerkingen vragen extra controle?

| Schrijfwijze | Wat kan er gebeuren? | Vraag vóór het uitvoeren |
| --- | --- | --- |
| `data = transformed_data` | Koppelt de naam aan een ander object | Kun je het oorspronkelijke object nog terugvinden? |
| `list_a = list_b` | Beide namen kunnen naar dezelfde wijzigbare lijst verwijzen | Is een latere wijziging via beide namen zichtbaar? |
| `df.drop(..., inplace=True)` | Wijzigt het DataFrame zelf | Moet de oorspronkelijke tabel bewaard blijven? Hoe gedraagt je versie van pandas zich? |
| `df.to_csv(path)` | Schrijft een bestand of overschrijft een bestaand bestand | Kloppen het pad en de keuze voor de indexkolom? Mag een bestaand bestand worden overschreven? |
| `Path(path).unlink()` | Verwijdert een bestand | Heb je het pad gecontroleerd? Is er een reservekopie? |
| `shutil.rmtree(path)` | Verwijdert een map met alle onderliggende bestanden en mappen | Wijst het pad precies naar de map die je wilt verwijderen? |
| `subprocess.run(..., shell=True)` | Voert een opdracht uit via een shell | Bevat de opdracht ongecontroleerde invoer? |
| `pip install ...` | Wijzigt de softwareomgeving | Moet het pakket in de projectomgeving komen en de versie worden vastgelegd? |
| `requests.get(url)` | Haalt gegevens op via het netwerk | Wat zijn de bron, de licentie en de omvang van de gegevens? Hoe controleer je ze? |
| `os.environ["TOKEN"]` | Leest een toegangsgegeven | Kan het op het scherm, in een logboek of in een bestand terechtkomen? |

Niet elk van deze vormen is verkeerd. Ze vereisen sterker bewijs vóór uitvoering omdat ze gegevens, bestanden, omgevingen of externe systemen kunnen wijzigen.

## Het eerste voorbeeld helemaal doorlopen

Stel dat `cell_metadata.csv` precies het volgende bevat:

```csv
cell_id,sample_id,n_genes,percent_mito
AAAC-1,sample_A,900,4.1
AAAG-1,sample_A,650,8.2
AAAT-1,sample_B,350,3.2
AACG-1,sample_B,1200,12.5
AACT-1,sample_B,,2.1
AAGA-1,sample_B,800,
```

De opeenvolgende komma’s in de laatste twee rijen omsluiten velden die daadwerkelijk leeg zijn. Laat ze in het CSV-bestand leeg, zonder er een woord als ‘ontbrekend’ in te schrijven. Met de standaardinstellingen voor het inlezen beschouwt pandas beide lege velden als ontbrekende waarden.

De waarden `500` en `10` in dit voorbeeld zijn fictieve drempels die zijn gekozen om syntaxis te leren; ze zijn geen universele kwaliteitscontrolestandaarden voor één cel. De echte drempels hangen van het weefsel, experimenteel protocol, rangschikkendiepte, cel of kerntype, metrische distributies, en stroomafwaarts doel af.

### Stap 1: de benodigde namen importeren

```python
from pathlib import Path

import pandas as pd
```

- `Path` vertegenwoordigt en inspecteert paden.
- `pd` is de korte naam die deze code gebruikt voor pandas.

### Stap 2: het pad samenstellen en de tabel inlezen

```python
metadata_path = Path("cell_metadata.csv")
cells = pd.read_csv(metadata_path)
```

- `metadata_path` verwijst naar een relatief pad.
- `pd.read_csv()` leest het CSV-bestand.
- `cells` verwijst naar het resulterende DataFrame.

Controleer vóór het uitvoeren `Path.cwd()`, de bestandsnaam, het scheidingsteken en de tekencodering. Ook als het bestand probleemloos is ingelezen, moeten de kolomtypen, de aanduidingen van ontbrekende waarden en de eenheden nog worden gecontroleerd.

### Stap 3: de vereiste kolommen controleren

```python
required_columns = {"cell_id", "sample_id", "n_genes", "percent_mito"}
missing_columns = required_columns - set(cells.columns)
if missing_columns:
    raise ValueError(f"Missing required columns: {sorted(missing_columns)}")
```

- `set(cells.columns)` maakt een verzameling van de kolomnamen die daadwerkelijk in de tabel staan.
- Het verschil van de verzamelingen geeft aan welke verplichte kolomnamen in de tabel ontbreken.
- Bevat die verzameling namen, dan stopt het programma en meldt het welke kolommen ontbreken.
- `sorted()` sorteert de namen zodat ze in de foutmelding leesbaar zijn en steeds in dezelfde volgorde staan.

Als u bevestigt dat kolommen bestaan, worden de gegevenstypen, eenheden, unieke id's of numerieke bereiken niet gevalideerd.

### Stap 4: een filtervoorwaarde voor elke rij opstellen

```python
keep = (
    cells["n_genes"].notna()
    & cells["percent_mito"].notna()
    & (cells["n_genes"] >= 500)
    & (cells["percent_mito"] < 10)
)
```

Voor elke rij, vereisen:

1. `n_genes` ontbreekt niet;
2. `percent_mito` ontbreekt niet;
3. `n_genes` is ten minste 500;
4. `percent_mito` is minder dan 10.

Een rij krijgt in `keep` alleen de waarde `True` als alle vier de voorwaarden voor die rij waar zijn.

### Stap 5: filteren en het resultaat expliciet kopiëren

```python
filtered_cells = cells.loc[keep].copy()
```

Met `.loc[keep]` selecteert u de rijen waarvoor de voorwaarde waar is. Met `.copy()` maakt u een nieuw DataFrame om verder mee te werken. Bij de numerieke gegevens in dit voorbeeld veranderen gewone wijzigingen in de gefilterde tabel de oorspronkelijke tabel niet. De eerder beschreven beperkingen van de kopie blijven gelden.

Verwacht filterresultaat:

| cell_id | sample_id | n_genes | percent_mito |
| --- | --- | ---: | ---: |
| AAAC-1 | sample_A | 900 | 4.1 |
| AAAG-1 | sample_A | 650 | 8.2 |

Er blijven volgens het voorbeeld twee rijen over, beide uit `sample_A`. Van `sample_B` blijft er geen enkele over. Het totale aantal en het gemiddelde kunnen er aannemelijk uitzien, ook als een heel monster wegvalt. Controleer dan de drempels, invoergegevens, eenheden van de metingen en de kwaliteit van dat monster. Valideer bij een analyse van meerdere monsters ook de monster- of bibliotheek-ID’s bij het inlezen. Leg na elke filtervoorwaarde vast hoeveel cellen er per monster overblijven.

### Stap 6: het gemiddelde berekenen en expliciet tonen

```python
average_genes = filtered_cells["n_genes"].mean()
print(average_genes)
```

Het gemiddelde is:

```text
775.0
```

Deze waarde is het rekenkundig gemiddelde van `n_genes` over de twee behouden rijen. Daaruit volgt niet dat de filterregel geschikt is. Het gemiddelde beschrijft ook geen verschillen tussen onafhankelijke biologische monsters.

In dit voorbeeld zijn rijen waarvoor `n_genes` ontbreekt al uitgesloten. Bij het berekenen van een gemiddelde slaat pandas ontbrekende waarden standaard over. Als het filter geen enkele rij behoudt, kan het resultaat `NaN` zijn zonder dat er een foutmelding verschijnt. Controleer daarom eerst hoeveel rijen er overblijven of bekijk `filtered_cells.empty` voordat u het gemiddelde interpreteert.

### Deze code filtert de onderdelen van een echt single-cellobject nog niet samen

Het resultaat is hier alleen een gefilterde metadata tabel. Het filtert niet automatisch:

- de genexpressiematrix;
- Andere lagen, embeddings en grafiekstructuren in AnnData;
- Andere modaliteiten in een multi-omics object met één cel;
- Coördinaten, afbeeldingen en locatie-elementen in ruimtelijke omics;
- Andere resultaten geassocieerd met cel of locatie.

Als de gegevens al in AnnData staan, filtert u normaal het volledige object langs de observatie-as. Een afzonderlijk geëxporteerde en gefilterde `.obs` laat de overige gegevens ongemoeid. Bij selectie op het object zelf worden de overeenkomstige delen van `X`, `layers`, `obsm` en `obsp` tegelijk geselecteerd. Zo’n selectie levert doorgaans een view op. Bepaal op basis van het gedrag van het object of u voor latere wijzigingen `.copy()` nodig hebt.

Houd bij multimodale of ruimtelijke gegevens rekening met de structuur van het object. Niet elk onderdeel heeft een rij per cel of locatie. Op gedeelde beelden, coördinatenstelsels en coördinatentransformaties kunt u hetzelfde booleaanse masker niet zomaar toepassen. De bewerkingen per object komen in latere lessen aan bod.

Gebruik in een echt project gecontroleerde observatie-ID’s die binnen het hele project uniek zijn om bijbehorende gegevens uit verschillende objecten te selecteren. Celbarcodes kunnen terugkomen in andere monsters of bibliotheken. Daarom moet u de barcode meestal combineren met de monster- of bibliotheek-ID. Controleer daarna of de koppeling één-op-één is en of de verzameling identificatoren, het aantal en de volgorde overeenkomen. De rijpositie alleen bewijst niet dat het om dezelfde cel gaat.

## Welke vaardigheden moet je na deze les beheersen?

Wanneer je Python-code tegenkomt, hoef je deze niet vanuit het geheugen te herschrijven, maar je moet tenminste in staat zijn om:

- Terminalopdrachten, interactieve invoer, scripts en notitieblokcellen onderscheiden;
- Inspringing, namen, toewijzing, functies, methoden, attributen, opmerkingen en tekenreeksen herkennen;
- onderscheid maken tussen gewone getallen, tekenreeksen, Booleaanse waarden, `None` en containers;
- Weet dat toewijzing niet noodzakelijkerwijs een mutable object kopieert;
- Het fundamentele verschil begrijpen tussen zero-based indexering, half-open slices, `.loc` en `.iloc`;
- onderscheid maken tussen `=`, `==`, `is None`, `and` en pandas `&`;
- Weet dat `None`, `NaN`, `pd.NA` en lege strings expliciet behandeld moeten worden;
- Traceer invoer, wijzigingen in namen, filtervoorwaarden en uitvoer;
- Bewerkingen vinden die bestanden kunnen overschrijven, een omgeving kunnen wijzigen, een shell kunnen uitvoeren of inloggegevens kunnen uitlezen;
- AI-uitleg te vergelijken met echte objectstructuren, softwareversies en officiële documentatie;
- Uitleggen welke validatiestappen nog ontbreken tussen succesvolle uitvoering en een ondersteunde biologische conclusie.

Nu AI snel code kan genereren, kan het onthouden van syntaxis minder belangrijk worden, maar code begrijpen wordt belangrijker. Hoe sneller de code wordt gegenereerd, hoe belangrijker het is dat iemand bevestigt dat de code de juiste objecten behandelt, de juiste voorwaarden toepast en rekenkundig succes niet verwart met wetenschappelijke ondersteuning.

## Bronnen

1. [Officiële Python tutorial: een informele introductie tot Python, commentaar, toewijzing, strings, lijsten en slicing](https://docs.python.org/3/tutorial/introduction.html)
2. [Officiële Python tutorial: `if`, `for` en functies](https://docs.python.org/3/tutorial/controlflow.html)
3. [Officiële Python tutorial: lijsten, tuples, sets en woordenboeken](https://docs.python.org/3/tutorial/datastructures.html)
4. [Officiële Python tutorial: modules en pakketten](https://docs.python.org/3/tutorial/modules.html)
5. [Officiële Python tutorial: fouten en uitzonderingen](https://docs.python.org/3/tutorial/errors.html)
6. [Python taal referentie: inspringing regels](https://docs.python.org/3/reference/lexical_analysis.html#indentation)
7. [Python standaard bibliotheek: `pathlib`](https://docs.python.org/3/library/pathlib.html)
8. [Officiële pandas gids: indexeren en logisch filteren](https://pandas.pydata.org/docs/user_guide/indexing.html#boolean-indexing)
9. [Officiële pandas documentatie: `DataFrame.loc`](https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.loc.html)
10. [Officiële pandas documentatie: ontbrekende waarden detecteren](https://pandas.pydata.org/docs/reference/api/pandas.notna.html)
11. [Officiële pandas documentatie: `DataFrame.copy`](https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.copy.html)
12. [Python standaard bibliotheek: ondiep en diep kopiëren](https://docs.python.org/3/library/copy.html)
13. [Officiële pandas documentatie: `Series.mean`](https://pandas.pydata.org/docs/reference/api/pandas.Series.mean.html)
14. [Officiële pandas gids: Copy-on-Write](https://pandas.pydata.org/docs/user_guide/copy_on_write.html)
15. [Officiële AnnData documentatie: `AnnData`](https://anndata.readthedocs.io/en/stable/generated/anndata.AnnData.html)
