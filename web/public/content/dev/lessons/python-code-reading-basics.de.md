# 0.4 | Python-Code lesen und verstehen: Grundlagen der Syntax

Angenommen, du gibst Codex eine Tabelle mit Qualitätsmerkmalen für jede Zelle und fragst, welche Zellen beibehalten werden können. Codex liefert folgenden Python-Code:

Hier ist `cell_metadata.csv` eine fiktive Tabelle mit Zellmetadaten. Jede Zeile steht für eine Zelle, deren Qualität noch geprüft werden muss. `cell_id` bezeichnet die Zelle, `sample_id` ihre biologische Herkunftsprobe. `n_genes` gibt die Zahl der in der Zelle nachgewiesenen Gene an. `percent_mito` ist der prozentuale Anteil der Gesamtzählungen, der auf mitochondriale Gene entfällt. Der Wert `10` bedeutet also 10 % und nicht 0,10. Feldnamen und Schwellenwerte gelten für dieses Beispiel. Prüfe sie bei realen Daten anhand der Objektdokumentation, des Versuchsprotokolls und der verwendeten Einheiten.

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

Dieser Code dient in der gesamten Lektion als Beispiel. Wir gehen der Reihe nach die folgenden Punkte durch:

- Die Daten stammen aus `cell_metadata.csv`.
- `cells`, `missing_columns`, `keep` und `filtered_cells` beziehen sich auf Objekte in verschiedenen Stadien.
- Die Einrückung bestimmt, ob `raise` zum `if`-Block gehört.
- Die Filterbedingungen bestimmen gemeinsam, welche Zeilen beibehalten werden und wie fehlende Werte behandelt werden.
- Die äußeren Klammern lassen eine lange Bedingung mehrere Zeilen überspannen, während die Klammern um die Vergleichsausdrücke sicherstellen, dass `&` die zeilenweise Ergebnisse wie beabsichtigt kombiniert.
- `.loc`, `.copy()` und `.mean()` führen jeweils Auswahl, Kopieren und Berechnung durch.
- `500` und `10` sind Schwellenwerte, die ein Forscher noch anhand der aktuellen Daten beurteilen muss.

Nur wenn Sie diese Hinweise in einfacher Sprache erklären können, können Sie beurteilen, ob der Code die richtige Datei liest, die richtigen Spalten verwendet oder möglicherweise ein vernünftiges biologisches Signal entfernt, als wären es Daten von geringer Qualität.

Das Ziel dieser Lektion ist es nicht, Sie Python-Syntax auswendig lernen zu lassen oder ein Programm ohne Dokumentation aus dem Speicher zu reproduzieren. Sie müssen die Fähigkeit entwickeln, Code zu lesen: Wenn Sie Python-Code sehen, sollten Sie in der Lage sein, zu identifizieren, wo Daten eingehen, wie sie sich ändern, wohin die Ausgabe geht und welche rechnerischen Entscheidungen in der Verantwortung des Forschers bleiben.

Diese Lektion geht davon aus, dass Sie bereits wissen, dass Python eine Programmiersprache ist, die häufig für Datenverarbeitung, Automatisierung und bioinformatische Analysen verwendet wird, und dass Pakete und Projektumgebungen beeinflussen, ob Code ausgeführt werden kann. Sie müssen keine Software im Voraus installieren und es sind keine Programmierkenntnisse erforderlich.

Die Codeblöcke in dieser Lektion sind hauptsächlich zum Lesen gedacht; Sie müssen sie jetzt nicht ausführen. Wenn Sie mitmachen möchten, bestätigen Sie zuerst, wo der Code ausgeführt werden soll: ein interaktiver Python-Interpreter, ein Skript mit der `.py`-Erweiterung oder ein Jupyter-Notizbuch. Ein Dateiname ohne vollständigen Pfad, wie `"cell_metadata.csv"`, wird relativ zum aktuellen Arbeitsverzeichnis nachgeschlagen. In Python können Sie `Path.cwd()` verwenden, um diesen Ort zu sehen.

Bei der ersten Lektüre können Sie das Material in zwei Ebenen unterteilen:

- **Das solltest du verstehen:** Einrückung, Namen und Zuweisung, gängige Datentypen, Listen und Dictionaries, Indizierung und Slicing, Funktionen und Methoden, Vergleiche und logische Bedingungen, fehlende Werte, Importe und das Filtern von Tabellen.
- **Vorerst reicht es, Folgendes zu erkennen:** List Comprehensions, Generatoren, Kontextmanager, Dekoratoren, Klassen, Typannotationen, NumPy-Arrays, dünn besetzte Matrizen und AnnData. Bei diesen Konstrukten kannst du die KI um eine Erklärung bitten oder die offizielle Dokumentation heranziehen.

Wenn dies Ihre erste Lektüre ist, folgen Sie vier kurzen Pfaden durch die Lektion. Verstehen Sie zunächst die Ausführungsstellen, die Teile einer Codezeile und die Einrückung. Als nächstes verstehen Sie Namen, Objekte, grundlegende Typen, Listen, Wörterbücher und Sets. Dann wechseln Sie zu Funktionen, Methoden, Importen, gewöhnlicher Logik und Reihen-für-Reihen-pandas-Logik. Lesen Sie schließlich die Abschnitte zu fehlenden Werten und DataFrame-Filterung, gefolgt vom vollständigen Beispiel am Ende. Bei einem ersten Durchlauf müssen Sie nur Tuples, `while`, List Comprehensions und die detaillierte Liste der riskanten Operationen erkennen; Sie müssen sie nicht auswendig lernen oder schreiben.

Mit Ausnahme des Abschnitts, der das Eröffnungsbeispiel vollständig liest, lesen die kürzeren Codeblöcke in dieser Lektion hauptsächlich Fragmente, die von den zuvor eingeführten Objekten abhängen. Gehen Sie nicht davon aus, dass jedes Fragment ein vollständiges Skript ist, das von selbst ausgeführt werden kann.

## Auch beim „Vibe Coding“ muss man Python lesen können

"Vibe Coding" ist ein informeller Begriff. In der Regel bedeutet dies, eine Aufgabe in natürlicher Sprache zu beschreiben und KI den Code generieren, modifizieren und ausführen zu lassen, ohne dass der Benutzer jede Anweisung Zeichen für Zeichen eingeben muss.

Diese Arbeitsweise reduziert die Belastung durch das Auswendiglernen der Syntax. Sie können Codex bitten:

- Python Code für eine Aufgabe generieren;
- Erklären Sie einen Traceback, der der Aufrufpfad ist, der angezeigt wird, wenn ein Fehler auftritt.
- Wiederholte Schritte in einem Skript organisieren;
- Finden Sie heraus, wo ein Name zugewiesen oder geändert wurde;
- Funktionsargumente mit der offiziellen Dokumentation vergleichen;
- Code ausführen und wichtige Zwischenergebnisse anzeigen.

Daher ist die Fähigkeit, alles von Grund auf neu zu schreiben, nicht mehr der einzige Maßstab für analytische Fähigkeiten.

Anfragen in natürlicher Sprache werden jedoch weiterhin in exakte Operationen umgewandelt. Ein Computer versteht nicht automatisch das Experimentaldesign hinter "entfernen Sie Zellen mit geringer Qualität". Es führt nur eine Bedingung wie "Zeilen beibehalten, wo `n_genes >= 500` und `percent_mito < 10`" aus. Wenn KI einen Spaltennamen, eine Prozenteinheit, einen fehlenden Wert oder eine Vergleichsrichtung falsch versteht, kann der Code trotzdem erfolgreich ausgeführt werden.

Aus diesem Grund werden Anfänger in diesem Kurs gebeten, folgenden Standard zu erfüllen:

> Sie müssen Python nicht aus dem Gedächtnis schreiben, aber Sie müssen in der Lage sein, wichtigen Code in gewöhnliche Sprache zu übersetzen und zu überprüfen, ob diese Übersetzung der Forschungsfrage entspricht.

Dies bedeutet nicht, dass Sie jeden internen Mechanismus in Python verstehen müssen. Sie können beginnen, indem Sie die häufigsten Strukturen im Analysecode lernen und bei Bedarf die Dokumentation konsultieren.

## Wo läuft der Python-Code?

Der gleiche Python-Code kann an verschiedenen Stellen erscheinen. Der Ausführungsort beeinflusst die Art der Eingabe, das Arbeitsverzeichnis, welche Objekte bereits vorhanden sind und wie die Ergebnisse angezeigt werden.

