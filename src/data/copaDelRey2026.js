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

// ============================================================
// SIMULADOR (T1): previa real + 1ª eliminatoria. Fuentes: fase1 §4.1-4.3 (equipos, orden,
// local y grafía canónica) y resultados-y-cruces §2 y §4 (marcadores, día y hora).
// Los datos de arriba son los del artículo y no se tocan.
// ============================================================

// Orden de mayor a menor categoría 2026/27. "copa-fed" va por debajo de "tercera-fed" solo para poder
// ordenar: en este tramo únicamente se enfrenta a Primera, así que su orden relativo no se usa.
export const CATEGORIAS = [
  { id: "primera", nombre: "Primera" },
  { id: "segunda", nombre: "Segunda" },
  { id: "primera-fed", nombre: "Primera Federación" },
  { id: "segunda-fed", nombre: "Segunda Federación" },
  { id: "tercera-fed", nombre: "Tercera Federación" },
  { id: "copa-fed", nombre: "Copa Federación" },
  { id: "previa", nombre: "Previa (territorial)" },
];

// 126 inscritos = 102 directos + 20 de la previa + 4 de la Supercopa (entran en dieciseisavos, grupo null).
// grupo: grupo geográfico del sorteo (1-4). Los 20 de la previa llevan el de su cruce de la 1ª eliminatoria.
export const EQUIPOS = [
  { id: "elche-cf", nombre: "Elche CF", categoria: "primera", grupo: 3 },
  { id: "malaga-cf", nombre: "Málaga CF", categoria: "primera", grupo: 3 },
  { id: "deportivo-alaves", nombre: "Deportivo Alavés", categoria: "primera", grupo: 2 },
  { id: "valencia-cf", nombre: "Valencia CF", categoria: "primera", grupo: 3 },
  { id: "getafe-cf", nombre: "Getafe CF", categoria: "primera", grupo: 4 },
  { id: "ca-osasuna", nombre: "CA Osasuna", categoria: "primera", grupo: 2 },
  { id: "athletic-club", nombre: "Athletic Club", categoria: "primera", grupo: 2 },
  { id: "sevilla-fc", nombre: "Sevilla FC", categoria: "primera", grupo: 4 },
  { id: "real-racing-club", nombre: "Real Racing Club", categoria: "primera", grupo: 1 },
  { id: "rc-deportivo", nombre: "RC Deportivo", categoria: "primera", grupo: 1 },
  { id: "sestao-river-club", nombre: "Sestao River Club", categoria: "copa-fed", grupo: 2 },
  { id: "rcd-espanyol", nombre: "RCD Espanyol", categoria: "primera", grupo: 2 },
  { id: "rc-recreativo-de-huelva", nombre: "RC Recreativo de Huelva", categoria: "copa-fed", grupo: 4 },
  { id: "rayo-vallecano", nombre: "Rayo Vallecano", categoria: "primera", grupo: 4 },
  { id: "cda-navalcarnero", nombre: "CDA Navalcarnero", categoria: "copa-fed", grupo: 4 },
  { id: "real-betis", nombre: "Real Betis", categoria: "primera", grupo: 4 },
  { id: "salamanca-cf-uds", nombre: "Salamanca CF UDS", categoria: "copa-fed", grupo: 1 },
  { id: "rc-celta", nombre: "RC Celta", categoria: "primera", grupo: 1 },
  { id: "cd-manacor", nombre: "CD Manacor", categoria: "tercera-fed", grupo: 3 },
  { id: "villarreal-cf", nombre: "Villarreal CF", categoria: "primera", grupo: 3 },
  { id: "cd-tarancon", nombre: "CD Tarancón", categoria: "tercera-fed", grupo: 3 },
  { id: "levante-ud", nombre: "Levante UD", categoria: "primera", grupo: 3 },
  { id: "cd-cuarte", nombre: "CD Cuarte", categoria: "tercera-fed", grupo: 2 },
  { id: "girona-fc", nombre: "Girona FC", categoria: "segunda", grupo: 2 },
  { id: "cd-pamplona", nombre: "CD Pamplona", categoria: "tercera-fed", grupo: 2 },
  { id: "sd-eibar", nombre: "SD Eibar", categoria: "segunda", grupo: 2 },
  { id: "cf-trival-valderas-alcorcon", nombre: "CF Trival Valderas Alcorcón", categoria: "tercera-fed", grupo: 4 },
  { id: "cd-leganes", nombre: "CD Leganés", categoria: "segunda", grupo: 4 },
  { id: "cd-covadonga", nombre: "CD Covadonga", categoria: "tercera-fed", grupo: 1 },
  { id: "real-valladolid", nombre: "Real Valladolid", categoria: "segunda", grupo: 1 },
  { id: "cd-guijuelo", nombre: "CD Guijuelo", categoria: "tercera-fed", grupo: 1 },
  { id: "real-sporting-de-gijon", nombre: "Real Sporting de Gijón", categoria: "segunda", grupo: 1 },
  { id: "cd-laredo", nombre: "CD Laredo", categoria: "tercera-fed", grupo: 1 },
  { id: "burgos-cf", nombre: "Burgos CF", categoria: "segunda", grupo: 1 },
  { id: "cd-varea", nombre: "CD Varea", categoria: "tercera-fed", grupo: 2 },
  { id: "fc-andorra", nombre: "FC Andorra", categoria: "segunda", grupo: 2 },
  { id: "ud-castellonense", nombre: "UD Castellonense", categoria: "segunda-fed", grupo: 3 },
  { id: "ud-almeria", nombre: "UD Almería", categoria: "segunda", grupo: 3 },
  { id: "rsd-alcala", nombre: "RSD Alcalá", categoria: "segunda-fed", grupo: 4 },
  { id: "ud-las-palmas", nombre: "UD Las Palmas", categoria: "segunda", grupo: 4 },
  { id: "cd-atletico-paso", nombre: "CD Atlético Paso", categoria: "segunda-fed", grupo: 4 },
  { id: "cordoba-cf", nombre: "Córdoba CF", categoria: "segunda", grupo: 4 },
  { id: "utebo-fc", nombre: "Utebo FC", categoria: "segunda-fed", grupo: 2 },
  { id: "ce-sabadell", nombre: "CE Sabadell", categoria: "segunda", grupo: 2 },
  { id: "ud-poblense", nombre: "UD Poblense", categoria: "segunda-fed", grupo: 3 },
  { id: "ad-ceuta-fc", nombre: "AD Ceuta FC", categoria: "segunda", grupo: 3 },
  { id: "cd-alcoyano", nombre: "CD Alcoyano", categoria: "segunda-fed", grupo: 3 },
  { id: "rcd-mallorca", nombre: "RCD Mallorca", categoria: "segunda", grupo: 3 },
  { id: "cd-numancia", nombre: "CD Numancia", categoria: "segunda-fed", grupo: 1 },
  { id: "real-oviedo", nombre: "Real Oviedo", categoria: "segunda", grupo: 1 },
  { id: "cd-badajoz", nombre: "CD Badajoz", categoria: "segunda-fed", grupo: 4 },
  { id: "cd-tenerife", nombre: "CD Tenerife", categoria: "segunda", grupo: 4 },
  { id: "cs-puertollano", nombre: "CS Puertollano", categoria: "segunda-fed", grupo: 3 },
  { id: "albacete-balompie", nombre: "Albacete Balompié", categoria: "segunda", grupo: 3 },
  { id: "cd-cieza", nombre: "CD Cieza", categoria: "segunda-fed", grupo: 3 },
  { id: "granada-cf", nombre: "Granada CF", categoria: "segunda", grupo: 3 },
  { id: "xerez-cd", nombre: "Xerez CD", categoria: "segunda-fed", grupo: 4 },
  { id: "cadiz-cf", nombre: "Cádiz CF", categoria: "segunda", grupo: 4 },
  { id: "cd-atletico-baleares", nombre: "CD Atlético Baleares", categoria: "segunda-fed", grupo: 3 },
  { id: "cd-eldense", nombre: "CD Eldense", categoria: "segunda", grupo: 3 },
  { id: "ub-conquense", nombre: "UB Conquense", categoria: "segunda-fed", grupo: 3 },
  { id: "cd-castellon", nombre: "CD Castellón", categoria: "segunda", grupo: 3 },
  { id: "cf-calamocha", nombre: "CF Calamocha", categoria: "segunda-fed", grupo: 2 },
  { id: "ce-europa", nombre: "CE Europa", categoria: "primera-fed", grupo: 2 },
  { id: "ce-manresa", nombre: "CE Manresa", categoria: "segunda-fed", grupo: 2 },
  { id: "ue-sant-andreu", nombre: "UE Sant Andreu", categoria: "primera-fed", grupo: 2 },
  { id: "atletico-tordesillas", nombre: "Atlético Tordesillas", categoria: "segunda-fed", grupo: 1 },
  { id: "cd-mirandes", nombre: "CD Mirandés", categoria: "primera-fed", grupo: 1 },
  { id: "gimnastica-segoviana", nombre: "Gimnástica Segoviana", categoria: "segunda-fed", grupo: 1 },
  { id: "cultural-leonesa", nombre: "Cultural Leonesa", categoria: "primera-fed", grupo: 1 },
  { id: "ud-llanera", nombre: "UD Llanera", categoria: "segunda-fed", grupo: 1 },
  { id: "sd-ponferradina", nombre: "SD Ponferradina", categoria: "primera-fed", grupo: 1 },
  { id: "cd-ciudad-de-lucena", nombre: "CD Ciudad de Lucena", categoria: "segunda-fed", grupo: 4 },
  { id: "cf-rayo-majadahonda", nombre: "CF Rayo Majadahonda", categoria: "primera-fed", grupo: 4 },
  { id: "cd-don-benito", nombre: "CD Don Benito", categoria: "segunda-fed", grupo: 4 },
  { id: "cd-extremadura", nombre: "CD Extremadura", categoria: "primera-fed", grupo: 4 },
  { id: "cd-tudelano", nombre: "CD Tudelano", categoria: "segunda-fed", grupo: 2 },
  { id: "real-zaragoza", nombre: "Real Zaragoza", categoria: "primera-fed", grupo: 2 },
  { id: "arosa-sc", nombre: "Arosa SC", categoria: "segunda-fed", grupo: 1 },
  { id: "pontevedra-cf", nombre: "Pontevedra CF", categoria: "primera-fed", grupo: 1 },
  { id: "coruxo-fc", nombre: "Coruxo FC", categoria: "segunda-fed", grupo: 1 },
  { id: "zamora-cf", nombre: "Zamora CF", categoria: "primera-fed", grupo: 1 },
  { id: "club-portugalete", nombre: "Club Portugalete", categoria: "segunda-fed", grupo: 2 },
  { id: "real-union", nombre: "Real Unión", categoria: "primera-fed", grupo: 2 },
  { id: "pena-sport-fc", nombre: "Peña Sport FC", categoria: "segunda-fed", grupo: 2 },
  { id: "sd-huesca", nombre: "SD Huesca", categoria: "primera-fed", grupo: 2 },
  { id: "sd-amorebieta", nombre: "SD Amorebieta", categoria: "segunda-fed", grupo: 2 },
  { id: "ud-logrones", nombre: "UD Logroñés", categoria: "primera-fed", grupo: 2 },
  { id: "cp-mijas-las-lagunas", nombre: "CP Mijas-Las Lagunas", categoria: "segunda-fed", grupo: 3 },
  { id: "real-jaen", nombre: "Real Jaén", categoria: "primera-fed", grupo: 3 },
  { id: "reus-fc-reddis", nombre: "Reus FC Reddis", categoria: "segunda-fed", grupo: 2 },
  { id: "barakaldo-cf", nombre: "Barakaldo CF", categoria: "primera-fed", grupo: 2 },
  { id: "cd-minera", nombre: "CD Minera", categoria: "segunda-fed", grupo: 3 },
  { id: "fc-cartagena", nombre: "FC Cartagena", categoria: "primera-fed", grupo: 3 },
  { id: "rs-gimnastica-torrelavega", nombre: "RS Gimnástica Torrelavega", categoria: "segunda-fed", grupo: 1 },
  { id: "ud-ourense", nombre: "UD Ourense", categoria: "primera-fed", grupo: 1 },
  { id: "ud-sanse", nombre: "UD Sanse", categoria: "segunda-fed", grupo: 4 },
  { id: "cd-coria", nombre: "CD Coria", categoria: "primera-fed", grupo: 4 },
  { id: "real-avila-cf", nombre: "Real Ávila CF", categoria: "segunda-fed", grupo: 1 },
  { id: "unionistas-de-salamanca", nombre: "Unionistas de Salamanca", categoria: "primera-fed", grupo: 1 },
  { id: "antequera-cf", nombre: "Antequera CF", categoria: "primera-fed", grupo: 3 },
  { id: "aguilas-fc", nombre: "Águilas FC", categoria: "primera-fed", grupo: 3 },
  // Previa (20)
  { id: "cd-anaitasuna", nombre: "CD Anaitasuna", categoria: "previa", grupo: 2 },
  { id: "cd-tedeon", nombre: "CD Tedeón", categoria: "previa", grupo: 2 },
  { id: "atletico-calatayud", nombre: "Atlético Calatayud", categoria: "previa", grupo: 2 },
  { id: "cd-baztan-ke", nombre: "CD Baztán KE", categoria: "previa", grupo: 2 },
  { id: "ub-lebrijana", nombre: "UB Lebrijana", categoria: "previa", grupo: 4 },
  { id: "cd-ceuta-6-de-junio", nombre: "CD Ceuta 6 de Junio", categoria: "previa", grupo: 4 },
  { id: "ud-pinatar", nombre: "UD Pinatar", categoria: "previa", grupo: 3 },
  { id: "atletico-melilla-cf", nombre: "Atlético Melilla CF", categoria: "previa", grupo: 3 },
  { id: "auriense-ca", nombre: "Auriense CA", categoria: "previa", grupo: 1 },
  { id: "cd-san-jose", nombre: "CD San José", categoria: "previa", grupo: 1 },
  { id: "ribadesella-cf", nombre: "Ribadesella CF", categoria: "previa", grupo: 1 },
  { id: "sd-noja", nombre: "SD Noja", categoria: "previa", grupo: 1 },
  { id: "cp-talayuela", nombre: "CP Talayuela", categoria: "previa", grupo: 3 },
  { id: "emers-sporting-de-alcazar", nombre: "EMERS Sporting de Alcázar", categoria: "previa", grupo: 3 },
  { id: "ud-maracena", nombre: "UD Maracena", categoria: "previa", grupo: 3 },
  { id: "cf-ue-tavernes-de-la-valldigna", nombre: "CF UE Tavernes de la Valldigna", categoria: "previa", grupo: 3 },
  { id: "ad-sporting-hortaleza", nombre: "AD Sporting Hortaleza", categoria: "previa", grupo: 4 },
  { id: "atletico-union-guimar", nombre: "Atlético Unión Güímar", categoria: "previa", grupo: 4 },
  { id: "cf-san-rafael", nombre: "CF San Rafael", categoria: "previa", grupo: 2 },
  { id: "ae-prat", nombre: "AE Prat", categoria: "previa", grupo: 2 },
  // Supercopa (4)
  { id: "fc-barcelona", nombre: "FC Barcelona", categoria: "primera", grupo: null },
  { id: "real-madrid", nombre: "Real Madrid", categoria: "primera", grupo: null },
  { id: "real-sociedad", nombre: "Real Sociedad", categoria: "primera", grupo: null },
  { id: "atletico-de-madrid", nombre: "Atlético de Madrid", categoria: "primera", grupo: null },
];

