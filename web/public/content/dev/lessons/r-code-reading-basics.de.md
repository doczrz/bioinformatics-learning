# 0.3 | R-Code lesen und verstehen: Grundlagen der Syntax

Angenommen, du gibst Codex eine Tabelle mit Qualitätsmerkmalen für jede Zelle und fragst, welche Zellen beibehalten werden können. Codex liefert folgenden R-Code:

```r
cells <- read.csv("cell_metadata.csv")

keep <- !is.na(cells$n_genes) &
  !is.na(cells$percent_mito) &
  cells$n_genes >= 500 &
  cells$percent_mito < 10

filtered_cells <- cells[keep, ]
average_genes <- mean(filtered_cells$n_genes, na.rm = TRUE)
```

Auch wenn Sie nicht vorhaben, diesen Code selbst von einer leeren Seite aus zu schreiben, müssen Sie immer noch in der Lage sein, Folgendes zu beantworten:

- Welche Datei liest der Code?
- Was enthalten `cells`, `keep` und `filtered_cells` jeweils?
- Welche Zellen bleiben erhalten?
- Wie werden fehlende Werte behandelt?
- Was berechnet die letzte Zeile?
- Woher stammen `500` und `10` und sind sie für Ihre Daten geeignet?

Wenn Sie diese Fragen nicht beantworten können, können Sie nicht feststellen, ob der Code die richtigen Daten verarbeitet oder stillschweigend Zellen entfernt, die beibehalten werden sollten.

Das Ziel dieser Lektion ist es nicht, Sie dazu zu bringen, die R-Syntax auswendig zu lernen, und schon gar nicht, dass Sie Programme ohne Dokumentation aus dem Speicher reproduzieren. Was Sie entwickeln müssen, ist die Fähigkeit, Code zu lesen: Wenn Sie ein Stück R-Code sehen, sollten Sie in der Lage sein, zu identifizieren, wo Daten eingehen, wie sie sich ändern, wohin die Ergebnisse gehen und welche analytischen Entscheidungen in der Verantwortung des Forschers bleiben.

Diese Lektion geht davon aus, dass Sie bereits wissen, dass R eine Umgebung für statistische Berechnungen und Datenanalysen ist und dass Pakete und Projektumgebungen beeinflussen, ob Code ausgeführt werden kann. Sie müssen keine Software im Voraus installieren und es sind keine Programmierkenntnisse erforderlich.

Die Codeblöcke in dieser Lektion sind hauptsächlich zum Lesen gedacht; Sie müssen sie jetzt nicht ausführen. Wenn Sie weitermachen möchten, führen Sie den R-Code in der R-Konsole oder einem R-Skript aus. Ein Dateiname ohne vollständigen Pfad, wie `"cell_metadata.csv"`, wird relativ zum aktuellen Arbeitsverzeichnis nachgeschlagen. Sie können `getwd()` zuerst ausführen, um zu sehen, wo sich dieses Verzeichnis befindet.

Bei der ersten Lektüre können Sie das Material in zwei Ebenen unterteilen:

- **Das solltest du verstehen:** Objekte, Zuweisung, Funktionen, Dataframes, Indizierung, logische Bedingungen, `NA` und Filtern.
- **Vorerst reicht es, Folgendes zu erkennen:** Vektor-Recycling, dünn besetzte Matrizen, `[[]]`, verschiedene Pipe-Operatoren, Namensräume, Schleifen und selbst definierte Funktionen. Bei diesen Konstrukten kannst du die KI um eine Erklärung bitten oder die offizielle Dokumentation heranziehen.

## Auch beim „Vibe Coding“ muss man Code lesen können

"Vibe Coding" ist ein informeller Begriff. Es bezieht sich in der Regel darauf, eine Aufgabe in natürlicher Sprache zu beschreiben und KI den Code generieren, modifizieren und ausführen zu lassen, ohne dass der Benutzer jede Anweisung Zeichen für Zeichen eingeben muss.

Diese Arbeitsweise reduziert die Belastung durch das Auswendiglernen der Syntax. Sie können Codex bitten:

- R-Code für eine Aufgabe generieren;
- einen Fehler erklären;
- Wiederholte Schritte in einem Skript organisieren;
- Finden Sie heraus, wo ein Objekt erstellt oder geändert wurde;
- Funktionsargumente mit der Dokumentation vergleichen;
- Code ausführen und Zwischenergebnisse anzeigen.

Infolgedessen ist die Fähigkeit, alles von Grund auf neu zu schreiben, nicht mehr der einzige Maßstab für analytische Fähigkeiten.

Eine natürlichsprachliche Anfrage muss jedoch immer noch in präzise Rechenoperationen umgewandelt werden. Ein Computer kann eine vage Absicht wie "Zellen mit geringer Qualität entfernen" nicht verstehen. Es kann nur eine explizite Bedingung wie "Zeilen entfernen, wo `n_genes < 500`" ausführen. Wenn KI einen Spaltennamen, eine Dateneinheit, einen fehlenden Wert oder eine Vergleichsrichtung falsch versteht, kann der Code trotzdem ohne Fehler ausgeführt werden.

Daher werden Anfänger in diesem Kurs gebeten, folgenden Standard zu erfüllen:

> Sie müssen nicht Code aus dem Gedächtnis schreiben, aber Sie müssen in der Lage sein, den Schlüsselcode in gewöhnliche Sprache zu übersetzen und zu überprüfen, ob diese Übersetzung der Forschungsfrage entspricht.

Das bedeutet nicht, dass Sie jeden internen Mechanismus von R verstehen müssen. Genauso wie Sie für das Lesen eines englischsprachigen Papiers nicht erst Linguist werden müssen, kann das Lesen von Analysecode mit den häufigsten Strukturen beginnen, während Sie bei Bedarf die Dokumentation konsultieren.

## Die Bestandteile einer Zeile R-Code

Betrachten Sie diese Zeile:

```r
average_genes <- mean(cells$n_genes, na.rm = TRUE)
```

Sie können es von rechts nach links lesen:

1. `cells$n_genes`: nehmen Sie die Spalte mit dem Namen `n_genes` aus `cells`;
2. `mean(...)`: Ruft die Funktion auf, die den Mittelwert berechnet;
3. `na.rm = TRUE`: Fehlende Werte vor der Berechnung entfernen;
4. `<-`: Geben Sie das Ergebnis auf der rechten Seite an den Namen auf der linken Seite;
5. `average_genes`: der Name des Objekts, das das Ergebnis speichert.

In einfacher Sprache:

> Nehmen Sie die Spalte mit der Anzahl der erkannten Gene aus der Zelltabelle, berechnen Sie den Mittelwert nach Ignorieren fehlender Werte und speichern Sie das Ergebnis als `average_genes`.

Diese Art der Übersetzung ist das Herzstück des Code-Lesens. Sie können einen Funktionsnamen suchen und Codex nach einem Argument fragen, aber Sie müssen in der Lage sein, die Eingabe, Aktion, Bedingungen und das Ergebnis zu erklären.

## Objekte: Daten und Ergebnisse in R benennen

Die Dinge, die R erstellt und verarbeitet, werden normalerweise als Objekte bezeichnet. Zahlen, Text, Tabellen, Matrizen, Funktionen und komplexe Datencontainer mit einer einzigen Zelle können Objekte sein.

```r
gene_name <- "MS4A1"
cell_count <- 1200
analysis_ready <- TRUE
```

Dieser Code erstellt drei Objekte:

| Objekt | Gespeicherter Wert | Übliche Bedeutung |
| --- | --- | --- |
| `gene_name` | `"MS4A1"` | Text |
| `cell_count` | `1200` | Zahl |
| `analysis_ready` | `TRUE` | Logischer Wert |

R unterscheidet zwischen Groß- und Kleinschreibung, sodass `cell_count`, `Cell_Count` und `CELL_COUNT` drei verschiedene Namen sind.

Ein Objektname soll dem Leser helfen, den Inhalt zu verstehen. `cell_metadata` ist in der Regel einfacher zu überprüfen als `x`, und `filtered_cells` ist in der Regel leichter zu folgen als `result2`. Kurze Namen können in einer Formel oder einer sehr kurzen temporären Berechnung sinnvoll sein, erhöhen jedoch das Risiko, dass ein langer Analyseworkflow falsch interpretiert wird.

## Zuweisung mit `<-`: ein Ergebnis unter einem Namen speichern

```r
cell_count <- 1200
```

Der Zuordnungsoperator `<-` lässt sich wie folgt lesen: "Speichern Sie den Wert rechts unter dem Namen links." Es besteht aus `<` unmittelbar gefolgt von `-`.

R erlaubt auch die Zuweisung von `=` an vielen Stellen, aber eine allgemeine Konvention ist:

- `<-` verwenden, um ein Objekt zu erstellen oder zu aktualisieren;
- Verwenden Sie `=`, um ein Argument in einem Funktionsaufruf anzugeben.

```r
average_genes <- mean(cells$n_genes, na.rm = TRUE)
```

Diese Konvention erleichtert die Unterscheidung zwischen "Speichern des Ergebnisses" und "Setzen eines Funktionsarguments".

Assignment kann ein bestehendes Objekt überschreiben, normalerweise ohne erneut zu fragen:

```r
threshold <- 500
threshold <- 1000
```

Nach der zweiten Zeile hat `threshold` den Wert `1000`. Achten Sie beim Lesen von KI-generiertem Code darauf, ob demselben Namen später ein neuer Wert zugewiesen wird.

## Kommentare, Anführungszeichen und Klammern

### Alles nach `#` ist ein Kommentar

```r
# Diese Zeile ist ein Kommentar. R führt sie nicht aus.
threshold <- 500  # Vorläufiger Schwellenwert für dieses Beispiel, abhängig von den Daten
```

Alles von `#` bis zum Ende dieser Zeile ist ein Kommentar. Ein guter Kommentar erklärt, warum etwas getan wird oder woher eine Entscheidung kam, anstatt einfach den Code laut vorzulesen.

Kommentare können veraltet sein. Bei Codeänderungen wird ein alter Kommentar nicht automatisch aktualisiert. Sie müssen daher den Ausdruck überprüfen, der tatsächlich ausgeführt wird, anstatt nur dem Kommentar zu vertrauen.

### Anführungszeichen begrenzen Text

```r
cell_type <- "CD4 T cell"
```

`"CD4 T cell"` ist eine Zeichenkette. Ohne Anführungszeichen würde `cell_type` in der Regel den Namen eines Objekts bezeichnen.

```r
cell_type == "CD4 T cell"
```

Diese Zeile vergleicht das Objekt `cell_type` mit dem angegebenen Text, um zu sehen, ob sie gleich sind.

### Runde Klammern kennzeichnen Funktionsaufrufe oder legen die Rechenreihenfolge fest

```r
mean(c(10, 20, 30))
```

Der innere Aufruf `c(...)` fasst zuerst die drei Zahlen zu einem Vektor zusammen. Der äußere Aufruf `mean(...)` berechnet dann dessen Mittelwert.

Klammern können auch die Reihenfolge der Operationen explizit machen:

```r
1 + 2 * 3
(1 + 2) * 3
```

Diese beiden Linien ergeben unterschiedliche Ergebnisse. Wenn Sie einen komplexen Zustand sehen, erraten Sie nicht seinen Vorrang durch das Sehen. Wenn Sie KI bitten, Klammern hinzuzufügen, wird der Code oft einfacher zu überprüfen.

## Funktionen: Eingaben verarbeiten und ein Ergebnis zurückgeben

Eine Funktion kann als eine Operation verstanden werden, die einen Namen erhalten hat.

```r
mean(c(10, 20, 30))
```

