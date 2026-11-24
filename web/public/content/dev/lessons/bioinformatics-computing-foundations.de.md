# 0.1 | Warum wird Linux in der Bioinformatik so häufig eingesetzt? Wozu dienen R, Python und Codex?

Du erhältst einen Datensatz aus einer Einzelzellsequenzierung und möchtest eine biologische Frage beantworten: Welche Zellen haben sich in der erkrankten Gruppe verändert?

Der Weg zur Antwort kann mehrere Schritte umfassen:

> Daten herunterladen → Dateien prüfen → Qualitätskontrolle durchführen → Sequenzen ausrichten oder zählen → Expressionsmatrix zusammenstellen → statistische Analyse durchführen → Abbildungen erstellen → Ergebnis interpretieren

Diese Schritte verteilen sich auf verschiedene Werkzeuge. Einige Programme laufen unter Linux, manche Analysen werden in R oder Python geschrieben. KI-Werkzeuge wie Codex können dabei helfen, Code zu erstellen, Befehle auszuführen und Ergebnisse zu prüfen.

Auf den ersten Blick können Linux, R, Python und Codex wie vier konkurrierende Analyseprogramme wirken. Tatsächlich übernehmen sie unterschiedliche Aufgaben:

| Name | Was ist das? | Typischer Einsatz in der Bioinformatik |
| --- | --- | --- |
| Linux | Ein Betriebssystem | Dateien verwalten, Bioinformatikprogramme ausführen, Verbindungen zu Servern herstellen und Arbeitsabläufe organisieren |
| Bash | Eine unter Linux verbreitete Shell | Befehle eingeben, Programme verknüpfen und Dateien in Stapeln verarbeiten |
| R | Eine Programmiersprache und eine Umgebung für statistische Berechnungen | Statistische Analysen, Datenvisualisierung, Transkriptomik und Einzelzellanalysen |
| Python | Eine vielseitig einsetzbare Programmiersprache | Datenverarbeitung, Automatisierung von Arbeitsabläufen, maschinelles Lernen und Analyse von Omikdaten |
| Codex | Ein KI-Agent, der mit Code, Dateien und Werkzeugen arbeiten kann | Beim Schreiben, Erklären, Ausführen und Prüfen von Analysecode helfen |

Linux stellt die Arbeitsumgebung bereit. Darin übernehmen Bash, R und Python unterschiedliche Aufgaben. Codex unterstützt bei Planung, Ausführung und Kontrolle. Die Forschungsfrage und die Aussagekraft der Belege beurteilen die Forschenden.

![Hierarchie, die die Rollen von Linux, Bash, R, Python, Codex und dem Forscher in der Bioinformatik zeigt](figures/bioinformatics-computing-layers.de.svg)

*Abbildung 1 | Aufgaben der Werkzeuge in der Bioinformatik. Linux stellt das Betriebssystem bereit, Bash verbindet Befehle zu Arbeitsabläufen und R und Python übernehmen Analyseaufgaben. Codex kann mehrere Schritte unterstützen. Die Forschenden stellen die Fragen, prüfen die Belege und interpretieren die Ergebnisse. Die ursprüngliche Projektgrafik entstand am 23. Juli 2026 mit dem Bildgenerator von OpenAI und wurde anschließend als Vektorgrafik mit skalierbarer Schrift neu gezeichnet. Sie enthält keine Herstellerlogos, Bildschirmfotos oder Layouts Dritter. Dargestellt ist einer von mehreren möglichen Arbeitsabläufen.*

Das Diagramm ist eher ein Leitfaden als eine starre Regel. R und Python laufen auch unter Windows und macOS, und Linux ist nicht auf die Verwendung über die Befehlszeile beschränkt.

## Drei Fragen für diese Lektion

Am Ende dieser Lektion sollten Sie in der Lage sein, Folgendes zu erklären:

1. Warum verwenden viele Bioinformatik-Workflows Linux?
2. Wofür eignen sich R und Python, und wie kann man zwischen ihnen wählen?
3. Wenn Codex bereits Code schreiben und Analysen durchführen kann, warum lohnt es sich dann noch, diese Grundlagen zu erlernen?

Sie müssen Linux nicht installieren oder Befehle in dieser Lektion auswendig lernen.

