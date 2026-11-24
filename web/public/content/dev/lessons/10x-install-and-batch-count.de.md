# 1.2 | Cell Ranger und Space Ranger von 10x Genomics installieren

In dieser Lektion installieren Sie zwei Programme unter Linux. Cell Ranger erstellt aus Sequenzierdaten einzelner Zellen eine Genexpressionsmatrix. Space Ranger ordnet die gemessenen Expressionswerte den Positionen zu, an denen die RNA auf einem Gewebeschnitt erfasst wurde. [Offizielle Installationsanleitung für Cell Ranger](https://www.10xgenomics.com/support/software/cell-ranger/latest/tutorials/cr-tutorial-in) · [Offizielle Installationsanleitung für Space Ranger](https://www.10xgenomics.com/support/software/space-ranger/downloads/space-ranger-installation)

## Teil I. Cell Ranger installieren

### 1. Cell Ranger 10.1.0 herunterladen und entpacken

Kopieren Sie den Downloadbefehl von der Website von 10x in Ihr Linux-Terminal. Führen Sie ihn aus und entpacken Sie das heruntergeladene Archiv. [Cell Ranger herunterladen](https://www.10xgenomics.com/support/software/cell-ranger/downloads#download-links)

### 2. Das humane Referenzpaket herunterladen und entpacken

Laden Sie für menschliche Proben das **humane Referenzpaket GRCh38 2024-A** herunter (etwa 11 GB). GRCh38 bezeichnet die verwendete Assemblierung des menschlichen Genoms, 2024-A die Version des Referenzpakets von 10x. Cell Ranger nutzt die Sequenzen, Genannotationen und Indizes des Pakets, um zu bestimmen, von welchem Gen eine gelesene Sequenz (ein Read) stammt. [Humanes Referenzpaket GRCh38 2024-A herunterladen](https://cf.10xgenomics.com/supp/cell-exp/refdata-gex-GRCh38-2024-A.tar.gz)

Geben Sie nach dem Entpacken bei `--transcriptome` den Pfad zum gesamten Referenzverzeichnis an. Verwenden Sie für Mausproben das Referenzpaket für die Maus.

### 3. Cell Ranger zum Suchpfad `PATH` hinzufügen

Mit dem Entpacken des Archivs ist das Programm installiert. Damit Sie `cellranger` vom Verzeichnis Ihrer Probe aus starten können, muss Bash wissen, wo es liegt. Die Variable `PATH` enthält eine durch Doppelpunkte getrennte Liste von Verzeichnissen. Bash durchsucht sie von links nach rechts. Der folgende Befehl setzt die neue Installation an die erste Stelle und behält mit `:$PATH` die bisherigen Suchverzeichnisse bei. [Anleitung von 10x zum Einrichten des Suchpfads](https://www.10xgenomics.com/support/software/cell-ranger/latest/tutorials/cr-tutorial-in)

```bash
export PATH="$HOME/10x-tools/cellranger-10.1.0:$PATH"
command -v cellranger
cellranger --version
```

Die erste Prüfung sollte einen Pfad in Ihrem persönlichen Verzeichnis anzeigen, der auf `/10x-tools/cellranger-10.1.0/cellranger` endet. Die zweite sollte `10.1.0` ausgeben. Meldet Bash `command not found`, prüfen Sie, ob die ausführbare Datei unter diesem Pfad liegt. Erscheint eine ältere Version, zeigt `type -a cellranger` alle gleichnamigen Befehle an. Prüfen Sie, welches Verzeichnis zuerst erscheint.

**Die Einstellung für neue Terminals speichern.** Der obige Befehl `export` gilt für die laufende Bash-Sitzung und die von ihr gestarteten Prozesse. Öffnen Sie Ihre persönliche Konfigurationsdatei mit einem Texteditor, zum Beispiel mit `nano ~/.bashrc`, und ergänzen Sie am Ende die folgende Zeile. Ist sie bereits vorhanden, genügt ein Eintrag.

```bash
export PATH="$HOME/10x-tools/cellranger-10.1.0:$PATH"
```

Drücken Sie in nano `Ctrl+O` und anschließend die Eingabetaste, um zu speichern. Beenden Sie den Editor mit `Ctrl+X`. Lesen Sie die Datei mit den folgenden Befehlen neu ein und prüfen Sie die Ausgabe. Öffnen Sie danach wie gewohnt ein neues Terminal auf dem Server und führen Sie `cellranger --version` erneut aus.

```bash
source "$HOME/.bashrc"
command -v cellranger
cellranger --version
```

Eine interaktive Bash, die nicht als Login-Shell gestartet wurde, liest `~/.bashrc` automatisch ein. Bei einer Anmeldung über SSH hängt das von Ihrer Anmeldekonfiguration ab. Findet Bash den Befehl nach einer erneuten Anmeldung nicht mehr, prüfen Sie, ob Ihre aktive Anmeldedatei, häufig `~/.bash_profile`, auch `~/.bashrc` lädt. Auf einem Cluster können Sie dieselbe Zeile `export PATH=...` in das Jobskript übernehmen, damit der Rechenknoten die gewünschte Version verwendet. [Startdateien von Bash](https://www.gnu.org/software/bash/manual/html_node/Bash-Startup-Files.html)

### 4. Die Hilfe zu `cellranger` lesen

Sie können diese Befehle in jedem Verzeichnis ausführen. Der erste listet die Aufgaben auf, die Cell Ranger übernehmen kann. Die beiden anderen zeigen die Optionen für einzelne Aufgaben an. Jeder Hilfebefehl gibt seinen Text aus und beendet sich dann.

```bash
cellranger --help
cellranger count --help
cellranger testrun --help
```

Die Zeile `Usage` zeigt den Aufbau eines Befehls. In `cellranger testrun --id=check_install` ist `cellranger` das Programm, `testrun` der Unterbefehl, `--id` eine Option und `check_install` der von Ihnen gewählte Name für diesen Lauf. Ersetzen Sie `<ID>` durch Ihren eigenen Wert. `[OPTIONS]` zeigt an, wo Sie Optionen ergänzen können. Lassen Sie die spitzen und die eckigen Klammern bei der Eingabe weg. `-h` oder `--help` zeigt die Hilfe an, `-V` oder `--version` die Programmversion.

| Unterbefehle in der Hilfe | Aufgabe |
| --- | --- |
| `testrun` | Prüft die Installation mit einem kleinen mitgelieferten Datensatz. |
| `count` | Zählt Moleküle für Gene und weitere unterstützte Merkmale in einer Probe aus einer einzelnen Zellerfassung. Eine Sequenzierbibliothek besteht aus den Molekülen einer Probe, die für die Sequenzierung vorbereitet wurden. |
| `multi`, `multi-template` | `multi` liest eine Konfigurationsdatei, um gemeinsam verarbeitete (multiplexierte) Proben, Flex-Experimente oder Experimente mit mehreren Bibliothekstypen auszuwerten. `multi-template` erstellt eine Vorlage für diese Datei. |
| `vdj`, `mkvdjref` | `vdj` rekonstruiert aus Sequenzierdaten des Immunrepertoires die Rezeptorsequenzen von T- oder B-Zellen. `mkvdjref` erstellt eine Referenz für diese Analyse. |
| `aggr`, `reanalyze`, `annotate` | `aggr` führt Ergebnisse mehrerer Läufe zusammen. `reanalyze` wiederholt Dimensionsreduktion und Clustering auf einer bestehenden Matrix. `annotate` sagt anhand vorhandener Ergebnisse die Zelltypen voraus. |
| `mkref`, `mkgtf`, `mat2csv` | `mkref` erstellt aus Sequenzdateien und Genannotationen eine eigene Referenz. `mkgtf` filtert Genannotationen nach Attributen. `mat2csv` wandelt eine Matrix in eine CSV-Datei um. Bei einer großen Matrix kann diese Datei sehr viel Platz beanspruchen. |
| `sitecheck`, `upload`, `telemetry`, `cloud`, `help` | `sitecheck` zeigt die Rechnerkonfiguration an. `upload` sendet die angegebene Diagnosedatei an den Support von 10x. Mit `telemetry` können Sie die Einstellungen zur Erfassung von Nutzungsdaten einsehen oder ändern. `cloud` greift auf die Cloud-Dienste von 10x zu. `help` zeigt die Hilfe zu einem Befehl an. |

In älteren Anleitungen kommt gelegentlich `mkfastq` vor. 10x hat diesen Befehl als veraltet gekennzeichnet. Wenn Ihr Sequenzierzentrum FASTQ-Dateien liefert, können Sie mit diesen Dateien beginnen. Sie enthalten die Sequenzen und die Qualitätswerte der einzelnen Basen. Der Installationstest verwendet eigene Beispieldaten. [Befehle von Cell Ranger](https://www.10xgenomics.com/support/software/cell-ranger/latest/getting-started/cr-command-line-arguments) · [Quellcode der Befehle in Cell Ranger 10.1.0](https://github.com/10XGenomics/cellranger/blob/cellranger-10.1.0/lib/rust/cr_wrap/src/bin/cellranger.rs)

Suchen Sie in der Ausgabe von `cellranger count --help` zunächst die folgenden Optionen. Sie legen fest, welche Dateien das Programm einliest und in welchem Verzeichnis es die Ergebnisse ablegt.

| Option | Standardwert oder Verhalten beim Weglassen in Cell Ranger 10.1.0 | Angabe für die eigene Probe |
| --- | --- | --- |
| `--id` | Pflichtangabe, kein Standardwert. | Einen Namen für den Lauf und sein Ausgabeverzeichnis wählen, etwa `GEX_A`. |
| `--fastqs` | In diesem Beispiel erforderlich. Es gibt keinen Standardpfad. | Das Verzeichnis mit den Sequenzierdateien angeben. |
| `--sample` | Bei einem einzigen Dateinamenspräfix wird die Probe automatisch ausgewählt. Bei mehreren Präfixen führt das Weglassen zu einem Fehler. | Das Präfix der gewünschten Probe angeben. Bei `GEX_A_S1_L001_R1_001.fastq.gz` lautet es beispielsweise `GEX_A`. |
| `--transcriptome` | In diesem Beispiel erforderlich. Es gibt keine Standardreferenz. | Das gesamte in Schritt 2 entpackte Referenzverzeichnis angeben. |
| `--localcores` | Im lokalen Modus werden alle verfügbaren CPU-Kerne genutzt. | Die Zahl der für diesen Job zugewiesenen Kerne eintragen. |
| `--localmem` | Im lokalen Modus werden 90 % des erkannten Arbeitsspeichers genutzt. | Die Speichergrenze in GB angeben und dabei den für den Job zugewiesenen Speicher einhalten. |
| `--create-bam` | Pflichtangabe. Entweder `true` oder `false` ausdrücklich angeben. | `true` wählen, wenn die Alignments einzelner Reads benötigt werden. Genügt die Expressionsmatrix, kann `false` gewählt werden. |
| `--include-introns` | `true` bei üblichen 3′- und 5′-Genexpressionsanalysen des gesamten Transkriptoms. | Standardmäßig werden intronische Reads mitgezählt, wenn sie die Zählkriterien erfüllen. Mit `false` werden sie ausgeschlossen. |
| `--nosecondary` | Dieser Schalter ist standardmäßig aus. Die integrierte Sekundäranalyse läuft. | Mit `--nosecondary` lässt sich dieser Schritt überspringen, wenn Dimensionsreduktion und Clustering später selbst durchgeführt werden. |

### 5. Die Installation mit `testrun` prüfen und einen Betriebssystemfehler einordnen

**Wenn diese Meldung erscheint, prüfen Sie das Betriebssystem des Rechners, auf dem der Test lief.** Die Fehlermeldung betrifft die Kompatibilität des Betriebssystems. Ein anderes Referenzpaket oder ein erneutes Entpacken der Software behebt das Problem nicht.

```text
ERROR: This operating system version is unsupported:
    CentOS Linux release XXX (Core)
...
To continue running this version for now, set TENX_IGNORE_DEPRECATED_OS=1
```

Bitten Sie für eine Projektanalyse Ihre Systemadministration um einen Rechenknoten, der die aktuellen Anforderungen von 10x erfüllt. Prüfen Sie dort die Version mit `cellranger --version` und wiederholen Sie den Installationstest. Der Anmeldeknoten und der Rechenknoten, auf dem der Auftrag ausgeführt wird, können unterschiedliche Betriebssysteme verwenden. [Von 10x unterstützte Betriebssysteme](https://www.10xgenomics.com/support/software/cell-ranger/latest/miscellaneous/cr-os-requirements) · [Systemanforderungen für Cell Ranger 10.1](https://www.10xgenomics.com/support/software/cell-ranger/downloads/cr-system-requirements)

Um die in der Meldung genannte Übergangslösung zu verwenden, führen Sie `export TENX_IGNORE_DEPRECATED_OS=1` aus.

### 6. Zähloptionen passend zur Version wählen

`testrun` prüft, ob das Programm auf Ihrem Rechner läuft. Mit `count` erstellen Sie aus Ihren eigenen FASTQ-Dateien eine Expressionsmatrix. Wenn Sie ein älteres Skript übernehmen, prüfen Sie die folgenden Einstellungen. Sie beeinflussen die Zählergebnisse oder die erzeugten Dateien. [Versionshinweise zu Cell Ranger](https://www.10xgenomics.com/support/software/cell-ranger/latest/release-notes/cr-release-notes) · [Optionen in Cell Ranger 10.1](https://www.10xgenomics.com/support/software/cell-ranger/latest/getting-started/cr-command-line-arguments)

| Änderung | Bedeutung für Ihr Projekt |
| --- | --- |
| **Ab Version 7.0** gilt bei den üblichen 3′- und 5′-Genexpressionsanalysen des gesamten Transkriptoms standardmäßig `--include-introns=true`. Frühere Versionen schlossen Introns standardmäßig aus. | Introns sind Abschnitte eines RNA-Transkripts, die beim Spleißen meist entfernt werden. Bei `true` kann ein Read aus einem Intron zur Molekülzählung beitragen, wenn sein Alignment die Kriterien erfüllt und der Read einem Gen zugeordnet werden kann. Das ist gerade bei Zellkernen nützlich, da sie mehr ungespleißte RNA enthalten. Bei `false` werden solche Reads ausgeschlossen. Prüfen Sie die ursprüngliche Einstellung, wenn Sie frühere Genexpressionswerte reproduzieren möchten. |
| **Ab Version 8.0** verlangt `count` ausdrücklich `--create-bam=true` oder `false`. Diese Option ersetzt das frühere `--no-bam`. | Eine BAM-Datei enthält das Alignment jedes einzelnen Reads. Wählen Sie `false`, um Speicherplatz und Schreibzeit zu sparen, wenn Sie nur die Matrix benötigen und die Qualitätskontrolle bereits geplant haben. Wählen Sie `true`, wenn Sie Alignments in einem Genombrowser untersuchen möchten, ein nachgelagertes Werkzeug eine BAM-Datei benötigt oder die weitere Verwendung noch offen ist. Die Expressionsmatrix entsteht bei beiden Einstellungen. |
| **In Version 10.1** erfolgt die Zelltypannotation bei menschlichen Daten standardmäßig lokal mit Pan-Human Azimuth. Die voreingestellte Sekundäranalyse umfasst UMAP. t-SNE ist zunächst ausgeschaltet. | `--disable-cell-annotation` schaltet die automatische Zelltypannotation aus. Mit `--enable-tsne=true` ergänzen Sie die integrierte Sekundäranalyse um t-SNE. UMAP und t-SNE projizieren hochdimensionale Expressionsdaten in weniger Dimensionen, um sie grafisch darzustellen. |

**Wann lohnt sich `--nosecondary`?** Lassen Sie die voreingestellte Sekundäranalyse bei einem ersten Lauf aktiviert, um die Projektionen und Zellcluster des Programms zu betrachten. Wenn Sie eigene Projektionen und Cluster aus der Matrix mit Seurat oder Scanpy berechnen möchten, ergänzen Sie `cellranger count` um `--nosecondary`. Diese Option benötigt keinen Wert. Sie sparen die Rechenzeit der integrierten Sekundäranalyse und erhalten deren Ergebnisse dann auch nicht. Die BAM-Ausgabe lässt sich unabhängig davon steuern, etwa mit `--create-bam=false`.

## Teil II. Space Ranger installieren

### 1. Space Ranger 4.1.0 herunterladen und entpacken

Space Ranger ordnet die mit Visium gemessene RNA den Positionen zu, an denen sie auf dem Gewebeschnitt erfasst wurde. [Offizielle Installationsanleitung für Space Ranger](https://www.10xgenomics.com/support/software/space-ranger/downloads/space-ranger-installation) · [Systemanforderungen](https://www.10xgenomics.com/support/software/space-ranger/downloads/space-ranger-system-requirements)
Laden Sie das Archiv der gewünschten Version herunter und entpacken Sie es. Die aktuelle Version finden Sie auf der Downloadseite von 10x. [Space Ranger herunterladen](https://www.10xgenomics.com/support/software/space-ranger/downloads)

**Das humane Referenzpaket herunterladen und entpacken.** Space Ranger verwendet dieselbe Referenz GRCh38 2024-A wie Cell Ranger. Wenn Sie diese bereits entpackt haben, gehen Sie zum nächsten Schritt. [Humanes Referenzpaket GRCh38 2024-A herunterladen (etwa 11 GB)](https://cf.10xgenomics.com/supp/cell-exp/refdata-gex-GRCh38-2024-A.tar.gz)

Geben Sie bei `spaceranger count` mit `--transcriptome` den Pfad zum entpackten Referenzverzeichnis an.

### 2. Den Suchpfad `PATH` einrichten und die Hilfe lesen

```bash
export PATH="$HOME/10x-tools/spaceranger-4.1.0:$PATH"
command -v spaceranger
spaceranger --version
```

Der Pfad sollte auf `/spaceranger-4.1.0/spaceranger` enden und die angezeigte Version sollte `4.1.0` sein. Öffnen Sie die Konfigurationsdatei mit `nano ~/.bashrc`, fügen Sie den Befehl `export` in einer eigenen Zeile ein und führen Sie `source ~/.bashrc` aus. Öffnen Sie ein neues Terminal und führen Sie erneut `spaceranger --version` aus. Wenn Sie beide Programme installiert haben, braucht jedes in `.bashrc` eine eigene `export`-Zeile.

```bash
spaceranger --help
spaceranger testrun --help
spaceranger count --help
```

Lesen Sie die Hilfe wie zuvor. Suchen Sie zuerst das Programm, dann den Unterbefehl und dessen Optionen. `--help` zeigt die Syntax und `--version` die Programmversion an. [Befehlsreferenz für Space Ranger](https://www.10xgenomics.com/support/software/space-ranger/latest/analysis/running-pipelines/command-line-arguments)

| Unterbefehle | Aufgabe |
| --- | --- |
| `testrun`, `count` | `testrun` prüft die Installation mit den mitgelieferten Daten. `count` verarbeitet einen Erfassungsbereich und liefert Expressionsmatrizen, räumliche Koordinaten und Ergebnisse zum Gewebebild. |
| `segment`, `annotate` | `segment` erkennt Zellkerne in unterstützten Visium-HD-Gewebebildern. `annotate` sagt Zelltypen anhand geeigneter Ergebnisse der HD-Zellsegmentierung voraus. |
| `aggr` | Führt kompatible Analysen mehrerer Erfassungsbereiche zusammen. Space Ranger 4.1 unterstützt diesen Arbeitsablauf für Visium HD nicht. |
| `mkref`, `mkgtf`, `mat2csv` | Die Befehle erstellen eine Referenz, filtern Genannotationen beziehungsweise wandeln eine Expressionsmatrix in CSV um. |
| `sitecheck`, `upload`, `telemetry`, `cloud` | Mit diesen Befehlen prüfen Sie der Reihe nach die Rechenumgebung, senden Diagnosedateien an den Support von 10x, verwalten die Erfassung von Nutzungsdaten und greifen auf die Cloud-Dienste von 10x zu. Der aus älteren Arbeitsabläufen bekannte Befehl `mkfastq` ist veraltet. |

### 3. Die Installation auf einem Rechenknoten mit oder ohne Internetzugang testen

```bash
cd "$HOME/10x-work"
spaceranger testrun --id=check_spaceranger
```

`--id` legt den Namen des Ausgabeverzeichnisses fest. Sobald im Terminal `Pipestance completed successfully!` erscheint, ist der Installationstest bestanden. Meldet das Programm ein nicht unterstütztes Betriebssystem, führen Sie `cat /etc/os-release` auf dem Rechenknoten aus, auf dem der Auftrag lief. Wechseln Sie auf einen Knoten, der die Anforderungen von Space Ranger erfüllt. Space Ranger 4.1 unterstützt CentOS 7.5 nicht. [Systemanforderungen für Space Ranger](https://www.10xgenomics.com/support/software/space-ranger/downloads/space-ranger-system-requirements)

Die Meldung `Could not retrieve spot layout data` bedeutet, dass das Programm die Anordnung der Erfassungspunkte auf dem Objektträger nicht abrufen konnte. Hat der Rechenknoten keinen Internetzugang, wiederholen Sie den **Installationstest** im Offline-Modus mit einem neuen Ausgabeverzeichnis.

```bash
spaceranger testrun --no-internet --id=check_spaceranger_offline
```

**Wenn Sie Ihren eigenen Objektträger auswerten**, laden Sie die Datei mit der Anordnung der Erfassungspunkte auf einem Rechner mit Internetzugang herunter. Verwenden Sie dazu die Seriennummer Ihres Objektträgers. Übertragen Sie die Datei auf den Offline-Rechenknoten und geben Sie bei `spaceranger count` die Optionen `--slidefile`, `--slide` und `--area` an. Prüfen Sie nach erfolgreichem Installationstest, ob Objektträger, Erfassungsbereich und Gewebebild zusammengehören. [Anleitung von 10x für Offline-Tests und Layoutdateien](https://www.10xgenomics.com/support/software/space-ranger/downloads/space-ranger-installation)

### 4. Die Optionen für einen Visium-Erfassungsbereich festlegen

In diesem Beispiel verwenden wir **das ursprüngliche Visium v1 mit frisch eingefrorenem menschlichem Gewebe und einer Hellfeldaufnahme des H&E-gefärbten Gewebes**. H&E steht für Hämatoxylin und Eosin, zwei Farbstoffe, die Gewebestrukturen sichtbar machen. Ersetzen Sie `V10J25-015`, `A1`, `Tissue_A` und den Bilddateinamen durch die Angaben zu Ihrem Objektträger und aus Ihren Sequenzierunterlagen. Wenn Sie lediglich die Installation überprüfen wollten, haben Sie dieses Ziel im vorherigen Schritt erreicht.

```bash
cd "$HOME/10x-work"
spaceranger count --id=visium_A \
  --transcriptome="$HOME/10x-work/refs/refdata-gex-GRCh38-2024-A" \
  --fastqs="$HOME/10x-work/fastqs/Tissue_A" --sample=Tissue_A \
  --image="$HOME/10x-work/images/Tissue_A_HE.tif" \
  --slide=V10J25-015 --area=A1 \
  --include-introns=true --create-bam=false
```

| Option im Beispiel | Standardwert oder Verhalten beim Weglassen in Space Ranger 4.1.0 | Angabe und Auswirkung |
| --- | --- | --- |
| `--id` | Pflichtangabe, kein Standardwert. | Dem Ausgabeverzeichnis einen Namen geben. Im Beispiel heißt es `visium_A/`. |
| `--transcriptome` | Pflichtangabe, keine Standardreferenz. | Das Verzeichnis der entpackten humanen Referenz angeben. |
| `--fastqs` | In diesem Beispiel erforderlich. Es gibt keinen Standardpfad. | Das Verzeichnis mit den Sequenzierdateien dieses Erfassungsbereichs angeben. |
| `--sample` | Bei einem einzigen Dateinamenspräfix wird die Probe automatisch ausgewählt. Bei mehreren Präfixen führt das Weglassen zu einem Fehler. | Das Präfix der FASTQ-Dateien für den Erfassungsbereich angeben, hier `Tissue_A`. |
| `--image` | Es gibt kein Standardbild. Für dieses Beispiel ist der Pfad zur H&E-Hellfeldaufnahme erforderlich. | Das Mikroskopbild des Erfassungsbereichs angeben. Die Software erkennt darin das Gewebe und richtet die Sequenzierkoordinaten am Bild aus. |
| `--slide` | Keine Standardseriennummer. In diesem Beispiel erforderlich. | Die Seriennummer des verwendeten Objektträgers eintragen, beispielsweise `V10J25-015`. |
| `--area` | Kein Standardwert für den Erfassungsbereich. In diesem Beispiel gemeinsam mit `--slide` angeben. | Die Kennung des Erfassungsbereichs vom Objektträger übernehmen, etwa `A1`. Jeden Bereich separat verarbeiten. |
| `--include-introns=true` | `true` beim Visium-v1-Experiment in diesem Beispiel. | Das Beispiel behält den Standardwert bei. Geeignete intronische Reads tragen zur Molekülzählung bei. |
| `--create-bam=false` | Pflichtangabe. Entweder `true` oder `false` ausdrücklich angeben. | Mit `false` werden Expressionsmatrix und räumliche Ergebnisse ohne BAM-Datei der einzelnen Reads erzeugt. `true` wählen, wenn die Alignments später geprüft werden sollen oder der weitere Bedarf noch offen ist. |

Öffnen Sie nach dem Lauf `visium_A/outs/web_summary.html`. Dort finden Sie eine Übersicht der räumlichen Qualitätskontrolle für diesen Erfassungsbereich. Die Bilder und Positionskoordinaten liegen in `visium_A/outs/spatial/`. In der Matrix des ursprünglichen Visium steht jeder Barcode für einen Erfassungspunkt. Ein solcher Punkt kann mehrere Zellen abdecken. [Räumliche Ausgaben von Space Ranger](https://www.10xgenomics.com/support/software/space-ranger/latest/analysis/outputs/spatial-outputs)

**Drei Versionsänderungen, auf die Sie bei älteren Skripten achten sollten**

| Space-Ranger-Version | Auswirkung auf den Befehl oder die Ergebnisse |
| --- | --- |
| **Ab Version 3.0** | `count` verlangt ausdrücklich `--create-bam=true` oder `false`. Wählen Sie `false`, um Speicherplatz und Schreibzeit zu sparen, wenn Sie nur die Matrix und die räumlichen Koordinaten benötigen. |
| **Versionsreihe 4.0** | Diese Versionen unterstützen Visium HD 3′ und führen die Segmentierung von Zellkernen und Zellen anhand von Gewebebildern ein. Lassen Sie `--probe-set` bei HD 3′ weg. Geben Sie bei sondenbasiertem Visium HD den zum Experiment passenden Sondensatz an. |
| **Ab Version 4.1** | Bei **Visium v1 und Visium HD 3′** werden Introns standardmäßig mitgezählt. Verwenden Sie `--include-introns=false`, um eine Analyse zu reproduzieren, die Introns ausgeschlossen hat. Sondenbasierte Verfahren identifizieren ihre Zielsequenzen anhand von Sondenpaaren. Prüfen Sie daher den im Experiment verwendeten Sondensatz. |

Wenn Sie Erfahrung mit räumlichen Analysen haben und die Daten selbst anhand der Matrix, der Gewebebilder und der Koordinaten clustern möchten, sparen Sie mit `--nosecondary` die Rechenzeit der integrierten Sekundäranalyse. Lassen Sie die Sekundäranalyse eingeschaltet, wenn Sie die von Space Ranger erzeugten Cluster betrachten möchten. Prüfen Sie in beiden Fällen, ob die Koordinaten korrekt auf dem Gewebebild liegen. [Versionshinweise zu Space Ranger](https://www.10xgenomics.com/support/software/space-ranger/latest/release-notes/release-notes-for-SR) · [Eingabedaten für die verschiedenen Visium-HD-Verfahren](https://www.10xgenomics.com/support/software/space-ranger/latest/analysis/running-pipelines/count-visium-hd)
