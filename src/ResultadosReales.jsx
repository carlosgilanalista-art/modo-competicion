import React, { useEffect, useState } from "react";
import useDocumentMeta from "./useDocumentMeta.js";

// ============================================================
// RESULTADOS REALES — foto estática de la fase previa UEFA 2026/27
// Carga por fetch el dataset de public/ (no viene importado en el bundle:
// es una foto a fecha de corte que se regenerará en próximas versiones).
// ============================================================
const MONO = "'JetBrains Mono', monospace";
const OSWALD = "'Oswald', sans-serif";
const C = {
  fondo: "#0A0E17", tarjeta: "#101827", borde: "#1E2A3C",
  texto: "#F4F1E8", textoSuave: "#8A97A8",
};

const COMPETICIONES = [
  { id: "UCL", label: "Champions League", color: "#D4A94C" },
  { id: "UEL", label: "Europa League", color: "#E8734A" },
  { id: "UECL", label: "Conference League", color: "#4A90D4" },
];

const RONDAS = ["Q1", "Q2", "Q3", "PO"];
const RONDA_LABEL = { Q1: "Ronda 1", Q2: "Ronda 2", Q3: "Ronda 3", PO: "Play-off" };
const PATH_LABEL = { champions: "Ruta Campeones", league: "Ruta Liga", main: "Ruta Principal" };

const ESTADO = {
  jugada: { label: "Jugada", color: "#5BBB7B" },
  parcial: { label: "Ida jugada", color: "#D4A94C" },
  pendiente: { label: "Pendiente", color: "#5A6678" },
};

function Badge({ children, color }) {
  return (
    <span style={{
      fontFamily: MONO, fontSize: 10, letterSpacing: 1, color,
      border: `1px solid ${color}`, borderRadius: 999, padding: "2px 8px",
      whiteSpace: "nowrap",
    }}>
      {children}
    </span>
  );
}

function FilaEliminatoria({ e }) {
  const estado = ESTADO[e.estado] || ESTADO.pendiente;
  return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12,
      background: C.fondo, border: `1px solid ${C.borde}`, borderRadius: 8,
      padding: "10px 14px", flexWrap: "wrap",
    }}>
      <div style={{ display: "flex", alignItems: "baseline", gap: 10, flexWrap: "wrap" }}>
        <span style={{ fontFamily: MONO, color: C.textoSuave, fontSize: 11 }}>{e.id_eliminatoria}</span>
        <span style={{ color: C.texto, fontSize: 14 }}>
          {e.equipo_a} <span style={{ color: C.textoSuave }}>vs</span> {e.equipo_b}
        </span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
        <span style={{ fontFamily: MONO, color: C.textoSuave, fontSize: 12 }}>
          {e.marcador_ida ?? "—"} / {e.marcador_vuelta ?? "—"}
          {e.agregado ? ` (agg. ${e.agregado})` : ""}
          {e.penaltis ? ` · pen. ${e.penaltis}` : ""}
        </span>
        {e.clasificado && (
          <span style={{ fontFamily: OSWALD, color: C.texto, fontSize: 12 }}>→ {e.clasificado}</span>
        )}
        <Badge color={estado.color}>{estado.label}</Badge>
      </div>
    </div>
  );
}

