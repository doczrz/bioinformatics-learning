# 0.1 | ¿Por qué se usa tanto Linux en bioinformática? ¿Para qué sirven R, Python y Codex?

Recibes datos de secuenciación de células individuales y quieres responder a una pregunta biológica: ¿qué células han cambiado en el grupo con la enfermedad?

Para responder, a menudo tendrás que completar estos pasos:

> descargar los datos → inspeccionar los archivos → controlar la calidad → alinear las secuencias o contarlas → organizar la matriz de expresión → realizar el análisis estadístico → preparar las figuras → interpretar el resultado

En estas etapas intervienen distintas herramientas. Hay programas que se ejecutan en Linux y análisis que se escriben en R o Python. Las herramientas de IA como Codex pueden ayudar a generar código, ejecutar comandos y revisar los resultados.

Al principio puede parecer que Linux, R, Python y Codex son cuatro programas de análisis que compiten entre sí. En realidad, cada uno cumple una función diferente:

| Nombre | ¿Qué es? | Uso habitual en bioinformática |
| --- | --- | --- |
| Linux | Un sistema operativo | Gestionar archivos, ejecutar programas de bioinformática, conectarse a servidores y organizar flujos de trabajo |
| Bash | Un intérprete de comandos habitual en Linux | Introducir comandos, encadenar programas y procesar archivos por lotes |
| R | Un lenguaje de programación y un entorno de cálculo estadístico | Análisis estadístico, visualización de datos, transcriptómica y análisis unicelular |
| Python | Un lenguaje de programación de propósito general | Procesamiento de datos, automatización de flujos de trabajo, aprendizaje automático y análisis de datos ómicos |
| Codex | Un agente de IA capaz de trabajar con código, archivos y herramientas | Ayudar a escribir, explicar, ejecutar y revisar el código de análisis |

Linux proporciona el entorno de trabajo. Bash, R y Python cumplen funciones distintas dentro de él. Codex ayuda a organizar, ejecutar y revisar las tareas. El equipo investigador sigue siendo responsable de la pregunta y de la evaluación de las pruebas.

![Jerarquía que muestra los roles de Linux, Bash, R, Python, Codex y el investigador en bioinformática](figures/bioinformatics-computing-layers.es.svg)

*Figura 1 | Funciones de las herramientas bioinformáticas. Linux proporciona el sistema operativo, Bash encadena comandos y R o Python permiten realizar los análisis. Codex puede ayudar en varios pasos. El equipo investigador plantea las preguntas, evalúa las pruebas e interpreta los resultados. La ilustración original se creó para este proyecto el 23 de julio de 2026 con la herramienta de generación de imágenes de OpenAI y después se redibujó en formato vectorial con texto escalable. No incorpora logotipos, capturas de pantalla ni diseños de terceros. Muestra una de las formas habituales de organizar el trabajo.*

El diagrama es una guía más que una regla rígida. R y Python también se ejecutan en Windows y macOS, y Linux no se limita al uso de la línea de comandos.

## Tres preguntas para esta lección

Al final de esta lección, usted debería ser capaz de explicar:

1. ¿Por qué muchos flujos de trabajo de bioinformática usan Linux?
2. ¿Para qué son adecuados R y Python, y cómo puedes elegir entre ellos?
3. Si Codex ya puede escribir código y ejecutar análisis, ¿por qué vale la pena aprender estos fundamentos?

No necesita instalar Linux ni memorizar ningún comando en esta lección.

## ¿Por qué se usa tanto Linux en bioinformática?

### Razón 1: muchas herramientas se desarrollan primero para Linux

Muchas herramientas de análisis de datos de secuenciación se desarrollan y prueban en Linux o en entornos de tipo Unix. Algunas también ofrecen versiones para macOS, pero no tienen compatibilidad directa con Windows.

Bioconda distribuye numerosos paquetes para investigación biomédica. Según su documentación, es compatible con Linux y macOS, sin ofrecer compatibilidad directa con Windows. 10x Genomics también especifica Linux entre los requisitos oficiales de Cell Ranger.

