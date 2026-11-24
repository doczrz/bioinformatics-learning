# 0.2 | Warum läuft mein Code trotz installiertem R oder Python nicht? Pakete, Umgebungen, Abhängigkeiten und Versionen

Du findest online ein Skript für die Einzelzellanalyse. Laut Autor setzt es Python und Scanpy voraus. Du prüfst, ob Python installiert ist, kopierst den Code und erhältst folgende Meldung:

```text
ModuleNotFoundError: No module named 'scanpy'
```

Bei einer zweiten Person ist Scanpy bereits installiert, doch derselbe Code führt zu einem Versionskonflikt. Eine dritte Person installiert Seurat in R ohne Fehlermeldung. Als sie am nächsten Tag ein anderes Projekt öffnet, lässt sich die ursprüngliche Analyse nicht mehr ausführen.

In allen drei Fällen sieht es aus, als sei die Software defekt. Die Ursache kann jedoch auf unterschiedlichen Ebenen liegen:

- Der Computer kann R oder Python nicht finden;
- Das Paket wurde in einer anderen Umgebung installiert;
- Zwei Pakete benötigen inkompatible Versionen derselben Abhängigkeit;
- Der Code verwendet ein Feature, das in einer älteren Version vorhanden war, aber in einer neueren Version geändert wurde.
- Eine vom Paket benötigte Systemkomponente fehlt; oder
- Das R oder Python, das den Code ausführt, ist nicht das, was Sie denken.

In dieser Lektion müssen Sie nicht jedes Installationswerkzeug auswendig lernen. Ihr Ziel ist es, eine klare Karte der Rechenumgebung zu erstellen. Wenn Sie ein Skript oder einen Fehler sehen, sollten Sie wissen, welche Ebene zuerst geprüft werden soll, anstatt sofort alles neu zu installieren.

![Mehrschichtige Struktur einer Rechenumgebung: Hardware, Betriebssystem, R oder Python, Projektumgebung, Pakete und Analyseskripte](figures/computational-environment-layers.de.png)

*Abbildung 1 | Die Ausführung eines Analyseskripts hängt von mehreren Ebenen ab. Das Betriebssystem bildet die Grundlage. R oder Python führt den Code aus. Projektumgebungen trennen die Software verschiedener Projekte. Pakete und ihre Abhängigkeiten stellen die Funktionen bereit, die das Skript auf die Daten anwendet. Die projekteigene Grafik entstand am 23. Juli 2026 mit dem Bildgenerator von OpenAI. Sie enthält keine Herstellerlogos, Bildschirmfotos oder Layouts Dritter. Sie veranschaulicht die Zusammenhänge. Die tatsächliche Installation kann je nach Werkzeug anders aufgebaut sein.*

## Fünf Begriffe, die oft verwechselt werden

### 1. R und Python: Programmiersprachen und ihre Interpreter

R und Python sind beide Programmiersprachen. Der Code, den Sie schreiben, muss von der entsprechenden Software gelesen und ausgeführt werden.

Das Programm, das den Code liest und ausführt, heißt hier **Interpreter**. Der R-Interpreter führt R-Code aus, der Python-Interpreter Python-Code. Mit der Installation von Python kann der Rechner Python-Code ausführen. Drittanbieterpakete wie Scanpy oder pandas sind dadurch noch nicht installiert.

Derselbe Computer kann mehrere Python-Installationen gleichzeitig enthalten, wie z.B.:

- Python direkt in Windows installiert;
- Python in WSL;
- Python in einer Conda-Umgebung; und
- Python in einer virtuellen Umgebung für ein bestimmtes Projekt.

Jede dieser Installationen kann unter `python` aufgerufen werden, aber auf eine andere ausführbare Datei und andere Pakete verweisen. Ähnliches ist bei R möglich, etwa durch Systeminstallationen, Projektbibliotheken oder Softwaremodule auf einem Server.

### 2. Pakete: Sammlungen von Funktionen, die andere geschrieben haben

