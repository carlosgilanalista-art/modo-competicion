// Copa Intercontinental FIFA 2026 — datos de la competición (módulo puro: sin React ni App.jsx).
// Forma de los resultados reales: la misma que espera estadoPartidoUnico en App.jsx
// (gA, gB y, solo si los hubo, etA/etB de prórroga y penA/penB de penaltis).

// Verificada contra el Reglamento de la Copa Intercontinental de la FIFA 2026, art. 11:
// empate a 90' → prórroga de 2×15' → penaltis. Único punto de cambio de la regla de desempate.
// No codificado a propósito (sin fuente oficial completa): tope de suplentes en el acta de P3–P5
// y cambio extra por conmoción.
export const REGLA_DESEMPATE = {
  prorroga: true,
  minutosProrroga: 30,
  penaltis: true,
  verificada: true,
  fuente: "Reglamento FIFA Copa Intercontinental 2026, art. 11",
};

// `acceso` es el texto que muestra el artículo (src/ArticuloCopaIntercontinental.jsx); el simulador no lo usa.
export const EQUIPOS = [
  { id: "psg", nombre: "Paris Saint-Germain", pais: "Francia", confederacion: "UEFA", acceso: "Campeón de la Champions 2025/26" },
  { id: "mamelodi-sundowns", nombre: "Mamelodi Sundowns", pais: "Sudáfrica", confederacion: "CAF", acceso: "Campeón de la CAF Champions League 2025/26" },
  { id: "al-ahli", nombre: "Al-Ahli", pais: "Arabia Saudí", confederacion: "AFC", acceso: "Campeón de la AFC Champions League Elite 2025/26" },
  { id: "auckland-fc", nombre: "Auckland FC", pais: "Nueva Zelanda", confederacion: "OFC", acceso: "Campeón de la OFC Pro League" },
  { id: "toluca", nombre: "Toluca", pais: "México", confederacion: "CONCACAF", acceso: "Campeón de la Concacaf Champions Cup 2026 (final el 30/05)" },
];

export const PLAZA_CONMEBOL = {
  id: "conmebol",
  confederacion: "CONMEBOL",
  estado: "finalistas", // "por_determinar" | "semifinalistas" | "finalistas" | "campeon"
  candidatos: [ // { id, nombre, pais } — finalistas de la Libertadores 2026
    { id: "palmeiras", nombre: "Palmeiras", pais: "Brasil" },
    { id: "estudiantes", nombre: "Estudiantes", pais: "Argentina" },
  ],
  campeon: null, // id | null
  generico: { id: "conmebol-generico", nombre: "Campeón de la Libertadores (por determinar)" },
  // Texto de la fila de CONMEBOL en la tabla de equipos del artículo (el simulador no lo usa).
  articulo: { equipo: "Palmeiras o Estudiantes", acceso: "Campeón de la Libertadores 2026 (final el 28/11 en el Estadio Centenario de Montevideo)" },
};

// `enfrentamiento` es el texto de la tabla del cuadro del artículo (el simulador no lo usa).
// P3–P5: fechas y sedes del anuncio de la FIFA del 22/10/2026.
// Referencias de equipo:
//   { tipo: "equipo", id } · { tipo: "ganador", partido: "Px" } · { tipo: "plaza", plaza: "conmebol" }
export const PARTIDOS = [
  {
    id: "P1", nombre: "Play-off Copa África-Asia-Pacífico",
    enfrentamiento: "Al-Ahli (AFC) vs Auckland FC (OFC)",
    a: { tipo: "equipo", id: "al-ahli" }, b: { tipo: "equipo", id: "auckland-fc" },
    fecha: "2026-08-26", sede: "Yeda (Arabia Saudí)", sedeNeutral: false,
    real: { gA: 1, gB: 0 },
  },
  {
    id: "P2", nombre: "Copa África-Asia-Pacífico",
    enfrentamiento: "Mamelodi Sundowns (CAF) vs vencedor del partido 1",
    a: { tipo: "equipo", id: "mamelodi-sundowns" }, b: { tipo: "ganador", partido: "P1" },
    fecha: "2026-09-19", sede: "Pretoria (Sudáfrica)", sedeNeutral: false,
    real: { gA: 2, gB: 1 },
  },
  {
    id: "P3", nombre: "Derbi de las Américas",
    enfrentamiento: "Toluca (CONCACAF) vs campeón de la Libertadores (CONMEBOL)",
    a: { tipo: "equipo", id: "toluca" }, b: { tipo: "plaza", plaza: "conmebol" },
    fecha: "2026-12-09", sede: "Estadio Jassim bin Hamad, Doha (Catar)", sedeNeutral: true, real: null,
  },
  {
    id: "P4", nombre: "Copa Challenger",
    enfrentamiento: "Vencedor del partido 2 vs vencedor del partido 3",
    a: { tipo: "ganador", partido: "P2" }, b: { tipo: "ganador", partido: "P3" },
    fecha: "2026-12-12", sede: "Estadio Jassim bin Hamad, Doha (Catar)", sedeNeutral: true, real: null,
  },
  {
    id: "P5", nombre: "Final",
    enfrentamiento: "PSG vs vencedor del partido 4",
    a: { tipo: "equipo", id: "psg" }, b: { tipo: "ganador", partido: "P4" },
    fecha: "2026-12-16", sede: "Estadio Ahmad bin Ali, Al Rayyan (Catar)", sedeNeutral: true, real: null,
  },
];
