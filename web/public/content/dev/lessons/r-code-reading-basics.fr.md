# 0.3 | Lire et comprendre le code R : les bases de la syntaxe

Vous donnez à Codex une table d’indicateurs de qualité par cellule et lui demandez de sélectionner les cellules à conserver. Il vous propose ce code R :

```r
cells <- read.csv("cell_metadata.csv")

keep <- !is.na(cells$n_genes) &
  !is.na(cells$percent_mito) &
  cells$n_genes >= 500 &
  cells$percent_mito < 10

filtered_cells <- cells[keep, ]
average_genes <- mean(filtered_cells$n_genes, na.rm = TRUE)
```

Même si vous n'avez pas l'intention d'écrire ce code vous-même à partir d'une page vierge, vous devez quand même être capable de répondre :

- Quel fichier le code lit-il ?
- Que contiennent les `cells`, `keep` et `filtered_cells` ?
- Quelles cellules seront conservées ?
- Comment sont traitées les valeurs manquantes ?
- Que calcule la dernière ligne ?
- D’où viennent les `500` et `10`, et sont-ils adaptés à vos données ?

Si vous ne pouvez pas répondre à ces questions, vous ne pouvez pas savoir si le code traite les données correctes ou supprime silencieusement des cellules qui auraient dû être conservées.

Le but de cette leçon n'est pas de vous faire mémoriser la syntaxe de R, et certainement pas de vous faire reproduire des programmes à partir de mémoire sans documentation. Ce que vous devez développer, c'est la capacité de lire le code : lorsque vous voyez un morceau de code R, vous devriez être capable d'identifier où les données entrent, comment elles changent, où vont les résultats et quelles décisions analytiques restent sous la responsabilité du chercheur.

Cette leçon suppose que vous savez déjà que R est un environnement pour le calcul statistique et l'analyse de données, et que les packages et les environnements de projet affectent l'exécution du code. Vous n'avez pas besoin d'installer un logiciel à l'avance, et aucune expérience de programmation n'est requise.

Les blocs de code dans cette leçon sont principalement pour la lecture ; vous n'avez pas besoin de les exécuter maintenant. Si vous voulez suivre, exécutez le code R dans la console R ou un script R. Un nom de fichier sans chemin complet, tel que `"cell_metadata.csv"`, est recherché par rapport au répertoire de travail actuel. Vous pouvez d'abord exécuter `getwd()` pour voir où se trouve ce répertoire.

Lors de votre première lecture, vous pouvez diviser le matériel en deux niveaux :

- **À comprendre :** les objets, l’affectation, les fonctions, les tableaux de données (data frames), l’indexation, les conditions logiques, `NA` et le filtrage.
- **À savoir reconnaître pour l’instant :** le recyclage des vecteurs, les matrices creuses, `[[]]`, les différents opérateurs de chaînage, les espaces de noms, les boucles et les fonctions définies par l’utilisateur. Si vous rencontrez ces constructions, demandez une explication à l’IA ou consultez la documentation officielle.

## Même avec le « vibe coding », il faut savoir lire le code

"Vibe coding" est un terme informel. Il s'agit généralement de décrire une tâche en langage naturel et de laisser l'IA générer, modifier et exécuter le code, sans que l'utilisateur ait à taper chaque instruction caractère par caractère.

Cette façon de travailler réduit véritablement le fardeau de mémoriser la syntaxe. Vous pouvez demander au Codex de :

- générer du code R pour une tâche ;
- Expliquer une erreur ;
- Organiser des étapes répétées dans un script ;
- trouver où un objet a été créé ou modifié ;
- vérifier les arguments de la fonction par rapport à la documentation ;
- Exécuter du code et afficher des résultats intermédiaires.

En conséquence, la capacité de tout écrire à partir de zéro n’est plus la seule mesure de la capacité analytique.

Cependant, une requête en langage naturel doit toujours être convertie en opérations de calcul précises. Un ordinateur ne peut pas comprendre une intention vague telle que « supprimer les cellules de faible qualité ». Il ne peut exécuter qu'une condition explicite telle que "supprimer les lignes où `n_genes < 500`". Si l'IA ne comprend pas un nom de colonne, une unité de données, une valeur manquante ou un sens de comparaison, le code peut toujours s'exécuter sans erreur.

Par conséquent, ce cours demande aux débutants de répondre à la norme suivante :

> Vous n'avez pas à écrire du code de mémoire, mais vous devez être capable de traduire le code clé en langage ordinaire et vérifier si cette traduction correspond à la question de recherche.

Cela ne signifie pas que vous devez comprendre tous les mécanismes internes de R. Tout comme la lecture d'un article en anglais ne nécessite pas de devenir linguiste, la lecture du code d'analyse peut commencer avec les structures les plus courantes, tout en consultant la documentation au besoin.

## Reconnaître les éléments d’une ligne de R

Considérons cette ligne :

```r
average_genes <- mean(cells$n_genes, na.rm = TRUE)
```

Vous pouvez le lire de droite à gauche :