### Der interaktive Interpreter

Die Eingabe von `python` oder `python3` auf einigen Systemen in einem Terminal kann den interaktiven Python-Interpreter starten. Eine häufige Eingabeaufforderung ist:

```text
>>>
```

In einem Tutorial bedeutet `>>>` "die Eingabe beginnt hier"; es ist nicht Teil des Codes. Kopieren Sie die Eingabeaufforderung nicht, wenn Sie ein Beispiel kopieren.

Im interaktiven Interpreter zeigt die direkte Eingabe eines Ausdrucks normalerweise das Ergebnis an:

```python
2 + 3
```

```text
5
```

Wenn die gleiche Zeile in einem `.py`-Skript erscheint, zeigt das Skript jedoch nicht zuverlässig ein Ergebnis an, nur weil es einen Ausdruck enthält. Wenn die Ausgabe sichtbar sein muss, verwenden Sie `print()`, Protokollierung oder schreiben Sie das Ergebnis explizit in eine Datei.

### Das Python-Skript

Eine Textdatei mit der Erweiterung `.py` wird allgemein als Python-Skript bezeichnet. Zum Beispiel:

```text
filter_cells.py
```

Ein Skript eignet sich zum Speichern einer Abfolge von Schritten, die wiederholt ausgeführt werden können. Der Terminalbefehl könnte sein:

```text
python filter_cells.py
```

Dies ist ein Terminalbefehl und sollte nicht in einem Python-Codeblock platziert werden. Ob das Skript ausgeführt werden kann, hängt auch davon ab, welches Python das Terminal tatsächlich aufruft, ob die erforderlichen Pakete in der aktuellen Umgebung installiert sind und ob das aktuelle Arbeitsverzeichnis korrekt ist.

### Das Jupyter-Notebook

Ein Jupyter Notebook teilt Code in mehrere Zellen auf. Es ist nützlich für die Schritt-für-Schritt-Exploration, aber Zellen werden nicht unbedingt in der Reihenfolge ausgeführt, in der sie von oben nach unten erscheinen.

Wenn ein Name nur im Speicher des aktuellen Kernels existiert, verschwindet er beim Neustart des Kernels. Wenn Sie eine untere Zelle ausführen und dann zurückkehren, um eine obere Zelle zu ändern, kann die Codereihenfolge auf der Seite auch von der tatsächlichen Ausführungsreihenfolge abweichen.

Wenn Sie ein Notizbuch überprüfen, prüfen Sie daher:

- ob es von einem neuen Kernel aus ordnungsgemäß ausgeführt werden kann;
- Welche Zelle erstellt zuerst jeden Namen;
- ob nachgeschaltete Ergebnisse neu berechnet werden, wenn sich eine vorgeschaltete Zelle ändert;
- Ob wichtige Ergebnisse nur im Speicher existieren.

### Version und Arbeitsverzeichnis prüfen

Das Folgende ist ein Terminalbefehl:

```text
python --version
```

Das Folgende ist Python-Code:

```python
import sys
from pathlib import Path

print(sys.version)
print(Path.cwd())
```

Gehen Sie nicht davon aus, dass ein Codefenster die Version und Umgebung verwendet, die Sie erwarten, nur weil der Titel "Python" lautet. Die Version, der Interpreterpfad, die Projektumgebung und das Arbeitsverzeichnis können alle das Ergebnis beeinflussen.

## Die Bestandteile einer Zeile Python-Code

Betrachten Sie diese Zeile:

```python
average_genes = filtered_cells["n_genes"].mean()
```

Sie können es von rechts nach links lesen:

1. `filtered_cells["n_genes"]`: nehmen Sie die Spalte mit dem Namen `n_genes` aus der Tabelle;
2. `.mean()`: Rufen Sie die Methode auf, die von dieser Spalte bereitgestellt wird, um den Mittelwert zu berechnen.
3. `=`: verbindet das Ergebnis auf der rechten Seite mit dem Namen auf der linken Seite;
4. `average_genes`: Verwenden Sie diesen Namen, um später auf das berechnete Ergebnis zu verweisen.

In einfacher Sprache:

> Die Spalte `n_genes` aus der Tabelle der ausgewählten Zellen nehmen, ihren Mittelwert berechnen und diesem Ergebnis den Namen `average_genes` geben.

Sie können Funktionsnamen und Methodenparameter in der Dokumentation nachschlagen, müssen aber dennoch die Eingabe, Aktion und das Ergebnis erklären können.

## Einrückung: wie Python Codeblöcke erkennt

Viele Sprachen verwenden Klammern, um eine Gruppe von Code zu markieren. Python verwendet hauptsächlich Einrückungen.

```python
if cell_count == 0:
    print("No cells are available for analysis")

print("Check complete")
```

Dieser Code bedeutet:

- Wenn `cell_count == 0` `True` ist, führen Sie den eingerückten `print()` aus;
- Die letzte Zeile läuft unabhängig davon, ob die Bedingung erfüllt ist oder nicht, weil sie auf die äußerste Ebene zurückgekehrt ist.

Der Doppelpunkt `:` am Ende der `if`-Zeile leitet einen Codeblock ein. Anweisungen auf derselben Ebene müssen gleich weit eingerückt sein. Üblich sind vier Leerzeichen pro Ebene.

Die folgenden beiden Codestücke können beide gültige Python-Codes sein, aber sie bedeuten unterschiedliche Dinge.

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

Die erste stoppt nur, wenn die Zellzahl 0 beträgt. Die zweite stoppt unabhängig von der Zellzahl. Wenn KI den Einzug ändert, kann dies die Programmlogik verändern, auch wenn es keinen Syntaxfehler erzeugt.

Mischen Sie Tabulatoren und Leerzeichen nicht, um Einzüge in derselben Datei auszudrücken. Einige Mischungen lösen einen `TabError` aus; gefährlicher ist, dass Code in einem Editor ausgerichtet erscheinen kann, während seine tatsächlichen Ebenen nicht Ihrer Absicht entsprechen.

## Namen, Objekte und Zuweisung

Zahlen, Text, Listen, Funktionen und Tabellen können in Python alle als Objekte behandelt werden. Ein Name lässt Code wieder auf ein Objekt verweisen.

```python
gene_name = "MS4A1"
cell_count = 1200
```

Hier:

- `"MS4A1"` ist ein String-Objekt;
- `1200` ist ein Integer-Objekt;
- `gene_name` und `cell_count` sind Namen;
- `=` führt die Zuordnung durch, wobei der Name auf der linken Seite auf das Objekt auf der rechten Seite verweist.

Python verlangt nicht, dass Sie erklären, dass "dieser Name ab jetzt nur noch eine ganze Zahl enthalten kann". Der gleiche Name kann neu zugewiesen werden:

```python
cell_count = 1200
cell_count = "1200"
```

Nach der zweiten Zeile bezeichnet `cell_count` die Zeichenkette `"1200"` anstelle der Zahl `1200`. Python erlaubt diese Zuweisung. Eine spätere Rechenoperation kann dadurch ein anderes Ergebnis liefern oder mit einem Fehler abbrechen.

### `=` weist zu, `==` vergleicht

```python
cell_count = 1200
cell_count == 1200
```

Die erste Zeile gibt einem Namen einen Wert. Der zweite fragt, ob die beiden Werte gleich sind und erzeugt `True` oder `False`.

Wenn Sie einen Zustand überprüfen, prüfen Sie besonders sorgfältig, ob AI `=` mit `==` verwechselt hat.

### Neuzuweisen und Kopieren unterscheiden

```python
genes = ["MS4A1", "CD3D"]
selected_genes = genes
selected_genes.append("NKG7")
```

Hier verweisen `genes` und `selected_genes` auf dieselbe Liste. Wird die Liste über einen Namen verändert, ist die Änderung auch über den anderen sichtbar.

```python
print(genes)
```

```text
['MS4A1', 'CD3D', 'NKG7']
```

Wenn Sie eine separate äußere Liste benötigen, machen Sie die Kopie explizit:

```python
selected_genes = genes.copy()
```

Die Elemente dieses Beispiels sind unveränderliche Zeichenketten. Ein weiterer Eintrag in `selected_genes` verändert `genes` daher nicht. `list.copy()` kopiert nur die äußere Liste. Enthält sie veränderbare Objekte, können beide Listen weiterhin auf dieselben inneren Objekte verweisen.

