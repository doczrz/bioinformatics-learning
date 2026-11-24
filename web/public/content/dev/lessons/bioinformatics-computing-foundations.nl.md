# 0.1 | Waarom wordt Linux zo vaak gebruikt in de bio-informatica? Wat doen R, Python en Codex?

Je krijgt gegevens van een singlecell-sequencingexperiment. Je wilt weten welke cellen in de ziektegroep zijn veranderd.

Voordat je die vraag kunt beantwoorden, doorloop je vaak de volgende stappen:

> gegevens downloaden → bestanden controleren → kwaliteitscontrole uitvoeren → sequenties uitlijnen of tellen → een expressiematrix samenstellen → statistische analyse uitvoeren → figuren maken → de resultaten interpreteren

Hierbij gebruik je verschillende soorten software. Sommige programma’s draaien onder Linux, terwijl analyses vaak in R of Python worden geschreven. AI-hulpmiddelen zoals Codex kunnen helpen om code te schrijven, opdrachten uit te voeren en resultaten te controleren.

Linux, R, Python en Codex vervullen elk een andere rol in het werkproces:

| Naam | Wat is het? | Gebruik in de bio-informatica |
| --- | --- | --- |
| Linux | Een besturingssysteem | Bestanden beheren, bio-informaticasoftware uitvoeren, verbinding maken met servers en werkprocessen organiseren |
| Bash | Een veelgebruikte shell op Linux | Opdrachten invoeren, programma’s aan elkaar koppelen en meerdere bestanden in één keer verwerken |
| R | Een programmeertaal en rekenomgeving voor statistiek | Statistische analyse, datavisualisatie, transcriptomica en analyse van individuele cellen |
| Python | Een breed inzetbare programmeertaal | Gegevens verwerken, werkprocessen automatiseren, machinelearning en analyse van omicsgegevens |
| Codex | Een AI-agent die met code, bestanden en gereedschappen kan werken | Helpen bij het schrijven, uitleggen, uitvoeren en controleren van analysecode |

Linux biedt de werkomgeving. Daarbinnen gebruik je Bash, R en Python voor verschillende taken. Codex kan helpen het werk te plannen, uit te voeren en te controleren. De onderzoeker beoordeelt de vraag en het bewijs.

![Hiërarchie die de rollen van Linux, Bash, R, Python, Codex en de onderzoeker in bioinformatica laat zien](figures/bioinformatics-computing-layers.nl.svg)

*Figuur 1 | Hoe de hulpmiddelen samenwerken. Linux levert het besturingssysteem, Bash verbindt opdrachten tot een workflow en R en Python voeren analyses uit. Codex kan bij verschillende stappen helpen. De onderzoeker stelt de vragen, beoordeelt het bewijs en interpreteert de uitkomsten. De oorspronkelijke projectillustratie is op 23 juli 2026 gemaakt met de beeldgenerator van OpenAI en daarna opnieuw getekend als vectorafbeelding met schaalbare tekst. De afbeelding bevat geen leverancierslogo’s, schermafbeeldingen of ontwerpen van derden. Ze laat één gangbare manier van werken zien.*

Het diagram is een leidraad in plaats van een rigide regel. R en Python draaien ook op Windows en macOS, en Linux is niet beperkt tot command-line gebruik.

## Drie vragen voor deze les

Aan het eind van deze les zou je het volgende moeten kunnen uitleggen:

1. Waarom gebruiken veel bioinformatica-workflows Linux?
2. Waar zijn R en Python elk geschikt voor, en hoe kun je er tussen kiezen?
3. Als Codex al code kan schrijven en analyses kan uitvoeren, waarom is het dan nog de moeite waard om deze fundamenten te leren?

Je hoeft Linux niet te installeren of commando's in deze les uit je hoofd te leren.

## Waarom wordt Linux zo vaak gebruikt in de bio-informatica?

### Reden 1: veel programma’s voor bio-informatica worden eerst voor Linux ontwikkeld

Veel programma’s voor het verwerken van sequencinggegevens worden onder Linux of een vergelijkbaar Unix-systeem ontwikkeld en getest. Sommige zijn ook beschikbaar voor macOS, maar bieden geen rechtstreekse ondersteuning voor Windows.

Bioconda levert bijvoorbeeld veel pakketten voor biomedisch onderzoek. Volgens de documentatie ondersteunt Bioconda Linux en macOS, maar niet rechtstreeks Windows. Ook 10x Genomics noemt Linux als systeemvereiste voor Cell Ranger.

