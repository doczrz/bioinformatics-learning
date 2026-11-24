# 0.3 | R-code leren lezen en begrijpen: de basissyntaxis

Stel dat je Codex een tabel geeft met kwaliteitsmaten per cel en vraagt welke cellen je kunt behouden. Codex geeft de volgende R-code:

```r
cells <- read.csv("cell_metadata.csv")

keep <- !is.na(cells$n_genes) &
  !is.na(cells$percent_mito) &
  cells$n_genes >= 500 &
  cells$percent_mito < 10

filtered_cells <- cells[keep, ]
average_genes <- mean(filtered_cells$n_genes, na.rm = TRUE)
```

Zelfs als je niet van plan bent om deze code zelf te schrijven vanaf een lege pagina, moet je nog steeds kunnen antwoorden:

- Welk bestand leest de code?
- Wat bevatten `cells`, `keep` en `filtered_cells` elk?
- Welke cellen blijven behouden?
- Hoe worden ontbrekende waarden behandeld?
- Wat berekent de laatste regel?
- Waar komen `500` en `10` vandaan en zijn ze geschikt voor uw data?

Als u deze vragen niet kunt beantwoorden, kunt u niet zien of de code de juiste gegevens verwerkt of stilzwijgend cellen verwijdert die behouden hadden moeten blijven.

Het doel van deze les is niet om je R syntaxis te laten onthouden, en zeker niet om je programma's uit het geheugen te laten reproduceren zonder documentatie. Wat je moet ontwikkelen is het vermogen om code te lezen: wanneer je een stukje R-code ziet, moet je kunnen identificeren waar data binnenkomt, hoe ze veranderen, waar de resultaten naartoe gaan en welke analytische beslissingen de verantwoordelijkheid van de onderzoeker blijven.

Deze les gaat ervan uit dat je al weet dat R een omgeving is voor statistische berekeningen en gegevensanalyse, en dat pakketten en projectomgevingen van invloed zijn op of code kan worden uitgevoerd. U hoeft vooraf geen software te installeren en er is geen programmeerervaring vereist.

De codeblokken in deze les zijn voornamelijk bedoeld om te lezen; je hoeft ze nu niet uit te voeren. Als je mee wilt doen, voer dan de R-code uit in de R-console of een R-script. Een bestandsnaam zonder een volledig pad, zoals `"cell_metadata.csv"`, wordt opgezocht ten opzichte van de huidige werkmap. Je kunt eerst `getwd()` uitvoeren om te zien waar die directory is.

Bij je eerste lezing kun je het materiaal in twee niveaus verdelen:

- **Dit moet je begrijpen:** objecten, toewijzing, functies, dataframes, indexering, logische voorwaarden, `NA` en filteren.
- **Voorlopig is herkennen genoeg:** het herhalen van vectorwaarden (recycling), ijle matrices, `[[]]`, verschillende pipe-operatoren, naamruimten, lussen en zelfgeschreven functies. Kom je een van deze constructies tegen, vraag de AI dan om uitleg of raadpleeg de officiële documentatie.

## Ook bij ‘vibe coding’ moet je de code kunnen lezen

"Vibe coding" is een informele term. Het verwijst meestal naar het beschrijven van een taak in natuurlijke taal en het laten genereren, wijzigen en uitvoeren van de code door AI, zonder dat de gebruiker elke instructie karakter voor karakter hoeft te typen.

Deze manier van werken vermindert echt de last van het onthouden van syntaxis. U kunt Codex vragen om:

- R-code genereren voor een taak;
- Een fout uitleggen;
- Herhaalde stappen organiseren in een script;
- Zoek waar een object is gemaakt of gewijzigd;
- Functieargumenten controleren tegen de documentatie;
- Voer code uit en toon tussentijdse resultaten.

Het vermogen om alles vanaf nul te schrijven is dus niet langer de enige maatstaf voor analytisch vermogen.

Een natuurlijke taalverzoek moet echter nog steeds worden omgezet in precieze rekenkundige bewerkingen. Een computer kan een vage intentie zoals "cellen van lage kwaliteit verwijderen" niet begrijpen. Het kan alleen een expliciete voorwaarde uitvoeren, zoals "verwijder rijen waar `n_genes < 500`". Als AI een kolomnaam, gegevenseenheid, ontbrekende waarde of vergelijkingsrichting verkeerd begrijpt, kan de code nog steeds zonder fout worden uitgevoerd.

Daarom vraagt deze cursus beginners om te voldoen aan de volgende standaard:

> Je hoeft geen code uit het geheugen te schrijven, maar je moet wel in staat zijn om de sleutelcode te vertalen naar gewone taal en te controleren of die vertaling overeenkomt met de onderzoeksvraag.

Dit betekent niet dat je elk intern mechanisme van R moet begrijpen. Net zoals het lezen van een Engelstalig artikel niet vereist dat je eerst een taalkundige wordt, kan het lezen van analysecode beginnen met de meest voorkomende structuren, terwijl je documentatie raadpleegt wanneer dat nodig is.

## De onderdelen van een regel R-code

Overweeg deze regel:

```r
average_genes <- mean(cells$n_genes, na.rm = TRUE)
```

Je kunt het van rechts naar links lezen:

