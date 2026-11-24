# 0.4 | Lire et comprendre le code Python : les bases de la syntaxe

Vous donnez à Codex une table d’indicateurs de qualité par cellule et lui demandez de sélectionner les cellules à conserver. Il vous propose ce code Python :

Ici, `cell_metadata.csv` est une table fictive de métadonnées cellulaires. Chaque ligne correspond à une cellule dont la qualité reste à évaluer. `cell_id` identifie la cellule et `sample_id` son échantillon biologique d’origine. `n_genes` indique le nombre de gènes détectés dans cette cellule. `percent_mito` indique le pourcentage du total des comptages attribué aux gènes mitochondriaux : la valeur `10` signifie donc 10 %, et non 0,10. Ces noms de champs et ces seuils sont propres à l’exercice. Pour des données réelles, vérifiez-les à partir de la documentation de l’objet, du protocole expérimental et des unités.

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

Ce code sert d’exemple tout au long de la leçon. Nous examinerons les points suivants dans l’ordre :

- Les données proviennent de `cell_metadata.csv`.
- `cells`, `missing_columns`, `keep` et `filtered_cells` font référence à des objets à différents stades.
- L'indentation détermine si `raise` appartient au bloc `if`.
- Les conditions de filtrage déterminent conjointement quelles lignes sont conservées et comment les valeurs manquantes sont traitées.
- Les parenthèses extérieures permettent à une condition longue de s'étendre sur plusieurs lignes, tandis que les parenthèses autour des expressions de comparaison assurent que `&` combine les résultats ligne par ligne comme prévu.
- `.loc`, `.copy()` et `.mean()` effectuent respectivement la sélection, la copie et le calcul.
- `500` et `10` sont des seuils qu'un chercheur doit encore juger par rapport aux données actuelles.

Ce n'est que lorsque vous pouvez expliquer ces indices en langage ordinaire que vous pouvez juger si le code lit le bon fichier, utilise les bonnes colonnes ou peut supprimer un signal biologique raisonnable comme s'il s'agissait de données de faible qualité.

Le but de cette leçon n'est pas de vous faire mémoriser la syntaxe Python ou de reproduire un programme à partir de mémoire sans documentation. Vous devez développer une capacité de lecture du code : lorsque vous voyez du code Python, vous devriez être capable d'identifier où les données entrent, comment elles changent, où va la sortie et quelles décisions computationnelles restent la responsabilité du chercheur.

Cette leçon suppose que vous savez déjà que Python est un langage de programmation couramment utilisé pour le traitement des données, l'automatisation et l'analyse bioinformatique, et que les packages et les environnements de projet affectent l'exécution du code. Vous n'avez pas besoin d'installer un logiciel à l'avance, et aucune expérience de programmation n'est requise.

Les blocs de code dans cette leçon sont principalement pour la lecture ; vous n'avez pas besoin de les exécuter maintenant. Si vous voulez suivre, confirmez d'abord où le code sera exécuté : un interpréteur interactif Python, un script avec l'extension `.py` ou un bloc-notes Jupyter. Un nom de fichier sans chemin complet, tel que `"cell_metadata.csv"`, est recherché par rapport au répertoire de travail actuel. En Python, vous pouvez utiliser `Path.cwd()` pour voir cet emplacement.

Lors de votre première lecture, vous pouvez diviser le matériel en deux niveaux :

- **À comprendre :** l’indentation, les noms et l’affectation, les types de données courants, les listes et les dictionnaires, l’indexation et les tranches, les fonctions et les méthodes, les comparaisons et les conditions logiques, les valeurs manquantes, les importations et le filtrage de tableaux.
- **À savoir reconnaître pour l’instant :** les listes en compréhension, les générateurs, les gestionnaires de contexte, les décorateurs, les classes, les annotations de type, les tableaux NumPy, les matrices creuses et AnnData. Si vous rencontrez ces constructions, demandez une explication à l’IA ou consultez la documentation officielle.

Si c'est votre première lecture, suivez quatre chemins courts à travers la leçon. Commencez par comprendre les emplacements d'exécution, les parties d'une ligne de code et l'indentation. Ensuite, comprenez les noms, les objets, les types de base, les listes, les dictionnaires et les ensembles. Ensuite, passez aux fonctions, méthodes, importations, logique ordinaire et logique pandas ligne par ligne. Enfin, lisez les sections sur les valeurs manquantes et le filtrage DataFrame, suivies de l'exemple complet à la fin. Lors d'un premier passage, vous n'avez besoin que de reconnaître les tuples, `while`, les listes de compréhension et la liste détaillée des opérations risquées ; vous n'aviez pas besoin de les mémoriser ou de les écrire.

À l'exception de la section qui lit l'exemple d'ouverture dans son intégralité, les blocs de code plus courts de cette leçon sont principalement des fragments de lecture qui dépendent des objets introduits précédemment. Ne présumez pas que chaque fragment est un script complet qui peut s'exécuter seul.

## Même avec le « vibe coding », il faut savoir lire le Python

"Vibe coding" est un terme informel. Cela signifie généralement décrire une tâche en langage naturel et laisser l'IA générer, modifier et exécuter le code, sans que l'utilisateur ait à taper chaque instruction caractère par caractère.

Cette façon de travailler réduit véritablement le fardeau de mémoriser la syntaxe. Vous pouvez demander au Codex de :

- générer du code Python pour une tâche ;
- expliquer un traceback, qui est le chemin d'appel affiché lorsqu'une erreur se produit ;
- Organiser des étapes répétées dans un script ;
- déterminer où un nom a été attribué ou modifié ;
- vérifier les arguments des fonctions par rapport à la documentation officielle ;
- Exécuter du code et montrer des résultats intermédiaires importants.

Par conséquent, la capacité de tout écrire à partir de zéro n’est plus la seule mesure de la compétence analytique.

Cependant, les requêtes en langage naturel sont toujours converties en opérations exactes. Un ordinateur ne comprend pas automatiquement la conception expérimentale derrière « supprimer les cellules de faible qualité ». Il n'exécute qu'une condition telle que « conserver les lignes où `n_genes >= 500` et `percent_mito < 10` ». Si l'IA ne comprend pas un nom de colonne, une unité de pourcentage, une valeur manquante ou un sens de comparaison, le code peut toujours s'exécuter correctement.

Pour cette raison, ce cours demande aux débutants de répondre à la norme suivante :

> Vous n'avez pas à écrire Python de mémoire, mais vous devez être capable de traduire du code important en langage ordinaire et vérifier si cette traduction correspond à la question de recherche.

Cela ne signifie pas que vous devez comprendre tous les mécanismes internes de Python. Vous pouvez commencer par apprendre les structures les plus courantes dans le code d'analyse et consulter la documentation au besoin.

## Où le code Python s’exécute-t-il ?

Le même code Python peut apparaître à différents endroits. Son emplacement d'exécution affecte la façon dont vous l'entrez, le répertoire de travail, les objets déjà existants et la manière dont les résultats sont affichés.

### L’interpréteur interactif

Entrer `python`, ou `python3` sur certains systèmes, dans un terminal peut démarrer l'interpréteur interactif Python. Un prompt commun est :

```text
>>>
```