1. `cells$n_genes`: prendre la colonne nommée `n_genes` de `cells`;
2. `mean(...)`: appelle la fonction qui calcule la moyenne ;
3. `na.rm = TRUE`: supprimer les valeurs manquantes avant le calcul ;
4. `<-`: donner le résultat produit sur la droite au nom sur la gauche ;
5. `average_genes`: le nom de l'objet qui stocke le résultat.

En langage ordinaire :

> Prenez la colonne contenant le nombre de gènes détectés du tableau cellulaire, calculez sa moyenne après avoir ignoré les valeurs manquantes et stockez le résultat sous `average_genes`.

Ce type de traduction est au cœur de la lecture du code. Vous pouvez rechercher le nom d'une fonction et demander à Codex un argument, mais vous devez être capable d'expliquer l'entrée, l'action, les conditions et le résultat.

## Objets : nommer les données et les résultats dans R

Les choses que R crée et les processus sont généralement appelés objets. Les nombres, le texte, les tableaux, les matrices, les fonctions et les conteneurs de données complexes à cellule unique peuvent tous être des objets.

```r
gene_name <- "MS4A1"
cell_count <- 1200
analysis_ready <- TRUE
```

Ce code crée trois objets :

| Objet | Valeur stockée | Sens courant |
| --- | --- | --- |
| `gene_name` | `"MS4A1"` | Texte |
| `cell_count` | `1200` | Nombre |
| `analysis_ready` | `TRUE` | Valeur logique |

R est sensible à la casse, donc `cell_count`, `Cell_Count` et `CELL_COUNT` sont trois noms différents.

Un nom d'objet devrait aider le lecteur à comprendre son contenu. `cell_metadata` est généralement plus facile à revoir que `x`, et `filtered_cells` est généralement plus simple à suivre que `result2`. Les noms courts peuvent être raisonnables dans une formule ou un calcul temporaire très court, mais ils augmentent le risque de mauvaise lecture d’un flux de travail d’analyse long.

## Affectation avec `<-` : attribuer un nom à un résultat

```r
cell_count <- 1200
```

Vous pouvez lire l'opérateur d'affectation `<-` comme "enregistrer la valeur sur la droite sous le nom sur la gauche." Il se compose de `<` immédiatement suivi de `-`.

R permet également `=` pour l'assignation dans de nombreux endroits, mais une convention commune est :

- utiliser `<-` pour créer ou mettre à jour un objet ;
- Utilisez `=` pour spécifier un argument à l'intérieur d'un appel de fonction.

```r
average_genes <- mean(cells$n_genes, na.rm = TRUE)
```

Cette convention rend plus facile la distinction entre « enregistrer le résultat » et « définir un argument de fonction ».

Assignment peut écraser un objet existant, habituellement sans demander à nouveau :

```r
threshold <- 500
threshold <- 1000
```

Après la deuxième ligne, `threshold` vaut `1000`. Quand vous relisez du code produit par une IA, vérifiez si une affectation ultérieure remplace la valeur que vous aviez repérée.

## Commentaires, guillemets et parenthèses

### Tout ce qui suit `#` est un commentaire

```r
# Cette ligne est un commentaire. R ne l’exécute pas.
threshold <- 500  # Seuil provisoire pour cet exemple, à adapter aux données
```

Tout de `#` à la fin de cette ligne est un commentaire. Un bon commentaire explique pourquoi quelque chose est fait ou d'où vient une décision, plutôt que de simplement lire le code à haute voix.

Les commentaires peuvent devenir obsolètes. Lorsque le code change, un ancien commentaire n'est pas mis à jour automatiquement. Vous devez donc inspecter l'expression qui s'exécute réellement au lieu de faire confiance au commentaire uniquement.

### Les guillemets délimitent le texte

```r
cell_type <- "CD4 T cell"
```

`"CD4 T cell"` est une chaîne de caractères, donc du texte. Sans guillemets, `cell_type` désignerait généralement le nom d’un objet.

```r
cell_type == "CD4 T cell"
```

Cette ligne compare l'objet `cell_type` avec le texte spécifié pour voir s'ils sont égaux.

### Les parenthèses servent à appeler une fonction ou à préciser l’ordre des calculs

```r
mean(c(10, 20, 30))
```

L’appel interne `c(...)` réunit d’abord les trois nombres dans un vecteur. L’appel externe `mean(...)` calcule ensuite leur moyenne.

Les parenthèses peuvent aussi rendre explicite l'ordre des opérations :

```r
1 + 2 * 3
(1 + 2) * 3
```

Ces deux lignes produisent des résultats différents. Lorsque vous voyez une condition complexe, ne devinez pas sa précédence par vue. Demander à l'IA d'ajouter des parenthèses rend souvent le code plus facile à examiner.

## Fonctions : traiter des entrées et renvoyer un résultat

Une fonction peut être comprise comme une opération qui a reçu un nom.

```r
mean(c(10, 20, 30))
```

Cette ligne contient :

- le nom de la fonction : `mean`;
- l'entrée passée à la fonction : `c(10, 20, 30)`;
- La valeur retournée : `20`.

De nombreuses fonctions ont des arguments optionnels :

```r
mean(c(10, NA, 30), na.rm = TRUE)
```

