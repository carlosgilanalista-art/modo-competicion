import React from "react";

// ============================================================
// ARTÍCULO — Nations League 2026/27: el mecanismo que reparte
// plazas de repesca para la Eurocopa 2028.
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
function PieGrafico({ children }) {
  return <div style={{ color: "#5A6678", fontSize: 12, marginTop: 8, fontStyle: "italic" }}>{children}</div>;
}

// ---- Gráfico 1: las cuatro ligas y el movimiento entre ellas ----
function GraficoLigas() {
  const ligas = [
    { l: "LIGA A", n: "16 selecciones · 4 grupos de 4", color: C.oro },
    { l: "LIGA B", n: "16 selecciones · 4 grupos de 4", color: C.naranja },
    { l: "LIGA C", n: "16 selecciones · 4 grupos de 4", color: C.azul },
    { l: "LIGA D", n: "6 selecciones · 2 grupos de 3", color: C.verde },
  ];
  return (
    <div style={{ background: C.tarjeta, border: `1px solid ${C.borde}`, borderRadius: 12, padding: "22px 20px", margin: "0 0 14px" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {ligas.map((liga) => (
          <div key={liga.l} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10, background: `${liga.color}18`, border: `1px solid ${liga.color}`, borderRadius: 8, padding: "10px 14px", flexWrap: "wrap" }}>
            <span style={{ fontFamily: MONO, color: liga.color, fontSize: 12, letterSpacing: 1 }}>{liga.l}</span>
            <span style={{ color: C.textoSuave, fontSize: 12 }}>{liga.n}</span>
          </div>
        ))}
      </div>
      <PieGrafico>Ganadores de grupo de B, C y D ascienden; los últimos de cada grupo de A, B y C descienden. En medio, play-offs de ida y vuelta entre 3ºs y 2ºs de la liga contigua.</PieGrafico>
    </div>
  );
}