Dans un tutoriel, `>>>` signifie "l'entrée commence ici"; il ne fait pas partie du code. Ne copiez pas l'invite lors de la copie d'un exemple.

Dans l'interpréteur interactif, la saisie d'une expression directement affichera généralement son résultat :

```python
2 + 3
```

```text
5
```

Si la même ligne apparaît dans un script `.py`, cependant, le script n'affichera pas de manière fiable un résultat simplement parce qu'il contient une expression. Lorsque la sortie doit être visible, utilisez `print()`, le journal ou écrivez explicitement le résultat dans un fichier.

### Le script Python

Un fichier texte avec l'extension `.py` est communément appelé un script Python. Par exemple :

```text
filter_cells.py
```

Un script est adapté pour enregistrer une séquence d'étapes pouvant être exécutées à plusieurs reprises. La commande de terminal pourrait être :

```text
python filter_cells.py
```

C'est une commande de terminal et ne doit pas être placée dans un bloc de code Python. Le fait que le script puisse être exécuté dépend également du Python que le terminal appelle réellement, si les paquets requis sont installés dans l'environnement actuel et si le répertoire de travail actuel est correct.

### Le notebook Jupyter

Un bloc-notes Jupyter divise le code en plusieurs cellules. Il est utile pour l'exploration étape par étape, mais les cellules ne sont pas nécessairement exécutées dans l'ordre dans lequel elles apparaissent de haut en bas.

Si un nom n'existe que dans la mémoire du noyau actuel, il disparaît au redémarrage du noyau. Si vous exécutez une cellule inférieure puis revenez pour modifier une cellule supérieure, l'ordre de code visible sur la page peut également différer de l'ordre d'exécution réel.

Lors de l'examen d'un carnet, vérifiez donc :

- s'il peut être exécuté correctement à partir d'un nouveau noyau ;
- quelle cellule crée chaque nom en premier ;
- si les résultats en aval sont recalculés après une modification de cellule en amont ;
- Si les résultats importants existent seulement en mémoire.

### Vérifier la version et le répertoire de travail

Ce qui suit est une commande de terminal :

```text
python --version
```

Ce qui suit est le code Python :

```python
import sys
from pathlib import Path

print(sys.version)
print(Path.cwd())
```

Ne présumez pas qu'une fenêtre de code utilise la version et l'environnement que vous attendez simplement parce que son titre dit "Python". La version, le chemin de l'interpréteur, l'environnement du projet et le répertoire de travail peuvent tous affecter le résultat.

## Les éléments d’une ligne de Python

Considérons cette ligne :

```python
average_genes = filtered_cells["n_genes"].mean()
```

Vous pouvez le lire de droite à gauche :

1. `filtered_cells["n_genes"]`: prendre la colonne nommée `n_genes` de la table ;
2. `.mean()`: appelle la méthode fournie par cette colonne pour calculer la moyenne ;
3. `=`: lier le résultat sur la droite au nom sur la gauche ;
4. `average_genes`: utilisez ce nom pour vous référer au résultat calculé plus tard.

En langage ordinaire :

> Prendre la colonne `n_genes` de la table des cellules retenues, en calculer la moyenne et donner à ce résultat le nom `average_genes`.

Vous pouvez rechercher les noms de fonction et les paramètres de méthode dans la documentation, mais vous devez toujours être en mesure d'expliquer l'entrée, l'action et le résultat.

## Indentation : comment Python délimite les blocs

De nombreux langages utilisent des accolades pour marquer un groupe de code. Python utilise principalement l'indentation.

```python
if cell_count == 0:
    print("No cells are available for analysis")

print("Check complete")
```

Ce code signifie :

- si `cell_count == 0` est `True`, exécutez le `print()` indenté ;
- La dernière ligne est exécutée que la condition soit remplie ou non car elle est retournée au niveau le plus éloigné.

Le signe `:` à la fin de la ligne `if` annonce un bloc. Toutes les instructions qui appartiennent au même niveau du bloc doivent être indentées de la même façon. On utilise couramment quatre espaces par niveau.

Les deux morceaux de code suivants peuvent tous deux être valides en Python, mais ils signifient des choses différentes.

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

Le premier s'arrête seulement lorsque le nombre de cellules est 0. La seconde s'arrête indépendamment du nombre de cellules. Lorsque l'IA modifie l'indentation, elle peut modifier la logique du programme même si elle ne crée pas d'erreur de syntaxe.

Ne mélangez pas les tabulations et les espaces pour exprimer l'indentation dans le même fichier. Certains mélanges déclenchent un `TabError`; plus dangereusement, le code peut sembler aligné dans un éditeur alors que ses niveaux réels ne correspondent pas à votre intention.

## Noms, objets et affectation

Les nombres, le texte, les listes, les fonctions et les tableaux en Python peuvent tous être traités comme des objets. Un nom permet au code de se référer à nouveau à un objet.

```python
gene_name = "MS4A1"
cell_count = 1200
```

Ici :

- `"MS4A1"` est un objet de chaîne ;
- `1200` est un objet entier ;
- `gene_name` et `cell_count` sont des noms ;
- `=` effectue l'assignation, faisant le nom sur la gauche se référer à l'objet sur la droite.

Python n'exige pas que vous déclariez que "ce nom ne peut contenir qu'un entier à partir de maintenant." Le même nom peut être réattribué :

```python
cell_count = 1200
cell_count = "1200"
```

Après la deuxième ligne, le nom `cell_count` désigne la chaîne `"1200"` au lieu du nombre `1200`. Python accepte cette affectation. En revanche, un calcul ultérieur peut donner un autre résultat ou déclencher une erreur.

### `=` affecte une valeur, `==` compare

```python
cell_count = 1200
cell_count == 1200
```

La première ligne donne une valeur à un nom. La seconde demande si les deux valeurs sont égales, produisant `True` ou `False`.

Lors de l'examen d'une condition, vérifiez particulièrement soigneusement si l'IA a confondu `=` avec `==`.

### Réaffecter un nom et copier un objet

```python
genes = ["MS4A1", "CD3D"]
selected_genes = genes
selected_genes.append("NKG7")
```

À ce stade, `genes` et `selected_genes` désignent la même liste. Toute modification de la liste effectuée à travers l’un des noms est donc visible à travers l’autre.

```python
print(genes)
```

```text
['MS4A1', 'CD3D', 'NKG7']
```

Si vous avez besoin d'une liste externe séparée, faites en sorte que la copie soit explicite :

```python
selected_genes = genes.copy()
```

Les éléments de cet exemple sont des chaînes immuables. Ajouter un gène à `selected_genes` ne modifie donc pas `genes`. Attention à la profondeur de la copie : `list.copy()` copie uniquement la liste extérieure. Si elle contient des objets modifiables, les deux listes peuvent encore partager ces objets.

« L'assignation donne simplement un autre nom à un objet » est un modèle d'introduction utile, mais ce n'est pas un modèle complet de gestion de la mémoire en Python. À ce stade, il suffit de se rappeler que lorsqu'un objet est mutable, vous ne devez pas interpréter automatiquement `a = b` comme "faire une copie séparée qui ne peut pas affecter l'original".

## Commentaires, chaînes de caractères et texte formaté

