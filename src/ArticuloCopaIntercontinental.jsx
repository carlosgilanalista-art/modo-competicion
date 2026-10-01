import React from "react";
import useDocumentMeta from "./useDocumentMeta.js";

// ============================================================
// ARTÍCULO — Copa Intercontinental de la FIFA 2026: cuadro, equipos y
// lo que falta por decidirse. Texto de Carlos Gil, íntegro.
//
// Artículo vivo: las zonas marcadas [ACTUALIZAR] se rellenan tras cada
// partido. Son marcas internas, no se publican. Para actualizar:
//   - ESTADO_PARTIDOS, CUADRO y EQUIPOS (datos que alimentan las tablas)
//   - los textos de "Lo que ya ha pasado", "Lo que sigue abierto" y
//     "Lo que se juega en diciembre"
// Esta competición no tiene simulador todavía: el artículo no lo
// menciona ni lo enlaza.
// ============================================================
const C = {
  fondo: "#0A0E17", tarjeta: "#101827", borde: "#1E2A3C",
  texto: "#F4F1E8", textoSuave: "#8A97A8",
  oro: "#D4A94C", naranja: "#E8734A", azul: "#4A90D4", verde: "#5BBB7B",
};
const MONO = "'JetBrains Mono', monospace";
const OSWALD = "'Oswald', sans-serif";

// [ACTUALIZAR tras cada partido]
const ESTADO_PARTIDOS = "Estado a 01/10/2026: 2 de 5 partidos jugados.";

// [ACTUALIZAR tras cada partido] — columna "Estado" y rivales por confirmar
const CUADRO = [
  ["1", "Play-off Copa África-Asia-Pacífico", "Al Ahli (AFC) vs Auckland FC (OFC)", "Yeda (Arabia Saudí)", "Jugado 26/08: Al Ahli 1-0"],
  ["2", "Copa África-Asia-Pacífico", "Mamelodi Sundowns (CAF) vs Al Ahli", "Pretoria (Sudáfrica)", "Jugado 19/09: Sundowns 2-1"],
  ["3", "Derbi de las Américas", "Toluca (CONCACAF) vs campeón de la Libertadores (CONMEBOL)", "Por confirmar", "Pendiente"],
  ["4", "Copa Challenger", "Mamelodi Sundowns vs ganador del partido 3", "Por confirmar", "Pendiente"],
  ["5", "Final", "PSG vs ganador del partido 4", "Por confirmar", "Pendiente"],
];

// [ACTUALIZAR] — el rival de CONMEBOL se rellena tras la final de la Libertadores (28/11)
const EQUIPOS = [
  ["UEFA", "Paris Saint-Germain", "Campeón de la Champions 2025/26"],
  ["CAF", "Mamelodi Sundowns", "Campeón de la CAF Champions League 2025/26"],
  ["AFC", "Al Ahli", "Campeón de la AFC Champions League Elite 2025/26"],
  ["OFC", "Auckland FC", "Campeón de la OFC Pro League"],
  ["CONCACAF", "Toluca", "Campeón de la Concacaf Champions Cup 2026"],
  ["CONMEBOL", "Por determinar", "Final de la Libertadores el 28/11"],
];

function Seccion({ etiqueta, titulo, children }) {
  return (
    <section style={{ marginBottom: 52 }}>
      <div style={{ fontFamily: MONO, color: C.azul, fontSize: 11, letterSpacing: 3, marginBottom: 8 }}>{etiqueta}</div>
      <h2 style={{ fontFamily: OSWALD, color: C.texto, fontSize: 25, margin: "0 0 14px" }}>{titulo}</h2>
      {children}
    </section>
  );
}
function P({ children }) {
  return <p style={{ color: C.textoSuave, fontSize: 15, lineHeight: 1.75, margin: "0 0 14px", maxWidth: 720 }}>{children}</p>;
}
function B({ children }) {
  return <strong style={{ color: C.texto, fontWeight: 600 }}>{children}</strong>;
}
function Destacado({ children }) {
  return (
    <div style={{ background: C.tarjeta, borderLeft: `3px solid ${C.azul}`, borderRadius: "0 10px 10px 0", padding: "14px 18px", color: C.texto, fontSize: 14, lineHeight: 1.7, margin: "0 0 14px", maxWidth: 720 }}>
      {children}
    </div>
  );
}
function Lista({ children }) {
  return <ul style={{ color: C.textoSuave, fontSize: 15, lineHeight: 1.75, margin: "0 0 14px", paddingLeft: 22, maxWidth: 720 }}>{children}</ul>;
}