Diese Zeile enthält:

- Der Funktionsname: `mean`;
- Der Eingang, der an die Funktion übergeben wird: `c(10, 20, 30)`;
- Der zurückgegebene Wert: `20`.

Viele Funktionen haben optionale Argumente:

```r
mean(c(10, NA, 30), na.rm = TRUE)
```

Mit `na.rm = TRUE` lässt die Funktion fehlende Werte beim Berechnen des Mittelwerts aus. Das Ergebnis ist daher `20`. Ohne dieses Argument ergäbe sich normalerweise `NA`.

Hier ist `na.rm` der Argumentname und `TRUE` der Wert, der für dieses Argument in diesem Funktionsaufruf bereitgestellt wird.

Benannte Argumente sind leichter zu lesen als Werte, die nur durch Position bereitgestellt werden:

```r
read.csv(file = "cell_metadata.csv", check.names = FALSE)
```

Sie müssen nicht erraten, was der zweite Wert bedeutet. Wenn Sie eine unbekannte Funktion lesen, können Sie ihre Hilfe in R anzeigen:

```r
?mean
args(mean)
```

`?mean` öffnet die Hilfe zur Funktion. `args(mean)` zeigt ihre Argumente an. Bei einer Funktion aus einem Paket hilft die Dokumentation der installierten Version, da Argumente und Voreinstellungen sich ändern können.

## Vektoren: eine Folge von Werten desselben Typs

Ein Vektor ist eine der grundlegendsten Datenstrukturen von R. Im Moment können Sie es sich als eine geordnete Sequenz von Werten vorstellen.

```r
n_genes <- c(820, 410, 1250, 670)
cell_types <- c("T cell", "B cell", "T cell", "Monocyte")
passed_qc <- c(TRUE, FALSE, TRUE, TRUE)
```

In `c()` steht der `c` für combine oder concatenate: Die Funktion verbindet mehrere Werte zu einem Vektor.

Werte in einem Atomvektor werden in den gleichen Basistyp konvertiert. Der folgende Code platziert Zahlen und Text in einem Vektor:

```r
mixed <- c(1, "2", 3)
```

Damit jedes Element den gleichen Typ hat, konvertiert R diese Werte in Text. Die direkte Berechnung des Mittelwerts von `mixed` schlägt dann fehl. Wenn KI-generierter Code versehentlich Text in eine numerische Spalte einfügt, können spätere Berechnungen auf Probleme bei der Typkonvertierung stoßen.

### Operationen auf Vektoren erfolgen meist elementweise

```r
n_genes >= 500
```

Wenn `n_genes` vier Werte enthält, enthält das Ergebnis auch vier logische Werte:

```text
TRUE FALSE TRUE TRUE
```

Dies beantwortet nicht, ob die gesamte Spalte größer oder gleich 500 ist. Es testet jede Position separat.

Wenn zwei Vektoren unterschiedliche Längen haben, wiederholen einige R-Operationen die Werte im kürzeren Vektor. Das nennt man Recycling. Manchmal ist es absichtlich, manchmal erzeugt es Fehler, die schwer zu erkennen sind. Wenn Objekte unterschiedlicher Länge an derselben Operation teilnehmen, überprüfen Sie zuerst `length()` oder die Datendimensionen. Gehen Sie nicht davon aus, dass R sie entsprechend Ihrer biologischen Gruppen übereinstimmen wird.

## Data Frames: unterschiedliche Datentypen in Zeilen und Spalten anordnen

Ein Datenrahmen ist eine übliche tabellarische Struktur in R. Jede Spalte kann einen anderen Typ haben, aber alle Spalten müssen der gleichen Anzahl von Zeilen entsprechen.

Der folgende Code erstellt eine komplett fiktive Zelltabelle:

```r
cells <- data.frame(
  cell_id = c("cell_1", "cell_2", "cell_3", "cell_4"),
  sample = c("control", "control", "disease", "disease"),
  n_genes = c(820, 410, 1250, NA),
  percent_mito = c(4.2, 12.8, 6.1, 3.5)
)
```

Man kann es so lesen:

| cell_id | sample | n_genes | percent_mito |
| --- | --- | ---: | ---: |
| cell_1 | control | 820 | 4.2 |
| cell_2 | control | 410 | 12.8 |
| cell_3 | disease | 1250 | 6.1 |
| cell_4 | disease | fehlend | 3.5 |

Diese Zahlen werden nur zur Erläuterung der Syntax verwendet. Sie sind keine empfohlenen Qualitätskontrollschwellenwerte für irgendein Einzelzellexperiment. Reale Schwellenwerte müssen mit dem Gewebe, experimentellem Protokoll, sequenzierender Tiefe, Zelle oder Kerntyp, Verteilungsform und nachgelagertem Ziel im Verstand gewählt werden.

Häufige Prüfungen beim Lesen eines unbekannten Datenrahmens sind:

```r
dim(cells)
names(cells)
head(cells)
str(cells)
```

Sie helfen Ihnen, jeweils zu bestätigen:

- Wie viele Zeilen und Spalten es gibt;
- Was die Spaltennamen sind;
- wie die ersten Zeilen aussehen;
- Der Typ jeder Spalte und die Struktur des gesamten Objekts.

Diese Prüfungen beweisen nicht, dass die Daten biologisch korrekt sind, aber sie können eine leere Tabelle, einen falsch geschriebenen Spaltennamen, als Text importierte Zahlen oder Zeilen und Spalten mit einer anderen Ausrichtung als erwartet aufdecken.

## Matrizen, Listen und spezialisierte Objekte erkennen

Zusätzlich zu Vektoren und Datenrahmen verwendet Bioinformatikcode häufig:

