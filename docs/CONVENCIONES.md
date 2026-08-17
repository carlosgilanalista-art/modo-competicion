# CONVENCIONES — Modo Competición

Reglas de trabajo sobre el repositorio. Se leen al arrancar cada sesión de Claude Code, no se asumen de memoria.

---

## 1. Norma de no-commit-no-autorizado

**Ningún commit ni push sin petición explícita en esa misma sesión.** Incluye archivos `.md`, documentación y cambios "obvios".

**Resolución de una contradicción aparente:** la Skill `estilo-modo-competicion` dice *"prefiero que actualices directamente el código/documento cuando el cambio está claro, en vez de solo describir qué habría que cambiar"*. Las dos reglas son compatibles porque hablan de cosas distintas:

| Acción | ¿Autorización previa? |
|---|---|
| Editar un fichero en el árbol de trabajo | **No.** Adelante, ese es el comportamiento preferido |
| `git commit` | **Sí, explícita** |
| `git push` | **Sí, explícita** |
| Fusionar a `main` | **Sí, explícita, y con gate pasado** |

En resumen: **editar sí, publicar no.** El punto de control está en el commit, no en el editor.

**Antecedente:** el 09/08/2026 se incumplió una vez — un `.md` de inventario de rutas commiteado y empujado a una rama de feature tras un "agrégalo al proyecto donde corresponda". Daño nulo, pero es exactamente la ambigüedad que esta tabla elimina.

---

## 2. Ramas

- **Una rama por tarea única de sesión.** Nombre descriptivo, en minúsculas y con guiones.
- **Al cerrar la sesión, la rama se resuelve:** se fusiona o se borra. **Nunca se deja abierta "por si acaso".**
- Si el trabajo no está terminado, la rama sigue viva pero **queda anotada en `ESTADO.md` § En curso, con su nombre escrito**.

**Regla de oro del gate:** una verificación sin nombre de rama declarado no vale nada. El gate del 09/08 era correcto y aun así generó tres días de incertidumbre porque no se anotó sobre qué rama se había ejecutado.

**Deuda conocida:** 35 ramas `claude/*` abiertas, 31 con commits fuera de la ancestría de `main`. La mayoría es residuo ya replicado en `main` por rebase o squash, así que el riesgo es de confusión, no de pérdida. Limpieza estimada: 20 minutos. **Congelada hasta después del 14/09/2026** — tocar ramas bajo presión de deadline es como se pierden cosas.

---

## 3. Gate antes de fusionar

No hay entorno de staging: **todo lo que entra en `main` sale a producción**. Por eso el gate no es opcional.

Un gate declarado incluye, siempre:

1. **Nombre de la rama** sobre la que se ha ejecutado
2. **Qué se ha comprobado**, en cantidades exactas (rutas que resuelven, conteos de eliminatorias por ronda), no en impresiones
3. **Veredicto explícito:** APTO o NO APTO

**Si el gate falla, se revierte la rama y no se toca `main`.** No se arregla al final de la sesión: un parche rápido en el minuto 95 es la peor decisión disponible.

---

## 4. Validación de datos

- Se validan **cantidades exactas**, nunca condiciones del tipo "parece que funciona".
- **Un total par no demuestra integridad** (ver `ARQUITECTURA.md` § 4).
- Mejor un error claro y ruidoso que un resultado incompleto silencioso.
- Si aparece una contradicción entre fuentes o un dato que no cuadra, se dice explícitamente en vez de suavizarlo o asumir que está bien.

---

## 5. Arranque y cierre de sesión en Code

**Arranque** — pegar tal cual:

```
Lee docs/ESTADO.md y docs/CONVENCIONES.md antes de nada.
Confírmame la tarea única de hoy y su criterio de hecho.
No toques ninguna rama ni hagas ningún commit hasta que yo lo pida explícitamente.
Si propongo algo fuera de esa tarea única, no lo evalúes ni lo empieces:
anótalo en el Aparcadero de ESTADO.md y recuérdame el criterio de hecho pendiente.
```

**Cierre** — última acción de la sesión, dentro del tiempo de sesión:

```
Cerramos. Actualiza docs/ESTADO.md: qué ha quedado hecho, qué queda en curso
y en qué rama, y qué ideas han ido al Aparcadero.
Dime también si hay ramas de esta sesión pendientes de fusionar o borrar.
```

---

## 6. Modelo y esfuerzo

| Tipo de tarea | Configuración |
|---|---|
| Ejecución recurrente: actualizar resultados, correcciones acotadas, crear ficheros ya redactados | Sonnet, esfuerzo medio, sin extended thinking |
| Arquitectura, contratos de datos, investigación crítica | Opus, esfuerzo alto |

La decisión de qué modelo usar se toma **al planificar la sesión**, no a mitad. Si a mitad de una sesión con Sonnet aparece algo que requiere Opus, eso es señal de que la tarea no estaba bien definida: va al Aparcadero, no se cambia de modelo sobre la marcha.