Avec `na.rm = TRUE`, la fonction écarte les valeurs manquantes avant de calculer la moyenne. On obtient donc `20`. Sans cet argument, le résultat serait généralement `NA`.

Ici, `na.rm` est le nom de l'argument, et `TRUE` est la valeur fournie pour cet argument dans cet appel de fonction.

Les arguments nommés sont plus faciles à lire que les valeurs fournies uniquement par position :

```r
read.csv(file = "cell_metadata.csv", check.names = FALSE)
```

Vous n'avez pas à deviner ce que signifie la deuxième valeur. Lors de la lecture d'une fonction inconnue, vous pouvez afficher son aide dans R :

```r
?mean
args(mean)
```

`?mean` ouvre l’aide de la fonction. `args(mean)` en affiche les arguments. Pour une fonction fournie par un paquet, consultez la documentation de la version installée : les arguments et leurs valeurs par défaut peuvent changer.

## Vecteurs : une suite de valeurs de même type

Un vecteur est l'une des structures de données les plus basiques de R. Pour l'instant, vous pouvez le considérer comme une séquence ordonnée de valeurs.

```r
n_genes <- c(820, 410, 1250, 670)
cell_types <- c("T cell", "B cell", "T cell", "Monocyte")
passed_qc <- c(TRUE, FALSE, TRUE, TRUE)
```

Dans `c()`, le `c` signifie combiner ou concaténer : la fonction joint plusieurs valeurs dans un vecteur.

Les valeurs dans un vecteur atomique sont converties au même type de base. Le code suivant place les nombres et le texte dans un seul vecteur :

```r
mixed <- c(1, "2", 3)
```

Pour garder chaque élément du même type, R convertit ces valeurs en texte. Calculer la moyenne de `mixed` directement échouera alors. Si le code généré par l'IA introduit accidentellement du texte dans une colonne numérique, les calculs ultérieurs peuvent rencontrer des problèmes de conversion de type.

### Les opérations sur les vecteurs s’appliquent généralement élément par élément

```r
n_genes >= 500
```

Si `n_genes` contient quatre valeurs, le résultat contient également quatre valeurs logiques :

```text
TRUE FALSE TRUE TRUE
```

Cela ne répond pas à la question de savoir si la colonne entière est supérieure ou égale à 500. Il teste chaque position séparément.

Lorsque deux vecteurs ont des longueurs différentes, certaines opérations R répétent les valeurs dans le vecteur plus court. C'est ce qu'on appelle le recyclage. Parfois, elle est intentionnelle ; d'autres fois, elle crée des erreurs difficiles à remarquer. Lorsque des objets de différentes longueurs participent à la même opération, vérifiez `length()` ou les dimensions des données en premier. Ne présumez pas que R les correspondra en fonction de vos groupes biologiques.

## Data frames : organiser plusieurs types de données en lignes et en colonnes

Une trame de données est une structure tabulaire commune en R. Chaque colonne peut avoir un type différent, mais toutes les colonnes doivent correspondre au même nombre de lignes.

Le code suivant crée une table de cellules entièrement fictive :

```r
cells <- data.frame(
  cell_id = c("cell_1", "cell_2", "cell_3", "cell_4"),
  sample = c("control", "control", "disease", "disease"),
  n_genes = c(820, 410, 1250, NA),
  percent_mito = c(4.2, 12.8, 6.1, 3.5)
)
```

Vous pouvez le lire comme :

| cell_id | sample | n_genes | percent_mito |
| --- | --- | ---: | ---: |
| cell_1 | control | 820 | 4.2 |
| cell_2 | control | 410 | 12.8 |
| cell_3 | disease | 1250 | 6.1 |
| cell_4 | disease | valeur manquante | 3.5 |

Ces numéros sont utilisés uniquement pour expliquer la syntaxe. Ils ne sont pas recommandés comme seuils de contrôle de la qualité pour toute expérience monocellulaire. Les seuils réels doivent être choisis en tenant compte du tissu, du protocole expérimental, de la profondeur de séquençage, du type de cellule ou de noyau, de la forme de distribution et de l'objectif en aval.

Les vérifications courantes lors de la lecture d'une trame de données inconnue comprennent :

```r
dim(cells)
names(cells)
head(cells)
str(cells)
```

Ils vous aident à confirmer, respectivement :

- combien de lignes et de colonnes il y a ;
- quels sont les noms des colonnes ;
- à quoi ressemblent les premières rangées ;
- Le type de chaque colonne et la structure de l'objet entier.

Ces vérifications ne prouvent pas que les données sont biologiquement correctes, mais elles peuvent révéler une table vide, un nom de colonne mal orthographié, des nombres importés en tant que texte ou des lignes et colonnes orientées différemment de ce que vous attendiez.

## Reconnaître les matrices, les listes et les objets spécialisés

En plus des vecteurs et des trames de données, le code bioinformatique utilise souvent :

| Structure | Comment la reconnaître ? | Usage courant |
| --- | --- | --- |
| Matrice | Des lignes et des colonnes dont les éléments ont généralement le même type de base | Matrices d’expression génique et coordonnées après réduction de dimension |
| Liste | Une collection qui peut contenir des objets de types différents | Conserver plusieurs résultats, paramètres ou objets imbriqués |
| Objet spécialisé | Un objet dont la structure et les méthodes sont définies par un paquet | Des objets d’analyse tels que Seurat et SingleCellExperiment |

