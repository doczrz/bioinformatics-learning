# 0.1 | Pourquoi utilise-t-on souvent Linux en bio-informatique ? À quoi servent R, Python et Codex ?

Vous recevez des données de séquençage unicellulaire et souhaitez répondre à une question biologique : quelles cellules présentent des changements dans le groupe malade ?

Avant de pouvoir répondre, vous devrez souvent enchaîner les étapes suivantes :

> télécharger les données → inspecter les fichiers → contrôler la qualité → aligner les séquences ou les compter → organiser la matrice d’expression → effectuer l’analyse statistique → produire les figures → interpréter le résultat

Ces étapes font appel à plusieurs outils. Certains programmes s’exécutent sous Linux, tandis que certaines analyses sont écrites en R ou en Python. Des outils d’IA comme Codex peuvent aider à produire du code, à exécuter des commandes et à examiner les résultats.

On peut croire que Linux, R, Python et Codex sont quatre logiciels d’analyse concurrents. Chacun intervient en réalité à un niveau différent :

| Nom | De quoi s’agit-il ? | Rôle courant en bio-informatique |
| --- | --- | --- |
| Linux | Un système d’exploitation | Gérer les fichiers, exécuter des logiciels de bio-informatique, se connecter à des serveurs et organiser les étapes d’analyse |
| Bash | Un interpréteur de commandes courant sous Linux | Saisir des commandes, enchaîner des programmes et traiter des fichiers par lots |
| R | Un langage de programmation et un environnement de calcul statistique | Analyse statistique, visualisation des données, transcriptomique et analyse unicellulaire |
| Python | Un langage de programmation généraliste | Traitement des données, automatisation des analyses, apprentissage automatique et analyse de données omiques |
| Codex | Un agent d’IA capable de travailler avec du code, des fichiers et des outils | Aider à écrire, expliquer, exécuter et vérifier le code d’analyse |

Linux fournit l’environnement de travail. Bash, R et Python y remplissent des fonctions distinctes. Codex peut aider à organiser, exécuter et vérifier les tâches. La personne qui mène l’étude reste responsable de la question posée et de l’évaluation des preuves.

![Hiérarchie montrant les rôles de Linux, Bash, R, Python, Codex et du chercheur en bioinformatique](figures/bioinformatics-computing-layers.fr.svg)

*Figure 1 | Rôles des outils de bioinformatique. Linux fournit le système d’exploitation, Bash enchaîne les commandes et R ou Python permettent d’effectuer les analyses. Codex peut aider à plusieurs étapes. L’équipe de recherche pose les questions, examine les éléments probants et interprète les résultats. Ce schéma original du projet a été créé le 23 juillet 2026 avec l’outil de génération d’images d’OpenAI, puis redessiné en format vectoriel avec du texte redimensionnable. Il ne reprend ni logo, ni capture d’écran, ni composition de tiers. Il présente une organisation courante parmi d’autres.*

Le diagramme est un guide plutôt qu'une règle rigide. R et Python fonctionnent également sous Windows et macOS, et Linux ne se limite pas à l'utilisation en ligne de commande.

## Trois questions pour cette leçon

À la fin de cette leçon, vous devriez être capable d'expliquer :

1. Pourquoi de nombreux workflows de bioinformatique utilisent-ils Linux ?
2. À quoi R et Python sont-ils adaptés, et comment pouvez-vous choisir entre eux ?
3. Si Codex peut déjà écrire du code et exécuter des analyses, pourquoi vaut-il encore la peine d’apprendre ces bases ?

Vous n'avez pas besoin d'installer Linux ou de mémoriser les commandes dans cette leçon.

## Pourquoi Linux est-il si répandu en bio-informatique ?

### Raison 1 : beaucoup d’outils bioinformatiques sont d’abord développés pour Linux

De nombreux outils de traitement des données de séquençage sont développés et testés sous Linux ou dans un environnement de type Unix. Certains sont aussi disponibles sous macOS, sans prendre directement en charge Windows.

Bioconda distribue de nombreux paquets pour la recherche biomédicale. Sa documentation indique que Linux et macOS sont pris en charge, mais pas Windows directement. Les prérequis officiels de 10x Genomics pour Cell Ranger spécifient également Linux.

