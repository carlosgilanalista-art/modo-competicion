import React from "react";
import useDocumentMeta from "./useDocumentMeta.js";

// ============================================================
// ARTÍCULO — Copa Intercontinental FIFA 2026: explicación del formato
// (6 equipos, 5 partidos, eliminatoria única). Texto de Carlos Gil, íntegro.
// Estructura calcada de ArticuloAFCChampionsElite.jsx. Sin simulador.
// ============================================================
const C = {
  fondo: "#0A0E17", tarjeta: "#101827", borde: "#1E2A3C",
  texto: "#F4F1E8", textoSuave: "#8A97A8",
  oro: "#D4A94C", naranja: "#E8734A", azul: "#4A90D4", verde: "#5BBB7B",
};
const MONO = "'JetBrains Mono', monospace";
const OSWALD = "'Oswald', sans-serif";

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
// Rótulo intermedio dentro de una sección (los "Región Oeste" / "Región Este"
// del original), por debajo del <h2> y por encima de su tabla.
function Subtitulo({ children }) {
  return <div style={{ fontFamily: MONO, color: C.textoSuave, fontSize: 11, letterSpacing: 2, margin: "0 0 8px" }}>{children}</div>;
}
function Lista({ ordenada, children }) {
  const estilo = { color: C.textoSuave, fontSize: 15, lineHeight: 1.75, margin: "0 0 14px", maxWidth: 720, paddingLeft: 22 };
  return ordenada ? <ol style={estilo}>{children}</ol> : <ul style={estilo}>{children}</ul>;
}

