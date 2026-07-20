import React, { useState, useMemo, useEffect } from "react";
import Landing from "./Landing.jsx";
import Articulo from "./Articulo.jsx";
import ArticuloFaseLiga from "./ArticuloFaseLiga.jsx";
import ArticuloNationsLeague from "./ArticuloNationsLeague.jsx";

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
// División en bombos: bombo 1 (cabezas de serie, mejor coeficiente) y bombo 2 (resto).
// La usan tanto el sorteo automático como el editor manual, para que ambos apliquen
// exactamente el mismo criterio de bombos.
function bomboSplit(plazas) {
  const ordenadas = [...plazas].sort((a, b) => b.coef - a.coef);
  const mitad = ordenadas.length / 2;
  return { cabezas: ordenadas.slice(0, mitad), resto: ordenadas.slice(mitad) };
}
function sortear(plazas) {
  if (plazas.length < 2) return { error: `Faltan equipos (solo ${plazas.length} disponible/s).` };
  if (plazas.length % 2 !== 0) return { error: `Número impar de plazas (${plazas.length}) — revisa resultados o eliminados pendientes de otras competiciones.` };
  const { cabezas: cabezasOrdenadas, resto: restoOrdenado } = bomboSplit(plazas);
  const cabezas = shuffleCopy(cabezasOrdenadas);
  const resto = shuffleCopy(restoOrdenado);
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
// SORTEO A MANO / EDICIÓN DE UN SORTEO — misma regla que sortear():
// cada cabeza de serie (bombo 1) se empareja con un rival de bombo 2 de
// distinto país. El desplegable de cada fila SOLO ofrece rivales que
// cumplan la restricción, así que nunca se puede construir un sorteo
// ilegal desde la interfaz.
// ============================================================
function SorteoManualEditor({ ruta, plazas, crucesIniciales, onChange, colores }) {
  const { cabezas, resto } = useMemo(() => bomboSplit(plazas), [plazas]);
  const [asignacion, setAsignacion] = useState(() =>
    cabezas.map((cabeza) => {
      if (!crucesIniciales) return null;
      const cruce = crucesIniciales.find((c) => c.cabeza.nombre === cabeza.nombre);
      if (!cruce) return null;
      const idx = resto.findIndex((r) => r.nombre === cruce.rival.nombre);
      return idx === -1 ? null : idx;
    })
  );

  useEffect(() => {
    const completo = cabezas.length > 0 && asignacion.every((x) => x !== null);
    const cruces = completo ? cabezas.map((cabeza, i) => ({ cabeza, rival: resto[asignacion[i]] })) : null;
    onChange(ruta, cruces, completo);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [asignacion]);

  if (cabezas.length === 0) return null;

  const usados = new Set(asignacion.filter((x) => x !== null));
  const setRival = (i, raw) => setAsignacion((prev) => { const n = [...prev]; n[i] = raw === "" ? null : Number(raw); return n; });
  const selectStyle = { background: colores.inputBg, border: `1px solid ${colores.inputBorder}`, borderRadius: 4, color: colores.texto, padding: "4px 6px", fontSize: 12, maxWidth: 260 };

  return (
    <div style={{ background: colores.tarjeta, border: `1px dashed ${colores.acento}`, borderRadius: 8, padding: 10, marginBottom: 10 }}>
      <div style={{ color: colores.acento, fontSize: 11, marginBottom: 8 }}>Ruta {ruta} — bombo 1 ({cabezas.length}) vs bombo 2 ({resto.length})</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {cabezas.map((cabeza, i) => {
          const actual = asignacion[i];
          const opciones = resto
            .map((r, idx) => ({ r, idx }))
            .filter(({ r, idx }) => (!usados.has(idx) || idx === actual) && r.pais !== cabeza.pais);
          return (
            <div key={cabeza.nombre} style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
              <span style={{ color: colores.texto, fontSize: 12, width: 190 }}>{cabeza.nombre} <span style={{ color: colores.textoSuave }}>({cabeza.pais})</span></span>
              <span style={{ color: colores.textoSuave, fontSize: 11 }}>vs</span>
              <select value={actual ?? ""} onChange={(e) => setRival(i, e.target.value)} style={selectStyle}>
                <option value="">— elegir rival —</option>
                {opciones.map(({ r, idx }) => <option key={r.nombre} value={idx}>{r.nombre} ({r.pais})</option>)}
              </select>
              {actual === null && opciones.length === 0 && (
                <span style={{ color: colores.alerta, fontSize: 11 }}>Sin rivales de otro país libres — cambia otra fila primero</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Agrupa uno o varios SorteoManualEditor (uno por ruta/bombo) y expone un único
// "confirmar" que solo se activa cuando TODAS las rutas están completas y son válidas.
function PanelSorteoManual({ pools, crucesIniciales, onConfirmar, onCancelar, colores, textoConfirmar = "Confirmar sorteo manual" }) {
  const rutas = Object.keys(pools);
  const [estado, setEstado] = useState({});
  const handleChange = (ruta, cruces, completo) => setEstado((prev) => ({ ...prev, [ruta]: { cruces, completo } }));
  const todoCompleto = rutas.every((r) => estado[r]?.completo);
  return (
    <div style={{ marginBottom: 16 }}>
      {rutas.map((ruta) => (
        <SorteoManualEditor key={ruta} ruta={ruta} plazas={pools[ruta]} crucesIniciales={crucesIniciales?.[ruta]} onChange={handleChange} colores={colores} />
      ))}
      <div style={{ display: "flex", gap: 8 }}>
        <button
          disabled={!todoCompleto}
          onClick={() => onConfirmar(Object.fromEntries(rutas.map((r) => [r, estado[r].cruces])))}
          style={{ background: todoCompleto ? colores.acento : "#2A2A2A", color: todoCompleto ? colores.fondo : "#6A6A6A", border: "none", borderRadius: 8, padding: "8px 16px", fontSize: 13, fontWeight: 600, cursor: todoCompleto ? "pointer" : "not-allowed" }}>
          ✓ {textoConfirmar}
        </button>
        <button onClick={onCancelar} style={{ background: "none", border: `1px solid ${colores.inputBorder}`, color: colores.textoSuave, borderRadius: 8, padding: "8px 16px", fontSize: 13, cursor: "pointer" }}>Cancelar</button>
      </div>
    </div>
  );
}

// Normaliza el formato de pools (algunos hooks devuelven array directo, otros {plazas, error}) a { ruta: plazas[] }
function extraerPlazas(pools) {
  return Object.fromEntries(Object.entries(pools).map(([k, v]) => [k, Array.isArray(v) ? v : v.plazas]));
}

// Botonera para elegir cómo generar/editar un sorteo: automático, a mano, o editar uno ya hecho.
function ControlesSorteo({ sorteo, pools, poolsListas, onAuto, onConfirmarManual, colores, labelAuto, labelManualNuevo = "✍️ Sorteo a mano", labelEditar = "✏️ Editar sorteo" }) {
  const [modo, setModo] = useState(null); // null | "manual" | "editar"
  useEffect(() => { setModo(null); }, [sorteo?.cruces]);
  if (modo === "manual" || modo === "editar") {
    const crucesIniciales = modo === "editar" && sorteo && !sorteo.error
      ? Object.fromEntries(Object.keys(pools).map((ruta) => [ruta, sorteo.cruces.filter((c) => c.ruta === ruta)]))
      : undefined;
    return (
      <PanelSorteoManual
        pools={pools}
        crucesIniciales={crucesIniciales}
        onConfirmar={(crucesPorRuta) => { onConfirmarManual(crucesPorRuta); setModo(null); }}
        onCancelar={() => setModo(null)}
        colores={colores}
        textoConfirmar={modo === "editar" ? "Guardar cambios del sorteo" : "Confirmar sorteo manual"}
      />
    );
  }
  return (
    <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap", marginBottom: sorteo && !sorteo.error ? 12 : 20 }}>
      <BotonSorteo onClick={onAuto} disabled={!poolsListas} label={labelAuto} colores={colores} />
      <button onClick={() => setModo("manual")} disabled={!poolsListas}
        style={{ background: "none", border: `1px solid ${colores.acento}`, color: poolsListas ? colores.acento : "#6A6A6A", borderRadius: 8, padding: "10px 16px", fontSize: 13, fontWeight: 600, cursor: poolsListas ? "pointer" : "not-allowed" }}>
        {labelManualNuevo}
      </button>
      {sorteo && !sorteo.error && (
        <button onClick={() => setModo("editar")}
          style={{ background: "none", border: `1px solid ${colores.inputBorder}`, color: colores.textoSuave, borderRadius: 8, padding: "10px 16px", fontSize: 13, cursor: "pointer" }}>
          {labelEditar}
        </button>
      )}
    </div>
  );
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
// Los 29 clasificados directos a la fase de liga (no pasan por fase previa): posición liguera 2025/26
// de las federaciones con plazas directas, más los reequilibrios (Shakhtar por los finalistas PSG/Arsenal
// ya clasificados por liga; Sporting CP por el campeón de Europa League Aston Villa) y los dos European
// Performance Spots (Liverpool e Real Betis). Fuente: UEFA.com.
const CL_DIRECTOS_FASE_LIGA = [
  { nombre: "Arsenal", pais: "ENG" }, { nombre: "Manchester City", pais: "ENG" }, { nombre: "Manchester United", pais: "ENG" },
  { nombre: "Aston Villa", pais: "ENG" }, { nombre: "Liverpool", pais: "ENG" },
  { nombre: "Inter", pais: "ITA" }, { nombre: "Napoli", pais: "ITA" }, { nombre: "Roma", pais: "ITA" }, { nombre: "Como", pais: "ITA" },
  { nombre: "Barcelona", pais: "ESP" }, { nombre: "Real Madrid", pais: "ESP" }, { nombre: "Villarreal", pais: "ESP" },
  { nombre: "Atlético de Madrid", pais: "ESP" }, { nombre: "Real Betis", pais: "ESP" },
  { nombre: "Bayern de Múnich", pais: "GER" }, { nombre: "Borussia Dortmund", pais: "GER" }, { nombre: "RB Leipzig", pais: "GER" }, { nombre: "VfB Stuttgart", pais: "GER" },
  { nombre: "Paris Saint-Germain", pais: "FRA" }, { nombre: "Lens", pais: "FRA" }, { nombre: "Lille", pais: "FRA" },
  { nombre: "PSV Eindhoven", pais: "NED" }, { nombre: "Feyenoord", pais: "NED" },
  { nombre: "Porto", pais: "POR" }, { nombre: "Sporting CP", pais: "POR" },
  { nombre: "Club Brugge", pais: "BEL" },
  { nombre: "Slavia Praga", pais: "CZE" },
  { nombre: "Galatasaray", pais: "TUR" },
  { nombre: "Shakhtar Donetsk", pais: "UKR" },
];

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
  "Sint-Truidense": 12.450, "Lillestrøm": 8.247, "Viktoria Plzeň": 50.500, "OFI Creta": 9.682, "Trabzonspor": 11.000, // Viktoria Plzeň sustituye a Karviná (excluida por amaño de partidos, 2 jul 2026)
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
  { nombre: "Viktoria Plzeň", pais: "CZE", coef: 50.500 }, { nombre: "OFI Creta", pais: "GRE", coef: 9.682 },
  { nombre: "Trabzonspor", pais: "TUR", coef: 11.000 },
];
const EL_FECHAS = { R1: "9 jul (ida) · 16 jul (vuelta)", R2: "23 jul (ida) · 30 jul (vuelta)", R3: "6 ago (ida) · 13 ago (vuelta)", PO: "20 ago (ida) · 27 ago (vuelta)" };
// Los 13 clasificados directos a la fase de liga: 12 por posición liguera/copa nacional + 1 (Crystal
// Palace) como campeón de la Conference League 2025/26. Fuente: UEFA.com.
const EL_DIRECTOS_FASE_LIGA = [
  { nombre: "Crystal Palace", pais: "ENG" }, { nombre: "Bournemouth", pais: "ENG" }, { nombre: "Sunderland", pais: "ENG" },
  { nombre: "Milan", pais: "ITA" }, { nombre: "Juventus", pais: "ITA" },
  { nombre: "Real Sociedad", pais: "ESP" }, { nombre: "Celta de Vigo", pais: "ESP" },
  { nombre: "TSG Hoffenheim", pais: "GER" }, { nombre: "Bayer Leverkusen", pais: "GER" },
  { nombre: "Marsella", pais: "FRA" }, { nombre: "Rennes", pais: "FRA" },
  { nombre: "AZ Alkmaar", pais: "NED" },
  { nombre: "Torreense", pais: "POR" },
];

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
  "Varaždin": 5.631, "Apollon": 7.138, "Bravo": 4.893, "Brann": 12.250, "Jablonec": 9.705,
  "Shelbourne": 4.000, "Valur": 4.500, "Zrinjski": 13.250, "Zimbru": 4.500,
  "Noah": 10.750, "Sion": 6.940, "Motherwell": 6.410, "Havnar Bóltfelag": 7.000,
  "Panevėžys": 6.500, "Tobol": 8.000, "Hibernian": 7.000, "Neftchi": 6.500,
  "Paksi": 5.437, "Panathinaikos": 29.250, "Železničar Pančevo": 5.150, "Braga": 63.750,
  "Ajax": 58.250, "Polissya": 5.182, "Copenhagen": 54.375, "Gent": 39.000, "LNZ Cherkasy": 5.182,
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
// FASE LIGA — DATOS Y MOTOR DE SORTEO
// Según Art. 16 ("Draw system – league phase") de los reglamentos UEFA
// de cada competición. Investigación completa con fuentes en
// docs/investigacion-sorteo-fase-liga.md
// ============================================================
// El campeón vigente ocupa la posición 1 del Bombo 1 (solo en Champions).
// PSG ganó la final 2025/26 al Arsenal (1-1, 4-3 en penaltis, Budapest).
const CL_CAMPEON_VIGENTE = "Paris Saint-Germain";

// Coeficientes UEFA 2026 (cierre de la temporada 2025/26) de los equipos que
// entran directos a las fases de liga y no pasan por la fase previa.
// Fuente: kassiesa.net (seeding 2026/27) y UEFA.com. Los marcados con
// "estimado" no aparecían en las fuentes consultadas y son aproximaciones
// razonadas — corrígelos cuando salga el listado oficial del sorteo.
const FL_COEFS_DIRECTOS = {
  // Champions League — 29 directos
  "Arsenal": 119.000, "Manchester City": 125.500, "Manchester United": 76.500,
  "Aston Villa": 83.000, "Liverpool": 130.000,
  "Inter": 127.000, "Napoli": 63.000, "Roma": 97.750, "Como": 19.989,
  "Barcelona": 113.250, "Real Madrid": 144.500, "Villarreal": 59.000,
  "Atlético de Madrid": 104.750, "Real Betis": 74.500,
  "Bayern de Múnich": 147.500, "Borussia Dortmund": 100.750, "RB Leipzig": 61.000, "VfB Stuttgart": 27.500,
  "Paris Saint-Germain": 132.000, "Lens": 14.000 /* estimado */, "Lille": 68.750,
  "PSV Eindhoven": 71.250, "Feyenoord": 71.000,
  "Porto": 80.750, "Sporting CP": 84.000,
  "Club Brugge": 75.250, "Slavia Praga": 44.000,
  "Galatasaray": 51.000 /* estimado */, "Shakhtar Donetsk": 38.000 /* estimado */,
  // Europa League — 13 directos
  "Crystal Palace": 23.903, "Bournemouth": 23.903, "Sunderland": 23.903,
  "Milan": 66.000, "Juventus": 72.250,
  "Real Sociedad": 42.000 /* estimado */, "Celta de Vigo": 21.000 /* estimado */,
  "TSG Hoffenheim": 15.000 /* estimado */, "Bayer Leverkusen": 105.000,
  "Marsella": 54.000, "Rennes": 26.000 /* estimado */,
  "AZ Alkmaar": 47.000 /* estimado */, "Torreense": 11.166 /* estimado */,
};
// Búsqueda de coeficiente unificada para las fases de liga: primero los
// directos (valores finales 2026), después los mapas de la fase previa.
const coefFaseLiga = (nombre) =>
  FL_COEFS_DIRECTOS[nombre] ?? CO_COEFS_INICIALES[nombre] ?? EL_COEFS_INICIALES[nombre] ?? CL_COEFS_INICIALES[nombre];

// Configuración por competición (Art. 16 de cada reglamento):
// UCL/UEL: 4 bombos de 9, 2 rivales por bombo (1 casa + 1 fuera) → 8 partidos.
// UECL: 6 bombos de 6, 1 rival por bombo; los bombos se emparejan (1-2, 3-4,
// 5-6) y dentro de cada par se juega un partido en casa y otro fuera → 6 partidos.
const FL_CFG_UCL = { bombos: 4, porBombo: 9, dobleRival: true, campeon: CL_CAMPEON_VIGENTE };
const FL_CFG_UEL = { bombos: 4, porBombo: 9, dobleRival: true };
const FL_CFG_UECL = { bombos: 6, porBombo: 6, dobleRival: false, paresBombos: true };

function repartirBombos(plazas, cfg) {
  const orden = [...plazas].sort((a, b) => b.coef - a.coef);
  if (cfg.campeon) {
    const i = orden.findIndex((e) => e.nombre === cfg.campeon);
    if (i > 0) orden.unshift(orden.splice(i, 1)[0]);
  }
  const bombos = [];
  for (let b = 0; b < cfg.bombos; b++) bombos.push(orden.slice(b * cfg.porBombo, (b + 1) * cfg.porBombo));
  return bombos;
}

// Motor del sorteo de fase liga. Restricciones comunes: nunca contra un club
// de la propia federación y máximo 2 rivales de una misma federación ajena.
// Igual que el software oficial (AE Live/EY), comprueba viabilidad: si una
// asignación aleatoria se bloquea, se reintenta el sorteo completo.
function sortearFaseLiga(plazas, cfg) {
  const total = cfg.bombos * cfg.porBombo;
  if (plazas.length !== total) return { error: `Se necesitan ${total} equipos y hay ${plazas.length} — completa las rondas previas.` };
  const sinCoef = plazas.filter((e) => e.coef === undefined || e.coef === null);
  if (sinCoef.length) return { error: `Faltan coeficientes de: ${sinCoef.map((e) => e.nombre).join(", ")}` };
  // Un mismo club no puede ocupar dos plazas. Pasa si se re-simulan rondas
  // anteriores sin volver a sortear las intermedias: los clasificados quedan
  // desincronizados entre competiciones.
  const vistos = new Set();
  const duplicados = plazas.filter((e) => (vistos.has(e.nombre) ? true : (vistos.add(e.nombre), false)));
  if (duplicados.length) return { error: `Equipos duplicados (${[...new Set(duplicados.map((e) => e.nombre))].join(", ")}) — has re-simulado rondas anteriores; vuelve a sortear Ronda 3 y Playoff en las competiciones afectadas.` };
  const bombos = repartirBombos(plazas, cfg);
  const equipos = bombos.flat();
  const bomboDe = equipos.map((_, i) => Math.floor(i / cfg.porBombo));
  const miembros = bombos.map((b, p) => b.map((_, k) => p * cfg.porBombo + k));
  const par = (p) => Math.floor(p / 2);

  // Estado compartido de un intento de sorteo, con registro reversible para
  // poder hacer backtracking dentro de cada bloque bombo-contra-bombo.
  const nuevoEstado = () => {
    const paisCount = equipos.map(() => ({}));
    const emparejados = new Set();
    const partidos = [];
    const clave = (i, j) => (i < j ? `${i}-${j}` : `${j}-${i}`);
    const compatible = (i, j) =>
      i !== j && equipos[i].pais !== equipos[j].pais && !emparejados.has(clave(i, j)) &&
      (paisCount[i][equipos[j].pais] || 0) < 2 && (paisCount[j][equipos[i].pais] || 0) < 2;
    const registrar = (local, visitante) => {
      partidos.push({ local: equipos[local], visitante: equipos[visitante], bomboLocal: bomboDe[local], bomboVisitante: bomboDe[visitante] });
      emparejados.add(clave(local, visitante));
      paisCount[local][equipos[visitante].pais] = (paisCount[local][equipos[visitante].pais] || 0) + 1;
      paisCount[visitante][equipos[local].pais] = (paisCount[visitante][equipos[local].pais] || 0) + 1;
    };
    const quitar = (local, visitante) => {
      partidos.pop();
      emparejados.delete(clave(local, visitante));
      paisCount[local][equipos[visitante].pais]--;
      paisCount[visitante][equipos[local].pais]--;
    };
    return { paisCount, partidos, compatible, registrar, quitar };
  };

  const intentoDoble = () => {
    // UCL/UEL: por cada par de bombos (p,q), dos "bloques": una biyección de
    // locales p→q y otra q→p (y dentro del propio bombo, cada equipo recibe
    // 1 partido en casa y 1 fuera). El backtracking es por bloque; si un
    // bloque no tiene solución con lo ya sorteado, se reinicia el intento.
    const st = nuevoEstado();
    let pasos = 0;
    const biyeccion = (filas, columnas) => {
      const orden = shuffleCopy(filas);
      const usados = new Set();
      const bt = (k) => {
        if (k === orden.length) return true;
        if (++pasos > 200000) return false;
        for (const j of shuffleCopy(columnas)) {
          if (usados.has(j) || !st.compatible(orden[k], j)) continue;
          st.registrar(orden[k], j);
          usados.add(j);
          if (bt(k + 1)) return true;
          st.quitar(orden[k], j);
          usados.delete(j);
        }
        return false;
      };
      return bt(0);
    };
    for (let p = 0; p < cfg.bombos; p++) {
      // dentro del propio bombo: biyección local→visitante sin parejas repetidas
      if (!biyeccion(miembros[p], miembros[p])) return null;
      for (let q = p + 1; q < cfg.bombos; q++) {
        if (!biyeccion(miembros[p], miembros[q])) return null;
        if (!biyeccion(miembros[q], miembros[p])) return null;
      }
    }
    return st.partidos;
  };

  const intentoConPares = () => {
    // UECL: 1 rival por bombo; casa/fuera se equilibra dentro de cada par de
    // bombos (1-2, 3-4, 5-6): un partido en casa y otro fuera por par.
    const st = nuevoEstado();
    const vH = equipos.map(() => Array(cfg.bombos / 2).fill(1));
    const vA = equipos.map(() => Array(cfg.bombos / 2).fill(1));
    let pasos = 0;
    const aplicar = (i, j, iEsLocal) => {
      const parI = par(bomboDe[j]), parJ = par(bomboDe[i]);
      if (iEsLocal) { st.registrar(i, j); vH[i][parI]--; vA[j][parJ]--; }
      else { st.registrar(j, i); vA[i][parI]--; vH[j][parJ]--; }
    };
    const revertir = (i, j, iEsLocal) => {
      const parI = par(bomboDe[j]), parJ = par(bomboDe[i]);
      if (iEsLocal) { st.quitar(i, j); vH[i][parI]++; vA[j][parJ]++; }
      else { st.quitar(j, i); vA[i][parI]++; vH[j][parJ]++; }
    };
    const orientaciones = (i, j) => {
      const parI = par(bomboDe[j]), parJ = par(bomboDe[i]);
      const ops = [];
      if (vH[i][parI] > 0 && vA[j][parJ] > 0) ops.push(true);
      if (vA[i][parI] > 0 && vH[j][parJ] > 0) ops.push(false);
      return shuffleCopy(ops);
    };
    // emparejamiento dentro del propio bombo (3 partidos entre los 6)
    const matchingPropio = (lista) => {
      if (!lista.length) return true;
      if (++pasos > 200000) return false;
      const i = lista[0];
      for (const j of shuffleCopy(lista.slice(1))) {
        if (!st.compatible(i, j)) continue;
        for (const iEsLocal of orientaciones(i, j)) {
          aplicar(i, j, iEsLocal);
          if (matchingPropio(lista.filter((x) => x !== i && x !== j))) return true;
          revertir(i, j, iEsLocal);
        }
      }
      return false;
    };
    // emparejamiento entre dos bombos distintos (6 partidos, uno por equipo)
    const matchingCruzado = (filas, columnas) => {
      const orden = shuffleCopy(filas);
      const usados = new Set();
      const bt = (k) => {
        if (k === orden.length) return true;
        if (++pasos > 200000) return false;
        for (const j of shuffleCopy(columnas)) {
          if (usados.has(j) || !st.compatible(orden[k], j)) continue;
          for (const iEsLocal of orientaciones(orden[k], j)) {
            aplicar(orden[k], j, iEsLocal);
            usados.add(j);
            if (bt(k + 1)) return true;
            usados.delete(j);
            revertir(orden[k], j, iEsLocal);
          }
        }
        return false;
      };
      return bt(0);
    };
    for (let p = 0; p < cfg.bombos; p++) {
      if (!matchingPropio([...miembros[p]])) return null;
      for (let q = p + 1; q < cfg.bombos; q++) {
        if (!matchingCruzado(miembros[p], miembros[q])) return null;
      }
    }
    return st.partidos;
  };

  for (let intento = 0; intento < 1000; intento++) {
    const partidos = cfg.dobleRival ? intentoDoble() : intentoConPares();
    if (!partidos) continue;
    const numJornadas = cfg.dobleRival ? 8 : 6;
    if (!repartirJornadas(partidos, numJornadas)) continue;
    partidos.forEach((m) => { m.clave = `${m.local.nombre}|${m.visitante.nombre}`; });
    return { bombos, partidos, numJornadas };
  }
  return { error: "No se encontró una combinación válida tras 1000 intentos — las restricciones de federación no dejan solución con estos 36 equipos." };
}

// Reparte los partidos en jornadas: cada equipo juega exactamente una vez por
// jornada (18 partidos por jornada). Es una descomposición en emparejamientos
// perfectos, con backtracking y reintentos. Anota m.jornada y devuelve true/false.
function repartirJornadas(partidos, numJornadas) {
  const nombres = [...new Set(partidos.flatMap((m) => [m.local.nombre, m.visitante.nombre]))];
  const porJornada = nombres.length / 2;
  const porEquipo = new Map(nombres.map((n) => [n, []]));
  partidos.forEach((m, i) => { porEquipo.get(m.local.nombre).push(i); porEquipo.get(m.visitante.nombre).push(i); });
  const rivalEn = (i, n) => (partidos[i].local.nombre === n ? partidos[i].visitante.nombre : partidos[i].local.nombre);
  for (let intento = 0; intento < 400; intento++) {
    const asignada = Array(partidos.length).fill(-1);
    let ok = true;
    for (let j = 0; j < numJornadas && ok; j++) {
      const ocupados = new Set();
      let colocados = 0;
      let pasos = 0;
      const bt = () => {
        if (colocados === porJornada) return true;
        if (++pasos > 50000) return false;
        // el equipo libre con menos opciones primero (falla pronto si hay bloqueo)
        let mejor = null;
        for (const n of nombres) {
          if (ocupados.has(n)) continue;
          const ops = porEquipo.get(n).filter((i) => asignada[i] === -1 && !ocupados.has(rivalEn(i, n)));
          if (!ops.length) return false;
          if (!mejor || ops.length < mejor.length) mejor = ops;
          if (ops.length === 1) break;
        }
        for (const i of shuffleCopy(mejor)) {
          asignada[i] = j; ocupados.add(partidos[i].local.nombre); ocupados.add(partidos[i].visitante.nombre); colocados++;
          if (bt()) return true;
          asignada[i] = -1; ocupados.delete(partidos[i].local.nombre); ocupados.delete(partidos[i].visitante.nombre); colocados--;
        }
        return false;
      };
      if (!bt()) ok = false;
    }
    if (ok) {
      partidos.forEach((m, i) => { m.jornada = asignada[i]; });
      return true;
    }
  }
  return false;
}

// ---- Edición tras el sorteo: intercambio de visitantes entre dos partidos ----
// Intercambiar los visitantes de dos partidos del mismo "bloque" (mismo bombo
// del local y mismo bombo del visitante) conserva todas las cuotas del Art. 16
// (rivales por bombo y sedes); solo hay que revalidar las reglas de federación.
// Las transposiciones dentro de cada bloque permiten alcanzar cualquier sorteo válido.
function candidatosIntercambio(sorteo, claveA) {
  const a = sorteo.partidos.find((m) => m.clave === claveA);
  if (!a) return [];
  const rivalesDe = new Map();
  sorteo.partidos.forEach((m) => {
    if (!rivalesDe.has(m.local.nombre)) rivalesDe.set(m.local.nombre, []);
    if (!rivalesDe.has(m.visitante.nombre)) rivalesDe.set(m.visitante.nombre, []);
    rivalesDe.get(m.local.nombre).push(m.visitante);
    rivalesDe.get(m.visitante.nombre).push(m.local);
  });
  const cuentaPais = (nombre, pais, excluir) =>
    rivalesDe.get(nombre).filter((r) => r.pais === pais && r.nombre !== excluir).length;
  const yaRivales = (x, y) => rivalesDe.get(x.nombre).some((r) => r.nombre === y.nombre);
  return sorteo.partidos.filter((b) => {
    if (b.clave === a.clave || b.bomboLocal !== a.bomboLocal || b.bomboVisitante !== a.bomboVisitante) return false;
    // parejas nuevas: (localA, visitanteB) y (localB, visitanteA); cada equipo
    // pierde a su rival actual (se excluye del recuento de federaciones)
    const nuevas = [
      { x: a.local, y: b.visitante, exX: a.visitante.nombre, exY: b.local.nombre },
      { x: b.local, y: a.visitante, exX: b.visitante.nombre, exY: a.local.nombre },
    ];
    for (const { x, y, exX, exY } of nuevas) {
      if (x.nombre === y.nombre || x.pais === y.pais || yaRivales(x, y)) return false;
      if (cuentaPais(x.nombre, y.pais, exX) >= 2) return false;
      if (cuentaPais(y.nombre, x.pais, exY) >= 2) return false;
    }
    return true;
  });
}
function aplicarIntercambio(sorteo, claveA, claveB) {
  const partidos = sorteo.partidos.map((m) => ({ ...m }));
  const a = partidos.find((m) => m.clave === claveA);
  const b = partidos.find((m) => m.clave === claveB);
  if (!a || !b) return null;
  [a.visitante, b.visitante] = [b.visitante, a.visitante];
  a.clave = `${a.local.nombre}|${a.visitante.nombre}`;
  b.clave = `${b.local.nombre}|${b.visitante.nombre}`;
  // el intercambio puede romper la regla "un partido por equipo y jornada":
  // se regenera el reparto de jornadas (los resultados se conservan por pareja)
  if (!repartirJornadas(partidos, sorteo.numJornadas)) return null;
  return { ...sorteo, partidos };
}

// ---- Clasificación (Art. 17 del reglamento UEFA) ----
// Desempates de la fase liga (no hay enfrentamiento directo): 1. puntos,
// 2. diferencia de goles, 3. goles a favor, 4. goles a favor fuera,
// 5. victorias, 6. victorias fuera, 7. coeficiente de club.
function clasificacionFaseLiga(plazas, partidos, resultados, hastaJornada) {
  const filas = new Map(plazas.map((e) => [e.nombre, { equipo: e, pj: 0, g: 0, e: 0, p: 0, gf: 0, gc: 0, pts: 0, gfFuera: 0, vFuera: 0 }]));
  for (const m of partidos) {
    if (hastaJornada !== undefined && m.jornada > hastaJornada) continue;
    const r = resultados[m.clave];
    if (!r || r.gl === undefined || r.gv === undefined) continue;
    const L = filas.get(m.local.nombre), V = filas.get(m.visitante.nombre);
    const gl = Number(r.gl), gv = Number(r.gv);
    L.pj++; V.pj++; L.gf += gl; L.gc += gv; V.gf += gv; V.gc += gl; V.gfFuera += gv;
    if (gl > gv) { L.g++; L.pts += 3; V.p++; }
    else if (gl < gv) { V.g++; V.pts += 3; V.vFuera++; L.p++; }
    else { L.e++; V.e++; L.pts++; V.pts++; }
  }
  return [...filas.values()].sort((a, b) =>
    b.pts - a.pts || (b.gf - b.gc) - (a.gf - a.gc) || b.gf - a.gf ||
    b.gfFuera - a.gfFuera || b.g - a.g || b.vFuera - a.vFuera ||
    b.equipo.coef - a.equipo.coef);
}

// ---- Sorteo de eliminatorias (Art. 19 del reglamento UEFA) ----
// 1º-8º pasan directos a octavos; 9º-24º juegan el playoff; 25º-36º eliminados.
// Bloques del playoff: 9/10 vs 23/24 (su ganador visita al 7º/8º), 11/12 vs
// 21/22 (→5º/6º), 13/14 vs 19/20 (→3º/4º), 15/16 vs 17/18 (→1º/2º). El sorteo
// decide el cruce concreto dentro de cada bloque. El cuadro es fijo desde
// octavos: cuartos 1-8, 3-5, 2-7 y 4-6 (plantilla oficial del bracket UEFA).
function sortearEliminatorias(clasificacion) {
  const eq = (pos) => clasificacion[pos - 1].equipo;
  const bloques = [
    { seeds: [9, 10], rivales: [23, 24], octavos: [7, 8] },
    { seeds: [11, 12], rivales: [21, 22], octavos: [5, 6] },
    { seeds: [13, 14], rivales: [19, 20], octavos: [3, 4] },
    { seeds: [15, 16], rivales: [17, 18], octavos: [1, 2] },
  ];
  const po = [];
  const poDeOctavo = {};
  bloques.forEach((b) => {
    const rivales = shuffleCopy(b.rivales);
    const octavos = shuffleCopy(b.octavos);
    b.seeds.forEach((sPos, k) => {
      const id = `PO-${po.length + 1}`;
      po.push({ id, seedPos: sPos, seed: eq(sPos), rivalPos: rivales[k], rival: eq(rivales[k]), destinoPos: octavos[k], destino: eq(octavos[k]) });
      poDeOctavo[octavos[k]] = id;
    });
  });
  const octavos = [];
  for (let pos = 1; pos <= 8; pos++) octavos.push({ id: `OF-${pos}`, seedPos: pos, seed: eq(pos), rivalRef: poDeOctavo[pos] });
  const cuartos = [
    { id: "QF-1", a: "OF-1", b: "OF-8" }, { id: "QF-2", a: "OF-3", b: "OF-5" },
    { id: "QF-3", a: "OF-2", b: "OF-7" }, { id: "QF-4", a: "OF-4", b: "OF-6" },
  ];
  const semis = [{ id: "SF-1", a: "QF-1", b: "QF-2" }, { id: "SF-2", a: "QF-3", b: "QF-4" }];
  return { po, octavos, cuartos, semis };
}

// ---- Resultados de las eliminatorias ----
// Playoff, octavos, cuartos y semifinales son a doble partido (se reutiliza
// estadoEliminatoria). La final es a partido único en sede neutral: si acaba
// en empate hay prórroga y, si persiste, penaltis.
function estadoPartidoUnico(r) {
  if (!r || r.gA === undefined || r.gB === undefined) return { fase: "sin_datos", empate: false, etTied: false };
  const gA = Number(r.gA), gB = Number(r.gB);
  if (gA !== gB) return { fase: "resuelto", ganador: gA > gB ? "A" : "B", empate: false, etTied: false };
  if (r.etA === undefined || r.etB === undefined) return { fase: "necesita_prorroga", empate: true, etTied: false };
  const eA = gA + Number(r.etA), eB = gB + Number(r.etB);
  if (eA !== eB) return { fase: "resuelto", ganador: eA > eB ? "A" : "B", empate: true, etTied: false };
  if (r.penA === undefined || r.penB === undefined || Number(r.penA) === Number(r.penB)) return { fase: "necesita_penaltis", empate: true, etTied: true };
  return { fase: "resuelto", ganador: Number(r.penA) > Number(r.penB) ? "A" : "B", empate: true, etTied: true };
}
function generarFinalAleatoria() {
  const r = { gA: rnd5(), gB: rnd5() };
  if (r.gA === r.gB) {
    r.etA = Math.floor(Math.random() * 2); r.etB = Math.floor(Math.random() * 2);
    if (r.etA === r.etB) { r.penA = rnd5(); r.penB = r.penA === 5 ? r.penA - 1 : r.penA + 1; }
  }
  return r;
}

// Resuelve el cuadro completo a partir del sorteo KO y los resultados.
// Sedes: en playoff y octavos el mejor clasificado juega la vuelta en casa
// (Art. 19); en cuartos y semis se aplica el mismo criterio con la posición
// de la fase liga. El lado B de cada cruce es siempre quien cierra en casa.
function resolverCuadro(ko, resKO, posiciones) {
  const pos = (e) => posiciones.get(e.nombre);
  const win2 = (id, a, b) => {
    if (!a || !b) return null;
    const est = estadoEliminatoria(resKO[id]);
    return est.fase === "resuelto" ? (est.ganador === "A" ? a : b) : null;
  };
  const g = {};
  const po = ko.po.map((t) => {
    const a = t.rival, b = t.seed;
    g[t.id] = win2(t.id, a, b);
    return { id: t.id, a, b, etiquetaA: null, etiquetaB: null, ganador: g[t.id], destino: t.destino, destinoPos: t.destinoPos };
  });
  const octavos = ko.octavos.map((t) => {
    const a = g[t.rivalRef] || null, b = t.seed;
    g[t.id] = win2(t.id, a, b);
    return { id: t.id, a, b, etiquetaA: a ? null : `Ganador ${t.rivalRef}`, etiquetaB: null, ganador: g[t.id] };
  });
  const doble = (t) => {
    let a = g[t.a] || null, b = g[t.b] || null;
    const etiquetaA = a ? null : `Ganador ${t.a}`, etiquetaB = b ? null : `Ganador ${t.b}`;
    if (a && b && pos(a) < pos(b)) [a, b] = [b, a];
    g[t.id] = win2(t.id, a, b);
    return { id: t.id, a, b, etiquetaA, etiquetaB, ganador: g[t.id] };
  };
  const cuartos = ko.cuartos.map(doble);
  const semis = ko.semis.map(doble);
  const fA = g["SF-1"] || null, fB = g["SF-2"] || null;
  const estF = fA && fB ? estadoPartidoUnico(resKO["FINAL"]) : { fase: "sin_datos" };
  const final = {
    id: "FINAL", a: fA, b: fB,
    etiquetaA: fA ? null : "Ganador SF-1", etiquetaB: fB ? null : "Ganador SF-2",
    ganador: estF.fase === "resuelto" ? (estF.ganador === "A" ? fA : fB) : null,
  };
  return { po, octavos, cuartos, semis, final, campeon: final.ganador };
}

// ---- Estado de la fase liga de una competición (compartido por las 3) ----
function useFaseLiga(poolLiga, cfg) {
  const [sorteoLiga, setSorteoLiga] = useState(null);
  const [resLiga, setResLiga] = useState({});
  const [sorteoKO, setSorteoKO] = useState(null);
  useEffect(() => { setSorteoLiga(null); setResLiga({}); setSorteoKO(null); }, [poolLiga]);
  const sortear = () => { setSorteoLiga(sortearFaseLiga(poolLiga.plazas, cfg)); setResLiga({}); setSorteoKO(null); };
  const cambiarResultado = (clave, campo, raw) => {
    const v = validar(raw);
    if (v === "INVALIDO") return;
    setResLiga((p) => ({ ...p, [clave]: { ...p[clave], [campo]: v } }));
    setSorteoKO(null);
  };
  const reiniciarPartido = (clave) => { setResLiga((p) => { const n = { ...p }; delete n[clave]; return n; }); setSorteoKO(null); };
  const simularJornada = (j) => {
    if (!sorteoLiga || sorteoLiga.error) return;
    setResLiga((p) => {
      const n = { ...p };
      sorteoLiga.partidos.filter((m) => m.jornada === j).forEach((m) => { n[m.clave] = { gl: rnd5(), gv: rnd5() }; });
      return n;
    });
    setSorteoKO(null);
  };
  const intercambiar = (claveA, claveB) => {
    if (!sorteoLiga || sorteoLiga.error) return;
    const nuevo = aplicarIntercambio(sorteoLiga, claveA, claveB);
    if (!nuevo) return;
    setSorteoLiga(nuevo);
    setResLiga((p) => { const n = { ...p }; delete n[claveA]; delete n[claveB]; return n; });
    setSorteoKO(null);
  };
  const clasificacion = useMemo(
    () => (sorteoLiga && !sorteoLiga.error ? clasificacionFaseLiga(sorteoLiga.bombos.flat(), sorteoLiga.partidos, resLiga) : null),
    [sorteoLiga, resLiga]
  );
  const clasificacionHasta = (j) =>
    sorteoLiga && !sorteoLiga.error ? clasificacionFaseLiga(sorteoLiga.bombos.flat(), sorteoLiga.partidos, resLiga, j) : null;
  const completa = useMemo(
    () => !!(sorteoLiga && !sorteoLiga.error && sorteoLiga.partidos.every((m) => { const r = resLiga[m.clave]; return r && r.gl !== undefined && r.gv !== undefined; })),
    [sorteoLiga, resLiga]
  );
  const jugados = useMemo(
    () => (sorteoLiga && !sorteoLiga.error ? sorteoLiga.partidos.filter((m) => { const r = resLiga[m.clave]; return r && r.gl !== undefined && r.gv !== undefined; }).length : 0),
    [sorteoLiga, resLiga]
  );
  const sortearKO = () => { if (completa && clasificacion) { setSorteoKO(sortearEliminatorias(clasificacion)); setResKO({}); } };
  const [resKO, setResKO] = useState({});
  const cambiarKO = (id, campo, raw) => {
    const v = validar(raw);
    if (v === "INVALIDO") return;
    setResKO((p) => ({ ...p, [id]: { ...p[id], [campo]: v } }));
  };
  const reiniciarKO = (id) => setResKO((p) => { const n = { ...p }; delete n[id]; return n; });
  const posiciones = useMemo(() => (clasificacion ? new Map(clasificacion.map((f, i) => [f.equipo.nombre, i + 1])) : null), [clasificacion]);
  const cuadro = useMemo(() => (sorteoKO && posiciones ? resolverCuadro(sorteoKO, resKO, posiciones) : null), [sorteoKO, resKO, posiciones]);
  const simularRondaKO = (items) => {
    // solo rellena cruces con ambos equipos ya definidos
    setResKO((p) => {
      const n = { ...p };
      items.filter((t) => t.a && t.b).forEach((t) => { n[t.id] = t.id === "FINAL" ? generarFinalAleatoria() : generarResultadoAleatorio(); });
      return n;
    });
  };
  return { sorteoLiga, resLiga, sorteoKO, sortear, cambiarResultado, reiniciarPartido, simularJornada, intercambiar, clasificacion, clasificacionHasta, completa, jugados, sortearKO, resKO, cambiarKO, reiniciarKO, posiciones, cuadro, simularRondaKO };
}

// Calendario individual: para cada equipo, sus rivales ordenados por bombo.
function fixturesFaseLiga(sorteo) {
  const map = new Map();
  sorteo.bombos.flat().forEach((e) => map.set(e.nombre, { equipo: e, rivales: [] }));
  sorteo.partidos.forEach((m) => {
    map.get(m.local.nombre).rivales.push({ rival: m.visitante, casa: true, bombo: m.bomboVisitante });
    map.get(m.visitante.nombre).rivales.push({ rival: m.local, casa: false, bombo: m.bomboLocal });
  });
  map.forEach((v) => v.rivales.sort((a, b) => a.bombo - b.bombo || (a.casa === b.casa ? 0 : a.casa ? -1 : 1)));
  return map;
}

// ============================================================
// LÓGICA — CHAMPIONS LEAGUE
// ============================================================
function useChampions() {
  const [coefs] = useState(CL_COEFS_INICIALES);
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
    CL_NUEVOS_R3.forEach((e) => set.add(e.nombre));
    CL_NUEVOS_PO.forEach((e) => set.add(e.nombre));
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

  const poolsR3 = () => ({
    Campeones: CL_RONDA2.filter((t) => t.ruta === "Campeones").map((t) => resolverR2(t.id)).filter(Boolean), // 0 nuevos en Ruta Campeones
    Liga: [...CL_RONDA2.filter((t) => t.ruta === "Liga").map((t) => resolverR2(t.id)).filter(Boolean), ...CL_NUEVOS_R3.map((e) => ({ nombre: e.nombre, pais: e.pais, coef: e.coef }))],
  });
  const confirmarR3 = (crucesPorRuta, bloqueo = false) => {
    const cruces = [
      ...crucesPorRuta.Campeones.map((c, i) => ({ id: `R3-CP-${i + 1}`, ruta: "Campeones", cabeza: c.cabeza, rival: c.rival })),
      ...crucesPorRuta.Liga.map((c, i) => ({ id: `R3-LP-${i + 1}`, ruta: "Liga", cabeza: c.cabeza, rival: c.rival })),
    ];
    setSorteoR3({ cruces, bloqueo });
    setResR3({}); setSorteoPO(null); setResPO({});
  };
  const simularR3 = () => {
    const { Campeones, Liga } = poolsR3();
    const resCP = sortear(Campeones), resLP = sortear(Liga);
    if (resCP.error || resLP.error) { setSorteoR3({ error: `Ruta Campeones: ${resCP.error || "OK"} · Ruta Liga: ${resLP.error || "OK"}` }); return; }
    confirmarR3({ Campeones: resCP.cruces, Liga: resLP.cruces }, resCP.bloqueo || resLP.bloqueo);
  };
  const r3Completa = useMemo(() => sorteoR3 && !sorteoR3.error && sorteoR3.cruces.every((t) => estadoEliminatoria(resR3[t.id]).fase === "resuelto"), [sorteoR3, resR3]);

  const poolsPO = () => {
    if (!sorteoR3 || sorteoR3.error) return { Campeones: [], Liga: [] };
    const g = sorteoR3.cruces.map((t) => { const r = resolverGenerico(sorteoR3.cruces, resR3, t.id); return r ? { ...r.ganador, ruta: t.ruta } : null; }).filter(Boolean);
    return {
      Campeones: [...g.filter((x) => x.ruta === "Campeones"), ...CL_NUEVOS_PO.map((e) => ({ nombre: e.nombre, pais: e.pais, coef: e.coef }))],
      Liga: g.filter((x) => x.ruta === "Liga"), // 0 nuevos en Ruta Liga del Playoff
    };
  };
  const confirmarPO = (crucesPorRuta, bloqueo = false) => {
    const cruces = [
      ...crucesPorRuta.Campeones.map((c, i) => ({ id: `PO-CP-${i + 1}`, ruta: "Campeones", cabeza: c.cabeza, rival: c.rival })),
      ...crucesPorRuta.Liga.map((c, i) => ({ id: `PO-LP-${i + 1}`, ruta: "Liga", cabeza: c.cabeza, rival: c.rival })),
    ];
    setSorteoPO({ cruces, bloqueo });
    setResPO({});
  };
  const simularPlayoff = () => {
    const { Campeones, Liga } = poolsPO();
    const resCP = sortear(Campeones), resLP = sortear(Liga);
    if (resCP.error || resLP.error) { setSorteoPO({ error: `Ruta Campeones: ${resCP.error || "OK"} · Ruta Liga: ${resLP.error || "OK"}` }); return; }
    confirmarPO({ Campeones: resCP.cruces, Liga: resLP.cruces }, resCP.bloqueo || resLP.bloqueo);
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

  // ---- Fase liga: 29 directos + 7 ganadores del playoff ----
  const poolLiga = useMemo(() => {
    if (!clasificados) return { plazas: [], error: "Resuelve el Playoff para conocer a los 7 clasificados que completan los 36 (29 entran directos)." };
    const plazas = [
      ...CL_DIRECTOS_FASE_LIGA.map((e) => ({ nombre: e.nombre, pais: e.pais, coef: coefFaseLiga(e.nombre) })),
      ...clasificados.map((c) => ({ nombre: c.nombre, pais: c.pais, coef: c.coef ?? coefFaseLiga(c.nombre) })),
    ];
    return { plazas, error: null };
  }, [clasificados]);
  const liga = useFaseLiga(poolLiga, FL_CFG_UCL);

  return {
    coefs, allTeams,
    resR1, changeR1, resetR1, resolverR1,
    resR2, changeR2, resetR2, resolverLadoR2, resolverR2, r2Completa,
    sorteoR3, resR3, changeR3, resetR3, r3Completa, simularR3, poolsR3, confirmarR3,
    sorteoPO, resPO, changePO, resetPO, simularPlayoff, poolsPO, confirmarPO,
    clasificados, resolverGenerico,
    rellenarR1, rellenarR2, rellenarR3, rellenarPO,
    perdedoresR1, perdedoresR2, perdedoresR3, perdedoresPO,
    liga, poolLiga,
  };
}

// ============================================================
// LÓGICA — EUROPA LEAGUE (recibe datos de Champions League en directo)
// ============================================================
function useEuropa(cl) {
  const [coefs] = useState(EL_COEFS_INICIALES);
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
    EL_NUEVOS_R3.forEach((e) => set.add(e.nombre));
    EL_NUEVOS_PO.forEach((e) => set.add(e.nombre));
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

  const poolsR3 = () => {
    const propiosLiga = EL_RONDA2.map((t) => resolverR2(t.id)).filter(Boolean);
    const clR2 = cl.perdedoresR2;
    const clLiga = clR2.filter((p) => p.ruta === "Liga").map((p) => ({ nombre: p.perdedor, pais: p.pais, coef: coefs[p.perdedor] })).filter((p) => p.coef !== undefined);
    const clCampeones = clR2.filter((p) => p.ruta === "Campeones").map((p) => ({ nombre: p.perdedor, pais: p.pais, coef: coefs[p.perdedor] })).filter((p) => p.coef !== undefined);
    const plazasLiga = [...propiosLiga, ...EL_NUEVOS_R3.map((e) => ({ nombre: e.nombre, pais: e.pais, coef: e.coef })), ...clLiga];
    return {
      Liga: { plazas: plazasLiga, error: plazasLiga.length === 14 ? null : `${plazasLiga.length}/14 (faltan ${14 - plazasLiga.length} perdedores de Champions Ruta Liga Ronda 2 — resuélvela allí primero)` },
      Campeones: { plazas: clCampeones, error: clCampeones.length === 12 ? null : `${clCampeones.length}/12 de Ruta Campeones (vienen de Champions Ronda 2 — resuélvela allí primero)` },
    };
  };
  const poolsR3Listas = useMemo(() => { const p = poolsR3(); return !p.Liga.error && !p.Campeones.error; }, [resR1, resR2, coefs, cl.perdedoresR2]);
  const confirmarR3 = (crucesPorRuta, bloqueo = false) => {
    const cruces = [
      ...crucesPorRuta.Campeones.map((c, i) => ({ id: `R3-CP-${i + 1}`, ruta: "Campeones", cabeza: c.cabeza, rival: c.rival })),
      ...crucesPorRuta.Liga.map((c, i) => ({ id: `R3-LP-${i + 1}`, ruta: "Liga", cabeza: c.cabeza, rival: c.rival })),
    ];
    setSorteoR3({ cruces, bloqueo });
    setResR3({}); setSorteoPO(null); setResPO({});
  };
  const simularR3 = () => {
    const pools = poolsR3();
    if (pools.Liga.error || pools.Campeones.error) { setSorteoR3({ error: `Ruta Liga: ${pools.Liga.error || "OK"} · Ruta Campeones: ${pools.Campeones.error || "OK"}` }); return; }
    const resLiga = sortear(pools.Liga.plazas), resCampeones = sortear(pools.Campeones.plazas);
    if (resLiga.error || resCampeones.error) { setSorteoR3({ error: `Ruta Liga: ${resLiga.error || "OK"} · Ruta Campeones: ${resCampeones.error || "OK"}` }); return; }
    confirmarR3({ Campeones: resCampeones.cruces, Liga: resLiga.cruces }, resLiga.bloqueo || resCampeones.bloqueo);
  };
  const r3Completa = useMemo(() => sorteoR3 && !sorteoR3.error && sorteoR3.cruces.every((t) => estadoEliminatoria(resR3[t.id]).fase === "resuelto"), [sorteoR3, resR3]);

  const poolsPO = () => {
    if (!sorteoR3 || sorteoR3.error) return { Liga: { plazas: [], error: "Ronda 3 pendiente" }, Campeones: { plazas: [], error: "Ronda 3 pendiente" } };
    const g = sorteoR3.cruces.map((t) => { const r = resolverGenerico(sorteoR3.cruces, resR3, t.id); return r ? { ...r.ganador, ruta: t.ruta } : null; }).filter(Boolean);
    const propiosLiga = g.filter((x) => x.ruta === "Liga");
    const propiosCampeones = g.filter((x) => x.ruta === "Campeones");
    const clR3Campeones = cl.perdedoresR3.filter((p) => p.ruta === "Campeones").map((p) => ({ nombre: p.perdedor, pais: p.pais, coef: coefs[p.perdedor] })).filter((p) => p.coef !== undefined);
    const plazasLiga = [...propiosLiga, ...EL_NUEVOS_PO.map((e) => ({ nombre: e.nombre, pais: e.pais, coef: e.coef }))];
    const plazasCampeones = [...propiosCampeones, ...clR3Campeones];
    return {
      Liga: { plazas: plazasLiga, error: null },
      Campeones: { plazas: plazasCampeones, error: plazasCampeones.length === 12 ? null : `${plazasCampeones.length}/12 (faltan ${12 - plazasCampeones.length} perdedores de Champions Ruta Campeones Ronda 3 — resuélvela allí primero)` },
    };
  };
  const poolsPOListas = useMemo(() => { const p = poolsPO(); return !p.Liga.error && !p.Campeones.error; }, [sorteoR3, resR3, cl.perdedoresR3, coefs]);
  const confirmarPO = (crucesPorRuta, bloqueo = false) => {
    const cruces = [
      ...crucesPorRuta.Campeones.map((c, i) => ({ id: `PO-CP-${i + 1}`, ruta: "Campeones", cabeza: c.cabeza, rival: c.rival })),
      ...crucesPorRuta.Liga.map((c, i) => ({ id: `PO-LP-${i + 1}`, ruta: "Liga", cabeza: c.cabeza, rival: c.rival })),
    ];
    setSorteoPO({ cruces, bloqueo });
    setResPO({});
  };
  const simularPlayoff = () => {
    const pools = poolsPO();
    if (pools.Liga.error || pools.Campeones.error) { setSorteoPO({ error: `Ruta Liga: ${pools.Liga.error || "OK"} · Ruta Campeones: ${pools.Campeones.error || "OK"}` }); return; }
    const resLiga = sortear(pools.Liga.plazas), resCampeones = sortear(pools.Campeones.plazas);
    if (resLiga.error || resCampeones.error) { setSorteoPO({ error: `Ruta Liga: ${resLiga.error || "OK"} · Ruta Campeones: ${resCampeones.error || "OK"}` }); return; }
    confirmarPO({ Campeones: resCampeones.cruces, Liga: resLiga.cruces }, resLiga.bloqueo || resCampeones.bloqueo);
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

  // ---- Fase liga: 13 directos + 12 del playoff propio + 11 caídos de Champions
  // (7 perdedores del Playoff + 4 perdedores de Ronda 3 Ruta Liga) ----
  const poolLiga = useMemo(() => {
    const directos = EL_DIRECTOS_FASE_LIGA.map((e) => ({ nombre: e.nombre, pais: e.pais, coef: coefFaseLiga(e.nombre) }));
    const propios = (clasificados ?? []).map((c) => ({ nombre: c.nombre, pais: c.pais, coef: c.coef ?? coefFaseLiga(c.nombre) }));
    const deCL = [...cl.perdedoresPO, ...cl.perdedoresR3.filter((p) => p.ruta === "Liga")]
      .map((p) => ({ nombre: p.perdedor, pais: p.pais, coef: coefFaseLiga(p.perdedor) }));
    const plazas = [...directos, ...propios, ...deCL];
    if (plazas.length !== 36) {
      const faltan = [];
      if (!clasificados) faltan.push("los 12 del playoff propio");
      if (deCL.length < 11) faltan.push(`${11 - deCL.length} perdedores de Champions (Playoff y Ronda 3 Ruta Liga)`);
      return { plazas, error: `${plazas.length}/36 — faltan ${faltan.join(" y ")}.` };
    }
    return { plazas, error: null };
  }, [clasificados, cl.perdedoresPO, cl.perdedoresR3]);
  const liga = useFaseLiga(poolLiga, FL_CFG_UEL);

  return {
    coefs, allTeams,
    resR1, changeR1, resetR1, resolverR1,
    resR2, changeR2, resetR2, resolverLadoR2, resolverR2, r2Completa,
    sorteoR3, resR3, changeR3, resetR3, r3Completa, simularR3, poolsR3, poolsR3Listas, confirmarR3,
    sorteoPO, resPO, changePO, resetPO, simularPlayoff, poolsPO, poolsPOListas, confirmarPO,
    clasificados, resolverGenerico,
    rellenarR1, rellenarR2, rellenarR3, rellenarPO,
    perdedoresR1, perdedoresR2, perdedoresR3, perdedoresPO,
    liga, poolLiga,
  };
}

// ============================================================
// LÓGICA — CONFERENCE LEAGUE (recibe datos de Champions y Europa en directo)
// ============================================================
function useConference(cl, el) {
  const [coefs] = useState(CO_COEFS_INICIALES);
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
    return { texto: `Perdedor ${tieId} (${info[0].n} o ${info[1].n}, pendiente de Champions League)`, pais: undefined, coef: undefined, definido: false };
  };
  const resolverExternoEL = (tieId) => {
    const info = EL_R1_INFO[tieId];
    const dato = el.perdedoresR1.find((p) => p.tie === tieId);
    if (dato) return { nombre: dato.perdedor, nombreBase: dato.perdedor, pais: dato.pais, coef: coefs[dato.perdedor], definido: true, texto: `${dato.perdedor} (${dato.pais})` };
    return { texto: `Perdedor ${tieId} (${info[0].n} o ${info[1].n}, pendiente de Europa League)`, pais: undefined, coef: undefined, definido: false };
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

  const poolsR3 = () => {
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
    return {
      Campeones: { plazas: poolCampeones, error: poolCampeones.length === 8 ? null : `${poolCampeones.length}/8 (faltan ${8 - poolCampeones.length} del reequilibrio de Champions Ronda 1 — resuélvela allí primero)` },
      Liga: { plazas: poolLiga, error: poolLiga.length === 52 ? null : `${poolLiga.length}/52 (faltan ${52 - poolLiga.length} perdedores de Europa League Ronda 2 — resuélvela allí primero)` },
    };
  };
  const poolsR3Listas = useMemo(() => { const p = poolsR3(); return !p.Campeones.error && !p.Liga.error; }, [resR1, resR2, coefs, cl.perdedoresR1, el.perdedoresR2]);
  const confirmarR3 = (crucesPorRuta, bloqueo = false) => {
    const cruces = [
      ...crucesPorRuta.Campeones.map((c, i) => ({ id: `R3-CP-${i + 1}`, ruta: "Campeones", cabeza: c.cabeza, rival: c.rival })),
      ...crucesPorRuta.Liga.map((c, i) => ({ id: `R3-LP-${i + 1}`, ruta: "Liga", cabeza: c.cabeza, rival: c.rival })),
    ];
    setSorteoR3({ cruces, bloqueo });
    setResR3({}); setSorteoPO(null); setResPO({});
  };
  const simularR3 = () => {
    const pools = poolsR3();
    if (pools.Campeones.error || pools.Liga.error) { setSorteoR3({ error: `Ruta Campeones: ${pools.Campeones.error || "OK"} · Ruta Liga: ${pools.Liga.error || "OK"}` }); return; }
    const resCampeones = sortear(pools.Campeones.plazas), resLiga = sortear(pools.Liga.plazas);
    if (resCampeones.error || resLiga.error) { setSorteoR3({ error: `Ruta Campeones: ${resCampeones.error || "OK"} · Ruta Liga: ${resLiga.error || "OK"}` }); return; }
    confirmarR3({ Campeones: resCampeones.cruces, Liga: resLiga.cruces }, resCampeones.bloqueo || resLiga.bloqueo);
  };
  const r3Completa = useMemo(() => sorteoR3 && !sorteoR3.error && sorteoR3.cruces.every((t) => estadoEliminatoria(resR3[t.id]).fase === "resuelto"), [sorteoR3, resR3]);

  const poolsPO = () => {
    if (!sorteoR3 || sorteoR3.error) return { Campeones: { plazas: [], error: "Ronda 3 pendiente" }, Liga: { plazas: [], error: "Ronda 3 pendiente" } };
    const g = sorteoR3.cruces.map((t) => { const r = resolverGenerico(sorteoR3.cruces, resR3, t.id); return r ? { ...r.ganador, ruta: t.ruta } : null; }).filter(Boolean);
    const propiosCampeones = g.filter((x) => x.ruta === "Campeones");
    const propiosLiga = g.filter((x) => x.ruta === "Liga");
    const perdedoresELr3Campeones = el.perdedoresR3.filter((p) => p.ruta === "Campeones").map((p) => ({ nombre: p.perdedor, pais: p.pais, coef: coefs[p.perdedor] })).filter((p) => p.coef !== undefined);
    const perdedoresELr3Liga = el.perdedoresR3.filter((p) => p.ruta === "Liga").map((p) => ({ nombre: p.perdedor, pais: p.pais, coef: coefs[p.perdedor] })).filter((p) => p.coef !== undefined);
    const poolCampeones = [...propiosCampeones, ...perdedoresELr3Campeones];
    const poolLiga = [...propiosLiga, ...CO_NUEVOS_PO_LIGA, ...perdedoresELr3Liga]; // confirmado: UEFA access list oficial
    return {
      Campeones: { plazas: poolCampeones, error: poolCampeones.length === 10 ? null : `${poolCampeones.length}/10 (faltan ${10 - poolCampeones.length} perdedores de Europa League Ronda 3 Ruta Campeones — resuélvela allí primero)` },
      Liga: { plazas: poolLiga, error: poolLiga.length === 38 ? null : `${poolLiga.length}/38 — faltan los 5 equipos de 6º puesto sin nombre confirmado (ver aviso arriba) más los que falten de Europa League Ronda 3 Ruta Liga` },
    };
  };
  const poolsPOListas = useMemo(() => { const p = poolsPO(); return !p.Campeones.error && !p.Liga.error; }, [sorteoR3, resR3, el.perdedoresR3, coefs]);
  const confirmarPO = (crucesPorRuta, bloqueo = false) => {
    const cruces = [
      ...crucesPorRuta.Campeones.map((c, i) => ({ id: `PO-CP-${i + 1}`, ruta: "Campeones", cabeza: c.cabeza, rival: c.rival })),
      ...crucesPorRuta.Liga.map((c, i) => ({ id: `PO-LP-${i + 1}`, ruta: "Liga", cabeza: c.cabeza, rival: c.rival })),
    ];
    setSorteoPO({ cruces, bloqueo });
    setResPO({});
  };
  const simularPlayoff = () => {
    const pools = poolsPO();
    if (pools.Campeones.error || pools.Liga.error) { setSorteoPO({ error: `Ruta Campeones: ${pools.Campeones.error || "OK"} · Ruta Liga: ${pools.Liga.error || "OK"}` }); return; }
    const resCampeones = sortear(pools.Campeones.plazas), resLiga = sortear(pools.Liga.plazas);
    if (resCampeones.error || resLiga.error) { setSorteoPO({ error: `Ruta Campeones: ${resCampeones.error || "OK"} · Ruta Liga: ${resLiga.error || "OK"}` }); return; }
    confirmarPO({ Campeones: resCampeones.cruces, Liga: resLiga.cruces }, resCampeones.bloqueo || resLiga.bloqueo);
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

  // ---- Fase liga: 24 ganadores del playoff propio + 12 perdedores del
  // Playoff de Europa League (la Conference no tiene plazas directas) ----
  const poolLiga = useMemo(() => {
    const propios = (clasificados ?? []).map((c) => ({ nombre: c.nombre, pais: c.pais, coef: c.coef ?? coefFaseLiga(c.nombre) }));
    const deEL = el.perdedoresPO.map((p) => ({ nombre: p.perdedor, pais: p.pais, coef: coefFaseLiga(p.perdedor) }));
    const plazas = [...propios, ...deEL];
    if (plazas.length !== 36) {
      const faltan = [];
      if (!clasificados) faltan.push("los 24 del playoff propio");
      if (deEL.length < 12) faltan.push(`${12 - deEL.length} perdedores del Playoff de Europa League`);
      return { plazas, error: `${plazas.length}/36 — faltan ${faltan.join(" y ")}.` };
    }
    return { plazas, error: null };
  }, [clasificados, el.perdedoresPO]);
  const liga = useFaseLiga(poolLiga, FL_CFG_UECL);

  return {
    coefs, allTeams,
    resR1, changeR1, resetR1, resolverR1,
    resR2, changeR2, resetR2, resolverExternoCL, resolverLado, resolverR2, r2Completa,
    sorteoR3, resR3, changeR3, resetR3, r3Completa, simularR3, poolsR3, poolsR3Listas, confirmarR3,
    sorteoPO, resPO, changePO, resetPO, simularPlayoff, poolsPO, poolsPOListas, confirmarPO,
    clasificados, resolverGenerico,
    rellenarR1, rellenarR2, rellenarR3, rellenarPO,
    liga, poolLiga,
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
          {tie?.id && <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: 1, color: colores.acento, border: `1px solid ${colores.borde}`, borderRadius: 4, padding: "2px 6px", whiteSpace: "nowrap" }}>{tie.id}</span>}
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
// PANEL DE FASE LIGA (compartido por las 3 competiciones)
// ============================================================
function TablaClasificacion({ filas, colores, marca }) {
  const th = { color: colores.textoSuave, fontFamily: "'JetBrains Mono', monospace", fontSize: 10, padding: "3px 6px", textAlign: "right" };
  const td = { color: colores.texto, fontFamily: "'JetBrains Mono', monospace", fontSize: 11, padding: "3px 6px", textAlign: "right" };
  const zona = (idx) => (idx < 8 ? colores.acento : idx < 24 ? colores.rutaLiga : "#555");
  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ borderCollapse: "collapse", width: "100%", maxWidth: 640 }}>
        <thead>
          <tr>
            <th style={{ ...th, textAlign: "left" }}>#</th>
            <th style={{ ...th, textAlign: "left" }}>Equipo</th>
            <th style={th}>PJ</th><th style={th}>G</th><th style={th}>E</th><th style={th}>P</th>
            <th style={th}>GF</th><th style={th}>GC</th><th style={th}>DG</th><th style={th}>Pts</th>
          </tr>
        </thead>
        <tbody>
          {filas.map((f, idx) => (
            <tr key={f.equipo.nombre} style={{ borderLeft: `3px solid ${zona(idx)}`, opacity: marca && idx >= 24 ? 0.55 : 1 }}>
              <td style={{ ...td, textAlign: "left", color: zona(idx) }}>{idx + 1}</td>
              <td style={{ ...td, textAlign: "left", fontFamily: "'Inter', sans-serif" }}>{f.equipo.nombre} <span style={{ color: colores.textoSuave, fontSize: 9 }}>({f.equipo.pais})</span></td>
              <td style={td}>{f.pj}</td><td style={td}>{f.g}</td><td style={td}>{f.e}</td><td style={td}>{f.p}</td>
              <td style={td}>{f.gf}</td><td style={td}>{f.gc}</td><td style={td}>{f.gf - f.gc > 0 ? "+" : ""}{f.gf - f.gc}</td>
              <td style={{ ...td, color: colores.acento, fontWeight: 600 }}>{f.pts}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {marca && (
        <div style={{ display: "flex", gap: 14, marginTop: 6, flexWrap: "wrap" }}>
          <span style={{ color: colores.acento, fontSize: 10 }}>■ 1º-8º directos a octavos</span>
          <span style={{ color: colores.rutaLiga, fontSize: 10 }}>■ 9º-24º playoff de eliminatorias</span>
          <span style={{ color: "#777", fontSize: 10 }}>■ 25º-36º eliminados</span>
        </div>
      )}
    </div>
  );
}

function FinalCard({ item, resultado, onChange, onReset, colores }) {
  const definido = !!(item.a && item.b);
  const est = estadoPartidoUnico(resultado);
  const set = (campo, raw) => { const v = validar(raw); if (v !== "INVALIDO") onChange("FINAL", campo, v); };
  const inputStyle = { width: 38, background: colores.inputBg, border: `1px solid ${colores.inputBorder}`, borderRadius: 4, color: colores.acento, padding: "3px 4px", fontFamily: "'JetBrains Mono', monospace", fontSize: 12, textAlign: "center" };
  const penIgual = resultado?.penA !== undefined && resultado?.penB !== undefined && Number(resultado.penA) === Number(resultado.penB);
  return (
    <div style={{ background: colores.tarjeta, border: `1px solid ${colores.acento}`, borderRadius: 8, padding: "12px 16px", marginTop: 8 }}>
      <div style={{ color: colores.texto, fontSize: 14, marginBottom: 8 }}>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: 1, color: colores.acento, border: `1px solid ${colores.borde}`, borderRadius: 4, padding: "2px 6px", marginRight: 8 }}>FINAL</span>
        {item.a ? `${item.a.nombre} (${item.a.pais})` : item.etiquetaA} vs {item.b ? `${item.b.nombre} (${item.b.pais})` : item.etiquetaB}
        <span style={{ color: colores.textoSuave, fontSize: 11 }}> · partido único, sede neutral</span>
      </div>
      {!definido && <div style={{ color: colores.alerta, fontSize: 12, fontStyle: "italic" }}>Finalistas aún no definidos — resuelve las semifinales</div>}
      {definido && (
        <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
          <input type="number" min="0" placeholder="A" value={resultado?.gA ?? ""} onChange={(e) => set("gA", e.target.value)} style={inputStyle} />
          <span style={{ color: colores.textoSuave }}>-</span>
          <input type="number" min="0" placeholder="B" value={resultado?.gB ?? ""} onChange={(e) => set("gB", e.target.value)} style={inputStyle} />
          {est.empate && (
            <>
              <span style={{ color: colores.alerta, fontSize: 11 }}>(prórroga)</span>
              <input type="number" min="0" value={resultado?.etA ?? ""} onChange={(e) => set("etA", e.target.value)} style={inputStyle} />
              <span style={{ color: colores.textoSuave }}>-</span>
              <input type="number" min="0" value={resultado?.etB ?? ""} onChange={(e) => set("etB", e.target.value)} style={inputStyle} />
            </>
          )}
          {est.etTied && (
            <>
              <span style={{ color: colores.alerta, fontSize: 11 }}>(pen.)</span>
              <input type="number" min="0" value={resultado?.penA ?? ""} onChange={(e) => set("penA", e.target.value)} style={inputStyle} />
              <span style={{ color: colores.textoSuave }}>-</span>
              <input type="number" min="0" value={resultado?.penB ?? ""} onChange={(e) => set("penB", e.target.value)} style={inputStyle} />
            </>
          )}
          {resultado && <button onClick={() => onReset("FINAL")} style={{ marginLeft: "auto", background: "none", border: `1px solid ${colores.inputBorder}`, color: colores.textoSuave, borderRadius: 4, padding: "2px 8px", fontSize: 11, cursor: "pointer" }}>↺ reiniciar</button>}
        </div>
      )}
      {penIgual && <div style={{ color: colores.alerta, fontSize: 11, marginTop: 4 }}>Los penaltis no pueden terminar en empate</div>}
      {item.ganador && (
        <div style={{ marginTop: 10, background: colores.inputBg, border: `1px solid ${colores.acento}`, borderRadius: 8, padding: "10px 14px", color: colores.acento, fontSize: 16, fontWeight: 700, fontFamily: "'Oswald', sans-serif" }}>
          🏆 CAMPEÓN: {item.ganador.nombre} ({item.ganador.pais})
        </div>
      )}
    </div>
  );
}

function CuadroFinal({ liga, colores }) {
  const { cuadro, resKO, posiciones } = liga;
  if (!cuadro) return null;
  const seccion = (titulo, items) => (
    <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", margin: "16px 0 8px" }}>
      <div style={{ fontFamily: "'JetBrains Mono', monospace", color: colores.textoSuave, fontSize: 11, letterSpacing: 2 }}>{titulo}</div>
      <BotonAleatorio onClick={() => liga.simularRondaKO(items)} label="Simular" colores={colores} />
    </div>
  );
  const nombre = (t, lado) => {
    const e = lado === "A" ? t.a : t.b;
    if (!e) return lado === "A" ? t.etiquetaA : t.etiquetaB;
    const p = posiciones.get(e.nombre);
    return `${p ? p + "º " : ""}${e.nombre}`;
  };
  const cruce = (t, destinoGanador) => (
    <TieCard key={t.id} nombreA={nombre(t, "A")} paisA={t.a?.pais} nombreB={nombre(t, "B")} paisB={t.b?.pais}
      tie={{ id: t.id }} resultado={resKO[t.id]} onChange={liga.cambiarKO} onReset={liga.reiniciarKO}
      definido={!!(t.a && t.b)} colores={colores}
      ganador={t.ganador} perdedor={null} destinoGanador={destinoGanador(t)} />
  );
  return (
    <div style={{ background: colores.tarjeta, border: `1px solid ${colores.acento}`, borderRadius: 8, padding: 14, marginTop: 12 }}>
      <div style={{ color: colores.textoSuave, fontSize: 11, lineHeight: 1.6, maxWidth: 760 }}>
        Eliminatorias a doble partido (el mejor clasificado de la fase liga juega la vuelta en casa) y final a
        partido único. El cuadro es fijo desde octavos: no hay más sorteos (Art. 19).
      </div>
      {seccion("PLAYOFF DE ELIMINATORIAS (9º-24º)", cuadro.po)}
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {cuadro.po.map((t) => cruce(t, (x) => `Visita a ${x.destinoPos}º ${x.destino.nombre} en octavos`))}
      </div>
      {seccion("OCTAVOS DE FINAL", cuadro.octavos)}
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {cuadro.octavos.map((t) => cruce(t, (x) => `Pasa a cuartos de final`))}
      </div>
      {seccion("CUARTOS DE FINAL", cuadro.cuartos)}
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {cuadro.cuartos.map((t) => cruce(t, () => "Pasa a semifinales"))}
      </div>
      {seccion("SEMIFINALES", cuadro.semis)}
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {cuadro.semis.map((t) => cruce(t, () => "Pasa a la final"))}
      </div>
      {seccion("FINAL", [cuadro.final])}
      <FinalCard item={cuadro.final} resultado={resKO["FINAL"]} onChange={liga.cambiarKO} onReset={liga.reiniciarKO} colores={colores} />
    </div>
  );
}

function FaseLigaPanel({ pool, liga, cfg, colores, descripcion }) {
  const { sorteoLiga: sorteo, resLiga, sorteoKO } = liga;
  const [verCalendarioEquipo, setVerCalendarioEquipo] = useState(false);
  const [editando, setEditando] = useState(false);
  const [clasifAbierta, setClasifAbierta] = useState(null); // nº de jornada o null
  const listo = !pool.error;
  const fixtures = sorteo && !sorteo.error ? fixturesFaseLiga(sorteo) : null;
  const inputStyle = { width: 34, background: colores.inputBg, border: `1px solid ${colores.inputBorder}`, borderRadius: 4, color: colores.acento, padding: "2px 3px", fontFamily: "'JetBrains Mono', monospace", fontSize: 12, textAlign: "center" };
  const jornadas = sorteo && !sorteo.error
    ? Array.from({ length: sorteo.numJornadas }, (_, j) => sorteo.partidos.filter((m) => m.jornada === j))
    : [];
  return (
    <div style={{ marginTop: 8, marginBottom: 24 }}>
      <div style={{ fontFamily: "'JetBrains Mono', monospace", color: colores.textoSuave, fontSize: 12, letterSpacing: 2, marginBottom: 6 }}>
        FASE DE LIGA — SORTEO
      </div>
      <div style={{ color: colores.textoSuave, fontSize: 12, lineHeight: 1.6, marginBottom: 12, maxWidth: 760 }}>{descripcion}</div>
      {!listo && <div style={{ color: colores.alerta, fontSize: 12, marginBottom: 10 }}>{pool.error}</div>}
      <BotonSorteo onClick={liga.sortear} disabled={!listo} label={sorteo && !sorteo.error ? "Volver a sortear la fase de liga" : "Sortear fase de liga"} colores={colores} />
      {sorteo?.error && <div style={{ color: colores.alerta, fontSize: 13, marginBottom: 12 }}>{sorteo.error}</div>}

      {sorteo && !sorteo.error && (
        <>
          <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fit, minmax(${cfg.bombos > 4 ? 150 : 200}px, 1fr))`, gap: 10, marginBottom: 16 }}>
            {sorteo.bombos.map((bombo, b) => (
              <div key={b} style={{ background: colores.tarjeta, border: `1px solid ${colores.borde}`, borderRadius: 8, padding: 10 }}>
                <div style={{ color: colores.acento, fontFamily: "'JetBrains Mono', monospace", fontSize: 11, letterSpacing: 1, marginBottom: 8 }}>
                  BOMBO {b + 1}
                </div>
                {bombo.map((e) => (
                  <div key={e.nombre} style={{ display: "flex", justifyContent: "space-between", gap: 6, padding: "2px 0" }}>
                    <span style={{ color: colores.texto, fontSize: 12 }}>
                      {e.nombre} <span style={{ color: colores.textoSuave, fontSize: 10 }}>({e.pais})</span>
                      {cfg.campeon === e.nombre && <span style={{ color: colores.acento, fontSize: 10 }}> 👑</span>}
                    </span>
                    <span style={{ color: colores.textoSuave, fontFamily: "'JetBrains Mono', monospace", fontSize: 10 }}>{e.coef.toFixed(3)}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>

          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 14 }}>
            <button onClick={() => setEditando(!editando)}
              style={{ background: editando ? colores.acento : "none", color: editando ? colores.fondo : colores.acento, border: `1px solid ${colores.acento}`, borderRadius: 8, padding: "6px 14px", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
              {editando ? "✓ Terminar edición" : "✏️ Editar emparejamientos"}
            </button>
            <button onClick={() => setVerCalendarioEquipo(!verCalendarioEquipo)}
              style={{ background: "none", border: `1px solid ${colores.inputBorder}`, color: colores.textoSuave, borderRadius: 8, padding: "6px 14px", fontSize: 12, cursor: "pointer" }}>
              {verCalendarioEquipo ? "Ocultar calendario por equipo" : "Ver calendario por equipo"}
            </button>
          </div>
          {editando && (
            <div style={{ color: colores.alerta, fontSize: 11, marginBottom: 10, maxWidth: 760 }}>
              Elige en cualquier partido con quién intercambiar su visitante. Solo se ofrecen intercambios legales
              (mismo bombo del local y del visitante, y que respeten las reglas de federación del Art. 16). Al
              intercambiar se regenera el reparto de jornadas y se borran los resultados de los dos partidos afectados.
            </div>
          )}

          {verCalendarioEquipo && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 8, marginBottom: 16 }}>
              {sorteo.bombos.flat().map((e) => {
                const f = fixtures.get(e.nombre);
                return (
                  <div key={e.nombre} style={{ background: colores.tarjeta, border: `1px solid ${colores.borde}`, borderRadius: 8, padding: "8px 10px" }}>
                    <div style={{ color: colores.texto, fontSize: 13, fontWeight: 600, marginBottom: 4 }}>
                      {e.nombre} <span style={{ color: colores.textoSuave, fontSize: 10, fontWeight: 400 }}>({e.pais})</span>
                    </div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                      {f.rivales.map((r, k) => (
                        <span key={k} style={{ background: colores.inputBg, border: `1px solid ${colores.inputBorder}`, borderRadius: 4, padding: "2px 6px", fontSize: 11, color: colores.texto, whiteSpace: "nowrap" }}>
                          <span style={{ color: colores.textoSuave, fontFamily: "'JetBrains Mono', monospace", fontSize: 9 }}>B{r.bombo + 1}</span>{" "}
                          {r.casa ? "🏠" : "✈️"} {r.rival.nombre}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {jornadas.map((partidos, j) => (
            <div key={j} style={{ marginBottom: 14 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", marginBottom: 6 }}>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", color: colores.textoSuave, fontSize: 12, letterSpacing: 2 }}>JORNADA {j + 1}</div>
                <BotonAleatorio onClick={() => liga.simularJornada(j)} label="Simular" colores={colores} />
                <button onClick={() => setClasifAbierta(clasifAbierta === j ? null : j)}
                  style={{ background: "none", border: `1px solid ${colores.inputBorder}`, color: colores.textoSuave, borderRadius: 6, padding: "4px 10px", fontSize: 11, cursor: "pointer" }}>
                  {clasifAbierta === j ? "Ocultar clasificación" : "Clasificación tras J" + (j + 1)}
                </button>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(330px, 1fr))", gap: 6 }}>
                {partidos.map((m) => {
                  const r = resLiga[m.clave];
                  const candidatos = editando ? candidatosIntercambio(sorteo, m.clave) : null;
                  return (
                    <div key={m.clave} style={{ background: colores.tarjeta, border: `1px solid ${colores.borde}`, borderRadius: 8, padding: "6px 10px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                        <span style={{ color: colores.texto, fontSize: 12, flex: 1, minWidth: 120, textAlign: "right" }}>
                          {m.local.nombre} <span style={{ color: colores.textoSuave, fontSize: 9 }}>({m.local.pais})</span>
                        </span>
                        <input type="number" min="0" value={r?.gl ?? ""} onChange={(e) => liga.cambiarResultado(m.clave, "gl", e.target.value)} style={inputStyle} />
                        <span style={{ color: colores.textoSuave, fontSize: 11 }}>-</span>
                        <input type="number" min="0" value={r?.gv ?? ""} onChange={(e) => liga.cambiarResultado(m.clave, "gv", e.target.value)} style={inputStyle} />
                        <span style={{ color: colores.texto, fontSize: 12, flex: 1, minWidth: 120 }}>
                          {m.visitante.nombre} <span style={{ color: colores.textoSuave, fontSize: 9 }}>({m.visitante.pais})</span>
                        </span>
                        {r && (r.gl !== undefined || r.gv !== undefined) && (
                          <button onClick={() => liga.reiniciarPartido(m.clave)} title="Reiniciar resultado"
                            style={{ background: "none", border: "none", color: colores.textoSuave, fontSize: 11, cursor: "pointer" }}>↺</button>
                        )}
                      </div>
                      {editando && (
                        <select value="" onChange={(e) => { if (e.target.value) liga.intercambiar(m.clave, e.target.value); }}
                          style={{ marginTop: 4, background: colores.inputBg, border: `1px dashed ${colores.acento}`, borderRadius: 4, color: colores.texto, padding: "3px 6px", fontSize: 11, maxWidth: "100%" }}>
                          <option value="">⇄ intercambiar visitante con… ({candidatos.length} opciones)</option>
                          {candidatos.map((b) => (
                            <option key={b.clave} value={b.clave}>J{b.jornada + 1}: {b.local.nombre} vs {b.visitante.nombre}</option>
                          ))}
                        </select>
                      )}
                    </div>
                  );
                })}
              </div>
              {clasifAbierta === j && (
                <div style={{ marginTop: 8, background: colores.tarjeta, border: `1px dashed ${colores.inputBorder}`, borderRadius: 8, padding: 10 }}>
                  <div style={{ color: colores.textoSuave, fontSize: 11, marginBottom: 6 }}>Clasificación acumulada tras la Jornada {j + 1} (con los resultados introducidos hasta ahí)</div>
                  <TablaClasificacion filas={liga.clasificacionHasta(j)} colores={colores} />
                </div>
              )}
            </div>
          ))}

          <div style={{ fontFamily: "'JetBrains Mono', monospace", color: colores.textoSuave, fontSize: 12, letterSpacing: 2, margin: "18px 0 8px" }}>
            CLASIFICACIÓN {liga.completa ? "FINAL" : `(${liga.jugados}/${sorteo.partidos.length} partidos)`}
          </div>
          <div style={{ color: colores.textoSuave, fontSize: 11, marginBottom: 8, maxWidth: 760 }}>
            Desempates del Art. 17: puntos, diferencia de goles, goles a favor, goles a favor fuera, victorias,
            victorias fuera y, en última instancia, coeficiente de club.
          </div>
          <TablaClasificacion filas={liga.clasificacion} colores={colores} marca />

          <div style={{ marginTop: 18 }}>
            <BotonSorteo onClick={liga.sortearKO} disabled={!liga.completa}
              label={sorteoKO ? "Volver a sortear las eliminatorias" : "Sortear eliminatorias"} colores={colores} />
            {!liga.completa && <div style={{ color: colores.textoSuave, fontSize: 11, marginTop: -12 }}>Introduce (o simula) los {sorteo.partidos.length} resultados para poder sortear las eliminatorias.</div>}
            {sorteoKO && <CuadroFinal liga={liga} colores={colores} />}
          </div>
        </>
      )}
    </div>
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
      <ControlesSorteo sorteo={cl.sorteoR3} pools={extraerPlazas(cl.poolsR3())} poolsListas={cl.r2Completa} onAuto={cl.simularR3} onConfirmarManual={cl.confirmarR3} colores={t} labelAuto={cl.sorteoR3 ? "Volver a sortear la Ronda 3" : "Sortear Ronda 3"} />

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
          <ControlesSorteo sorteo={cl.sorteoPO} pools={extraerPlazas(cl.poolsPO())} poolsListas={cl.r3Completa} onAuto={cl.simularPlayoff} onConfirmarManual={cl.confirmarPO} colores={t} labelAuto={cl.sorteoPO ? "Volver a sortear el Playoff" : "Sortear Playoff"} />
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
          <div style={{ marginTop: 10 }}>
            <div style={{ color: t.textoSuave, fontSize: 11 }}>+ 29 equipos clasificados directamente a la fase de liga:</div>
            {CL_DIRECTOS_FASE_LIGA.map((e, i) => <div key={i} style={{ color: t.texto, fontSize: 13, padding: "1px 0" }}>{e.nombre} ({e.pais})</div>)}
          </div>
        </div>
      )}

      <FaseLigaPanel
        pool={cl.poolLiga} liga={cl.liga} cfg={FL_CFG_UCL} colores={t}
        descripcion={<>36 equipos en 4 bombos de 9 por coeficiente UEFA; el campeón vigente ({CL_CAMPEON_VIGENTE} 👑) ocupa la posición 1
          del Bombo 1. Cada equipo juega 8 partidos contra 8 rivales distintos: 2 de cada bombo, uno en casa y otro fuera.
          Prohibido enfrentarse a clubes de la propia federación y máximo 2 rivales de una misma federación ajena
          (Art. 16 del reglamento UEFA). El calendario por jornadas lo fija la UEFA después, fuera del sorteo.</>} />
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
      <ControlesSorteo sorteo={el.sorteoR3} pools={extraerPlazas(el.poolsR3())} poolsListas={el.poolsR3Listas} onAuto={el.simularR3} onConfirmarManual={el.confirmarR3} colores={t} labelAuto={el.sorteoR3 ? "Volver a sortear la Ronda 3" : "Sortear Ronda 3"} />

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
          <EntrantesConfirmados titulo="Nuevos entrantes del Playoff (Ruta Liga): Sint-Truidense, Lillestrøm, Viktoria Plzeň, OFI Creta, Trabzonspor" lista={[]} colores={t} />
          <ControlesSorteo sorteo={el.sorteoPO} pools={extraerPlazas(el.poolsPO())} poolsListas={el.poolsPOListas} onAuto={el.simularPlayoff} onConfirmarManual={el.confirmarPO} colores={t} labelAuto={el.sorteoPO ? "Volver a sortear el Playoff" : "Sortear Playoff"} />
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
          <div style={{ marginTop: 10 }}>
            <div style={{ color: t.textoSuave, fontSize: 11 }}>+ 13 equipos clasificados directamente a la fase de liga:</div>
            {EL_DIRECTOS_FASE_LIGA.map((e, i) => <div key={i} style={{ color: t.texto, fontSize: 13, padding: "1px 0" }}>{e.nombre} ({e.pais})</div>)}
          </div>
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

      <FaseLigaPanel
        pool={el.poolLiga} liga={el.liga} cfg={FL_CFG_UEL} colores={t}
        descripcion={<>36 equipos en 4 bombos de 9 por coeficiente UEFA (sin privilegio de campeón: el bombo se decide solo por
          coeficiente). Cada equipo juega 8 partidos contra 8 rivales distintos: 2 de cada bombo, uno en casa y otro fuera.
          Prohibido enfrentarse a clubes de la propia federación y máximo 2 rivales de una misma federación ajena
          (Art. 16 del reglamento UEFA). En la realidad este sorteo es 100 % digital y se revela bombo a bombo.</>} />
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
      <ControlesSorteo sorteo={co.sorteoR3} pools={extraerPlazas(co.poolsR3())} poolsListas={co.poolsR3Listas} onAuto={co.simularR3} onConfirmarManual={co.confirmarR3} colores={t} labelAuto={co.sorteoR3 ? "Volver a sortear la Ronda 3" : "Sortear Ronda 3"} />

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
          <ControlesSorteo sorteo={co.sorteoPO} pools={extraerPlazas(co.poolsPO())} poolsListas={co.poolsPOListas} onAuto={co.simularPlayoff} onConfirmarManual={co.confirmarPO} colores={t} labelAuto={co.sorteoPO ? "Volver a sortear el Playoff" : "Sortear Playoff"} />
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
          <div style={{ color: t.textoSuave, fontSize: 11, marginTop: 10 }}>0 equipos clasificados directamente a la fase de liga — la Conference League no reparte plazas directas, las 36 se deciden por fase previa y playoff.</div>
          {(() => {
            const directosEL = el.perdedoresPO;
            return directosEL.length > 0 ? (
              <div style={{ marginTop: 10 }}>
                <div style={{ color: t.textoSuave, fontSize: 11 }}>+ directos desde Europa League (los 12 perdedores del Playoff, ambas rutas) — {directosEL.length}/12 cargados:</div>
                {directosEL.map((p, i) => <div key={i} style={{ color: t.texto, fontSize: 13, padding: "1px 0" }}>{p.perdedor} ({p.pais})</div>)}
              </div>
            ) : <div style={{ color: t.textoSuave, fontSize: 11, marginTop: 10 }}>+ los 12 perdedores del Playoff de Europa League (ambas rutas) — aún no cargados, resuelve esa ronda en Europa League</div>;
          })()}
        </div>
      )}

      <FaseLigaPanel
        pool={co.poolLiga} liga={co.liga} cfg={FL_CFG_UECL} colores={t}
        descripcion={<>36 equipos en 6 bombos de 6 por coeficiente UEFA. Cada equipo juega 6 partidos contra 6 rivales distintos:
          1 de cada bombo. Para repartir casa/fuera los bombos van emparejados (1-2, 3-4 y 5-6): dentro de cada par se juega
          un partido en casa y otro fuera, garantizando 3 en casa y 3 fuera. Prohibido enfrentarse a clubes de la propia
          federación y máximo 2 rivales de una misma federación ajena (Art. 16 del reglamento UEFA).</>} />
    </div>
  );
}

// ============================================================
// DATOS — UEFA NATIONS LEAGUE 2026/27 (selecciones)
// Grupos reales del sorteo de febrero de 2026. Los bombos salen de la
// clasificación general final de la Nations League 2024/25: dentro de cada
// liga, ranks 1-4 = bombo 1, 5-8 = bombo 2, 9-12 = bombo 3, 13-16 = bombo 4.
// En la Liga D (2 grupos de 3, ranks 49-54) los bombos van de dos en dos.
// ============================================================
const NL_RANKING = [ // orden = clasificación general final NL 2024/25 (rank = índice + 1)
  "Portugal", "España", "Francia", "Alemania", "Italia", "Países Bajos", "Dinamarca", "Croacia",
  "Serbia", "Bélgica", "Inglaterra", "Noruega", "Gales", "Chequia", "Grecia", "Turquía",
  "Escocia", "Hungría", "Polonia", "Israel", "Suiza", "Bosnia y Herzegovina", "Austria", "Ucrania",
  "Eslovenia", "Georgia", "República de Irlanda", "Rumanía", "Suecia", "Macedonia del Norte", "Irlanda del Norte", "Kosovo",
  "Islandia", "Albania", "Montenegro", "Kazajistán", "Finlandia", "Eslovaquia", "Bulgaria", "Armenia",
  "Bielorrusia", "Islas Feroe", "Chipre", "Estonia", "Letonia", "Luxemburgo", "Moldavia", "San Marino",
  "Azerbaiyán", "Lituania", "Gibraltar", "Malta", "Liechtenstein", "Andorra",
];
const NL_GRUPOS = {
  A: {
    A1: ["Francia", "Italia", "Bélgica", "Turquía"],
    A2: ["Alemania", "Países Bajos", "Serbia", "Grecia"],
    A3: ["España", "Croacia", "Inglaterra", "Chequia"],
    A4: ["Portugal", "Dinamarca", "Noruega", "Gales"],
  },
  B: {
    B1: ["Escocia", "Suiza", "Eslovenia", "Macedonia del Norte"],
    B2: ["Hungría", "Ucrania", "Georgia", "Irlanda del Norte"],
    B3: ["Israel", "Austria", "República de Irlanda", "Kosovo"],
    B4: ["Polonia", "Bosnia y Herzegovina", "Rumanía", "Suecia"],
  },
  C: {
    C1: ["Albania", "Finlandia", "Bielorrusia", "San Marino"],
    C2: ["Montenegro", "Armenia", "Chipre", "Letonia"],
    C3: ["Kazajistán", "Eslovaquia", "Islas Feroe", "Moldavia"],
    C4: ["Islandia", "Bulgaria", "Estonia", "Luxemburgo"],
  },
  D: {
    D1: ["Gibraltar", "Malta", "Andorra"],
    D2: ["Lituania", "Azerbaiyán", "Liechtenstein"],
  },
};
const NL_RANK = new Map(NL_RANKING.map((n, i) => [n, i + 1]));
// Bombo dentro de la liga para A/B/C (cuartiles del ranking general: 1-4=B1,
// 5-8=B2, etc.), verificado contra el sorteo real. La Liga D se sortea con una
// clasificación de acceso propia que no se deriva del ranking general, así que
// devuelve -1 (no se muestra bombo) en vez de inventar uno.
function nlBomboDe(nombre) {
  const r = NL_RANK.get(nombre);
  if (r === undefined || r > 48) return -1;
  const off = r <= 16 ? 0 : r <= 32 ? 16 : 32;
  return Math.floor((r - off - 1) / 4);
}
const NL_LIGA_META = {
  A: { color: "#D4A94C", nombre: "Liga A", sub: "16 selecciones · 4 grupos de 4 · 6 jornadas · Final a Cuatro (arriba) y descensos a B" },
  B: { color: "#E8734A", nombre: "Liga B", sub: "16 selecciones · 4 grupos de 4 · 6 jornadas · ascensos a A y descensos a C" },
  C: { color: "#4A90D4", nombre: "Liga C", sub: "16 selecciones · 4 grupos de 4 · 6 jornadas · ascensos a B y descensos a D" },
  D: { color: "#5BBB7B", nombre: "Liga D", sub: "6 selecciones · 2 grupos de 3 · 6 jornadas · ascensos a C" },
};
const TEMA_NL = { fondo: "#0A0E17", tarjeta: "#101827", borde: "#1E2A3C", acento: "#4A90D4", texto: "#F4F1E8", textoSuave: "#8A97A8", alerta: "#E8734A", inputBg: "#0A0E17", inputBorder: "#2A3A54" };

// Calendario real de la fase de liga 2026/27 (fuente: UEFA.com).
// Grupos de 4 (Ligas A/B/C): UEFA usa una plantilla única "por posición" —
// referida al bombo, índice 0 = B1 … índice 3 = B4—, idéntica para todos los
// grupos. Cada par [local, visitante] son índices dentro del grupo (que en
// NL_GRUPOS ya están ordenados por bombo). Derivada del calendario real del A3.
const NL_PLANTILLA_G4 = [
  [[3, 1], [2, 0]], // J1
  [[3, 2], [0, 1]], // J2
  [[1, 2], [0, 3]], // J3
  [[1, 0], [2, 3]], // J4
  [[3, 0], [2, 1]], // J5
  [[1, 3], [0, 2]], // J6
];
// Los dos grupos de 3 de la Liga D no comparten plantilla entre sí, así que se
// fijan con su calendario real explícito ([local, visitante] por jornada).
const NL_CALENDARIO_G3 = {
  D1: [["Andorra", "Malta"], ["Gibraltar", "Andorra"], ["Malta", "Gibraltar"], ["Malta", "Andorra"], ["Andorra", "Gibraltar"], ["Gibraltar", "Malta"]],
  D2: [["Liechtenstein", "Lituania"], ["Lituania", "Azerbaiyán"], ["Azerbaiyán", "Liechtenstein"], ["Azerbaiyán", "Lituania"], ["Liechtenstein", "Azerbaiyán"], ["Lituania", "Liechtenstein"]],
};
function nlFixturesGrupo(gid, nombres) {
  const partidos = [];
  const add = (jornada, local, visitante) => partidos.push({ jornada, local, visitante, clave: `${gid}|${local}|${visitante}` });
  if (nombres.length === 4) {
    NL_PLANTILLA_G4.forEach((ronda, r) => ronda.forEach(([l, v]) => add(r + 1, nombres[l], nombres[v])));
  } else {
    NL_CALENDARIO_G3[gid].forEach(([local, visitante], r) => add(r + 1, local, visitante));
  }
  return partidos;
}

// ---- Clasificación de grupo (reglamento UEFA Nations League) ----
// A diferencia de la fase liga de clubes, el PRIMER criterio de desempate es el
// enfrentamiento directo (H2H): entre equipos empatados a puntos se aplican, solo
// con los partidos entre ellos, (a) puntos, (b) diferencia de goles, (c) goles a
// favor. Si tras eso algunos siguen igualados, se reaplica a/b/c solo entre los
// que siguen empatados; y si el H2H no separa a nadie, se pasa a los criterios
// globales del grupo: diferencia de goles, goles a favor, victorias, goles a
// favor fuera y, en última instancia, la clasificación general 2024/25 (rank).
function nlStats(equipos, partidos, res, filtro) {
  const filas = new Map(equipos.map((e) => [e.nombre, { equipo: e, pj: 0, g: 0, e: 0, p: 0, gf: 0, gc: 0, pts: 0, gfFuera: 0 }]));
  for (const m of partidos) {
    if (filtro && (!filtro.has(m.local) || !filtro.has(m.visitante))) continue;
    const r = res[m.clave];
    if (!r || r.gl === undefined || r.gv === undefined) continue;
    const L = filas.get(m.local), V = filas.get(m.visitante);
    if (!L || !V) continue;
    const gl = Number(r.gl), gv = Number(r.gv);
    L.pj++; V.pj++; L.gf += gl; L.gc += gv; V.gf += gv; V.gc += gl; V.gfFuera += gv;
    if (gl > gv) { L.g++; L.pts += 3; V.p++; }
    else if (gl < gv) { V.g++; V.pts += 3; L.p++; }
    else { L.e++; V.e++; L.pts++; V.pts++; }
  }
  return filas;
}
const nlGlobalCmp = (a, b) =>
  (b.gf - b.gc) - (a.gf - a.gc) || b.gf - a.gf || b.g - a.g || b.gfFuera - a.gfFuera || a.equipo.rank - b.equipo.rank;
function clasificacionGrupoNL(equipos, partidos, res) {
  const overall = nlStats(equipos, partidos, res);
  const filas = equipos.map((e) => overall.get(e.nombre));
  // Ordena un conjunto ya empatado a puntos aplicando H2H de forma recursiva.
  const desempatar = (grupo) => {
    if (grupo.length === 1) return grupo;
    const nombres = new Set(grupo.map((f) => f.equipo.nombre));
    const mini = nlStats(grupo.map((f) => f.equipo), partidos, res, nombres);
    const clave = (f) => { const s = mini.get(f.equipo.nombre); return [s.pts, s.gf - s.gc, s.gf]; };
    const ordenado = [...grupo].sort((a, b) => { const ka = clave(a), kb = clave(b); return kb[0] - ka[0] || kb[1] - ka[1] || kb[2] - ka[2]; });
    const buckets = [];
    for (const f of ordenado) {
      const k = clave(f), last = buckets[buckets.length - 1];
      if (last && JSON.stringify(clave(last[0])) === JSON.stringify(k)) last.push(f);
      else buckets.push([f]);
    }
    if (buckets.length === 1) return [...grupo].sort(nlGlobalCmp); // el H2H no separó a nadie
    return buckets.flatMap((b) => (b.length === 1 ? b : desempatar(b)));
  };
  // Primero por puntos; dentro de cada nivel de puntos, H2H.
  const niveles = [];
  for (const f of [...filas].sort((a, b) => b.pts - a.pts)) {
    const last = niveles[niveles.length - 1];
    if (last && last[0].pts === f.pts) last.push(f);
    else niveles.push([f]);
  }
  return niveles.flatMap((n) => (n.length === 1 ? n : desempatar(n)));
}
// Ranking entre equipos que acaban en la MISMA posición en grupos distintos
// (grupos de igual tamaño): puntos, DG, GF, victorias, GF fuera y rank general.
function nlRankMismaPosicion(filas) {
  return [...filas].sort((a, b) => b.pts - a.pts || nlGlobalCmp(a, b));
}

// ---- Play-offs de ascenso/descenso (A/B, B/C) y cuartos de la Final a Cuatro ----
// Sorteo por backtracking con reintento aleatorio y red de seguridad si no hay ninguna
// combinación libre de restricciones (mismo enfoque, generalizado, que sortear() usa
// para los cruces de clubes por bombos con restricción de federación). En los play-offs
// A/B y B/C no hay ninguna restricción real (cada selección es única y las dos rutas
// nunca comparten grupo de origen), así que el sorteo es una biyección libre. En los
// cuartos de la Final a Cuatro sí hay una restricción real: un ganador de grupo no puede
// cruzarse con el 2º de su propio grupo, con quien ya jugó dos veces en la fase de liga.
function nlSortearEmparejamiento(alta, baja, bloqueado) {
  const bajaMezclada = shuffleCopy(baja);
  function backtrack(i, usados, asignacion) {
    if (i === alta.length) return asignacion;
    const candidatos = bajaMezclada.map((_, idx) => idx).filter((idx) => !usados.has(idx) && !bloqueado(alta[i], bajaMezclada[idx]));
    for (const idx of shuffleCopy(candidatos)) {
      usados.add(idx);
      asignacion.push({ cabeza: alta[i], rival: bajaMezclada[idx] });
      const res = backtrack(i + 1, usados, asignacion);
      if (res) return res;
      usados.delete(idx);
      asignacion.pop();
    }
    return null;
  }
  const resultado = backtrack(0, new Set(), []);
  if (resultado) return { cruces: resultado, bloqueo: false };
  const libres = [...bajaMezclada];
  const cruces = alta.map((cabeza) => ({ cabeza, rival: libres.shift() }));
  return { cruces, bloqueo: true };
}
// Play-off de ida y vuelta: el peor clasificado de la general 2024/25 juega la ida en
// casa y el mejor decide la vuelta en casa — regla explícita del reglamento, aplicada
// igual venga el cruce de un sorteo automático o de una edición manual.
function nlTiePlayoff(cabeza, rival) {
  const [peor, mejor] = cabeza.rank > rival.rank ? [cabeza, rival] : [rival, cabeza];
  return { id: `${cabeza.nombre}|${rival.nombre}`, a: peor, b: mejor };
}
// Cuartos de la Final a Cuatro: el ganador de grupo (cabeza de serie) decide siempre la
// vuelta en casa, sea cual sea el rival que le toque en el sorteo.
function nlTieCuartos(cabeza, rival) {
  return { id: `QF-${cabeza.nombre}`, a: rival, b: cabeza };
}
function nlResolverGanador(tie, resultado) {
  const est = estadoEliminatoria(resultado);
  return est.fase === "resuelto" ? (est.ganador === "A" ? tie.a : tie.b) : null;
}

// ============================================================
// LÓGICA — NATIONS LEAGUE (independiente: no encadena con clubes)
// ============================================================
function useNationsLeague() {
  const [res, setRes] = useState({}); // { [clavePartido]: { gl, gv } }
  const grupos = useMemo(() => {
    const out = [];
    for (const liga of ["A", "B", "C", "D"]) {
      for (const [gid, nombres] of Object.entries(NL_GRUPOS[liga])) {
        const equipos = nombres.map((nombre) => ({ nombre, rank: NL_RANK.get(nombre), bombo: nlBomboDe(nombre) }));
        out.push({ liga, id: gid, equipos, partidos: nlFixturesGrupo(gid, nombres) });
      }
    }
    return out;
  }, []);
  const numJornadas = useMemo(() => grupos.reduce((max, g) => Math.max(max, ...g.partidos.map((m) => m.jornada)), 0), [grupos]);
  const cambiar = (clave, campo, raw) => { const v = validar(raw); if (v === "INVALIDO") return; setRes((p) => ({ ...p, [clave]: { ...p[clave], [campo]: v } })); };
  const reiniciar = (clave) => setRes((p) => { const n = { ...p }; delete n[clave]; return n; });
  const rellenarPartidos = (partidos) => setRes((p) => { const n = { ...p }; partidos.forEach((m) => { n[m.clave] = { gl: rnd5(), gv: rnd5() }; }); return n; });
  const rellenarGrupo = (g) => rellenarPartidos(g.partidos);
  const rellenarJornadaGrupo = (g, j) => rellenarPartidos(g.partidos.filter((m) => m.jornada === j));
  const rellenarTodo = () => rellenarPartidos(grupos.flatMap((g) => g.partidos));

  const grupoCompleto = (g) => g.partidos.every((m) => { const r = res[m.clave]; return r && r.gl !== undefined && r.gv !== undefined; });
  const clasificaciones = useMemo(() => {
    const map = new Map();
    grupos.forEach((g) => map.set(g.id, { grupo: g, filas: clasificacionGrupoNL(g.equipos, g.partidos, res), completa: grupoCompleto(g) }));
    return map;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [grupos, res]);

  // Ascensos y descensos directos (los play-offs y la Final a Cuatro son sesiones
  // posteriores). Cross-grupo donde hace falta: los 2 peores cuartos de la Liga C
  // descienden directos a D; el resto de cuartos de C van a play-off C/D.
  const movimientos = useMemo(() => {
    const gruposDe = (liga) => grupos.filter((g) => g.liga === liga);
    const ligaCompleta = (liga) => gruposDe(liga).every((g) => clasificaciones.get(g.id).completa);
    const posEnLiga = (liga, i) => gruposDe(liga).map((g) => ({ g: g.id, fila: clasificaciones.get(g.id).filas[i] }));
    const nombres = (arr) => arr.map((x) => ({ nombre: x.fila.equipo.nombre, grupo: x.g }));
    const cuartosC = ligaCompleta("C") ? nlRankMismaPosicion(posEnLiga("C", 3).map((x) => x.fila)) : null;
    return {
      ascensos: {
        A: ligaCompleta("B") ? nombres(posEnLiga("B", 0)) : null, // ganadores de B → A
        B: ligaCompleta("C") ? nombres(posEnLiga("C", 0)) : null, // ganadores de C → B
        C: ligaCompleta("D") ? nombres(posEnLiga("D", 0)) : null, // ganadores de D → C
      },
      descensos: {
        B: ligaCompleta("A") ? nombres(posEnLiga("A", 3)) : null, // 4º de A → B
        C: ligaCompleta("B") ? nombres(posEnLiga("B", 3)) : null, // 4º de B → C
        D: cuartosC ? cuartosC.slice(-2).map((f) => ({ nombre: f.equipo.nombre, grupo: null })) : null, // 2 peores 4º de C → D
      },
    };
  }, [grupos, clasificaciones]);

  // ---- Pools de play-offs (A/B, B/C) y de la Final a Cuatro de Liga A ----
  // El play-off C/D real de la UEFA cae en marzo de 2028 (temporada siguiente, fuera del
  // alcance de este simulador de 2026/27), así que no se resuelve aquí.
  const playoffPools = useMemo(() => {
    const gruposDe = (liga) => grupos.filter((g) => g.liga === liga);
    const ligaCompleta = (liga) => gruposDe(liga).every((g) => clasificaciones.get(g.id).completa);
    const fila = (liga, i) => gruposDe(liga).map((g) => { const f = clasificaciones.get(g.id).filas[i]; return { nombre: f.equipo.nombre, rank: f.equipo.rank, grupo: g.id }; });
    return {
      AB: { listo: ligaCompleta("A") && ligaCompleta("B"), alta: fila("A", 2), baja: fila("B", 1) }, // 3º de A vs 2º de B
      BC: { listo: ligaCompleta("B") && ligaCompleta("C"), alta: fila("B", 2), baja: fila("C", 1) }, // 3º de B vs 2º de C
    };
  }, [grupos, clasificaciones]);
  const finalFourPool = useMemo(() => {
    const gruposA = grupos.filter((g) => g.liga === "A");
    const listo = gruposA.every((g) => clasificaciones.get(g.id).completa);
    if (!listo) return { listo: false, seeds: [], runnersUp: [] };
    const fila = (i) => gruposA.map((g) => { const f = clasificaciones.get(g.id).filas[i]; return { nombre: f.equipo.nombre, rank: f.equipo.rank, grupo: g.id }; });
    return { listo: true, seeds: fila(0), runnersUp: fila(1) };
  }, [grupos, clasificaciones]);
  const firmaPool = (p) => (p.listo ? p.alta.map((e) => e.nombre).join(",") + "|" + p.baja.map((e) => e.nombre).join(",") : null);
  const firmaAB = firmaPool(playoffPools.AB), firmaBC = firmaPool(playoffPools.BC);
  const firmaFF = finalFourPool.listo ? finalFourPool.seeds.map((e) => e.nombre).join(",") + "|" + finalFourPool.runnersUp.map((e) => e.nombre).join(",") : null;

  // ---- Play-off A/B ----
  const [sorteoAB, setSorteoAB] = useState(null);
  const [resAB, setResAB] = useState({});
  useEffect(() => { setSorteoAB(null); setResAB({}); }, [firmaAB]);
  const sortearAB = () => { setSorteoAB(nlSortearEmparejamiento(playoffPools.AB.alta, playoffPools.AB.baja, () => false)); setResAB({}); };
  const confirmarAB = (cruces) => { setSorteoAB({ cruces, bloqueo: false }); setResAB({}); };
  const cambiarAB = (id, campo, raw) => { const v = validar(raw); if (v === "INVALIDO") return; setResAB((p) => ({ ...p, [id]: { ...p[id], [campo]: v } })); };
  const reiniciarAB = (id) => setResAB((p) => { const n = { ...p }; delete n[id]; return n; });
  const tiesAB = useMemo(() => (sorteoAB && !sorteoAB.error ? sorteoAB.cruces.map((c) => nlTiePlayoff(c.cabeza, c.rival)) : null), [sorteoAB]);
  const rellenarAB = () => { if (!tiesAB) return; const n = {}; tiesAB.forEach((t) => { n[t.id] = generarResultadoAleatorio(); }); setResAB(n); };

  // ---- Play-off B/C ----
  const [sorteoBC, setSorteoBC] = useState(null);
  const [resBC, setResBC] = useState({});
  useEffect(() => { setSorteoBC(null); setResBC({}); }, [firmaBC]);
  const sortearBC = () => { setSorteoBC(nlSortearEmparejamiento(playoffPools.BC.alta, playoffPools.BC.baja, () => false)); setResBC({}); };
  const confirmarBC = (cruces) => { setSorteoBC({ cruces, bloqueo: false }); setResBC({}); };
  const cambiarBC = (id, campo, raw) => { const v = validar(raw); if (v === "INVALIDO") return; setResBC((p) => ({ ...p, [id]: { ...p[id], [campo]: v } })); };
  const reiniciarBC = (id) => setResBC((p) => { const n = { ...p }; delete n[id]; return n; });
  const tiesBC = useMemo(() => (sorteoBC && !sorteoBC.error ? sorteoBC.cruces.map((c) => nlTiePlayoff(c.cabeza, c.rival)) : null), [sorteoBC]);
  const rellenarBC = () => { if (!tiesBC) return; const n = {}; tiesBC.forEach((t) => { n[t.id] = generarResultadoAleatorio(); }); setResBC(n); };

  // ---- Cuartos, semifinales, 3er puesto y final de la Final a Cuatro (Liga A) ----
  const [sorteoQF, setSorteoQF] = useState(null);
  const [resQF, setResQF] = useState({});
  const [resSF, setResSF] = useState({});
  const [res3P, setRes3P] = useState({});
  const [resFinal, setResFinal] = useState({});
  const limpiarFF = () => { setResQF({}); setResSF({}); setRes3P({}); setResFinal({}); };
  useEffect(() => { setSorteoQF(null); limpiarFF();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [firmaFF]);
  const bloqueadoQF = (seed, runnerUp) => seed.grupo === runnerUp.grupo;
  const sortearQF = () => { setSorteoQF(nlSortearEmparejamiento(finalFourPool.seeds, finalFourPool.runnersUp, bloqueadoQF)); limpiarFF(); };
  const confirmarQF = (cruces) => { setSorteoQF({ cruces, bloqueo: false }); limpiarFF(); };
  const cambiarQF = (id, campo, raw) => { const v = validar(raw); if (v === "INVALIDO") return; setResQF((p) => ({ ...p, [id]: { ...p[id], [campo]: v } })); };
  const reiniciarQF = (id) => setResQF((p) => { const n = { ...p }; delete n[id]; return n; });
  const tiesQF = useMemo(() => (sorteoQF && !sorteoQF.error ? sorteoQF.cruces.map((c) => nlTieCuartos(c.cabeza, c.rival)) : null), [sorteoQF]);
  const rellenarQF = () => { if (!tiesQF) return; const n = {}; tiesQF.forEach((t) => { n[t.id] = generarResultadoAleatorio(); }); setResQF(n); };
  const qfCompleta = useMemo(() => !!(tiesQF && tiesQF.every((t) => estadoEliminatoria(resQF[t.id]).fase === "resuelto")), [tiesQF, resQF]);
  // Bracket fijo (QF1+QF2 → SF1, QF3+QF4 → SF2): en la edición 2024/25 —la única jugada
  // hasta ahora con este formato de 8 equipos— el sorteo de cuartos de noviembre de 2024
  // fijó también qué cruce alimenta cada semifinal, sin sorteo aparte tras jugarse los
  // cuartos en marzo. Se sigue el mismo criterio aquí, agrupando por orden del sorteo.
  const semis = useMemo(() => {
    if (!qfCompleta) return null;
    const g = tiesQF.map((t) => nlResolverGanador(t, resQF[t.id]));
    return [{ id: "SF-1", a: g[0], b: g[1] }, { id: "SF-2", a: g[2], b: g[3] }];
  }, [qfCompleta, tiesQF, resQF]);
  const cambiarSF = (id, campo, raw) => { const v = validar(raw); if (v === "INVALIDO") return; setResSF((p) => ({ ...p, [id]: { ...p[id], [campo]: v } })); };
  const reiniciarSF = (id) => setResSF((p) => { const n = { ...p }; delete n[id]; return n; });
  const sfCompleta = !!(semis && semis.every((t) => estadoPartidoUnico(resSF[t.id]).fase === "resuelto"));
  const finalistas = useMemo(() => {
    if (!sfCompleta) return null;
    return { a: nlResolverGanador({ id: "SF-1", a: semis[0].a, b: semis[0].b }, resSF["SF-1"]), b: nlResolverGanador({ id: "SF-2", a: semis[1].a, b: semis[1].b }, resSF["SF-2"]) };
  }, [sfCompleta, semis, resSF]);
  const terceristas = useMemo(() => {
    if (!sfCompleta) return null;
    const perdedor = (t, r) => { const est = estadoPartidoUnico(r); return est.ganador === "A" ? t.b : t.a; };
    return { a: perdedor(semis[0], resSF["SF-1"]), b: perdedor(semis[1], resSF["SF-2"]) };
  }, [sfCompleta, semis, resSF]);
  const cambiar3P = (id, campo, raw) => { const v = validar(raw); if (v === "INVALIDO") return; setRes3P((p) => ({ ...p, [id]: { ...p[id], [campo]: v } })); };
  const reiniciar3P = (id) => setRes3P((p) => { const n = { ...p }; delete n[id]; return n; });
  const cambiarFinal = (id, campo, raw) => { const v = validar(raw); if (v === "INVALIDO") return; setResFinal((p) => ({ ...p, [id]: { ...p[id], [campo]: v } })); };
  const reiniciarFinal = (id) => setResFinal((p) => { const n = { ...p }; delete n[id]; return n; });
  const campeon = useMemo(() => {
    if (!finalistas) return null;
    const est = estadoPartidoUnico(resFinal["FINAL"]);
    return est.fase === "resuelto" ? (est.ganador === "A" ? finalistas.a : finalistas.b) : null;
  }, [finalistas, resFinal]);

  return {
    grupos, numJornadas, res, cambiar, reiniciar, rellenarGrupo, rellenarJornadaGrupo, rellenarTodo, clasificaciones, movimientos,
    playoffPools, sorteoAB, tiesAB, resAB, sortearAB, confirmarAB, cambiarAB, reiniciarAB, rellenarAB,
    sorteoBC, tiesBC, resBC, sortearBC, confirmarBC, cambiarBC, reiniciarBC, rellenarBC,
    finalFourPool, sorteoQF, tiesQF, resQF, sortearQF, confirmarQF, cambiarQF, reiniciarQF, rellenarQF, bloqueadoQF, qfCompleta,
    semis, resSF, cambiarSF, reiniciarSF, sfCompleta, finalistas, terceristas,
    res3P, cambiar3P, reiniciar3P, resFinal, cambiarFinal, reiniciarFinal, campeon,
  };
}

// ============================================================
// VISTA — NATIONS LEAGUE (grupos, resultados y clasificaciones)
// ============================================================
// Zona de cada posición dentro del grupo: color del borde/posición y etiqueta.
// Los play-offs y la Final a Cuatro se resuelven en sesiones posteriores; aquí
// solo se marca a qué opción da acceso cada plaza.
const NL_ZONA_COLOR = {
  A: ["#D4A94C", "#D4A94C", "#E8734A", "#C0392B"],
  B: ["#5BBB7B", "#4A90D4", "#E8734A", "#C0392B"],
  C: ["#5BBB7B", "#4A90D4", "#E8734A", "#C0392B"],
  D: ["#5BBB7B", "#8A97A8", "#8A97A8"],
};
const NL_ZONA_LABEL = {
  A: ["Cuartos (Final a Cuatro)", "Cuartos (Final a Cuatro)", "Play-off descenso A/B", "Descenso directo a B"],
  B: ["Ascenso directo a A", "Play-off ascenso A/B", "Play-off descenso B/C", "Descenso directo a C"],
  C: ["Ascenso directo a B", "Play-off ascenso B/C", "Play-off descenso C/D", "Descenso a D / play-off C/D"],
  D: ["Ascenso directo a C", "Play-off C/D o permanencia", "Play-off C/D o permanencia"],
};
function NLTablaGrupo({ liga, filas, completa, colores }) {
  const th = { color: colores.textoSuave, fontFamily: "'JetBrains Mono', monospace", fontSize: 9, padding: "2px 4px", textAlign: "right" };
  const td = { color: colores.texto, fontFamily: "'JetBrains Mono', monospace", fontSize: 10, padding: "2px 4px", textAlign: "right" };
  const zonas = NL_ZONA_COLOR[liga];
  return (
    <div style={{ overflowX: "auto", marginBottom: 12 }}>
      <table style={{ borderCollapse: "collapse", width: "100%" }}>
        <thead>
          <tr>
            <th style={{ ...th, textAlign: "left" }}>#</th>
            <th style={{ ...th, textAlign: "left" }}>Selección</th>
            <th style={th}>PJ</th><th style={th}>G</th><th style={th}>E</th><th style={th}>P</th>
            <th style={th}>DG</th><th style={th}>Pts</th>
          </tr>
        </thead>
        <tbody>
          {filas.map((f, idx) => (
            <tr key={f.equipo.nombre} style={{ borderLeft: `3px solid ${zonas[idx]}` }} title={NL_ZONA_LABEL[liga][idx]}>
              <td style={{ ...td, textAlign: "left", color: zonas[idx], fontWeight: 600 }}>{idx + 1}</td>
              <td style={{ ...td, textAlign: "left", fontFamily: "'Inter', sans-serif" }}>{f.equipo.nombre}</td>
              <td style={td}>{f.pj}</td><td style={td}>{f.g}</td><td style={td}>{f.e}</td><td style={td}>{f.p}</td>
              <td style={td}>{f.gf - f.gc > 0 ? "+" : ""}{f.gf - f.gc}</td>
              <td style={{ ...td, color: colores.acento, fontWeight: 600 }}>{f.pts}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {!completa && <div style={{ color: colores.textoSuave, fontSize: 10, marginTop: 3, fontStyle: "italic" }}>Provisional — faltan resultados por introducir.</div>}
    </div>
  );
}
function NLGrupoCard({ grupo, nl, colores }) {
  const meta = NL_LIGA_META[grupo.liga];
  const clasif = nl.clasificaciones.get(grupo.id);
  const inputStyle = { width: 34, background: colores.inputBg, border: `1px solid ${colores.inputBorder}`, borderRadius: 4, color: meta.color, padding: "2px 3px", fontFamily: "'JetBrains Mono', monospace", fontSize: 12, textAlign: "center" };
  const jornadas = Array.from({ length: Math.max(...grupo.partidos.map((m) => m.jornada)) }, (_, j) => grupo.partidos.filter((m) => m.jornada === j + 1));
  return (
    <div style={{ background: colores.tarjeta, border: `1px solid ${colores.borde}`, borderRadius: 12, padding: "16px 18px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 10 }}>
        <span style={{ fontFamily: "'Oswald', sans-serif", color: meta.color, fontSize: 18 }}>Grupo {grupo.id}</span>
        <BotonAleatorio onClick={() => nl.rellenarGrupo(grupo)} label="Simular grupo" colores={{ ...colores, acento: meta.color }} />
      </div>
      <NLTablaGrupo liga={grupo.liga} filas={clasif.filas} completa={clasif.completa} colores={colores} />
      {jornadas.map((partidos, j) => (
        <div key={j} style={{ marginBottom: 8 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", color: colores.textoSuave, fontSize: 10, letterSpacing: 1 }}>J{j + 1}</span>
            <button onClick={() => nl.rellenarJornadaGrupo(grupo, j + 1)}
              style={{ background: "none", border: "none", color: colores.textoSuave, fontSize: 11, cursor: "pointer", padding: 0 }}>🎲</button>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {partidos.map((m) => {
              const r = nl.res[m.clave];
              return (
                <div key={m.clave} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ color: colores.texto, fontSize: 12, flex: 1, textAlign: "right", minWidth: 90 }}>{m.local}</span>
                  <input type="number" min="0" value={r?.gl ?? ""} onChange={(e) => nl.cambiar(m.clave, "gl", e.target.value)} style={inputStyle} />
                  <span style={{ color: colores.textoSuave, fontSize: 11 }}>-</span>
                  <input type="number" min="0" value={r?.gv ?? ""} onChange={(e) => nl.cambiar(m.clave, "gv", e.target.value)} style={inputStyle} />
                  <span style={{ color: colores.texto, fontSize: 12, flex: 1, minWidth: 90 }}>{m.visitante}</span>
                  {r && (r.gl !== undefined || r.gv !== undefined) && (
                    <button onClick={() => nl.reiniciar(m.clave)} title="Reiniciar resultado"
                      style={{ background: "none", border: "none", color: colores.textoSuave, fontSize: 11, cursor: "pointer" }}>↺</button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

function NationsLeagueView({ nl }) {
  const c = TEMA_NL;
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10, flexWrap: "wrap", marginBottom: 6 }}>
        <div style={{ color: c.textoSuave, fontSize: 12, lineHeight: 1.6, maxWidth: 640 }}>
          Los 14 grupos reales del sorteo de febrero de 2026. Introduce los resultados a mano o usa los dados para
          simular. Los bombos (B1–B4) salen de la clasificación general de la Nations League 2024/25.
        </div>
        <BotonAleatorio onClick={nl.rellenarTodo} label="Simular todo" colores={c} />
      </div>
      {["A", "B", "C", "D"].map((liga) => {
        const meta = NL_LIGA_META[liga];
        const gruposLiga = nl.grupos.filter((g) => g.liga === liga);
        return (
          <div key={liga} style={{ marginTop: 22 }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: 12, flexWrap: "wrap", borderLeft: `3px solid ${meta.color}`, paddingLeft: 12, marginBottom: 12 }}>
              <span style={{ fontFamily: "'Oswald', sans-serif", color: meta.color, fontSize: 22 }}>{meta.nombre}</span>
              <span style={{ color: c.textoSuave, fontSize: 12 }}>{meta.sub}</span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 12 }}>
              {gruposLiga.map((g) => <NLGrupoCard key={g.id} grupo={g} nl={nl} colores={c} />)}
            </div>
          </div>
        );
      })}
      <NLResumenMovimientos mov={nl.movimientos} colores={c} />
      <NLPlayoffSection titulo="Play-off A/B" sub="3º de Liga A vs 2º de Liga B — el ganador juega en Liga A, el perdedor en Liga B"
        pool={nl.playoffPools.AB} sorteo={nl.sorteoAB} ties={nl.tiesAB} res={nl.resAB}
        sortear={nl.sortearAB} confirmar={nl.confirmarAB} cambiar={nl.cambiarAB} reiniciar={nl.reiniciarAB} rellenar={nl.rellenarAB}
        colores={c} destinoGanador="Se queda/asciende a Liga A" destinoPerdedor="Se queda/desciende a Liga B" />
      <NLPlayoffSection titulo="Play-off B/C" sub="3º de Liga B vs 2º de Liga C — el ganador juega en Liga B, el perdedor en Liga C"
        pool={nl.playoffPools.BC} sorteo={nl.sorteoBC} ties={nl.tiesBC} res={nl.resBC}
        sortear={nl.sortearBC} confirmar={nl.confirmarBC} cambiar={nl.cambiarBC} reiniciar={nl.reiniciarBC} rellenar={nl.rellenarBC}
        colores={c} destinoGanador="Se queda/asciende a Liga B" destinoPerdedor="Se queda/desciende a Liga C" />
      <div style={{ color: c.textoSuave, fontSize: 11, marginTop: 8, maxWidth: 720 }}>
        El play-off de ascenso/descenso C/D de esta edición se disputa en marzo de 2028, ya en la temporada
        siguiente, así que queda fuera del alcance de este simulador.
      </div>
      <NLFinalFourSection nl={nl} colores={c} />
    </div>
  );
}

function NLResumenMovimientos({ mov, colores }) {
  const linea = (etiqueta, equipos) => (
    <div style={{ display: "flex", gap: 8, alignItems: "baseline", padding: "5px 0", borderBottom: `1px solid ${colores.borde}` }}>
      <span style={{ color: colores.textoSuave, fontSize: 12, minWidth: 150 }}>{etiqueta}</span>
      <span style={{ color: colores.texto, fontSize: 13 }}>
        {equipos === null
          ? <span style={{ color: colores.textoSuave, fontStyle: "italic" }}>pendiente — completa todos sus grupos</span>
          : equipos.map((e, i) => <span key={i}>{e.nombre}{e.grupo ? <span style={{ color: colores.textoSuave, fontSize: 10 }}> ({e.grupo})</span> : null}{i < equipos.length - 1 ? ", " : ""}</span>)}
      </span>
    </div>
  );
  const columna = (titulo, color, filas) => (
    <div style={{ flex: 1, minWidth: 300, background: colores.tarjeta, border: `1px solid ${colores.borde}`, borderRadius: 12, padding: "16px 18px" }}>
      <div style={{ fontFamily: "'Oswald', sans-serif", color, fontSize: 17, marginBottom: 8 }}>{titulo}</div>
      {filas}
    </div>
  );
  return (
    <div style={{ marginTop: 28 }}>
      <div style={{ fontFamily: "'JetBrains Mono', monospace", color: colores.textoSuave, fontSize: 12, letterSpacing: 2, marginBottom: 10 }}>ASCENSOS Y DESCENSOS DIRECTOS</div>
      <div style={{ color: colores.textoSuave, fontSize: 12, lineHeight: 1.6, marginBottom: 12, maxWidth: 720 }}>
        Solo los movimientos directos (ganadores de grupo suben; últimos bajan). Los play-offs entre ligas
        contiguas, la Final a Cuatro de la Liga A y la repesca para la Euro 2028 llegan en las próximas versiones.
      </div>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        {columna("Ascensos directos", "#5BBB7B", <>
          {linea("A ← ganadores de B", mov.ascensos.A)}
          {linea("B ← ganadores de C", mov.ascensos.B)}
          {linea("C ← ganadores de D", mov.ascensos.C)}
        </>)}
        {columna("Descensos directos", "#C0392B", <>
          {linea("B ← 4.º de A", mov.descensos.B)}
          {linea("C ← 4.º de B", mov.descensos.C)}
          {linea("D ← 2 peores 4.º de C", mov.descensos.D)}
        </>)}
      </div>
    </div>
  );
}

// ============================================================
// PLAY-OFFS Y FINAL A CUATRO — sorteo, edición manual y edición de un sorteo
// ya hecho, con las mismas tres opciones que el simulador de clubes.
// ============================================================
function NLManualEditor({ alta, baja, crucesIniciales, bloqueado, onChange, colores }) {
  const [asignacion, setAsignacion] = useState(() =>
    alta.map((cab) => {
      if (!crucesIniciales) return null;
      const c = crucesIniciales.find((x) => x.cabeza.nombre === cab.nombre);
      if (!c) return null;
      const idx = baja.findIndex((r) => r.nombre === c.rival.nombre);
      return idx === -1 ? null : idx;
    })
  );
  useEffect(() => {
    const completo = alta.length > 0 && asignacion.every((x) => x !== null);
    onChange(completo ? alta.map((cab, i) => ({ cabeza: cab, rival: baja[asignacion[i]] })) : null, completo);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [asignacion]);
  const usados = new Set(asignacion.filter((x) => x !== null));
  const setRival = (i, raw) => setAsignacion((prev) => { const n = [...prev]; n[i] = raw === "" ? null : Number(raw); return n; });
  const selectStyle = { background: colores.inputBg, border: `1px solid ${colores.inputBorder}`, borderRadius: 4, color: colores.texto, padding: "4px 6px", fontSize: 12, maxWidth: 280 };
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      {alta.map((cab, i) => {
        const actual = asignacion[i];
        const opciones = baja.map((r, idx) => ({ r, idx })).filter(({ r, idx }) => (!usados.has(idx) || idx === actual) && !bloqueado(cab, r));
        return (
          <div key={cab.nombre} style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
            <span style={{ color: colores.texto, fontSize: 12, width: 190 }}>{cab.nombre} <span style={{ color: colores.textoSuave, fontSize: 10 }}>({cab.grupo})</span></span>
            <span style={{ color: colores.textoSuave, fontSize: 11 }}>vs</span>
            <select value={actual ?? ""} onChange={(e) => setRival(i, e.target.value)} style={selectStyle}>
              <option value="">— elegir rival —</option>
              {opciones.map(({ r, idx }) => <option key={r.nombre} value={idx}>{r.nombre} ({r.grupo})</option>)}
            </select>
            {actual === null && opciones.length === 0 && <span style={{ color: colores.alerta, fontSize: 11 }}>Sin rivales libres — cambia otra fila primero</span>}
          </div>
        );
      })}
    </div>
  );
}
function NLControlesEmparejamiento({ sorteo, listo, onAuto, onConfirmarManual, alta, baja, bloqueado, colores, labelAuto }) {
  const [modo, setModo] = useState(null); // null | "manual" | "editar"
  const [pendiente, setPendiente] = useState({ cruces: null, completo: false });
  useEffect(() => { setModo(null); }, [sorteo?.cruces]);
  if (modo === "manual" || modo === "editar") {
    const inicial = modo === "editar" && sorteo && !sorteo.error ? sorteo.cruces : undefined;
    return (
      <div style={{ background: colores.tarjeta, border: `1px dashed ${colores.acento}`, borderRadius: 8, padding: 10, marginBottom: 10 }}>
        <NLManualEditor alta={alta} baja={baja} crucesIniciales={inicial} bloqueado={bloqueado} colores={colores}
          onChange={(cruces, completo) => setPendiente({ cruces, completo })} />
        <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
          <button disabled={!pendiente.completo} onClick={() => { onConfirmarManual(pendiente.cruces); setModo(null); }}
            style={{ background: pendiente.completo ? colores.acento : "#2A2A2A", color: pendiente.completo ? colores.fondo : "#6A6A6A", border: "none", borderRadius: 8, padding: "8px 16px", fontSize: 13, fontWeight: 600, cursor: pendiente.completo ? "pointer" : "not-allowed" }}>
            ✓ {modo === "editar" ? "Guardar cambios" : "Confirmar emparejamiento"}
          </button>
          <button onClick={() => setModo(null)} style={{ background: "none", border: `1px solid ${colores.inputBorder}`, color: colores.textoSuave, borderRadius: 8, padding: "8px 16px", fontSize: 13, cursor: "pointer" }}>Cancelar</button>
        </div>
      </div>
    );
  }
  return (
    <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap", marginBottom: 14 }}>
      <BotonSorteo onClick={onAuto} disabled={!listo} label={labelAuto} colores={colores} />
      <button onClick={() => setModo("manual")} disabled={!listo}
        style={{ background: "none", border: `1px solid ${colores.acento}`, color: listo ? colores.acento : "#6A6A6A", borderRadius: 8, padding: "10px 16px", fontSize: 13, fontWeight: 600, cursor: listo ? "pointer" : "not-allowed" }}>
        ✍️ Sorteo a mano
      </button>
      {sorteo && !sorteo.error && (
        <button onClick={() => setModo("editar")} style={{ background: "none", border: `1px solid ${colores.inputBorder}`, color: colores.textoSuave, borderRadius: 8, padding: "10px 16px", fontSize: 13, cursor: "pointer" }}>
          ✏️ Editar sorteo
        </button>
      )}
    </div>
  );
}
function NLTieCard({ tie, resultado, onChange, onReset, colores, ganador, perdedor, destinoGanador, destinoPerdedor, notaSede }) {
  return (
    <div style={{ background: colores.tarjeta, border: `1px solid ${colores.borde}`, borderRadius: 8, padding: "12px 16px" }}>
      <div style={{ color: colores.texto, fontSize: 14, marginBottom: 4 }}>
        {tie.a.nombre} <span style={{ color: colores.textoSuave, fontSize: 11 }}>({tie.a.grupo})</span>
        {" vs "}
        {tie.b.nombre} <span style={{ color: colores.textoSuave, fontSize: 11 }}>({tie.b.grupo})</span>
      </div>
      {notaSede && <div style={{ color: colores.textoSuave, fontSize: 11, marginBottom: 6 }}>{notaSede}</div>}
      <TieResultInputs tie={tie} resultado={resultado} onChange={onChange} onReset={onReset} colores={colores} />
      {ganador && (
        <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 2 }}>
          <div style={{ color: colores.acento, fontSize: 12 }}>✓ {destinoGanador}: <strong>{ganador.nombre}</strong></div>
          {perdedor && destinoPerdedor && <div style={{ color: colores.textoSuave, fontSize: 12 }}>↳ {destinoPerdedor}: {perdedor.nombre}</div>}
        </div>
      )}
    </div>
  );
}
function NLPlayoffSection({ titulo, sub, pool, sorteo, ties, res, sortear, confirmar, cambiar, reiniciar, rellenar, colores, destinoGanador, destinoPerdedor }) {
  return (
    <div style={{ marginTop: 22 }}>
      <div style={{ display: "flex", alignItems: "baseline", gap: 12, flexWrap: "wrap", borderLeft: `3px solid ${colores.acento}`, paddingLeft: 12, marginBottom: 10 }}>
        <span style={{ fontFamily: "'Oswald', sans-serif", color: colores.acento, fontSize: 20 }}>{titulo}</span>
        <span style={{ color: colores.textoSuave, fontSize: 12 }}>{sub}</span>
      </div>
      {!pool.listo && <div style={{ color: colores.textoSuave, fontSize: 12, fontStyle: "italic", marginBottom: 10 }}>Pendiente — completa todos los grupos de ambas ligas para poder emparejar.</div>}
      <NLControlesEmparejamiento sorteo={sorteo} listo={pool.listo} onAuto={sortear} onConfirmarManual={confirmar}
        alta={pool.alta} baja={pool.baja} bloqueado={() => false} colores={colores} labelAuto="Sortear emparejamiento" />
      {sorteo?.bloqueo && <div style={{ color: colores.alerta, fontSize: 12, marginBottom: 10 }}>No se encontró una combinación distinta tras varios intentos — se ha asignado en el orden del sorteo.</div>}
      {ties && (
        <>
          <div style={{ marginBottom: 10 }}><BotonAleatorio onClick={rellenar} label="Simular todos los cruces" colores={colores} /></div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 10 }}>
            {ties.map((tie) => (
              <NLTieCard key={tie.id} tie={tie} resultado={res[tie.id]} onChange={cambiar} onReset={reiniciar} colores={colores}
                ganador={nlResolverGanador(tie, res[tie.id])} perdedor={estadoEliminatoria(res[tie.id]).fase === "resuelto" ? (estadoEliminatoria(res[tie.id]).ganador === "A" ? tie.b : tie.a) : null}
                destinoGanador={destinoGanador} destinoPerdedor={destinoPerdedor}
                notaSede={`${tie.a.nombre} juega la ida en casa (peor clasificada del general 2024/25); ${tie.b.nombre} decide la vuelta en casa.`} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
function NLPartidoUnico({ titulo, a, b, resultado, onChange, onReset, colores, ganador, notaExtra }) {
  const definido = !!(a && b);
  const est = estadoPartidoUnico(resultado);
  const set = (campo, raw) => { const v = validar(raw); if (v !== "INVALIDO") onChange("X", campo, v); };
  const inputStyle = { width: 38, background: colores.inputBg, border: `1px solid ${colores.inputBorder}`, borderRadius: 4, color: colores.acento, padding: "3px 4px", fontFamily: "'JetBrains Mono', monospace", fontSize: 12, textAlign: "center" };
  return (
    <div style={{ background: colores.tarjeta, border: `1px solid ${colores.acento}`, borderRadius: 8, padding: "12px 16px", marginBottom: 10 }}>
      <div style={{ color: colores.texto, fontSize: 14, marginBottom: 4 }}>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: 1, color: colores.acento, border: `1px solid ${colores.borde}`, borderRadius: 4, padding: "2px 6px", marginRight: 8 }}>{titulo}</span>
        {definido ? `${a.nombre} vs ${b.nombre}` : "Pendiente de definir"}
        <span style={{ color: colores.textoSuave, fontSize: 11 }}> · partido único, sede neutral (Final a Cuatro)</span>
      </div>
      {notaExtra && <div style={{ color: colores.textoSuave, fontSize: 11, marginBottom: 6 }}>{notaExtra}</div>}
      {definido && (
        <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
          <input type="number" min="0" value={resultado?.gA ?? ""} onChange={(e) => set("gA", e.target.value)} style={inputStyle} />
          <span style={{ color: colores.textoSuave }}>-</span>
          <input type="number" min="0" value={resultado?.gB ?? ""} onChange={(e) => set("gB", e.target.value)} style={inputStyle} />
          {est.empate && (
            <>
              <span style={{ color: colores.alerta, fontSize: 11 }}>(prórroga)</span>
              <input type="number" min="0" value={resultado?.etA ?? ""} onChange={(e) => set("etA", e.target.value)} style={inputStyle} />
              <span style={{ color: colores.textoSuave }}>-</span>
              <input type="number" min="0" value={resultado?.etB ?? ""} onChange={(e) => set("etB", e.target.value)} style={inputStyle} />
            </>
          )}
          {est.etTied && (
            <>
              <span style={{ color: colores.alerta, fontSize: 11 }}>(pen.)</span>
              <input type="number" min="0" value={resultado?.penA ?? ""} onChange={(e) => set("penA", e.target.value)} style={inputStyle} />
              <span style={{ color: colores.textoSuave }}>-</span>
              <input type="number" min="0" value={resultado?.penB ?? ""} onChange={(e) => set("penB", e.target.value)} style={inputStyle} />
            </>
          )}
          {resultado && <button onClick={() => onReset("X")} style={{ marginLeft: "auto", background: "none", border: `1px solid ${colores.inputBorder}`, color: colores.textoSuave, borderRadius: 4, padding: "2px 8px", fontSize: 11, cursor: "pointer" }}>↺ reiniciar</button>}
        </div>
      )}
      {ganador && (
        <div style={{ marginTop: 10, background: colores.inputBg, border: `1px solid ${colores.acento}`, borderRadius: 8, padding: "10px 14px", color: colores.acento, fontSize: 15, fontWeight: 700, fontFamily: "'Oswald', sans-serif" }}>
          🏆 {ganador.nombre}
        </div>
      )}
    </div>
  );
}
function NLFinalFourSection({ nl, colores }) {
  const { finalFourPool: pool, sorteoQF, tiesQF, resQF, sortearQF, confirmarQF, cambiarQF, reiniciarQF, rellenarQF, bloqueadoQF, qfCompleta, semis, resSF, cambiarSF, reiniciarSF, sfCompleta, finalistas, terceristas, res3P, cambiar3P, reiniciar3P, resFinal, cambiarFinal, reiniciarFinal, campeon } = nl;
  return (
    <div style={{ marginTop: 26 }}>
      <div style={{ display: "flex", alignItems: "baseline", gap: 12, flexWrap: "wrap", borderLeft: `3px solid ${colores.acento}`, paddingLeft: 12, marginBottom: 10 }}>
        <span style={{ fontFamily: "'Oswald', sans-serif", color: colores.acento, fontSize: 20 }}>Final a Cuatro — Liga A</span>
        <span style={{ color: colores.textoSuave, fontSize: 12 }}>Cuartos (ida y vuelta) → semis, 3er puesto y final (partido único, sede neutral)</span>
      </div>
      {!pool.listo && <div style={{ color: colores.textoSuave, fontSize: 12, fontStyle: "italic", marginBottom: 10 }}>Pendiente — completa los 4 grupos de Liga A para poder sortear los cuartos.</div>}
      <NLControlesEmparejamiento sorteo={sorteoQF} listo={pool.listo} onAuto={sortearQF} onConfirmarManual={confirmarQF}
        alta={pool.seeds} baja={pool.runnersUp} bloqueado={bloqueadoQF} colores={colores} labelAuto="Sortear cuartos" />
      {sorteoQF?.bloqueo && <div style={{ color: colores.alerta, fontSize: 12, marginBottom: 10 }}>No se pudo evitar algún cruce con el 2º del propio grupo — se ha asignado en el orden del sorteo.</div>}
      {tiesQF && (
        <>
          <div style={{ marginBottom: 10 }}><BotonAleatorio onClick={rellenarQF} label="Simular cuartos" colores={colores} /></div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 10, marginBottom: 16 }}>
            {tiesQF.map((tie) => (
              <NLTieCard key={tie.id} tie={tie} resultado={resQF[tie.id]} onChange={cambiarQF} onReset={reiniciarQF} colores={colores}
                ganador={nlResolverGanador(tie, resQF[tie.id])} perdedor={null} destinoGanador="Pasa a semifinales"
                notaSede={`${tie.a.nombre} juega la ida en casa; ${tie.b.nombre} (cabeza de serie, ganador de grupo) decide la vuelta en casa.`} />
            ))}
          </div>
        </>
      )}
      {semis && (
        <>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", color: colores.textoSuave, fontSize: 12, letterSpacing: 2, margin: "8px 0" }}>SEMIFINALES</div>
          <NLPartidoUnico titulo="SF-1" a={semis[0].a} b={semis[0].b} resultado={resSF["SF-1"]}
            onChange={(_, c, v) => cambiarSF("SF-1", c, v)} onReset={() => reiniciarSF("SF-1")} colores={colores}
            ganador={finalistas?.a ?? null} />
          <NLPartidoUnico titulo="SF-2" a={semis[1].a} b={semis[1].b} resultado={resSF["SF-2"]}
            onChange={(_, c, v) => cambiarSF("SF-2", c, v)} onReset={() => reiniciarSF("SF-2")} colores={colores}
            ganador={finalistas?.b ?? null} />
        </>
      )}
      {sfCompleta && (
        <>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", color: colores.textoSuave, fontSize: 12, letterSpacing: 2, margin: "8px 0" }}>TERCER PUESTO Y FINAL</div>
          <NLPartidoUnico titulo="3P" a={terceristas.a} b={terceristas.b} resultado={res3P["3P"]}
            onChange={(_, c, v) => cambiar3P("3P", c, v)} onReset={() => reiniciar3P("3P")} colores={colores}
            ganador={estadoPartidoUnico(res3P["3P"]).fase === "resuelto" ? (estadoPartidoUnico(res3P["3P"]).ganador === "A" ? terceristas.a : terceristas.b) : null}
            notaExtra="Pierden ambas semifinales." />
          <NLPartidoUnico titulo="FINAL" a={finalistas.a} b={finalistas.b} resultado={resFinal["FINAL"]}
            onChange={(_, c, v) => cambiarFinal("FINAL", c, v)} onReset={() => reiniciarFinal("FINAL")} colores={colores}
            ganador={campeon} notaExtra={campeon ? `🏆 Campeón de la UEFA Nations League 2026/27: ${campeon.nombre}` : null} />
        </>
      )}
    </div>
  );
}

function SimuladorNationsLeaguePage({ nl }) {
  const c = TEMA_NL;
  return (
    <div style={{ minHeight: "100vh", background: c.fondo, fontFamily: "'Inter', sans-serif" }}>
      <div style={{ position: "sticky", top: 0, zIndex: 10, background: c.fondo, borderBottom: `1px solid ${c.borde}`, padding: "16px 20px" }}>
        <div style={{ maxWidth: 1040, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 12, flexWrap: "wrap" }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", color: c.acento, fontSize: 11, letterSpacing: 3 }}>SIMULADOR NATIONS LEAGUE 2026/27 · SELECCIONES</div>
          <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
            <a href="#/" style={{ color: c.textoSuave, fontSize: 12, textDecoration: "none" }}>← Inicio</a>
            <a href="#/nations-league" style={{ color: c.textoSuave, fontSize: 12, textDecoration: "none" }}>Cómo funciona la Nations League</a>
            <a href="#/simulador" style={{ color: c.textoSuave, fontSize: 12, textDecoration: "none" }}>Simulador de clubes</a>
          </div>
        </div>
      </div>
      <div style={{ padding: "24px 20px 40px" }}>
        <div style={{ maxWidth: 1040, margin: "0 auto" }}>
          <NationsLeagueView nl={nl} />
          <footer style={{ borderTop: `1px solid ${c.borde}`, paddingTop: 16, marginTop: 28, color: "#5A6678", fontSize: 11, lineHeight: 1.6 }}>
            <div>Modo Competición · Grupos del sorteo oficial de la UEFA (feb-2026); bombos según la clasificación general de la Nations League 2024/25.</div>
          </footer>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// APP PRINCIPAL — landing + artículo + simulador (rutas por hash)
// ============================================================
function useHashRoute() {
  const [hash, setHash] = useState(window.location.hash);
  useEffect(() => {
    const onChange = () => setHash(window.location.hash);
    window.addEventListener("hashchange", onChange);
    return () => window.removeEventListener("hashchange", onChange);
  }, []);
  return hash;
}

export default function App() {
  const cl = useChampions();
  const el = useEuropa(cl);
  const co = useConference(cl, el);
  const nl = useNationsLeague();
  const [tab, setTab] = useState("CL");
  const hash = useHashRoute();

  const vista = hash.startsWith("#/simulador-selecciones") ? "simulador-nl" : hash.startsWith("#/simulador") ? "simulador" : hash.startsWith("#/formato-liga") ? "formato-liga" : hash.startsWith("#/formato") ? "formato" : hash.startsWith("#/nations-league") ? "nations-league" : "inicio";

  useEffect(() => {
    if (hash.startsWith("#/simulador/")) {
      const t = (hash.split("/")[2] || "").toUpperCase();
      if (["CL", "EL", "CO"].includes(t)) setTab(t);
    }
    window.scrollTo(0, 0);
  }, [hash]);

  const tabs = [
    { id: "CL", label: "Champions League", color: TEMA_CL.acento },
    { id: "EL", label: "Europa League", color: TEMA_EL.acento },
    { id: "CO", label: "Conference League", color: TEMA_CO.acento },
  ];
  const fondoActivo = tab === "CL" ? TEMA_CL.fondo : tab === "EL" ? TEMA_EL.fondo : TEMA_CO.fondo;

  return (
    <>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Oswald:wght@600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');`}</style>

      {vista === "inicio" && <Landing />}
      {vista === "formato" && <Articulo />}
      {vista === "formato-liga" && <ArticuloFaseLiga />}
      {vista === "nations-league" && <ArticuloNationsLeague />}
      {vista === "simulador-nl" && <SimuladorNationsLeaguePage nl={nl} />}
      {vista === "simulador" && (
        <div style={{ minHeight: "100vh", background: fondoActivo, fontFamily: "'Inter', sans-serif" }}>
          <div style={{ position: "sticky", top: 0, zIndex: 10, background: fondoActivo, borderBottom: "1px solid #333", padding: "16px 20px 0" }}>
            <div style={{ maxWidth: 960, margin: "0 auto" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 12, flexWrap: "wrap", marginBottom: 4 }}>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", color: "#888", fontSize: 11, letterSpacing: 3 }}>SIMULADOR UEFA 2026/27 · FASE PREVIA COMPLETA</div>
                <div style={{ display: "flex", gap: 14 }}>
                  <a href="#/" style={{ color: "#888", fontSize: 12, textDecoration: "none" }}>← Inicio</a>
                  <a href="#/formato" style={{ color: "#888", fontSize: 12, textDecoration: "none" }}>Formato: fases previas</a>
                  <a href="#/formato-liga" style={{ color: "#888", fontSize: 12, textDecoration: "none" }}>Formato: liga y eliminatorias</a>
                  <a href="#/nations-league" style={{ color: "#888", fontSize: 12, textDecoration: "none" }}>Nations League 2026/27</a>
                  <a href="#/simulador-selecciones" style={{ color: "#888", fontSize: 12, textDecoration: "none" }}>Simulador selecciones</a>
                </div>
              </div>
              <div style={{ display: "flex", gap: 4 }}>
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
              {tab === "CL" && <ChampionsView cl={cl} />}
              {tab === "EL" && <EuropaView el={el} cl={cl} />}
              {tab === "CO" && <ConferenceView co={co} cl={cl} el={el} />}

              <div style={{ display: "flex", justifyContent: "center", margin: "28px 0 8px" }}>
                <a href="mailto:feedback@modocompeticion.com" style={{
                  display: "inline-flex", alignItems: "center", gap: 8,
                  background: tabs.find((tb) => tb.id === tab).color, color: "#0B1420",
                  borderRadius: 8, padding: "12px 22px", fontSize: 15, fontWeight: 700,
                  fontFamily: "'Oswald', sans-serif", textDecoration: "none",
                }}>
                  💬 Danos tu opinión
                </a>
              </div>

              <div style={{ borderTop: "1px solid #333", paddingTop: 16, marginTop: 12, color: "#666", fontSize: 11, lineHeight: 1.6 }}>
                Los datos fluyen en directo entre pestañas — resuelve un resultado en Champions y verás el efecto
                inmediatamente en Europa/Conference League sin guardar ni recargar nada. La fase de liga sigue los
                Artículos 16, 17 y 19 del reglamento UEFA de cada competición: sorteo, clasificación con sus
                desempates y sorteo de eliminatorias con el cuadro final. Próxima versión: resultados de las
                rondas eliminatorias.
              </div>

              <footer style={{ borderTop: "1px solid #333", paddingTop: 16, marginTop: 16, color: "#5A6678", fontSize: 11, lineHeight: 1.6 }}>
                <div>Modo Competición · Los coeficientes y listados de acceso proceden de la documentación oficial de la UEFA.</div>
                <div style={{ marginTop: 6 }}>
                  Modo Competición es un proyecto de Carlos Gil (<a href="https://x.com/CarlosGilAnalis" target="_blank" rel="noopener noreferrer" style={{ color: "#4A90D4" }}>@CarlosGilAnalis</a>), en construcción permanente. Si algo no funciona, te falta
                  una competición o simplemente tienes una idea mejor que la nuestra, <a href="mailto:feedback@modocompeticion.com" style={{ color: "#4A90D4" }}>escríbenos</a>.
                </div>
              </footer>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
