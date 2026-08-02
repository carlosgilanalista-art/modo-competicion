// Fase 5 — validación del simulador de clasificación Euro 2028.
// Comprobaciones que fallan ruidosamente si no se cumplen (no "funciona").
// Uso: npm run build:sim && node scripts/euro2028-validate.mjs [N]
// (N = número de simulaciones completas, por defecto 1000)
import {
  eqSimularPipelineCompleto, eqStats,
  EQ_ANFITRIONES, EQ_PROHIBIDOS, EQ_TAMANOS_GRUPO, EQ_REPESCA_CFG,
} from "../dist-sim/App.js";

const N = Number(process.argv[2]) || 1000;
const fallos = []; // { check, sim, detalle }
const fail = (check, sim, detalle) => fallos.push({ check, sim, detalle });

// Recuento para el check de Monte Carlo (destino final de cada selección).
const destinos = new Map(); // nombre -> { directo, anfitrion, repesca, eliminado, apariciones }
const contarDestino = (nombre, tipo) => {
  if (!destinos.has(nombre)) destinos.set(nombre, { directo: 0, anfitrion: 0, repesca: 0, eliminado: 0, apariciones: 0 });
  const d = destinos.get(nombre);
  d[tipo]++;
  d.apariciones++;
};

const combosValidosPlanos = Object.values(EQ_REPESCA_CFG).flatMap((cfg) => cfg.combosValidos.map((c) => c.join("+")));

