# Clasificados 2026/27 — Fase de liga UEFA (estado parcial, 28/08/2026)

**Rama:** `claude/playoff-uefa-resultados-851dma`
**Fuente de datos:** `public/uefa-fase-previa-2026-27-eliminatorias.json` — Playoff de Champions League (7/7, 25/08/2026) y Playoff de Europa League (12/12) y Conference League (24/24), vueltas jugadas el 26–27/08/2026 (dato aportado directamente en sesión, sin URL individual por partido; reutiliza el enlace genérico de calendario que ya usaba el resto del dataset de cada competición).

**Corrección de dato:** `UECL-PO-CH-05` (Lincoln Red Imps – Larne) tenía cargada una ida incorrecta ("2-1"). Confirmada contra la página "Play-offs - Ida" de la UEFA y corregida a "0-2" (Lincoln Red Imps 0 – Larne 2) antes de cargar la vuelta.

**Estado: Playoff de las tres competiciones completo (7/7 UCL + 12/12 UEL + 24/24 UECL).** Las fases de liga de Europa League y Conference League siguen bloqueadas — no por su propio Playoff (ya resuelto), sino porque aún faltan los caídos que llegan desde la competición superior (ver §2 y §3).

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

## 2. Europa League — Playoff COMPLETO (12/12), fase de liga sigue bloqueada

`src/App.jsx` (`poolsPO()` de `useEuropa`) exige 12 eliminatorias propias (6 Ruta Campeones + 6 Ruta Liga) para completar los 36 de su fase de liga (13 directos + 12 propios + 11 caídos de Champions).

| Eliminatoria | Ida | Vuelta | Agregado | Clasifica |
|---|---|---|---|---|
| Trabzonspor – Ferencváros | 0-1 | 0-4 | 0-5 | **Ferencváros** |
| Universitatea Craiova – Ararat-Armenia | 1-1 | 0-1 | 1-2 | **Ararat-Armenia** |
| Sint-Truiden – Omonia | 1-0 | 2-4 | 3-4 | **Omonia** |
| Red Star Belgrade – Viktoria Plzeň | 3-0 | 1-5 | 4-5 | **Viktoria Plzeň** (prórroga) |
| Egnatia – Lillestrøm | 0-0 | 1-2 | 1-2 | **Lillestrøm** (prórroga) |
| Jagiellonia Białystok – Iberia 1999 | 4-0 | 2-1 | 6-1 | **Jagiellonia Białystok** |
| Mjällby AIF – Red Bull Salzburg | 0-1 | 0-3 | 0-4 | **Red Bull Salzburg** |
| Kairat – Anderlecht | 0-3 | 0-3 | 0-6 | **Anderlecht** |
| Lech Poznań – Thun | 7-0 | 2-2 | 9-2 | **Lech Poznań** |
| Beşiktaş – Kauno Žalgiris | 3-0 | 0-1 | 3-1 | **Beşiktaş** |
| Benfica – AGF | 3-1 | 3-1 | 6-2 | **Benfica** |
| OFI – CSKA Sofia | 3-0 | 2-0 | 5-0 | **OFI** |

**12/12 resueltas ✓.** Sigue bloqueada la fase de liga: de los 11 "caídos de Champions" que también necesita, solo se conocen 7 (los perdedores del Playoff de Champions, §1); los otros 4 (perdedores de Ronda 3 Ruta Liga de Champions) no se han cargado — fuera del alcance de esta sesión.

---

## 3. Conference League — Playoff COMPLETO (24/24), fase de liga sigue bloqueada

`src/App.jsx` (`poolsPO()` de `useConference`) exige 24 eliminatorias propias (5 Ruta Campeones + 19 Ruta Liga) para completar los 36 de su fase de liga (24 propios + 12 caídos del Playoff de Europa League — la Conference no reparte plazas directas).

