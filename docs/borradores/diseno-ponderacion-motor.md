# Diseño: ponderación del motor de simulación por fuerza de equipo

Borrador de diseño del 22/11/2026 (tarea 2 de la sesión del domingo). **Solo diseño: ningún fichero de `src/` modificado.** Rama `claude/diseno-ponderacion-motor`, desde `main` (commit `775289a`).

Convención: 🟢 dato verificado contra fuente en esta sesión; 🟡 dato cargado en el código sin marca de estimado, no recontrastado en esta sesión; 🔴 estimado o supuesto.

Aviso de proceso: la sesión registró esta tarea para Opus con esfuerzo alto y en un chat aparte (`ESTADO.md` §3). Se hizo por petición expresa de Carlos en el mismo chat de la tarea 1, con Sonnet. Conviene que la revisión del diseño la haga Opus antes de implementar.

---

## 1. Paso 0 (solo lectura)

**¿Dónde se generan hoy los goles? Sí, localizado.** `src/App.jsx:167`, `function rnd5() { return Math.floor(Math.random() * 6); }`: entero uniforme en 0-5, sin ningún dato de equipo como entrada. Únicas fuentes de aleatoriedad que producen goles: `rnd5` y `Math.random()` en la prórroga de `generarFinalAleatoria` (`App.jsx:2250`, goles 0-1 por equipo). Los otros `Math.random()` (`App.jsx:178`, `6119`, `7199`, `7341`) mezclan bombos, eligen ganador de los cuartos de la tubería EURO o desempatan el orden de un sorteo: no producen goles.

**Funciones que llaman a `rnd5` directamente: 8** (ruta y línea de cada llamada):

| # | Función | Línea de la llamada | Uso |
|---|---|---|---|
| 1 | `generarResultadoAleatorio` | 169, 171, 172 | doble partido (ida, vuelta, prórroga, penaltis) |
| 2 | `generarFinalAleatoria` | 2248, 2251 | partido único (más prórroga con `Math.random`) |
| 3 | `useFaseLiga` | 2344 | `simularJornada` de las fases de liga UCL, UEL, UECL y AFC |
| 4 | `useNationsLeague` | 4797 | `rellenarPartidos` (grupos NL) |
| 5 | `eqSimularFaseLigaNL` | 5748 | etapa 1 de la tubería EURO |
| 6 | `eqSimularPipelineCompleto` | 6124 | etapa 4 de la tubería EURO (lote, script de validación) |
| 7 | `useEuro2028` | 6302 | `rellenarClasif` (fase de grupos EURO en la UI) |
| 8 | `resolverPartidoCopa` | 6892, 6893 | Copa Intercontinental (partido sin prórroga) |

Recuento: `rnd5` aparece en 13 líneas (1 definición + 12 de uso). Las funciones envoltorio se llaman desde muchos más sitios: `generarResultadoAleatorio` en 21 líneas (1 definición + 20 usos) y `generarFinalAleatoria` en 13 líneas (1 definición + 12 usos); los usos están en las rondas previas de UCL/UEL/UECL (`rellenarR1`-`rellenarPO`), play-offs y Final a Cuatro de la NL, repesca EURO y Copa del Rey/Intercontinental (`App.jsx:2386`, `2700-2703`, `2983-2986`, `3337-3347`, `4892-4962`, `6080-6095`, `6891`, `7244`, `7482-7552`).

**Datos de fuerza ya cargados, por competición:**

| Competición | Dato | Cobertura (equipos con fuerza / total) | Fiabilidad |
|---|---|---|---|
| UCL (fase de liga) | `coefFaseLiga(nombre)` (`App.jsx:808`): `FL_COEFS_DIRECTOS` > `CO_COEFS_INICIALES` > `EL_COEFS_INICIALES` > `CL_COEFS_INICIALES` | 36 / 36; 3 con `/* estimado */` (Lens, Galatasaray, Shakhtar Donetsk) | 🟡 33, 🔴 3 |
| UEL | ídem | 36 / 36; 6 estimados (Real Sociedad, Celta de Vigo, TSG Hoffenheim, Rennes, AZ Alkmaar, Torreense) | 🟡 30, 🔴 6 |
| UECL | ídem | 36 / 36; 0 estimados | 🟡 36 |
| AFC Champions Elite | campo `coef` (`AFC_OESTE`, `AFC_ESTE`) | 32 / 32, pero **no es fuerza**: es el bombo real codificado como rango 1-16 por región (comentario de `App.jsx:826-830`) | 🔴 |
| Nations League | `NL_RANKING` (clasificación general 2024/25), `NL_RANK` | 54 / 54 | 🟡 |
| Copa del Rey | `categoria` de cada equipo (`copaDelRey2026.js`, 7 categorías) | 126 / 126 | 🔴 como fuerza (es un nivel, no una medida) |
| Copa Intercontinental | ninguno en `copaIntercontinental2026.js` | 0 / 5 | 🔴 |

