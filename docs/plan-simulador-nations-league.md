# Plan — Simulador UEFA Nations League 2026/27

> Documento de planificación y estimación. No es código; es el plan de referencia
> para las sesiones de implementación. Fase de planificación previa a escribir nada.

## Contexto y decisiones cerradas

Se evalúa añadir un simulador de la **UEFA Nations League 2026/27** al proyecto
`modo-competicion`, junto a los simuladores de clubes ya existentes (Champions,
Europa y Conference League).

Decisiones tomadas antes de empezar:

1. **Grupos reales, no sorteo simulado.** El sorteo de la fase de liga fue en
   febrero de 2026, así que los 14 grupos ya se conocen. Se cargan los grupos
   reales. El sorteo por bombos queda como extra opcional (sesión 1.5), no como
   requisito.
2. **Ruta propia `#/simulador-selecciones`**, no un 4º tab dentro del simulador
   de clubes. La NL es familia distinta (selecciones vs clubes) y no comparte
   motor con el simulador suizo actual.
3. **Toggle de repesca manual.** El usuario marca qué selecciones están "ya
   clasificadas a la Euro 2028 por la vía normal"; no se intenta ninguna
   heurística. Más simple y más honesto para un simulador.

## 1. Arquitectura actual del simulador (estado real del código)

Todo el simulador vive en **`src/App.jsx` (~2.512 líneas)**. No existe ningún
archivo `simulador-uefa-unificado.jsx` ni ningún `window.storage`: **el estado es
efímero, en memoria de React, sin persistencia de ningún tipo.**

El encadenamiento entre competiciones es **composición de hooks por argumento**,
no almacenamiento compartido:

```js
// App() — línea ~2407
const cl = useChampions();        // no depende de nadie
const el = useEuropa(cl);         // recibe el hook de Champions entero
const co = useConference(cl, el); // recibe Champions y Europa
```

`useEuropa` lee en vivo `cl.perdedoresR2` (un `useMemo` derivado). Al cambiar un
resultado en Champions, el `useMemo` recalcula y Europa se actualiza sola — sin
guardar ni recargar. De ahí la frase "los datos fluyen en directo entre pestañas".

### Anatomía de cada hook de competición (los tres son casi idénticos)

- Estado de resultados por ronda: `resR1, resR2, resR3, resPO`
  (objetos `{ [claveTie]: { idaA, idaB, vueltaA, ... } }`) con sus
  `changeX` / `resetX` / `rellenarX`.
- Rondas previas a doble partido → producen un `poolLiga` (los 36 clasificados).
- Ese pool alimenta el motor de fase de liga compartido:
  `const liga = useFaseLiga(poolLiga, FL_CFG_UCL)`.

### Motor común (funciones puras reutilizables)

| Función | Qué hace |
|---|---|
| `estadoEliminatoria(r)` | Resuelve un cruce ida/vuelta (agg → prórroga → penaltis) |
| `estadoPartidoUnico(r)` | Partido único con prórroga/penaltis (finales) |
| `sortear(plazas)` | Sorteo emparejado bombo1×bombo2 con restricción de país (backtracking) |
| `sortearFaseLiga(plazas, cfg)` | Sorteo del formato suizo: 36 equipos, 8 rivales, equilibrio casa/fuera |
| `clasificacionFaseLiga(...)` | Tabla única con desempates UEFA **sin H2H** (Art. 17) |
| `sortearEliminatorias` / `resolverCuadro` | Bracket fijo playoff→octavos→…→final |
| `rnd5`, `generarResultadoAleatorio`, `generarFinalAleatoria`, `shuffleCopy`, `validar` | Utilidades |

Config por competición vía `FL_CFG_UCL/UEL/UECL` (`{ bombos, porBombo, dobleRival }`).
Vistas `ChampionsView/EuropaView/ConferenceView`, temas `TEMA_CL/EL/CO`, tabs +
routing por hash (`#/simulador/CL`).

Ya existe `src/ArticuloNationsLeague.jsx`: un artículo completo que describe el
formato exacto de la NL 26/27. Es la fuente de la que sale este plan.

## 2. ¿Encaja como 4º módulo de la misma arquitectura?

**Encaja el cascarón, no el motor.** Y un matiz clave: la Nations League **no
encadena** desde CL/EL/CO — es una competición independiente. Su encadenamiento
interesante es interno: fase de grupos → clasificación general → ascensos/descensos
+ repesca.

Lo que **no** aplica es `useFaseLiga`. El formato suizo (una tabla de 36, 8 rivales,
equilibrio casa/fuera, pares de bombos) es lo contrario de la NL:

- **14 mini-ligas** round-robin de 3-4 equipos (Ligas A/B/C = 4 grupos de 4;
  Liga D = 2 grupos de 3). Generar el calendario es trivial (casi hardcodeable).