1. Met `cells$n_genes` haalt u de kolom `n_genes` uit `cells`.
2. `mean(...)` roept de functie aan die het gemiddelde berekent.
3. Door `na.rm = TRUE` tellen ontbrekende waarden bij de berekening van het gemiddelde niet mee.
4. `<-` kent het resultaat rechts van de pijl toe aan de naam links ervan.
5. `average_genes` is de naam waaronder u het resultaat terugvindt.

In gewone taal:

> Neem uit de celtabel de kolom met het aantal gedetecteerde genen. Bereken het gemiddelde over de beschikbare waarden en bewaar het resultaat onder de naam `average_genes`.

Dit soort vertaling is de kern van het lezen van code. Je kunt een functienaam opzoeken en Codex vragen naar een argument, maar je moet de input, actie, voorwaarden en resultaat kunnen uitleggen.

## Objecten: gegevens en resultaten een naam geven in R

R noemt de dingen die het aanmaakt en bewerkt objecten. Een getal, een stuk tekst, een tabel, een matrix, een functie en een complexe verzameling gegevens van afzonderlijke cellen kunnen allemaal objecten zijn.

```r
gene_name <- "MS4A1"
cell_count <- 1200
analysis_ready <- TRUE
```

Deze code creëert drie objecten:

| Object | Opgeslagen waarde | Gebruikelijke betekenis |
| --- | --- | --- |
| `gene_name` | `"MS4A1"` | Tekst |
| `cell_count` | `1200` | Getal |
| `analysis_ready` | `TRUE` | Logische waarde |

R maakt onderscheid tussen hoofdletters en kleine letters. Daardoor zijn `cell_count`, `Cell_Count` en `CELL_COUNT` drie verschillende namen.

Een objectnaam moet de lezer helpen de inhoud te begrijpen. `cell_metadata` is meestal makkelijker te beoordelen dan `x`, en `filtered_cells` is meestal licht te volgen dan `result2`. Korte namen kunnen redelijk zijn in een formule of een zeer korte tijdelijke berekening, maar ze verhogen het risico dat een lange analysewerkstroom verkeerd wordt geïnterpreteerd.

## Toewijzing met `<-`: een resultaat een naam geven

```r
cell_count <- 1200
```

Lees de toewijzingsoperator `<-` als ‘bewaar de waarde rechts van de pijl onder de naam links ervan’. U schrijft eerst `<` en direct daarna `-`.

R laat ook `=` toe voor toewijzing op vele plaatsen, maar een gemeenschappelijke conventie is:

- `<-` gebruiken om een object aan te maken of bij te werken;
- Gebruik `=` om een argument binnen een functie aan te geven.

```r
average_genes <- mean(cells$n_genes, na.rm = TRUE)
```

Deze conventie maakt het gemakkelijker om onderscheid te maken tussen "het resultaat opslaan" en "een functieargument instellen".

Toewijzing kan een bestaand object overschrijven, meestal zonder opnieuw te vragen:

```r
threshold <- 500
threshold <- 1000
```

Na de tweede regel bevat `threshold` de waarde `1000`. Let bij het lezen van door AI gegenereerde code op latere toewijzingen waardoor dezelfde naam een andere waarde krijgt.

## Commentaar, aanhalingstekens en haakjes

### Tekst na `#` is commentaar

```r
# Hier staat een toelichting. R voert deze regel niet uit.
threshold <- 500  # Voorlopige drempelwaarde voor dit voorbeeld
```

Alles vanaf `#` tot het einde van die regel is een commentaar. Een goede commentaar legt uit waarom iets wordt gedaan of waar een beslissing vandaan komt, in plaats van alleen de code hardop te lezen.

Reacties kunnen verouderd zijn. Wanneer de code wordt gewijzigd, wordt een oude opmerking niet automatisch bijgewerkt. U moet daarom de expressie controleren die daadwerkelijk wordt uitgevoerd in plaats van alleen het commentaar te vertrouwen.

### Aanhalingstekens omsluiten tekst

```r
cell_type <- "CD4 T cell"
```

`"CD4 T cell"` is een tekenreeks, dus een tekstwaarde. Zonder aanhalingstekens verwijst `cell_type` doorgaans naar het object met die naam.

```r
cell_type == "CD4 T cell"
```

Deze regel vergelijkt het object `cell_type` met de opgegeven tekst om te zien of ze gelijk zijn.

### Haakjes geven een functieaanroep aan of bepalen de rekenvolgorde

```r
mean(c(10, 20, 30))
```

De buitenste aanroep, `mean(...)`, berekent het gemiddelde. Eerst voegt de binnenste aanroep, `c(...)`, de drie getallen samen tot een vector.

Haakjes kunnen ook de volgorde van bewerkingen expliciet maken:

```r
1 + 2 * 3
(1 + 2) * 3
```

Deze twee lijnen produceren verschillende resultaten. Wanneer je een complexe aandoening ziet, raad dan niet de voorafgaande aandoening door het gezicht. AI vragen om haakjes toe te voegen maakt de code vaak gemakkelijker te beoordelen.

## Functies: invoer verwerken en een resultaat teruggeven

Een functie kan worden opgevat als een bewerking die een naam heeft gekregen.

```r
mean(c(10, 20, 30))
```

Deze lijn bevat:

- De functienaam: `mean`;
- de ingang die aan de functie wordt doorgegeven: `c(10, 20, 30)`;
- De geretourneerde waarde: `20`.

Veel functies hebben optionele argumenten:

```r
mean(c(10, NA, 30), na.rm = TRUE)
```

Met `na.rm = TRUE` slaat R ontbrekende waarden over bij het berekenen van het gemiddelde. In dit voorbeeld krijgt u `20`. Zonder dat argument is het resultaat doorgaans `NA`.

Hier is `na.rm` de naam van het argument en `TRUE` de waarde die u er bij deze functieaanroep aan meegeeft.

Benoemde argumenten zijn gemakkelijker te lezen dan waarden die alleen door positie worden geleverd:

```r
read.csv(file = "cell_metadata.csv", check.names = FALSE)
```

U hoeft niet te raden wat de tweede waarde betekent. Bij het lezen van een onbekende functie, kunt u de hulp in R bekijken:

```r
?mean
args(mean)
```

`?mean` opent de functiedocumentatie, terwijl `args(mean)` het gebruikelijke argumentformulier toont. Raadpleeg voor een pakketfunctie ook de officiële documentatie voor de versie die momenteel is geïnstalleerd, omdat argumenten en standaardgedrag tussen versies kunnen veranderen.

## Vectoren: een reeks waarden van hetzelfde type

Een vector is een van de meest basale datastructuren in R. Voor nu kun je het zien als een geordende reeks waarden.

```r
n_genes <- c(820, 410, 1250, 670)
cell_types <- c("T cell", "B cell", "T cell", "Monocyte")
passed_qc <- c(TRUE, FALSE, TRUE, TRUE)
```

De `c` van `c()` staat voor ‘combine’ of ‘concatenate’. Deze functie voegt meerdere waarden samen tot één vector.

Alle elementen van een atomaire vector hebben hetzelfde basistype. In het volgende voorbeeld worden getallen en tekst in één vector geplaatst.

```r
mixed <- c(1, "2", 3)
```

Om alle elementen hetzelfde type te geven, zet R ook de getallen om in tekst. Daardoor lukt het niet meer om rechtstreeks het gemiddelde van `mixed` te berekenen. Als er in door AI gegenereerde code ongemerkt tekst in een numerieke kolom terechtkomt, kan de typeconversie later berekeningen verstoren.

### Bewerkingen op vectoren werken doorgaans element voor element

```r
n_genes >= 500
```

Bevat `n_genes` vier waarden, dan levert de vergelijking vier logische waarden op, één per positie.

```text
TRUE FALSE TRUE TRUE
```

Elke positie wordt afzonderlijk getoetst. U ziet dus welke waarden minstens 500 zijn. De vergelijking levert geen enkel ja-of-nee-antwoord voor de hele kolom op.

Bij sommige bewerkingen met twee vectoren van verschillende lengte herhaalt R de waarden uit de kortste vector. Dit heet recycling. Het kan de bedoeling zijn, maar kan ook een lastig te ontdekken fout opleveren. Controleer daarom eerst `length()` of de afmetingen van de objecten. R weet niet vanzelf welke elementen bij dezelfde biologische groep horen.

## Dataframes: verschillende gegevenstypen in rijen en kolommen

Een data frame is een veelgebruikt soort tabel in R. Kolommen mogen verschillende typen gegevens bevatten, zoals getallen en tekst. Wel moeten ze allemaal evenveel rijen hebben.

De volgende code maakt een volledig fictieve celtabel:

```r
cells <- data.frame(
  cell_id = c("cell_1", "cell_2", "cell_3", "cell_4"),
  sample = c("control", "control", "disease", "disease"),
  n_genes = c(820, 410, 1250, NA),
  percent_mito = c(4.2, 12.8, 6.1, 3.5)
)
```

Je kunt het lezen als:

| cell_id | sample | n_genes | percent_mito |
| --- | --- | ---: | ---: |
| cell_1 | control | 820 | 4.2 |
| cell_2 | control | 410 | 12.8 |
| cell_3 | disease | 1250 | 6.1 |
| cell_4 | disease | ontbrekend | 3.5 |

Deze getallen illustreren de syntaxis. Kies kwaliteitsdrempels voor een echt experiment op basis van het weefsel, het protocol, de sequencingdiepte, het type cel of celkern, de vorm van de verdeling en het doel van de verdere analyse.

Veelvoorkomende controles bij het lezen van een onbekend gegevensframe zijn onder meer:

```r
dim(cells)
names(cells)
head(cells)
str(cells)
```

Zij helpen u respectievelijk te bevestigen:

- Hoeveel rijen en kolommen er zijn;
- Wat de kolomnamen zijn;
- hoe de eerste paar rijen eruit zien;
- Het type van elke kolom en de structuur van het hele object.

Deze controles bewijzen niet dat de gegevens biologisch correct zijn, maar kunnen een lege tabel, een verkeerd gespelde kolomnaam, getallen die als tekst zijn geïmporteerd of rijen en kolommen met een andere oriëntatie dan u had verwacht, onthullen.

## Matrices, lijsten en gespecialiseerde objecten herkennen

Naast vectoren en dataframes gebruikt bioinformaticacode vaak:

| Structuur | Hoe ziet het eruit? | Veelgebruikt voor |
| --- | --- | --- |
| Matrix | Rijen en kolommen, doorgaans met elementen van hetzelfde basistype | Genexpressiematrices en coördinaten na dimensiereductie |
| Lijst | Een verzameling die objecten van verschillende typen kan bevatten | Meerdere resultaten, parameters of geneste objecten bewaren |
| Gespecialiseerd object | Een object waarvan het pakket de structuur en methoden bepaalt | Analyseobjecten zoals Seurat en SingleCellExperiment |

