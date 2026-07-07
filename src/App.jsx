import React, { useState, useMemo } from "react";

// ============================================================
// FUNCIONES COMPARTIDAS
// ============================================================
function estadoEliminatoria(r) {
  if (!r || r.idaA === undefined || r.idaB === undefined || r.vueltaA === undefined || r.vueltaB === undefined)
    return { fase: "sin_datos", aggTied: false, etTied: false };
  let aggA = Number(r.idaA) + Number(r.vueltaA), aggB = Number(r.idaB) + Number(r.vueltaB);
  if (aggA !== aggB) return { fase: "resuelto", ganador: aggA > aggB ? "A" : "B", aggTied: false, etTied: false };
  if (r.etA === undefined || r.etB === undefined) return { fase: "necesita_prorroga", aggTied: true, etTied: false };
  const etA = aggA + Number(r.etA), etB = aggB + Number(r.etB);
  if (etA !== etB) return { fase: "resuelto", ganador: etA > etB ? "A" : "B", aggTied: true, etTied: false };
  if (r.penA === undefined || r.penB === undefined || Number(r.penA) === Number(r.penB)) return { fase: "necesita_penaltis", aggTied: true, etTied: true };
  return { fase: "resuelto", ganador: Number(r.penA) > Number(r.penB) ? "A" : "B", aggTied: true, etTied: true };
}
function resumenTexto(r) {
  if (!r) return "";
  let partes = [];
  if (r.idaA !== undefined && r.idaB !== undefined) partes.push(`Ida ${r.idaA}-${r.idaB}`);
  if (r.vueltaA !== undefined && r.vueltaB !== undefined) {
    let linea = `Vuelta ${r.vueltaB}-${r.vueltaA}`;
    const extras = [];
    if (r.etA !== undefined && r.etB !== undefined) extras.push(`prórroga ${r.etB}-${r.etA}`);
    if (r.penA !== undefined && r.penB !== undefined) extras.push(`pen. ${r.penB}-${r.penA}`);
    if (extras.length) linea += ` (${extras.join(") (")})`;
    partes.push(linea);
  }
  return partes.join(" · ");
}
function validar(value) {
  if (value === "") return undefined;
  const n = parseInt(value, 10);
  if (isNaN(n) || n < 0) return "INVALIDO";
  return n;
}
function rnd5() { return Math.floor(Math.random() * 6); } // 0-5
function generarResultadoAleatorio() {
  let r = { idaA: rnd5(), idaB: rnd5(), vueltaA: rnd5(), vueltaB: rnd5() };
  if (r.idaA + r.vueltaA === r.idaB + r.vueltaB) {
    r.etA = rnd5(); r.etB = rnd5();
    if (r.idaA + r.vueltaA + r.etA === r.idaB + r.vueltaB + r.etB) { r.penA = rnd5(); r.penB = r.penA === 5 ? r.penA - 1 : r.penA + 1; }
  }
  return r;
}
function shuffleCopy(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}
function sortear(plazas) {
  if (plazas.length < 2) return { error: `Faltan equipos (solo ${plazas.length} disponible/s).` };
  if (plazas.length % 2 !== 0) return { error: `Número impar de plazas (${plazas.length}) — revisa resultados o eliminados pendientes de otras competiciones.` };
  const ordenadas = [...plazas].sort((a, b) => b.coef - a.coef);
  const mitad = ordenadas.length / 2;
  const cabezas = shuffleCopy(ordenadas.slice(0, mitad));
  const resto = shuffleCopy(ordenadas.slice(mitad));
  function backtrack(i, usados, asignacion) {
    if (i === cabezas.length) return asignacion;
    const candidatos = resto.map((_, idx) => idx).filter((idx) => !usados.has(idx) && resto[idx].pais !== cabezas[i].pais);
    for (const idx of shuffleCopy(candidatos)) {
      usados.add(idx);
      asignacion.push({ cabeza: cabezas[i], rival: resto[idx] });
      const res = backtrack(i + 1, usados, asignacion);
      if (res) return res;
      usados.delete(idx);
      asignacion.pop();
    }
    return null;
  }
  const resultado = backtrack(0, new Set(), []);
  if (resultado) return { cruces: resultado, bloqueo: false };
  const libres = [...resto];
  const cruces = cabezas.map((cabeza) => ({ cabeza, rival: libres.shift() }));
  if (cruces.some((c) => !c.rival)) return { error: "No se pudo completar el sorteo (datos insuficientes)." };
  return { cruces, bloqueo: true };
}

// ============================================================
// COMPONENTES UI COMPARTIDOS
// ============================================================
function TieResultInputs({ tie, resultado, onChange, onReset, definido = true, colores }) {
  if (!definido) return <div style={{ color: colores.alerta, fontSize: 12, fontStyle: "italic" }}>Rivales aún no definidos — no se puede introducir resultado</div>;
  const set = (field, raw) => { const v = validar(raw); if (v === "INVALIDO") return; onChange(tie.id, field, v); };
  const estado = estadoEliminatoria(resultado);
  const inputStyle = { width: 38, background: colores.inputBg, border: `1px solid ${colores.inputBorder}`, borderRadius: 4, color: colores.acento, padding: "3px 4px", fontFamily: "'JetBrains Mono', monospace", fontSize: 12, textAlign: "center" };
  const penIgual = resultado?.penA !== undefined && resultado?.penB !== undefined && Number(resultado.penA) === Number(resultado.penB);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
        <span style={{ color: colores.textoSuave, fontSize: 11, width: 30 }}>Ida</span>
        <input type="number" min="0" placeholder="A" value={resultado?.idaA ?? ""} onChange={(e) => set("idaA", e.target.value)} style={inputStyle} />
        <span style={{ color: colores.textoSuave }}>-</span>
        <input type="number" min="0" placeholder="B" value={resultado?.idaB ?? ""} onChange={(e) => set("idaB", e.target.value)} style={inputStyle} />
        {resultado && <button onClick={() => onReset(tie.id)} style={{ marginLeft: "auto", background: "none", border: `1px solid ${colores.inputBorder}`, color: colores.textoSuave, borderRadius: 4, padding: "2px 8px", fontSize: 11, cursor: "pointer" }}>↺ reiniciar</button>}
      </div>
      <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
        <span style={{ color: colores.textoSuave, fontSize: 11, width: 30 }}>Vta</span>
        <input type="number" min="0" placeholder="B" value={resultado?.vueltaB ?? ""} onChange={(e) => set("vueltaB", e.target.value)} style={inputStyle} />
        <span style={{ color: colores.textoSuave }}>-</span>
        <input type="number" min="0" placeholder="A" value={resultado?.vueltaA ?? ""} onChange={(e) => set("vueltaA", e.target.value)} style={inputStyle} />
        {estado.aggTied && (
          <>
            <span style={{ color: colores.alerta, fontSize: 11, marginLeft: 6 }}>(prórroga)</span>
            <input type="number" min="0" placeholder="B" value={resultado?.etB ?? ""} onChange={(e) => set("etB", e.target.value)} style={inputStyle} />
            <span style={{ color: colores.textoSuave }}>-</span>
            <input type="number" min="0" placeholder="A" value={resultado?.etA ?? ""} onChange={(e) => set("etA", e.target.value)} style={inputStyle} />
          </>
        )}
        {estado.etTied && (
          <>
            <span style={{ color: colores.alerta, fontSize: 11, marginLeft: 6 }}>(pen.)</span>
            <input type="number" min="0" placeholder="B" value={resultado?.penB ?? ""} onChange={(e) => set("penB", e.target.value)} style={inputStyle} />
            <span style={{ color: colores.textoSuave }}>-</span>
            <input type="number" min="0" placeholder="A" value={resultado?.penA ?? ""} onChange={(e) => set("penA", e.target.value)} style={inputStyle} />
          </>
        )}
      </div>
      {penIgual && <div style={{ color: colores.alerta, fontSize: 11 }}>Los penaltis no pueden terminar en empate</div>}
      {resultado && <div style={{ color: colores.textoSuave, fontSize: 11, fontFamily: "'JetBrains Mono', monospace" }}>{resumenTexto(resultado)}</div>}
    </div>
  );
}

function RutaBadge({ ruta, colores }) {
  const color = ruta === "Campeones" ? colores.rutaCampeones : ruta === "Liga" ? colores.rutaLiga : colores.rutaPrincipal;
  const texto = ruta === "Campeones" ? "RUTA CAMPEONES" : ruta === "Liga" ? "RUTA LIGA" : "RUTA PRINCIPAL";
  return <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: 1, color, border: `1px solid ${color}`, borderRadius: 4, padding: "2px 6px", whiteSpace: "nowrap" }}>{texto}</span>;
}

// Muestra a dónde va el ganador y a dónde va el perdedor de una eliminatoria ya resuelta
function DestinoEquipos({ ganador, perdedor, destinoGanador, destinoPerdedor, colores }) {
  if (!ganador) return null;
  return (
    <div style={{ marginTop: 6, display: "flex", flexDirection: "column", gap: 2 }}>
      <div style={{ color: colores.acento, fontSize: 12 }}>✓ {destinoGanador}: <strong>{ganador.nombre} ({ganador.pais})</strong></div>
      {perdedor && <div style={{ color: colores.textoSuave, fontSize: 12 }}>↳ {destinoPerdedor}: {perdedor.nombre} ({perdedor.pais})</div>}
    </div>
  );
}

// Lista de solo lectura (sin opción de añadir) de entrantes confirmados por temporada
function EntrantesConfirmados({ titulo, lista, colores }) {
  if (!lista || lista.length === 0) return null;
  return (
    <div style={{ background: colores.tarjeta, border: `1px dashed ${colores.acento}`, borderRadius: 8, padding: 10, marginBottom: 14 }}>
      <div style={{ color: colores.acento, fontSize: 11, marginBottom: 6 }}>{titulo}</div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        {lista.map((e, i) => <span key={i} style={{ color: colores.texto, fontSize: 12 }}>{e.nombre} ({e.pais})</span>)}
      </div>
    </div>
  );
}

