# SISTEMA — Modo Competición

**Versión 1.1 — 17 de agosto de 2026**
*(Reconstruido el 22/08/2026 a partir del chat original, tras confirmarse que el
archivo nunca llegó a `main`. Ver nota al final sobre partes no recuperadas.)*

Sistema de organización para trabajar en Modo Competición en solitario, con
tiempo limitado, repartido entre Claude.ai (dos Projects), Claude Code Desktop
y Cowork puntual.

---

## Los dos problemas que resuelve

1. **No hay una única fuente de verdad del estado del proyecto.** Las
   decisiones viven solo en chats sueltos y desaparecen cuando la conversación
   se cierra o se pierde entre docenas de chats.
2. **El alcance se amplía a mitad de sesión sin que el coste quede declarado.**
   Una idea nueva se evalúa aunque luego se descarte, y esa evaluación ya
   consume la sesión.

---

## 1–2. Documentos de sistema y arquitectura

Ver `ESTADO.md`, `ARQUITECTURA.md`, `MARCA.md` y `CONVENCIONES.md` en `docs/`
del repo — este documento (`SISTEMA.md`) es el quinto y describe el
funcionamiento del sistema en sí, no el estado ni la arquitectura del producto.

---

## 3. Ritmo de sesiones y cortes horarios

Tres sesiones fijas semanales: **viernes** (planificación), **domingo**
(ejecución técnica — después de TAI, que es intocable), **lunes** (cierre
editorial). Los cortes de abajo son relativos al inicio de la sesión, no a
horas de reloj fijas.

**El domingo es la sesión frágil** — viene después de dos horas de TAI. No se
planifica trabajo que requiera decidir, solo ejecutar algo ya decidido el
viernes. Si el viernes no dejó una tarea única escrita, el domingo no se abre
Code: se dedica a escribirla.

**TAI no se toca.** Si un domingo hay conflicto, lo que cede es Modo
Competición, nunca al revés.

### Sesión de 2 h (domingo)

| Minuto | Qué |
|---|---|
| 0–10 | Leer `ESTADO.md`. Confirmar en voz alta la tarea única y su criterio de hecho |
| 10–80 | Ejecución |
| 45 | **Punto de control:** si la tarea no está al 50%, se parte en dos y se ejecuta solo la primera mitad. No se alarga |
| 80–100 | Verificación / gate, con nombre de rama declarado |
| 100 | **Corte duro:** no se empieza nada nuevo |
| 100–115 | Cierre: actualizar `ESTADO.md`, resolver ramas |
| 115–120 | Margen |

### Sesión de 1 h (viernes)

| Minuto | Qué |
|---|---|
| 0–10 | Leer `ESTADO.md`. Revisar el Aparcadero de la semana |
| 10–40 | Decidir: tarea única del domingo, tarea única del lunes, qué se congela |
| 40–55 | Escribirlo en `ESTADO.md` (secciones 3 y 5). Vaciar Aparcadero |
| 55–60 | Margen |

### Criterios de reversión (explícitos, para no decidirlos con cansancio)

- **Tarea al 50% en el minuto 45** → se parte en dos: se entrega la mitad estable, la otra va a "En curso" con su rama.
- **El gate falla en la ventana de verificación** → se revierte la rama, no se toca `main`. No se arregla al final de la sesión — un arreglo rápido a los 95 minutos es la peor decisión disponible.
- **Algo a medias en el minuto 100** → se queda en rama, se anota en "En curso". Nunca push a `main` con dudas.
- **Duda sobre en qué rama está algo** → se para y se verifica antes de fusionar.

---

## 4. Mecanismo anti-ampliación de alcance: la regla del renglón

Al inicio de cada sesión hay **un solo renglón** en `ESTADO.md` sección 3: la
tarea única y su criterio de hecho. Cualquier idea que surja después **no se
evalúa** — se escribe en el Aparcadero y se sigue.

> El Aparcadero se lee los viernes. Nunca antes.

Este freno no se aplica por fuerza de voluntad — va en las Instructions de
ambos Projects y en el arranque de Code:

```
Si Carlos propone durante la sesión algo que no es la tarea única declarada en
ESTADO.md, no lo evalúes, no lo planifiques y no lo empieces. Anótalo en el
Aparcadero, recuérdale el criterio de hecho pendiente, y sigue.

Única excepción: si Carlos dice literalmente "cambio de alcance consciente".
En ese caso, antes de hacer nada, pregúntale qué tarea del plan se cae a cambio.
El alcance es de suma cero: no se añade sin quitar.
```

Lo que hace que funcione es el coste declarado: "¿qué se cae a cambio?"
convierte una ampliación gratuita en un intercambio, y casi siempre el
intercambio no compensa.