| Eliminatoria | Ida | Vuelta | Agregado | Clasifica |
|---|---|---|---|---|
| Víkingur Reykjavík – Borac Banja Luka | 1-3 | 1-3 | 2-6 | **Borac Banja Luka** |
| Shamrock Rovers – KuPS | 1-1 | 0-1 | 1-2 | **KuPS** |
| Drita – Inter Club d'Escaldes | 2-2 | 0-0 | 2-2 (4-2 pen.) | **Inter Club d'Escaldes** (penaltis, sin prórroga registrada) |
| KÍ – Riga | 0-0 | 1-2 | 1-2 | **Riga** |
| Lincoln Red Imps – Larne | 0-2 (corregido, ver arriba) | 3-0 | 3-2 | **Lincoln Red Imps** (prórroga) |
| Motherwell – Freiburg | 1-3 | 1-4 | 2-7 | **Freiburg** |
| Górnik Zabrze – Monaco | 2-3 | 1-4 | 3-7 | **Monaco** |
| Inter Turku – Copenhagen | 0-0 | 1-4 | 1-4 | **Copenhagen** |
| Heart of Midlothian – Rapid Wien | 2-2 | 2-2 | 4-4 (4-3 pen.) | **Heart of Midlothian** (penaltis, sin prórroga registrada) |
| Tromsø – Brighton & Hove Albion | 0-0 | 0-4 | 0-4 | **Brighton & Hove Albion** |
| Hajduk Split – Raków Częstochowa | 2-2 | 3-2 | 5-4 | **Hajduk Split** (prórroga) |
| Panathinaikos – Hradec Králové | 2-2 | 2-1 | 4-3 | **Panathinaikos** (prórroga) |
| Gent – Hibernian | 0-0 | 3-2 | 3-2 | **Gent** |
| PAOK – Brann | 1-1 | 2-3 | 3-4 | **Brann** |
| Atalanta – Hapoel Tel Aviv | 0-0 | 1-0 | 1-0 | **Atalanta** |
| Midtjylland – Rijeka | 2-0 | 4-1 | 6-1 | **Midtjylland** |
| Rangers – Jablonec | 1-0 | 0-1 | 1-1 (3-4 pen.) | **Jablonec** (penaltis, sin prórroga registrada) |
| Nordsjælland – St. Gallen | 1-0 | 3-2 | 4-2 | **Nordsjælland** |
| Dinamo City – Pafos | 1-1 | 2-4 | 3-5 | **Pafos** (prórroga) |
| Sion – Ajax | 2-4 | 3-5 | 5-9 | **Ajax** |
| Braga – Austria Wien | 2-0 | 0-0 | 2-0 | **Braga** |
| Twente – Qarabağ | 0-1 | 4-1 | 4-2 | **Twente** (prórroga) |
| Getafe – Partizan | 3-1 | 1-2 | 4-3 | **Getafe** |
| Lugano – Maccabi Tel Aviv | 2-1 | 1-1 | 3-2 | **Lugano** |

**24/24 resueltas ✓.** Sigue bloqueada la fase de liga: depende de los 12 perdedores del Playoff de Europa League (§2), que ya están resueltos y disponibles vía la cadena de hooks `useEuropa → useConference` (no requiere carga manual adicional).

---

## 4. Conteos exactos (resumen del gate)

| Competición | Playoff esperado | Playoff resuelto | Fase de liga |
|---|---|---|---|
| Champions League (UCL) | 7 | **7/7** | **36/36 ✓** |
| Europa League (UEL) | 12 | **12/12 ✓** | ⚠️ bloqueada — faltan 4 caídos de Champions Ronda 3 Ruta Liga (fuera de alcance) |
| Conference League (UECL) | 24 | **24/24 ✓** | ⚠️ bloqueada — depende de que se cargue la fase de liga de Europa League primero |

## 5. Veredicto

- **Playoff de las tres competiciones (43 eliminatorias UCL+UEL+UECL): APTO.** 7/7 + 12/12 + 24/24, conteos verificados contra `src/App.jsx` y agregados verificados aritméticamente (ida+vuelta=agregado, penaltis solo donde el agregado queda empatado) para las 36 cargadas hoy.
- **Fases de liga de Europa League y Conference League: siguen NO APTO**, no por su Playoff (ya resuelto) sino por datos de rondas anteriores de Champions que no se han cargado — pendiente de otra sesión.