| Struktur | Woran erkennt man sie? | Typische Verwendung |
| --- | --- | --- |
| Matrix | Zeilen und Spalten, deren Elemente in der Regel denselben Grundtyp haben | Genexpressionsmatrizen und Koordinaten nach einer Dimensionsreduktion |
| Liste | Eine Sammlung, die Objekte unterschiedlicher Typen enthalten kann | Mehrere Ergebnisse, Parameter oder verschachtelte Objekte speichern |
| Spezialisiertes Objekt | Ein Objekt, dessen Struktur und Methoden von einem Paket festgelegt werden | Analyseobjekte wie Seurat und SingleCellExperiment |

Derselbe Ausdruck, etwa `object[1]`, kann je nach Objekttyp unterschiedliche Ergebnisse liefern. Prüfen Sie den Typ mit `class(object)` und die Struktur mit `str(object)`. Der Name allein verrät beides nicht.

Große Einzellobjekte können auch eine sparse Matrix verwenden. Eine sparse Matrix zeichnet hauptsächlich Werte auf, die nicht Null sind, wodurch der Speicherbedarf reduziert wird, wenn die meisten Einträge Null sind. Bitten Sie die KI nicht, eine Matrix beiläufig in eine gewöhnliche dichte Matrix zu konvertieren, nur um sie "wie eine normale Tabelle aussehen zu lassen": Diese Konvertierung kann den Speicherverbrauch stark erhöhen.

## Indizierung: mit `[]`, `[[]]` und `$` Teile eines Objekts auswählen

Indizieren bedeutet, einen Teil eines Objekts auszuwählen.

### Positionen werden in R in der Regel ab 1 gezählt

```r
genes <- c("MS4A1", "CD3D", "LYZ")
genes[1]
```

Das Ergebnis ist:

```text
"MS4A1"
```

In R wird die erste Position normalerweise als `1` geschrieben, nicht `0` wie in vielen anderen Programmiersprachen.

### Im Dataframe steht zuerst die Zeile, dann die Spalte

```r
cells[1, 3]
```

Dies bedeutet Zeile 1, Spalte 3.

```r
cells[1, ]
```

Das bedeutet Zeile 1 und alle Spalten. Die Position nach dem Komma leer zu lassen bedeutet "alles in dieser Dimension behalten".

```r
cells[, "n_genes"]
```

Das bedeutet alle Zeilen aus der Spalte `n_genes`.

### Mit `$` wird eine Dataframe-Spalte anhand ihres Namens ausgewählt

```r
cells$n_genes
```

Das Ergebnis ist die Spalte `n_genes`. Das Objekt befindet sich links von `$`, und der Name innerhalb dieses Objekts befindet sich rechts.

### `[]` und `[[]]` können unterschiedliche Strukturen zurückgeben

Für Listen und einige Datenrahmenoperationen:

- `x[i]` behält normalerweise einen Teilmengen-Container;
- `x[[i]]` extrahiert normalerweise ein Element selbst;
- `x$name` extrahiert ein Element oder eine Spalte nach Namen.

Einfache und doppelte eckige Klammern sind nicht austauschbar. Ändert eine KI die Klammern, prüfen Sie mit `class()`, `length()` oder `dim()`, ob Typ, Länge oder Dimensionen des Ergebnisses noch zum nächsten Schritt passen.

## Vergleiche und logische Bedingungen in Filterregeln

Häufige Vergleichsoperatoren sind:

| Ausdruck | Bedeutung |
| --- | --- |
| `x == y` | Ist x gleich y? |
| `x != y` | Unterscheidet sich x von y? |
| `x > y` | Ist x größer als y? |
| `x >= y` | Ist x größer oder gleich y? |
| `x < y` | Ist x kleiner als y? |
| `x <= y` | Ist x kleiner oder gleich y? |

Mit `==` prüfst du, ob zwei Werte gleich sind. Mit `<-` weist du einem Namen einen Wert zu.

Logische Bedingungen können kombiniert werden:

| Ausdruck | Bedeutung |
| --- | --- |
| `!x` | Die logische Verneinung von x |
| `x & y` | Für jedes Element müssen sowohl x als auch y wahr sein |
| `x \| y` | Für jedes Element muss mindestens eine der beiden Bedingungen wahr sein |

Zum Beispiel:

```r
cells$n_genes >= 500 & cells$percent_mito < 10
```

Dies kann übersetzt werden als:

> Für jede Zelle beträgt die Anzahl der nachgewiesenen Gene mindestens 500 und der mitochondriale Prozentsatz liegt unter 10.

Wenn Sie die Richtung eines Symbols ändern, können Sie ändern, welche Zellen beibehalten werden. Wenn Sie den Filtercode überprüfen, lesen Sie jede Bedingung als vollständigen Satz und vergleichen Sie sie mit dem Analyseplan.

In einer `if`-Bedingung können `&&` und `||` stehen. Damit wird eine einzelne Entscheidung über den weiteren Programmablauf getroffen. `&` und `|` verknüpfen Vektoren dagegen üblicherweise elementweise. Schlägt eine KI vor, diese Operatoren auszutauschen, klären Sie zuerst, wie viele Wahrheitswerte der neue Ausdruck liefert.

## Fehlende Werte: `NA`, 0 und den Text `"NA"` unterscheiden

`NA` zeigt an, dass der Wert an einer Position nicht verfügbar ist oder fehlt. Es ist nicht gleich 0:

- 0 kann bedeuten, dass das gemessene Ergebnis Null war;
- `NA` bedeutet, dass an dieser Position kein nutzbarer Wert vorhanden ist.

`NA` unterscheidet sich auch von der Zeichenkette `"NA"`, die einfach aus zwei Buchstaben besteht.

Verwenden Sie den folgenden Code, um auf fehlende Werte zu prüfen:

```r
is.na(cells$n_genes)
```

Nicht verwenden:

```r
cells$n_genes == NA
```

Wenn ein fehlender Wert in einem Vergleich verwendet wird, ist das Ergebnis normalerweise immer noch `NA`, da R nicht bestimmen kann, ob der Vergleich wahr oder falsch ist.

