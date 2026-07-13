import React from "react";

// ============================================================
// ARTÍCULO — "Entiende el formato, parte 2": la fase de liga y
// las eliminatorias que se juegan tras las fases previas.
// Texto base de Carlos Gil; datos según los Artículos 16, 17 y 19
// de los reglamentos UEFA (ver docs/investigacion-sorteo-fase-liga.md).
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

// ---- Gráfico 1: la tabla única de 36 y sus tres destinos ----
function GraficoTablaUnica() {
  return (
    <div style={{ background: C.tarjeta, border: `1px solid ${C.borde}`, borderRadius: 12, padding: 20, margin: "0 0 14px" }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: 4, marginBottom: 12 }}>
        {Array.from({ length: 36 }, (_, i) => {
          const color = i < 8 ? C.verde : i < 24 ? C.azul : "#5A6678";
          return (
            <div key={i} style={{ background: `${color}22`, border: `1px solid ${color}`, borderRadius: 6, padding: "6px 2px", textAlign: "center", color: C.texto, fontFamily: MONO, fontSize: 11 }}>
              {i + 1}
            </div>
          );
        })}
      </div>
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap", fontSize: 12 }}>
        <span style={{ color: C.verde }}>■ 1º-8º · directos a octavos, cabezas de serie del cuadro</span>
        <span style={{ color: C.azul }}>■ 9º-24º · playoff de eliminatorias en febrero</span>
        <span style={{ color: "#8A97A8" }}>■ 25º-36º · a casa, fuera de Europa</span>
      </div>
      <PieGrafico>
        Una sola tabla de 36 y tres destinos. Del 25º para abajo no hay red de seguridad: nadie baja
        a otra competición a mitad de temporada.
      </PieGrafico>
    </div>
  );
}

// ---- Gráfico 2: los bombos del sorteo ----
function GraficoBombos() {
  const bombo = (n, equipos, color) => (
    <div key={n} style={{ background: C.fondo, border: `1px solid ${color}`, borderRadius: 10, padding: "10px 12px", flex: "1 1 130px" }}>
      <div style={{ fontFamily: MONO, color, fontSize: 10, letterSpacing: 2, marginBottom: 6 }}>BOMBO {n}</div>
      <div style={{ color: C.textoSuave, fontSize: 12, lineHeight: 1.6 }}>{equipos}</div>
    </div>
  );
  return (
    <div style={{ background: C.tarjeta, border: `1px solid ${C.borde}`, borderRadius: 12, padding: 20, margin: "0 0 14px" }}>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 12 }}>
        {bombo(1, "los 9 mejores coeficientes (en Champions, el campeón vigente ocupa el primer puesto aunque el suyo no sea el más alto)", C.oro)}
        {bombo(2, "coeficientes 10º a 18º", C.azul)}
        {bombo(3, "coeficientes 19º a 27º", C.azul)}
        {bombo(4, "coeficientes 28º a 36º", C.azul)}
      </div>
      <div style={{ color: C.textoSuave, fontSize: 13, lineHeight: 1.7, maxWidth: 720 }}>
        En Champions y Europa League, a cada club le tocan <strong style={{ color: C.texto }}>dos rivales de
        cada bombo</strong>, uno en casa y otro fuera. Sí, también dos del Bombo 1: nadie se libra de los
        gordos. En la Conference League el esquema cambia a <strong style={{ color: C.texto }}>6 bombos de
        6</strong> y un rival de cada bombo.
      </div>
      <PieGrafico>
        Restricciones: no puedes cruzarte con equipos de tu propio país y, como máximo, dos rivales de una
        misma asociación extranjera.
      </PieGrafico>
    </div>
  );
}