"Assignment gibt einem Objekt einfach einen anderen Namen" ist ein nützliches Einführungsmodell, aber es ist kein vollständiges Modell der Python-Speicherverwaltung. In diesem Stadium müssen Sie nur daran denken, dass, wenn ein Objekt veränderbar ist, `a = b` nicht automatisch als "eine separate Kopie erstellen, die das Original nicht beeinflussen kann" interpretiert werden darf.

## Kommentare, Zeichenketten und formatierter Text

### Text nach `#` ist in der Regel ein Kommentar

```python
# Metadaten der Zellen einlesen
cells = pd.read_csv("cell_metadata.csv")
```

Ein Kommentar wird nicht als Teil der Berechnung ausgeführt, aber Kommentare können veraltet werden. Wenn der Code und ein Kommentar nicht übereinstimmen, beurteilen Sie anhand des tatsächlich ausgeführten Codes, der Objektstruktur und des Ergebnisses, anstatt nur dem Kommentar zu vertrauen.

Wenn `#` in Anführungszeichen erscheint, ist es einfach Teil einer Zeichenkette:

```python
color = "#2855c5"
```

### Anführungszeichen begrenzen Zeichenketten

```python
gene_name = "MS4A1"
sample_name = 'sample_A'
```

Sowohl einfache als auch doppelte Anführungszeichen können gewöhnliche Zeichenketten darstellen. Wenn Sie Anführungszeichen um Ziffern setzen, werden sie in Text umgewandelt:

```python
threshold_number = 500
threshold_text = "500"
```

`threshold_number` lässt sich unmittelbar für einen Zahlenvergleich verwenden. `threshold_text` ist eine Zeichenkette. Prüfen Sie auch nach dem Einlesen einer CSV-Datei, ob jede Spalte den erwarteten Datentyp hat.

### Mit einem f-String Werte in Text einsetzen

```python
cell_count = 1200
message = f"Retained {cell_count} cells"
print(message)
```

Das `f`-Präfix bedeutet, dass `{cell_count}` im String durch seinen aktuellen Wert ersetzt wird.

```text
Retained 1200 cells
```

Ein f-String ist nützlich für Logs und Fehlermeldungen. Der Inhalt innerhalb der Klammern wird immer noch ausgeführt, behandeln Sie ihn also nicht als statischen Text.

## Grundtypen: Zahlen, Text, Wahrheitswerte und das Fehlen eines Werts

| Typ | Beispiel | Was stellt der Wert dar? |
| --- | --- | --- |
| `int` | `1200` | Eine ganze Zahl |
| `float` | `7.5` | Eine Zahl mit Nachkommastellen |
| `str` | `"MS4A1"` | Eine Zeichenkette, also Text |
| `bool` | `True`, `False` | Die Wahrheitswerte wahr und falsch |
| `NoneType` | `None` | Der besondere Python-Wert für das Fehlen eines Objekts |

Sie können `type()` verwenden, um den Typ eines Objekts zu überprüfen:

```python
print(type(1200))
print(type("1200"))
```

```text
<class 'int'>
<class 'str'>
```

NumPy und pandas bieten weitere Typen wie `int64`, `float64`, `category` und Zeichenkettentypen mit Unterstützung für fehlende Werte. Sie können sich von Pythons eingebauten Typen unterscheiden. Klären Sie zunächst, ob der Wert numerisch, textuell, logisch oder fehlend ist und ob die geplante Berechnung dazu passt.

### Typumwandlung und Datenprüfung unterscheiden

```python
cell_count = int("1200")
```

Dadurch wird der Text `"1200"` in eine Ganzzahl umgewandelt. Allerdings:

```python
cell_count = int("twelve hundred")
```

Erhebt einen `ValueError`.

Auch eine erfolgreiche Umwandlung beweist nicht, dass der ursprüngliche Wert biologisch vernünftig ist. Die Umwandlung von `"999999"` in eine Ganzzahl beweist nicht automatisch, dass die Stichprobe wirklich so viele Zellen enthält.

## Container: mehrere Werte zusammenfassen

### Liste (`list`)

Eine Liste verwendet eckige Klammern, behält die Reihenfolge der Elemente bei und kann geändert werden.

```python
marker_genes = ["MS4A1", "CD3D", "NKG7"]
```

Häufige Operationen umfassen:

```python
marker_genes.append("LYZ")
gene_count = len(marker_genes)
```

`.append()` modifiziert die ursprüngliche Liste; `len()` gibt die Anzahl der Elemente zurück.

### Tupel (`tuple`)

Ein Tupel verwendet gewöhnlich Klammern und lässt Sie seine Elemente nicht auf die gleiche Weise wie eine Liste ersetzen, nachdem es erstellt wurde.

```python
matrix_shape = (1200, 20000)
```

Das kann bedeuten, dass eine Matrix 1.200 Zeilen und 20.000 Spalten hat. Ob sie als „Zellen × Gene“ oder „Gene × Zellen“ aufgebaut ist, ergibt sich aus der Objektdokumentation und dem Code. An den beiden Zahlen allein ist das nicht zu erkennen.

### Dictionary (`dict`)

Ein Wörterbuch verknüpft einen Schlüssel mit einem Wert.

```python
sample_to_group = {
    "sample_A": "control",
    "sample_B": "treated",
}
```

Einen Wert nach Schlüssel abrufen:

```python
group = sample_to_group["sample_A"]
```

Wenn der Schlüssel nicht existiert, erzeugt die Suche in eckigen Klammern einen `KeyError`. Einige Code verwendet `.get()`:

```python
group = sample_to_group.get("sample_C")
```

Fehlt der Schlüssel, gibt `.get()` standardmäßig `None` zurück. Das Programm kann so zunächst ohne Fehlermeldung mit einer fehlenden Angabe weiterarbeiten. Prüfen Sie deshalb, wie es den Rückgabewert `None` im nächsten Schritt behandelt.

### Menge (`set`)

Eine Menge speichert einzigartige Elemente und wird üblicherweise mit Klammern geschrieben.

```python
required_columns = {"cell_id", "sample_id", "n_genes", "percent_mito"}
observed_columns = {"cell_id", "n_genes", "sample_id"}
missing_columns = required_columns - observed_columns
```

Hier bedeutet das Minuszeichen eine Differenz. `missing_columns` enthält Spalten, die erforderlich sind, aber nicht beachtet werden:

```text
{'percent_mito'}
```

Eine Menge ist nicht geeignet, um eine Zeilenreihenfolge auszudrücken, die beibehalten werden muss. Wenn sich die Ausgabereihenfolge auf ein Ergebnis oder einen Datensatz auswirkt, sortieren Sie es explizit.

## Indizierung und Slicing: Python zählt in der Regel ab 0

### Ein Element anhand seiner Position auswählen

```python
genes = ["MS4A1", "CD3D", "NKG7"]
first_gene = genes[0]
last_gene = genes[-1]
```

Die Ergebnisse sind:

```text
MS4A1
NKG7
```

`[0]` wählt das erste Element. `[-1]` zählt vom Ende und wählt das letzte. Eine Position außerhalb des gültigen Bereichs führt zu einem `IndexError`.

### Ein Slice schließt normalerweise die Startposition ein und die Endposition aus

```python
genes[0:2]
```

Das Ergebnis enthält die ersten beiden Elemente:

```text
['MS4A1', 'CD3D']
```

Sie können `0:2` als das positionale Intervall `[0, 2)` interpretieren: es beinhaltet 0, schließt aber 2 aus.

```python
genes[:2]
genes[1:]
```

Das Weglassen des Starts bedeutet, dass man am Anfang beginnt, und das Weglassen des Stopps bedeutet, bis zum Ende weiterzumachen.

### In pandas zwischen Auswahl nach Label und nach Position unterscheiden

Für eine pandas-Tabelle gilt:

- `.loc[...]` wählt in erster Linie nach Zeilenbeschriftungen, Spaltenbeschriftungen oder logischen Bedingungen aus;
- `.iloc[...]` wählt nach Ganzzahlposition aus.

```python
cells.loc[keep, ["cell_id", "n_genes"]]
cells.iloc[:5, :2]
```

