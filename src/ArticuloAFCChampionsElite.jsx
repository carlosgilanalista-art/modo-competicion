import React from "react";
import useDocumentMeta from "./useDocumentMeta.js";

// ============================================================
// ARTÍCULO — AFC Champions League Elite 2026/27: la expansión
// de 24 a 32 equipos, el formato de dos regiones y el play-off
// aprobado pero aplazado.
// Primera competición no UEFA del sitio.
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

const PLAZAS_OESTE = [
  ["Arabia Saudí", "3", "2"],
  ["Emiratos Árabes Unidos", "3", "1"],
  ["Catar", "3", "0"],
  ["Irán", "2", "0"],
  ["Uzbekistán", "1", "1"],
  ["Irak", "1", "0"],
  ["Jordania", "0", "1"],
];

const PLAZAS_ESTE = [
  ["Japón", "3", "2"],
  ["Corea del Sur", "3", "1"],
  ["Tailandia", "3", "0"],
  ["China", "2", "0"],
  ["Australia", "1", "1"],
  ["Malasia", "1", "0"],
  ["Vietnam", "0", "1"],
];

const FASE_PREVIA = [
  ["Oeste", "Pakhtakor – Al-Hussein Irbid", "Taskent"],
  ["Oeste", "Al Jazira – Al-Ittihad", "Abu Dabi"],
  ["Este", "Gangwon FC – Gamba Osaka", "Gangneung"],
  ["Este", "Adelaide United – Công An Hà Nội", "Adelaida"],
];

const CALENDARIO = [
  ["1", "14–15 sep 2026", "15–16 sep 2026"],
  ["2", "12–13 oct", "13–14 oct"],
  ["3", "26–27 oct", "27–28 oct"],
  ["4", "2–3 nov", "3–4 nov"],
  ["5", "23–24 nov", "24–25 nov"],
  ["6", "7–8 dic", "1–2 dic"],
  ["7", "8–9 feb 2027", "9–10 feb 2027"],
  ["8", "15–16 feb", "16–17 feb"],
];