// Previa a doble partido (26/09-11/10), toda real. A = primer citado (juega la ida en casa); el marcador de la vuelta
// va en el orden de estadoEliminatoria: vueltaA/vueltaB son los goles de A y de B (B es local en la vuelta).
// fiabilidad: 🟢 oficial · 🟡 por confirmar con acta (Güímar–Hortaleza: marcador de la vuelta y pase; Prat–San Rafael: marcador).
export const PREVIA = [
  { id: "PR-1", a: "cd-anaitasuna", b: "cd-tedeon", real: { idaA: 5, idaB: 0, vueltaA: 5, vueltaB: 2 }, fiabilidad: "🟢" },
  { id: "PR-2", a: "atletico-calatayud", b: "cd-baztan-ke", real: { idaA: 2, idaB: 0, vueltaA: 2, vueltaB: 1 }, fiabilidad: "🟢" },
  { id: "PR-3", a: "ub-lebrijana", b: "cd-ceuta-6-de-junio", real: { idaA: 5, idaB: 0, vueltaA: 2, vueltaB: 1 }, fiabilidad: "🟢" },
  { id: "PR-4", a: "ud-pinatar", b: "atletico-melilla-cf", real: { idaA: 8, idaB: 0, vueltaA: 3, vueltaB: 0 }, fiabilidad: "🟢" },
  { id: "PR-5", a: "auriense-ca", b: "cd-san-jose", real: { idaA: 2, idaB: 0, vueltaA: 0, vueltaB: 1 }, fiabilidad: "🟢" },
  { id: "PR-6", a: "ribadesella-cf", b: "sd-noja", real: { idaA: 1, idaB: 0, vueltaA: 1, vueltaB: 1 }, fiabilidad: "🟢" },
  { id: "PR-7", a: "cp-talayuela", b: "emers-sporting-de-alcazar", real: { idaA: 1, idaB: 2, vueltaA: 0, vueltaB: 1 }, fiabilidad: "🟢" },
  { id: "PR-8", a: "ud-maracena", b: "cf-ue-tavernes-de-la-valldigna", real: { idaA: 1, idaB: 1, vueltaA: 0, vueltaB: 0, penA: 2, penB: 4 }, fiabilidad: "🟢" },
  { id: "PR-9", a: "ad-sporting-hortaleza", b: "atletico-union-guimar", real: { idaA: 1, idaB: 0, vueltaA: 3, vueltaB: 3 }, fiabilidad: "🟡" },
  { id: "PR-10", a: "cf-san-rafael", b: "ae-prat", real: { idaA: 1, idaB: 5, vueltaA: 0, vueltaB: 5 }, fiabilidad: "🟡" },
];

