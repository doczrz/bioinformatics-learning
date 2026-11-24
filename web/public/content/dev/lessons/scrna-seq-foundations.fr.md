# 1.1 | Séquençage de l’ARN en cellule unique : histoire, principes et plateformes

Imaginez un jus fait de plusieurs fruits. Vous pouvez mesurer sa teneur en sucre, mais comment savoir si l’essentiel du sucre provient des pommes ou de quelques raisins particulièrement sucrés ?

Un échantillon de tissu pose un problème comparable. Une tumeur, une goutte de sang ou un fragment de cerveau contient souvent plusieurs types cellulaires. Mesurer tout leur ARN ensemble révèle des changements à l’échelle de l’échantillon. Des cellules rares peuvent passer inaperçues, et il devient difficile de savoir quel type cellulaire est à l’origine d’un changement.

Le séquençage de l’ARN en cellule unique (scRNA-seq) repose sur une idée simple : **marquer le matériel de chaque cellule avant de le mélanger à celui des autres pour le séquençage, afin de pouvoir en retrouver l’origine.**

Cette leçon ne demande aucun logiciel. Suivons le chemin qui mène de l’échantillon à la mesure :

> échantillon biologique → cellules individuelles → marquage de l’origine de l’ARN → séquençage → matrice d’expression, avec les gènes en lignes et les cellules en colonnes


## Quatre notions pour commencer

- La **cellule** est une unité fondamentale du vivant. Dans un même tissu, les cellules peuvent être différentes.
- L’**ADN** conserve une information génétique relativement stable. L’ARN produit à partir d’un gène renseigne sur l’utilisation de ce gène.
- On peut se représenter l’**ARN** comme une copie de travail temporaire issue de l’ADN. Lorsque l’ARN d’un gène est plus facile à détecter, ce gène est généralement plus actif, sans que la correspondance soit exacte.
- Le **transcriptome** désigne l’ensemble des ARN observables dans un échantillon à un instant donné. Il donne un aperçu de l’activité du moment.

Ces quatre notions suffisent pour aborder la suite.

Les méthodes courantes d’analyse de l’expression décrites ici mesurent surtout les ARN messagers (ARNm) munis d’une queue poly(A) que l’expérience réussit à capturer. Tous les types d’ARN ne sont pas mesurés avec la même efficacité. Le nombre obtenu dépend de la production et de la dégradation de l’ARN ainsi que de l’efficacité de capture. Il estime la quantité d’ARNm présente et capturée à cet instant, sans mesurer directement la vitesse de transcription du gène.

## Que perd-on en mesurant tous les ARN dans un même tube ?

Supposons qu’un échantillon contienne 90 cellules de type A et 10 de type B. Un gène lié à l’inflammation ne s’exprime fortement que dans le type B. Si l’on mesure les 100 cellules ensemble, le signal se retrouve dilué dans la moyenne. On peut ainsi détecter un signal inflammatoire sans savoir quelles cellules le produisent.

En étudiant les cellules individuellement, on peut poser d’autres questions :

- Quels types de cellules cet échantillon pourrait-il contenir ?
- Quels gènes sont généralement actifs dans les mêmes groupes de cellules ?
- Certaines cellules présentent-elles un état inhabituel ?
- Quel type cellulaire est affecté par la maladie, le traitement ou le passage du temps ?

Les résultats prennent souvent la forme d’un tableau avec les gènes en lignes et les cellules en colonnes :

| Gène | Cellule 1 | Cellule 2 | Cellule 3 |
| --- | ---: | ---: | ---: |
| Gène A | 8 | 0 | 1 |
| Gène B | 0 | 6 | 5 |
| Gène C | 2 | 1 | 0 |

Chaque ligne correspond à un gène et chaque colonne à une **cellule candidate**. Le logiciel estime que ce code-barres provient probablement d’un compartiment contenant une cellule. Cela ne garantit pas que ce compartiment contenait exactement une cellule intacte.

Le sens des valeurs dépend de la méthode. Avec 10x et les autres méthodes à UMI, une valeur est généralement le nombre d’UMI distincts pour un gène et un code-barres cellulaire. Elle estime le nombre de molécules capturées. Smart-seq2 n’utilise pas d’UMI : la matrice peut contenir des nombres de fragments de séquence lus (les *reads*, ou lectures) ou des abondances calculées à partir de ces lectures. Une leçon ultérieure comparera nombres de lectures, nombres d’UMI et valeurs normalisées.