Dezelfde uitdrukking, bijvoorbeeld `object[1]`, kan afhankelijk van het object verschillende soorten resultaten opleveren. Controleer het type met `class(object)` en de structuur met `str(object)` voordat u de code interpreteert. De naam alleen geeft daar geen uitsluitsel over.

Grote objecten met gegevens van afzonderlijke cellen kunnen een ijle matrix bevatten. Daarin worden hoofdzakelijk de waarden ongelijk aan nul vastgelegd. Dat bespaart opslag als de meeste waarden nul zijn. Vraagt u een AI om er alleen voor de weergave een gewone, dichte matrix van te maken, dan kan het geheugengebruik sterk toenemen.

## Indexeren met `[]`, `[[]]` en `$`: een deel van een object selecteren

Indexeren betekent het selecteren van een deel van een object.

### In R begint de nummering meestal bij 1

```r
genes <- c("MS4A1", "CD3D", "LYZ")
genes[1]
```

Het resultaat is:

```text
"MS4A1"
```

In R wordt de eerste positie meestal geschreven als `1`, niet `0` zoals in veel andere programmeertalen.

### In een dataframe komt eerst de rij, dan de kolom

```r
cells[1, 3]
```

Dit betekent rij 1, kolom 3.

```r
cells[1, ]
```

Dit selecteert de eerste rij met alle kolommen. Door de positie na de komma leeg te laten, behoudt u alles in die dimensie.

```r
cells[, "n_genes"]
```

Dit betekent alle rijen van de kolom met de naam `n_genes`.

### Met `$` kies je een kolom uit een dataframe op naam

```r
cells$n_genes
```

Het resultaat is de kolom `n_genes`. Links van `$` staat het object, rechts staat de naam van de kolom die u eruit haalt.

### `[]` en `[[]]` kunnen verschillende structuren opleveren

Voor lijsten en sommige dataframe operaties:

- `x[i]` levert doorgaans een deelverzameling op in een container van hetzelfde soort.
- `x[[i]]` haalt doorgaans het element zelf uit de container.
- `x$name` haalt een element of kolom op aan de hand van de naam.

Voorlopig is het voldoende te weten dat enkele en dubbele vierkante haken niet uitwisselbaar zijn. Verandert de AI de haken, controleer dan met `class()`, `length()` of `dim()` of het resultaat nog het type of de afmetingen heeft die de volgende stap nodig heeft.

## Vergelijkingen en logische voorwaarden in filterregels

Veelgebruikte vergelijkingsoperatoren zijn onder meer:

| Expressie | Betekenis |
| --- | --- |
| `x == y` | Is x gelijk aan y? |
| `x != y` | Verschilt x van y? |
| `x > y` | Is x groter dan y? |
| `x >= y` | Is x groter dan of gelijk aan y? |
| `x < y` | Is x kleiner dan y? |
| `x <= y` | Is x kleiner dan of gelijk aan y? |

Met `==` vergelijkt u twee waarden op gelijkheid. Met `<-` kent u een waarde toe aan een naam.

Logische voorwaarden kunnen worden gecombineerd:

| Expressie | Betekenis |
| --- | --- |
| `!x` | De ontkenning van x |
| `x & y` | Voor elk element moeten zowel x als y waar zijn |
| `x \| y` | Voor elk element moet ten minste één van beide waar zijn |

Bijvoorbeeld:

```r
cells$n_genes >= 500 & cells$percent_mito < 10
```

Dit kan vertaald worden als:

> Controleer voor elke cel of er minstens 500 genen zijn gedetecteerd en het mitochondriale percentage lager is dan 10%.

Als u de richting van een symbool wijzigt, kunt u wijzigen welke cellen worden behouden. Wanneer u filtercode bekijkt, leest u elke voorwaarde als een volledige zin en vergelijkt u deze met het analyseplan.

In een `if`-voorwaarde kunt u ook `&&` en `||` tegenkomen. Daarmee neemt het programma één beslissing over de volgende stap. Met `&` en `|` worden logische vectoren meestal element voor element gecombineerd. Als een AI deze operatoren wil verwisselen, vraag dan hoeveel waarden de uitdrukking moet verwerken en hoeveel zij moet opleveren.

## Ontbrekende waarden: het verschil tussen `NA`, 0 en de tekst `"NA"`

`NA` betekent dat op deze positie geen bruikbare waarde beschikbaar is. Dat verschilt van een gemeten nul.

- 0 kan betekenen dat het gemeten resultaat nul was;
- `NA` betekent dat er geen bruikbare waarde is op die positie.

`NA` verschilt ook van de tekenreeks `"NA"`. Tussen aanhalingstekens vormen de twee letters een tekstwaarde.

Gebruik de volgende code om te controleren op ontbrekende waarden:

```r
is.na(cells$n_genes)
```

Niet gebruiken:

```r
cells$n_genes == NA
```

Als u een ontbrekende waarde in een vergelijking gebruikt, krijgt u meestal weer `NA`. R heeft dan te weinig informatie om vast te stellen of de vergelijking waar of onwaar is.

Dit heeft direct invloed op het filteren:

```r
keep <- cells$n_genes >= 500 &
  cells$percent_mito < 10
```

Ontbreekt `n_genes` of `percent_mito`, dan kan ook op de bijbehorende positie in `keep` een `NA` staan. In de volgende versie legt de code expliciet vast hoe deze ontbrekende waarden worden behandeld.

```r
keep <- !is.na(cells$n_genes) &
  !is.na(cells$percent_mito) &
  cells$n_genes >= 500 &
  cells$percent_mito < 10
```

De code vereist dat zowel `n_genes` als `percent_mito` een bekende waarde heeft. Daardoor bevat elke positie in `keep` uitsluitend `TRUE` of `FALSE`.

Deze regel legt vast wat het programma doet. Onderzoek bij echte gegevens eerst waarom waarden ontbreken. Er kan iets mis zijn gegaan bij het importeren, een kolom kan een onjuist type hebben, een eerder programma kan een maat niet hebben berekend of een toestand kan werkelijk onmeetbaar zijn. De oorzaak helpt bepalen of u een rij kunt weglaten.

## Rijen filteren met een logische vector

Ga verder met het fictieve `cells` dataframe:

```r
keep <- !is.na(cells$n_genes) &
  !is.na(cells$percent_mito) &
  cells$n_genes >= 500 &
  cells$percent_mito < 10

filtered_cells <- cells[keep, ]
```

Het eerste blok maakt een logische vector met één positie per rij van de tabel. Het tweede gebruikt die vector om de rijen te behouden waarvoor de waarde `TRUE` is.

Het verwachte resultaat is:

| cell_id | sample | n_genes | percent_mito |
| --- | --- | ---: | ---: |
| cell_1 | control | 820 | 4.2 |
| cell_3 | disease | 1250 | 6.1 |

Het resultaat bevat alleen de geselecteerde metadatarijen en de bijbehorende cel-ID’s. De expressiematrix, andere omische modaliteiten, projecties in minder dimensies en ruimtelijke coördinaten zijn daarmee nog niet gefilterd. Filter in een echt project elk bijbehorend object met gecontroleerde, stabiele identificatoren. Controleer daarna of de identificatoren, hun aantal en hun volgorde nog overeenkomen. De bewerkingen per pakket komen in latere analyselessen aan bod.

U kunt deze code in de volgende volgorde bekijken:

1. Is de lengte van `keep` gelijk aan `nrow(cells)`?
2. Bevat `keep` nog `NA` waarden?
3. Hoeveel rijen zijn er voor en na het filteren?
4. Welke rijen zijn verwijderd?
5. Kwamen de drempels voort uit vooraf gedefinieerde regels of inspectie van de datadistributies?

Nuttige controlecode omvat:

```r
length(keep)
table(keep, useNA = "ifany")
nrow(cells)
nrow(filtered_cells)
```

Een verwacht aantal output rijen geeft alleen aan dat het filter volgens de code is uitgevoerd. Het bewijst niet dat de drempelwaarden biologisch passend zijn.

## De pipe `|>`: het resultaat doorgeven aan de volgende stap

Pipes komen vaak voor in R-code:

```r
cells |>
  head(2)
```

De pipe `|>` van base R geeft het resultaat links door aan de functie rechts. Daarom kunt u de bovenstaande code doorgaans als volgt lezen.

```r
head(cells, 2)
```

Met een pipe-operator schrijf je opeenvolgende bewerkingen in de volgorde waarin je ze leest:

```r
cells |>
  subset(!is.na(n_genes)) |>
  subset(n_genes >= 500)
```

Lees het van boven naar beneden:

1. Begin met `cells`;
2. Behoud rijen waar `n_genes` niet ontbreekt;
3. Behoud dan de rijen waar `n_genes` ten minste 500 is.

Een pipe slaat de tussenresultaten niet automatisch op. Je moet ook zelf controleren of elke stap klopt. Wordt een keten onoverzichtelijk, vraag Codex dan om de tussenresultaten te benoemen en na belangrijke stappen het aantal rijen en kolommen te tonen.

Vanaf R 4.1.0 is `|>` in R zelf beschikbaar. Herkent een oudere omgeving deze schrijfwijze niet, controleer dan eerst de R-versie. U kunt ook `%>%` tegenkomen, afkomstig uit het pakket `magrittr`. Met beide kunt u stappen op vergelijkbare wijze achter elkaar zetten, al verschillen de details.

## Uit welk pakket komt een functie?

Beide van de volgende vormen zijn gemeenschappelijk:

```r
library(dplyr)
filtered_cells <- filter(cells, n_genes >= 500)
```

```r
filtered_cells <- dplyr::filter(cells, n_genes >= 500)
```

`library(dplyr)` laadt en koppelt het pakket, waardoor de geëxporteerde functies direct met hun naam kunnen worden aangeroepen.

Met `dplyr::filter` geeft het script precies aan welke functie wordt bedoeld, namelijk `filter` uit het pakket `dplyr`. Zo kunt u de herkomst vaststellen, ook wanneer verschillende pakketten een functie met dezelfde naam bevatten.

Als u in base R rijen selecteert met `cells[keep, ]`, kan een `NA` in de logische vector een rij met ontbrekende waarden in de uitvoer opleveren. `dplyr::filter()` behoudt alleen rijen waarvoor de voorwaarde `TRUE` is. Bepaal vooraf welke meetwaarden mogen ontbreken en hoe u zulke rijen behandelt. Zo wordt die keuze niet toevallig bepaald door de gebruikte functie.