function BotonAleatorio({ onClick, label, colores }) {
  return <button onClick={onClick} style={{ background: colores.tarjeta, color: colores.acento, border: `1px solid ${colores.acento}`, borderRadius: 8, padding: "6px 14px", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>🎲 {label}</button>;
}

// ============================================================
// DATOS — CHAMPIONS LEAGUE
// ============================================================
const CL_RONDA1 = [
  { id: "R1-1", ruta: "Campeones", a: "Sabah", paisA: "AZE", b: "The New Saints", paisB: "WAL" },
  { id: "R1-2", ruta: "Campeones", a: "Floriana", paisA: "MLT", b: "Shamrock Rovers", paisB: "IRL" },
  { id: "R1-3", ruta: "Campeones", a: "Flora Tallinn", paisA: "EST", b: "Iberia Tbilisi", paisB: "GEO" },
  { id: "R1-4", ruta: "Campeones", a: "Lincoln Red Imps", paisA: "GIB", b: "Inter Escaldes", paisB: "AND", nota: "Perdedor va a CO-Q3 (reequilibrio), no a CO-Q2" },
  { id: "R1-5", ruta: "Campeones", a: "Tre Fiori", paisA: "SMR", b: "Larne", paisB: "NIR", nota: "Perdedor va a CO-Q3 (reequilibrio), no a CO-Q2" },
  { id: "R1-6", ruta: "Campeones", a: "Ararat-Armenia", paisA: "ARM", b: "Riga", paisB: "LAT" },
  { id: "R1-7", ruta: "Campeones", a: "Vardar", paisA: "MKD", b: "KuPS Kuopio", paisB: "FIN" },
  { id: "R1-8", ruta: "Campeones", a: "Kauno Žalgiris", paisA: "LTU", b: "Drita", paisB: "KOS" },
  { id: "R1-9", ruta: "Campeones", a: "Vitebsk", paisA: "BLR", b: "Universitatea Craiova", paisB: "ROU" },
  { id: "R1-10", ruta: "Campeones", a: "Petrocub", paisA: "MDA", b: "Egnatia", paisB: "ALB" },
  { id: "R1-11", ruta: "Campeones", a: "Borac", paisA: "BIH", b: "Levski Sofia", paisB: "BUL" },
  { id: "R1-12", ruta: "Campeones", a: "Víkingur Reykjavík", paisA: "ISL", b: "Győri ETO", paisB: "HUN" },
  { id: "R1-13", ruta: "Campeones", a: "Kairat Almaty", paisA: "KAZ", b: "Sutjeska", paisB: "MNE" },
  { id: "R1-14", ruta: "Campeones", a: "Klaksvík", paisA: "FRO", b: "Atert Bissen", paisB: "LUX" },
];
const CL_RONDA2 = [
  { id: "R2-1", ruta: "Campeones", aRef: "Mjällby", paisA: "SWE", bRef: "R1-4" },
  { id: "R2-2", ruta: "Campeones", aRef: "R1-5", bRef: "Crvena Zvezda", paisB: "SRB" },
  { id: "R2-3", ruta: "Campeones", aRef: "R1-1", bRef: "R1-7" },
  { id: "R2-4", ruta: "Campeones", aRef: "R1-14", bRef: "R1-8" },
  { id: "R2-5", ruta: "Campeones", aRef: "Aarhus", paisA: "DEN", bRef: "Lech Poznań", paisB: "POL" },
  { id: "R2-6", ruta: "Campeones", aRef: "R1-6", bRef: "R1-2" },
  { id: "R2-7", ruta: "Campeones", aRef: "R1-11", bRef: "R1-9" },
  { id: "R2-8", ruta: "Campeones", aRef: "Omonoia", paisA: "CYP", bRef: "R1-13" },
  { id: "R2-9", ruta: "Campeones", aRef: "Thun", paisA: "SUI", bRef: "GNK Dinamo", paisB: "CRO" },
  { id: "R2-10", ruta: "Campeones", aRef: "R1-12", bRef: "Hapoel Beer-Sheva", paisB: "ISR" },
  { id: "R2-11", ruta: "Campeones", aRef: "R1-3", bRef: "Slovan Bratislava", paisB: "SVK" },
  { id: "R2-12", ruta: "Campeones", aRef: "R1-10", bRef: "Celje", paisB: "SVN" },
  { id: "R2-13", ruta: "Liga", aRef: "Fenerbahçe", paisA: "TUR", bRef: "Górnik Zabrze", paisB: "POL" },
  { id: "R2-14", ruta: "Liga", aRef: "Sturm Graz", paisA: "AUT", bRef: "Hearts", paisB: "SCO" },
];
const CL_COEFS_INICIALES = {
  "Sabah": 6.000, "The New Saints": 9.000, "Floriana": 4.000, "Shamrock Rovers": 19.375,
  "Flora Tallinn": 10.000, "Iberia Tbilisi": 5.000, "Lincoln Red Imps": 13.500,
  "Inter Escaldes": 7.500, "Tre Fiori": 2.500, "Larne": 9.000, "Ararat-Armenia": 7.000,
  "Riga": 10.500, "Vardar": 1.551, "KuPS Kuopio": 14.000, "Kauno Žalgiris": 6.000, "Drita": 13.625,
  "Vitebsk": 1.325, "Universitatea Craiova": 10.500, "Petrocub": 9.000, "Egnatia": 4.500,
  "Borac": 13.125, "Levski Sofia": 7.000, "Víkingur Reykjavík": 11.750, "Győri ETO": 5.437,
  "Kairat Almaty": 11.000, "Sutjeska": 6.000, "Klaksvík": 10.500, "Atert Bissen": 1.325,
  "Mjällby": 5.925, "Crvena Zvezda": 46.500, "Aarhus": 8.421, "Lech Poznań": 27.250,
  "Omonoia": 21.250, "Thun": 6.940, "GNK Dinamo": 46.500, "Hapoel Beer-Sheva": 14.000,
  "Slovan Bratislava": 36.000, "Celje": 23.000, "Fenerbahçe": 57.750, "Górnik Zabrze": 9.350,
  "Sturm Graz": 28.000, "Hearts": 11.500, "Lyon": 65.750, "NEC Nijmegen": 13.585,
  "Union Saint-Gilloise": 48.000, "Sparta Praga": 38.250, "Bodø/Glimt": 64.000, "Olympiakos": 62.250,
  "Viking": 8.247, "AEK Atenas": 24.000, "LASK Linz": 21.000, "Celtic": 44.000,
};
const CL_NUEVOS_R3 = [
  { nombre: "Lyon", pais: "FRA", coef: 65.750 }, { nombre: "NEC Nijmegen", pais: "NED", coef: 13.585 },
  { nombre: "Union Saint-Gilloise", pais: "BEL", coef: 48.000 }, { nombre: "Sparta Praga", pais: "CZE", coef: 38.250 },
  { nombre: "Bodø/Glimt", pais: "NOR", coef: 64.000 }, { nombre: "Olympiakos", pais: "GRE", coef: 62.250 },
];
const CL_NUEVOS_PO = [
  { nombre: "Viking", pais: "NOR", coef: 8.247 }, { nombre: "AEK Atenas", pais: "GRE", coef: 24.000 },
  { nombre: "LASK Linz", pais: "AUT", coef: 21.000 }, { nombre: "Celtic", pais: "SCO", coef: 44.000 },
];
const CL_FECHAS = { R1: "7-8 jul (ida) · 14-15 jul (vuelta)", R2: "21-22 jul (ida) · 28-29 jul (vuelta)", R3: "4-5 ago (ida) · 11 ago (vuelta)", PO: "18-19 ago (ida) · 25-26 ago (vuelta)" };

// ============================================================
// DATOS — EUROPA LEAGUE
// ============================================================
const EL_RONDA1 = [
  { id: "EL1-1", a: "Qarabağ", paisA: "AZE", b: "Vestri", paisB: "ISL" },
  { id: "EL1-2", a: "Dynamo Kyiv", paisA: "UKR", b: "Universitatea Cluj", paisB: "ROU" },
  { id: "EL1-3", a: "Sheriff", paisA: "MDA", b: "Aluminij", paisB: "SVN" },
  { id: "EL1-4", a: "CSKA Sofia", paisA: "BUL", b: "Derry", paisB: "IRL" },
  { id: "EL1-5", a: "Hajduk Split", paisA: "CRO", b: "Žilina", paisB: "SVK" },
  { id: "EL1-6", a: "Vojvodina", paisA: "SRB", b: "Ferencváros", paisB: "HUN" },
];
const EL_RONDA2 = [
  { id: "EL2-1", aRef: "Hammarby", paisA: "SWE", bRef: "Anderlecht", paisB: "BEL" },
  { id: "EL2-2", aRef: "EL1-1", bRef: "EL1-4" },
  { id: "EL2-3", aRef: "Tromsø", paisA: "NOR", bRef: "Hradec Králové", paisB: "CZE" },
  { id: "EL2-4", aRef: "Twente", paisA: "NED", bRef: "EL1-6" },
  { id: "EL2-5", aRef: "Beşiktaş", paisA: "TUR", bRef: "Midtjylland", paisB: "DEN" },
  { id: "EL2-6", aRef: "EL1-5", bRef: "Pafos", paisB: "CYP" },
  { id: "EL2-7", aRef: "EL1-3", bRef: "Maccabi Tel-Aviv", paisB: "ISR" },
  { id: "EL2-8", aRef: "St. Gallen", paisA: "SUI", bRef: "Benfica", paisB: "POR" },
  { id: "EL2-9", aRef: "EL1-2", bRef: "PAOK", paisB: "GRE" },
];
const EL_COEFS_INICIALES = {
  "Qarabağ": 42.750, "Vestri": 3.304, "Dynamo Kyiv": 17.500, "Universitatea Cluj": 5.050,
  "Sheriff": 20.000, "Aluminij": 4.893, "CSKA Sofia": 6.500, "Derry": 4.000,
  "Hajduk Split": 10.000, "Žilina": 5.500, "Vojvodina": 5.500, "Ferencváros": 51.250,
  "Hammarby": 5.925, "Anderlecht": 30.750, "Tromsø": 8.247, "Hradec Králové": 9.705,
  "Twente": 13.585, "Beşiktaş": 15.500, "Midtjylland": 48.250, "Pafos": 24.125,
  "Maccabi Tel-Aviv": 32.500, "St. Gallen": 6.940, "Benfica": 90.000, "PAOK": 48.250,
  "Salzburgo": 45.000, "Rangers": 59.250, "Jagiellonia Białystok": 22.000,
  "Sint-Truidense": 12.450, "Lillestrøm": 8.247, "Karviná": 9.705, "OFI Creta": 9.682, "Trabzonspor": 11.000,
  // Equipos de Champions League que pueden caer aquí (Ronda 2 y Ronda 3, ambas rutas)
  "Sabah": 6.000, "The New Saints": 9.000, "Floriana": 4.000, "Shamrock Rovers": 19.375,
  "Flora Tallinn": 10.000, "Iberia Tbilisi": 5.000, "Lincoln Red Imps": 13.500, "Inter Escaldes": 7.500,
  "Tre Fiori": 2.500, "Larne": 9.000, "Ararat-Armenia": 7.000, "Riga": 10.500,
  "Vardar": 1.551, "KuPS Kuopio": 14.000, "Kauno Žalgiris": 6.000, "Drita": 13.625,
  "Vitebsk": 1.325, "Universitatea Craiova": 10.500, "Petrocub": 9.000, "Egnatia": 4.500,
  "Borac": 13.125, "Levski Sofia": 7.000, "Víkingur Reykjavík": 11.750, "Győri ETO": 5.437,
  "Kairat Almaty": 11.000, "Sutjeska": 6.000, "Klaksvík": 10.500, "Atert Bissen": 1.325,
  "Mjällby": 5.925, "Crvena Zvezda": 46.500, "Aarhus": 8.421, "Lech Poznań": 27.250,
  "Omonoia": 21.250, "Thun": 6.940, "GNK Dinamo": 46.500, "Hapoel Beer-Sheva": 14.000,
  "Slovan Bratislava": 36.000, "Celje": 23.000, "Fenerbahçe": 57.750, "Górnik Zabrze": 9.350,
  "Sturm Graz": 28.000, "Hearts": 11.500, "Lyon": 65.750, "NEC Nijmegen": 13.585,
  "Union Saint-Gilloise": 48.000, "Sparta Praga": 38.250, "Bodø/Glimt": 64.000, "Olympiakos": 62.250,
  "Viking": 8.247, "AEK Atenas": 24.000, "LASK Linz": 21.000, "Celtic": 44.000,
};
const EL_NUEVOS_R3 = [
  { nombre: "Salzburgo", pais: "AUT", coef: 45.000 }, { nombre: "Rangers", pais: "SCO", coef: 59.250 },
  { nombre: "Jagiellonia Białystok", pais: "POL", coef: 22.000 },
];
const EL_NUEVOS_PO = [
  { nombre: "Sint-Truidense", pais: "BEL", coef: 12.450 }, { nombre: "Lillestrøm", pais: "NOR", coef: 8.247 },
  { nombre: "Karviná", pais: "CZE", coef: 9.705 }, { nombre: "OFI Creta", pais: "GRE", coef: 9.682 },
  { nombre: "Trabzonspor", pais: "TUR", coef: 11.000 },
];
const EL_FECHAS = { R1: "9 jul (ida) · 16 jul (vuelta)", R2: "23 jul (ida) · 30 jul (vuelta)", R3: "6 ago (ida) · 13 ago (vuelta)", PO: "20 ago (ida) · 27 ago (vuelta)" };

// ============================================================
// DATOS — CONFERENCE LEAGUE
// ============================================================
const CO_RONDA1 = [
  { id: "CO1-1", a: "Velež Mostar", paisA: "BIH", b: "Milsami Orhei", paisB: "MDA" },
  { id: "CO1-2", a: "Bohemian FC", paisA: "IRL", b: "St Joseph's FC", paisB: "GIB" },
  { id: "CO1-3", a: "Dinamo City", paisA: "ALB", b: "Astana", paisB: "KAZ" },
  { id: "CO1-4", a: "Connah's Quay Nomads", paisA: "WAL", b: "Ballkani", paisB: "KOS" },
  { id: "CO1-5", a: "Zira", paisA: "AZE", b: "Torpedo Kutaisi", paisB: "GEO" },
  { id: "CO1-6", a: "Differdange 03", paisA: "LUX", b: "Ilves Tampere", paisB: "FIN" },
  { id: "CO1-7", a: "Dinamo-Minsk", paisA: "BLR", b: "Sileks", paisB: "MKD" },
  { id: "CO1-8", a: "Liepāja", paisA: "LVA", b: "Dečić", paisB: "MNE" },
  { id: "CO1-9", a: "Elbasani", paisA: "ALB", b: "BATE Borisov", paisB: "BLR" },
  { id: "CO1-10", a: "Glentoran", paisA: "NIR", b: "RFS", paisB: "LVA" },
  { id: "CO1-11", a: "Atlètic Club d'Escaldes", paisA: "AND", b: "Mornar", paisB: "MNE" },
  { id: "CO1-12", a: "Mondorf-les-Bains", paisA: "LUX", b: "Dinamo Tbilisi", paisB: "GEO" },
  { id: "CO1-13", a: "Petrovac", paisA: "MNE", b: "Žalgiris Vilnius", paisB: "LTU" },
  { id: "CO1-14", a: "Caernarfon Town", paisA: "WAL", b: "Levadia Tallinn", paisB: "EST" },
  { id: "CO1-15", a: "Marsaxlokk", paisA: "MLT", b: "Pyunik", paisB: "ARM" },
  { id: "CO1-16", a: "Hegelmann", paisA: "LTU", b: "Paide Linnameeskond", paisB: "EST" },
  { id: "CO1-17", a: "Alashkert", paisA: "ARM", b: "Yelimay", paisB: "KAZ" },
  { id: "CO1-18", a: "Stjarnan", paisA: "ISL", b: "Víkingur", paisB: "FRO" },
  { id: "CO1-19", a: "Dila Gori", paisA: "GEO", b: "Virtus 1964", paisB: "SMR" },
  { id: "CO1-20", a: "Sarajevo", paisA: "BIH", b: "Inter Turku", paisB: "FIN" },
  { id: "CO1-21", a: "Europa FC", paisA: "GIB", b: "Shkëndija", paisB: "MKD" },
  { id: "CO1-22", a: "Nõmme Kalju", paisA: "EST", b: "Linfield", paisB: "NIR" },
  { id: "CO1-23", a: "Penybont", paisA: "WAL", b: "Santa Coloma", paisB: "AND" },
  { id: "CO1-24", a: "NSÍ Runavík", paisA: "FRO", b: "Hamrun Spartans", paisB: "MLT" },
  { id: "CO1-25", a: "UNA Strassen", paisA: "LUX", b: "La Fiorita", paisB: "SMR" },
  { id: "CO1-26", a: "Vllaznia", paisA: "ALB", b: "Malisheva", paisB: "KOS" },
];
const CO_RONDA2_CAMPEONES = [
  { id: "CO2C-1", ext1tie: "R1-11", ext2tie: "R1-10" },
  { id: "CO2C-2", ext1tie: "R1-14", ext2tie: "R1-12" },
  { id: "CO2C-3", ext1tie: "R1-9", ext2tie: "R1-13" },
  { id: "CO2C-4", ext1tie: "R1-3", ext2tie: "R1-1" },
  { id: "CO2C-5", ext1tie: "R1-2", ext2tie: "R1-8" },
  { id: "CO2C-6", ext1tie: "R1-7", ext2tie: "R1-6" },
];
const CL_R1_INFO = {
  "R1-1": [{ n: "Sabah", p: "AZE" }, { n: "The New Saints", p: "WAL" }],
  "R1-2": [{ n: "Floriana", p: "MLT" }, { n: "Shamrock Rovers", p: "IRL" }],
  "R1-3": [{ n: "Flora Tallinn", p: "EST" }, { n: "Iberia Tbilisi", p: "GEO" }],
  "R1-6": [{ n: "Ararat-Armenia", p: "ARM" }, { n: "Riga", p: "LAT" }],
  "R1-7": [{ n: "Vardar", p: "MKD" }, { n: "KuPS Kuopio", p: "FIN" }],
  "R1-8": [{ n: "Kauno Žalgiris", p: "LTU" }, { n: "Drita", p: "KOS" }],
  "R1-9": [{ n: "Vitebsk", p: "BLR" }, { n: "Universitatea Craiova", p: "ROU" }],
  "R1-10": [{ n: "Petrocub", p: "MDA" }, { n: "Egnatia", p: "ALB" }],
  "R1-11": [{ n: "Borac", p: "BIH" }, { n: "Levski Sofia", p: "BUL" }],
  "R1-12": [{ n: "Víkingur Reykjavík", p: "ISL" }, { n: "Győri ETO", p: "HUN" }],
  "R1-13": [{ n: "Kairat Almaty", p: "KAZ" }, { n: "Sutjeska", p: "MNE" }],
  "R1-14": [{ n: "Klaksvík", p: "FRO" }, { n: "Atert Bissen", p: "LUX" }],
};
const EL_R1_INFO = {
  "EL1-1": [{ n: "Qarabağ", p: "AZE" }, { n: "Vestri", p: "ISL" }],
  "EL1-2": [{ n: "Dynamo Kyiv", p: "UKR" }, { n: "Universitatea Cluj", p: "ROU" }],
  "EL1-3": [{ n: "Sheriff", p: "MDA" }, { n: "Aluminij", p: "SVN" }],
  "EL1-4": [{ n: "CSKA Sofia", p: "BUL" }, { n: "Derry", p: "IRL" }],
  "EL1-5": [{ n: "Hajduk Split", p: "CRO" }, { n: "Žilina", p: "SVK" }],
  "EL1-6": [{ n: "Vojvodina", p: "SRB" }, { n: "Ferencváros", p: "HUN" }],
};
const L = (nombre, pais) => ({ tipo: "literal", nombre, pais });
const I = (ref) => ({ tipo: "interno", ref });
const XEL = (tieId) => ({ tipo: "externo-el", tieId });

const CO_RONDA2_PRINCIPAL = [
  { id: "CO2P-1", a: L("Rijeka", "CRO"), b: XEL("EL1-4") },
  { id: "CO2P-2", a: L("Başakşehir", "TUR"), b: I("CO1-20") },
  { id: "CO2P-3", a: L("Lugano", "SUI"), b: L("Dukagjini", "KOS") },
  { id: "CO2P-4", a: L("HJK", "FIN"), b: L("Coleraine", "NIR") },
  { id: "CO2P-5", a: L("FCSB", "ROU"), b: L("Auda", "LAT") },
  { id: "CO2P-6", a: I("CO1-10"), b: XEL("EL1-1") },
  { id: "CO2P-7", a: L("Raków", "POL"), b: L("Valletta", "MLT") },
  { id: "CO2P-8", a: I("CO1-8"), b: L("Austria Wien", "AUT") },
  { id: "CO2P-9", a: L("Debrecen", "HUN"), b: I("CO1-15") },
  { id: "CO2P-10", a: L("GAIS", "SWE"), b: L("Nordsjælland", "DEN") },
  { id: "CO2P-11", a: L("Göteborg", "SWE"), b: I("CO1-14") },
  { id: "CO2P-12", a: XEL("EL1-5"), b: L("Katowice", "POL") },
  { id: "CO2P-13", a: L("Varaždin", "CRO"), b: L("Jablonec", "CZE") },
  { id: "CO2P-14", a: I("CO1-19"), b: L("Apollon", "CYP") },
  { id: "CO2P-15", a: L("Bravo", "SVN"), b: I("CO1-21") },
  { id: "CO2P-16", a: XEL("EL1-2"), b: L("Brann", "NOR") },
  { id: "CO2P-17", a: L("Shelbourne", "IRL"), b: I("CO1-22") },
  { id: "CO2P-18", a: L("Valur", "ISL"), b: L("Zrinjski", "BIH") },
  { id: "CO2P-19", a: L("Zimbru", "MDA"), b: L("Noah", "ARM") },
  { id: "CO2P-20", a: I("CO1-12"), b: I("CO1-13") },
  { id: "CO2P-21", a: XEL("EL1-3"), b: I("CO1-3") },
  { id: "CO2P-22", a: L("DAC 1904", "SVK"), b: I("CO1-1") },
  { id: "CO2P-23", a: I("CO1-9"), b: L("Sion", "SUI") },
  { id: "CO2P-24", a: I("CO1-18"), b: I("CO1-6") },
  { id: "CO2P-25", a: L("Motherwell", "SCO"), b: L("Havnar Bóltfelag", "FRO") },
  { id: "CO2P-26", a: L("Panevėžys", "LTU"), b: L("Tobol", "KAZ") },
  { id: "CO2P-27", a: I("CO1-26"), b: L("Hibernian", "SCO") },
  { id: "CO2P-28", a: L("Neftchi", "AZE"), b: I("CO1-7") },
  { id: "CO2P-29", a: L("Paksi", "HUN"), b: L("Panathinaikos", "GRE") },
  { id: "CO2P-30", a: L("Železničar Pančevo", "SRB"), b: L("Braga", "POR") },
  { id: "CO2P-31", a: XEL("EL1-6"), b: L("Ajax", "NED") },
  { id: "CO2P-32", a: L("Polissya", "UKR"), b: L("Copenhagen", "DEN") },
  { id: "CO2P-33", a: L("LNZ Cherkasy", "UKR"), b: L("Gent", "BEL") },
  { id: "CO2P-34", a: I("CO1-23"), b: L("SK Rapid", "AUT") },
  { id: "CO2P-35", a: L("Hapoel Tel-Aviv", "ISR"), b: L("Ludogorets", "BUL") },
  { id: "CO2P-36", a: I("CO1-17"), b: L("CFR Cluj", "ROU") },
  { id: "CO2P-37", a: I("CO1-2"), b: I("CO1-4") },
  { id: "CO2P-38", a: I("CO1-16"), b: I("CO1-5") },
  { id: "CO2P-39", a: L("Vaduz", "LIE"), b: I("CO1-11") },
  { id: "CO2P-40", a: L("Spartak Trnava", "SVK"), b: L("CSKA 1948", "BUL") },
  { id: "CO2P-41", a: I("CO1-24"), b: L("Koper", "SVN") },
  { id: "CO2P-42", a: L("AEK Larnaca", "CYP"), b: L("Beitar", "ISR") },
  { id: "CO2P-43", a: L("Partizan", "SRB"), b: I("CO1-25") },
];
const CO_COEFS_INICIALES = {
  "Velež Mostar": 4.500, "Milsami Orhei": 7.500, "Bohemian FC": 3.468, "St Joseph's FC": 5.000,
  "Dinamo City": 2.500, "Astana": 12.500, "Connah's Quay Nomads": 3.500, "Ballkani": 10.000,
  "Zira": 5.500, "Torpedo Kutaisi": 4.500, "Differdange 03": 6.500, "Ilves Tampere": 3.500,
  "Dinamo-Minsk": 6.500, "Sileks": 2.000, "Dečić": 5.500, "Liepāja": 4.000,
  "Elbasani": 1.625, "BATE Borisov": 5.500, "Glentoran": 2.000, "RFS": 12.500,
  "Mornar": 2.000, "Atlètic Club d'Escaldes": 5.000, "Mondorf-les-Bains": 1.325, "Dinamo Tbilisi": 5.000,
  "Petrovac": 1.316, "Žalgiris Vilnius": 12.000, "Caernarfon Town": 1.500, "Levadia Tallinn": 7.500,
  "Marsaxlokk": 1.800, "Pyunik": 10.000, "Hegelmann": 2.000, "Paide Linnameeskond": 7.500,
  "Alashkert": 5.000, "Yelimay": 2.750, "Víkingur": 6.000, "Stjarnan": 3.304,
  "Dila Gori": 5.500, "Virtus 1964": 4.000, "Sarajevo": 5.000, "Inter Turku": 2.800,
  "Europa FC": 3.000, "Shkëndija": 10.875, "Nõmme Kalju": 1.641, "Linfield": 9.500,
  "Penybont": 2.000, "Santa Coloma": 5.000, "NSÍ Runavík": 2.000, "Hamrun Spartans": 8.500,
  "UNA Strassen": 2.500, "La Fiorita": 6.000, "Vllaznia": 6.500, "Malisheva": 2.797,
  "Rijeka": 18.625, "Başakşehir": 19.500, "Lugano": 21.250, "Dukagjini": 2.797,
  "HJK": 14.000, "Coleraine": 1.450, "FCSB": 25.500, "Auda": 4.500,
  "Raków": 22.250, "Valletta": 1.800, "Austria Wien": 9.500, "Debrecen": 5.437,
  "GAIS": 5.925, "Nordsjælland": 8.421, "Göteborg": 5.925, "Katowice": 9.350,
  "Varaždin": 5.631, "Apollon": 7.138, "Bravo": 4.893, "Brann": 12.250,
  "Shelbourne": 4.000, "Valur": 4.500, "Zrinjski": 13.250, "Zimbru": 4.500,
  "Noah": 10.750, "Sion": 6.940, "Motherwell": 6.410, "Havnar Bóltfelag": 7.000,
  "Panevėžys": 6.500, "Tobol": 8.000, "Hibernian": 7.000, "Neftchi": 6.500,
  "Paksi": 5.437, "Panathinaikos": 29.250, "Železničar Pančevo": 5.150, "Braga": 63.750,
  "Ajax": 58.250, "Polissya": 5.182, "Copenhagen": 54.375, "Gent": 39.000,
  "SK Rapid": 29.750, "Hapoel Tel-Aviv": 5.500, "Ludogorets": 28.750, "CFR Cluj": 17.500,
  "Vaduz": 8.500, "Spartak Trnava": 10.500, "CSKA 1948": 4.212, "Koper": 4.893,
  "AEK Larnaca": 20.250, "Beitar": 5.500, "Partizan": 22.000, "DAC 1904": 6.000,
  "Borac": 13.125, "Levski Sofia": 7.000, "Petrocub": 9.000, "Egnatia": 4.500,
  "Klaksvík": 10.500, "Atert Bissen": 1.325, "Víkingur Reykjavík": 11.750, "Győri ETO": 5.437,
  "Vitebsk": 1.325, "Universitatea Craiova": 10.500, "Kairat Almaty": 11.000, "Sutjeska": 6.000,
  "Flora Tallinn": 10.000, "Iberia Tbilisi": 5.000, "Sabah": 6.000, "The New Saints": 9.000,
  "Floriana": 4.000, "Shamrock Rovers": 19.375, "Kauno Žalgiris": 6.000, "Drita": 13.625,
  "Vardar": 1.551, "KuPS Kuopio": 14.000, "Ararat-Armenia": 7.000, "Riga": 10.500,
  "CSKA Sofia": 6.500, "Derry": 4.000, "Qarabağ": 42.750, "Vestri": 3.304,
  "Dynamo Kyiv": 17.500, "Universitatea Cluj": 5.050, "Sheriff": 20.000, "Aluminij": 4.893,
  "Hajduk Split": 10.000, "Žilina": 5.500, "Vojvodina": 5.500, "Ferencváros": 51.250,
  "Hammarby": 5.925, "Anderlecht": 30.750, "Tromsø": 8.247, "Hradec Králové": 9.705,
  "Twente": 13.585, "Beşiktaş": 15.500, "Midtjylland": 48.250, "Pafos": 24.125,
  "Maccabi Tel-Aviv": 32.500, "St. Gallen": 6.940, "Benfica": 90.000, "PAOK": 48.250,
  "Salzburgo": 45.000, "Rangers": 59.250, "Jagiellonia Białystok": 22.000,
  "Lincoln Red Imps": 13.500, "Inter Escaldes": 7.500, "Tre Fiori": 2.500, "Larne": 9.000,
  "Mjällby": 5.925, "Crvena Zvezda": 46.500, "Aarhus": 8.421, "Lech Poznań": 27.250,
  "Omonoia": 21.250, "Thun": 6.940, "GNK Dinamo": 46.500, "Hapoel Beer-Sheva": 14.000,
  "Slovan Bratislava": 36.000, "Celje": 23.000, "Fenerbahçe": 57.750, "Górnik Zabrze": 9.350,
  "Sturm Graz": 28.000, "Hearts": 11.500, "Lyon": 65.750, "NEC Nijmegen": 13.585,
  "Union Saint-Gilloise": 48.000, "Sparta Praga": 38.250, "Bodø/Glimt": 64.000, "Olympiakos": 62.250,
  "Viking": 8.247, "AEK Atenas": 24.000, "LASK Linz": 21.000, "Celtic": 44.000,
  "Brighton & Hove Albion": 23.903, "Atalanta": 84.000, "Getafe": 19.409, "Friburgo": 56.500, "Mónaco": 56.000,
};
const CO_FECHAS = { R1: "7-9 jul (ida) · 14-16 jul (vuelta)", R2: "23 jul (ida) · 30 jul (vuelta)", R3: "6 ago (ida) · 13 ago (vuelta)", PO: "20 ago (ida) · 27 ago (vuelta)" };
const CO_NUEVOS_PO_LIGA = [
  { nombre: "Brighton & Hove Albion", pais: "ENG", coef: 23.903 },
  { nombre: "Atalanta", pais: "ITA", coef: 84.000 },
  { nombre: "Getafe", pais: "ESP", coef: 19.409 },
  { nombre: "Friburgo", pais: "GER", coef: 56.500 },
  { nombre: "Mónaco", pais: "FRA", coef: 56.000 },
];

// ============================================================
// LÓGICA — CHAMPIONS LEAGUE
// ============================================================
function useChampions() {
  const coefs = CL_COEFS_INICIALES;
  const [resR1, setResR1] = useState({});
  const [resR2, setResR2] = useState({});
  const [sorteoR3, setSorteoR3] = useState(null);
  const [resR3, setResR3] = useState({});
  const [sorteoPO, setSorteoPO] = useState(null);
  const [resPO, setResPO] = useState({});

  const changeR1 = (id, field, value) => setResR1((p) => ({ ...p, [id]: { ...p[id], [field]: value } }));
  const changeR2 = (id, field, value) => setResR2((p) => ({ ...p, [id]: { ...p[id], [field]: value } }));
  const changeR3 = (id, field, value) => setResR3((p) => ({ ...p, [id]: { ...p[id], [field]: value } }));
  const changePO = (id, field, value) => setResPO((p) => ({ ...p, [id]: { ...p[id], [field]: value } }));
  const resetR1 = (id) => setResR1((p) => { const n = { ...p }; delete n[id]; return n; });
  const resetR2 = (id) => setResR2((p) => { const n = { ...p }; delete n[id]; return n; });
  const resetR3 = (id) => setResR3((p) => { const n = { ...p }; delete n[id]; return n; });
  const resetPO = (id) => setResPO((p) => { const n = { ...p }; delete n[id]; return n; });

  const allTeams = useMemo(() => {
    const set = new Set();
    CL_RONDA1.forEach((r) => { set.add(r.a); set.add(r.b); });
    CL_RONDA2.forEach((r) => { if (!r.aRef.startsWith("R1-")) set.add(r.aRef); if (!r.bRef.startsWith("R1-")) set.add(r.bRef); });
    return Array.from(set).sort((a, b) => (coefs[b] ?? -1) - (coefs[a] ?? -1));
  }, [coefs]);

  const resolverR1 = (tieId) => {
    const tie = CL_RONDA1.find((t) => t.id === tieId);
    if (!tie) return null;
    const est = estadoEliminatoria(resR1[tieId]);
    if (est.fase === "resuelto") {
      const nombre = est.ganador === "A" ? tie.a : tie.b;
      const perdedor = est.ganador === "A" ? tie.b : tie.a;
      const pais = est.ganador === "A" ? tie.paisA : tie.paisB;
      const paisPerdedor = est.ganador === "A" ? tie.paisB : tie.paisA;
      return { nombre, pais, coef: coefs[nombre], esReal: true, perdedor, paisPerdedor };
    }
    return { esReal: false };
  };
  const resolverLadoR2 = (ref, paisFijo) => {
    if (ref.startsWith("R1-")) {
      const r = resolverR1(ref);
      if (!r || !r.esReal) return { texto: `Ganador ${ref} (pendiente)`, coef: undefined, esReal: false };
      return { texto: `${r.nombre} (${r.pais})`, nombreBase: r.nombre, pais: r.pais, coef: r.coef, esReal: true };
    }
    return { texto: `${ref} (${paisFijo})`, nombreBase: ref, pais: paisFijo, coef: coefs[ref], esReal: true };
  };
  const resolverR2 = (tieId) => {
    const tie = CL_RONDA2.find((t) => t.id === tieId);
    if (!tie) return null;
    const ladoA = resolverLadoR2(tie.aRef, tie.paisA), ladoB = resolverLadoR2(tie.bRef, tie.paisB);
    if (!ladoA.esReal || !ladoB.esReal) return null;
    const est = estadoEliminatoria(resR2[tieId]);
    if (est.fase !== "resuelto") return null;
    const g = est.ganador === "A" ? ladoA : ladoB;
    const p = est.ganador === "A" ? ladoB : ladoA;
    return { nombre: g.nombreBase, pais: g.pais, coef: g.coef, perdedorNombre: p.nombreBase, perdedorPais: p.pais };
  };
  const resolverGenerico = (cruces, resultados, tieId) => {
    const tie = cruces.find((t) => t.id === tieId);
    if (!tie) return null;
    const est = estadoEliminatoria(resultados[tieId]);
    if (est.fase !== "resuelto") return null;
    return { ganador: est.ganador === "A" ? tie.cabeza : tie.rival, perdedor: est.ganador === "A" ? tie.rival : tie.cabeza };
  };

  const r2Completa = useMemo(() => CL_RONDA2.every((t) => {
    const ladoA = resolverLadoR2(t.aRef, t.paisA), ladoB = resolverLadoR2(t.bRef, t.paisB);
    return ladoA.esReal && ladoB.esReal && estadoEliminatoria(resR2[t.id]).fase === "resuelto";
  }), [resR1, resR2, coefs]);

  const simularR3 = () => {
    const plazasCP = CL_RONDA2.filter((t) => t.ruta === "Campeones").map((t) => resolverR2(t.id)).filter(Boolean);
    const plazasLP = CL_RONDA2.filter((t) => t.ruta === "Liga").map((t) => resolverR2(t.id)).filter(Boolean);
    const resCP = sortear(plazasCP); // 0 nuevos en Ruta Campeones
    const resLP = sortear([...plazasLP, ...CL_NUEVOS_R3.map((e) => ({ nombre: e.nombre, pais: e.pais, coef: e.coef }))]);
    if (resCP.error || resLP.error) { setSorteoR3({ error: `Ruta Campeones: ${resCP.error || "OK"} · Ruta Liga: ${resLP.error || "OK"}` }); return; }
    const cruces = [
      ...resCP.cruces.map((c, i) => ({ id: `R3-CP-${i + 1}`, ruta: "Campeones", cabeza: c.cabeza, rival: c.rival })),
      ...resLP.cruces.map((c, i) => ({ id: `R3-LP-${i + 1}`, ruta: "Liga", cabeza: c.cabeza, rival: c.rival })),
    ];
    setSorteoR3({ cruces, bloqueo: resCP.bloqueo || resLP.bloqueo });
    setResR3({}); setSorteoPO(null); setResPO({});
  };
  const r3Completa = useMemo(() => sorteoR3 && !sorteoR3.error && sorteoR3.cruces.every((t) => estadoEliminatoria(resR3[t.id]).fase === "resuelto"), [sorteoR3, resR3]);

  const simularPlayoff = () => {
    const g = sorteoR3.cruces.map((t) => { const r = resolverGenerico(sorteoR3.cruces, resR3, t.id); return r ? { ...r.ganador, ruta: t.ruta } : null; }).filter(Boolean);
    const plazasCP = g.filter((x) => x.ruta === "Campeones");
    const plazasLP = g.filter((x) => x.ruta === "Liga");
    const resCP = sortear([...plazasCP, ...CL_NUEVOS_PO.map((e) => ({ nombre: e.nombre, pais: e.pais, coef: e.coef }))]);
    const resLP = sortear(plazasLP); // 0 nuevos en Ruta Liga del Playoff
    if (resCP.error || resLP.error) { setSorteoPO({ error: `Ruta Campeones: ${resCP.error || "OK"} · Ruta Liga: ${resLP.error || "OK"}` }); return; }
    const cruces = [
      ...resCP.cruces.map((c, i) => ({ id: `PO-CP-${i + 1}`, ruta: "Campeones", cabeza: c.cabeza, rival: c.rival })),
      ...resLP.cruces.map((c, i) => ({ id: `PO-LP-${i + 1}`, ruta: "Liga", cabeza: c.cabeza, rival: c.rival })),
    ];
    setSorteoPO({ cruces, bloqueo: resCP.bloqueo || resLP.bloqueo });
    setResPO({});
  };
  const clasificados = useMemo(() => {
    if (!sorteoPO || sorteoPO.error) return null;
    if (!sorteoPO.cruces.every((t) => estadoEliminatoria(resPO[t.id]).fase === "resuelto")) return null;
    return sorteoPO.cruces.map((t) => resolverGenerico(sorteoPO.cruces, resPO, t.id).ganador);
  }, [sorteoPO, resPO]);

  const rellenarR1 = () => { const n = {}; CL_RONDA1.forEach((t) => { n[t.id] = generarResultadoAleatorio(); }); setResR1(n); };
  const rellenarR2 = () => { const n = {}; CL_RONDA2.forEach((t) => { n[t.id] = generarResultadoAleatorio(); }); setResR2(n); };
  const rellenarR3 = () => { if (!sorteoR3 || sorteoR3.error) return; const n = {}; sorteoR3.cruces.forEach((t) => { n[t.id] = generarResultadoAleatorio(); }); setResR3(n); };
  const rellenarPO = () => { if (!sorteoPO || sorteoPO.error) return; const n = {}; sorteoPO.cruces.forEach((t) => { n[t.id] = generarResultadoAleatorio(); }); setResPO(n); };

  // ---- Derivados que consumen Europa League y Conference League en directo (sin guardar/recargar) ----
  const perdedoresR1 = useMemo(() => CL_RONDA1.map((t) => {
    const r = resolverR1(t.id);
    return r && r.esReal ? { tie: t.id, perdedor: r.perdedor, pais: r.paisPerdedor, ruta: t.ruta, reequilibrio: !!t.nota } : null;
  }).filter(Boolean), [resR1, coefs]);

  const perdedoresR2 = useMemo(() => CL_RONDA2.map((tie) => {
    const r = resolverR2(tie.id);
    return r ? { tie: tie.id, perdedor: r.perdedorNombre, pais: r.perdedorPais, ruta: tie.ruta } : null;
  }).filter(Boolean), [resR1, resR2, coefs]);

  const perdedoresR3 = useMemo(() => {
    if (!sorteoR3 || sorteoR3.error) return [];
    return sorteoR3.cruces.map((t) => { const r = resolverGenerico(sorteoR3.cruces, resR3, t.id); return r ? { tie: t.id, perdedor: r.perdedor.nombre, pais: r.perdedor.pais, ruta: t.ruta } : null; }).filter(Boolean);
  }, [sorteoR3, resR3]);

  const perdedoresPO = useMemo(() => {
    if (!sorteoPO || sorteoPO.error) return [];
    return sorteoPO.cruces.map((t) => { const r = resolverGenerico(sorteoPO.cruces, resPO, t.id); return r ? { tie: t.id, perdedor: r.perdedor.nombre, pais: r.perdedor.pais, ruta: t.ruta } : null; }).filter(Boolean);
  }, [sorteoPO, resPO]);

  return {
    coefs, allTeams,
    resR1, changeR1, resetR1, resolverR1,
    resR2, changeR2, resetR2, resolverLadoR2, resolverR2, r2Completa,
    sorteoR3, resR3, changeR3, resetR3, r3Completa, simularR3,
    sorteoPO, resPO, changePO, resetPO, simularPlayoff,
    clasificados, resolverGenerico,
    rellenarR1, rellenarR2, rellenarR3, rellenarPO,
    perdedoresR1, perdedoresR2, perdedoresR3, perdedoresPO,
  };
}

// ============================================================
// LÓGICA — EUROPA LEAGUE (recibe datos de Champions League en directo)
// ============================================================
function useEuropa(cl) {
  const coefs = EL_COEFS_INICIALES;
  const [resR1, setResR1] = useState({});
  const [resR2, setResR2] = useState({});
  const [sorteoR3, setSorteoR3] = useState(null);
  const [resR3, setResR3] = useState({});
  const [sorteoPO, setSorteoPO] = useState(null);
  const [resPO, setResPO] = useState({});

  const changeR1 = (id, field, value) => setResR1((p) => ({ ...p, [id]: { ...p[id], [field]: value } }));
  const changeR2 = (id, field, value) => setResR2((p) => ({ ...p, [id]: { ...p[id], [field]: value } }));
  const changeR3 = (id, field, value) => setResR3((p) => ({ ...p, [id]: { ...p[id], [field]: value } }));
  const changePO = (id, field, value) => setResPO((p) => ({ ...p, [id]: { ...p[id], [field]: value } }));
  const resetR1 = (id) => setResR1((p) => { const n = { ...p }; delete n[id]; return n; });
  const resetR2 = (id) => setResR2((p) => { const n = { ...p }; delete n[id]; return n; });
  const resetR3 = (id) => setResR3((p) => { const n = { ...p }; delete n[id]; return n; });
  const resetPO = (id) => setResPO((p) => { const n = { ...p }; delete n[id]; return n; });

  const allTeams = useMemo(() => {
    const set = new Set();
    EL_RONDA1.forEach((r) => { set.add(r.a); set.add(r.b); });
    EL_RONDA2.forEach((r) => { if (!r.aRef.startsWith("EL1-")) set.add(r.aRef); if (!r.bRef.startsWith("EL1-")) set.add(r.bRef); });
    return Array.from(set).sort((a, b) => (coefs[b] ?? -1) - (coefs[a] ?? -1));
  }, [coefs]);

  const resolverR1 = (tieId) => {
    const tie = EL_RONDA1.find((t) => t.id === tieId);
    if (!tie) return null;
    const est = estadoEliminatoria(resR1[tieId]);
    if (est.fase === "resuelto") {
      const nombre = est.ganador === "A" ? tie.a : tie.b;
      const perdedor = est.ganador === "A" ? tie.b : tie.a;
      const pais = est.ganador === "A" ? tie.paisA : tie.paisB;
      const paisPerdedor = est.ganador === "A" ? tie.paisB : tie.paisA;
      return { nombre, pais, coef: coefs[nombre], esReal: true, perdedor, paisPerdedor };
    }
    return { esReal: false };
  };
  const resolverLadoR2 = (ref, paisFijo) => {
    if (ref.startsWith("EL1-")) {
      const r = resolverR1(ref);
      if (!r || !r.esReal) return { texto: `Ganador ${ref} (pendiente)`, coef: undefined, esReal: false };
      return { texto: `${r.nombre} (${r.pais})`, nombreBase: r.nombre, pais: r.pais, coef: r.coef, esReal: true };
    }
    return { texto: `${ref} (${paisFijo})`, nombreBase: ref, pais: paisFijo, coef: coefs[ref], esReal: true };
  };
  const resolverR2 = (tieId) => {
    const tie = EL_RONDA2.find((t) => t.id === tieId);
    if (!tie) return null;
    const ladoA = resolverLadoR2(tie.aRef, tie.paisA), ladoB = resolverLadoR2(tie.bRef, tie.paisB);
    if (!ladoA.esReal || !ladoB.esReal) return null;
    const est = estadoEliminatoria(resR2[tieId]);
    if (est.fase !== "resuelto") return null;
    const g = est.ganador === "A" ? ladoA : ladoB;
    const p = est.ganador === "A" ? ladoB : ladoA;
    return { nombre: g.nombreBase, pais: g.pais, coef: g.coef, perdedorNombre: p.nombreBase, perdedorPais: p.pais };
  };
  const resolverGenerico = (cruces, resultados, tieId) => {
    const tie = cruces.find((t) => t.id === tieId);
    if (!tie) return null;
    const est = estadoEliminatoria(resultados[tieId]);
    if (est.fase !== "resuelto") return null;
    return { ganador: est.ganador === "A" ? tie.cabeza : tie.rival, perdedor: est.ganador === "A" ? tie.rival : tie.cabeza };
  };

  const r2Completa = useMemo(() => EL_RONDA2.every((t) => {
    const ladoA = resolverLadoR2(t.aRef, t.paisA), ladoB = resolverLadoR2(t.bRef, t.paisB);
    return ladoA.esReal && ladoB.esReal && estadoEliminatoria(resR2[t.id]).fase === "resuelto";
  }), [resR1, resR2, coefs]);

  const simularR3 = () => {
    const propiosLiga = EL_RONDA2.map((t) => resolverR2(t.id)).filter(Boolean);
    const clR2 = cl.perdedoresR2;
    const clLiga = clR2.filter((p) => p.ruta === "Liga").map((p) => ({ nombre: p.perdedor, pais: p.pais, coef: coefs[p.perdedor] })).filter((p) => p.coef !== undefined);
    const clCampeones = clR2.filter((p) => p.ruta === "Campeones").map((p) => ({ nombre: p.perdedor, pais: p.pais, coef: coefs[p.perdedor] })).filter((p) => p.coef !== undefined);
    const plazasLiga = [...propiosLiga, ...EL_NUEVOS_R3.map((e) => ({ nombre: e.nombre, pais: e.pais, coef: e.coef })), ...clLiga];
    const resLiga = plazasLiga.length === 14 ? sortear(plazasLiga) : { error: `${plazasLiga.length}/14 (faltan ${14 - plazasLiga.length} perdedores de Champions Ruta Liga Ronda 2 — resuélvela allí primero)` };
    const resCampeones = clCampeones.length === 12 ? sortear(clCampeones) : { error: `${clCampeones.length}/12 de Ruta Campeones (vienen de Champions Ronda 2 — resuélvela allí primero)` };
    if (resLiga.error || resCampeones.error) { setSorteoR3({ error: `Ruta Liga: ${resLiga.error || "OK"} · Ruta Campeones: ${resCampeones.error || "OK"}` }); return; }
    const cruces = [
      ...resCampeones.cruces.map((c, i) => ({ id: `R3-CP-${i + 1}`, ruta: "Campeones", cabeza: c.cabeza, rival: c.rival })),
      ...resLiga.cruces.map((c, i) => ({ id: `R3-LP-${i + 1}`, ruta: "Liga", cabeza: c.cabeza, rival: c.rival })),
    ];
    setSorteoR3({ cruces, bloqueo: resLiga.bloqueo || resCampeones.bloqueo });
    setResR3({}); setSorteoPO(null); setResPO({});
  };
  const r3Completa = useMemo(() => sorteoR3 && !sorteoR3.error && sorteoR3.cruces.every((t) => estadoEliminatoria(resR3[t.id]).fase === "resuelto"), [sorteoR3, resR3]);

  const simularPlayoff = () => {
    const g = sorteoR3.cruces.map((t) => { const r = resolverGenerico(sorteoR3.cruces, resR3, t.id); return r ? { ...r.ganador, ruta: t.ruta } : null; }).filter(Boolean);
    const propiosLiga = g.filter((x) => x.ruta === "Liga");
    const propiosCampeones = g.filter((x) => x.ruta === "Campeones");
    const clR3Campeones = cl.perdedoresR3.filter((p) => p.ruta === "Campeones").map((p) => ({ nombre: p.perdedor, pais: p.pais, coef: coefs[p.perdedor] })).filter((p) => p.coef !== undefined);
    const plazasLiga = [...propiosLiga, ...EL_NUEVOS_PO.map((e) => ({ nombre: e.nombre, pais: e.pais, coef: e.coef }))];
    const plazasCampeones = [...propiosCampeones, ...clR3Campeones];
    const resLiga = sortear(plazasLiga);
    const resCampeones = plazasCampeones.length === 12 ? sortear(plazasCampeones) : { error: `${plazasCampeones.length}/12 (faltan ${12 - plazasCampeones.length} perdedores de Champions Ruta Campeones Ronda 3 — resuélvela allí primero)` };
    if (resLiga.error || resCampeones.error) { setSorteoPO({ error: `Ruta Liga: ${resLiga.error || "OK"} · Ruta Campeones: ${resCampeones.error || "OK"}` }); return; }
    const cruces = [
      ...resCampeones.cruces.map((c, i) => ({ id: `PO-CP-${i + 1}`, ruta: "Campeones", cabeza: c.cabeza, rival: c.rival })),
      ...resLiga.cruces.map((c, i) => ({ id: `PO-LP-${i + 1}`, ruta: "Liga", cabeza: c.cabeza, rival: c.rival })),
    ];
    setSorteoPO({ cruces, bloqueo: resLiga.bloqueo || resCampeones.bloqueo });
    setResPO({});
  };
  const clasificados = useMemo(() => {
    if (!sorteoPO || sorteoPO.error) return null;
    if (!sorteoPO.cruces.every((t) => estadoEliminatoria(resPO[t.id]).fase === "resuelto")) return null;
    return sorteoPO.cruces.map((t) => resolverGenerico(sorteoPO.cruces, resPO, t.id).ganador);
  }, [sorteoPO, resPO]);

  const rellenarR1 = () => { const n = {}; EL_RONDA1.forEach((t) => { n[t.id] = generarResultadoAleatorio(); }); setResR1(n); };
  const rellenarR2 = () => { const n = {}; EL_RONDA2.forEach((t) => { n[t.id] = generarResultadoAleatorio(); }); setResR2(n); };
  const rellenarR3 = () => { if (!sorteoR3 || sorteoR3.error) return; const n = {}; sorteoR3.cruces.forEach((t) => { n[t.id] = generarResultadoAleatorio(); }); setResR3(n); };
  const rellenarPO = () => { if (!sorteoPO || sorteoPO.error) return; const n = {}; sorteoPO.cruces.forEach((t) => { n[t.id] = generarResultadoAleatorio(); }); setResPO(n); };

  const perdedoresR1 = useMemo(() => EL_RONDA1.map((t) => {
    const r = resolverR1(t.id);
    return r && r.esReal ? { tie: t.id, perdedor: r.perdedor, pais: r.paisPerdedor } : null;
  }).filter(Boolean), [resR1, coefs]);

  const perdedoresR2 = useMemo(() => EL_RONDA2.map((tie) => {
    const r = resolverR2(tie.id);
    return r ? { tie: tie.id, perdedor: r.perdedorNombre, pais: r.perdedorPais } : null;
  }).filter(Boolean), [resR1, resR2, coefs]);

  const perdedoresR3 = useMemo(() => {
    if (!sorteoR3 || sorteoR3.error) return [];
    return sorteoR3.cruces.map((t) => { const r = resolverGenerico(sorteoR3.cruces, resR3, t.id); return r ? { tie: t.id, perdedor: r.perdedor.nombre, pais: r.perdedor.pais, ruta: t.ruta } : null; }).filter(Boolean);
  }, [sorteoR3, resR3]);

  const perdedoresPO = useMemo(() => {
    if (!sorteoPO || sorteoPO.error) return [];
    return sorteoPO.cruces.map((t) => { const r = resolverGenerico(sorteoPO.cruces, resPO, t.id); return r ? { tie: t.id, perdedor: r.perdedor.nombre, pais: r.perdedor.pais, ruta: t.ruta } : null; }).filter(Boolean);
  }, [sorteoPO, resPO]);

  return {
    coefs, allTeams,
    resR1, changeR1, resetR1, resolverR1,
    resR2, changeR2, resetR2, resolverLadoR2, resolverR2, r2Completa,
    sorteoR3, resR3, changeR3, resetR3, r3Completa, simularR3,
    sorteoPO, resPO, changePO, resetPO, simularPlayoff,
    clasificados, resolverGenerico,
    rellenarR1, rellenarR2, rellenarR3, rellenarPO,
    perdedoresR1, perdedoresR2, perdedoresR3, perdedoresPO,
  };
}

// ============================================================
// LÓGICA — CONFERENCE LEAGUE (recibe datos de Champions y Europa en directo)
// ============================================================
function useConference(cl, el) {
  const coefs = CO_COEFS_INICIALES;
  const [resR1, setResR1] = useState({});
  const [resR2, setResR2] = useState({});
  const [sorteoR3, setSorteoR3] = useState(null);
  const [resR3, setResR3] = useState({});
  const [sorteoPO, setSorteoPO] = useState(null);
  const [resPO, setResPO] = useState({});

  const changeR1 = (id, field, value) => setResR1((p) => ({ ...p, [id]: { ...p[id], [field]: value } }));
  const changeR2 = (id, field, value) => setResR2((p) => ({ ...p, [id]: { ...p[id], [field]: value } }));
  const changeR3 = (id, field, value) => setResR3((p) => ({ ...p, [id]: { ...p[id], [field]: value } }));
  const changePO = (id, field, value) => setResPO((p) => ({ ...p, [id]: { ...p[id], [field]: value } }));
  const resetR1 = (id) => setResR1((p) => { const n = { ...p }; delete n[id]; return n; });
  const resetR2 = (id) => setResR2((p) => { const n = { ...p }; delete n[id]; return n; });
  const resetR3 = (id) => setResR3((p) => { const n = { ...p }; delete n[id]; return n; });
  const resetPO = (id) => setResPO((p) => { const n = { ...p }; delete n[id]; return n; });

  const allTeams = useMemo(() => Object.keys(coefs).sort((a, b) => (coefs[b] ?? -1) - (coefs[a] ?? -1)), [coefs]);

  const resolverR1 = (tieId) => {
    const tie = CO_RONDA1.find((t) => t.id === tieId);
    if (!tie) return null;
    const est = estadoEliminatoria(resR1[tieId]);
    if (est.fase === "resuelto") {
      const nombre = est.ganador === "A" ? tie.a : tie.b;
      const pais = est.ganador === "A" ? tie.paisA : tie.paisB;
      return { nombre, pais, coef: coefs[nombre], esReal: true };
    }
    return { esReal: false };
  };
  // Perdedor de Champions R1 (Ruta Campeones, o el reequilibrio directo a R3)
  const resolverExternoCL = (tieId) => {
    const info = CL_R1_INFO[tieId];
    const dato = cl.perdedoresR1.find((p) => p.tie === tieId);
    if (dato) return { nombre: dato.perdedor, nombreBase: dato.perdedor, pais: dato.pais, coef: coefs[dato.perdedor], definido: true, texto: `${dato.perdedor} (${dato.pais})` };
    return { texto: `Perdedor ${tieId} de Champions League (${info[0].n} o ${info[1].n} — pendiente)`, pais: undefined, coef: undefined, definido: false };
  };
  const resolverExternoEL = (tieId) => {
    const info = EL_R1_INFO[tieId];
    const dato = el.perdedoresR1.find((p) => p.tie === tieId);
    if (dato) return { nombre: dato.perdedor, nombreBase: dato.perdedor, pais: dato.pais, coef: coefs[dato.perdedor], definido: true, texto: `${dato.perdedor} (${dato.pais})` };
    return { texto: `Perdedor ${tieId} de Europa League (${info[0].n} o ${info[1].n} — pendiente)`, pais: undefined, coef: undefined, definido: false };
  };
  const resolverLado = (lado) => {
    if (lado.tipo === "literal") return { nombre: lado.nombre, nombreBase: lado.nombre, pais: lado.pais, coef: coefs[lado.nombre], definido: true, texto: `${lado.nombre} (${lado.pais})` };
    if (lado.tipo === "interno") {
      const r = resolverR1(lado.ref);
      if (!r || !r.esReal) return { texto: `Ganador ${lado.ref} (pendiente)`, pais: undefined, coef: undefined, definido: false };
      return { nombre: r.nombre, nombreBase: r.nombre, pais: r.pais, coef: r.coef, definido: true, texto: `${r.nombre} (${r.pais})` };
    }
    if (lado.tipo === "externo-el") return resolverExternoEL(lado.tieId);
    return null;
  };
  const resolverR2 = (tie, ladoA, ladoB) => {
    if (!ladoA.definido || !ladoB.definido) return null;
    const est = estadoEliminatoria(resR2[tie.id]);
    if (est.fase !== "resuelto") return null;
    const g = est.ganador === "A" ? ladoA : ladoB;
    const p = est.ganador === "A" ? ladoB : ladoA;
    return { nombre: g.nombreBase, pais: g.pais, coef: g.coef, perdedorNombre: p.nombreBase, perdedorPais: p.pais };
  };
  const resolverGenerico = (cruces, resultados, tieId) => {
    const tie = cruces.find((t) => t.id === tieId);
    if (!tie) return null;
    const est = estadoEliminatoria(resultados[tieId]);
    if (est.fase !== "resuelto") return null;
    return { ganador: est.ganador === "A" ? tie.cabeza : tie.rival, perdedor: est.ganador === "A" ? tie.rival : tie.cabeza };
  };

  const r2Completa = useMemo(() => {
    const campeonesOk = CO_RONDA2_CAMPEONES.every((t) => {
      const ladoA = resolverExternoCL(t.ext1tie), ladoB = resolverExternoCL(t.ext2tie);
      return ladoA.definido && ladoB.definido && estadoEliminatoria(resR2[t.id]).fase === "resuelto";
    });
    const principalOk = CO_RONDA2_PRINCIPAL.every((t) => {
      const ladoA = resolverLado(t.a), ladoB = resolverLado(t.b);
      return ladoA.definido && ladoB.definido && estadoEliminatoria(resR2[t.id]).fase === "resuelto";
    });
    return campeonesOk && principalOk;
  }, [resR1, resR2, coefs, cl.perdedoresR1, el.perdedoresR1]);

  const simularR3 = () => {
    const propiosCampeones = CO_RONDA2_CAMPEONES.map((tie) => {
      const ladoA = resolverExternoCL(tie.ext1tie), ladoB = resolverExternoCL(tie.ext2tie);
      const r = resolverR2(tie, ladoA, ladoB);
      return r ? { nombre: r.nombre, pais: r.pais, coef: r.coef } : null;
    }).filter(Boolean);
    const reequilibrioCL = cl.perdedoresR1.filter((p) => p.reequilibrio)
      .map((p) => ({ nombre: p.perdedor, pais: p.pais, coef: coefs[p.perdedor] })).filter((p) => p.coef !== undefined);
    const propiosLiga = CO_RONDA2_PRINCIPAL.map((tie) => {
      const ladoA = resolverLado(tie.a), ladoB = resolverLado(tie.b);
      const r = resolverR2(tie, ladoA, ladoB);
      return r ? { nombre: r.nombre, pais: r.pais, coef: r.coef } : null;
    }).filter(Boolean);
    const perdedoresELr2 = el.perdedoresR2.map((p) => ({ nombre: p.perdedor, pais: p.pais, coef: coefs[p.perdedor] })).filter((p) => p.coef !== undefined);

    const poolCampeones = [...propiosCampeones, ...reequilibrioCL];
    const poolLiga = [...propiosLiga, ...perdedoresELr2];
    const resCampeones = poolCampeones.length === 8 ? sortear(poolCampeones) : { error: `${poolCampeones.length}/8 (faltan ${8 - poolCampeones.length} del reequilibrio de Champions Ronda 1 — resuélvela allí primero)` };
    const resLiga = poolLiga.length === 52 ? sortear(poolLiga) : { error: `${poolLiga.length}/52 (faltan ${52 - poolLiga.length} perdedores de Europa League Ronda 2 — resuélvela allí primero)` };
    if (resCampeones.error || resLiga.error) { setSorteoR3({ error: `Ruta Campeones: ${resCampeones.error || "OK"} · Ruta Liga: ${resLiga.error || "OK"}` }); return; }
    const cruces = [
      ...resCampeones.cruces.map((c, i) => ({ id: `R3-CP-${i + 1}`, ruta: "Campeones", cabeza: c.cabeza, rival: c.rival })),
      ...resLiga.cruces.map((c, i) => ({ id: `R3-LP-${i + 1}`, ruta: "Liga", cabeza: c.cabeza, rival: c.rival })),
    ];
    setSorteoR3({ cruces, bloqueo: resCampeones.bloqueo || resLiga.bloqueo });
    setResR3({}); setSorteoPO(null); setResPO({});
  };
  const r3Completa = useMemo(() => sorteoR3 && !sorteoR3.error && sorteoR3.cruces.every((t) => estadoEliminatoria(resR3[t.id]).fase === "resuelto"), [sorteoR3, resR3]);

  const simularPlayoff = () => {
    const g = sorteoR3.cruces.map((t) => { const r = resolverGenerico(sorteoR3.cruces, resR3, t.id); return r ? { ...r.ganador, ruta: t.ruta } : null; }).filter(Boolean);
    const propiosCampeones = g.filter((x) => x.ruta === "Campeones");
    const propiosLiga = g.filter((x) => x.ruta === "Liga");
    const perdedoresELr3Campeones = el.perdedoresR3.filter((p) => p.ruta === "Campeones").map((p) => ({ nombre: p.perdedor, pais: p.pais, coef: coefs[p.perdedor] })).filter((p) => p.coef !== undefined);
    const perdedoresELr3Liga = el.perdedoresR3.filter((p) => p.ruta === "Liga").map((p) => ({ nombre: p.perdedor, pais: p.pais, coef: coefs[p.perdedor] })).filter((p) => p.coef !== undefined);

    const poolCampeones = [...propiosCampeones, ...perdedoresELr3Campeones];
    const poolLiga = [...propiosLiga, ...CO_NUEVOS_PO_LIGA, ...perdedoresELr3Liga]; // confirmado: UEFA access list oficial
    const resCampeones = poolCampeones.length === 10 ? sortear(poolCampeones) : { error: `${poolCampeones.length}/10 (faltan ${10 - poolCampeones.length} perdedores de Europa League Ronda 3 Ruta Campeones — resuélvela allí primero)` };
    const resLiga = poolLiga.length === 38 ? sortear(poolLiga) : { error: `${poolLiga.length}/38 — faltan los 5 equipos de 6º puesto sin nombre confirmado (ver aviso arriba) más los que falten de Europa League Ronda 3 Ruta Liga` };
    if (resCampeones.error || resLiga.error) { setSorteoPO({ error: `Ruta Campeones: ${resCampeones.error || "OK"} · Ruta Liga: ${resLiga.error || "OK"}` }); return; }
    const cruces = [
      ...resCampeones.cruces.map((c, i) => ({ id: `PO-CP-${i + 1}`, ruta: "Campeones", cabeza: c.cabeza, rival: c.rival })),
      ...resLiga.cruces.map((c, i) => ({ id: `PO-LP-${i + 1}`, ruta: "Liga", cabeza: c.cabeza, rival: c.rival })),
    ];
    setSorteoPO({ cruces, bloqueo: resCampeones.bloqueo || resLiga.bloqueo });
    setResPO({});
  };
  const clasificados = useMemo(() => {
    if (!sorteoPO || sorteoPO.error) return null;
    if (!sorteoPO.cruces.every((t) => estadoEliminatoria(resPO[t.id]).fase === "resuelto")) return null;
    return sorteoPO.cruces.map((t) => resolverGenerico(sorteoPO.cruces, resPO, t.id).ganador);
  }, [sorteoPO, resPO]);

  const rellenarR1 = () => { const n = {}; CO_RONDA1.forEach((t) => { n[t.id] = generarResultadoAleatorio(); }); setResR1(n); };
  const rellenarR2 = () => {
    const n = { ...resR2 };
    CO_RONDA2_CAMPEONES.forEach((t) => { const a = resolverExternoCL(t.ext1tie), b = resolverExternoCL(t.ext2tie); if (a.definido && b.definido) n[t.id] = generarResultadoAleatorio(); });
    CO_RONDA2_PRINCIPAL.forEach((t) => { const a = resolverLado(t.a), b = resolverLado(t.b); if (a.definido && b.definido) n[t.id] = generarResultadoAleatorio(); });
    setResR2(n);
  };
  const rellenarR3 = () => { if (!sorteoR3 || sorteoR3.error) return; const n = {}; sorteoR3.cruces.forEach((t) => { n[t.id] = generarResultadoAleatorio(); }); setResR3(n); };
  const rellenarPO = () => { if (!sorteoPO || sorteoPO.error) return; const n = {}; sorteoPO.cruces.forEach((t) => { n[t.id] = generarResultadoAleatorio(); }); setResPO(n); };

  return {
    coefs, allTeams,
    resR1, changeR1, resetR1, resolverR1,
    resR2, changeR2, resetR2, resolverExternoCL, resolverLado, resolverR2, r2Completa,
    sorteoR3, resR3, changeR3, resetR3, r3Completa, simularR3,
    sorteoPO, resPO, changePO, resetPO, simularPlayoff,
    clasificados, resolverGenerico,
    rellenarR1, rellenarR2, rellenarR3, rellenarPO,
  };
}

// ============================================================
// TEMAS DE COLOR POR COMPETICIÓN
// ============================================================
const TEMA_CL = { fondo: "#0B1F16", tarjeta: "#0F2E22", borde: "#1C4534", acento: "#D4A94C", texto: "#F4F1E8", textoSuave: "#8FA396", alerta: "#E8734A", inputBg: "#0B1F16", inputBorder: "#2A5A44", rutaCampeones: "#D4A94C", rutaLiga: "#4AA0D4", rutaPrincipal: "#4AA0D4" };
const TEMA_EL = { fondo: "#1F0B14", tarjeta: "#2A0F1A", borde: "#4A1F2E", acento: "#E8734A", texto: "#F4F1E8", textoSuave: "#B08A94", alerta: "#E8734A", inputBg: "#1F0B14", inputBorder: "#5C2A3E", rutaCampeones: "#D4A94C", rutaLiga: "#4A90D4", rutaPrincipal: "#E8734A" };
const TEMA_CO = { fondo: "#0B1420", tarjeta: "#0F2436", borde: "#1C3A54", acento: "#4A90D4", texto: "#F4F1E8", textoSuave: "#7A94B0", alerta: "#E8734A", inputBg: "#0B1420", inputBorder: "#2A4A64", rutaCampeones: "#D4A94C", rutaLiga: "#4A90D4", rutaPrincipal: "#4A90D4" };

function TieCard({ nombreA, paisA, nombreB, paisB, ruta, nota, tie, resultado, onChange, onReset, definido, colores, ganador, perdedor, destinoGanador, destinoPerdedor }) {
  return (
    <div style={{ background: colores.tarjeta, border: `1px solid ${colores.borde}`, borderRadius: 8, padding: "12px 16px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8, flexWrap: "wrap", gap: 6 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: 1, color: colores.acento, border: `1px solid ${colores.borde}`, borderRadius: 4, padding: "2px 6px", whiteSpace: "nowrap" }}>{tie.id}</span>
          <div style={{ color: colores.texto, fontSize: 14 }}>{nombreA} {paisA && <span style={{ color: colores.textoSuave, fontSize: 11 }}>({paisA})</span>} vs {nombreB} {paisB && <span style={{ color: colores.textoSuave, fontSize: 11 }}>({paisB})</span>}</div>
        </div>
        {ruta && <RutaBadge ruta={ruta} colores={colores} />}
      </div>
      {nota && <div style={{ color: colores.alerta, fontSize: 11, marginBottom: 6 }}>{nota}</div>}
      <TieResultInputs tie={tie} resultado={resultado} onChange={onChange} onReset={onReset} definido={definido} colores={colores} />
      <DestinoEquipos ganador={ganador} perdedor={perdedor} destinoGanador={destinoGanador} destinoPerdedor={destinoPerdedor} colores={colores} />
    </div>
  );
}

function CabeceraRonda({ titulo, fechas, colores, onRellenar, disabledRellenar }) {
  return (
    <div style={{ marginBottom: 4 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 2 }}>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", color: colores.textoSuave, fontSize: 12, letterSpacing: 2 }}>{titulo}</div>
        {onRellenar && <BotonAleatorio onClick={onRellenar} label="Simular" colores={colores} />}
      </div>
      <div style={{ color: colores.textoSuave, fontSize: 11, fontFamily: "'JetBrains Mono', monospace", marginBottom: 10 }}>{fechas}</div>
    </div>
  );
}

function BotonSorteo({ onClick, disabled, label, colores }) {
  return (
    <button onClick={onClick} disabled={disabled}
      style={{ background: disabled ? "#2A2A2A" : colores.acento, color: disabled ? "#6A6A6A" : colores.fondo, border: "none", borderRadius: 8, padding: "12px 24px", fontSize: 15, fontWeight: 600, fontFamily: "'Oswald', sans-serif", cursor: disabled ? "not-allowed" : "pointer", marginBottom: 20 }}>
      🎲 {label}
    </button>
  );
}

// ============================================================
// VISTA — CHAMPIONS LEAGUE
// ============================================================
function ChampionsView({ cl }) {
  const t = TEMA_CL;
  return (
    <div>
      <div style={{ fontFamily: "'JetBrains Mono', monospace", color: t.textoSuave, fontSize: 12, letterSpacing: 2, marginBottom: 12 }}>COEFICIENTES UEFA</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(210px, 1fr))", gap: 8, marginBottom: 28, maxHeight: 300, overflowY: "auto", paddingRight: 4 }}>
        {cl.allTeams.map((team, idx) => (
          <div key={team} style={{ display: "flex", alignItems: "center", gap: 8, background: t.tarjeta, border: `1px solid ${t.borde}`, borderRadius: 8, padding: "6px 10px" }}>
            <span style={{ color: t.textoSuave, fontSize: 10, fontFamily: "'JetBrains Mono', monospace", width: 22 }}>{idx + 1}</span>
            <span style={{ color: t.texto, fontSize: 12, flex: 1 }}>{team}</span>
            <span style={{ color: t.textoSuave, fontFamily: "'JetBrains Mono', monospace", fontSize: 11 }}>{cl.coefs[team]?.toFixed(3) ?? "—"}</span>
          </div>
        ))}
      </div>

      <CabeceraRonda titulo="RONDA 1" fechas={CL_FECHAS.R1} colores={t} onRellenar={cl.rellenarR1} />
      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 28 }}>
        {CL_RONDA1.map((tie) => {
          const r = cl.resolverR1(tie.id);
          const ganador = r?.esReal ? { nombre: r.nombre, pais: r.pais } : null;
          const perdedor = r?.esReal ? { nombre: r.perdedor, pais: r.paisPerdedor } : null;
          const destinoPerdedor = tie.nota ? "Pasa a Ronda 3 de Conference League (reequilibrio)" : "Pasa a Ronda 2 de Conference League (Ruta de Campeones)";
          return (
            <TieCard key={tie.id} nombreA={tie.a} paisA={tie.paisA} nombreB={tie.b} paisB={tie.paisB} ruta={tie.ruta} nota={tie.nota}
              tie={tie} resultado={cl.resR1[tie.id]} onChange={cl.changeR1} onReset={cl.resetR1} colores={t}
              ganador={ganador} perdedor={perdedor} destinoGanador="Continúa a Ronda 2 de Champions League" destinoPerdedor={destinoPerdedor} />
          );
        })}
      </div>

      <CabeceraRonda titulo="RONDA 2 (ya sorteada)" fechas={CL_FECHAS.R2} colores={t} onRellenar={cl.rellenarR2} />
      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 12 }}>
        {CL_RONDA2.map((tie) => {
          const ladoA = cl.resolverLadoR2(tie.aRef, tie.paisA), ladoB = cl.resolverLadoR2(tie.bRef, tie.paisB);
          const definido = ladoA.esReal && ladoB.esReal;
          const r = cl.resolverR2(tie.id);
          const ganador = r ? { nombre: r.nombre, pais: r.pais } : null;
          const perdedor = r ? { nombre: r.perdedorNombre, pais: r.perdedorPais } : null;
          return (
            <TieCard key={tie.id} nombreA={ladoA.texto} nombreB={ladoB.texto} ruta={tie.ruta}
              tie={tie} resultado={cl.resR2[tie.id]} onChange={cl.changeR2} onReset={cl.resetR2} definido={definido} colores={t}
              ganador={ganador} perdedor={perdedor} destinoGanador="Continúa a Ronda 3 de Champions League" destinoPerdedor="Pasa a Ronda 3 de Europa League (misma ruta)" />
          );
        })}
      </div>
      {!cl.r2Completa && <div style={{ color: t.alerta, fontSize: 12, marginBottom: 20 }}>Completa todos los resultados de Ronda 2 para poder sortear la Ronda 3.</div>}

      <EntrantesConfirmados titulo="Nuevos entrantes de Ronda 3 (Ruta Liga): Lyon, NEC Nijmegen, Union Saint-Gilloise, Sparta Praga, Bodø/Glimt, Olympiakos" lista={[]} colores={t} />
      <BotonSorteo onClick={cl.simularR3} disabled={!cl.r2Completa} label={cl.sorteoR3 ? "Volver a sortear la Ronda 3" : "Sortear Ronda 3"} colores={t} />

      {cl.sorteoR3 && cl.sorteoR3.error && <div style={{ color: t.alerta, fontSize: 13, marginBottom: 20 }}>{cl.sorteoR3.error}</div>}
      {cl.sorteoR3 && !cl.sorteoR3.error && (
        <>
          <CabeceraRonda titulo={`RONDA 3 (sorteo simulado)${cl.sorteoR3.bloqueo ? " · ⚠️ bloqueo" : ""}`} fechas={CL_FECHAS.R3} colores={t} onRellenar={cl.rellenarR3} />
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 12 }}>
            {cl.sorteoR3.cruces.map((tie) => {
              const r = cl.resolverGenerico(cl.sorteoR3.cruces, cl.resR3, tie.id);
              const destinoPerdedor = tie.ruta === "Campeones" ? "Pasa al Playoff de Europa League (Ruta Campeones)" : "Pasa directo a la Fase de Liga de Europa League (Ruta Liga)";
              return (
                <TieCard key={tie.id} nombreA={tie.cabeza.nombre} paisA={tie.cabeza.pais} nombreB={tie.rival.nombre} paisB={tie.rival.pais} ruta={tie.ruta}
                  tie={tie} resultado={cl.resR3[tie.id]} onChange={cl.changeR3} onReset={cl.resetR3} colores={t}
                  ganador={r?.ganador} perdedor={r?.perdedor} destinoGanador="Continúa al Playoff de Champions League" destinoPerdedor={destinoPerdedor} />
              );
            })}
          </div>
          {!cl.r3Completa && <div style={{ color: t.alerta, fontSize: 12, marginBottom: 12 }}>Completa todos los resultados de Ronda 3 para poder sortear el Playoff.</div>}
          <EntrantesConfirmados titulo="Nuevos entrantes del Playoff (Ruta Campeones): Viking, AEK Atenas, LASK Linz, Celtic" lista={[]} colores={t} />
          <BotonSorteo onClick={cl.simularPlayoff} disabled={!cl.r3Completa} label={cl.sorteoPO ? "Volver a sortear el Playoff" : "Sortear Playoff"} colores={t} />
        </>
      )}

      {cl.sorteoPO && cl.sorteoPO.error && <div style={{ color: t.alerta, fontSize: 13, marginBottom: 20 }}>{cl.sorteoPO.error}</div>}
      {cl.sorteoPO && !cl.sorteoPO.error && (
        <>
          <CabeceraRonda titulo={`PLAYOFF (sorteo simulado)${cl.sorteoPO.bloqueo ? " · ⚠️ bloqueo" : ""}`} fechas={CL_FECHAS.PO} colores={t} onRellenar={cl.rellenarPO} />
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 24 }}>
            {cl.sorteoPO.cruces.map((tie) => {
              const r = cl.resolverGenerico(cl.sorteoPO.cruces, cl.resPO, tie.id);
              return (
                <TieCard key={tie.id} nombreA={tie.cabeza.nombre} paisA={tie.cabeza.pais} nombreB={tie.rival.nombre} paisB={tie.rival.pais} ruta={tie.ruta}
                  tie={tie} resultado={cl.resPO[tie.id]} onChange={cl.changePO} onReset={cl.resetPO} colores={t}
                  ganador={r?.ganador} perdedor={r?.perdedor} destinoGanador="Clasificado a la Fase de Liga de Champions League" destinoPerdedor="Pasa directo a la Fase de Liga de Europa League" />
              );
            })}
          </div>
        </>
      )}

      {cl.clasificados && (
        <div style={{ background: t.tarjeta, border: `1px solid ${t.acento}`, borderRadius: 8, padding: 16, marginBottom: 20 }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", color: t.acento, fontSize: 12, letterSpacing: 2, marginBottom: 10 }}>CLASIFICADOS A FASE DE LIGA (vía playoff)</div>
          {cl.clasificados.map((c, i) => <div key={i} style={{ color: t.texto, fontSize: 14, padding: "2px 0" }}>{c.nombre} ({c.pais})</div>)}
          <div style={{ color: t.textoSuave, fontSize: 11, marginTop: 8 }}>+ 29 equipos clasificados directamente (no cargados en este simulador)</div>
        </div>
      )}
    </div>
  );
}

