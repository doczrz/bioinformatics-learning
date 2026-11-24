# 0.2 | ¿Por qué falla el código si ya he instalado R o Python? Paquetes, entornos, dependencias y versiones

Encuentras en internet un script de análisis unicelular. Según su autor, requiere Python y Scanpy. Compruebas que Python está instalado, copias el código y aparece este mensaje:

```text
ModuleNotFoundError: No module named 'scanpy'
```

Otra persona ya ha usado Scanpy, pero obtiene un conflicto de versiones con el mismo código. Una tercera instala Seurat en R sin errores. Al día siguiente abre un proyecto distinto y el análisis original deja de funcionar.

En los tres casos parece que el software ha dejado de funcionar. Sin embargo, la causa puede encontrarse en niveles distintos:

- el ordenador no puede encontrar R o Python;
- El paquete se instaló en un entorno diferente;
- dos paquetes requieren versiones incompatibles de la misma dependencia;
- El código utiliza una característica que existía en una versión anterior pero que ha cambiado en una nueva.
- Falta un componente del sistema requerido por el paquete; o
- La R o Python que ejecuta el código no es la que crees que es.

Esta lección no le pide que memorice cada herramienta de instalación. Su objetivo es construir un mapa claro del entorno informático. Cuando vea un script o un error, debe saber qué capa inspeccionar primero en lugar de reinstalar todo inmediatamente.

![Estructura en capas de un entorno informático: hardware, sistema operativo, R o Python, entorno del proyecto, paquetes y scripts de análisis](figures/computational-environment-layers.es.png)

*Figura 1 | Un script de análisis depende de varias capas. El sistema operativo proporciona la base. R o Python interpreta el código. Los entornos separan el software de cada proyecto. Los paquetes y sus dependencias proporcionan las funciones que el script aplica a los datos. La ilustración original se creó para este proyecto el 23 de julio de 2026 con la herramienta de generación de imágenes de OpenAI. No incorpora logotipos, capturas de pantalla ni diseños de terceros. El esquema muestra cómo se relacionan las capas. Los detalles de instalación varían según la herramienta.*

## Cinco términos que suelen confundirse

### 1. R y Python: los lenguajes y sus intérpretes

R y Python son ambos lenguajes de programación. El código que escribes debe ser leído y ejecutado por el software correspondiente.

El programa que lee y ejecuta el código es el **intérprete**. El de R ejecuta código R y el de Python, código Python. Instalar Python permite ejecutar código básico de ese lenguaje. No instala automáticamente paquetes de terceros como Scanpy o pandas.

El mismo ordenador puede contener varias instalaciones de Python a la vez, tales como:

- Python instalado directamente en Windows;
- Python dentro de WSL;
- Python dentro de un entorno Conda; y
- Python dentro de un entorno virtual para un proyecto en particular.

Todas estas instalaciones pueden responder al nombre `python` aunque usen ejecutables y paquetes distintos. Con R puede ocurrir algo semejante debido a las instalaciones del sistema, las bibliotecas de paquetes de cada proyecto o los módulos de software de un servidor.

### 2. Paquetes: conjuntos de funciones que han escrito otras personas

Un **paquete** reúne código reutilizable, documentación y archivos relacionados.

Por ejemplo:

- Seurat es un paquete de R muy utilizado para el análisis de células individuales.
- Scanpy es un paquete de Python muy utilizado para el análisis de células individuales.
- ggplot2 proporciona funciones de trazado para R; y
- pandas proporciona funciones de procesamiento de tablas para Python.

Instalar R o Python es como obtener un laboratorio básico. Instalar paquetes es como traer microscopios, centrífugas y pipetas a ese laboratorio.

La analogía tiene un límite: los paquetes de software no son instrumentos completamente independientes. Un paquete a menudo llama a otros paquetes o programas del sistema, y pueden tener requisitos de versión estrictos.

### 3. Dependencias: lo que necesita un paquete para funcionar

Si el paquete A necesita el paquete B para funcionar, B es una **dependencia** de A.

Las dependencias pueden continuar a través de varios niveles:

```text
Script de análisis
  → Paquete A
    → Paquete B
      → Biblioteca de software de nivel inferior
```

Las herramientas de instalación normalmente intentan localizar estas dependencias automáticamente, pero “automático” no significa que siempre puedan encontrar una combinación compatible.

Supón que el paquete A requiere la versión 2.0 o posterior de una dependencia, mientras que el paquete C requiere una versión de esa misma dependencia estrictamente anterior a 2.0. Ninguna versión puede satisfacer ambos requisitos en un único entorno. En Python, pip puede indicar `ResolutionImpossible`. R o Bioconductor también pueden advertir que ciertos paquetes son demasiado antiguos, demasiado recientes o no están disponibles para la versión en uso.

