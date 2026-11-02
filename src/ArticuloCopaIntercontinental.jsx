import React from "react";
import useDocumentMeta from "./useDocumentMeta.js";
import { EQUIPOS, PLAZA_CONMEBOL, PARTIDOS } from "./data/copaIntercontinental2026.js";

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

// Datos de las tablas: fuente única en src/data/copaIntercontinental2026.js.
const FILAS_EQUIPOS = [
  ...EQUIPOS.map((e) => [e.confederacion, e.nombre, e.acceso]),
  [PLAZA_CONMEBOL.confederacion, PLAZA_CONMEBOL.articulo.equipo, PLAZA_CONMEBOL.articulo.acceso],
];
const fechaCorta = (iso) => iso.split("-").reverse().slice(0, 2).join("/");
const FILAS_CUADRO = PARTIDOS.map((p) => [
  p.id.slice(1), p.nombre, p.enfrentamiento,
  p.sede,
  fechaCorta(p.fecha),
]);

export default function ArticuloCopaIntercontinental() {
  useDocumentMeta({
    title: "Seis equipos, cinco partidos: así funciona la Copa Intercontinental FIFA 2026 · Modo Competición",
    description: "Copa Intercontinental FIFA 2026: 6 equipos, 5 partidos y eliminatoria única. El PSG espera en la final. Cuadro, resultados, fechas y sedes.",
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
            Seis campeones continentales, un cuadro en escalera, partido único en cada ronda y un PSG que espera en la final sin haber jugado. Te lo desmontamos pieza a pieza.
          </p>
        </div>

        <P>
          Hay competiciones con fase de grupos, ida y vuelta y un calendario que da para un máster. Y luego está esta: cinco partidos en total. Si te vas a por un café en mal momento, te has perdido una ronda.
        </P>
        <P>La organiza la FIFA.</P>
        <P>Vamos con el desmontaje.</P>

        <Seccion etiqueta="01" titulo="La foto general">
          <P>
            Aquí no hay grupos ni ida y vuelta. Cada eliminatoria se resuelve en un solo partido: uno pasa y el otro se va a casa.
          </P>
          <P>La aritmética es corta:</P>
          <Lista>
            <li>6 equipos, uno por confederación.</li>
            <li>5 partidos en total.</li>
            <li>2 tramos: los dos primeros partidos se juegan en el estadio de uno de los equipos. Los tres últimos se juegan en Catar, en sede neutral, en diciembre.</li>
          </Lista>
        </Seccion>

        <Seccion etiqueta="02" titulo="Quién entra y por qué vía">
          <P>Cada confederación manda a su campeón continental:</P>
          <Tabla cabeceras={["Confederación", "Equipo", "Cómo llegó"]} filas={FILAS_EQUIPOS} anchoMin={620} />
          <P>
            La plaza de la CONMEBOL se decide en la final de la Libertadores, entre el Palmeiras y el Estudiantes de La Plata, el 28/11 en el Estadio Centenario de Montevideo. El campeón de la OFC es el Auckland FC, que ganó la final de la OFC Pro League 2026 por 2-1 al South Melbourne el 24/05 en Eden Park.
          </P>
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
          <Tabla cabeceras={["#", "Partido", "Enfrentamiento", "Sede", "Fecha"]} filas={FILAS_CUADRO} anchoMin={900} />
          <P>Lo jugado hasta ahora:</P>
          <Lista>
            <li><B>Play-off Copa África-Asia-Pacífico (26/08, Yeda):</B> Al-Ahli 1-0 Auckland FC. Gol de Abu Al Shamat en el 63', con asistencia de Spertsyan, en el Alinma Stadium. El Auckland FC acabó con diez por la roja directa a Cosgrove en los minutos finales. Sin prórroga.</li>
            <li><B>Copa África-Asia-Pacífico (19/09, Pretoria):</B> Mamelodi Sundowns 2-1 Al-Ahli. Nuno Santos adelantó a los Sundowns en el 17', un autogol de Ronwen Williams igualó en el 19' y Santos marcó de nuevo en el 80'. Sin prórroga.</li>
          </Lista>
          <P>
            Los tres últimos partidos se juegan en Catar: el Derbi de las Américas el 09/12 y la Copa Challenger el 12/12, ambos en el Estadio Jassim bin Hamad de Doha, y la Final el 16/12 en el Estadio Ahmad bin Ali de Al Rayyan.
          </P>
        </Seccion>

        <Seccion etiqueta="05" titulo="Cómo se desempata">
          <P>
            Según el reglamento de 2026 (art. 11), si un partido termina empatado a los 90 minutos hay prórroga de dos tiempos de 15 minutos, con cinco minutos de descanso antes de empezarla y una pausa para beber de un minuto como máximo entre los dos tiempos. Si sigue el empate, se decide en los penaltis.
          </P>
          <P>
            En cuanto a los cambios (art. 19), cada equipo puede hacer hasta cinco en tres ventanas. En la prórroga se añade un cambio más y una ventana extra.
          </P>
        </Seccion>

        <Seccion etiqueta="06" titulo="Lo que viene">
          <Lista>
            <li>28/11: final de la Libertadores entre Palmeiras y Estudiantes en Montevideo. El ganador será el rival de Toluca en el Derbi de las Américas.</li>
            <li>09/12: Derbi de las Américas (Doha).</li>
            <li>12/12: Copa Challenger entre el Mamelodi Sundowns y el vencedor del Derbi (Doha).</li>
            <li>16/12: Final del PSG contra el vencedor de la Copa Challenger (Al Rayyan).</li>
          </Lista>
          <p style={{ color: C.textoSuave, fontSize: 15, lineHeight: 1.75, margin: "0 0 14px", maxWidth: 720, fontStyle: "italic" }}>
            En Modo Competición seguiremos la competición y actualizaremos este explicativo con cada partido.
          </p>
        </Seccion>

        <footer style={{ borderTop: `1px solid ${C.borde}`, paddingTop: 16, color: "#5A6678", fontSize: 11, lineHeight: 1.6 }}>
          <div>Modo Competición · Datos de la Copa Intercontinental de la FIFA 2026.</div>
          <div style={{ marginTop: 6 }}>
            Modo Competición es un proyecto de Carlos Gil (<a href="https://x.com/CarlosGilAnalis" target="_blank" rel="noopener noreferrer" style={{ color: C.azul }}>@CarlosGilAnalis</a>), en construcción permanente. Si algo no funciona, te falta
            una competición o simplemente tienes una idea mejor que la nuestra, <a href="mailto:feedback@modocompeticion.com" style={{ color: C.azul }}>escríbenos</a>.
          </div>
        </footer>
      </div>
    </div>
  );
}