Die erste Zeile wählt Zeilen mithilfe einer logischen Bedingung aus und wählt zwei Spalten nach Namen aus. Die zweite Zeile wählt die ersten fünf Zeilen und die ersten beiden Spalten nach Position aus.

Interpretieren Sie `.loc[0:2]` nicht automatisch als ein gewöhnliches Python-Slice. Label-Slices können Regeln folgen, die sich von "Ausschluss des Stopps" unterscheiden. Überprüfen Sie zunächst die Indexbeschriftungen und die Objektdokumentation.

## Funktionen: Eingaben verarbeiten und Ergebnisse zurückgeben

```python
rounded_value = round(7.456, ndigits=2)
```

Diese Zeile enthält:

- Funktion: `round`;
- Erster Eingang, der an die Funktion übergeben wird: `7.456`;
- Parametername: `ndigits`;
- Wert für diesen Parameter: `2`;
- Rückgabeergebnis: `7.46`;
- Name, der das Ergebnis speichert: `rounded_value`.

Ein Parameter ist ein Eingabename in einer Funktionsdefinition. Der Wert, der beim Aufruf einer Funktion tatsächlich übergeben wird, wird oft als Argument bezeichnet. Auf der Einführungsebene ist es wichtiger zu identifizieren, "welche Eingabe welches Verhalten steuert", als die Terminologie auswendig zu lernen.

### Positions- und Schlüsselwortargumente

```python
rounded_value = round(7.456, 2)
rounded_value = round(7.456, ndigits=2)
```

Beide Linien können das gleiche Ergebnis liefern. Die zweite schreibt den Parameternamen explizit und ist oft einfacher zu lesen.

Allerdings kann nicht jeder Parameter frei in Schlüsselwortform geändert werden. Bevor Sie eine Drittanbieterfunktion aufrufen, überprüfen Sie die Funktionssignatur und die offizielle Dokumentation für die aktuelle Version.

### Einen Rückgabewert speichern oder ausdrücklich ausgeben

```python
average_genes = filtered_cells["n_genes"].mean()
print(average_genes)
```

In der ersten Zeile wird das berechnete Ergebnis gespeichert, in der zweiten wird es angezeigt.

Wenn Sie nur schreiben:

```python
filtered_cells["n_genes"].mean()
```

Das Ergebnis wird normalerweise in einem interaktiven Interpreter oder am Ende einer Notizbuchzelle angezeigt. Ein Skript sollte sich nicht auf diese automatische Anzeige verlassen. Eine zuverlässige Analyse sollte wichtige Ergebnisse explizit speichern, drucken, protokollieren oder schreiben.

In pandas verwendet `Series.mean()` standardmäßig `skipna=True` und überspringt damit fehlende Werte. In diesem Beispiel verlangt bereits der Filter einen vorhandenen Wert für `n_genes`. Bleibt keine Zeile übrig, erscheint als Mittelwert `NaN`. Prüfen Sie vor der Interpretation, dass `filtered_cells.empty` den Wert `False` hat, und halten Sie die Zahl der verbliebenen Zeilen fest. Das Ergebnis ist ein numerischer Skalar. Ob sein Typ von Python, NumPy oder pandas stammt, hängt vom Spaltentyp und von der Softwareversion ab.

### Bei eigenen Funktionen zuerst Eingaben, Rückgabewert und Seiteneffekte prüfen

```python
def keep_high_gene_cells(table, minimum_genes):
    keep = table["n_genes"].notna() & (table["n_genes"] >= minimum_genes)
    return table.loc[keep].copy()
```

Beim Lesen der Funktion finden Sie zuerst:

1. Der Funktionsname nach `def`;
2. die Eingabeparameter in Klammern;
3. Was der eingerückte Code tut;
4. Was `return` zurückgibt;
5. Ob die Funktion auch ein externes Objekt, eine Datei oder eine Umgebung modifiziert.

Eine Funktion ohne `return` kann immer noch Effekte haben, indem sie eine Datei schreibt, ein Objekt modifiziert, das an sie übergeben wurde, oder den globalen Zustand ändert. Prüfen Sie nicht nur den Rückgabewert.

## Methoden und Attribute: Was bedeutet der Punkt hinter einem Objekt?

```python
cells.columns
cells["n_genes"].notna()
```

Beide Linien verwenden einen Punkt, aber sie bedeuten unterschiedliche Dinge.

- `.columns` ist ein Attribut, das Informationen enthält, die vom Objekt getragen werden; hier enthält es die Spaltenbeschriftungen.
- `.notna()` ist eine Methode, eine Operation, die vom Objekt bereitgestellt und hier aufgerufen wird.

Der sichtbarste Unterschied ist, dass Methodenaufrufe normalerweise Klammern haben, während Attributzugriffe dies normalerweise nicht tun.

Allerdings kann man aus Klammern allein keine wissenschaftliche Bedeutung ableiten. Verwenden Sie den Objekttyp und die Dokumentation, um genau zu überprüfen, was ein Attribut oder eine Methode zurückgibt.

### Gleichnamige Methoden können je nach Objekttyp unterschiedlich arbeiten

```python
genes.copy()
cells.copy()
```

Ist `genes` eine Python-Liste, wird in der ersten Zeile eine Listenmethode aufgerufen. Ist `cells` ein pandas-DataFrame, ruft die zweite Zeile eine pandas-Methode auf. Beide heißen `.copy()`, unterscheiden sich aber in Kopiertiefe und Funktionsweise.

Beim Lesen von `object.method()` muss daher zuerst der Typ des Objekts links vom Punkt bestimmt werden.

`DataFrame.copy()` kopiert nicht jedes Element rekursiv. Das gilt etwa für Python-Objekte in einer Spalte vom Typ `object`. Bei einer flachen Kopie mit `deep=False` hängt das Verhalten von der pandas-Version und dem Copy-on-Write-Verfahren ab. Prüfen Sie bei `.copy()` den Typ des Objekts links vom Punkt und die Dokumentation der eingesetzten Version.

## Module, Pakete und `import`

Python organisiert wiederverwendbaren Code in Module und Pakete.

```python
from pathlib import Path
import pandas as pd
```

Die erste Zeile bedeutet: `Path` aus dem Standardbibliotheksmodul `pathlib` importieren.

Der zweite Weg bedeutet: Importieren Sie das Drittanbieterpaket `pandas` und verwenden Sie den Kurznamen `pd` im aktuellen Code.

Daher:

```python
pd.read_csv("cell_metadata.csv")
```

bedeutet, die `read_csv()`-Funktion aufzurufen, die von pandas bereitgestellt wird.

### Übliche Schreibweisen für Importe

```python
import pandas
import pandas as pd
from pathlib import Path
```

Sie erzeugen nicht genau die gleichen Namen:

- Nach `import pandas` schreibt man normalerweise `pandas.read_csv(...)`;
- Nach `import pandas as pd` schreibt man normalerweise `pd.read_csv(...)`;
- Nach `from pathlib import Path` können Sie `Path(...)` direkt schreiben.

### Ein Paket installieren und importieren

`python -m pip install pandas` ist ein Terminalbefehl, der die Softwareumgebung verändert. Für diese Lektion brauchen Sie ihn nicht auszuführen. Prüfen Sie vor einer Installation, ob `python` der Interpreter der vorgesehenen Projektumgebung ist. Der Python-Ausdruck `import pandas` lädt ein bereits installiertes Paket in den laufenden Prozess.

Wenn Installation und Ausführung unterschiedliche Python-Umgebungen verwenden, kann nach einer erfolgreichen Installation immer noch Folgendes angezeigt werden:

```text
ModuleNotFoundError: No module named 'pandas'
```

Bestätigen Sie in diesem Fall zuerst den Interpreterpfad und die Projektumgebung, anstatt eine Reihe verschiedener Installationsbefehle auszuprobieren.

## Vergleiche und logische Bedingungen

### Häufige Vergleichsoperatoren

| Schreibweise | Bedeutung |
| --- | --- |
| `x == y` | Sind die Werte gleich? |
| `x != y` | Sind die Werte verschieden? |
| `x < y` | Ist `x` kleiner als `y`? |
| `x <= y` | Ist `x` kleiner oder gleich `y`? |
| `x > y` | Ist `x` größer als `y`? |
| `x >= y` | Ist `x` größer oder gleich `y`? |

Ein Vergleich ergibt normalerweise `True` oder `False`.

```python
n_genes = 800
n_genes >= 500
```

