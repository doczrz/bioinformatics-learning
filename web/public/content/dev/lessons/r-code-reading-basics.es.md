# 0.3 | Leer y entender código en R: sintaxis básica

Imagina que le das a Codex una tabla de indicadores de calidad por célula y le pides que seleccione las células que podrían conservarse. Te devuelve este código R:

```r
cells <- read.csv("cell_metadata.csv")

keep <- !is.na(cells$n_genes) &
  !is.na(cells$percent_mito) &
  cells$n_genes >= 500 &
  cells$percent_mito < 10

filtered_cells <- cells[keep, ]
average_genes <- mean(filtered_cells$n_genes, na.rm = TRUE)
```

Incluso si no planea escribir este código usted mismo desde una página en blanco, aún debe ser capaz de responder:

- ¿Qué archivo lee el código?
- ¿Qué contienen `cells`, `keep` y `filtered_cells`?
- ¿Qué células se conservarán?
- ¿Cómo se manejan los valores faltantes?
- ¿Qué calcula la última línea?
- ¿De dónde provienen `500` y `10`, y son adecuados para sus datos?

Si no puede responder a estas preguntas, no puede saber si el código está procesando los datos correctos o eliminando silenciosamente las células que deberían haberse conservado.

El objetivo de esta lección no es hacerte memorizar la sintaxis de R, y ciertamente no hacerte reproducir programas desde la memoria sin documentación. Lo que necesitas desarrollar es la capacidad de leer código: cuando veas una pieza de código R, deberías ser capaz de identificar dónde entran los datos, cómo cambian, a dónde van los resultados y qué decisiones analíticas siguen siendo responsabilidad del investigador.

Esta lección asume que ya sabes que R es un entorno para computación estadística y análisis de datos, y que los paquetes y entornos de proyecto afectan si el código se puede ejecutar. No necesita instalar ningún software por adelantado, y no se requiere experiencia en programación.

Los bloques de código en esta lección son principalmente para leer; no necesita ejecutarlos ahora. Si desea seguir adelante, ejecute el código R en la consola de R o un script de R. Un nombre de archivo sin una ruta completa, como `"cell_metadata.csv"`, se busca en relación con el directorio de trabajo actual. Puede ejecutar `getwd()` primero para ver dónde está ese directorio.

En su primera lectura, puede dividir el material en dos niveles:

- **Debes comprender:** los objetos, la asignación, las funciones, los data frames, la indexación, las condiciones lógicas, `NA` y el filtrado.
- **Por ahora basta con reconocer:** el reciclaje de vectores, las matrices dispersas, `[[]]`, los operadores de encadenamiento, los espacios de nombres, los bucles y las funciones propias. Si te encuentras con estas estructuras, pide una explicación a la IA o consulta la documentación oficial.

## El «vibe coding» también exige saber leer código

"Vibe coding" es un término informal. Por lo general, se refiere a describir una tarea en lenguaje natural y permitir que la IA genere, modifique y ejecute el código, sin que el usuario tenga que escribir cada instrucción carácter por carácter.

Esta forma de trabajar realmente reduce la carga de memorizar la sintaxis. Puedes pedirle a Codex que:

- generar código R para una tarea;
- Explicar un error;
- Organizar pasos repetidos en un guion;
- encontrar dónde se creó o modificó un objeto;
- Comprobar los argumentos de la función contra la documentación;
- Ejecutar código y mostrar resultados intermedios.

Como resultado, la capacidad de escribir todo desde cero ya no es la única medida de la capacidad analítica.

Sin embargo, una solicitud en lenguaje natural aún debe convertirse en operaciones computacionales precisas. Una computadora no puede entender una intención vaga como "eliminar células de baja calidad". Solo puede ejecutar una condición explícita como "eliminar filas donde `n_genes < 500`". Si IA malinterpreta un nombre de columna, unidad de datos, valor faltante o dirección de comparación, el código puede ejecutarse sin errores.

Por lo tanto, este curso pide a los principiantes que cumplan con el siguiente estándar:

> No tienes que escribir código de memoria, pero debes ser capaz de traducir el código clave al lenguaje común y comprobar si esa traducción coincide con la pregunta de investigación.

Esto no significa que debas entender todos los mecanismos internos de R. Al igual que leer un artículo en inglés no requiere convertirse primero en lingüista, leer código de análisis puede comenzar con las estructuras más comunes, mientras consulta la documentación cuando sea necesario.

## Los elementos de una línea de código R

Considere esta línea:

```r
average_genes <- mean(cells$n_genes, na.rm = TRUE)
```

Puedes leerlo de derecha a izquierda:

1. `cells$n_genes` extrae la columna `n_genes` de la tabla `cells`.
2. `mean(...)` llama a la función que calcula la media.
3. `na.rm = TRUE` indica que se deben omitir los valores ausentes al calcular la media.
4. `<-` asigna el resultado de la derecha al nombre de la izquierda.
5. `average_genes` es el nombre con el que se guarda el resultado.

