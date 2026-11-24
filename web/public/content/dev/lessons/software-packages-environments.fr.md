# 0.2 | Pourquoi mon code échoue-t-il alors que R ou Python est installé ? Paquets, environnements, dépendances et versions

Vous trouvez en ligne un script d’analyse unicellulaire qui, d’après son auteur, nécessite Python et Scanpy. Vous vérifiez que Python est installé, copiez le code et obtenez le message suivant :

```text
ModuleNotFoundError: No module named 'scanpy'
```

Une autre personne a déjà utilisé Scanpy, mais le même code lui signale un conflit de versions. Une troisième installe Seurat dans R sans erreur. Le lendemain, après avoir ouvert un autre projet, elle ne parvient plus à exécuter l’analyse initiale.

Dans ces trois cas, on pourrait croire que le logiciel est défectueux. Les causes peuvent pourtant se situer à des niveaux différents :

- l'ordinateur ne peut pas trouver R ou Python ;
- le paquet a été installé dans un environnement différent ;
- deux paquets nécessitent des versions incompatibles de la même dépendance ;
- le code utilise une fonctionnalité qui existait dans une version antérieure mais qui a été modifiée dans une version plus récente ;
- un composant du système requis par le paquet est manquant ; ou
- Le R ou Python qui exécute le code n'est pas celui que vous pensez qu'il est.

Cette leçon ne vous demande pas de mémoriser tous les outils d'installation. Son objectif est de construire une carte claire de l'environnement informatique. Lorsque vous voyez un script ou une erreur, vous devez savoir quelle couche inspecter en premier au lieu de tout réinstaller immédiatement.