// ---- Gráfico 3: el cuadro de tenis ----
function GraficoCuadro() {
  const caja = (texto, color = C.borde, destacar = false) => (
    <div style={{ background: destacar ? `${C.oro}18` : C.fondo, border: `1px solid ${color}`, borderRadius: 8, padding: "8px 10px", color: C.texto, fontSize: 12, textAlign: "center", fontFamily: MONO }}>{texto}</div>
  );
  const col = { display: "flex", flexDirection: "column", gap: 8, justifyContent: "center", flex: "1 1 120px", minWidth: 118 };
  const cab = { fontFamily: MONO, color: C.textoSuave, fontSize: 9, letterSpacing: 2, textAlign: "center" };
  return (
    <div style={{ background: C.tarjeta, border: `1px solid ${C.borde}`, borderRadius: 12, padding: 20, margin: "0 0 14px", overflowX: "auto" }}>
      <div style={{ display: "flex", gap: 12, minWidth: 560 }}>
        <div style={col}>
          <div style={cab}>PLAYOFF · FEB</div>
          {caja("9º/10º vs 23º/24º", C.azul)}
          {caja("11º/12º vs 21º/22º", C.azul)}
          {caja("13º/14º vs 19º/20º", C.azul)}
          {caja("15º/16º vs 17º/18º", C.azul)}
        </div>
        <div style={col}>
          <div style={cab}>OCTAVOS · MAR</div>
          {caja("… vs 7º u 8º", C.verde)}
          {caja("… vs 5º o 6º", C.verde)}
          {caja("… vs 3º o 4º", C.verde)}
          {caja("… vs 1º o 2º", C.verde)}
        </div>
        <div style={col}>
          <div style={cab}>CUARTOS · ABR</div>
          {caja("llave del 1º vs llave del 8º")}
          {caja("llave del 3º vs llave del 5º")}
          {caja("llave del 2º vs llave del 7º")}
          {caja("llave del 4º vs llave del 6º")}
        </div>
        <div style={col}>
          <div style={cab}>SEMIS Y FINAL · MAY-JUN</div>
          {caja("semifinal 1")}
          {caja("semifinal 2")}
          {caja("🏆 FINAL · partido único", C.oro, true)}
        </div>
      </div>
      <PieGrafico>
        La tabla forma parejas cerradas en el playoff, cada bloque desemboca en una pareja concreta de
        cabezas de serie, y desde octavos el cuadro queda dibujado hasta la final. Nada de bolas calientes
        en cuartos.
      </PieGrafico>
    </div>
  );
}

