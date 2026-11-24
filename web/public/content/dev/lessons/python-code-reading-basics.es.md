# 0.4 | Leer y entender código en Python: sintaxis básica

Imagina que le das a Codex una tabla de indicadores de calidad por célula y le pides que seleccione las células que podrían conservarse. Te devuelve este código Python:

Aquí, `cell_metadata.csv` es una tabla ficticia de metadatos celulares. Cada fila representa una célula pendiente de control de calidad. `cell_id` identifica la célula y `sample_id` su muestra biológica de origen. `n_genes` indica el número de genes detectados en esa célula. `percent_mito` expresa el porcentaje del recuento total asignado a genes mitocondriales: el valor `10` significa el 10 %, no 0,10. Los nombres de los campos y los umbrales se han elegido para este ejercicio. Para datos reales, compruébalos en la documentación del objeto y el protocolo experimental, y verifica las unidades.

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

Este código será el ejemplo de toda la lección. Lo leeremos atendiendo a estos puntos, en orden:

- Los datos proceden de `cell_metadata.csv`.
- `cells`, `missing_columns`, `keep` y `filtered_cells` se refieren a objetos en diferentes etapas.
- La sangría determina si `raise` pertenece al bloque `if`.
- Las condiciones de filtrado determinan conjuntamente qué filas se conservan y cómo se manejan los valores faltantes.
- Los paréntesis exteriores permiten que una condición larga abarque varias líneas, mientras que los paréntesis alrededor de las expresiones de comparación aseguran que `&` combine los resultados fila por fila como se esperaba.
- `.loc`, `.copy()` y `.mean()` realizan selección, copia y cálculo, respectivamente.
- `500` y `10` son umbrales que un investigador todavía debe juzgar contra los datos actuales.

Solo cuando se pueden explicar estas pistas en lenguaje común se puede juzgar si el código lee el archivo correcto, utiliza las columnas correctas, o podría eliminar señales biológicas razonables como si fueran datos de baja calidad.

El objetivo de esta lección no es hacerte memorizar la sintaxis de Python o reproducir un programa desde la memoria sin documentación. Necesita desarrollar la capacidad de leer código: cuando vea código Python, debe ser capaz de identificar dónde entran los datos, cómo cambian, a dónde va la salida y qué decisiones computacionales siguen siendo responsabilidad del investigador.

Esta lección asume que ya sabes que Python es un lenguaje de programación comúnmente utilizado para el procesamiento de datos, automatización y análisis bioinformático, y que los paquetes y entornos de proyecto afectan si el código puede ejecutarse. No necesita instalar ningún software por adelantado, y no se requiere experiencia en programación.

Los bloques de código en esta lección son principalmente para leer; no necesita ejecutarlos ahora. Si desea seguir adelante, primero confirme dónde se ejecutará el código: un intérprete interactivo de Python, un script con la extensión `.py` o un cuaderno de Jupyter. Un nombre de archivo sin una ruta completa, como `"cell_metadata.csv"`, se busca en relación con el directorio de trabajo actual. En Python, puedes usar `Path.cwd()` para ver esa ubicación.

En su primera lectura, puede dividir el material en dos niveles:

- **Debes comprender:** la sangría, los nombres y la asignación, los tipos de datos habituales, las listas y los diccionarios, la indexación y los segmentos, las funciones y los métodos, las comparaciones y las condiciones lógicas, los valores ausentes, las importaciones y el filtrado de tablas.
- **Por ahora basta con reconocer:** las comprensiones de listas, los generadores, los gestores de contexto, los decoradores, las clases, las anotaciones de tipo, los arrays de NumPy, las matrices dispersas y AnnData. Si te encuentras con estas estructuras, pide una explicación a la IA o consulta la documentación oficial.

Si esta es su primera lectura, siga cuatro caminos cortos a través de la lección. Primero, comprenda las ubicaciones de ejecución, las partes de una línea de código y la sangría. A continuación, comprenda los nombres, objetos, tipos básicos, listas, diccionarios y conjuntos. A continuación, pase a funciones, métodos, importaciones, lógica ordinaria y lógica pandas fila por fila. Por último, lea las secciones sobre los valores faltantes y el filtrado de DataFrame, seguido del ejemplo completo al final. En una primera pasada, solo necesita reconocer las tuplas, `while`, las comprensiones de la lista y la lista detallada de operaciones arriesgadas; no necesita memorizarlas ni escribirlas.

A excepción de la sección que lee el ejemplo de apertura en su totalidad, los bloques de código más cortos de esta lección son principalmente fragmentos de lectura que dependen de los objetos introducidos anteriormente. No asuma que cada fragmento es un script completo que puede ejecutarse por sí mismo.

## El «vibe coding» también exige saber leer Python

"Vibe coding" es un término informal. Por lo general, significa describir una tarea en lenguaje natural y permitir que la IA genere, modifique y ejecute el código, sin que el usuario tenga que escribir cada instrucción carácter por carácter.

Esta forma de trabajar realmente reduce la carga de memorizar la sintaxis. Puedes pedirle a Codex que:

- generar código Python para una tarea;
- explicar un traceback, que es la ruta de llamada mostrada cuando ocurre un error;
- Organizar pasos repetidos en un guion;
- Encontrar dónde se asignó o modificó un nombre;
- Comprobar los argumentos de la función contra la documentación oficial;
- Ejecutar código y mostrar resultados intermedios importantes.

Por lo tanto, la capacidad de escribir todo desde cero ya no es la única medida de la habilidad analítica.

Sin embargo, las solicitudes de lenguaje natural aún se convierten en operaciones exactas. Una computadora no entiende automáticamente el diseño experimental detrás de "eliminar células de baja calidad". Solo ejecuta una condición como "mantener filas donde `n_genes >= 500` y `percent_mito < 10`". Si la IA no entiende un nombre de columna, unidad de porcentaje, valor faltante o dirección de comparación, el código puede ejecutarse correctamente.

Por esa razón, este curso pide a los principiantes que cumplan con el siguiente estándar:

> No tienes que escribir Python de memoria, pero debes ser capaz de traducir código importante a lenguaje ordinario y comprobar si esa traducción coincide con la pregunta de investigación.

Esto no significa que debas entender todos los mecanismos internos de Python. Puede comenzar aprendiendo las estructuras más comunes en el código de análisis y consultar la documentación cuando sea necesario.

## ¿Dónde se ejecuta el código Python?

El mismo código Python puede aparecer en diferentes lugares. Su ubicación de ejecución afecta a cómo se ingresa, el directorio de trabajo, qué objetos ya existen y cómo se muestran los resultados.

### El intérprete interactivo

Entrar `python`, o `python3` en algunos sistemas, en una terminal puede iniciar el intérprete interactivo de Python. Un prompt común es:

```text
>>>
```

En un tutorial, `>>>` significa "la entrada comienza aquí"; no es parte del código. No copie el prompt al copiar un ejemplo.

