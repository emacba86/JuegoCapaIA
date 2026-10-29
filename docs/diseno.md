# Documento de diseño · Prompt & Deploy

## Concepto
RPG 2D de oficina, con vista desde arriba. Sos analista funcional en **Bytefactory S.A.** Gerencia anuncia que la empresa es "AI-First" sin decir cómo ni en qué. Cada misión enseña un módulo del temario de IA.

- **Público:** todas las áreas de la empresa, agrupadas en familias de roles (ver "Familias").
- **Duración:** de 10 a 15 minutos por misión, unas 2 a 3 horas en total.
- **Tecnología:** HTML, CSS y JavaScript sin dependencias. Funciona abriendo `index.html` (`file://`), en desktop y en mobile.

## Familias
Al crear la partida, cada persona elige su área. La historia, los conceptos y los minijuegos son comunes; lo que cambia por familia es la bajada al trabajo: ejemplos, preguntas del quiz, plantillas y la nota aplicada de la Wiki.

| Familia | Roles |
|---|---|
| 📊 Gestión | Gerencia, Project Managers, Project Leaders |
| 🛠️ Técnica | Desarrolladores, Infraestructura y Seguridad |
| ✅ Calidad y servicio | Quality Assurance, Service Assurance |
| 💼 Negocio | Analistas funcionales |
| 🏢 Áreas corporativas | Recursos Humanos, Administración |

- Las familias se definen en `js/data/families.js`. Las partidas guardadas antes de que existieran quedan en **Negocio**. El área se puede cambiar desde ⚙️ Opciones.
- **Contenido por familia:** cualquier texto, lista o plantilla puede escribirse como `{ $family: { negocio: …, tecnica: …, default: … } }`. `PD.family.pick()` devuelve la variante de la familia actual; si no existe, la de `default`; si tampoco existe, nada (por ejemplo, la nota aplicada de la Wiki no se muestra).
- **Variables en los textos:** `{name}` (jugador), `{area}` (familia) y `{members}` (roles de la familia).
- **Estado:** los Módulos 0 y 1 tienen contenido para las cinco familias: quiz de delegación, plantilla del Módulo 0, puntos clave, notas aplicadas de la Wiki y la propuesta final a Gustavo. Los ejemplos por familia son tareas de trabajo, no definiciones: no llevan fuente bibliográfica.

## Mecánicas
| Mecánica | Detalle |
|---|---|
| Movimiento | Grilla con flechas/WASD o D-pad táctil. Hay colisiones con paredes, muebles y NPCs. |
| Diálogos | Efecto máquina de escribir, opciones y acciones. Se avanza con E/Enter/click. |
| Misiones | Objetivos en orden. Al completar una misión, se habilita la siguiente. |
| Desafíos | Minijuegos que validan lo aprendido. Los errores restan ₿c y siempre explican por qué. |
| Recursos | ₿c (presupuesto ficticio, proporcional a los precios reales) y ⭐ reputación. |
| Wiki | Tarjetas con explicación simple, "Para profundizar" y bajada para el analista. |
| Plantillas | Al terminar cada misión: un prompt o checklist para copiar y usar en el trabajo. |
| Logros | Reconocen el juego sin errores y las decisiones sensatas. |
| Guardado | `localStorage`. Si no está disponible, el juego funciona igual sin guardar. |

## Hoja de ruta
| Fase | Contenido | Estado |
|---|---|---|
| 1. Prototipo | Mapa, movimiento, NPCs, diálogos, HUD, guardado | ✅ |
| 2. Sistemas | Misiones, Wiki, logros, plantillas, opciones | ✅ |
| 3. Vertical slice | Tutorial + Módulo 0 con desafío | ✅ |
| 4. Contenido | Módulos 1 a 10 (nuevas zonas: Finanzas, Servidores, Soporte, Data center) | ⏳ Módulo 1 ✅ |
| 5. Final | Módulo 11, jefe final, 3 finales, resumen exportable de resultados | ⏳ |
| 6. Pulido | Sonido, testing con el chapter, ajustes | ⏳ |

## Misiones
| # | Misión | Módulo | Desafío |
|---|---|---|---|
| 0 | El mail de Gerencia | Panorama general | Capas de la IA + quiz de delegación ✅ |
| 1 | La moneda del reino | Tokens | Tokenizador: ¿cuál pesa más? + quiz de estimación ✅ |
| 2 | El pasante sin memoria | Contexto | Mochila de contexto (Tetris) |
| 3 | ¿Dónde se fue la plata? | Consumo | Auditar una factura de tokens |
| 4 | El zoológico de modelos | Modelos | Asignar tareas a Haiku, Sonnet u Opus |
| 5 | Finanzas ataca | Costos | Presupuestar un bot con caché y batch |
| 6 | La cafetera filósofa | Pensamiento | Elegir el nivel de *effort* |
| 7 | Carrera de respuestas | Velocidad | Carrera contra el reloj |
| 8 | El arte de pedir | Prompting | Armar un prompt por piezas |
| 9 | Mi primer agente | Herramientas, RAG, agentes | Conectar nodos de un flujo |
| 10 | El incidente | Riesgos | Detectar alucinación, injection y fuga de datos |
| 11 | La presentación final | Integrador | Batalla de preguntas contra Gerencia |

## Estructura del código
```
index.html            punto de entrada (scripts clásicos, sin módulos ES, para que funcione en file://)
css/                  base, mundo (tiles y sprites CSS), UI, minijuegos
js/pd.js              espacio de nombres global PD
js/data/              CONTENIDO: mapa, NPCs y diálogos, misiones, Wiki, plantillas, modelos, objetos
js/engine/            estado y guardado, mapa, personajes, jugador y cámara, input
js/systems/           diálogos, HUD, misiones/Wiki/logros/economía, paneles, modales
js/minigames/         un archivo por desafío
docs/                 guía del facilitador y este documento
```

## Cómo agregar una misión
1. **`js/data/quests.js`:** agregar la misión con `objectives`, `reward`, `template`, `keypoints` y `next`. Sacar `comingSoon`. Los `keypoints` que dependan del rol, por familia.
   - Todo lo aplicado (quiz, plantilla, nota `apply` de la Wiki, ejemplos) se escribe por familia, con un `default` para las que todavía no tengan la suya.
2. **`js/data/glossary.js`:** agregar las tarjetas con `module: 'mX'`.
3. **`js/data/templates.js`:** agregar la plantilla para llevarte.
4. **`js/data/npcs.js`:** agregar o modificar los diálogos de los NPCs. Usar `PD.quests.done('mX', 'objetivo')` para avanzar.
5. **`js/minigames/`:** crear el desafío (ver `capas.js` como modelo) e incluirlo en `index.html`.
6. **Nuevas zonas:** ampliar `rows` y `zones` en `js/data/map.js`.
7. **`docs/bibliografia.md`:** agregar la fuente de cada definición nueva (Wiki, diálogos y desafíos). Si algo es una analogía propia, aclararlo.

## Convenciones de contenido
- Español rioplatense (voseo), con tono de humor de oficina liviano.
- Ningún diálogo debe pasar de unos 3 cuadros seguidos sin que el jugador elija o haga algo.
- Cada concepto se presenta con una analogía primero y el término técnico después, siempre con su impacto en el trabajo del analista.
- Los errores no castigan fuerte: restan pocos ₿c y siempre explican por qué.
- Los precios están en ₿c ficticios y proporcionales. Los modelos y precios se mantienen en un solo lugar (`js/data/models.js`).