Wanneer je een onbekende functie ziet, vraag dan eerst:

- Hoort het bij base R of bij een pakket?
- Is dat pakket geïnstalleerd in de huidige omgeving?
- Welke versie van het pakket wordt gebruikt?
- Wijzigt de functie het invoerobject, schrijft ze een bestand of retourneert ze alleen een nieuw object?
- Zijn de standaardargumenten geschikt voor de huidige gegevens?

Raad het gedrag niet alleen uit de naam van een functie. Bijvoorbeeld, `filter` kan niet dezelfde operatie in verschillende pakketten of contexten beschrijven.

## `if`, lussen en eigen functies herkennen

Een AI-gegenereerd script kan control flow bevatten. Je hoeft het nog niet zelf te schrijven, maar je moet het herkennen.

### `if`: code uitvoeren als aan een voorwaarde is voldaan

```r
if (nrow(filtered_cells) == 0) {
  warning("No cells remain after filtering")
}
```

In gewone taal:

> Als het gefilterde gegevensframe 0 rijen heeft, wordt een waarschuwing weergegeven.

De haakjes `{}` omsluiten de code die wordt uitgevoerd wanneer aan de voorwaarde is voldaan.

### `for`: een bewerking voor meerdere elementen herhalen

```r
marker_genes <- c("MS4A1", "CD3D", "LYZ")

for (gene in marker_genes) {
  print(gene)
}
```

Bij elke herhaling krijgt `gene` de naam van het volgende gen en wordt die naam afgedrukt. Controleer bij een echte lus waar elk resultaat wordt bewaard, of de ene uitvoer een ander bestand kan overschrijven en of de lus na een mislukte herhaling doorgaat.

### `function`: een herbruikbare bewerking definiëren

```r
calculate_average <- function(values) {
  mean(values, na.rm = TRUE)
}
```

Deze code definieert een functie genaamd `calculate_average`. Het ontvangt `values` en retourneert hun gemiddelde na het negeren van ontbrekende waarden.

Bij het lezen van een aangepaste functie, identificeer ten minste:

- de invoerargumenten;
- Wat de functie doet met de input;
- De standaardargumenten;
- de retourwaarde ervan;
- Of het objecten en bestanden buiten de functie leest of schrijft.

## Fouten, waarschuwingen en berichten onderscheiden

R kan verschillende soorten feedback produceren terwijl het draait:

| Type | Gebruikelijke betekenis | Controleer eerst |
| --- | --- | --- |
| Fout | R kan de huidige expressie niet volledig uitvoeren | Lees de eerste foutmelding. Bestaat het object? Kloppen de functie en de argumenten? |
| Waarschuwing | R gaat meestal verder, maar heeft een mogelijk probleem gevonden | Bij welke stap verscheen de waarschuwing? Is de uitvoer nog bruikbaar? |
| Melding | Het programma meldt de status of geeft een toelichting | Vermeldt de melding een versie, een gewijzigde methode of een belangrijke standaardinstelling? |

"Geen fout" betekent niet "geen waarschuwing", en geen van beide betekent dat de analyse juist is. AI gebruikt soms functies die berichten of waarschuwingen verbergen om de uitvoer er schoner uit te laten zien. Tijdens de herziening, bevestigen dat het niet heeft verborgen belangrijke bewijzen op hetzelfde moment.

Verschijnt de prompt `+` in de R-console, dan is de vorige uitdrukking vaak nog niet af. Controleer of er een haakje, aanhalingsteken of accolade moet worden gesloten. De `+` geeft hier aan dat R op verdere invoer wacht.

## R-code van AI stapsgewijs controleren

Wanneer u met tientallen regels code wordt geconfronteerd, hoeft u niet eerst door elk symbool te worstelen. Begin met het reconstrueren van de datastroom.

### 1. Nagaan waar de code draait en welke omgeving hij gebruikt

Noteer de R-versie, projectomgeving en pakketversies. De syntaxis van `|>`, functieargumenten of objectstructuren kunnen afhankelijk zijn van versies.

### 2. Alle externe invoer vinden

Zoek naar code die bestanden, databases of netwerkbronnen leest, zoals:

```r
read.csv("cell_metadata.csv")
readRDS("seurat_object.rds")
```

Bevestig het pad, de bestandsindeling, de voorbeeldidentiteit en de referentieversie.

### 3. De belangrijkste objecten op een rij zetten

Lijst de namen aan de linkerkant van toewijzingsoperatoren:

```text
cells
keep
filtered_cells
average_genes
```

Schrijf vervolgens een beschrijving van één zin in duidelijke taal van elk object.

### 4. Elke wijziging aan een object volgen

Controleer waar een object wordt gemaakt, gefilterd, samengevoegd, hernoemd of overschreven. Vertrouw er niet op dat een object is gefilterd zoals bedoeld, alleen omdat de naam `filtered` bevat.

### 5. Elk filter en elke vergelijking in woorden uitdrukken

Controleer in het bijzonder:

- de richting van `>` en `<`;
- `&` vergeleken met `|`;
- of gelijkheid is opgenomen;
- hoe ontbrekende waarden worden behandeld;
- of een voorwaarde van toepassing is op cellen, monsters, genen of een andere eenheid;
- Waar drempelwaarden en groepslabels vandaan kwamen.

