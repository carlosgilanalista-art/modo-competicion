// Copa del Rey 2026/27 — datos del artículo explicativo (módulo puro: sin React ni App.jsx).
// Transcritos del borrador del 26/10/2026, con los nombres tal cual allí. No se unifican
// grafías con la RFEF (p. ej. "CD Baztán" y "CD Baztán KE" conviven): va al Aparcadero.
// Fiabilidad: 🟢 confirmado en fuente oficial · 🟡 probable · 🔴 sin verificar.

export const CALENDARIO = [
  { ronda: "Previa", cuando: "26 de septiembre – 11 de octubre", formato: "Doble partido" },
  { ronda: "Primera eliminatoria", cuando: "27, 28 y 29 de octubre", formato: "Partido único" },
  { ronda: "Segunda eliminatoria", cuando: "2 de diciembre", formato: "Partido único" },
  { ronda: "Dieciseisavos", cuando: "16 de diciembre", formato: "Partido único" },
  { ronda: "Octavos y cuartos", cuando: "Enero (una sola fuente; por confirmar)", formato: "Partido único" },
  { ronda: "Semifinales", cuando: "10 de febrero y 3 de marzo", formato: "Doble partido" },
  { ronda: "Final", cuando: "Sábado 24 de abril de 2027", formato: "Partido único" },
];

export const PREVIA_EQUIPOS = [
  { comunidad: "Comunitat Valenciana", equipo: "CF UE Tavernes de la Valldigna", via: "Campeón de «La Nostra Copa» (Copa Comunitat Mediterrània)", fiabilidad: "🟢" },
  { comunidad: "Andalucía", equipo: "UD Maracena", via: "Campeón de la Copa Andalucía sénior, fase oriental", fiabilidad: "🟢" },
  { comunidad: "Andalucía", equipo: "UB Lebrijana", via: "Campeón de la otra fase de la Copa Andalucía sénior (presumiblemente la occidental)", fiabilidad: "🟡" },
  { comunidad: "Madrid", equipo: "AD Sporting Hortaleza", via: "Campeón de la Copa RFFM de Aficionados", fiabilidad: "🟡" },
  { comunidad: "Región de Murcia", equipo: "UD Pinatar", via: "Campeón de la Supercopa de la FFRM", fiabilidad: "🟡" },
  { comunidad: "Galicia", equipo: "Auriense CA", via: "Campeón de la Supercopa de Galicia", fiabilidad: "🟡" },
  { comunidad: "Cantabria", equipo: "SD Noja", via: "Campeón de la Copa RFCF «Vicente Pérez Soberón»", fiabilidad: "🟡" },
  { comunidad: "Asturias", equipo: "Ribadesella CF", via: "Campeón de la Copa Asturfútbol 2026", fiabilidad: "🟡" },
  { comunidad: "Navarra", equipo: "CD Baztán KE", via: "Campeón de la Supercopa navarra", fiabilidad: "🟡" },
  { comunidad: "Illes Balears", equipo: "CF San Rafael", via: "Campeón de la Copa Illes Balears", fiabilidad: "🟡" },
  { comunidad: "La Rioja", equipo: "CD Tedeón", via: "Mejor equipo no filial y no ascendido de la Regional Preferente 2025/26", fiabilidad: "🟡" },
  { comunidad: "Castilla y León", equipo: "CD San José", via: "Liga 2025/26, como mejor no ascendido (mecanismo deducido)", fiabilidad: "🟡" },
  { comunidad: "Aragón", equipo: "Atlético Calatayud", via: "Clasificado al cierre de 2025/26; mecanismo concreto sin confirmar", fiabilidad: "🟡" },
  { comunidad: "Ceuta", equipo: "CD Ceuta 6 de Junio", via: "Campeón de la Regional Preferente de Ceuta 2025/26", fiabilidad: "🟡" },
  { comunidad: "Extremadura", equipo: "CP Talayuela", via: "Semifinalista de la Copa Extremadura, con plaza reasignada porque campeón y subcampeón ascendieron", fiabilidad: "🟡" },
  { comunidad: "Castilla-La Mancha", equipo: "Sporting de Alcázar", via: "Eliminatoria específica por la plaza frente al Manzanares CF (junio de 2026)", fiabilidad: "🟡" },
  { comunidad: "Canarias", equipo: "Atlético Unión Güímar", via: "Eliminatoria interinsular a doble partido frente a la UD Balos", fiabilidad: "🟡" },
  { comunidad: "País Vasco", equipo: "CD Anaitasuna", via: "Segundo de la División de Honor de Gipuzkoa 2025/26 y de la fase de ascenso a Tercera; la plaza fue un premio de consolación", fiabilidad: "🟡" },
  { comunidad: "Cataluña", equipo: "AE Prat", via: "Sin verificar (cuarto en la Lliga Elit 2025/26; no fue campeón de la Copa Catalunya)", fiabilidad: "🔴" },
  { comunidad: "Melilla", equipo: "Atlético Melilla CF", via: "Campeón de la Primera Autonómica de Melilla 2025/26; sin ascenso porque la plaza de Tercera la ocupa la UD Melilla", fiabilidad: "🟡" },
];