- La clasificación de grupo usa **enfrentamiento directo primero (H2H)**, que
  `clasificacionFaseLiga` **omite deliberadamente** (en la liga suiza "no hay
  enfrentamiento directo").
- La riqueza está en la **interdependencia entre las 4 ligas** (ascensos/descensos,
  play-offs cruzados, ranking general, repesca), no en el calendario.

**Enfoque adoptado:** módulo nuevo en el mismo `App.jsx` (mismas convenciones de
tema/vista/routing, reutilizando los motores de cruce y las utilidades), con su
propio hook `useNationsLeague()` que **NO** usa `useFaseLiga` y su propio modelo de
datos. Ruta propia `#/simulador-selecciones`.

## 3. Complejidad y alcance

**Complejidad global: media.** Nada algorítmicamente tan duro como `sortearFaseLiga`
(que ya está hecho). El coste real es superficie de UI + entrada de datos + reglas
específicas de UEFA (seeding de play-offs, construcción del general, criterios de
repesca).

### Reutilizable tal cual o casi

- `estadoEliminatoria` → play-offs asc/desc y cuartos de Liga A. 100%.
- `estadoPartidoUnico` + `generarFinalAleatoria` → semis/final de la Final a Cuatro. 100%.
- `validar`, `rnd5`, `generarResultadoAleatorio`, `shuffleCopy`. 100%.
- Patrón de estado de resultados (`resX` + `changeX`/`resetX`/`rellenarX`). Se copia.
- Cascarón: temas, routing, tabs, scaffolding de vistas. Se calca.
- La técnica de backtracking de `sortear`/`sortearFaseLiga` como referencia para el
  sorteo por bombos opcional.

### A construir desde cero

- **Modelo de datos NL**: 54 selecciones por liga/grupo (grupos reales) + ranking
  general NL 2024/25 (bombos y desempates). Tedioso, no difícil.
- **Round-robin de grupo** (3-4 equipos): trivial, casi tabla fija.
- **Clasificación de grupo con H2H** (función nueva, distinta de la de clubes).
- **Ascensos/descensos + play-offs cruzados** entre ligas contiguas (3º vs 2º, con
  reglas de sede/cabeza de serie). Moderado.
- **Ranking general 1–54** combinando posición y nivel de liga. Moderado.
- **Repesca Euro 2028**: los 4 mejores ganadores de grupo no clasificados por vía
  normal, ordenados por el general, con toggle manual de "ya clasificados".
  Función estrella. Moderado.
- **Final a Cuatro de Liga A** (cuartos doble partido → semis/final único). Ligero,
  reusa motores.
- **UI**: 14 grupos + play-offs + Final Four + general + repesca. Mucha superficie,
  pero mecánica.

## 4. Plan por sesiones (~2h cada una)

### Sesión 1 — Datos + andamiaje
- Ruta `#/simulador-selecciones`, `TEMA_NL`, `NationsLeagueView` esqueleto en `App.jsx`.
- Constantes: 54 selecciones por liga/grupo (grupos reales) + ranking general NL 24/25.
- Hook `useNationsLeague()` con estado de resultados por grupo.
- Render de los 14 grupos con inputs de marcador editables.
- **Entregable:** puedes meter resultados en todos los grupos.

### Sesión 2 — Clasificaciones + ascensos/descensos directos
- Función de clasificación de grupo con H2H + tabla por grupo con marcadores de
  asciende / desciende / play-off.
- Auto-relleno por grupo y por jornada (reusa `rnd5`).
- Cálculo de ganadores (B/C/D suben) y colistas (A/B/C bajan).
- **Entregable:** completas la fase de grupos y ves ascensos/descensos directos.

### Sesión 3 — Play-offs cruzados + Final a Cuatro (Liga A)
- Emparejamiento de play-offs entre ligas contiguas (doble partido, reusando
  `estadoEliminatoria`, reglas de sede).
- Cuartos de Liga A (doble partido) → Final a Cuatro (semis / 3er puesto / final a
  partido único con `estadoPartidoUnico`).
- **Entregable:** promoción resuelta + campeón de la Nations League.

### Sesión 4 — Ranking general + repesca Euro 2028 + pulido
- Clasificación general 1–54.
- Cálculo de las 4 plazas de repesca (mejores ganadores de grupo no clasificados)
  con toggle manual de "ya clasificados".
- Enlace desde `ArticuloNationsLeague` al simulador. Textos de ayuda y QA.
- **Entregable:** la función titular — quién coge los billetes traseros a la Euro 2028.

### Sesión 1.5 — (Opcional) Sorteo por bombos
- Simular el sorteo de febrero-2026 desde los pots en vez de cargar los grupos reales,
  reutilizando la técnica de backtracking de `sortear`. Solo si se quiere el sorteo
  como feature adicional.

## Datos a sourcear antes de la implementación

- Composición real de los 14 grupos (Ligas A/B/C = 4 grupos de 4; Liga D = 2 grupos de 3).
- Ranking general de la Nations League 2024/25 (bombos y desempates).
- Reglas de seeding y sede de los play-offs de ascenso/descenso entre ligas contiguas.
- Reglas de construcción de la clasificación general 1–54.
- Criterios exactos de asignación de las plazas de repesca de la Euro 2028 vía NL.