### 6. Bewerkingen vinden die bestanden schrijven of de systeemtoestand wijzigen

Bevestig het uitvoerpad, de bestandsnaam en of een bestaand resultaat kan worden overschreven. Het installeren van pakketten, het verwijderen van bestanden en het aanroepen van systeemcommando's veranderen ook de status.

### 7. De belangrijkste tussenresultaten controleren

Na belangrijke stappen, vraag output aan zoals:

```r
class(object)
dim(object)
head(object)
summary(object)
```

Kies controlefuncties die passen bij het objecttype. Het afdrukken van een groot object met één cel kan langzaam en moeilijk te lezen zijn. Inspecteer in plaats daarvan de samenvatting, afmetingen en belangrijkste metagegevens.

### 8. Tot slot de wetenschappelijke betekenis beoordelen

Syntaxis vertelt u alleen hoe een berekening wordt uitgevoerd. U moet ook vragen:

- Vertegenwoordigt elke rij een cel, een kern, een ruimtelijke locatie of een biologisch monster?
- Komt de groepslabels overeen met de voorbeeldtabel?
- Wat zijn de onafhankelijke biologische replicaten?
- Kunnen de filterregels systematisch een bepaald celtype verwijderen?
- Komt de genidentificatie, het referentiegenoom en de annotatieversie overeen?
- Welke conclusies kan de berekening ondersteunen en welke niet?

## Codex om een controleerbare uitleg van code vragen

U kunt Codex de code geven samen met het volgende verzoek:

```text
Wijzig deze R-code nog niet en voer hem nog niet uit.

1. Leg elk onderdeel uit in de volgorde waarin het wordt uitgevoerd.
2. Noteer alle invoerbestanden, uitvoerbestanden en objecten die worden aangemaakt.
3. Geef voor elk object het type, de verwachte dimensies en de biologische betekenis.
4. Beschrijf elke filtervoorwaarde in gewone taal.
5. Markeer alle stappen die ontbrekende waarden verwerken, objecten overschrijven,
   bestanden schrijven of verwijderen, pakketten installeren of systeemopdrachten uitvoeren.
6. Markeer alles wat afhangt van een pakketversie of een standaardwaarde voor een argument.
7. Geef apart aan of de code syntactisch uitvoerbaar is en of de analyse wetenschappelijk is gevalideerd.
8. Geef de kortste code waarmee ik dit alleen-lezen kan controleren. Laat de gegevens en de omgeving intact.
```

AI's verklaring moet ook worden gecontroleerd. De meest directe controles omvatten:

- raadplegen van de officiële functiedocumentatie voor de gebruikte versie;
- Het inspecteren van het echte object met `class()`, `dim()`, `names()` en `str()`;
- Het uitvoeren van een stap op een zeer klein voorbeeld;
- Het vergelijken van het aantal rijen en verwijderde objecten voor en na het filteren;
- Het originele script en het uitvoeringslogboek behouden.

## Wanneer verdient door AI geschreven code extra controle?

De volgende code is niet noodzakelijkerwijs verkeerd, maar het moet niet worden uitgevoerd zonder het te begrijpen:

| Expressie | Wat kan er gebeuren? | Vraag vóór het uitvoeren |
| --- | --- | --- |
| `rm(list = ls())` | Verwijdert objecten uit de huidige R-werkruimte | Zijn er objecten of gegevens over de analyse die nog niet zijn opgeslagen? |
| `setwd("an/absolute/path")` | Wijzigt de map van waaruit relatieve paden worden geïnterpreteerd | Komt dit pad van de computer van de auteur? |
| `install.packages(...)` | Wijzigt de pakketomgeving van de actieve R-installatie | Hoort het pakket in de projectomgeving en moet je de versie vastleggen? |
| `na.omit(data)` | Verwijdert rijen met ontbrekende waarden | Hoeveel rijen verdwijnen er en waarom ontbreken die waarden? |
| `write.csv(..., "original_input_file.csv")` | Kan een invoerbestand overschrijven | Wordt de uitvoer naar een nieuw pad geschreven zodat de oorspronkelijke gegevens behouden blijven? |
| `unlink(...)` | Verwijdert een bestand of map | Om welk pad gaat het precies? Kun je de verwijderde inhoud terughalen? |
| `system(...)` | Voert een opdracht van het besturingssysteem uit | Waar wordt de opdracht uitgevoerd en wat zal ze lezen of wijzigen? |
| `<<-` | Kan een object buiten de functie wijzigen | Waarom wordt de globale toestand gewijzigd? |

Andere bewerkingen zien er misschien veilig uit, maar kunnen de conclusie nog steeds veranderen:

- Gegevens alleen selecteren op kolompositie in plaats van kolomnaam;
- Het vergelijken van een percentage met een verhouding zonder de eenheid te controleren;
- Het behandelen van elke cel als een onafhankelijke biologische replicaat;
- Filterdrempels wijzigen na het bekijken van groepsresultaten;
- elke waarschuwing verbergen.
- Het overschrijven van objecten met dezelfde naam, zodat de oorspronkelijke en verwerkte gegevens niet kunnen worden onderscheiden.

Het doel van de herziening is niet om alle snelkoppelingen te verbieden. Het is om te weten welke informatie elke snelkoppeling weglaat.