### Le texte après `#` est généralement un commentaire

```python
# Lire les métadonnées des cellules
cells = pd.read_csv("cell_metadata.csv")
```

Un commentaire n'est pas exécuté dans le cadre du calcul, mais les commentaires peuvent devenir obsolètes. Si le code et un commentaire ne concordent pas, jugez par le code qui s'exécute réellement, la structure de l'objet et le résultat plutôt que de vous fier au seul commentaire.

Si `#` apparaît entre guillemets, il fait simplement partie d'une chaîne de caractères :

```python
color = "#2855c5"
```

### Les guillemets délimitent les chaînes de caractères

```python
gene_name = "MS4A1"
sample_name = 'sample_A'
```

Les guillemets simples et doubles peuvent représenter des chaînes ordinaires. Ajouter des guillemets autour des chiffres les transforme en texte :

```python
threshold_number = 500
threshold_text = "500"
```

`threshold_number` peut servir directement dans une comparaison numérique. `threshold_text` est une chaîne de caractères. Après la lecture d’un fichier CSV, vérifiez le type que Python a attribué à chaque colonne.

### Insérer des valeurs dans du texte avec une f-string

```python
cell_count = 1200
message = f"Retained {cell_count} cells"
print(message)
```

Le préfixe `f` signifie que `{cell_count}` à l'intérieur de la chaîne est remplacé par sa valeur courante.

```text
Retained 1200 cells
```

Une chaîne f est utile pour les journaux et les messages d'erreur. Le contenu à l'intérieur des accolades est toujours exécuté, donc ne le traitez pas comme du texte statique.

## Types de base : nombres, texte, booléens et absence de valeur

| Type | Exemple | Comment lire la valeur ? |
| --- | --- | --- |
| `int` | `1200` | Un entier |
| `float` | `7.5` | Un nombre avec une partie décimale |
| `str` | `"MS4A1"` | Une chaîne de caractères, donc du texte |
| `bool` | `True`, `False` | Les valeurs logiques vrai et faux |
| `NoneType` | `None` | La valeur spéciale de Python qui signale l’absence d’objet |

Vous pouvez utiliser `type()` pour inspecter le type d'un objet :

```python
print(type(1200))
print(type("1200"))
```

```text
<class 'int'>
<class 'str'>
```

NumPy et pandas proposent également des types tels que `int64`, `float64`, `category` et des types de chaînes acceptant les valeurs manquantes. Ils peuvent différer des types intégrés de Python. Pour commencer, déterminez si vous avez affaire à un nombre, un texte, une valeur logique ou une donnée manquante, et si le calcul a un sens pour cette valeur.

### Convertir un type et valider des données

```python
cell_count = int("1200")
```

Cela convertit le texte `"1200"` en un nombre entier. Toutefois :

```python
cell_count = int("twelve hundred")
```

Élève un `ValueError`.

Même une conversion réussie ne prouve pas que la valeur initiale est biologiquement raisonnable. La conversion de `"999999"` en un nombre entier ne prouve pas automatiquement que l'échantillon contient réellement autant de cellules.

## Conteneurs : regrouper plusieurs valeurs

### Liste (`list`)

Une liste utilise des crochets, conserve l'ordre des éléments et peut être modifiée.

```python
marker_genes = ["MS4A1", "CD3D", "NKG7"]
```

Les opérations communes comprennent :

```python
marker_genes.append("LYZ")
gene_count = len(marker_genes)
```

`.append()` modifie la liste originale ; `len()` retourne le nombre d'éléments.

### Tuple (`tuple`)

Un tuple utilise généralement des parenthèses et ne vous permet pas de remplacer ses éléments de la même manière qu'une liste après sa création.

```python
matrix_shape = (1200, 20000)
```

Cela peut signifier qu’une matrice comporte 1 200 lignes et 20 000 colonnes. Pour savoir si elle est organisée en « cellules × gènes » ou en « gènes × cellules », consultez la documentation de l’objet et le code. Ces deux nombres ne suffisent pas à trancher.

### Dictionnaire (`dict`)

Un dictionnaire associe une clé à une valeur.

```python
sample_to_group = {
    "sample_A": "control",
    "sample_B": "treated",
}
```

Récupérer une valeur par clé :

```python
group = sample_to_group["sample_A"]
```

Si la clé n'existe pas, la recherche entre crochets génère un `KeyError`. Certains codes utilisent `.get()`:

```python
group = sample_to_group.get("sample_C")
```

En l’absence de la clé, `.get()` renvoie `None` par défaut. Le programme peut alors continuer avec une information manquante sans signaler d’erreur à cette étape. Vérifiez donc ce que le code fait ensuite de `None`.

### Ensemble (`set`)

Un ensemble stocke des éléments uniques et est généralement écrit avec des accolades.

```python
required_columns = {"cell_id", "sample_id", "n_genes", "percent_mito"}
observed_columns = {"cell_id", "n_genes", "sample_id"}
missing_columns = required_columns - observed_columns
```

Ici, le signe moins signifie la différence de set. `missing_columns` contient des colonnes qui sont requises mais non observées :

```text
{'percent_mito'}
```

Un ensemble n'est pas approprié pour exprimer un ordre de ligne qui doit être préservé. Si l'ordre de sortie affecte un résultat ou un enregistrement, triez-le explicitement.

## Indexation et tranches : Python compte généralement à partir de 0

### Sélectionner un élément d’après sa position

```python
genes = ["MS4A1", "CD3D", "NKG7"]
first_gene = genes[0]
last_gene = genes[-1]
```

Les résultats sont les suivants :

```text
MS4A1
NKG7
```

`[0]` désigne le premier élément. `[-1]` compte depuis la fin et désigne le dernier. Si la position demandée n’existe pas, Python lève une exception `IndexError`.

### Une tranche inclut généralement le début et exclut la fin

```python
genes[0:2]
```

Le résultat contient les deux premiers éléments :

```text
['MS4A1', 'CD3D']
```

Vous pouvez interpréter `0:2` comme l'intervalle positionnel `[0, 2)`: il inclut 0 mais exclut 2.

```python
genes[:2]
genes[1:]
```

Omettre le début signifie commencer au début, et omettre l'arrêt signifie continuer jusqu'à la fin.

### Dans pandas, distinguer l’indexation par étiquette et par position

Dans un tableau pandas :

- `.loc[...]` sélectionne principalement par les étiquettes de ligne, les étiquettes des colonnes ou les conditions logiques ;
- `.iloc[...]` sélectionne par position entière.

```python
cells.loc[keep, ["cell_id", "n_genes"]]
cells.iloc[:5, :2]
```

La première ligne sélectionne des lignes à l'aide d'une condition logique et sélectionne deux colonnes par nom. La deuxième ligne sélectionne les cinq premières lignes et les deux premières colonnes par position.

Ne pas interpréter automatiquement `.loc[0:2]` comme une tranche Python ordinaire. Les tranches d'étiquettes peuvent suivre des règles différentes de « exclure l'arrêt ». Vérifiez les étiquettes d'index et la documentation de l'objet en premier.

## Fonctions : traiter des entrées et renvoyer des résultats

```python
rounded_value = round(7.456, ndigits=2)
```