Une même expression, par exemple `object[1]`, peut donner des résultats de types différents selon l’objet. Avant d’interpréter le code, vérifiez le type avec `class(object)` et la structure avec `str(object)`. Le nom seul ne suffit pas.

Les grands objets à une seule cellule peuvent également utiliser une matrice creuse. Une matrice creuse enregistre principalement des valeurs non nulles, réduisant le stockage requis lorsque la plupart des entrées sont nulles. Ne demandez pas à l'IA d'en convertir une en une matrice dense ordinaire simplement pour la faire « ressembler à une table normale » : cette conversion peut augmenter considérablement l'utilisation de la mémoire.

## Indexation : sélectionner une partie d’un objet avec `[]`, `[[]]` et `$`

Indexer signifie sélectionner une partie d'un objet.

### En R, les positions sont généralement numérotées à partir de 1

```r
genes <- c("MS4A1", "CD3D", "LYZ")
genes[1]
```

Le résultat est :

```text
"MS4A1"
```

Dans R, la première position est généralement écrite comme `1`, et non `0` comme dans de nombreux autres langages de programmation.

### Dans un data frame, on indique la ligne, puis la colonne

```r
cells[1, 3]
```

Cela signifie la ligne 1, colonne 3.

```r
cells[1, ]
```

Cela signifie la ligne 1 et toutes les colonnes. Laisser la position après la virgule vide signifie « garder tout dans cette dimension ».

```r
cells[, "n_genes"]
```

Cela signifie toutes les lignes de la colonne nommée `n_genes`.

### Avec `$`, on sélectionne une colonne d’un data frame par son nom

```r
cells$n_genes
```

Le résultat est la colonne `n_genes`. L'objet est à gauche de `$`, et le nom à l'intérieur de cet objet est à droite.

### `[]` et `[[]]` peuvent renvoyer des structures différentes

Pour les listes et certaines opérations de trame de données :

- `x[i]` conserve habituellement un conteneur de sous-ensemble ;
- `x[[i]]` extrait habituellement un élément lui-même ;
- `x$name` extrait un élément ou une colonne par nom.

Retenez que les crochets simples et doubles ne sont pas interchangeables. Si une IA modifie les crochets, vérifiez avec `class()`, `length()` ou `dim()` que l’objet obtenu a toujours le type, la longueur ou les dimensions attendus à l’étape suivante.

## Comparaisons et conditions logiques dans les règles de filtrage

Les opérateurs de comparaison courants comprennent :

| Expression | Signification |
| --- | --- |
| `x == y` | x est-il égal à y ? |
| `x != y` | x est-il différent de y ? |
| `x > y` | x est-il supérieur à y ? |
| `x >= y` | x est-il supérieur ou égal à y ? |
| `x < y` | x est-il inférieur à y ? |
| `x <= y` | x est-il inférieur ou égal à y ? |

Avec `==`, on vérifie si deux valeurs sont égales. Avec `<-`, on affecte une valeur à un nom.

Les conditions logiques peuvent être combinées :

| Expression | Signification |
| --- | --- |
| `!x` | La négation de x |
| `x & y` | Pour chaque élément, x et y doivent être vrais tous les deux |
| `x \| y` | Pour chaque élément, au moins une des deux conditions doit être vraie |

Par exemple :

```r
cells$n_genes >= 500 & cells$percent_mito < 10
```

Cela peut être traduit comme :

> Pour chaque cellule, le nombre de gènes détectés est au moins 500 et le pourcentage mitochondrial est inférieur à 10.

Changer la direction d'un symbole peut modifier les cellules conservées. Lors de l'examen du code de filtrage, lisez chaque condition comme une phrase complète et comparez-la avec le plan d'analyse.

Dans une condition `if`, vous pouvez rencontrer `&&` et `||`. Ils servent à prendre une décision unique. Les opérateurs `&` et `|` s’emploient couramment pour comparer des vecteurs élément par élément. Si une IA propose d’échanger ces opérateurs, demandez combien de valeurs logiques produira la nouvelle expression.

## Valeurs manquantes : distinguer `NA`, 0 et le texte `"NA"`

`NA` indique que la valeur à une position est indisponible ou manquante. Il n'est pas égal à 0 :

- 0 peut signifier que le résultat mesuré était nul ;
- `NA` signifie qu'il n'y a pas de valeur utilisable à cette position.

`NA` est également différent de la chaîne `"NA"`, qui est simplement un texte composé de deux lettres.

Utilisez le code suivant pour vérifier les valeurs manquantes :

```r
is.na(cells$n_genes)
```

Ne pas utiliser :

```r
cells$n_genes == NA
```

Lorsqu'une valeur manquante est utilisée dans une comparaison, le résultat est généralement toujours `NA`, car R ne peut pas déterminer si la comparaison est vraie ou fausse.

Cela affecte directement le filtrage :

