# 0.2 | Waarom werkt mijn code nog niet na de installatie van R of Python? Pakketten, omgevingen, afhankelijkheden en versies

Je vindt online een script voor singlecellanalyse. Volgens de auteur heb je Python en Scanpy nodig. Python staat op je computer. Je kopieert de code, voert deze uit en krijgt de volgende melding:

```text
ModuleNotFoundError: No module named 'scanpy'
```

Een andere cursist heeft Scanpy al gebruikt, maar krijgt bij dezelfde code een versieconflict. Een derde installeert Seurat in R zonder foutmelding. Wanneer diegene de volgende dag een ander project opent, werkt de oorspronkelijke analyse niet meer.

Het kan telkens lijken alsof de software stuk is. Toch kan de oorzaak op verschillende niveaus liggen:

- De computer kan R of Python niet vinden;
- Het pakket is geïnstalleerd in een andere omgeving;
- twee pakketten vereisen incompatibele versies van dezelfde afhankelijkheid;
- De code gebruikt een functie die in een oudere versie bestond, maar in een nieuwere versie is gewijzigd.
- Een systeemcomponent die vereist is voor het pakket ontbreekt; of
- De R of Python die de code uitvoert is niet degene die je denkt dat het is.

Deze les vraagt je niet om elk installatie gereedschap te onthouden. Het doel is om een duidelijke kaart van de computeromgeving te maken. Wanneer je een script of fout ziet, moet je weten welke laag je eerst moet inspecteren in plaats van alles meteen opnieuw te installeren.

![Gelaagde structuur van een computeromgeving: hardware, besturingssysteem, R of Python, projectomgeving, pakketten en analysescripts](figures/computational-environment-layers.nl.png)

*Figuur 1 | Een analysescript berust op verschillende lagen. Het besturingssysteem vormt de basis. R of Python voert de code uit. Projectomgevingen houden de software van verschillende projecten gescheiden. Pakketten en hun afhankelijkheden leveren de functies die het analysescript op de gegevens toepast. Deze oorspronkelijke projectillustratie is op 23 juli 2026 gemaakt met de beeldgenerator van OpenAI. Ze bevat geen leverancierslogo’s, schermafbeeldingen of ontwerpen van derden. De indeling maakt de samenhang zichtbaar. De precieze installatie verschilt per hulpmiddel.*

## Vijf begrippen die vaak door elkaar worden gebruikt

### 1. R en Python: talen en hun interpreters

R en Python zijn beide programmeertalen. De code die u schrijft moet worden gelezen en uitgevoerd door de bijbehorende software.

De software die je code leest en uitvoert, heet hier de **interpreter**. De R-interpreter voert R-code uit en de Python-interpreter Python-code. Na installatie van Python kun je Python-code uitvoeren. Pakketten zoals Scanpy en pandas zijn daarmee nog niet geïnstalleerd.

Dezelfde computer kan meerdere Python installaties tegelijk bevatten, zoals:

- Python direct geïnstalleerd in Windows;
- Python binnen WSL;
- Python binnen een Conda omgeving; en
- Python in een virtuele omgeving voor een bepaald project.

Al deze installaties kunnen onder de naam `python` beschikbaar zijn, maar naar verschillende uitvoerbare bestanden en verschillende pakketten verwijzen. Bij R kan iets vergelijkbaars gebeuren door systeeminstallaties, projectbibliotheken of softwaremodules op een server.

### 2. Pakketten: verzamelingen functies die anderen hebben geschreven

Een **pakket** is een verzameling herbruikbare code, documentatie en bijbehorende bestanden.

Bijvoorbeeld:

- Seurat is een veelgebruikt R-pakket om gegevens van individuele cellen te analyseren.
- Scanpy is een veelgebruikt Python-pakket voor de analyse van gegevens van individuele cellen.
- ggplot2 biedt plotfuncties voor R; en
- pandas biedt tabelverwerkingsfuncties voor Python.

Het installeren van R of Python is als het verkrijgen van een basislaboratorium. Het installeren van pakketten is als het meenemen van microscopen, centrifuges en pipetten naar dat laboratorium.

De analogie heeft een grens: softwarepakketten zijn geen volledig zelfstandige instrumenten. Eén pakket roept vaak andere pakketten of systeemprogramma's aan, en deze kunnen strenge versievereisten hebben.