Cette ligne contient :

- fonction : `round`;
- première entrée passée à la fonction : `7.456`;
- Nom du paramètre : `ndigits`;
- valeur fournie pour ce paramètre : `2`;
- Résultat renvoyé : `7.46`;
- Nom qui stocke le résultat : `rounded_value`.

Un paramètre est un nom d'entrée dans une définition de fonction. La valeur réellement fournie lors de l'appel d'une fonction est souvent appelée un argument. À un niveau d'introduction, il est plus important d'identifier "quelle entrée contrôle quel comportement" que de mémoriser la terminologie.

### Arguments positionnels et arguments nommés

```python
rounded_value = round(7.456, 2)
rounded_value = round(7.456, ndigits=2)
```

Les deux lignes peuvent produire le même résultat. Le second écrit le nom du paramètre explicitement et est souvent plus facile à lire.

Cependant, tous les paramètres ne peuvent pas être modifiés librement sous forme de mots-clés. Avant d'appeler une fonction tierce, vérifiez la signature de la fonction et la documentation officielle pour la version actuelle.

### Enregistrer une valeur de retour ou l’afficher explicitement

```python
average_genes = filtered_cells["n_genes"].mean()
print(average_genes)
```

La première ligne stocke le résultat calculé, et la seconde l'affiche.

Si vous écrivez seulement :

```python
filtered_cells["n_genes"].mean()
```

Le résultat sera généralement affiché dans un interpréteur interactif ou à la fin d'une cellule de bloc-notes. Un script ne doit pas compter sur cet affichage automatique. Une analyse fiable doit explicitement stocker, imprimer, enregistrer ou écrire les résultats importants.

Dans pandas, `Series.mean()` utilise `skipna=True` par défaut : la moyenne ignore les valeurs manquantes. Ici, le filtre impose déjà une valeur présente pour `n_genes`. S’il ne reste aucune ligne, la moyenne s’affiche sous la forme `NaN` et ne peut pas être interprétée. Vérifiez que `filtered_cells.empty` vaut `False` et notez le nombre de lignes retenues. La moyenne est un scalaire numérique. Son type précis (Python, NumPy ou pandas) dépend du type de la colonne et de la version du logiciel.

### Fonction personnalisée : examiner les entrées, la valeur de retour et les effets de bord

```python
def keep_high_gene_cells(table, minimum_genes):
    keep = table["n_genes"].notna() & (table["n_genes"] >= minimum_genes)
    return table.loc[keep].copy()
```

Lorsque vous lisez la fonction, trouvez d'abord :

1. le nom de la fonction après `def`;
2. les paramètres d'entrée entre parenthèses ;
3. ce que fait le code indenté ;
4. ce que `return` retourne ;
5. Si la fonction modifie également un objet externe, un fichier ou un environnement.

Une fonction sans `return` peut encore avoir des effets en écrivant un fichier, en modifiant un objet qui lui est passé ou en changeant l'état global. N'inspectez pas uniquement la valeur de retour.

## Méthodes et attributs : que signifie le point après un objet ?

```python
cells.columns
cells["n_genes"].notna()
```

Les deux lignes utilisent un point, mais elles signifient des choses différentes.

- `.columns` est un attribut contenant les informations portées par l'objet ; ici, il contient les étiquettes de colonne.
- `.notna()` est une méthode, une opération fournie par l'objet et appelée ici.

La différence la plus visible est que les appels de méthode ont généralement des parenthèses, alors que l'accès aux attributs n'en a généralement pas.

Cependant, vous ne pouvez pas déduire une signification scientifique à partir des parenthèses seules. Utilisez le type d'objet et la documentation pour confirmer exactement ce qu'un attribut ou une méthode renvoie.

### Une même méthode peut se comporter différemment selon le type d’objet

```python
genes.copy()
cells.copy()
```

Si `genes` est une liste Python, la première ligne appelle une méthode de liste. Si `cells` est un DataFrame pandas, la deuxième appelle une méthode de pandas. Ces deux méthodes s’appellent `.copy()`, mais la profondeur de la copie et son fonctionnement dépendent du type d’objet.

Par conséquent, en lisant `object.method()`, déterminez d'abord le type de l'objet à gauche du point.

`DataFrame.copy()` ne copie pas récursivement tous les éléments. Par exemple, si une colonne de type `object` contient des objets Python, leur contenu n’est pas recopié récursivement. Avec une copie superficielle comme `deep=False`, le résultat dépend de la version de pandas et du mécanisme de copie à l’écriture (Copy-on-Write). Devant `.copy()`, identifiez le type de l’objet placé à gauche du point, puis consultez la documentation de la version utilisée.

## Modules, paquets et `import`

Python organise le code réutilisable en modules et paquets.

```python
from pathlib import Path
import pandas as pd
```

La première ligne signifie : importer `Path` du module de bibliothèque standard `pathlib`.

Le second moyen : importer le paquet tiers `pandas` et utiliser le nom court `pd` dans le code actuel.

Par conséquent :

```python
pd.read_csv("cell_metadata.csv")
```

signifie appeler la fonction `read_csv()` fournie par pandas.

### Les formes courantes d’importation

```python
import pandas
import pandas as pd
from pathlib import Path
```

Ils ne créent pas exactement les mêmes noms :

- Après `import pandas`, vous écrivez normalement `pandas.read_csv(...)`;
- Après `import pandas as pd`, vous écrivez normalement `pd.read_csv(...)`;
- Après `from pathlib import Path`, vous pouvez écrire `Path(...)` directement.

### Installer un paquet et l’importer

`python -m pip install pandas` est une commande de terminal qui modifie l’environnement logiciel. Vous pouvez suivre cette leçon sans l’exécuter. Avant une installation, vérifiez que `python` désigne bien l’interpréteur du projet. Dans le code Python, `import pandas` charge un paquet déjà installé dans le processus en cours.

Si l'installation et l'exécution utilisent des environnements Python différents, vous pouvez toujours voir ce qui suit après une installation réussie :

```text
ModuleNotFoundError: No module named 'pandas'
```

Dans ce cas, confirmez d'abord le chemin de l'interpréteur et l'environnement du projet plutôt que d'essayer une série de différentes commandes d'installation.

## Comparaisons et conditions logiques

### Les opérateurs de comparaison courants

| Syntaxe | Signification |
| --- | --- |
| `x == y` | Les valeurs sont-elles égales ? |
| `x != y` | Les valeurs sont-elles différentes ? |
| `x < y` | Est-ce que `x` est inférieur à `y` ? |
| `x <= y` | Est-ce que `x` est inférieur ou égal à `y` ? |
| `x > y` | Est-ce que `x` est supérieur à `y` ? |
| `x >= y` | Est-ce que `x` est supérieur ou égal à `y` ? |

Une comparaison produit habituellement `True` ou `False`.

```python
n_genes = 800
n_genes >= 500
```

Le résultat est :

```text
True
```

### Combiner des tests logiques avec `and`, `or` et `not`

```python
n_genes = 800
percent_mito = 6.5

keep = n_genes >= 500 and percent_mito < 10
```

Ceci est approprié pour deux valeurs logiques individuelles.

