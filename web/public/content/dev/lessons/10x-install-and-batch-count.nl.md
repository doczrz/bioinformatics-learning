# 1.2 | Cell Ranger en Space Ranger van 10x Genomics installeren

In deze les installeert u twee programma’s op Linux. Cell Ranger maakt een genexpressiematrix uit sequencinggegevens van afzonderlijke cellen. Space Ranger koppelt de tellingen aan de posities waar het RNA op een weefselcoupe is opgevangen. [Officiële installatiehandleiding voor Cell Ranger](https://www.10xgenomics.com/support/software/cell-ranger/latest/tutorials/cr-tutorial-in) · [Officiële installatiehandleiding voor Space Ranger](https://www.10xgenomics.com/support/software/space-ranger/downloads/space-ranger-installation)

## Deel I. Cell Ranger installeren

### 1. Cell Ranger 10.1.0 downloaden en uitpakken

Kopieer het downloadcommando van de website van 10x naar uw Linux-terminal. Voer het commando uit en pak het gedownloade archief uit. [Cell Ranger downloaden](https://www.10xgenomics.com/support/software/cell-ranger/downloads#download-links)

### 2. Het humane referentiepakket downloaden en uitpakken

Download voor humane monsters het **humane referentiepakket GRCh38 2024-A** (ongeveer 11 GB). GRCh38 is de naam van de assemblage van het menselijk genoom en 2024-A is de versie van het referentiepakket van 10x. Cell Ranger gebruikt de sequenties, genannotaties en indexen in dit pakket om te bepalen van welk gen een uitgelezen sequentie (read) afkomstig is. [Het humane referentiepakket GRCh38 2024-A downloaden](https://cf.10xgenomics.com/supp/cell-exp/refdata-gex-GRCh38-2024-A.tar.gz)

Geef bij `--transcriptome` na het uitpakken het pad naar de volledige referentiemap op. Gebruik voor muizenmonsters het referentiepakket voor de muis.

### 3. Cell Ranger aan `PATH` toevoegen

Zodra het archief is uitgepakt, is het programma geïnstalleerd. Om `cellranger` vanuit de map van een monster te kunnen starten, moet Bash weten waar het programma staat. `PATH` bevat een lijst met mappen, gescheiden door dubbele punten. Bash doorzoekt ze van links naar rechts. Het onderstaande commando zet de nieuwe installatie vooraan. Het deel `:$PATH` behoudt de bestaande zoekmappen. [PATH instellen volgens de instructies van 10x](https://www.10xgenomics.com/support/software/cell-ranger/latest/tutorials/cr-tutorial-in)

```bash
export PATH="$HOME/10x-tools/cellranger-10.1.0:$PATH"
command -v cellranger
cellranger --version
```

De eerste controle hoort een pad in uw persoonlijke map te tonen dat eindigt op `/10x-tools/cellranger-10.1.0/cellranger`. Bij de tweede hoort `10.1.0` te verschijnen. Meldt Bash `command not found`, controleer dan of het uitvoerbare bestand op dat pad staat. Verschijnt er een oudere versie, voer dan `type -a cellranger` uit om alle gelijknamige commando’s te zien en na te gaan welke map als eerste aan de beurt is.

**De instelling bewaren voor nieuwe terminals.** Het commando `export` hierboven geldt voor de huidige Bash-sessie en de processen die deze start. Open uw persoonlijke configuratiebestand in een teksteditor, bijvoorbeeld met `nano ~/.bashrc`. Voeg de volgende regel onderaan toe. Staat de regel er al, laat deze dan één keer staan.

```bash
export PATH="$HOME/10x-tools/cellranger-10.1.0:$PATH"
```

Druk in nano op `Ctrl+O` en vervolgens op Enter om op te slaan. Sluit nano met `Ctrl+X`. Voer onderstaande commando’s uit om het bestand opnieuw in te lezen en het resultaat te controleren. Open daarna op de gebruikelijke manier een nieuwe terminal op de server en voer opnieuw `cellranger --version` uit.

```bash
source "$HOME/.bashrc"
command -v cellranger
cellranger --version
```

Bij een interactieve Bash-sessie die geen inlogshell is, leest Bash automatisch `~/.bashrc`. Wanneer u via SSH inlogt, hangt dit af van uw opstartinstellingen. Kan Bash het commando na opnieuw inloggen niet meer vinden, controleer dan of uw inlogbestand, vaak `~/.bash_profile`, ook `~/.bashrc` inleest. Op een cluster kunt u dezelfde regel `export PATH=...` in het jobscript opnemen. Zo gebruikt de rekennode de bedoelde versie. [Opstartbestanden van Bash](https://www.gnu.org/software/bash/manual/html_node/Bash-Startup-Files.html)

### 4. De helptekst van `cellranger` lezen

Voer deze commando’s uit vanuit een willekeurige map. Het eerste toont de taken die Cell Ranger kan uitvoeren. De andere twee laten de opties voor afzonderlijke taken zien. Elk commando toont de helptekst en sluit af.

```bash
cellranger --help
cellranger count --help
cellranger testrun --help
```

De regel `Usage` laat zien hoe u een commando opbouwt. In `cellranger testrun --id=check_install` is `cellranger` het programma, `testrun` het subcommando, `--id` een optie en `check_install` de naam die u aan deze uitvoering geeft. Vervang `<ID>` door uw eigen waarde. `[OPTIONS]` geeft aan waar u opties kunt toevoegen. Laat de punthaken en vierkante haken weg. Gebruik `-h` of `--help` voor de helptekst en `-V` of `--version` voor het versienummer.

| Subcommando’s in de helptekst | Functie |
| --- | --- |
| `testrun` | Test de installatie met een kleine meegeleverde dataset. |
| `count` | Telt moleculen per gen en voor andere ondersteunde kenmerken in één monster uit één celvangst. Een sequencingbibliotheek is de verzameling moleculen uit een monster die is voorbereid voor sequencing. |
| `multi`, `multi-template` | `multi` leest een configuratiebestand voor samengevoegde (gemultiplexte) monsters, Flex-experimenten of experimenten met verschillende soorten bibliotheken. `multi-template` maakt een sjabloon voor dat bestand. |
| `vdj`, `mkvdjref` | `vdj` reconstrueert de sequenties van T- of B-celreceptoren uit sequencinggegevens van het immuunrepertoire. `mkvdjref` bouwt een referentie voor die analyse. |
| `aggr`, `reanalyze`, `annotate` | `aggr` voegt resultaten van meerdere analyses samen. `reanalyze` voert de dimensiereductie en clustering opnieuw uit op een bestaande matrix. `annotate` voorspelt celtypen op basis van bestaande resultaten. |
| `mkref`, `mkgtf`, `mat2csv` | `mkref` bouwt een eigen referentie uit bestanden met sequenties en genannotaties. `mkgtf` filtert genannotaties op kenmerk. `mat2csv` zet een matrix om in CSV. Bij een grote matrix kan het CSV-bestand veel schijfruimte innemen. |
| `sitecheck`, `upload`, `telemetry`, `cloud`, `help` | `sitecheck` toont de computerconfiguratie. `upload` stuurt het opgegeven diagnosebestand naar de helpdesk van 10x. Met `telemetry` bekijkt of wijzigt u de instellingen voor het verzamelen van gebruiksgegevens. `cloud` geeft toegang tot de clouddiensten van 10x. `help` toont uitleg bij een commando. |

Oudere handleidingen noemen soms `mkfastq`. Dit commando is door 10x als verouderd aangemerkt. Levert uw sequencingfaciliteit FASTQ-bestanden aan, dan kunt u daarmee beginnen. Ze bevatten de sequenties en de kwaliteitsscore van elke uitgelezen base. De installatietest gebruikt eigen voorbeeldgegevens. [Cell Ranger-commando’s](https://www.10xgenomics.com/support/software/cell-ranger/latest/getting-started/cr-command-line-arguments) · [Broncode van de commando’s in Cell Ranger 10.1.0](https://github.com/10XGenomics/cellranger/blob/cellranger-10.1.0/lib/rust/cr_wrap/src/bin/cellranger.rs)

Zoek in de uitvoer van `cellranger count --help` eerst de volgende opties op. Ze bepalen welke invoerbestanden het programma gebruikt en in welke map de resultaten terechtkomen.

| Optie | Standaardwaarde of gedrag bij weglaten in Cell Ranger 10.1.0 | Wat vult u in voor uw monster? |
| --- | --- | --- |
| `--id` | Verplicht, zonder standaardwaarde. | Kies een naam voor de run en de uitvoermap, bijvoorbeeld `GEX_A`. |
| `--fastqs` | In dit voorbeeld verplicht. Er is geen standaardpad. | Geef de map op waarin de sequencingbestanden staan. |
| `--sample` | Bij één bestandsnaamprefix selecteert het programma het monster automatisch. Bij meerdere prefixen geeft het een fout als u deze optie weglaat. | Vul het prefix van het gewenste monster in. Het prefix van `GEX_A_S1_L001_R1_001.fastq.gz` is bijvoorbeeld `GEX_A`. |
| `--transcriptome` | In dit voorbeeld verplicht. Er is geen standaardreferentie. | Geef de volledige referentiemap op die u in stap 2 hebt uitgepakt. |
| `--localcores` | In de lokale modus worden alle beschikbare CPU-kernen gebruikt. | Vul het aantal kernen in dat aan deze taak is toegewezen. |
| `--localmem` | In de lokale modus wordt 90% van het gedetecteerde geheugen gebruikt. | Stel de geheugenlimiet in GB in, binnen het geheugen dat u voor deze taak hebt gekregen. |
| `--create-bam` | Verplicht. Kies expliciet `true` of `false`. | Kies `true` als u de uitlijningen van individuele reads wilt bewaren. Kies `false` als u alleen de expressiematrix nodig hebt. |
| `--include-introns` | `true` voor standaard 3′- en 5′-genexpressieanalyses van het hele transcriptoom. | Standaard tellen intronische reads mee als ze aan de criteria voldoen. Kies `false` om ze uit te sluiten. |
| `--nosecondary` | Deze schakelaar staat standaard uit. De ingebouwde secundaire analyse wordt uitgevoerd. | Voeg `--nosecondary` toe om deze stap over te slaan als u zelf dimensiereductie en clustering uitvoert. |

### 5. De installatie testen met `testrun` en een incompatibel besturingssysteem herkennen

**Verschijnt de onderstaande melding, controleer dan het besturingssysteem van de machine waarop de test draaide.** De fout betreft de compatibiliteit van het besturingssysteem. Een andere referentie kiezen of hetzelfde programma opnieuw uitpakken helpt hier niet.

```text
ERROR: This operating system version is unsupported:
    CentOS Linux release XXX (Core)
...
To continue running this version for now, set TENX_IGNORE_DEPRECATED_OS=1
```

Vraag voor de analyse van projectgegevens aan uw beheerder om een rekennode die aan de huidige eisen van 10x voldoet. Controleer op die node de versie met `cellranger --version` en herhaal de installatietest. De inlognode en de rekennode waarop de taak draait, kunnen verschillende besturingssystemen gebruiken. [Ondersteunde besturingssystemen volgens 10x](https://www.10xgenomics.com/support/software/cell-ranger/latest/miscellaneous/cr-os-requirements) · [Systeemeisen voor Cell Ranger 10.1](https://www.10xgenomics.com/support/software/cell-ranger/downloads/cr-system-requirements)

Om de tijdelijke oplossing uit de foutmelding toe te passen, voert u `export TENX_IGNORE_DEPRECATED_OS=1` uit.

### 6. Telopties kiezen voor uw versie

`testrun` test of het programma kan draaien. Met `count` zet u uw eigen FASTQ-bestanden om in een expressiematrix. Controleer bij een ouder script de onderstaande instellingen. Ze bepalen mede welke tellingen of uitvoerbestanden u krijgt. [Versie-informatie van Cell Ranger](https://www.10xgenomics.com/support/software/cell-ranger/latest/release-notes/cr-release-notes) · [Opties van Cell Ranger 10.1](https://www.10xgenomics.com/support/software/cell-ranger/latest/getting-started/cr-command-line-arguments)

| Wat veranderde er? | Wat betekent dit voor uw project? |
| --- | --- |
| **Vanaf versie 7.0** is `--include-introns=true` de standaard voor de gebruikelijke 3′- en 5′-genexpressieanalyses van het hele transcriptoom. Eerdere versies sloten introns standaard uit. | Introns zijn delen van een RNA-transcript die bij het splitsen en weer aaneenvoegen van RNA (splicing) doorgaans worden verwijderd. Met `true` kan een read uit een intron bijdragen aan de molecuultelling als de uitlijning aan de criteria voldoet en de read aan een gen kan worden toegewezen. Dit is vooral nuttig bij celkernen, die meer ongesplicet RNA bevatten. Met `false` tellen zulke reads niet mee. Controleer de oorspronkelijke instelling als u oudere tellingen wilt reproduceren. |
| **Vanaf versie 8.0** moet u bij `count` expliciet `--create-bam=true` of `false` opgeven. Deze instelling vervangt de oudere optie `--no-bam`. | Een BAM-bestand legt de uitlijning van elke read vast. Kies `false` om schijfruimte en schrijftijd te besparen als u alleen de matrix nodig hebt en al weet hoe u de kwaliteit gaat controleren. Kies `true` als u de uitlijningen in een genoombrowser wilt bekijken, een volgende analysestap een BAM-bestand vereist of u daar nog over twijfelt. In beide gevallen krijgt u de expressiematrix. |
| **In versie 10.1** kent Pan-Human Azimuth bij humane gegevens standaard lokaal celtypen toe. De ingebouwde secundaire analyse gebruikt standaard UMAP en laat t-SNE uitgeschakeld. | `--disable-cell-annotation` schakelt de automatische celtypeannotatie uit. Met `--enable-tsne=true` voegt u t-SNE toe aan de ingebouwde secundaire analyse. UMAP en t-SNE projecteren hoogdimensionale expressiegegevens op een kleiner aantal dimensies om ze zichtbaar te maken. |

**Wanneer gebruikt u `--nosecondary`?** Behoud bij een eerste oefening de standaard secundaire analyse om de projecties en celclusters van Cell Ranger te bekijken. Wilt u zelf projecties en clusters uit de expressiematrix berekenen in Seurat of Scanpy, voeg dan `--nosecondary` toe aan `cellranger count`. Deze optie heeft geen waarde nodig. U bespaart de rekentijd van de ingebouwde secundaire analyse en krijgt de bijbehorende resultaten dan ook niet. Of u een BAM-bestand wilt schrijven, bepaalt u afzonderlijk, bijvoorbeeld met `--create-bam=false`.

## Deel II. Space Ranger installeren

### 1. Space Ranger 4.1.0 downloaden en uitpakken

Space Ranger koppelt het door Visium gemeten RNA aan de vangstposities op de weefselcoupe. [Officiële installatiehandleiding voor Space Ranger](https://www.10xgenomics.com/support/software/space-ranger/downloads/space-ranger-installation) · [Systeemeisen](https://www.10xgenomics.com/support/software/space-ranger/downloads/space-ranger-system-requirements)
Download het archief van de gewenste versie en pak het uit. De meest recente versie vindt u op de downloadpagina van 10x. [Space Ranger downloaden](https://www.10xgenomics.com/support/software/space-ranger/downloads)

**Het humane referentiepakket downloaden en uitpakken.** Space Ranger gebruikt dezelfde referentie GRCh38 2024-A als Cell Ranger. Hebt u die al uitgepakt, ga dan door naar de volgende stap. [Het humane referentiepakket GRCh38 2024-A downloaden (ongeveer 11 GB)](https://cf.10xgenomics.com/supp/cell-exp/refdata-gex-GRCh38-2024-A.tar.gz)

Geef voor `spaceranger count` bij `--transcriptome` het pad op naar de uitgepakte referentiemap.

### 2. `PATH` instellen en de helptekst lezen

```bash
export PATH="$HOME/10x-tools/spaceranger-4.1.0:$PATH"
command -v spaceranger
spaceranger --version
```

Het pad hoort te eindigen op `/spaceranger-4.1.0/spaceranger` en de versie hoort `4.1.0` te zijn. Open het configuratiebestand met `nano ~/.bashrc`, zet het commando `export` op een eigen regel en voer `source ~/.bashrc` uit. Open een nieuwe terminal en voer opnieuw `spaceranger --version` uit. Hebt u beide programma’s geïnstalleerd, geef dan elk programma een eigen `export`-regel in `.bashrc`.

```bash
spaceranger --help
spaceranger testrun --help
spaceranger count --help
```

Lees de helptekst op dezelfde manier als hierboven. Zoek het programma, het subcommando en de bijbehorende opties. `--help` toont de syntaxis en `--version` het versienummer. [Documentatie van de Space Ranger-commando’s](https://www.10xgenomics.com/support/software/space-ranger/latest/analysis/running-pipelines/command-line-arguments)

| Subcommando’s | Functie |
| --- | --- |
| `testrun`, `count` | `testrun` controleert de installatie met de meegeleverde gegevens. `count` verwerkt één vanggebied op het objectglas en levert expressiematrices, ruimtelijke coördinaten en resultaten op basis van het weefselbeeld. |
| `segment`, `annotate` | `segment` herkent celkernen in ondersteunde Visium HD-beelden van weefsel. `annotate` voorspelt celtypen op basis van daarvoor geschikte resultaten van de HD-celsegmentatie. |
| `aggr` | Voegt compatibele analyses van meerdere vanggebieden samen. Space Ranger 4.1 ondersteunt hiervoor geen Visium HD. |
| `mkref`, `mkgtf`, `mat2csv` | Deze commando’s bouwen achtereenvolgens een referentie, filteren genannotaties en zetten een expressiematrix om in CSV. |
| `sitecheck`, `upload`, `telemetry`, `cloud` | Hiermee controleert u respectievelijk de computeromgeving, stuurt u diagnosebestanden naar de helpdesk van 10x, beheert u de verzameling van gebruiksgegevens en werkt u met de clouddiensten van 10x. Het commando `mkfastq` uit oudere werkprocessen is verouderd. |

### 3. De installatie testen op een rekennode met of zonder internet

```bash
cd "$HOME/10x-work"
spaceranger testrun --id=check_spaceranger
```

`--id` geeft de uitvoermap een naam. Zodra de terminal `Pipestance completed successfully!` toont, is de installatietest geslaagd. Krijgt u een melding over een niet-ondersteund besturingssysteem, voer dan `cat /etc/os-release` uit op de rekennode waar de taak draaide. Kies een node die aan de eisen van Space Ranger voldoet. Space Ranger 4.1 ondersteunt CentOS 7.5 niet. [Systeemeisen voor Space Ranger](https://www.10xgenomics.com/support/software/space-ranger/downloads/space-ranger-system-requirements)

De melding `Could not retrieve spot layout data` betekent dat het programma de indeling van de vangstpunten op het objectglas niet kon ophalen. Heeft de rekennode geen internettoegang, herhaal dan de **installatietest** in de offlinemodus met een nieuwe uitvoermap.

```bash
spaceranger testrun --no-internet --id=check_spaceranger_offline
```

**Analyseert u uw eigen objectglas** op een offline rekennode, download het bestand met de indeling dan eerst op een computer met internettoegang. Gebruik daarvoor het serienummer van het objectglas in uw experiment. Kopieer het bestand naar de rekennode en geef bij `spaceranger count` de opties `--slidefile`, `--slide` en `--area` op. Controleer na een geslaagde installatietest of het objectglas, het vanggebied en de afbeelding bij elkaar horen. [Instructies van 10x voor offlinetests en de indeling van objectglazen](https://www.10xgenomics.com/support/software/space-ranger/downloads/space-ranger-installation)

### 4. De opties instellen voor één Visium-vanggebied

In dit voorbeeld gebruiken we **het oorspronkelijke Visium v1 met vers ingevroren humaan weefsel en een helderveldopname na H&E-kleuring**. H&E staat voor hematoxyline en eosine, twee kleurstoffen die de weefselstructuur zichtbaar maken. Vervang `V10J25-015`, `A1`, `Tissue_A` en de bestandsnaam van de afbeelding door de gegevens van uw eigen objectglas en sequencingdocumentatie. Als u alleen de installatie wilde testen, was u na de vorige stap klaar.

```bash
cd "$HOME/10x-work"
spaceranger count --id=visium_A \
  --transcriptome="$HOME/10x-work/refs/refdata-gex-GRCh38-2024-A" \
  --fastqs="$HOME/10x-work/fastqs/Tissue_A" --sample=Tissue_A \
  --image="$HOME/10x-work/images/Tissue_A_HE.tif" \
  --slide=V10J25-015 --area=A1 \
  --include-introns=true --create-bam=false
```

| Optie in het voorbeeld | Standaardwaarde of gedrag bij weglaten in Space Ranger 4.1.0 | Wat vult u in en wat verandert er? |
| --- | --- | --- |
| `--id` | Verplicht, zonder standaardwaarde. | Kies een naam voor de uitvoermap. In dit voorbeeld is dat `visium_A/`. |
| `--transcriptome` | Verplicht. Er is geen standaardreferentie. | Geef de map met de uitgepakte humane referentie op. |
| `--fastqs` | In dit voorbeeld verplicht. Er is geen standaardpad. | Geef de map met de sequencingbestanden voor dit vanggebied op. |
| `--sample` | Bij één bestandsnaamprefix selecteert het programma het monster automatisch. Bij meerdere prefixen geeft het een fout als u deze optie weglaat. | Vul het FASTQ-bestandsnaamprefix voor dit vanggebied in, hier `Tissue_A`. |
| `--image` | Er is geen standaardafbeelding. In dit voorbeeld is het pad naar de H&E-helderveldopname nodig. | Geef de microscoopopname van dit vanggebied op. De software herkent het weefsel en lijnt de sequencingcoördinaten uit met de afbeelding. |
| `--slide` | Er is geen standaardserienummer. In dit voorbeeld is het verplicht. | Vul het serienummer van het gebruikte objectglas in, bijvoorbeeld `V10J25-015`. |
| `--area` | Er is geen standaardvanggebied. In dit voorbeeld hoort deze optie bij `--slide`. | Vul de aanduiding van het vanggebied op het glas in, bijvoorbeeld `A1`. Verwerk ieder vanggebied apart. |
| `--include-introns=true` | `true` voor het Visium v1-experiment in dit voorbeeld. | Het voorbeeld behoudt de standaardwaarde. Intronische reads die aan de criteria voldoen, tellen mee bij het bepalen van het aantal moleculen. |
| `--create-bam=false` | Verplicht. Kies expliciet `true` of `false`. | Met `false` krijgt u de expressiematrix en de ruimtelijke resultaten zonder BAM-bestand met de afzonderlijke reads. Kies `true` als u uitlijningen wilt bekijken of nog niet weet wat u later nodig hebt. |

Open na afloop `visium_A/outs/web_summary.html` voor een overzicht van de ruimtelijke kwaliteitscontroles voor dit vanggebied. De afbeeldingen en positiecoördinaten staan in `visium_A/outs/spatial/`. In een expressiematrix van het oorspronkelijke Visium staat elke barcode voor één vangstpunt. Onder één punt kunnen meerdere cellen liggen. [Ruimtelijke uitvoer van Space Ranger](https://www.10xgenomics.com/support/software/space-ranger/latest/analysis/outputs/spatial-outputs)

**Drie versiewijzigingen om bij oudere scripts te controleren**

| Space Ranger-versie | Gevolg voor het commando of de resultaten |
| --- | --- |
| **Vanaf versie 3.0** | Bij `count` moet u expliciet `--create-bam=true` of `false` opgeven. Kies `false` om schijfruimte en schrijftijd te besparen als u alleen de matrix en de ruimtelijke coördinaten nodig hebt. |
| **Versiereeks 4.0** | Deze versies ondersteunen Visium HD 3′ en introduceren de segmentatie van celkernen en cellen op weefselbeelden. Laat `--probe-set` weg voor HD 3′. Geef voor Visium HD op basis van probes de probeset op die bij het experiment hoort. |
| **Vanaf versie 4.1** | Bij **Visium v1 en Visium HD 3′** tellen introns standaard mee. Gebruik `--include-introns=false` om een analyse te reproduceren waarin introns werden uitgesloten. Bij metingen op basis van probes identificeren probeparen de doelmoleculen. Controleer daarom welke probeset is gebruikt. |

Hebt u ervaring met ruimtelijke analyse en gaat u de gegevens zelf clusteren op basis van de matrix, de weefselbeelden en de coördinaten, dan bespaart `--nosecondary` de rekentijd van de ingebouwde secundaire analyse. Behoud de secundaire analyse als u de clusters van Space Ranger wilt bekijken. Controleer in beide gevallen of de coördinaten goed op de weefselafbeelding liggen. [Versie-informatie van Space Ranger](https://www.10xgenomics.com/support/software/space-ranger/latest/release-notes/release-notes-for-SR) · [Invoer voor de verschillende Visium HD-experimenten](https://www.10xgenomics.com/support/software/space-ranger/latest/analysis/running-pipelines/count-visium-hd)
