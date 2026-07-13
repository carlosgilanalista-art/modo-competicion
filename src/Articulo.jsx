import React from "react";

// ============================================================
// ARTÍCULO — "Entiende el formato": las fases previas europeas
// explicadas para todos los públicos, con gráficos y ejemplos
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

// ---- Gráfico 1: embudo de rondas ----
function GraficoEmbudo() {
  const filas = [
    { label: "RONDA 1", fecha: "julio", w: "100%", nota: "entran los campeones y clasificados de las ligas más modestas" },
    { label: "RONDA 2", fecha: "julio", w: "80%", nota: "se suman equipos de ligas intermedias" },
    { label: "RONDA 3", fecha: "agosto", w: "60%", nota: "se suman equipos de ligas grandes" },
    { label: "PLAYOFF", fecha: "agosto", w: "42%", nota: "la última eliminatoria" },
    { label: "FASE DE LIGA", fecha: "septiembre", w: "26%", nota: "los supervivientes se unen a los clasificados directos" },
  ];
  return (
    <div style={{ background: C.tarjeta, border: `1px solid ${C.borde}`, borderRadius: 12, padding: "22px 20px", margin: "0 0 14px" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 10, alignItems: "center" }}>
        {filas.map((f, i) => (
          <div key={f.label} style={{ width: f.w, minWidth: 190 }}>
            <div style={{ background: `rgba(74, 144, 212, ${0.16 + i * 0.16})`, border: `1px solid ${C.azul}`, borderRadius: 8, padding: "9px 12px", display: "flex", justifyContent: "space-between", gap: 8, alignItems: "baseline" }}>
              <span style={{ fontFamily: MONO, color: C.texto, fontSize: 12, letterSpacing: 1, whiteSpace: "nowrap" }}>{f.label}</span>
              <span style={{ fontFamily: MONO, color: C.textoSuave, fontSize: 10, whiteSpace: "nowrap" }}>{f.fecha}</span>
            </div>
            <div style={{ color: "#5A6678", fontSize: 11, marginTop: 3, textAlign: "center" }}>{f.nota}</div>
          </div>
        ))}
      </div>
      <PieGrafico>En cada ronda entran equipos nuevos y salen los eliminados: el embudo se estrecha hasta la fase de liga.</PieGrafico>
    </div>
  );
}

// ---- Gráfico 2: ejemplo de eliminatoria a doble partido ----
function GraficoEliminatoria() {
  const caja = { background: C.fondo, border: `1px solid ${C.borde}`, borderRadius: 10, padding: "12px 16px", flex: "1 1 180px" };
  const marcador = { fontFamily: MONO, color: C.texto, fontSize: 20 };
  return (
    <div style={{ background: C.tarjeta, border: `1px solid ${C.borde}`, borderRadius: 12, padding: "20px", margin: "0 0 14px" }}>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 14 }}>
        <div style={caja}>
          <div style={{ fontFamily: MONO, color: C.textoSuave, fontSize: 10, letterSpacing: 2, marginBottom: 6 }}>IDA · CASA DEL ROJO</div>
          <div style={marcador}>Rojo 2 - 1 Azul</div>
        </div>
        <div style={caja}>
          <div style={{ fontFamily: MONO, color: C.textoSuave, fontSize: 10, letterSpacing: 2, marginBottom: 6 }}>VUELTA · CASA DEL AZUL</div>
          <div style={marcador}>Azul 2 - 1 Rojo</div>
        </div>
        <div style={{ ...caja, border: `1px solid ${C.verde}` }}>
          <div style={{ fontFamily: MONO, color: C.verde, fontSize: 10, letterSpacing: 2, marginBottom: 6 }}>GLOBAL</div>
          <div style={marcador}>3 - 3 → ¡empate!</div>
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", color: C.textoSuave, fontSize: 13 }}>
        <span style={{ background: C.fondo, border: `1px solid ${C.borde}`, borderRadius: 6, padding: "6px 10px" }}>⏱ Prórroga: 30 min extra</span>
        <span>→</span>
        <span style={{ background: C.fondo, border: `1px solid ${C.borde}`, borderRadius: 6, padding: "6px 10px" }}>¿Sigue el empate?</span>
        <span>→</span>
        <span style={{ background: C.fondo, border: `1px solid ${C.verde}`, borderRadius: 6, padding: "6px 10px", color: C.verde }}>🥅 Penaltis deciden</span>
      </div>
      <PieGrafico>Ejemplo: Rojo gana la ida 2-1 y pierde la vuelta 2-1. El global queda 3-3, así que hay prórroga y, si persiste el empate, penaltis.</PieGrafico>
    </div>
  );
}

