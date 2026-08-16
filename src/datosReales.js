import { useState, useEffect } from "react";

// ============================================================
// Puente entre el dataset estático de resultados reales
// (public/uefa-fase-previa-2026-27-eliminatorias.json) y el estado
// interactivo del simulador (resR1/resR2 de useChampions/useEuropa/useConference).
//
// Solo se usa para precargar Q1 y Q2: son los únicos cruces con bracket fijo
// (conocido de antemano, no fruto de un sorteo de la app) así que el emparejamiento
// real coincide siempre con el emparejamiento del simulador. A partir de Q3 el
// cruce lo decide un sorteo (real o simulado) que la app no reproduce
// deterministamente, así que ahí NO se precarga nada automáticamente — el usuario
// sigue sorteando/simulando/introduciendo resultados a mano como hasta ahora.
//
// El emparejamiento de nombres es EXACTO tras pasar por ALIAS (abajo). Si el
// nombre del simulador (ni él ni su alias) coincide carácter a carácter con
// equipo_a/equipo_b del dataset, esa eliminatoria simplemente no se precarga
// (falla en silencio hacia "sin precargar", nunca hacia un cruce equivocado).
// ============================================================

// Mismo club, nombre distinto en el dataset de ingesta que en las constantes
// del simulador (CL_RONDA1/EL_RONDA1/CO_RONDA1 etc.). Verificado uno a uno
// contra el dataset — no son adivinados por parecido. Clave = nombre en el
// simulador, valor = nombre en el dataset.
const ALIAS = {
  "Flora Tallinn": "Flora",
  "Iberia Tbilisi": "Iberia 1999",
  "Inter Escaldes": "Inter Club d'Escaldes",
  "KuPS Kuopio": "KuPS",
  "Vitebsk": "ML Vitebsk",
  "Petrocub": "Petrocub Hîncești",
  "Borac": "Borac Banja Luka",
  "Győri ETO": "ETO Győr",
  "Kairat Almaty": "Kairat",
  "Klaksvík": "KÍ",
  "Sheriff": "Sheriff Tiraspol",
  "Derry": "Derry City",
  "Bohemian FC": "Bohemians",
  "St Joseph's FC": "St Joseph's",
  "Ilves Tampere": "Ilves",
  "Dinamo-Minsk": "Dinamo Minsk",
  "Žalgiris Vilnius": "Žalgiris",
  "Levadia Tallinn": "FCI Levadia",
  "Víkingur": "Víkingur Gøta",
  "Virtus 1964": "Virtus",
  "Europa FC": "Europa",
  "Santa Coloma": "FC Santa Coloma",
  "Aarhus": "AGF",
  "Crvena Zvezda": "Red Star Belgrade",
  "GNK Dinamo": "Dinamo Zagreb",
  "Hammarby": "Hammarby IF",
  "Hapoel Beer-Sheva": "Hapoel Be'er Sheva",
  "Hearts": "Heart of Midlothian",
  "Maccabi Tel-Aviv": "Maccabi Tel Aviv",
  "Mjällby": "Mjällby AIF",
  "Omonoia": "Omonia",
  "Apollon": "Apollon Limassol",
  "Başakşehir": "İstanbul Başakşehir",
  "Beitar": "Beitar Jerusalem",
  "DAC 1904": "DAC Dunajská Streda",
  "Göteborg": "IFK Göteborg",
  "Hapoel Tel-Aviv": "Hapoel Tel Aviv",
  "Katowice": "GKS Katowice",
  "Ludogorets": "Ludogorets Razgrad",
  "Neftchi": "Neftçi",
  "Paksi": "Paks",
  "Polissya": "Polissya Zhytomyr",
  "Raków": "Raków Częstochowa",
  "SK Rapid": "Rapid Wien",
  "Zimbru": "Zimbru Chișinău",
  "Zrinjski": "Zrinjski Mostar",
  // Nuevos entrantes de Ronda 3 / Playoff (no aparecen hasta esas rondas)
  "NEC Nijmegen": "NEC",
  "Sparta Praga": "Sparta Prague",
  "Olympiakos": "Olympiacos",
  "AEK Atenas": "AEK Athens",
  "LASK Linz": "LASK",
  "Salzburgo": "Red Bull Salzburg",
  "Sint-Truidense": "Sint-Truiden",
  "OFI Creta": "OFI",
  "Friburgo": "Freiburg",
  "Mónaco": "Monaco",
};
function normaliza(nombre) { return ALIAS[nombre] || nombre; }