// ---- Tabla genérica con cabecera ----
function Tabla({ cabecera, filas, minWidth = 560 }) {
  const th = { color: C.oro, fontFamily: MONO, fontSize: 11, fontWeight: 600, letterSpacing: 1, textAlign: "left", padding: "10px 14px", borderBottom: `1px solid ${C.borde}`, whiteSpace: "nowrap" };
  const td = { color: C.textoSuave, fontSize: 13, lineHeight: 1.6, padding: "10px 14px", borderBottom: `1px solid ${C.borde}`, verticalAlign: "top" };
  return (
    <div style={{ background: C.tarjeta, border: `1px solid ${C.borde}`, borderRadius: 12, padding: 20, margin: "0 0 14px", overflowX: "auto" }}>
      <table style={{ borderCollapse: "collapse", width: "100%", minWidth }}>
        <thead>
          <tr>{cabecera.map((h) => <th key={h} style={th}>{h}</th>)}</tr>
        </thead>
        <tbody>
          {filas.map((fila) => (
            <tr key={fila.join("|")}>
              {fila.map((celda, i) => <td key={i} style={i === 0 ? { ...td, color: C.texto, fontWeight: 600 } : td}>{celda}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function ArticuloCopaIntercontinental() {
  useDocumentMeta({
    title: "Copa Intercontinental de la FIFA 2026: cuadro, equipos y lo que falta por decidirse · Modo Competición",
    description: "Copa Intercontinental FIFA 2026: 6 equipos, 5 partidos y eliminatoria única. El PSG espera en la final. Cuadro, resultados y lo que sigue abierto.",
  });
  return (
    <div style={{ minHeight: "100vh", background: C.fondo, fontFamily: "'Inter', sans-serif" }}>
      <div style={{ maxWidth: 820, margin: "0 auto", padding: "0 20px 60px" }}>

        <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 0 0", flexWrap: "wrap", gap: 10 }}>
          <a href="#/" style={{ fontFamily: MONO, color: C.texto, fontSize: 13, letterSpacing: 3, textDecoration: "none" }}>MODO COMPETICIÓN</a>
          <nav style={{ display: "flex", gap: 18, flexWrap: "wrap" }}>
            <a href="#/" style={{ color: C.textoSuave, fontSize: 13, textDecoration: "none" }}>← Inicio</a>
          </nav>
        </header>

        <div style={{ padding: "56px 0 44px" }}>
          <div style={{ fontFamily: MONO, color: C.azul, fontSize: 11, letterSpacing: 3, marginBottom: 10 }}>COPA INTERCONTINENTAL FIFA 2026</div>
          <h1 style={{ fontFamily: OSWALD, color: C.texto, fontSize: 38, lineHeight: 1.15, margin: "0 0 14px" }}>
            Copa Intercontinental de la FIFA 2026: cuadro, equipos y lo que falta por decidirse
          </h1>
          {/* [ACTUALIZAR tras cada partido] */}
          <Destacado><B>{ESTADO_PARTIDOS}</B></Destacado>
        </div>

        <Seccion etiqueta="01" titulo="Qué es y por qué existe">
          <P>
            La Copa Intercontinental es la versión anual que la FIFA mantiene tras el nuevo Mundial de
            Clubes: campeones continentales, partido único y a ver quién se queda. Es su tercera edición
            con este formato (2024, 2025 y 2026), así que ya no es la nueva del barrio.
          </P>
        </Seccion>

        <Seccion etiqueta="02" titulo="Formato: 6 equipos, 5 partidos">
          <P>Aquí no hay grupos ni ida y vuelta. Un partido, uno pasa y otro se va a casa.</P>
          <Lista>
            <li>El campeón de la Champions, el PSG, se salta las rondas previas y entra directo en la final.</li>
            <li>Los demás campeones continentales se lo tienen que ganar por el camino largo.</li>
            <li>
              Los dos primeros partidos se juegan en el estadio de uno de los equipos. Los tres últimos
              (Derbi de las Américas, Copa Challenger y final) van a una sede centralizada y neutral, en
              diciembre.
            </li>
          </Lista>
        </Seccion>

        <Seccion etiqueta="03" titulo="El cuadro">
          {/* [ACTUALIZAR tras cada partido] */}
          <Tabla cabecera={["#", "Partido", "Enfrentamiento", "Sede", "Estado"]} filas={CUADRO} minWidth={720} />
        </Seccion>

        <Seccion etiqueta="04" titulo="Los equipos">
          {/* [ACTUALIZAR] cuando se conozca el campeón de la Libertadores */}
          <Tabla cabecera={["Confederación", "Equipo", "Cómo llegó"]} filas={EQUIPOS} />
        </Seccion>

        <Seccion etiqueta="05" titulo="Lo que ya ha pasado">
          {/* [ACTUALIZAR] */}
          <P>
            Dos partidos jugados y dos equipos fuera. Al Ahli eliminó a Auckland FC (1-0, el 26/08) y
            después cayó ante Mamelodi Sundowns (2-1, el 19/09). Sundowns ya está en la Copa Challenger,
            esperando rival.
          </P>
        </Seccion>

        <Seccion etiqueta="06" titulo="Lo que sigue abierto">
          {/* [ACTUALIZAR] */}
          <Lista>
            <li>
              <B>El rival de CONMEBOL.</B> No lo sabremos hasta la final de la Libertadores, el 28/11 en
              Montevideo. Las semifinales son el 14-15 y el 21-22 de octubre.
            </li>
            <li>
              <B>Fechas y sede de los tres últimos partidos.</B> La FIFA todavía no las ha confirmado.
              Hasta que lo haga, nada de dar por hecho ninguna sede.
            </li>
            <li>
              <B>Desempate.</B> Aún está pendiente de confirmar la regla de prórroga y penaltis de esta
              competición. Cuando esté verificada, la añadimos aquí.
            </li>
          </Lista>
        </Seccion>

        <Seccion etiqueta="07" titulo="Lo que se juega en diciembre">
          {/* [ACTUALIZAR tras cada partido] */}
          <Lista>
            <li>Derbi de las Américas: pendiente</li>
            <li>Copa Challenger: pendiente</li>
            <li>Final: pendiente</li>
          </Lista>
        </Seccion>

        <footer style={{ borderTop: `1px solid ${C.borde}`, paddingTop: 16, color: "#5A6678", fontSize: 11, lineHeight: 1.6 }}>
          <div>Modo Competición · Datos de la Copa Intercontinental de la FIFA 2026. Lo que no está confirmado se declara como pendiente.</div>
          <div style={{ marginTop: 6 }}>
            Modo Competición es un proyecto de Carlos Gil (<a href="https://x.com/CarlosGilAnalis" target="_blank" rel="noopener noreferrer" style={{ color: C.azul }}>@CarlosGilAnalis</a>), en construcción permanente. Si algo no funciona, te falta
            una competición o simplemente tienes una idea mejor que la nuestra, <a href="mailto:feedback@modocompeticion.com" style={{ color: C.azul }}>escríbenos</a>.
          </div>
        </footer>
      </div>
    </div>
  );
}