### 3. Afhankelijkheden: wat een pakket nodig heeft om te werken

Werkt pakket A alleen met pakket B, dan noemen we B een **afhankelijkheid** van A.

Afhankelijkheden kunnen door verschillende niveaus gaan:

```text
Analysescript
  → Pakket A
    → Pakket B
      → Onderliggende softwarebibliotheek
```

Installatieprogramma's proberen deze afhankelijkheden meestal automatisch te vinden, maar "automatisch" betekent niet dat ze altijd een compatibele combinatie kunnen vinden.

Stel dat pakket A versie 2.0 of hoger van een afhankelijkheid vereist, terwijl pakket C voor diezelfde afhankelijkheid een versie lager dan 2.0 vereist. Dan bestaat er binnen één omgeving geen versie die aan beide eisen voldoet. Pip kan dit melden als `ResolutionImpossible`. Ook R of Bioconductor kan aangeven dat pakketten te oud, te nieuw of niet beschikbaar zijn voor de gebruikte versie.

### 4. Rekenomgevingen: de software en instellingen die samenwerken

Met een **werkomgeving** bedoelen we alle omstandigheden waaronder de code van een project daadwerkelijk draait. Daaronder vallen doorgaans:

- Het besturingssysteem en het hardwaretype;
- De versie en locatie van R of Python;
- Geïnstalleerde pakketten en hun versies;
- Bibliotheken op lagere niveaus die door deze pakketten vereist worden; en
- Sommige paden, landinstellingen of andere configuratie.

Verschillende omgevingstools beheren niet precies hetzelfde scala aan componenten.

- Met `venv`, dat bij Python hoort, kun je voor een project een omgeving met een eigen map voor Python-pakketten maken.
- Een Conda-omgeving kan Python, R en ook bepaalde onderliggende bibliotheken beheren die zelf geen Python-pakket zijn.
- Met renv kan elk R-project zijn eigen pakketbibliotheek krijgen. De pakketgegevens worden vastgelegd in `renv.lock`.

Hun gemeenschappelijke doel is om interferentie tussen projecten te verminderen.

### 5. Versies: hoe dezelfde software in de tijd verandert

Dezelfde softwarenaam betekent niet dat het gedrag voor altijd ongewijzigd blijft. Ontwikkelaars repareren fouten en voegen functies toe, maar ze kunnen ook standaardparameters, functienamen, bestandsindelingen of afhankelijkheidsvereisten wijzigen.

Een versienummer kan er zo uitzien: `1.4.2`. Veel projecten gebruiken drie delen voor de hoofdversie, de kleinere versie en correcties. Of twee versies compatibel zijn, kun je niet alleen uit de cijfers afleiden. Raadpleeg de officiële documentatie en de wijzigingsnotities van het betreffende programma.

Bij een bio-informaticaproject zegt ‘we gebruikten Scanpy’ of ‘we gebruikten Seurat’ te weinig. Noteer minstens de pakketversie en de installatiebron. Vermeld ook welke versie van R of Python is gebruikt en onder welk besturingssysteem de analyse draaide.

## Waarom heeft elk project bij voorkeur een eigen omgeving?

Stel je voor dat je aan twee projecten werkt:

- Project A reproduceert een twee jaar oude single-cell studie en heeft oudere pakketversies nodig.
- Project B is een nieuwe ruimtelijke transcriptomics analyse en heeft nieuwere pakketversies nodig.

Als elk pakket in een gedeelde omgeving geïnstalleerd is, kan het bijwerken van pakketten voor Project B Project A plotseling verbreken. In de andere richting kan het weigeren van elke update om Project A te behouden voorkomen dat Project B wordt geïnstalleerd.

Een veiligere regeling is:

```text
Project A → Omgeving A → Versies die zijn gevalideerd voor project A
Project B → Omgeving B → Versies die zijn gevalideerd voor project B
```

Gescheiden omgevingen verkleinen de kans dat een wijziging in het ene project het andere onbruikbaar maakt. Voor de betrouwbaarheid van de analyse moet je daarnaast de biologische vraag, de opzet van de bemonstering, de parameterkeuze en de interpretatie van het resultaat beoordelen.

## R- en Python-omgevingen vastleggen