Ein **Paket** bündelt wiederverwendbaren Code, Dokumentation und zugehörige Dateien.

Zum Beispiel:

- Seurat ist ein verbreitetes R-Paket zur Analyse von Einzelzelldaten.
- Scanpy ist ein verbreitetes Python-Paket zur Analyse von Einzelzelldaten.
- ggplot2 bietet Plotting-Funktionen für R; und
- pandas bietet Tabellenverarbeitungsfunktionen für Python.

Die Installation von R oder Python ist wie die Beschaffung eines einfachen Labors. Die Installation von Paketen ist wie das Einbringen von Mikroskopen, Zentrifugen und Pipetten in dieses Labor.

Die Analogie hat eine Grenze: Softwarepakete sind nicht völlig eigenständige Instrumente. Ein Paket ruft häufig andere Pakete oder Systemprogramme auf, und diese können strenge Versionsanforderungen haben.

### 3. Abhängigkeiten: Was ein Paket zum Ausführen braucht

Wenn Paket A für seine Arbeit Paket B benötigt, ist B eine **Abhängigkeit** von A.

Abhängigkeiten können über mehrere Ebenen fortgesetzt werden:

```text
Analyseskript
  → Paket A
    → Paket B
      → Zugrunde liegende Programmbibliothek
```

Installationswerkzeuge versuchen normalerweise, diese Abhängigkeiten automatisch zu finden, aber „automatisch“ bedeutet nicht, dass sie immer eine kompatible Kombination finden können.

Angenommen, Paket A verlangt eine Abhängigkeit ab Version 2.0, Paket C für dieselbe Abhängigkeit hingegen eine Version unter 2.0. Keine Version kann in einer einzelnen Umgebung beide Anforderungen erfüllen. Das Python-Werkzeug pip kann dann `ResolutionImpossible` melden. Auch R oder Bioconductor können darauf hinweisen, dass Pakete zu alt, zu neu oder für die verwendete Version nicht verfügbar sind.

### 4. Rechenumgebungen: Welche Software und Einstellungen zusammenwirken

Eine **Rechenumgebung** umfasst hier alle Bedingungen, unter denen der Code eines Projekts tatsächlich ausgeführt wird. Dazu gehören meist:

- Betriebssystem und Hardwaretyp;
- Version und Standort von R oder Python;
- installierte Pakete und deren Versionen;
- Bibliotheken auf niedrigerer Ebene, die von diesen Paketen benötigt werden; und
- Einige Pfade, Gebietsschemaeinstellungen oder andere Konfigurationen.

Verschiedene Umgebungstools verwalten nicht genau den gleichen Bereich von Komponenten.

- Das mit Python gelieferte Modul `venv` erstellt für ein Projekt eine Umgebung mit einem eigenen Verzeichnis für Python-Pakete.
- Eine Conda-Umgebung kann Python, R und bestimmte darunterliegende Abhängigkeiten verwalten, die keine Python-Pakete sind.
- Mit renv kann jedes R-Projekt eine eigene Paketbibliothek erhalten. Die Paketinformationen werden in `renv.lock` festgehalten.

Ihr gemeinsamer Zweck ist es, Interferenzen zwischen Projekten zu reduzieren.

### 5. Versionen: Wie sich dieselbe Software im Lauf der Zeit verändert

Der gleiche Softwarename bedeutet nicht, dass sein Verhalten für immer unverändert bleibt. Entwickler beheben Fehler und fügen Funktionen hinzu, können aber auch Standardparameter, Funktionsnamen, Dateiformate oder Abhängigkeitsanforderungen ändern.

Eine Versionsnummer kann etwa `1.4.2` lauten. Viele Projekte unterscheiden Hauptversion, Nebenversion und Fehlerkorrektur. Ob zwei Versionen kompatibel sind, lässt sich jedoch nicht allein aus den Ziffern ableiten. Maßgeblich sind die Dokumentation und die Versionshinweise der jeweiligen Software.

