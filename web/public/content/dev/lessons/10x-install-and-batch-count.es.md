# 1.2 | Instalación de Cell Ranger y Space Ranger de 10x Genomics

En esta lección se instalan dos herramientas en Linux. Cell Ranger genera una matriz de expresión génica a partir de datos de secuenciación de células individuales. Space Ranger asigna los recuentos de expresión a las posiciones donde se capturó el ARN en un corte de tejido. [Tutorial oficial de instalación de Cell Ranger](https://www.10xgenomics.com/support/software/cell-ranger/latest/tutorials/cr-tutorial-in) · [Guía oficial de instalación de Space Ranger](https://www.10xgenomics.com/support/software/space-ranger/downloads/space-ranger-installation)

## Primera parte. Instalar Cell Ranger

### 1. Descargar y descomprimir Cell Ranger 10.1.0

Copie el comando de descarga del sitio web de 10x en su terminal de Linux. Ejecútelo y descomprima el archivo descargado. [Descargas de Cell Ranger](https://www.10xgenomics.com/support/software/cell-ranger/downloads#download-links)

### 2. Descargar y descomprimir la referencia humana

Para muestras humanas, descargue la **referencia humana GRCh38 2024-A** (unos 11 GB). GRCh38 identifica el ensamblaje del genoma humano y 2024-A, la versión de la referencia publicada por 10x. Cell Ranger utiliza las secuencias, las anotaciones de genes y los índices del paquete para determinar de qué gen procede una lectura. [Descargar la referencia humana GRCh38 2024-A](https://cf.10xgenomics.com/supp/cell-exp/refdata-gex-GRCh38-2024-A.tar.gz)

Una vez descomprimido el paquete, indique en `--transcriptome` la ruta al directorio de referencia completo. Para muestras de ratón, use el paquete de referencia de ratón.

### 3. Añadir Cell Ranger a `PATH`

Al descomprimir el archivo se instala el programa. Para ejecutar `cellranger` desde el directorio de una muestra, indique a Bash dónde encontrarlo. `PATH` es una lista de directorios separados por el carácter de dos puntos. Bash los recorre de izquierda a derecha. El comando siguiente coloca la nueva instalación al principio de la lista y conserva los directorios anteriores mediante `:$PATH`. [Instrucciones de 10x para configurar PATH](https://www.10xgenomics.com/support/software/cell-ranger/latest/tutorials/cr-tutorial-in)

```bash
export PATH="$HOME/10x-tools/cellranger-10.1.0:$PATH"
command -v cellranger
cellranger --version
```

La primera comprobación debe mostrar una ruta de su directorio personal que termine en `/10x-tools/cellranger-10.1.0/cellranger`. La segunda debe mostrar `10.1.0`. Si Bash responde `command not found`, compruebe que el ejecutable esté en esa ruta. Si aparece una versión anterior, ejecute `type -a cellranger` para ver todos los comandos con ese nombre y comprobar qué directorio aparece primero.

**Conservar la configuración al abrir otro terminal.** El comando `export` anterior se aplica a la sesión actual de Bash y a los procesos que esta inicia. Abra su archivo de configuración personal con un editor, por ejemplo, con `nano ~/.bashrc`. Añada la siguiente línea al final del archivo. Si ya figura allí, conserve una sola copia.

```bash
export PATH="$HOME/10x-tools/cellranger-10.1.0:$PATH"
```

En nano, pulse `Ctrl+O` y después Intro para guardar. Salga con `Ctrl+X`. Ejecute los siguientes comandos para volver a cargar el archivo y comprobar el resultado. Abra un nuevo terminal en el servidor como de costumbre y vuelva a ejecutar `cellranger --version`.

```bash
source "$HOME/.bashrc"
command -v cellranger
cellranger --version
```

Una sesión interactiva de Bash que no sea de inicio de sesión lee `~/.bashrc` automáticamente. Al conectarse por SSH, la lectura de ese archivo depende de su configuración de inicio. Si Bash deja de encontrar el comando al volver a conectarse, compruebe si el archivo de inicio que utiliza, a menudo `~/.bash_profile`, carga `~/.bashrc`. En un clúster, puede incluir la misma línea `export PATH=...` en el script del trabajo para que el nodo de cómputo utilice la versión deseada. [Archivos de inicio de Bash](https://www.gnu.org/software/bash/manual/html_node/Bash-Startup-Files.html)

### 4. Leer la ayuda de `cellranger`

Ejecute estos comandos desde cualquier directorio. El primero enumera las tareas que realiza Cell Ranger. Los otros dos muestran las opciones de tareas concretas. Cada comando muestra la ayuda y termina.

```bash
cellranger --help
cellranger count --help
cellranger testrun --help
```

La línea `Usage` indica cómo escribir el comando. En `cellranger testrun --id=check_install`, `cellranger` es el programa, `testrun` es el subcomando, `--id` es una opción y `check_install` es el nombre de esta ejecución. Sustituya `<ID>` por su propio valor. `[OPTIONS]` indica dónde añadir opciones. Al escribir el comando, omita los signos de menor y mayor y los corchetes. Use `-h` o `--help` para mostrar la ayuda y `-V` o `--version` para consultar la versión.

| Subcomandos de la ayuda | Función |
| --- | --- |
| `testrun` | Comprueba la instalación con un pequeño conjunto de datos incluido en el programa. |
| `count` | Cuenta las moléculas correspondientes a genes y a otras características compatibles en una muestra procedente de una sola captura de células. Una biblioteca de secuenciación es el conjunto de moléculas que se preparan a partir de una muestra para secuenciarlas. |
| `multi`, `multi-template` | `multi` lee un archivo de configuración para procesar muestras multiplexadas, experimentos Flex o experimentos que combinan varios tipos de bibliotecas. `multi-template` genera una plantilla para ese archivo. |
| `vdj`, `mkvdjref` | `vdj` reconstruye las secuencias de los receptores de los linfocitos T o B a partir de datos de secuenciación del repertorio inmunitario. `mkvdjref` construye una referencia para ese análisis. |
| `aggr`, `reanalyze`, `annotate` | `aggr` combina los resultados de varias ejecuciones. `reanalyze` repite la reducción de dimensionalidad y el agrupamiento a partir de una matriz existente. `annotate` predice los tipos celulares a partir de resultados previos. |
| `mkref`, `mkgtf`, `mat2csv` | `mkref` construye una referencia personalizada a partir de secuencias y anotaciones de genes. `mkgtf` filtra las anotaciones por atributo. `mat2csv` convierte una matriz en un archivo CSV, que puede ocupar mucho espacio si la matriz es grande. |
| `sitecheck`, `upload`, `telemetry`, `cloud`, `help` | `sitecheck` muestra la configuración del equipo. `upload` envía el archivo de diagnóstico indicado al servicio técnico de 10x. `telemetry` permite consultar o configurar la recopilación de datos de uso. `cloud` da acceso a los servicios en la nube de 10x. `help` muestra la ayuda de un comando. |

En tutoriales anteriores puede aparecer `mkfastq`, un comando que 10x ha declarado obsoleto. Si su centro de secuenciación le entrega archivos FASTQ, puede empezar con ellos. Contienen las secuencias y las puntuaciones de calidad de cada base. La prueba de instalación utiliza sus propios datos. [Comandos de Cell Ranger](https://www.10xgenomics.com/support/software/cell-ranger/latest/getting-started/cr-command-line-arguments) · [Código fuente de los comandos de Cell Ranger 10.1.0](https://github.com/10XGenomics/cellranger/blob/cellranger-10.1.0/lib/rust/cr_wrap/src/bin/cellranger.rs)

En la salida de `cellranger count --help`, localice primero las siguientes opciones. Indican qué archivos se usarán como entrada y en qué directorio se guardarán los resultados.

| Opción | Valor predeterminado o comportamiento al omitirla en Cell Ranger 10.1.0 | Qué indicar para la muestra |
| --- | --- | --- |
| `--id` | Obligatoria, sin valor predeterminado. | Asigne un nombre al análisis y a su directorio de salida, por ejemplo `GEX_A`. |
| `--fastqs` | Obligatoria en este ejemplo. No hay una ruta predeterminada. | Indique el directorio que contiene los archivos de secuenciación. |
| `--sample` | Si solo hay un prefijo de nombre de archivo, la muestra se selecciona automáticamente. Si se detectan varios, omitir la opción produce un error. | Indique el prefijo de los archivos de la muestra. Por ejemplo, en `GEX_A_S1_L001_R1_001.fastq.gz` el prefijo es `GEX_A`. |
| `--transcriptome` | Obligatoria en este ejemplo. No hay una referencia predeterminada. | Indique el directorio completo de la referencia que descomprimió en el paso 2. |
| `--localcores` | En modo local se usan todos los núcleos de CPU disponibles. | Indique el número de núcleos asignados al trabajo. |
| `--localmem` | En modo local se usa el 90 % de la memoria detectada. | Fije el límite de memoria en GB sin superar la asignación del trabajo. |
| `--create-bam` | Obligatoria. Elija explícitamente `true` o `false`. | Elija `true` para guardar los alineamientos de cada lectura. Elija `false` si solo necesita la matriz de expresión. |
| `--include-introns` | `true` para los ensayos convencionales de expresión génica de transcriptoma completo en 3′ y 5′. | Por defecto se cuentan las lecturas intrónicas que cumplen los criterios. Elija `false` para excluirlas. |
| `--nosecondary` | La opción está desactivada de forma predeterminada. El análisis secundario integrado sí se ejecuta. | Añada `--nosecondary` para omitir ese paso si va a realizar por su cuenta la reducción de dimensionalidad y el agrupamiento. |

### 5. Probar la instalación con `testrun` y resolver un problema de compatibilidad

**Si aparece este mensaje, compruebe el sistema del equipo en el que se ejecutó la prueba.** El error indica un problema de compatibilidad con el sistema operativo. Cambiar de referencia o volver a descomprimir el programa dejaría el problema sin resolver.

```text
ERROR: This operating system version is unsupported:
    CentOS Linux release XXX (Core)
...
To continue running this version for now, set TENX_IGNORE_DEPRECATED_OS=1
```

Para analizar los datos de un proyecto, solicite al administrador un nodo de cómputo que cumpla los requisitos vigentes de 10x. Ejecute `cellranger --version` en ese nodo y repita la prueba de instalación. El nodo de acceso y el nodo que ejecuta el trabajo pueden utilizar sistemas operativos distintos. [Sistemas operativos compatibles con el software de 10x](https://www.10xgenomics.com/support/software/cell-ranger/latest/miscellaneous/cr-os-requirements) · [Requisitos del sistema para Cell Ranger 10.1](https://www.10xgenomics.com/support/software/cell-ranger/downloads/cr-system-requirements)

Para aplicar la solución temporal que propone el mensaje, ejecute `export TENX_IGNORE_DEPRECATED_OS=1`.

### 6. Elegir las opciones de recuento según la versión

`testrun` comprueba si el programa puede ejecutarse. Use `count` para obtener una matriz de expresión a partir de sus propios archivos FASTQ. Si retoma un script antiguo, revise estos ajustes porque afectan a los recuentos o a los archivos que se generan. [Notas de versión de Cell Ranger](https://www.10xgenomics.com/support/software/cell-ranger/latest/release-notes/cr-release-notes) · [Opciones de Cell Ranger 10.1](https://www.10xgenomics.com/support/software/cell-ranger/latest/getting-started/cr-command-line-arguments)

| Cambio de versión | Consecuencias para el proyecto |
| --- | --- |
| **Desde la versión 7.0**, los análisis convencionales de expresión génica 3′ y 5′ de transcriptoma completo utilizan `--include-introns=true` de forma predeterminada. Las versiones anteriores excluían los intrones por defecto. | Los intrones son segmentos de un transcrito de ARN que normalmente se eliminan durante el corte y empalme. Con `true`, una lectura intrónica puede contribuir al recuento de moléculas si su alineamiento cumple los criterios y permite asignarla a un gen. Esto resulta especialmente útil en los núcleos, que contienen más ARN sin procesar por corte y empalme. Con `false` se excluyen esas lecturas. Para reproducir recuentos anteriores, compruebe el ajuste original. |
| **Desde la versión 8.0**, `count` requiere especificar `--create-bam=true` o `false`. Esta opción sustituye a `--no-bam`. | Un archivo BAM registra el alineamiento de cada lectura. Si solo necesita la matriz y ya tiene un plan de control de calidad, elija `false` para ahorrar espacio en disco y tiempo de escritura. Elija `true` si quiere examinar los alineamientos en un navegador genómico, si otra herramienta necesita el BAM o si aún no lo ha decidido. En ambos casos se genera la matriz de expresión. |
| **En la versión 10.1**, Pan-Human Azimuth anota por defecto los tipos celulares de los datos humanos de forma local. El análisis secundario predeterminado incluye UMAP y deja desactivado t-SNE. | `--disable-cell-annotation` desactiva la anotación automática de tipos celulares. Si quiere conservar el análisis secundario integrado y añadir t-SNE, use `--enable-tsne=true`. UMAP y t-SNE proyectan los datos de expresión en un espacio de menos dimensiones para poder visualizarlos. |

**¿Cuándo conviene usar `--nosecondary`?** En una primera ejecución, conserve el análisis secundario predeterminado para examinar las proyecciones y los grupos de células que genera el programa. Si piensa obtener sus propias proyecciones y agrupamientos a partir de la matriz con Seurat o Scanpy, añada `--nosecondary` a `cellranger count`. Esta opción se escribe sin valor. Ahorra el tiempo de cálculo del análisis secundario integrado y omite sus resultados. La generación del BAM se configura por separado con opciones como `--create-bam=false`.

## Segunda parte. Instalar Space Ranger

### 1. Descargar y descomprimir Space Ranger 4.1.0

Space Ranger asocia el ARN medido con Visium a su posición de captura en el corte de tejido. [Guía oficial de instalación de Space Ranger](https://www.10xgenomics.com/support/software/space-ranger/downloads/space-ranger-installation) · [Requisitos del sistema](https://www.10xgenomics.com/support/software/space-ranger/downloads/space-ranger-system-requirements)
Descargue el archivo de la versión que vaya a utilizar y descomprímalo. La página de descargas de 10x indica cuál es la versión más reciente. [Descargas de Space Ranger](https://www.10xgenomics.com/support/software/space-ranger/downloads)

**Descargar y descomprimir la referencia humana.** Space Ranger utiliza la misma referencia GRCh38 2024-A que Cell Ranger. Si ya la descomprimió, continúe con el paso siguiente. [Descargar la referencia humana GRCh38 2024-A (unos 11 GB)](https://cf.10xgenomics.com/supp/cell-exp/refdata-gex-GRCh38-2024-A.tar.gz)

Para ejecutar `spaceranger count`, indique en `--transcriptome` la ruta del directorio de referencia que obtuvo al descomprimir el paquete.

### 2. Configurar `PATH` y consultar la ayuda

```bash
export PATH="$HOME/10x-tools/spaceranger-4.1.0:$PATH"
command -v spaceranger
spaceranger --version
```

La ruta debe terminar en `/spaceranger-4.1.0/spaceranger` y la versión debe ser `4.1.0`. Abra el archivo con `nano ~/.bashrc`, añada la instrucción `export` en una línea independiente y ejecute `source ~/.bashrc`. Abra un terminal nuevo y vuelva a ejecutar `spaceranger --version`. Si instaló los dos programas, guarde una línea `export` para cada uno en `.bashrc`.

```bash
spaceranger --help
spaceranger testrun --help
spaceranger count --help
```

Lea la ayuda en el mismo orden que antes, identificando el programa, el subcomando y sus opciones. `--help` muestra la sintaxis y `--version` indica la versión del programa. [Documentación de los comandos de Space Ranger](https://www.10xgenomics.com/support/software/space-ranger/latest/analysis/running-pipelines/command-line-arguments)

| Subcomandos | Función |
| --- | --- |
| `testrun`, `count` | `testrun` comprueba la instalación con los datos incluidos. `count` procesa un área de captura y genera matrices de expresión, coordenadas espaciales y resultados asociados a la imagen del tejido. |
| `segment`, `annotate` | `segment` identifica los núcleos en las imágenes de tejido Visium HD compatibles. `annotate` predice tipos celulares a partir de los resultados compatibles de segmentación celular de HD. |
| `aggr` | Combina análisis compatibles de varias áreas de captura. Space Ranger 4.1 no admite Visium HD en este flujo de trabajo. |
| `mkref`, `mkgtf`, `mat2csv` | Estas herramientas construyen una referencia, filtran las anotaciones de genes y convierten una matriz de expresión a CSV, respectivamente. |
| `sitecheck`, `upload`, `telemetry`, `cloud` | Sirven, respectivamente, para revisar el entorno de cómputo, enviar archivos de diagnóstico al servicio técnico de 10x, gestionar la recopilación de datos de uso y acceder a los servicios en la nube de 10x. El comando `mkfastq` de los flujos de trabajo anteriores está obsoleto. |

### 3. Probar la instalación en un nodo con o sin acceso a Internet

```bash
cd "$HOME/10x-work"
spaceranger testrun --id=check_spaceranger
```

`--id` da nombre al directorio de salida. El mensaje `Pipestance completed successfully!` en el terminal indica que la instalación ha superado la prueba. Si se indica que el sistema operativo no es compatible, ejecute `cat /etc/os-release` en el nodo de cómputo donde se hizo la prueba. Cambie a un nodo que cumpla los requisitos de Space Ranger. CentOS 7.5 no es compatible con Space Ranger 4.1. [Requisitos del sistema para Space Ranger](https://www.10xgenomics.com/support/software/space-ranger/downloads/space-ranger-system-requirements)

El mensaje `Could not retrieve spot layout data` indica que el programa no pudo obtener la distribución de los puntos de captura del portaobjetos. Si el nodo de cómputo no tiene acceso a Internet, repita la **prueba de instalación** en modo sin conexión, con un directorio de salida nuevo.

```bash
spaceranger testrun --no-internet --id=check_spaceranger_offline
```

**Para analizar su propio portaobjetos** en un nodo sin conexión, descargue desde un equipo con acceso a Internet el archivo de distribución correspondiente al número de serie del portaobjetos. Transfiéralo al nodo de cómputo e indique las opciones `--slidefile`, `--slide` y `--area` al ejecutar `spaceranger count`. Una vez superada la prueba de instalación, compruebe que la imagen corresponda al portaobjetos y al área de captura que va a analizar. [Instrucciones de 10x para pruebas sin conexión y archivos de distribución](https://www.10xgenomics.com/support/software/space-ranger/downloads/space-ranger-installation)

### 4. Configurar el análisis de un área de captura Visium

El ejemplo utiliza **Visium v1 original, tejido humano fresco congelado y una imagen de campo claro con tinción H&E**. H&E significa hematoxilina y eosina, dos colorantes que permiten distinguir la estructura del tejido. Sustituya `V10J25-015`, `A1`, `Tissue_A` y el nombre del archivo de imagen por los datos de su portaobjetos y de su documentación de secuenciación. Si solo quería verificar la instalación, ya terminó en el paso anterior.

```bash
cd "$HOME/10x-work"
spaceranger count --id=visium_A \
  --transcriptome="$HOME/10x-work/refs/refdata-gex-GRCh38-2024-A" \
  --fastqs="$HOME/10x-work/fastqs/Tissue_A" --sample=Tissue_A \
  --image="$HOME/10x-work/images/Tissue_A_HE.tif" \
  --slide=V10J25-015 --area=A1 \
  --include-introns=true --create-bam=false
```

| Opción del ejemplo | Valor predeterminado o comportamiento al omitirla en Space Ranger 4.1.0 | Qué indicar y qué efecto tiene |
| --- | --- | --- |
| `--id` | Obligatoria, sin valor predeterminado. | Asigne un nombre al directorio de salida. En el ejemplo es `visium_A/`. |
| `--transcriptome` | Obligatoria. No hay una referencia predeterminada. | Indique el directorio de la referencia humana descomprimida. |
| `--fastqs` | Obligatoria en este ejemplo. No hay una ruta predeterminada. | Indique el directorio con los archivos de secuenciación de esta área de captura. |
| `--sample` | Si solo hay un prefijo de nombre de archivo, la muestra se selecciona automáticamente. Si se detectan varios, omitir la opción produce un error. | Indique el prefijo de los archivos FASTQ de esta área de captura, aquí `Tissue_A`. |
| `--image` | No hay una imagen predeterminada. El ejemplo requiere la ruta de la imagen de H&E en campo claro. | Indique la imagen microscópica del área de captura. El programa identifica el tejido y alinea las coordenadas de secuenciación con la imagen. |
| `--slide` | No hay un número de serie predeterminado. Es obligatorio en este ejemplo. | Introduzca el número de serie del portaobjetos utilizado, por ejemplo `V10J25-015`. |
| `--area` | No hay un área de captura predeterminada. En este ejemplo se debe indicar junto con `--slide`. | Introduzca el identificador del área de captura registrado para ese portaobjetos, como `A1`. Analice cada área por separado. |
| `--include-introns=true` | `true` en el experimento Visium v1 del ejemplo. | El ejemplo conserva el valor predeterminado. Las lecturas intrónicas que cumplen los criterios contribuyen al recuento de moléculas. |
| `--create-bam=false` | Obligatoria. Elija explícitamente `true` o `false`. | Con `false` se conservan la matriz de expresión y los resultados espaciales sin generar el BAM de alineamientos individuales. Elija `true` si necesita examinarlos o si aún no ha decidido qué análisis hará después. |

Al finalizar, abra `visium_A/outs/web_summary.html` para consultar el resumen del control de calidad espacial de esta área de captura. Las imágenes y las coordenadas se guardan en `visium_A/outs/spatial/`. En la matriz de Visium original, cada código de barras representa un punto de captura. Un solo punto puede abarcar varias células. [Resultados espaciales de Space Ranger](https://www.10xgenomics.com/support/software/space-ranger/latest/analysis/outputs/spatial-outputs)

**Tres cambios de versión que conviene revisar en scripts anteriores**

| Versión de Space Ranger | Efecto en el comando o los resultados |
| --- | --- |
| **Desde la versión 3.0** | `count` exige indicar `--create-bam=true` o `false`. Si solo necesita la matriz y las coordenadas espaciales, elija `false` para ahorrar espacio en disco y tiempo de escritura. |
| **Serie 4.0** | Estas versiones admiten Visium HD 3′ e incorporan la segmentación de núcleos y células a partir de imágenes del tejido. Para HD 3′, omita `--probe-set`. Para Visium HD basado en sondas, indique el conjunto de sondas utilizado en el ensayo. |
| **Desde la versión 4.1** | En **Visium v1 y Visium HD 3′**, los intrones se incluyen por defecto. Use `--include-introns=false` para reproducir un análisis que los excluía. Los ensayos basados en sondas identifican las dianas mediante pares de sondas. Compruebe el conjunto de sondas empleado en el experimento. |

Si tiene experiencia en análisis espacial y va a agrupar los datos por su cuenta usando la matriz, las imágenes del tejido y las coordenadas, `--nosecondary` ahorra el tiempo de cálculo del análisis secundario integrado. Conserve este análisis si quiere examinar los grupos que genera Space Ranger. En ambos casos, compruebe que la imagen y las coordenadas estén bien alineadas. [Notas de versión de Space Ranger](https://www.10xgenomics.com/support/software/space-ranger/latest/release-notes/release-notes-for-SR) · [Datos de entrada según el tipo de ensayo Visium HD](https://www.10xgenomics.com/support/software/space-ranger/latest/analysis/running-pipelines/count-visium-hd)