[Documentation officielle Bioconda](https://bioconda.github.io/index.html) · [Configuration requise pour Cell Ranger](https://www.10xgenomics.com/support/software/cell-ranger/downloads/cr-system-requirements)

Cela ne signifie pas que Windows ne peut pas être utilisé pour la bioinformatique. Cela signifie que lorsqu'un outil n'est officiellement pris en charge que sur Linux, l'utilisation d'un environnement Linux facilite généralement l'obtention d'un comportement conforme à sa documentation.

### Raison 2 : les serveurs et les centres de calcul utilisent souvent Linux

Un ordinateur portable ordinaire convient pour suivre les leçons, explorer de petits jeux de données et apprendre les méthodes. Le traitement des données brutes de séquençage peut cependant demander beaucoup de mémoire vive, d’espace disque et de puissance de calcul.

Les serveurs de laboratoire, les grappes de calcul haute performance (HPC) et de nombreuses machines virtuelles dans le cloud fonctionnent sous Linux. Les commandes et l’organisation des répertoires apprises sur un ordinateur personnel sont donc souvent réutilisables sur un serveur.

Installer Linux ne rend pas un ordinateur plus rapide en soi. La faisabilité d’un calcul dépend du processeur, de la mémoire vive, de l’espace disque libre et du volume des données. Si la mémoire manque pour traiter les données brutes, ajouter un environnement Linux sous Windows ne résout pas ce problème.

### Raison 3 : les commandes sont faciles à combiner, à enregistrer et à répéter

Les interfaces graphiques sont utiles pour l'exploration, mais après avoir cliqué sur de nombreux écrans, il peut être difficile de répondre :

- Quel fichier d'entrée avez-vous sélectionné ?
- Quels paramètres avez-vous utilisés ?
- Quelle version du logiciel a été installée ?
- Quelle étape a généré un avertissement ?
- Comment répéteriez-vous la même procédure pour vingt autres échantillons ?

En ligne de commande sous Linux, on peut consigner les étapes d’une analyse dans un script : un fichier qui énumère les opérations à exécuter. Il peut être relu, modifié, réexécuté et partagé.

Un script ne suffit pas à garantir la reproductibilité. Le génome de référence, les fichiers d’annotation, les versions des logiciels, les informations sur les échantillons et la valeur d’initialisation du générateur pseudo-aléatoire (la graine) peuvent aussi modifier le résultat.

### Raison 4 : Linux dispose d’outils éprouvés pour gérer les fichiers et les droits d’accès

Une analyse bioinformatique fait intervenir de nombreux fichiers : FASTQ, BAM, matrices d’expression, tableaux décrivant les échantillons, journaux d’exécution et figures. Sans répertoires bien organisés, un programme risque de lire les données du mauvais échantillon ou d’écraser un résultat antérieur.

Linux fournit des chemins de fichiers explicites, des permissions utilisateur et des mécanismes de journalisation. Le but d'apprendre ces idées n'est pas de mémoriser des commandes. C'est savoir :

- où se trouvent les données ;
- ce que le programme lit ;
- où le résultat sera écrit ;
- quels fichiers peuvent être modifiés ; et
- Quel journal inspecter après un échec.

## Faut-il réinstaller son ordinateur quand on utilise Windows ?

Non.

Le sous-système Windows pour Linux (WSL) permet à un utilisateur Windows d'exécuter une distribution Linux, Bash et des programmes de ligne de commande Linux sans configurer un ordinateur à double démarrage.

[Présentation officielle de Microsoft WSL](https://learn.microsoft.com/en-us/windows/wsl/about)

Au niveau débutant, WSL peut être compris comme un environnement de travail Linux à l'intérieur d'un ordinateur Windows. De nombreux concepts resteront utiles si vous utilisez plus tard un serveur de laboratoire.

Cependant, WSL et un serveur distant ne sont pas la même chose :

- WSL utilise les ressources de votre propre ordinateur.
- un serveur utilise les ressources d'une machine distante ;
- Sur un cluster HPC, un ordonnanceur peut répartir les ressources entre les tâches soumises par les différents utilisateurs.
- Une plateforme cloud peut facturer le stockage et le temps de calcul.

Les leçons pratiques ultérieures indiqueront donc à la fois où une commande est exécutée et où les données sont stockées. Ils ne présenteront pas de code sans identifier son environnement d'exécution.

## Qu’est-ce que R ?

Le projet R définit R comme un langage de programmation et un environnement de calcul statistique et de production graphique.

[Présentation officielle du projet R](https://www.r-project.org/about.html)

Une force importante de R en bioinformatique est Bioconductor. Bioconductor est un projet de bioinformatique open source basé sur R. Il couvre les données génomiques, transcriptomiques, cytométriques en flux et autres, tout en mettant l'accent sur les méthodes statistiques, la documentation et la recherche reproductible.

[Présentation officielle de Bioconductor](https://bioconductor.org/about/index.html)

Seurat est un paquet R couramment utilisé pour contrôler la qualité des données de cellules individuelles, les explorer, regrouper les cellules, intégrer des jeux de données et les visualiser.

[Documentation officielle de Seurat](https://satijalab.org/seurat/)

Les forces communes de R comprennent :

- Un écosystème mature d’analyse statistique ;
- une grande collection de paquets omics dans Bioconductor ;
- la possibilité de réunir analyses, modèles statistiques et figures dans un même script ou rapport ;
- Code R direct dans de nombreuses sections et tutoriels sur les méthodes biomédicales.

R nécessite également quelques ajustements :

- certains paquets exigent des versions précises de R ou de Bioconductor ;
- différents paquets peuvent utiliser différents objets de données ;
- les grands jeux de données exigent de surveiller la mémoire et d’éviter les copies répétées d’objets volumineux ;
- obtenir une figure ne prouve pas que le plan d’analyse statistique était approprié.

## Qu’est-ce que Python ?

Python est un langage de programmation à usage général. En plus du calcul scientifique, il est largement utilisé pour le développement de logiciels, l'automatisation, les services réseau, l'apprentissage automatique et l'éducation. L'index des paquets Python fournit une grande collection de modules tiers.

[Introduction officielle à Python](https://www.python.org/about/)

Scanpy est un ensemble d’outils Python pour prétraiter et visualiser les données de cellules individuelles, regrouper les cellules, inférer des trajectoires et analyser l’expression différentielle. Il utilise l’objet de données AnnData.

[Documentation officielle Scanpy](https://scanpy.readthedocs.io/)

Les forces communes de Python comprennent :

- connecter le téléchargement des données, le traitement des fichiers, l'analyse et l'automatisation dans un flux de travail complet ;
- un large choix d’outils pour le calcul scientifique, l’apprentissage automatique et l’apprentissage profond ;
- l'intégration avec des bases de données, des services Web et d'autres programmes ;
- Développer des logiciels et outils d'analyse réutilisables.

Python nécessite également quelques ajustements :

- De nombreux paquets peuvent offrir différentes approches au même problème ;
- Les versions de Python, les paquets et les bibliothèques de bas niveau doivent rester compatibles ;
- si les cellules de code d’un notebook ont été exécutées dans le désordre, l’analyse peut échouer ou donner un autre résultat lorsqu’on rouvre le notebook et qu’on le relance ;
- La liberté d'un langage à usage général nécessite également une gestion active de la structure du code et de l'état des données.

## Quand choisir R ou Python ?

Il n’y a pas de réponse unique sans tâche spécifique.

| Critère | R | Python |
| --- | --- | --- |
| Vocation initiale | Calcul statistique et graphiques | Programmation généraliste |
| Outils courants en bio-informatique | Bioconductor, Seurat | NumPy, pandas, scikit-learn, Scanpy/scverse |
| Domaines d’application privilégiés | Modélisation statistique, analyses différentielles, biostatistique et figures pour publication | Automatisation, apprentissage automatique, ingénierie des données et développement d’outils d’analyse |
| Difficultés fréquentes au début | Les versions des paquets, les objets de données et les concepts statistiques | La gestion des environnements, la structure des logiciels et le choix parmi de nombreuses bibliothèques |
| Permet-il d’analyser des données unicellulaires ? | Oui | Oui |
| Fonctionne-t-il sous Linux ? | Oui | Oui |

Toutes les affirmations suivantes sont trop simples :

- « R ne sait faire que des graphiques. »
- « Python est toujours plus rapide que R. »
- « Python peut tout faire, donc R est inutile. »
- « Les articles biomédicaux utilisent souvent R, Python est donc inutile. »

Les performances réelles dépendent de l'algorithme, des structures de données, de l'implémentation de bas niveau, de la mémoire et du calcul parallèle, et pas seulement du nom du langage. De nombreux paquets R et Python appellent C, C++, Fortran ou d'autres codes haute performance pour leurs calculs de base.

Un choix plus utile commence par ces questions :

1. Quel écosystème contient une méthode mature pour la question de recherche ?
2. Quelle implémentation est fournie par le tutoriel officiel et le document original ?
3. Quels sont les objets de données et les workflows utilisés par l’équipe ?
4. Le résultat doit-il se connecter à un projet existant ?
5. Pouvez-vous expliquer et valider chaque étape ?

Un vrai projet peut utiliser les deux langues. Les outils Linux peuvent générer une matrice d'expression, R peut effectuer une analyse statistique et Python peut fournir un apprentissage automatique ou une automatisation supplémentaire.

## Pourquoi suivre ce cours si Codex peut déjà analyser des données ?

Codex peut lire et modifier des fichiers, écrire du code, exécuter des tâches et aider à créer des flux de travail automatisés. L'introduction actuelle d'OpenAI à Codex souligne qu'il peut effectuer un travail réel à travers les fichiers et les outils.

[Introduction d'OpenAI à Codex](https://openai.com/academy/what-is-codex/)

Cela change la façon dont les gens apprennent. Un débutant n'a plus à mémoriser une grande quantité de syntaxe avant de commencer à inspecter des données ou à essayer un flux de travail d'analyse.

Mais cela n'élimine pas le besoin de comprendre la bioinformatique.

### Un programme qui s’exécute sans erreur peut donner une analyse incorrecte

Le code peut se terminer sans erreur et produire une figure attrayante tout en contenant encore des problèmes tels que :

- pas de réplicats biologiques indépendants pour les groupes maladie et témoin ;
- traiter chaque cellule comme un échantillon biologique indépendant ;
- l'utilisation d'un génome de référence incompatible ;
- éliminer lors du filtrage une population importante de cellules pauvres en ARN ;
- confondre entièrement la condition expérimentale avec le lot de traitement, par exemple en traitant tous les cas un jour et tous les témoins un autre jour ;
- interpréter la similarité calculée entre deux populations cellulaires comme la preuve d’un lien de causalité.

Ce ne sont généralement pas des erreurs de syntaxe. Ils ne peuvent pas être détectés simplement en demandant si le code a été exécuté avec succès.

### Il faut savoir évaluer les résultats de l’IA

Pour l'intuition, Codex peut être comparé à un assistant de recherche rapide qui peut utiliser des outils. Il peut organiser les fichiers, expliquer une erreur, écrire un script et exécuter des vérifications, mais vous devez toujours lui dire :

- ce qu'est réellement la question biologique ;
- quelles données peuvent être utilisées ;
- quel échantillon est l'unité expérimentale indépendante ;
- ce qui compte comme un résultat réussi ;
- les observations inhabituelles qui ne doivent pas être automatiquement supprimées ;
- Les éléments de preuve requis pour la conclusion finale.

L'analogie a des limites. Codex n'a pas le niveau de compétence fixe d'un assistant humain ; son comportement dépend du modèle, des outils, du contexte et des autorisations. Indépendamment de la capacité, une analyse finale doit toujours être validée par des sources, des paramètres, des journaux et des preuves indépendantes. OpenAI décrit également Codex comme un outil qui nécessite une direction et une révision humaines plutôt qu'un remplacement du jugement humain.

### Les objectifs d’un tutoriel doivent eux aussi évoluer

Avant les outils d’IA, les tutoriels consacraient souvent une grande partie de leur espace à demander aux apprenants de mémoriser les noms des fonctions et les arguments des commandes.

À l'ère du Codex, les objectifs d'apprentissage les plus importants sont :

- comprendre pourquoi une étape d'analyse existe ;
- décrire ses intrants, extrants et critères de réussite ;
- vérifier si un outil sélectionné par l’IA correspond aux données ;
- reconnaître les erreurs dans la conception expérimentale, les statistiques et l'interprétation biologique ;
- exiger que l'IA conserve le code, les versions, les journaux et les dossiers de décision ;
- savoir quelles preuves faire confiance lorsqu'un résultat d'IA est en conflit avec la documentation officielle ou un article original.

Ce cours n'est donc pas en concurrence avec Codex pour écrire du code plus rapidement. Il vise à aider les apprenants à poser les bonnes questions, superviser les analyses, inspecter les preuves et assumer la responsabilité du jugement scientifique.

## Références et lectures complémentaires

1. [Projet R : Qu'est-ce que R ?](https://www.r-project.org/about.html)
2. [Python.org : À propos de Python](https://www.python.org/about/)
3. [Bioconductor : À propos](https://bioconductor.org/about/index.html)
4. [Documentation officielle Bioconda](https://bioconda.github.io/index.html)
5. [Microsoft : Sous-système Windows pour Linux](https://learn.microsoft.com/en-us/windows/wsl/about)
6. [10x Genomics : Cell Ranger Exigences du Système](https://www.10xgenomics.com/support/software/cell-ranger/downloads/cr-system-requirements)
7. [Documentation officielle de Seurat](https://satijalab.org/seurat/)
8. [Documentation officielle Scanpy](https://scanpy.readthedocs.io/)
9. [OpenAI Academy : Qu'est-ce que ChatGPT Codex ?](https://openai.com/academy/what-is-codex/)