[Officiële Bioconda documentatie](https://bioconda.github.io/index.html) · [Officiële systeemvereisten voor Cell Ranger](https://www.10xgenomics.com/support/software/cell-ranger/downloads/cr-system-requirements)

Dit betekent niet dat Windows niet kan worden gebruikt voor bio-informatica. Dit betekent dat wanneer een tool officieel alleen ondersteund wordt op Linux, het gebruik van een Linux omgeving het meestal makkelijker maakt om gedrag te verkrijgen dat consistent is met de documentatie.

### Reden 2: servers en rekenclusters draaien vaak onder Linux

Op een gewone laptop kun je de lessen lezen, kleine datasets verkennen en analysemethoden leren. Voor het verwerken van ruwe sequencinggegevens kan echter veel werkgeheugen, schijfruimte en rekenkracht nodig zijn.

Laboratoriumservers, rekenclusters voor zware taken (HPC, *high-performance computing*) en veel virtuele machines in de cloud draaien onder Linux. De opdrachten en mappenstructuren die je op je eigen computer leert gebruiken, kun je daardoor vaak op een server hergebruiken.

Linux maakt een computer op zichzelf niet sneller. Of een programma een dataset aankan, hangt onder meer af van de processor, het werkgeheugen, de vrije schijfruimte en de omvang van de gegevens. Heeft een analyse van ruwe data meer RAM nodig dan je pc heeft, dan lost een Linux-omgeving onder Windows dat tekort niet op.

### Reden 3: opdrachten zijn eenvoudig te combineren, vast te leggen en te herhalen

Grafische interfaces zijn handig voor het verkennen, maar na het klikken door vele schermen kan het moeilijk zijn om te antwoorden:

- Welk invoerbestand hebt u geselecteerd?
- Welke parameters heb je gebruikt?
- Welke softwareversie is geïnstalleerd?
- Welke stap heeft een waarschuwing veroorzaakt?
- Hoe zou je dezelfde procedure herhalen voor nog eens twintig monsters?

Aan de Linux-opdrachtregel kun je een reeks analysestappen vastleggen in een script: een bestand met opdrachten die de computer na elkaar kan uitvoeren. Je kunt die opdrachten nakijken, aanpassen, opnieuw uitvoeren en met anderen delen.

Met een script alleen is een analyse nog niet reproduceerbaar. Ook het referentiegenoom, de annotatiebestanden, de softwareversies, de monstergegevens en de startwaarde van de toevalsgenerator (de seed) kunnen het resultaat beïnvloeden.

### Reden 4: Linux biedt uitgebreide mogelijkheden voor bestandsbeheer en toegangsrechten

Een bio-informatica-analyse levert vaak veel bestanden op, zoals FASTQ- en BAM-bestanden, expressiematrices, tabellen met monstergegevens, logbestanden en figuren. Zonder duidelijke mappenstructuur kan een programma gegevens van het verkeerde monster inlezen of een eerder resultaat overschrijven.

Linux biedt expliciete bestandspaden, gebruikersrechten en logging mechanismen. Het doel van het leren van deze ideeën is niet om commando's te onthouden. Het is om te weten:

- Waar de gegevens zich bevinden;
- Wat het programma aan het lezen is;
- waar het resultaat zal worden geschreven;
- Welke bestanden kunnen worden gewijzigd; en
- Welk logboek te inspecteren na een fout.

## Moet je als Windows-gebruiker je computer opnieuw installeren?

Nee.

Met Windows Subsystem for Linux (WSL) kan een Windows-gebruiker een Linux-distributie, Bash en Linux-opdrachtregelprogramma's uitvoeren zonder een dual-boot-computer in te stellen.

[Officiële Microsoft WSL-overzicht](https://learn.microsoft.com/en-us/windows/wsl/about)

Op beginnersniveau kan WSL worden opgevat als een Linux-werkomgeving binnen een Windows-computer. Veel van dezelfde concepten blijven bruikbaar als je later een labserver gebruikt.

WSL en een externe server zijn echter niet hetzelfde:

- WSL gebruikt de rekenkracht, het geheugen en de opslag van je eigen computer.
- Een server gebruikt de bronnen van een externe machine;
- Op een HPC-cluster verdeelt een taakplanner (scheduler) de beschikbare rekenmiddelen over de taken die verschillende gebruikers indienen.
- Een cloudplatform kan kosten in rekening brengen voor opslag en rekentijd.

Latere praktijklessen zullen daarom zowel vermelden waar een commando wordt uitgevoerd als waar de gegevens worden opgeslagen. Ze zullen geen code presenteren zonder de uitvoeringsomgeving te identificeren.

## Wat is R?

Het R Project beschrijft R als een programmeertaal én een werkomgeving voor statistische berekeningen en grafieken.

[Officiële R Project introductie](https://www.r-project.org/about.html)

Een belangrijke kracht van R in bioinformatica is Bioconductor. Bioconductor is een open-source bio-informatica project gebaseerd op R. Het behandelt genomische, transcriptomische, flow-cytometrie en andere gegevens met nadruk op statistische methoden, documentatie en reproduceerbaar onderzoek.

[Officiële Bioconductor introductie](https://bioconductor.org/about/index.html)

Seurat is een veelgebruikt R-pakket voor de kwaliteitscontrole, verkenning, clustering, integratie en visualisatie van singlecelldata.

[Officiële Seurat documentatie](https://satijalab.org/seurat/)

Gemeenschappelijke sterke punten van R omvatten:

- Een volwassen ecosysteem voor statistische analyse;
- Een grote verzameling omics pakketten in Bioconductor;
- analyses, statistische modellen en figuren combineren in één script of rapport;
- Directe R-code in veel biomedische methoden secties en tutorials.

R vereist ook enige aanpassing:

- sommige pakketten vereisen specifieke versies van R of Bioconductor;
- Verschillende pakketten kunnen verschillende dataobjecten gebruiken;
- let bij grote datasets op het geheugengebruik en voorkom dat je grote objecten steeds opnieuw kopieert;
- ook als je een grafiek krijgt, moet je de statistische opzet nog controleren.

## Wat is Python?

Python is een programmeertaal voor algemeen gebruik. Naast wetenschappelijke computing wordt het op grote schaal gebruikt voor softwareontwikkeling, automatisering, netwerkdiensten, machine learning en onderwijs. De Python Package Index biedt een grote verzameling modules van derden.

[Officiële Python introductie](https://www.python.org/about/)

Scanpy is een verzameling Python-tools voor het voorbewerken, visualiseren, clusteren en analyseren van singlecelldata. Je kunt er onder meer mogelijke trajecten van celtoestanden mee afleiden en verschillen in genexpressie mee onderzoeken. Scanpy werkt met het dataobject AnnData.

[Officiële Scanpy documentatie](https://scanpy.readthedocs.io/)

Gemeenschappelijke sterke punten van Python zijn onder meer:

- Het verbinden van data download, bestandsverwerking, analyse en automatisering in een complete workflow;
- een breed aanbod aan hulpmiddelen voor wetenschappelijk rekenen, machine learning en deep learning;
- Integratie met databases, webservices en andere programma's; en
- Het ontwikkelen van herbruikbare analyse software en tools.

Python vereist ook enige aanpassing:

- Veel pakketten kunnen verschillende benaderingen bieden voor hetzelfde probleem;
- Versies van Python, pakketten en lagere-niveau bibliotheken moeten compatibel blijven;
- als je de codecellen van een notebook in een andere volgorde hebt uitgevoerd dan waarin ze staan, kan de analyse na opnieuw openen en uitvoeren andere resultaten geven of mislukken;
- De vrijheid van een taal voor algemeen gebruik vereist ook actief beheer van codestructuur en gegevensstatus.

## Wanneer kies je R en wanneer Python?

Er is geen enkel antwoord zonder een specifieke taak.

| Aspect | R | Python |
| --- | --- | --- |
| Oorspronkelijk doel | Statistische berekeningen en grafieken | Programmeren voor uiteenlopende toepassingen |
| Veelgebruikte pakketten in de bio-informatica | Bioconductor, Seurat | NumPy, pandas, scikit-learn, Scanpy/scverse |
| Veelgebruikte toepassingen | Statistische modellen, differentiële analyse, biostatistiek en figuren voor publicaties | Automatisering, machinelearning, gegevensverwerking en het bouwen van analysehulpmiddelen |
| Wat vraagt oefening? | Pakketversies, gegevensobjecten en statistische begrippen | Omgevingen beheren, softwarestructuur begrijpen en kiezen uit veel bibliotheken |
| Kun je er singlecelldata mee analyseren? | Ja | Ja |
| Werkt het onder Linux? | Ja | Ja |

De volgende beweringen zijn allemaal te eenvoudig:

- ‘Met R kun je alleen grafieken maken.’
- “Python is altijd sneller dan R.”
- “Python kan alles, dus R is overbodig.”
- “Biomedische papers gebruiken vaak R, dus Python is overbodig.”

De werkelijke prestaties zijn afhankelijk van het algoritme, de gegevensstructuren, de implementatie op lagere niveaus, het geheugen en parallelle berekeningen, niet alleen van de taalnaam. Veel R- en Python-pakketten roepen C, C++, Fortran of andere high-performance code op voor hun kernberekeningen.

Een nuttiger keuze begint met deze vragen:

1. Welk ecosysteem bevat een volwassen methode voor de onderzoeksvraag?
2. Welke implementatie wordt geleverd door de officiële tutorial en originele paper?
3. Welke dataobjecten en workflows gebruikt het team?
4. Moet het resultaat aansluiten op een bestaand project?
5. Kunt u elke stap uitleggen en valideren?

Een echt project kan beide talen gebruiken. Linux-tools kunnen een expressiematrix genereren, R kan statistische analyse uitvoeren en Python kan extra machine learning of automatisering bieden.

## Waarom deze cursus volgen als Codex zelf gegevens kan analyseren?

Codex kan bestanden lezen en wijzigen, code schrijven, taken uitvoeren en helpen bij het bouwen van geautomatiseerde workflows. OpenAI's huidige introductie van Codex benadrukt dat het echt werk kan uitvoeren over bestanden en tools.

[OpenAI introductie tot Codex](https://openai.com/academy/what-is-codex/)

Dit verandert de manier waarop mensen leren. Een beginner hoeft niet langer een grote hoeveelheid syntaxis te onthouden voordat hij gegevens gaat inspecteren of een analyseworkflow probeert.

Maar het neemt niet de noodzaak weg om bioinformatica te begrijpen.

### Code die zonder foutmelding draait, kan toch een verkeerde analyse opleveren

Code kan eindigen zonder een fout en een aantrekkelijke figuur produceren terwijl het nog steeds problemen bevat zoals:

- geen onafhankelijke biologische replicaten voor de ziekte- en controlegroepen;
- elke cel behandelen als een onafhankelijk biologisch monster;
- het gebruik van een incompatibel referentiegenoom;
- een belangrijke celpopulatie met weinig RNA onbedoeld wegfilteren;
- de experimentele conditie volledig laten samenvallen met de verwerkingsbatch, bijvoorbeeld alle patiënten op één dag verwerken en alle controles op een andere dag;
- overeenkomst in berekende profielen van twee celpopulaties uitleggen als bewijs voor een oorzakelijk verband.

Dit zijn meestal geen syntaxisfouten. Ze kunnen niet worden gedetecteerd door simpelweg te vragen of de code succesvol is uitgevoerd.

### Iemand moet de uitkomst van de AI kunnen beoordelen

Voor intuïtie kan Codex worden vergeleken met een snelle onderzoeksassistent die gereedschappen kan bedienen. Het kan bestanden organiseren, een fout uitleggen, een script schrijven en controles uitvoeren, maar je moet het nog steeds vertellen:

- wat de biologische vraag eigenlijk is;
- Welke gegevens mogen worden gebruikt?
- welk monster de onafhankelijke experimentele eenheid is;
- Wat telt als een succesvol resultaat;
- welke ongebruikelijke waarnemingen niet automatisch moeten worden verwijderd; en
- Welk bewijsmateriaal nodig is voor de eindconclusie.

De analogie heeft grenzen. Codex heeft niet het vaste vaardigheidsniveau van een menselijke assistent; zijn gedrag hangt af van het model, gereedschappen, context en machtigingen. Ongeacht de capaciteit, moet een definitieve analyse nog steeds worden gevalideerd door middel van bronnen, parameters, logs en onafhankelijk bewijs. OpenAI beschrijft Codex op dezelfde manier als een tool die menselijke begeleiding en beoordeling vereist in plaats van een vervanging voor menselijk oordeel.

### Ook het doel van een tutorial verandert

Voordat AI-tools beschikbaar waren, besteedden tutorials vaak veel ruimte aan het vragen van leerlingen om functienamen en commandoargumenten te onthouden.

In het Codex-tijdperk zijn belangrijkere leerdoelen:

- Begrijpen waarom een analysestap bestaat;
- Beschrijving van de inputs, outputs en succescriteria;
- Controleren of een door AI geselecteerde tool overeenkomt met de data;
- het herkennen van fouten in experimenteel ontwerp, statistiek en biologische interpretatie;
- De AI verplichten om code, versies, logs en beslissingsrecords te bewaren; en
- Weten welk bewijs te vertrouwen is wanneer een AI-resultaat conflicteert met officiële documentatie of een origineel paper.

Deze cursus concurreert dus niet met Codex om sneller code te schrijven. Het is bedoeld om leerlingen te helpen de juiste vragen te stellen, analyses te begeleiden, bewijsmateriaal te inspecteren en verantwoordelijkheid te nemen voor wetenschappelijk oordeel.

## Bronnen en verdere lectuur

1. [R Project: Wat is R?](https://www.r-project.org/about.html)
2. [Python.org: Over Python](https://www.python.org/about/)
3. [Bioconductor: Over ons](https://bioconductor.org/about/index.html)
4. [Officiële Bioconda documentatie](https://bioconda.github.io/index.html)
5. [Microsoft: Windows Subsysteem voor Linux](https://learn.microsoft.com/en-us/windows/wsl/about)
6. [10x Genomics: Cell Ranger Systeemvereisten](https://www.10xgenomics.com/support/software/cell-ranger/downloads/cr-system-requirements)
7. [Officiële Seurat documentatie](https://satijalab.org/seurat/)
8. [Officiële Scanpy documentatie](https://scanpy.readthedocs.io/)
9. [OpenAI Academy: Wat is ChatGPT Codex?](https://openai.com/academy/what-is-codex/)