Das Ergebnis ist:

```text
True
```

### Logische Bedingungen mit `and`, `or` und `not` verknüpfen

```python
n_genes = 800
percent_mito = 6.5

keep = n_genes >= 500 and percent_mito < 10
```

Dies ist für zwei einzelne Wahrheitswerte angemessen.

```python
has_cells = True
has_required_columns = False

ready = has_cells and has_required_columns
```

`ready` ist `False`.

### Mit `in` die Zugehörigkeit prüfen

```python
gene_name = "MS4A1"
marker_genes = ["MS4A1", "CD3D", "NKG7"]

is_marker = gene_name in marker_genes
```

Für ein Wörterbuch überprüft `in` standardmäßig Schlüssel, nicht Werte:

```python
"sample_A" in sample_to_group
```

### Mit `is None` prüfen, ob ein Objekt tatsächlich `None` ist

```python
sample_name = None

if sample_name is None:
    print("Sample name is missing")
```

`is` prüft, ob zwei Namen auf dasselbe Objekt verweisen. Für Wertevergleiche zwischen Zahlen oder Zeichenketten verwenden Sie `==`. Dass ein Testlauf zufällig das gleiche Ergebnis liefert, ist kein Grund für den Wechsel zu `is`.

Ein DataFrame ist eine zweidimensionale Tabelle mit Zeilen, Spalten und Beschriftungen. Eine Series ist eindimensional und besitzt einen Index. Wer eine einzelne DataFrame-Spalte auswählt, erhält üblicherweise eine Series. Bei einer einfachen Variablen liefert `n_genes >= 500` meist einen einzelnen `bool`. Der Ausdruck `cells["n_genes"] >= 500` liefert hingegen eine logische Series mit einem Ergebnis pro Tabellenzeile.

## Warum stehen in pandas-Filtern `&` und nicht `and`?

Wenn Sie eine ganze Spalte vergleichen:

```python
cells["n_genes"] >= 500
```

Das Ergebnis ist nicht ein `True` oder `False`. Es ist eine Spalte mit logischen Werten, die den Zeilen entsprechen.

```text
0     True
1    False
2     True
dtype: bool
```

Um zwei Spaltenbedingungen zeilenweise zu kombinieren, verwendet pandas üblicherweise:

- `&`: Element-weise "und"
- `|`: Element-weise "oder"
- `~`: Element-weise "nicht"

```python
keep = (
    (cells["n_genes"] >= 500)
    & (cells["percent_mito"] < 10)
)
```

Setzen Sie jede Vergleichsbedingung in Klammern. Dies dient nicht nur der Erscheinung, sondern verhindert auch, dass die Operatorpräzedenz den Ausdruck auf eine andere Weise interpretiert.

Kopieren Sie das folgende Formular nicht direkt in einen pandas-Spaltenfilter:

```python
keep = cells["n_genes"] >= 500 and cells["percent_mito"] < 10
```

`and` versucht, die gesamte logische Spalte auf einen Wahrheitswert zu reduzieren und wird normalerweise einen Fehler auslösen, der angibt, dass der Wahrheitswert einer Serie mehrdeutig ist.

Welcher Operator passt, hängt von den Operanden ab. In pandas kann `&` zwei Spalten mit Wahrheitswerten elementweise verknüpfen. Für zwei einzelne Wahrheitswerte verwendet man üblicherweise `and`. Prüfen Sie deshalb zuerst, was jede der beiden Bedingungen liefert.

## Fehlende Werte: `None`, `NaN` und `pd.NA` unterscheiden

Reale Daten können fehlende Werte auf verschiedene Weise darstellen:

- `None`: der spezielle Python-Wert, der "kein Objekt" bedeutet;
- `NaN`: eine gemeinsame Darstellung fehlender Werte in numerischen Daten;
- `pd.NA`: der fehlende Wert-Marker, der von einigen nullbaren pandas-Datentypen verwendet wird;
- `NaT`: eine häufige Darstellung fehlender Werte in Datums- und Uhrzeitdaten.

Verwenden Sie keine gewöhnlichen Gleichheitsvergleiche als universellen Test für all diese fehlenden Werte.

```python
value = None
value is None
```

Für pandas Objekte, häufige Formen sind:

```python
cells["n_genes"].isna()
cells["n_genes"].notna()
```

Achten Sie besonders auf Folgendes:

- ein leerer String `""` wird nicht automatisch bei jeder Fehlerwertprüfung als fehlend behandelt;
- Ob der String `"NA"` als fehlend gelesen wird, kann von den Leseparametern abhängen.
- Unendlichkeit ist nicht dasselbe wie ein gewöhnlicher fehlender Wert;
- Ob ein fehlender Wert entfernt, gefüllt oder beibehalten werden soll, sollte aus der Bedeutung der Daten und dem analytischen Ziel heraus entschieden werden.

Im Qualitätskontrollbeispiel:

```python
cells["n_genes"].notna() & cells["percent_mito"].notna()
```

Erfordert explizit, dass beide Spalten nicht fehlen. Dadurch wird verhindert, dass die Richtlinie für fehlende Werte im späteren Filterverhalten ausgeblendet bleibt.

## DataFrame: eine Tabelle mit Zeilen und Spalten

Ein pandas DataFrame ist eine zweidimensionale Tabelle. Auf einer Einführungsebene können Sie es sich wie folgt vorstellen:

- Jede Zeile repräsentiert normalerweise eine Beobachtung;
- Jede Spalte repräsentiert eine Variable;
- Der Zeilenindex identifiziert Zeilenpositionen oder -beschriftungen.
- Spaltennamen beschreiben, was jede Spalte bedeutet.

Eine Zellmetadaten-Tabelle könnte beispielsweise wie folgt aussehen:

| cell_id | sample_id | n_genes | percent_mito |
| --- | --- | ---: | ---: |
| AAAC-1 | sample_A | 900 | 4.1 |
| AAAG-1 | sample_A | 650 | 8.2 |
| AAAT-1 | sample_B | 350 | 3.2 |

Ein DataFrame garantiert jedoch nicht automatisch, dass "jede Zeile eine Zelle darstellt". Eine Zeile könnte stattdessen eine Probe, ein Gen, einen räumlichen Standort oder einen Vergleich darstellen. Sie müssen die Datenbeschreibung, Bezeichner und Objektform überprüfen.

### Vor dem Schreiben einer Filterbedingung die Struktur prüfen

```python
print(cells.shape)
print(cells.columns.tolist())
print(cells.head())
print(cells.dtypes)
```

Diese Linien helfen Ihnen bei der Prüfung, jeweils:

- die Anzahl der Zeilen und Spalten;
- die Spaltennamen;
- die ersten Reihen;
- Der Datentyp der einzelnen Spalten.

`head()` zeigt nur eine kleine Anzahl von Zeilen an und kann nicht beweisen, dass der Rest der Tabelle keine Probleme enthält. Abhängig von der Aufgabe sollten Sie auch die Anzahl fehlender Werte, eindeutige Bezeichner, doppelte Zeilen, numerische Bereiche und die Verteilung innerhalb jeder Stichprobe überprüfen.

### Zeilen mit `.loc[keep]` und einer logischen Bedingung filtern

```python
filtered_cells = cells.loc[keep].copy()
```

Hier:

- `keep` ist eine logische Bedingung, die den Tabellenzeilen entspricht;
- `.loc[keep]` wählt Zeilen aus, in denen die Bedingung wahr ist;
- `.copy()` erstellt explizit ein neues DataFrame-Objekt, sodass das gefilterte Ergebnis leichter von der ursprünglichen Tabelle unterschieden werden kann.

pandas ordnet eine logische Series den Zeilen eines DataFrames anhand der Indexbezeichnungen zu. Hier wurde `keep` direkt aus den Spalten von `cells` gebildet und passt deshalb zur Tabelle. Zwei unterschiedliche Tabellen können beide den Standardindex `0, 1, 2, ...` tragen, obwohl sie unterschiedliche Zellen enthalten. Lassen sich die Indizes nicht ausrichten, kann pandas einen Fehler melden. Stimmen die Bezeichnungen zufällig überein, kann die Maske unbemerkt die falschen Beobachtungen auswählen.

## `if`, Schleifen und Comprehensions: Welcher Code wird ausgeführt?

### `if`: Code ausführen, wenn eine Bedingung erfüllt ist