```r
keep <- cells$n_genes >= 500 &
  cells$percent_mito < 10
```

Si `n_genes` ou `percent_mito` manque, la valeur correspondante de `keep` peut elle aussi être `NA`. On peut préciser directement dans la condition comment traiter ces cas.

```r
keep <- !is.na(cells$n_genes) &
  !is.na(cells$percent_mito) &
  cells$n_genes >= 500 &
  cells$percent_mito < 10
```

Ce code exige explicitement que `n_genes` et `percent_mito` ne soient pas manquants, de sorte que `keep` ne contient que `TRUE` ou `FALSE`.

Ce n'est encore qu'une règle de calcul ; ce n'est pas automatiquement la bonne décision scientifique. Les valeurs manquantes peuvent résulter d'un échec d'importation, d'un type de colonne incorrect, d'un programme en amont qui n'a pas produit de métrique ou d'un état véritablement non mesurable. Avant de les supprimer, découvrez pourquoi ils manquent.

## Filtrer les lignes avec un vecteur logique

Continuez avec la trame de données `cells` fictive :

```r
keep <- !is.na(cells$n_genes) &
  !is.na(cells$percent_mito) &
  cells$n_genes >= 500 &
  cells$percent_mito < 10

filtered_cells <- cells[keep, ]
```

Le premier bloc crée un vecteur logique avec la même longueur que le nombre de lignes de données. Le deuxième bloc utilise ce vecteur pour conserver les lignes correspondant à `TRUE`.

Le résultat attendu est :

| cell_id | sample | n_genes | percent_mito |
| --- | --- | ---: | ---: |
| cell_1 | control | 820 | 4.2 |
| cell_3 | disease | 1250 | 6.1 |

Ce résultat contient uniquement les lignes de métadonnées candidates et leurs ID de cellule correspondants. Cela ne signifie pas que la matrice d'expression, les autres modalités omiques, les résultats de réduction dimensionnelle ou les coordonnées spatiales ont été filtrés en même temps. Dans un vrai projet, chaque objet lié doit être filtré en utilisant des identifiants stables et vérifiés. Vous devez ensuite confirmer que les identifiants, les comptes et l'ordre correspondent toujours après le filtrage. Les opérations spécifiques aux paquets sont reportées aux leçons d'analyse pertinentes.

Vous pouvez passer en revue ce code dans l'ordre suivant :

1. La longueur de `keep` est-elle égale à `nrow(cells)` ?
2. `keep` contient-il encore des valeurs `NA` ?
3. Combien de lignes y a-t-il avant et après le filtrage ?
4. Quelles lignes ont été supprimées ?
5. Les seuils proviennent-ils de règles prédéfinies ou de l'inspection des distributions de données ?

Le code de vérification utile comprend :

```r
length(keep)
table(keep, useNA = "ifany")
nrow(cells)
nrow(filtered_cells)
```

Un nombre attendu de lignes de sortie montre seulement que le filtre a fonctionné selon le code. Il ne prouve pas que les seuils sont biologiquement appropriés.

## Le pipe `|>` : transmettre le résultat à l’étape suivante

Les pipes apparaissent souvent dans le code R :

```r
cells |>
  head(2)
```

L’opérateur de chaînage `|>` intégré à R transmet le résultat de gauche à la fonction de droite. Le code ci-dessus se lit donc généralement ainsi :

```r
head(cells, 2)
```

Le chaînage permet d’écrire les étapes de traitement dans l’ordre où on les lit :

```r
cells |>
  subset(!is.na(n_genes)) |>
  subset(n_genes >= 500)
```

Lisez-le de haut en bas :

1. Commencez par `cells`;
2. conserver les lignes où `n_genes` n'est pas manquant ;
3. Puis conserver les lignes où `n_genes` est au moins 500.

Le chaînage ne conserve pas automatiquement tous les résultats intermédiaires et ne garantit pas que chaque étape soit correcte. Si une chaîne devient difficile à suivre, demandez à Codex de nommer les objets intermédiaires et d’afficher le nombre de lignes et de colonnes après les étapes importantes.

Le pipe natif `|>` existe depuis R 4.1.0. Si une ancienne installation ne le reconnaît pas, vérifiez d’abord la version de R. Vous rencontrerez aussi `%>%`, fourni par le paquet `magrittr`. Les deux opérateurs permettent d’enchaîner des étapes, mais certaines règles diffèrent.

## De quel paquet vient une fonction ?

Les deux formes suivantes sont courantes :

```r
library(dplyr)
filtered_cells <- filter(cells, n_genes >= 500)
```

```r
filtered_cells <- dplyr::filter(cells, n_genes >= 500)
```

`library(dplyr)` charge et attache le paquet, permettant à ses fonctions exportées d'être appelées directement par leur nom.

`dplyr::filter` désigne explicitement la fonction `filter` du paquet `dplyr`. Cette écriture permet d’identifier la fonction utilisée même si plusieurs paquets proposent une fonction du même nom.

Dans R de base, si le vecteur logique contient `NA`, l’expression `cells[keep, ]` peut renvoyer des lignes dont toutes les valeurs manquent. De son côté, `dplyr::filter()` conserve uniquement les lignes pour lesquelles la condition vaut `TRUE`. Décidez à l’avance quelles mesures peuvent manquer et ce que vous ferez des lignes concernées.