En el intérprete interactivo, al ingresar una expresión directamente se mostrará su resultado:

```python
2 + 3
```

```text
5
```

En un script `.py`, el mero hecho de escribir una expresión no garantiza que aparezca su resultado. Para que quede visible, use `print()`, regístrelo en un archivo de log o escríbalo explícitamente en un archivo de salida.

### El script de Python

Un archivo de texto con la extensión `.py` se llama comúnmente un script de Python. Por ejemplo:

```text
filter_cells.py
```

Un script es adecuado para guardar una secuencia de pasos que se pueden ejecutar repetidamente. El comando de terminal podría ser:

```text
python filter_cells.py
```

Este es un comando de terminal y no debe colocarse dentro de un bloque de código Python. Si el script puede ejecutarse también depende de qué Python la terminal realmente invoca, si los paquetes requeridos están instalados en el entorno actual, y si el directorio de trabajo actual es correcto.

### El cuaderno Jupyter

Un cuaderno de Jupyter divide el código en celdas que se pueden ejecutar por separado. Esto facilita explorar los datos paso a paso, aunque el orden en que se ejecutan las celdas puede diferir de su orden en la página.

Un nombre que solo existe en la memoria del kernel desaparece al reiniciarlo. Si ejecuta una celda inferior y después modifica una celda anterior, el orden que ve en la página puede ocultar el orden en el que se ejecutó el código.

Al revisar un cuaderno, por lo tanto, compruebe:

- si puede ejecutarse en orden desde un kernel nuevo;
- qué celda crea primero cada nombre;
- si los resultados descendentes se recalculan después de que una celda ascendente cambie;
- Si los resultados importantes existen solo en la memoria.

### Comprobar la versión y el directorio de trabajo

Lo siguiente es un comando de terminal:

```text
python --version
```

Lo siguiente es código Python:

```python
import sys
from pathlib import Path

print(sys.version)
print(Path.cwd())
```

No asuma que una ventana de código utiliza la versión y el entorno que espera solo porque su título dice "Python". La versión, la ruta del intérprete, el entorno del proyecto y el directorio de trabajo pueden afectar al resultado.

## Los elementos de una línea de Python

Considere esta línea:

```python
average_genes = filtered_cells["n_genes"].mean()
```

Puedes leerlo de derecha a izquierda:

1. `filtered_cells["n_genes"]`: toma la columna denominada `n_genes` de la tabla;
2. `.mean()`: llama al método proporcionado por esa columna para calcular la media;
3. `=`: vincular el resultado de la derecha al nombre de la izquierda;
4. `average_genes`: utilice este nombre para referirse al resultado calculado más adelante.

En lenguaje común:

> Tome la columna `n_genes` de la tabla de células filtrada, calcule su media y haga que el nombre `average_genes` haga referencia a ese resultado.

Puede buscar los nombres de las funciones y los parámetros de los métodos en la documentación, pero aún debe poder explicar la entrada, la acción y el resultado.

## Indentación: cómo delimita Python los bloques de código

Muchos lenguajes delimitan los bloques de código con llaves. En Python, el nivel de sangría al comienzo de cada línea indica a qué bloque pertenece.

```python
if cell_count == 0:
    print("No cells are available for analysis")

print("Check complete")
```

Este código significa:

- Si `cell_count == 0` vale `True`, se ejecuta el `print()` que aparece con sangría.
- La última línea vuelve al nivel exterior y se ejecuta tanto si se cumple la condición como si no.

Los dos puntos `:` al final de la línea con `if` anuncian un bloque. Las líneas que están al mismo nivel dentro de ese bloque deben llevar la misma sangría. Lo habitual es añadir cuatro espacios por nivel.

Las siguientes dos piezas de código pueden ser Python válidas, pero significan cosas diferentes.

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

El primer fragmento detiene el programa solo cuando el número de células es cero. El segundo lo detiene para cualquier valor. Un cambio de sangría introducido por la IA puede cambiar cuándo se ejecuta una instrucción sin producir ningún error de sintaxis.

Al aplicar sangría en un mismo archivo, utilice de forma coherente espacios o tabulaciones. Algunas mezclas producen un `TabError`. Otras pueden parecer alineadas en el editor aunque las líneas pertenezcan a niveles distintos de los previstos.

## Nombres, objetos y asignación

Números, texto, listas, funciones y tablas en Python pueden ser tratados como objetos. Un nombre permite que el código se refiera a un objeto de nuevo.

```python
gene_name = "MS4A1"
cell_count = 1200
```

Aquí:

- `"MS4A1"` es un objeto de cadena;
- `1200` es un objeto entero;
- `gene_name` y `cell_count` son nombres;
- `=` realiza la asignación, haciendo que el nombre de la izquierda se refiera al objeto de la derecha.

Python no requiere que declares que "este nombre solo puede contener un entero a partir de ahora". El mismo nombre puede ser reasignado:

```python
cell_count = 1200
cell_count = "1200"
```

Después de la segunda línea, `cell_count` hace referencia al texto `"1200"`. El número entero `1200` y una cadena con esos cuatro caracteres se comportan de manera distinta en los cálculos. La asignación es válida, pero una operación posterior puede dar otro resultado o producir un error.

### `=` asigna, `==` compara

```python
cell_count = 1200
cell_count == 1200
```

La primera línea asigna un valor a un nombre. La segunda compara dos valores y devuelve `True` si son iguales o `False` en caso contrario.

Al revisar una condición, compruebe especialmente cuidadosamente si la IA ha confundido `=` con `==`.

### Reasignar un nombre y copiar un objeto

```python
genes = ["MS4A1", "CD3D"]
selected_genes = genes
selected_genes.append("NKG7")
```

Ahora `genes` y `selected_genes` hacen referencia a la misma lista. Si se modifica la lista usando cualquiera de los dos nombres, el cambio también aparece al consultarla a través del otro.

```python
print(genes)
```

```text
['MS4A1', 'CD3D', 'NKG7']
```

Si necesita una lista externa separada, haga que la copia sea explícita:

```python
selected_genes = genes.copy()
```

Los elementos del ejemplo son cadenas inmutables. Por eso añadir un gen nuevo a la copia `selected_genes` deja intacta la lista `genes`. Sin embargo, `list.copy()` solo copia la lista exterior. Si esta contiene objetos que se pueden modificar, las dos listas pueden seguir compartiendo esos objetos internos.

Una forma útil de entender la asignación al principio es pensar que se da otro nombre al mismo objeto. La gestión de memoria de Python tiene más matices. Si el objeto se puede modificar, `a = b` por sí solo no crea una copia independiente de la que se pueda cambiar el contenido sin afectar al original.

## Comentarios, cadenas de caracteres y texto con formato

### El texto que sigue a `#` suele ser un comentario

```python
# Leer los metadatos de las células
cells = pd.read_csv("cell_metadata.csv")
```