## Warum ist Linux in der Bioinformatik so verbreitet?

### Grund 1: Viele Werkzeuge für die Bioinformatik werden zuerst für Linux entwickelt

Viele Werkzeuge für Sequenzierdaten werden unter Linux oder auf vergleichbaren Unix-Systemen entwickelt und getestet. Manche gibt es auch für macOS, ohne dass sie Windows direkt unterstützen.

Bioconda stellt zahlreiche Pakete für die biomedizinische Forschung bereit. Laut Dokumentation unterstützt Bioconda Linux und macOS, Windows jedoch nicht direkt. Auch 10x Genomics nennt Linux als offizielle Systemvoraussetzung für Cell Ranger.

[Offizielle Bioconda Dokumentation](https://bioconda.github.io/index.html) · [Offizielle Cell Ranger Systemvoraussetzungen](https://www.10xgenomics.com/support/software/cell-ranger/downloads/cr-system-requirements)

Das bedeutet nicht, dass Windows nicht für die Bioinformatik verwendet werden kann. Das bedeutet, dass wenn ein Tool offiziell nur unter Linux unterstützt wird, die Verwendung einer Linux-Umgebung es normalerweise einfacher macht, ein Verhalten zu erhalten, das mit der Dokumentation übereinstimmt.

### Grund 2: Auf Servern und Rechenclustern läuft häufig Linux

Ein gewöhnlicher Laptop genügt, um die Lektionen zu lesen, kleine Datensätze zu untersuchen und Methoden zu erlernen. Für die Verarbeitung roher Sequenzierdaten können jedoch viel Arbeitsspeicher, Plattenspeicher und Rechenleistung erforderlich sein.

Laborserver, Hochleistungsrechnerverbünde (HPC-Cluster) und viele virtuelle Maschinen in der Cloud laufen unter Linux. Die auf dem eigenen Rechner erlernten Befehle und Verzeichnisstrukturen lassen sich daher oft auch auf einem Server verwenden.

Linux allein macht einen Rechner nicht schneller. Ob sich eine Analyse ausführen lässt, hängt von Prozessor, Arbeitsspeicher, freiem Plattenspeicher und Datenmenge ab. Fehlt für einen Rohdaten-Workflow der nötige Arbeitsspeicher, gleicht eine Linux-Umgebung unter Windows das nicht aus.

### Grund 3: Befehle lassen sich leicht kombinieren, aufzeichnen und wiederholen

Grafische Schnittstellen sind nützlich für die Erforschung, aber nach dem Klicken durch viele Bildschirme kann es schwierig sein, zu beantworten:

- Welche Eingabedatei haben Sie ausgewählt?
- Welche Parameter haben Sie verwendet?
- Welche Softwareversion wurde installiert?
- Welcher Schritt hat eine Warnung erzeugt?
- Wie würden Sie das gleiche Verfahren für zwanzig weitere Proben wiederholen?

An der Linux-Kommandozeile lassen sich die Schritte einer Analyse als Skript festhalten. Ein Skript ist eine Datei mit auszuführenden Befehlen. Man kann sie prüfen, ändern, erneut ausführen und mit anderen teilen.

Ein Skript allein garantiert noch keine Reproduzierbarkeit. Auch Referenzgenom, Annotationsdateien, Softwareversionen, Probeninformationen und der Startwert des Zufallszahlengenerators (Seed) können das Ergebnis beeinflussen.

### Grund 4: Linux bietet bewährte Werkzeuge zur Verwaltung von Dateien und Zugriffsrechten

An einer bioinformatischen Analyse sind viele Dateien beteiligt: FASTQ- und BAM-Dateien, Expressionsmatrizen, Probentabellen, Protokolldateien und Abbildungen. Ohne klare Verzeichnisstruktur liest ein Programm womöglich Daten der falschen Probe ein oder überschreibt ein früheres Ergebnis.

Linux bietet explizite Dateipfade, Benutzerberechtigungen und Protokollierungsmechanismen. Das Ziel des Lernens dieser Ideen ist nicht, Befehle auswendig zu lernen. Es ist zu wissen:

- wo sich die Daten befinden;
- Was das Programm liest;
- wo das Ergebnis geschrieben wird;
- Welche Dateien geändert werden können; und
- Welches Protokoll nach einem Fehler geprüft werden soll.

## Muss man Windows neu installieren, um Linux zu nutzen?

Nein.

Windows Subsystem for Linux (WSL) ermöglicht es einem Windows-Benutzer, eine Linux-Distribution, Bash und Linux-Befehlszeilenprogramme auszuführen, ohne einen Dual-Boot-Computer einzurichten.

[Offizielle Microsoft WSL-Übersicht](https://learn.microsoft.com/en-us/windows/wsl/about)

Auf Einsteigerniveau kann WSL als Linux-Arbeitsumgebung innerhalb eines Windows-Computers verstanden werden. Viele der gleichen Konzepte bleiben nützlich, wenn Sie später einen Laborserver verwenden.

WSL und ein Remote-Server sind jedoch nicht dasselbe:

- WSL nutzt die Ressourcen des eigenen Computers.
- Ein Server verwendet die Ressourcen eines entfernten Computers;
- Auf einem HPC-Cluster kann ein Auftragsplaner (Scheduler) die verfügbaren Ressourcen auf die von unterschiedlichen Personen eingereichten Rechenaufträge verteilen.
- Eine Cloud-Plattform kann Speicher- und Rechenzeit in Rechnung stellen.

Spätere praktische Lektionen werden daher sowohl angeben, wo ein Befehl ausgeführt wird, als auch wo die Daten gespeichert werden. Sie präsentieren keinen Code, ohne seine Ausführungsumgebung zu identifizieren.

## Was ist R?

Das R Project beschreibt R sowohl als Programmiersprache als auch als Umgebung für statistische Berechnungen und Grafiken.

[Offizielle R-Projekteinführung](https://www.r-project.org/about.html)

Eine wichtige Stärke von R in der Bioinformatik ist Bioconductor. Bioconductor ist ein Open-Source-Bioinformatik-Projekt, das auf R basiert. Es deckt genomische, transkriptomische, Durchflusszytometrie und andere Daten ab, wobei statistische Methoden, Dokumentation und reproduzierbare Forschung betont werden.

[Offizielle Bioconductor Einführung](https://bioconductor.org/about/index.html)

Seurat ist ein verbreitetes R-Paket zur Qualitätskontrolle, Erkundung, Clusterbildung, Integration und Visualisierung von Einzelzelldaten.

[Offizielle Seurat Dokumentation](https://satijalab.org/seurat/)

Gemeinsame Stärken von R sind:

- ein ausgereiftes Ökosystem für statistische Analysen;
- Eine große Sammlung von Omics-Paketen in Bioconductor;
- Analysen, statistische Modelle und Abbildungen lassen sich in einem Skript oder Bericht zusammenführen;
- R-Code in vielen Abschnitten und Tutorials zu biomedizinischen Methoden.

R erfordert auch einige Anpassungen:

- manche Pakete setzen bestimmte Versionen von R oder Bioconductor voraus;
- Verschiedene Pakete können unterschiedliche Datenobjekte verwenden;
- bei großen Datensätzen sollte man auf den Speicherverbrauch achten und große Objekte nicht unnötig oft kopieren;
- eine erzeugte Abbildung belegt noch nicht, dass die statistische Planung stimmt.

## Was ist Python?

Python ist eine allgemeine Programmiersprache. Neben dem wissenschaftlichen Rechnen wird es häufig für Softwareentwicklung, Automatisierung, Netzwerkdienste, maschinelles Lernen und Bildung verwendet. Der Python Package Index bietet eine große Sammlung von Drittanbieter-Modulen.

[Offizielle Python Einführung](https://www.python.org/about/)

Scanpy ist eine Sammlung von Python-Werkzeugen für die Vorverarbeitung und Visualisierung von Einzelzelldaten, das Clustering, die Ableitung von Zelltrajektorien und die Analyse differentieller Genexpression. Die Daten werden in AnnData-Objekten verarbeitet.

[Offizielle Scanpy Dokumentation](https://scanpy.readthedocs.io/)

Gemeinsame Stärken von Python sind:

- Verbindung von Datendownload, Dateiverarbeitung, Analyse und Automatisierung in einem kompletten Workflow;
- ein breites Angebot an Werkzeugen für wissenschaftliches Rechnen, maschinelles Lernen und Deep Learning;
- Integration mit Datenbanken, Webdiensten und anderen Programmen; und
- Entwicklung wiederverwendbarer Analysesoftware und -werkzeuge.

Python erfordert auch einige Anpassungen:

- Viele Pakete können unterschiedliche Ansätze für dasselbe Problem anbieten;
- Versionen von Python, Pakete und Bibliotheken auf niedrigerer Ebene müssen kompatibel bleiben;
- wurden die Codezellen eines Notebooks in anderer Reihenfolge ausgeführt, kann die Analyse nach dem erneuten Öffnen und Ausführen fehlschlagen oder andere Ergebnisse liefern;
- Die Freiheit einer Allzwecksprache erfordert auch ein aktives Management der Codestruktur und des Datenzustands.

## Wann eignet sich R, wann Python?

Es gibt keine einzige Antwort ohne eine spezifische Aufgabe.

| Aspekt | R | Python |
| --- | --- | --- |
| Ursprünglicher Schwerpunkt | Statistische Berechnungen und Grafiken | Allgemeine Programmierung |
| Typische Werkzeuge in der Bioinformatik | Bioconductor, Seurat | NumPy, pandas, scikit-learn, Scanpy/scverse |
| Typische Stärken | Statistische Modellierung, differenzielle Analysen, Biostatistik und Abbildungen für Publikationen | Automatisierung, maschinelles Lernen, Datentechnik und Entwicklung von Analysewerkzeugen |
| Häufige Einstiegshürden | Paketversionen, Datenobjekte und statistische Begriffe | Verwaltung von Umgebungen, Softwarestruktur und Auswahl unter vielen Bibliotheken |
| Eignet sich die Sprache für Einzelzelldaten? | Ja | Ja |
| Läuft sie unter Linux? | Ja | Ja |

Alle folgenden Behauptungen sind zu einfach:

- „Mit R kann man nur Grafiken erstellen.“
- „Python ist immer schneller als R.“
- „Python kann alles, R ist also unnötig.“
- „Biomedizinische Artikel verwenden oft R, Python ist also unnötig.“

Die tatsächliche Leistung hängt vom Algorithmus, den Datenstrukturen, der Implementierung auf niedriger Ebene, dem Speicher und der parallelen Berechnung ab – nicht nur vom Sprachennamen. Viele R- und Python-Pakete rufen C, C++, Fortran oder anderen Hochleistungscode für ihre Kernberechnungen auf.

Eine sinnvollere Wahl beginnt mit diesen Fragen:

1. Welches Ökosystem enthält eine ausgereifte Methode für die Forschungsfrage?
2. Welche Implementierung wird durch das offizielle Tutorial und Originalpapier bereitgestellt?
3. Welche Datenobjekte und Workflows verwendet das Team?
4. Muss das Ergebnis an ein bestehendes Projekt angeschlossen werden?
5. Können Sie jeden Schritt erklären und validieren?

Ein echtes Projekt kann beide Sprachen verwenden. Linux-Tools können eine Ausdrucksmatrix generieren, R kann statistische Analysen durchführen und Python kann zusätzliches maschinelles Lernen oder Automatisierung bereitstellen.

## Wozu dieser Kurs, wenn Codex Daten selbst analysieren kann?

Codex kann Dateien lesen und ändern, Code schreiben, Aufgaben ausführen und automatisierte Workflows erstellen. OpenAIs aktuelle Einführung in Codex betont, dass es echte Arbeit über Dateien und Werkzeuge hinweg ausführen kann.

[OpenAI Einführung in Codex](https://openai.com/academy/what-is-codex/)

Das verändert die Art und Weise, wie Menschen lernen. Ein Anfänger muss sich nicht mehr eine große Menge an Syntax merken, bevor er mit der Prüfung von Daten oder dem Ausprobieren eines Analyse-Workflows beginnt.

Aber es beseitigt nicht die Notwendigkeit, Bioinformatik zu verstehen.

### Auch fehlerfrei ausgeführter Code kann eine falsche Analyse liefern

Code kann ohne Fehler enden und eine attraktive Figur erzeugen, während er immer noch Probleme enthält wie:

- Keine unabhängigen biologischen Replikate für die Krankheits- und Kontrollgruppen;
- jede einzelne Zelle wie eine unabhängige biologische Probe zu behandeln;
- Verwendung eines inkompatiblen Referenzgenoms;
- eine wichtige Population von Zellen mit geringem RNA-Gehalt herauszufiltern;
- Versuchsbedingung und Verarbeitungscharge vollständig zusammenfallen zu lassen, etwa indem alle Krankheitsproben an einem Tag und alle Kontrollen an einem anderen Tag verarbeitet werden;
- rechnerisch ermittelte Ähnlichkeit zwischen zwei Zellpopulationen als Beleg für einen ursächlichen Zusammenhang zu deuten.

Dies sind in der Regel keine Syntaxfehler. Sie können nicht einfach durch die Frage erkannt werden, ob der Code erfolgreich ausgeführt wurde.

### Jemand muss die Ergebnisse der KI beurteilen können

Für die Intuition kann Codex mit einem schnellen Forschungsassistenten verglichen werden, der Werkzeuge bedienen kann. Es kann Dateien organisieren, einen Fehler erklären, ein Skript schreiben und Prüfungen durchführen, aber Sie müssen es immer noch sagen:

- Was die biologische Frage eigentlich ist;
- welche Daten verwendet werden dürfen;
- welche Probe die unabhängige Versuchseinheit ist;
- Was zählt als erfolgreiches Ergebnis?
- welche ungewöhnlichen Beobachtungen nicht automatisch entfernt werden dürfen; und
- Welche Beweise für die endgültige Schlussfolgerung erforderlich sind.

Die Analogie hat Grenzen. Codex hat nicht die feste Fähigkeitsstufe eines menschlichen Assistenten; sein Verhalten hängt vom Modell, den Werkzeugen, dem Kontext und den Berechtigungen ab. Unabhängig von der Fähigkeit muss eine abschließende Analyse immer noch durch Quellen, Parameter, Protokolle und unabhängige Beweise validiert werden. OpenAI beschreibt Codex ähnlich als ein Werkzeug, das menschliche Führung und Überprüfung erfordert, anstatt das menschliche Urteilsvermögen zu ersetzen.

### Auch das Ziel eines Tutorials ändert sich

Vor KI-Tools widmeten Tutorials häufig einen großen Teil ihres Platzes der Aufforderung an Lernende, sich Funktionsnamen und Befehlsargumente zu merken.

In der Codex-Ära sind wichtigere Lernziele:

- Verstehen, warum ein Analyseschritt existiert;
- Beschreibung der Inputs, Outputs und Erfolgskriterien;
- Prüfung, ob ein KI-ausgewähltes Tool den Daten entspricht;
- Fehler im experimentellen Design, in der Statistik und in der biologischen Interpretation erkennen;
- Die KI verpflichten, Code, Versionen, Protokolle und Entscheidungsaufzeichnungen beizubehalten; und
- Wissen, welchen Beweisen man vertrauen kann, wenn ein KI-Ergebnis mit offizieller Dokumentation oder einem Originalpapier in Konflikt steht.

Dieser Kurs konkurriert daher nicht mit Codex, um Code schneller zu schreiben. Es zielt darauf ab, Lernenden zu helfen, die richtigen Fragen zu stellen, Analysen zu überwachen, Beweise zu prüfen und Verantwortung für wissenschaftliche Urteile zu übernehmen.

## Quellen und weiterführende Literatur

1. [Was ist R?](https://www.r-project.org/about.html)
2. [Python.org: Über Python](https://www.python.org/about/)
3. [Bioconductor: Über uns](https://bioconductor.org/about/index.html)
4. [Offizielle Bioconda Dokumentation](https://bioconda.github.io/index.html)
5. [Microsoft: Windows Subsystem für Linux](https://learn.microsoft.com/en-us/windows/wsl/about)
6. [10x Genomics: Cell Ranger Systemvoraussetzungen](https://www.10xgenomics.com/support/software/cell-ranger/downloads/cr-system-requirements)
7. [Offizielle Seurat Dokumentation](https://satijalab.org/seurat/)
8. [Offizielle Scanpy Dokumentation](https://scanpy.readthedocs.io/)
9. [OpenAI Academy: Was ist ChatGPT Codex?](https://openai.com/academy/what-is-codex/)
