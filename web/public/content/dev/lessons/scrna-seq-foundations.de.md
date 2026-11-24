# 1.1 | Einzelzell-RNA-Sequenzierung: Geschichte, Grundlagen und Plattformen

Stell dir einen Saft aus mehreren Obstsorten vor. Du kannst seinen Zuckergehalt messen. Die Messung verrät dir aber kaum, ob die Süße vor allem von den Äpfeln oder von ein paar besonders süßen Trauben stammt.

Bei einer Gewebeprobe besteht ein ähnliches Problem. Ein Tumor, ein Tropfen Blut oder ein Stück Hirngewebe enthält oft ganz unterschiedliche Zelltypen. Messen wir die gesamte RNA zusammen, erkennen wir Veränderungen in der Probe als Ganzes. Seltene Zellen können dabei untergehen. Auch lässt sich eine Veränderung nur schwer einem bestimmten Zelltyp zuordnen.

Die Einzelzell-RNA-Sequenzierung (scRNA-seq) macht die Herkunft nachvollziehbar. **Noch bevor das Material verschiedener Zellen zur Sequenzierung zusammengeführt wird, erhält es eine Markierung, die auf seinen zellulären Ursprung verweist.**

Für diese Lektion brauchst du keine Software. Wir verfolgen den Weg von der Probe bis zum Messergebnis:

> biologische Probe → einzelne Zellen → Herkunft der RNA markieren → sequenzieren → Expressionsmatrix mit Genen in den Zeilen und Zellen in den Spalten


## Vier Begriffe für den Einstieg

- Die **Zelle** ist eine Grundeinheit des Lebens. Zellen im selben Gewebe können sich voneinander unterscheiden.
- **DNA** speichert relativ stabile Erbinformation. RNA, die von einem Gen abgeschrieben wird, gibt einen Hinweis darauf, ob die Zelle dieses Gen nutzt.
- Die **RNA** kannst du dir zunächst als vorübergehende Arbeitskopie der DNA vorstellen. Ist die RNA eines Gens leichter nachweisbar, ist dieses Gen meist aktiver. Der Zusammenhang ist jedoch nicht exakt.
- Das **Transkriptom** umfasst die gesamte RNA, die in einer Probe zu einem bestimmten Zeitpunkt beobachtbar ist. Es zeigt eine Momentaufnahme der Aktivität.

Mit diesen vier Begriffen kannst du dem Rest der Lektion folgen.

Die hier behandelten Standardverfahren zur Genexpressionsmessung erfassen vor allem Boten-RNA (mRNA) mit Poly(A)-Schwanz, die das Experiment erfolgreich einfängt. Verschiedene RNA-Arten werden unterschiedlich gut erfasst. Die Zählwerte hängen von der Bildung und dem Abbau der RNA sowie von der Effizienz der Erfassung ab. Sie schätzen, wie viel mRNA zu einem bestimmten Zeitpunkt noch vorhanden war und erfasst wurde. Die Transkriptionsrate eines Gens lässt sich daraus nicht unmittelbar ablesen.

## Was geht bei einer gemeinsamen RNA-Messung verloren?

Angenommen, eine Probe enthält 90 Zellen vom Typ A und 10 vom Typ B. Ein entzündungsrelevantes Gen ist nur in Typ B stark exprimiert. Bei einer gemeinsamen Messung der 100 Zellen geht dieses Signal in den Durchschnitt ein. Man sieht einen Hinweis auf Entzündung, weiß aber noch nicht, welche Zellen das Signal erzeugt haben.

Mit Einzelzell-RNA-Sequenzierung lassen sich andere Fragen stellen:

- Welche Zelltypen könnten in der Probe vorkommen?
- Welche Gene sind tendenziell in derselben Gruppe von Zellen aktiv?
- Gibt es einzelne Zellen in einem ungewöhnlichen Zustand?
- Welcher Zelltyp verändert sich bei einer Krankheit, unter einer Behandlung oder im Lauf der Zeit?

Das Ergebnis wird meist als Tabelle mit Genen in den Zeilen und Zellen in den Spalten gespeichert:

| Gen | Zelle 1 | Zelle 2 | Zelle 3 |
| --- | ---: | ---: | ---: |
| Gen A | 8 | 0 | 1 |
| Gen B | 0 | 6 | 5 |
| Gen C | 2 | 1 | 0 |