// Tabla reutilizable, con el mismo patrón que el resto del sitio: contenedor
// con scroll horizontal propio y `minWidth` en la tabla, para que en móvil
// se desplace la tabla y no la página.
function Tabla({ cabeceras, filas, anchoMin = 420 }) {
  return (
    <div style={{ background: C.tarjeta, border: `1px solid ${C.borde}`, borderRadius: 12, padding: 20, margin: "0 0 14px", overflowX: "auto" }}>
      <table style={{ borderCollapse: "collapse", width: "100%", minWidth: anchoMin }}>
        <thead>
          <tr>
            {cabeceras.map((h) => (
              <th key={h} style={{ textAlign: "left", fontFamily: MONO, color: C.azul, fontSize: 11, letterSpacing: 2, padding: "6px 12px 10px", borderBottom: `1px solid ${C.borde}`, whiteSpace: "nowrap" }}>{h.toUpperCase()}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filas.map((fila, iFila) => (
            <tr key={iFila}>
              {fila.map((celda, iCelda) => (
                <td key={iCelda} style={{ color: iCelda === 0 ? C.texto : C.textoSuave, fontSize: 14, padding: "9px 12px", borderBottom: `1px solid ${C.borde}`, whiteSpace: "nowrap" }}>{celda}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const EQUIPOS = [
  ["UEFA", "Paris Saint-Germain", "Campeón de la Champions 2025/26"],
  ["CAF", "Mamelodi Sundowns", "Campeón de la CAF Champions League 2025/26"],
  ["AFC", "Al Ahli", "Campeón de la AFC Champions League Elite 2025/26"],
  ["OFC", "Auckland FC", "Campeón de la OFC Pro League"],
  ["CONCACAF", "Toluca", "Campeón de la Concacaf Champions Cup 2026 (final el 30/05)"],
  ["CONMEBOL", "Pendiente", "Campeón de la Libertadores (final el 28/11 en Montevideo)"],
];

const CUADRO = [
  ["1", "Play-off Copa África-Asia-Pacífico", "Al Ahli (AFC) vs Auckland FC (OFC)", "Yeda (Arabia Saudí)", "26/08"],
  ["2", "Copa África-Asia-Pacífico", "Mamelodi Sundowns (CAF) vs vencedor del partido 1", "Pretoria (Sudáfrica)", "19/09"],
  ["3", "Derbi de las Américas", "Toluca (CONCACAF) vs campeón de la Libertadores (CONMEBOL)", "Sede neutral pendiente", "Diciembre, fecha pendiente"],
  ["4", "Copa Challenger", "Vencedor del partido 2 vs vencedor del partido 3", "Sede neutral pendiente", "Diciembre, fecha pendiente"],
  ["5", "Final", "PSG vs vencedor del partido 4", "Sede neutral pendiente", "Diciembre, fecha pendiente"],
];

export default function ArticuloCopaIntercontinental() {
  useDocumentMeta({
    title: "Seis equipos, cinco partidos: así funciona la Copa Intercontinental FIFA 2026 · Modo Competición",
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
          <div style={{ fontFamily: MONO, color: C.azul, fontSize: 11, letterSpacing: 3, marginBottom: 10 }}>CLUBES · COPA INTERCONTINENTAL FIFA 2026</div>
          <h1 style={{ fontFamily: OSWALD, color: C.texto, fontSize: 38, lineHeight: 1.15, margin: "0 0 14px" }}>
            Seis equipos, cinco partidos: así funciona la Copa Intercontinental FIFA 2026
          </h1>
          <p style={{ color: C.texto, fontSize: 16, lineHeight: 1.7, margin: 0, fontWeight: 500 }}>
            Seis campeones continentales, un cuadro en escalera, partido único en cada ronda y un PSG que espera en la final sin haber jugado. Te lo desmontamos pieza a pieza, separando lo resuelto de lo que sigue abierto.
          </p>
        </div>

        <P>
          Hay competiciones con fase de grupos, ida y vuelta y un calendario que da para un máster. Y luego está esta: cinco partidos en total. Si te vas a por un café en mal momento, te has perdido una ronda.
        </P>
        <P>
          La organiza la FIFA y esta es su tercera edición con este formato (2024, 2025 y 2026).
        </P>
        <P>Vamos con el desmontaje.</P>

        <Seccion etiqueta="01" titulo="La foto general">
          <P>
            Aquí no hay grupos ni ida y vuelta. Cada eliminatoria se resuelve en un solo partido: uno pasa y el otro se va a casa.
          </P>
          <P>La aritmética es corta:</P>
          <Lista>
            <li>6 equipos, uno por confederación.</li>
            <li>5 partidos en total.</li>
            <li>2 tramos: los dos primeros partidos se juegan en el estadio de uno de los equipos. Los tres últimos van a una sede centralizada y neutral, en diciembre.</li>
          </Lista>
        </Seccion>

        <Seccion etiqueta="02" titulo="Quién entra y por qué vía">
          <P>Cada confederación manda a su campeón continental:</P>
          <Tabla cabeceras={["Confederación", "Equipo", "Cómo llegó"]} filas={EQUIPOS} anchoMin={620} />
          <P>El campeón de la Libertadores se decide en Montevideo.</P>
        </Seccion>

        <Seccion etiqueta="03" titulo="La escalera">
          <P>El campeón de la Champions no pasa por rondas previas: entra directamente en la final. El resto sube peldaño a peldaño:</P>
          <Lista ordenada>
            <li>Play-off Copa África-Asia-Pacífico: el campeón de la AFC contra el de la OFC.</li>
            <li>Copa África-Asia-Pacífico: el campeón de la CAF contra el vencedor del play-off.</li>
            <li>Derbi de las Américas: el campeón de la CONCACAF contra el de la CONMEBOL.</li>
            <li>Copa Challenger: el vencedor de la Copa África-Asia-Pacífico contra el vencedor del Derbi de las Américas.</li>
            <li>Final: el PSG contra el vencedor de la Copa Challenger.</li>
          </Lista>
          <P>Fíjate en el detalle: el PSG juega un partido en toda la competición, y es el último.</P>
        </Seccion>

        <Seccion etiqueta="04" titulo="El cuadro, partido a partido">
          <Tabla cabeceras={["#", "Partido", "Enfrentamiento", "Sede", "Fecha"]} filas={CUADRO} anchoMin={900} />
          <P>
            Un apunte de rigor: algún medio llama al rival de la primera ronda Auckland City. FIFA y las crónicas del partido hablan de Auckland FC, y esa es la referencia que seguimos aquí.
          </P>
        </Seccion>

        <Seccion etiqueta="05" titulo="Cómo se desempata">
          <P>
            Pendiente. La regla oficial de prórroga y penaltis de esta competición no está verificada, y hasta que lo esté no la damos por buena. Es de esas cosas que conviene tener claras antes de la final y no después.
          </P>
        </Seccion>

        <Seccion etiqueta="06" titulo="Lo que está pendiente">
          <P>Cuatro cosas quedan abiertas:</P>
          <Lista>
            <li>El rival de CONMEBOL. Sale de la final de la Libertadores, el 28/11 en Montevideo. Las semifinales son el 14-15 y el 21-22 de octubre.</li>
            <li>Las fechas exactas de los tres últimos partidos. Se juegan en diciembre, pero la FIFA no ha publicado el calendario de 2026. Las fechas de ediciones anteriores no valen como dato de este año.</li>
            <li>La sede centralizada. Hay medios que dan una por hecha. La FIFA dice que se confirmará más adelante, y manda la FIFA.</li>
            <li>La regla de desempate.</li>
          </Lista>
          <P>
            Hasta entonces, cualquier fecha o sede de diciembre que leas lleva, como poco, un hueco. Nosotros preferimos esperar a que la FIFA lo publique.
          </P>
          <p style={{ color: C.textoSuave, fontSize: 15, lineHeight: 1.75, margin: "0 0 14px", maxWidth: 720, fontStyle: "italic" }}>
            En Modo Competición seguiremos la competición y actualizaremos este explicativo cuando se confirme lo pendiente.
          </p>
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
