# 1.1 | RNA-sequencing van individuele cellen: geschiedenis, principes en platforms

Stel je een glas sap voor dat uit verschillende soorten fruit is geperst. Je kunt meten hoe zoet het sap is. Aan die meting alleen zie je moeilijk of de suiker vooral uit appels kwam of uit een paar heel zoete druiven.

Bij een weefselmonster speelt hetzelfde probleem. Een tumor, een druppel bloed of een stukje hersenweefsel bevat vaak allerlei celtypen. Als je al hun RNA samen meet, zie je veranderingen in het monster als geheel. Zeldzame cellen vallen dan gemakkelijk weg, en het is lastig een verandering aan één celtype toe te schrijven.

RNA-sequencing van individuele cellen (scRNA-seq) maakt die herkomst traceerbaar. **Voordat materiaal uit verschillende cellen wordt samengevoegd voor sequencing, krijgt het een label dat naar de cel van herkomst verwijst.**

In deze les gebruiken we nog geen software. We volgen de stappen van monster naar meetresultaat:

> biologisch monster → afzonderlijke cellen → de herkomst van het RNA labelen → sequencen → expressiematrix met genen in de rijen en cellen in de kolommen


## Vier begrippen om mee te beginnen

- Een **cel** is een basiseenheid van het leven. Cellen in hetzelfde weefsel kunnen van elkaar verschillen.
- **DNA** bewaart relatief stabiele erfelijke informatie. Het RNA dat uit een gen wordt gemaakt, geeft een aanwijzing over het gebruik van dat gen.
- **RNA** kun je voorlopig zien als een tijdelijke werkkopie van DNA. Als RNA van een gen gemakkelijker te detecteren is, is dat gen meestal actiever in de cel. Het verband is niet één op één.
- Het **transcriptoom** omvat alle RNA-moleculen die op een bepaald moment in een monster waarneembaar zijn. Het geeft een momentopname van de activiteit van een cel.

Met deze vier begrippen kun je de rest van de les volgen.

In de hier besproken standaardmethoden voor genexpressie meet je vooral mRNA met een poly(A)-staart dat tijdens het experiment wordt ingevangen. Niet alle soorten RNA worden even goed gemeten. Hoeveel je telt, hangt af van de aanmaak en afbraak van RNA én van de efficiëntie van de vangst. De telling benadert hoeveel mRNA op dat moment nog aanwezig was en werd ingevangen. Daaruit kun je niet rechtstreeks de transcriptiesnelheid van een gen aflezen.

## Wat gaat er verloren als je alle RNA samen meet?

Stel dat een monster 90 cellen van type A en 10 van type B bevat. Alleen in type B komt een gen dat met ontsteking samenhangt sterk tot expressie. Bij een gezamenlijke meting van de 100 cellen wordt dat signaal uitgemiddeld. Je ziet een ontstekingssignaal, maar weet nog niet welke cellen het hebben veroorzaakt.

Met scRNA-seq kun je andere vragen stellen:

- Welke celtypen zijn waarschijnlijk in het monster aanwezig?
- Welke genen zijn doorgaans actief in dezelfde groep cellen?
- Vertoont een kleine groep cellen een afwijkende toestand?
- Welk celtype verandert bij ziekte, door behandeling of in de loop van de tijd?

De resultaten komen doorgaans in een tabel met genen als rijen en cellen als kolommen:

| Gen | Cel 1 | Cel 2 | Cel 3 |
| --- | ---: | ---: | ---: |
| Gen A | 8 | 0 | 1 |
| Gen B | 0 | 6 | 5 |
| Gen C | 2 | 1 | 0 |

Elke rij staat voor een gen en elke kolom voor een **kandidaatcel**. Dat is een barcode waarvan de software vermoedt dat hij bij een reactiecompartiment met een cel hoort. Het compartiment hoeft niet precies één intacte cel te hebben bevat.

