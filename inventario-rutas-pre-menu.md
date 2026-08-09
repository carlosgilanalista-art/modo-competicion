# Inventario de rutas — pre reagrupación de menú "Clubes"

Fecha: 2026-08-09. Extraído leyendo código (no navegación). Todas las rutas son
**hash routing** manual (no hay `react-router` ni ninguna librería de rutas en
`package.json`: solo `react` y `react-dom`). El router vive en
`src/App.jsx:4423-4444` (`useHashRoute()` + variable `vista`).

## A) Tabla de rutas

| Ruta | Fichero donde se define | Componente | ¿En el menú? | ¿En el sitemap? | Notas |
|---|---|---|---|---|---|
| `#/` | `src/App.jsx:4444` (catch-all incluido) | `Landing` (`src/Landing.jsx`) | Sí — logo/"MODO COMPETICIÓN" y "← Inicio" en cabeceras de artículos | No existe sitemap | También es la vista que se muestra para **cualquier** hash no reconocido (no hay 404 real) |
| `#/formato` | `src/App.jsx:4444` | `Articulo` (`src/Articulo.jsx`) | Sí — dropdown "Clubes → Fases previas" (`Landing.jsx:205`) | No existe sitemap | Explicación Champions/Europa/Conference, fase previa |
| `#/formato-liga` | `src/App.jsx:4444` | `ArticuloFaseLiga` (`src/ArticuloFaseLiga.jsx`) | Sí — dropdown "Clubes → Liga y eliminatorias" (`Landing.jsx:206`) | No existe sitemap | Comprobado: el check `startsWith("#/formato-liga")` se evalúa **antes** que `startsWith("#/formato")` en la cadena de ternarios (`App.jsx:4444`), así que no hay colisión aunque una empieza igual que la otra |
| `#/nations-league` | `src/App.jsx:4444` | `ArticuloNationsLeague` (`src/ArticuloNationsLeague.jsx`) | Sí — dropdown "Selecciones → Nations League 2026/27 → Explicación" (`Landing.jsx:211`) | No existe sitemap | |
| `#/euro2028` | `src/App.jsx:4444` | `ArticuloEuro2028` (`src/ArticuloEuro2028.jsx`) | Sí — dropdown "Selecciones → Clasificación Euro 2028 → Explicación" (`Landing.jsx:214`) | No existe sitemap | Ver ATENCIÓN: el propio artículo dice que la Eurocopa "aún no tiene su modo", pero el simulador sí existe y está enlazado en el menú |
| `#/simulador-selecciones` | `src/App.jsx:4444` | `SimuladorNationsLeaguePage` (`src/App.jsx:3315`) | Sí — dropdown "Selecciones → Nations League 2026/27 → Simulador" (`Landing.jsx:210`) | No existe sitemap | Comprobado antes que `#/simulador` en la cadena de ternarios para evitar que el prefijo compartido la capture |
| `#/simulador-clasificacion-euro2028` | `src/App.jsx:4444` | `SimuladorEuro2028Page` (`src/App.jsx:4372`) | Sí — dropdown "Selecciones → Clasificación Euro 2028 → Simulador" (`Landing.jsx:213`) | No existe sitemap | Es el primer check de la cadena de ternarios (comentario explícito en `App.jsx:4442-4443` explicando por qué debe ir primero: comparte prefijo con `#/simulador`) |
| `#/simulador` | `src/App.jsx:4444` y `4484-4545` | vista "simulador" (tabs CL/EL/CO) dentro de `App` | Sí — enlazado desde artículos ("Simulador clubes" / "Simulador") pero **no** desde el menú superior de `Landing.jsx` (allí solo están las variantes con parámetro `/cl`, `/el`, `/co`) | No existe sitemap | Sin sufijo de club, la pestaña activa es la que ya estuviera en el estado `tab` (por defecto `"CL"`, `App.jsx:4439`) |
| `#/simulador/cl` (ruta dinámica) | `src/App.jsx:4447-4450` | vista "simulador" con `tab="CL"` | Sí — dropdown "Clubes → Champions League" (`Landing.jsx:201`) y tarjetas de la home/modal | No existe sitemap | Ruta dinámica — ver sección ATENCIÓN para el detalle de parámetros |
| `#/simulador/el` (ruta dinámica) | `src/App.jsx:4447-4450` | vista "simulador" con `tab="EL"` | Sí — dropdown "Clubes → Europa League" (`Landing.jsx:202`) | No existe sitemap | Ruta dinámica |
| `#/simulador/co` (ruta dinámica) | `src/App.jsx:4447-4450` | vista "simulador" con `tab="CO"` | Sí — dropdown "Clubes → Conference League" (`Landing.jsx:203`) | No existe sitemap | Ruta dinámica |

## B) Lista plana de rutas estáticas (checklist)

```
#/
#/formato
#/formato-liga
#/nations-league
#/euro2028
#/simulador
#/simulador-selecciones
#/simulador-clasificacion-euro2028
#/simulador/cl
#/simulador/el
#/simulador/co
```

(Las tres últimas se listan aquí porque su valor de parámetro es fijo en todos
los enlaces existentes — CL/EL/CO — aunque técnicamente el router las trata
como una ruta dinámica `#/simulador/:tab`.)

