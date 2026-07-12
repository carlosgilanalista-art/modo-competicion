# Investigación: método de sorteo de la fase liga (UCL, UEL, UECL)

> Documento de investigación previo a la implementación de las fases liga en el simulador.
> Basado en la reglamentación oficial UEFA (temporada 2025/26, tercera edición del formato,
> vigente sin cambios estructurales para 2026/27) y fuentes secundarias fiables citadas al final.
>
> Nota: el TXT del reglamento de Champions adjuntado por el usuario llegó vacío (0 bytes),
> por lo que toda la información se ha contrastado directamente contra fuentes públicas de UEFA.

---

## 1. Marco común a las tres competiciones

Desde 2024/25 las tres competiciones (Champions League, Europa League y Conference League)
usan el mismo modelo de **fase liga** ("sistema suizo"): 36 equipos en una única clasificación,
cada uno juega un número fijo de partidos a una sola vuelta contra rivales distintos, sin grupos.

El sorteo de emparejamientos está regulado en el **Artículo 16 ("Draw system – league phase")**
del reglamento de cada competición, complementado por un documento de **"Draw Procedure"**
que la UEFA publica antes de cada sorteo, aprobado por el UEFA Club Competitions Committee.

Reglas comunes a las tres:

1. **Bombos por coeficiente**: los 36 clubes se reparten en bombos según su
   **coeficiente de club UEFA** vigente a inicio de temporada (el mismo dato que ya usa
   el panel de coeficientes del simulador para las fases previas).
2. **Protección de país (misma federación)**: un equipo **no puede enfrentarse a un club
   de su propia federación**.
3. **Límite por federación ajena**: un equipo puede ser emparejado con **un máximo de 2
   clubes de una misma federación distinta a la suya**.
4. **Sorteo asistido por software**: el emparejamiento lo realiza un software automatizado
   (desarrollado con AE Live, auditado por EY), porque el número de combinaciones (~1.000
   millones de emparejamientos posibles) hace inviable un sorteo 100 % manual. El software
   comprueba en cada paso que no se genera un **callejón sin salida** (deadlock): antes de
   asignar un rival verifica que el resto del sorteo sigue teniendo solución válida.
5. **El sorteo solo determina rivales y sede (casa/fuera)**. El **calendario** (jornada,
   fecha y hora de cada partido) lo fija la UEFA días después con un algoritmo separado,
   con condicionantes de TV, clubes de la misma ciudad, restricciones policiales, clima, etc.
   No forma parte del sorteo en sí.

---

## 2. UEFA Champions League — fase liga

**Fuente reglamentaria**: Reglamento UCL 2025/26, Artículo 16, y "UCL League Phase Draw Procedure" (UEFA).

### Formato
- 36 equipos, **8 partidos** cada uno: **4 en casa y 4 fuera**, contra 8 rivales distintos.

### Bombos
- **4 bombos de 9 equipos**, ordenados por coeficiente de club.
- **Excepción del campeón**: el **vigente campeón de la Champions ocupa la posición 1 del
  Bombo 1** aunque su coeficiente no sea el más alto. El resto del Bombo 1 y los bombos
  2–4 se rellenan estrictamente por coeficiente. (Desde 2024/25 ya no hay plaza de bombo 1
  para campeones de ligas top; solo cuenta el coeficiente + la excepción del campeón.)
- El campeón de la Europa League entra en la fase liga de la UCL, pero se ubica en el bombo
  que le corresponda por coeficiente (no tiene privilegio de bombo).

### Mecánica del sorteo
1. Se sortea **bombo a bombo, empezando por el Bombo 1** y en orden descendente.
2. Cada equipo del bombo en curso se extrae **manualmente con bolas físicas**.
3. Para el equipo extraído, el software sortea al azar sus **8 rivales: 2 de cada uno de
   los 4 bombos** (incluido su propio bombo), decidiendo a la vez **cuál de los dos se
   juega en casa y cuál fuera** (1 en casa y 1 fuera por bombo).
4. Restricciones: nunca contra su propia federación; máximo 2 rivales de una misma
   federación ajena; el software descarta combinaciones que bloqueen el sorteo.