Un comentario no se ejecuta como parte del cálculo, pero los comentarios pueden quedar obsoletos. Si el código y un comentario no coinciden, juzga por el código que se ejecuta realmente, la estructura del objeto y el resultado en lugar de confiar solo en el comentario.

Si `#` aparece entre comillas, es simplemente parte de una cadena:

```python
color = "#2855c5"
```

### Las comillas delimitan las cadenas de texto

```python
gene_name = "MS4A1"
sample_name = 'sample_A'
```

Tanto las comillas simples como las dobles pueden representar cadenas ordinarias. Agregar comillas alrededor de los dígitos los convierte en texto:

```python
threshold_number = 500
threshold_text = "500"
```

`threshold_number` se puede usar directamente en una comparación numérica. `threshold_text` contiene texto. Al leer un CSV, compruebe también que el tipo asignado a cada columna sea el esperado.

### Insertar valores en el texto con una f-string

```python
cell_count = 1200
message = f"Retained {cell_count} cells"
print(message)
```

El prefijo `f` significa que `{cell_count}` dentro de la cadena se reemplaza por su valor actual.

```text
Retained 1200 cells
```

Una cadena f es útil para registros y mensajes de error. El contenido dentro de los corchetes sigue ejecutándose, así que no lo trate como texto estático.

## Tipos básicos: números, texto, valores booleanos y ausencia de valor

| Tipo | Ejemplo | ¿Qué representa el valor? |
| --- | --- | --- |
| `int` | `1200` | Un número entero |
| `float` | `7.5` | Un valor numérico con parte decimal |
| `str` | `"MS4A1"` | Una cadena de caracteres, es decir, texto |
| `bool` | `True`, `False` | Los valores lógicos verdadero y falso |
| `NoneType` | `None` | El valor especial de Python que indica la ausencia de un objeto |

Puedes usar `type()` para inspeccionar el tipo de un objeto:

```python
print(type(1200))
print(type("1200"))
```

```text
<class 'int'>
<class 'str'>
```

En análisis reales, también encontrará tipos suministrados por NumPy y pandas, como `int64`, `float64`, `category`, y tipos de cadenas nulables. No son necesariamente idénticos a los tipos incorporados de Python. Por ahora, primero confirme si un objeto es numérico, textual, lógico o faltante, y si ese tipo es apropiado para el cálculo actual.

### Convertir un tipo y validar los datos

```python
cell_count = int("1200")
```

Esto convierte el texto `"1200"` a un número entero. Sin embargo:

```python
cell_count = int("twelve hundred")
```

levanta un `ValueError`.

Incluso una conversión exitosa no demuestra que el valor original sea biológicamente razonable. Convertir `"999999"` a un entero no demuestra automáticamente que la muestra realmente contiene tantas células.

## Contenedores: agrupar varios valores

### Lista (`list`)

Una lista usa corchetes, conserva el orden de los elementos y puede ser modificada.

```python
marker_genes = ["MS4A1", "CD3D", "NKG7"]
```

Las operaciones comunes incluyen:

```python
marker_genes.append("LYZ")
gene_count = len(marker_genes)
```

`.append()` modifica la lista original; `len()` devuelve el número de elementos.

### Tupla (`tuple`)

Una tupla comúnmente usa paréntesis y no permite reemplazar sus elementos de la misma manera que una lista después de haber sido creada.

```python
matrix_shape = (1200, 20000)
```

Estas dimensiones podrían corresponder a 1200 filas y 20 000 columnas. Para saber si la matriz contiene células en las filas y genes en las columnas, o al revés, consulte la documentación del objeto y el código. Los dos números por sí solos no lo indican.

### Diccionario (`dict`)

Un diccionario asocia una clave con un valor.

```python
sample_to_group = {
    "sample_A": "control",
    "sample_B": "treated",
}
```

Recupera un valor por clave:

```python
group = sample_to_group["sample_A"]
```

Si la clave no existe, la búsqueda entre corchetes genera un `KeyError`. Algunos códigos usan `.get()`:

```python
group = sample_to_group.get("sample_C")
```

Si no encuentra la clave, `.get()` devuelve `None` de forma predeterminada. Así puede evitarse un error inmediato, pero la ausencia del dato puede pasar inadvertida en los pasos siguientes. Compruebe cómo se trata el valor `None` devuelto.

### Conjunto (`set`)

Un conjunto almacena elementos únicos y se escribe comúnmente con corchetes.

```python
required_columns = {"cell_id", "sample_id", "n_genes", "percent_mito"}
observed_columns = {"cell_id", "n_genes", "sample_id"}
missing_columns = required_columns - observed_columns
```

Aquí, el signo menos significa diferencia de conjunto. `missing_columns` contiene columnas que son requeridas pero no observadas:

```text
{'percent_mito'}
```

Un conjunto no es adecuado para expresar un orden de fila que debe ser preservado. Si el orden de salida afecta a un resultado o registro, ordenarlo explícitamente.

## Índices y rebanadas: Python suele contar desde 0

### Seleccionar un elemento por su posición

```python
genes = ["MS4A1", "CD3D", "NKG7"]
first_gene = genes[0]
last_gene = genes[-1]
```

Los resultados son los siguientes:

```text
MS4A1
NKG7
```

`[0]` selecciona el primer elemento. `[-1]` cuenta desde el final y selecciona el último. Si se pide una posición que no existe, Python genera un `IndexError`.

### Un segmento suele incluir la posición inicial y excluir la final

```python
genes[0:2]
```

El resultado contiene los dos primeros elementos:

```text
['MS4A1', 'CD3D']
```

El corte `0:2` representa el intervalo de posiciones `[0, 2)`. Incluye las posiciones 0 y 1. La posición 2 queda fuera.

```python
genes[:2]
genes[1:]
```

Si se omite el inicio del corte, se empieza por el primer elemento. Si se omite el límite final, se continúa hasta el último elemento.

### En pandas, distinguir la indexación por etiqueta y por posición

En una tabla de pandas:

- `.loc[...]` selecciona principalmente por etiquetas de fila, etiquetas de columna o condiciones lógicas.
- `.iloc[...]` selecciona por posiciones numéricas enteras.

```python
cells.loc[keep, ["cell_id", "n_genes"]]
cells.iloc[:5, :2]
```

La primera línea selecciona las filas que cumplen una condición y elige dos columnas por su nombre. La segunda selecciona por posición las cinco primeras filas y las dos primeras columnas.

En `.loc[0:2]` los límites son etiquetas. Un intervalo de etiquetas puede incluir también la etiqueta final y seguir reglas distintas de las de los cortes por posición en Python. Compruebe las etiquetas del índice y la documentación del objeto.

## Funciones: procesar entradas y devolver resultados

```python
rounded_value = round(7.456, ndigits=2)
```

Esta línea contiene:

- Función: `round`;
- primera entrada pasada a la función: `7.456`;
- Nombre del parámetro: `ndigits`;
- Valor suministrado para ese parámetro: `2`;
- Resultado devuelto: `7.46`;
- Nombre que almacena el resultado: `rounded_value`.

Un parámetro es un nombre de entrada en una definición de función. El valor realmente suministrado al llamar a una función se llama a menudo un argumento. En un nivel introductorio, es más importante identificar "qué entrada controla qué comportamiento" que memorizar la terminología.

### Argumentos posicionales y argumentos por palabra clave

```python
rounded_value = round(7.456, 2)
rounded_value = round(7.456, ndigits=2)
```

Ambas líneas pueden producir el mismo resultado. El segundo escribe el nombre del parámetro explícitamente y es a menudo más fácil de leer.

Sin embargo, no todos los parámetros se pueden cambiar libremente en forma de palabras clave. Antes de llamar a una función de terceros, compruebe la firma de la función y la documentación oficial para la versión actual.

### Guardar un valor de retorno o mostrarlo explícitamente

```python
average_genes = filtered_cells["n_genes"].mean()
print(average_genes)
```

La primera línea almacena el resultado calculado, y la segunda lo muestra.

Si usted escribe solo:

```python
filtered_cells["n_genes"].mean()
```

El resultado generalmente se mostrará en un intérprete interactivo o al final de una celda del cuaderno. Un script no debe depender de esta visualización automática. Un análisis confiable debe almacenar, imprimir, registrar o escribir los resultados importantes de forma explícita.

En pandas, `Series.mean()` usa `skipna=True` por defecto y omite los valores ausentes al calcular la media. El filtro de este ejemplo ya exige que `n_genes` tenga un valor. Si después de filtrar no queda ninguna fila, la media se muestra como `NaN` y no se puede interpretar como resultado del análisis. Antes de interpretar la media, compruebe que `filtered_cells.empty` sea `False` y anote cuántas filas se conservaron. El valor devuelto es un escalar numérico. Según el tipo de columna y la versión del software, puede ser un escalar de Python, NumPy o pandas.

### En una función propia, revisar primero las entradas, el valor de retorno y los efectos secundarios

```python
def keep_high_gene_cells(table, minimum_genes):
    keep = table["n_genes"].notna() & (table["n_genes"] >= minimum_genes)
    return table.loc[keep].copy()
```

Al leer la función, primero busque:

1. el nombre de la función después de `def`;
2. los parámetros de entrada entre paréntesis;
3. lo que hace el código indentado;
4. lo que devuelve `return`;
5. Si la función también modifica un objeto externo, archivo o entorno.

Incluso una función sin `return` puede escribir archivos, modificar un objeto que recibe como argumento o cambiar el estado global. Siga también esos efectos al leer el código.

## Métodos y atributos: ¿qué indica el punto después de un objeto?

```python
cells.columns
cells["n_genes"].notna()
```

Ambas líneas usan un punto, pero significan cosas diferentes.

- `.columns` es un atributo que contiene información llevada por el objeto; aquí, contiene las etiquetas de columna.
- `.notna()` es un método, una operación proporcionada por el objeto y llamada aquí.

La diferencia más visible es que las llamadas a métodos usualmente tienen paréntesis, mientras que el acceso a atributos usualmente no lo tiene.

Sin embargo, no se puede inferir el significado científico solo de los paréntesis. Utilice el tipo de objeto y la documentación para confirmar exactamente lo que devuelve un atributo o método.

### Un método con el mismo nombre puede comportarse de forma distinta según el tipo de objeto

```python
genes.copy()
cells.copy()
```

Si `genes` es una lista de Python, la primera línea llama a un método de lista. Si `cells` es un DataFrame de pandas, la segunda llama a un método de pandas. En ambos casos el método se llama `.copy()`, pero el tipo de objeto determina qué partes se copian y cómo se hace.

Por lo tanto, al leer `object.method()`, primero determine el tipo del objeto a la izquierda del punto.

`DataFrame.copy()` tampoco copia de forma recursiva todos los elementos. Por ejemplo, los objetos de Python almacenados en una columna de tipo `object` no se copian recursivamente. En copias superficiales, como las que se solicitan con `deep=False`, también influyen la versión de pandas y su comportamiento de copia en la escritura (Copy-on-Write). Cuando vea `.copy()`, identifique el tipo de objeto a la izquierda del punto y consulte la documentación de su versión.

## Módulos, paquetes e `import`

Python organiza el código reutilizable en módulos y paquetes.

```python
from pathlib import Path
import pandas as pd
```

La primera línea significa: importar `Path` desde el módulo de biblioteca estándar `pathlib`.

El segundo significa: importar el paquete de terceros `pandas` y usar el nombre corto `pd` en el código actual.

Por consiguiente:

```python
pd.read_csv("cell_metadata.csv")
```

significa llamar a la función `read_csv()` suministrada por pandas.

### Formas habituales de importar

```python
import pandas
import pandas as pd
from pathlib import Path
```

No crean exactamente los mismos nombres:

- Después de `import pandas`, normalmente se escribe `pandas.read_csv(...)`;
- Después de `import pandas as pd`, normalmente se escribe `pd.read_csv(...)`;
- Después de `from pathlib import Path`, puede escribir `Path(...)` directamente.

### Instalar un paquete e importarlo

`python -m pip install pandas` es un comando de terminal que cambia un entorno de software, y esta lección no requiere que lo ejecute. Debe considerar ejecutar un comando de instalación solo después de confirmar que este `python` es el intérprete utilizado por el entorno del proyecto de destino. Por el contrario, `import pandas` es código Python que carga un paquete ya instalado en el proceso Python actual.

Si la instalación y la ejecución usan diferentes entornos Python, es posible que aún vea lo siguiente después de una instalación exitosa:

```text
ModuleNotFoundError: No module named 'pandas'
```

En esa situación, primero confirme la ruta del intérprete y el entorno del proyecto en lugar de intentar una serie de comandos de instalación diferentes.

## Comparaciones y condiciones lógicas

### Operadores de comparación habituales

| Sintaxis | Significado |
| --- | --- |
| `x == y` | ¿Son iguales los valores? |
| `x != y` | ¿Son distintos los valores? |
| `x < y` | ¿Es `x` menor que `y`? |
| `x <= y` | ¿Es `x` menor o igual que `y`? |
| `x > y` | ¿Es `x` mayor que `y`? |
| `x >= y` | ¿Es `x` mayor o igual que `y`? |

Una comparación suele producir `True` o `False`.

```python
n_genes = 800
n_genes >= 500
```

El resultado es:

```text
True
```

### Combinar condiciones lógicas con `and`, `or` y `not`

```python
n_genes = 800
percent_mito = 6.5

keep = n_genes >= 500 and percent_mito < 10
```

Esto es apropiado para dos valores lógicos individuales.

```python
has_cells = True
has_required_columns = False

ready = has_cells and has_required_columns
```

