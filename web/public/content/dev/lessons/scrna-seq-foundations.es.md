# 1.1 | Secuenciación de ARN de células individuales: historia, principios y plataformas

Imagina un zumo preparado con varias frutas. Puedes medir cuánto azúcar contiene, pero esa medición difícilmente te dirá si el dulzor procede sobre todo de las manzanas o de unas pocas uvas muy dulces.

En un tejido ocurre algo parecido. Un tumor, una gota de sangre o un fragmento de cerebro suelen contener varios tipos de células. Si medimos todo su ARN junto, veremos los cambios del conjunto. Es fácil pasar por alto las células raras y resulta difícil atribuir un cambio a un tipo celular concreto.

La secuenciación de ARN de células individuales (scRNA-seq) permite rastrear ese origen. **Antes de mezclar el material de distintas células para secuenciarlo, se incorpora una etiqueta que permite reconocer de qué célula procede.**

En esta lección no hace falta ejecutar ningún programa. Seguiremos este recorrido:

> muestra biológica → células individuales → etiquetado del origen del ARN → secuenciación → matriz de expresión con genes en las filas y células en las columnas


## Cuatro ideas para empezar

- La **célula** es una unidad básica de la vida. Las células de un mismo tejido pueden ser diferentes.
- El **ADN** almacena información genética relativamente estable. El ARN producido a partir de un gen ofrece una pista sobre el uso de ese gen.
- De momento, puedes imaginar el **ARN** como una copia de trabajo temporal hecha a partir del ADN. Si el ARN de un gen es más fácil de detectar, ese gen suele estar más activo, aunque la correspondencia no es exacta.
- El **transcriptoma** es el conjunto de ARN que puede observarse en una muestra en un momento dado. Ofrece una instantánea de la actividad de la célula.

Con estas cuatro ideas puedes seguir el resto de la lección.

Los métodos habituales de expresión génica que veremos miden sobre todo los ARN mensajeros (ARNm) con cola poli(A) que el experimento consigue capturar. No miden por igual todos los tipos de ARN. Los recuentos dependen de la producción y degradación del ARN y de la eficacia de captura. Por eso estiman cuántas moléculas de ARNm seguían presentes y fueron capturadas en un momento dado. No miden directamente la velocidad de transcripción del gen.

## ¿Qué se pierde al medir todo el ARN en un mismo tubo?

Supongamos que una muestra contiene 90 células del tipo A y 10 del tipo B. Solo en las de tipo B se expresa mucho un gen relacionado con la inflamación. Si se analizan juntas las 100 células, la señal se diluye en el promedio. Así se puede detectar una señal inflamatoria sin saber qué células la produjeron.

Al analizar células individuales podemos plantear otras preguntas:

- ¿Qué tipos celulares podría haber en la muestra?
- ¿Qué genes tienden a estar activos en el mismo grupo de células?
- ¿Hay un pequeño grupo de células en un estado poco habitual?
- ¿Qué tipo celular se ve afectado por una enfermedad, un tratamiento o el paso del tiempo?

El resultado suele representarse en una tabla con genes en las filas y células en las columnas:

| Gen | Célula 1 | Célula 2 | Célula 3 |
| --- | ---: | ---: | ---: |
| Gen A | 8 | 0 | 1 |
| Gen B | 0 | 6 | 5 |
| Gen C | 2 | 1 | 0 |

Cada fila representa un gen y cada columna, una **célula candidata**. Es un código de barras que el programa considera que probablemente procede de un compartimento con una célula. Eso no garantiza que hubiera exactamente una célula intacta en su interior.

El significado de los números depende del método. Con 10x y otros métodos basados en UMI, un valor suele ser el número de UMI distintos para un gen y un código de barras celular. Es una estimación técnica del número de moléculas capturadas. Smart-seq2 no utiliza UMI, de modo que su matriz puede contener el número de fragmentos de secuencia leídos (lecturas o *reads*) o abundancias calculadas a partir de ellos. Más adelante compararemos los recuentos de lecturas, los de UMI y los valores normalizados.