Für ein Bioinformatikprojekt reicht die Angabe „Wir verwendeten Scanpy“ oder „Wir verwendeten Seurat“ nicht aus. Mindestens festzuhalten sind Paketversion, Installationsquelle, eingesetzte R- oder Python-Version und das Betriebssystem, unter dem die Analyse lief.

## Warum lohnt sich eine eigene Umgebung für jedes Projekt?

Stellen Sie sich vor, Sie arbeiten an zwei Projekten:

- Projekt A reproduziert eine zwei Jahre alte Einzelzellstudie und benötigt ältere Paketversionen.
- Projekt B ist eine neue räumliche Transkriptomik-Analyse und benötigt neuere Paketversionen.

Wenn jedes Paket in einer gemeinsam genutzten Umgebung installiert wird, kann das Aktualisieren von Paketen für Projekt B Projekt A plötzlich unterbrechen. Umgekehrt kann die Ablehnung jedes Updates zur Erhaltung von Projekt A verhindern, dass Projekt B installiert wird.

Eine sicherere Anordnung ist:

```text
Projekt A → Umgebung A → Für Projekt A geprüfte Versionen
Projekt B → Umgebung B → Für Projekt B geprüfte Versionen
```

Getrennte Umgebungen verringern das Risiko, dass eine Änderung an einem Projekt ein anderes unbrauchbar macht. Für die fachliche Gültigkeit müssen weiterhin die biologische Fragestellung, die Probenplanung, die Parameterwahl und die Interpretation der Ergebnisse geprüft werden.

## R- und Python-Umgebungen dokumentieren

| Projekttyp | Übliche Form der Trennung | Typische Dateien oder Angaben | Was wird dokumentiert? |
| --- | --- | --- | --- |
| R-Projekt | renv | `renv.lock`, `sessionInfo()` | R, Betriebssystem sowie Quellen und Versionen der Pakete |
| Kleines Python-Projekt | `venv` | `requirements.txt` sowie die Versionen von Python und pip | Die in der aktuellen Python-Umgebung benötigten Pakete |
| Bioinformatikprojekt mit Python oder mehreren Sprachen | Conda | `environment.yml` oder eine andere Exportdatei | Python/R, Pakete, Kanäle und einige Abhängigkeiten auf tieferer Ebene |

Diese Dateien sind keine magischen Backups.

- `requirements.txt` hält üblicherweise die benötigten Python-Pakete fest. Zusätzlich im Betriebssystem installierte Programme sind nicht unbedingt aufgeführt.
- `environment.yml` hilft beim Wiederherstellen einer Conda-Umgebung. Welche Pakete und Paket-Builds verfügbar sind, hängt vom Betriebssystem ab.
- `renv.lock` hält die Pakete eines R-Projekts und ihre Versionen fest. Für die Wiederherstellung können eine geeignete R-Version, ein passendes Betriebssystem und Werkzeuge zum Kompilieren erforderlich sein.

Die Möglichkeit, eine Umgebung neu zu erstellen, ist viel zuverlässiger als der Versuch, sich an das zu erinnern, was Sie installiert haben. Das bedeutet aber noch nicht, dass jeder Rechner unbedingt eine völlig identische Umgebung erzeugen wird.

## Welche R- oder Python-Installation führt den Code aus?

Die folgenden Befehle sind keine Installationsanleitung. Sie sind Inspektionswerkzeuge zur Lokalisierung eines Problems.

### Python im Terminal überprüfen

```bash
python --version
python -m pip --version
python -c "import sys; print(sys.executable)"
```

Sie beantworten drei verschiedene Fragen:

1. Welche Python-Version startet der Befehl `python`?
2. Wo befindet sich die pip-Installation, die dieser Python-Interpreter verwendet?
3. Was ist der eigentliche Dateipfad des aktuellen Python-Interpreters?