Wat een getal betekent, hangt af van de methode. Bij 10x en andere methoden met UMI’s is het meestal het aantal onderscheiden UMI’s voor één gen en één celbarcode. Dat is een technische schatting van het aantal ingevangen moleculen. Smart-seq2 gebruikt geen UMI’s. Daar kan de matrix het aantal gelezen sequentiefragmenten (reads) of een daaruit berekende hoeveelheid bevatten. In een latere les vergelijken we readtellingen, UMI-tellingen en genormaliseerde waarden.

**De getallen zijn metingen. Ze vormen geen volledige inventaris van het RNA in een cel.** RNA kan bij de verwerking afbreken of niet worden ingevangen. Van een schaars molecuul kan toevallig geen enkele kopie worden gemeten. Een nul past dus zowel bij een gen zonder expressie als bij RNA dat tijdens dit experiment niet is gedetecteerd.

Wanneer weefsel uiteenvalt in losse cellen, gaan de oorspronkelijke posities van de cellen meestal verloren. Een clusterdiagram laat later zien welke cellen op elkaar lijken qua genexpressie. Voor hun werkelijke ligging in het weefsel heb je een afzonderlijke meting nodig, bijvoorbeeld met weefselbeeldvorming of ruimtelijke omics.

## Hoe is deze techniek ontstaan?

Elke belangrijke ontwikkeling beantwoordde een andere onderzoeksvraag.

### 2009: kunnen we het RNA van één cel meten?

In 2009 toonden Tang Fuchou en collega’s van de Universiteit van Peking in *Nature Methods* aan dat ze het mRNA van individuele blastomeren en eicellen van de muis op transcriptoomniveau konden sequencen. De gegevenstabellen vermelden zes onafhankelijke eencellige monsters. Ondanks de kleine hoeveelheid uitgangsmateriaal konden de onderzoekers het RNA omzetten in cDNA en met hogedoorvoersequencing veel genen detecteren.

Deze studie geldt als een belangrijk beginpunt van scRNA-seq. Ze liet zien dat de meting mogelijk was. Duizenden cellen tegelijk verwerken was toen nog moeilijk.