### 4. Entornos de cálculo: los programas y las configuraciones que funcionan en conjunto

Un **entorno informático** es el conjunto de condiciones en las que se ejecuta realmente el código de un proyecto. Suele incluir:

- El sistema operativo y el tipo de hardware
- la versión y ubicación de R o Python;
- Paquetes instalados y sus versiones;
- bibliotecas de nivel inferior requeridas por esos paquetes; y
- Algunas rutas, ajustes regionales u otra configuración.

Diferentes herramientas de entorno no gestionan exactamente el mismo rango de componentes.

- El módulo `venv` que viene con Python permite crear para el proyecto un entorno con su propio directorio de paquetes Python.
- Un entorno de Conda puede gestionar Python, R y algunas dependencias de bajo nivel que no son paquetes de Python.
- Con renv, cada proyecto de R puede tener su propia biblioteca de paquetes. La información de esos paquetes se registra en `renv.lock`.

Su propósito común es reducir la interferencia entre proyectos.

### 5. Versiones: cómo cambia un mismo programa con el tiempo

El mismo nombre del software no significa que su comportamiento se mantenga sin cambios para siempre. Los desarrolladores corrigen errores y agregan características, pero también pueden cambiar parámetros predeterminados, nombres de funciones, formatos de archivo o requisitos de dependencia.

Un número de versión puede tener la forma `1.4.2`. Muchos proyectos distinguen versión mayor, versión menor y parche. La compatibilidad no se deduce únicamente de la posición de las cifras. Consulta la documentación y las notas de la versión del programa.

En un proyecto de bioinformática no basta con escribir «usamos Scanpy» o «usamos Seurat». Anota como mínimo la versión del paquete, su fuente de instalación, la versión de R o Python y el sistema operativo en el que se ejecutó.

## ¿Por qué conviene usar un entorno por proyecto?

Imagina que estás trabajando en dos proyectos:

- El Proyecto A reproduce un estudio unicelular de dos años de antigüedad y necesita versiones más antiguas del paquete.
- Proyecto B es un nuevo análisis de transcriptómica espacial y necesita versiones más nuevas del paquete.

Si cada paquete se instala en un entorno compartido, la actualización de los paquetes para el proyecto B puede romper repentinamente el proyecto A. En la dirección opuesta, rechazar cada actualización para preservar el proyecto A puede impedir que se instale el proyecto B.

Un arreglo más seguro es:

```text
Proyecto A → Entorno A → Versiones validadas para el proyecto A
Proyecto B → Entorno B → Versiones validadas para el proyecto B
```

Aislar los entornos reduce el riesgo de que un cambio en un proyecto impida ejecutar otro. La validez del análisis también depende de la pregunta biológica, del diseño del muestreo, de los parámetros elegidos y de la interpretación de los resultados.

## Cómo documentar entornos de R y Python

| Tipo de proyecto | Herramienta habitual de aislamiento | Archivo o información que conviene guardar | Qué se registra |
| --- | --- | --- | --- |
| Proyecto en R | renv | `renv.lock`, `sessionInfo()` | R, el sistema operativo, el origen y las versiones de los paquetes |
| Proyecto pequeño de Python | `venv` | `requirements.txt` y las versiones de Python y pip | Los paquetes necesarios en el entorno de Python activo |
| Proyecto de bioinformática en Python o que combina varios lenguajes | Conda | `environment.yml` u otro archivo exportado | Python/R, paquetes, canales y algunas dependencias de niveles inferiores |

Estos archivos no son backups mágicos.

- `requirements.txt` suele indicar qué paquetes de Python se necesitan. Puede no incluir todos los programas de bajo nivel instalados en el sistema operativo.
- `environment.yml` ayuda a reconstruir un entorno Conda. Los paquetes disponibles y sus compilaciones pueden variar entre sistemas operativos.
- `renv.lock` registra los paquetes de un proyecto de R y sus versiones. Para restaurarlos pueden hacer falta una versión compatible de R, el sistema operativo adecuado y herramientas de compilación.

Ser capaz de reconstruir un entorno es mucho más confiable que tratar de recordar lo que instaló. Aún así, no significa que cada computadora necesariamente producirá un entorno completamente idéntico.

## ¿Qué instalación de R o Python ejecuta tu código?

Los comandos a continuación no son un tutorial de instalación. Son herramientas de inspección para localizar un problema.

### Comprobar Python en un terminal

```bash
python --version
python -m pip --version
python -c "import sys; print(sys.executable)"
```

Responden a tres preguntas diferentes:

1. ¿Qué versión de Python inicia el comando `python`?
2. ¿Dónde está la instalación de pip que utiliza este intérprete de Python?
3. ¿Cuál es la ruta de archivo real del intérprete Python actual?

