import React from "react";
import useDocumentMeta from "./useDocumentMeta.js";
import { CALENDARIO, PREVIA_EQUIPOS, PREVIA_ELIMINATORIAS, PRIMERA_CON_PRIMERA } from "./data/copaDelRey2026.js";

// ============================================================
// ARTÍCULO — Copa del Rey 2026/27: formato, quién entra y la previa.
// Texto del borrador del 26/10/2026, transcrito sin reescribir.
// Los datos de las cuatro tablas/listas viven en src/data/copaDelRey2026.js
// (fuente única). Estructura calcada de ArticuloCopaIntercontinental.jsx. Sin simulador.
// ============================================================
const C = {
  fondo: "#0A0E17", tarjeta: "#101827", borde: "#1E2A3C",
  texto: "#F4F1E8", textoSuave: "#8A97A8",
  oro: "#D4A94C", naranja: "#E8734A", azul: "#4A90D4", verde: "#5BBB7B",
};
const MONO = "'JetBrains Mono', monospace";
const OSWALD = "'Oswald', sans-serif";

function Seccion({ titulo, children }) {
  return (
    <section style={{ marginBottom: 52 }}>
      <h2 style={{ fontFamily: OSWALD, color: C.texto, fontSize: 25, margin: "0 0 14px" }}>{titulo}</h2>
      {children}
    </section>
  );
}
function H3({ children }) {
  return <h3 style={{ fontFamily: OSWALD, color: C.texto, fontSize: 19, margin: "28px 0 12px" }}>{children}</h3>;
}
function P({ children }) {
  return <p style={{ color: C.textoSuave, fontSize: 15, lineHeight: 1.75, margin: "0 0 14px", maxWidth: 720 }}>{children}</p>;
}
// Párrafo en cursiva: notas al pie de tabla y de sección del borrador.
function Nota({ children }) {
  return <p style={{ color: C.textoSuave, fontSize: 15, lineHeight: 1.75, margin: "0 0 14px", maxWidth: 720, fontStyle: "italic" }}>{children}</p>;
}
function B({ children }) {
  return <strong style={{ color: C.texto, fontWeight: 600 }}>{children}</strong>;
}
function Lista({ children }) {
  return <ul style={{ color: C.textoSuave, fontSize: 15, lineHeight: 1.75, margin: "0 0 14px", maxWidth: 720, paddingLeft: 22 }}>{children}</ul>;
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
                <td key={iCelda} style={{ color: iCelda === 0 ? C.texto : C.textoSuave, fontSize: 14, padding: "9px 12px", borderBottom: `1px solid ${C.borde}` }}>{celda}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function ArticuloCopaDelRey() {
  useDocumentMeta({
    title: "Copa del Rey 2026/27: cómo funciona, quién entra y qué ha pasado ya en la previa · Modo Competición",
    description: "Copa del Rey 2026/27: formato, quién entra en cada ronda, calendario y resultados de la previa. Primera eliminatoria del 27 al 29 de octubre.",
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
          <h1 style={{ fontFamily: OSWALD, color: C.texto, fontSize: 38, lineHeight: 1.15, margin: 0 }}>
            Copa del Rey 2026/27: cómo funciona, quién entra y qué ha pasado ya en la previa
          </h1>
        </div>

        <P>
          La Copa del Rey tiene una virtud: en una misma ronda se juntan equipos de Primera con equipos de categorías territoriales. Esta semana empieza la parte seria, y conviene saber cómo se llega hasta aquí.
        </P>

        <Seccion titulo="Cómo es el torneo">
          <P>
            Una sola competición, siete eliminatorias y una final. Casi todo se juega a partido único: el que gana pasa, y si hay empate, prórroga y penaltis. Hay dos excepciones, y las dos son a doble partido: la previa y las semifinales. Y en ninguna de las dos los goles fuera de casa valen doble. En la previa de este año lo vimos: el Tavernes y el Maracena empataron 1-1 en la ida, 0-0 en la vuelta y lo resolvieron en los penaltis.
          </P>
          <Tabla
            cabeceras={["Ronda", "Cuándo", "Formato"]}
            filas={CALENDARIO.map((r) => [r.ronda, r.cuando, r.formato])}
            anchoMin={560}
          />
          <Nota>
            Las fechas de la segunda eliminatoria en adelante son las que recoge la prensa a partir del calendario de la RFEF. Cuando la federación las confirme, se actualizan aquí.
          </Nota>
        </Seccion>

        <Seccion titulo="Quién entra y cuándo">
          <P>Hay 126 equipos inscritos. No entran todos a la vez:</P>
          <Lista>
            <li><B>Previa:</B> 20 equipos de categorías territoriales: uno por federación autonómica y dos en el caso de Andalucía. Cada federación decide en sus bases cómo elige al suyo. Pasan 10.</li>
            <li>
              <B>Primera eliminatoria:</B> 112 equipos, en 56 cruces.
              <ul style={{ margin: "4px 0 0", paddingLeft: 22 }}>
                <li>16 de Primera</li>
                <li>20 de Segunda</li>
                <li>21 de Primera Federación</li>
                <li>32 de Segunda Federación</li>
                <li>9 de Tercera Federación</li>
                <li>4 de la Copa Federación</li>
                <li>10 de la previa</li>
              </ul>
            </li>
            <li><B>Dieciseisavos:</B> entran Barcelona, Real Madrid, Real Sociedad y Atlético de Madrid, que juegan la Supercopa. Se saltan tres eliminatorias. No es un privilegio de nadie, es calendario.</li>
          </Lista>
          <P>
            Las cuentas, para que nadie dude: 112 + 4 son los 116 equipos que siguen en competición tras la previa, y con los 10 eliminados de la previa salen los 126 inscritos. La aritmética a partir de ahí es mecánica: 56 ganadores, 28 cruces en la segunda, 32 equipos en dieciseisavos.
          </P>
        </Seccion>

        <Seccion titulo="Cómo se llega a la previa desde cada comunidad">
          <P>
            La RFEF no impone una vía única. Las bases le piden a cada federación autonómica que designe a su representante según sus propias bases y que lo comunique con 15 días de antelación al sorteo. Además, el club tiene que jugar solo competición territorial en 2026/27. Resultado: cada comunidad lo resuelve a su manera, con una copa, una supercopa, una liguilla o una eliminatoria.
          </P>
          <P>La previa se sortea por zonas geográficas, en cuatro grupos, y por eso los cruces son entre vecinos:</P>
          <Lista>
            <li><B>Grupo A:</B> Asturias, Cantabria, Castilla y León, Galicia, País Vasco y La Rioja.</li>
            <li><B>Grupo B:</B> Aragón, Baleares, Cataluña y Navarra.</li>
            <li><B>Grupo C:</B> Andalucía (dos plazas), Ceuta, Comunitat Valenciana, Melilla y Murcia.</li>
            <li><B>Grupo D:</B> Canarias, Castilla-La Mancha, Madrid y Extremadura.</li>
          </Lista>
          <Tabla
            cabeceras={["Comunidad", "Equipo", "Cómo se clasificó", "Fiabilidad"]}
            filas={PREVIA_EQUIPOS.map((e) => [e.comunidad, e.equipo, e.via, e.fiabilidad])}
            anchoMin={900}
          />
          <p style={{ color: C.textoSuave, fontSize: 13, lineHeight: 1.6, margin: "0 0 14px", maxWidth: 720 }}>
            🟢 confirmado en fuente oficial · 🟡 probable (prensa y notas de federaciones, no todas abiertas) · 🔴 sin verificar
          </p>
          <P>
            Un detalle que sale al cruzar los datos: los diez emparejamientos de la previa respetan esos cuatro grupos sin excepción. Es la comprobación que nos dice que la asignación de equipos a comunidades no está mal.
          </P>
          <Nota>
            Las bases de la RFEF dicen a la vez que la previa es a partido único (art. 7.G) y a ida y vuelta (art. 10.A). Se jugó a doble partido, así que ha prevalecido el segundo.
          </Nota>
        </Seccion>

        <Seccion titulo="Las reglas que más importan">
          <P>
            <B>Quién juega en casa.</B> Juega en casa el de categoría inferior, siempre que su campo cumpla los requisitos mínimos de la RFEF. Si son de la misma categoría, es local el club cuya bola salga primero en el sorteo.
          </P>
          <P>
            <B>Cruces por proximidad.</B> Los 112 se reparten en cuatro grupos geográficos para el sorteo. De ahí salen derbis como el Xerez–Cádiz, el Manresa–Sant Andreu o el Arosa–Pontevedra.
          </P>
          <P>
            <B>Semifinales a doble partido.</B> Es el único momento en el que la Copa se parece a otras copas europeas. Hasta entonces, un día malo se paga con la eliminación.
          </P>
        </Seccion>

        <Seccion titulo="La previa, ya cerrada">
          <P>Veinte equipos territoriales, diez billetes. Así han quedado, con el global entre paréntesis:</P>
          <Tabla
            cabeceras={["Eliminatoria", "Global", "Pasa"]}
            filas={PREVIA_ELIMINATORIAS.map((e) => [
              e.eliminatoria,
              e.penaltis ? `${e.global} (${e.penaltis} en penaltis)` : e.global,
              <B key="pasa">{e.pasa}</B>,
            ])}
            anchoMin={620}
          />
          <P>
            El Pinatar firmó la mayor goleada de la previa: 8-0 en la ida y 3-0 en la vuelta. El resultado más cerrado fue el de Tavernes, que necesitó los penaltis.
          </P>

          <H3>El único cruce con historia aparte: Güímar–Hortaleza</H3>
          <P>
            La vuelta se tenía que jugar el 4 de octubre en Tasagaya, pero se suspendió antes de empezar: el Hortaleza se negó a jugar tras los incidentes que se vivieron antes del partido. La RFEF resolvió que la negativa estaba justificada, que no era incomparecencia y que el Güímar tampoco debía darse por perdedor. El partido se repitió el 11 de octubre en El Peñón (Puerto de la Cruz), a puerta cerrada. Terminó 3-3, y el global le da el pase al Hortaleza, que se medirá al Sevilla.
          </P>
          <P>
            Dos cautelas: el marcador y el pase salen de la información de resultados y de la prensa local; todavía no he leído el acta de la RFEF. Y el procedimiento disciplinario extraordinario que la federación abrió por los incidentes sigue pendiente de resolución.
          </P>

          <H3>El Prat, a por el Athletic</H3>
          <P>
            La vuelta del Prat contra el San Rafael se aplazó por el temporal y se jugó el 11 de octubre. Un 5-0 que, sumado al 1-5 de la ida, deja un global de 10 goles a 1. El premio: recibir al Athletic el jueves 29 (el sorteo se hizo con la eliminatoria todavía sin resolver).
          </P>
        </Seccion>

        <Seccion titulo="Lo que viene esta semana">
          <P>Diez cruces con un Primera enfrente:</P>
          <Lista>
            {PRIMERA_CON_PRIMERA.map((c) => (
              <li key={`${c.local}-${c.visitante}`}><B>{c.local} – {c.visitante}</B> ({c.dia}, {c.hora})</li>
            ))}
          </Lista>
          <P>
            El resto de los 56 cruces son entre equipos de distintas categorías, con el de inferior en casa. Empieza el martes a las 18:30 con el Cuarte–Girona.
          </P>
        </Seccion>

        <Seccion titulo="Lo que todavía no sabemos">
          <Lista>
            <li>Fechas de octavos y cuartos (hay una fuente que habla del 6 y del 13 de enero, sin confirmar).</li>
            <li>Sede de la final.</li>
            <li>Fecha del sorteo de la segunda eliminatoria.</li>
            <li>Acta definitiva del Güímar–Hortaleza.</li>
            <li>Cómo se clasificó el AE Prat, y confirmación oficial de la vía de la mayoría de las comunidades.</li>
          </Lista>
        </Seccion>

        <footer style={{ borderTop: `1px solid ${C.borde}`, paddingTop: 16, color: "#5A6678", fontSize: 11, lineHeight: 1.6 }}>
          <div>
            Modo Competición es un proyecto de Carlos Gil (<a href="https://x.com/CarlosGilAnalis" target="_blank" rel="noopener noreferrer" style={{ color: C.azul }}>@CarlosGilAnalis</a>), en construcción permanente. Si algo no funciona, te falta
            una competición o simplemente tienes una idea mejor que la nuestra, <a href="mailto:feedback@modocompeticion.com" style={{ color: C.azul }}>escríbenos</a>.
          </div>
        </footer>
      </div>
    </div>
  );
}