En lenguaje común:

> Tome la columna de la tabla de células que contiene el número de genes detectados, calcule la media omitiendo los valores ausentes y guarde el resultado con el nombre `average_genes`.

Este tipo de traducción está en el corazón de la lectura del código. Puede buscar el nombre de una función y preguntarle a Codex sobre un argumento, pero debe poder explicar la entrada, acción, condiciones y resultado.

## Objetos: cómo R asocia nombres a datos y resultados

En R, los datos y los resultados con los que se trabaja se llaman objetos. Un número, un texto, una tabla, una matriz, una función e incluso una estructura compleja que reúne datos de células individuales pueden ser objetos.

```r
gene_name <- "MS4A1"
cell_count <- 1200
analysis_ready <- TRUE
```

Este código crea tres objetos:

| Objeto | Valor almacenado | Significado habitual |
| --- | --- | --- |
| `gene_name` | `"MS4A1"` | Texto |
| `cell_count` | `1200` | Número |
| `analysis_ready` | `TRUE` | Valor lógico |

R distingue entre mayúsculas y minúsculas. Por eso `cell_count`, `Cell_Count` y `CELL_COUNT` son tres nombres distintos.

Un nombre de objeto debe ayudar al lector a entender su contenido. `cell_metadata` suele ser más fácil de revisar que `x`, y `filtered_cells` suele ser más sencillo de seguir que `result2`. Los nombres cortos pueden ser razonables en una fórmula o un cálculo temporal muy corto, pero aumentan el riesgo de interpretar mal un flujo de trabajo de análisis largo.

## Asignación con `<-`: dar nombre a un resultado

```r
cell_count <- 1200
```

Lea el operador de asignación `<-` como «guarde el valor de la derecha con el nombre de la izquierda». Se escribe con los caracteres `<` y `-`, sin espacio entre ellos.

R también permite `=` para la asignación en muchos lugares, pero una convención común es:

- usar `<-` para crear o actualizar un objeto;
- Usa `=` para especificar un argumento dentro de una llamada a función.

```r
average_genes <- mean(cells$n_genes, na.rm = TRUE)
```

Esta convención hace que sea más fácil distinguir "guardar el resultado" de "establecer un argumento de función".

La asignación puede sobrescribir un objeto existente, usualmente sin preguntar de nuevo:

```r
threshold <- 500
threshold <- 1000
```

Después de la segunda línea, `threshold` contiene `1000`. Al revisar código generado por IA, siga cada nombre a lo largo del script para comprobar si aparece otra asignación que cambie su valor.

## Comentarios, comillas y paréntesis

### Todo lo que sigue a `#` es un comentario

```r
# Esta línea es un comentario. R no la ejecuta.
threshold <- 500  # Umbral provisional para este ejemplo, que debe adaptarse a los datos
```

Todo desde `#` hasta el final de esa línea es un comentario. Un buen comentario explica por qué se está haciendo algo o de dónde vino una decisión, en lugar de simplemente leer el código en voz alta.

Los comentarios pueden quedar obsoletos. Cuando el código cambia, un comentario antiguo no se actualiza automáticamente. Por lo tanto, es necesario inspeccionar la expresión que se ejecuta realmente en lugar de confiar solo en el comentario.

### Las comillas delimitan el texto

```r
cell_type <- "CD4 T cell"
```

`"CD4 T cell"` es una cadena de caracteres, es decir, un valor de texto. Al escribir `cell_type` sin comillas, normalmente se hace referencia al objeto que lleva ese nombre.

```r
cell_type == "CD4 T cell"
```

Esta línea compara el objeto `cell_type` con el texto especificado para ver si son iguales.

### Los paréntesis indican una llamada a una función o el orden de los cálculos

```r
mean(c(10, 20, 30))
```

La función exterior, `mean(...)`, calcula la media. Antes se evalúa la llamada interior, `c(...)`, que reúne los tres números en un vector.

Los paréntesis también pueden hacer explícito el orden de las operaciones:

```r
1 + 2 * 3
(1 + 2) * 3
```

Estas dos líneas producen resultados diferentes. Cuando usted ve una condición compleja, no adivine su precedencia por vista. Pedirle a la IA que añada paréntesis a menudo hace que el código sea más fácil de revisar.

## Funciones: procesar entradas y devolver un resultado

Una función puede entenderse como una operación a la que se le ha dado un nombre.

```r
mean(c(10, 20, 30))
```

Esta línea contiene:

- El nombre de la función: `mean`;
- La entrada pasada a la función: `c(10, 20, 30)`;
- El valor devuelto: `20`.

Muchas funciones tienen argumentos opcionales:

```r
mean(c(10, NA, 30), na.rm = TRUE)
```

