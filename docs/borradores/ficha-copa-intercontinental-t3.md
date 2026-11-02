# Ficha — Copa Intercontinental FIFA 2026: T3 (para planificar el viernes 06/11)

Borrador sin commitear. Formato de tarea única de `SISTEMA.md` y `CONVENCIONES.md` §3 y §6.

## Lo primero para decidir el viernes

**Hoy no hay ninguna tarea ejecutable de la Copa Intercontinental.** El módulo y el artículo están al día con todo lo 🟢 publicado a 02/11 (PR #105, #106 y #108). Lo siguiente depende de resultados que aún no existen:

| Hecho que lo desbloquea | Fecha |
|---|---|
| Final de la Libertadores (Palmeiras – Estudiantes), Estadio Centenario | 28/11 |
| P3 Derbi de las Américas, Doha | 09/12 |
| P4 Copa Challenger, Doha | 12/12 |
| P5 Final, Al Rayyan | 16/12 |

Por tanto, el viernes 06/11 **no se fija** esta tarea para el domingo 08/11 ni para el jueves 12/11. Se agenda para después del 28/11 (T3) y después de cada partido de diciembre (T4).

## T3 — Fijar el campeón de la Libertadores (desde el 29/11)

**Tarea única:** pasar la plaza CONMEBOL de "finalistas" a "campeón" en `src/data/copaIntercontinental2026.js` y actualizar el texto del artículo que depende de ello.

**Paso 0, solo lectura, antes de escribir nada**
1. Confirmar el campeón en CONMEBOL.com (🟢). Un resultado solo de prensa no vale.
2. Confirmar que `PLAZA_CONMEBOL.estado` es `"finalistas"` y que `candidatos` son `palmeiras` y `estudiantes`.
3. Listar dónde aparecen "Palmeiras o Estudiantes" y "finalistas" en `src/`. A fecha de hoy: `PLAZA_CONMEBOL.articulo.equipo`, y las secciones 02 y 06 de `src/ArticuloCopaIntercontinental.jsx`.

**Cambios previstos**
- `PLAZA_CONMEBOL.estado = "campeon"` y `campeon = <id del ganador>`.
- `PLAZA_CONMEBOL.articulo.equipo` pasa al nombre del campeón.
- Artículo, sección 02: la frase de la final pasa a pretérito con el resultado. Sección 06: se quita la línea del 28/11 y el rival de Toluca queda con nombre.
- El resto, sin tocar. En el simulador desaparece el selector de plaza (`PLAZA_CONMEBOL.estado !== "campeon"`) y P3 usa el campeón. Es un efecto del código existente, no un cambio nuevo.

**Criterio de hecho (cantidades exactas)**
- 5 partidos en `PARTIDOS`; con `real` distinto de `null`: 2 (P1 y P2), sin cambios.
- `plazaConmebolId(...)` devuelve el id del campeón con cualquier selección.
- Build limpio. En el navegador: `#/simulador-copa-intercontinental` sin selector y con P3 = Toluca – campeón; `#/copa-intercontinental` con 6 filas en la tabla de equipos y 5 en la del cuadro, y 0 apariciones de "Palmeiras o Estudiantes".
- Gate de `CONVENCIONES.md` §3: rama nombrada, cantidades, veredicto APTO o NO APTO.

**Fuera de alcance:** resultados de P3–P5, horas de inicio, entradas, la regla de suplentes (🔴).

**Configuración:** Sonnet, esfuerzo medio, sin extended thinking (§6). Tarea corta.

## T4 — Cargar P3, P4 y P5 conforme se jueguen (09, 12 y 16/12)

Una tarea por partido, o una sola el 17/12 si se prefiere. Para cada partido:
- Rellenar `real` en `PARTIDOS` con la forma que ya usa el módulo: `{gA, gB}` y, si los hubo, `etA/etB` y `penA/penB`.
- Fuente: crónica oficial de la FIFA (🟢). Nada de resultados de prensa.
- Criterio de hecho: `real` distinto de `null` en 3, 4 o 5 partidos según toque; el simulador los muestra bloqueados ("Confirmado"); el ganador de cada uno alimenta el siguiente; build limpio; gate declarado.
- El artículo se actualiza con la misma regla de entonces: solo lo verificado, sin avisos de lo que falta.

## Pendientes que no bloquean pero conviene cerrar

- **Texto completo del reglamento (arts. 11 y 19).** Hoy solo hay extractos. Si Carlos sube el PDF, se comprueba en una sesión de solo lectura.
- **Tope de suplentes en el acta de P3–P5 y cambio extra por conmoción (🔴).** Siguen sin codificarse.

## Pregunta para el viernes

¿Se agenda T3 para el domingo 29/11 y se deja el jueves 03/12 libre para otra competición? T4 depende de cómo salgan los partidos y no se puede fijar antes.