Lorsque vous voyez une fonction inconnue, demandez d'abord :

- Est-ce qu'il appartient à la base R ou à un package ?
- Ce paquet est-il installé dans l'environnement actuel ?
- Quelle version du package est utilisée ?
- La fonction modifie-t-elle son objet d'entrée, écrit-elle un fichier ou renvoie-t-elle seulement un nouvel objet ?
- Ses arguments par défaut sont-ils adaptés aux données actuelles ?

Ne devinez pas le comportement d'un nom de fonction seul. Par exemple, `filter` peut ne pas décrire la même opération dans différents paquets ou contextes.

## Reconnaître `if`, les boucles et les fonctions personnalisées

Un script généré par IA peut contenir un flux de contrôle. Vous n'avez pas besoin de l'écrire vous-même encore, mais vous devriez le reconnaître.

### `if` : exécuter du code si une condition est remplie

```r
if (nrow(filtered_cells) == 0) {
  warning("No cells remain after filtering")
}
```

En langage ordinaire :

> Si la trame de données filtrée a 0 lignes, produire un avertissement.

Les crochets `{}` entourent le code qui s'exécute lorsque la condition est remplie.

### `for` : répéter une opération pour plusieurs éléments

```r
marker_genes <- c("MS4A1", "CD3D", "LYZ")

for (gene in marker_genes) {
  print(gene)
}
```

Ce code assigne à son tour le nom de chaque gène à l'objet `gene` puis l'imprime. Dans une boucle réelle, vous devez également vérifier où chaque résultat est sauvegardé, si les noms de fichiers peuvent s'écraser les uns les autres, et si la boucle continue après qu'une itération échoue.

### `function` : définir une opération réutilisable

```r
calculate_average <- function(values) {
  mean(values, na.rm = TRUE)
}
```

Ce code définit une fonction nommée `calculate_average`. Il reçoit `values` et retourne leur moyenne après avoir ignoré les valeurs manquantes.

Lors de la lecture d'une fonction personnalisée, identifiez au moins :

- ses arguments d'entrée ;
- ce que la fonction fait à l'entrée ;
- ses arguments par défaut ;
- sa valeur de retour ;
- Si elle lit ou écrit des objets et des fichiers en dehors de la fonction.

## Distinguer erreurs, avertissements et messages

R peut produire différents types de rétroaction pendant son exécution :

| Type | Sens courant | À vérifier en premier |
| --- | --- | --- |
| Erreur | R ne peut pas mener l’évaluation de l’expression à son terme | Lisez la première erreur. L’objet existe-t-il ? La fonction et ses arguments sont-ils corrects ? |
| Avertissement | R poursuit généralement l’exécution, mais a détecté un problème possible | Quelle étape a déclenché l’avertissement ? Le résultat reste-t-il exploitable ? |
| Message | Le logiciel indique son état ou fournit une explication | Le message signale-t-il une version, un changement de méthode ou un comportement par défaut important ? |

"Pas d'erreur" ne signifie pas "pas d'avertissement", et ni l'un ni l'autre ne signifie que l'analyse est correcte. L'IA utilise parfois des fonctions qui cachent les messages ou les avertissements pour rendre la sortie plus propre. Lors de l'examen, confirmez qu'il n'a pas caché des preuves importantes en même temps.

Si la console R affiche l’invite `+`, l’expression précédente est souvent incomplète. Il peut manquer une parenthèse, un guillemet ou une accolade de fermeture. Avec `+`, la console attend la suite de l’expression.

## Relire méthodiquement du code R généré par une IA

Lorsque vous êtes confronté à des dizaines de lignes de code, vous n'avez pas besoin d'examiner chaque symbole en premier. Commencez par reconstruire le flux de données.

### 1. Vérifier où le code s’exécute et dans quel environnement

Enregistrez la version de R, l'environnement du projet et les versions des packages. La syntaxe `|>`, les arguments de fonction ou les structures d'objet peuvent dépendre des versions.

### 2. Repérer toutes les entrées externes

Recherchez le code qui lit les fichiers, les bases de données ou les ressources réseau, tel que :

```r
read.csv("cell_metadata.csv")
readRDS("seurat_object.rds")
```

Confirmez le chemin, le format de fichier, l'identité de l'échantillon et la version de référence.

### 3. Dresser la liste des objets importants

Listez les noms sur le côté gauche des opérateurs d'affectation :

```text
cells
keep
filtered_cells
average_genes
```

Ensuite, écrivez une description d'une phrase en langage clair de chaque objet.

### 4. Suivre les modifications de chaque objet

Vérifiez où un objet est créé, filtré, fusionné, renommé ou écrasé. Ne faites pas confiance à un objet qui a été filtré comme prévu simplement parce que son nom contient `filtered`.

### 5. Exprimer chaque filtre et chaque comparaison en une phrase

Vérifiez en particulier :