```python
has_cells = True
has_required_columns = False

ready = has_cells and has_required_columns
```

`ready` est `False`.

### Tester l’appartenance avec `in`

```python
gene_name = "MS4A1"
marker_genes = ["MS4A1", "CD3D", "NKG7"]

is_marker = gene_name in marker_genes
```

Pour un dictionnaire, `in` vérifie les clés par défaut, pas les valeurs :

```python
"sample_A" in sample_to_group
```

### Vérifier avec `is None` si un objet est bien `None`

```python
sample_name = None

if sample_name is None:
    print("Sample name is missing")
```

`is` vérifie si deux noms désignent le même objet. Pour comparer les valeurs de deux nombres ou de deux chaînes, utilisez `==`. Une coïncidence dans un essai ne justifie pas de remplacer cet opérateur par `is`.

Un DataFrame est une table à deux dimensions avec des lignes, des colonnes et des étiquettes. Une Series est une suite à une dimension munie d’un index. Sélectionner une colonne d’un DataFrame renvoie généralement une Series. Pour une variable ordinaire, `n_genes >= 500` donne en général un seul `bool`. L’expression `cells["n_genes"] >= 500`, elle, donne une Series de valeurs logiques avec un résultat pour chaque ligne de la table.

## Pourquoi les filtres pandas utilisent-ils `&` plutôt que `and` ?

Lorsque vous comparez une colonne entière :

```python
cells["n_genes"] >= 500
```

Le résultat n'est pas un `True` ou `False`. C'est une colonne de valeurs logiques correspondant aux lignes.

```text
0     True
1    False
2     True
dtype: bool
```

Pour combiner deux conditions de colonne ligne par ligne, pandas utilise généralement :

- `&`: élément-wise "et"
- `|`: élément-wise "ou"
- `~`: élément-wise "non"

```python
keep = (
    (cells["n_genes"] >= 500)
    & (cells["percent_mito"] < 10)
)
```

Placez chaque condition de comparaison entre parenthèses. Ce n'est pas seulement pour l'apparence ; il empêche également la précédence de l'opérateur d'interpréter l'expression d'une autre manière.

Ne copiez pas le formulaire suivant directement dans un filtre de colonne pandas :

```python
keep = cells["n_genes"] >= 500 and cells["percent_mito"] < 10
```

`and` essaie de réduire la colonne logique entière à une valeur de vérité et émet généralement une erreur indiquant que la valeur de vérité d'une série est ambiguë.

Le choix dépend des objets à combiner. Dans pandas, `&` peut combiner deux colonnes de valeurs logiques, élément par élément. Pour deux valeurs logiques individuelles, on emploie généralement `and`. Examinez donc le résultat de chaque condition avant de choisir l’opérateur.

## Valeurs manquantes : distinguer `None`, `NaN` et `pd.NA`

Les données réelles peuvent représenter des valeurs manquantes de plusieurs façons :

- `None`: la valeur spéciale Python signifiant "aucun objet";
- `NaN`: une représentation commune des valeurs manquantes dans les données numériques ;
- `pd.NA`: le marqueur de valeur manquante utilisé par certains types de données pandas nullables ;
- `NaT`: une représentation commune de valeur manquante dans les données de date et d'heure.

N'utilisez pas les comparaisons d'égalité ordinaires comme un test universel pour toutes ces valeurs manquantes.

```python
value = None
value is None
```

Pour les objets pandas, les formes courantes sont :

```python
cells["n_genes"].isna()
cells["n_genes"].notna()
```

Portez une attention particulière aux points suivants :

- une chaîne vide `""` n'est pas automatiquement traitée comme manquante par chaque vérification de valeur manquante ;
- Que la chaîne `"NA"` soit lue comme manquante peut dépendre des paramètres de lecture ;
- l'infini n'est pas la même chose qu'une valeur manquante ordinaire ;
- La décision de supprimer, de remplir ou de conserver une valeur manquante doit être prise en fonction de la signification des données et de l'objectif analytique.

Dans l'exemple de contrôle qualité :

```python
cells["n_genes"].notna() & cells["percent_mito"].notna()
```

Requiert explicitement que les deux colonnes ne soient pas manquantes. Cela empêche la stratégie de valeur manquante de rester masquée dans le comportement de filtrage ultérieur.

## DataFrame : une table organisée en lignes et en colonnes

Un DataFrame pandas est une table à deux dimensions. À un niveau d'introduction, vous pouvez y penser comme suit :

- Chaque ligne représente habituellement une observation ;
- Chaque colonne représente une variable ;
- l'index de ligne identifie les positions ou les étiquettes de ligne ;
- Les noms des colonnes décrivent ce que chaque colonne signifie.

Par exemple, un tableau de métadonnées de cellule peut être :

| cell_id | sample_id | n_genes | percent_mito |
| --- | --- | ---: | ---: |
| AAAC-1 | sample_A | 900 | 4.1 |
| AAAG-1 | sample_A | 650 | 8.2 |
| AAAT-1 | sample_B | 350 | 3.2 |

Cependant, un DataFrame ne garantit pas automatiquement que « chaque ligne représente une cellule ». Une ligne pourrait plutôt représenter un échantillon, un gène, une localisation spatiale ou une comparaison. Vous devez inspecter la description des données, les identifiants et la forme de l'objet.

### Examiner la structure avant d’écrire une condition de filtrage

```python
print(cells.shape)
print(cells.columns.tolist())
print(cells.head())
print(cells.dtypes)
```

Ces lignes vous aident à inspecter, respectivement :

- le nombre de lignes et de colonnes ;
- les noms des colonnes ;
- les premières rangées ;
- Le type de données de chaque colonne.

`head()` n'affiche qu'un petit nombre de lignes et ne peut pas prouver que le reste du tableau ne contient aucun problème. Selon la tâche, vous devez également inspecter le nombre de valeurs manquantes, les identifiants uniques, les lignes en double, les plages numériques et la distribution au sein de chaque échantillon.

### Filtrer les lignes avec `.loc[keep]` et une condition logique

```python
filtered_cells = cells.loc[keep].copy()
```

Ici :

- `keep` est une condition logique correspondant aux lignes du tableau ;
- `.loc[keep]` sélectionne les lignes où la condition est vraie ;
- `.copy()` crée explicitement un nouvel objet DataFrame, ce qui facilite la distinction entre le résultat filtré et le tableau d'origine.

pandas aligne une Series logique sur le DataFrame grâce aux étiquettes de l’index. Ici, `keep` provient des colonnes de `cells` et correspond donc à cette table. Pour deux tables distinctes, des index identiques comme `0, 1, 2, ...` ne garantissent pas que les lignes désignent les mêmes cellules. Si les index sont incompatibles, pandas peut signaler une erreur. Si les étiquettes coïncident pour des cellules différentes, une ligne peut être sélectionnée à tort sans message d’erreur.

## `if`, boucles et compréhensions : quel code s’exécute ?

### `if` : exécuter du code si une condition est remplie

```python
if missing_columns:
    raise ValueError(f"Missing required columns: {sorted(missing_columns)}")
```

Un ensemble non vide est traité comme vrai dans une condition, et un ensemble vide est traité en tant que faux. L'erreur n'est donc levée que lorsqu'une colonne requise est réellement manquante.