export default function ArticuloAFCChampionsElite() {
  useDocumentMeta({
    title: "De 24 a 32: así funciona la AFC Champions League Elite 2026/27 · Modo Competición",
    description: "La Champions asiática estrena el formato más grande de su historia reciente: ocho equipos más, dos ligas paralelas por región, un sorteo que lo condiciona todo y un play-off aprobado y aplazado.",
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
          <div style={{ fontFamily: MONO, color: C.azul, fontSize: 11, letterSpacing: 3, marginBottom: 10 }}>CLUBES · AFC CHAMPIONS LEAGUE ELITE 2026/27</div>
          <h1 style={{ fontFamily: OSWALD, color: C.texto, fontSize: 38, lineHeight: 1.15, margin: "0 0 14px" }}>
            De 24 a 32: así funciona la AFC Champions League Elite 2026/27
          </h1>
          <p style={{ color: C.texto, fontSize: 16, lineHeight: 1.7, margin: 0, fontWeight: 500 }}>
            La Champions asiática estrena esta temporada el formato más grande de su historia reciente. Ocho
            equipos más, dos ligas paralelas, un sorteo que lo condiciona todo y un play-off que la AFC ha
            aprobado… y aplazado. Te lo desmontamos pieza a pieza antes de que el 18 de agosto se llene el bombo.
          </p>
        </div>

        <P>
          Hay competiciones que cambian de formato cada dos por tres y competiciones que llevan una década
          igual. La Champions asiática pertenece al primer grupo con entusiasmo. En 2024/25 se reinventó
          entera: cambió de nombre (adiós AFC Champions League, hola <B>AFC Champions League Elite</B>), se
          cargó la fase de grupos de toda la vida y adoptó un sistema de liga suiza partido en dos mitades
          geográficas. Pasó de 40 equipos a 24 de un tijeretazo.
        </P>
        <P>
          Dos temporadas después, la AFC ha decidido que se pasó de frenada. El 24 de abril de 2026, su Comité
          de Fútbol Profesional adoptó la recomendación que el Comité de Competiciones había lanzado diez días
          antes: <B>la fase de liga pasa de 24 a 32 equipos</B>. Es la primera vez desde 2019 que el cuadro
          principal de la máxima competición asiática vuelve a tener 32 clubes.
        </P>
        <P>Vamos con el desmontaje.</P>

        <Seccion etiqueta="01" titulo="La foto general">
          <P>
            Lo primero que hay que entender, y que descoloca a cualquiera que venga del fútbol europeo:{" "}
            <B>en la Champions asiática no hay una competición, hay dos</B>.
          </P>
          <P>
            La AFC divide a sus federaciones en <B>Región Oeste</B> (Golfo, Irán, Asia Central, Irak, Jordania)
            y <B>Región Este</B> (Japón, Corea, China, Sudeste Asiático, Australia). Y no se mezclan. Cada
            región tiene su propia tabla, su propio calendario y sus propios clasificados. Un Al-Hilal y un
            Vissel Kobe no pueden cruzarse hasta la fase final, y eso si los dos llegan.
          </P>
          <P>
            El motivo no es caprichoso: es geografía. Un Melbourne–Yeda son doce mil kilómetros y ocho husos
            horarios. Partir la competición en dos es la única manera de que un calendario de ocho jornadas no
            destroce a las plantillas.
          </P>
          <P>Así que la aritmética de 2026/27 queda así:</P>
          <Lista>
            <li><B>32 equipos en la fase de liga</B>: 16 en el Oeste, 16 en el Este.</li>
            <li><B>36 clubes implicados en total</B>: los 32 anteriores más los 4 que caerán en la fase previa.</li>
            <li><B>14 federaciones representadas</B>, siete por región. En las dos temporadas anteriores eran doce.</li>
          </Lista>
          <P>
            Ese último dato es el que explica de verdad la reforma. La poda de 2024/25 dejó fuera del cuadro
            principal a media Asia. La expansión devuelve representación: <B>Jordania y Vietnam</B> aparecen
            por primera vez en este ciclo, y <B>Tailandia</B> sube a tres plazas directas.
          </P>
        </Seccion>

        <Seccion etiqueta="02" titulo="Quién entra y por qué vía">
          <P>
            Las plazas se reparten según el <B>ranking de competiciones de clubes de la AFC</B>, que mide el
            rendimiento continental de cada federación. No es un coeficiente por club como el de la UEFA: aquí
            lo que puntúa es la federación, y ella reparte internamente.
          </P>

          <Subtitulo>REGIÓN OESTE</Subtitulo>
          <Tabla cabeceras={["Federación", "Fase de liga", "Fase previa"]} filas={PLAZAS_OESTE} />

          <Subtitulo>REGIÓN ESTE</Subtitulo>
          <Tabla cabeceras={["Federación", "Fase de liga", "Fase previa"]} filas={PLAZAS_ESTE} />

          <P>
            Trece plazas directas por región. Y aquí viene el primer detalle fino: <B>trece más los dos
            ganadores de la previa son quince, no dieciséis</B>. Falta una.
          </P>
          <P>
            La respuesta está en que cada región tiene <B>cinco plazas indirectas</B> —las de la columna de la
            derecha— pero solo cuatro clubes juegan la previa. El quinto se queda mirando y entra directo en la
            fase de liga, porque no hay equipos suficientes para completar el cuadro. Es un pase gratis que
            este año, salvo sorpresa, se llevan <B>Al-Qadsiah</B> en el Oeste y <B>Kyoto Sanga</B> en el Este.
            Trece directos, más uno de regalo, más dos supervivientes de la previa: dieciséis.
          </P>
        </Seccion>

        <Seccion etiqueta="03" titulo="La fase previa: un solo partido, el 11 de agosto">
          <P>
            Nada de ida y vuelta. <B>Cuatro eliminatorias a partido único</B>, todas el mismo día:
          </P>
          <Tabla cabeceras={["Región", "Partido", "Sede"]} filas={FASE_PREVIA} anchoMin={460} />
          <P>
            Noventa minutos, prórroga y penaltis si hace falta, y a casa. Ochenta millones de presupuesto y una
            temporada entera de trabajo doméstico dependiendo de una tarde.
          </P>
          <P>
            Bueno, no del todo: <B>los cuatro perdedores no quedan eliminados</B>. Caen directamente a la fase
            de grupos de la <B>AFC Champions League Two</B>, la segunda competición continental. Es una red de
            seguridad que la UEFA aplica en su Europa League y que aquí funciona igual. Consuelo relativo para
            un Al-Ittihad, campeón asiático en 2004 y 2005, que se juega su temporada continental a un partido
            en Abu Dabi.
          </P>
        </Seccion>

        <Seccion etiqueta="04" titulo="La fase de liga: ocho jornadas y un sorteo que lo decide todo">
          <P>
            Aquí es donde el formato se parece a lo que ya conoces. Cada equipo juega <B>ocho partidos contra
            ocho rivales distintos</B>, cuatro en casa y cuatro fuera. No hay grupos: hay <B>una tabla única de
            16 equipos por región</B>. Tres puntos la victoria, uno el empate.
          </P>
          <P>
            Una sola restricción de sorteo: <B>no pueden emparejarse equipos de la misma federación</B>. Nada
            de derbis saudíes o japoneses en la fase regular.
          </P>
          <P>
            <B>Clasifican los ocho primeros de cada región.</B> Dieciséis en total a octavos.
          </P>
          <P>
            Y conviene detenerse en lo que eso significa. En la Champions europea, terminar decimosexto no te
            elimina: te manda a un play-off. <B>Aquí, ser noveno es estar fuera.</B> De dieciséis a ocho, sin
            red, sin repesca, sin segunda oportunidad. Es el corte más brutal de las tres grandes competiciones
            continentales.
          </P>
          <P>
            El sorteo se celebra el <B>18 de agosto en Kuala Lumpur</B>, a las 12:30 hora local, después del de
            la ACL Two. Y en un sistema donde solo te mides a ocho de tus quince rivales potenciales, el bombo
            pesa muchísimo: un calendario blando puede meter en octavos a un equipo que en una liga completa
            nunca llegaría.
          </P>
          <P>
            El calendario previsto arranca a mediados de septiembre y se extiende hasta mediados de febrero,
            con un parón largo entre diciembre y febrero:
          </P>
          <Tabla cabeceras={["Jornada", "Oeste", "Este"]} filas={CALENDARIO} />
        </Seccion>

        <Seccion etiqueta="05" titulo="Los desempates: cuidado con la trampa">
          <P>Este es el punto donde más gente se equivoca, incluidos medios grandes.</P>
          <P>
            La <B>ACL Elite</B> es una liga suiza: no todos se enfrentan a todos, así que <B>el enfrentamiento
            directo no sirve como criterio</B>. El orden, según el reglamento vigente, es:
          </P>
          <Lista ordenada>
            <li>Puntos</li>
            <li>Diferencia de goles</li>
            <li>Goles a favor</li>
            <li>Partidos ganados</li>
            <li>Penaltis, si solo quedan dos equipos empatados y se han enfrentado en la última jornada</li>
            <li>Clasificación de <em>fair play</em></li>
            <li>Sorteo</li>
          </Lista>
          <P>
            La <B>ACL Two</B>, en cambio, sí tiene grupos de cuatro, y ahí el primer criterio <B>sí es el
            enfrentamiento directo</B>. Son dos competiciones de la misma federación con dos lógicas de
            desempate opuestas. Si alguien te dice que en la Champions asiática manda el <em>head-to-head</em>,
            está hablando de la otra.
          </P>
          <Destacado>
            Un apunte de rigor: estos criterios provienen del reglamento de la edición anterior. La AFC no ha
            anunciado cambios, pero el reglamento específico de 2026/27 debería publicarse antes del sorteo.
            Hasta entonces, dato probable, no confirmado.
          </Destacado>
        </Seccion>

        <Seccion etiqueta="06" titulo="El play-off que existe y no existe">
          <P>Y aquí está la parte que casi nadie ha contado.</P>
          <P>
            Cuando la AFC anunció la expansión, no anunció solo un número. Anunció también un <B>play-off de
            acceso a octavos</B>: los equipos clasificados del <B>séptimo al décimo</B> de cada región se
            cruzarían por las dos últimas plazas del cuadro, con ventaja de campo para el mejor clasificado. La
            idea era que ninguna posición de la tabla fuera irrelevante hasta la última jornada.
          </P>
          <P>Suena bien. Y no se va a aplicar.</P>
          <P>
            La propia AFC lo dejó por escrito en el comunicado: <B>debido a la congestión del calendario global
            de competiciones, el play-off no se implementará en la temporada 2026/27</B> y queda previsto para
            ediciones posteriores. Es decir: la reforma se ha aprobado a medias y se ejecuta a medias.
          </P>
          <P>
            Así que en 2026/27 el corte sigue siendo el de siempre, seco y directo: <B>top 8 y a casa el
            resto</B>. Guárdate el dato, porque vas a leer artículos que dan el play-off por vigente.
          </P>
        </Seccion>

        <Seccion etiqueta="07" titulo="El knockout: dos formatos en una misma fase">
          <P>La eliminatoria asiática es un híbrido raro, y merece la pena entenderlo.</P>
          <P>
            <B>Octavos de final</B> (marzo de 2027): <B>ida y vuelta</B>, y siempre <B>dentro de la misma
            región</B>. Los ocho del Oeste se cruzan entre sí, los ocho del Este entre sí. Primero contra
            octavo, segundo contra séptimo, y así, con vuelta en casa para el mejor clasificado.
          </P>
          <P>
            <B>De cuartos en adelante</B>: cambio total de reglas. La competición se <B>centraliza en una sede
            única</B>, con Arabia Saudí como anfitriona provisional hasta 2029. Cuartos, semifinales y final se
            juegan <B>a partido único</B>, en formato de torneo corto, entre el <B>23 y el 30 de abril de
            2027</B>, con <B>la final el 1 de mayo</B>.
          </P>
          <P>Es aquí, y solo aquí, donde por fin pueden cruzarse Oeste y Este.</P>
          <P>
            Dos detalles reglamentarios que conviene tener claros: <B>el gol en campo contrario no se
            aplica</B> —la AFC lo suprimió con la reforma de 2024/25—, y un empate al término de la
            eliminatoria se resuelve con prórroga y penaltis.
          </P>
        </Seccion>

        <Seccion etiqueta="08" titulo="Qué se lleva el campeón">
          <P>
            Además del trofeo y de una bolsa total de premios que ronda los 50 millones de dólares repartidos
            entre todos los participantes, el ganador se lleva tres billetes:
          </P>
          <Lista>
            <li>Plaza en la <B>fase de liga de la ACL Elite 2027/28</B>, si no la ha conseguido ya por vía doméstica.</li>
            <li><B>Copa Intercontinental FIFA 2027</B>.</li>
            <li><B>Mundial de Clubes FIFA 2029</B>.</li>
          </Lista>
          <P>
            El vigente campeón es <B>Al-Ahli</B>, que ganó a Machida Zelvia en la final de Yeda y encadenó su
            segundo título consecutivo. Defiende corona, y lo hará con la fase final jugándose otra vez en su
            país.
          </P>
        </Seccion>

        <Seccion etiqueta="09" titulo="Lo que todavía no se sabe">
          <P>Tres cosas quedan abiertas a día de hoy:</P>
          <Lista ordenada>
            <li><B>Los cuatro últimos clasificados</B>, que salen de la previa del 11 de agosto.</li>
            <li><B>La composición exacta de las dos tablas y el calendario completo</B>, que fija el sorteo del 18 de agosto.</li>
            <li><B>El reglamento específico de 2026/27</B>, que debería confirmar los criterios de desempate.</li>
          </Lista>
          <P>
            Hasta entonces, cualquier lista de 32 nombres que veas circulando lleva al menos cuatro huecos y
            algún error. Nosotros preferimos esperar al bombo.
          </P>
          <p style={{ color: C.textoSuave, fontSize: 15, lineHeight: 1.75, margin: "0 0 14px", maxWidth: 720, fontStyle: "italic" }}>
            En Modo Competición seguiremos el sorteo del 18 de agosto y actualizaremos este explicativo con las
            dos tablas completas.
          </p>
        </Seccion>

        <footer style={{ borderTop: `1px solid ${C.borde}`, paddingTop: 16, color: "#5A6678", fontSize: 11, lineHeight: 1.6 }}>
          <div>Modo Competición · Formato de la AFC Champions League Elite 2026/27 según la documentación oficial de la AFC. Los criterios de desempate proceden del reglamento de la edición anterior, a la espera del reglamento específico de 2026/27.</div>
          <div style={{ marginTop: 6 }}>
            Modo Competición es un proyecto de Carlos Gil (<a href="https://x.com/CarlosGilAnalis" target="_blank" rel="noopener noreferrer" style={{ color: C.azul }}>@CarlosGilAnalis</a>), en construcción permanente. Si algo no funciona, te falta
            una competición o simplemente tienes una idea mejor que la nuestra, <a href="mailto:feedback@modocompeticion.com" style={{ color: C.azul }}>escríbenos</a>.
          </div>
        </footer>
      </div>
    </div>
  );
}