El segundo comando usa `python -m pip` para ejecutar pip con el intérprete de Python que acabas de comprobar. Si escribes solo `pip`, el sistema puede encontrar el pip de otra instalación de Python.

Algunos sistemas Linux llaman al comando `python3`. Si las instrucciones oficiales para el software o servidor usan `python3`, siga la nomenclatura real en ese entorno en lugar de reemplazar ciegamente cada comando con `python`.

### Comprobar R en un terminal y en una sesión de R

Primero ejecute esto en una terminal:

```bash
R --version
```

A continuación, inicia R y ejecuta estas líneas en su consola:

```r
R.version.string
.libPaths()
sessionInfo()
```

Estos comandos muestran la versión de R, los directorios en los que R busca actualmente paquetes e información sobre la sesión de R actual, el sistema operativo y los paquetes cargados.

Distingue el terminal de la consola de R. Ejecuta `R --version` en el terminal. `R.version.string`, `.libPaths()` y `sessionInfo()` son código de R y se ejecutan en la consola de R. Una orden introducida en el lugar equivocado puede provocar un error por ese solo motivo.

### Si utilizas Conda

```bash
conda env list
```

Un asterisco en la salida usualmente marca el entorno activo. Confirmar el nombre del entorno antes de instalar un paquete ayuda a evitar que ponga software en `base` o en el entorno de otro proyecto.

## ¿Qué indican cinco errores frecuentes?

| Error o síntoma | Origen probable | Qué comprobar primero |
| --- | --- | --- |
| `command not found` o «is not recognized as an internal or external command» | El sistema no encuentra el programa | ¿Está instalado el programa y puede el terminal localizarlo? |
| `ModuleNotFoundError` | El módulo no está en el entorno de Python activo | Comprueba la ruta del intérprete de Python y si instalaste el paquete en ese entorno |
| `there is no package called ...` | El paquete no se encuentra en la biblioteca que usa R | `.libPaths()` y la biblioteca donde instalaste el paquete |
| `ResolutionImpossible` u otro conflicto de dependencias | No se pueden satisfacer a la vez los requisitos de versiones de los paquetes | ¿Qué paquetes exigen versiones incompatibles de la misma dependencia? |
| `cannot open shared object file` o `DLL load failed` | Una biblioteca del sistema o un componente compilado | Revisa el sistema operativo, el tipo de procesador, el nombre de la biblioteca ausente y los requisitos oficiales |

La tabla solo le dice dónde buscar primero. Una sola línea de texto no siempre puede identificar una causa única. Cuando pida ayuda, conserve el comando completo y la salida que comienza con el primer error.

## Cómo diagnosticar paso a paso los errores de instalación o ejecución

### Paso 1: conserva el error antes de reinstalar

Primero guarde el error original. La ejecución de muchos comandos de instalación diferentes en sucesión puede cambiar el entorno y hacer que el problema original sea más difícil de reproducir.

### Paso 2: comprobar dónde se ejecuta el comando

Registre si está utilizando:

- Windows PowerShell;
- Una terminal WSL/Linux;
- la consola R;
- Python o Jupyter; o
- Un servidor remoto.

Decir “estoy trabajando en una computadora con Windows” no demuestra que el comando se ejecute en Windows. WSL y un servidor remoto pueden proporcionar entornos Linux.

### Paso 3: identificar el intérprete y el entorno que se están utilizando

Anota la versión y la ruta del intérprete de R o Python y el nombre del entorno de Conda o del proyecto. Esto resulta especialmente útil cuando un paquete parece estar instalado pero el intérprete no lo encuentra.

### Paso 4: localizar el primer error significativo

Los registros de instalación pueden ser largos. La última línea puede decir solo que la instalación falló, mientras que la causa real apareció antes, por ejemplo, una biblioteca del sistema que falta o un conflicto entre versiones de dependencia.

Comience a leer en el primer `ERROR`, `Error`, `cannot`, `failed` o mensaje de conflicto explícito, y luego inspeccione las líneas que lo rodean.

### Paso 5: comparar el resultado con los requisitos oficiales del programa

Confirmar:

- qué sistemas operativos y arquitecturas de procesador son compatibles;
- qué versiones de R o Python son compatibles;
- si se requiere un compilador o una biblioteca del sistema;
- si la instalación debe usar CRAN, Bioconductor, PyPI, un canal Conda o el código fuente oficial del software; y
- Si el tutorial fue escrito para una versión de software diferente.

No ignores los requisitos oficiales simplemente porque un comando antiguo de un resultado de búsqueda se vea más corto.

### Paso 6: cambiar una sola condición y repetir la prueba