![Structure en couches d'un environnement informatique : matériel, système d'exploitation, R ou Python, environnement de projet, packages et scripts d'analyse](figures/computational-environment-layers.fr.png)

*Figure 1 | Un script d’analyse s’appuie sur plusieurs couches. Le système d’exploitation sert de fondation. R ou Python interprète le code. Les environnements isolent les logiciels de chaque projet. Les paquets et leurs dépendances fournissent les fonctions que le script applique aux données. Ce schéma original du projet a été créé le 23 juillet 2026 avec l’outil de génération d’images d’OpenAI. Il ne reprend ni logo, ni capture d’écran, ni composition de tiers. Il illustre les relations entre les couches. L’installation précise varie selon les outils.*

## Cinq termes que l’on confond souvent

### 1. R et Python : les langages et leurs interpréteurs

R et Python sont tous deux des langages de programmation. Le code que vous écrivez doit être lu et exécuté par le logiciel correspondant.

Le programme qui lit et exécute le code est ici l’**interpréteur**. L’interpréteur R exécute du code R, celui de Python du code Python. Installer Python suffit pour exécuter du code Python de base. Cela n’installe pas automatiquement des paquets tiers tels que Scanpy ou pandas.

Le même ordinateur peut contenir plusieurs installations Python à la fois, telles que :

- Python installé directement dans Windows ;
- Python à l'intérieur de WSL ;
- Python dans un environnement Conda ; et
- Python dans un environnement virtuel pour un projet particulier.

Toutes ces installations peuvent répondre au nom `python` tout en utilisant des exécutables et des paquets différents. Une situation comparable peut se présenter pour R selon l’installation système, la bibliothèque de paquets du projet ou les modules logiciels fournis sur le serveur.

### 2. Paquets : des collections de fonctions écrites par d’autres

Un **paquet** regroupe du code réutilisable, de la documentation et des fichiers associés.

Par exemple :

- Seurat est un paquet R fréquemment utilisé pour l’analyse des données de cellules individuelles.
- Scanpy est un paquet Python fréquemment utilisé pour l’analyse des données de cellules individuelles.
- ggplot2 fournit des fonctions de traçage pour R ; et
- pandas fournit des fonctions de traitement de tableaux pour Python.

Installer R ou Python, c’est comme obtenir un laboratoire de base. Installer des paquets, c'est comme apporter des microscopes, des centrifugeuses et des pipettes dans ce laboratoire.

L’analogie a une limite : les logiciels ne sont pas des instruments complètement indépendants. Un paquet appelle souvent d'autres paquets ou programmes système, et ils peuvent avoir des exigences de version strictes.

### 3. Dépendances : ce dont un paquet a besoin pour fonctionner

Si le paquet A a besoin du paquet B pour fonctionner, B est une **dépendance** de A.

Les dépendances peuvent se poursuivre à plusieurs niveaux :

```text
Script d’analyse
  → Paquet A
    → Paquet B
      → Bibliothèque logicielle de plus bas niveau
```

Les outils d'installation essaient habituellement de localiser ces dépendances automatiquement, mais « automatique » ne signifie pas qu'ils peuvent toujours trouver une combinaison compatible.

Supposons que le paquet A exige la version 2.0 ou ultérieure d’une dépendance et que le paquet C exige une version strictement antérieure à 2.0 de cette même dépendance. Aucune version ne satisfait les deux contraintes dans un seul environnement. L’outil pip de Python peut alors signaler `ResolutionImpossible`. R ou Bioconductor peuvent de même signaler des paquets trop anciens, trop récents ou indisponibles pour la version utilisée.

### 4. Environnements de calcul : les logiciels et les paramètres qui interviennent ensemble

Un **environnement informatique** désigne ici l’ensemble des conditions dans lesquelles le code d’un projet s’exécute réellement. Il comprend généralement :

- Le système d'exploitation et le type de matériel ;
- la version et l'emplacement de R ou Python ;
- les paquets installés et leurs versions ;
- les bibliothèques de niveau inférieur requises par ces paquets ; et
- Certains chemins d'accès, paramètres régionaux ou autres configurations.

Différents outils d'environnement ne gèrent pas exactement la même gamme de composants.

- Le module `venv` fourni avec Python permet de créer un environnement qui dispose de son propre répertoire de paquets Python pour un projet.
- Un environnement Conda peut gérer Python, R et certaines bibliothèques de bas niveau qui ne sont pas des paquets Python.
- Avec renv, chaque projet R peut disposer de sa propre bibliothèque de paquets. Les informations sur les paquets sont enregistrées dans `renv.lock`.

Leur objectif commun est de réduire les interférences entre les projets.

### 5. Versions : comment un même logiciel évolue

Le même nom de logiciel ne signifie pas que son comportement reste inchangé pour toujours. Les développeurs corrigent les erreurs et ajoutent des fonctionnalités, mais ils peuvent également modifier les paramètres par défaut, les noms de fonctions, les formats de fichiers ou les exigences de dépendance.

Un numéro de version peut prendre la forme `1.4.2`. Beaucoup de projets distinguent version majeure, version mineure et correctif. La compatibilité ne se déduit toutefois pas de la seule position des chiffres. Consultez la documentation et les notes de version du logiciel concerné.

Pour un projet bioinformatique, écrire « nous avons utilisé Scanpy » ou « nous avons utilisé Seurat » ne suffit pas. Indiquez au minimum la version du paquet, sa source d’installation, la version de R ou de Python et le système d’exploitation utilisé.

## Pourquoi prévoir un environnement par projet ?

Imaginez que vous travaillez sur deux projets :

- Le projet A reproduit une étude unicellulaire vieille de deux ans et nécessite des versions plus anciennes du paquet.
- Le projet B est une nouvelle analyse de transcriptomique spatiale et nécessite des versions plus récentes du paquet.

Si chaque paquet est installé dans un environnement partagé, la mise à jour des paquets pour le projet B peut soudainement casser le projet A. Dans l'autre sens, refuser chaque mise à jour pour préserver le projet A peut empêcher le projet B d'être installé.

Un arrangement plus sûr est :

```text
Projet A → Environnement A → Versions validées pour le projet A
Projet B → Environnement B → Versions validées pour le projet B
```

Isoler les environnements réduit le risque qu’une modification apportée à un projet empêche l’autre de fonctionner. La validité de l’analyse dépend aussi de la question biologique, du plan d’échantillonnage, des paramètres choisis et de l’interprétation des résultats.

## Comment consigner un environnement R ou Python

| Type de projet | Outil d’isolation courant | Fichier ou informations à conserver | Informations consignées |
| --- | --- | --- | --- |
| Projet R | renv | `renv.lock`, `sessionInfo()` | R, le système d’exploitation ainsi que les sources et versions des paquets |
| Petit projet Python | `venv` | `requirements.txt` et versions de Python et de pip | Les paquets nécessaires dans l’environnement Python actif |
| Projet de bio-informatique en Python ou combinant plusieurs langages | Conda | `environment.yml` ou un autre fichier d’export | Python/R, les paquets, les canaux et certaines dépendances de plus bas niveau |

Ces fichiers ne sont pas des sauvegardes magiques.

- `requirements.txt` décrit généralement les paquets Python requis. Il ne recense pas forcément tous les programmes de bas niveau installés sur le système.
- `environment.yml` aide à reconstruire un environnement Conda. Les paquets disponibles et leurs variantes compilées peuvent différer selon le système d’exploitation.
- `renv.lock` consigne les paquets d’un projet R et leurs versions. Pour les réinstaller, il peut aussi falloir une version compatible de R, un système d’exploitation adapté et les bons outils de compilation.

Être capable de reconstruire un environnement est beaucoup plus fiable que d'essayer de se souvenir de ce que vous avez installé. Cela ne signifie pas que chaque ordinateur produira nécessairement un environnement complètement identique.

## Quelle installation de R ou Python exécute votre code ?

Les commandes ci-dessous ne sont pas un tutoriel d'installation. Ce sont des outils d'inspection pour localiser un problème.

### Vérifier Python dans un terminal

```bash
python --version
python -m pip --version
python -c "import sys; print(sys.executable)"
```

Ils répondent à trois questions différentes :

1. Quelle version de Python la commande `python` lance-t-elle ?
2. Où se trouve l’installation de pip utilisée par cet interpréteur Python ?
3. Quel est le chemin réel du fichier de l'interpréteur Python actuel ?

La deuxième commande utilise `python -m pip` pour exécuter pip avec l’interpréteur Python que vous venez de vérifier. Avec `pip` seul, le système peut trouver le pip d’une autre installation de Python.

Certains systèmes Linux nomment la commande `python3`. Si les instructions officielles pour le logiciel ou le serveur utilisent `python3`, suivez la nomenclature réelle dans cet environnement plutôt que de remplacer aveuglément chaque commande par `python`.

### Vérifier R dans un terminal et dans une session R

Commencez par exécuter ceci dans un terminal :

```bash
R --version
```

Démarrez ensuite R et exécutez les lignes suivantes dans la console R :

```r
R.version.string
.libPaths()
sessionInfo()
```

Ces commandes affichent la version de R, les répertoires dans lesquels R recherche actuellement des paquets, ainsi que des informations sur la session R en cours, le système d'exploitation et les paquets chargés.

Distinguez le terminal de la console R. Exécutez `R --version` dans le terminal. `R.version.string`, `.libPaths()` et `sessionInfo()` sont du code R à exécuter dans la console R. Une erreur peut simplement indiquer que vous avez utilisé la mauvaise console.

### Si vous utilisez Conda

```bash
conda env list
```

Un astérisque dans la sortie marque habituellement l'environnement actif. Confirmer le nom de l’environnement avant d’installer un paquet vous aide à éviter de mettre des logiciels dans `base` ou dans l’environnement d’un autre projet.

## Que révèlent cinq erreurs courantes ?

| Erreur ou symptôme | Origine probable | À vérifier en premier |
| --- | --- | --- |
| `command not found` ou « is not recognized as an internal or external command » | Le système ne trouve pas le programme | Le programme est-il installé ? Le terminal retrouve-t-il son chemin ? |
| `ModuleNotFoundError` | Le module est absent de l’environnement Python actif | Vérifiez le chemin de l’interpréteur Python et l’environnement dans lequel le paquet a été installé |
| `there is no package called ...` | Le paquet est absent de la bibliothèque utilisée par R | `.libPaths()` et la bibliothèque dans laquelle le paquet a été installé |
| `ResolutionImpossible` ou autre conflit de dépendances | Les contraintes de versions ne peuvent pas être satisfaites simultanément | Quels paquets demandent des versions incompatibles de la même dépendance ? |
| `cannot open shared object file` ou `DLL load failed` | Une bibliothèque système sous-jacente ou un composant compilé | Vérifiez le système d’exploitation, le type de processeur, le nom de la bibliothèque manquante et les exigences officielles |

Le tableau vous indique seulement où chercher en premier. Une seule ligne de texte ne peut pas toujours identifier une cause unique. Lorsque vous demandez de l'aide, conservez la commande complète et la sortie commençant par la première erreur.

## Diagnostiquer les erreurs d’installation ou d’exécution, étape par étape

### Étape 1 : conserver l’erreur avant toute réinstallation

Enregistrez d'abord l'erreur originale. L'exécution successive de plusieurs commandes d'installation différentes peut modifier l'environnement et rendre le problème original plus difficile à reproduire.

### Étape 2 : vérifier où s’exécute la commande

Enregistrez si vous utilisez :

- Windows PowerShell ;
- Un terminal WSL/Linux ;
- la console R ;
- Python ou Jupyter ; ou
- Un serveur distant.

Dire « Je travaille sur un ordinateur Windows » ne prouve pas que la commande s’exécute sous Windows. WSL et un serveur distant peuvent tous deux fournir des environnements Linux.

### Étape 3 : identifier l’interpréteur et l’environnement réellement utilisés

Notez la version et le chemin de l’interpréteur R ou Python, ainsi que le nom de l’environnement Conda ou de l’environnement du projet. C’est particulièrement utile lorsqu’un paquet semble déjà installé, mais que l’interpréteur ne le trouve pas.

### Étape 4 : repérer la première erreur significative

Les journaux d'installation peuvent être longs. La dernière ligne peut seulement dire que l'installation a échoué, alors que la vraie cause est apparue plus tôt — par exemple, une bibliothèque système manquante ou un conflit entre les versions des dépendances.

Commencez à lire au premier `ERROR`, `Error`, `cannot`, `failed` ou message de conflit explicite, puis inspectez les lignes autour de celui-ci.

### Étape 5 : comparer le résultat aux exigences officielles du logiciel

Confirmer :

- quels systèmes d'exploitation et architectures de processeur sont pris en charge ;
- quelles versions de R ou Python sont prises en charge ;
- si un compilateur ou une bibliothèque système est requis ;
- si l'installation doit utiliser CRAN, Bioconductor, PyPI, un canal Conda ou la source officielle du logiciel ; et
- Si le tutoriel a été écrit pour une version différente du logiciel.

Ne contournez pas les exigences officielles simplement parce qu'une ancienne commande d'un résultat de recherche semble plus courte.

### Étape 6 : modifier un seul élément et refaire le test

Si vous décidez de modifier la version d'un package, de créer un nouvel environnement ou d'ajouter un composant système, modifiez une catégorie à la fois et enregistrez à la fois la commande et le résultat. C'est ainsi que vous déterminez quelle modification a résolu le problème.

## Un projet d’analyse unicellulaire peut utiliser plusieurs environnements

« Un projet, un environnement » est une règle utile pour les débutants, mais un vrai projet peut appeler plusieurs programmes indépendants.

Par exemple :

```text
Données brutes de 10x
  → Exécuter Cell Ranger sous Linux
  → Produire une matrice d’expression
  → Utiliser Seurat dans un environnement R ou Scanpy dans un environnement Python
  → Effectuer le contrôle qualité et le regroupement des cellules, puis visualiser les résultats
```

Cell Ranger, Seurat et Scanpy ne doivent pas nécessairement être installés dans le même environnement. Ce qui importe, c’est d’enregistrer chaque étape :

- l’environnement dans lequel l’étape a été exécutée ;
- les données utilisées en entrée et les résultats obtenus en sortie ;
- la version du logiciel utilisée ;
- le génome de référence ou la version d'annotation utilisée ;
- où ses journaux et enregistrements d'environnement ont été stockés.

Le même principe vaut pour la multiomique sur cellules individuelles et pour les approches d’omique spatiale. Une analyse peut combiner le logiciel d’une plateforme de séquençage, des paquets R ou Python, des outils de traitement d’images et des données de référence. Documenter l’environnement de chaque étape rend les conditions de calcul traçables, même si les outils s’exécutent dans des environnements distincts.

## Codex peut aider à l’installation. Comment choisir l’environnement adapté au projet ?

Si vous indiquez seulement « je n’arrive pas à installer Scanpy », Codex devra surtout formuler des hypothèses. Une demande plus utile précise :

```text
J’exécute la commande dans Ubuntu sous WSL.
Ma version actuelle de Python est ...
La commande python -m pip --version affiche ...
Mon environnement Conda actuel est ...
Voici la commande complète que j’ai exécutée : ...
Voici la sortie complète à partir de la première erreur : ...
Les instructions d’installation officielles du projet se trouvent ici : ...
Détermine d’abord si le problème vient d’un chemin, de l’environnement, d’une version,
d’une dépendance ou d’une bibliothèque système. Explique sur quels indices tu t’appuies,
puis propose la modification la plus limitée possible. Ne mets pas tous les paquets à jour.
```

Codex peut vous aider à lire les journaux, comparer les exigences de version et organiser les étapes de diagnostic. Vous devez encore confirmer :

- si la documentation citée correspond à la version actuelle du logiciel ;
- si la commande va modifier un environnement déjà utilisé ;
- si la mise à jour du logiciel pourrait avoir une incidence sur une analyse qui a déjà été validée ;
- si le test minimal et les vérifications importantes des résultats ont été réexécutés après la réparation.

Fournissez à l’IA suffisamment d’éléments sur l’environnement pour étayer un diagnostic. Pour chaque modification proposée, demandez pourquoi elle devrait aider et comment le vérifier. Enchaîner des commandes au hasard ne permet pas de faire ce lien.

## Quelles informations sur l’environnement consigner pour chaque projet ?

Au début d'une analyse, consignez au moins les éléments suivants :

1. Le système d’exploitation et sa version
2. la version de R ou Python et le chemin réel ;
3. le nom de l’environnement du projet ;
4. les principaux paquets et leurs versions ;
5. la source ou le canal d'installation ;
6. un fichier d'environnement tel que `renv.lock`, `requirements.txt` ou `environment.yml`;
7. les versions du génome de référence, de l’annotation des gènes ou des autres données de référence utilisées ;
8. les journaux d’installation et d’exécution.

L'exécution réussie du code montre seulement que l'environnement actuel a accepté ces instructions. Ce n'est que lorsque l'environnement, les entrées, les paramètres, les versions logicielles et les contrôles de sortie sont également préservés que d'autres personnes ont une chance de comprendre et de reconstruire l'analyse.

## Références et lectures complémentaires

1. [Documentation officielle Python : créer des environnements virtuels avec `venv`](https://docs.python.org/3/library/venv.html)
2. [Python Packaging User Guide : fichiers de dépendances et d'exigences](https://packaging.python.org/en/latest/discussions/install-requires-vs-requirements/)
3. [Documentation officielle pip : résolution des dépendances et conflits](https://pip.pypa.io/en/stable/topics/dependency-resolution/)
4. [Documentation officielle Conda : gestion et partage des environnements](https://docs.conda.io/projects/conda/en/stable/user-guide/tasks/manage-environments.html)
5. [Documentation officielle renv : environnements locaux de projet pour R](https://rstudio.github.io/renv/articles/renv.html)
6. [Instructions d'installation officielles Bioconductor](https://bioconductor.org/install/)
7. [Documentation officielle R : `sessionInfo()`](https://stat.ethz.ch/R-manual/R-devel/library/utils/html/sessionInfo.html)