function GrupoRonda({ ronda, eliminatorias, color }) {
  if (eliminatorias.length === 0) return null;
  const porPath = {};
  eliminatorias.forEach((e) => {
    const p = e.path || "main";
    (porPath[p] = porPath[p] || []).push(e);
  });
  return (
    <div style={{ marginBottom: 22 }}>
      <div style={{ fontFamily: OSWALD, color, fontSize: 16, marginBottom: 10 }}>
        {RONDA_LABEL[ronda] || ronda}
      </div>
      {Object.entries(porPath).map(([path, lista]) => (
        <div key={path} style={{ marginBottom: 10 }}>
          <div style={{ fontFamily: MONO, color: C.textoSuave, fontSize: 10, letterSpacing: 2, marginBottom: 6 }}>
            {(PATH_LABEL[path] || path).toUpperCase()}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {lista.map((e) => <FilaEliminatoria key={e.id_eliminatoria} e={e} />)}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function ResultadosReales() {
  useDocumentMeta({
    title: "Resultados reales · Fase previa UEFA 2026/27 · Modo Competición",
    description: "Resultados reales de las 214 eliminatorias de la fase previa UEFA 2026/27, foto a fecha de corte.",
  });
  const [datos, setDatos] = useState(null);
  const [error, setError] = useState(null);
  const [comp, setComp] = useState("UCL");

  useEffect(() => {
    fetch("/uefa-fase-previa-2026-27-eliminatorias.json")
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then(setDatos)
      .catch((err) => setError(err.message));
  }, []);

  const compActiva = COMPETICIONES.find((c) => c.id === comp);
  const eliminatoriasComp = datos ? datos.eliminatorias.filter((e) => e.competicion === comp) : [];

  return (
    <div style={{ minHeight: "100vh", background: C.fondo, fontFamily: "'Inter', sans-serif" }}>
      <div style={{ position: "sticky", top: 0, zIndex: 10, background: C.fondo, borderBottom: `1px solid ${C.borde}`, padding: "16px 20px 0" }}>
        <div style={{ maxWidth: 960, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 12, flexWrap: "wrap", marginBottom: 4 }}>
            <div style={{ fontFamily: MONO, color: C.textoSuave, fontSize: 11, letterSpacing: 3 }}>RESULTADOS REALES · FASE PREVIA UEFA 2026/27</div>
            <a href="#/" style={{ color: C.textoSuave, fontSize: 12, textDecoration: "none" }}>← Inicio</a>
          </div>
          <div style={{ display: "flex", gap: 4 }}>
            {COMPETICIONES.map((c) => (
              <button key={c.id} onClick={() => setComp(c.id)}
                style={{
                  background: comp === c.id ? c.color : "transparent",
                  color: comp === c.id ? "#0B1420" : c.color,
                  border: `1px solid ${c.color}`,
                  borderBottom: comp === c.id ? "none" : `1px solid ${c.color}`,
                  borderRadius: "8px 8px 0 0",
                  padding: "10px 18px",
                  fontSize: 14,
                  fontWeight: 700,
                  fontFamily: OSWALD,
                  cursor: "pointer",
                }}>
                {c.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ padding: "24px 20px 40px" }}>
        <div style={{ maxWidth: 960, margin: "0 auto" }}>
          {error && (
            <div style={{ color: "#E8734A", fontSize: 14, marginBottom: 16 }}>
              No se ha podido cargar el dataset: {error}
            </div>
          )}

          {!datos && !error && (
            <div style={{ color: C.textoSuave, fontSize: 14 }}>Cargando resultados…</div>
          )}

          {datos && (
            <>
              <div style={{ color: C.textoSuave, fontSize: 12, marginBottom: 20, lineHeight: 1.6 }}>
                Foto a fecha de corte <strong style={{ color: C.texto }}>{datos.meta.fecha_corte}</strong>.
                Marcadores expresados siempre ida-A / ida-B (equipo_a - equipo_b). Se regenerará en próximas versiones.
              </div>

              {RONDAS.map((ronda) => (
                <GrupoRonda
                  key={ronda}
                  ronda={ronda}
                  color={compActiva.color}
                  eliminatorias={eliminatoriasComp.filter((e) => e.ronda === ronda)}
                />
              ))}
            </>
          )}

          <footer style={{ borderTop: `1px solid ${C.borde}`, paddingTop: 16, marginTop: 16, color: "#5A6678", fontSize: 11, lineHeight: 1.6 }}>
            Modo Competición · Los resultados proceden de fuentes oficiales UEFA y de prensa, recopilados manualmente.
          </footer>
        </div>
      </div>
    </div>
  );
}