Si decide cambiar la versión de un paquete, crear un nuevo entorno o agregar un componente del sistema, cambie una categoría a la vez y guarde tanto el comando como el resultado. Así es como se determina qué cambio resolvió el problema.

## Un proyecto de análisis unicelular puede usar varios entornos

“Un proyecto, un entorno” es una regla útil para principiantes, pero un proyecto real puede llamar a varios programas independientes.

Por ejemplo:

```text
Datos brutos de 10x
  → Ejecutar Cell Ranger en Linux
  → Generar una matriz de expresión
  → Usar Seurat en un entorno de R o Scanpy en un entorno de Python
  → Obtener resultados de control de calidad, agrupamiento y visualización
```

Cell Ranger, Seurat y Scanpy no necesariamente necesitan estar instalados en el mismo entorno. Lo que importa es registrar cada paso:

- el entorno en el que se ejecutó el paso;
- los datos de entrada y los resultados de salida;
- qué versión de software se utilizó;
- qué genoma de referencia o versión de anotación utilizó; y
- donde se almacenaban sus registros y registros de entorno.

Lo mismo se aplica a la multiómica de células individuales y a la ómica espacial. Un análisis puede combinar programas de la plataforma de secuenciación, paquetes de R o Python, herramientas de procesamiento de imágenes y datos de referencia. Documentar el entorno de cada paso permite rastrear sus condiciones de ejecución aunque se hayan utilizado entornos separados.

## Codex ayuda a instalar el software. ¿Qué entorno necesita tu proyecto?

Si solo dices «no consigo instalar Scanpy», Codex tendrá que hacer conjeturas. Una petición más útil incluye:

```text
Estoy ejecutando el comando en Ubuntu dentro de WSL.
Mi versión actual de Python es ...
El resultado de python -m pip --version es ...
Mi entorno actual de Conda es ...
El comando completo que ejecuté es ...
La salida completa a partir del primer error es ...
Las instrucciones oficiales de instalación de este proyecto están en ...
Determina primero si el problema se debe a una ruta, al entorno, a una versión,
a una dependencia o a una biblioteca del sistema. Explica en qué te basas y propone
el cambio mínimo. No actualices todos los paquetes.
```

Codex puede ayudarle a leer registros, comparar requisitos de versión y organizar pasos de diagnóstico. Todavía necesita confirmar:

- si la documentación que cita coincide con la versión actual del software;
- si el comando modificará un entorno que ya está en uso;
- si la actualización del software podría afectar a un análisis que ya ha sido validado; y
- Si la prueba mínima y las comprobaciones de resultados importantes se volvieron a ejecutar después de la reparación.

Proporciona a la IA información suficiente sobre el entorno para orientar el diagnóstico. Pide una razón para cada cambio y una manera de comprobar si resolvió el problema. Probar comandos uno tras otro sin esa información dificulta identificar la causa.

## ¿Qué información del entorno debes guardar por proyecto?

Cuando comience un análisis, registre al menos:

1. Sistema operativo y versión;
2. la versión de R o Python y la ruta real;
3. el nombre del entorno del proyecto;
4. los paquetes principales y sus versiones;
5. la fuente o canal de instalación;
6. un archivo de entorno como `renv.lock`, `requirements.txt` o `environment.yml`;
7. las versiones del genoma de referencia, de la anotación de genes o de los demás datos de referencia utilizados;
8. los registros de instalación y ejecución.

La ejecución correcta del código solo muestra que el entorno actual aceptó esas instrucciones. Solo cuando el entorno, las entradas, los parámetros, las versiones de software y las comprobaciones de salida también se conservan, otras personas tienen la oportunidad de entender y reconstruir el análisis.

## Referencias y lecturas recomendadas

1. [Documentación oficial de Python: crear entornos virtuales con `venv`](https://docs.python.org/3/library/venv.html)
2. [Guía del usuario de Python Packaging: archivos de dependencias y requisitos](https://packaging.python.org/en/latest/discussions/install-requires-vs-requirements/)
3. [Documentación oficial de pip: resolución de dependencias y conflictos](https://pip.pypa.io/en/stable/topics/dependency-resolution/)
4. [Documentación oficial de Conda: gestión y uso compartido de entornos](https://docs.conda.io/projects/conda/en/stable/user-guide/tasks/manage-environments.html)
5. [Documentación oficial de renv: entornos locales de proyecto para R](https://rstudio.github.io/renv/articles/renv.html)
6. [Instrucciones de instalación oficiales de Bioconductor](https://bioconductor.org/install/)
7. [Documentación oficial R: `sessionInfo()`](https://stat.ethz.ch/R-manual/R-devel/library/utils/html/sessionInfo.html)
