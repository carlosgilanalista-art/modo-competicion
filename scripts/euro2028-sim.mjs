// Ejecuta el pipeline completo de la clasificación Euro 2028 (Fase 3) y
// vuelca el resultado por consola, para verificar que los números cuadran
// antes de tocar la UI (Fase 4). Uso: node scripts/euro2028-sim.mjs
// (requiere haber compilado antes con: npm run build:sim)
import { eqSimularPipelineCompleto } from "../dist-sim/App.js";

const r = eqSimularPipelineCompleto();

if (r.error) {
  console.error("ERROR:", r.error);
  process.exit(1);
}

console.log("=== ORIGEN DE CADA ETAPA ===");
console.log(r.origen);

console.log("\n=== RANKING PROVISIONAL NL (54) ===");
r.rankingProvisional.forEach((e, i) => console.log(`${i + 1}. ${e.nombre}`));

console.log("\n=== SORTEO: 12 GRUPOS DE CLASIFICACIÓN ===");
r.sorteo.forEach((g) => console.log(`${g.id} (${g.tamano}): ${g.equipos.map((e) => e.nombre).join(", ")}`));

console.log("\n=== TABLAS FINALES POR GRUPO ===");
for (const [gid, tabla] of r.tablas) {
  console.log(`${gid}: ` + tabla.map((f, i) => `${i + 1}.${f.nombre}(${f.pts}pts)`).join(" "));
}

console.log("\n=== RANKING GENERAL (bandas) ===");
console.log("Banda 1 (ganadores):", r.rankingGeneral.banda1.map((e) => e.nombre));
console.log("Banda 2 (segundos):", r.rankingGeneral.banda2.map((e) => e.nombre));
console.log("Banda 3 (terceros):", r.rankingGeneral.banda3.map((e) => e.nombre));
console.log("Banda 4 (cuartos):", r.rankingGeneral.banda4.map((e) => e.nombre));
console.log("Banda 5 (quintos):", r.rankingGeneral.banda5.map((e) => e.nombre));

console.log("\n=== CLASIFICADOS DIRECTOS (esperado: 20) ===");
console.log(r.directos20, "-> total:", r.directos20.length);

console.log("\n=== PLAZAS DE ANFITRIÓN ===");
console.log("Asignadas:", r.anfitrionesAsignados, "-> usadas:", r.plazasAnfitrionUsadas);

console.log("\n=== REPESCA ===");
console.log("Escenario (según plazas usadas):", r.cfgRepesca);
console.log("Peores segundos disponibles:", r.peoresSegundos);
console.log("Pool NL (ganadores A/B/C libres):", r.poolABC);
console.log("Ganador Liga D puesto 49:", r.ganadorD49);
console.log("Equipos en repesca:", r.repesca.equipos, "-> total:", r.repesca.equipos.length);
console.log("Reparto segundos/NL:", r.repesca.repartoSegundos, "+", r.repesca.repartoNL);

console.log("\n=== CLASIFICADOS FINALES (esperado: 24) ===");
console.log(r.clasificadosFinales, "-> total:", r.clasificadosFinales.length);
console.log("Sin duplicados:", new Set(r.clasificadosFinales).size === r.clasificadosFinales.length);
