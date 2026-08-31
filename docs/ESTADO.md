# ESTADO — Modo Competición

**Última actualización:** 30/08/2026 — cierre de sesión (sorteo real y calendario de jornadas de las 3 fases de liga UEFA)

Este documento es la única fuente de verdad del estado del proyecto. Si una copia en un Project lo contradice, gana esta. Se actualiza al cierre de cada sesión de Code y los viernes al planificar.

## 1. En producción

**Plataforma**

- modocompeticion.com — React/Vite, desplegado en Vercel desde `main` (repo `carlosgilanalista-art/modo-competicion`). Dominio en IONOS.
- Google Analytics 4 (`G-J93TNQ8R8M`) y Search Console activos y vinculados.
- Menú de Clubes agrupado por confederación (UEFA / AFC), en `main` desde el 09/08 (PR #14).
- Sistema de documentación en `docs/` (ESTADO.md, ARQUITECTURA.md, MARCA.md, CONVENCIONES.md, SISTEMA.md), en `main` desde el 22/08.

**Simuladores**

- Simulador UEFA unificado: Champions, Europa y Conference en un solo artefacto, con estado compartido.
- Modo confirmado vs simulado con cascada de invalidación.
- Datos reales de la fase previa 2026/27 cargados y editables, hasta Ronda 3 completa y sorteo de Playoff.
- "Restaurar sorteo real" y "Restaurar todos los reales"; resolución directa por penaltis cuando no hay prórroga registrada.
- Sorteo real de la fase de liga de la Champions League 2026/27 (36 equipos, 144 partidos), celebrado el 27/08/2026, cargado y editable con el mismo patrón "sorteo real" / restauración / edición campo a campo, y las restricciones de federación (Art. 16) validadas también al editar a mano.
- Sorteo real y calendario de jornadas de la fase de liga de las tres competiciones UEFA 2026/27 completos: Champions (36 equipos, 144 partidos, 8 jornadas), Europa League (36, 144, 8 jornadas) y Conference League (36, 108 partidos, 6 jornadas). Las fechas oficiales de cada jornada se muestran junto a su cabecera en el simulador. Corrige una entrada previa de este documento (28/08) que daba por bloqueadas las fases de liga de Europa y Conference League — el bloqueo ya no existía en el código (los 4 caídos de Ronda 3 Ruta Liga de Champions ya se resolvían solos vía `intentarSorteoRealRonda`), solo faltaba cargar el sorteo real de esas dos competiciones.
- Simulador de selecciones: Nations League 2026/27 y clasificación para la EURO 2028.
- Simulador AFC Champions League Elite — Capa 1 (solo fase de liga): dos regiones independientes (Oeste/Este, 16 equipos cada una), motor de sorteo por rejilla propio (no es el bombo-contra-bombo de la UEFA), sorteo real del 18/08/2026 precargado con opción de simular y volver a él. Enlazado desde el menú "Clubes". `#/simulador-afc-champions-elite`.

**Artículos publicados**

- Fases Previas UEFA (1 y 2)
- Fase de liga y eliminatorias UEFA
- Nations League 2026/27
- Clasificación para la EURO 2028
- AFC Champions League Elite 2026/27 — explicación
- Procedimiento del sorteo de la fase de liga UCL 2026/27 (`#/procedimiento-sorteo-ucl`), enlazado junto al botón de sorteo en el simulador de Champions

## 2. Deadlines duros

| Fecha | Qué | Qué pasa si se incumple |
|---|---|---|
| 14/09/2026 | Simulador AFC Champions League Elite publicado | Arranca la fase de liga. Publicar después pierde toda la ventana de interés: el simulador deja de servir para anticipar y pasa a competir con los resultados reales |
| 24/08/2026 | Cierre del Sprint Relanzamiento (25/07–24/08) | No es una entrega, es un punto de medición. Sin él no hay criterio para decidir la siguiente fase de difusión |

## 3. Tarea única de la próxima sesión

**Sesión:** 28/08/2026 (viernes) — COMPLETADA
**Tarea:** Cargar los resultados reales del Playoff UEFA de Europa League (12 eliminatorias) y Conference League (24 eliminatorias), pegados directamente por Carlos.
**Criterio de hecho:** CUMPLIDO — 36/36 eliminatorias cargadas (12 UEL + 24 UECL), verificadas aritméticamente una a una (agregado = ida+vuelta, ganador recalculado independientemente, penaltis solo con agregado empatado). Resolución directa por penaltis sin asumir prórroga en las 3 eliminatorias sin prórroga registrada (Heart of Midlothian–Rapid Wien, Rangers–Jablonec, Drita–Inter Club d'Escaldes). Corregida además una ida ya cargada que era incorrecta (Lincoln Red Imps–Larne, "2-1" → "0-2", confirmado por Carlos contra la página oficial de "Play-offs - Ida"). Detalle completo en `docs/clasificados-2026-27.md`. Fusionado a `main` (squash, commit `53d7cc7`, PR #46, rama `claude/playoff-uefa-resultados-851dma`).
**Herramienta:** Claude Code

**Sesión:** 28/08/2026 — COMPLETADA
**Tarea:** Cargar el sorteo real de la fase de liga de la Champions League 2026/27, celebrado el jueves 27/08/2026, como dato confirmado, con la misma lógica híbrida real/simulado que ya existe para otros datos. Cambio de alcance consciente sobre la tarea de resultados de Playoff de la sesión anterior, decidido por Carlos.
**Criterio de hecho:** CUMPLIDO — 36 equipos en 4 bombos de 9, 144 emparejamientos (36×8÷2) cargados como sorteo real, reutilizando el patrón `sorteoReal`/`esSorteoReal`/`restaurarSorteoReal` ya existente (AFC Elite y Ronda 3/Playoff de Champions, `ARQUITECTURA.md §2`) — no el contrato `origen_ida`/`origen_vuelta` ni el campo `origen` de resultados, que no aplican a sorteos. Edición campo a campo (intercambio de visitante) y restauración al sorteo real ya funcionaban de forma genérica en `FaseLigaPanel`/`useFaseLiga`; solo hizo falta conectar los datos reales, sin tocar la UI. Restricciones de federación (Art. 16) validadas en el propio dataset (0 infracciones) y en la edición en vivo. Verificado por conteos exactos: 36 bloques de equipo parseados (288 líneas), pot derivado sin discrepancias, 144 parejas local/visitante simétricas, 8 partidos por equipo, 8 jornadas de 18 partidos sin choques. Probado en navegador (build limpio + Playwright). Fusionado a `main` (squash, commit `9afa0f1`, PR #47, rama `claude/load-champions-league-draw-pstwwu`), deployment de Production confirmado por Carlos.
**Herramienta:** Claude Code

**Sesión:** 30/08/2026 (domingo) — COMPLETADA (alcance reducido, decidido por Carlos en sesión)
**Tarea:** Cargar el calendario real de jornadas (fechas) de la fase de liga de Champions, Europa y Conference League 2026/27.
**Criterio de hecho:** PARCIALMENTE CUMPLIDO, por decisión consciente de alcance — solo Champions League. Al arrancar se detectó que Europa League y Conference League no tienen sorteo real cargado en el simulador (`useFaseLiga` se invoca sin `sorteoReal` en ambas, `src/App.jsx` líneas ~2120 y ~2459): sus pools de 36 equipos siguen incompletos (faltan los 4 caídos de Ronda 3 Ruta Liga de Champions, ya documentado en `docs/clasificados-2026-27.md`). Sin sorteo real no hay partidos a los que asignar jornada/fecha, así que no se tocó el PDF de calendario de Europa League adjuntado en sesión ni se cargaron datos de Conference League (aunque Carlos los pegó en el mensaje). Carlos confirmó reducir el alcance de hoy solo a Champions League.
Para Champions League: verificado por script que las 144 parejas del calendario real de jornadas pegado por Carlos coinciden exactamente (mismo local/visitante, sin duplicados ni inversiones) con las 144 ya cargadas en `UCL_PARTIDOS_REAL` — no se introdujo ningún emparejamiento nuevo, solo se fijó su jornada real (1-8) y su fecha. Verificado también que cada uno de los 36 equipos aparece exactamente una vez en cada una de las 8 jornadas. `sorteoRealFaseLigaUCL()` ya no reparte las jornadas con el algoritmo genérico (`repartirJornadas`) sino con el mapa real `UCL_JORNADA_REAL`; las fechas (`UCL_FECHAS_JORNADA`) se muestran junto a cada cabecera "JORNADA N" en el panel. Probado en navegador (build limpio + Playwright): las 8 fechas se muestran correctamente y el indicador "✓ SORTEO REAL" se conserva.
Limitación conocida, aparcada: el intercambio manual de visitantes (edición campo a campo) sigue regenerando el reparto de jornadas con el algoritmo genérico, no con el calendario real — tras un intercambio, la fecha mostrada junto a una jornada deja de corresponder con exactitud a los partidos que contiene. Ver Aparcadero.
**Herramienta:** Claude Code

**Sesión:** 30/08/2026 (domingo, continuación) — COMPLETADA
**Tarea:** Desbloquear y cargar el sorteo real y el calendario de jornadas de la fase de liga de Europa League y Conference League, ampliando el alcance reducido de la tarea anterior.
**Criterio de hecho:** CUMPLIDO, con una corrección de diagnóstico a mitad de sesión. Al comprobar en vivo en el navegador (no solo en la documentación), se descubrió que el "bloqueo" de EL/UECL registrado el 28/08 y repetido en la entrada anterior de hoy ya no era real: los pools de 36 equipos de ambas competiciones estaban completos desde antes (`intentarSorteoRealRonda` ya resolvía en directo los 4 caídos de Ronda 3 Ruta Liga de Champions contra el JSON de datos reales) — lo único que faltaba era cargar el sorteo real (emparejamientos) de esas dos competiciones, igual que ya existía para Champions.
Se extrajo el calendario de Europa League del PDF adjuntado (pdftotext -layout, 144 partidos en 8 jornadas) y se usó el texto de Conference League ya pegado por Carlos (108 partidos en 6 jornadas). Verificado por script: sin duplicados, 36 equipos con el número exacto de partidos por competición (8 en EL, 6 en UECL), sin choques de equipo por jornada, sin infracciones de federación (ni mismo país ni más de 2 rivales de una federación ajena).
Los bombos NO se pudieron derivar del coeficiente interno del simulador (`coefFaseLiga`): probar el reparto automático (igual que en el sorteo simulado) dejaba 25/36 equipos de EL y 10/36 de UECL fuera del patrón real de "2 (o 1) rivales por bombo" — varios coeficientes del código están marcados `/* estimado */`, no son el coeficiente oficial que usó la UEFA. Carlos aportó las listas reales de bombos (4×9 en EL, 6×6 en UECL); verificadas contra los 144+108 partidos, encajan al 100% (0 discrepancias en ambas).
Implementado `sorteoRealFaseLigaEL()` y `sorteoRealFaseLigaUECL()`, mismo patrón que Champions (`UEL_POT_REAL`/`UEL_PARTIDOS_REAL`/`UEL_JORNADA_REAL`/`UEL_FECHAS_JORNADA` y equivalentes UECL), conectados a `useFaseLiga` en `useEuropa`/`useConference`. Probado en navegador (build limpio + Playwright): las 8 jornadas de EL y las 6 de UECL muestran su fecha real, bombos correctos y el indicador "✓ SORTEO REAL" en ambas. Misma limitación aparcada que en Champions: el intercambio manual regenera jornadas con el algoritmo genérico.
**Herramienta:** Claude Code

**Sesión siguiente:** (por definir)
**Tarea:** (por definir)
**Criterio de hecho:**
**Herramienta:** Claude Code

## 4. En curso

- Datos reales UEFA fase previa 2026/27 — Playoff de las tres competiciones completo: Champions League (7/7, fase de liga UCL 36/36), Europa League (12/12) y Conference League (24/24). Fusionado a `main` vía PR #43, PR #44 (Champions, rama `claude/datos-playoff-uefa-2026-27-2n5owl`, resuelta) y PR #46 (EL+UECL, rama `claude/playoff-uefa-resultados-851dma`, resuelta — merge confirmado en `main`, pendiente confirmar deployment de Production en Vercel por el precedente del 27/08, ver Decisiones cerradas). Las fases de liga de Europa League y Conference League ya NO están bloqueadas (corregido el 30/08: el bloqueo que describía esta línea había dejado de existir en el código antes de esa fecha) — sorteo real y calendario de jornadas de las tres cargados, ver §3 sesión 30/08 (continuación). `docs/clasificados-2026-27.md` sigue desactualizado en su diagnóstico de bloqueo, pendiente de revisar.

## 5. Backlog congelado

| Qué | Congelado desde | Revisión |
|---|---|---|
| Validación UEFA: publicar los 3 artefactos (Champions, Europa, Conference) y simulación completa de todas las rondas previas verificando la cadena de guardado/recarga | 09/08/2026 | Octubre 2026 |
| Simulador CAF Champions League | 09/08/2026 | Después del 14/09 |
| Revisión del logo para redes sociales | 09/08/2026 | Post-relanzamiento |
| Limpieza de las 36 ramas `claude/*` abiertas | 17/08/2026 | No antes del 14/09 |

## 6. Decisiones cerradas

| Fecha | Decisión |
|---|---|
| 09/07 | Modo Competición es marca de producto independiente de @CarlosGilAnalis, que queda como canal de distribución personal |
| 09/07 | Simulador UEFA en un solo artefacto con estado compartido. `window.storage` está aislado por artefacto, así que tres artefactos separados no pueden compartir datos |
| 09/08 | X es el único canal de difusión. Telegram descartado: los grupos privados no tienen potencial viral |
| 09/08 | Temporada objetivo de toda la expansión: 2026/27 |
| 09/08 | El deadline del simulador AFC es el inicio de la fase de liga (14/09), no el día del sorteo (18/08) |
| 09/08 | El artículo AFC se publica de forma independiente del simulador, sin esperarlo |
| 11/08 | El descenso entre competiciones ocurre ronda a ronda, no solo en la transición a fase de liga |
| 11/08 | Los flags de origen (`origen_ida`, `origen_vuelta`) van a nivel de campo, no de eliminatoria, para permitir "ida real, vuelta simulada" |
| 17/08 | El gate del menú del 09/08 era válido: la fusión está en `main` vía PR #14. Ambigüedad de rama cerrada |
| 17/08 | Opus con esfuerzo alto solo para arquitectura e investigación crítica. Sonnet sin thinking, esfuerzo medio, para ejecución recurrente |
| 17/08 | Adoptado el sistema de organización v1.1: ESTADO.md como fuente única, regla del renglón, decidir en Projects y ejecutar en Code |
| 17/08 | `docs/ESTADO.md` creado. Al redactarlo se corrigió la sección "En producción" del borrador: faltaban en la lista de artículos publicados "Fase de liga y eliminatorias UEFA" y "Clasificación para la EURO 2028", ya enrutados en `App.jsx` |
| 22/08 | Confirmado que git no está instalado en el equipo local de Carlos (verificado por `Test-Path` en la ruta estándar de Program Files y búsqueda completa del disco C:). No es bloqueante: Claude Code gestiona git en su propio entorno cloud contra el repo, con independencia del sistema local de Carlos |
| 22/08 | Cerrado el mapeo completo de las ocho carpetas antiguas (Codigo, docs, Documentos, Articulos, Difusion, Nations League, Previas Europeas, Fase Liga, prompts) al árbol canónico de seis carpetas (00-entrada, 01-referencia, 02-competiciones, 03-difusion, 04-planificacion, 99-archivo) en `C:\Users\carlo\OneDrive\Documentos\Carlos\Futbol\Claude\Modo Competicion\`. Sin pérdida de contenido, verificado con `Test-Path` antes de cada borrado de carpetas vacías. Las credenciales de Vercel (`Dominio.txt`, `recovery-codes.txt`) se movieron fuera del árbol del proyecto, a una carpeta separada de credenciales privadas — no se archivan ni se suben nunca al repo |
| 22/08 | Confirmado el sistema de organización como completo y operativo desde el 17/08 (`ESTADO.md`, `ARQUITECTURA.md`, `MARCA.md`, `CONVENCIONES.md` ya viven en `docs/` del repo) |
| 22/08 | PR #35 (`docs/ARQUITECTURA.md`, `docs/MARCA.md`, `docs/CONVENCIONES.md`) confirmado fusionado a `main` — se fusionó el 17/08/2026 a las 06:07 UTC, el mismo día que se abrió. La entrada de la sección "En curso" que lo describía como abierto y pendiente de fusión estaba desactualizada |
| 22/08 | Gate semanal 22/08: no avanzó el deadline (simulador AFC, 14/09). Primer "no" — si el próximo lunes también es "no", la semana siguiente se dedica en exclusiva al deadline y todo lo demás se congela |
| 25/08 | Gate semanal 25/08: segundo "no" seguido (deadline simulador AFC, 14/09). Se aplica la regla: semana 25-31 congelada, dedicada en exclusiva al simulador AFC. Excepción explícita y consciente: seguimiento y difusión de los 3 días finales de las previas UEFA (fecha fija, no se puede aparcar). Esta excepción no reabre el resto del backlog congelado — solo cubre las previas UEFA |
| 25/08 | Capa 1 del simulador AFC Champions League Elite completada y en producción. PR #39 (motor de sorteo por rejilla — mecanismo real distinto del bombo-contra-bombo UEFA, verificado contra el sorteo real del 18/08/2026 y con miles de simulaciones —, pool real de 32 equipos, `useAFCChampionsElite`, ruta y layout) y PR #40 (enlace al simulador en el menú "Clubes" y en las tarjetas de la landing, ausente en el primer despliegue) fusionados a `main` |
| 25/08 | Rama `claude/afc-champions-simulator-scope-33hge2` resuelta: todo su contenido ya está en `main` vía los dos merges (squash), sin diferencia de contenido restante. Pendiente solo borrarla |
| 27/08 | Playoff de Champions League 2026/27 cargado y resuelto (7/7 eliminatorias, fase de liga UCL 36/36) vía PR #43. Europa League y Conference League quedan pendientes — sus Playoff (12 y 24 eliminatorias) no se han jugado. Incidencia detectada tras el PR #43: Vercel no generó deployment de Production para el commit de fusión (Production se quedó clavada en el commit de 3 días antes, sin Building ni Error para el nuevo). Se descartaron caché de navegador y proyecto/dominio equivocado. Se resolvió con un push adicional a `main` (PR #44, doc): el deployment siguiente sí se disparó y Carlos confirmó el cambio en producción. Causa raíz del fallo puntual del webhook sin confirmar |
| 27/08 | Artículo "Procedimiento del sorteo de la fase de liga UCL 2026/27" fusionado a `main` (fast-forward, commit `0d39dab`, rama `claude/articulo-procedimiento-sorteo-ucl-15e1g6`). Rama local borrada. El borrado de la rama remota falló con HTTP 403 en tres intentos (dos vía `git push --delete`, uno con refspec explícito `:refs/heads/...`), mismo error en los tres; no hay tool de borrado de rama en el set de GitHub MCP disponible. Es una restricción del proxy git de la sesión, no bloqueo de protección de rama de GitHub. Pendiente borrarla a mano desde GitHub — no bloquea nada, ya está fusionada e íntegra en `main` |
| 27/08 | Hilo de X para el artículo del procedimiento del sorteo redactado y entregado a Carlos (gancho + 4 tweets de desarrollo + cierre con enlaces a artículo y simulador, hashtags solo en el primer y último tweet). Pensado para publicarse a las 15:00, tres horas antes del sorteo real de Champions (18:00) para capturar la expectación sin arriesgar desfase, ya que el artículo es solo procedimiento y no caduca con el resultado del sorteo. Publicación manual pendiente por parte de Carlos, no se gestiona desde el repo |
| 28/08 | Playoff de Europa League (12/12) y Conference League (24/24) 2026/27 cargado y resuelto vía PR #46 (rama `claude/playoff-uefa-resultados-851dma`, squash-merge a `main`, commit `53d7cc7`). Corregida una ida ya cargada e incorrecta (Lincoln Red Imps–Larne, "2-1" → "0-2") tras confirmación explícita de Carlos contra la página oficial de "Play-offs - Ida" de la UEFA — no se asumió, se paró y se preguntó antes de tocar un dato marcado como real. Aclarado (sin resolver la pregunta abierta de §8) que el contrato de campo `origen_ida`/`origen_vuelta` de ARQUITECTURA.md §2 y el campo único `origen` del código conviven en capas distintas: el JSON de datos usa el primero, el estado en vivo de React deriva el segundo a partir de los marcadores — no son versiones contradictorias del mismo dato, sino dos representaciones a distinto nivel |
| 28/08 | Precedente del 27/08 (Vercel sin generar deployment de Production tras un merge) no verificado todavía para este merge (PR #46, commit `53d7cc7`) — pendiente que Carlos confirme en el dashboard de Vercel o en producción; si no dispara, el fix conocido es un push adicional a `main` |
| 28/08 | Carlos lanza en paralelo otra tarea en un chat de Code distinto mientras se cerraba esta sesión. Recomendado que esa sesión arranque su rama desde `main` en su punta actual (ya incluye el merge de PR #46) para evitar una base obsoleta, sobre todo si toca `docs/ESTADO.md` o el mismo dataset JSON de resultados reales |
| 28/08 | Esa sesión en paralelo era la tarea de cargar el sorteo real de la fase de liga de la Champions League 2026/27 (sorteo del 27/08/2026) — cambio de alcance consciente por Carlos respecto a la tarea de resultados de Playoff, no continuación de ella. Confirmado que para *sorteos* (a diferencia de *resultados*) el código ya usaba un tercer patrón, distinto de los dos que documenta la pregunta abierta de §8 (`origen_ida`/`origen_vuelta` vs. campo `origen`): un objeto `sorteoReal` fijo a nivel de módulo, comparado por referencia (`esSorteoReal`), con `restaurarSorteoReal()` — ya usado por el sorteo real del AFC Champions Elite y por Ronda 3/Playoff de Champions. Se ha extendido ese mismo patrón a la fase de liga UCL sin mecanismo nuevo; la UI de edición campo a campo y restauración (`FaseLigaPanel`) ya era genérica y no ha hecho falta tocarla. 144 emparejamientos verificados por conteos exactos (ver §3). Fusionado a `main` (squash, commit `9afa0f1`, PR #47, rama `claude/load-champions-league-draw-pstwwu`), deployment de Production confirmado por Carlos sin el problema de webhook del 27/08 |
| 28/08 | Intento de borrar la rama remota `claude/load-champions-league-draw-pstwwu` tras su fusión: mismo error HTTP 403 ya documentado el 27/08 (restricción del proxy git de la sesión, no protección de rama de GitHub; tampoco hay tool de borrado de rama en el set de GitHub MCP disponible). Rama fusionada e íntegra en `main`, pendiente borrarla a mano desde GitHub — no bloquea nada |
| 30/08 | Sesión de calendario de jornadas UEFA abierta en una rama nueva (`claude/calendario-jornadas-uefa-o25mv4`), no en `claude/load-champions-league-draw-pstwwu` (la del sorteo del 27/08, ya fusionada a `main`). Carlos confirmó seguir en la rama nueva al preguntársele, ya que reabrir la original no tenía sentido (ya integrada). Ambas ramas parten del mismo commit (`9d6a2df`, punta de `main`), sin pérdida de contexto |
| 30/08 | Alcance de la tarea de calendario de jornadas reducido a solo Champions League tras detectar que Europa League y Conference League no tienen sorteo real cargado (sus fases de liga siguen bloqueadas, ver "En curso"). Carlos decidió no ampliar hoy a cargar también esos sorteos reales — queda como tarea separada, futura, cuando se resuelva el bloqueo de los 4 caídos de Ronda 3 UCL |

## 7. Aparcadero

_(Ideas surgidas a mitad de sesión. Se revisa los viernes, nunca antes.)_

- Script de PowerShell para repartir de golpe los archivos antiguos de la carpeta local
- Formalizar como skill el ciclo modificar → gate → desplegar en Code
- El intercambio manual de visitantes en la fase de liga (edición campo a campo) regenera el reparto de jornadas con el algoritmo genérico (`repartirJornadas`), no con el calendario real (`UCL_JORNADA_REAL`/`UEL_JORNADA_REAL`/`UECL_JORNADA_REAL`, las tres cargadas el 30/08). Tras un intercambio, la fecha mostrada junto a una jornada deja de corresponder con exactitud a los partidos que contiene. Afecta a las tres competiciones UEFA por igual. No bloquea nada mientras no se edite, pero es una inconsistencia latente
- `docs/clasificados-2026-27.md` quedó desactualizado el 28/08: sigue diciendo que las fases de liga de Europa League y Conference League están bloqueadas, cuando ya no lo estaban desde antes del 30/08. Pendiente corregir ese documento (no se tocó en esta sesión, fuera del alcance declarado)
- Varios coeficientes UEFA usados en `coefFaseLiga` (marcados `/* estimado */` en el código) no coinciden con los oficiales que usó la UEFA para el sorteo real: al intentar derivar los bombos de Europa League y Conference League ordenando por esos coeficientes, 25/36 y 10/36 equipos respectivamente quedaban mal clasificados. No bloquea nada porque los bombos reales de esas dos competiciones ya están cargados a mano (`UEL_POT_REAL`/`UECL_POT_REAL`), pero cualquier lógica que siga confiando en `coefFaseLiga` para desempates o visualización (p. ej. el orden dentro de cada bombo mostrado en pantalla) puede no reflejar el criterio oficial real

## 8. Preguntas abiertas

- El registro irreverente de Modo Competición sigue sin calibrar con ejemplos propios reales. La voz de objetivoanalista.com es técnica y didáctica, no es esa. Bloquea afinar el tono de los artículos nuevos.
- Search Console: 0 keywords confirmadas a fecha de la última revisión (09/08). Sin señal orgánica todavía; pendiente de volver a mirar en el cierre del Sprint (24/08).
- `ARQUITECTURA.md` §2 describe flags `origen_ida`/`origen_vuelta` a nivel de campo. El código real (`useOrigenResultados`, `src/App.jsx`) usa en su lugar un único campo `origen` por eliminatoria con tres estados (`real`, `editado`, `real-incompleto`). Señalado el 17/08 y dejado sin corregir a petición explícita — pendiente decidir si se actualiza el documento o el código.