Der zweite Befehl verwendet `python -m pip`. Dadurch läuft pip mit dem gerade geprüften Python-Interpreter. Beim alleinigen Aufruf von `pip` kann das System ein pip aus einer anderen Python-Installation finden.

Einige Linux-Systeme nennen den Befehl `python3`. Wenn die offiziellen Anweisungen für die Software oder den Server `python3` verwenden, folgen Sie der tatsächlichen Benennung in dieser Umgebung, anstatt blind jeden Befehl durch `python` zu ersetzen.

### R im Terminal und in einer R-Sitzung überprüfen

Führen Sie zuerst in einem Terminal Folgendes aus:

```bash
R --version
```

Anschließend R starten und die folgenden Zeilen in der R-Konsole ausführen:

```r
R.version.string
.libPaths()
sessionInfo()
```

Diese Befehle zeigen die R-Version, die Verzeichnisse, in denen R derzeit nach Paketen sucht, sowie Informationen zur aktuellen R-Sitzung, zum Betriebssystem und zu geladenen Paketen an.

Terminal und R-Konsole sind verschiedene Arbeitsumgebungen. `R --version` wird im Terminal ausgeführt. `R.version.string`, `.libPaths()` und `sessionInfo()` sind R-Code für die laufende R-Konsole. Schon die Eingabe in der falschen Umgebung kann eine Fehlermeldung auslösen.

### Bei Verwendung von Conda

```bash
conda env list
```

Ein Sternchen in der Ausgabe markiert normalerweise die aktive Umgebung. Wenn Sie den Umgebungsnamen vor der Installation eines Pakets bestätigen, verhindern Sie, dass Software in `base` oder in die Umgebung eines anderen Projekts eingefügt wird.

## Was verraten fünf häufige Fehlermeldungen?

| Fehler oder Symptom | Wahrscheinliche Ursache | Zuerst prüfen |
| --- | --- | --- |
| `command not found` oder „is not recognized as an internal or external command“ | Das System findet das Programm nicht | Ist das Programm installiert und kann das Terminal es über den Suchpfad finden? |
| `ModuleNotFoundError` | Das Modul fehlt in der aktiven Python-Umgebung | Pfad des aktiven Python-Interpreters prüfen und feststellen, ob das Paket in derselben Umgebung installiert wurde |
| `there is no package called ...` | Das Paket fehlt in der von R verwendeten Paketbibliothek | `.libPaths()` und die Bibliothek, in der das Paket installiert wurde |
| `ResolutionImpossible` oder ein anderer Abhängigkeitskonflikt | Die Versionsanforderungen lassen sich nicht gleichzeitig erfüllen | Welche Pakete verlangen unvereinbare Versionen derselben Abhängigkeit? |
| `cannot open shared object file` oder `DLL load failed` | Eine Systembibliothek oder eine kompilierte Komponente | Betriebssystem, Prozessortyp, Name der fehlenden Bibliothek und offizielle Systemanforderungen prüfen |

Die Tabelle sagt Ihnen nur, wo Sie zuerst suchen sollten. Eine einzelne Textzeile kann nicht immer eine einzige Ursache identifizieren. Wenn Sie Hilfe anfordern, behalten Sie den vollständigen Befehl und die Ausgabe ab dem ersten Fehler bei.

## Installations- und Laufzeitfehler Schritt für Schritt untersuchen

### Schritt 1: Die Fehlermeldung vor einer Neuinstallation sichern

Speichern Sie zuerst den ursprünglichen Fehler. Wenn Sie viele verschiedene Installationsbefehle nacheinander ausführen, kann sich die Umgebung ändern und das ursprüngliche Problem wird schwieriger zu reproduzieren.

### Schritt 2: Prüfen, wo der Befehl ausgeführt wird

Notieren Sie, ob Sie verwenden:

- Windows PowerShell;
- Ein WSL/Linux Terminal;
- Die R-Konsole;
- Python oder Jupyter; oder
- Ein Remote-Server.