// ---- Gráfico 3: la red de seguridad entre competiciones ----
function GraficoRedSeguridad() {
  const cols = { CL: 120, EL: 350, CO: 580 };
  const rows = { R1: 80, R2: 150, R3: 220, PO: 290, FL: 360 };
  const colorComp = { CL: C.oro, EL: C.naranja, CO: C.azul };
  const nombreFila = { R1: "Ronda 1", R2: "Ronda 2", R3: "Ronda 3", PO: "Playoff", FL: "Fase de Liga" };
  const flechas = [
    { de: ["CL", "R1"], a: ["CO", "R2"] },
    { de: ["CL", "R2"], a: ["EL", "R3"] },
    { de: ["CL", "R3"], a: ["EL", "PO"] },
    { de: ["CL", "PO"], a: ["EL", "FL"] },
    { de: ["EL", "R1"], a: ["CO", "R2"] },
    { de: ["EL", "R2"], a: ["CO", "R3"] },
    { de: ["EL", "R3"], a: ["CO", "PO"] },
    { de: ["EL", "PO"], a: ["CO", "FL"] },
  ];
  const W = 108, H = 30;
  return (
    <div style={{ background: C.tarjeta, border: `1px solid ${C.borde}`, borderRadius: 12, padding: "16px 8px", margin: "0 0 14px", overflowX: "auto" }}>
      <svg viewBox="0 0 700 410" style={{ width: "100%", minWidth: 560, height: "auto", display: "block" }}>
        <defs>
          <marker id="punta" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
            <path d="M0,0 L7,3.5 L0,7 Z" fill="#5A6678" />
          </marker>
        </defs>
        {/* Cabeceras */}
        {Object.entries({ CL: "CHAMPIONS", EL: "EUROPA LEAGUE", CO: "CONFERENCE" }).map(([k, nombre]) => (
          <text key={k} x={cols[k]} y={38} textAnchor="middle" fill={colorComp[k]} fontSize="13" fontFamily={MONO} letterSpacing="2">{nombre}</text>
        ))}
        {/* Flechas (debajo de las cajas) */}
        {flechas.map((f, i) => {
          const x1 = cols[f.de[0]] + W / 2, y1 = rows[f.de[1]];
          const x2 = cols[f.a[0]] - W / 2 - 4, y2 = rows[f.a[1]];
          const mx = (x1 + x2) / 2;
          return <path key={i} d={`M ${x1} ${y1} C ${mx} ${y1}, ${mx} ${y2}, ${x2} ${y2}`} fill="none" stroke="#5A6678" strokeWidth="1.4" strokeDasharray="4 3" markerEnd="url(#punta)" />;
        })}
        {/* Cajas */}
        {Object.keys(cols).map((comp) =>
          Object.keys(rows).map((fila) => (
            <g key={comp + fila}>
              <rect x={cols[comp] - W / 2} y={rows[fila] - H / 2} width={W} height={H} rx="7"
                fill={fila === "FL" ? `${colorComp[comp]}22` : C.fondo} stroke={colorComp[comp]} strokeWidth={fila === "FL" ? 1.8 : 1} />
              <text x={cols[comp]} y={rows[fila] + 4} textAnchor="middle" fill={C.texto} fontSize="11.5" fontFamily="'Inter', sans-serif">{nombreFila[fila]}</text>
            </g>
          ))
        )}
      </svg>
      <PieGrafico>
        Cada flecha es un "descenso": el eliminado no se va a casa, entra en una ronda de la competición
        inferior. Por ejemplo, los 12 perdedores del Playoff de Europa League entran directos en la fase
        de liga de la Conference League.
      </PieGrafico>
    </div>
  );
}