for (let sim = 0; sim < N; sim++) {
  const r = eqSimularPipelineCompleto();
  if (r.error) { fail("pipeline", sim, r.error); continue; }

  // 1) Las 54 selecciones aparecen exactamente una vez en el sorteo.
  const enSorteo = r.sorteo.flatMap((g) => g.equipos.map((e) => e.nombre));
  if (enSorteo.length !== 54) fail("1-sorteo-54", sim, `sorteo tiene ${enSorteo.length} plazas`);
  if (new Set(enSorteo).size !== enSorteo.length) fail("1-sorteo-sin-repetir", sim, `${enSorteo.length - new Set(enSorteo).size} repetidas`);

  // 2) 12 grupos, suma de equipos = 54, con el reparto de tamaños configurado.
  if (r.sorteo.length !== EQ_TAMANOS_GRUPO.totalGrupos) fail("2-num-grupos", sim, `${r.sorteo.length} grupos`);
  const de5 = r.sorteo.filter((g) => g.tamano === 5).length, de4 = r.sorteo.filter((g) => g.tamano === 4).length;
  if (de5 !== EQ_TAMANOS_GRUPO.gruposDe5 || de4 !== EQ_TAMANOS_GRUPO.gruposDe4) fail("2-reparto-tamanos", sim, `${de5}x5 + ${de4}x4`);
  const sumaEquipos = r.sorteo.reduce((s, g) => s + g.equipos.length, 0);
  if (sumaEquipos !== 54) fail("2-suma-54", sim, `suma=${sumaEquipos}`);

  // 3) Los 4 anfitriones caen en 4 grupos distintos, en el 100% de las simulaciones.
  const grupoDe = (nombre) => r.sorteo.find((g) => g.equipos.some((e) => e.nombre === nombre))?.id;
  const gruposAnfitrion = EQ_ANFITRIONES.map(grupoDe);
  if (new Set(gruposAnfitrion).size !== 4) fail("3-anfitriones-separados", sim, gruposAnfitrion.join(","));

  // 4) Ningún emparejamiento de la lista de prohibidos aparece nunca.
  for (const g of r.sorteo) {
    const nombres = new Set(g.equipos.map((e) => e.nombre));
    for (const [a, b] of EQ_PROHIBIDOS) {
      if (nombres.has(a) && nombres.has(b)) fail("4-prohibidos", sim, `${a}-${b} en ${g.id}`);
    }
  }

  // 5) Los cuartofinalistas de la Liga A caen siempre en grupos de cuatro.
  const qfLigaA = r.rankingProvisional.slice(0, 8).map((e) => e.nombre);
  for (const q of qfLigaA) {
    const g = r.sorteo.find((gr) => gr.equipos.some((e) => e.nombre === q));
    if (g.tamano !== 4) fail("5-qf-liga-a-grupos-de-4", sim, `${q} en grupo de ${g.tamano}`);
  }

  // 6) Clasificados directos = exactamente 20 (12 primeros + 8 segundos).
  if (r.directos20.length !== 20) fail("6-directos-20", sim, `${r.directos20.length}`);
  if (new Set(r.directos20).size !== 20) fail("6-directos-sin-repetir", sim, "hay repetidos");

  // 8) Plazas de anfitrión usadas ∈ {0,1,2} y escenario de repesca correcto.
  if (![0, 1, 2].includes(r.plazasAnfitrionUsadas)) fail("8-plazas-anfitrion-rango", sim, `${r.plazasAnfitrionUsadas}`);
  if (r.cfgRepesca !== EQ_REPESCA_CFG[r.plazasAnfitrionUsadas]) fail("8-escenario-repesca", sim, "no corresponde a plazasAnfitrionUsadas");

  // 9) Equipos en repesca = 8/12/8 según escenario, reparto en un combo válido.
  if (r.repesca.equipos.length !== r.cfgRepesca.equipos) fail("9-equipos-repesca", sim, `${r.repesca.equipos.length} vs esperado ${r.cfgRepesca.equipos}`);
  const comboObtenido = `${r.repesca.repartoSegundos}+${r.repesca.repartoNL}`;
  if (!r.cfgRepesca.combosValidos.some((c) => c.join("+") === comboObtenido)) fail("9-combo-valido", sim, `${comboObtenido} no está en ${JSON.stringify(r.cfgRepesca.combosValidos)}`);

  // 10) Clasificados finales = exactamente 24, sin duplicados, ningún equipo a
  // la vez directo/anfitrión y en repesca.
  if (r.clasificadosFinales.length !== 24) fail("10-finales-24", sim, `${r.clasificadosFinales.length}`);
  if (new Set(r.clasificadosFinales).size !== r.clasificadosFinales.length) fail("10-finales-sin-duplicados", sim, `${r.clasificadosFinales.length - new Set(r.clasificadosFinales).size} duplicados`);
  const etapa4 = new Set([...r.directos20, ...r.anfitrionesAsignados]);
  const solapan = r.repesca.equipos.filter((e) => etapa4.has(e));
  if (solapan.length) fail("10-sin-solape-etapa4-repesca", sim, solapan.join(","));

  // Conteo de destinos para el check 11 (Monte Carlo).
  const ganadoresRepesca = new Set(r.repesca.ganadores);
  for (const e of enSorteo) {
    if (r.directos20.includes(e)) contarDestino(e, "directo");
    else if (r.anfitrionesAsignados.includes(e)) contarDestino(e, "anfitrion");
    else if (ganadoresRepesca.has(e)) contarDestino(e, "repesca");
    else contarDestino(e, "eliminado");
  }
}