## C) ATENCIÓN

### Rutas en el router sin enlace en el menú
- **`#/simulador` (sin sufijo)**: no está enlazada en el `<nav>` de `Landing.jsx`
  (los dropdowns solo enlazan `#/simulador/cl|el|co`). Sí está enlazada desde
  dentro de los artículos (`Articulo.jsx:208`, `ArticuloFaseLiga.jsx:131`,
  `ArticuloNationsLeague.jsx:46`) y desde la propia vista simulador
  (`App.jsx:4491`). No es una ruta "huérfana" — funciona y tiene tráfico
  entrante — pero no aparece en el menú principal como tal.

### Rutas enlazadas en el menú que no existen en el router
- No se ha encontrado ninguna. Todos los `href="#/..."` localizados en
  `Landing.jsx`, `Articulo.jsx`, `ArticuloFaseLiga.jsx`,
  `ArticuloNationsLeague.jsx`, `ArticuloEuro2028.jsx` y `App.jsx` corresponden
  a una de las 8 ramas del router.

### Rutas dinámicas y parámetros
- **`#/simulador/:tab`**: el router (`App.jsx:4447-4450`) hace
  `hash.split("/")[2]`, lo pasa a mayúsculas y solo acepta `"CL"`, `"EL"` o
  `"CO"`. Cualquier otro valor (`#/simulador/xyz`, `#/simulador/`) **no
  cambia la pestaña activa** ni produce error — simplemente no coincide con
  el `includes` y se queda con el `tab` que hubiera en memoria (por defecto
  `"CL"` la primera vez que se carga la página). No hay validación ni
  redirección; es un fallback silencioso, no verificado como "bug" pero sí
  como comportamiento a tener en cuenta si cambias el menú de clubes.

### Discrepancias entre router, sitemap y configuración de despliegue
- **No existe `vercel.json`** en el repo (comprobado en la raíz). No hay
  rewrites/redirects/headers configurados explícitamente. Al ser rutas por
  `#` (hash), esto no supone un problema de despliegue: Vercel sirve siempre
  `index.html` para cualquier ruta y el router vive enteramente en el
  cliente, así que no hace falta un rewrite de servidor para las rutas
  internas.
- **No existe sitemap** (ni estático `.xml` en `public/`, ni generador en
  `scripts/`). Los dos ficheros de `scripts/` (`euro2028-sim.mjs`,
  `euro2028-validate.mjs`) son scripts de simulación/validación de datos, no
  generadores de sitemap.
- **No existe `robots.txt`** tampoco.
- Al no haber sitemap ni SSR, cualquier motor de búsqueda que no ejecute JS
  no vería ninguna de estas rutas como URLs indexables independientes (todas
  cuelgan de la misma `index.html` con fragmento `#`); `useDocumentMeta.js`
  ya lo advierte en su propio comentario ("Sin SSR, esto no ayuda a bots que
  no ejecutan JS"). Esto es una inconsistencia SEO que no me has pedido
  revisar, pero te la señalo porque afecta a cómo se "ve" el inventario de
  rutas desde fuera del código.

### Rutas duplicadas o solapadas
- No hay rutas duplicadas. Sí hay **solapamiento de prefijos intencionado y
  ya resuelto con el orden de los ternarios**:
  - `#/simulador-clasificacion-euro2028` empieza igual que `#/simulador`.
  - `#/simulador-selecciones` empieza igual que `#/simulador`.
  - `#/formato-liga` empieza igual que `#/formato`.
  El propio código lo señala con un comentario explícito en
  `App.jsx:4442-4443`. Mientras se mantenga ese orden de comprobación, no
  hay colisión. Si al reagrupar el menú se añaden nuevas rutas con prefijos
  parecidos (p. ej. algo que empiece por `#/simulador-uefa` o similar),
  revisa ese orden.

### Otro hallazgo fuera de lo pedido
- **`ArticuloEuro2028.jsx:162-163`** dice textualmente que "la Eurocopa aún
  no tiene su modo [de simulación]", pero el simulador de clasificación a la
  Euro 2028 **sí existe** (`#/simulador-clasificacion-euro2028`,
  `SimuladorEuro2028Page`) y está enlazado tanto en el menú de `Landing.jsx`
  como en el propio artículo (`ArticuloEuro2028.jsx:47`, "Simulador
  selecciones" — que de hecho apunta a `#/simulador-selecciones`, el de
  Nations League, no al de Euro 2028). Es un texto desactualizado, no un
  problema de rutas, pero conviene saberlo antes de tocar nada del menú.

## Recuento exacto

- **Rutas estáticas**: 8 (`#/`, `#/formato`, `#/formato-liga`,
  `#/nations-league`, `#/euro2028`, `#/simulador`, `#/simulador-selecciones`,
  `#/simulador-clasificacion-euro2028`)
- **Rutas dinámicas**: 1 patrón (`#/simulador/:tab`), con 3 valores de
  parámetro observados en el código (`cl`, `el`, `co`)
- **Total de destinos distintos enlazados hoy**: 11 (8 estáticas + 3
  instancias de la dinámica)