// ============================================================
// VISTA — EUROPA LEAGUE
// ============================================================
function EuropaView({ el, cl }) {
  const t = TEMA_EL;
  return (
    <div>
      <div style={{ fontFamily: "'JetBrains Mono', monospace", color: t.textoSuave, fontSize: 12, letterSpacing: 2, marginBottom: 12 }}>COEFICIENTES UEFA</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(210px, 1fr))", gap: 8, marginBottom: 28, maxHeight: 300, overflowY: "auto", paddingRight: 4 }}>
        {el.allTeams.map((team, idx) => (
          <div key={team} style={{ display: "flex", alignItems: "center", gap: 8, background: t.tarjeta, border: `1px solid ${t.borde}`, borderRadius: 8, padding: "6px 10px" }}>
            <span style={{ color: t.textoSuave, fontSize: 10, fontFamily: "'JetBrains Mono', monospace", width: 22 }}>{idx + 1}</span>
            <span style={{ color: t.texto, fontSize: 12, flex: 1 }}>{team}</span>
            <span style={{ color: t.textoSuave, fontFamily: "'JetBrains Mono', monospace", fontSize: 11 }}>{el.coefs[team]?.toFixed(3) ?? "—"}</span>
          </div>
        ))}
      </div>

      <CabeceraRonda titulo="RONDA 1" fechas={EL_FECHAS.R1} colores={t} onRellenar={el.rellenarR1} />
      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 28 }}>
        {EL_RONDA1.map((tie) => {
          const r = el.resolverR1(tie.id);
          const ganador = r?.esReal ? { nombre: r.nombre, pais: r.pais } : null;
          const perdedor = r?.esReal ? { nombre: r.perdedor, pais: r.paisPerdedor } : null;
          return (
            <TieCard key={tie.id} nombreA={tie.a} paisA={tie.paisA} nombreB={tie.b} paisB={tie.paisB}
              tie={tie} resultado={el.resR1[tie.id]} onChange={el.changeR1} onReset={el.resetR1} colores={t}
              ganador={ganador} perdedor={perdedor} destinoGanador="Continúa a Ronda 2 de Europa League" destinoPerdedor="Pasa a Ronda 2 de Conference League" />
          );
        })}
      </div>

      <CabeceraRonda titulo="RONDA 2 (ya sorteada)" fechas={EL_FECHAS.R2} colores={t} onRellenar={el.rellenarR2} />
      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 12 }}>
        {EL_RONDA2.map((tie) => {
          const ladoA = el.resolverLadoR2(tie.aRef, tie.paisA), ladoB = el.resolverLadoR2(tie.bRef, tie.paisB);
          const definido = ladoA.esReal && ladoB.esReal;
          const r = el.resolverR2(tie.id);
          const ganador = r ? { nombre: r.nombre, pais: r.pais } : null;
          const perdedor = r ? { nombre: r.perdedorNombre, pais: r.perdedorPais } : null;
          return (
            <TieCard key={tie.id} nombreA={ladoA.texto} nombreB={ladoB.texto}
              tie={tie} resultado={el.resR2[tie.id]} onChange={el.changeR2} onReset={el.resetR2} definido={definido} colores={t}
              ganador={ganador} perdedor={perdedor} destinoGanador="Continúa a Ronda 3 de Europa League" destinoPerdedor="Pasa a Ronda 3 de Conference League" />
          );
        })}
      </div>
      {!el.r2Completa && <div style={{ color: t.alerta, fontSize: 12, marginBottom: 20 }}>Completa todos los resultados de Ronda 2 para poder sortear la Ronda 3.</div>}

      <EntrantesConfirmados titulo="Nuevos entrantes de Ronda 3 (Ruta Liga): Salzburgo, Rangers, Jagiellonia Białystok. Ruta Campeones: se alimenta de perdedores de Champions Ronda 2 (en directo)." lista={[]} colores={t} />
      <BotonSorteo onClick={el.simularR3} disabled={!el.r2Completa} label={el.sorteoR3 ? "Volver a sortear la Ronda 3" : "Sortear Ronda 3"} colores={t} />

      {el.sorteoR3 && el.sorteoR3.error && <div style={{ color: t.alerta, fontSize: 13, marginBottom: 20 }}>{el.sorteoR3.error}</div>}
      {el.sorteoR3 && !el.sorteoR3.error && (
        <>
          <CabeceraRonda titulo={`RONDA 3 (sorteo simulado)${el.sorteoR3.bloqueo ? " · ⚠️ bloqueo" : ""}`} fechas={EL_FECHAS.R3} colores={t} onRellenar={el.rellenarR3} />
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 12 }}>
            {el.sorteoR3.cruces.map((tie) => {
              const r = el.resolverGenerico(el.sorteoR3.cruces, el.resR3, tie.id);
              const destinoPerdedor = `Pasa al Playoff de Conference League (Ruta ${tie.ruta})`;
              return (
                <TieCard key={tie.id} nombreA={tie.cabeza.nombre} paisA={tie.cabeza.pais} nombreB={tie.rival.nombre} paisB={tie.rival.pais} ruta={tie.ruta}
                  tie={tie} resultado={el.resR3[tie.id]} onChange={el.changeR3} onReset={el.resetR3} colores={t}
                  ganador={r?.ganador} perdedor={r?.perdedor} destinoGanador="Continúa al Playoff de Europa League" destinoPerdedor={destinoPerdedor} />
              );
            })}
          </div>
          {!el.r3Completa && <div style={{ color: t.alerta, fontSize: 12, marginBottom: 12 }}>Completa todos los resultados de Ronda 3 para poder sortear el Playoff.</div>}
          <EntrantesConfirmados titulo="Nuevos entrantes del Playoff (Ruta Liga): Sint-Truidense, Lillestrøm, Karviná, OFI Creta, Trabzonspor" lista={[]} colores={t} />
          <BotonSorteo onClick={el.simularPlayoff} disabled={!el.r3Completa} label={el.sorteoPO ? "Volver a sortear el Playoff" : "Sortear Playoff"} colores={t} />
        </>
      )}

      {el.sorteoPO && el.sorteoPO.error && <div style={{ color: t.alerta, fontSize: 13, marginBottom: 20 }}>{el.sorteoPO.error}</div>}
      {el.sorteoPO && !el.sorteoPO.error && (
        <>
          <CabeceraRonda titulo={`PLAYOFF (sorteo simulado)${el.sorteoPO.bloqueo ? " · ⚠️ bloqueo" : ""}`} fechas={EL_FECHAS.PO} colores={t} onRellenar={el.rellenarPO} />
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 24 }}>
            {el.sorteoPO.cruces.map((tie) => {
              const r = el.resolverGenerico(el.sorteoPO.cruces, el.resPO, tie.id);
              return (
                <TieCard key={tie.id} nombreA={tie.cabeza.nombre} paisA={tie.cabeza.pais} nombreB={tie.rival.nombre} paisB={tie.rival.pais} ruta={tie.ruta}
                  tie={tie} resultado={el.resPO[tie.id]} onChange={el.changePO} onReset={el.resetPO} colores={t}
                  ganador={r?.ganador} perdedor={r?.perdedor} destinoGanador="Clasificado a la Fase de Liga de Europa League" destinoPerdedor="Pasa directo a la Fase de Liga de Conference League" />
              );
            })}
          </div>
        </>
      )}

      {el.clasificados && (
        <div style={{ background: t.tarjeta, border: `1px solid ${t.acento}`, borderRadius: 8, padding: 16, marginBottom: 20 }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", color: t.acento, fontSize: 12, letterSpacing: 2, marginBottom: 10 }}>CLASIFICADOS A FASE DE LIGA (vía playoff)</div>
          {el.clasificados.map((c, i) => <div key={i} style={{ color: t.texto, fontSize: 14, padding: "2px 0" }}>{c.nombre} ({c.pais})</div>)}
          <div style={{ color: t.textoSuave, fontSize: 11, marginTop: 10 }}>+ 13 equipos clasificados directamente (no cargados)</div>
          {(() => {
            const directosCL = [...cl.perdedoresPO, ...cl.perdedoresR3.filter((p) => p.ruta === "Liga")];
            return directosCL.length > 0 ? (
              <div style={{ marginTop: 6 }}>
                <div style={{ color: t.textoSuave, fontSize: 11 }}>+ directos desde Champions League (perdedores de Playoff y de Ronda 3 Ruta Liga) — {directosCL.length}/11 cargados:</div>
                {directosCL.map((p, i) => <div key={i} style={{ color: t.texto, fontSize: 13, padding: "1px 0" }}>{p.perdedor} ({p.pais})</div>)}
              </div>
            ) : <div style={{ color: t.textoSuave, fontSize: 11 }}>+ 11 perdedores de Champions League (Playoff y Ronda 3 Ruta Liga) — aún no cargados, resuelve esas rondas en Champions League</div>;
          })()}
        </div>
      )}
    </div>
  );
}

