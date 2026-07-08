import React from "react";

// ============================================================
// PÁGINA DE INICIO — presentación genérica del sitio
// ============================================================
const C = {
  fondo: "#0A0E17", tarjeta: "#101827", borde: "#1E2A3C",
  texto: "#F4F1E8", textoSuave: "#8A97A8",
  oro: "#D4A94C", naranja: "#E8734A", azul: "#4A90D4",
};
const MONO = "'JetBrains Mono', monospace";
const OSWALD = "'Oswald', sans-serif";

function Seccion({ etiqueta, titulo, children }) {
  return (
    <section style={{ marginBottom: 52 }}>
      <div style={{ fontFamily: MONO, color: C.azul, fontSize: 11, letterSpacing: 3, marginBottom: 8 }}>{etiqueta}</div>
      <h2 style={{ fontFamily: OSWALD, color: C.texto, fontSize: 26, margin: "0 0 14px" }}>{titulo}</h2>
      {children}
    </section>
  );
}

function Parrafo({ children }) {
  return <p style={{ color: C.textoSuave, fontSize: 15, lineHeight: 1.7, margin: "0 0 12px", maxWidth: 720 }}>{children}</p>;
}

function TarjetaAccion({ icono, titulo, texto, href }) {
  const contenido = (
    <div style={{ background: C.tarjeta, border: `1px solid ${C.borde}`, borderRadius: 12, padding: 20, height: "100%", boxSizing: "border-box" }}>
      <div style={{ fontSize: 24, marginBottom: 10 }}>{icono}</div>
      <div style={{ fontFamily: OSWALD, color: C.texto, fontSize: 17, marginBottom: 6 }}>{titulo}</div>
      <div style={{ color: C.textoSuave, fontSize: 13, lineHeight: 1.6 }}>{texto}</div>
      {href && <div style={{ color: C.azul, fontSize: 12, marginTop: 10 }}>Ir ahora →</div>}
    </div>
  );
  return href ? <a href={href} style={{ textDecoration: "none" }}>{contenido}</a> : contenido;
}

function BotonEnlace({ href, label, color }) {
  return (
    <a href={href} style={{ display: "inline-block", background: "transparent", color, border: `1px solid ${color}`, borderRadius: 8, padding: "10px 18px", fontSize: 14, fontWeight: 600, fontFamily: OSWALD, textDecoration: "none" }}>
      {label}
    </a>
  );
}