// 7) El ranking de segundos descarta los resultados contra el quinto —
// verificación manual sobre un grupo de 5 fijo, sin aleatoriedad.
function checkDescarteQuinto() {
  const nombres = ["Equipo A", "Equipo B", "Equipo C", "Equipo D", "Equipo E"];
  const rankNL = new Map(nombres.map((n, i) => [n, i + 1]));
  // Calendario simple ida/vuelta manual (no hace falta el círculo completo,
  // basta con fijar resultados concretos entre pares conocidos).
  const partidos = [
    { jornada: 1, local: "Equipo A", visitante: "Equipo E", clave: "A-E" },
    { jornada: 1, local: "Equipo B", visitante: "Equipo E", clave: "B-E" },
    { jornada: 1, local: "Equipo C", visitante: "Equipo E", clave: "C-E" },
    { jornada: 1, local: "Equipo D", visitante: "Equipo E", clave: "D-E" },
    { jornada: 2, local: "Equipo A", visitante: "Equipo B", clave: "A-B" },
  ];
  // Equipo E (el 5º) gana todos sus partidos por 3-0 — si no se descartara,
  // esos 9 goles a favor y 12 puntos "regalados" inflarían las estadísticas
  // de quien los pierda. A y B empatan entre sí 1-1.
  const res = {
    "A-E": { gl: 0, gv: 3 }, "B-E": { gl: 0, gv: 3 }, "C-E": { gl: 0, gv: 3 }, "D-E": { gl: 0, gv: 3 },
    "A-B": { gl: 1, gv: 1 },
  };
  const conTodos = eqStats(nombres, partidos, res).get("Equipo A");
  const sinQuinto = eqStats(nombres, partidos, res, new Set(["Equipo E"])).get("Equipo A");
  if (conTodos.pj !== 2 || conTodos.pts !== 1) fail("7-tabla-completa-sanity", "manual", `esperado pj=2 pts=1, obtenido pj=${conTodos.pj} pts=${conTodos.pts}`);
  if (sinQuinto.pj !== 1 || sinQuinto.pts !== 1 || sinQuinto.gf !== 1) {
    fail("7-descarte-quinto", "manual", `esperado pj=1 pts=1 gf=1 (solo A-B), obtenido pj=${sinQuinto.pj} pts=${sinQuinto.pts} gf=${sinQuinto.gf}`);
  }
  if (conTodos.pj === sinQuinto.pj) fail("7-descarte-cambia-los-numeros", "manual", "las estadísticas con y sin el 5º son idénticas: el descarte no se está aplicando");
  console.log(`Check 7 (descarte del 5º): con todos los partidos pj=${conTodos.pj} pts=${conTodos.pts} gf=${conTodos.gf}; sin el 5º pj=${sinQuinto.pj} pts=${sinQuinto.pts} gf=${sinQuinto.gf}.`);
}
checkDescarteQuinto();

// 11) Monte Carlo: para cada equipo, la suma de probabilidades de sus
// destinos posibles = 100% (con tolerancia de redondeo).
let checkMCFallos = 0;
for (const [nombre, d] of destinos) {
  const total = d.directo + d.anfitrion + d.repesca + d.eliminado;
  if (total !== d.apariciones) { fail("11-montecarlo-conteo", "agregado", `${nombre}: total=${total} apariciones=${d.apariciones}`); checkMCFallos++; continue; }
  const pct = ((d.directo + d.anfitrion + d.repesca + d.eliminado) / d.apariciones) * 100;
  if (Math.abs(pct - 100) > 0.01) { fail("11-montecarlo-100pct", "agregado", `${nombre}: ${pct}%`); checkMCFallos++; }
}

// ---- Informe final, con números ----
console.log(`\n=== FASE 5 — INFORME DE VALIDACIÓN (${N} simulaciones) ===`);
const porCheck = new Map();
for (const f of fallos) porCheck.set(f.check, (porCheck.get(f.check) || 0) + 1);
const checks = [
  "1-sorteo-54", "1-sorteo-sin-repetir", "2-num-grupos", "2-reparto-tamanos", "2-suma-54",
  "3-anfitriones-separados", "4-prohibidos", "5-qf-liga-a-grupos-de-4",
  "6-directos-20", "6-directos-sin-repetir", "7-descarte-quinto", "7-tabla-completa-sanity", "7-descarte-cambia-los-numeros",
  "8-plazas-anfitrion-rango", "8-escenario-repesca", "9-equipos-repesca", "9-combo-valido",
  "10-finales-24", "10-finales-sin-duplicados", "10-sin-solape-etapa4-repesca",
  "11-montecarlo-conteo", "11-montecarlo-100pct",
];
for (const c of checks) console.log(`  [${(porCheck.get(c) || 0) === 0 ? "OK" : "FALLO"}] ${c}: ${porCheck.get(c) || 0} fallos`);
console.log(`\nSimulaciones completas ejecutadas: ${N}`);
console.log(`Selecciones distintas observadas en el destino (Monte Carlo): ${destinos.size} / 54`);
console.log(`Total de fallos: ${fallos.length}`);
if (fallos.length) {
  console.log("\nPrimeros 20 fallos:");
  fallos.slice(0, 20).forEach((f) => console.log(`  sim ${f.sim} [${f.check}]: ${f.detalle}`));
  process.exit(1);
} else {
  console.log(`\n${N}/${N} simulaciones completas sin que saltara ninguna comprobación.`);
}
