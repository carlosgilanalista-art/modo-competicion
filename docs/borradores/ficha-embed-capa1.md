# Ficha — Embed del simulador, capa 1 (domingo 29/11/2026)

Origen: decisión del 25/11 (Proyecto «Decisión estratégica · TAI y cartera») y cambio de alcance consciente del 26/11. Decisiones cerradas el 26/11 en MC · Arquitectura (ESTADO.md §6).

## Alcance
Solo la clasificación para la EURO 2028. Ruta: #/embed/euro2028?cliente=<id>&c1=<hex>&c2=<hex> (hex sin #, 6 caracteres).

## Paso 0 (solo lectura; informar antes de editar)
- Punta de origin/main tras git fetch.
- Líneas en src/App.jsx de: la cadena `vista`, SimuladorEuro2028Page, EQEtapa3Sorteo, EQEtapa4Grupos, EQEtapa4Resumen, EQEtapa5Repesca, EQEtapaFinal y el botón flotante «Danos tu opinión».
- Recuento de enlaces internos (href="#/) y de rejillas minmax(320px dentro de EQEtapa3Sorteo…EQEtapaFinal.
- index.html con gtag (G-J93TNQ8R8M); vercel.json ausente.
Si algo no coincide con esta ficha, parar y preguntar.

## Especificación
1. Ruta: rama "embed" la primera de la cadena `vista`. Parámetros leídos de la parte del hash tras "?". Competición distinta de euro2028 → mensaje «Competición no disponible» con enlace a modocompeticion.com en pestaña nueva.
2. Vista: EQEtapa3Sorteo, EQEtapa4Grupos, EQEtapa4Resumen, EQEtapa5Repesca y EQEtapaFinal con el mismo `eq`; título corto; sin enlaces de navegación ni texto introductorio largo; márgenes laterales de 12 px. Sin el botón flotante «Danos tu opinión» en esta vista. Los enlaces internos de esos componentes, dentro del embed, pasan a absolutos (https://modocompeticion.com/#/…) con target="_blank" rel="noopener noreferrer", o se quitan.
3. Marca: módulo puro src/data/embedClientes.js con la forma { id: { nombre, logo, c1, c2 } } y dos clientes de prueba ficticios, demo-a y demo-b, con logos SVG inventados en public/embed/ (ninguna marca real). c1 = acento (se pasa como colores = { ...TEMA_EQ, acento: c1 }); c2 = fondo de la banda de cabecera donde va el logo (el fondo general sigue siendo el de MC, para no romper el contraste). Los parámetros c1/c2 sustituyen a los del cliente si cumplen ^[0-9a-fA-F]{6}$; si no, se ignoran con console.warn. El logo solo sale del módulo (no hay parámetro logo). cliente se sanea a [a-z0-9-]{1,40}; si es desconocido o no viene → marca MC por defecto.
4. Atribución fija, siempre visible y no desactivable por parámetros: «Simulador de Modo Competición», enlace a https://modocompeticion.com/ (target _blank, rel noopener).
5. Cabeceras: no se toca nada (no hay vercel.json). Se comprueban en producción (parte B).
6. Responsive: en los componentes del embed, minmax(320px, 1fr) → minmax(min(320px, 100%), 1fr).
7. Analytics: al montar la vista embed, una vez por carga, gtag('event', 'embed_carga', { embed_comp: 'euro2028', embed_cliente, embed_origen }). Origen = location.ancestorOrigins[0] si existe; si no, el origen de document.referrer; si no, "directo". Fuera de iframe (window.top === window) → "sin_iframe". Si gtag no existe, no falla.
8. docs/EMBED.md: fragmento, parámetros, altura recomendada (800 px) y lista de clientes. Fragmento:
   <iframe src="https://modocompeticion.com/#/embed/euro2028?cliente=ID" width="100%" height="800" style="border:0;max-width:800px" loading="lazy" title="Simulador de la clasificación para la EURO 2028 · Modo Competición"></iframe>
9. docs/ARQUITECTURA.md: apartado del embed (ruta, parámetros, módulo de clientes, evento, cabeceras). docs/ESTADO.md al cierre.
Prohibido: tocar el motor (rnd5, generación de goles), el sorteo o EQ_SORTEO_REAL; datos personales o claves en el repo.

## Criterio de hecho
A. Antes de fusionar (Code), con cifras exactas:
- npx vite build limpio.
- Página de prueba scripts/embed-prueba.html (URL base configurable) con dos iframes, demo-a y demo-b, servida contra vite preview. Playwright a 360×740 y a 1280×900; en cada iframe:
  - 1 atribución con href a modocompeticion.com y target _blank;
  - logo cargado (naturalWidth > 0);
  - acento igual al c1 de su cliente (2 colores distintos entre iframes);
  - 0 botones «Danos tu opinión» y 0 enlaces href^="#/";
  - a 360 px, 0 desbordamiento horizontal (scrollWidth ≤ clientWidth); a 320 px solo se informa;
  - el sorteo simulado de la etapa 3 da 12 grupos A–L.
- Evento: interceptando las peticiones a GA con page.route, exactamente 1 embed_carga por iframe (2 en total), cada uno con su embed_cliente.
- c1=zzz → sin error y acento por defecto; cliente desconocido → marca MC.
- Rutas existentes: todas las de la cadena `vista` con texto idéntico a un build de origin/main (AFC por líneas ordenadas); recuento exacto.
- 0 errores de página salvo GA bloqueado por el proxy.
- Gate (CONVENCIONES §3): rama, git diff --stat, cifras, APTO/NO APTO.
B. Después de fusionar (Carlos, en producción):
- DevTools → Red: la respuesta de / no trae X-Frame-Options ni frame-ancestors.
- CodePen (o HTML local) con el fragmento de demo-a y el de demo-b, en móvil y en escritorio: carga, marca distinta y atribución visible.
- GA4 → Administrar → Definiciones personalizadas: registrar embed_cliente, embed_origen y embed_comp (ámbito de evento).
- GA4 → Tiempo real: aparece embed_carga con demo-a y con demo-b.
Si B falla en las cabeceras → tarea nueva (vercel.json), nunca un parche en caliente.

## Tiempo
Tope de 1 h 30 min; punto de control en el minuto 45. Orden de recorte (se quita empezando por el final): (1) ruta, vista, botón y enlaces, atribución y fragmento; (2) colores por parámetro; (3) evento de Analytics; (4) logo desde el módulo de clientes; (5) retoques para 320 px. Lo recortado pasa a «En curso» con su rama.