```python
if missing_columns:
    raise ValueError(f"Missing required columns: {sorted(missing_columns)}")
```

Eine nicht leere Menge wird in einer Bedingung als wahr behandelt, und eine leere Menge wird als falsch behandelt. Der Fehler wird daher nur ausgelöst, wenn eine erforderliche Spalte tatsächlich fehlt.

Diese Form ist prägnant, aber ein Anfänger sollte sie in eine vollständige Bedingung übersetzen:

> Wenn `missing_columns` kein leerer Satz ist, stoppen Sie das Programm und melden Sie, welche Spalten fehlen.

### `for`: Mehrere Elemente nacheinander verarbeiten

```python
for column_name in ["n_genes", "percent_mito"]:
    print(column_name)
```

`column_name` bezieht sich auf jedes Element der Liste nacheinander. Der eingerückte Code gehört zum Schleifenkörper.

Wenn eine Schleife eine Liste, Tabelle oder Datei ändert, bestätigen Sie, ob diese Änderungen kumuliert werden und ob jede Iteration eine Zelle, Probe oder ein Gen verarbeitet.

### `while`: Eine Operation wiederholen, solange die Bedingung wahr ist

```python
attempt = 0

while attempt < 3:
    print(attempt)
    attempt = attempt + 1
```

Wenn die Schleifenbedingung immer wahr bleibt, wird das Programm möglicherweise nie beendet. Wenn Sie einen KI-generierten `while` überprüfen, finden Sie die Operation, die die Bedingung schließlich falsch macht.

### Eine List Comprehension lesen, bevor man selbst eine schreibt

```python
uppercase_genes = [gene.upper() for gene in marker_genes]
```

Sie können es erweitern als:

```python
uppercase_genes = []

for gene in marker_genes:
    uppercase_genes.append(gene.upper())
```

Ein Verständnis kann Code vereinfachen, aber es kann auch mehrere Bedingungen in einer Zeile komprimieren. Wenn eine Zeile schwer zu erklären ist, bitten Sie KI, sie in eine gewöhnliche Schleife zu erweitern, bevor Sie sie überprüfen.

## Fehler, Warnungen und Protokolle unterscheiden

| Symptom | Übliche Bedeutung | Zuerst prüfen |
| --- | --- | --- |
| `SyntaxError` | Python kann die Syntax des Codes nicht verarbeiten | Die angegebene und die vorhergehende Zeile prüfen. Auf Klammern, Doppelpunkte und Anführungszeichen achten. |
| `IndentationError` oder `TabError` | Die Einrückungsebenen stimmen nicht | Leerzeichen, Tabulatoren und Blockgrenzen prüfen |
| `NameError` | Der Code verwendet einen Namen, der noch nicht definiert wurde | Die Zeile oder Notebook-Zelle suchen, die den Namen definieren sollte |
| `TypeError` | Die Operation passt nicht zum Typ des Objekts | Den tatsächlichen Objekttyp und die Eingaben der Funktion prüfen |
| `KeyError` | Der angegebene Wörterbuchschlüssel oder Spaltenname existiert nicht | Vorhandene Schlüssel oder Spaltennamen ausgeben, Schreibweise und Leerzeichen prüfen |
| `FileNotFoundError` | Unter dem angegebenen Pfad wurde keine Datei gefunden | Arbeitsverzeichnis, Pfad und Dateinamen prüfen |
| `ModuleNotFoundError` | Der aktive Interpreter findet das Modul nicht | Prüfen, welcher Python-Interpreter und welche Projektumgebung aktiv sind |

Eine nicht behandelte Ausnahme beendet normalerweise die aktuelle Ausführung. Die letzte Zeile eines Tracebacks gibt normalerweise den Ausnahmetyp und die unmittelbare Erklärung an, während der vorhergehende Inhalt zeigt, welche Dateien, Funktionen und Codezeilen durchlaufen wurden.

Gib Codex nicht nur die letzte Zeile. Der vollständige Traceback, der Ausführungsbefehl, die Python-Version, das Arbeitsverzeichnis und die Eingabe-Objekt-Struktur liefern weitere Anhaltspunkte für die Ursache.

Eine Warnung stoppt normalerweise ein Programm nicht sofort, kann aber Folgendes anzeigen:

- Eine Schnittstelle wird sich ändern;
- ein Datentyp wurde automatisch konvertiert;
- Eine Berechnung hat ein numerisches Problem;
- Der aktuelle Vorgang kann zu einem mehrdeutigen Ergebnis führen.

Ein Log oder eine gewöhnliche Ausgabe ist einfach eine Information, die das Programm absichtlich anzeigt; es ist nicht automatisch ein Fehler. Ob es vertrauenswürdig ist, hängt noch davon ab, was der Code aufgezeichnet hat und ob die wichtigen Prüfungen tatsächlich durchgeführt wurden.

## KI-generierten Python-Code systematisch prüfen

### 1. Ausführungsort und Umgebung prüfen

Notieren Sie die Python-Version, den Interpreterpfad, die Projektumgebung, die Paketversionen, den Skript- oder Notizbuchnamen und das aktuelle Arbeitsverzeichnis.

### 2. Alle externen Eingaben ermitteln

Suchen Sie nach Vorgängen, die Daten lesen können, z. B.:

```python
pd.read_csv(...)
pd.read_excel(...)
Path(...).read_text(...)
open(...)
```

Bestätigen Sie den Pfad, das Dateiformat, das Trennzeichen, die Codierung, das Beispiel und die Version der Referenzdaten.

### 3. Wichtige Namen und die zugehörigen Objekttypen auflisten

Zum Beispiel:

```text
metadata_path → Path, Pfad zur Eingabedatei
cells → DataFrame, ursprüngliche Metadaten der Zellen
keep → Series, ein Wahrheitswert pro Zeile
filtered_cells → DataFrame, gefiltertes Ergebnis
average_genes → numerischer Skalar, häufig als Dezimalzahl dargestellt: mittlere Anzahl nachgewiesener Gene über die beibehaltenen Zeilen
```

Wenn Sie nicht erklären können, worauf sich ein Name bezieht, überprüfen Sie zuerst, wo er erstellt wurde, seinen `type()`, Shape, Spaltennamen und eine kleine Anzahl Beispielwerte.

### 4. Änderungen an Objekten und Neuzuweisungen von Namen verfolgen

Prüfen:

- ob der gleiche Name später neu zugewiesen wird;
- ob eine Methode ein Objekt an Ort und Stelle modifiziert;
- ob sich zwei Namen auf dasselbe veränderbare Objekt beziehen;
- ob ein Notizbuch vom alten Zellzustand abhängt;
- Ob beim Filtern ein neues Objekt erstellt oder das Original überschrieben wird.

### 5. Jede Bedingung in einem Satz ausdrücken

Übersetzen:

```python
(cells["n_genes"] >= 500) & (cells["percent_mito"] < 10)
```

als:

> Erfordern Sie für jede Zeile, dass `n_genes` mindestens 500 und `percent_mito` weniger als 10 beträgt.

Fragen Sie dann nach der Grundlage für die Schwellenwerte, Einheiten, Fehlwertrichtlinien und Verteilungen über Stichproben hinweg.

### 6. Schreibzugriffe, Netzwerkzugriffe und Änderungen an der Umgebung erkennen

Suchen Sie nach:

```python
to_csv(...)
write_text(...)
unlink(...)
shutil.rmtree(...)
subprocess.run(...)
os.environ[...]
```

Bestätigen Sie vor der Ausführung den Zielpfad, das Überschreibungsverhalten, den Befehlsinhalt, die Downloadquelle und die Verarbeitung von Anmeldeinformationen.

### 7. Wichtige Zwischenergebnisse prüfen

Prüfen Sie mindestens:

- Die Eingabetabelle Shape und Spaltennamen;
- ob Kennungen eindeutig sind;
- die Anzahl der fehlenden Werte;
- wie viele Zeilen jede Bedingung für sich behält;
- Wie viele Zeilen die kombinierten Bedingungen beibehalten;
- wie viele Zellen für jede biologische Probe zurückgehalten werden;
- Ob der Ausgabeindex mit zugeordneten Objekten übereinstimmt.

Wenn man nur das endgültige Diagramm oder den endgültigen Mittelwert betrachtet, kann man nicht feststellen, ob eine gesamte Stichprobe während eines Zwischenschritts verloren gegangen ist.