// ============================================================
// VISTA — CONFERENCE LEAGUE
// ============================================================
function ConferenceView({ co, cl, el }) {
  const t = TEMA_CO;
  return (
    <div>
      <div style={{ fontFamily: "'JetBrains Mono', monospace", color: t.textoSuave, fontSize: 12, letterSpacing: 2, marginBottom: 12 }}>COEFICIENTES UEFA</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 8, marginBottom: 28, maxHeight: 300, overflowY: "auto", paddingRight: 4 }}>
        {co.allTeams.map((team, idx) => (
          <div key={team} style={{ display: "flex", alignItems: "center", gap: 8, background: t.tarjeta, border: `1px solid ${t.borde}`, borderRadius: 8, padding: "5px 8px" }}>
            <span style={{ color: t.textoSuave, fontSize: 10, fontFamily: "'JetBrains Mono', monospace", width: 22 }}>{idx + 1}</span>
            <span style={{ color: t.texto, fontSize: 11, flex: 1 }}>{team}</span>
            <span style={{ color: t.textoSuave, fontFamily: "'JetBrains Mono', monospace", fontSize: 10 }}>{co.coefs[team]?.toFixed(3) ?? "—"}</span>
          </div>
        ))}
      </div>

      <CabeceraRonda titulo="RONDA 1 — 26 CRUCES" fechas={CO_FECHAS.R1} colores={t} onRellenar={co.rellenarR1} />
      <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 28, maxHeight: 420, overflowY: "auto", paddingRight: 4 }}>
        {CO_RONDA1.map((tie) => {
          const r = co.resolverR1(tie.id);
          const ganador = r?.esReal ? { nombre: r.nombre, pais: r.pais } : null;
          return (
            <TieCard key={tie.id} nombreA={tie.a} paisA={tie.paisA} nombreB={tie.b} paisB={tie.paisB} ruta="Principal"
              tie={tie} resultado={co.resR1[tie.id]} onChange={co.changeR1} onReset={co.resetR1} colores={t}
              ganador={ganador} perdedor={null} destinoGanador="Continúa a Ronda 2 de Conference League" />
          );
        })}
      </div>

      <CabeceraRonda titulo="RONDA 2 — RUTA DE CAMPEONES (6 cruces, desde Champions League en directo)" fechas={CO_FECHAS.R2} colores={t} onRellenar={co.rellenarR2} />
      <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 24 }}>
        {CO_RONDA2_CAMPEONES.map((tie) => {
          const ladoA = co.resolverExternoCL(tie.ext1tie), ladoB = co.resolverExternoCL(tie.ext2tie);
          const definido = ladoA.definido && ladoB.definido;
          const r = co.resolverR2(tie, ladoA, ladoB);
          const ganador = r ? { nombre: r.nombre, pais: r.pais } : null;
          return (
            <TieCard key={tie.id} nombreA={ladoA.texto} nombreB={ladoB.texto} ruta="Campeones"
              tie={tie} resultado={co.resR2[tie.id]} onChange={co.changeR2} onReset={co.resetR2} definido={definido} colores={t}
              ganador={ganador} perdedor={null} destinoGanador="Continúa a Ronda 3 de Conference League" />
          );
        })}
      </div>

      <div style={{ fontFamily: "'JetBrains Mono', monospace", color: t.textoSuave, fontSize: 12, letterSpacing: 2, marginBottom: 10 }}>RONDA 2 — RUTA PRINCIPAL (43 cruces, algunos desde Europa League en directo)</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 12, maxHeight: 500, overflowY: "auto", paddingRight: 4 }}>
        {CO_RONDA2_PRINCIPAL.map((tie) => {
          const ladoA = co.resolverLado(tie.a), ladoB = co.resolverLado(tie.b);
          const definido = ladoA.definido && ladoB.definido;
          const r = co.resolverR2(tie, ladoA, ladoB);
          const ganador = r ? { nombre: r.nombre, pais: r.pais } : null;
          return (
            <TieCard key={tie.id} nombreA={ladoA.texto} nombreB={ladoB.texto} ruta="Principal"
              tie={tie} resultado={co.resR2[tie.id]} onChange={co.changeR2} onReset={co.resetR2} definido={definido} colores={t}
              ganador={ganador} perdedor={null} destinoGanador="Continúa a Ronda 3 de Conference League" />
          );
        })}
      </div>
      {!co.r2Completa && <div style={{ color: t.alerta, fontSize: 12, marginBottom: 20 }}>Completa Ronda 2 (y que Champions/Europa League tengan sus resultados de Ronda 1 reales) para poder sortear la Ronda 3.</div>}

      <div style={{ color: t.textoSuave, fontSize: 12, marginBottom: 12 }}>Ronda 3 es automática: Ruta Campeones (6 propios + 2 reequilibrio de Champions R1) y Ruta Liga (43 propios + 9 de Europa League R2) — sin nada que añadir a mano.</div>
      <BotonSorteo onClick={co.simularR3} disabled={!co.r2Completa} label={co.sorteoR3 ? "Volver a sortear la Ronda 3" : "Sortear Ronda 3"} colores={t} />

      {co.sorteoR3 && co.sorteoR3.error && <div style={{ color: t.alerta, fontSize: 13, marginBottom: 20 }}>{co.sorteoR3.error}</div>}
      {co.sorteoR3 && !co.sorteoR3.error && (
        <>
          <CabeceraRonda titulo={`RONDA 3 (sorteo simulado)${co.sorteoR3.bloqueo ? " · ⚠️ bloqueo" : ""}`} fechas={CO_FECHAS.R3} colores={t} onRellenar={co.rellenarR3} />
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 12 }}>
            {co.sorteoR3.cruces.map((tie) => {
              const r = co.resolverGenerico(co.sorteoR3.cruces, co.resR3, tie.id);
              return (
                <TieCard key={tie.id} nombreA={tie.cabeza.nombre} paisA={tie.cabeza.pais} nombreB={tie.rival.nombre} paisB={tie.rival.pais} ruta={tie.ruta}
                  tie={tie} resultado={co.resR3[tie.id]} onChange={co.changeR3} onReset={co.resetR3} colores={t}
                  ganador={r?.ganador} perdedor={null} destinoGanador="Continúa al Playoff de Conference League" />
              );
            })}
          </div>
          {!co.r3Completa && <div style={{ color: t.alerta, fontSize: 12, marginBottom: 12 }}>Completa todos los resultados de Ronda 3 para poder sortear el Playoff.</div>}
          <EntrantesConfirmados titulo="Nuevos entrantes del Playoff (Ruta Liga): Brighton & Hove Albion (ENG), Atalanta (ITA), Getafe (ESP), Friburgo (GER), Mónaco (FRA) — confirmado por el listado de acceso oficial de la UEFA" lista={[]} colores={t} />
          <BotonSorteo onClick={co.simularPlayoff} disabled={!co.r3Completa} label={co.sorteoPO ? "Volver a sortear el Playoff" : "Sortear Playoff"} colores={t} />
        </>
      )}

      {co.sorteoPO && co.sorteoPO.error && <div style={{ color: t.alerta, fontSize: 13, marginBottom: 20 }}>{co.sorteoPO.error}</div>}
      {co.sorteoPO && !co.sorteoPO.error && (
        <>
          <CabeceraRonda titulo={`PLAYOFF (sorteo simulado)${co.sorteoPO.bloqueo ? " · ⚠️ bloqueo" : ""}`} fechas={CO_FECHAS.PO} colores={t} onRellenar={co.rellenarPO} />
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 24 }}>
            {co.sorteoPO.cruces.map((tie) => {
              const r = co.resolverGenerico(co.sorteoPO.cruces, co.resPO, tie.id);
              return (
                <TieCard key={tie.id} nombreA={tie.cabeza.nombre} paisA={tie.cabeza.pais} nombreB={tie.rival.nombre} paisB={tie.rival.pais} ruta={tie.ruta}
                  tie={tie} resultado={co.resPO[tie.id]} onChange={co.changePO} onReset={co.resetPO} colores={t}
                  ganador={r?.ganador} perdedor={null} destinoGanador="Clasificado a la Fase de Liga de Conference League" />
              );
            })}
          </div>
        </>
      )}

      {co.clasificados && (
        <div style={{ background: t.tarjeta, border: `1px solid ${t.acento}`, borderRadius: 8, padding: 16, marginBottom: 20 }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", color: t.acento, fontSize: 12, letterSpacing: 2, marginBottom: 10 }}>CLASIFICADOS A FASE DE LIGA</div>
          {co.clasificados.map((c, i) => <div key={i} style={{ color: t.texto, fontSize: 14, padding: "2px 0" }}>{c.nombre} ({c.pais})</div>)}
          {(() => {
            const directosEL = el.perdedoresPO;
            return directosEL.length > 0 ? (
              <div style={{ marginTop: 10 }}>
                <div style={{ color: t.textoSuave, fontSize: 11 }}>+ directos desde Europa League (los 12 perdedores del Playoff, Ruta Campeones y Ruta Liga) — {directosEL.length}/12 cargados:</div>
                {directosEL.map((p, i) => <div key={i} style={{ color: t.texto, fontSize: 13, padding: "1px 0" }}>{p.perdedor} ({p.pais}) <span style={{ color: t.textoSuave, fontSize: 11 }}>· Ruta {p.ruta}</span></div>)}
              </div>
            ) : <div style={{ color: t.textoSuave, fontSize: 11, marginTop: 10 }}>+ los 12 perdedores del Playoff de Europa League (Ruta Campeones y Ruta Liga) — aún no cargados, resuelve esa ronda en Europa League</div>;
          })()}
        </div>
      )}
    </div>
  );
}