- la direction des `>` et `<`;
- `&` comparé à `|`;
- si l'égalité est incluse ;
- comment les valeurs manquantes sont traitées ;
- si une condition s'applique aux cellules, aux échantillons, aux gènes ou à une autre unité ;
- D'où viennent les seuils et les étiquettes de groupe.

### 6. Repérer les opérations qui écrivent dans un fichier ou modifient l’état du système

Confirmez le chemin de sortie, le nom de fichier et si un résultat existant peut être écrasé. L'installation de paquets, la suppression de fichiers et l'appel de commandes système changent également d'état.

### 7. Vérifier les principaux résultats intermédiaires

Après les étapes importantes, demandez des sorties telles que :

```r
class(object)
dim(object)
head(object)
summary(object)
```

Choisissez des fonctions de vérification adaptées au type d'objet. L’impression d’un objet monocellulaire complet peut être lente et difficile à lire. Examinez plutôt son résumé, ses dimensions et ses métadonnées clés.

### 8. Examiner en dernier lieu l’interprétation scientifique

La syntaxe vous indique seulement comment un calcul est exécuté. Vous devez également demander :

- Chaque rangée représente-t-elle une cellule, un noyau, un emplacement spatial ou un échantillon biologique ?
- Les étiquettes de groupe correspondent-elles à l'exemple de tableau ?
- Que sont les réplicats biologiques indépendants ?
- Les règles de filtrage pourraient-elles supprimer systématiquement un type de cellule particulier ?
- Les identifiants de gène, le génome de référence et la version d'annotation correspondent-ils ?
- Quelles conclusions le calcul peut-il appuyer et quelles conclusions il ne peut pas appuyer ?

## Demander à Codex une explication vérifiable du code

Vous pouvez donner le code à Codex avec la requête suivante :

```text
Ne modifie pas ce code R et ne l’exécute pas pour l’instant.

1. Explique chaque partie dans son ordre d’exécution.
2. Liste tous les fichiers d’entrée, les fichiers de sortie et les objets créés.
3. Précise le type de chaque objet, ses dimensions attendues et sa signification biologique.
4. Reformule chaque condition de filtrage en langage courant.
5. Signale le traitement des valeurs manquantes, l’écrasement d’objets, l’écriture
   ou la suppression de fichiers, l’installation de paquets et les commandes système.
6. Signale chaque étape qui dépend de la version d’un paquet ou de la valeur par défaut d’un argument.
7. Distingue la validité syntaxique du code de la validation scientifique de l’analyse.
8. Propose le code de vérification en lecture seule le plus court possible, sans modifier les données ni l’environnement.
```

L'explication de l'IA doit également être vérifiée. Les vérifications les plus directes comprennent :

- en consultant la documentation officielle des fonctions de la version utilisée ;
- inspecter l'objet réel avec `class()`, `dim()`, `names()` et `str()`;
- exécuter une étape sur un très petit exemple ;
- Comparaison du nombre de lignes et des objets supprimés avant et après le filtrage ;
- En conservant le script original et son journal d'exécution.

## Quels motifs repérer dans le code généré par une IA ?

Le code suivant n'est pas nécessairement erroné, mais il ne devrait pas être exécuté sans le comprendre :

| Expression | Effet possible | Question avant l’exécution |
| --- | --- | --- |
| `rm(list = ls())` | Supprime les objets de l’espace de travail R actif | Des objets ou des éléments nécessaires à la vérification restent-ils à enregistrer ? |
| `setwd("an/absolute/path")` | Change le répertoire de base des chemins relatifs utilisés ensuite | Ce chemin correspond-il à l’ordinateur de l’auteur ? |
| `install.packages(...)` | Modifie l’environnement des paquets R actif | Faut-il installer le paquet dans l’environnement du projet et consigner sa version ? |
| `na.omit(data)` | Supprime les lignes qui contiennent des valeurs manquantes | Combien de lignes seront supprimées et pourquoi ces valeurs manquent-elles ? |
| `write.csv(..., "original_input_file.csv")` | Peut écraser un fichier d’entrée | Le résultat sera-t-il écrit à un autre emplacement pour conserver les données d’origine ? |
| `unlink(...)` | Supprime un fichier ou un répertoire | Quel chemin est visé exactement ? Son contenu pourra-t-il être restauré ? |
| `system(...)` | Exécute une commande du système d’exploitation | Où la commande s’exécutera-t-elle et que va-t-elle lire ou modifier ? |
| `<<-` | Peut modifier un objet en dehors de la fonction | Pourquoi modifier l’état global ? |

D'autres opérations peuvent sembler sûres mais peuvent toujours changer la conclusion :

- sélectionner les données uniquement par la position de la colonne au lieu du nom de la colonne ;
- comparer un pourcentage avec une proportion sans vérifier l'unité ;
- traiter chaque cellule comme un réplicat biologique indépendant ;
- changer les seuils de filtrage après avoir examiné les résultats du groupe ;
- cacher chaque avertissement ;
- Écraser des objets avec le même nom afin que les données originales et traitées ne puissent pas être distinguées.

Le but de l'examen n'est pas d'interdire tous les raccourcis. Il s’agit de savoir quelles informations chaque raccourci laisse de côté.

## Reprendre l’exemple initial pas à pas