### Caso práctico de restricción extra (2025/26)
Con 6 clubes ingleses en la fase liga, la UEFA añadió una regla operativa: todos los clubes
no ingleses del Bombo 1 debían recibir exactamente 2 rivales ingleses, porque cualquier otra
distribución hacía matemáticamente imposible completar el sorteo. Es un buen ejemplo de que
el simulador debe implementar la comprobación de viabilidad (deadlock check), no solo las
reglas estáticas.

---

## 3. UEFA Europa League — fase liga

**Fuente reglamentaria**: Reglamento UEL 2025/26, Artículo 16, y "UEL League Phase Draw Procedure" (UEFA).

### Formato
- 36 equipos, **8 partidos** cada uno: **4 en casa y 4 fuera** (idéntico a la UCL).

### Bombos
- **4 bombos de 9 equipos**, asignados **exclusivamente por coeficiente de club**.
- **No hay regla de campeón**: en la UEL no se reserva la posición 1 del Bombo 1 a ningún
  título (el campeón de la UEL asciende a la UCL; el campeón de la Conference entra en la
  fase liga de la UEL, pero en el bombo que le toque por coeficiente).

### Mecánica del sorteo
1. Mismas reglas de emparejamiento que la UCL: **2 rivales de cada bombo** (uno en casa,
   otro fuera), sin rivales de la propia federación y máximo 2 de una misma federación ajena.
2. Diferencia operativa: el sorteo es **100 % digital**. Con una sola pulsación el software
   sortea de golpe los emparejamientos de los 36 equipos, y los resultados se **revelan
   bombo a bombo empezando por el Bombo 1** (la revelación progresiva es solo puesta en
   escena; el sorteo ya está completo).

---

## 4. UEFA Conference League — fase liga

**Fuente reglamentaria**: Reglamento UECL 2025/26, Artículo 16, y "UECL League Phase Draw Procedure" (UEFA).

### Formato
- 36 equipos, **6 partidos** cada uno: **3 en casa y 3 fuera**, contra 6 rivales distintos.
- Es la única de las tres con 6 partidos en lugar de 8.

### Bombos
- **6 bombos de 6 equipos**, asignados por coeficiente de club (sin regla de campeón:
  el campeón de la UECL asciende a la UEL).

### Mecánica del sorteo
1. Cada equipo recibe **1 rival de cada uno de los 6 bombos** (incluido el suyo).
2. **Asignación casa/fuera por pares de bombos**: los bombos se emparejan de forma
   adyacente — **Bombo 1 con Bombo 2, Bombo 3 con Bombo 4, Bombo 5 con Bombo 6**.
   Dentro de cada par, cada equipo juega **un partido en casa y otro fuera**. Así se
   garantiza el equilibrio 3 casa / 3 fuera y un reparto homogéneo de dificultad.
3. Mismas restricciones de federación: prohibido el enfrentamiento intra-federación y
   máximo 2 rivales de una misma federación ajena.
4. Sorteo **100 % digital** en un solo paso, con revelación progresiva bombo a bombo
   (igual que la UEL). Se celebra en la misma gala que el sorteo de la UEL.

---

## 5. Tabla comparativa (resumen para implementación)

| Parámetro | Champions | Europa League | Conference |
|---|---|---|---|
| Equipos | 36 | 36 | 36 |
| Partidos por equipo | 8 (4C/4F) | 8 (4C/4F) | 6 (3C/3F) |
| Bombos | 4 × 9 | 4 × 9 | 6 × 6 |
| Rivales por bombo | 2 (1C + 1F) | 2 (1C + 1F) | 1 |
| Equilibrio casa/fuera | por bombo | por bombo | por par de bombos (1-2, 3-4, 5-6) |
| Campeón vigente en Bombo 1 | Sí (posición 1) | No | No |
| Misma federación | Prohibido | Prohibido | Prohibido |
| Máx. rivales de otra federación | 2 | 2 | 2 |
| Mecánica del sorteo real | Bolas físicas + software por equipo | Digital completo, revelado por bombos | Digital completo, revelado por bombos |
| Comprobación anti-deadlock | Sí | Sí | Sí |