Die Aussage „Ich arbeite auf einem Windows-Computer“ beweist nicht, dass der Befehl unter Windows ausgeführt wird. Sowohl WSL als auch ein Remote-Server können Linux-Umgebungen bereitstellen.

### Schritt 3: Den tatsächlich verwendeten Interpreter und die Umgebung bestimmen

Version und Pfad des R- oder Python-Interpreters sowie den Namen der Conda- oder Projektumgebung festhalten. Das hilft besonders dann, wenn ein Paket bereits installiert scheint, der Interpreter es aber nicht findet.

### Schritt 4: Die erste aussagekräftige Fehlermeldung finden

Installationsprotokolle können lang sein. Die letzte Zeile kann nur sagen, dass die Installation fehlgeschlagen ist, während die eigentliche Ursache früher aufgetaucht ist – zum Beispiel eine fehlende Systembibliothek oder ein Konflikt zwischen Abhängigkeitsversionen.

Beginnen Sie mit dem Lesen der ersten `ERROR`-, `Error`-, `cannot`-, `failed`- oder expliziten Konfliktmeldung und überprüfen Sie dann die Zeilen um sie herum.

### Schritt 5: Das Ergebnis mit den offiziellen Softwareanforderungen vergleichen

Bestätigen Sie:

- Welche Betriebssysteme und Prozessorarchitekturen unterstützt werden;
- Welche R- oder Python-Versionen unterstützt werden;
- ob ein Compiler oder eine Systembibliothek erforderlich ist;
- ob die Installation CRAN, Bioconductor, PyPI, einen Conda-Kanal oder die offizielle Softwarequelle verwenden soll; und
- Ob das Tutorial für eine andere Softwareversion geschrieben wurde.

Umgehen Sie die offiziellen Anforderungen nicht, nur weil ein alter Befehl aus einem Suchergebnis kürzer aussieht.

### Schritt 6: Eine Bedingung ändern und erneut testen

Wenn Sie sich entscheiden, eine Paketversion zu ändern, eine neue Umgebung zu erstellen oder eine Systemkomponente hinzuzufügen, ändern Sie jeweils eine Kategorie und speichern Sie den Befehl und das Ergebnis. Auf diese Weise können Sie feststellen, welche Änderung das Problem gelöst hat.

## Ein Einzelzellprojekt kann mehrere Umgebungen nutzen

„Ein Projekt, eine Umgebung“ ist eine nützliche Regel für Anfänger, aber ein echtes Projekt kann mehrere unabhängige Programme aufrufen.

Zum Beispiel:

```text
10x-Rohdaten
  → Cell Ranger unter Linux ausführen
  → Eine Expressionsmatrix erstellen
  → Seurat in einer R-Umgebung oder Scanpy in einer Python-Umgebung verwenden
  → Qualitätskontrolle und Clusteranalyse durchführen und die Ergebnisse visualisieren
```

Cell Ranger, Seurat und Scanpy müssen nicht unbedingt in derselben Umgebung installiert werden. Was zählt, ist die Aufzeichnung jedes Schrittes:

- in welcher Umgebung der Schritt ausgeführt wurde;
- welche Eingaben verwendet und welche Ausgaben erzeugt wurden;
- Welche Softwareversion verwendet wurde;
- welches Referenzgenom oder welche Annotationsversion verwendet wurde; und
- wo seine Protokolle und Umgebungsdaten gespeichert wurden.

Dasselbe gilt für Einzelzell-Multiomik und räumliche Omik. Eine Analyse kann Software der Sequenzierplattform, R- oder Python-Pakete, Bildverarbeitungsprogramme und Referenzdaten kombinieren. Dokumentiert man die Umgebung jedes Schritts, bleiben die jeweiligen Rechenbedingungen nachvollziehbar, auch wenn die Werkzeuge in getrennten Umgebungen laufen.

## Codex hilft bei der Installation. Welche Umgebung braucht das Projekt?