Maintenant, lisez à nouveau le code du début de cette leçon :

```r
cells <- read.csv("cell_metadata.csv")

keep <- !is.na(cells$n_genes) &
  !is.na(cells$percent_mito) &
  cells$n_genes >= 500 &
  cells$percent_mito < 10

filtered_cells <- cells[keep, ]
average_genes <- mean(filtered_cells$n_genes, na.rm = TRUE)
```

En langage ordinaire :

1. Lire `cell_metadata.csv` à partir du chemin actuel et le stocker comme la trame de données `cells`;
2. pour chaque ligne, vérifier que ni `n_genes` ni `percent_mito` ne manque, que `n_genes` vaut au moins 500 et que `percent_mito` est strictement inférieur à 10 ;
3. Seules les lignes qui répondent aux quatre conditions reçoivent `TRUE` dans `keep`;
4. utiliser `keep` pour filtrer `cells` et stocker le résultat sous `filtered_cells`;
5. calculer la moyenne de `n_genes` parmi les cellules filtrées, en supprimant toute valeur manquante pendant le calcul ;
6. Stocker la moyenne comme `average_genes`.

Quand vous saisissez une expression seule dans la console R, son résultat s’affiche généralement sans affectation. Dans un script lancé avec `source()` ou par un autre moyen, cet affichage automatique n’est pas garanti. Pour garder une trace du résultat, affectez-le à un objet puis appelez explicitement `print(average_genes)` ou écrivez-le dans un fichier.

Les chercheurs doivent encore répondre à des questions importantes sur ce code :

- Le fichier d'entrée est-il vraiment les métadonnées de cellule pour le projet actuel ?
- Les noms de colonne et les unités sont-ils corrects ?
- Quelle est la base des seuils `500` et `10` ?
- D’autres mesures de qualité devraient-elles également être vérifiées ?
- Combien de cellules de chaque échantillon ont été conservées ?
- Ces règles pourraient-elles systématiquement biaiser les résultats pour certains tissus, types de cellules ou données nucléaires ?
- Pourquoi le calcul final est-il le nombre moyen de gènes par cellule, et à quelle question est-il censé répondre ?

Comprendre le code ne signifie pas prédire tous les signes de ponctuation. Cela signifie séparer la procédure de calcul des décisions scientifiques et reconnaître les preuves qui manquent encore.

## Quelles compétences de lecture du code retenir ?

Lorsque vous rencontrez du code R, vous n'avez pas besoin de le réécrire à partir de la mémoire, mais vous devriez au moins être capable de :

- reconnaître les objets, les affectations, les fonctions, les arguments, les commentaires et les chaînes de caractères ;
- distinguer les vecteurs, les trames de données, les matrices, les listes et les objets spécialisés ;
- comprendre l'indexation, les comparaisons, les conditions logiques et les pipelines courants ;
- savoir que `NA` doit être géré explicitement ;
- tracer les entrées, les changements d'objet et les sorties ;
- trouver des opérations qui peuvent écraser des objets, modifier l'environnement ou supprimer des fichiers ;
- vérifier l'explication de l'IA par rapport aux structures d'objets réels et à la documentation officielle ;
- Expliquer quelles validations sont encore nécessaires entre l'exécution réussie du code et une conclusion biologique valide.

À une époque où l’IA peut générer du code rapidement, mémoriser la syntaxe peut devenir moins important, mais comprendre le code devient encore plus important. Plus le code est généré rapidement, plus il est important pour quelqu'un de voir exactement ce qu'il fait.

## Références

1. [R Core Team : Une introduction à R](https://cran.r-project.org/doc/manuals/r-release/R-intro.html)
2. [R Core Team : La définition du langage R](https://cran.r-project.org/doc/manuals/r-release/R-lang.html)
3. [Documentation officielle R : Opérateurs d'assignation](https://stat.ethz.ch/R-manual/R-patched/library/base/html/assignOps.html)
4. [Documentation officielle R : Extraire ou remplacer des parties d'un objet](https://stat.ethz.ch/R-manual/R-patched/library/base/html/Extract.html)
5. [Documentation officielle R : Trames de données](https://stat.ethz.ch/R-manual/R-patched/library/base/html/data.frame.html)
6. [Documentation officielle R : Valeurs manquantes, `NA`](https://stat.ethz.ch/R-manual/R-patched/library/base/html/NA.html)
7. [Documentation officielle R : Opérateurs relationnels et logiques](https://stat.ethz.ch/R-manual/R-patched/library/base/html/Comparison.html)
8. [Documentation officielle R : Le tube de base `|>`](https://stat.ethz.ch/R-manual/R-patched/library/base/html/pipeOp.html)
9. [Documentation officielle R : Chargement des paquets et espaces de noms de fonctions](https://stat.ethz.ch/R-manual/R-patched/library/base/html/library.html)
10. [Documentation officielle R : Exécuter des scripts avec `source()`](https://stat.ethz.ch/R-manual/R-patched/library/base/html/source.html)
11. [Documentation officielle dplyr : Conserver les lignes qui correspondent à une condition avec `filter()`](https://dplyr.tidyverse.org/reference/filter.html)