### Implicaciones para el algoritmo del simulador
- El emparejamiento es un problema de **satisfacción de restricciones**: la asignación
  aleatoria ingenua se bloquea con frecuencia. Estrategias válidas: backtracking, o
  reintentar el sorteo completo al detectar un deadlock (lo más simple y suficientemente
  rápido para 36 equipos).
- La restricción "máx. 2 de una misma federación" y la protección de país deben validarse
  **sobre el conjunto completo de rivales**, no bombo a bombo.
- En la UECL el equilibrio casa/fuera se resuelve dentro de cada par de bombos: al asignar
  el rival del bombo A del par, el del bombo B queda condicionado en sede.
- Los bombos pueden derivarse automáticamente del panel de coeficientes ya existente en la
  app, ordenando por coeficiente y aplicando la excepción del campeón solo en la UCL.

---

## 6. Fuentes

### Primarias (UEFA)
- [Reglamento UCL 2025/26, Artículo 16 – Draw system, league phase](https://documents.uefa.com/r/Regulations-of-the-UEFA-Champions-League-2025/26/Article-16-Draw-system-league-phase-Online)
- [UCL League Phase Draw Procedure (PDF oficial)](https://editorial.uefa.com/resources/029c-1e95e1cbbcd9-9ddb0c4f9a94-1000/ucl_league_phase_draw_procedure.pdf)
- [UEL League Phase Draw Procedure (PDF oficial)](https://editorial.uefa.com/resources/029c-1e97e3424ec9-3b08f83fd9c6-1000/uel_league_phase_draw_procedure.pdf)
- [UECL League Phase Draw Procedure (PDF oficial)](https://editorial.uefa.com/resources/029c-1e97e465f313-a2b58db2ada2-1000/uecl_league_phase_draw_procedure.pdf)
- [UEFA.com – Bombos del sorteo UCL 2025/26](https://www.uefa.com/uefachampionsleague/news/029c-1e954c3512ef-8b9c6fa0f83b-1000--champions-league-league-phase-draw-pots-confirmed/)
- [UEFA.com – Bombos del sorteo UEL 2025/26](https://www.uefa.com/uefaeuropaleague/news/029c-1e9739e8b588-5eff2da17807-1000--europa-league-league-phase-draw-pots-confirmed/)
- [UEFA.com – Bombos del sorteo UECL 2025/26](https://www.uefa.com/uefaconferenceleague/news/029c-1e974a3bed51-1f9607a14f3c-1000--league-phase-draw-pots-confirmed-for-the-2025-26-confere/)
- [UEFA.com – Formato y fechas UCL 2026/27](https://www.uefa.com/uefachampionsleague/news/02a6-20d57cfcd03e-407c22a7f465-1000--2026-27-champions-league-teams-dates-draws-format-final/)
- [UEFA.com – Formato y fechas UEL 2026/27](https://www.uefa.com/uefaeuropaleague/news/02a6-20d57d095740-e1e0b3de85df-1000--2026-27-europa-league-teams-dates-draws-format-final/)

### Secundarias fiables
- [Wikipedia – 2025–26 UEFA Champions League league phase](https://en.wikipedia.org/wiki/2025%E2%80%9326_UEFA_Champions_League_league_phase)
- [Wikipedia – 2025–26 UEFA Europa League league phase](https://en.wikipedia.org/wiki/2025%E2%80%9326_UEFA_Europa_League_league_phase)
- [Wikipedia – 2025–26 UEFA Conference League league phase](https://en.wikipedia.org/wiki/2025%E2%80%9326_UEFA_Conference_League_league_phase)
- [Kassiesa – Seeding Champions League 2026/27](https://kassiesa.net/uefa/seedcl2026.html)
- [Kassiesa – Seeding Europa League 2026/27](https://kassiesa.net/uefa/seedel2026.html)
- [Kassiesa – Seeding Conference League 2026/27](https://kassiesa.net/uefa/seedco2026.html)