Con `na.rm = TRUE` se omiten los valores ausentes al calcular la media. En este ejemplo se obtiene `20`. Si se omite ese argumento, el resultado normalmente será `NA`.

Aquí, `na.rm` es el nombre del argumento y `TRUE` es el valor que recibe en esta llamada a la función.

Los argumentos con nombre son más fáciles de leer que los valores suministrados solo por posición:

```r
read.csv(file = "cell_metadata.csv", check.names = FALSE)
```

No tienes que adivinar lo que significa el segundo valor. Al leer una función desconocida, puedes ver su ayuda en R:

```r
?mean
args(mean)
```

`?mean` abre la documentación de la función, mientras que `args(mean)` muestra la forma habitual de argumento. Para una función de paquete, consulte también la documentación oficial de la versión actualmente instalada, ya que los argumentos y el comportamiento predeterminado pueden cambiar entre versiones.

## Vectores: una secuencia de valores del mismo tipo

Un vector es una de las estructuras de datos más básicas de R. Por ahora, puedes pensar en ello como una secuencia ordenada de valores.

```r
n_genes <- c(820, 410, 1250, 670)
cell_types <- c("T cell", "B cell", "T cell", "Monocyte")
passed_qc <- c(TRUE, FALSE, TRUE, TRUE)
```

La letra `c` de `c()` viene de «combine» o «concatenate». La función reúne varios valores en un vector.

En un vector atómico, todos los elementos tienen el mismo tipo básico. Observe qué ocurre cuando el siguiente código combina números y texto en un vector.

```r
mixed <- c(1, "2", 3)
```

Para que todos los elementos tengan el mismo tipo, R convierte también los números en texto. Por eso ya no se puede calcular directamente la media de `mixed`. Si al usar código generado por IA se cuela texto en una columna numérica, compruebe el tipo antes de continuar con los cálculos.

### Las operaciones vectoriales suelen aplicarse elemento a elemento

```r
n_genes >= 500
```

Si `n_genes` contiene cuatro valores, la comparación devuelve cuatro valores lógicos, uno por cada posición.

```text
TRUE FALSE TRUE TRUE
```

La comparación evalúa cada posición por separado. Así puede saber qué valores son mayores o iguales que 500, sin reducir toda la columna a una única respuesta.

Al operar con dos vectores de distinta longitud, R a veces repite los valores del más corto. Este comportamiento, llamado reciclaje, puede ser intencionado o introducir un error difícil de detectar. Compruebe `length()` o las dimensiones de los objetos antes de combinarlos. R no deduce qué elementos pertenecen al mismo grupo biológico.

## Data frames: organizar distintos tipos de datos en filas y columnas

Un data frame es una tabla de R. Sus columnas pueden tener tipos distintos, como números o texto, pero deben tener el mismo número de filas.

El siguiente código crea una tabla de células completamente ficticia:

```r
cells <- data.frame(
  cell_id = c("cell_1", "cell_2", "cell_3", "cell_4"),
  sample = c("control", "control", "disease", "disease"),
  n_genes = c(820, 410, 1250, NA),
  percent_mito = c(4.2, 12.8, 6.1, 3.5)
)
```

Puedes leerlo como:

| cell_id | sample | n_genes | percent_mito |
| --- | --- | ---: | ---: |
| cell_1 | control | 820 | 4.2 |
| cell_2 | control | 410 | 12.8 |
| cell_3 | disease | 1250 | 6.1 |
| cell_4 | disease | valor ausente | 3.5 |

Estos números sirven para explicar la sintaxis. Para elegir umbrales de control de calidad en un experimento real, tenga en cuenta el tejido, el protocolo, la profundidad de secuenciación, el tipo de célula o núcleo, la forma de la distribución y la finalidad del análisis.

Las comprobaciones comunes al leer un marco de datos desconocido incluyen:

```r
dim(cells)
names(cells)
head(cells)
str(cells)
```

Le ayudan a confirmar, respectivamente:

- Cuántas filas y columnas hay;
- cuáles son los nombres de las columnas;
- cómo se ven las primeras filas;
- El tipo de cada columna y la estructura de todo el objeto.

Estas comprobaciones no demuestran que los datos sean biológicamente correctos, pero pueden revelar una tabla vacía, un nombre de columna mal escrito, números importados como texto o filas y columnas orientadas de forma diferente a lo esperado.

## Reconocer matrices, listas y objetos especializados

Además de los vectores y marcos de datos, el código bioinformático a menudo utiliza:

| Estructura | ¿Cómo se reconoce? | Uso habitual |
| --- | --- | --- |
| Matriz | Filas y columnas cuyos elementos suelen tener el mismo tipo básico | Matrices de expresión génica y coordenadas tras reducir la dimensionalidad |
| Lista | Una colección que puede contener objetos de distintos tipos | Guardar varios resultados, parámetros u objetos anidados |
| Objeto especializado | Un objeto cuya estructura y cuyos métodos define un paquete | Objetos de análisis como Seurat y SingleCellExperiment |