// penaltis: marcador de la tanda cuando el global acabó empatado; null si no la hubo.
export const PREVIA_ELIMINATORIAS = [
  { eliminatoria: "CD Anaitasuna – CD Tedeón", global: "10-2", penaltis: null, pasa: "CD Anaitasuna" },
  { eliminatoria: "Atlético Calatayud – CD Baztán", global: "4-1", penaltis: null, pasa: "Atlético Calatayud" },
  { eliminatoria: "UB Lebrijana – CD Ceuta 6 de Junio", global: "7-1", penaltis: null, pasa: "UB Lebrijana" },
  { eliminatoria: "UD Pinatar – Atlético Melilla", global: "11-0", penaltis: null, pasa: "UD Pinatar" },
  { eliminatoria: "Auriense CA – CD San José", global: "2-1", penaltis: null, pasa: "Auriense CA" },
  { eliminatoria: "Ribadesella CF – SD Noja", global: "2-1", penaltis: null, pasa: "Ribadesella CF" },
  { eliminatoria: "CP Talayuela – Sporting de Alcázar", global: "3-1", penaltis: null, pasa: "Sporting de Alcázar" },
  { eliminatoria: "UD Maracena – CF UE Tavernes", global: "1-1", penaltis: "4-2", pasa: "CF UE Tavernes de la Valldigna" },
  { eliminatoria: "Sporting Hortaleza – Atlético Unión Güímar", global: "4-3", penaltis: null, pasa: "Sporting Hortaleza" },
  { eliminatoria: "CF San Rafael – AE Prat", global: "1-10", penaltis: null, pasa: "AE Prat" },
];

// Los diez cruces de la primera eliminatoria con un Primera enfrente (local primero).
export const PRIMERA_CON_PRIMERA = [
  { dia: "martes 27", hora: "19:00", local: "Pinatar", visitante: "Elche" },
  { dia: "martes 27", hora: "21:00", local: "Sporting de Alcázar", visitante: "Málaga" },
  { dia: "miércoles 28", hora: "19:00", local: "Anaitasuna", visitante: "Alavés" },
  { dia: "miércoles 28", hora: "21:00", local: "Tavernes", visitante: "Valencia" },
  { dia: "jueves 29", hora: "19:00", local: "Lebrijana", visitante: "Getafe" },
  { dia: "jueves 29", hora: "19:00", local: "Atlético Calatayud", visitante: "Osasuna" },
  { dia: "jueves 29", hora: "21:00", local: "Prat", visitante: "Athletic" },
  { dia: "jueves 29", hora: "21:00", local: "Sporting Hortaleza", visitante: "Sevilla" },
  { dia: "jueves 29", hora: "21:00", local: "Ribadesella", visitante: "Racing de Santander" },
  { dia: "jueves 29", hora: "21:00", local: "Auriense", visitante: "Deportivo" },
];