// ============================================================
// TEMA NEUTRO — INICIO Y GUÍA
// ============================================================
const TEMA_HOME = { fondo: "#0D1117", tarjeta: "#151C26", borde: "#2A3648", acento: "#E8C15A", texto: "#F4F1E8", textoSuave: "#95A3B4", alerta: "#E8734A" };

// ============================================================
// VISTA — INICIO (LANDING)
// ============================================================
function LandingView({ irA }) {
  const t = TEMA_HOME;
  const seccion = { background: t.tarjeta, border: `1px solid ${t.borde}`, borderRadius: 10, padding: "18px 20px", marginBottom: 16 };
  const h2 = { fontFamily: "'Oswald', sans-serif", color: t.acento, fontSize: 19, margin: "0 0 10px" };
  const p = { color: t.texto, fontSize: 14, lineHeight: 1.7, margin: "0 0 8px" };
  const cardBtn = (color) => ({ background: "transparent", color, border: `1px solid ${color}`, borderRadius: 8, padding: "8px 16px", fontSize: 13, fontWeight: 600, cursor: "pointer", marginTop: 10 });
  const competiciones = [
    { id: "formato", color: t.acento, titulo: "📘 Entiende el formato", desc: "La guía para todos los públicos: qué es una fase previa, cómo se decide cada eliminatoria y qué pasa con los eliminados. Con gráficos y ejemplos.", boton: "Leer la guía" },
    { id: "CL", color: TEMA_CL.acento, titulo: "Champions League — fase previa", desc: "De la Ronda 1 al Playoff, con las rutas de Campeones y de Liga, sorteos simulados y el destino de cada eliminado.", boton: "Abrir simulador" },
    { id: "EL", color: TEMA_EL.acento, titulo: "Europa League — fase previa", desc: "Incluye en directo a los equipos que llegan eliminados de la Champions League en cada ronda.", boton: "Abrir simulador" },
    { id: "CO", color: TEMA_CO.acento, titulo: "Conference League — fase previa", desc: "La competición con más participantes: 26 cruces en Ronda 1 y las llegadas desde Champions y Europa League.", boton: "Abrir simulador" },
  ];
  return (
    <div>
      <div style={{ margin: "8px 0 24px" }}>
        <div style={{ fontFamily: "'Oswald', sans-serif", color: t.texto, fontSize: 34, fontWeight: 700, lineHeight: 1.15 }}>Modo Competición</div>
        <div style={{ color: t.textoSuave, fontSize: 15, marginTop: 6 }}>Simuladores y guías para entender los formatos de las competiciones de fútbol.</div>
      </div>

      <div style={seccion}>
        <h2 style={h2}>¿Por qué existe esto?</h2>
        <p style={p}>
          Los formatos de las competiciones son cada vez más complejos: rondas previas, rutas paralelas, sorteos
          condicionados y equipos que cambian de torneo a mitad de temporada. Este sitio reúne en un solo lugar
          simuladores interactivos y explicaciones claras para seguir cada competición paso a paso.
        </p>
        <p style={p}>
          El proyecto arranca con las fases previas de las competiciones europeas de clubes (Champions League,
          Europa League y Conference League) e irá incorporando más competiciones y fases.
        </p>
      </div>

      <div style={seccion}>
        <h2 style={h2}>¿Qué puedes hacer?</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <p style={{ ...p, margin: 0 }}><strong style={{ color: t.acento }}>Entiende el formato</strong> — una guía con gráficos y ejemplos que explica cómo funcionan las fases previas, pensada para todos los públicos.</p>
          <p style={{ ...p, margin: 0 }}><strong style={{ color: t.acento }}>Simula cada competición</strong> — introduce resultados reales o genera simulaciones ronda a ronda, sorteos incluidos.</p>
          <p style={{ ...p, margin: 0 }}><strong style={{ color: t.acento }}>Sigue las conexiones entre torneos</strong> — los datos fluyen en directo: un eliminado de Champions aparece automáticamente en Europa League o Conference League.</p>
        </div>
      </div>

      <div style={seccion}>
        <h2 style={h2}>¿De qué va?</h2>
        <p style={p}>
          Cada competición tiene su propia página con todas las rondas de la fase previa: cruces oficiales,
          coeficientes UEFA, sorteos simulados y el recorrido de cada equipo hasta la fase de liga. Todos los
          partidos están numerados (R1-6, EL2-4, CO2P-12…) para poder localizarlos cuando otra ronda o otra
          competición hace referencia a ellos.
        </p>
      </div>

      <h2 style={{ ...h2, marginTop: 24 }}>Empieza por aquí</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 12, marginBottom: 8 }}>
        {competiciones.map((c) => (
          <div key={c.id} style={{ background: t.tarjeta, border: `1px solid ${c.color}`, borderRadius: 10, padding: "16px 18px", display: "flex", flexDirection: "column" }}>
            <div style={{ fontFamily: "'Oswald', sans-serif", color: c.color, fontSize: 16, marginBottom: 6 }}>{c.titulo}</div>
            <div style={{ color: t.texto, fontSize: 13, lineHeight: 1.6, flex: 1 }}>{c.desc}</div>
            <div><button onClick={() => irA(c.id)} style={cardBtn(c.color)}>{c.boton} →</button></div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================
// GRÁFICOS SVG DE LA GUÍA
// ============================================================
function EmbudoSVG({ t }) {
  const etapas = [
    { label: "Ronda 1", sub: "julio", n: 28, unidad: "equipos" },
    { label: "Ronda 2", sub: "julio", n: 28, unidad: "equipos" },
    { label: "Ronda 3", sub: "agosto", n: 20, unidad: "equipos" },
    { label: "Playoff", sub: "agosto", n: 14, unidad: "equipos" },
    { label: "Fase de Liga", sub: "septiembre", n: 7, unidad: "plazas" },
  ];
  const bw = 96, gap = 34, base = 150;
  return (
    <svg viewBox="0 0 660 200" style={{ width: "100%", height: "auto", display: "block" }} role="img" aria-label="Embudo de rondas de la fase previa de la Champions League">
      {etapas.map((e, i) => {
        const h = e.n * 4;
        const x = 8 + i * (bw + gap);
        const esFinal = i === etapas.length - 1;
        return (
          <g key={e.label}>
            <rect x={x} y={base - h} width={bw} height={h} rx={6} fill={t.acento} fillOpacity={esFinal ? 0.9 : 0.18} stroke={t.acento} strokeWidth="1.5" />
            <text x={x + bw / 2} y={base - h - 8} textAnchor="middle" fill={t.texto} fontSize="13" fontFamily="'JetBrains Mono', monospace">{e.n} {e.unidad}</text>
            <text x={x + bw / 2} y={base + 20} textAnchor="middle" fill={t.texto} fontSize="13" fontWeight="600">{e.label}</text>
            <text x={x + bw / 2} y={base + 37} textAnchor="middle" fill={t.textoSuave} fontSize="11">{e.sub}</text>
            {i < etapas.length - 1 && <text x={x + bw + gap / 2} y={base - 12} textAnchor="middle" fill={t.textoSuave} fontSize="16">→</text>}
          </g>
        );
      })}
    </svg>
  );
}

function EscaleraSVG({ t }) {
  const bandas = [
    { y: 10, color: TEMA_CL.acento, nombre: "CHAMPIONS LEAGUE", sub: "primera competición" },
    { y: 100, color: TEMA_EL.acento, nombre: "EUROPA LEAGUE", sub: "segunda competición" },
    { y: 190, color: TEMA_CO.acento, nombre: "CONFERENCE LEAGUE", sub: "tercera competición" },
  ];
  const flecha = (x, y1, y2, color) => (
    <g>
      <line x1={x} y1={y1} x2={x} y2={y2 - 8} stroke={color} strokeWidth="2" />
      <polygon points={`${x - 5},${y2 - 8} ${x + 5},${y2 - 8} ${x},${y2}`} fill={color} />
    </g>
  );
  return (
    <svg viewBox="0 0 660 250" style={{ width: "100%", height: "auto", display: "block" }} role="img" aria-label="Escalera de descenso entre competiciones europeas">
      {bandas.map((b) => (
        <g key={b.nombre}>
          <rect x="0" y={b.y} width="470" height="50" rx="8" fill={b.color} fillOpacity="0.15" stroke={b.color} strokeWidth="1.5" />
          <text x="16" y={b.y + 22} fill={b.color} fontSize="14" fontWeight="700" fontFamily="'Oswald', sans-serif">{b.nombre}</text>
          <text x="16" y={b.y + 40} fill={t.textoSuave} fontSize="11">{b.sub}</text>
        </g>
      ))}
      {flecha(300, 60, 100, TEMA_EL.acento)}
      <text x="312" y="86" fill={t.textoSuave} fontSize="11">eliminados de Champions</text>
      {flecha(300, 150, 190, TEMA_CO.acento)}
      <text x="312" y="176" fill={t.textoSuave} fontSize="11">eliminados de Europa League</text>
      <path d="M 500 35 C 590 35, 590 215, 500 215" fill="none" stroke={TEMA_CO.acento} strokeWidth="2" strokeDasharray="5 4" />
      <polygon points="500,210 512,207 508,219" fill={TEMA_CO.acento} />
      <line x1="470" y1="35" x2="500" y2="35" stroke={TEMA_CO.acento} strokeWidth="2" strokeDasharray="5 4" />
      <line x1="500" y1="215" x2="470" y2="215" stroke={TEMA_CO.acento} strokeWidth="2" strokeDasharray="5 4" />
      <text x="588" y="118" fill={t.textoSuave} fontSize="11" textAnchor="middle">Ronda 1</text>
      <text x="588" y="133" fill={t.textoSuave} fontSize="11" textAnchor="middle">directa</text>
    </svg>
  );
}

function CalendarioSVG({ t }) {
  const hitos = [
    { x: 90, label: "Ronda 1", sub: "7–16 jul" },
    { x: 210, label: "Ronda 2", sub: "21–30 jul" },
    { x: 330, label: "Ronda 3", sub: "4–13 ago" },
    { x: 450, label: "Playoff", sub: "18–27 ago" },
    { x: 585, label: "Fase de Liga", sub: "desde sept" },
  ];
  return (
    <svg viewBox="0 0 660 120" style={{ width: "100%", height: "auto", display: "block" }} role="img" aria-label="Calendario de las fases previas: julio y agosto">
      <line x1="30" y1="60" x2="630" y2="60" stroke={t.borde} strokeWidth="2" />
      {hitos.map((h, i) => (
        <g key={h.label}>
          <circle cx={h.x} cy="60" r={i === hitos.length - 1 ? 8 : 5} fill={i === hitos.length - 1 ? t.acento : t.tarjeta} stroke={t.acento} strokeWidth="2" />
          <text x={h.x} y="38" textAnchor="middle" fill={t.texto} fontSize="13" fontWeight="600">{h.label}</text>
          <text x={h.x} y="88" textAnchor="middle" fill={t.textoSuave} fontSize="11" fontFamily="'JetBrains Mono', monospace">{h.sub}</text>
        </g>
      ))}
    </svg>
  );
}

function EjemploEliminatoria({ t }) {
  const filas = [
    { fase: "IDA", marcador: "Equipo A 2 – 1 Equipo B", nota: "en el estadio del Equipo A" },
    { fase: "VUELTA", marcador: "Equipo B 2 – 1 Equipo A", nota: "en el estadio del Equipo B" },
    { fase: "GLOBAL", marcador: "3 – 3", nota: "empate → se juega prórroga", destaca: true },
    { fase: "PRÓRROGA", marcador: "0 – 0", nota: "sigue el empate → penaltis" },
    { fase: "PENALTIS", marcador: "2 – 4", nota: "el Equipo B avanza de ronda", destaca: true },
  ];
  return (
    <div style={{ background: t.fondo, border: `1px solid ${t.borde}`, borderRadius: 10, padding: "14px 16px", display: "flex", flexDirection: "column", gap: 8 }}>
      {filas.map((f) => (
        <div key={f.fase} style={{ display: "flex", alignItems: "baseline", gap: 12, flexWrap: "wrap" }}>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: 1, color: f.destaca ? t.acento : t.textoSuave, width: 78 }}>{f.fase}</span>
          <span style={{ color: f.destaca ? t.acento : t.texto, fontSize: 14, fontWeight: f.destaca ? 700 : 500, fontFamily: "'JetBrains Mono', monospace" }}>{f.marcador}</span>
          <span style={{ color: t.textoSuave, fontSize: 12 }}>{f.nota}</span>
        </div>
      ))}
      <div style={{ color: t.textoSuave, fontSize: 12, lineHeight: 1.6, marginTop: 4 }}>
        El Equipo A no queda fuera de Europa: según la ronda y la competición, continúa en el torneo del escalón inferior.
      </div>
    </div>
  );
}

function EjemploBombo({ t }) {
  const cabezas = [["Benfica", "90.0"], ["Ferencváros", "51.3"], ["PAOK", "48.3"], ["Midtjylland", "48.3"]];
  const resto = [["Beşiktaş", "15.5"], ["Twente", "13.6"], ["Hajduk Split", "10.0"], ["St. Gallen", "6.9"]];
  const chip = (nombre, coef, color) => (
    <div key={nombre} style={{ display: "flex", justifyContent: "space-between", gap: 10, border: `1px solid ${color}`, borderRadius: 6, padding: "5px 10px" }}>
      <span style={{ color: t.texto, fontSize: 12 }}>{nombre}</span>
      <span style={{ color, fontSize: 11, fontFamily: "'JetBrains Mono', monospace" }}>{coef}</span>
    </div>
  );
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 14 }}>
      <div>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: 1, color: t.acento, marginBottom: 8 }}>CABEZAS DE SERIE (mejor coeficiente)</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>{cabezas.map(([n, c]) => chip(n, c, t.acento))}</div>
      </div>
      <div>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: 1, color: t.textoSuave, marginBottom: 8 }}>NO CABEZAS DE SERIE</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>{resto.map(([n, c]) => chip(n, c, t.textoSuave))}</div>
      </div>
    </div>
  );
}