Jede Zeile steht für ein Gen, jede Spalte für eine **mutmaßliche Zelle**. Gemeint ist ein Barcode, der nach Einschätzung der Software wahrscheinlich zu einem Reaktionskompartiment mit einer Zelle gehört. Er garantiert nicht, dass dieses Kompartiment genau eine intakte Zelle enthielt.

Was ein Zahlenwert bedeutet, hängt von der Methode ab. Bei 10x und anderen UMI-basierten Verfahren ist es meist die Zahl unterschiedlicher UMIs für ein Gen unter einem Zellbarcode. Sie schätzt die Zahl der erfassten Moleküle. Smart-seq2 verwendet keine UMIs. Seine Matrix kann stattdessen die Zahl gelesener Sequenzabschnitte (*Reads*) oder daraus berechnete Häufigkeiten enthalten. Eine spätere Lektion vergleicht Readzahlen, UMI-Zahlen und normalisierte Werte.

**Die Zahlen sind technische Messwerte. Sie bilden den RNA-Bestand einer Zelle nicht lückenlos ab.** RNA kann bei der Probenverarbeitung abgebaut werden oder der Erfassung entgehen. Bei wenigen Molekülen kann durch die Stichprobenziehung zufällig keines gemessen werden. Eine Null kann somit bedeuten, dass ein Gen nicht exprimiert war oder dass vorhandene RNA im Experiment nicht nachgewiesen wurde.

Beim Auftrennen des Gewebes in einzelne Zellen geht deren räumliche Position meist verloren. Die Nähe zweier Zellen in einer späteren Clusteransicht zeigt ähnliche Expressionsmuster. Für ihre tatsächliche Lage im Gewebe sind gesonderte Messungen nötig, etwa Gewebebildgebung oder räumliche Omikverfahren.

## Wie hat sich die Technik entwickelt?

Hinter jedem Fortschritt stand eine neue Frage.

### 2009: Lässt sich die RNA einer einzelnen Zelle messen?

Tang Fuchou und sein Team an der Universität Peking zeigten 2009 in *Nature Methods*, dass sich die mRNA einzelner Blastomeren und Eizellen der Maus auf Ebene des gesamten Transkriptoms sequenzieren lässt. Die Datentabellen der Studie führen sechs unabhängige Einzelzellproben auf. Selbst mit sehr wenig Ausgangs-RNA konnten die Forschenden nach der Umschreibung in komplementäre DNA (cDNA) durch Hochdurchsatzsequenzierung viele Gene nachweisen.

Diese Studie gilt als ein wichtiger Ausgangspunkt der Einzelzell-RNA-Sequenzierung. Sie zeigte die grundsätzliche Machbarkeit der Messung. Tausende von Zellen gleichzeitig zu verarbeiten, war damals noch schwierig.