### Gate semanal (lunes, en el cierre)

Una sola pregunta:

> **¿Ha avanzado esta semana el deadline duro más próximo?**

Si la respuesta es no dos semanas seguidas, la semana siguiente completa se
dedica a ese deadline y todo lo demás se congela. Sin discusión.

---

## 5. Rutinas y Skills a formalizar

Tareas que aparecen varias veces en el historial y no deberían resolverse
desde cero cada vez.

| Rutina | Frecuencia observada | Formato | Prioridad |
|---|---|---|---|
| Arranque y cierre de sesión | Cada sesión | Prompts fijos | Alta |
| Reconstruir "¿por dónde iba?" | Cada sesión | Sustituido por `ESTADO.md` | Alta |
| Gate + cierre de rama en Code | Cada sesión técnica | Comando o skill en Code | Alta |
| Hilo/tweets de X por publicación | 2 veces documentadas | Skill en Project editorial | Media |
| Investigación Fase 1 de competición | 3 veces (AFC, CAF, datos UEFA) | Plantilla parametrizable | Media |
| Prompt de ingeniería artículo + simulador | 4 generados | Skill | Media |
| Revisión GA4 + Search Console | 2 veces | Prompt guardado | Baja |
| Generación de `.ics` de planificación | 2 veces | No formalizar — es puntual | — |

---

## 6. Organización de ficheros en local

### 6.1 Ruta canónica

```
C:\Users\carlo\OneDrive\Documentos\Carlos\Futbol\Claude\Modo Competicion\
```

**Regla dura:** si algún día se clona el repositorio en local, va **fuera de
OneDrive**. La sincronización de OneDrive sobre `.git` produce corrupción de
índice y conflictos de bloqueo.

### 6.2 Qué va en local y qué no

| Tipo de archivo | Dónde |
|---|---|
| `ESTADO.md`, `ARQUITECTURA.md`, `MARCA.md`, `CONVENCIONES.md`, `SISTEMA.md` | **Solo en el repo.** Nunca copia local editable |
| Investigación de datos por competición | Local + Project editorial |
| Prompts reutilizables y plantillas | Local |
| Capturas de GA4 / Search Console | Local |
| Hilos y kits de difusión ya publicados | Local |
| Planes y `.ics` | Local |
| Código, datos del simulador | **Solo repo** |

**Principio:** local es el archivo de trabajo y las descargas de Claude. Nada
que sea fuente de verdad vive aquí — es la lección de los cuatro `.md` de
julio, que se generaron, se descargaron y murieron ahí sin llegar al repo.

**Regla de bolsillo:** si Code puede escribirlo, va al repo. Si es una
descarga, una captura o un `.ics`, va a local.

### 6.3 Estructura

```
Futbol\Claude\Modo Competicion\
├── 00-entrada\              Descargas de Claude sin clasificar. Se vacía cada lunes al cerrar
├── 01-referencia\           Plantillas y prompts reutilizables (NO documentos de sistema)
├── 02-competiciones\        Investigación y datos verificados, por competición
│   ├── uefa-2026-27\
│   ├── afc-2026-27\
│   └── caf-2026-27\
├── 03-difusion\             Hilos, tweets, kits de lanzamiento, capturas de analítica
│   ├── hilos-publicados\
│   └── analitica\
├── 04-planificacion\        Planes, .ics, sprints
└── 99-archivo\              Histórico cerrado
```

---

## 7. Pendiente conocido

**El registro irreverente sigue sin calibrar con ejemplos propios reales.**

Es el hueco más antiguo del proyecto (abierto desde el 09/07/2026). Las
referencias de tono están claras en la Skill `estilo-modo-competicion`, pero no
existe un texto propio que sirva de patrón — la única muestra de voz larga es
la de objetivoanalista.com, que es la voz equivocada para esto.

**Consecuencia:** cada artículo nuevo recalibra el tono desde cero. Se
resolvería escribiendo o marcando dos o tres párrafos propios que sí den en el
tono buscado, y guardándolos como referencia en la Skill.

---

## Nota sobre esta reconstrucción (22/08/2026)

Este documento se recuperó buscando en el chat original del 17/08 tras
confirmarse que el archivo nunca se subió al repo (no está en `main` ni en
ninguna de las 39 ramas, ni ha existido nunca en el historial de commits).

Las secciones 1–7 de arriba están reconstruidas con el texto original tal
como se generó aquel día. Si al releerlo detectas algo que falta o no
coincide con lo que recuerdas de esa sesión, dilo antes de subirlo — es
mejor corregirlo ahora que dar por bueno un documento incompleto.