let cachePromise = null;
export function cargarResultadosReales() {
  if (!cachePromise) {
    cachePromise = fetch("/uefa-fase-previa-2026-27-eliminatorias.json").then((r) => {
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      return r.json();
    });
  }
  return cachePromise;
}

// Hook: carga el dataset una vez (compartido entre CL/EL/CO vía caché de módulo)
// y devuelve { eliminatorias, error } — eliminatorias es null mientras carga.
export function useResultadosReales() {
  const [eliminatorias, setEliminatorias] = useState(null);
  const [error, setError] = useState(null);
  useEffect(() => {
    let vivo = true;
    cargarResultadosReales()
      .then((d) => { if (vivo) setEliminatorias(d.eliminatorias); })
      .catch((err) => { if (vivo) setError(err.message); });
    return () => { vivo = false; };
  }, []);
  return { eliminatorias, error };
}

function marcador(str) {
  if (!str) return null;
  const partes = str.split("-").map((n) => parseInt(n, 10));
  if (partes.length !== 2 || partes.some((n) => Number.isNaN(n))) return null;
  return partes;
}

// ¿Existe en el dataset un cruce real de competicion/ronda entre estos dos
// equipos, tenga o no marcador todavía? A diferencia de resultadoRealParaCruce,
// SÍ cuenta los "pendiente" — el Playoff, por ejemplo, ya está sorteado en la
// realidad aunque no se haya jugado ningún partido, así que el emparejamiento
// se puede usar igual (solo el marcador, si lo hay, se consulta aparte).
export function existeCrucePendiente(eliminatorias, competicion, ronda, nombreA, nombreB) {
  const dsA = normaliza(nombreA), dsB = normaliza(nombreB);
  return eliminatorias.some((x) =>
    x.competicion === competicion && x.ronda === ronda &&
    ((x.equipo_a === dsA && x.equipo_b === dsB) || (x.equipo_a === dsB && x.equipo_b === dsA))
  );
}

// Busca en el dataset la eliminatoria real de `competicion`/`ronda` cuyo par de
// equipos (en cualquier orden) coincide EXACTAMENTE con nombreA/nombreB, y
// devuelve el resultado ya orientado a la perspectiva nombreA=A / nombreB=B que
// usa el simulador (idaA/idaB/vueltaA/vueltaB). Null si no hay match exacto o si
// el partido está "pendiente" (sin marcadores todavía).
export function resultadoRealParaCruce(eliminatorias, competicion, ronda, nombreA, nombreB) {
  const dsA = normaliza(nombreA), dsB = normaliza(nombreB);
  const e = eliminatorias.find((x) =>
    x.competicion === competicion && x.ronda === ronda &&
    ((x.equipo_a === dsA && x.equipo_b === dsB) || (x.equipo_a === dsB && x.equipo_b === dsA))
  );
  if (!e || e.estado === "pendiente") return null;
  const invertido = e.equipo_a === dsB;
  const ida = marcador(e.marcador_ida);
  const vuelta = marcador(e.marcador_vuelta);
  if (!ida && !vuelta) return null;
  const resultado = {};
  if (ida) { resultado.idaA = invertido ? ida[1] : ida[0]; resultado.idaB = invertido ? ida[0] : ida[1]; }
  if (vuelta) { resultado.vueltaA = invertido ? vuelta[1] : vuelta[0]; resultado.vueltaB = invertido ? vuelta[0] : vuelta[1]; }
  // El dataset no trae el desglose de goles de la prórroga (no se puede rellenar
  // sin inventarlo), pero si hubo tanda de penaltis sí trae su marcador final —
  // se precarga igualmente: el simulador solo lo usa una vez el usuario complete
  // la prórroga (necesaria para llegar a la fase de penaltis), así que no se
  // muestra hasta entonces, pero ya está ahí cuando haga falta.
  const penaltis = marcador(e.penaltis);
  if (penaltis) { resultado.penA = invertido ? penaltis[1] : penaltis[0]; resultado.penB = invertido ? penaltis[0] : penaltis[1]; }
  // clasificado se devuelve en el "dominio" de nombres del simulador (nombreA/nombreB
  // tal y como los pasó quien llama), no en el del dataset — para que se pueda
  // encadenar (p. ej. usar el ganador de Q1 como nombreA de un cruce de Q2).
  const clasificado = e.clasificado === dsA ? nombreA : e.clasificado === dsB ? nombreB : null;
  return { resultado, clasificado, estado: e.estado };
}