`ready` es `False`.

### Comprobar la pertenencia con `in`

```python
gene_name = "MS4A1"
marker_genes = ["MS4A1", "CD3D", "NKG7"]

is_marker = gene_name in marker_genes
```

Para un diccionario, `in` comprueba las claves por defecto, no los valores:

```python
"sample_A" in sample_to_group
```

### Comprobar con `is None` si un objeto es exactamente `None`

```python
sample_name = None

if sample_name is None:
    print("Sample name is missing")
```

El operador `is` comprueba si dos nombres hacen referencia al mismo objeto. Para comparar el valor de dos números o cadenas, use `==`. Que ambas pruebas coincidan en un caso concreto no justifica sustituir la comparación de valores por `is`.

Antes de filtrar con pandas, distinga dos estructuras. Un DataFrame es una tabla bidimensional con filas, columnas y etiquetas. Una Series guarda datos en una sola dimensión y tiene un índice. Seleccionar una columna de un DataFrame suele devolver una Series. Si compara un único número mediante `n_genes >= 500`, normalmente obtiene un `bool`. En cambio, `cells["n_genes"] >= 500` devuelve una Series de valores lógicos, uno por fila.

## ¿Por qué los filtros de pandas usan `&` en lugar de `and`?

Cuando se compara una columna entera:

```python
cells["n_genes"] >= 500
```

El resultado contiene un valor lógico por fila. En lugar de un único `True` o `False`, se obtiene toda una columna de respuestas.

```text
0     True
1    False
2     True
dtype: bool
```

Para combinar dos condiciones de columna fila por fila, pandas comúnmente usa:

- `&`: elemento sabio "y"
- `|`: elemento sabio "o"
- `~`: elemento sabio "no"

```python
keep = (
    (cells["n_genes"] >= 500)
    & (cells["percent_mito"] < 10)
)
```

Encierre cada comparación entre paréntesis. Así se evalúan primero las comparaciones y la precedencia de los operadores no cambia el sentido de la expresión.

No copie el siguiente formulario directamente en un filtro de columna pandas:

```python
keep = cells["n_genes"] >= 500 and cells["percent_mito"] < 10
```

`and` necesita una única respuesta lógica para toda la columna. Como una Series contiene un valor por fila, pandas suele generar un error que indica que su valor de verdad es ambiguo.

Antes de combinar condiciones, compruebe qué hay a cada lado. Para combinar dos columnas lógicas por filas se suele usar `&`. Para combinar dos valores booleanos individuales, lo normal sigue siendo usar `and`, incluso en un script que también emplea pandas.

## Valores ausentes: distinguir `None`, `NaN` y `pd.NA`

Los datos reales pueden representar valores faltantes de varias maneras:

- `None` es el valor especial de Python que se usa para indicar que no hay ningún objeto que devolver o usar.
- `NaN` se usa a menudo para representar un valor ausente en datos numéricos.
- `pd.NA` es el marcador de valor ausente que usan algunos tipos de datos de pandas que admiten valores nulos.
- `NaT` se usa a menudo para indicar que falta una fecha o una hora.

No utilice comparaciones ordinarias de igualdad como una prueba universal para todos estos valores faltantes.

```python
value = None
value is None
```

Para los objetos pandas, las formas comunes son:

```python
cells["n_genes"].isna()
cells["n_genes"].notna()
```

Preste especial atención a lo siguiente:

- Una cadena vacía `""` puede pasar inadvertida en una comprobación de valores ausentes. El comportamiento depende de la comprobación utilizada.
- Que la cadena `"NA"` se interprete como un valor ausente depende de los parámetros de lectura.
- infinito no es lo mismo que un valor ordinario faltante;
- Si eliminar, llenar o retener un valor faltante debe decidirse a partir del significado de los datos y el objetivo analítico.

En el ejemplo de control de calidad:

```python
cells["n_genes"].notna() & cells["percent_mito"].notna()
```

Esta condición exige que ambas columnas contengan un valor en la fila. Así queda explícito cómo se tratarán los valores ausentes antes de aplicar el filtro.

## DataFrame: una tabla organizada en filas y columnas

Un DataFrame pandas es una tabla bidimensional. En un nivel introductorio, puedes pensar en ello de la siguiente manera:

- Cada fila suele representar una observación;
- Cada columna representa una variable;
- el índice de fila identifica posiciones o etiquetas de fila;
- Los nombres de columna describen lo que significa cada columna.

Por ejemplo, una tabla de metadatos de célula podría ser:

| cell_id | sample_id | n_genes | percent_mito |
| --- | --- | ---: | ---: |
| AAAC-1 | sample_A | 900 | 4.1 |
| AAAG-1 | sample_A | 650 | 8.2 |
| AAAT-1 | sample_B | 350 | 3.2 |

Sin embargo, un DataFrame no garantiza automáticamente que "cada fila represente una célula". Una fila podría representar una muestra, un gen, una ubicación espacial o una comparación. Debe inspeccionar la descripción de datos, identificadores y forma del objeto.

### Examinar la estructura antes de escribir una condición de filtrado

```python
print(cells.shape)
print(cells.columns.tolist())
print(cells.head())
print(cells.dtypes)
```

Estas líneas le ayudan a inspeccionar, respectivamente:

- los números de filas y columnas;
- los nombres de las columnas;
- las primeras filas;
- El tipo de datos de cada columna.

`head()` muestra solo un pequeño número de filas y no puede probar que el resto de la tabla no contiene problemas. Dependiendo de la tarea, también debe inspeccionar los recuentos de valores faltantes, identificadores únicos, filas duplicadas, rangos numéricos y la distribución dentro de cada muestra.

### Filtrar filas con `.loc[keep]` y una condición lógica

```python
filtered_cells = cells.loc[keep].copy()
```

Aquí:

- `keep` es una condición lógica correspondiente a las filas de la tabla;
- `.loc[keep]` selecciona filas donde la condición es verdadera;
- `.copy()` crea explícitamente un nuevo objeto DataFrame, lo que facilita distinguir el resultado filtrado de la tabla original.

Una Series lógica se alinea con el DataFrame mediante las etiquetas del índice. En este ejemplo, `keep` procede de las columnas de `cells` y corresponde a sus filas. Si reutiliza una máscara en otra tabla, compruebe los identificadores. Que ambas tablas tengan el índice predeterminado `0, 1, 2, ...` no demuestra que contengan las mismas células en el mismo orden. Si los índices no se pueden alinear, pandas puede generar un error. Si las etiquetas coinciden por casualidad pero corresponden a observaciones distintas, puede aplicar el filtro a las células equivocadas sin advertirlo.

## `if`, bucles y comprensiones: ¿qué código se ejecuta?

### `if`: ejecutar código si se cumple una condición

```python
if missing_columns:
    raise ValueError(f"Missing required columns: {sorted(missing_columns)}")
```