// ---- Gráfico 2: el camino de la repesca de la Euro 2028 ----
function GraficoRepesca() {
  const pasos = [
    { icono: "🥈", texto: "20 plazas directas: 12 primeros de grupo + 8 mejores segundos de la clasificación tradicional." },
    { icono: "🏟️", texto: "2 plazas reservadas a las mejores anfitrionas (Reino Unido e Irlanda) si no se clasifican por la vía normal." },
    { icono: "🎟️", texto: "Entre 2 y 4 plazas de repesca en marzo de 2028: 8 equipos, 4 eliminatorias a doble partido." },
    { icono: "🔑", texto: "4 de esos 8 llegan por la Nations League: los ganadores de grupo mejor situados en la general 2026/27 que no se hayan clasificado ya." },
  ];
  return (
    <div style={{ background: C.tarjeta, border: `1px solid ${C.borde}`, borderRadius: 12, padding: 20, margin: "0 0 14px" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {pasos.map((p, i) => (
          <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start", background: C.fondo, border: `1px solid ${C.borde}`, borderRadius: 10, padding: "12px 16px" }}>
            <span style={{ fontSize: 18 }}>{p.icono}</span>
            <span style={{ color: C.textoSuave, fontSize: 14, lineHeight: 1.6 }}>{p.texto}</span>
          </div>
        ))}
      </div>
      <PieGrafico>Ganar tu grupo de Nations League —da igual la liga— y fallar después en la clasificación tradicional puede colarte por esta puerta trasera a la Eurocopa.</PieGrafico>
    </div>
  );
}

// ---- Gráfico 3: precedentes de la vía Nations League ----
function GraficoPrecedentes() {
  const casos = [
    { equipo: "Macedonia del Norte", euro: "Euro 2020", nota: "Ganó su grupo de Liga D. Venció la final de repesca a Georgia (1-0, gol de Pandev)." },
    { equipo: "Georgia", euro: "Euro 2024", nota: "Quedó 4ª en su grupo de clasificación pero había ganado su grupo de Liga C. Llegó a octavos." },
  ];
  return (
    <div style={{ background: C.tarjeta, border: `1px solid ${C.borde}`, borderRadius: 12, padding: 20, margin: "0 0 14px", overflowX: "auto" }}>
      <table style={{ borderCollapse: "collapse", width: "100%", minWidth: 460 }}>
        <thead>
          <tr>
            {["Selección", "Torneo", "Cómo llegó"].map((h) => (
              <th key={h} style={{ textAlign: "left", fontFamily: MONO, color: C.azul, fontSize: 11, letterSpacing: 2, padding: "6px 12px 10px", borderBottom: `1px solid ${C.borde}` }}>{h.toUpperCase()}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {casos.map((c) => (
            <tr key={c.equipo}>
              <td style={{ color: C.texto, fontSize: 14, padding: "9px 12px", borderBottom: `1px solid ${C.borde}`, whiteSpace: "nowrap" }}>{c.equipo}</td>
              <td style={{ color: C.textoSuave, fontSize: 14, padding: "9px 12px", borderBottom: `1px solid ${C.borde}`, whiteSpace: "nowrap" }}>{c.euro}</td>
              <td style={{ color: C.textoSuave, fontSize: 14, padding: "9px 12px", borderBottom: `1px solid ${C.borde}` }}>{c.nota}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <PieGrafico>También llegaron por esta vía Hungría, Eslovaquia y Escocia (Euro 2020) y Ucrania (Euro 2024): cuatro plazas de Eurocopa ya decididas por este mecanismo en dos ediciones.</PieGrafico>
    </div>
  );
}

export default function ArticuloNationsLeague() {
  return (
    <div style={{ minHeight: "100vh", background: C.fondo, fontFamily: "'Inter', sans-serif" }}>
      <div style={{ maxWidth: 820, margin: "0 auto", padding: "0 20px 60px" }}>

        <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 0 0", flexWrap: "wrap", gap: 10 }}>
          <a href="#/" style={{ fontFamily: MONO, color: C.texto, fontSize: 13, letterSpacing: 3, textDecoration: "none" }}>MODO COMPETICIÓN</a>
          <nav style={{ display: "flex", gap: 18, flexWrap: "wrap" }}>
            <a href="#/" style={{ color: C.textoSuave, fontSize: 13, textDecoration: "none" }}>← Inicio</a>
            <a href="#/formato" style={{ color: C.textoSuave, fontSize: 13, textDecoration: "none" }}>Formato: fases previas</a>
            <a href="#/formato-liga" style={{ color: C.textoSuave, fontSize: 13, textDecoration: "none" }}>Formato: liga y eliminatorias</a>
            <a href="#/simulador" style={{ color: C.textoSuave, fontSize: 13, textDecoration: "none" }}>Simulador clubes</a>
            <a href="#/simulador-selecciones" style={{ color: C.textoSuave, fontSize: 13, textDecoration: "none" }}>Simulador selecciones</a>
          </nav>
        </header>

        <div style={{ padding: "56px 0 44px" }}>
          <div style={{ fontFamily: MONO, color: C.azul, fontSize: 11, letterSpacing: 3, marginBottom: 10 }}>SELECCIONES · NATIONS LEAGUE 2026/27</div>
          <h1 style={{ fontFamily: OSWALD, color: C.texto, fontSize: 38, lineHeight: 1.15, margin: "0 0 14px" }}>
            Nations League 2026/27: el torneo que decide media Eurocopa 2028 (y casi nadie entiende)
          </h1>
          <p style={{ color: C.textoSuave, fontSize: 16, lineHeight: 1.7, margin: 0 }}>
            La Nations League 2026/27 no es solo ascensos y descensos: reparte plazas de repesca para la
            Euro 2028. Te contamos el mecanismo y qué se juega España.
          </p>
        </div>

        <Seccion etiqueta="01" titulo="El formato: cuatro ligas, un embudo de coeficientes… no">
          <P>
            Primero lo básico, porque hace falta para todo lo demás. La Nations League 2026/27 tiene cuatro
            ligas: A, B y C con 16 selecciones cada una (4 grupos de 4, 6 partidos por equipo), y D con 6
            selecciones (2 grupos de 3, 4 partidos). En total, 54 selecciones — Rusia sigue fuera, suspendida.
          </P>
          <GraficoLigas />
          <P>
            El movimiento entre ligas es directo y sin ambigüedad en los extremos: los 4 ganadores de grupo
            de B suben a A, los de C suben a B, los 2 de D suben a C. Por abajo, los cuartos de cada grupo de
            A bajan a B, los de B bajan a C, y los dos peores cuartos de C bajan a D. En medio hay play-offs
            de ida y vuelta (3º de A contra 2º de B, 3º de B contra 2º de C, en marzo de 2027) donde el peor
            clasificado juega la ida en casa.
          </P>
          <P>
            La Liga A añade una fase final: los dos primeros de cada grupo (8 equipos) juegan unos cuartos a
            doble partido en marzo de 2027 —el ganador de grupo es cabeza de serie y decide en casa— y los
            cuatro que pasan van a la Final a Cuatro.
          </P>
          <Destacado>
            Los bombos de esta edición no salen del coeficiente UEFA de selecciones, sino de la clasificación
            general de la Nations League 2024/25 — por eso España comparte bombo con Portugal o Francia y no
            con, por ejemplo, Croacia. El formato 2026/27 es idéntico al de 2024/25: el rediseño de verdad
            —tres ligas de 18 equipos en sistema suizo— llega en 2028/29 y no afecta a nada de esto.
          </Destacado>
        </Seccion>

        <Seccion etiqueta="02" titulo="El mecanismo que de verdad importa: cómo esto compra billetes para la Euro 2028">
          <P>
            Aquí está el motivo por el que merece la pena prestar atención a esto más allá del morbo de ver a
            España-Croacia en octubre. UEFA aprobó el 21 de mayo de 2025 un sistema que conecta directamente
            la Nations League con la repesca de la Eurocopa 2028 (Reino Unido e Irlanda).
          </P>
          <GraficoRepesca />
          <P>
            ¿Y quiénes son esos cuatro? Aquí está la clave que casi nadie explica bien: las plazas de repesca
            vía Nations League se asignan a los ganadores de grupo que no se hayan clasificado ya por la vía
            tradicional, ordenados por su posición en la clasificación general de esta edición 2026/27.
            Traducido: si ganas tu grupo de Nations League —da igual que sea de Liga A o de Liga D— y luego
            fallas en la clasificación normal a la Euro, puedes colarte por esta puerta trasera.
          </P>
        </Seccion>

        <Seccion etiqueta="03" titulo="Esto no es teoría: ya ha pasado, dos veces">
          <P>
            Y ha pasado con resultado de escándalo positivo:
          </P>
          <GraficoPrecedentes />
          <P>
            Macedonia del Norte era el ranking FIFA 65 del mundo y jugaba su primer gran torneo en 27 años. El
            debate que generó —¿premia el sistema demasiado a un nivel muy inferior?— sigue vivo. Georgia,
            por su parte, llegó a octavos de la Euro 2024 ganando 2-0 a Portugal.
          </P>
        </Seccion>

        <Seccion etiqueta="04" titulo="Caso España: qué se juega el A3">
          <P>
            España cae en el Grupo A3 de Liga A junto a Croacia, Inglaterra y Chequia. Para una selección que
            ya tiene sitio asegurado en cualquier clasificación a la Euro por la vía tradicional, ¿qué
            sentido tiene esto más allá del prestigio?
          </P>
          <P>
            Dos cosas, y ninguna es menor. La primera es deportiva pura: ganar el grupo (o al menos meterse
            entre los dos primeros) da acceso a los cuartos de Liga A en marzo de 2027 y, con ello, a pelear
            por la Final a Cuatro de junio de 2027 — el único título real que hay en juego esta edición, con
            premios de hasta 10,5 millones de euros para el campeón según el modelo de la última convocatoria.
          </P>
          <P>
            La segunda es posicional: la clasificación general de esta Nations League es la que define los
            bombos de futuras convocatorias y, a partir de 2028/29, el nivel asignado en el nuevo sistema de
            tres ligas. Para España, jugar bien el A3 no cambia su camino a la Euro 2028 —entrará por la vía
            normal—, pero sí pesa en cómo se la sitúa en el ecosistema europeo de aquí en adelante. Es la
            diferencia entre jugar por el escaparate y jugar porque hace falta, y aun así el partido importa.
          </P>
        </Seccion>

        <Seccion etiqueta="05" titulo="Caso equipo modesto: la otra Nations League, la que sí aprieta">
          <P>
            Bajemos del A3 a algo con más tensión real de descenso y de vía de escape. Fijaos en Georgia, en
            Liga B esta temporada, en un grupo con Hungría, Ucrania e Irlanda del Norte. Para Georgia esta
            Nations League no es un torneo de relleno: es la posibilidad de repetir exactamente el camino que
            la llevó a la Euro 2024 —ganar el grupo, o al menos quedar bien posicionada, para volver a
            colarse por la repesca si la clasificación tradicional a la Euro 2028 se le vuelve a complicar.
          </P>
          <P>
            Y en el otro extremo del sistema, en Liga D, están selecciones como las del Grupo D1 (Gibraltar,
            Malta, Andorra), donde lo que se juega no es gloria continental sino dinero y calendario
            competitivo: descender reduce el pago base de la siguiente edición y, aunque en Liga D nunca ha
            habido bonos de Final a Cuatro, ganar el grupo sí es la puerta —remota pero real, como demostró
            Macedonia del Norte— hacia una repesca de Eurocopa. Para un equipo de este nivel, ganar un grupo
            de Liga D no es un dato de relleno: es, literalmente, la vía más corta que existe hacia un gran
            torneo.
          </P>
        </Seccion>

        <Seccion etiqueta="06" titulo="El calendario 2026/27, de un vistazo">
          <div style={{ display: "flex", flexDirection: "column", gap: 8, maxWidth: 720, marginBottom: 14 }}>
            {[
              ["12 feb 2026", "Bruselas: sorteo de la fase de liga."],
              ["24 sep – 17 nov 2026", "Fase de liga, 6 jornadas."],
              ["25-30 mar 2027", "Cuartos de Liga A (ida y vuelta) y play-offs de ascenso/descenso A/B y B/C, en la misma ventana."],
              ["9-13 jun 2027", "Final a Cuatro (semifinales el 9-10, tercer puesto y final el 13). Sede pendiente de confirmación."],
              ["23-28 mar 2028", "Play-offs de ascenso/descenso C/D."],
              ["mar 2028", "Repesca de la Euro 2028, con los billetes que reparte este mecanismo."],
            ].map((fila) => (
              <div key={fila[0]} style={{ display: "flex", gap: 14, alignItems: "baseline", background: C.tarjeta, border: `1px solid ${C.borde}`, borderRadius: 10, padding: "10px 16px" }}>
                <span style={{ fontFamily: MONO, color: C.azul, fontSize: 12, whiteSpace: "nowrap", minWidth: 150 }}>{fila[0]}</span>
                <span style={{ color: C.textoSuave, fontSize: 14, lineHeight: 1.6 }}>{fila[1]}</span>
              </div>
            ))}
          </div>
        </Seccion>

        <Seccion etiqueta="07" titulo="Qué mirar esta temporada">
          <P>
            Si solo vas a seguir un hilo de toda esta madeja, que sea este: quién gana cada grupo de Liga B,
            C y D sin tener ya plaza asegurada en la Euro 2028 por la vía normal. Esos son los nombres que en
            marzo de 2028 pueden aparecer en una repesca que decide una Eurocopa entera. España se juega
            prestigio y bombos futuros en el A3; selecciones como Georgia se juegan, literalmente, una puerta
            a un torneo grande que de otra forma no verían. La Nations League no ha dejado de ser lo que era.
            Ha añadido una segunda vida por debajo, y esa es la parte que de verdad merece que le prestes
            atención.
          </P>
          <P>
            ¿Quieres verlo aplicado a fase previa y fase de liga de las competiciones de clubes? Ya tienes{" "}
            <a href="#/formato" style={{ color: C.azul }}>el camino largo de la fase previa</a> y{" "}
            <a href="#/formato-liga" style={{ color: C.azul }}>cómo funciona la fase de liga y las eliminatorias</a>{" "}
            explicados con el mismo detalle. 🟢🟠
          </P>
        </Seccion>

        <footer style={{ borderTop: `1px solid ${C.borde}`, paddingTop: 16, color: "#5A6678", fontSize: 11, lineHeight: 1.6 }}>
          <div>Modo Competición · Mecanismo de repesca aprobado por la UEFA el 21 de mayo de 2025; formato de la Nations League según la documentación oficial de la UEFA.</div>
          <div style={{ marginTop: 6 }}>
            Modo Competición es un proyecto de Carlos Gil (<a href="https://x.com/CarlosGilAnalis" target="_blank" rel="noopener noreferrer" style={{ color: C.azul }}>@CarlosGilAnalis</a>), en construcción permanente. Si algo no funciona, te falta
            una competición o simplemente tienes una idea mejor que la nuestra, <a href="mailto:feedback@modocompeticion.com" style={{ color: C.azul }}>escríbenos</a>.
          </div>
        </footer>
      </div>
    </div>
  );
}