// Devuelve, para una lista de cruces fijos (id/a/b), el objeto { id: resultado }
// solo con los que han encontrado match real. `ronda` es "Q1" o "Q2" (nombres
// del dataset), no "R1"/"R2" (nombres internos de la app).
export function precargarRonda(eliminatorias, competicion, ronda, cruces) {
  const out = {};
  cruces.forEach((c) => {
    const r = resultadoRealParaCruce(eliminatorias, competicion, ronda, c.a, c.b);
    if (r) out[c.id] = r.resultado;
  });
  return out;
}

// Para R2, algunos lados son "ganador de R1-x" en vez de un nombre literal.
// Esta función resuelve esos lados directamente contra los resultados reales de
// Q1 (no contra el estado en vivo del simulador), para poder precargar Q2 sin
// depender de que el usuario ya haya introducido nada en Q1.
export function ganadorRealR1(eliminatorias, competicion, tieR1) {
  if (!tieR1) return null;
  const r = resultadoRealParaCruce(eliminatorias, competicion, "Q1", tieR1.a, tieR1.b);
  return r ? r.clasificado : null;
}

// Análogo a ganadorRealR1 pero devuelve el eliminado — lo usa Conference League
// para precargar los cruces de Q2 que enfrentan a perdedores de Champions/Europa
// League Q1 (reequilibrio entre competiciones).
export function perdedorRealR1(eliminatorias, competicion, tieR1) {
  if (!tieR1) return null;
  const r = resultadoRealParaCruce(eliminatorias, competicion, "Q1", tieR1.a, tieR1.b);
  if (!r || !r.clasificado) return null;
  return r.clasificado === tieR1.a ? tieR1.b : tieR1.a;
}

// A diferencia de Q1/Q2 (bracket fijo), los cruces de Q3 y Playoff los decide un
// sorteo — pero ese sorteo YA SE HIZO en la realidad, así que en vez de simularlo
// de nuevo se puede reconstruir emparejando el pool de equipos que llegan a la
// ronda (pool = ganadores reales de la ronda anterior + nuevos entrantes) contra
// los cruces reales del dataset. Solo se usa el resultado si TODO el pool se
// empareja (cada equipo encuentra a su rival real dentro del propio pool): si
// falta alguno (p. ej. porque el usuario editó un resultado y ahora hay un
// equipo que en la realidad no llegó a esta ronda), no se inventa nada — se
// devuelve incompleto y quien llama debe recurrir al sorteo normal.
export function sorteoRealParaPool(eliminatorias, competicion, ronda, pool) {
  const usados = new Set();
  const cruces = [];
  pool.forEach((equipo) => {
    if (usados.has(equipo.nombre)) return;
    const rival = pool.find((otro) =>
      otro.nombre !== equipo.nombre && !usados.has(otro.nombre) &&
      existeCrucePendiente(eliminatorias, competicion, ronda, equipo.nombre, otro.nombre)
    );
    if (!rival) return;
    usados.add(equipo.nombre); usados.add(rival.nombre);
    // "cabeza" pasa a ser quien juega la ida en casa según el dataset real
    // (equipo_a), no el de mayor coeficiente — así el simulador respeta el
    // calendario real de ida/vuelta en vez de reordenar por ranking UEFA.
    const dsA = normaliza(equipo.nombre), dsB = normaliza(rival.nombre);
    const entrada = eliminatorias.find((x) =>
      x.competicion === competicion && x.ronda === ronda &&
      ((x.equipo_a === dsA && x.equipo_b === dsB) || (x.equipo_a === dsB && x.equipo_b === dsA))
    );
    const [cabeza, rival2] = entrada && entrada.equipo_a === dsB ? [rival, equipo] : [equipo, rival];
    cruces.push({ cabeza, rival: rival2 });
  });
  return { cruces, completo: pool.length > 0 && usados.size === pool.length };
}