// 1ª eliminatoria: 56 cruces a partido único, en el orden de fase1 §4.3. local/visitante: { equipo: id } o
// { previa: id de PREVIA } (el ganador de esa eliminatoria). Local = categoría inferior; Antequera–Águilas, el primero citado.
export const R1 = [
  { n: 1, id: "R1-01", local: { previa: "PR-4" }, visitante: { equipo: "elche-cf" }, dia: "2026-10-27", hora: "19:00", grupo: 3 },
  { n: 2, id: "R1-02", local: { previa: "PR-7" }, visitante: { equipo: "malaga-cf" }, dia: "2026-10-27", hora: "21:00", grupo: 3 },
  { n: 3, id: "R1-03", local: { previa: "PR-1" }, visitante: { equipo: "deportivo-alaves" }, dia: "2026-11-03", hora: "19:00", grupo: 2 },
  { n: 4, id: "R1-04", local: { previa: "PR-8" }, visitante: { equipo: "valencia-cf" }, dia: "2026-11-10", hora: "21:00", grupo: 3 },
  { n: 5, id: "R1-05", local: { previa: "PR-3" }, visitante: { equipo: "getafe-cf" }, dia: "2026-10-29", hora: "19:00", grupo: 4 },
  { n: 6, id: "R1-06", local: { previa: "PR-2" }, visitante: { equipo: "ca-osasuna" }, dia: "2026-10-29", hora: "19:00", grupo: 2 },
  { n: 7, id: "R1-07", local: { previa: "PR-10" }, visitante: { equipo: "athletic-club" }, dia: "2026-10-29", hora: "21:00", grupo: 2 },
  { n: 8, id: "R1-08", local: { previa: "PR-9" }, visitante: { equipo: "sevilla-fc" }, dia: "2026-10-29", hora: "21:00", grupo: 4 },
  { n: 9, id: "R1-09", local: { previa: "PR-6" }, visitante: { equipo: "real-racing-club" }, dia: "2026-10-29", hora: "21:00", grupo: 1 },
  { n: 10, id: "R1-10", local: { previa: "PR-5" }, visitante: { equipo: "rc-deportivo" }, dia: "2026-10-29", hora: "21:00", grupo: 1 },
  { n: 11, id: "R1-11", local: { equipo: "sestao-river-club" }, visitante: { equipo: "rcd-espanyol" }, dia: "2026-10-27", hora: "19:00", grupo: 2 },
  { n: 12, id: "R1-12", local: { equipo: "rc-recreativo-de-huelva" }, visitante: { equipo: "rayo-vallecano" }, dia: "2026-10-27", hora: "21:00", grupo: 4 },
  { n: 13, id: "R1-13", local: { equipo: "cda-navalcarnero" }, visitante: { equipo: "real-betis" }, dia: "2026-11-12", hora: "19:00", grupo: 4 },
  { n: 14, id: "R1-14", local: { equipo: "salamanca-cf-uds" }, visitante: { equipo: "rc-celta" }, dia: "2026-11-13", hora: "21:00", grupo: 1 },
  { n: 15, id: "R1-15", local: { equipo: "cd-manacor" }, visitante: { equipo: "villarreal-cf" }, dia: "2026-10-27", hora: "21:00", grupo: 3 },
  { n: 16, id: "R1-16", local: { equipo: "cd-tarancon" }, visitante: { equipo: "levante-ud" }, dia: "2026-11-05", hora: "19:00", grupo: 3 },
  { n: 17, id: "R1-17", local: { equipo: "cd-cuarte" }, visitante: { equipo: "girona-fc" }, dia: "2026-10-27", hora: "18:30", grupo: 2 },
  { n: 18, id: "R1-18", local: { equipo: "cd-pamplona" }, visitante: { equipo: "sd-eibar" }, dia: "2026-11-03", hora: "19:00", grupo: 2 },
  { n: 19, id: "R1-19", local: { equipo: "cf-trival-valderas-alcorcon" }, visitante: { equipo: "cd-leganes" }, dia: "2026-11-10", hora: "20:00", grupo: 4 },
  { n: 20, id: "R1-20", local: { equipo: "cd-covadonga" }, visitante: { equipo: "real-valladolid" }, dia: "2026-10-29", hora: "20:00", grupo: 1 },
  { n: 21, id: "R1-21", local: { equipo: "cd-guijuelo" }, visitante: { equipo: "real-sporting-de-gijon" }, dia: "2026-10-29", hora: "20:00", grupo: 1 },
  { n: 22, id: "R1-22", local: { equipo: "cd-laredo" }, visitante: { equipo: "burgos-cf" }, dia: "2026-10-29", hora: "20:00", grupo: 1 },
  { n: 23, id: "R1-23", local: { equipo: "cd-varea" }, visitante: { equipo: "fc-andorra" }, dia: "2026-10-29", hora: "20:00", grupo: 2 },
  { n: 24, id: "R1-24", local: { equipo: "ud-castellonense" }, visitante: { equipo: "ud-almeria" }, dia: "2026-10-27", hora: "19:45", grupo: 3 },
  { n: 25, id: "R1-25", local: { equipo: "rsd-alcala" }, visitante: { equipo: "ud-las-palmas" }, dia: "2026-10-27", hora: "20:00", grupo: 4 },
  { n: 26, id: "R1-26", local: { equipo: "cd-atletico-paso" }, visitante: { equipo: "cordoba-cf" }, dia: "2026-10-27", hora: "20:00", grupo: 4 },
  { n: 27, id: "R1-27", local: { equipo: "utebo-fc" }, visitante: { equipo: "ce-sabadell" }, dia: "2026-11-04", hora: "20:30", grupo: 2 },
  { n: 28, id: "R1-28", local: { equipo: "ud-poblense" }, visitante: { equipo: "ad-ceuta-fc" }, dia: "2026-10-29", hora: "19:00", grupo: 3 },
  { n: 29, id: "R1-29", local: { equipo: "cd-alcoyano" }, visitante: { equipo: "rcd-mallorca" }, dia: "2026-11-05", hora: "21:00", grupo: 3 },
  { n: 30, id: "R1-30", local: { equipo: "cd-numancia" }, visitante: { equipo: "real-oviedo" }, dia: "2026-10-29", hora: "20:00", grupo: 1 },
  { n: 31, id: "R1-31", local: { equipo: "cd-badajoz" }, visitante: { equipo: "cd-tenerife" }, dia: "2026-11-04", hora: "21:00", grupo: 4 },
  { n: 32, id: "R1-32", local: { equipo: "cs-puertollano" }, visitante: { equipo: "albacete-balompie" }, dia: "2026-11-04", hora: "20:45", grupo: 3 },
  { n: 33, id: "R1-33", local: { equipo: "cd-cieza" }, visitante: { equipo: "granada-cf" }, dia: "2026-10-29", hora: "20:30", grupo: 3 },
  { n: 34, id: "R1-34", local: { equipo: "xerez-cd" }, visitante: { equipo: "cadiz-cf" }, dia: "2026-10-29", hora: "21:00", grupo: 4 },
  { n: 35, id: "R1-35", local: { equipo: "cd-atletico-baleares" }, visitante: { equipo: "cd-eldense" }, dia: "2026-10-29", hora: "19:00", grupo: 3 },
  { n: 36, id: "R1-36", local: { equipo: "ub-conquense" }, visitante: { equipo: "cd-castellon" }, dia: "2026-10-29", hora: "20:00", grupo: 3 },
  { n: 37, id: "R1-37", local: { equipo: "cf-calamocha" }, visitante: { equipo: "ce-europa" }, dia: "2026-10-27", hora: "19:00", grupo: 2 },
  { n: 38, id: "R1-38", local: { equipo: "ce-manresa" }, visitante: { equipo: "ue-sant-andreu" }, dia: "2026-10-27", hora: "19:30", grupo: 2 },
  { n: 39, id: "R1-39", local: { equipo: "atletico-tordesillas" }, visitante: { equipo: "cd-mirandes" }, dia: "2026-10-27", hora: "20:00", grupo: 1 },
  { n: 40, id: "R1-40", local: { equipo: "gimnastica-segoviana" }, visitante: { equipo: "cultural-leonesa" }, dia: "2026-10-27", hora: "20:00", grupo: 1 },
  { n: 41, id: "R1-41", local: { equipo: "ud-llanera" }, visitante: { equipo: "sd-ponferradina" }, dia: "2026-10-27", hora: "20:00", grupo: 1 },
  { n: 42, id: "R1-42", local: { equipo: "cd-ciudad-de-lucena" }, visitante: { equipo: "cf-rayo-majadahonda" }, dia: "2026-10-27", hora: "20:00", grupo: 4 },
  { n: 43, id: "R1-43", local: { equipo: "cd-don-benito" }, visitante: { equipo: "cd-extremadura" }, dia: "2026-10-27", hora: "20:30", grupo: 4 },
  { n: 44, id: "R1-44", local: { equipo: "cd-tudelano" }, visitante: { equipo: "real-zaragoza" }, dia: "2026-10-27", hora: "21:00", grupo: 2 },
  { n: 45, id: "R1-45", local: { equipo: "arosa-sc" }, visitante: { equipo: "pontevedra-cf" }, dia: "2026-10-27", hora: "21:00", grupo: 1 },
  { n: 46, id: "R1-46", local: { equipo: "coruxo-fc" }, visitante: { equipo: "zamora-cf" }, dia: "2026-10-29", hora: "19:00", grupo: 1 },
  { n: 47, id: "R1-47", local: { equipo: "club-portugalete" }, visitante: { equipo: "real-union" }, dia: "2026-11-04", hora: "19:00", grupo: 2 },
  { n: 48, id: "R1-48", local: { equipo: "pena-sport-fc" }, visitante: { equipo: "sd-huesca" }, dia: "2026-10-29", hora: "19:00", grupo: 2 },
  { n: 49, id: "R1-49", local: { equipo: "sd-amorebieta" }, visitante: { equipo: "ud-logrones" }, dia: "2026-11-04", hora: "20:00", grupo: 2 },
  { n: 50, id: "R1-50", local: { equipo: "cp-mijas-las-lagunas" }, visitante: { equipo: "real-jaen" }, dia: "2026-10-29", hora: "20:00", grupo: 3 },
  { n: 51, id: "R1-51", local: { equipo: "reus-fc-reddis" }, visitante: { equipo: "barakaldo-cf" }, dia: "2026-11-04", hora: "20:30", grupo: 2 },
  { n: 52, id: "R1-52", local: { equipo: "cd-minera" }, visitante: { equipo: "fc-cartagena" }, dia: "2026-11-04", hora: "20:30", grupo: 3 },
  { n: 53, id: "R1-53", local: { equipo: "rs-gimnastica-torrelavega" }, visitante: { equipo: "ud-ourense" }, dia: "2026-10-29", hora: "20:30", grupo: 1 },
  { n: 54, id: "R1-54", local: { equipo: "ud-sanse" }, visitante: { equipo: "cd-coria" }, dia: "2026-10-29", hora: "19:00", grupo: 4 },
  { n: 55, id: "R1-55", local: { equipo: "real-avila-cf" }, visitante: { equipo: "unionistas-de-salamanca" }, dia: "2026-10-29", hora: "20:00", grupo: 1 },
  { n: 56, id: "R1-56", local: { equipo: "antequera-cf" }, visitante: { equipo: "aguilas-fc" }, dia: "2026-10-29", hora: "20:00", grupo: 3 },
];