export default function ArticuloFaseLiga() {
  return (
    <div style={{ minHeight: "100vh", background: C.fondo, fontFamily: "'Inter', sans-serif" }}>
      <div style={{ maxWidth: 820, margin: "0 auto", padding: "0 20px 60px" }}>

        <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 0 0", flexWrap: "wrap", gap: 10 }}>
          <a href="#/" style={{ fontFamily: MONO, color: C.texto, fontSize: 13, letterSpacing: 3, textDecoration: "none" }}>MODO COMPETICIÓN</a>
          <nav style={{ display: "flex", gap: 18, flexWrap: "wrap" }}>
            <a href="#/" style={{ color: C.textoSuave, fontSize: 13, textDecoration: "none" }}>← Inicio</a>
            <a href="#/formato" style={{ color: C.textoSuave, fontSize: 13, textDecoration: "none" }}>Parte 1: fases previas</a>
            <a href="#/simulador" style={{ color: C.textoSuave, fontSize: 13, textDecoration: "none" }}>Simulador</a>
          </nav>
        </header>

        <div style={{ padding: "56px 0 44px" }}>
          <div style={{ fontFamily: MONO, color: C.azul, fontSize: 11, letterSpacing: 3, marginBottom: 10 }}>ENTIENDE EL FORMATO · PARTE 2</div>
          <h1 style={{ fontFamily: OSWALD, color: C.texto, fontSize: 38, lineHeight: 1.15, margin: "0 0 14px" }}>
            De la fase de liga a la final: así funciona lo que viene después de la previa
          </h1>
          <p style={{ color: C.textoSuave, fontSize: 16, lineHeight: 1.7, margin: 0 }}>
            Si ya te has pateado el camino largo de la fase previa, sabes que llegar a la fase de liga es
            medio milagro para muchos clubes. Pero ¿y luego qué? Aquí va la otra mitad de la película: cómo
            funciona el formato desde que un equipo entra en la fase de liga hasta que alguien levanta el
            trofeo en junio. Sin humo, con el reglamento en la mano.
          </p>
        </div>

        <Seccion etiqueta="01" titulo="Adiós grupos, hola tabla única">
          <P>
            Desde 2024/25 no hay fase de grupos. Lo que hay es una fase de liga: los 36 equipos de cada
            competición comparten una única clasificación, como si fuera una liga normal… con una trampa:
            nadie juega contra todos.
          </P>
          <Destacado>
            <strong>Champions y Europa League:</strong> cada equipo disputa 8 partidos contra 8 rivales
            distintos (4 en casa, 4 fuera).<br />
            <strong>Conference League:</strong> cada equipo disputa 6 partidos contra 6 rivales distintos
            (3 en casa, 3 fuera).
          </Destacado>
          <P>
            Es decir: juegas contra un puñado de rivales, pero compites en la tabla contra los 36. Tu suerte
            depende en parte de a quién te toque en el sorteo. Injusto por diseño, entretenido por accidente.
          </P>
        </Seccion>

        <Seccion etiqueta="02" titulo="El sorteo: bombos y un ordenador con esmoquin">
          <P>
            Los rivales salen de un sorteo con bombos por coeficiente de club (el famoso quinquenal, la nota
            media europea de los últimos cinco años):
          </P>
          <GraficoBombos />
          <P>
            El emparejamiento lo hace un software delante de todo el mundo, porque con estas reglas hacerlo
            con bolitas llevaría hasta la madrugada: el programa sortea al azar y comprueba en cada paso que
            el sorteo no se mete en un callejón sin salida.
          </P>
        </Seccion>

        <Seccion etiqueta="03" titulo="Qué te juegas en la tabla">
          <P>
            Terminadas las 8 jornadas (6 en Conference), la clasificación única reparte tres destinos:
          </P>
          <GraficoTablaUnica />
          <P>
            Ojo al último punto, que es de los grandes cambios del formato: <strong style={{ color: C.texto }}>ya
            no hay red de seguridad</strong>. Nadie "baja" de la Champions a la Europa League ni de la Europa
            League a la Conference a mitad de temporada. Si acabas del 25 para abajo, se acabó tu curso
            europeo. Punto.
          </P>
          <Destacado>
            Los desempates, por si te va la letra pequeña: puntos → diferencia de goles → goles a favor →
            goles fuera de casa → victorias → victorias fuera… y así hasta llegar al coeficiente. El
            simulador aplica exactamente esta cadena.
          </Destacado>
          <P>
            Con 36 equipos y calendarios distintos, la diferencia de goles decide mucho más de lo que parece:
            hay temporadas en las que entrar en el top 8 o no se resuelve por un gol en la jornada 8, que
            además se juega entera a la misma hora. Multipantalla obligatoria.
          </P>
        </Seccion>

        <Seccion etiqueta="04" titulo="El playoff de eliminatorias: la repesca de febrero">
          <P>
            Los clasificados del 9 al 24 juegan una eliminatoria a ida y vuelta para colarse en octavos.
            Los del 9 al 16 son cabezas de serie: juegan la vuelta en casa y se cruzan con los del 17 al 24.
            Y los cruces no son libres: la tabla forma parejas cerradas (9º/10º contra 23º/24º, 11º/12º
            contra 21º/22º, etc.), y un mini-sorteo decide el cruce exacto dentro de cada pareja.
          </P>
          <P>
            Traducción: quedar 9º en vez de 16º importa, y quedar 24º en vez de 25º es la diferencia entre
            seguir vivo y ver los octavos por la tele.
          </P>
        </Seccion>

        <Seccion etiqueta="05" titulo="De octavos a la final: un cuadro de tenis">
          <P>
            Aquí viene el otro gran cambio de mentalidad respecto al formato antiguo: solo hay un sorteo para
            todas las eliminatorias. Tras el playoff se sortean los octavos y, con ello, queda dibujado el
            cuadro completo hasta la final, tipo Grand Slam. Desde marzo cada equipo sabe exactamente por qué
            lado del cuadro camina y con quién puede cruzarse.
          </P>
          <GraficoCuadro />
          <P>
            Además, la posición en la fase de liga sigue pagando dividendos: el top 8 entra en octavos como
            cabeza de serie y juega la vuelta en casa, los cruces de octavos van por parejas ligadas a la
            clasificación (el 1º/2º se cruza con supervivientes de la zona baja del playoff, y así
            sucesivamente), y en cuartos y semifinales el orden de ida y vuelta ya viene fijado por el propio
            cuadro desde el sorteo de octavos.
          </P>
          <Destacado>
            Todas las eliminatorias son a doble partido, y recuerda: el gol de visitante murió en 2021.
            Empate en el global tras 180 minutos → prórroga en la vuelta → penaltis si hace falta.
          </Destacado>
        </Seccion>

        <Seccion etiqueta="06" titulo="La final: un partido, campo neutral, sin excusas">
          <P>
            Todo ese embudo desemboca en un único partido en sede neutral. Para 2026/27, las citas ya tienen
            dirección postal:
          </P>
          <div style={{ background: C.tarjeta, border: `1px solid ${C.borde}`, borderRadius: 12, padding: 20, marginBottom: 14, overflowX: "auto" }}>
            <table style={{ borderCollapse: "collapse", width: "100%", minWidth: 460 }}>
              <tbody>
                {[
                  ["Europa League", "26 de mayo de 2027", "Waldstadion (Deutsche Bank Park), Fráncfort", C.naranja],
                  ["Conference League", "2 de junio de 2027", "Beşiktaş Stadium, Estambul*", C.azul],
                  ["Champions League", "5 de junio de 2027", "Estadio Metropolitano, Madrid", C.oro],
                ].map((fila) => (
                  <tr key={fila[0]}>
                    <td style={{ color: fila[3], fontSize: 14, fontWeight: 600, padding: "9px 12px", borderBottom: `1px solid ${C.borde}`, whiteSpace: "nowrap" }}>{fila[0]}</td>
                    <td style={{ color: C.texto, fontSize: 14, padding: "9px 12px", borderBottom: `1px solid ${C.borde}`, whiteSpace: "nowrap" }}>{fila[1]}</td>
                    <td style={{ color: C.textoSuave, fontSize: 14, padding: "9px 12px", borderBottom: `1px solid ${C.borde}` }}>{fila[2]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <PieGrafico>
              * Con la puerta abierta a que la federación turca pida moverla al nuevo estadio de Ankara si
              llega a tiempo la obra.
            </PieGrafico>
          </div>
          <P>
            Y el premio no es solo la orejona (o sus hermanas pequeñas): el campeón de la Europa League se
            gana plaza en la fase de liga de la siguiente Champions, y el de la Conference, en la de la
            Europa League — salvo que ya estén clasificados por liga, en cuyo caso se activa el reequilibrio
            de plazas… que es exactamente el mecanismo que explicamos en{" "}
            <a href="#/formato" style={{ color: C.azul }}>el artículo de la fase previa</a>. Todo conecta.
          </P>
        </Seccion>

        <Seccion etiqueta="07" titulo="El calendario 2026/27, de un vistazo">
          <div style={{ display: "flex", flexDirection: "column", gap: 8, maxWidth: 720, marginBottom: 14 }}>
            {[
              ["27-28 ago 2026", "Sorteos de la fase de liga (Champions el 27; Europa y Conference el 28)."],
              ["sep 2026 – ene 2027", "Las 8 jornadas de fase de liga (6 en Conference), con última jornada simultánea."],
              ["feb 2027", "Playoff de eliminatorias (9º-24º)."],
              ["mar 2027", "Octavos de final."],
              ["abr 2027", "Cuartos de final."],
              ["may 2027", "Semifinales."],
              ["26 may / 2 jun / 5 jun 2027", "Las tres finales."],
            ].map((fila) => (
              <div key={fila[0]} style={{ display: "flex", gap: 14, alignItems: "baseline", background: C.tarjeta, border: `1px solid ${C.borde}`, borderRadius: 10, padding: "10px 16px" }}>
                <span style={{ fontFamily: MONO, color: C.azul, fontSize: 12, whiteSpace: "nowrap", minWidth: 150 }}>{fila[0]}</span>
                <span style={{ color: C.textoSuave, fontSize: 14, lineHeight: 1.6 }}>{fila[1]}</span>
              </div>
            ))}
          </div>
        </Seccion>

        <Seccion etiqueta="08" titulo="En resumen">
          <P>
            El formato nuevo es, en el fondo, un embudo con tres válvulas: una liga desigual de 36 donde el
            sorteo importa, una repesca de febrero que castiga a los tibios, y un cuadro cerrado de tenis
            donde cada posición de la tabla te compra (o te cobra) el camino hasta la final. La previa decide
            quién entra; la fase de liga decide con qué vida llegas a la primavera.
          </P>
          <P>¿Quieres verlo en acción en lugar de leerlo? Para eso está el simulador. 🟢🟠</P>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <a href="#/simulador/cl" style={{ color: C.oro, border: `1px solid ${C.oro}`, borderRadius: 8, padding: "10px 18px", fontSize: 14, fontWeight: 600, fontFamily: OSWALD, textDecoration: "none" }}>Simulador Champions League</a>
            <a href="#/simulador/el" style={{ color: C.naranja, border: `1px solid ${C.naranja}`, borderRadius: 8, padding: "10px 18px", fontSize: 14, fontWeight: 600, fontFamily: OSWALD, textDecoration: "none" }}>Simulador Europa League</a>
            <a href="#/simulador/co" style={{ color: C.azul, border: `1px solid ${C.azul}`, borderRadius: 8, padding: "10px 18px", fontSize: 14, fontWeight: 600, fontFamily: OSWALD, textDecoration: "none" }}>Simulador Conference League</a>
          </div>
          <div style={{ marginTop: 16 }}>
            <a href="#/formato" style={{ color: C.azul, fontSize: 13, textDecoration: "none" }}>← ¿Te perdiste la Parte 1? Las fases previas, explicadas</a>
          </div>
        </Seccion>

        <footer style={{ borderTop: `1px solid ${C.borde}`, paddingTop: 16, color: "#5A6678", fontSize: 11, lineHeight: 1.6 }}>
          <div>Modo Competición · Basado en los Artículos 16, 17 y 19 de los reglamentos oficiales de la UEFA.</div>
          <div style={{ marginTop: 6 }}>
            Modo Competición es un proyecto de Carlos Gil, en construcción permanente. Si algo no funciona, te falta
            una competición o simplemente tienes una idea mejor que la nuestra, <a href="mailto:feedback@modocompeticion.com" style={{ color: C.azul }}>escríbenos</a>.
          </div>
        </footer>
      </div>
    </div>
  );
}