En una condición, un conjunto con algún elemento se interpreta como verdadero y uno vacío como falso. Por eso aquí solo se genera el error si falta al menos una columna obligatoria.

Esta forma es concisa, pero un principiante debería traducirla a una condición completa:

> Si `missing_columns` contiene algún elemento, detenga el programa e indique qué columnas faltan.

### `for`: procesar varios elementos uno tras otro

```python
for column_name in ["n_genes", "percent_mito"]:
    print(column_name)
```

En cada vuelta, `column_name` hace referencia al siguiente elemento de la lista. Las líneas con sangría forman el cuerpo del bucle.

Si un bucle modifica una lista, tabla o archivo, confirme si esos cambios se acumulan y si cada iteración procesa una célula, muestra o gen.

### `while`: repetir una operación mientras la condición sea verdadera

```python
attempt = 0

while attempt < 3:
    print(attempt)
    attempt = attempt + 1
```

Si la condición siempre sigue siendo verdadera, el bucle puede continuar indefinidamente. Al revisar un `while` generado por IA, identifique qué operación acabará haciendo falsa la condición.

### Aprender a leer una comprensión de lista antes de escribirla

```python
uppercase_genes = [gene.upper() for gene in marker_genes]
```

Puedes expandirlo como:

```python
uppercase_genes = []

for gene in marker_genes:
    uppercase_genes.append(gene.upper())
```

Una comprensión puede simplificar el código, pero también puede comprimir varias condiciones en una línea. En un nivel introductorio, si una línea es difícil de explicar, pídale a IA que la expanda en un bucle ordinario antes de revisarla.

## Distinguir errores, advertencias y registros

| Síntoma | Significado habitual | Qué comprobar primero |
| --- | --- | --- |
| `SyntaxError` | Python no puede analizar la sintaxis del código | Examina la línea indicada y la anterior. Revisa paréntesis, dos puntos y comillas. |
| `IndentationError` o `TabError` | Hay un problema con los niveles de sangría | Revisa los espacios, las tabulaciones y los límites de los bloques |
| `NameError` | El código usa un nombre que aún no se ha definido | Busca la línea o celda del cuaderno que debía definir el nombre |
| `TypeError` | La operación no es compatible con el tipo del objeto | Comprueba el tipo real del objeto y las entradas de la función |
| `KeyError` | No existe la clave del diccionario o el nombre de columna solicitado | Muestra las claves o los nombres de columna y revisa la ortografía y los espacios |
| `FileNotFoundError` | No se ha encontrado el archivo en la ruta indicada | Revisa el directorio de trabajo, la ruta y el nombre del archivo |
| `ModuleNotFoundError` | El intérprete activo no encuentra el módulo | Comprueba qué intérprete de Python y qué entorno del proyecto están activos |

Una excepción no manejada generalmente detiene la ejecución actual. La última línea de un traceback suele dar el tipo de excepción y la explicación inmediata, mientras que el contenido anterior muestra qué archivos, funciones y líneas de código se atravesaron.

No le des al Codex solo la última línea. El traceback completo, el comando de ejecución, la versión de Python, el directorio de trabajo y la estructura de objetos de entrada proporcionan más evidencia para localizar la causa.

Una advertencia normalmente no detiene un programa inmediatamente, pero puede indicar que:

- una interfaz va a cambiar;
- un tipo de datos se convirtió automáticamente;
- un cálculo tiene un problema numérico;
- La operación actual puede producir un resultado ambiguo.

Un registro o salida ordinaria es simplemente información que el programa muestra deliberadamente; no es automáticamente un error. Si es confiable todavía depende de lo que el código registró y si las comprobaciones importantes realmente se ejecutaron.

## Revisar paso a paso código Python generado por IA

### 1. Comprobar dónde se ejecuta el código y en qué entorno

Registre la versión de Python, la ruta del intérprete, el entorno del proyecto, las versiones del paquete, el nombre del script o del cuaderno y el directorio de trabajo actual.

### 2. Identificar todas las entradas externas

Busque operaciones que puedan leer datos, como:

```python
pd.read_csv(...)
pd.read_excel(...)
Path(...).read_text(...)
open(...)
```

Confirme la ruta, el formato de archivo, el delimitador, la codificación, la muestra y la versión de datos de referencia.

### 3. Anotar los nombres importantes y los tipos de sus objetos

Por ejemplo:

```text
metadata_path → Path, ruta del archivo de entrada
cells → DataFrame, metadatos originales de las células
keep → Series, un valor booleano por fila
filtered_cells → DataFrame, resultado del filtrado
average_genes → escalar numérico, a menudo expresado como decimal: número medio de genes detectados en las filas conservadas
```

Si no puede explicar a qué se refiere un nombre, primero inspeccione dónde se crea, su `type()`, forma, nombres de columna y un pequeño número de valores de ejemplo.

### 4. Seguir las modificaciones de objetos y las reasignaciones de nombres

Compruebe:

- si el mismo nombre es reasignado más tarde;
- si un método modifica un objeto en el lugar;
- si dos nombres se refieren al mismo objeto mutable;
- si un cuaderno depende del estado de la celda antigua;
- Si el filtrado crea un nuevo objeto o sobrescribe el original.

### 5. Expresar cada condición con una frase

Traducir:

```python
(cells["n_genes"] >= 500) & (cells["percent_mito"] < 10)
```

como:

> Conserve cada fila solo si `n_genes` es mayor o igual que 500 y `percent_mito` es inferior a 10.

Luego continúe preguntando sobre la base de los umbrales, unidades, política de valores faltantes y distribuciones entre muestras.

### 6. Localizar las operaciones que escriben archivos, usan la red o cambian el entorno

Buscar por: Buscar

```python
to_csv(...)
write_text(...)
unlink(...)
shutil.rmtree(...)
subprocess.run(...)
os.environ[...]
```

Antes de ejecutar, confirme la ruta de destino, el comportamiento de sobreescritura, el contenido del comando, el origen de descarga y el manejo de credenciales.

### 7. Examinar los resultados intermedios más importantes

Como mínimo, inspeccione:

- la forma de la tabla de entrada y los nombres de columna;
- si los identificadores son únicos;
- el número de valores faltantes;
- cuántas filas conserva cada condición por sí sola;
- cuántas filas conservan las condiciones combinadas;
- Cuántas células se conservan para cada muestra biológica;
- Si el índice de salida coincide con los objetos asociados.

Mirar solo la gráfica final o la media final no puede revelar si una muestra entera se perdió durante un paso intermedio.

### 8. Revisar al final la interpretación científica

La ejecución exitosa solo te dice que Python aceptó las instrucciones. No demuestra automáticamente que:

- Los umbrales se ajustan al tejido actual y al protocolo experimental;
- la unidad porcentual se entendió correctamente;
- cada fila representa realmente una célula en lugar de un núcleo o ubicación espacial;
- Hay suficientes réplicas biológicas para apoyar la inferencia;
- El filtrado no excluía sistemáticamente un tipo de célula;
- el genoma de referencia, la anotación y los identificadores de características son correctos;
- La conclusión estadística responde a la pregunta biológica original.

## Pedir a Codex una explicación verificable del código Python

Una petición débil:

```text
Explica este código de Python.
```

Una solicitud que es más fácil de verificar:

```text
Revisa este código de Python como un análisis bioinformático y explica las decisiones que contiene.

1. Indica primero si debe ejecutarse en una terminal, en un script de Python o en un cuaderno.
2. Enumera las entradas externas, las rutas de salida y las operaciones que modifican el entorno.
3. Para cada nombre importante, indica el tipo de objeto, sus dimensiones, su índice y sus nombres de columna.
4. Explica cada condición de filtrado en lenguaje sencillo, incluido el papel de los paréntesis, los valores ausentes y los operadores.
5. Distingue los booleanos ordinarios de Python de las operaciones lógicas elemento a elemento de pandas y NumPy.
6. Identifica qué líneas modifican objetos existentes y cuáles crean otros nuevos.
7. Da el código mínimo para realizar comprobaciones de solo lectura, sin sobrescribir los archivos ni los datos originales.
8. Contrasta los comportamientos importantes con la documentación oficial de las versiones utilizadas de Python, pandas y los paquetes pertinentes.
9. Enumera por último los supuestos biológicos que aún requieren el criterio de quien investiga.
```

La explicación de la IA también requiere verificación. Los tipos de objetos, firmas de funciones, versiones de paquetes, parámetros predeterminados y comportamiento de valores faltantes deben ser comprobados contra el entorno real y la documentación oficial.

## ¿Qué operaciones propuestas por IA requieren una revisión?

| Sintaxis | Posible efecto | Qué preguntar antes de ejecutar |
| --- | --- | --- |
| `data = transformed_data` | Asocia el nombre a otro objeto | ¿Todavía se puede localizar el objeto original? |
| `list_a = list_b` | Ambos nombres pueden referirse a la misma lista mutable | ¿Un cambio posterior será visible desde ambos nombres? |
| `df.drop(..., inplace=True)` | Modifica directamente el DataFrame | ¿Hay que conservar la tabla original? ¿Cómo se comporta la versión de pandas que utilizas? |
| `df.to_csv(path)` | Escribe o sobrescribe un archivo | ¿Son correctos la ruta y el uso de la columna de índice? ¿Se permite sobrescribir un archivo existente? |
| `Path(path).unlink()` | Elimina un archivo | ¿Has comprobado expresamente la ruta? ¿Hay una copia de seguridad? |
| `shutil.rmtree(path)` | Elimina un directorio y todo su contenido | ¿La ruta apunta exclusivamente al directorio previsto? |
| `subprocess.run(..., shell=True)` | Ejecuta un comando a través de un intérprete de comandos | ¿Contiene el comando datos de entrada sin verificar? |
| `pip install ...` | Modifica el entorno de software | ¿Hay que instalar el paquete en el entorno del proyecto y registrar su versión? |
| `requests.get(url)` | Obtiene contenido a través de la red | ¿Cuáles son el origen, la licencia y el tamaño de los datos? ¿Cómo se verifican? |
| `os.environ["TOKEN"]` | Lee una credencial | ¿Podría mostrarse en pantalla o quedar guardada en un registro o archivo? |

No todas estas formas son incorrectas. Requieren una evidencia más sólida antes de la ejecución porque pueden modificar datos, archivos, entornos o sistemas externos.

## Leer el ejemplo inicial de principio a fin

Supongamos que `cell_metadata.csv` contiene exactamente lo siguiente:

```csv
cell_id,sample_id,n_genes,percent_mito
AAAC-1,sample_A,900,4.1
AAAG-1,sample_A,650,8.2
AAAT-1,sample_B,350,3.2
AACG-1,sample_B,1200,12.5
AACT-1,sample_B,,2.1
AAGA-1,sample_B,800,
```

Las dos comas consecutivas de las últimas dos filas delimitan campos realmente vacíos. Déjelos vacíos en el CSV, sin escribir una palabra como «ausente». Con los parámetros de lectura predeterminados de este ejemplo, pandas interpreta ambos campos como valores ausentes.

Los valores `500` y `10` en este ejemplo son umbrales ficticios elegidos para enseñar sintaxis; no son estándares universales de control de calidad unicelular. Los umbrales reales dependen del tejido, el protocolo experimental, la profundidad de secuenciación, el tipo de célula o núcleo, las distribuciones métricas y el objetivo posterior.

### Paso 1: importar los nombres necesarios

```python
from pathlib import Path

import pandas as pd
```

- `Path` representa e inspecciona rutas.
- `pd` es el nombre corto que este código utiliza para los pandas.

### Paso 2: construir la ruta y leer la tabla

```python
metadata_path = Path("cell_metadata.csv")
cells = pd.read_csv(metadata_path)
```

- `metadata_path` se refiere a una ruta relativa.
- `pd.read_csv()` lee el archivo CSV.
- `cells` se refiere al DataFrame resultante.

Antes de ejecutar el código, compruebe `Path.cwd()`, el nombre del archivo, el delimitador y la codificación. Aunque el archivo se lea correctamente, aún hay que verificar los tipos de columna, los marcadores de valores ausentes y las unidades.

### Paso 3: comprobar que estén las columnas necesarias

```python
required_columns = {"cell_id", "sample_id", "n_genes", "percent_mito"}
missing_columns = required_columns - set(cells.columns)
if missing_columns:
    raise ValueError(f"Missing required columns: {sorted(missing_columns)}")
```

- `set(cells.columns)` convierte los nombres de las columnas presentes en la tabla en un conjunto.
- La diferencia de conjuntos identifica qué nombres obligatorios faltan en la tabla.
- Si ese conjunto contiene algún nombre, el programa se detiene e informa de qué columnas faltan.
- `sorted()` ordena los nombres para que el mensaje de error sea fácil de leer y los muestre siempre en el mismo orden.

La confirmación de que existen columnas no valida sus tipos de datos, unidades, identificadores únicos o rangos numéricos.

### Paso 4: construir una condición de filtrado que se aplique a cada fila

```python
keep = (
    cells["n_genes"].notna()
    & cells["percent_mito"].notna()
    & (cells["n_genes"] >= 500)
    & (cells["percent_mito"] < 10)
)
```

Para cada fila, requiera:

1. `n_genes` no está ausente;
2. `percent_mito` no está ausente;
3. `n_genes` es por lo menos 500;
4. `percent_mito` es menos de 10.

En `keep`, una fila solo recibe el valor `True` cuando cumple las cuatro condiciones.

### Paso 5: filtrar y copiar explícitamente el resultado

```python
filtered_cells = cells.loc[keep].copy()
```