Una misma expresión, como `object[1]`, puede devolver resultados de distinto tipo según el objeto. Antes de interpretar el código, compruebe el tipo con `class(object)` y examine la estructura con `str(object)`. El nombre por sí solo no proporciona esa información.

Los objetos grandes con datos de células individuales pueden utilizar una matriz dispersa. Esta almacena principalmente los valores distintos de cero y ahorra espacio cuando predominan los ceros. Convertirla en una matriz densa solo para verla como una tabla convencional puede multiplicar el consumo de memoria. Téngalo en cuenta antes de pedirle esa conversión a la IA.

## Indexación: seleccionar partes de un objeto con `[]`, `[[]]` y `$`

La indexación significa seleccionar parte de un objeto.

### En R las posiciones suelen numerarse desde 1

```r
genes <- c("MS4A1", "CD3D", "LYZ")
genes[1]
```

El resultado es:

```text
"MS4A1"
```

En R, la primera posición suele escribirse como `1`, no `0` como en muchos otros lenguajes de programación.

### En un data frame se indica primero la fila y después la columna

```r
cells[1, 3]
```

Esto significa fila 1, columna 3.

```r
cells[1, ]
```

Se selecciona la primera fila con todas sus columnas. Al dejar vacía la posición después de la coma, se conserva todo en esa dimensión.

```r
cells[, "n_genes"]
```

Esto significa todas las filas de la columna llamada `n_genes`.

### Con `$` se selecciona por nombre una columna del data frame

```r
cells$n_genes
```

El resultado es la columna `n_genes`. A la izquierda de `$` se escribe el objeto y a la derecha, el nombre de la columna que se quiere extraer.

### `[]` y `[[]]` pueden devolver estructuras diferentes

Para listas y algunas operaciones de marco de datos:

- `x[i]` suele devolver un subconjunto que conserva el tipo de contenedor.
- `x[[i]]` suele extraer el elemento en sí.
- `x$name` extrae un elemento o una columna por su nombre.

Basta por ahora con reconocer que los corchetes simples y dobles cumplen funciones distintas. Si la IA cambia la forma de los corchetes, use `class()`, `length()` o `dim()` para comprobar si el resultado sigue teniendo el tipo o las dimensiones que necesita el paso siguiente.

## Comparaciones y condiciones lógicas en los filtros

Los operadores de comparación comunes incluyen:

| Expresión | Significado |
| --- | --- |
| `x == y` | ¿Es x igual a y? |
| `x != y` | ¿Es x distinto de y? |
| `x > y` | ¿Es x mayor que y? |
| `x >= y` | ¿Es x mayor o igual que y? |
| `x < y` | ¿Es x menor que y? |
| `x <= y` | ¿Es x menor o igual que y? |

El operador `==` compara dos valores para ver si son iguales. El operador `<-` asigna un valor a un nombre.

Las condiciones lógicas se pueden combinar:

| Expresión | Significado |
| --- | --- |
| `!x` | La negación de x |
| `x & y` | Para cada elemento, tanto x como y deben ser verdaderos |
| `x \| y` | Para cada elemento, al menos una de las dos condiciones debe ser verdadera |

Por ejemplo:

```r
cells$n_genes >= 500 & cells$percent_mito < 10
```

Esto se puede traducir como:

> Para cada célula, compruebe que se hayan detectado al menos 500 genes y que el porcentaje mitocondrial sea inferior al 10 %.

Cambiar la dirección de un símbolo puede cambiar las células que se conservan. Al revisar el código de filtrado, lea cada condición como una oración completa y compárela con el plan de análisis.

En una condición `if` también puede encontrar `&&` y `||`. Sirven para tomar una única decisión sobre la ejecución del programa. En cambio, `&` y `|` se usan a menudo para combinar vectores lógicos elemento a elemento. Antes de aceptar que la IA sustituya unos operadores por otros, compruebe con cuántos valores se está trabajando y cuántos debe devolver la expresión.

## Valores ausentes: distinguir `NA`, el cero y el texto `"NA"`

`NA` indica que en esa posición falta un valor utilizable. Es distinto de un cero.

- 0 puede significar que el resultado medido fue cero;
- `NA` significa que no hay ningún valor utilizable en esa posición.

`NA` también se distingue de la cadena `"NA"`. Entre comillas, esas dos letras son texto.

Utilice el siguiente código para comprobar si faltan valores:

```r
is.na(cells$n_genes)
```

No utilice:

```r
cells$n_genes == NA
```

Al comparar un valor ausente con otro valor, normalmente se obtiene `NA`. R carece de la información necesaria para decidir si la comparación es verdadera o falsa.

Esto afecta directamente al filtrado:

```r
keep <- cells$n_genes >= 500 &
  cells$percent_mito < 10
```