## Het eerste voorbeeld stap voor stap doorgronden

Lees nu de code van het begin van deze les opnieuw:

```r
cells <- read.csv("cell_metadata.csv")

keep <- !is.na(cells$n_genes) &
  !is.na(cells$percent_mito) &
  cells$n_genes >= 500 &
  cells$percent_mito < 10

filtered_cells <- cells[keep, ]
average_genes <- mean(filtered_cells$n_genes, na.rm = TRUE)
```

In gewone taal:

1. Lees `cell_metadata.csv` uit de huidige werkmap en bewaar het data frame onder de naam `cells`.
2. Controleer voor elke rij of `n_genes` en `percent_mito` beide een waarde hebben, of `n_genes` minstens 500 is en of `percent_mito` lager is dan 10.
3. Alleen rijen die aan alle vier de voorwaarden voldoen, krijgen in `keep` de waarde `TRUE`.
4. Filter de rijen van `cells` met `keep` en bewaar het resultaat als `filtered_cells`.
5. Bereken het gemiddelde van `n_genes` over de behouden cellen en sla daarbij eventuele ontbrekende waarden over.
6. Bewaar het gemiddelde onder de naam `average_genes`.

In de interactieve R-console verschijnt het resultaat van een losse uitdrukking zonder toewijzing doorgaans vanzelf. Bij `source()` of andere manieren om een script uit te voeren kunt u daar niet op rekenen. Bewaar het resultaat daarom in een object en toon het zo nodig met `print(average_genes)` of schrijf het naar een uitvoerbestand.

Onderzoekers moeten nog belangrijke vragen over deze code beantwoorden:

- Is het invoerbestand echt de celmetadata voor het huidige project?
- Zijn de kolomnamen en eenheden correct?
- Wat is de basis voor de drempelwaarden `500` en `10`?
- Moeten er ook andere kwaliteitskenmerken worden gecontroleerd?
- Hoeveel cellen van elk monster werden behouden?
- Zouden deze regels systematisch de resultaten voor bepaalde weefsels, celtypes, of kerngegevens kunnen bias?
- Waarom is de uiteindelijke berekening het gemiddelde aantal genen per cel, en welke vraag moet het beantwoorden?

Code begrijpen betekent niet elk leesteken voorspellen. Het betekent het scheiden van de rekenprocedure van de wetenschappelijke beslissingen en het herkennen van welke bewijzen nog ontbreken.

## Welke vaardigheden moet je na deze les beheersen?

Wanneer je R-code tegenkomt, hoef je deze niet uit het geheugen te herschrijven, maar je moet tenminste in staat zijn om:

- objecten, toewijzingen, functies, argumenten, commentaren en tekenreeksen herkennen;
- Vectoren, dataframes, matrices, lijsten en gespecialiseerde objecten onderscheiden;
- Begrijpen van algemene indexering, vergelijkingen, logische voorwaarden en pipe-operatoren;
- Weet dat `NA` expliciet moet worden behandeld;
- Traceer inputs, object veranderingen en outputs;
- Bewerkingen zoeken die objecten kunnen overschrijven, de omgeving kunnen wijzigen of bestanden kunnen verwijderen.
- De uitleg van AI te vergelijken met echte objectstructuren en officiële documentatie;
- Uitleggen welke validaties nog nodig zijn tussen succesvolle code uitvoering en een geldige biologische conclusie.

In een tijdperk waarin AI snel code kan genereren, kan het onthouden van syntaxis minder belangrijk worden, maar code begrijpen wordt nog belangrijker. Hoe sneller de code wordt gegenereerd, hoe belangrijker het is dat iemand precies ziet wat het doet.

## Bronnen

1. [R Core Team: Een introductie tot R](https://cran.r-project.org/doc/manuals/r-release/R-intro.html)
2. [R Core Team: De definitie van de R-taal](https://cran.r-project.org/doc/manuals/r-release/R-lang.html)
3. [Officiële R documentatie: Toewijzingsoperatoren](https://stat.ethz.ch/R-manual/R-patched/library/base/html/assignOps.html)
4. [Officiële R-documentatie: Delen van een object extraheren of vervangen](https://stat.ethz.ch/R-manual/R-patched/library/base/html/Extract.html)
5. [Officiële R-documentatie: Dataframes](https://stat.ethz.ch/R-manual/R-patched/library/base/html/data.frame.html)
6. [Officiële R-documentatie: ontbrekende waarden, `NA`](https://stat.ethz.ch/R-manual/R-patched/library/base/html/NA.html)
7. [Officiële R-documentatie: Relationele en logische operatoren](https://stat.ethz.ch/R-manual/R-patched/library/base/html/Comparison.html)
8. [Officiële R documentatie: De ingebouwde pipe `|>`](https://stat.ethz.ch/R-manual/R-patched/library/base/html/pipeOp.html)
9. [Officiële R-documentatie: Pakketten en functienaamruimten laden](https://stat.ethz.ch/R-manual/R-patched/library/base/html/library.html)
10. [Officiële R documentatie: Scripts uitvoeren met `source()`](https://stat.ethz.ch/R-manual/R-patched/library/base/html/source.html)
11. [Officiële dplyr documentatie: Bewaar rijen die overeenkomen met een voorwaarde met `filter()`](https://dplyr.tidyverse.org/reference/filter.html)