[Originalarbeit von Tang und seinem Team](https://doi.org/10.1038/nmeth.1315)

### Smart-seq: Lässt sich ein größerer Teil jedes Transkripts lesen?

RNA ist instabil, und eine Zelle enthält nur wenig davon. Deshalb beginnen solche Experimente meist mit der **reversen Transkription**. Dabei wird die RNA vor der Vervielfältigung und Sequenzierung in stabilere komplementäre DNA (cDNA) umgeschrieben.

Smart-seq ermöglichte 2012 eine bessere Abdeckung der Transkripte einzelner Zellen. Smart-seq2 verbesserte 2013 die Empfindlichkeit, Genauigkeit und Gleichmäßigkeit der Abdeckung. Smart-seq3 führte 2020 UMIs am 5′-Ende ein. Damit ließ sich die Molekülzählung mit der Analyse von Transkripten und Allelen verbinden.

Bei Smart-seq werden die Zellen meist in einzelne Reaktionsvertiefungen gegeben. So lassen sich Spleißisoformen oder Sequenzunterschiede genauer untersuchen. Jede Zelle erfordert aber mehr separate Arbeitsschritte und Sequenzierkapazität. Deshalb werden gewöhnlich weniger Zellen gleichzeitig gemessen als bei Tröpfchenverfahren.

„Volle Länge“ bedeutet, dass sich die Reads über einen großen Teil des Transkripts verteilen können. **Es bedeutet nicht, dass jedes RNA-Molekül in einem einzigen durchgehenden Read vom 5′- bis zum 3′-Ende gelesen wird.**

[Originalarbeit zu Smart-seq](https://doi.org/10.1038/nbt.2282) · [Originalarbeit zu Smart-seq2](https://doi.org/10.1038/nmeth.2639) · [Originalarbeit zu Smart-seq3](https://doi.org/10.1038/s41587-020-0497-0)

### Tröpfchentechnologie: Lassen sich mehr Zellen gleichzeitig messen?

Um die Zelltypen eines komplexen Gewebes zu kartieren, mussten Forschende vom detaillierten Studium weniger Zellen zur parallelen Verarbeitung von Tausenden übergehen. 2015 zeigten inDrop und Drop-seq, wie sich die RNA vieler Zellen in winzigen Tröpfchen gleichzeitig markieren lässt. 2017 beschrieben Zheng und sein Team ein Hochdurchsatzsystem, das zu einer wichtigen Grundlage des Chromium-Verfahrens von 10x Genomics wurde. Sie zeigten Daten von Zehntausenden mononukleären Zellen aus menschlichem peripherem Blut.

Tröpfchenbasierte Einzelzell-RNA-Sequenzierung gab es also schon vor 10x. 10x verband die Tröpfchenbildung, Gelkügelchen mit Barcodes, UMIs und die dazugehörige Datenverarbeitung in einem System für den groß angelegten Einsatz.

[Originalarbeit zu inDrop](https://doi.org/10.1016/j.cell.2015.04.044) · [Originalarbeit zu Drop-seq](https://doi.org/10.1016/j.cell.2015.05.002) · [Originalarbeit von Zheng und seinem Team](https://doi.org/10.1038/ncomms14049)

## Vor dem Mischen eine „Adresse“ vergeben

Werden tausend Zellen gemeinsam in einem Röhrchen lysiert, vermischt sich ihre RNA. An der RNA-Sequenz allein ist anschließend nicht mehr zu erkennen, aus welcher Zelle ein Molekül stammt.

Wie ein Paket vor dem Sortierzentrum seine Adresse erhält, wird vor dem Mischen der cDNA aus verschiedenen Zellen eine kurze, lesbare DNA-Sequenz eingebaut. Nach der Sequenzierung kann die Software anhand dieser Sequenz die Reads ihrer Herkunft zuordnen.

In 10x-Daten erfüllen drei Markierungen unterschiedliche Aufgaben:

| Markierung | Was unterscheidet sie? | Merkfrage |
| --- | --- | --- |
| Zellbarcode | Verschiedene GEMs, also einzelne Reaktionskompartimente | Aus welchem Kompartiment stammt diese cDNA? |
| UMI (eindeutiger molekularer Identifikator) | Verschiedene ursprünglich erfasste RNA-Moleküle innerhalb desselben Kompartiments | Welches erfasste Molekül ist gemeint? |
| Probenindex | Verschiedene Bibliotheken in einem gemeinsamen Sequenzierlauf | Zu welcher Bibliothek gehört dieser Read? |

Ein Probenindex kennzeichnet eine Bibliothek. Er identifiziert nicht automatisch eine spendende Person, eine Behandlungsgruppe oder ein biologisches Replikat. Die Probe einer Person oder eines Versuchstiers kann auf mehrere Bibliotheken aufgeteilt sein. Umgekehrt können mehrere Proben mit einem zusätzlichen Multiplexverfahren in einer Bibliothek zusammengefasst werden. Tausende Zellen aus einer Probe sind daher nicht ebenso viele unabhängige biologische Replikate. Die experimentelle Einheit ist meist die unabhängige Person, das Tier oder die Probe. Versuchsplanung, Pseudoreplikation und statistische Gruppenvergleiche folgen in einer späteren Lektion.

Der Vergleich mit einer Postadresse hat drei Grenzen:

1. Ein Zellbarcode kennzeichnet ein **GEM-Kompartiment**. Gelangen zwei Zellen in dasselbe GEM, teilen sie sich den Barcode und bilden ein Dublett. Bei mehreren Zellen spricht man von einem Multiplett.
2. UMIs verringern die Mehrfachzählung von PCR-Kopien. Verschiedene Moleküle können allerdings zufällig dieselbe UMI-Sequenz erhalten. Auch Sequenzierfehler und Molekülverluste beeinflussen die Schätzung.
3. Freie RNA aus beschädigten Zellen kann mit einer intakten Zelle in ein GEM gelangen und denselben Barcode erhalten. Der Barcode belegt daher nicht, dass sämtliche RNA im Kompartiment aus der intakten Zelle stammt. Eine spätere Lektion zur Qualitätskontrolle erläutert, wie solche Verunreinigungen durch Umgebungs-RNA erkannt und korrigiert werden.

## Das 10x-3′-Genexpressionsverfahren in sechs Schritten

Das Sequenziergerät liest eine vorbereitete DNA-Bibliothek. Zu diesem Zeitpunkt sind die Zellen bereits aufgebrochen und ihre RNA in markierte cDNA umgeschrieben.

Hier betrachten wir das gebräuchliche 3′-Genexpressionsverfahren von 10x. Auch das 5′-Verfahren nutzt GEMs, Zellbarcodes und UMIs. Die chemischen Reaktionen, mit denen die Markierungen in die cDNA gelangen, unterscheiden sich jedoch. Für die praktische Durchführung ist das Handbuch zur jeweiligen Reagenzversion maßgeblich.

Der tatsächliche Ablauf beginnt mit der Probenentnahme. Wie lange dem Gewebe die Blutversorgung fehlt (Ischämiezeit), wie es konserviert wird, die Zeit bis zur Verarbeitung, die ausführende Person und die Reagenzcharge können Zellzustände und die späteren Anteile der Zelltypen bereits vor der Dissoziation beeinflussen. Versuchsbedingungen sollten nicht vollständig mit Verarbeitungstagen oder Chargen zusammenfallen. Später behandeln wir Randomisierung, ausgeglichene Chargenbelegung, Kontrollen und die Dokumentation von Metadaten.

### Schritt 1. Eine Einzelzellsuspension herstellen

Durch mechanische Behandlung oder enzymatischen Verdau wird das Gewebe möglichst vollständig in einzelne Zellen zerlegt. Die so erhaltene Flüssigkeit heißt **Einzelzellsuspension**. Erwünscht sind intakte, lebensfähige Zellen mit möglichst wenigen Zellklumpen, Bruchstücken und freien RNA-Molekülen.

Wie wurde die Suspension vorbereitet? Schon beim Trennen oder Anreichern können manche Populationen erhalten bleiben und andere verloren gehen. Vollblut nach Entfernung der Erythrozyten, mononukleäre Zellen des peripheren Blutes (PBMCs) und eine mit Granulozyten angereicherte Probe unterscheiden sich in ihrer Zusammensetzung. Nach der üblichen Dichtegradiententrennung enthält die PBMC-Fraktion vor allem Lymphozyten und Monozyten. Die meisten neutrophilen Granulozyten mit normaler Dichte gelangen nicht in diese Fraktion. PBMC-Daten repräsentieren deshalb nicht alle weißen Blutzellen.

Zerfällt ein Zelltyp beim Verdau besonders leicht, kann er in der Matrix unterrepräsentiert sein. Ein zu langer Verdau kann zudem eine Stressantwort auslösen und das ursprüngliche RNA-Profil verändern.

Bei gefrorenen Proben, schwer zu dissoziierenden Geweben oder empfindlichen Zellen können Forschende stattdessen die Zellkerne isolieren und deren RNA sequenzieren (snRNA-seq). Für die Barcodes gelten ähnliche Prinzipien. Das beobachtbare RNA-Spektrum, der Anteil intronischer Reads und die Verzerrung zugunsten bestimmter Zelltypen unterscheiden sich jedoch. Die Verfahren werden später direkt verglichen.

### Schritt 2. Zellen zählen und die Probenqualität prüfen

Vor der Zugabe auf den Mikrofluidikchip werden Zellkonzentration, Lebensfähigkeit und Verklumpung geprüft. Ist die Konzentration zu gering, bleiben viele Kompartimente leer. Ist sie zu hoch, landen häufiger zwei Zellen im selben Kompartiment. Das Ziel ist eine ausreichende Zellausbeute bei begrenztem Dublettenanteil.

### Schritt 3. GEMs als winzige Reaktionskammern bilden

Zellsuspension, Reaktionsgemisch, Gelkügelchen mit barcodierten Primern und Öl werden über getrennte Kanäle in den Mikrofluidikchip geleitet. Wo die Ströme aufeinandertreffen, entstehen zahlreiche GEMs (*Gel Beads-in-emulsion*) mit Volumina im Nanoliterbereich.

Ein GEM ist ein wässriges Tröpfchen in Öl. Ein ideal besetztes GEM enthält eine Zelle und ein Gelkügelchen. In der Praxis enthalten manche GEMs keine Zelle. Ein kleiner Anteil enthält zwei oder mehr Zellen.

![Sechs Schritte der Einzelzell-RNA-Sequenzierung mit 10x Chromium, vom Gewebe bis zur Expressionsmatrix mit Genen in den Zeilen und Zellen in den Spalten](figures/scrna-seq-gem-workflow.de.svg)

*Abbildung 1 | Sechs Schritte von 10x Chromium 3′ Gene Expression. Projekteigene Illustration mit KI-Unterstützung, Layout überarbeitet am 23. November 2026. Zuerst die Schritte 1–3 oben, dann 4–6 unten lesen. Die Objekte sind nicht maßstabsgetreu dargestellt. Reagenzien und Arbeitsschritte sind im Handbuch der jeweiligen Produktversion beschrieben. Quellen: das [3′-Genexpressionsverfahren von 10x Genomics](https://www.10xgenomics.com/support/universal-three-prime-gene-expression/documentation/steps/experimental-design-and-planning/getting-started-single-cell-3-gene-expression) und die [Originalarbeit von Zheng und seinem Team](https://doi.org/10.1038/ncomms14049).*

### Schritt 4. Zellen im GEM lysieren und Moleküle markieren

Bei der Zelllyse wird die mRNA im GEM freigesetzt. Die Primer eines Gelkügelchens tragen einen gemeinsamen Zellbarcode und unterschiedliche UMIs. Bei der reversen Transkription wird die Information der mRNA in cDNA umgeschrieben, und die Markierungen werden in die neu synthetisierte cDNA eingebaut.

cDNA-Moleküle aus demselben GEM haben daher denselben Zellbarcode. Unterschiedliche ursprüngliche RNA-Moleküle tragen meist verschiedene UMIs. **Die Barcodes werden bei der Bibliotheksvorbereitung eingebaut. Die Software liest sie nach der Sequenzierung aus.**

### Schritt 5. Emulsion aufbrechen, cDNA amplifizieren und Bibliothek vorbereiten

Nach der reversen Transkription wird die Wasser-in-Öl-Emulsion aufgebrochen. Die gesamte markierte cDNA kann nun zusammengeführt werden, weil die Barcodes die Herkunft der Produkte festhalten.

Eine einzelne Zelle liefert zu wenig cDNA für eine direkte Sequenzierung. Deshalb wird sie mittels PCR vervielfältigt. Anschließend wird die cDNA fragmentiert, und Sequenzieradapter und Probenindizes werden angefügt. So entsteht eine Bibliothek, die das Gerät lesen kann.

### Schritt 6. Bibliothek sequenzieren und Reads zuordnen

Bestimmte Positionen in den Sequenzierdaten enthalten Zellbarcode und UMI, andere die vom Transkript stammende Sequenz. Die Software:

1. ordnet den Read einem Kompartiment zu;
2. ermittelt das Gen, von dem die Transkriptsequenz stammt;
3. nutzt UMIs, um PCR-Kopien nicht mehrfach zu zählen;
4. ermittelt, bei welchen Barcodes das Signal eher zu einer Zelle als zur Hintergrund-RNA eines leeren Tröpfchens passt;
5. erstellt eine Expressionsmatrix mit Genen in den Zeilen und Zellen in den Spalten.

Aus einer Gewebeprobe ist damit eine auswertbare Zahlentabelle geworden.

## Was bedeuten 3′, 5′ und „volle Länge“?

Ein RNA-Strang ist gerichtet. Seine Enden heißen 5′- und 3′-Ende. Die Nummerierung der Kohlenstoffatome brauchst du dir noch nicht zu merken. **Gemeint sind die beiden Enden desselben RNA-Moleküls.**

| Methode | Welchen Bereich liest eine gewöhnliche Expressionsbibliothek? | Typischer Zweck |
| --- | --- | --- |
| 10x 3′ Gene Expression | Einen kurzen Abschnitt nahe dem 3′-Ende des Transkripts | Genexpression quantifizieren, Zellen gruppieren und Zelltypen in großen Zellzahlen bestimmen |
| 10x 5′ Gene Expression | Einen kurzen Abschnitt nahe dem 5′-Ende des Transkripts | Genexpression quantifizieren. Aus derselben cDNA lassen sich auch V(D)J-Bibliotheken für TCR oder BCR herstellen. |
| Smart-seq2 / Smart-seq3 | Reads können größere Teile der Transkripte abdecken | Spleißisoformen, Allele oder andere Einzelheiten von Transkripten untersuchen |

Sowohl 3′- als auch 5′-Verfahren nutzen einen kurzen Sequenzabschnitt an einem Transkriptende, um das Gen zu identifizieren und Moleküle zu zählen. Bei der reversen Transkription können lange oder sogar vollständige cDNA-Zwischenprodukte entstehen. Die übliche Expressionsbibliothek liest dennoch hauptsächlich ein Ende. Vollständige cDNA zu erzeugen, bedeutet also nicht, ein Transkript in voller Länge sequenziert zu haben.

Das 5′-Verfahren ist in der Immunologie verbreitet. Aus derselben cDNA lässt sich eine zusätzliche V(D)J-Bibliothek für T-Zell-Rezeptoren (TCRs) oder B-Zell-Rezeptoren (BCRs) herstellen, mit der sich Immunzellklone verfolgen lassen. Ob 3′ oder 5′ sinnvoller ist, hängt von der Forschungsfrage ab.

[Offizielle Informationen zu 10x 3′](https://www.10xgenomics.com/support/universal-three-prime-gene-expression) · [Offizielle Informationen zu 10x 5′](https://www.10xgenomics.com/support/universal-five-prime-gene-expression)

## Wie unterscheiden sich 10x, BD und Singleron?

Für den Vergleich hilft eine gemeinsame Frage: **Wie trennt die Plattform Zellen voneinander, und wie markiert sie die RNA eines Kompartiments so, dass ihre Herkunft nachvollziehbar bleibt?**

Achte auf vergleichbares Ausgangsmaterial (intakte Zellen oder Zellkerne), das Messverfahren (z. B. ein gezieltes Genpanel oder das gesamte Transkriptom), die Reagenzversion, die Sequenziertiefe und die Datenverarbeitung. Unterscheiden sich diese Bedingungen, lässt sich ein Unterschied im Ergebnis nicht allein der Plattform zuschreiben.

### 10x Chromium: Aufteilung in Tröpfchen

Bei 10x dienen die GEM-Tröpfchen als Reaktionskompartimente. Viele Zellen lassen sich parallel verarbeiten. Das Ergebnis sind meist UMI-basierte Zählwerte pro Gen. Für klassische 10x-3′/5′-Daten wird in der Regel ein zur Reagenzversion passender Cell-Ranger-Workflow verwendet.

### BD Rhapsody: Aufteilung in Mikrovertiefungen

BD Rhapsody verwendet ein Raster aus Mikrovertiefungen, in die die Zellen durch die Schwerkraft absinken. Danach werden magnetische Fangkügelchen mit Zellbarcodes und UMIs hinzugegeben. Nach der Lyse bindet ein benachbartes Kügelchen RNA mit Poly(A)-Schwanz. Die Kügelchen werden gesammelt, und die reverse Transkription sowie die Bibliotheksvorbereitung finden im Reaktionsröhrchen statt. Aufnahmen der Vertiefungen ermöglichen die Qualitätskontrolle der Zellen und zeigen Vertiefungen mit mehreren Zellen.

[Technische Informationen zu BD Rhapsody](https://www.bdbiosciences.com/en-us/products/instruments/single-cell-multiomics-systems/rhapsody)

### Singleron SCOPE-chip: ein weiteres Verfahren mit Mikrovertiefungen

Auch beim SCOPE-chip sinken die Zellen durch die Schwerkraft in Mikrovertiefungen. Anschließend werden Fangkügelchen mit Barcodes zugegeben. Nach der Zelllyse bindet die mRNA an die Kügelchen. Die magnetischen Kügelchen werden gesammelt. Reverse Transkription, Amplifikation und Bibliotheksvorbereitung erfolgen dann in einem gewöhnlichen Reaktionsröhrchen.

Singleron-Rohdaten werden üblicherweise mit CeleScope oder einem anderen zur Reagenzchemie passenden Verfahren verarbeitet. Readstruktur und Barcodedesign unterscheiden sich von 10x. Vor der Verarbeitung einer FASTQ-Datei mit Cell Ranger müssen deshalb Herkunft und Aufbau geprüft werden.

[Technische Informationen zum SCOPE-chip](https://singleron.bio/scope-chip/) · [Offizielle Informationen zu CeleScope](https://singleron.bio/products/celescope/)

Welche Plattform geeignet ist, hängt von der Forschungsfrage ab. Gewebe, Dissoziationsmethode, Reagenzversion, Sequenziertiefe und Softwareparameter können die Anzahl und die Anteile erfasster Zellen sowie die Zahl der nachgewiesenen Gene verändern.

## Warum veranschaulichen neutrophile Granulozyten Plattformverzerrungen?

Neutrophile Granulozyten gehören zu den weißen Blutzellen der angeborenen Immunabwehr. Sie enthalten relativ wenig mRNA und viele RNA-abbauende Enzyme. Bei der Verarbeitung werden sie leicht beschädigt. Dadurch kann folgende Kette entstehen:

> Zellen zerfallen bei der Vorbereitung → RNA geht verloren oder gelangt in die umgebende Flüssigkeit → in intakten Zellen werden weniger UMIs erfasst → die Software stuft schwache Barcodes als leere Tröpfchen oder als Zellen geringer Qualität ein

Prüfe zunächst, ob Vollblut ohne Erythrozyten, PBMCs oder eine mit Granulozyten angereicherte Probe eingesetzt wurde. Wurden die Neutrophilen schon bei der Probentrennung entfernt, können weder eine anschließende Messung mit 10x oder BD noch die spätere rechnerische Zellerkennung sie zurückholen. Ihr Fehlen sagt dann vor allem etwas über die Ausgangsprobe aus.

In einigen direkten Vergleichen mit bestimmten Geweben, Reagenzien und Analyseverfahren schnitt BD Rhapsody bei der Rückgewinnung bestimmter RNA-armer Zellen oder Granulozyten und beim Zählen ihrer Moleküle besser ab. Dieselben Studien fanden bei 10x Unterschiede in der Ausbeute produktiv erfasster Zellen, bei der Genanzahl pro Zelle und bei anderen Zelltypen. Auch eine geänderte Entscheidung darüber, welche Barcodes zu echten Zellen gehören (*Cell Calling*), kann in 10x-Daten mehr Neutrophile sichtbar machen.

Daraus folgt nicht, dass nur BD Neutrophile messen kann. **Probenvorbereitung, Plattformchemie und Datenverarbeitung können das Ergebnis für Neutrophile gleichzeitig beeinflussen.** Sind sie zentral für die Studie, sollten diese Verzerrungen in der Versuchsplanung berücksichtigt und ihre Anteile mit einer unabhängigen Methode wie Durchflusszytometrie oder Gewebebildgebung überprüft werden.

[Plattformvergleich an menschlichem Prostatagewebe](https://doi.org/10.1016/j.heliyon.2024.e28358) · [Plattformvergleich an Tumorgewebe der Maus](https://doi.org/10.1016/j.heliyon.2024.e37185) · [Studie zur Erkennung von Neutrophilen in 10x-Daten](https://doi.org/10.4049/jimmunol.2200154)

## Nächste Lektion 1.2: Von öffentlichen Daten zur Expressionsmatrix

Das Sequenziergerät liefert Basensequenzen und Qualitätsangaben zu den einzelnen Basen. Ein übliches Format dafür ist FASTQ. Öffentliche Studien können Rohdaten auch im Sequence Read Archive (SRA) des NCBI hinterlegen. Daraus ergibt sich dieser Ablauf:

```text
SRA-Daten einer öffentlich zugänglichen Studie
  → Die Daten im passenden FASTQ-Format herunterladen oder in dieses Format umwandeln
  → Plattform, Reagenzversion und Aufbau der Reads prüfen
  → Einen passenden Workflow für die Verarbeitung wählen
      10x-Daten: Cell Ranger
      Singleron-Daten: CeleScope oder ein unabhängiger, auf die Assay-Chemie abgestimmter Workflow
  → Expressionsmatrix mit Genen in den Zeilen und Zellen in den Spalten sowie Qualitätsbericht
```

Bei klassischen 10x-3′/5′-Daten verarbeitet Cell Ranger die FASTQ-Dateien: Es liest Barcodes aus, richtet Sequenzen am Referenzgenom aus, zählt UMIs, erkennt mutmaßliche Zellen und erstellt die Matrix. Hinzu kommen erste Qualitätskennzahlen, Dimensionsreduktion, Clustering und in manchen aktuellen Workflows eine vorläufige Zelltypzuordnung. Diese Ergebnisse helfen bei der ersten Durchsicht. Für sorgfältige Zellfilterung, Integration mehrerer Proben, Annotation, statistische Auswertung und biologische Validierung sind in der Regel weitere Analysen in R oder Python unter Berücksichtigung des Studiendesigns nötig.

Cell Ranger liefert meist eine Rohmatrix und eine gefilterte Matrix. Die Rohmatrix enthält mehr Barcodes. Die gefilterte Matrix behält nur Barcodes, die die Software als Zellen einstuft. RNA-arme Zellen können dadurch fehlen. In den praktischen Lektionen prüfen wir daher beide Matrizen, den Qualitätsbericht, die Versionen von Referenzgenom und Annotation, die Reagenzchemie, die Softwareversion und die Parameter für die Zellerkennung.

Vor der Verarbeitung von SRA-Daten mit Cell Ranger musst du prüfen, ob sie aus einem kompatiblen 10x-Experiment stammen. Kläre die Readstruktur, das Referenzgenom, die Reagenzversion und die Beziehungen zwischen den Proben. **In Lektion 1.2 verfolgen wir einen öffentlichen Datensatz von der Identifikation im SRA über die FASTQ-Qualitätskontrolle bis zum Cell-Ranger-Workflow und seinen Ausgabedateien. Du musst dir jetzt noch keine Befehle merken.**

[Einführung des NCBI in das SRA](https://www.ncbi.nlm.nih.gov/sra) · [Offizielle Cell-Ranger-Dokumentation](https://www.10xgenomics.com/support/software/cell-ranger/latest)

## Zusammenfassung

- Die Einzelzell-RNA-Sequenzierung liefert keine Fotografie einer Zelle. Erfasst wird RNA nach der Zelllyse. Die Markierungen werden eingebaut, bevor cDNA unterschiedlicher Herkunft zusammengeführt wird.
- Ein Zellbarcode identifiziert ein Reaktionskompartiment, ein UMI hilft beim Schätzen der Zahl der ursprünglich erfassten Moleküle, und ein Probenindex unterscheidet Bibliotheken.
- 10x trennt Zellen durch GEM-Tröpfchen, BD Rhapsody und der SCOPE-chip durch Mikrovertiefungen. Jede Methode kann bestimmte Zelltypen unterschiedlich gut erfassen.
- 3′-, 5′- und Smart-seq-Verfahren liefern unterschiedliche Informationen. Die Forschungsfrage bestimmt die Wahl.
- Nach der Sequenzierung verarbeitet eine zum Experiment passende Software die Rohdaten und erzeugt daraus die Expressionsmatrix mit Genen und Zellen.

## Literatur und weiterführende Quellen

1. Tang F, et al. mRNA-Seq whole-transcriptome analysis of a single cell. *Nature Methods*. 2009. [doi:10.1038/nmeth.1315](https://doi.org/10.1038/nmeth.1315)
2. Ramsköld D, et al. Full-length mRNA-Seq from single-cell levels of RNA and individual circulating tumor cells. *Nature Biotechnology*. 2012. [doi:10.1038/nbt.2282](https://doi.org/10.1038/nbt.2282)
3. Picelli S, et al. Smart-seq2 for sensitive full-length transcriptome profiling in single cells. *Nature Methods*. 2013. [doi:10.1038/nmeth.2639](https://doi.org/10.1038/nmeth.2639)
4. Hagemann-Jensen M, et al. Single-cell RNA counting at allele and isoform resolution using Smart-seq3. *Nature Biotechnology*. 2020. [doi:10.1038/s41587-020-0497-0](https://doi.org/10.1038/s41587-020-0497-0)
5. Klein AM, et al. Droplet barcoding for single-cell transcriptomics applied to embryonic stem cells. *Cell*. 2015. [doi:10.1016/j.cell.2015.04.044](https://doi.org/10.1016/j.cell.2015.04.044)
6. Macosko EZ, et al. Highly parallel genome-wide expression profiling of individual cells using nanoliter droplets. *Cell*. 2015. [doi:10.1016/j.cell.2015.05.002](https://doi.org/10.1016/j.cell.2015.05.002)
7. Zheng GXY, et al. Massively parallel digital transcriptional profiling of single cells. *Nature Communications*. 2017. [doi:10.1038/ncomms14049](https://doi.org/10.1038/ncomms14049)