| Soort project | Hoe houd je het project apart? | Wat leg je vast? | Wat wordt er vastgelegd? |
| --- | --- | --- | --- |
| R-project | renv | `renv.lock`, `sessionInfo()` | R, het besturingssysteem en de bronnen en versies van de pakketten |
| Klein Python-project | `venv` | `requirements.txt` en de versies van Python en pip | De pakketten die de huidige Python-omgeving nodig heeft |
| Bio-informaticaproject in Python of met meerdere talen | Conda | `environment.yml` of een ander exportbestand | Python/R, pakketten, kanalen en een deel van de onderliggende afhankelijkheden |

Deze bestanden zijn geen magische back-ups.

- `requirements.txt` legt doorgaans vast welke Python-pakketten nodig zijn. Het bestand vermeldt niet noodzakelijk alle onderliggende programma’s die in het besturingssysteem zijn geïnstalleerd.
- `environment.yml` helpt iemand anders een Conda-omgeving opnieuw op te bouwen. Welke pakketten en pakketbuilds beschikbaar zijn, verschilt per besturingssysteem.
- `renv.lock` legt de gebruikte pakketten en versies van een R-project vast. Voor het herstellen van het project kunnen ook een geschikte R-versie, een passend besturingssysteem en de juiste compilatiegereedschappen nodig zijn.

Een omgeving opnieuw kunnen bouwen is veel betrouwbaarder dan proberen te onthouden wat je hebt geïnstalleerd. Het betekent nog steeds niet dat elke computer noodzakelijkerwijs een volledig identieke omgeving zal produceren.

## Welke R- of Python-installatie voert je code uit?

De onderstaande commando's zijn geen installatie tutorial. Het zijn inspectiehulpmiddelen voor het lokaliseren van een probleem.

### Python controleren in een terminal

```bash
python --version
python -m pip --version
python -c "import sys; print(sys.executable)"
```

Ze beantwoorden drie verschillende vragen:

1. Welke Python-versie start met de opdracht `python`?
2. Waar staat de pip-installatie die bij deze Python-interpreter hoort?
3. Wat is het werkelijke bestandspad van de huidige Python-interpreter?

De tweede opdracht gebruikt bewust `python -m pip`. Daardoor draait pip onder de zojuist gecontroleerde interpreter. Bij alleen `pip` kan het systeem een pip vinden die bij een andere Python-installatie hoort.

Sommige Linux systemen noemen het commando `python3`. Als de officiële instructies voor de software of server `python3` gebruiken, volg dan de daadwerkelijke naamgeving in die omgeving in plaats van blindelings elk commando te vervangen door `python`.

### R controleren in een terminal en in een R-sessie

Voer eerst dit uit in een terminal:

```bash
R --version
```

Start daarna R. Voer in de R-console de volgende regels uit:

```r
R.version.string
.libPaths()
sessionInfo()
```

Deze opdrachten tonen de R-versie, de mappen waar R momenteel naar pakketten zoekt en informatie over de huidige R-sessie, het besturingssysteem en geladen pakketten.

Let op het verschil tussen de terminal en de R-console. `R --version` voer je in de terminal uit. `R.version.string`, `.libPaths()` en `sessionInfo()` zijn R-code en voer je in de R-console uit. De verkeerde omgeving kan zelf de oorzaak van een foutmelding zijn.

### Als je Conda gebruikt

```bash
conda env list
```

Een sterretje in de uitvoer markeert meestal de actieve omgeving. Het bevestigen van de omgevingsnaam voordat een pakket wordt geïnstalleerd helpt voorkomen dat je software in `base` of de omgeving van een ander project plaatst.

## Wat vertellen vijf veelvoorkomende foutmeldingen?