Dies wirkt sich direkt auf die Filterung aus:

```r
keep <- cells$n_genes >= 500 &
  cells$percent_mito < 10
```

Fehlt ein Wert in `n_genes` oder `percent_mito`, kann auch das entsprechende Element von `keep` den Wert `NA` haben. In der Bedingung lässt sich ausdrücklich festlegen, wie solche Fälle behandelt werden.

```r
keep <- !is.na(cells$n_genes) &
  !is.na(cells$percent_mito) &
  cells$n_genes >= 500 &
  cells$percent_mito < 10
```

Dieser Code erfordert explizit, dass sowohl `n_genes` als auch `percent_mito` nicht fehlen, sodass `keep` nur `TRUE` oder `FALSE` enthält.

Dies ist immer noch nur eine rechnerische Regel; es ist nicht automatisch die richtige wissenschaftliche Entscheidung. Fehlende Werte können auf einen Importfehler, einen falschen Spaltentyp, ein Upstream-Programm, das keine Metrik erzeugt hat, oder einen wirklich nicht messbaren Zustand zurückzuführen sein. Bevor Sie sie löschen, finden Sie heraus, warum sie fehlen.

## Zeilen mit einem logischen Vektor filtern

Fahren Sie mit dem fiktiven `cells`-Datenrahmen fort:

```r
keep <- !is.na(cells$n_genes) &
  !is.na(cells$percent_mito) &
  cells$n_genes >= 500 &
  cells$percent_mito < 10

filtered_cells <- cells[keep, ]
```

Der erste Block erstellt einen logischen Vektor mit der gleichen Länge wie die Anzahl der Datenzeilen. Der zweite Block verwendet diesen Vektor, um Zeilen zu behalten, die `TRUE` entsprechen.

Das erwartete Ergebnis ist:

| cell_id | sample | n_genes | percent_mito |
| --- | --- | ---: | ---: |
| cell_1 | control | 820 | 4.2 |
| cell_3 | disease | 1250 | 6.1 |

Dieses Ergebnis enthält nur die Kandidaten-Metadatenzeilen und ihre entsprechenden Zell-IDs. Es bedeutet nicht, dass die Ausdrucksmatrix, andere Omics-Modalitäten, Dimensionsreduktionsergebnisse oder räumliche Koordinaten gleichzeitig gefiltert wurden. In einem realen Projekt muss jedes verwandte Objekt mit verifizierten, stabilen Bezeichnern gefiltert werden. Sie müssen dann bestätigen, dass die Bezeichner, Anzahlen und Reihenfolge nach dem Filtern immer noch übereinstimmen. Paketspezifische Vorgänge werden auf die entsprechenden Analyselektionen verschoben.

Sie können diesen Code in der folgenden Reihenfolge überprüfen:

1. Ist die Länge von `keep` gleich `nrow(cells)`?
2. Enthält `keep` noch `NA`-Werte?
3. Wie viele Zeilen gibt es vor und nach dem Filtern?
4. Welche Zeilen wurden entfernt?
5. Entstanden die Schwellenwerte aus vordefinierten Regeln oder einer Prüfung der Datenverteilungen?

Nützlicher Prüfcode beinhaltet:

```r
length(keep)
table(keep, useNA = "ifany")
nrow(cells)
nrow(filtered_cells)
```

Eine erwartete Anzahl von Ausgabezeilen zeigt nur, dass der Filter gemäß dem Code ausgeführt wurde. Es beweist nicht, dass die Schwellenwerte biologisch angemessen sind.

## Die Pipe `|>`: das Ergebnis an den nächsten Schritt weitergeben

Pipes erscheinen häufig im R-Code:

```r
cells |>
  head(2)
```

Der in R eingebaute Pipe-Operator `|>` übergibt das Ergebnis links an die Funktion rechts. Der obige Code lässt sich daher meist so lesen:

```r
head(cells, 2)
```

Mit einer Pipe stehen die Verarbeitungsschritte in der Reihenfolge, in der man sie liest:

```r
cells |>
  subset(!is.na(n_genes)) |>
  subset(n_genes >= 500)
```

Lesen Sie es von oben nach unten:

1. Beginnen Sie mit `cells`;
2. Zeilen beibehalten, in denen `n_genes` nicht fehlt;
3. Behalten Sie dann Zeilen bei, in denen `n_genes` mindestens 500 ist.

Eine Pipe speichert die Zwischenergebnisse nicht automatisch und garantiert auch nicht, dass jeder Schritt korrekt ist. Wird die Kette unübersichtlich, bitte Codex, die Zwischenergebnisse zu benennen und nach wichtigen Schritten die Zeilen- und Spaltenzahl auszugeben.

Die eingebaute Pipe `|>` gibt es seit R 4.1.0. Erkennt eine ältere Installation sie nicht, prüfen Sie zuerst die R-Version. Daneben gibt es `%>%` aus dem Paket `magrittr`. Mit beiden Schreibweisen lassen sich Schritte verketten, doch die Regeln unterscheiden sich im Detail.

## Aus welchem Paket stammt eine Funktion?

Beide der folgenden Formen sind üblich:

```r
library(dplyr)
filtered_cells <- filter(cells, n_genes >= 500)
```

```r
filtered_cells <- dplyr::filter(cells, n_genes >= 500)
```

`library(dplyr)` lädt das Paket und fügt es an, sodass die exportierten Funktionen direkt nach Namen aufgerufen werden können.

`dplyr::filter` bezeichnet ausdrücklich die Funktion `filter` aus dem Paket `dplyr`. An dieser Schreibweise erkennen Sie den Ursprung der Funktion auch dann, wenn mehrere Pakete eine gleichnamige Funktion anbieten.

Enthält ein logischer Vektor `NA`, kann `cells[keep, ]` in Basis-R Ergebniszeilen mit lauter fehlenden Werten erzeugen. `dplyr::filter()` behält nur Zeilen, für die die Bedingung `TRUE` ergibt. Legen Sie deshalb vorher fest, welche Messwerte fehlen können und wie Sie mit betroffenen Zeilen umgehen.

