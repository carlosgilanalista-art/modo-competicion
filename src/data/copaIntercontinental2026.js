// Copa Intercontinental FIFA 2026 — datos de la competición (módulo puro: sin React ni App.jsx).
// Forma de los resultados reales: la misma que espera estadoPartidoUnico en App.jsx
// (gA, gB y, solo si los hubo, etA/etB de prórroga y penA/penB de penaltis).

// SIN VERIFICAR — fuente: Wikipedia (2026 FIFA Intercontinental Cup), no el reglamento FIFA.
// Único punto de cambio de la regla de desempate.
export const REGLA_DESEMPATE = {
  prorroga: true,
  minutosProrroga: 30,
  penaltis: true,
  verificada: false,
  fuente: "Wikipedia",
};

export const EQUIPOS = [
  { id: "psg", nombre: "Paris Saint-Germain", pais: "Francia", confederacion: "UEFA", acceso: "Campeón de la UEFA Champions League 2025/26" },
  { id: "mamelodi-sundowns", nombre: "Mamelodi Sundowns", pais: "Sudáfrica", confederacion: "CAF", acceso: "Campeón de la CAF Champions League 2025/26" },
  { id: "al-ahli", nombre: "Al-Ahli", pais: "Arabia Saudí", confederacion: "AFC", acceso: "Campeón de la AFC Champions League Elite 2025/26" },
  { id: "auckland-fc", nombre: "Auckland FC", pais: "Nueva Zelanda", confederacion: "OFC", acceso: "Campeón de la OFC Pro League" },
  { id: "toluca", nombre: "Toluca", pais: "México", confederacion: "CONCACAF", acceso: "Campeón de la Concacaf Champions Cup 2026" },
];

export const PLAZA_CONMEBOL = {
  id: "conmebol",
  confederacion: "CONMEBOL",
  estado: "por_determinar", // "por_determinar" | "semifinalistas" | "finalistas" | "campeon"
  candidatos: [], // { id, nombre, pais }
  campeon: null, // id | null
  generico: { id: "conmebol-generico", nombre: "Campeón de la Libertadores (por determinar)" },
};

// Referencias de equipo:
//   { tipo: "equipo", id } · { tipo: "ganador", partido: "Px" } · { tipo: "plaza", plaza: "conmebol" }
export const PARTIDOS = [
  {
    id: "P1", nombre: "Play-off Copa África-Asia-Pacífico",
    a: { tipo: "equipo", id: "al-ahli" }, b: { tipo: "equipo", id: "auckland-fc" },
    fecha: "2026-08-26", sede: "Yeda (Arabia Saudí)", sedeNeutral: false,
    real: { gA: 1, gB: 0 },
  },
  {
    id: "P2", nombre: "Copa África-Asia-Pacífico",
    a: { tipo: "equipo", id: "mamelodi-sundowns" }, b: { tipo: "ganador", partido: "P1" },
    fecha: "2026-09-19", sede: "Pretoria (Sudáfrica)", sedeNeutral: false,
    real: { gA: 2, gB: 1 },
  },
  {
    id: "P3", nombre: "Derbi de las Américas",
    a: { tipo: "equipo", id: "toluca" }, b: { tipo: "plaza", plaza: "conmebol" },
    fecha: null, sede: null, sedeNeutral: null, real: null,
  },
  {
    id: "P4", nombre: "Copa Challenger",
    a: { tipo: "ganador", partido: "P2" }, b: { tipo: "ganador", partido: "P3" },
    fecha: null, sede: null, sedeNeutral: null, real: null,
  },
  {
    id: "P5", nombre: "Final",
    a: { tipo: "equipo", id: "psg" }, b: { tipo: "ganador", partido: "P4" },
    fecha: null, sede: null, sedeNeutral: null, real: null,
  },
];
