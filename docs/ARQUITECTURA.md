# ARQUITECTURA — Modo Competición

Decisiones técnicas permanentes. Lo que un chat nuevo no puede deducir del código sin leerlo entero.
Cambia poco. Si cambia, se anota también en `ESTADO.md` § Decisiones cerradas.

---

## 1. Simulador UEFA unificado

**Decisión:** un solo componente para Champions, Europa y Conference. No tres separados.

**Dónde vive:** `src/App.jsx` (~5142 líneas). Es una SPA React normal dentro de este mismo repo Vite, servida en producción como el resto del sitio — no un Claude Artifact externo.

**Motivo:** las tres competiciones se necesitan mutuamente: los perdedores de una alimentan a la siguiente. Separarlas en componentes independientes rompería ese flujo en vivo.

**Persistencia:** ninguna por ahora. Todo el estado es `useState`/`useMemo` en memoria de React; se pierde al recargar la página. Es una decisión pendiente, no un hecho consumado — queda por resolver si se añade persistencia real y con qué mecanismo.

**Cómo se resuelve:** estado React compartido mediante hooks encadenados.

```
useChampions()  →  useEuropa(cl)  →  useConference(cl, el)
```

Cada hook recibe el estado de los anteriores como argumento. No hay guardado ni recarga entre competiciones: los datos fluyen en vivo.

**Consecuencia práctica:** cualquier propuesta de "separar los simuladores para que el fichero sea más manejable" rompe el flujo entre competiciones. Si alguna vez se hace, hay que resolver antes el transporte de datos, no después.

---

## 2. Modo híbrido: datos reales y simulados conviviendo

Revisado el 04/10/2026 contra el código (se corrige el documento, no el código). Se citan funciones, no líneas.

**Dos capas con nombres parecidos, no una:**

- **Dataset (`public/uefa-fase-previa-2026-27-eliminatorias.json`):** cada eliminatoria lleva `origen_ida`, `origen_vuelta` y `origen_agregado`. Hoy `origen_ida` y `origen_vuelta` valen siempre `"real"` y `origen_agregado` vale `"derivado"`. Son metadatos de ingesta: el código de `src/` no los lee.
- **Estado en vivo (React):** un único campo `origen` por eliminatoria o partido, que lleva `useOrigenResultados`. No hay flags por campo (ida/vuelta): el origen se deriva de los marcadores con `estadoOrigenReal`, que se apoya en `estadoEliminatoria`.

**Estados de `origen`:**

| Estado | Significado |
|---|---|
| (sin entrada) | Resultado normal, introducido o simulado a mano |
| `real` | Viene del dataset y está resuelto; bloqueado hasta pulsar "Modificar" |
| `editado` | Era real y el usuario lo ha modificado (`marcarEditado`) |
| `real-incompleto` | Dato real sin ganador (ida sin vuelta, o agregado empatado sin desglose de prórroga/penaltis); no se bloquea. Pasa a `real` cuando el usuario lo completa (`revisarCompletado`) |

**Quién lo usa:** `useChampions`, `useEuropa` y `useConference` (una instancia por ronda: R1, R2, R3 y Playoff), `useFaseLiga` (por partido, clave `local|visitante`, solo `real`/`editado`) y `useNationsLeague` (por partido). La Copa Intercontinental **no** usa `useOrigenResultados`: `calcularCopa` deriva el origen de los datos (`real ≠ null` y sin edición → "real"; editado → `distintivoCopa` lo rotula "EDITADO").

**Motivo del estado "ida real, vuelta pendiente":** durante una ronda en curso es lo normal; `real-incompleto` lo representa sin marcar como real algo que no lo es ni descartar un dato real ya disponible.

**Sorteos (patrón distinto al de resultados):** un sorteo real es un objeto fijo a nivel de módulo.

- En `useFaseLiga` (AFC, Champions, Europa y Conference): `sorteoReal`, comparado por referencia con `esSorteoReal`, y `restaurarSorteoReal`.
- En Ronda 3 y Playoff: el sorteo real se reconstruye con `precargarDesdeSorteo` y se guarda como `sorteoRealR3`/`sorteoRealPO`; se vuelve a él con `restaurarSorteoR3`/`restaurarSorteoPO`.