[Oorspronkelijke publicatie van Tang en collega’s](https://doi.org/10.1038/nmeth.1315)

### Smart-seq: kunnen we een groter deel van elk transcript meten?

RNA is instabiel en een cel bevat er weinig van. Daarom begint een experiment meestal met **reverse transcriptie**. Daarbij wordt RNA overgeschreven naar stabieler complementair DNA (cDNA), dat vervolgens kan worden vermeerderd en gesequencet.

Met Smart-seq (2012) kon men een groter deel van transcripten in afzonderlijke cellen uitlezen. Smart-seq2 verbeterde in 2013 de gevoeligheid, de nauwkeurigheid en de gelijkmatigheid van de dekking. Smart-seq3 voegde in 2020 UMI’s toe aan het 5′-uiteinde, zodat molecuultelling gecombineerd kon worden met analyse van transcripten en allelen.

Bij Smart-seq komt elke cel doorgaans in een afzonderlijk reactieputje. Dat maakt het mogelijk splice-isovormen en sequentieverschillen in detail te onderzoeken. Omdat elke cel afzonderlijke verwerking en meer sequencingcapaciteit vraagt, kunnen meestal minder cellen tegelijk worden gemeten dan bij druppelmethoden.

‘Volledige lengte’ betekent dat reads verspreid kunnen liggen over een groot deel van het transcript. **Het betekent niet dat elk RNA-molecuul van het 5′- tot het 3′-uiteinde in één ononderbroken read wordt gelezen.**

[Publicatie over Smart-seq](https://doi.org/10.1038/nbt.2282) · [Publicatie over Smart-seq2](https://doi.org/10.1038/nmeth.2639) · [Publicatie over Smart-seq3](https://doi.org/10.1038/s41587-020-0497-0)

### Druppeltechnologie: kunnen we meer cellen tegelijk meten?

Om de cellen van een heel weefsel in kaart te brengen, moesten onderzoekers duizenden cellen parallel kunnen verwerken. In 2015 lieten inDrop en Drop-seq zien hoe je het RNA van vele cellen in kleine druppels tegelijk kunt labelen. Zheng en collega’s beschreven in 2017 een hogedoorvoersysteem dat een belangrijke basis werd voor de Chromium-workflow van 10x Genomics. Ze toonden gegevens van tienduizenden mononucleaire cellen uit menselijk perifeer bloed.

Er waren dus al druppelmethoden vóór 10x. De bijdrage van 10x was het samenbrengen van druppelvorming, gelparels met barcodes, UMI’s en bijbehorende gegevensverwerking in een systeem voor grootschalig gebruik.

[Publicatie over inDrop](https://doi.org/10.1016/j.cell.2015.04.044) · [Publicatie over Drop-seq](https://doi.org/10.1016/j.cell.2015.05.002) · [Publicatie van Zheng en collega’s](https://doi.org/10.1038/ncomms14049)

## Vóór het mengen krijgt elk molecuul een ‘adres’

Als je duizend cellen direct openbreekt, komt al hun RNA in dezelfde buis. Aan de RNA-sequentie alleen kun je achteraf niet meer zien uit welke cel een bepaald molecuul kwam.

Denk aan een pakket: het krijgt zijn adres voordat het in een groot sorteercentrum belandt. Op vergelijkbare wijze wordt een korte, uitleesbare DNA-sequentie aangebracht vóór cDNA uit verschillende cellen wordt gemengd. Na het sequencen kan software de reads zo weer op herkomst sorteren.

Bij 10x kom je drie labels tegen die iets verschillends aangeven:

| Label | Wat onderscheidt het? | Een vraag om te onthouden |
| --- | --- | --- |
| Celbarcode | Verschillende GEM’s, de afzonderlijke reactiecompartimenten | Uit welk compartiment komt dit cDNA? |
| UMI (unieke moleculaire identificatiecode) | Afzonderlijke oorspronkelijke RNA-moleculen binnen hetzelfde compartiment | Welk ingevangen molecuul is dit? |
| Monsterindex | Verschillende bibliotheken die samen zijn gesequencet | Bij welke bibliotheek hoort deze read? |

Een monsterindex markeert een bibliotheek. De index vertelt op zichzelf niets over de donor, behandeling of biologische herhaling. Een monster van één donor of proefdier kan over meerdere bibliotheken zijn verdeeld. Met extra multiplexing kunnen juist meerdere monsters in één bibliotheek zitten. Duizenden cellen uit één monster zijn dus geen duizenden onafhankelijke biologische herhalingen. De experimentele eenheid is meestal de onafhankelijke donor, het dier of het monster. Later behandelen we experimenteel ontwerp, pseudoreplicatie en de statistische vergelijking van groepen.

De vergelijking met een postadres heeft drie grenzen:

1. De celbarcode identificeert een **GEM-compartiment**. Als er twee of meer cellen in dezelfde GEM terechtkomen, delen ze de barcode. Zo ontstaat een doublet of multiplet.
2. Dankzij UMI’s tellen kopieën die tijdens PCR ontstaan minder vaak dubbel mee. Verschillende moleculen kunnen echter toevallig dezelfde UMI hebben. Ook sequencingfouten en molecuulverlies beïnvloeden de telling.
3. RNA uit kapotte cellen kan vrij in de suspensie terechtkomen. Dit omgevings-RNA kan samen met een intacte cel een GEM binnengaan en dezelfde barcode krijgen. De barcode bewijst dus niet dat elk RNA-molecuul uit de intacte cel kwam. Een latere les over kwaliteitscontrole behandelt het opsporen en corrigeren van deze verontreiniging.

## De 10x 3′-genexpressiemethode in zes stappen

De sequencer leest uiteindelijk een DNA-bibliotheek. De cellen zijn dan al opengebroken en hun RNA is omgezet in gelabeld cDNA.

Hieronder volgen we de gangbare 10x 3′-genexpressiemethode. De 5′-methode gebruikt ook GEM’s, celbarcodes en UMI’s, maar brengt de labels via andere chemische reacties in het cDNA aan. Voor de uitvoering met een bepaalde versie van de reagentia gebruik je de bijbehorende handleiding.

Het proces begint bij de monsterafname. Hoelang een weefsel zonder bloedtoevoer blijft (de ischemietijd), hoe het wordt bewaard, de wachttijd vóór verwerking, de medewerker en de partij reagentia kunnen al vóór de dissociatie beïnvloeden welke cellen je terugvindt en in welke toestand. Laat behandeling of experimentele conditie niet volledig samenvallen met verwerkingsdag of batch. Later bespreken we randomisatie, evenwichtige verdeling over batches, controles en registratie van metadata.

### Stap 1. Maak een suspensie van afzonderlijke cellen

Met mechanische of enzymatische behandeling worden de cellen van een weefsel zo goed mogelijk van elkaar losgemaakt. Het vloeibare mengsel heet een **suspensie van afzonderlijke cellen**. Idealiter blijven de cellen intact en levensvatbaar en bevat het mengsel zo min mogelijk klonters, celresten en vrij RNA.

Vraag hoe de suspensie is gemaakt. Scheiding of verrijking kan sommige populaties behouden en andere verwijderen. Volbloed waaruit de rode bloedcellen zijn verwijderd, mononucleaire cellen uit perifeer bloed (PBMC’s) en een voor granulocyten verrijkt monster bevatten verschillende cellen. Na de gebruikelijke scheiding op dichtheid bevat de PBMC-fractie vooral lymfocyten en monocyten. De meeste neutrofielen met normale dichtheid komen niet in die fractie terecht. PBMC-gegevens vertegenwoordigen dus niet alle witte bloedcellen.

Een celtype dat tijdens de enzymatische behandeling gemakkelijk kapotgaat, kan ondervertegenwoordigd zijn in de matrix. Een te lange behandeling kan ook een stressreactie opwekken en zo het oorspronkelijke RNA-profiel veranderen.

Bij bevroren monsters, moeilijk te dissociëren weefsels of kwetsbare cellen kunnen onderzoekers celkernen isoleren en hun RNA sequencen (snRNA-seq). Het principe van de barcodes is vergelijkbaar. Welke RNA-moleculen je ziet, welk aandeel van de reads in intronen valt en welke celtypen ondervertegenwoordigd zijn, kan verschillen. Hierop komen we later terug.

### Stap 2. Tel de cellen en controleer de kwaliteit

Vóór de suspensie de microfluïdische chip in gaat, worden de concentratie, de levensvatbaarheid en de klontering beoordeeld. Bij een lage concentratie blijven veel compartimenten leeg. Bij een hoge concentratie stijgt de kans op twee cellen in één compartiment. Het doel is voldoende cellen terug te vinden terwijl het aandeel doubletten beperkt blijft.

### Stap 3. Vorm GEM’s, kleine reactiecompartimenten

De celsuspensie, het reactiemengsel, gelparels met gebarcodeerde primers en olie komen door afzonderlijke kanalen de chip binnen. Waar de stromen samenkomen, ontstaan vele GEM’s (*Gel Beads-in-emulsion*) met een volume in de orde van nanoliters.

Een GEM is een kleine waterige druppel in olie, een water-in-olie-emulsie. Een ideale productieve GEM bevat één cel en één gelparel. In werkelijkheid ontstaan ook GEM’s zonder cel en een klein aantal met twee of meer cellen.

![Zes stappen van 10x Chromium, van weefsel tot een expressiematrix met genen in de rijen en cellen in de kolommen](figures/scrna-seq-gem-workflow.nl.svg)

*Figuur 1 | De zes stappen van 10x Chromium 3′ Gene Expression. Oorspronkelijke projectillustratie, gemaakt met AI-ondersteuning. De indeling is herzien op 23 november 2026. Lees eerst stap 1–3 bovenaan, daarna 4–6 onderaan. De objecten zijn niet op schaal. Raadpleeg voor reagentia en procedures de handleiding van de gebruikte productversie. Bronnen: de [3′-genexpressieworkflow van 10x Genomics](https://www.10xgenomics.com/support/universal-three-prime-gene-expression/documentation/steps/experimental-design-and-planning/getting-started-single-cell-3-gene-expression) en de [publicatie van Zheng en collega’s](https://doi.org/10.1038/ncomms14049).*

### Stap 4. Breek de cel open en label de moleculen in de GEM

In de GEM komt het mRNA vrij wanneer de cel openbreekt (lysis). De primers op de gelparel dragen een gemeenschappelijke celbarcode en verschillende UMI’s. Tijdens de reverse transcriptie wordt de informatie uit het mRNA overgeschreven naar cDNA en worden de labels ingebouwd.

cDNA-moleculen uit dezelfde GEM hebben daardoor dezelfde celbarcode. Verschillende oorspronkelijke RNA-moleculen hebben meestal verschillende UMI’s. **De barcodes worden bij de bibliotheekvoorbereiding aangebracht. De software leest ze na de sequencing uit.**

### Stap 5. Breek de emulsie, vermeerder het cDNA en maak de bibliotheek

Na de reverse transcriptie wordt de water-in-olie-emulsie verbroken. Alle gelabelde cDNA-moleculen kunnen nu worden samengevoegd: hun herkomst is vastgelegd in de barcodes.

Eén cel levert te weinig cDNA om rechtstreeks te sequencen. Daarom wordt het cDNA met PCR vermeerderd. Vervolgens wordt het in fragmenten verdeeld en worden sequencingadapters en monsterindices toegevoegd. Zo ontstaat een bibliotheek die de sequencer kan lezen.

### Stap 6. Sequenceer de bibliotheek en wijs de reads toe

Op bepaalde posities in de sequencinggegevens staan de celbarcode en de UMI. Andere posities bevatten sequentie uit het transcript. De software:

1. wijst de read toe aan een compartiment;
2. bepaalt van welk gen de transcriptsequentie afkomstig is;
3. gebruikt UMI’s om PCR-kopieën niet onnodig dubbel te tellen;
4. beoordeelt welke barcodes beter bij een cel passen dan bij achtergrond-RNA uit lege druppels;
5. maakt een expressiematrix met genen in de rijen en cellen in de kolommen.

Zo wordt het weefselmonster uiteindelijk een tabel die je kunt analyseren.

## Wat betekenen 3′, 5′ en ‘volledige lengte’?

Een RNA-keten heeft een richting en twee verschillende uiteinden: 5′ en 3′. Je hoeft de nummering van de koolstofatomen nu niet te onthouden. **Het zijn de twee uiteinden van hetzelfde RNA-molecuul.**

| Methode | Welk deel leest een gewone expressiebibliotheek uit? | Waarvoor gebruik je dat? |
| --- | --- | --- |
| 10x 3′ Gene Expression | Een kort stukje sequentie bij het 3′-uiteinde | Genexpressie tellen, cellen groeperen en celtypen identificeren bij veel cellen |
| 10x 5′ Gene Expression | Een kort stukje sequentie bij het 5′-uiteinde | Genexpressie tellen. Uit hetzelfde cDNA kunnen ook V(D)J-bibliotheken voor TCR of BCR worden gemaakt. |
| Smart-seq2 / Smart-seq3 | Reads kunnen over een groter deel van het transcript verdeeld zijn | Splice-isovormen, allelen en andere details van transcripten onderzoeken |

Bij 3′- en 5′-methoden dient een kort sequentiestuk aan één uiteinde om het gen te identificeren en moleculen te tellen. De reverse transcriptie kan lang cDNA of zelfs cDNA over de volledige lengte opleveren. De gewone expressiebibliotheek leest echter voornamelijk één uiteinde. Cellen die volledig cDNA opleveren, leveren dus niet automatisch sequencinggegevens over de hele lengte van elk transcript.

De 5′-methode komt vaak voor in de immunologie omdat je een extra V(D)J-bibliotheek van T-celreceptoren (TCR’s) of B-celreceptoren (BCR’s) kunt maken en zo klonen van immuuncellen kunt volgen. Of je 3′ of 5′ kiest, hangt af van je onderzoeksvraag.

[Officiële informatie over 10x 3′](https://www.10xgenomics.com/support/universal-three-prime-gene-expression) · [Officiële informatie over 10x 5′](https://www.10xgenomics.com/support/universal-five-prime-gene-expression)

## Hoe verschillen 10x, BD en Singleron?

Stel bij elk platform dezelfde vraag: **hoe worden de cellen van elkaar gescheiden en hoe krijgt het RNA van elk compartiment een herkenbaar label?**

Vergelijk eerst het uitgangsmateriaal (cellen of kernen), het type meting (bijvoorbeeld een gerichte genenset of het hele transcriptoom), de reagentia, de sequencingdiepte en de gegevensverwerking. Als deze verschillen, kun je een verschil in uitkomst niet aan het platform alleen toeschrijven.

### 10x Chromium: afzonderlijke druppels

10x gebruikt GEM-druppels als reactiecompartimenten. Zo kunnen veel cellen parallel worden verwerkt. Meestal levert de methode UMI-tellingen per gen op. Voor klassieke 10x 3′/5′-gegevens gebruik je doorgaans een Cell Ranger-workflow die past bij de versie van de reagentia.

### BD Rhapsody: een raster van microputjes

Bij BD Rhapsody zakken cellen door de zwaartekracht in een raster van microputjes. Daarna worden magnetische vangparels met celbarcodes en UMI’s toegevoegd. Na lysis bindt een nabije parel het RNA met een poly(A)-staart. De parels worden verzameld en de reverse transcriptie en bibliotheekvoorbereiding verlopen vervolgens in een reactiebuis. Op beelden van de putjes kan men de cellen controleren en putjes met meerdere cellen herkennen.

[Technische informatie over BD Rhapsody](https://www.bdbiosciences.com/en-us/products/instruments/single-cell-multiomics-systems/rhapsody)

### Singleron SCOPE-chip: een andere aanpak met microputjes

Ook bij de SCOPE-chip van Singleron zakken cellen onder invloed van de zwaartekracht in microputjes. Daarna worden vangparels met barcodes toegevoegd. Na lysis bindt het mRNA aan de parels. De magnetische parels worden vervolgens verzameld. Reverse transcriptie, amplificatie en bibliotheekvoorbereiding gebeuren in een gewone reactiebuis.

Ruwe Singleron-gegevens worden meestal verwerkt met CeleScope of een onafhankelijke workflow die past bij de gebruikte reagentia. De indeling van de reads en het ontwerp van de barcodes verschillen van 10x. Controleer dus de herkomst en structuur van een FASTQ-bestand voordat je het in Cell Ranger probeert te gebruiken.

[Technische informatie over de SCOPE-chip](https://singleron.bio/scope-chip/) · [Officiële informatie over CeleScope](https://singleron.bio/products/celescope/)

Welk platform geschikt is, hangt af van de onderzoeksvraag. Het weefsel, de wijze van dissociatie, de reagentia, de sequencingdiepte en de software-instellingen kunnen de aantallen en verhoudingen van gevonden cellen en het aantal gedetecteerde genen beïnvloeden.

## Waarom laten neutrofielen platformverschillen zo duidelijk zien?

Neutrofielen zijn witte bloedcellen van het aangeboren immuunsysteem. Ze bevatten relatief weinig mRNA en veel RNA-afbrekende enzymen, en raken gemakkelijk beschadigd. Dat kan tot de volgende keten leiden:

> cellen gaan stuk tijdens de voorbereiding → RNA gaat verloren of komt in de vloeistof terecht → voor intacte cellen worden minder UMI’s geteld → de software deelt zwakke barcodes in bij lege druppels of cellen van lage kwaliteit

Controleer eerst de invoer: ging het om volbloed zonder rode bloedcellen, PBMC’s of een voor granulocyten verrijkt monster? Neutrofielen die tijdens de scheiding al zijn verwijderd, kunnen in een latere meting met 10x of BD ook niet meer worden teruggevonden. Ook de software kan dat verlies niet herstellen. Hun afwezigheid zegt dan vooral iets over de monstersamenstelling.

Bij een aantal rechtstreekse vergelijkingen met specifieke weefsels, reagentia en analysemethoden vond BD Rhapsody bepaalde RNA-arme cellen of granulocyten beter terug en werden hun moleculen beter geteld. In dezelfde studies verschilden de prestaties van 10x ook voor succesvolle celvangst, het aantal gedetecteerde genen per cel en andere celtypen. Een andere methode om te bepalen welke barcodes echte cellen vertegenwoordigen (*cell calling*) kan in 10x-gegevens eveneens meer neutrofielen aan het licht brengen.

Daaruit volgt niet dat alleen BD neutrofielen kan meten. **Monstervoorbereiding, platformchemie en gegevensverwerking kunnen de uitkomsten voor neutrofielen tegelijk beïnvloeden.** Zijn neutrofielen belangrijk voor je vraag, houd daar dan bij het onderzoeksontwerp rekening mee. Controleer hun aandeel met een onafhankelijke methode, bijvoorbeeld flowcytometrie of weefselbeeldvorming.

[Platformvergelijking in menselijk prostaatweefsel](https://doi.org/10.1016/j.heliyon.2024.e28358) · [Platformvergelijking in tumorweefsel van muizen](https://doi.org/10.1016/j.heliyon.2024.e37185) · [Onderzoek naar herkenning van neutrofielen in 10x-gegevens](https://doi.org/10.4049/jimmunol.2200154)

## Volgende les 1.2: van openbare gegevens naar een expressiematrix

De sequencer levert eerst basensequenties en informatie over de kwaliteit van elke base. Een gangbaar bestandsformaat hiervoor is FASTQ. Onderzoekers kunnen ook ruwe sequencinggegevens deponeren in het Sequence Read Archive (SRA) van het NCBI. De stappen zijn dan:

```text
SRA-gegevens uit een openbare studie
  → Converteer of download de gegevens in het juiste FASTQ-formaat
  → Controleer het experimentele platform, de reagensversie en de opbouw van de reads
  → Kies een verwerkingsprocedure die past bij de gebruikte methode
      10x-gegevens: Cell Ranger
      Singleron-gegevens: CeleScope of een onafhankelijke procedure die past bij de gebruikte chemie
  → Expressiematrix met genen als rijen en cellen als kolommen, plus een kwaliteitsrapport
```

Voor klassieke 10x 3′/5′-gegevens verwerkt Cell Ranger de FASTQ-bestanden. Het programma leest de barcodes, lijnt sequenties uit, telt UMI’s, herkent kandidaatcellen en bouwt de expressiematrix. Daarnaast rapporteert het kwaliteitsmaten, dimensionaliteitsreductie en clustering. Sommige workflows kennen voorlopig celtypen toe. Deze eerste resultaten helpen bij een snelle controle. Voor zorgvuldige celfiltering, integratie tussen monsters, annotatie, statistische toetsing en biologische validatie zijn doorgaans aanvullende analyses in R of Python en kennis van het onderzoeksontwerp nodig.

Cell Ranger levert meestal een ruwe en een gefilterde matrix. De ruwe matrix bevat meer barcodes. De gefilterde matrix bevat alleen barcodes die de software als cel heeft aangemerkt. RNA-arme cellen kunnen daardoor ontbreken. In de praktijklessen bekijken we beide matrices, het kwaliteitsrapport, de versies van het referentiegenoom en de genannotatie, de gebruikte reagentia, de softwareversie en de instellingen voor celherkenning.

Controleer vóór verwerking van SRA-data of het om een compatibel 10x-experiment gaat. Achterhaal de readstructuur, het referentiegenoom, de versie van de reagentia en welke monsters bij elkaar horen. **In les 1.2 volgen we een openbare dataset: van het vinden van de SRA-gegevens en FASTQ-kwaliteitscontrole tot Cell Ranger en zijn uitvoerbestanden. Je hoeft in deze les nog geen commando’s te onthouden.**

[Inleiding tot het NCBI SRA](https://www.ncbi.nlm.nih.gov/sra) · [Officiële Cell Ranger-documentatie](https://www.10xgenomics.com/support/software/cell-ranger/latest)

## Samenvatting

- scRNA-seq maakt geen foto van de cel. De cellen worden opengebroken en wordt hun RNA ingevangen. Het cDNA krijgt labels voordat materiaal uit verschillende cellen wordt gemengd.
- Een celbarcode wijst naar een reactiecompartiment, een UMI helpt het aantal verschillende ingevangen moleculen schatten en een monsterindex onderscheidt bibliotheken.
- 10x gebruikt GEM-druppels. BD Rhapsody en de SCOPE-chip van Singleron gebruiken microputjes. Elk systeem kan de vangst van bepaalde cellen bevoordelen of benadelen.
- 3′-, 5′- en Smart-seq-methoden leveren verschillende informatie. Kies op basis van je onderzoeksvraag.
- Na de sequencing worden de ruwe gegevens met passende software verwerkt tot een expressiematrix met genen en cellen.

## Referenties en verdere literatuur

1. Tang F, et al. mRNA-Seq whole-transcriptome analysis of a single cell. *Nature Methods*. 2009. [doi:10.1038/nmeth.1315](https://doi.org/10.1038/nmeth.1315)
2. Ramsköld D, et al. Full-length mRNA-Seq from single-cell levels of RNA and individual circulating tumor cells. *Nature Biotechnology*. 2012. [doi:10.1038/nbt.2282](https://doi.org/10.1038/nbt.2282)
3. Picelli S, et al. Smart-seq2 for sensitive full-length transcriptome profiling in single cells. *Nature Methods*. 2013. [doi:10.1038/nmeth.2639](https://doi.org/10.1038/nmeth.2639)
4. Hagemann-Jensen M, et al. Single-cell RNA counting at allele and isoform resolution using Smart-seq3. *Nature Biotechnology*. 2020. [doi:10.1038/s41587-020-0497-0](https://doi.org/10.1038/s41587-020-0497-0)
5. Klein AM, et al. Droplet barcoding for single-cell transcriptomics applied to embryonic stem cells. *Cell*. 2015. [doi:10.1016/j.cell.2015.04.044](https://doi.org/10.1016/j.cell.2015.04.044)
6. Macosko EZ, et al. Highly parallel genome-wide expression profiling of individual cells using nanoliter droplets. *Cell*. 2015. [doi:10.1016/j.cell.2015.05.002](https://doi.org/10.1016/j.cell.2015.05.002)
7. Zheng GXY, et al. Massively parallel digital transcriptional profiling of single cells. *Nature Communications*. 2017. [doi:10.1038/ncomms14049](https://doi.org/10.1038/ncomms14049)