Cette forme est concise, mais un débutant devrait la traduire en une condition complète :

> Si `missing_columns` n'est pas un ensemble vide, arrêtez le programme et signalez les colonnes manquantes.

### `for` : traiter plusieurs éléments l’un après l’autre

```python
for column_name in ["n_genes", "percent_mito"]:
    print(column_name)
```

`column_name` se réfère à chaque élément de la liste à tour de rôle. Le code indenté appartient au corps de la boucle.

Si une boucle modifie une liste, un tableau ou un fichier, vérifiez si ces modifications s'accumulent et si chaque itération traite une cellule, un échantillon ou un gène.

### `while` : répéter une opération tant qu’une condition est vraie

```python
attempt = 0

while attempt < 3:
    print(attempt)
    attempt = attempt + 1
```

Si la condition de boucle reste toujours vraie, le programme peut ne jamais se terminer. Lors de l'examen d'un `while` généré par IA, trouvez l'opération qui finira par rendre la condition fausse.

### Lire une liste en compréhension avant d’apprendre à l’écrire

```python
uppercase_genes = [gene.upper() for gene in marker_genes]
```

Vous pouvez l'étendre comme :

```python
uppercase_genes = []

for gene in marker_genes:
    uppercase_genes.append(gene.upper())
```

Une compréhension peut simplifier le code, mais elle peut aussi compresser plusieurs conditions en une seule ligne. Au niveau de l'introduction, si une ligne est difficile à expliquer, demandez à IA de la développer en une boucle ordinaire avant de la revoir.

## Distinguer erreurs, avertissements et journaux d’exécution

| Symptôme | Sens courant | À vérifier en premier |
| --- | --- | --- |
| `SyntaxError` | Python ne peut pas analyser la syntaxe du code | Examinez la ligne indiquée et celle qui la précède. Vérifiez les parenthèses, les deux-points et les guillemets. |
| `IndentationError` ou `TabError` | Les niveaux d’indentation sont incohérents | Vérifiez les espaces, les tabulations et les limites des blocs |
| `NameError` | Le code utilise un nom qui n’a pas été défini | Retrouvez la ligne ou la cellule du notebook qui devait définir ce nom |
| `TypeError` | L’opération ne convient pas au type de l’objet | Vérifiez le type réel de l’objet et les entrées de la fonction |
| `KeyError` | La clé du dictionnaire ou le nom de colonne demandé n’existe pas | Affichez les clés ou les noms de colonnes et vérifiez l’orthographe et les espaces |
| `FileNotFoundError` | Le fichier est introuvable au chemin indiqué | Vérifiez le répertoire de travail, le chemin et le nom du fichier |
| `ModuleNotFoundError` | L’interpréteur actif ne trouve pas le module | Vérifiez quel interpréteur Python et quel environnement de projet sont actifs |

Une exception non gérée arrête généralement l'exécution en cours. La dernière ligne d'un traceback donne généralement le type d'exception et l'explication immédiate, tandis que le contenu précédent montre quels fichiers, fonctions et lignes de code ont été parcourus.

Ne donnez pas au Codex seulement la dernière ligne. Le traceback complet, la commande d'exécution, la version Python, le répertoire de travail et la structure objet-entrée fournissent plus de preuves pour localiser la cause.

Un avertissement n'arrête normalement pas un programme immédiatement, mais il peut indiquer que :

- une interface va changer ;
- un type de données a été converti automatiquement ;
- un calcul comporte un problème numérique ;
- L'opération en cours peut produire un résultat ambigu.

Un log ou une sortie ordinaire est simplement une information que le programme affiche délibérément ; il ne s'agit pas automatiquement d'une erreur. La fiabilité dépend toujours de ce que le code a enregistré et si les vérifications importantes ont été exécutées.

## Relire méthodiquement du code Python généré par une IA

### 1. Vérifier où le code s’exécute et dans quel environnement

Enregistrez la version de Python, le chemin d'interpréteur, l'environnement du projet, les versions des paquets, le nom du script ou du carnet et le répertoire de travail actuel.

### 2. Repérer toutes les entrées externes

Recherchez les opérations qui peuvent lire des données, telles que :

```python
pd.read_csv(...)
pd.read_excel(...)
Path(...).read_text(...)
open(...)
```

Confirmez le chemin, le format de fichier, le délimiteur, l'encodage, l'échantillon et la version des données de référence.

### 3. Dresser la liste des noms importants et des types d’objets correspondants

Par exemple :

```text
metadata_path → Path, chemin du fichier d’entrée
cells → DataFrame, métadonnées initiales des cellules
keep → Series, une valeur booléenne par ligne
filtered_cells → DataFrame, résultat du filtrage
average_genes → scalaire numérique, souvent affiché sous forme décimale : nombre moyen de gènes détectés parmi les lignes conservées
```

Si vous ne pouvez pas expliquer ce à quoi un nom fait référence, inspectez d'abord où il est créé, son `type()`, sa forme, les noms de colonne et un petit nombre de valeurs d'exemple.

### 4. Suivre les modifications des objets et les réaffectations de noms

Vérifier :

- si le même nom est réattribué ultérieurement ;
- si une méthode modifie un objet en place ;
- si deux noms se réfèrent au même objet mutable ;
- si un bloc-notes dépend de l'état de la cellule ancienne ;
- Si le filtrage crée un nouvel objet ou remplace l'original.

### 5. Exprimer chaque condition en une phrase

Traduire :

```python
(cells["n_genes"] >= 500) & (cells["percent_mito"] < 10)
```

as :

> Pour chaque rangée, exiger que `n_genes` soit au moins 500 et `percent_mito` inférieur à 10.

Ensuite, continuez en demandant la base pour les seuils, les unités, la politique de valeur manquante et les distributions entre les échantillons.

### 6. Repérer les opérations qui écrivent des fichiers, utilisent le réseau ou modifient l’environnement

Recherchez pour :

```python
to_csv(...)
write_text(...)
unlink(...)
shutil.rmtree(...)
subprocess.run(...)
os.environ[...]
```

Avant l'exécution, confirmez le chemin cible, le comportement d'écrasement, le contenu de la commande, la source de téléchargement et la gestion des informations d'identification.

### 7. Examiner les principaux résultats intermédiaires

Au minimum, inspecter :

- la forme du tableau d'entrée et les noms des colonnes ;
- si les identifiants sont uniques ;
- le nombre de valeurs manquantes ;
- combien de lignes chaque condition conserve à elle seule ;
- combien de lignes les conditions combinées conservent ;
- le nombre de cellules retenues pour chaque échantillon biologique ;
- Si l'index de sortie correspond aux objets associés.

En regardant seulement le tracé final ou la moyenne finale, on ne peut pas déterminer si un échantillon entier a été perdu au cours d'une étape intermédiaire.

### 8. Examiner en dernier lieu l’interprétation scientifique

Une exécution réussie vous indique seulement que Python a accepté les instructions. Il ne prouve pas automatiquement que :