Wenn Sie eine unbekannte Funktion sehen, fragen Sie zuerst:

- Gehört es zur Basis R oder zu einem Paket?
- Ist dieses Paket in der aktuellen Umgebung installiert?
- Welche Version des Pakets wird verwendet?
- Verändert die Funktion ihr Eingabeobjekt, schreibt sie eine Datei oder gibt sie nur ein neues Objekt zurück?
- Sind die Standardargumente für die aktuellen Daten geeignet?

Erraten Sie das Verhalten nicht allein anhand eines Funktionsnamens. Beispielsweise beschreibt `filter` möglicherweise nicht denselben Vorgang in verschiedenen Paketen oder Kontexten.

## `if`, Schleifen und eigene Funktionen erkennen

Ein KI-generiertes Skript kann Steuerfluss enthalten. Sie müssen es noch nicht selbst schreiben, aber Sie sollten es erkennen.

### `if`: Code ausführen, wenn eine Bedingung erfüllt ist

```r
if (nrow(filtered_cells) == 0) {
  warning("No cells remain after filtering")
}
```

In einfacher Sprache:

> Wenn der gefilterte Datenrahmen 0 Zeilen enthält, wird eine Warnung erzeugt.

Die Klammern `{}` umschließen den Code, der ausgeführt wird, wenn die Bedingung erfüllt ist.

### `for`: Eine Operation für mehrere Elemente wiederholen

```r
marker_genes <- c("MS4A1", "CD3D", "LYZ")

for (gene in marker_genes) {
  print(gene)
}
```

Dieser Code weist jedem Gennamen wiederum das Objekt `gene` zu und druckt es dann aus. In einer echten Schleife müssen Sie auch prüfen, wo jedes Ergebnis gespeichert wird, ob Dateinamen sich gegenseitig überschreiben können und ob die Schleife fortgesetzt wird, nachdem eine Iteration fehlgeschlagen ist.

### `function`: Einen wiederverwendbaren Rechenschritt definieren

```r
calculate_average <- function(values) {
  mean(values, na.rm = TRUE)
}
```

Dieser Code definiert eine Funktion namens `calculate_average`. Es empfängt `values` und gibt ihren Mittelwert zurück, nachdem fehlende Werte ignoriert wurden.

Beim Lesen einer benutzerdefinierten Funktion identifizieren Sie mindestens:

- seine Eingabeargumente;
- Was die Funktion mit der Eingabe macht;
- seine Standardargumente;
- Sein Rückgabewert;
- Ob es Objekte und Dateien außerhalb der Funktion liest oder schreibt.

## Fehler, Warnungen und Meldungen unterscheiden

R kann während der Ausführung verschiedene Arten von Feedback erzeugen:

| Typ | Übliche Bedeutung | Zuerst prüfen |
| --- | --- | --- |
| Fehler | R kann den aktuellen Ausdruck nicht vollständig auswerten | Die erste Fehlermeldung lesen. Existiert das Objekt? Stimmen Funktion und Argumente? |
| Warnung | R führt den Code meist weiter aus, hat aber ein mögliches Problem erkannt | Welcher Schritt hat die Warnung ausgelöst? Ist das Ergebnis noch verwendbar? |
| Mitteilung | Die Software meldet ihren Status oder erläutert einen Vorgang | Nennt die Mitteilung eine Version, eine geänderte Methode oder eine wichtige Voreinstellung? |

"Kein Fehler" bedeutet nicht "keine Warnung", und beides bedeutet nicht, dass die Analyse korrekt ist. KI verwendet manchmal Funktionen, die Meldungen oder Warnungen ausblenden, um die Ausgabe sauberer erscheinen zu lassen. Während der Überprüfung, bestätigen Sie, dass es nicht wichtige Beweise zur gleichen Zeit versteckt hat.

Erscheint in der R-Konsole die Eingabeaufforderung `+`, ist meist der vorherige Ausdruck unvollständig. Häufig fehlt eine schließende Klammer oder ein Anführungszeichen. Mit `+` wartet die Konsole auf die Fortsetzung der Eingabe.

## KI-generierten R-Code systematisch prüfen

Wenn Sie mit Dutzenden von Codezeilen konfrontiert sind, müssen Sie nicht zuerst jedes Symbol durchkämpfen. Beginnen Sie mit der Rekonstruktion des Datenflusses.

### 1. Ausführungsort und verwendete Umgebung prüfen

Notieren Sie die R-Version, die Projektumgebung und die Paketversionen. Die `|>`-Syntax, Funktionsargumente oder Objektstrukturen können versionsabhängig sein.

### 2. Alle externen Eingaben ermitteln

Suchen Sie nach Code, der Dateien, Datenbanken oder Netzwerkressourcen liest, z. B.:

```r
read.csv("cell_metadata.csv")
readRDS("seurat_object.rds")
```

Bestätigen Sie den Pfad, das Dateiformat, die Beispielidentität und die Referenzversion.

### 3. Die wichtigsten Objekte auflisten

Liste der Namen auf der linken Seite der Zuordnungsoperatoren:

```text
cells
keep
filtered_cells
average_genes
```

Schreiben Sie dann eine einfache Beschreibung in einem Satz für jedes Objekt.

### 4. Änderungen an jedem Objekt verfolgen

Überprüfen Sie, wo ein Objekt erstellt, gefiltert, zusammengeführt, umbenannt oder überschrieben wird. Vertrauen Sie nicht darauf, dass ein Objekt wie beabsichtigt gefiltert wurde, nur weil sein Name `filtered` enthält.

### 5. Jeden Filter und Vergleich in einem Satz ausdrücken

Prüfen Sie insbesondere:

- die Richtung von `>` und `<`;
- `&` im Vergleich zu `|`;
- ob Gleichstellung berücksichtigt wird;
- Wie fehlende Werte behandelt werden;
- ob eine Bedingung für Zellen, Proben, Gene oder andere Einheiten gilt;
- Woher Schwellenwerte und Gruppenbeschriftungen stammen.

### 6. Schreibzugriffe und Änderungen am Systemzustand erkennen

Bestätigen Sie den Ausgabepfad, den Dateinamen und ob ein bestehendes Ergebnis überschrieben werden kann. Das Installieren von Paketen, das Löschen von Dateien und das Aufrufen von Systembefehlen ändern ebenfalls den Zustand.

### 7. Wichtige Zwischenergebnisse prüfen

Nach wichtigen Schritten fordern Sie Ausgabe wie:

```r
class(object)
dim(object)
head(object)
summary(object)
```

Wählen Sie Prüffunktionen, die dem Objekttyp entsprechen. Das Drucken eines gesamten großen Einzelzellenobjekts kann langsam und schwer zu lesen sein. Überprüfen Sie stattdessen die Zusammenfassung, Abmessungen und Schlüsselmetadaten.

### 8. Zum Schluss die wissenschaftliche Aussage überprüfen

Syntax sagt Ihnen nur, wie eine Berechnung ausgeführt wird. Sie müssen auch fragen:

- Stellt jede Zeile eine Zelle, einen Kern, einen räumlichen Standort oder eine biologische Probe dar?
- Stimmen die Gruppenbeschriftungen mit der Beispieltabelle überein?
- Was sind die unabhängigen biologischen Replikate?
- Könnten die Filterregeln einen bestimmten Zelltyp systematisch entfernen?
- Stimmen die Genidentifikatoren, das Referenzgenom und die Annotationsversion überein?
- Welche Schlussfolgerungen kann die Berechnung unterstützen und welche nicht?

## Codex um eine überprüfbare Erklärung des Codes bitten

Sie können Codex den Code zusammen mit der folgenden Anfrage geben:

```text
Ändere diesen R-Code vorerst nicht und führe ihn noch nicht aus.

1. Erkläre jeden Abschnitt in der Reihenfolge seiner Ausführung.
2. Liste alle Eingabe- und Ausgabedateien sowie die neu angelegten Objekte auf.
3. Nenne für jedes Objekt den Typ, die erwarteten Dimensionen und die biologische Bedeutung.
4. Beschreibe jede Filterbedingung in Alltagssprache.
5. Kennzeichne, wo fehlende Werte behandelt, Objekte überschrieben, Dateien geschrieben oder gelöscht,
   Pakete installiert oder Systembefehle ausgeführt werden.
6. Markiere alle Stellen, die von einer Paketversion oder vom Standardwert eines Arguments abhängen.
7. Beurteile getrennt, ob der Code syntaktisch ausführbar und ob die Analyse wissenschaftlich validiert ist.
8. Gib den kürzesten Prüfcode an, der nur lesend zugreift. Verändere weder die Daten noch die Umgebung.
```

AIs Erklärung muss ebenfalls geprüft werden. Zu den direktesten Prüfungen gehören:

- Konsultation der offiziellen Funktionsdokumentation für die verwendete Version;
- Inspektion des realen Objekts mit `class()`, `dim()`, `names()` und `str()`;
- Einen Schritt auf einem sehr kleinen Beispiel ausführen;
- Vergleich der Zeilenanzahl und der entfernten Objekte vor und nach dem Filtern;
- Das ursprüngliche Skript und das Ausführungsprotokoll bleiben erhalten.

## Welche Muster im KI-generierten Code verdienen einen genaueren Blick?

Der folgende Code ist nicht unbedingt falsch, sollte aber nicht ohne Verständnis ausgeführt werden:

| Ausdruck | Mögliche Auswirkung | Frage vor der Ausführung |
| --- | --- | --- |
| `rm(list = ls())` | Löscht Objekte aus dem aktuellen R-Arbeitsbereich | Gibt es ungesicherte Objekte oder Nachweise zu den bisherigen Ergebnissen? |
| `setwd("an/absolute/path")` | Ändert das Basisverzeichnis für nachfolgende relative Pfade | Stammt dieser Pfad vom Rechner der Person, die das Skript geschrieben hat? |
| `install.packages(...)` | Ändert die aktive Paketumgebung von R | Soll das Paket in der Projektumgebung installiert und seine Version dokumentiert werden? |
| `na.omit(data)` | Entfernt Zeilen mit fehlenden Werten | Wie viele Zeilen fallen weg und warum fehlen diese Werte? |
| `write.csv(..., "original_input_file.csv")` | Kann eine Eingabedatei überschreiben | Werden die Ergebnisse unter einem neuen Pfad gespeichert, sodass die Ausgangsdaten erhalten bleiben? |
| `unlink(...)` | Löscht eine Datei oder ein Verzeichnis | Welcher Pfad ist genau gemeint? Lässt sich der Inhalt wiederherstellen? |
| `system(...)` | Ruft einen Befehl des Betriebssystems auf | Wo wird der Befehl ausgeführt und was wird er lesen oder ändern? |
| `<<-` | Kann ein Objekt außerhalb der Funktion ändern | Warum wird der globale Zustand verändert? |

Andere Operationen mögen sicher aussehen, können aber dennoch die Schlussfolgerung ändern:

- Daten nur nach Spaltenposition anstelle von Spaltenname auswählen;
- Einen Prozentsatz mit einem Anteil vergleichen, ohne die Einheit zu überprüfen;
- Behandlung jeder Zelle als unabhängiges biologisches Replikat;
- Änderung der Filterschwellenwerte nach Betrachtung der Gruppenergebnisse;
- versteckt jede Warnung;
- Überschreiben von Objekten mit demselben Namen, so dass die ursprünglichen und verarbeiteten Daten nicht unterschieden werden können.