Si falta `n_genes` o `percent_mito`, la posición correspondiente de `keep` también puede contener `NA`. El siguiente código indica explícitamente qué hacer cuando falta alguno de los dos valores.

```r
keep <- !is.na(cells$n_genes) &
  !is.na(cells$percent_mito) &
  cells$n_genes >= 500 &
  cells$percent_mito < 10
```

El código exige que se conozcan tanto `n_genes` como `percent_mito`. De este modo, cada posición de `keep` contiene `TRUE` o `FALSE`.

Esta regla determina qué hará el programa. Antes de aplicarla a datos reales, averigüe por qué faltan valores. Puede haber fallado la importación, una columna puede tener un tipo incorrecto, una herramienta anterior puede haber omitido una métrica o quizá la medición sea realmente imposible. La causa ayuda a decidir si procede excluir la fila.

## Filtrar filas con un vector lógico

Continúe con el marco de datos `cells` ficticio:

```r
keep <- !is.na(cells$n_genes) &
  !is.na(cells$percent_mito) &
  cells$n_genes >= 500 &
  cells$percent_mito < 10

filtered_cells <- cells[keep, ]
```

El primer bloque crea un vector lógico con una posición por cada fila de la tabla. El segundo utiliza ese vector para conservar las filas cuya posición contiene `TRUE`.

El resultado esperado es:

| cell_id | sample | n_genes | percent_mito |
| --- | --- | ---: | ---: |
| cell_1 | control | 820 | 4.2 |
| cell_3 | disease | 1250 | 6.1 |

El resultado solo contiene las filas seleccionadas de los metadatos y sus identificadores de célula. La matriz de expresión, los datos de otras modalidades ómicas, las proyecciones de dimensión reducida y las coordenadas espaciales siguen sin filtrar. En un proyecto real, use identificadores estables y verificados para filtrar cada objeto relacionado. Compruebe después que los identificadores, su número y su orden coincidan. Las lecciones de análisis explican cómo hacerlo con cada paquete.

Puede revisar este código en el siguiente orden:

1. ¿La longitud de `keep` es igual a `nrow(cells)`?
2. ¿`keep` todavía contiene valores de `NA`?
3. ¿Cuántas filas hay antes y después del filtrado?
4. ¿Qué filas se eliminaron?
5. ¿Los umbrales provienen de reglas predefinidas o de la inspección de las distribuciones de datos?

El código de verificación útil incluye:

```r
length(keep)
table(keep, useNA = "ifany")
nrow(cells)
nrow(filtered_cells)
```

Un número esperado de filas de salida solo muestra que el filtro se ejecutó de acuerdo con el código. No demuestra que los umbrales sean biológicamente apropiados.

## El operador `|>`: pasar el resultado al siguiente paso

Los tubos a menudo aparecen en el código R:

```r
cells |>
  head(2)
```

El operador `|>` de R base pasa el resultado de la izquierda a la función de la derecha. Por eso el código anterior suele poder leerse así.

```r
head(cells, 2)
```

El encadenamiento permite escribir los pasos de procesamiento en el orden en que se leen:

```r
cells |>
  subset(!is.na(n_genes)) |>
  subset(n_genes >= 500)
```

Léelo de arriba a abajo:

1. Comience con `cells`;
2. Retener filas donde `n_genes` no falta;
3. A continuación, conservar las filas donde `n_genes` es al menos 500.

El encadenamiento no guarda automáticamente todos los resultados intermedios ni garantiza que cada paso sea correcto. Si cuesta seguir la cadena, pide a Codex que dé nombres a los objetos intermedios y muestre el número de filas y columnas después de los pasos importantes.

R incluye `|>` desde la versión 4.1.0. Si un entorno antiguo no reconoce este operador, compruebe primero la versión de R. También puede encontrar `%>%`, que proporciona el paquete `magrittr`. Ambos permiten encadenar pasos de forma parecida, aunque difieren en algunos detalles.

## ¿De qué paquete procede una función?

Las dos formas siguientes son comunes:

```r
library(dplyr)
filtered_cells <- filter(cells, n_genes >= 500)
```

```r
filtered_cells <- dplyr::filter(cells, n_genes >= 500)
```

`library(dplyr)` carga y adjunta el paquete, permitiendo que sus funciones exportadas sean llamadas directamente por nombre.

La expresión `dplyr::filter` indica exactamente qué función se usa, en este caso `filter` del paquete `dplyr`. Así se puede identificar su procedencia incluso cuando varios paquetes tienen funciones con el mismo nombre.

En R base, al seleccionar filas con `cells[keep, ]`, un `NA` en el vector lógico puede generar una fila de valores ausentes en el resultado. En cambio, `dplyr::filter()` solo conserva las filas cuya condición vale `TRUE`. Decida de antemano qué métricas pueden faltar y cómo se tratarán esas filas. El resultado no debería depender por accidente de la función elegida.