// ---- Gráfico 4: cabezas de serie en el sorteo ----
function GraficoSorteo() {
  const equipos = [
    { n: "Equipo A", coef: "46.500", cabeza: true },
    { n: "Equipo B", coef: "27.250", cabeza: true },
    { n: "Equipo C", coef: "11.000", cabeza: false },
    { n: "Equipo D", coef: "6.500", cabeza: false },
  ];
  return (
    <div style={{ background: C.tarjeta, border: `1px solid ${C.borde}`, borderRadius: 12, padding: 20, margin: "0 0 14px" }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12 }}>
        <div>
          <div style={{ fontFamily: MONO, color: C.oro, fontSize: 10, letterSpacing: 2, marginBottom: 8 }}>CABEZAS DE SERIE (mitad alta)</div>
          {equipos.filter((e) => e.cabeza).map((e) => (
            <div key={e.n} style={{ display: "flex", justifyContent: "space-between", background: C.fondo, border: `1px solid ${C.oro}`, borderRadius: 8, padding: "8px 12px", marginBottom: 6 }}>
              <span style={{ color: C.texto, fontSize: 13 }}>{e.n}</span>
              <span style={{ fontFamily: MONO, color: C.oro, fontSize: 12 }}>{e.coef}</span>
            </div>
          ))}
        </div>
        <div>
          <div style={{ fontFamily: MONO, color: C.textoSuave, fontSize: 10, letterSpacing: 2, marginBottom: 8 }}>NO CABEZAS DE SERIE (mitad baja)</div>
          {equipos.filter((e) => !e.cabeza).map((e) => (
            <div key={e.n} style={{ display: "flex", justifyContent: "space-between", background: C.fondo, border: `1px solid ${C.borde}`, borderRadius: 8, padding: "8px 12px", marginBottom: 6 }}>
              <span style={{ color: C.texto, fontSize: 13 }}>{e.n}</span>
              <span style={{ fontFamily: MONO, color: C.textoSuave, fontSize: 12 }}>{e.coef}</span>
            </div>
          ))}
        </div>
      </div>
      <div style={{ color: C.textoSuave, fontSize: 13, marginTop: 12 }}>
        Cada cabeza de serie se empareja con un rival de la mitad baja — y nunca con uno de su mismo país.
      </div>
      <PieGrafico>Con 4 equipos, los cruces posibles serían A-C y B-D, o A-D y B-C. Nunca A-B.</PieGrafico>
    </div>
  );
}