`coefFaseLiga` se usa hoy solo para bombos y sorteo (`App.jsx:1397`, `1744`, `2034`, `2730-2731`); ninguna función de goles lo lee. El recuento de 9 estimados (3 UCL + 6 UEL) coincide con las 7 líneas con `/* estimado */` de `FL_COEFS_DIRECTOS` (algunas líneas llevan dos).

**Hipótesis: «el motor uniforme (`rnd5`, decisión del 04/10) explica ambos marcadores (los dos caben en 0-5)». Sí.** 5-5 y 0-5 están dentro de 0-5. Bajo el motor uniforme cada marcador exacto tiene probabilidad 1/36 = 0,027778 (uno entre 36), la misma que 0-0. El motor además da 5,0 goles esperados por partido (2,5 por equipo) y un 16,67 % de empates (6/36). Origen de la decisión: en `ESTADO.md` consta «Motor uniforme (rnd5)» en la entrada del 04/10 de la Copa Intercontinental (línea 523) y «decisión explícita de la Fase 1» en la capa de datos EURO (`App.jsx` ~5709-5716); no hay una entrada fechada solo sobre `rnd5` → **NO ENCONTRADA como decisión autónoma**.

## 2. Los dos casos localizados

| Caso | Competición | Jornada y fecha | Local / visitante | Fuerza actual (coeficiente UEFA) | ¿Resultado real? |
|---|---|---|---|---|---|
| PSG 5-5 Roma | UCL, fase de liga 2026/27 | J5, miércoles 25/11/2026 (`UCL_JORNADA_REAL` clave `Paris Saint-Germain\|Roma` = 5) | PSG local | PSG 132,000; Roma 97,750; razón 1,35 | **No** |
| Como 0-5 AEK | UCL, fase de liga 2026/27 | J5, martes 24/11/2026 (clave `Como\|AEK Atenas` = 5) | Como local | Como 19,989; AEK Atenas 24,000; razón 0,83 | **No** |

La J5 se juega el 24-25/11/2026 y hoy es 22/11; los resultados reales cargados cubren J1-J4 (72 de 144) y ninguna de las dos claves aparece en ellos. Son salidas del simulador, así que **cuentan como fallo del motor**. Como 0-5 es una victoria visitante por cinco goles entre dos equipos de fuerza casi igual: el problema no es solo la fuerza, es la distribución de goles (ver punto 4).

## 3. Variable de fuerza decidida

**Escala:** `d = ln(fuerza_local / fuerza_visitante)`, con `|d|` recortado a 3,0. La fuerza es una cantidad positiva; solo cuenta la razón.

| Competición | Fuerza | Fuente | Fiabilidad | Cobertura | Fallback si falta |
|---|---|---|---|---|---|
| UCL | coeficiente UEFA | `coefFaseLiga` | 🟡 / 🔴 en 3 | 36 / 36 | motor uniforme actual |
| UEL | coeficiente UEFA | `coefFaseLiga` | 🟡 / 🔴 en 6 | 36 / 36 | motor uniforme actual |
| UECL | coeficiente UEFA | `coefFaseLiga` | 🟡 | 36 / 36 | motor uniforme actual |
| AFC | ninguna (el `coef` actual es el bombo, no fuerza) | — | 🔴 | 0 / 32 | motor uniforme actual |
| Nations League | `1 / posición` en `NL_RANK` | clasificación 2024/25 | 🟡 | 54 / 54 | motor uniforme actual |
| Copa del Rey | `exp(−0,9 × índice de categoría)` (Primera = 0 … previa = 6) | `categoria` | 🔴 | 126 / 126 | motor uniforme actual |
| Copa Intercontinental | ninguna | — | 🔴 | 0 / 5 | motor uniforme actual |

Regla de fallback: si falta la fuerza de **cualquiera** de los dos equipos, se usa el motor actual sin cambios. Los coeficientes `/* estimado */` se rotulan en la interfaz como 🔴; su sustitución por los oficiales va al Aparcadero. La fuente de la Nations League puede pasar a la clasificación provisional 2026/27 cuando esté fijada para todas las ligas; el valor 0,9 de la Copa del Rey y el uso de la posición 2024/25 son supuestos 🔴.

## 4. Modelo (sin código)

**Entradas:** fuerza del local y del visitante (punto 3) y la competición, que solo selecciona la fuente.

**Salida:** un marcador (goles del local, goles del visitante) con dos goles independientes de Poisson.

**Fórmulas:**
- `d = ln(fuerza_local / fuerza_visitante)`, recortado a [−3, 3].
- `λ_local = μ · exp(η/2 + β·d/2)`
- `λ_visitante = μ · exp(−η/2 − β·d/2)`
- Cada marcador se trunca en 11 goles y se renormaliza.

**Parámetros (valores iniciales, todos 🔴 hasta calibrar):**

