# ARQUITECTURA — Modo Competición

Decisiones técnicas permanentes. Lo que un chat nuevo no puede deducir del código sin leerlo entero.
Cambia poco. Si cambia, se anota también en `ESTADO.md` § Decisiones cerradas.

---

## 1. Simulador UEFA unificado

**Decisión:** un solo componente para Champions, Europa y Conference. No tres separados.

**Dónde vive:** `src/App.jsx` (~5142 líneas). Es una SPA React normal dentro de este mismo repo Vite, servida en producción como el resto del sitio — no un Claude Artifact externo.

**Motivo:** las tres competiciones se necesitan mutuamente: los perdedores de una alimentan a la siguiente. Separarlas en componentes independientes rompería ese flujo en vivo.

**Persistencia:** ninguna por ahora. Todo el estado es `useState`/`useMemo` en memoria de React; se pierde al recargar la página. Es una decisión pendiente, no un hecho consumado — queda por resolver si se añade persistencia real y con qué mecanismo.

**Cómo se resuelve:** estado React compartido mediante hooks encadenados.

```
useChampions()  →  useEuropa(cl)  →  useConference(cl, el)
```

Cada hook recibe el estado de los anteriores como argumento. No hay guardado ni recarga entre competiciones: los datos fluyen en vivo.

**Consecuencia práctica:** cualquier propuesta de "separar los simuladores para que el fichero sea más manejable" rompe el flujo entre competiciones. Si alguna vez se hace, hay que resolver antes el transporte de datos, no después.

---

## 2. Modo híbrido: datos reales y simulados conviviendo

**Contrato de datos:** los flags de origen van **a nivel de campo, no de eliminatoria**.

```
origen_ida    : "real" | "simulado"
origen_vuelta : "real" | "simulado"
```

**Motivo:** el estado natural durante una ronda en curso es "ida jugada, vuelta pendiente". Un flag por eliminatoria obligaría a elegir entre marcar como real algo que no lo es, o descartar un dato real ya disponible.

**Cascada de invalidación:** al cambiar un resultado confirmado, todo lo que dependía de él aguas abajo se marca como inválido en lugar de recalcularse en silencio. Un error visible es preferible a un resultado incompleto que parece correcto.

**Restauración:** existen "Restaurar sorteo real" (por ronda) y "Restaurar todos los reales" (global) para volver al estado de partida desde cualquier punto de simulación.

**Penaltis:** si no hay prórroga registrada, la eliminatoria se resuelve directamente por penaltis. No se asume prórroga por defecto.

---

## 3. Descenso entre competiciones

El descenso de perdedores ocurre **ronda a ronda**, no solo en la transición a la fase de liga:

- Perdedores de las rondas previas de Champions → rondas previas de Europa League
- Perdedores de las rondas previas de Europa League → rondas previas de Conference League

**Consecuencia:** las tablas de coeficientes de cada competición deben incluir a los equipos que pueden llegar desde la competición superior. Si no, un equipo desciende y no se le puede asignar bombo.

---

## 4. Validación por conteos

Todo cambio en datos de fase previa se valida contra el **número esperado de eliminatorias por ronda**, no contra "parece que funciona".

Referencias conocidas: UCL Q1 = 14 eliminatorias · UECL Q2 = 49 eliminatorias.

**Regla:** un total par no demuestra que los datos estén completos. Hubo un bug silencioso exactamente por eso — el sorteo de Ronda 3 de Europa League aceptó datos incompletos porque el total salía par. Se valida la cantidad exacta, siempre.

---

## 5. Casos singulares documentados

**Karviná (2026/27):** exclusión del club con reasignación de plaza en cascada a tres clubes. Es el **único caso documentado** de reasignación de plaza en esta temporada. Cualquier discrepancia de plazas que aparezca debe compararse primero con este caso antes de asumir un error de datos.

---

## 6. Despliegue

- Repositorio: `carlosgilanalista-art/modo-competicion`
- Stack: React + Vite
- Despliegue: Vercel, automático desde `main`
- Dominio: registrado en IONOS, DNS apuntando a Vercel

**Consecuencia:** todo lo que entra en `main` sale a producción. No hay entorno de staging. Por eso el gate previo a fusionar no es opcional (ver `CONVENCIONES.md`).