| Foutmelding of verschijnsel | Waar ligt de oorzaak waarschijnlijk? | Controleer eerst |
| --- | --- | --- |
| `command not found` of “is not recognized as an internal or external command” | Het systeem kan het programma niet vinden | Is het programma geïnstalleerd en kan de terminal het vinden? |
| `ModuleNotFoundError` | De gebruikte Python-omgeving bevat de module niet | Controleer het pad van de actieve Python-interpreter en of het pakket in diezelfde omgeving staat |
| `there is no package called ...` | Het pakket ontbreekt in de pakketbibliotheek die R gebruikt | `.libPaths()` en de bibliotheek waarin je het pakket hebt geïnstalleerd |
| `ResolutionImpossible` of een ander conflict tussen afhankelijkheden | De vereiste pakketversies zijn niet met elkaar verenigbaar | Welke twee pakketten vragen om onverenigbare versies van dezelfde afhankelijkheid? |
| `cannot open shared object file` of `DLL load failed` | Een onderliggende systeembibliotheek of gecompileerd onderdeel | Controleer het besturingssysteem, het processortype, de naam van de ontbrekende bibliotheek en de officiële systeemeisen |

De tabel vertelt je alleen waar je eerst moet kijken. Een enkele regel tekst kan niet altijd een unieke oorzaak identificeren. Wanneer u om hulp vraagt, bewaar dan het volledige commando en de uitvoer die begint met de eerste fout.

## Installatie- en uitvoerfouten stap voor stap opsporen

### Stap 1: bewaar de foutmelding voordat je opnieuw installeert

Sla eerst de oorspronkelijke fout op. Het uitvoeren van veel verschillende installatieopdrachten achter elkaar kan de omgeving veranderen en het oorspronkelijke probleem moeilijker reproduceerbaar maken.

### Stap 2: nagaan waar de opdracht wordt uitgevoerd

Noteer of u gebruik maakt van:

- Windows PowerShell;
- Een WSL/Linux terminal;
- De R-console;
- Python of Jupyter; of
- Een externe server.

Het zeggen van “Ik werk op een Windows-computer” bewijst niet dat het commando in Windows wordt uitgevoerd. Zowel WSL als een externe server kunnen Linux-omgevingen bieden.

### Stap 3: nagaan welke interpreter en omgeving worden gebruikt

Noteer de versie en het pad van de R- of Python-interpreter, plus de naam van de actieve Conda- of projectomgeving. Dat is vooral nuttig als een pakket al lijkt te zijn geïnstalleerd, maar de interpreter het niet kan vinden.

### Stap 4: de eerste relevante fout vinden

Installatielogboeken kunnen lang zijn. De laatste regel kan alleen zeggen dat de installatie is mislukt, terwijl de echte oorzaak eerder verscheen—bijvoorbeeld een ontbrekende systeembibliotheek of een conflict tussen afhankelijkheidsversies.

Begin te lezen bij de eerste `ERROR`, `Error`, `cannot`, `failed` of expliciete conflictmelding en inspecteer vervolgens de regels eromheen.

### Stap 5: vergelijken met de officiële systeemeisen

Bevestig:

- Welke besturingssystemen en processorarchitecturen worden ondersteund;
- Welke R of Python versies worden ondersteund;
- of een compiler of systeembibliotheek vereist is;
- of de installatie CRAN, Bioconductor, PyPI, een Conda-kanaal of de officiële bron van de software moet gebruiken; en
- Of de tutorial is geschreven voor een andere softwareversie.

Omzeil de officiële vereisten niet alleen omdat een oude opdracht uit een zoekresultaat korter lijkt.

### Stap 6: één ding veranderen en opnieuw testen

Als u besluit een pakketversie te wijzigen, een nieuwe omgeving te maken of een systeemcomponent toe te voegen, wijzigt u één categorie per keer en slaat u zowel de opdracht als het resultaat op. Zo bepaal je welke wijziging het probleem heeft opgelost.

## Eén singlecellproject kan meerdere omgevingen gebruiken

“Eén project, één omgeving” is een nuttige beginnersregel, maar een echt project kan meerdere onafhankelijke programma’s aanroepen.

Bijvoorbeeld:

```text
Ruwe 10x-gegevens
  → Voer Cell Ranger uit onder Linux
  → Genereer een expressiematrix
  → Gebruik Seurat in een R-omgeving of Scanpy in een Python-omgeving
  → Voer kwaliteitscontrole en clustering uit en visualiseer de resultaten
```

Cell Ranger, Seurat en Scanpy hoeven niet noodzakelijkerwijs in dezelfde omgeving te worden geïnstalleerd. Wat telt is het vastleggen van elke stap:

- in welke omgeving de stap werd uitgevoerd;
- welke invoer de stap gebruikte en welke uitvoer hij opleverde;
- Welke softwareversie het gebruikte;
- welk referentiegenoom of welke annotatieversie het heeft gebruikt; en
- Waar de logs en omgevingsrecords werden opgeslagen.

Hetzelfde geldt voor singlecell-multiomics en ruimtelijke omics. Eén analyse kan software van het sequencingplatform, R- of Python-pakketten, beeldverwerking en referentiegegevens combineren. Door per stap de werkomgeving vast te leggen, blijven de gebruikte rekenomstandigheden herleidbaar, ook als verschillende onderdelen in afzonderlijke omgevingen draaien.

## Codex kan helpen bij de installatie. Welke omgeving past bij je project?

Als je alleen meldt ‘het lukt niet om Scanpy te installeren’, moet Codex grotendeels gissen. Een bruikbare hulpvraag vermeldt:

```text
Ik voer de opdracht uit in Ubuntu onder WSL.
Mijn huidige Python-versie is ...
De uitvoer van python -m pip --version is ...
Mijn huidige Conda-omgeving is ...
De volledige opdracht die ik heb uitgevoerd is ...
De volledige uitvoer vanaf de eerste foutmelding is ...
De officiële installatie-instructies voor dit project staan hier: ...
Bepaal eerst of het probleem te maken heeft met het pad, de omgeving, de versie,
een afhankelijkheid of een systeembibliotheek. Licht toe waarop je dat baseert
en stel de kleinst mogelijke wijziging voor. Werk niet alle pakketten tegelijk bij.
```

Codex kan u helpen logs te lezen, versievereisten te vergelijken en diagnostische stappen te organiseren. U moet nog steeds bevestigen:

- of de documentatie waarnaar wordt verwezen overeenkomt met de huidige softwareversie;
- of het commando een omgeving zal wijzigen die al in gebruik is;
- of het bijwerken van software een reeds gevalideerde analyse kan beïnvloeden; en
- Of de minimale test en belangrijke resultaatcontroles na de reparatie opnieuw werden uitgevoerd.

Geef een AI-hulpmiddel genoeg informatie over de omgeving om een diagnose te stellen. Vraag bij elke voorgestelde wijziging naar de reden en naar een manier om te testen of ze het probleem oplost. Veel opdrachten achter elkaar proberen levert die informatie niet op.

## Welke omgevingsgegevens leg je vast per project?

Wanneer een analyse begint, registreer dan ten minste:

1. Het besturingssysteem en de versie;
2. De R of Python versie en het werkelijke pad;
3. de naam van de werkomgeving van het project;
4. de belangrijkste pakketten en hun versies;
5. de bron of het kanaal van de installatie;
6. Een omgevingsbestand zoals `renv.lock`, `requirements.txt` of `environment.yml`;
7. de gebruikte versies van het referentiegenoom, de genannotatie of andere referentiegegevens;
8. de logbestanden van de installatie en de uitvoering.

Het succesvol uitvoeren van code geeft alleen aan dat de huidige omgeving deze instructies heeft geaccepteerd. Alleen als de omgeving, inputs, parameters, softwareversies en outputcontroles ook bewaard blijven, hebben andere mensen een kans om de analyse te begrijpen en opnieuw op te bouwen.

## Bronnen en verdere lectuur

1. [Officiële Python documentatie: virtuele omgevingen maken met `venv`](https://docs.python.org/3/library/venv.html)
2. [Python Packaging Gebruikershandleiding: afhankelijkheden en vereisten bestanden](https://packaging.python.org/en/latest/discussions/install-requires-vs-requirements/)
3. [Officiële pip documentatie: afhankelijkheidsoplossing en conflicten](https://pip.pypa.io/en/stable/topics/dependency-resolution/)
4. [Officiële Conda documentatie: omgevingen beheren en delen](https://docs.conda.io/projects/conda/en/stable/user-guide/tasks/manage-environments.html)
5. [Officiële renv-documentatie: project-lokale omgevingen voor R](https://rstudio.github.io/renv/articles/renv.html)
6. [Officiële Bioconductor installatiehandleiding](https://bioconductor.org/install/)
7. [Officiële R-documentatie: `sessionInfo()`](https://stat.ethz.ch/R-manual/R-devel/library/utils/html/sessionInfo.html)
