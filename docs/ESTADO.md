# ESTADO — Modo Competición

**Última actualización:** 17/08/2026 — cierre de segunda sesión de lunes

Este documento es la única fuente de verdad del estado del proyecto. Si una copia en un Project lo contradice, gana esta. Se actualiza al cierre de cada sesión de Code y los viernes al planificar.

## 1. En producción

**Plataforma**

- modocompeticion.com — React/Vite, desplegado en Vercel desde `main` (repo `carlosgilanalista-art/modo-competicion`). Dominio en IONOS.
- Google Analytics 4 (`G-J93TNQ8R8M`) y Search Console activos y vinculados.
- Menú de Clubes agrupado por confederación (UEFA / AFC), en `main` desde el 09/08 (PR #14).
- Sistema de documentación en `docs/`: `ESTADO.md` en `main` desde el 17/08 (PR #34).

**Simuladores**

- Simulador UEFA unificado: Champions, Europa y Conference en un solo artefacto, con estado compartido.
- Modo confirmado vs simulado con cascada de invalidación.
- Datos reales de la fase previa 2026/27 cargados y editables, hasta Ronda 3 completa y sorteo de Playoff.
- "Restaurar sorteo real" y "Restaurar todos los reales"; resolución directa por penaltis cuando no hay prórroga registrada.
- Simulador de selecciones: Nations League 2026/27 y clasificación para la EURO 2028.

**Artículos publicados**

- Fases Previas UEFA (1 y 2)
- Fase de liga y eliminatorias UEFA
- Nations League 2026/27
- Clasificación para la EURO 2028
- AFC Champions League Elite 2026/27 — explicación

## 2. Deadlines duros

| Fecha | Qué | Qué pasa si se incumple |
|---|---|---|
| 14/09/2026 | Simulador AFC Champions League Elite publicado | Arranca la fase de liga. Publicar después pierde toda la ventana de interés: el simulador deja de servir para anticipar y pasa a competir con los resultados reales |
| 24/08/2026 | Cierre del Sprint Relanzamiento (25/07–24/08) | No es una entrega, es un punto de medición. Sin él no hay criterio para decidir la siguiente fase de difusión |

## 3. Tarea única de la próxima sesión

**Sesión:** 23/08/2026 (domingo)
**Tarea:** (por definir — se fija el viernes 21)
**Criterio de hecho:**
**Herramienta:** Claude Code

## 4. En curso

- Datos reales UEFA fase previa 2026/27 — Ronda 3 completa y sorteo de Playoff cargados. Pendiente incorporar los resultados del Playoff conforme se jueguen. Sin rama abierta: el trabajo se ha ido integrando en `main`.
- `docs/ARQUITECTURA.md`, `docs/MARCA.md` y `docs/CONVENCIONES.md` — creados. PR [#35](https://github.com/carlosgilanalista-art/modo-competicion/pull/35) abierto en rama `claude/create-estado-docs-3ukmag`, CI en verde, sin comentarios pendientes, sin conflictos. Pendiente de fusión a `main`.

## 5. Backlog congelado

| Qué | Congelado desde | Revisión |
|---|---|---|
| Validación UEFA: publicar los 3 artefactos (Champions, Europa, Conference) y simulación completa de todas las rondas previas verificando la cadena de guardado/recarga | 09/08/2026 | Octubre 2026 |
| Simulador CAF Champions League | 09/08/2026 | Después del 14/09 |
| Revisión del logo para redes sociales | 09/08/2026 | Post-relanzamiento |
| Limpieza de las 36 ramas `claude/*` abiertas | 17/08/2026 | No antes del 14/09 |
| Reparto de archivos antiguos en las carpetas locales | 17/08/2026 | 24/08, o nunca |

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

## 7. Aparcadero

_(Ideas surgidas a mitad de sesión. Se revisa los viernes, nunca antes.)_

- Script de PowerShell para repartir de golpe los archivos antiguos de la carpeta local
- Formalizar como skill el ciclo modificar → gate → desplegar en Code

## 8. Preguntas abiertas

- El registro irreverente de Modo Competición sigue sin calibrar con ejemplos propios reales. La voz de objetivoanalista.com es técnica y didáctica, no es esa. Bloquea afinar el tono de los artículos nuevos.
- Search Console: 0 keywords confirmadas a fecha de la última revisión (09/08). Sin señal orgánica todavía; pendiente de volver a mirar en el cierre del Sprint (24/08).
- `ARQUITECTURA.md` §2 describe flags `origen_ida`/`origen_vuelta` a nivel de campo. El código real (`useOrigenResultados`, `src/App.jsx`) usa en su lugar un único campo `origen` por eliminatoria con tres estados (`real`, `editado`, `real-incompleto`). Señalado el 17/08 y dejado sin corregir a petición explícita — pendiente decidir si se actualiza el documento o el código.