**Ces valeurs sont des mesures techniques, avec leurs limites.** De l’ARN peut se dégrader pendant la manipulation ou échapper à la capture. Une molécule peu abondante peut aussi manquer par le seul effet de l’échantillonnage. Un zéro peut donc correspondre à un gène non exprimé ou à un ARN présent, mais non détecté.

Lorsque le tissu est dissocié, on perd généralement la position d’origine des cellules. Sur un graphique de regroupement, deux cellules proches ont des profils d’expression semblables. Pour connaître leur position dans le tissu, il faut des mesures distinctes, par imagerie tissulaire ou par des méthodes d’omique spatiale.

## Comment la technique s’est-elle développée ?

Chaque avancée a permis de répondre à une nouvelle question.

### 2009 : peut-on mesurer l’ARN d’une seule cellule ?

En 2009, Tang Fuchou et ses collègues de l’Université de Pékin ont montré dans *Nature Methods* qu’il était possible de séquencer les ARNm à l’échelle du transcriptome dans des blastomères et des ovocytes de souris pris individuellement. Les tableaux de l’étude décrivent six échantillons indépendants d’une cellule chacun. Même avec très peu d’ARN initial, sa conversion en ADN complémentaire (ADNc), suivie d’un séquençage à haut débit, permettait de détecter de nombreux gènes.

Cette étude est l’un des points de départ du scRNA-seq. Elle établissait la faisabilité de la mesure. Traiter simultanément des milliers de cellules restait alors difficile.