### 8. Zum Schluss die wissenschaftliche Aussage überprüfen

Eine erfolgreiche Ausführung bedeutet nur, dass Python die Anweisungen akzeptiert hat. Es beweist nicht automatisch, dass:

- Die Schwellenwerte entsprechen dem aktuellen Gewebe- und Versuchsprotokoll.
- Die Prozenteinheit wurde richtig verstanden.
- Jede Zeile repräsentiert wirklich eine Zelle und nicht einen Kern oder einen räumlichen Ort;
- Es gibt genügend biologische Replikate, um die Schlussfolgerung zu unterstützen;
- Die Filterung hat einen Zelltyp nicht systematisch ausgeschlossen.
- Das Referenzgenom, die Annotation und die Merkmalskennungen sind korrekt;
- Die statistische Schlussfolgerung beantwortet die biologische Frage.

## Codex um eine überprüfbare Erklärung von Python-Code bitten

Eine schwache Anfrage:

```text
Erkläre diesen Python-Code.
```

Eine Anfrage, die einfacher zu verifizieren ist:

```text
Prüfe diesen Python-Code als bioinformatische Analyse und erläutere die Entscheidungen, die darin stecken.

1. Erkläre zuerst, ob der Code in ein Terminal, ein Python-Skript oder ein Notebook gehört.
2. Liste alle externen Eingaben, Ausgabepfade und Operationen auf, die die Umgebung verändern.
3. Nenne für jeden wichtigen Namen Objekttyp, Dimensionen, Index und Spaltennamen.
4. Erkläre jede Filterbedingung in Alltagssprache und gehe auf Klammern, fehlende Werte und Operatoren ein.
5. Unterscheide einfache boolesche Werte in Python von elementweisen logischen Operationen in pandas und NumPy.
6. Zeige, welche Zeilen bestehende Objekte verändern und welche neue Objekte anlegen.
7. Gib den minimalen Prüfcode an, der nur lesend zugreift und keine ursprünglichen Daten oder Dateien überschreibt.
8. Prüfe wichtige Verhaltensweisen anhand der offiziellen Dokumentation der verwendeten Versionen von Python, pandas und den betreffenden Paketen.
9. Liste abschließend die biologischen Annahmen auf, die die Forschenden selbst beurteilen müssen.
```

Auch die KI-Erklärung bedarf einer Verifizierung. Objekttypen, Funktionssignaturen, Paketversionen, Standardparameter und Verhalten bei fehlenden Werten sollten mit der tatsächlichen Umgebung und der offiziellen Dokumentation überprüft werden.

## Welche KI-generierten Operationen sollte man besonders prüfen?

| Schreibweise | Mögliche Auswirkung | Frage vor der Ausführung |
| --- | --- | --- |
| `data = transformed_data` | Bindet den Namen an ein anderes Objekt | Lässt sich das ursprüngliche Objekt noch auffinden? |
| `list_a = list_b` | Beide Namen können auf dieselbe veränderbare Liste verweisen | Wird eine spätere Änderung über beide Namen sichtbar sein? |
| `df.drop(..., inplace=True)` | Ändert den DataFrame direkt | Muss die Ausgangstabelle erhalten bleiben? Wie verhält sich die verwendete pandas-Version? |
| `df.to_csv(path)` | Schreibt oder überschreibt eine Datei | Stimmen der Pfad und die Wahl der Indexspalte? Darf eine vorhandene Datei überschrieben werden? |
| `Path(path).unlink()` | Löscht eine Datei | Wurde der Pfad ausdrücklich geprüft? Gibt es eine Sicherungskopie? |
| `shutil.rmtree(path)` | Löscht ein Verzeichnis einschließlich aller Unterverzeichnisse und Dateien | Bezeichnet der Zielpfad genau das vorgesehene Verzeichnis? |
| `subprocess.run(..., shell=True)` | Führt einen Befehl über eine Shell aus | Enthält der Befehl ungeprüfte Eingaben? |
| `pip install ...` | Ändert die Softwareumgebung | Soll das Paket in der Projektumgebung installiert und seine Version dokumentiert werden? |
| `requests.get(url)` | Liest Daten über das Netzwerk ein | Welche Quelle, Lizenz und Größe haben die Daten? Wie werden sie überprüft? |
| `os.environ["TOKEN"]` | Liest einen Zugangsnachweis | Könnte er auf dem Bildschirm, in einem Protokoll oder in einer Datei erscheinen? |

Nicht jede dieser Formen ist falsch. Sie erfordern vor der Ausführung stärkere Beweise, da sie Daten, Dateien, Umgebungen oder externe Systeme verändern können.

## Das Einstiegsbeispiel vollständig durchgehen

Angenommen, `cell_metadata.csv` enthält genau das Folgende:

```csv
cell_id,sample_id,n_genes,percent_mito
AAAC-1,sample_A,900,4.1
AAAG-1,sample_A,650,8.2
AAAT-1,sample_B,350,3.2
AACG-1,sample_B,1200,12.5
AACT-1,sample_B,,2.1
AAGA-1,sample_B,800,
```

Die aufeinanderfolgenden Kommas in den letzten beiden Zeilen stellen wirklich leere Felder dar. Schreiben Sie kein Wort wie "fehlt" in die CSV. Mit dem Standard-Leseverhalten in diesem Beispiel erkennt pandas diese beiden leeren Felder als fehlende Werte.

Die Werte `500` und `10` sind fiktive Schwellenwerte für das Syntaxbeispiel. In einer echten Einzelzellanalyse hängen geeignete Grenzen von Gewebe, Versuchsprotokoll, Sequenziertiefe, Zell- oder Kerntyp, Verteilung der Messgrößen und Analyseziel ab.

### Schritt 1: Die benötigten Namen importieren

```python
from pathlib import Path

import pandas as pd
```

- `Path` repräsentiert und inspiziert Pfade.
- `pd` ist der Kurzname, den dieser Code für pandas verwendet.

### Schritt 2: Den Pfad aufbauen und die Tabelle einlesen

```python
metadata_path = Path("cell_metadata.csv")
cells = pd.read_csv(metadata_path)
```

- `metadata_path` bezieht sich auf einen relativen Pfad.
- `pd.read_csv()` liest die CSV-Datei.
- `cells` bezieht sich auf den resultierenden DataFrame.

Bevor Sie den Code ausführen, bestätigen Sie `Path.cwd()`, den Dateinamen, das Trennzeichen und die Codierung. Das erfolgreiche Lesen garantiert jedoch nicht, dass die Spaltentypen, Markierungen für fehlende Werte oder Einheiten korrekt sind.

### Schritt 3: Prüfen, ob die benötigten Spalten vorhanden sind

```python
required_columns = {"cell_id", "sample_id", "n_genes", "percent_mito"}
missing_columns = required_columns - set(cells.columns)
if missing_columns:
    raise ValueError(f"Missing required columns: {sorted(missing_columns)}")
```

- `set(cells.columns)` wandelt die beobachteten Spaltennamen in eine Menge um.
- Set difference findet erforderliche Spalten, die fehlen.
- Wenn die Menge nicht leer ist, stoppt das Programm und meldet die Spaltennamen explizit.
- `sorted()` wird nur verwendet, um die Spaltenreihenfolge in der Fehlermeldung stabil und leicht lesbar zu halten.

Durch die Bestätigung, dass Spalten vorhanden sind, werden ihre Datentypen, Einheiten, eindeutigen Bezeichner oder numerischen Bereiche nicht überprüft.

### Schritt 4: Eine Filterbedingung für jede Zeile formulieren

```python
keep = (
    cells["n_genes"].notna()
    & cells["percent_mito"].notna()
    & (cells["n_genes"] >= 500)
    & (cells["percent_mito"] < 10)
)
```

Für jede Zeile benötigen Sie:

1. `n_genes` fehlt nicht;
2. `percent_mito` fehlt nicht;
3. `n_genes` ist mindestens 500;
4. `percent_mito` ist kleiner als 10.

Das entsprechende Element in `keep` ist nur dann `True`, wenn alle vier Bedingungen erfüllt sind.

### Schritt 5: Filtern und das Ergebnis ausdrücklich kopieren

```python
filtered_cells = cells.loc[keep].copy()
```