[Documentación oficial de Bioconda](https://bioconda.github.io/index.html) · [Requerimientos oficiales del sistema de Cell Ranger](https://www.10xgenomics.com/support/software/cell-ranger/downloads/cr-system-requirements)

Esto no significa que Windows no pueda ser utilizado para la bioinformática. Esto significa que cuando una herramienta está oficialmente soportada solo en Linux, el uso de un entorno Linux generalmente hace que sea más fácil obtener un comportamiento consistente con su documentación.

### Razón 2: Linux es habitual en servidores y centros de cálculo

Un portátil corriente sirve para seguir las lecciones, explorar conjuntos de datos pequeños y aprender los métodos. Procesar datos brutos de secuenciación puede exigir mucha memoria RAM, espacio en disco y capacidad de cálculo.

Los servidores de laboratorio, los clústeres de computación de alto rendimiento (HPC) y muchas máquinas virtuales en la nube utilizan Linux. Así, los comandos y la organización de los directorios que aprendes en tu equipo suelen servir también en un servidor.

Instalar Linux no acelera por sí solo el equipo. Poder procesar los datos depende del procesador, la memoria RAM, el espacio libre en disco y el tamaño del conjunto de datos. Si el análisis de datos brutos requiere más RAM de la disponible, instalar un entorno Linux dentro de Windows no resolverá esa limitación.

### Motivo 3: es fácil combinar, registrar y repetir comandos

Las interfaces gráficas son útiles para la exploración, pero después de hacer clic a través de muchas pantallas, puede ser difícil responder:

- ¿Qué archivo de entrada seleccionó?
- ¿Qué parámetros usaste?
- ¿Qué versión de software se instaló?
- ¿Qué paso produjo una advertencia?
- ¿Cómo repetiría el mismo procedimiento para veinte muestras más?

En la línea de comandos de Linux puedes guardar los pasos de un análisis en un script: un archivo que enumera las operaciones que debe ejecutar el equipo. Puedes revisarlo, modificarlo, volver a ejecutarlo y compartirlo.

Guardar el script no basta para garantizar la reproducibilidad. También pueden influir el genoma de referencia, los archivos de anotación, las versiones del software, la información de las muestras y el valor inicial del generador de números pseudoaleatorios (la semilla).

### Motivo 4: Linux cuenta con herramientas consolidadas para gestionar archivos y permisos

En un análisis bioinformático intervienen numerosos archivos: FASTQ, BAM, matrices de expresión, tablas de muestras, registros de ejecución y figuras. Si los directorios están mal organizados, un programa puede leer la muestra equivocada o sobrescribir un resultado anterior.

Linux proporciona rutas de archivo explícitas, permisos de usuario y mecanismos de registro. El objetivo de aprender estas ideas no es memorizar comandos. Es saber:

- dónde se encuentran los datos;
- lo que el programa está leyendo;
- donde se escribirá el resultado;
- Qué archivos se pueden cambiar; y
- Cuál registro inspeccionar después de un error.

## Si usas Windows, ¿tienes que reinstalar el sistema?

No.

El Subsistema de Windows para Linux (WSL) permite a un usuario de Windows ejecutar una distribución de Linux, Bash y programas de línea de comandos de Linux sin configurar un equipo de arranque dual.

[Descripción general oficial de Microsoft WSL](https://learn.microsoft.com/en-us/windows/wsl/about)

A nivel de principiantes, WSL puede entenderse como un entorno de trabajo Linux dentro de un ordenador Windows. Muchos de los mismos conceptos seguirán siendo útiles si más tarde utiliza un servidor de laboratorio.

Sin embargo, WSL y un servidor remoto no son lo mismo:

- WSL utiliza los recursos de tu propio equipo.
- un servidor utiliza los recursos de una máquina remota;
- En un clúster HPC, un planificador de tareas puede distribuir los recursos entre los trabajos que envían los distintos usuarios.
- Una plataforma en la nube puede cobrar por el almacenamiento y el tiempo de computación.

Por lo tanto, las lecciones prácticas posteriores indicarán tanto dónde se ejecuta un comando como dónde se almacenan los datos. No presentarán código sin identificar su entorno de ejecución.

## ¿Qué es R?

El proyecto R define R como un lenguaje de programación y también como un entorno de cálculo estadístico y creación de gráficos.

[Introducción oficial al proyecto R](https://www.r-project.org/about.html)

Una fortaleza importante de R en bioinformática es Bioconductor. Bioconductor es un proyecto de bioinformática de código abierto basado en R. Cubre datos genómicos, transcriptómicos, citometría de flujo y otros datos, haciendo hincapié en los métodos estadísticos, la documentación y la investigación reproducible.

[Introducción oficial de Bioconductor](https://bioconductor.org/about/index.html)

Seurat es un paquete de R muy utilizado en el análisis de células individuales para el control de calidad, la exploración, el agrupamiento, la integración y la visualización de datos.

[Documentación oficial de Seurat](https://satijalab.org/seurat/)

Las fortalezas comunes de R incluyen:

- Un ecosistema maduro de análisis estadístico;
- Una gran colección de paquetes de omics en Bioconductor;
- la posibilidad de combinar análisis, modelos estadísticos y figuras en un mismo script o informe;
- Código R directo en muchas secciones y tutoriales de métodos biomédicos.

R también requiere algún ajuste:

- algunos paquetes requieren versiones concretas de R o Bioconductor;
- Diferentes paquetes pueden usar diferentes objetos de datos;
- con conjuntos de datos grandes conviene vigilar la memoria y evitar las copias repetidas de objetos voluminosos;
- obtener una figura no demuestra que el diseño estadístico fuera adecuado.

## ¿Qué es Python?

Python es un lenguaje de programación de propósito general. Además de la computación científica, es ampliamente utilizado para el desarrollo de software, automatización, servicios de red, aprendizaje automático y educación. El Python Package Index proporciona una gran colección de módulos de terceros.

[Introducción oficial a Python](https://www.python.org/about/)

Scanpy es un conjunto de herramientas de Python para preprocesar y visualizar datos de células individuales, agrupar células, inferir trayectorias y analizar la expresión diferencial. Utiliza el objeto de datos AnnData.

[Documentación oficial de Scanpy](https://scanpy.readthedocs.io/)

Las fortalezas comunes de Python incluyen:

- Conectar la descarga de datos, el procesamiento de archivos, el análisis y la automatización en un flujo de trabajo completo;
- un amplio conjunto de herramientas de cálculo científico, aprendizaje automático y aprendizaje profundo;
- Integración con bases de datos, servicios web y otros programas; y
- Desarrollo de software y herramientas de análisis reutilizables.

Python también requiere algún ajuste:

- Muchos paquetes pueden ofrecer diferentes enfoques para el mismo problema;
- Las versiones de Python, los paquetes y las bibliotecas de nivel inferior deben seguir siendo compatibles;
- si las celdas de código de un cuaderno se ejecutaron en un orden distinto del que aparece en pantalla, el análisis puede fallar o dar otro resultado al abrirlo y ejecutarlo de nuevo;
- La libertad de un lenguaje de propósito general también requiere una gestión activa de la estructura del código y el estado de los datos.

## ¿Cuándo conviene usar R o Python?

No hay una respuesta única sin una tarea específica.

| Aspecto | R | Python |
| --- | --- | --- |
| Finalidad inicial | Cálculo estadístico y gráficos | Programación de propósito general |
| Herramientas habituales en bioinformática | Bioconductor, Seurat | NumPy, pandas, scikit-learn, Scanpy/scverse |
| Aplicaciones destacadas | Modelado estadístico, análisis diferencial, bioestadística y figuras para publicaciones | Automatización, aprendizaje automático, ingeniería de datos y desarrollo de herramientas de análisis |
| Dificultades frecuentes al empezar | Las versiones de los paquetes, los objetos de datos y los conceptos estadísticos | La gestión de entornos, la estructura del software y la elección entre numerosas bibliotecas |
| ¿Permite analizar datos unicelulares? | Sí | Sí |
| ¿Funciona en Linux? | Sí | Sí |

Todas las siguientes afirmaciones son demasiado simples:

- «R solo sirve para hacer gráficos».
- “Python siempre es más rápido que R.”
- “Python puede hacerlo todo, por lo que R es innecesario”.
- “Los artículos biomédicos a menudo usan R, por lo que Python es innecesario”.

El rendimiento real depende del algoritmo, las estructuras de datos, la implementación de bajo nivel, la memoria y la computación paralela, no solo del nombre del lenguaje. Muchos paquetes de R y Python llaman a C, C++, Fortran u otro código de alto rendimiento para sus cálculos principales.

Una elección más útil comienza con estas preguntas:

1. ¿Qué ecosistema contiene un método maduro para la pregunta de investigación?
2. ¿Qué implementación proporciona el tutorial oficial y el documento original?
3. ¿Qué objetos de datos y flujos de trabajo utiliza el equipo?
4. ¿Debe el resultado conectarse a un proyecto existente?
5. ¿Puede explicar y validar cada paso?

Un proyecto real puede usar ambos idiomas. Las herramientas de Linux pueden generar una matriz de expresiones, R puede realizar análisis estadísticos y Python puede proporcionar aprendizaje automático adicional o automatización.

## ¿Para qué sirve este curso si Codex ya puede analizar datos?

Codex puede leer y modificar archivos, escribir código, ejecutar tareas y ayudar a crear flujos de trabajo automatizados. La introducción actual de OpenAI a Codex enfatiza que puede realizar trabajo real a través de archivos y herramientas.

[Introducción de OpenAI a Codex](https://openai.com/academy/what-is-codex/)

Esto cambia la forma en que las personas aprenden. Un principiante ya no tiene que memorizar una gran cantidad de sintaxis antes de comenzar a inspeccionar datos o probar un flujo de trabajo de análisis.

Pero esto no elimina la necesidad de entender la bioinformática.

### El código puede ejecutarse sin errores y aun así dar un análisis incorrecto

El código puede terminar sin un error y producir una figura atractiva mientras que todavía contiene problemas tales como:

- No hay réplicas biológicas independientes para los grupos de enfermedad y control;
- tratar cada célula como una muestra biológica independiente;
- Utilizar un genoma de referencia incompatible;
- eliminar durante el filtrado una población importante de células con poco ARN;
- confundir por completo la condición experimental con el lote de procesamiento, por ejemplo al procesar todos los casos un día y todos los controles otro;
- interpretar la similitud calculada entre dos poblaciones celulares como prueba de una relación causal.

Estos no suelen ser errores de sintaxis. No se pueden detectar simplemente preguntando si el código se ejecutó correctamente.

### Alguien debe saber evaluar los resultados de la IA

Por intuición, Codex se puede comparar con un asistente de investigación rápido que puede operar herramientas. Puede organizar archivos, explicar un error, escribir un script y ejecutar comprobaciones, pero aún necesitas decirle:

- cuál es la pregunta biológica en realidad;
- qué datos pueden ser utilizados;
- qué muestra es la unidad experimental independiente;
- lo que cuenta como un resultado exitoso;
- qué observaciones inusuales no deben eliminarse automáticamente; y
- Qué pruebas se requieren para la conclusión final.

La analogía tiene límites. Codex no tiene el nivel de habilidad fijo de un asistente humano; su comportamiento depende del modelo, las herramientas, el contexto y los permisos. Independientemente de la capacidad, un análisis final todavía necesita validación a través de fuentes, parámetros, registros y evidencia independiente. OpenAI también describe Codex como una herramienta que requiere dirección humana y revisión en lugar de un reemplazo para el juicio humano.

### Cómo cambia el objetivo de un tutorial

Antes de las herramientas de IA, los tutoriales a menudo dedicaban gran parte de su espacio a pedir a los alumnos que memorizaran nombres de funciones y argumentos de comandos.

En la era del Codex, los objetivos de aprendizaje más importantes son:

- entender por qué existe un paso de análisis;
- describiendo sus insumos, productos y criterios de éxito;
- Comprobar si una herramienta seleccionada por IA coincide con los datos;
- Reconocer errores en el diseño experimental, estadística e interpretación biológica;
- Requerir que la IA preserve código, versiones, registros y registros de decisiones; y
- Saber en qué evidencia confiar cuando un resultado de IA está en conflicto con la documentación oficial o un artículo original.

Por lo tanto, este curso no compite con Codex para escribir código más rápido. Su objetivo es ayudar a los estudiantes a hacer las preguntas correctas, supervisar análisis, inspeccionar evidencia y asumir la responsabilidad del juicio científico.

## Referencias y lecturas recomendadas

1. [Proyecto R: ¿Qué es R?](https://www.r-project.org/about.html)
2. [Python.org: Acerca de Python](https://www.python.org/about/)
3. [Bioconductor: Acerca de](https://bioconductor.org/about/index.html)
4. [Documentación oficial de Bioconda](https://bioconda.github.io/index.html)
5. [Microsoft: Subsistema de Windows para Linux](https://learn.microsoft.com/en-us/windows/wsl/about)
6. [10x Genomics: Cell Ranger Requisitos del sistema](https://www.10xgenomics.com/support/software/cell-ranger/downloads/cr-system-requirements)
7. [Documentación oficial de Seurat](https://satijalab.org/seurat/)
8. [Documentación oficial de Scanpy](https://scanpy.readthedocs.io/)
9. [OpenAI Academy: ¿Qué es ChatGPT Codex?](https://openai.com/academy/what-is-codex/)