- les seuils correspondent au protocole actuel de tissu et d'expérience ;
- l'unité de pourcentage a été comprise correctement ;
- chaque rangée représente réellement une cellule plutôt qu'un noyau ou un emplacement spatial ;
- il existe suffisamment de répliques biologiques pour appuyer l'inférence ;
- le filtrage n'excluait pas systématiquement un type de cellule ;
- le génome de référence, l'annotation et les identifiants des caractéristiques sont corrects ;
- La conclusion statistique répond à la question biologique originale.

## Demander à Codex une explication vérifiable du code Python

Une faible demande :

```text
Explique ce code Python.
```

Une demande plus facile à vérifier :

```text
Examine ce code Python comme une analyse bio-informatique à évaluer et explique les choix qu’il met en œuvre.

1. Précise d’abord s’il doit être exécuté dans un terminal, un script Python ou un notebook.
2. Liste les entrées externes, les chemins de sortie et les opérations qui modifient l’environnement.
3. Pour chaque nom important, indique le type d’objet, ses dimensions, son index et les noms de colonnes.
4. Reformule chaque condition de filtrage et explique le rôle des parenthèses, des valeurs manquantes et des opérateurs.
5. Distingue les booléens ordinaires de Python des opérations logiques effectuées élément par élément avec pandas ou NumPy.
6. Indique quelles lignes modifient un objet existant et lesquelles en créent un nouveau.
7. Donne le code minimal de vérification en lecture seule, sans écraser les données ni les fichiers d’origine.
8. Vérifie les comportements importants dans la documentation officielle des versions utilisées de Python, de pandas et des paquets concernés.
9. Termine par les hypothèses biologiques qui exigent encore le jugement du chercheur.
```

L'explication de l'IA nécessite également une vérification. Les types d'objets, les signatures de fonctions, les versions de paquets, les paramètres par défaut et le comportement des valeurs manquantes doivent être vérifiés par rapport à l'environnement réel et à la documentation officielle.

## Quelles opérations proposées par une IA méritent un examen ?

| Syntaxe | Effet possible | Question avant l’exécution |
| --- | --- | --- |
| `data = transformed_data` | Associe le nom à un autre objet | Peut-on encore retrouver l’objet d’origine ? |
| `list_a = list_b` | Les deux noms peuvent désigner la même liste modifiable | Une modification ultérieure sera-t-elle visible à travers les deux noms ? |
| `df.drop(..., inplace=True)` | Modifie directement le DataFrame | Faut-il conserver la table d’origine ? Comment se comporte la version de pandas utilisée ? |
| `df.to_csv(path)` | Crée ou écrase un fichier | Le chemin et le choix de la colonne d’index sont-ils corrects ? Un fichier existant peut-il être écrasé ? |
| `Path(path).unlink()` | Supprime un fichier | Avez-vous vérifié le chemin ? Existe-t-il une sauvegarde ? |
| `shutil.rmtree(path)` | Supprime un répertoire et tout son contenu | Le chemin cible désigne-t-il exactement le répertoire prévu ? |
| `subprocess.run(..., shell=True)` | Exécute une commande via un interpréteur de commandes | La commande contient-elle des entrées non vérifiées ? |
| `pip install ...` | Modifie l’environnement logiciel | Faut-il installer le paquet dans l’environnement du projet et consigner sa version ? |
| `requests.get(url)` | Récupère du contenu sur le réseau | Quelles sont la source, la licence et la taille des données ? Comment les vérifier ? |
| `os.environ["TOKEN"]` | Lit un identifiant d’accès | Risque-t-il de s’afficher à l’écran, dans un journal ou dans un fichier ? |

Toutes ces formes ne sont pas fausses. Ils nécessitent des preuves plus solides avant l'exécution car ils peuvent modifier les données, les fichiers, les environnements ou les systèmes externes.

## Relire l’exemple initial en entier

Supposons que `cell_metadata.csv` contient exactement ce qui suit :

```csv
cell_id,sample_id,n_genes,percent_mito
AAAC-1,sample_A,900,4.1
AAAG-1,sample_A,650,8.2
AAAT-1,sample_B,350,3.2
AACG-1,sample_B,1200,12.5
AACT-1,sample_B,,2.1
AAGA-1,sample_B,800,
```

Les virgules consécutives dans les deux dernières lignes représentent des champs vraiment vides. N'écrivez pas un mot tel que « manquant » dans le fichier CSV. Avec le comportement de lecture par défaut dans cet exemple, pandas reconnaît ces deux champs vides comme des valeurs manquantes.

Les valeurs `500` et `10` sont des seuils fictifs choisis pour expliquer la syntaxe. Dans une véritable analyse unicellulaire, les seuils dépendent du tissu, du protocole, de la profondeur de séquençage, du type de cellule ou de noyau, de la distribution des indicateurs et du but de l’analyse.

### Étape 1 : importer les noms nécessaires

```python
from pathlib import Path

import pandas as pd
```

- `Path` représente et inspecte les chemins.
- `pd` est le nom court que ce code utilise pour les pandas.

### Étape 2 : construire le chemin d’accès et lire le tableau

```python
metadata_path = Path("cell_metadata.csv")
cells = pd.read_csv(metadata_path)
```

- `metadata_path` fait référence à un chemin relatif.
- `pd.read_csv()` lit le fichier CSV.
- `cells` fait référence au DataFrame résultant.

Avant d'exécuter le code, confirmez `Path.cwd()`, le nom de fichier, le délimiteur et l'encodage. Une lecture réussie ne garantit pas que les types de colonne, les marqueurs de valeur manquante ou les unités sont corrects.

### Étape 3 : vérifier la présence des colonnes requises

```python
required_columns = {"cell_id", "sample_id", "n_genes", "percent_mito"}
missing_columns = required_columns - set(cells.columns)
if missing_columns:
    raise ValueError(f"Missing required columns: {sorted(missing_columns)}")
```

- `set(cells.columns)` convertit les noms des colonnes observées en un ensemble.
- Set difference recherche les colonnes requises qui sont manquantes.
- Si l'ensemble n'est pas vide, le programme s'arrête et rapporte explicitement les noms des colonnes.
- `sorted()` est utilisé uniquement pour garder l'ordre des colonnes dans le message d'erreur stable et facile à lire.

La confirmation de l'existence des colonnes ne valide pas leurs types de données, unités, identifiants uniques ou plages numériques.

### Étape 4 : construire une condition de filtrage appliquée à chaque ligne

```python
keep = (
    cells["n_genes"].notna()
    & cells["percent_mito"].notna()
    & (cells["n_genes"] >= 500)
    & (cells["percent_mito"] < 10)
)
```

Pour chaque rangée, exiger :

1. `n_genes` n ' est pas manquant ;
2. `percent_mito` n ' est pas manquant ;
3. `n_genes` est au moins 500 ;
4. `percent_mito` est inférieur à 10.

L'élément correspondant dans `keep` est `True` uniquement lorsque les quatre conditions sont remplies.

### Étape 5 : filtrer puis copier explicitement le résultat

```python
filtered_cells = cells.loc[keep].copy()
```

`.loc[keep]` sélectionne les lignes qui vérifient la condition, puis `.copy()` crée un nouveau DataFrame pour la suite de l’analyse. Dans cet exemple numérique, les modifications ordinaires de cette table ne changent plus directement la table d’origine. Les limites de profondeur de copie décrites plus haut s’appliquent toujours.