**Estas cifras son mediciones técnicas y no representan un inventario completo del ARN celular.** El ARN puede degradarse durante la manipulación o escapar a la captura. Si hay pocas moléculas, es posible que ninguna quede representada en la muestra medida. Por eso, un cero puede corresponder a un gen sin expresión o a un ARN presente que no se detectó.

La disociación suele hacer que se pierdan las coordenadas originales de cada célula. Un gráfico de agrupamiento muestra qué células tienen perfiles de expresión parecidos. Su ubicación real en el tejido requiere una medición aparte, por ejemplo mediante imágenes del tejido o técnicas de ómica espacial.

## ¿Cómo surgió esta tecnología?

Cada avance respondió a una pregunta distinta.

### 2009: ¿podemos medir el ARN de una sola célula?

En 2009, Tang Fuchou y sus colaboradores de la Universidad de Pekín publicaron en *Nature Methods* que era posible secuenciar el ARNm a escala del transcriptoma en blastómeros y ovocitos individuales de ratón. Sus tablas de datos recogen seis muestras independientes de una célula cada una. Incluso con muy poco ARN inicial, pudieron convertirlo en ADN complementario (ADNc) y detectar numerosos genes mediante secuenciación de alto rendimiento.

Este estudio se considera uno de los puntos de partida de la scRNA-seq. Demostró que la medición era posible. En aquella época todavía resultaba difícil procesar miles de células a la vez.