// ============================================================
// VISTA — ARTÍCULO "ENTIENDE EL FORMATO"
// ============================================================
function FormatoView({ irA }) {
  const t = TEMA_HOME;
  const seccion = { background: t.tarjeta, border: `1px solid ${t.borde}`, borderRadius: 10, padding: "18px 20px", marginBottom: 16 };
  const h2 = { fontFamily: "'Oswald', sans-serif", color: t.acento, fontSize: 19, margin: "0 0 10px" };
  const p = { color: t.texto, fontSize: 14, lineHeight: 1.75, margin: "0 0 10px" };
  const li = { color: t.texto, fontSize: 14, lineHeight: 1.75, marginBottom: 6 };
  const pie = { color: t.textoSuave, fontSize: 12, lineHeight: 1.6, marginTop: 8 };
  return (
    <div>
      <div style={{ margin: "8px 0 20px" }}>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", color: t.textoSuave, fontSize: 11, letterSpacing: 3, marginBottom: 6 }}>GUÍA · PARA TODOS LOS PÚBLICOS</div>
        <div style={{ fontFamily: "'Oswald', sans-serif", color: t.texto, fontSize: 30, fontWeight: 700, lineHeight: 1.2 }}>Las fases previas europeas, explicadas</div>
        <div style={{ color: t.textoSuave, fontSize: 14, marginTop: 6 }}>Qué son, cómo funcionan y por qué perder una eliminatoria no siempre significa quedarse fuera de Europa.</div>
      </div>

      <div style={seccion}>
        <h2 style={h2}>1 · ¿Qué es una fase previa?</h2>
        <p style={p}>
          Cada verano, antes de que en septiembre arranquen las fases de liga, más de 150 equipos de toda Europa
          disputan las fases previas: una serie de eliminatorias que reparten las últimas plazas de la Champions
          League, la Europa League y la Conference League.
        </p>
        <p style={p}>
          Para los campeones y clasificados de las ligas de países pequeños y medianos —de Andorra a Islandia,
          de Malta a Kazajistán— estas rondas de julio y agosto son su camino hacia la fase de liga. Los equipos
          de las grandes ligas entran más tarde, en las rondas finales, o directamente en la fase de liga.
        </p>
      </div>

      <div style={seccion}>
        <h2 style={h2}>2 · Un embudo de cuatro rondas</h2>
        <p style={p}>
          La estructura es un embudo con cuatro rondas eliminatorias: Ronda 1, Ronda 2, Ronda 3 y Playoff. En cada
          ronda, la mitad de los equipos avanza y la otra mitad cambia de destino. Este es el camino completo en la
          Champions League:
        </p>
        <EmbudoSVG t={t} />
        <div style={pie}>
          El embudo no siempre se estrecha de ronda en ronda porque en las Rondas 2 y 3 y en el Playoff entran
          equipos nuevos con mejor coeficiente. En Europa League y Conference League el esquema es el mismo, con
          más participantes: solo la Ronda 2 de la Conference reúne 98 equipos.
        </div>
      </div>

      <div style={seccion}>
        <h2 style={h2}>3 · Ida y vuelta: así se decide cada eliminatoria</h2>
        <p style={p}>
          Cada cruce se juega a dos partidos, uno en el estadio de cada equipo. Se suman los goles de los dos
          partidos (el resultado global) y avanza el que más goles haya marcado en total. Si el global termina
          empatado, se juega una prórroga de 30 minutos en el partido de vuelta; y si el empate persiste, la
          eliminatoria se decide en los penaltis. Un ejemplo:
        </p>
        <EjemploEliminatoria t={t} />
      </div>

      <div style={seccion}>
        <h2 style={h2}>4 · Nadie queda fuera a la primera: la escalera de competiciones</h2>
        <p style={p}>
          Perder una eliminatoria no siempre significa despedirse de Europa. Las tres competiciones funcionan como
          una escalera: los eliminados de la Champions League bajan a la Europa League o a la Conference League, y
          los eliminados de la Europa League bajan a la Conference League.
        </p>
        <EscaleraSVG t={t} />
        <p style={{ ...p, marginTop: 10 }}>Cuanto más avanzada es la ronda en la que un equipo cae, mejor es su recolocación:</p>
        <ul style={{ margin: 0, paddingLeft: 22 }}>
          <li style={li}>Pierde la <strong>Ronda 1 de Champions</strong> → pasa a la Ronda 2 de la Conference League (Ruta de Campeones).</li>
          <li style={li}>Pierde la <strong>Ronda 2 o la Ronda 3 de Champions</strong> → pasa a la Ronda 3 o al Playoff de la Europa League.</li>
          <li style={li}>Pierde el <strong>Playoff de Champions</strong> → entra directamente en la fase de liga de la Europa League, sin jugar ninguna ronda más.</li>
          <li style={li}>Pierde el <strong>Playoff de Europa League</strong> (cualquiera de las dos rutas) → entra directamente en la fase de liga de la Conference League. Son 12 equipos en total.</li>
        </ul>
      </div>

      <div style={seccion}>
        <h2 style={h2}>5 · Dos rutas paralelas</h2>
        <p style={p}>
          Dentro de cada competición, las fases previas se dividen en dos caminos que no se cruzan hasta la fase
          de liga:
        </p>
        <ul style={{ margin: 0, paddingLeft: 22 }}>
          <li style={li}><strong style={{ color: TEMA_CL.acento }}>Ruta de Campeones</strong>: reservada a los campeones de liga de cada país. Solo se enfrentan campeones entre sí, lo que garantiza que cada temporada haya campeones nacionales de ligas modestas en las fases de liga.</li>
          <li style={li}><strong style={{ color: TEMA_CO.acento }}>Ruta de Liga (o Principal)</strong>: para el resto de clasificados — subcampeones, terceros y ganadores de copa.</li>
        </ul>
      </div>

      <div style={seccion}>
        <h2 style={h2}>6 · Sorteos y coeficientes: quién juega contra quién</h2>
        <p style={p}>
          Cada club tiene un coeficiente UEFA que resume sus resultados europeos de las últimas cinco temporadas.
          En cada sorteo, la mitad de los equipos con mejor coeficiente son cabezas de serie y solo pueden
          emparejarse con equipos de la otra mitad. Además, dos equipos del mismo país no pueden enfrentarse en
          las rondas previas. Un ejemplo con ocho equipos:
        </p>
        <EjemploBombo t={t} />
        <div style={pie}>
          Benfica solo puede emparejarse con uno de los cuatro equipos de la columna derecha — nunca con
          Ferencváros, PAOK o Midtjylland. Ser cabeza de serie no garantiza nada: la eliminatoria se decide en
          el campo.
        </div>
      </div>

      <div style={seccion}>
        <h2 style={h2}>7 · El calendario</h2>
        <p style={p}>
          Todo ocurre en unas ocho semanas, entre principios de julio y finales de agosto, con la ida y la vuelta
          de cada ronda separadas por una semana:
        </p>
        <CalendarioSVG t={t} />
      </div>

      <div style={{ ...seccion, border: `1px solid ${t.acento}` }}>
        <h2 style={h2}>Ahora pruébalo tú</h2>
        <p style={p}>
          Los simuladores reproducen todo lo anterior con los cruces y coeficientes oficiales de la temporada
          2026/27: introduce resultados o simúlalos, sortea las rondas siguientes y observa cómo cada eliminado
          reaparece en la competición del escalón inferior. Todos los partidos están numerados para que puedas
          seguir cualquier referencia.
        </p>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          {[["CL", "Champions League", TEMA_CL.acento], ["EL", "Europa League", TEMA_EL.acento], ["CO", "Conference League", TEMA_CO.acento]].map(([id, label, color]) => (
            <button key={id} onClick={() => irA(id)} style={{ background: "transparent", color, border: `1px solid ${color}`, borderRadius: 8, padding: "10px 18px", fontSize: 14, fontWeight: 600, fontFamily: "'Oswald', sans-serif", cursor: "pointer" }}>
              {label} →
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================================
// APP PRINCIPAL — con pestañas, sin ningún botón de guardar/recargar
// ============================================================
export default function App() {
  const cl = useChampions();
  const el = useEuropa(cl);
  const co = useConference(cl, el);
  const [tab, setTab] = useState("inicio");

  const tabs = [
    { id: "inicio", label: "Inicio", color: "#C9D4E0" },
    { id: "formato", label: "Entiende el formato", color: TEMA_HOME.acento },
    { id: "CL", label: "Champions League", color: TEMA_CL.acento },
    { id: "EL", label: "Europa League", color: TEMA_EL.acento },
    { id: "CO", label: "Conference League", color: TEMA_CO.acento },
  ];
  const fondoActivo = tab === "CL" ? TEMA_CL.fondo : tab === "EL" ? TEMA_EL.fondo : tab === "CO" ? TEMA_CO.fondo : TEMA_HOME.fondo;
  const esSimulador = tab === "CL" || tab === "EL" || tab === "CO";

  return (
    <div style={{ minHeight: "100vh", background: fondoActivo, fontFamily: "'Inter', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Oswald:wght@600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');`}</style>

      <div style={{ position: "sticky", top: 0, zIndex: 10, background: fondoActivo, borderBottom: "1px solid #333", padding: "16px 20px 0" }}>
        <div style={{ maxWidth: 960, margin: "0 auto" }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", color: "#888", fontSize: 11, letterSpacing: 3, marginBottom: 4 }}>MODO COMPETICIÓN · SIMULADORES Y GUÍAS</div>
          <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
            {tabs.map((tb) => (
              <button key={tb.id} onClick={() => setTab(tb.id)}
                style={{
                  background: tab === tb.id ? tb.color : "transparent",
                  color: tab === tb.id ? "#0B1420" : tb.color,
                  border: `1px solid ${tb.color}`,
                  borderBottom: tab === tb.id ? "none" : `1px solid ${tb.color}`,
                  borderRadius: "8px 8px 0 0",
                  padding: "10px 18px",
                  fontSize: 14,
                  fontWeight: 700,
                  fontFamily: "'Oswald', sans-serif",
                  cursor: "pointer",
                }}>
                {tb.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ padding: "24px 20px 40px" }}>
        <div style={{ maxWidth: 960, margin: "0 auto" }}>
          {tab === "inicio" && <LandingView irA={setTab} />}
          {tab === "formato" && <FormatoView irA={setTab} />}
          {tab === "CL" && <ChampionsView cl={cl} />}
          {tab === "EL" && <EuropaView el={el} cl={cl} />}
          {tab === "CO" && <ConferenceView co={co} cl={cl} el={el} />}

          {esSimulador && (
            <div style={{ borderTop: "1px solid #333", paddingTop: 16, marginTop: 12, color: "#666", fontSize: 11, lineHeight: 1.6 }}>
              Los datos fluyen en directo entre pestañas — resuelve un resultado en Champions y verás el efecto
              inmediatamente en Europa/Conference League sin guardar ni recargar nada. Próxima versión: sorteo
              de fase de liga y rondas posteriores.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
