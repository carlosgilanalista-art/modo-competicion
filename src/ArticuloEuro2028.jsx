import React from "react";
import useDocumentMeta from "./useDocumentMeta.js";

// ============================================================
// ARTÍCULO — Clasificación EURO 2028: cómo la Nations League
// 2026/27 reparte ya plazas de repesca.
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

export default function ArticuloEuro2028() {
  useDocumentMeta({
    title: "Clasificación EURO 2028: por qué la Nations League ya está repartiendo plazas · Modo Competición",
    description: "Cómo se clasifica para la EURO 2028: 12 grupos, plazas de anfitrión y los tres escenarios de repesca que dependen de la Nations League 2026/27.",
  });

  return (
    <div style={{ minHeight: "100vh", background: C.fondo, fontFamily: "'Inter', sans-serif" }}>
      <div style={{ maxWidth: 820, margin: "0 auto", padding: "0 20px 60px" }}>

        <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 0 0", flexWrap: "wrap", gap: 10 }}>
          <a href="#/" style={{ fontFamily: MONO, color: C.texto, fontSize: 13, letterSpacing: 3, textDecoration: "none" }}>MODO COMPETICIÓN</a>
          <nav style={{ display: "flex", gap: 18, flexWrap: "wrap" }}>
            <a href="#/" style={{ color: C.textoSuave, fontSize: 13, textDecoration: "none" }}>← Inicio</a>
            <a href="#/formato" style={{ color: C.textoSuave, fontSize: 13, textDecoration: "none" }}>Formato: fases previas</a>
            <a href="#/formato-liga" style={{ color: C.textoSuave, fontSize: 13, textDecoration: "none" }}>Formato: liga y eliminatorias</a>
            <a href="#/nations-league" style={{ color: C.textoSuave, fontSize: 13, textDecoration: "none" }}>Nations League 2026/27</a>
            <a href="#/simulador" style={{ color: C.textoSuave, fontSize: 13, textDecoration: "none" }}>Simulador clubes</a>
            <a href="#/simulador-selecciones" style={{ color: C.textoSuave, fontSize: 13, textDecoration: "none" }}>Simulador selecciones</a>
          </nav>
        </header>

        <div style={{ padding: "56px 0 44px" }}>
          <div style={{ fontFamily: MONO, color: C.azul, fontSize: 11, letterSpacing: 3, marginBottom: 10 }}>SELECCIONES · EURO 2028</div>
          <h1 style={{ fontFamily: OSWALD, color: C.texto, fontSize: 38, lineHeight: 1.15, margin: "0 0 14px" }}>
            Clasificación EURO 2028: por qué la Nations League ya está repartiendo plazas
          </h1>
          <p style={{ color: C.textoSuave, fontSize: 16, lineHeight: 1.7, margin: 0 }}>
            La Eurocopa empieza en septiembre de 2026, aunque el primer partido de clasificación sea en marzo de 2027
          </p>
        </div>

        <P>
          Si tienes la Nations League catalogada como el invento para que los amistosos no sean amistosos, mala
          noticia: la edición 2026/27 que arranca el 24 de septiembre es la fase cero de la clasificación para la
          Eurocopa. Y no en sentido poético.
        </P>
        <P>
          Cuando termine la fase de liga, el 17 de noviembre de 2026, la UEFA congela un ranking general
          provisional con las 54 selecciones. Manda la liga en la que juegas: la A ocupa los puestos 1 a 16, la B
          del 17 al 32, la C del 33 al 48 y la D del 49 al 54. Ese ranking hace tres cosas a la vez:
        </P>
        <ul style={{ color: C.textoSuave, fontSize: 15, lineHeight: 1.75, margin: "0 0 14px", maxWidth: 720, paddingLeft: 22 }}>
          <li>reparte los bombos del sorteo de clasificación (6 de diciembre de 2026, en Belfast);</li>
          <li>decide quién entra en la repesca de marzo de 2028;</li>
          <li>es el último criterio de desempate dentro de los grupos de clasificación.</li>
        </ul>
        <P>
          Y se cierra ahí, en noviembre de 2026, con la fase de liga: ni los cuartos de la Liga A de marzo de 2027
          ni la Final a Cuatro de junio lo mueven. Lo que se juega en otoño, se juega entero en otoño. El formato
          completo lo tienes en <a href="#/nations-league" style={{ color: C.azul }}>Nations League</a>.
        </P>

        <Seccion etiqueta="01" titulo="Doce grupos, cuatro anfitriones y ninguna plaza regalada">
          <P>
            La EURO 2028 son 24 selecciones y 9 sedes en Reino Unido e Irlanda. A la clasificación entran 54
            federaciones repartidas en 12 grupos de cuatro o cinco, todos contra todos a ida y vuelta. De ahí
            salen 20 plazas directas: los 12 primeros de grupo y los 8 mejores segundos.
          </P>
          <P>
            Los cuatro anfitriones —Inglaterra, Escocia, Gales y República de Irlanda— juegan la clasificación
            como todo el mundo y se sortean en grupos distintos para no eliminarse entre ellos. La novedad
            respecto a Eurocopas anteriores es que no tienen plaza automática, sino red de seguridad: dos plazas
            reservadas para los dos anfitriones mejor clasificados que no hayan entrado ni como primeros ni como
            mejores segundos. (Irlanda del Norte, que perdió su condición de sede al caerse Casement Park del
            proyecto, no entra en ese reparto.)
          </P>
          <P>
            Con 12 segundos de grupo y 8 plazas directas para ellos, sobran cuatro. Esos cuatro peores segundos
            se van a la repesca, y ahí la Nations League deja de ser un torneo de otoño para convertirse en una
            puerta trasera.
          </P>
        </Seccion>

        <Seccion etiqueta="02" titulo="Los tres escenarios de repesca">
          <P>
            Todo depende de cuántas de las dos plazas de anfitrión acaben usándose. Lo que quede se decide en
            los play-offs de marzo de 2028, y son entre dos y cuatro plazas:
          </P>
          <P>
            Cero plazas de anfitrión usadas → 4 plazas en juego. Ocho equipos, cuatro eliminatorias a ida y
            vuelta. Los cuatro peores segundos son cabezas de serie (juegan la vuelta en casa) y los otros cuatro
            llegan desde la Nations League.
          </P>
          <P>
            Una plaza usada → 3 plazas. Doce equipos, tres sendas, semifinales y final a partido único. Cuatro
            peores segundos y ocho equipos de la Nations League.
          </P>
          <P>
            Dos plazas usadas → 2 plazas. Ocho equipos, dos sendas, también a partido único. Cuatro peores
            segundos y cuatro de la Nations League.
          </P>
          <P>
            Matiz que se le escapa a mucha gente: si un anfitrión rescatado por la plaza reservada era uno de
            esos cuatro peores segundos, su hueco no se pierde, se lo queda la Nations League. De ahí que el
            reparto pueda acabar en 3+5 o 2+6 con dos sendas, y en 3+9 con tres. En las sendas se siembra por
            ranking en cuatro bombos (1 contra 4, 2 contra 3) y el ganador del cruce del Bombo 1 juega la final
            en casa.
          </P>
          <P>
            ¿Y quiénes son "los de la Nations League"? No los mejor clasificados en abstracto: primero, los
            ganadores de grupo de las Ligas A, B y C que no se hayan clasificado ya por la vía normal —doce
            candidatos—, por orden de ranking provisional. Si no salen suficientes, entra el ganador de grupo de
            la Liga D mejor situado (puesto 49) y luego los mejores del ranking que sigan libres.
          </P>
          <P>
            Traducido: ganar tu grupo de la Liga C en otoño de 2026 puede valer un billete a la Eurocopa en marzo
            de 2028 aunque la clasificación te salga rematadamente mal. Es, punto por punto, lo que hizo Georgia
            camino de la EURO 2024.
          </P>
        </Seccion>

        <Seccion etiqueta="03" titulo="Calendario">
          <div style={{ display: "flex", flexDirection: "column", gap: 8, maxWidth: 720, marginBottom: 14 }}>
            {[
              ["24 sept – 17 nov 2026", "fase de liga de la Nations League. Al acabar, ranking provisional cerrado."],
              ["6 dic 2026", "sorteo de la fase de grupos, en Belfast."],
              ["26–30 mar 2027", "jornadas 1 y 2, solo grupos de cinco. En paralelo, cuartos de la Liga A: los clasificados a cuartos caen en grupos de cuatro para tener ese hueco libre."],
              ["11–15 jun 2027", "jornadas 3 y 4 de los grupos de cinco. Del 9 al 13, Final a Cuatro de la Nations League."],
              ["23 sept – 5 oct 2027", "cuatro jornadas seguidas. Aquí empiezan los grupos de cuatro."],
              ["11–16 nov 2027", "dos últimas jornadas. Fin de la fase de grupos, 20 clasificados sobre la mesa."],
              ["23–28 mar 2028", "semifinales y finales de la repesca. Se completan las 24."],
            ].map((fila) => (
              <div key={fila[0]} style={{ display: "flex", gap: 14, alignItems: "baseline", background: C.tarjeta, border: `1px solid ${C.borde}`, borderRadius: 10, padding: "10px 16px" }}>
                <span style={{ fontFamily: MONO, color: C.azul, fontSize: 12, whiteSpace: "nowrap", minWidth: 150 }}>{fila[0]}</span>
                <span style={{ color: C.textoSuave, fontSize: 14, lineHeight: 1.6 }}>{fila[1]}</span>
              </div>
            ))}
          </div>
        </Seccion>

        <Seccion etiqueta="04" titulo="Y mientras tanto">
          <P>
            En Modo Competición puedes simular la fase previa y la fase de liga de las competiciones de clubes;
            la Eurocopa aún no tiene su modo, pero el mapa de cómo se llega hasta ella ya lo tienes aquí.
          </P>
        </Seccion>

        <footer style={{ borderTop: `1px solid ${C.borde}`, paddingTop: 16, color: "#5A6678", fontSize: 11, lineHeight: 1.6 }}>
          <div>Modo Competición · Formato de clasificación de la EURO 2028 según la documentación oficial de la UEFA.</div>
          <div style={{ marginTop: 6 }}>
            Modo Competición es un proyecto de Carlos Gil (<a href="https://x.com/CarlosGilAnalis" target="_blank" rel="noopener noreferrer" style={{ color: C.azul }}>@CarlosGilAnalis</a>), en construcción permanente. Si algo no funciona, te falta
            una competición o simplemente tienes una idea mejor que la nuestra, <a href="mailto:feedback@modocompeticion.com" style={{ color: C.azul }}>escríbenos</a>.
          </div>
        </footer>
      </div>
    </div>
  );
}
