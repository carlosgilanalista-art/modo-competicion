import React from "react";
import useDocumentMeta from "./useDocumentMeta.js";

// ============================================================
// ARTÍCULO — Procedimiento del sorteo de la fase de liga de la
// Champions League 2026/27. Describe el mecanismo del sorteo real
// (bombos, restricciones, calendario), no los emparejamientos que
// salgan de él. Texto de Carlos Gil, íntegro.
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
function Destacado({ children }) {
  return (
    <div style={{ background: C.tarjeta, borderLeft: `3px solid ${C.azul}`, borderRadius: "0 10px 10px 0", padding: "14px 18px", color: C.texto, fontSize: 14, lineHeight: 1.7, margin: "0 0 14px", maxWidth: 720 }}>
      {children}
    </div>
  );
}

// ---- Tabla de los cuatro bombos ----
function TablaBombos() {
  const filas = [
    ["Bombo 1", "PSG, Bayern de Múnich, Real Madrid, Liverpool, Inter de Milán, Manchester City, Arsenal, Barcelona, Atlético de Madrid"],
    ["Bombo 2", "Borussia Dortmund, Roma, Sporting CP, Aston Villa, Oporto, Manchester United, Club Brugge, Real Betis, PSV Eindhoven"],
    ["Bombo 3", "Feyenoord, Lille, Bodø/Glimt, Nápoles, RB Leipzig, Villarreal, Fenerbahçe, Shakhtar Donetsk, Galatasaray"],
    ["Bombo 4", "Slavia Praga, Stuttgart, AEK Atenas, LASK, Como, Lens, Viking, Slovan Bratislava, Sabah FK"],
  ];
  return (
    <div style={{ background: C.tarjeta, border: `1px solid ${C.borde}`, borderRadius: 12, padding: 20, margin: "0 0 14px", overflowX: "auto" }}>
      <table style={{ borderCollapse: "collapse", width: "100%", minWidth: 480 }}>
        <tbody>
          {filas.map(([bombo, equipos]) => (
            <tr key={bombo}>
              <td style={{ color: C.oro, fontFamily: MONO, fontSize: 12, fontWeight: 600, letterSpacing: 1, padding: "10px 14px", borderBottom: `1px solid ${C.borde}`, whiteSpace: "nowrap", verticalAlign: "top" }}>{bombo}</td>
              <td style={{ color: C.textoSuave, fontSize: 13, lineHeight: 1.6, padding: "10px 14px", borderBottom: `1px solid ${C.borde}` }}>{equipos}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function ArticuloProcedimientoSorteoUCL() {
  useDocumentMeta({
    title: "Cómo funciona el sorteo de la fase de liga de la Champions 2026/27 · Modo Competición",
    description: "36 equipos, un software haciendo la mayor parte del trabajo, y unas pocas restricciones fijas que determinan quién puede cruzarse con quién. El procedimiento del sorteo, explicado.",
  });
  return (
    <div style={{ minHeight: "100vh", background: C.fondo, fontFamily: "'Inter', sans-serif" }}>
      <div style={{ maxWidth: 820, margin: "0 auto", padding: "0 20px 60px" }}>

        <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 0 0", flexWrap: "wrap", gap: 10 }}>
          <a href="#/" style={{ fontFamily: MONO, color: C.texto, fontSize: 13, letterSpacing: 3, textDecoration: "none" }}>MODO COMPETICIÓN</a>
          <nav style={{ display: "flex", gap: 18, flexWrap: "wrap" }}>
            <a href="#/" style={{ color: C.textoSuave, fontSize: 13, textDecoration: "none" }}>← Inicio</a>
            <a href="#/formato-liga" style={{ color: C.textoSuave, fontSize: 13, textDecoration: "none" }}>Fase de liga y eliminatorias</a>
            <a href="#/simulador/cl" style={{ color: C.textoSuave, fontSize: 13, textDecoration: "none" }}>Simulador Champions</a>
          </nav>
        </header>

        <div style={{ padding: "56px 0 44px" }}>
          <div style={{ fontFamily: MONO, color: C.azul, fontSize: 11, letterSpacing: 3, marginBottom: 10 }}>SORTEO CHAMPIONS 2026/27 · PROCEDIMIENTO</div>
          <h1 style={{ fontFamily: OSWALD, color: C.texto, fontSize: 38, lineHeight: 1.15, margin: "0 0 14px" }}>
            Cómo funciona el sorteo de la fase de liga de la Champions 2026/27
          </h1>
          <p style={{ color: C.textoSuave, fontSize: 16, lineHeight: 1.7, margin: 0 }}>
            Antes de darle a "sortear" en el simulador, esto es lo que pasa en el sorteo real: 36 equipos, un
            software haciendo la mayor parte del trabajo, y unas pocas restricciones fijas que determinan
            quién puede cruzarse con quién.
          </p>
        </div>

        <Seccion etiqueta="01" titulo="Qué se sortea exactamente (y qué no)">
          <P>
            El sorteo decide los ocho rivales de cada uno de los 36 equipos —cuatro en casa, cuatro fuera—.
            No decide fechas ni horarios de los partidos, ni tampoco quién avanza de ronda: eso lo resuelve
            la clasificación final de la fase de liga.
          </P>
          <P>
            Los 36 son 29 clasificados directos más los 7 que salen de la ronda de play-off, cerrada el 26
            de agosto. Los siete últimos en confirmarse fueron Bodø/Glimt, Fenerbahçe, AEK Atenas, LASK,
            Viking, Slovan Bratislava y Sabah FK —este último, debutante histórico en la competición—.
          </P>
          <Destacado>
            El sorteo se celebra el jueves 27 de agosto de 2026, a las 18:00 hora española, en el Grimaldi
            Forum de Mónaco.
          </Destacado>
        </Seccion>

        <Seccion etiqueta="02" titulo="Los cuatro bombos">
          <P>
            Los 36 equipos se reparten en cuatro bombos de nueve, por coeficiente UEFA de club, con una
            excepción: el campeón vigente (PSG) ocupa automáticamente la cabeza del Bombo 1.
          </P>
          <TablaBombos />
        </Seccion>

        <Seccion etiqueta="03" titulo="Cuántos rivales le tocan a cada equipo, y de dónde salen">
          <P>
            Cada equipo juega contra 8 de los otros 35: dos de cada uno de los cuatro bombos, incluido el
            suyo propio. De esos ocho, cuatro se juegan en casa y cuatro fuera. Es la tercera edición de
            este formato desde que sustituyó a los grupos de cuatro: no hay "grupo de la muerte" cerrado,
            hay 36 calendarios distintos, uno por equipo.
          </P>
        </Seccion>

        <Seccion etiqueta="04" titulo="Restricciones vigentes en 2026/27">
          <P>Dos restricciones estructurales, ya conocidas de las dos ediciones anteriores:</P>
          <Destacado>
            Ningún equipo se enfrenta a otro de su misma federación.<br />
            Máximo dos rivales de una misma federación extranjera entre los ocho cruces de cada equipo.
          </Destacado>
          <P>
            Y una novedad real para esta temporada, confirmada por comunicado oficial de la UEFA Club
            Competitions Committee: ningún cruce puede repetirse con el mismo local durante tres temporadas
            consecutivas. Consecuencia directa y ya señalada por varios medios: el Liverpool no podrá
            recibir al Real Madrid en Anfield esta edición —ya lo hizo en 2024/25 y 2025/26—, aunque sí
            podrán cruzarse jugando en el Bernabéu. La restricción no aplica a las rondas eliminatorias.
          </P>
        </Seccion>

        <Seccion etiqueta="05" titulo="Por qué el sorteo es automatizado">
          <P>
            Con 36 equipos, ocho rivales por cabeza, mitad en casa y mitad fuera, y restricciones de
            federación cruzadas entre todos a la vez, hacerlo bola a bola —como el viejo sorteo de
            grupos— es inviable en un plató de televisión. Desde que existe este formato, la UEFA no
            extrae bolas: el software calcula de una sola vez una combinación válida para los 36 equipos y
            la revela en pantalla. La puesta en escena —presentadores, gráficos, el "botón" que activa el
            sorteo— es la parte visible; el cálculo que garantiza que el reparto cuadra lo hace el
            ordenador.
          </P>
        </Seccion>

        <Seccion etiqueta="06" titulo="Qué pasa después: el calendario">
          <P>
            El sorteo fija los rivales, no el calendario. UEFA confirma que las fechas y horarios de cada
            partido se comunicarán a más tardar el sábado 29 de agosto. La Jornada 1 se disputa el 8, 9 y
            10 de septiembre; la Jornada 8, la última de la fase de liga, el 27 y 28 de enero de 2027.
          </P>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 8 }}>
            <a href="#/simulador/cl" style={{ color: C.oro, border: `1px solid ${C.oro}`, borderRadius: 8, padding: "10px 18px", fontSize: 14, fontWeight: 600, fontFamily: OSWALD, textDecoration: "none" }}>Volver al simulador de Champions</a>
          </div>
        </Seccion>

        <footer style={{ borderTop: `1px solid ${C.borde}`, paddingTop: 16, color: "#5A6678", fontSize: 11, lineHeight: 1.6 }}>
          <div>Modo Competición · Procedimiento del sorteo según comunicados oficiales de la UEFA.</div>
          <div style={{ marginTop: 6 }}>
            Modo Competición es un proyecto de Carlos Gil (<a href="https://x.com/CarlosGilAnalis" target="_blank" rel="noopener noreferrer" style={{ color: C.azul }}>@CarlosGilAnalis</a>), en construcción permanente. Si algo no funciona, te falta
            una competición o simplemente tienes una idea mejor que la nuestra, <a href="mailto:feedback@modocompeticion.com" style={{ color: C.azul }}>escríbenos</a>.
          </div>
        </footer>
      </div>
    </div>
  );
}