Cuando vea una función desconocida, primero pregunte:

- ¿Pertenece a la base R o a un paquete?
- ¿Está ese paquete instalado en el entorno actual?
- ¿Qué versión del paquete se está utilizando?
- ¿La función modifica su objeto de entrada, escribe un archivo o solo devuelve un nuevo objeto?
- ¿Son sus argumentos predeterminados adecuados para los datos actuales?

No adivine el comportamiento de un nombre de función solo. Por ejemplo, `filter` puede no describir la misma operación en diferentes paquetes o contextos.

## Reconocer `if`, los bucles y las funciones propias

Un script generado por IA puede contener flujo de control. Usted no necesita escribirlo usted mismo todavía, pero usted debe reconocerlo.

### `if`: ejecutar código si se cumple una condición

```r
if (nrow(filtered_cells) == 0) {
  warning("No cells remain after filtering")
}
```

En lenguaje común:

> Si el marco de datos filtrado tiene 0 filas, produce una advertencia.

Los corchetes `{}` encierran el código que se ejecuta cuando se cumple la condición.

### `for`: repetir una operación para varios elementos

```r
marker_genes <- c("MS4A1", "CD3D", "LYZ")

for (gene in marker_genes) {
  print(gene)
}
```

En cada vuelta del bucle se asigna el siguiente nombre de gen a `gene` y se muestra ese nombre. En un análisis real, compruebe dónde se guarda cada resultado, si un archivo puede sobrescribir el de otra vuelta y qué sucede con el bucle si falla una iteración.

### `function`: definir una operación reutilizable

```r
calculate_average <- function(values) {
  mean(values, na.rm = TRUE)
}
```

Este código define una función llamada `calculate_average`. Recibe `values` y devuelve su media después de ignorar los valores faltantes.

Al leer una función personalizada, identifique al menos:

- sus argumentos de entrada;
- lo que la función hace con la entrada;
- sus argumentos por defecto;
- su valor de retorno;
- Si lee o escribe objetos y archivos fuera de la función.

## Distinguir errores, advertencias y mensajes

R puede producir diferentes tipos de retroalimentación a medida que se ejecuta:

| Tipo | Significado habitual | Qué comprobar primero |
| --- | --- | --- |
| Error | R no puede terminar de evaluar la expresión | Lee el primer error. ¿Existe el objeto? ¿Son correctos la función y sus argumentos? |
| Advertencia | R suele seguir ejecutando el código, aunque ha detectado un posible problema | ¿Qué paso generó la advertencia? ¿Sigue siendo utilizable el resultado? |
| Mensaje | El programa informa de su estado o explica una operación | ¿Se menciona una versión, un cambio de método o un comportamiento predeterminado importante? |

"Sin error" no significa "sin advertencia", y ninguno de los dos significa que el análisis es correcto. La IA a veces utiliza funciones que ocultan mensajes o advertencias para hacer que la salida se vea más limpia. Durante la revisión, confirme que no ha ocultado evidencia importante al mismo tiempo.

Si aparece el indicador `+` en la consola de R, probablemente la expresión anterior esté incompleta. Busque un paréntesis, una comilla o una llave de cierre. En este contexto, `+` indica que R espera el resto de la expresión.

## Revisar paso a paso código R generado por IA

Cuando se enfrenta a docenas de líneas de código, no necesita luchar a través de cada símbolo primero. Comience por reconstruir el flujo de datos.

### 1. Comprobar dónde se ejecuta el código y en qué entorno

Registre la versión de R, el entorno del proyecto y las versiones del paquete. La sintaxis de `|>`, los argumentos de la función o las estructuras de objeto pueden depender de las versiones.

### 2. Identificar todas las entradas externas

Busque código que lea archivos, bases de datos o recursos de red, como:

```r
read.csv("cell_metadata.csv")
readRDS("seurat_object.rds")
```

Confirme la ruta, el formato de archivo, la identidad de muestra y la versión de referencia.

### 3. Enumerar los objetos importantes

Enumera los nombres en el lado izquierdo de los operadores de asignación:

```text
cells
keep
filtered_cells
average_genes
```

Luego escribe una descripción de una oración en lenguaje sencillo de cada objeto.

### 4. Seguir los cambios de cada objeto

Compruebe dónde se crea, filtra, combina, cambia el nombre o sobrescribe un objeto. No confíe en que un objeto se filtró como se pretendía solo porque su nombre contiene `filtered`.

### 5. Expresar cada filtro y cada comparación con una frase

Compruebe especialmente:

- la dirección de `>` y `<`;
- `&` comparado con `|`;
- si se incluye la igualdad;
- cómo se manejan los valores faltantes;
- si una condición se aplica a células, muestras, genes u otra unidad;
- De dónde vienen los umbrales y las etiquetas de grupo.