export default function Articulo() {
  return (
    <div style={{ minHeight: "100vh", background: C.fondo, fontFamily: "'Inter', sans-serif" }}>
      <div style={{ maxWidth: 820, margin: "0 auto", padding: "0 20px 60px" }}>

        <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 0 0", flexWrap: "wrap", gap: 10 }}>
          <a href="#/" style={{ fontFamily: MONO, color: C.texto, fontSize: 13, letterSpacing: 3, textDecoration: "none" }}>MODO COMPETICIÓN</a>
          <nav style={{ display: "flex", gap: 18, flexWrap: "wrap" }}>
            <a href="#/" style={{ color: C.textoSuave, fontSize: 13, textDecoration: "none" }}>← Inicio</a>
            <a href="#/formato-liga" style={{ color: C.textoSuave, fontSize: 13, textDecoration: "none" }}>Parte 2: liga y eliminatorias</a>
            <a href="#/simulador" style={{ color: C.textoSuave, fontSize: 13, textDecoration: "none" }}>Simulador</a>
          </nav>
        </header>

        <div style={{ padding: "56px 0 44px" }}>
          <div style={{ fontFamily: MONO, color: C.azul, fontSize: 11, letterSpacing: 3, marginBottom: 10 }}>ENTIENDE EL FORMATO · PARTE 1</div>
          <h1 style={{ fontFamily: OSWALD, color: C.texto, fontSize: 38, lineHeight: 1.15, margin: "0 0 14px" }}>
            Las fases previas europeas, explicadas para todos los públicos
          </h1>
          <p style={{ color: C.textoSuave, fontSize: 16, lineHeight: 1.7, margin: 0 }}>
            Qué son, cómo funcionan y por qué perder una eliminatoria no siempre significa quedar
            eliminado de Europa. Con gráficos y ejemplos.
          </p>
        </div>

        <Seccion etiqueta="01" titulo="¿Qué son las fases previas?">
          <P>
            Cada verano, mientras las grandes ligas descansan, en Europa se juega un torneo silencioso:
            las rondas de clasificación de la Champions League, la Europa League y la Conference League.
            Más de 150 equipos — desde el campeón de San Marino hasta clubes históricos de ligas grandes —
            compiten durante julio y agosto por un puñado de plazas en la fase de liga de cada competición.
          </P>
          <P>
            La estructura es un embudo de cuatro rondas: Ronda 1, Ronda 2, Ronda 3 y Playoff. En cada una
            entran equipos nuevos (cuanto más fuerte es su liga, más tarde entran) y los ganadores avanzan
            hacia la fase de liga.
          </P>
          <GraficoEmbudo />
        </Seccion>

        <Seccion etiqueta="02" titulo="La eliminatoria a doble partido">
          <P>
            Casi todas las rondas se juegan a ida y vuelta: cada equipo juega un partido en su casa y lo que
            cuenta es la suma de goles de los dos partidos, el resultado global. Si el global acaba en
            empate, la vuelta se alarga con una prórroga de 30 minutos y, si el empate persiste, todo se
            decide en los penaltis.
          </P>
          <GraficoEliminatoria />
          <Destacado>
            Desde 2021 los goles a domicilio ya no valen doble: un 3-3 global es un empate se marque donde
            se marque.
          </Destacado>
        </Seccion>

        <Seccion etiqueta="03" titulo="Dos caminos: la Ruta de Campeones y la Ruta de Liga">
          <P>
            Dentro de cada fase previa conviven dos caminos separados que no se cruzan hasta la fase de liga:
          </P>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 12, marginBottom: 14 }}>
            <div style={{ background: C.tarjeta, border: `1px solid ${C.oro}`, borderRadius: 12, padding: 18 }}>
              <div style={{ fontFamily: MONO, color: C.oro, fontSize: 11, letterSpacing: 2, marginBottom: 8 }}>RUTA DE CAMPEONES</div>
              <div style={{ color: C.textoSuave, fontSize: 14, lineHeight: 1.6 }}>
                Para los campeones de liga de cada país. Así se garantiza que varios campeones nacionales
                lleguen a la fase de liga, aunque vengan de ligas modestas.
              </div>
            </div>
            <div style={{ background: C.tarjeta, border: `1px solid ${C.azul}`, borderRadius: 12, padding: 18 }}>
              <div style={{ fontFamily: MONO, color: C.azul, fontSize: 11, letterSpacing: 2, marginBottom: 8 }}>RUTA DE LIGA</div>
              <div style={{ color: C.textoSuave, fontSize: 14, lineHeight: 1.6 }}>
                Para los equipos que no fueron campeones (segundos, terceros, cuartos…). Compiten entre
                ellos por las plazas restantes.
              </div>
            </div>
          </div>
          <P>
            Por eso en el simulador verás cada cruce etiquetado con su ruta: un equipo de la Ruta de
            Campeones nunca se cruza con uno de la Ruta de Liga durante la fase previa.
          </P>
        </Seccion>

        <Seccion etiqueta="04" titulo="La red de seguridad: perder no siempre es quedar eliminado">
          <P>
            Aquí está la parte más ingeniosa del sistema — y la más difícil de seguir. Las tres competiciones
            están conectadas en cascada: el que pierde en la Champions cae a la Europa League, y el que
            pierde en la Europa League cae a la Conference League. Solo quien pierde en la fase previa de la
            Conference queda eliminado de Europa de verdad.
          </P>
          <GraficoRedSeguridad />
          <P>
            Hay matices según la ronda y la ruta: por ejemplo, los perdedores de la Ronda 3 de Champions de
            la Ruta de Liga entran directamente en la fase de liga de la Europa League (sin jugar el Playoff),
            mientras que los de la Ruta de Campeones sí deben jugar el Playoff de la Europa League. El
            simulador aplica estos matices automáticamente y te muestra en cada cruce a dónde va el ganador
            y a dónde va el perdedor.
          </P>
        </Seccion>

        <Seccion etiqueta="05" titulo="Un ejemplo práctico: el viaje del campeón de un país pequeño">
          <P>
            Imagina al campeón de Islandia. Entra en la Ronda 1 de la Champions League, dentro de la Ruta de
            Campeones. A partir de ahí, su verano puede seguir muchos caminos:
          </P>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, maxWidth: 720, marginBottom: 14 }}>
            {[
              { icono: "🏆", texto: "Si gana sus cuatro eliminatorias (Ronda 1, 2, 3 y Playoff), jugará la fase de liga de la Champions League." },
              { icono: "🥈", texto: "Si cae en la Ronda 2 de Champions, no queda eliminado: pasa a la Ronda 3 de la Europa League." },
              { icono: "🥉", texto: "Si después cae también en la Europa League, aún le queda una vida: la Conference League." },
              { icono: "🏁", texto: "Solo si pierde también allí, su aventura europea termina. Un mismo equipo puede disputar eliminatorias de las tres competiciones en un solo verano." },
            ].map((paso, i) => (
              <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start", background: C.tarjeta, border: `1px solid ${C.borde}`, borderRadius: 10, padding: "12px 16px" }}>
                <span style={{ fontSize: 18 }}>{paso.icono}</span>
                <span style={{ color: C.textoSuave, fontSize: 14, lineHeight: 1.6 }}>{paso.texto}</span>
              </div>
            ))}
          </div>
        </Seccion>

        <Seccion etiqueta="06" titulo="Los coeficientes y el sorteo">
          <P>
            ¿Y cómo se decide quién juega contra quién? Con el coeficiente UEFA: una nota que resume los
            resultados europeos de cada club en las últimas cinco temporadas. En cada sorteo los equipos se
            ordenan por coeficiente y se dividen en dos mitades: la mitad alta son los cabezas de serie y la
            mitad baja, sus posibles rivales. Además, dos equipos del mismo país no pueden cruzarse.
          </P>
          <GraficoSorteo />
          <P>
            En el simulador, los coeficientes son los oficiales de la UEFA y no se pueden modificar: son la
            base de todos los sorteos, igual que en la realidad.
          </P>
        </Seccion>

        <Seccion etiqueta="07" titulo="El calendario de un vistazo">
          <div style={{ background: C.tarjeta, border: `1px solid ${C.borde}`, borderRadius: 12, padding: 20, marginBottom: 14, overflowX: "auto" }}>
            <table style={{ borderCollapse: "collapse", width: "100%", minWidth: 460 }}>
              <thead>
                <tr>
                  {["Ronda", "Ida", "Vuelta"].map((h) => (
                    <th key={h} style={{ textAlign: "left", fontFamily: MONO, color: C.azul, fontSize: 11, letterSpacing: 2, padding: "6px 12px 10px", borderBottom: `1px solid ${C.borde}` }}>{h.toUpperCase()}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  ["Ronda 1", "7-9 de julio", "14-16 de julio"],
                  ["Ronda 2", "21-23 de julio", "28-30 de julio"],
                  ["Ronda 3", "4-6 de agosto", "11-13 de agosto"],
                  ["Playoff", "18-20 de agosto", "25-27 de agosto"],
                ].map((fila) => (
                  <tr key={fila[0]}>
                    {fila.map((celda, i) => (
                      <td key={i} style={{ color: i === 0 ? C.texto : C.textoSuave, fontSize: 14, padding: "9px 12px", borderBottom: `1px solid ${C.borde}` }}>{celda}</td>
                    ))}
                  </tr>
                ))}
                <tr>
                  <td style={{ color: C.verde, fontSize: 14, padding: "9px 12px" }}>Fase de Liga</td>
                  <td colSpan={2} style={{ color: C.textoSuave, fontSize: 14, padding: "9px 12px" }}>sorteo a finales de agosto · arranca en septiembre</td>
                </tr>
              </tbody>
            </table>
            <PieGrafico>Fechas de la temporada 2026/27; cada competición juega en días ligeramente distintos de la misma semana.</PieGrafico>
          </div>
          <P>
            Seis semanas, ocho partidos como máximo por equipo y decenas de historias cruzadas. Cuando en
            septiembre arranca la fase de liga, el embudo ya ha hecho su trabajo.
          </P>
        </Seccion>

        <Seccion etiqueta="08" titulo="Ahora, pruébalo tú">
          <P>
            La mejor forma de entender el sistema es jugar con él: introduce resultados, sortea las rondas y
            observa cómo los eliminados van cayendo de una competición a otra en directo.
          </P>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <a href="#/simulador/cl" style={{ color: C.oro, border: `1px solid ${C.oro}`, borderRadius: 8, padding: "10px 18px", fontSize: 14, fontWeight: 600, fontFamily: OSWALD, textDecoration: "none" }}>Simulador Champions League</a>
            <a href="#/simulador/el" style={{ color: C.naranja, border: `1px solid ${C.naranja}`, borderRadius: 8, padding: "10px 18px", fontSize: 14, fontWeight: 600, fontFamily: OSWALD, textDecoration: "none" }}>Simulador Europa League</a>
            <a href="#/simulador/co" style={{ color: C.azul, border: `1px solid ${C.azul}`, borderRadius: 8, padding: "10px 18px", fontSize: 14, fontWeight: 600, fontFamily: OSWALD, textDecoration: "none" }}>Simulador Conference League</a>
          </div>
          <div style={{ marginTop: 16 }}>
            <a href="#/formato-liga" style={{ color: C.azul, fontSize: 13, textDecoration: "none" }}>Sigue leyendo — Parte 2: la fase de liga y las eliminatorias →</a>
          </div>
        </Seccion>

        <footer style={{ borderTop: `1px solid ${C.borde}`, paddingTop: 16, color: "#5A6678", fontSize: 11, lineHeight: 1.6 }}>
          <div>Modo Competición · Los coeficientes y listados de acceso proceden de la documentación oficial de la UEFA.</div>
          <div style={{ marginTop: 6 }}>
            Modo Competición es un proyecto de Carlos Gil (<a href="https://x.com/CarlosGilAnalis" target="_blank" rel="noopener noreferrer" style={{ color: C.azul }}>@CarlosGilAnalis</a>), en construcción permanente. Si algo no funciona, te falta
            una competición o simplemente tienes una idea mejor que la nuestra, <a href="mailto:feedback@modocompeticion.com" style={{ color: C.azul }}>escríbenos</a>.
          </div>
        </footer>
      </div>
    </div>
  );
}