// Resultados reales de la 1ª eliminatoria (40 jugados el 27 y 29/10; Mijas–Jaén aplazado y 15 por jugar, sin cargar), clave
// `local|visitante` con los nombres de EQUIPOS (el local es el real: para los cruces con ganador de la previa, el ganador real).
// Valor: { gA, gB, etA?, etB?, penA?, penB? } (A = local). En los 4 cruces con penaltis, etA/etB = 0-0 es una decisión de Carlos (30/10):
// NO está verificado si hubo prórroga ni su marcador; el motor la necesita para dar ganador.
export const R1_RESULTADOS_REAL = {
  "CD Cuarte|Girona FC": { gA: 0, gB: 2 }, // R1-17
  "UD Pinatar|Elche CF": { gA: 1, gB: 3 }, // R1-01
  "CF Calamocha|CE Europa": { gA: 0, gB: 3 }, // R1-37
  "Sestao River Club|RCD Espanyol": { gA: 4, gB: 3 }, // R1-11
  "UD Castellonense|UD Almería": { gA: 1, gB: 2 }, // R1-24
  "CD Ciudad de Lucena|CF Rayo Majadahonda": { gA: 0, gB: 1 }, // R1-42
  "RSD Alcalá|UD Las Palmas": { gA: 1, gB: 3 }, // R1-25
  "Gimnástica Segoviana|Cultural Leonesa": { gA: 0, gB: 1 }, // R1-40
  "Atlético Tordesillas|CD Mirandés": { gA: 3, gB: 3, etA: 0, etB: 0, penA: 2, penB: 4 }, // R1-39
  "UD Llanera|SD Ponferradina": { gA: 1, gB: 1, etA: 0, etB: 0, penA: 3, penB: 5 }, // R1-41
  "CD Don Benito|CD Extremadura": { gA: 2, gB: 4 }, // R1-43
  "CE Manresa|UE Sant Andreu": { gA: 2, gB: 2, etA: 0, etB: 0, penA: 1, penB: 4 }, // R1-38
  "CD Atlético Paso|Córdoba CF": { gA: 3, gB: 1 }, // R1-26
  "RC Recreativo de Huelva|Rayo Vallecano": { gA: 2, gB: 3 }, // R1-12
  "CD Manacor|Villarreal CF": { gA: 0, gB: 5 }, // R1-15
  "EMERS Sporting de Alcázar|Málaga CF": { gA: 0, gB: 3 }, // R1-02
  "CD Tudelano|Real Zaragoza": { gA: 0, gB: 4 }, // R1-44
  "Arosa SC|Pontevedra CF": { gA: 2, gB: 0 }, // R1-45
  "Peña Sport FC|SD Huesca": { gA: 1, gB: 5 }, // R1-48
  "CD Numancia|Real Oviedo": { gA: 3, gB: 3, etA: 0, etB: 0, penA: 4, penB: 2 }, // R1-30
  "UD Sanse|CD Coria": { gA: 1, gB: 2 }, // R1-54
  "UB Lebrijana|Getafe CF": { gA: 2, gB: 3 }, // R1-05
  "CD Atlético Baleares|CD Eldense": { gA: 0, gB: 1 }, // R1-35
  "UD Poblense|AD Ceuta FC": { gA: 1, gB: 2 }, // R1-28
  "Atlético Calatayud|CA Osasuna": { gA: 0, gB: 6 }, // R1-06
  "Coruxo FC|Zamora CF": { gA: 0, gB: 2 }, // R1-46
  "CD Cieza|Granada CF": { gA: 0, gB: 3 }, // R1-33
  "Antequera CF|Águilas FC": { gA: 2, gB: 0 }, // R1-56
  "UB Conquense|CD Castellón": { gA: 0, gB: 3 }, // R1-36
  "Real Ávila CF|Unionistas de Salamanca": { gA: 1, gB: 0 }, // R1-55
  "CD Laredo|Burgos CF": { gA: 2, gB: 4 }, // R1-22
  "CD Guijuelo|Real Sporting de Gijón": { gA: 1, gB: 3 }, // R1-21
  "CD Covadonga|Real Valladolid": { gA: 0, gB: 1 }, // R1-20
  "CD Varea|FC Andorra": { gA: 0, gB: 3 }, // R1-23
  "RS Gimnástica Torrelavega|UD Ourense": { gA: 3, gB: 1 }, // R1-53
  "AE Prat|Athletic Club": { gA: 1, gB: 6 }, // R1-07
  "AD Sporting Hortaleza|Sevilla FC": { gA: 0, gB: 3 }, // R1-08
  "Xerez CD|Cádiz CF": { gA: 1, gB: 3 }, // R1-34
  "Auriense CA|RC Deportivo": { gA: 0, gB: 3 }, // R1-10
  "Ribadesella CF|Real Racing Club": { gA: 0, gB: 2 }, // R1-09
};