### 6. Localizar las operaciones que escriben archivos o cambian el estado del sistema

Confirme la ruta de salida, el nombre de archivo y si se puede sobrescribir un resultado existente. La instalación de paquetes, la eliminación de archivos y la llamada a comandos del sistema también cambian el estado.

### 7. Comprobar los resultados intermedios más importantes

Después de pasos importantes, solicite salidas como:

```r
class(object)
dim(object)
head(object)
summary(object)
```

Elija funciones de comprobación que se adapten al tipo de objeto. Imprimir un objeto unicelular grande puede ser lento y difícil de leer; en su lugar, inspeccione su resumen, dimensiones y metadatos clave.

### 8. Revisar al final la interpretación científica

La sintaxis solo le dice cómo se ejecuta un cálculo. También debe preguntar:

- ¿Cada fila representa una célula, un núcleo, una ubicación espacial o una muestra biológica?
- ¿Las etiquetas de grupo coinciden con la tabla de ejemplo?
- ¿Cuáles son las réplicas biológicas independientes?
- ¿Podrían las reglas de filtrado eliminar sistemáticamente un tipo de célula en particular?
- ¿Los identificadores de genes, el genoma de referencia y la versión de anotación coinciden?
- ¿Qué conclusiones puede apoyar el cálculo y cuáles no?

## Pedir a Codex una explicación del código que puedas verificar

Puedes darle a Codex el código junto con la siguiente solicitud:

```text
Por ahora, no modifiques ni ejecutes este código de R.

1. Explica cada sección en el orden en que se ejecuta.
2. Enumera todos los archivos de entrada y salida, y los objetos que se crean.
3. Indica para cada objeto su tipo, sus dimensiones esperadas y su significado biológico.
4. Describe cada condición de filtrado con palabras sencillas.
5. Señala dónde se tratan valores ausentes, se sobrescriben objetos, se escriben o eliminan
   archivos, se instalan paquetes o se ejecutan comandos del sistema.
6. Señala todo lo que dependa de la versión de un paquete o del valor predeterminado de un argumento.
7. Distingue entre la validez sintáctica del código y la validación científica del análisis.
8. Propón el código mínimo para hacer comprobaciones de solo lectura, sin cambiar los datos ni el entorno.
```

La explicación de IA también necesita ser comprobada. Los controles más directos incluyen:

- consultar la documentación oficial de funciones de la versión en uso;
- inspeccionar el objeto real con `class()`, `dim()`, `names()` y `str()`;
- Ejecutando un paso en un ejemplo muy pequeño;
- comparar los recuentos de filas y los objetos eliminados antes y después del filtrado;
- conservando el script original y su registro de ejecución.

## ¿Qué patrones del código generado por IA requieren revisión?

El siguiente código no es necesariamente incorrecto, pero no debe ejecutarse sin entenderlo:

| Expresión | Posible efecto | Qué preguntar antes de ejecutar |
| --- | --- | --- |
| `rm(list = ls())` | Elimina objetos del espacio de trabajo actual de R | ¿Quedan objetos o datos que permitan verificar el análisis sin guardar? |
| `setwd("an/absolute/path")` | Cambia el directorio de referencia para las rutas relativas posteriores | ¿Procede esta ruta del equipo del autor? |
| `install.packages(...)` | Modifica el entorno activo de paquetes de R | ¿Conviene instalar el paquete en el entorno del proyecto y registrar su versión? |
| `na.omit(data)` | Elimina las filas que contienen valores ausentes | ¿Cuántas filas se eliminarán y por qué faltan esos valores? |
| `write.csv(..., "original_input_file.csv")` | Puede sobrescribir un archivo de entrada | ¿Se escribirá el resultado en una ruta distinta para conservar los datos originales? |
| `unlink(...)` | Elimina un archivo o directorio | ¿Cuál es la ruta exacta y se puede recuperar su contenido? |
| `system(...)` | Ejecuta un comando del sistema operativo | ¿Dónde se ejecutará el comando y qué leerá o modificará? |
| `<<-` | Puede modificar un objeto fuera de la función | ¿Por qué se modifica el estado global? |

Otras operaciones pueden parecer seguras, pero aún pueden cambiar la conclusión:

- seleccionar datos solo por posición de columna en lugar de nombre de columna;
- comparar un porcentaje con una proporción sin comprobar la unidad;
- Tratar a cada célula como una réplica biológica independiente;
- Cambiar los umbrales de filtrado después de ver los resultados del grupo;
- ocultando cada advertencia;
- Sobrescribir objetos con el mismo nombre para que no se puedan distinguir los datos originales y procesados.

El objetivo de la revisión no es prohibir todos los atajos. Es saber qué información deja de lado cada atajo.

## Analizar paso a paso el ejemplo inicial

Ahora lee el código desde el principio de esta lección de nuevo:

```r
cells <- read.csv("cell_metadata.csv")

keep <- !is.na(cells$n_genes) &
  !is.na(cells$percent_mito) &
  cells$n_genes >= 500 &
  cells$percent_mito < 10

filtered_cells <- cells[keep, ]
average_genes <- mean(filtered_cells$n_genes, na.rm = TRUE)
```

En lenguaje común:

1. Lea `cell_metadata.csv` desde el directorio de trabajo actual y guarde la tabla con el nombre `cells`.
2. Compruebe para cada fila que `n_genes` y `percent_mito` tengan valores, que `n_genes` sea como mínimo 500 y que `percent_mito` sea inferior a 10.
3. Solo las filas que cumplan las cuatro condiciones recibirán `TRUE` en `keep`.
4. Use `keep` para filtrar las filas de `cells` y guarde el resultado como `filtered_cells`.
5. Calcule la media de `n_genes` entre las células seleccionadas, omitiendo los valores ausentes que pudieran quedar.
6. Guarde la media con el nombre `average_genes`.

En la consola interactiva de R, el resultado de una expresión sin asignación suele mostrarse automáticamente. Si el código se ejecuta con `source()` o desde un script, no conviene depender de esa visualización. Para dejar constancia del resultado, guárdelo en un objeto y muéstrelo con `print(average_genes)` o escríbalo en un archivo de salida.

Los investigadores todavía necesitan responder a preguntas importantes sobre este código:

- ¿Es el archivo de entrada realmente los metadatos de la célula para el proyecto actual?
- ¿Son correctos los nombres de columna y las unidades?
- ¿Cuál es la base para los umbrales `500` y `10`?
- ¿Deberían comprobarse también otras métricas de calidad?
- ¿Cuántas células de cada muestra se retuvieron?
- ¿Podrían estas reglas sesgar sistemáticamente los resultados para ciertos tejidos, tipos celulares o datos nucleares?
- ¿Por qué el cálculo final es el número promedio de genes por célula, y qué pregunta está destinado a responder?

Comprender el código no significa predecir cada signo de puntuación. Significa separar el procedimiento computacional de las decisiones científicas y reconocer qué evidencia aún falta.

## ¿Qué debes saber hacer al leer código?

Cuando encuentre código R, no necesita reescribirlo desde la memoria, pero al menos debe ser capaz de:

- reconocer objetos, asignaciones, funciones, argumentos, comentarios y cadenas;
- distinguir vectores, marcos de datos, matrices, listas y objetos especializados;
- comprender la indexación común, las comparaciones, las condiciones lógicas y las operadores de encadenamiento;
- Saber que `NA` debe ser manejado explícitamente;
- Rastrear entradas, cambios de objetos y salidas;
- Encontrar operaciones que pueden sobrescribir objetos, modificar el entorno o eliminar archivos.
- Comprobar la explicación de IA contra estructuras reales de objetos y documentación oficial;
- Explicar qué validaciones todavía se necesitan entre la ejecución exitosa del código y una conclusión biológica válida.

En una era en la que la IA puede generar código rápidamente, memorizar la sintaxis puede volverse menos importante, pero entender el código se vuelve aún más importante. Cuanto más rápido se genera el código, más importante es que alguien vea exactamente lo que hace.

## Referencias

1. [R Core Team: Una introducción a R](https://cran.r-project.org/doc/manuals/r-release/R-intro.html)
2. [R Core Team: La definición del lenguaje R](https://cran.r-project.org/doc/manuals/r-release/R-lang.html)
3. [Documentación oficial de R: Operadores de asignación](https://stat.ethz.ch/R-manual/R-patched/library/base/html/assignOps.html)
4. [Documentación oficial de R: Extraer o reemplazar partes de un objeto](https://stat.ethz.ch/R-manual/R-patched/library/base/html/Extract.html)
5. [Documentación oficial de R: Data frames](https://stat.ethz.ch/R-manual/R-patched/library/base/html/data.frame.html)
6. [Documentación oficial de R: Valores faltantes, `NA`](https://stat.ethz.ch/R-manual/R-patched/library/base/html/NA.html)
7. [Documentación oficial de R: Operadores lógicos y relacionales](https://stat.ethz.ch/R-manual/R-patched/library/base/html/Comparison.html)
8. [Documentación oficial R: El operador de encadenamiento base `|>`](https://stat.ethz.ch/R-manual/R-patched/library/base/html/pipeOp.html)
9. [Documentación oficial de R: Cargar paquetes y espacios de nombres de funciones](https://stat.ethz.ch/R-manual/R-patched/library/base/html/library.html)
10. [Documentación oficial de R: Ejecutando scripts con `source()`](https://stat.ethz.ch/R-manual/R-patched/library/base/html/source.html)
11. [Documentación oficial de dplyr: Mantener filas que coinciden con una condición con `filter()`](https://dplyr.tidyverse.org/reference/filter.html)