[Artículo original de Tang y sus colaboradores](https://doi.org/10.1038/nmeth.1315)

### Smart-seq: ¿podemos leer una mayor parte de cada transcrito?

El ARN es inestable y una célula contiene poca cantidad. Por eso los experimentos suelen comenzar con la **transcripción inversa**, que copia el ARN en ADN complementario (ADNc), más estable, antes de amplificarlo y secuenciarlo.

En 2012, Smart-seq mejoró la cobertura de los transcritos de células individuales. En 2013, Smart-seq2 aumentó la sensibilidad, la precisión y la uniformidad de la cobertura. En 2020, Smart-seq3 incorporó UMI en el extremo 5′, lo que permitió combinar el recuento de moléculas con el análisis de transcritos y alelos.

Con Smart-seq, cada célula suele colocarse en un pocillo de reacción separado. Así se pueden examinar en detalle las isoformas de empalme y las diferencias de secuencia. Como cada célula requiere más manipulación y mayor capacidad de secuenciación, suelen analizarse menos células a la vez que con los métodos en gotas.

«Longitud completa» significa que las lecturas pueden distribuirse a lo largo de buena parte del transcrito. **No significa que cada molécula de ARN se lea necesariamente de principio a fin, del extremo 5′ al 3′, en una sola lectura.**

[Artículo sobre Smart-seq](https://doi.org/10.1038/nbt.2282) · [Artículo sobre Smart-seq2](https://doi.org/10.1038/nmeth.2639) · [Artículo sobre Smart-seq3](https://doi.org/10.1038/s41587-020-0497-0)

### Métodos en gotas: ¿podemos medir más células a la vez?

Para cartografiar las células de un tejido complejo hizo falta pasar del estudio detallado de unas pocas células al procesamiento paralelo de miles. En 2015, inDrop y Drop-seq mostraron cómo etiquetar el ARN de muchas células en gotas diminutas. En 2017, Zheng y sus colaboradores describieron un sistema de alto rendimiento que se convirtió en una de las bases del método Chromium de 10x Genomics. Presentaron datos de decenas de miles de células mononucleares de sangre periférica humana.

Por tanto, los métodos de scRNA-seq en gotas son anteriores a 10x. La contribución de 10x fue integrar la formación de gotas, las perlas de gel con códigos de barras, los UMI y el procesamiento informático en un sistema que podía utilizarse a gran escala.

[Artículo sobre inDrop](https://doi.org/10.1016/j.cell.2015.04.044) · [Artículo sobre Drop-seq](https://doi.org/10.1016/j.cell.2015.05.002) · [Artículo de Zheng y sus colaboradores](https://doi.org/10.1038/ncomms14049)

## Asignar una «dirección» antes de mezclar

Si se rompen directamente mil células, todo su ARN queda en el mismo tubo. Una vez mezclado, la secuencia de una molécula de ARN por sí sola ya no permite saber de qué célula procedía.

Un paquete recibe su dirección antes de llegar al centro de clasificación. De manera similar, se añade una secuencia corta de ADN que se puede leer antes de mezclar el ADNc de diferentes células. Tras la secuenciación, el programa utiliza esas secuencias para asignar las lecturas a su origen.

En los datos de 10x conviene distinguir tres etiquetas:

| Etiqueta | ¿Qué distingue? | Pregunta para recordarlo |
| --- | --- | --- |
| Código de barras celular | Distintos GEM o compartimentos de reacción | ¿De qué compartimento procede este ADNc? |
| UMI (identificador molecular único) | Distintas moléculas originales de ARN capturadas en el mismo compartimento | ¿De qué molécula capturada se trata? |
| Índice de muestra | Las bibliotecas mezcladas en una misma corrida de secuenciación | ¿A qué biblioteca pertenece esta lectura? |

El índice identifica una biblioteca. Por sí solo no identifica al donante, al grupo de tratamiento ni a la réplica biológica. La muestra de un donante o animal puede repartirse entre varias bibliotecas. A la inversa, una biblioteca puede contener varias muestras si se usa un método adicional de multiplexación. Miles de células de una sola muestra tampoco son miles de réplicas biológicas independientes. La unidad experimental suele ser el donante, el animal o la muestra independiente. Más adelante veremos el diseño experimental, la pseudorreplicación y las comparaciones estadísticas entre grupos.

La analogía con la dirección postal tiene tres límites:

1. El código de barras identifica un **compartimento GEM**. Dos células que entran en el mismo GEM comparten el código y forman un doblete. Para varios ocupantes se habla de multiplete.
2. Un UMI ayuda a reducir el recuento repetido de copias producidas por PCR. Sin embargo, dos moléculas pueden recibir el mismo UMI por azar. Los errores de secuenciación y las pérdidas de moléculas también afectan a la estimación.
3. El ARN ambiental liberado por células dañadas puede entrar en un GEM con una célula intacta y recibir el código de ese compartimento. El código no demuestra que todo el ARN presente proceda de esa célula. Una lección de control de calidad explicará cómo detectar y corregir la contaminación por ARN ambiental.

## El método 10x 3′ Gene Expression en seis pasos

El secuenciador lee una biblioteca de ADN ya preparada. Para entonces, las células se han lisado y su ARN se ha copiado en ADNc etiquetado.

Seguiremos la técnica habitual de expresión génica 3′ de 10x. La técnica 5′ también utiliza GEM, códigos de barras celulares y UMI, pero la química que incorpora las etiquetas al ADNc es distinta. Para los detalles de una versión de reactivos, consulta el manual correspondiente.

En realidad el proceso comienza con la recogida de la muestra. El tiempo durante el cual el tejido permanece sin riego sanguíneo (tiempo de isquemia), la conservación, la demora hasta el procesamiento, la persona que lo realiza y el lote de reactivos pueden alterar los estados celulares o la proporción de células recuperadas incluso antes de disociar el tejido. Conviene evitar que las condiciones experimentales coincidan por completo con fechas o lotes de procesamiento. Más adelante veremos la aleatorización, el reparto equilibrado entre lotes, los controles y el registro de metadatos.

### Paso 1. Obtener una suspensión de células individuales

El tejido se separa en células individuales en la medida de lo posible mediante procedimientos mecánicos o digestión enzimática. El líquido resultante es una **suspensión de células individuales**. Se busca conservar células intactas y viables, con el mínimo de agregados, fragmentos y ARN libre.

¿Cómo se preparó la suspensión? La separación y el enriquecimiento previos pueden conservar ciertas poblaciones y eliminar otras. La sangre total sin eritrocitos, las células mononucleares de sangre periférica (PBMC) y una muestra enriquecida en granulocitos tienen composiciones distintas. Tras la separación habitual por gradiente de densidad, la fracción PBMC contiene sobre todo linfocitos y monocitos. La mayoría de los neutrófilos de densidad normal no quedan en esa fracción. Por tanto, las PBMC no representan a todos los leucocitos de la sangre.

Un tipo celular que se rompe con facilidad durante la digestión puede quedar infrarrepresentado en la matriz. Una digestión demasiado larga también puede provocar una respuesta al estrés que altere el perfil de ARN original.

Para tejidos congelados, difíciles de disociar o con células frágiles, se pueden aislar los núcleos y secuenciar su ARN (snRNA-seq). Los principios del etiquetado son similares, pero varían los ARN observables, la proporción de lecturas intrónicas y los sesgos entre tipos celulares. Compararemos ambas estrategias en otra lección.

### Paso 2. Contar las células y comprobar la calidad

Antes de introducir la suspensión en el chip microfluídico se comprueba la concentración de células, su viabilidad y la formación de agregados. Si la concentración es demasiado baja, quedan muchos compartimentos vacíos. Si es demasiado alta, aumenta la probabilidad de que entren dos células en la misma gota. Se busca recuperar suficientes células y, al mismo tiempo, limitar la tasa de dobletes.

### Paso 3. Formar los GEM, pequeños compartimentos de reacción

La suspensión celular, la mezcla de reacción, las perlas de gel con cebadores que llevan códigos de barras y la fase oleosa entran por canales distintos del chip. Al encontrarse las corrientes, se forman numerosos GEM (*Gel Beads-in-emulsion*) de un volumen del orden de nanolitros.

Cada GEM es una gota acuosa dispersa en aceite. Un GEM productivo ideal contiene una célula y una perla de gel. En la práctica, también se forman GEM sin células y una pequeña proporción con dos o más células.

![Seis pasos de la secuenciación de ARN de células individuales con 10x Chromium, del tejido a una matriz de expresión de genes por células](figures/scrna-seq-gem-workflow.es.svg)

*Figura 1 | Los seis pasos de 10x Chromium 3′ Gene Expression. Ilustración original del proyecto realizada con ayuda de IA. Diseño revisado el 23 de noviembre de 2026. Lee los pasos 1–3 en la fila superior y 4–6 en la inferior. Los objetos no están a escala. Para los reactivos y procedimientos, consulta el manual de la versión correspondiente. Fuentes: el [método de expresión génica 3′ de 10x Genomics](https://www.10xgenomics.com/support/universal-three-prime-gene-expression/documentation/steps/experimental-design-and-planning/getting-started-single-cell-3-gene-expression) y el [artículo de Zheng y sus colaboradores](https://doi.org/10.1038/ncomms14049).*

### Paso 4. Lisar la célula y etiquetar las moléculas en el GEM

La lisis de la célula libera su ARNm. Los cebadores de una perla de gel llevan un código de barras celular común y distintos UMI. Durante la transcripción inversa se copia la información del ARNm en ADNc y se incorporan las etiquetas al ADNc sintetizado.

Así, las moléculas de ADNc de un mismo GEM comparten el código de barras celular, mientras que las distintas moléculas de ARN originales suelen recibir UMI distintos. **Los códigos se añaden durante la preparación de la biblioteca. El programa los lee después de la secuenciación.**

### Paso 5. Romper la emulsión, amplificar el ADNc y preparar la biblioteca

Tras la transcripción inversa se rompe la emulsión de agua en aceite y se reúne todo el ADNc etiquetado. Ya se pueden mezclar los productos de distintas células porque los códigos de barras conservan su origen.

Una célula produce muy poco ADNc para secuenciarlo directamente. Se amplifica por PCR y se fragmenta. Después se añaden los adaptadores de secuenciación y los índices de muestra. El resultado es una biblioteca que el secuenciador puede leer.

### Paso 6. Secuenciar la biblioteca y asignar las lecturas a su origen

Algunas posiciones de las lecturas de secuenciación contienen el código de barras celular y el UMI. Otras contienen secuencia del transcrito. Con esta información, el programa:

1. asigna la lectura a un compartimento;
2. identifica de qué gen procede la secuencia del transcrito;
3. utiliza los UMI para reducir el doble recuento de copias de PCR;
4. determina qué códigos se parecen más a la señal de una célula que al ARN de fondo de una gota vacía;
5. genera una matriz de expresión con genes en las filas y células en las columnas.

Así se pasa de un tubo con tejido a una tabla numérica que se puede analizar.

## ¿Qué significan 3′, 5′ y «longitud completa»?

Una cadena de ARN tiene orientación. Sus dos extremos se llaman 5′ y 3′. De momento no hace falta memorizar cómo se numeran los átomos de carbono: **son los dos extremos de la misma molécula de ARN.**

| Método | ¿Qué región se lee en una biblioteca habitual de expresión? | Uso frecuente |
| --- | --- | --- |
| 10x 3′ Gene Expression | Una secuencia corta cerca del extremo 3′ del transcrito | Cuantificar la expresión, agrupar células e identificar tipos celulares a gran escala |
| 10x 5′ Gene Expression | Una secuencia corta cerca del extremo 5′ del transcrito | Cuantificar la expresión. Con el mismo ADNc pueden prepararse bibliotecas V(D)J de receptores TCR o BCR. |
| Smart-seq2 / Smart-seq3 | Las lecturas pueden abarcar una fracción mayor del transcrito | Estudiar isoformas de empalme, alelos y otros detalles de los transcritos |

Los métodos 3′ y 5′ utilizan una secuencia de un extremo del transcrito para identificar el gen y contar moléculas. Durante la transcripción inversa pueden producir intermediarios de ADNc largos, incluso de longitud completa. Sin embargo, las bibliotecas de expresión habituales leen principalmente un extremo. Producir ADNc de longitud completa no equivale a secuenciar todo el transcrito.

La técnica 5′ es frecuente en inmunología porque permite preparar además una biblioteca V(D)J de receptores de linfocitos T (TCR) o B (BCR) para seguir clones de células inmunitarias. La elección entre 3′ y 5′ depende de la pregunta de investigación.

[Documentación oficial de 10x 3′](https://www.10xgenomics.com/support/universal-three-prime-gene-expression) · [Documentación oficial de 10x 5′](https://www.10xgenomics.com/support/universal-five-prime-gene-expression)

## ¿En qué se diferencian 10x, BD y Singleron?

Para comparar plataformas, empieza por una pregunta común: **¿cómo separa cada una las células y cómo marca el ARN de cada compartimento para poder rastrear su origen?**

Comprueba que sean comparables el material inicial (células intactas o núcleos), el tipo de ensayo (dirigido o de transcriptoma completo), la versión de los reactivos, la profundidad de secuenciación y el procesamiento informático. De otro modo, las diferencias observadas no pueden atribuirse solo a la plataforma.

### 10x Chromium: compartimentos en gotas

En 10x, las gotas GEM actúan como compartimentos de reacción. Se procesan muchas células en paralelo y normalmente se obtienen recuentos de UMI por gen. Para los datos clásicos 10x 3′/5′ suele utilizarse una versión de Cell Ranger compatible con la versión de los reactivos.

### BD Rhapsody: compartimentos en micropocillos

BD Rhapsody utiliza una matriz de micropocillos. Las células se depositan por gravedad en ellos y después se añaden perlas magnéticas de captura con códigos de barras celulares y UMI. Tras la lisis, una perla cercana captura el ARN con cola poli(A). Luego se recogen las perlas y se realizan la transcripción inversa y la preparación de la biblioteca en un tubo. Las imágenes de los pocillos permiten evaluar las células y detectar los que contienen varias.

[Documentación técnica oficial de BD Rhapsody](https://www.bdbiosciences.com/en-us/products/instruments/single-cell-multiomics-systems/rhapsody)

### SCOPE-chip de Singleron: otra técnica con micropocillos

El SCOPE-chip también utiliza micropocillos en los que las células se depositan por gravedad. Después se añaden perlas de captura con códigos de barras. Tras la lisis, el ARNm se une a las perlas. Las perlas magnéticas se recogen y se realizan la transcripción inversa, la amplificación y la preparación de la biblioteca en un tubo de reacción convencional.

Los datos brutos de Singleron suelen procesarse con CeleScope u otro flujo de análisis compatible con la química de los reactivos. La estructura de las lecturas y el diseño de los códigos de barras difieren de los de 10x. Comprueba el origen y la estructura de un FASTQ antes de utilizarlo con Cell Ranger.

[Documentación técnica del SCOPE-chip](https://singleron.bio/scope-chip/) · [Documentación oficial de CeleScope](https://singleron.bio/products/celescope/)

La plataforma adecuada depende de la pregunta de investigación. El tejido, la disociación, los reactivos, la profundidad de secuenciación y los parámetros del programa pueden cambiar tanto el número y la proporción de células recuperadas como el número de genes detectados.

## ¿Por qué los neutrófilos ilustran el sesgo de plataforma?

Los neutrófilos son leucocitos de la inmunidad innata. Contienen relativamente poco ARNm y muchas enzimas que pueden degradar el ARN. Además, se dañan fácilmente durante la manipulación. Esto puede desencadenar la siguiente secuencia:

> las células se rompen al preparar la muestra → se pierde ARN o se libera al medio → se detectan menos UMI en las células intactas → el programa clasifica códigos de señal baja como gotas vacías o células de baja calidad

Antes de atribuir el sesgo a la plataforma, averigua si se cargó sangre total sin eritrocitos, PBMC o una muestra enriquecida en granulocitos. Los neutrófilos eliminados durante la separación ya no podrán recuperarse con un ensayo posterior de 10x o BD ni mediante el programa que identifica las células. En ese caso, su ausencia informa principalmente de la composición de la muestra inicial.

En comparaciones directas con determinados tejidos, reactivos y métodos de análisis, BD Rhapsody recuperó mejor algunas células pobres en ARN o algunos granulocitos y cuantificó mejor sus moléculas. Los mismos estudios observaron diferencias con 10x en la captura efectiva de células, el número de genes detectados por célula y otros tipos celulares. Cambiar la regla que decide qué códigos representan células reales (*cell calling*) también puede permitir recuperar más neutrófilos en los datos de 10x.

Por tanto, no cabe concluir que solo BD pueda medir neutrófilos. **La preparación de la muestra, la química de la plataforma y el procesamiento informático pueden influir a la vez en el resultado.** Si los neutrófilos son el objetivo principal, conviene evaluar esos sesgos al diseñar el estudio y validar sus proporciones con un método independiente, como la citometría de flujo o la obtención de imágenes del tejido.

[Comparación en tejido prostático humano](https://doi.org/10.1016/j.heliyon.2024.e28358) · [Comparación en tejido tumoral de ratón](https://doi.org/10.1016/j.heliyon.2024.e37185) · [Estudio de la identificación de neutrófilos en datos de 10x](https://doi.org/10.4049/jimmunol.2200154)

## Lección 1.2: de los datos públicos a una matriz de expresión

El secuenciador produce secuencias de bases y datos sobre la calidad de cada base. El formato FASTQ es habitual para entregar esos datos. Los estudios públicos también pueden depositar datos brutos en el Sequence Read Archive (SRA) del NCBI. El recorrido es el siguiente:

```text
Datos de SRA de un estudio público
  → Convertir o descargar los datos en el formato FASTQ adecuado
  → Confirmar la plataforma experimental, la versión de los reactivos y la estructura de las lecturas
  → Elegir un flujo de procesamiento compatible
      Datos de 10x: Cell Ranger
      Datos de Singleron: CeleScope o un flujo independiente compatible con la química empleada
  → Matriz de expresión con genes en filas y células en columnas, e informe de calidad
```

En datos clásicos 10x 3′/5′, Cell Ranger parte de los FASTQ, procesa los códigos de barras, alinea las secuencias, cuenta los UMI, identifica células candidatas y genera la matriz. También informa de indicadores iniciales de calidad y ofrece reducción de dimensionalidad, agrupamiento y, en algunos flujos actuales, una anotación preliminar del tipo celular. Estos resultados sirven para una primera inspección. El filtrado riguroso, la integración de muestras, la anotación, la inferencia estadística y la validación biológica suelen requerir análisis adicionales en R o Python y tener en cuenta el diseño del estudio.

Cell Ranger suele entregar una matriz sin filtrar y otra filtrada. La primera conserva más códigos de barras. La segunda retiene los que el programa clasifica como células. Algunas células pobres en ARN pueden faltar en ella. En las prácticas examinaremos ambas matrices, el informe de calidad, las versiones del genoma de referencia y de su anotación, la química de los reactivos, la versión del programa y los parámetros de identificación de células.

Antes de usar datos de SRA con Cell Ranger, hay que confirmar que proceden de un experimento 10x compatible y conocer la estructura de las lecturas, el genoma de referencia, la versión de los reactivos y la relación entre las muestras. **En la lección 1.2 partiremos de un conjunto público, localizaremos los datos en SRA, comprobaremos la calidad de los FASTQ y revisaremos el análisis de Cell Ranger y sus archivos de salida. Todavía no es necesario memorizar comandos.**

[Introducción al SRA del NCBI](https://www.ncbi.nlm.nih.gov/sra) · [Documentación oficial de Cell Ranger](https://www.10xgenomics.com/support/software/cell-ranger/latest)

## Resumen

- La scRNA-seq no fotografía la célula. Las células se lisan y se captura su ARN. Las etiquetas se incorporan antes de mezclar el ADNc de distintos orígenes.
- El código de barras celular identifica un compartimento, el UMI ayuda a estimar cuántas moléculas originales se capturaron y el índice de muestra distingue bibliotecas.
- 10x utiliza gotas GEM, mientras que BD Rhapsody y SCOPE-chip utilizan micropocillos. Cada estrategia puede favorecer o perjudicar la captura de determinadas células.
- Los métodos 3′, 5′ y Smart-seq aportan información diferente. La pregunta de investigación orienta la elección.
- Tras la secuenciación, un programa compatible con el experimento procesa los datos brutos y genera la matriz de expresión de genes por células.

## Referencias y lecturas complementarias

1. Tang F, et al. mRNA-Seq whole-transcriptome analysis of a single cell. *Nature Methods*. 2009. [doi:10.1038/nmeth.1315](https://doi.org/10.1038/nmeth.1315)
2. Ramsköld D, et al. Full-length mRNA-Seq from single-cell levels of RNA and individual circulating tumor cells. *Nature Biotechnology*. 2012. [doi:10.1038/nbt.2282](https://doi.org/10.1038/nbt.2282)
3. Picelli S, et al. Smart-seq2 for sensitive full-length transcriptome profiling in single cells. *Nature Methods*. 2013. [doi:10.1038/nmeth.2639](https://doi.org/10.1038/nmeth.2639)
4. Hagemann-Jensen M, et al. Single-cell RNA counting at allele and isoform resolution using Smart-seq3. *Nature Biotechnology*. 2020. [doi:10.1038/s41587-020-0497-0](https://doi.org/10.1038/s41587-020-0497-0)
5. Klein AM, et al. Droplet barcoding for single-cell transcriptomics applied to embryonic stem cells. *Cell*. 2015. [doi:10.1016/j.cell.2015.04.044](https://doi.org/10.1016/j.cell.2015.04.044)
6. Macosko EZ, et al. Highly parallel genome-wide expression profiling of individual cells using nanoliter droplets. *Cell*. 2015. [doi:10.1016/j.cell.2015.05.002](https://doi.org/10.1016/j.cell.2015.05.002)
7. Zheng GXY, et al. Massively parallel digital transcriptional profiling of single cells. *Nature Communications*. 2017. [doi:10.1038/ncomms14049](https://doi.org/10.1038/ncomms14049)