`.loc[keep]` wählt die Zeilen aus, für die die Bedingung wahr ist. `.copy()` erzeugt einen neuen DataFrame für die folgenden Schritte. Bei den Zahlenwerten dieses Beispiels verändern gewöhnliche Änderungen der neuen Tabelle die ursprüngliche Tabelle nicht direkt. Für die Kopiertiefe gelten die oben erläuterten Einschränkungen.

Erwartetes Filterergebnis:

| cell_id | sample_id | n_genes | percent_mito |
| --- | --- | ---: | ---: |
| AAAC-1 | sample_A | 900 | 4.1 |
| AAAG-1 | sample_A | 650 | 8.2 |

Das erwartete Ergebnis enthält zwei Zeilen, beide aus `sample_A`. Von `sample_B` bleibt keine Zeile übrig. Selbst wenn Gesamtzahl und Mittelwert plausibel erscheinen, sollten Sie beim vollständigen Wegfall einer Probe die Schwellenwerte, Eingabedaten, Einheiten und Probenqualität prüfen. Kontrollieren Sie bei einer Analyse mehrerer Proben auch die Proben- oder Bibliothekskennungen in den Eingabedaten und dokumentieren Sie nach jedem Filter die Zahl der verbliebenen Zellen pro Probe.

### Schritt 6: Den Mittelwert berechnen und ausdrücklich ausgeben

```python
average_genes = filtered_cells["n_genes"].mean()
print(average_genes)
```

Der Mittelwert ist:

```text
775.0
```

Dieser Wert ist nur das arithmetische Mittel von `n_genes` über die beiden beibehaltenen Zeilen. Es beweist nicht, dass die Filterregel vernünftig ist, und es kann keine Unterschiede zwischen unabhängigen biologischen Proben darstellen.

Zeilen mit fehlendem `n_genes` wurden hier schon ausgeschlossen. Beim Berechnen des Mittelwerts überspringt pandas fehlende Werte standardmäßig. Bleibt nach dem Filtern keine Zeile übrig, kann als Mittelwert `NaN` erscheinen, ohne dass ein Fehler ausgelöst wird. Prüfen Sie deshalb die Zeilenzahl oder `filtered_cells.empty`, bevor Sie das Ergebnis interpretieren.

### Dieser Code filtert die Bestandteile eines echten Einzelzell-Datenobjekts noch nicht gemeinsam

Das Ergebnis ist hier nur eine gefilterte Metadaten-Tabelle. Es filtert nicht automatisch:

- die Genexpressionsmatrix;
- andere Ebenen, Einbettungen und Graphenstrukturen in AnnData;
- andere Modalitäten in einem einzelnen Zell-Multi-omics-Objekt;
- Koordinaten, Bilder und Standortmerkmale in der räumlichen Omik;
- Andere Ergebnisse, die nach Zelle oder Standort zugeordnet sind.

Liegen die Daten in einem AnnData-Objekt, filtern Sie üblicherweise das gesamte Objekt entlang der Beobachtungsachse. Wer nur `.obs` exportiert und filtert, lässt die übrigen Bestandteile unverändert. Beim Filtern des Objekts werden `X`, `layers`, `obsm` und `obsp` an den zugehörigen Achsen mit ausgewählt. Beim Ausschneiden entsteht normalerweise eine Ansicht. Prüfen Sie vor späteren Änderungen, ob Sie `.copy()` aufrufen sollten.

Dies ist nur eine Erinnerung an Objektgrenzen. Ein multimodales oder räumliches Objekt garantiert nicht, dass alle seine Inhalte Zeile für Zeile Zellen oder Orten entsprechen. Gemeinsame Informationen wie Bilder, Koordinatensysteme und Koordinatentransformationen können nicht mechanisch derselben booleschen Maske zugewiesen werden. Die spezifischen Objektoperationen werden späteren Lektionen überlassen.

Verwenden Sie in einem realen Projekt verifizierte Beobachtungskennungen, die innerhalb des Projekts global eindeutig sind, um zugeordnete Objekte konsistent auszuwählen. Zellen-Barcodes können sich in Proben oder Bibliotheken wiederholen, daher müssen Sie normalerweise die Proben- oder Bibliothekskennung mit dem Barcode kombinieren. Überprüfen Sie dann Eins-zu-Eins-Beziehungen, Bezeichnergruppen, Zählungen und Reihenfolge. Gehen Sie nicht einfach davon aus, dass "Zeile 10 in zwei Tabellen dieselbe Zelle darstellt".

## Welche Fähigkeiten solltest du nach dieser Lektion beherrschen?

Wenn Sie auf Python-Code stoßen, müssen Sie ihn nicht aus dem Speicher neu schreiben, aber Sie sollten zumindest in der Lage sein:

- Terminalbefehle, interaktive Eingaben, Skripte und Notizbuchzellen unterscheiden;
- Einrückungen, Namen, Zuordnungen, Funktionen, Methoden, Attribute, Kommentare und Zeichenketten erkennen;
- Unterscheidung von allgemeinen Zahlen, Zeichenketten, booleschen Werten, `None` und Containern;
- Wissen, dass die Zuweisung nicht notwendigerweise ein veränderbares Objekt kopiert;
- Verstehen der grundlegenden Unterschiede zwischen nullbasierter Indizierung, halboffenen Slices, `.loc` und `.iloc`;
- `=`, `==`, `is None`, `and` und pandas `&` unterscheiden;
- Sie wissen, dass `None`, `NaN`, `pd.NA` und leere Zeichenketten explizit behandelt werden müssen;
- Eingaben, Änderungen an Namen, Filterbedingungen und Ausgaben verfolgen;
- Vorgänge finden, die Dateien überschreiben, eine Umgebung ändern, eine Shell ausführen oder Anmeldeinformationen lesen können;
- KI-Erklärungen mit realen Objektstrukturen, Softwareversionen und offizieller Dokumentation vergleichen;
- Erläutern, welche Validierungsschritte zwischen erfolgreicher Ausführung und einer unterstützten biologischen Schlussfolgerung noch fehlen.

Jetzt, da KI Code schnell generieren kann, kann das Auswendiglernen der Syntax weniger wichtig werden, aber das Verstehen von Code wird wichtiger. Je schneller Code generiert wird, desto wichtiger ist es für jemanden zu bestätigen, dass der Code die richtigen Objekte verarbeitet, die richtigen Bedingungen anwendet und nicht rechnerischen Erfolg mit wissenschaftlicher Unterstützung verwechselt.

## Quellen

1. [Offizielles Python-Tutorial: eine informelle Einführung in Python, Kommentare, Zuordnung, Zeichenketten, Listen und Slicen](https://docs.python.org/3/tutorial/introduction.html)
2. [Offizielles Python-Tutorial: `if`, `for` und Funktionen](https://docs.python.org/3/tutorial/controlflow.html)
3. [Offizielles Python-Tutorial: Listen, Tuples, Sets und Wörterbücher](https://docs.python.org/3/tutorial/datastructures.html)
4. [Offizielles Python-Tutorial: Module und Pakete](https://docs.python.org/3/tutorial/modules.html)
5. [Offizielles Python Tutorial: Fehler und Ausnahmen](https://docs.python.org/3/tutorial/errors.html)
6. [Python Sprachreferenz: Einrückungsregeln](https://docs.python.org/3/reference/lexical_analysis.html#indentation)
7. [Python-Standardbibliothek: `pathlib`](https://docs.python.org/3/library/pathlib.html)
8. [Offizieller pandas-Leitfaden: Indizierung und logische Filterung](https://pandas.pydata.org/docs/user_guide/indexing.html#boolean-indexing)
9. [Offizielle pandas Dokumentation: `DataFrame.loc`](https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.loc.html)
10. [Offizielle pandas-Dokumentation: Fehlende Werte erkennen](https://pandas.pydata.org/docs/reference/api/pandas.notna.html)
11. [Offizielle pandas Dokumentation: `DataFrame.copy`](https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.copy.html)
12. [Python-Standardbibliothek: flaches und tiefes Kopieren](https://docs.python.org/3/library/copy.html)
13. [Offizielle pandas Dokumentation: `Series.mean`](https://pandas.pydata.org/docs/reference/api/pandas.Series.mean.html)
14. [Offizieller pandas-Leitfaden: Copy-on-Write](https://pandas.pydata.org/docs/user_guide/copy_on_write.html)
15. [Offizielle AnnData Dokumentation: `AnnData`](https://anndata.readthedocs.io/en/stable/generated/anndata.AnnData.html)