Bei der bloßen Angabe „Scanpy lässt sich nicht installieren“ muss Codex weitgehend raten. Hilfreicher sind folgende Angaben:

```text
Ich führe den Befehl in Ubuntu unter WSL aus.
Meine aktuelle Python-Version ist ...
Die Ausgabe von python -m pip --version lautet ...
Meine aktuelle Conda-Umgebung ist ...
Der vollständige Befehl, den ich ausgeführt habe, lautet ...
Die vollständige Ausgabe ab der ersten Fehlermeldung lautet ...
Die offizielle Installationsanleitung für dieses Projekt steht hier: ...
Prüfe zuerst, ob das Problem am Pfad, an der Umgebung, einer Version, einer
Abhängigkeit oder einer Systembibliothek liegt. Begründe deine Einschätzung
und schlage die kleinste nötige Änderung vor. Aktualisiere nicht alle Pakete.
```

Codex kann Ihnen dabei helfen, Protokolle zu lesen, Versionsanforderungen zu vergleichen und Diagnoseschritte zu organisieren. Sie müssen noch bestätigen:

- ob die Dokumentation, auf die es verweist, der aktuellen Softwareversion entspricht;
- ob der Befehl eine bereits verwendete Umgebung ändert;
- ob die Aktualisierung der Software eine bereits validierte Analyse beeinträchtigen könnte; und
- Ob der Minimaltest und wichtige Ergebnisprüfungen nach der Reparatur wiederholt wurden.

Eine KI braucht konkrete Angaben zur Umgebung, um bei der Diagnose zu helfen. Für jede Änderung sollte es eine Begründung und einen überprüfbaren Test geben. Viele Befehle auf Verdacht nacheinander auszuführen, zeigt nicht, welcher das Problem gelöst hat.

## Welche Angaben zur Umgebung gehören in jedes Projekt?

Wenn eine Analyse beginnt, notieren Sie mindestens:

1. Betriebssystem und Version;
2. Die R- oder Python-Version und der eigentliche Pfad;
3. der Name der Projektumgebung;
4. die wichtigsten Pakete und ihre Versionen;
5. die Installationsquelle oder den Installationskanal;
6. eine Umgebungsdatei wie `renv.lock`, `requirements.txt` oder `environment.yml`;
7. die verwendeten Versionen von Referenzgenom, Genannotation oder anderen Referenzdaten;
8. die Installations- und Ausführungsprotokolle.

Die erfolgreiche Codeausführung zeigt nur an, dass die aktuelle Umgebung diese Anweisungen akzeptiert hat. Nur wenn auch die Umgebung, Eingaben, Parameter, Softwareversionen und Ausgabeprüfungen erhalten bleiben, haben andere Personen eine Chance, die Analyse zu verstehen und neu aufzubauen.

## Quellen und weiterführende Literatur

1. [Offizielle Python-Dokumentation: Erstellen virtueller Umgebungen mit `venv`](https://docs.python.org/3/library/venv.html)
2. [Python Packaging Benutzerhandbuch: Abhängigkeiten und Anforderungsdateien](https://packaging.python.org/en/latest/discussions/install-requires-vs-requirements/)
3. [Offizielle pip-Dokumentation: Abhängigkeiten und Konflikte lösen](https://pip.pypa.io/en/stable/topics/dependency-resolution/)
4. [Offizielle Conda-Dokumentation: Umgebungen verwalten und gemeinsam nutzen](https://docs.conda.io/projects/conda/en/stable/user-guide/tasks/manage-environments.html)
5. [Offizielle renv-Dokumentation: Projekt-lokale Umgebungen für R](https://rstudio.github.io/renv/articles/renv.html)
6. [Offizielle Bioconductor Installationsanleitung](https://bioconductor.org/install/)
7. [Offizielle R-Dokumentation: `sessionInfo()`](https://stat.ethz.ch/R-manual/R-devel/library/utils/html/sessionInfo.html)