Résultat de filtrage attendu :

| cell_id | sample_id | n_genes | percent_mito |
| --- | --- | ---: | ---: |
| AAAC-1 | sample_A | 900 | 4.1 |
| AAAG-1 | sample_A | 650 | 8.2 |

Le résultat attendu contient deux lignes, toutes deux issues de `sample_A`. Il ne reste aucune ligne de `sample_B`. Même si le nombre total de lignes et la moyenne paraissent plausibles, la disparition d’un échantillon entier mérite un examen des seuils, des données d’entrée, des unités et de la qualité de l’échantillon. Dans une analyse de plusieurs échantillons, vérifiez aussi que l’entrée contient les identifiants des échantillons ou des bibliothèques, et notez combien de cellules il reste dans chacun après chaque filtre.

### Étape 6 : calculer la moyenne et l’afficher explicitement

```python
average_genes = filtered_cells["n_genes"].mean()
print(average_genes)
```

La moyenne est :

```text
775.0
```

Cette valeur n'est que la moyenne arithmétique de `n_genes` sur les deux lignes conservées. Elle ne prouve pas que la règle de filtrage est raisonnable et ne peut pas représenter les différences entre des échantillons biologiques indépendants.

Les lignes où `n_genes` manque ont déjà été écartées. Par défaut, pandas ignore les valeurs manquantes dans le calcul d’une moyenne. Si le filtre élimine toutes les lignes, la moyenne peut s’afficher comme `NaN` sans provoquer d’exception. Vérifiez le nombre de lignes restantes ou `filtered_cells.empty` avant toute interprétation.

### Ce code ne filtre pas encore de façon coordonnée les composantes d’un véritable objet de données unicellulaires

Le résultat ici est seulement une table de métadonnées filtrée. Il ne filtre pas automatiquement :

- la matrice d'expression génique ;
- d'autres couches, incorporations et structures graphiques dans AnnData ;
- d'autres modalités dans un objet multi-omiques à cellule unique ;
- coordonnées, images et caractéristiques de localisation dans l'omique spatiale ;
- Afficher d'autres résultats associés par cellule ou emplacement.

Si vos données sont déjà dans un objet AnnData, filtrez généralement l’objet entier selon son axe des observations. Filtrer uniquement une table exportée de `.obs` laisserait les autres éléments inchangés. Filtrer l’objet ajuste aussi `X`, `layers`, `obsm` et `obsp` le long des axes correspondants. Le découpage d’un objet AnnData renvoie normalement une vue. Si vous comptez la modifier, vérifiez si l’opération nécessite `.copy()`.

Ceci n'est qu'un rappel sur les limites des objets. Un objet multimodal ou spatial ne garantit pas que tout son contenu corresponde ligne par ligne à des cellules ou à des emplacements. Les informations partagées telles que les images, les systèmes de coordonnées et les transformations de coordonnées ne peuvent pas recevoir le même masque booléenne mécaniquement. Les opérations spécifiques sur les objets sont laissées pour les leçons ultérieures.

Dans un vrai projet, utilisez des identifiants d'observation vérifiés qui sont globalement uniques au sein du projet pour sélectionner les objets associés de manière cohérente. Les codes-barres des cellules peuvent se répéter dans les échantillons ou les bibliothèques, vous devrez donc généralement combiner l'identifiant de l'échantillon ou de la bibliothèque avec le code-barres. Vérifiez ensuite les relations un-à-un, les ensembles d'identifiants, les comptes et l'ordre. Ne supposez pas simplement que « la ligne 10 dans deux tableaux représente la même cellule ».

## Quelles compétences de lecture du code retenir ?

Lorsque vous rencontrez du code Python, vous n'avez pas besoin de le réécrire depuis la mémoire, mais vous devriez au moins être capable de :

- distinguer les commandes de terminal, la saisie interactive, les scripts et les cellules de bloc-notes ;
- reconnaître l'indentation, les noms, les affectations, les fonctions, les méthodes, les attributs, les commentaires et les chaînes ;
- distinguer les nombres communs, les chaînes de caractères, les valeurs booléennes, `None` et les conteneurs ;
- savoir que l'assignation ne copie pas nécessairement un objet mutable ;
- comprendre la différence fondamentale entre l'indexation à base zéro, les tranches semi-ouvertes, `.loc` et `.iloc`;
- distinguer `=`, `==`, `is None`, `and` et pandas `&`;
- savoir que `None`, `NaN`, `pd.NA` et les chaînes vides ont besoin d'une gestion explicite ;
- tracer les entrées, les changements de noms, les conditions de filtrage et les sorties ;
- trouver des opérations qui peuvent écraser des fichiers, changer un environnement, exécuter un shell ou lire des informations d'identification ;
- vérifier les explications de l'IA par rapport aux structures d'objets réels, aux versions logicielles et à la documentation officielle ;
- Expliquer quelles étapes de validation manquent encore entre l'exécution réussie et une conclusion biologique soutenue.

Maintenant que l’IA peut générer du code rapidement, mémoriser la syntaxe peut devenir moins important, mais comprendre le code devient plus important. Plus le code est généré rapidement, plus il est important pour quelqu'un de confirmer que le code gère les bons objets, applique les bonnes conditions et ne confond pas le succès computationnel avec un soutien scientifique.

## Références

1. [Tutoriel officiel Python : une introduction informelle à Python, commentaires, affectation, chaînes, listes et tranchage](https://docs.python.org/3/tutorial/introduction.html)
2. [Tutoriel officiel Python : `if`, `for` et fonctions](https://docs.python.org/3/tutorial/controlflow.html)
3. [Tutoriel officiel Python : listes, tuples, ensembles et dictionnaires](https://docs.python.org/3/tutorial/datastructures.html)
4. [Tutoriel officiel Python : modules et packages](https://docs.python.org/3/tutorial/modules.html)
5. [Tutoriel officiel Python : erreurs et exceptions](https://docs.python.org/3/tutorial/errors.html)
6. [Référence du langage Python : règles d'indentation](https://docs.python.org/3/reference/lexical_analysis.html#indentation)
7. [Bibliothèque standard Python : `pathlib`](https://docs.python.org/3/library/pathlib.html)
8. [Guide officiel pandas : indexation et filtrage logique](https://pandas.pydata.org/docs/user_guide/indexing.html#boolean-indexing)
9. [Documentation officielle des pandas : `DataFrame.loc`](https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.loc.html)
10. [Documentation officielle pandas : détecter les valeurs manquantes](https://pandas.pydata.org/docs/reference/api/pandas.notna.html)
11. [Documentation officielle des pandas : `DataFrame.copy`](https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.copy.html)
12. [Bibliothèque standard Python : copie superficielle et profonde](https://docs.python.org/3/library/copy.html)
13. [Documentation officielle des pandas : `Series.mean`](https://pandas.pydata.org/docs/reference/api/pandas.Series.mean.html)
14. [Guide officiel des pandas : Copie-sur-écriture](https://pandas.pydata.org/docs/user_guide/copy_on_write.html)
15. [Documentation officielle AnnData : `AnnData`](https://anndata.readthedocs.io/en/stable/generated/anndata.AnnData.html)