[Publication originale de Tang et de ses collègues](https://doi.org/10.1038/nmeth.1315)

### Smart-seq : peut-on lire une plus grande partie de chaque transcrit ?

L’ARN est instable et chaque cellule en contient peu. On commence donc généralement par la **transcription inverse**, qui copie l’ARN en ADN complémentaire (ADNc), plus stable, avant l’amplification et le séquençage.

Smart-seq a amélioré en 2012 la couverture des transcrits de cellules individuelles. Smart-seq2 a accru en 2013 la sensibilité, la précision et l’uniformité de cette couverture. En 2020, Smart-seq3 a ajouté des UMI à l’extrémité 5′, associant le comptage des molécules à l’analyse des transcrits et des allèles.

Avec Smart-seq, les cellules sont généralement placées dans des puits de réaction séparés. Cette approche permet d’examiner finement les isoformes d’épissage ou les différences de séquence. Elle demande davantage de manipulations indépendantes et de séquençage par cellule, ce qui limite le nombre de cellules étudiées à la fois par rapport aux méthodes en gouttelettes.

L’expression « pleine longueur » indique que les lectures peuvent se répartir sur une grande partie du transcrit. **Elle ne signifie pas que chaque molécule d’ARN est lue en continu de l’extrémité 5′ à l’extrémité 3′ en une seule lecture.**

[Publication sur Smart-seq](https://doi.org/10.1038/nbt.2282) · [Publication sur Smart-seq2](https://doi.org/10.1038/nmeth.2639) · [Publication sur Smart-seq3](https://doi.org/10.1038/s41587-020-0497-0)

### Les gouttelettes : peut-on étudier davantage de cellules simultanément ?

Pour dresser la carte cellulaire d’un tissu complexe, il fallait passer de l’étude approfondie de quelques cellules au traitement de milliers de cellules en parallèle. En 2015, inDrop et Drop-seq ont montré comment marquer l’ARN de nombreuses cellules dans de minuscules gouttelettes. En 2017, Zheng et ses collègues ont décrit un système à haut débit devenu l’un des fondements de la méthode Chromium de 10x Genomics. Ils ont présenté des données portant sur des dizaines de milliers de cellules mononucléées du sang périphérique humain.

Les gouttelettes étaient donc utilisées en scRNA-seq avant 10x. La contribution de 10x a été de réunir le compartimentage en gouttelettes, les billes de gel à code-barres, les UMI et le traitement informatique dans un système utilisable à grande échelle.

[Publication sur inDrop](https://doi.org/10.1016/j.cell.2015.04.044) · [Publication sur Drop-seq](https://doi.org/10.1016/j.cell.2015.05.002) · [Publication de Zheng et de ses collègues](https://doi.org/10.1038/ncomms14049)

## Attribuer une « adresse » avant de mélanger

Si l’on lyse directement mille cellules, tout leur ARN se retrouve dans le même tube. La séquence d’un ARN ne permet alors plus de savoir de quelle cellule il provient.

Un colis reçoit son adresse avant de passer par le centre de tri. De même, on ajoute une courte séquence d’ADN lisible avant de mélanger les ADNc des différentes cellules. Après le séquençage, le logiciel utilise ces séquences pour attribuer les lectures à leur source.

Trois marques ont des fonctions distinctes dans les données 10x :

| Marque | Que distingue-t-elle ? | Question à retenir |
| --- | --- | --- |
| Code-barres cellulaire | Les différents GEM, ou compartiments de réaction | De quel compartiment cet ADNc provient-il ? |
| UMI (identifiant moléculaire unique) | Les différentes molécules d’ARN initiales capturées dans un même compartiment | De quelle molécule capturée s’agit-il ? |
| Index d’échantillon | Les banques mélangées pour une même série de séquençage | À quelle banque cette lecture appartient-elle ? |

L’index identifie une banque, sans indiquer automatiquement le donneur, le traitement ni le réplicat biologique. Un échantillon provenant d’un donneur ou d’un animal peut être réparti entre plusieurs banques. Inversement, une méthode de multiplexage supplémentaire permet de réunir plusieurs échantillons dans une banque. Les milliers de cellules d’un seul échantillon ne constituent donc pas des milliers de réplicats biologiques indépendants. L’unité expérimentale est généralement le donneur, l’animal ou l’échantillon indépendant. Le plan expérimental, la pseudoréplication et les comparaisons statistiques entre groupes seront abordés plus tard.

La comparaison avec une adresse a trois limites :

1. Le code-barres identifie un **compartiment GEM**. Deux cellules qui entrent dans le même GEM partagent le code-barres et forment un doublet. Pour plusieurs cellules, on parle de multiplet.
2. L’UMI limite les doubles comptages dus aux copies produites par PCR. Deux molécules peuvent toutefois recevoir le même UMI. Les erreurs de séquençage et la perte de molécules affectent aussi l’estimation.
3. L’ARN ambiant libéré par des cellules rompues peut entrer dans un GEM avec une cellule intacte et recevoir le code-barres de ce compartiment. Le code-barres ne prouve donc pas que tout l’ARN du GEM provient de la cellule intacte. Une leçon sur le contrôle qualité expliquera comment repérer et corriger cette contamination.

## Les six étapes de la méthode 10x 3′ Gene Expression

Le séquenceur lit une banque d’ADN préparée au préalable. À ce stade, les cellules ont déjà été lysées et leur ARN copié en ADNc marqué.

Nous suivons ici la méthode courante de mesure de l’expression en 3′ de 10x. La méthode en 5′ utilise aussi des GEM, des codes-barres cellulaires et des UMI, mais la chimie qui incorpore les marques dans l’ADNc diffère. Pour les manipulations, reportez-vous au manuel du kit utilisé.

Le déroulement réel commence au prélèvement. Le temps pendant lequel le tissu est privé d’irrigation sanguine (temps d’ischémie), sa conservation, le délai avant traitement, la personne qui le manipule et le lot de réactifs peuvent modifier l’état des cellules ou leur représentation avant même la dissociation. Évitez que chaque condition expérimentale corresponde systématiquement à une date ou à un lot différent. Une leçon détaillera la randomisation, l’équilibrage des lots, les témoins et l’enregistrement des métadonnées.

### Étape 1. Obtenir une suspension de cellules isolées

Un traitement mécanique ou une digestion enzymatique sépare autant que possible les cellules du tissu. Le liquide obtenu est une **suspension de cellules isolées**. On cherche à préserver des cellules intactes et viables, avec le moins possible d’amas, de débris et d’ARN libre.

Comment la suspension a-t-elle été préparée ? Les étapes de séparation ou d’enrichissement peuvent retenir certaines populations et en éliminer d’autres. Le sang total débarrassé des globules rouges, la fraction mononucléée du sang périphérique (PBMC) et un échantillon enrichi en granulocytes ont des compositions différentes. Après séparation sur gradient de densité, la fraction PBMC contient surtout des lymphocytes et des monocytes. La plupart des neutrophiles de densité normale n’y sont pas recueillis. Elle ne représente donc pas tous les globules blancs.

Un type cellulaire fragile peut être sous-représenté dans la matrice s’il se rompt lors de la digestion. Une digestion trop longue peut aussi déclencher une réponse au stress et modifier le profil d’ARN initial.

Pour des échantillons congelés, des tissus difficiles à dissocier ou des cellules fragiles, on peut isoler les noyaux et séquencer leur ARN (snRNA-seq). Les principes du marquage sont voisins, mais les ARN observés, la proportion de lectures introniques et les biais entre types cellulaires peuvent différer. Nous comparerons ces approches dans une prochaine leçon.

### Étape 2. Compter les cellules et contrôler leur qualité

Avant d’introduire la suspension dans la puce microfluidique, on évalue sa concentration en cellules, leur viabilité et la présence d’amas. Si elle est trop diluée, beaucoup de compartiments restent vides. Si elle est trop concentrée, deux cellules risquent davantage d’entrer dans le même compartiment. On recherche un compromis entre le nombre de cellules récupérées et la proportion de doublets.

### Étape 3. Former des GEM, de minuscules compartiments de réaction

La suspension cellulaire, le mélange réactionnel, les billes de gel munies d’amorces à code-barres et l’huile entrent dans la puce par des canaux distincts. Leur rencontre forme de nombreux GEM (*Gel Beads-in-emulsion*) d’un volume de l’ordre du nanolitre.

Un GEM est une goutte aqueuse dispersée dans l’huile. Un GEM productif idéal contient une cellule et une bille de gel. Certaines gouttes ne contiennent aucune cellule ; une petite fraction en contient deux ou davantage.

![Les six étapes du séquençage de l’ARN en cellule unique par 10x Chromium, du tissu à la matrice d’expression gènes × cellules](figures/scrna-seq-gem-workflow.fr.svg)

*Figure 1 | Les six étapes de 10x Chromium 3′ Gene Expression. Illustration originale du projet réalisée avec l’aide de l’IA, mise en page révisée le 23 novembre 2026. Lire les étapes 1 à 3 en haut puis 4 à 6 en bas. Les objets ne sont pas à l’échelle. Pour le détail des réactifs et des manipulations, consulter le manuel de la version utilisée. Sources : [méthode 3′ Gene Expression de 10x Genomics](https://www.10xgenomics.com/support/universal-three-prime-gene-expression/documentation/steps/experimental-design-and-planning/getting-started-single-cell-3-gene-expression) et [publication de Zheng et de ses collègues](https://doi.org/10.1038/ncomms14049).*

### Étape 4. Lyser la cellule et marquer les molécules dans le GEM

La lyse de la cellule libère ses ARNm. Les amorces d’une bille portent un code-barres cellulaire commun et différents UMI. Lors de la transcription inverse, l’information des ARNm est copiée en ADNc et les marques sont incorporées dans l’ADNc formé.

Les ADNc issus d’un même GEM partagent donc le même code-barres cellulaire, tandis que des molécules d’ARN initiales distinctes portent généralement des UMI différents. **Les codes-barres sont incorporés lors de la préparation de la banque. Après le séquençage, le logiciel les lit.**

### Étape 5. Rompre l’émulsion, amplifier l’ADNc et préparer la banque

Après la transcription inverse, on rompt l’émulsion d’eau dans l’huile et on réunit les ADNc marqués. Les produits des différentes cellules peuvent désormais être mélangés : les codes-barres gardent la trace de leur origine.

Une seule cellule fournit trop peu d’ADNc pour un séquençage direct. On l’amplifie donc par PCR. On fragmente ensuite l’ADNc et on ajoute les adaptateurs de séquençage et les index d’échantillon pour former la banque que l’appareil pourra lire.

### Étape 6. Séquencer la banque et retrouver l’origine des lectures

Certaines positions dans les lectures de séquençage contiennent le code-barres cellulaire et l’UMI. D’autres correspondent au transcrit. Le logiciel utilise ces informations pour :

1. attribuer la lecture à un compartiment ;
2. identifier le gène dont provient la séquence du transcrit ;
3. limiter, grâce aux UMI, le double comptage des copies issues de la PCR ;
4. repérer les codes-barres dont le signal évoque une cellule plutôt que l’ARN de fond d’une goutte vide ;
5. produire une matrice d’expression avec les gènes en lignes et les cellules en colonnes.

Le tissu prélevé a ainsi donné un tableau de valeurs que l’on peut analyser.

## Que signifient 3′, 5′ et « pleine longueur » ?

La chaîne d’ARN est orientée. Ses extrémités sont appelées 5′ et 3′. Inutile pour l’instant de mémoriser la numérotation des atomes de carbone : **il s’agit des deux extrémités d’une même molécule d’ARN.**

| Méthode | Quelle région lit-on dans une banque d’expression courante ? | Utilisation fréquente |
| --- | --- | --- |
| 10x 3′ Gene Expression | Une courte séquence proche de l’extrémité 3′ du transcrit | Mesurer l’expression, regrouper les cellules et identifier les types cellulaires à grande échelle |
| 10x 5′ Gene Expression | Une courte séquence proche de l’extrémité 5′ du transcrit | Mesurer l’expression et, à partir du même ADNc, préparer des banques V(D)J pour les récepteurs TCR ou BCR |
| Smart-seq2 / Smart-seq3 | Les lectures peuvent couvrir une plus grande partie du transcrit | Étudier les isoformes d’épissage, les allèles ou la structure des transcrits |

Les méthodes en 3′ et 5′ utilisent une courte séquence à une extrémité du transcrit pour identifier le gène et compter les molécules. La transcription inverse peut produire des ADNc longs, voire de pleine longueur. Dans une banque d’expression courante, on lit pourtant principalement une extrémité. Produire un ADNc de pleine longueur n’équivaut donc pas à obtenir la séquence complète du transcrit.

La méthode en 5′ est fréquente en immunologie : elle permet de préparer une banque V(D)J supplémentaire pour les récepteurs des lymphocytes T (TCR) ou B (BCR) et de suivre des clones de cellules immunitaires. Le choix entre 3′ et 5′ dépend de la question de recherche.

[Documentation officielle 10x en 3′](https://www.10xgenomics.com/support/universal-three-prime-gene-expression) · [Documentation officielle 10x en 5′](https://www.10xgenomics.com/support/universal-five-prime-gene-expression)

## En quoi 10x, BD et Singleron diffèrent-ils ?

Pour comparer les plateformes, partez de la même question : **comment chacune sépare-t-elle les cellules et marque-t-elle l’ARN de chaque compartiment pour que l’on puisse en retrouver l’origine ?**

Vérifiez que l’on compare le même type d’entrée (cellules intactes ou noyaux), la même mesure (panel ciblé ou transcriptome entier, par exemple), la version des réactifs, la profondeur de séquençage et le traitement informatique. Sinon, une différence de résultat ne peut pas être attribuée à la seule plateforme.

### 10x Chromium : compartimentage en gouttelettes

Chez 10x, les gouttelettes GEM servent de compartiments de réaction. On peut traiter de nombreuses cellules en parallèle et obtenir généralement des nombres d’UMI par gène. Les données 10x 3′/5′ classiques sont habituellement traitées avec une version de Cell Ranger adaptée aux réactifs utilisés.

### BD Rhapsody : compartimentage en micropuits

BD Rhapsody utilise un réseau de micropuits. Les cellules s’y déposent par gravité, puis on ajoute des billes magnétiques de capture portant les codes-barres cellulaires et les UMI. Après la lyse, une bille voisine capte les ARN pourvus d’une queue poly(A). Les billes sont ensuite recueillies : la transcription inverse et la préparation de la banque se déroulent dans un tube. L’imagerie permet de contrôler les cellules dans les puits et de repérer les puits à plusieurs cellules.

[Documentation technique officielle de BD Rhapsody](https://www.bdbiosciences.com/en-us/products/instruments/single-cell-multiomics-systems/rhapsody)

### SCOPE-chip de Singleron : une autre approche en micropuits

La SCOPE-chip de Singleron utilise elle aussi des micropuits. Les cellules s’y déposent par gravité avant l’ajout de billes de capture à code-barres. Après la lyse, les ARNm se fixent sur les billes. Les billes magnétiques sont ensuite recueillies pour effectuer la transcription inverse, l’amplification et la préparation de la banque dans un tube de réaction ordinaire.

Les données brutes de Singleron sont généralement traitées avec CeleScope ou un autre outil adapté à la chimie des réactifs. La structure des lectures et les codes-barres diffèrent de ceux de 10x. Il faut donc vérifier l’origine et la structure d’un FASTQ avant de l’utiliser dans Cell Ranger.

[Documentation technique de la SCOPE-chip](https://singleron.bio/scope-chip/) · [Documentation officielle de CeleScope](https://singleron.bio/products/celescope/)

Le choix d’une plateforme dépend de la question posée. Le tissu, la dissociation, la version des réactifs, la profondeur de séquençage et les réglages du logiciel influencent le nombre et la proportion de cellules retrouvées, ainsi que le nombre de gènes détectés.

## Pourquoi les neutrophiles illustrent-ils les biais de plateforme ?

Les neutrophiles sont des globules blancs de l’immunité innée. Ils contiennent relativement peu d’ARNm et de nombreuses enzymes capables de dégrader l’ARN. Ils sont aussi fragiles lors des manipulations. Plusieurs effets peuvent donc se succéder :

> rupture de cellules pendant la préparation → perte d’ARN ou libération dans le milieu → moins d’UMI détectés dans les cellules intactes → classement de codes-barres à faible signal parmi les gouttes vides ou les cellules de mauvaise qualité

Avant d’invoquer un biais de plateforme, vérifiez le matériel chargé : sang total débarrassé des globules rouges, PBMC ou échantillon enrichi en granulocytes. Les neutrophiles déjà éliminés pendant la séparation ne peuvent être retrouvés ni par un test 10x ou BD ultérieur ni par le logiciel d’identification des cellules. Dans ce cas, leur absence renseigne surtout sur la composition de l’échantillon d’entrée.

Dans certaines comparaisons directes, pour des tissus, des réactifs et des traitements informatiques précis, BD Rhapsody a mieux récupéré certaines cellules pauvres en ARN ou certains granulocytes et a mieux dénombré leurs molécules. Ces études ont aussi observé des différences avec 10x pour la capture productive des cellules, le nombre de gènes détectés par cellule et d’autres types cellulaires. Une autre règle d’identification des codes-barres cellulaires (*cell calling*) peut également faire apparaître davantage de neutrophiles dans les données 10x.

On ne peut donc pas conclure que seule la plateforme BD détecte les neutrophiles. **La préparation de l’échantillon, la chimie de la plateforme et le traitement des données peuvent tous trois modifier le résultat.** Si votre étude porte sur les neutrophiles, prévoyez d’évaluer ces biais et de vérifier les proportions par une méthode indépendante, comme la cytométrie en flux ou l’imagerie tissulaire.

[Comparaison sur du tissu prostatique humain](https://doi.org/10.1016/j.heliyon.2024.e28358) · [Comparaison sur du tissu tumoral de souris](https://doi.org/10.1016/j.heliyon.2024.e37185) · [Étude de l’identification des neutrophiles dans les données 10x](https://doi.org/10.4049/jimmunol.2200154)

## Leçon 1.2 : des données publiques à la matrice d’expression

Le séquenceur produit des séquences de bases et les informations sur la qualité de chaque base. Le format FASTQ est couramment utilisé pour les transmettre. Les données brutes peuvent aussi être déposées dans le Sequence Read Archive (SRA) du NCBI. Le parcours est alors le suivant :

```text
Données SRA d’une étude publique
  → Convertir ou télécharger les données au format FASTQ approprié
  → Vérifier la plateforme expérimentale, la version des réactifs et la structure des lectures
  → Choisir une chaîne de traitement adaptée
      Données 10x : Cell Ranger
      Données Singleron : CeleScope ou une chaîne indépendante adaptée à la chimie utilisée
  → Matrice d’expression (gènes en lignes, cellules en colonnes) et rapport qualité
```

Pour les données 10x 3′/5′ classiques, Cell Ranger traite les FASTQ : il lit les codes-barres, aligne les séquences, compte les UMI, identifie les cellules candidates et génère la matrice. Il fournit également de premiers indicateurs de qualité, des résultats de réduction de dimension et de regroupement, et parfois une annotation préliminaire des types cellulaires. Ils facilitent une première inspection. Un filtrage rigoureux, l’intégration des échantillons, l’annotation, l’inférence statistique et la validation biologique nécessitent généralement d’autres analyses en R ou Python éclairées par le plan de l’étude.

Cell Ranger fournit généralement une matrice brute et une matrice filtrée. La première conserve davantage de codes-barres ; la seconde retient ceux que les règles du logiciel attribuent à des cellules. Certaines cellules pauvres en ARN peuvent manquer dans la matrice filtrée. En pratique, nous examinerons donc les deux matrices, le rapport qualité, les versions du génome et de son annotation, les réactifs, la version du logiciel et les réglages d’identification des cellules.

Avant de traiter des données SRA, il faut confirmer qu’elles proviennent d’une expérience 10x compatible et connaître la structure des lectures, le génome de référence, la version des réactifs et les relations entre échantillons. **La leçon 1.2 partira d’un jeu de données public pour retrouver les données SRA, contrôler les FASTQ et examiner le traitement par Cell Ranger et ses fichiers de sortie. Aucune commande n’est à mémoriser pour l’instant.**

[Présentation du SRA par le NCBI](https://www.ncbi.nlm.nih.gov/sra) · [Documentation officielle de Cell Ranger](https://www.10xgenomics.com/support/software/cell-ranger/latest)

## À retenir

- Le scRNA-seq ne photographie pas la cellule. On lyse les cellules et on capture leur ARN. Les marques sont ajoutées avant de mélanger les ADNc de différentes origines.
- Le code-barres cellulaire identifie un compartiment de réaction, l’UMI aide à estimer le nombre de molécules initiales capturées et l’index d’échantillon distingue les banques.
- 10x utilise des gouttelettes GEM. BD Rhapsody et la SCOPE-chip de Singleron utilisent des micropuits. Chaque approche peut introduire des biais de capture.
- Les méthodes en 3′, en 5′ et Smart-seq donnent accès à des informations différentes. La question de recherche guide le choix.
- Après le séquençage, un logiciel adapté à l’expérience transforme les données brutes en matrice d’expression gènes × cellules.

## Références et lectures complémentaires

1. Tang F, et al. mRNA-Seq whole-transcriptome analysis of a single cell. *Nature Methods*. 2009. [doi:10.1038/nmeth.1315](https://doi.org/10.1038/nmeth.1315)
2. Ramsköld D, et al. Full-length mRNA-Seq from single-cell levels of RNA and individual circulating tumor cells. *Nature Biotechnology*. 2012. [doi:10.1038/nbt.2282](https://doi.org/10.1038/nbt.2282)
3. Picelli S, et al. Smart-seq2 for sensitive full-length transcriptome profiling in single cells. *Nature Methods*. 2013. [doi:10.1038/nmeth.2639](https://doi.org/10.1038/nmeth.2639)
4. Hagemann-Jensen M, et al. Single-cell RNA counting at allele and isoform resolution using Smart-seq3. *Nature Biotechnology*. 2020. [doi:10.1038/s41587-020-0497-0](https://doi.org/10.1038/s41587-020-0497-0)
5. Klein AM, et al. Droplet barcoding for single-cell transcriptomics applied to embryonic stem cells. *Cell*. 2015. [doi:10.1016/j.cell.2015.04.044](https://doi.org/10.1016/j.cell.2015.04.044)
6. Macosko EZ, et al. Highly parallel genome-wide expression profiling of individual cells using nanoliter droplets. *Cell*. 2015. [doi:10.1016/j.cell.2015.05.002](https://doi.org/10.1016/j.cell.2015.05.002)
7. Zheng GXY, et al. Massively parallel digital transcriptional profiling of single cells. *Nature Communications*. 2017. [doi:10.1038/ncomms14049](https://doi.org/10.1038/ncomms14049)
