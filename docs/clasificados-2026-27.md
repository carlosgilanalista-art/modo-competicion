# Clasificados 2026/27 — Fase de liga UEFA (estado parcial, 27/08/2026)

**Rama:** `claude/datos-playoff-uefa-2026-27-2n5owl`
**Fuente de datos:** `public/uefa-fase-previa-2026-27-eliminatorias.json` — Playoff de Champions League actualizado con las 7 vueltas jugadas el 25/08/2026 (dato aportado directamente en sesión, sin URL individual por partido; reutiliza el enlace genérico de calendario que ya usaba el resto del dataset UCL).

**Estado: PARCIAL.** Solo la Champions League tiene su Playoff completo. Europa League y Conference League siguen con su Playoff propio sin jugar — sus fases de liga NO están cerradas y no aparecen en este documento como clasificación final, solo como pendiente marcado.

---

## 1. Champions League — COMPLETA (36/36)

### Playoff (7/7 eliminatorias resueltas)

| Eliminatoria | Ruta | Ida | Vuelta | Agregado | Clasifica |
|---|---|---|---|---|---|
| Levski Sofia – AEK Atenas | Campeones | 0-0 | 0-4 | 0-4 | **AEK Atenas** |
| Dinamo Zagreb – Viking | Campeones | 2-2 | 1-3 | 3-5 | **Viking** |
| Hapoel Be'er Sheva – Sabah | Campeones | 2-1 | 2-5 | 4-6 | **Sabah** |
| Celtic – LASK Linz | Campeones | 3-0 | 1-5 | 4-5 | **LASK Linz** |
| Slovan Bratislava – Celje | Campeones | 1-1 | 2-1 | 3-2 | **Slovan Bratislava** |
| Fenerbahçe – Lyon | Liga | 1-1 | 2-1 | 3-2 | **Fenerbahçe** |
| NEC – Bodø/Glimt | Liga | 1-3 | 0-3 | 1-6 | **Bodø/Glimt** |

5 eliminatorias Ruta Campeones + 2 Ruta Liga = 7/7, según lo que exige `src/App.jsx` (`poolsPO()` de `useChampions`).

Eliminados en el Playoff (descienden a la fase de liga de Europa League — `cl.perdedoresPO` en `src/App.jsx`): Levski Sofia, Dinamo Zagreb, Hapoel Be'er Sheva, Celtic, Celje, Lyon, NEC.

### Fase de liga — 36 equipos

**Vía directa (29):**

| País | Equipos |
|---|---|
| ENG (5) | Arsenal, Manchester City, Manchester United, Aston Villa, Liverpool |
| ITA (4) | Inter, Napoli, Roma, Como |
| ESP (5) | Barcelona, Real Madrid, Villarreal, Atlético de Madrid, Real Betis |
| GER (4) | Bayern de Múnich, Borussia Dortmund, RB Leipzig, VfB Stuttgart |
| FRA (3) | Paris Saint-Germain, Lens, Lille |
| NED (2) | PSV Eindhoven, Feyenoord |
| POR (2) | Porto, Sporting CP |
| BEL (1) | Club Brugge |
| CZE (1) | Slavia Praga |
| TUR (1) | Galatasaray |
| UKR (1) | Shakhtar Donetsk |

**Vía Playoff (7):**

| Equipo | País | Ruta | Ganó a |
|---|---|---|---|
| Sabah | AZE | Campeones | Hapoel Be'er Sheva |
| AEK Atenas | GRE | Campeones | Levski Sofia |
| Viking | NOR | Campeones | Dinamo Zagreb |
| LASK Linz | AUT | Campeones | Celtic |
| Slovan Bratislava | SVK | Campeones | Celje |
| Fenerbahçe | TUR | Liga | Lyon |
| Bodø/Glimt | NOR | Liga | NEC |

**Conteo Champions League:** 29 directos + 7 Playoff = **36/36 ✓**

---

## 2. Europa League — PENDIENTE (Playoff 0/12 jugado)

`src/App.jsx` (`poolsPO()` de `useEuropa`) exige 12 eliminatorias propias (6 Ruta Campeones + 6 Ruta Liga) para completar los 36 de su fase de liga (13 directos + 12 propios + 11 caídos de Champions). Ninguna tiene vuelta todavía — solo la ida, ya cargada en el dataset:

| Eliminatoria | Ida | Vuelta |
|---|---|---|
| Trabzonspor – Ferencváros | 0-1 | pendiente |
| Universitatea Craiova – Ararat-Armenia | 1-1 | pendiente |
| Sint-Truiden – Omonia | 1-0 | pendiente |
| Red Star Belgrade – Viktoria Plzeň | 3-0 | pendiente |
| Egnatia – Lillestrøm | 0-0 | pendiente |
| Jagiellonia Białystok – Iberia 1999 | 4-0 | pendiente |
| Mjällby AIF – Red Bull Salzburg | 0-1 | pendiente |
| Kairat – Anderlecht | 0-3 | pendiente |
| Lech Poznań – Thun | 7-0 | pendiente |
| Beşiktaş – Kauno Žalgiris | 3-0 | pendiente |
| Benfica – AGF | 3-1 | pendiente |
| OFI – CSKA Sofia | 3-0 | pendiente |

**⚠️ NO CUADRA — 0/12 resueltas.** Además, de los 11 "caídos de Champions" que también necesita esta fase de liga, solo se conocen 7 (los perdedores del Playoff de Champions, arriba); los otros 4 (perdedores de Ronda 3 Ruta Liga de Champions) no se han cargado en esta sesión.

---

## 3. Conference League — PENDIENTE (Playoff 0/24 jugado)

`src/App.jsx` (`poolsPO()` de `useConference`) exige 24 eliminatorias propias (5 Ruta Campeones + 19 Ruta Liga) para completar los 36 de su fase de liga (24 propios + 12 caídos del Playoff de Europa League — la Conference no reparte plazas directas). Ninguna tiene vuelta todavía:

| Eliminatoria | Ida | Vuelta |
|---|---|---|
| Víkingur Reykjavík – Borac Banja Luka | 1-3 | pendiente |
| Shamrock Rovers – KuPS | 1-1 | pendiente |
| Drita – Inter Club d'Escaldes | 2-2 | pendiente |
| KÍ – Riga | 0-0 | pendiente |
| Lincoln Red Imps – Larne | 2-1 | pendiente |
| Motherwell – Freiburg | 1-3 | pendiente |
| Górnik Zabrze – Monaco | 2-3 | pendiente |
| Inter Turku – Copenhagen | 0-0 | pendiente |
| Heart of Midlothian – Rapid Wien | 2-2 | pendiente |
| Tromsø – Brighton & Hove Albion | 0-0 | pendiente |
| Hajduk Split – Raków Częstochowa | 2-2 | pendiente |
| Panathinaikos – Hradec Králové | 2-2 | pendiente |
| Gent – Hibernian | 0-0 | pendiente |
| PAOK – Brann | 1-1 | pendiente |
| Atalanta – Hapoel Tel Aviv | 0-0 | pendiente |
| Midtjylland – Rijeka | 2-0 | pendiente |
| Rangers – Jablonec | 1-0 | pendiente |
| Nordsjælland – St. Gallen | 1-0 | pendiente |
| Dinamo City – Pafos | 1-1 | pendiente |
| Sion – Ajax | 2-4 | pendiente |
| Braga – Austria Wien | 2-0 | pendiente |
| Twente – Qarabağ | 0-1 | pendiente |
| Getafe – Partizan | 3-1 | pendiente |
| Lugano – Maccabi Tel Aviv | 2-1 | pendiente |

**⚠️ NO CUADRA — 0/24 resueltas.** Además depende de los 12 perdedores del Playoff de Europa League (sección 2), que tampoco están.

---

## 4. Conteos exactos (resumen del gate)

| Competición | Playoff esperado | Playoff resuelto | Fase de liga |
|---|---|---|---|
| Champions League (UCL) | 7 | **7/7** | **36/36 ✓** |
| Europa League (UEL) | 12 | **0/12** | ⚠️ bloqueada — faltan 12 propios + 4 caídos de Champions Ronda 3 |
| Conference League (UECL) | 24 | **0/24** | ⚠️ bloqueada — faltan 24 propios + 12 caídos del Playoff de Europa League |

## 5. Veredicto

- **Tarea original (las tres fases de liga completas): NO APTO.** Faltan 36 eliminatorias (12 UEL + 24 UECL).
- **Actualización parcial de Champions League (única parte con dato real disponible hoy): APTO.** 7/7 Playoff, 36/36 fase de liga, conteos verificados contra `src/App.jsx`.

Esta es la parte que se sube a producción hoy, a petición explícita, a falta de que se jueguen los Playoff de Europa League y Conference League.