**Cascada de invalidación:** al cambiar un resultado confirmado, lo que dependía de él deja de aplicarse en lugar de recalcularse en silencio, y la edición no se pierde ni se oculta. El mecanismo varía:

- **Rondas previas:** `calcularCascadaR2` retira el resultado real de un cruce cuyo emparejamiento ya no coincide con el real (`invalidar` borra además su `origen`, de modo que pasa a ser un resultado normal sin badge). Si se restaura el cruce anterior y vuelve a coincidir, el cruce se recupera (`revalidos`), siempre que el usuario no haya introducido algo propio.
- **Fase de liga:** la clasificación se recalcula de forma reactiva sobre los resultados; `intercambiar` borra el resultado y el origen real de los dos partidos afectados.
- **Nations League:** la clasificación se recalcula de forma reactiva sobre los resultados; no hay sorteo que invalidar.
- **Copa Intercontinental:** `calcularCopa` marca como `invalido` (rótulo OBSOLETO) el partido cuyos participantes ya no son los del real, en cadena P3 → P4 → P5; no se borra nada.

**Restauración:**

- Por partido o cruce: `restaurar` (fase de liga y Nations League: `restaurarPartido`).
- Por ronda: `restaurarTodos` ("Restaurar todos los reales" de cada ronda; no existe un botón global único) y, para sorteos, las funciones de la sección anterior.
- En la Copa: `restaurarReales`.

**Prórroga y penaltis:** no se asume que "sin prórroga registrada" implique penaltis directos.

- `estadoEliminatoria` (doble partido) solo resuelve directamente por penaltis si ya hay un marcador de penaltis no empatado (dataset real sin desglose de prórroga); si no, devuelve `necesita_prorroga`.
- `generarFinalAleatoria` (partido único) siempre genera prórroga y, si persiste el empate, penaltis.
- Copa: la regla vive en `REGLA_DESEMPATE.prorroga` (`src/data/copaIntercontinental2026.js`, aún sin verificar contra el reglamento FIFA). `estadoResultadoCopa` y `resolverPartidoCopa` leen esa regla: con `prorroga: false` un empate en 90' va directo a penaltis; con `true` se delega en `estadoPartidoUnico` y `generarFinalAleatoria`. Hoy es `true`.

---

## 3. Descenso entre competiciones

El descenso de perdedores ocurre **ronda a ronda**, no solo en la transición a la fase de liga:

- Perdedores de las rondas previas de Champions → rondas previas de Europa League
- Perdedores de las rondas previas de Europa League → rondas previas de Conference League

**Consecuencia:** las tablas de coeficientes de cada competición deben incluir a los equipos que pueden llegar desde la competición superior. Si no, un equipo desciende y no se le puede asignar bombo.

---

## 4. Validación por conteos

Todo cambio en datos de fase previa se valida contra el **número esperado de eliminatorias por ronda**, no contra "parece que funciona".

Referencias conocidas: UCL Q1 = 14 eliminatorias · UECL Q2 = 49 eliminatorias.

**Regla:** un total par no demuestra que los datos estén completos. Hubo un bug silencioso exactamente por eso — el sorteo de Ronda 3 de Europa League aceptó datos incompletos porque el total salía par. Se valida la cantidad exacta, siempre.

---

## 5. Casos singulares documentados

**Karviná (2026/27):** exclusión del club con reasignación de plaza en cascada a tres clubes. Es el **único caso documentado** de reasignación de plaza en esta temporada. Cualquier discrepancia de plazas que aparezca debe compararse primero con este caso antes de asumir un error de datos.

---

## 6. Despliegue

- Repositorio: `carlosgilanalista-art/modo-competicion`
- Stack: React + Vite
- Despliegue: Vercel, automático desde `main`
- Dominio: registrado en IONOS, DNS apuntando a Vercel

**Consecuencia:** todo lo que entra en `main` sale a producción. No hay entorno de staging. Por eso el gate previo a fusionar no es opcional (ver `CONVENCIONES.md`).