| Nombre | Valor | Significado |
|---|---|---|
| `μ` | 1,30 | goles esperados por equipo entre iguales en campo neutral |
| `β` | 0,30 | sensibilidad de los goles a `ln` de la razón de fuerzas |
| `η` | 0,20 | ventaja de localía (en logaritmo) |
| `d_max` | 3,0 | recorte de `|d|` |
| `N_max` | 11 | truncado de la distribución |

**Localía:** entra como `η`, que sube `λ_local` y baja `λ_visitante` en la misma medida. Con `η = 0,20`, entre iguales `λ_local = 1,437` y `λ_visitante = 1,176`. En partidos a sede neutral (Final a Cuatro, final de la Copa Intercontinental, final de la Copa del Rey) `η = 0`.

**Efecto sobre los dos casos (cifras exactas):** PSG–Roma, `d = 0,300`, `λ = 1,503 / 1,124`; Como–AEK, `d = −0,183`, `λ = 1,398 / 1,209`.

## 5. Umbrales de aceptación (antes de implementar, comprobables por script)

Cada umbral lleva el valor que sale con los parámetros iniciales (calculado en esta sesión con un script aparte, sin tocar `src/`).

| # | Umbral | Objetivo | Valor con el modelo | ¿Cumple? |
|---|---|---|---|---|
| 1 | P(5-5) en PSG (local) – Roma | ≤ 2,0 × 10⁻⁴ (uniforme: 0,027778) | 6,918 × 10⁻⁵ (una entre 14 455) | Sí |
| 2 | P(0-5) en Como (local) – AEK Atenas | ≤ 3,0 × 10⁻³ (uniforme: 0,027778) | 1,588 × 10⁻³ (una entre 630) | Sí |
| 3 | Monotonía: P(victoria local) estrictamente creciente con `d` en una rejilla de 17 puntos, `d` de −2 a 2 en pasos de 0,25 | creciente en los 17 | creciente en los 17 | Sí |
| 4 | Simetría: con `η = 0`, P(victoria local \| `d`) = P(victoria visitante \| −`d`) | diferencia ≤ 1 × 10⁻¹² en toda la rejilla | pendiente de implementar el script; por construcción es exacta | Por comprobar |
| 5 | Media de goles por partido en los 144 emparejamientos de la UCL con sus coeficientes | entre 2,4 y 3,0 (uniforme: 5,0) | 2,649 | Sí |
| 6 | Media de goles por partido con `d = 0` y `η = 0,20` | entre 2,4 y 3,0 | 2,613 | Sí |
| 7 | Con `d = 0`: P(victoria local) | entre 0,40 y 0,50 | 0,4305 | Sí |
| 8 | Con `d = 2,24` (132 contra 14): P(victoria local) | entre 0,60 y 0,70 | 0,6469 | Sí |

Los umbrales 1-3 y 5-8 se evaluaron con un script aparte en esta sesión. El 4 queda para el script de aceptación de la implementación. Los umbrales 1, 2 y 5-8 son un compromiso inicial del diseño; si se prefieren otras bandas, se fijan **antes** de implementar y no después de ver los resultados.

## 6. Invariantes que no se tocan

1. `useOrigenResultados` (real / editado / restaurar): sin cambios; solo se pondera la generación de goles de partidos sin base real.
2. Los resultados reales nunca se sobrescriben al simular (`tieneBaseReal`); el modelo solo rellena los huecos.
3. «Simular todo» sigue cerrando: 56/56 y 28/28 en la Copa del Rey, 156/156 en la NL, 54 filas únicas en el ranking general, 1000 simulaciones EURO sin fallos en `euro2028-validate.mjs`.
4. Los datos siguen en módulos puros y el código inline en `App.jsx`; el modelo se implementa como funciones puras exportadas, sin estado de React.
5. Si falta la fuerza de un equipo, comportamiento idéntico al actual (punto 3).
6. Las firmas de `generarResultadoAleatorio`, `generarFinalAleatoria` y `rnd5` se conservan; la ponderación se añade con un parámetro opcional y los 12 usos actuales sin fuerza siguen funcionando.

---

## Fuera de alcance (al Aparcadero, sin evaluar)

- Implementar el modelo.
- Recalibrar con coeficientes oficiales y sustituir los `/* estimado */` de `FL_COEFS_DIRECTOS`.
- Modelo de prórroga y penaltis.
- Forma y lesiones.

## Resumen del gate (`CONVENCIONES.md` §3)

- **Rama:** `claude/diseno-ponderacion-motor`.
- **Ficheros en `src/`:** 0.
- **Puntos:** 1 sí, 2 sí, 3 sí, 4 sí, 5 sí (el umbral 4 queda por comprobar al implementar), 6 sí.
- **Veredicto: APTO** para el alcance de diseño; los parámetros del punto 4 son 🔴 hasta calibrar.