`.loc[keep]` selecciona las filas que cumplen la condición y `.copy()` crea un nuevo DataFrame para los pasos siguientes. Con los datos numéricos de este ejemplo, las modificaciones habituales de la tabla filtrada dejan intacta la tabla original. Los límites de la copia son los explicados antes.

Resultado de filtrado esperado:

| cell_id | sample_id | n_genes | percent_mito |
| --- | --- | ---: | ---: |
| AAAC-1 | sample_A | 900 | 4.1 |
| AAAG-1 | sample_A | 650 | 8.2 |

El resultado esperado conserva dos filas, ambas de `sample_A`, y ninguna de `sample_B`. El total y la media pueden parecer razonables aunque haya desaparecido una muestra entera. En ese caso, revise los umbrales, los datos de entrada, las unidades de las métricas y la calidad de esa muestra. En un análisis de varias muestras, valide también los identificadores de muestra o biblioteca al leer los datos y registre cuántas células quedan por muestra después de aplicar cada condición.

### Paso 6: calcular la media y mostrarla explícitamente

```python
average_genes = filtered_cells["n_genes"].mean()
print(average_genes)
```

La media es:

```text
775.0
```

Este valor es la media aritmética de `n_genes` en las dos filas conservadas. Por sí solo no justifica la regla de filtrado ni permite describir diferencias entre muestras biológicas independientes.

En este ejemplo ya se excluyeron las filas en las que faltaba `n_genes`. Por defecto, pandas omite los valores ausentes al calcular la media. Si el filtro deja la tabla vacía, el resultado puede aparecer como `NaN` sin que se genere ningún error. Compruebe primero cuántas filas quedan o consulte `filtered_cells.empty` antes de interpretar la media.

### Este código aún no filtra de forma coordinada los componentes de un objeto real de datos unicelulares

El resultado aquí es solo una tabla de metadatos filtrada. No filtra automáticamente:

- la matriz de expresión génica;
- Otras capas, incrustaciones y estructuras de gráficos en AnnData;
- otras modalidades en un objeto multi-ómico unicelular;
- coordenadas, imágenes y características de ubicación en ómicas espaciales;
- Otros resultados asociados por célula o ubicación.

Si los datos ya están organizados en AnnData, normalmente conviene filtrar el objeto completo por su eje de observaciones. Filtrar solo una copia exportada de `.obs` dejaría el resto sin actualizar. Al seleccionar las observaciones en el propio objeto, se seleccionan a la vez las partes correspondientes de `X`, `layers`, `obsm` y `obsp`. La selección suele devolver una vista. Si va a modificarla, decida si necesita `.copy()` según cómo se comporte ese objeto.

Hay que respetar los límites de cada objeto. En datos multimodales o espaciales, parte de la información puede ser común a varias células o ubicaciones. Una misma máscara booleana no se puede aplicar mecánicamente a imágenes compartidas, sistemas de coordenadas y transformaciones. Las lecciones correspondientes explican las operaciones propias de cada objeto.

En un proyecto real, use identificadores de observación verificados y únicos en todo el proyecto para seleccionar las entradas correspondientes en los distintos objetos. Un código de barras celular puede repetirse en muestras o bibliotecas diferentes. Por eso suele ser necesario combinarlo con el identificador de la muestra o biblioteca. Compruebe después la correspondencia uno a uno, el conjunto de identificadores, su número y su orden. El puesto que ocupa una fila no basta para saber si se trata de la misma célula.

## ¿Qué debes saber hacer al leer código?

Cuando se encuentra con código Python, no necesita reescribirlo desde la memoria, pero al menos debe ser capaz de:

- distinguir los comandos de terminal, entrada interactiva, scripts y celdas del cuaderno;
- reconocer sangría, nombres, asignación, funciones, métodos, atributos, comentarios y cadenas;
- distinguir números comunes, cadenas, valores booleanos, `None` y contenedores;
- Saber que la asignación no necesariamente copia un objeto mutable;
- comprender la diferencia básica entre la indexación basada en cero, los cortes semiabiertos, `.loc` y `.iloc`;
- distinguir `=`, `==`, `is None`, `and` y pandas `&`;
- Saber que `None`, `NaN`, `pd.NA` y cadenas vacías necesitan un manejo explícito;
- rastrear entradas, cambios en nombres, condiciones de filtrado y salidas;
- Encontrar operaciones que pueden sobrescribir archivos, cambiar un entorno, ejecutar un shell o leer credenciales.
- Comprobar las explicaciones de IA contra estructuras de objetos reales, versiones de software y documentación oficial;
- Explicar qué pasos de validación aún faltan entre la ejecución exitosa y una conclusión biológica respaldada.

Ahora que la IA puede generar código rápidamente, memorizar la sintaxis puede volverse menos importante, pero entender el código se vuelve más importante. Cuanto más rápido se genere el código, más importante es que alguien confirme que el código maneja los objetos correctos, aplica las condiciones correctas y no confunde el éxito computacional con el apoyo científico.

## Referencias

1. [Tutorial oficial de Python: una introducción informal a Python, comentarios, asignación, cadenas, listas y rebanadas](https://docs.python.org/3/tutorial/introduction.html)
2. [Tutorial oficial de Python: `if`, `for` y funciones](https://docs.python.org/3/tutorial/controlflow.html)
3. [Tutorial oficial de Python: listas, tuplas, conjuntos y diccionarios](https://docs.python.org/3/tutorial/datastructures.html)
4. [Tutorial oficial de Python: módulos y paquetes](https://docs.python.org/3/tutorial/modules.html)
5. [Tutorial oficial de Python: errores y excepciones](https://docs.python.org/3/tutorial/errors.html)
6. [Referencia del lenguaje Python: reglas de indentación](https://docs.python.org/3/reference/lexical_analysis.html#indentation)
7. [Biblioteca estándar de Python: `pathlib`](https://docs.python.org/3/library/pathlib.html)
8. [Guía oficial de pandas: indexación y filtrado lógico](https://pandas.pydata.org/docs/user_guide/indexing.html#boolean-indexing)
9. [Documentación oficial de pandas: `DataFrame.loc`](https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.loc.html)
10. [Documentación oficial de pandas: detectar valores faltantes](https://pandas.pydata.org/docs/reference/api/pandas.notna.html)
11. [Documentación oficial de pandas: `DataFrame.copy`](https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.copy.html)
12. [Biblioteca estándar de Python: copia superficial y profunda](https://docs.python.org/3/library/copy.html)
13. [Documentación oficial de pandas: `Series.mean`](https://pandas.pydata.org/docs/reference/api/pandas.Series.mean.html)
14. [Guía oficial de pandas: Copy-on-Write](https://pandas.pydata.org/docs/user_guide/copy_on_write.html)
15. [Documentación oficial de AnnData: `AnnData`](https://anndata.readthedocs.io/en/stable/generated/anndata.AnnData.html)