Das Ziel der Überprüfung ist nicht, alle Abkürzungen zu verbieten. Es ist zu wissen, welche Informationen jede Verknüpfung auslässt.

## Das Einstiegsbeispiel Schritt für Schritt verstehen

Lesen Sie nun den Code vom Anfang dieser Lektion noch einmal durch:

```r
cells <- read.csv("cell_metadata.csv")

keep <- !is.na(cells$n_genes) &
  !is.na(cells$percent_mito) &
  cells$n_genes >= 500 &
  cells$percent_mito < 10

filtered_cells <- cells[keep, ]
average_genes <- mean(filtered_cells$n_genes, na.rm = TRUE)
```

In einfacher Sprache:

1. `cell_metadata.csv` aus dem aktuellen Pfad lesen und als Datenrahmen `cells` speichern;
2. für jede Zeile prüfen, dass weder `n_genes` noch `percent_mito` fehlt, dass `n_genes` mindestens 500 beträgt und `percent_mito` unter 10 liegt,
3. Nur Zeilen, die alle vier Bedingungen erfüllen, erhalten `TRUE` in `keep`.
4. `keep` verwenden, um `cells` zu filtern und das Ergebnis als `filtered_cells` speichern;
5. Berechnen Sie den Mittelwert von `n_genes` unter den gefilterten Zellen, indem Sie alle fehlenden Werte während der Berechnung entfernen.
6. Speichern Sie den Mittelwert als `average_genes`.

Geben Sie einen Ausdruck ohne Zuweisung direkt in der R-Konsole ein, wird sein Ergebnis meist automatisch angezeigt. Bei der Ausführung mit `source()` oder als Skript können Sie sich darauf nicht verlassen. Weisen Sie das Ergebnis einem Objekt zu und geben Sie es mit `print(average_genes)` aus oder schreiben Sie es bei Bedarf in eine Datei.

Wichtige Fragen zu diesem Code müssen die Forscher noch beantworten:

- Ist die Eingabedatei wirklich die Zellmetadaten für das aktuelle Projekt?
- Sind die Spaltennamen und Einheiten korrekt?
- Was ist die Grundlage für die Schwellenwerte `500` und `10`?
- Sollten auch andere Qualitätskennzahlen geprüft werden?
- Wie viele Zellen wurden aus jeder Probe erhalten?
- Könnten diese Regeln die Ergebnisse für bestimmte Gewebe, Zelltypen oder Kerndaten systematisch verfälschen?
- Warum ist die endgültige Berechnung die durchschnittliche Anzahl von Genen pro Zelle, und welche Frage soll sie beantworten?

Code zu verstehen bedeutet nicht, jedes Satzzeichen vorherzusagen. Es bedeutet, das rechnerische Verfahren von den wissenschaftlichen Entscheidungen zu trennen und zu erkennen, welche Beweise noch fehlen.

## Welche Fähigkeiten solltest du nach dieser Lektion beherrschen?

Wenn Sie auf R-Code stoßen, müssen Sie ihn nicht aus dem Speicher neu schreiben, aber Sie sollten zumindest in der Lage sein:

- Objekte, Zuordnungen, Funktionen, Argumente, Kommentare und Zeichenketten erkennen;
- Vektoren, Datenrahmen, Matrizen, Listen und spezialisierte Objekte unterscheiden;
- Allgemeine Indizierung, Vergleiche, logische Bedingungen und Pipes verstehen;
- wissen, dass `NA` explizit behandelt werden muss;
- Eingaben, Objektänderungen und Ausgaben verfolgen;
- Vorgänge finden, die Objekte überschreiben, die Umgebung ändern oder Dateien löschen können;
- KI-Erklärungen mit realen Objektstrukturen und offizieller Dokumentation vergleichen;
- Erläutern, welche Validierungen zwischen erfolgreicher Codeausführung und einer gültigen biologischen Schlussfolgerung noch erforderlich sind.

In einer Zeit, in der KI Code schnell generieren kann, kann das Auswendiglernen der Syntax weniger wichtig werden, aber das Verstehen von Code wird noch wichtiger. Je schneller Code generiert wird, desto wichtiger ist es, dass jemand genau sieht, was er macht.

## Quellen

1. [R Core Team: Eine Einführung in R](https://cran.r-project.org/doc/manuals/r-release/R-intro.html)
2. [R Core Team: Die Definition der R-Sprache](https://cran.r-project.org/doc/manuals/r-release/R-lang.html)
3. [Offizielle R-Dokumentation: Zuweisungsoperatoren](https://stat.ethz.ch/R-manual/R-patched/library/base/html/assignOps.html)
4. [Offizielle R-Dokumentation: Teile eines Objekts extrahieren oder ersetzen](https://stat.ethz.ch/R-manual/R-patched/library/base/html/Extract.html)
5. [Offizielle R-Dokumentation: Datenrahmen](https://stat.ethz.ch/R-manual/R-patched/library/base/html/data.frame.html)
6. [Offizielle R-Dokumentation: Fehlende Werte, `NA`](https://stat.ethz.ch/R-manual/R-patched/library/base/html/NA.html)
7. [Offizielle R-Dokumentation: Relationale und logische Operatoren](https://stat.ethz.ch/R-manual/R-patched/library/base/html/Comparison.html)
8. [Offizielle R-Dokumentation: Das eingebaute Pipe `|>`](https://stat.ethz.ch/R-manual/R-patched/library/base/html/pipeOp.html)
9. [Offizielle R-Dokumentation: Pakete und Funktionsnamespaces laden](https://stat.ethz.ch/R-manual/R-patched/library/base/html/library.html)
10. [Offizielle R-Dokumentation: Skripte mit `source()` ausführen](https://stat.ethz.ch/R-manual/R-patched/library/base/html/source.html)
11. [Offizielle dplyr-Dokumentation: Zeilen, die einer Bedingung mit `filter()` entsprechen, beibehalten](https://dplyr.tidyverse.org/reference/filter.html)
