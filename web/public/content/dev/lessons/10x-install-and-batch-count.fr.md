# 1.2 | Installer Cell Ranger et Space Ranger de 10x Genomics

Ce chapitre présente deux logiciels qui s’installent sous Linux. Cell Ranger produit une matrice d’expression des gènes à partir de données de séquençage de cellules individuelles. Space Ranger associe les comptages d’expression aux positions où l’ARN a été capturé sur une coupe de tissu. [Tutoriel officiel d’installation de Cell Ranger](https://www.10xgenomics.com/support/software/cell-ranger/latest/tutorials/cr-tutorial-in) · [Guide officiel d’installation de Space Ranger](https://www.10xgenomics.com/support/software/space-ranger/downloads/space-ranger-installation)

## Première partie. Installer Cell Ranger

### 1. Télécharger Cell Ranger 10.1.0 et extraire l’archive

Copiez la commande de téléchargement du site de 10x dans votre terminal Linux. Exécutez-la, puis décompressez l’archive. [Télécharger Cell Ranger](https://www.10xgenomics.com/support/software/cell-ranger/downloads#download-links)

### 2. Télécharger et décompresser la référence humaine

Pour des échantillons humains, téléchargez la **référence humaine GRCh38 2024-A** (environ 11 Go). GRCh38 désigne l’assemblage du génome humain et 2024-A la version de la référence publiée par 10x. Cell Ranger utilise les séquences, les annotations de gènes et les index de ce paquet pour déterminer de quel gène provient une lecture. [Télécharger la référence humaine GRCh38 2024-A](https://cf.10xgenomics.com/supp/cell-exp/refdata-gex-GRCh38-2024-A.tar.gz)

Après extraction, indiquez dans `--transcriptome` le chemin du répertoire de référence complet. Pour des échantillons de souris, utilisez la référence murine.

### 3. Ajouter Cell Ranger au `PATH`

Le programme est installé dès que vous avez extrait l’archive. Pour lancer `cellranger` depuis le répertoire d’un échantillon, indiquez à Bash où le trouver. La variable `PATH` contient une liste de répertoires séparés par le caractère deux-points. Bash les parcourt de gauche à droite. La commande ci-dessous place la nouvelle installation en tête de liste et conserve les autres répertoires grâce à `:$PATH`. [Configurer le PATH selon les instructions de 10x](https://www.10xgenomics.com/support/software/cell-ranger/latest/tutorials/cr-tutorial-in)

```bash
export PATH="$HOME/10x-tools/cellranger-10.1.0:$PATH"
command -v cellranger
cellranger --version
```

La première vérification doit afficher un chemin dans votre répertoire personnel qui se termine par `/10x-tools/cellranger-10.1.0/cellranger`. La seconde doit afficher `10.1.0`. Si Bash répond `command not found`, vérifiez que l’exécutable se trouve à cet emplacement. Si une ancienne version apparaît, lancez `type -a cellranger` pour voir toutes les commandes de ce nom et repérer le répertoire consulté en premier.

**Conserver ce réglage à l’ouverture d’un nouveau terminal.** La commande `export` ci-dessus s’applique à la session Bash en cours et aux processus qu’elle lance. Ouvrez votre fichier de configuration personnel dans un éditeur, par exemple avec `nano ~/.bashrc`, puis ajoutez la ligne suivante à la fin du fichier. Si elle y figure déjà, conservez-en un seul exemplaire.

```bash
export PATH="$HOME/10x-tools/cellranger-10.1.0:$PATH"
```

Dans nano, appuyez sur `Ctrl+O` puis sur Entrée pour enregistrer et sur `Ctrl+X` pour quitter. Exécutez les commandes ci-dessous pour relire le fichier et vérifier le résultat. Ouvrez ensuite un nouveau terminal sur le serveur comme vous le faites habituellement, puis relancez `cellranger --version`.

```bash
source "$HOME/.bashrc"
command -v cellranger
cellranger --version
```

Bash lit automatiquement `~/.bashrc` lorsqu’il démarre en mode interactif hors d’une session de connexion. Lors d’une connexion SSH, cette lecture dépend de votre configuration. Si Bash ne trouve plus la commande après une reconnexion, vérifiez que le fichier utilisé à la connexion, souvent `~/.bash_profile`, charge bien `~/.bashrc`. Sur un cluster, vous pouvez aussi placer la ligne `export PATH=...` dans le script du travail pour que le nœud de calcul utilise la version voulue. [Fichiers de démarrage de Bash](https://www.gnu.org/software/bash/manual/html_node/Bash-Startup-Files.html)

### 4. Lire l’aide de `cellranger`

Exécutez les commandes suivantes depuis n’importe quel répertoire. La première liste les tâches que Cell Ranger peut effectuer. Les deux autres donnent les options propres à chaque tâche. Chaque commande affiche l’aide, puis se termine.

```bash
cellranger --help
cellranger count --help
cellranger testrun --help
```

La ligne `Usage` indique comment écrire la commande. Dans `cellranger testrun --id=check_install`, `cellranger` est le programme, `testrun` la sous-commande, `--id` une option et `check_install` le nom que vous donnez à cette exécution. Remplacez `<ID>` par la valeur de votre choix. La mention `[OPTIONS]` indique où ajouter des options. Omettez les chevrons et les crochets dans votre commande. Utilisez `-h` ou `--help` pour afficher l’aide, et `-V` ou `--version` pour afficher la version.

| Sous-commandes de l’aide | Rôle |
| --- | --- |
| `testrun` | Vérifie l’installation à l’aide d’un petit jeu de données fourni avec le logiciel. |
| `count` | Compte les molécules associées aux gènes et aux autres cibles prises en charge, pour un échantillon issu d’une seule capture de cellules. Une bibliothèque de séquençage est l’ensemble des molécules préparées à partir d’un échantillon pour être séquencées. |
| `multi`, `multi-template` | `multi` lit un fichier de configuration pour traiter des échantillons multiplexés, des expériences Flex ou des expériences combinant plusieurs types de bibliothèques. `multi-template` crée un modèle de ce fichier. |
| `vdj`, `mkvdjref` | `vdj` reconstitue les séquences des récepteurs des lymphocytes T ou B à partir du séquençage du répertoire immunitaire. `mkvdjref` construit une référence adaptée à cette analyse. |
| `aggr`, `reanalyze`, `annotate` | `aggr` regroupe les résultats de plusieurs exécutions. `reanalyze` refait la réduction de dimension et le regroupement en clusters à partir d’une matrice existante. `annotate` prédit les types cellulaires à partir de résultats existants. |
| `mkref`, `mkgtf`, `mat2csv` | `mkref` construit une référence personnalisée à partir de séquences et d’annotations de gènes. `mkgtf` filtre les annotations selon leurs attributs. `mat2csv` convertit une matrice en fichier CSV, qui peut devenir très volumineux si la matrice est grande. |
| `sitecheck`, `upload`, `telemetry`, `cloud`, `help` | `sitecheck` affiche la configuration de l’ordinateur. `upload` envoie le fichier de diagnostic indiqué à l’assistance 10x. `telemetry` affiche ou modifie les réglages de collecte des données d’utilisation. `cloud` donne accès aux services cloud de 10x. `help` affiche l’aide d’une commande. |

D’anciens tutoriels mentionnent parfois `mkfastq`, une commande que 10x a déclarée obsolète. Si votre plateforme de séquençage vous livre des fichiers FASTQ, vous pouvez commencer avec ces fichiers. Ils contiennent les séquences et le score de qualité de chaque base. Le test d’installation utilise ses propres données. [Commandes de Cell Ranger](https://www.10xgenomics.com/support/software/cell-ranger/latest/getting-started/cr-command-line-arguments) · [Code source des commandes de Cell Ranger 10.1.0](https://github.com/10XGenomics/cellranger/blob/cellranger-10.1.0/lib/rust/cr_wrap/src/bin/cellranger.rs)

Dans la sortie de `cellranger count --help`, repérez d’abord les options ci-dessous. Elles indiquent quels fichiers utiliser et dans quel répertoire enregistrer les résultats.

| Option | Valeur par défaut ou comportement en cas d’omission dans Cell Ranger 10.1.0 | Valeur à fournir pour votre échantillon |
| --- | --- | --- |
| `--id` | Obligatoire, sans valeur par défaut. | Donnez un nom à l’analyse et à son répertoire de sortie, par exemple `GEX_A`. |
| `--fastqs` | Obligatoire dans cet exemple, sans chemin par défaut. | Indiquez le répertoire contenant les fichiers de séquençage. |
| `--sample` | Si un seul préfixe de nom de fichier est présent, la sélection est automatique. Avec plusieurs préfixes, omettre cette option provoque une erreur. | Indiquez le préfixe des fichiers de l’échantillon voulu. Par exemple, celui de `GEX_A_S1_L001_R1_001.fastq.gz` est `GEX_A`. |
| `--transcriptome` | Obligatoire dans cet exemple, sans référence par défaut. | Indiquez le répertoire complet de la référence décompressée à l’étape 2. |
| `--localcores` | Le mode local utilise tous les cœurs de processeur disponibles. | Indiquez le nombre de cœurs alloués à cette tâche. |
| `--localmem` | Le mode local utilise 90 % de la mémoire détectée. | Fixez la limite de mémoire en Go en respectant la quantité allouée à la tâche. |
| `--create-bam` | Obligatoire. Choisissez explicitement `true` ou `false`. | Choisissez `true` pour conserver les alignements de chaque lecture ou `false` si seule la matrice d’expression vous intéresse. |
| `--include-introns` | `true` pour les analyses classiques d’expression génique en 3′ ou 5′ sur l’ensemble du transcriptome. | Par défaut, les lectures introniques répondant aux critères de comptage sont incluses. Choisissez `false` pour les exclure. |
| `--nosecondary` | Option désactivée par défaut. L’analyse secondaire intégrée est exécutée. | Ajoutez `--nosecondary` pour sauter cette étape si vous réalisez vous-même la réduction de dimension et le regroupement des cellules. |

### 5. Tester l’installation avec `testrun` et résoudre un problème de compatibilité

**Si ce message apparaît, vérifiez le système de la machine qui a exécuté le test.** L’erreur concerne la compatibilité du système d’exploitation. Changer de référence ou extraire à nouveau l’archive laisserait le problème entier.

```text
ERROR: This operating system version is unsupported:
    CentOS Linux release XXX (Core)
...
To continue running this version for now, set TENX_IGNORE_DEPRECATED_OS=1
```

Pour traiter les données d’un projet, demandez à votre administrateur un nœud de calcul qui répond aux exigences actuelles de 10x. Vérifiez la version avec `cellranger --version` sur ce nœud, puis relancez le test d’installation. Le nœud de connexion et le nœud de calcul peuvent utiliser des systèmes d’exploitation différents. [Systèmes d’exploitation pris en charge par 10x](https://www.10xgenomics.com/support/software/cell-ranger/latest/miscellaneous/cr-os-requirements) · [Configuration requise pour Cell Ranger 10.1](https://www.10xgenomics.com/support/software/cell-ranger/downloads/cr-system-requirements)

Pour appliquer le contournement temporaire indiqué dans le message, exécutez `export TENX_IGNORE_DEPRECATED_OS=1`.

### 6. Choisir les options de comptage selon la version

`testrun` vérifie que le logiciel fonctionne. Utilisez `count` pour obtenir une matrice d’expression à partir de vos fichiers FASTQ. Si vous reprenez un ancien script, vérifiez les réglages suivants, car ils influent sur les comptages ou sur les fichiers produits. [Notes de version de Cell Ranger](https://www.10xgenomics.com/support/software/cell-ranger/latest/release-notes/cr-release-notes) · [Options de Cell Ranger 10.1](https://www.10xgenomics.com/support/software/cell-ranger/latest/getting-started/cr-command-line-arguments)

| Changement de version | Conséquence pour votre projet |
| --- | --- |
| **Depuis la version 7.0**, les analyses classiques d’expression génique 3′ et 5′ sur transcriptome entier utilisent `--include-introns=true` par défaut. Les versions antérieures excluaient les introns par défaut. | Les introns sont des portions d’un transcrit d’ARN généralement éliminées lors de l’épissage. Avec `true`, une lecture intronique peut contribuer au comptage des molécules si son alignement satisfait aux critères et permet de l’attribuer à un gène. C’est particulièrement utile pour les noyaux, riches en ARN non épissé. Avec `false`, ces lectures sont exclues. Pour reproduire des comptages anciens, vérifiez le réglage d’origine. |
| **Depuis la version 8.0**, `count` exige que vous indiquiez explicitement `--create-bam=true` ou `false`. Ce réglage remplace l’ancienne option `--no-bam`. | Un fichier BAM conserve l’alignement de chaque lecture. Si seule la matrice vous intéresse et que vous avez prévu le contrôle qualité, choisissez `false` pour économiser de l’espace disque et du temps d’écriture. Choisissez `true` pour examiner les alignements dans un navigateur génomique, si un outil en aval exige un BAM ou si vous hésitez encore. La matrice d’expression est produite dans les deux cas. |
| **En version 10.1**, Pan-Human Azimuth annote par défaut les types cellulaires localement pour les données humaines. L’analyse secondaire inclut UMAP par défaut et laisse t-SNE désactivé. | `--disable-cell-annotation` désactive l’annotation automatique des types cellulaires. Pour conserver l’analyse secondaire intégrée et y ajouter t-SNE, utilisez `--enable-tsne=true`. UMAP et t-SNE représentent les données d’expression dans un espace de dimension réduite pour les visualiser. |

**Quand utiliser `--nosecondary` ?** Pour un premier essai, conservez l’analyse secondaire par défaut pour examiner les projections et les groupes de cellules obtenus. Si vous comptez calculer vos propres projections et groupes à partir de la matrice dans Seurat ou Scanpy, ajoutez `--nosecondary` à `cellranger count`. Cette option ne prend aucune valeur. Vous gagnez le temps de calcul de l’analyse secondaire intégrée et renoncez aux résultats correspondants. La création du BAM se règle séparément avec une option telle que `--create-bam=false`.

## Deuxième partie. Installer Space Ranger

### 1. Télécharger Space Ranger 4.1.0 et extraire l’archive

Space Ranger associe l’ARN mesuré par Visium à sa position de capture sur la coupe de tissu. [Guide officiel d’installation de Space Ranger](https://www.10xgenomics.com/support/software/space-ranger/downloads/space-ranger-installation) · [Configuration requise](https://www.10xgenomics.com/support/software/space-ranger/downloads/space-ranger-system-requirements)
Téléchargez l’archive de la version voulue et décompressez-la. La version la plus récente figure sur la page de téléchargement de 10x. [Télécharger Space Ranger](https://www.10xgenomics.com/support/software/space-ranger/downloads)

**Télécharger et décompresser la référence humaine.** Space Ranger utilise la même référence GRCh38 2024-A que Cell Ranger. Si vous l’avez déjà extraite, passez à l’étape suivante. [Télécharger la référence humaine GRCh38 2024-A (environ 11 Go)](https://cf.10xgenomics.com/supp/cell-exp/refdata-gex-GRCh38-2024-A.tar.gz)

Pour `spaceranger count`, indiquez dans `--transcriptome` le chemin du répertoire de référence obtenu après extraction.

### 2. Configurer le `PATH` et consulter l’aide

```bash
export PATH="$HOME/10x-tools/spaceranger-4.1.0:$PATH"
command -v spaceranger
spaceranger --version
```

Le chemin affiché doit se terminer par `/spaceranger-4.1.0/spaceranger` et la version doit être `4.1.0`. Lancez `nano ~/.bashrc`, ajoutez la commande `export` sur une ligne à part, puis exécutez `source ~/.bashrc`. Ouvrez un nouveau terminal et relancez `spaceranger --version`. Si les deux logiciels sont installés, conservez dans `.bashrc` une ligne `export` pour chacun.

```bash
spaceranger --help
spaceranger testrun --help
spaceranger count --help
```

Lisez l’aide dans le même ordre que précédemment, en repérant le programme, la sous-commande et ses options. `--help` affiche la syntaxe et `--version` la version du logiciel. [Documentation des commandes de Space Ranger](https://www.10xgenomics.com/support/software/space-ranger/latest/analysis/running-pipelines/command-line-arguments)

| Sous-commandes | Rôle |
| --- | --- |
| `testrun`, `count` | `testrun` vérifie l’installation avec les données fournies. `count` traite une zone de capture et produit les matrices d’expression, les coordonnées spatiales et les résultats associés à l’image du tissu. |
| `segment`, `annotate` | `segment` repère les noyaux dans les images de tissu Visium HD prises en charge. `annotate` prédit les types cellulaires à partir des résultats de segmentation cellulaire HD compatibles. |
| `aggr` | Regroupe les analyses compatibles de plusieurs zones de capture. Dans Space Ranger 4.1, cette commande ne prend pas en charge Visium HD. |
| `mkref`, `mkgtf`, `mat2csv` | Ces commandes construisent une référence, filtrent les annotations de gènes et convertissent une matrice d’expression en CSV, respectivement. |
| `sitecheck`, `upload`, `telemetry`, `cloud` | Ces commandes vérifient l’environnement de calcul, envoient un fichier de diagnostic à l’assistance 10x, règlent la collecte des données d’utilisation et donnent accès aux services cloud de 10x, respectivement. La commande `mkfastq` des anciens protocoles est obsolète. |

### 3. Tester l’installation sur un nœud avec ou sans accès à Internet

```bash
cd "$HOME/10x-work"
spaceranger testrun --id=check_spaceranger
```

`--id` donne son nom au répertoire de sortie. Le message `Pipestance completed successfully!` dans le terminal confirme la réussite du test. Si le logiciel signale que le système d’exploitation est incompatible, lancez `cat /etc/os-release` sur le nœud de calcul où le test s’est exécuté. Choisissez un nœud qui répond aux exigences de Space Ranger. CentOS 7.5 n’est pas pris en charge par Space Ranger 4.1. [Configuration requise pour Space Ranger](https://www.10xgenomics.com/support/software/space-ranger/downloads/space-ranger-system-requirements)

Le message `Could not retrieve spot layout data` signifie que le logiciel n’a pas pu récupérer la disposition des points de capture sur la lame. Si le nœud de calcul n’a pas accès à Internet, relancez le **test d’installation** en mode hors ligne, avec un nouveau répertoire de sortie.

```bash
spaceranger testrun --no-internet --id=check_spaceranger_offline
```

**Pour analyser votre propre lame** sur un nœud hors ligne, téléchargez le fichier de disposition correspondant au numéro de série de la lame depuis un ordinateur connecté à Internet. Transférez-le sur le nœud de calcul, puis indiquez à `spaceranger count` les options `--slidefile`, `--slide` et `--area`. Une fois le test d’installation réussi, vérifiez que l’image correspond bien à la lame et à la zone de capture analysées. [Instructions de 10x pour les tests hors ligne et les fichiers de disposition des lames](https://www.10xgenomics.com/support/software/space-ranger/downloads/space-ranger-installation)

### 4. Paramétrer l’analyse d’une zone de capture Visium

Cet exemple utilise **une lame Visium v1 d’origine, du tissu humain frais congelé et une image en champ clair après coloration H&E**. H&E désigne l’hématoxyline et l’éosine, deux colorants qui révèlent la structure du tissu. Remplacez `V10J25-015`, `A1`, `Tissue_A` et le nom du fichier image par les valeurs correspondant à votre lame et à vos fichiers de séquençage. Si vous souhaitiez seulement vérifier l’installation, l’étape précédente suffit.

```bash
cd "$HOME/10x-work"
spaceranger count --id=visium_A \
  --transcriptome="$HOME/10x-work/refs/refdata-gex-GRCh38-2024-A" \
  --fastqs="$HOME/10x-work/fastqs/Tissue_A" --sample=Tissue_A \
  --image="$HOME/10x-work/images/Tissue_A_HE.tif" \
  --slide=V10J25-015 --area=A1 \
  --include-introns=true --create-bam=false
```

| Option de l’exemple | Valeur par défaut ou comportement en cas d’omission dans Space Ranger 4.1.0 | Valeur à fournir et effet |
| --- | --- | --- |
| `--id` | Obligatoire, sans valeur par défaut. | Nommez le répertoire de sortie. Dans l’exemple, il s’agit de `visium_A/`. |
| `--transcriptome` | Obligatoire, sans référence par défaut. | Indiquez le répertoire contenant la référence humaine décompressée. |
| `--fastqs` | Obligatoire dans cet exemple, sans chemin par défaut. | Indiquez le répertoire des fichiers de séquençage de cette zone de capture. |
| `--sample` | Si un seul préfixe de nom de fichier est présent, la sélection est automatique. Avec plusieurs préfixes, omettre cette option provoque une erreur. | Indiquez le préfixe des fichiers FASTQ de la zone de capture, ici `Tissue_A`. |
| `--image` | Aucune image par défaut. Cet exemple nécessite le chemin de l’image H&E acquise en champ clair. | Indiquez l’image microscopique de la zone de capture. Le logiciel y repère le tissu et y aligne les coordonnées issues du séquençage. |
| `--slide` | Aucun numéro de série par défaut. Obligatoire dans cet exemple. | Indiquez le numéro inscrit sur la lame utilisée, par exemple `V10J25-015`. |
| `--area` | Aucune zone de capture par défaut. Dans cet exemple, fournissez cette option avec `--slide`. | Indiquez la zone de capture repérée sur la lame, par exemple `A1`. Analysez chaque zone séparément. |
| `--include-introns=true` | `true` pour l’expérience Visium v1 de cet exemple. | L’exemple conserve la valeur par défaut. Les lectures introniques admissibles participent au comptage des molécules. |
| `--create-bam=false` | Obligatoire. Choisissez explicitement `true` ou `false`. | Avec `false`, on conserve la matrice d’expression et les résultats spatiaux sans produire le BAM des alignements individuels. Choisissez `true` pour examiner les alignements, ou si vos besoins ultérieurs restent à définir. |

Après l’exécution, ouvrez `visium_A/outs/web_summary.html` pour consulter le bilan du contrôle qualité spatial de cette zone de capture. Les images et les coordonnées se trouvent dans `visium_A/outs/spatial/`. Dans la matrice du Visium d’origine, chaque code-barres correspond à un point de capture, qui peut recouvrir plusieurs cellules. [Résultats spatiaux de Space Ranger](https://www.10xgenomics.com/support/software/space-ranger/latest/analysis/outputs/spatial-outputs)

**Trois changements à vérifier dans les anciens scripts**

| Version de Space Ranger | Effet sur la commande ou les résultats |
| --- | --- |
| **Depuis la version 3.0** | `count` exige de préciser `--create-bam=true` ou `false`. Choisissez `false` pour économiser de l’espace disque et du temps d’écriture si vous n’avez besoin que de la matrice et des coordonnées spatiales. |
| **Versions 4.0.x** | Ces versions prennent en charge Visium HD 3′ et introduisent la segmentation des noyaux et des cellules à partir des images de tissu. Pour HD 3′, omettez `--probe-set`. Pour Visium HD à sondes, fournissez le jeu de sondes correspondant à l’expérience. |
| **Depuis la version 4.1** | Pour **Visium v1 et Visium HD 3′**, les introns sont comptés par défaut. Utilisez `--include-introns=false` pour reproduire une analyse qui les excluait. Les expériences à sondes identifient les cibles par des paires de sondes. Vérifiez le jeu de sondes utilisé. |

Si vous pratiquez déjà l’analyse spatiale et prévoyez de regrouper vous-même les données à partir de la matrice, des images de tissu et des coordonnées, `--nosecondary` permet de gagner le temps de calcul de l’analyse secondaire intégrée. Conservez celle-ci pour examiner les groupes produits par Space Ranger. Dans les deux cas, vérifiez le recalage entre l’image et les coordonnées. [Notes de version de Space Ranger](https://www.10xgenomics.com/support/software/space-ranger/latest/release-notes/release-notes-for-SR) · [Données d’entrée selon le type d’expérience Visium HD](https://www.10xgenomics.com/support/software/space-ranger/latest/analysis/running-pipelines/count-visium-hd)