export default function Landing() {
  return (
    <div style={{ minHeight: "100vh", background: C.fondo, fontFamily: "'Inter', sans-serif" }}>
      <div style={{ maxWidth: 960, margin: "0 auto", padding: "0 20px 60px" }}>

        {/* Cabecera */}
        <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 0 0", flexWrap: "wrap", gap: 10 }}>
          <div style={{ fontFamily: MONO, color: C.texto, fontSize: 13, letterSpacing: 3 }}>MODO COMPETICIÓN</div>
          <nav style={{ display: "flex", gap: 18 }}>
            <a href="#/formato" style={{ color: C.textoSuave, fontSize: 13, textDecoration: "none" }}>Entiende el formato</a>
            <a href="#/simulador" style={{ color: C.textoSuave, fontSize: 13, textDecoration: "none" }}>Simulador</a>
          </nav>
        </header>

        {/* Hero */}
        <div style={{ padding: "70px 0 60px", maxWidth: 760 }}>
          <h1 style={{ fontFamily: OSWALD, color: C.texto, fontSize: 42, lineHeight: 1.15, margin: "0 0 16px" }}>
            Entiende y simula los formatos de las competiciones de fútbol
          </h1>
          <p style={{ color: C.textoSuave, fontSize: 17, lineHeight: 1.7, margin: "0 0 28px" }}>
            Explicaciones claras y simuladores interactivos, competición a competición.
            Empezamos por las fases previas europeas de la temporada 2026/27.
          </p>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <a href="#/formato" style={{ background: C.azul, color: C.fondo, borderRadius: 8, padding: "12px 22px", fontSize: 15, fontWeight: 600, fontFamily: OSWALD, textDecoration: "none" }}>Entiende el formato</a>
            <a href="#/simulador" style={{ background: "transparent", color: C.azul, border: `1px solid ${C.azul}`, borderRadius: 8, padding: "12px 22px", fontSize: 15, fontWeight: 600, fontFamily: OSWALD, textDecoration: "none" }}>Abrir el simulador</a>
          </div>
        </div>

        {/* Por qué existe esto */}
        <Seccion etiqueta="01" titulo="¿Por qué existe esto?">
          <Parrafo>
            Los formatos de las competiciones son cada vez más complejos: rondas previas, rutas paralelas,
            sorteos con cabezas de serie, coeficientes y equipos que cambian de torneo a mitad de camino.
            Seguir todo eso con un reglamento en la mano es difícil.
          </Parrafo>
          <Parrafo>
            Este sitio reúne en un solo lugar explicaciones y simuladores de esos formatos. Abarca — e irá
            abarcando — distintas competiciones: la primera es la fase previa de los tres torneos europeos
            de clubes (Champions League, Europa League y Conference League) de la temporada 2026/27.
          </Parrafo>
        </Seccion>

        {/* Qué puedes hacer */}
        <Seccion etiqueta="02" titulo="¿Qué puedes hacer?">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))", gap: 12 }}>
            <TarjetaAccion icono="📖" titulo="Entiende el formato" href="#/formato"
              texto="Lee una explicación clara, con gráficos y ejemplos, de cómo se desarrolla cada competición." />
            <TarjetaAccion icono="⚽" titulo="Simula las rondas"
              texto="Introduce los resultados que quieras o genera simulaciones automáticas partido a partido." />
            <TarjetaAccion icono="🎲" titulo="Sortea los cruces"
              texto="Reproduce los sorteos oficiales: cabezas de serie por coeficiente y restricciones por país." />
            <TarjetaAccion icono="🔀" titulo="Sigue las conexiones"
              texto="Observa en directo cómo los eliminados de una competición entran en la siguiente." />
          </div>
        </Seccion>

        {/* De qué va */}
        <Seccion etiqueta="03" titulo="¿De qué va?">
          <Parrafo>
            Cada competición incluida en el sitio se presenta con dos piezas: una explicación del formato
            pensada para todos los públicos y un simulador fiel a las reglas oficiales — coeficientes,
            rutas, sorteos y redistribución de eliminados entre torneos.
          </Parrafo>
          <Parrafo>
            En el simulador los datos fluyen en directo entre competiciones: si resuelves una eliminatoria
            de Champions League, sus efectos aparecen al instante en Europa League y Conference League,
            sin guardar ni recargar nada.
          </Parrafo>
        </Seccion>

        {/* Empieza por aquí */}
        <Seccion etiqueta="04" titulo="Empieza por aquí">
          <div style={{ display: "flex", flexDirection: "column", gap: 12, maxWidth: 720 }}>
            {[
              { n: "1", texto: <>Lee <a href="#/formato" style={{ color: C.azul }}>Entiende el formato</a> para saber cómo funcionan las fases previas: rondas, rutas y caminos entre competiciones.</> },
              { n: "2", texto: <>Abre el simulador de la competición que te interese: cada partido está numerado (R1-1, EL1-2, CO1-3…) para que puedas localizar cualquier referencia.</> },
              { n: "3", texto: <>Introduce resultados reales o pulsa «Simular» en cada ronda, y sortea las rondas siguientes cuando se completen.</> },
            ].map((paso) => (
              <div key={paso.n} style={{ display: "flex", gap: 14, alignItems: "flex-start", background: C.tarjeta, border: `1px solid ${C.borde}`, borderRadius: 10, padding: "14px 16px" }}>
                <span style={{ fontFamily: MONO, color: C.azul, fontSize: 16, border: `1px solid ${C.azul}`, borderRadius: 6, padding: "2px 9px" }}>{paso.n}</span>
                <span style={{ color: C.textoSuave, fontSize: 14, lineHeight: 1.6 }}>{paso.texto}</span>
              </div>
            ))}
          </div>
        </Seccion>

        {/* Competiciones */}
        <Seccion etiqueta="05" titulo="Competiciones">
          <div style={{ background: C.tarjeta, border: `1px solid ${C.borde}`, borderRadius: 12, padding: 24, marginBottom: 12 }}>
            <div style={{ fontFamily: OSWALD, color: C.texto, fontSize: 20, marginBottom: 6 }}>Fases previas UEFA 2026/27</div>
            <div style={{ color: C.textoSuave, fontSize: 14, lineHeight: 1.6, marginBottom: 16, maxWidth: 720 }}>
              Las rondas de clasificación de las tres competiciones europeas de clubes, conectadas entre sí:
              simulador completo de Ronda 1 a Playoff y explicación del formato con gráficos y ejemplos.
            </div>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 14 }}>
              <BotonEnlace href="#/simulador/cl" label="Champions League" color={C.oro} />
              <BotonEnlace href="#/simulador/el" label="Europa League" color={C.naranja} />
              <BotonEnlace href="#/simulador/co" label="Conference League" color={C.azul} />
            </div>
            <a href="#/formato" style={{ color: C.azul, fontSize: 13, textDecoration: "none" }}>📖 Entiende el formato de las fases previas →</a>
          </div>
          <div style={{ border: `1px dashed ${C.borde}`, borderRadius: 12, padding: 20, color: C.textoSuave, fontSize: 13 }}>
            Próximamente: más competiciones, con sus simuladores y explicaciones.
          </div>
        </Seccion>

        <footer style={{ borderTop: `1px solid ${C.borde}`, paddingTop: 16, color: "#5A6678", fontSize: 11, lineHeight: 1.6 }}>
          <div>Modo Competición · Los coeficientes y listados de acceso proceden de la documentación oficial de la UEFA.</div>
          <div style={{ marginTop: 6 }}>
            Modo Competición es un proyecto de Carlos Gil, en construcción permanente. Si algo no funciona, te falta
            una competición o simplemente tienes una idea mejor que la nuestra, <a href="mailto:feedback@modocompeticion.com" style={{ color: C.azul }}>escríbenos</a>.
          </div>
        </footer>
      </div>
    </div>
  );
}
