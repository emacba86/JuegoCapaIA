# Guía del facilitador · Prompt & Deploy

Guía para quien coordine el juego en el **chapter de analistas**. Propone una dinámica de encuentros cortos donde cada misión del juego se convierte en una conversación aplicada al trabajo real.

> **Estado del juego:** el tutorial y el Módulo 0 son jugables. Los módulos 1 a 11 ya están planificados en esta guía y se habilitan a medida que se desarrollan. La guía se puede usar desde hoy: en los módulos que todavía no estén en el juego, la actividad práctica funciona igual.

---

## 1. Objetivo del programa

Que cada analista del chapter, al terminar:

1. Entienda **qué es y qué no es** un modelo de lenguaje (LLM).
2. Sepa explicar **tokens, contexto, modelos, costos, pensamiento y velocidad** con sus palabras.
3. Pueda **estimar el costo** de una solución con IA para incluirlo en una propuesta.
4. Tenga un set de **prompts y checklists propios** listos para usar (las "plantillas para llevarte").
5. Identifique **riesgos** (alucinaciones, datos sensibles, prompt injection) y sepa dónde poner revisión humana.
6. Haya armado, en equipo, **una propuesta de IA para un proceso real** (proyecto final).

---

## 2. Formato sugerido

| Aspecto | Recomendación |
|---|---|
| **Frecuencia** | Un encuentro por semana (o cada dos semanas). |
| **Duración** | 45 minutos. |
| **Cantidad** | 13 encuentros: kickoff + tutorial/M0, uno por módulo (1–10) y uno para la presentación final (M11). |
| **Modalidad** | Presencial o remota. Cada persona juega en su compu o celular. |
| **Tamaño** | Ideal de 6 a 15 personas. Para debates, subgrupos de 3–4. |

### Estructura de cada encuentro (45 min)

| Tiempo | Bloque | Qué pasa |
|---|---|---|
| 0–5' | **Repaso** | Una pregunta rápida sobre el encuentro anterior. |
| 5–20' | **Juego** | Cada persona juega la misión de la semana (10–15 min). |
| 20–35' | **Debate** | Preguntas de la guía, en subgrupos o todo el grupo. |
| 35–43' | **Aplicación** | Cada persona prueba la "plantilla para llevarte" con un caso de su proyecto (sin datos sensibles). |
| 43–45' | **Cierre** | Una persona comparte un hallazgo. Se anticipa la misión siguiente. |

> **Tip:** si el tiempo es poco, que jueguen la misión **antes** del encuentro y usen los 45 minutos completos para debatir y aplicar.

---

## 3. Antes de empezar (checklist del facilitador)

- [ ] Jugar vos el tutorial y la misión del día (lleva 15 minutos).
- [ ] Compartir el link o el zip del juego. Funciona abriendo `index.html`, sin instalar nada.
- [ ] Confirmar qué **herramienta de IA aprobada** usa la empresa para la parte práctica, y bajo qué condiciones se pueden usar datos de proyectos.
- [ ] Preparar **un documento de ejemplo anonimizado** (una minuta, un requerimiento o un listado de tickets) para las actividades.
- [ ] Recordar las reglas del espacio: se aprende equivocándose, no hay preguntas tontas y **no se pegan datos de clientes** en herramientas no aprobadas.

### Sobre el juego
- **ByteCoins (₿c):** presupuesto ficticio. Los precios son inventados, pero **proporcionales** a los reales. Usalo para hablar de órdenes de magnitud, no de cifras exactas.
- **Wiki (tecla G):** guarda todo lo aprendido. Es un buen machete para el debate.
- **Plantillas para llevarte:** al terminar cada misión aparece un prompt o checklist para copiar. Es el puente entre el juego y el trabajo real.
- **Progreso:** se guarda en el navegador de cada persona. Si cambian de compu o de navegador, empiezan de nuevo.

---

## 4. Guía por encuentro

### Encuentro 0 · Kickoff + Tutorial + Módulo 0: "El mail de Gerencia"

**Objetivo:** ubicar a los LLMs dentro del mundo de la IA y detectar buenos primeros casos de uso para analistas.

**En el juego:** Gerencia manda un mail "AI-First" sin decir cómo ni en qué. El personaje habla con Gustavo (que no sabe nada), con Tito (que explica las capas de la IA) y supera un desafío: ordenar IA ⊃ ML ⊃ DL ⊃ IA Generativa ⊃ LLM, y decidir qué tareas de analista se le pueden delegar a un LLM.

**Conceptos clave:**
- Un LLM **predice el siguiente token**. Es muy bueno con el lenguaje, pero **no sabe** lo que no le diste.
- Puede inventar con seguridad (**alucinación**).
- Brilla con texto que vos le das: resumir, redactar, comparar, ordenar. Con cálculos exactos o información que no tiene, necesita ayuda.

**Preguntas para el debate:**
1. ¿Les pasó alguna vez que una IA les respondiera algo convincente y falso? ¿Cómo se dieron cuenta?
2. Del mail de Gustavo: ¿qué preguntas le harían a una gerencia real que pide "usar IA"?
3. ¿Qué tarea de su semana es 100% texto que podrían darle a un LLM?

**Actividad aplicada (8'):** cada persona lista **3 tareas** que hace seguido y las clasifica en "buen caso", "solo con ayuda" o "no". Después usa la plantilla *"¿Le sirve la IA a esta tarea?"* con una de ellas.

**Plantilla para llevarte:** "¿Le sirve la IA a esta tarea?" (prompt de evaluación).

**Errores comunes a anticipar:**
- Creer que la IA "busca en internet" siempre. Depende de la herramienta. El modelo en sí no lo hace.
- Pensar que "si lo dice con seguridad, debe ser cierto".

**Cierre / tarea opcional:** traer al próximo encuentro un documento propio (anonimizado) de unas 5 páginas.

---

### Encuentro 1 · Módulo 1: "La moneda del reino" (Tokens)

**Objetivo:** entender qué es un token y por qué todo (costo, velocidad, límites) se mide en tokens.

**En el juego:** Finanzas le pregunta a Gustavo cuánto cuesta "la IA". Tito explica qué es un token y presenta el **Tokenizador**: primero hay que elegir qué texto pesa más (español contra inglés, frase contra JSON y contra tabla) y ver cómo se corta en tokens; después, un quiz para estimar tokens y costos. Al final, hay que explicarle a Gustavo cuánto pesa un documento de 40 páginas.

> **Ojo:** los cortes en tokens del juego son ilustrativos (se hicieron con un tokenizador abierto). Cada modelo corta distinto; lo que se mantiene son las proporciones.

**Conceptos clave:**
- Un token es un **pedacito de texto**: una palabra, parte de una palabra o un signo.
- En **español** se usan más tokens que en inglés para decir lo mismo.
- Se distinguen tokens de **entrada** (lo que mandás) y de **salida** (lo que genera el modelo).
- Las imágenes y los PDFs también se convierten en tokens.

**Preguntas para el debate:**
1. Si un documento de requerimientos tiene 40 páginas, ¿cuántos tokens estiman? (Orden de magnitud: entre 60.000 y 120.000, porque una página usa típicamente entre 1.500 y 3.000 tokens según su densidad. Como PDF, se suma la imagen de cada página. Ver [bibliografía](bibliografia.md)).
2. ¿Por qué creen que las tablas o los JSON "pesan" distinto que el texto corrido?
3. ¿Qué parte de su trabajo genera más texto: lo que leen o lo que escriben?

**Actividad aplicada:** pasar el documento que trajeron por un contador de tokens (el de la herramienta aprobada o uno online, **sin datos sensibles**) y comparar entre todos.

**Plantilla para llevarte:** "Calculadora rápida de tokens": reglas prácticas para estimar sin herramientas.

---

### Encuentro 2 · Módulo 2: "El pasante sin memoria" (Contexto)

**Objetivo:** entender la ventana de contexto y por qué el modelo "se olvida".

**En el juego (planificado):** Bruno, el pasante, olvida todo lo que le dijeron. El minijuego es una "mochila de contexto", un Tetris donde hay que meter los mensajes sin pasarse del límite.

**Conceptos clave:**
- **Ventana de contexto:** el máximo de tokens que el modelo puede considerar de una vez.
- El modelo **no tiene memoria** entre llamadas. En un chat se reenvía toda la conversación cada vez.
- Por eso, **los chats largos son cada vez más caros y más lentos**, y la información del medio se puede "perder".

**Preguntas para el debate:**
1. ¿Les pasó que en un chat largo la IA "se olvidara" de algo que dijeron al principio?
2. En un relevamiento de varias reuniones, ¿cómo le darían contexto a la IA sin pegarle todo?
3. ¿Cuándo conviene empezar un chat nuevo?

**Actividad aplicada:** escribir un **"resumen de contexto" de 10 líneas** de su proyecto actual (anonimizado), reutilizable al comienzo de cualquier chat.

**Plantilla para llevarte:** "Ficha de contexto de proyecto".

---

### Encuentro 3 · Módulo 3: "¿Dónde se fue la plata?" (Consumo)

**Objetivo:** saber dónde se consumen los tokens en un uso real.

**En el juego (planificado):** en la sala de servidores hay que auditar una "factura de tokens" y marcar qué partes consumen más: instrucciones, historial, documentos, herramientas, pensamiento y respuesta.

**Conceptos clave:**
- En cada llamada se cuentan el *system prompt*, el historial, los adjuntos, las definiciones de herramientas, los resultados de las herramientas, el *thinking* y la respuesta.
- Los **agentes** hacen muchas llamadas en bucle, así que el consumo se multiplica.
- Usar una suscripción (con límites de uso) no es lo mismo que usar la API (pago por token).

**Preguntas para el debate:**
1. ¿Pegar la minuta completa o solo la parte relevante? ¿Qué se gana y qué se arriesga?
2. ¿Por qué un agente que "piensa y usa herramientas" puede costar 10 veces más que un chat?

**Actividad aplicada:** tomar un flujo propio (por ejemplo "leer un mail del cliente y redactar la respuesta") y estimar los tokens de cada parte.

**Plantilla para llevarte:** "Checklist antes de pegar un documento".

---

### Encuentro 4 · Módulo 4: "El zoológico de modelos" (Modelos)

**Objetivo:** elegir el modelo adecuado para cada tarea.

**En el juego (planificado):** tres robots, **Haiku 🐇** (rápido y barato), **Sonnet 🦊** (equilibrado) y **Opus 🦉** (el más capaz). Hay que asignarle a cada uno 6 tareas de analista. Elegir mal impacta en los ByteCoins.

**Conceptos clave:**
- Las familias de modelos tienen distintos tamaños, con un trade-off entre **calidad, velocidad y costo**.
- Regla de oro: **el modelo más chico que resuelva bien la tarea**.
- Hay modelos cerrados (por API) y abiertos (los podés correr vos). Los benchmarks orientan, pero lo que vale son **tus propias pruebas**.

**Preguntas para el debate:**
1. ¿Qué modelo usarían para clasificar 2.000 tickets? ¿Y para analizar un proceso de negocio complejo?
2. ¿Cómo armarían una prueba justa para comparar dos modelos en una tarea del proyecto?

**Actividad aplicada:** completar una tabla de 5 tareas propias × el modelo sugerido × el porqué.

**Plantilla para llevarte:** "Matriz de selección de modelo".

---

### Encuentro 5 · Módulo 5: "Finanzas ataca" (Costos)

**Objetivo:** estimar el costo de una solución con IA para incluirlo en una propuesta.

**En el juego (planificado):** Marta, de Finanzas, pide presupuestar un bot de 1.000 consultas por día. Hay que aplicar **caché** y **batch** para bajar el costo.

**Conceptos clave:**
- Los precios se expresan por **millón de tokens**, separados en entrada y salida. **La salida suele costar varias veces más.**
- **Prompt caching:** las partes repetidas se cobran mucho más barato.
- **Batch:** el procesamiento diferido tiene descuento.
- Fórmula base: **volumen × tokens por operación × precio**.
- Los precios reales cambian: **consultar siempre la página oficial**.

**Preguntas para el debate:**
1. ¿En qué propuestas recientes debería haber aparecido una línea de "costo de IA"?
2. ¿Qué supuestos hay que dejar explícitos al cliente (volumen, largo de documentos, picos)?

**Actividad aplicada:** en parejas, estimar el costo mensual de un caso de uso con dos modelos, con caché y sin caché, usando los precios oficiales vigentes.

**Plantilla para llevarte:** "Planilla de estimación de costos de IA".

---

### Encuentro 6 · Módulo 6: "La cafetera filósofa" (Pensamiento)

**Objetivo:** saber cuándo conviene que el modelo "piense" (razonamiento extendido) y cuándo no.

**En el juego (planificado):** la cafetera "con IA" piensa demasiado antes de servir. Hay que elegir el nivel de esfuerzo (*effort*) para 5 problemas, sin quedarse corto ni pasarse.

**Conceptos clave:**
- El **razonamiento extendido** es pensamiento interno antes de responder.
- **Se cobra** (normalmente como tokens de salida) y **suma tiempo de espera**.
- Conviene en lógica, planificación y en detectar inconsistencias en reglas de negocio. No conviene en clasificar, extraer o redactar algo simple.

**Preguntas para el debate:**
1. ¿Qué tareas del análisis funcional requieren "pensar varios pasos"?
2. ¿Cuándo pagarían más por una mejor respuesta, y cuándo no?

**Actividad aplicada:** pedirle a la IA que detecte inconsistencias en un set de reglas de negocio (anonimizado), con y sin razonamiento extendido, y comparar.

**Plantilla para llevarte:** "Prompt para detectar inconsistencias en reglas de negocio".

---

### Encuentro 7 · Módulo 7: "Carrera de respuestas" (Velocidad)

**Objetivo:** entender la latencia y cómo afecta la experiencia.

**En el juego (planificado):** QA organiza una carrera. Hay que elegir modelo, *streaming* y largo de la salida para ganarle al reloj.

**Conceptos clave:**
- Hay que distinguir el **tiempo hasta el primer token** de los **tokens por segundo**.
- La velocidad depende del tamaño del modelo, del largo de la entrada y de la salida, y del *thinking*.
- El **streaming** muestra la respuesta a medida que se genera y mejora la espera percibida.
- Siempre hay un triángulo entre **calidad, velocidad y costo**.

**Preguntas para el debate:**
1. ¿Qué casos de uso de sus clientes necesitan respuesta en tiempo real y cuáles pueden esperar minutos u horas?
2. ¿Cómo lo reflejarían en un requerimiento no funcional?

**Actividad aplicada:** redactar **un requerimiento no funcional** de latencia y costo para una funcionalidad con IA.

**Plantilla para llevarte:** "Requerimientos no funcionales para funcionalidades con IA".

---

### Encuentro 8 · Módulo 8: "El arte de pedir" (Prompting)

**Objetivo:** escribir prompts que den buenos resultados con menos idas y vueltas.

**En el juego (planificado):** un cliente difícil. Hay que armar un prompt con piezas (rol, contexto, tarea, formato, ejemplo), y el resultado mejora según las piezas que se usen.

**Conceptos clave:**
- Un buen prompt tiene **rol, contexto, tarea, formato de salida y ejemplos**.
- Hay que distinguir el *system prompt* del mensaje del usuario, y los prompts con ejemplos de los que no los tienen.
- Conviene pedir **salidas estructuradas** (tablas, JSON, Gherkin).
- Iterar: el primer prompt casi nunca es el mejor.

**Preguntas para el debate:**
1. ¿Qué formato de historia de usuario y criterios de aceptación usa su equipo? ¿Se lo están dando como ejemplo a la IA?
2. ¿Qué diferencia notaron entre pedir "escribí historias de usuario" y un prompt completo?

**Actividad aplicada:** mejorar en **3 iteraciones** un prompt para generar historias de usuario y criterios de aceptación a partir de notas de relevamiento. Comparar los resultados en grupo.

**Plantilla para llevarte:** "Prompt de historias de usuario + criterios de aceptación (Gherkin)".

---

### Encuentro 9 · Módulo 9: "Mi primer agente" (Herramientas, RAG y agentes)

**Objetivo:** pasar de chatear a diseñar soluciones.

**En el juego (planificado):** se desbloquea el data center. Hay que armar un flujo conectando nodos: input → búsqueda en documentación (RAG) → herramienta → respuesta.

**Conceptos clave:**
- **Tool use:** el modelo llama funciones de tu sistema.
- **MCP:** el estándar para conectar modelos con herramientas y datos.
- **RAG:** buscar la información relevante y dársela al modelo.
- **Agente:** un modelo que planifica y ejecuta varios pasos con herramientas.
- Cuándo conviene prompting, cuándo RAG y cuándo fine-tuning.

**Preguntas para el debate:**
1. ¿Qué proceso de un cliente se podría automatizar con un agente? ¿Qué herramientas necesitaría?
2. ¿Dónde pondrían un "humano en el loop"?

**Actividad aplicada:** en grupos, diseñar en papel un agente para un proceso real: entradas, herramientas, datos que consulta, puntos de revisión humana y tokens estimados por ejecución.

**Plantilla para llevarte:** "Canvas de diseño de agente".

---

### Encuentro 10 · Módulo 10: "El incidente" (Riesgos)

**Objetivo:** usar la IA de forma responsable y segura.

**En el juego (planificado):** suena la alarma en Soporte. Hay que detectar una **alucinación**, un **prompt injection** y una **fuga de datos** en tres casos.

**Conceptos clave:**
- **Alucinaciones:** cómo mitigarlas con fuentes, RAG y verificación.
- **Datos sensibles:** qué nunca pegar y cómo usa cada proveedor los datos.
- **Prompt injection:** instrucciones maliciosas escondidas en documentos o mails que lee un agente.
- Sesgos y supervisión humana obligatoria.

**Preguntas para el debate:**
1. ¿Qué datos de nuestros clientes **nunca** deberían ir a una herramienta de IA?
2. Si una historia de usuario generada por IA incluye un requerimiento "inventado", ¿quién lo detecta y cuándo?

**Actividad aplicada:** armar entre todos el **checklist del chapter** "Antes de usar IA con información de un proyecto".

**Plantilla para llevarte:** "Checklist de datos sensibles y revisión humana".

---

### Encuentro 11 · Módulo 11: "La presentación final" (Proyecto integrador)

**Objetivo:** integrar todo en una propuesta concreta.

**En el juego (planificado):** se abre la sala de reuniones. El jefe final es Gustavo y su batalla de preguntas, que se responden con las cartas de la Wiki. Hay 3 finales posibles según los ByteCoins y la reputación.

**Actividad (todo el encuentro, o dos encuentros):** en grupos de 3–4, preparar una **propuesta de IA para un proceso real** (anonimizado) que incluya:
1. Tarea y criterio de "bien hecho".
2. Modelo elegido y por qué.
3. Prompt o diseño de la solución.
4. Costo mensual estimado (con supuestos).
5. Riesgos y puntos de revisión humana.

Cada grupo presenta en 5 minutos. El resto del chapter hace de "Gerencia" con preguntas.

**Cierre del programa:** compartir los resultados del juego (logros y ByteCoins finales), elegir **una propuesta para piloto real** y relevar feedback del programa.

---

## 5. Evaluación del programa

- **Antes y después:** el mismo quiz corto de 10 preguntas al inicio y al final. Se puede hacer con un formulario interno.
- **Uso real:** a las 4 semanas, preguntar quién usa al menos una plantilla en su trabajo.
- **Feedback:** qué misión fue la más útil, cuál sobra y qué falta.

## 6. Preguntas frecuentes del chapter

**¿Los precios del juego son reales?** No. Son ByteCoins ficticios con proporciones reales. Para presupuestos, usar siempre la página oficial del proveedor.

**¿Por qué el juego usa nombres de modelos de Claude?** Son ejemplos concretos y conocidos de una familia con distintos tamaños. Los conceptos aplican a cualquier proveedor.

**¿Puedo usar la IA con documentos de clientes?** Solo con las herramientas y condiciones que apruebe la empresa, y siempre aplicando el checklist de datos sensibles.

**¿Perdí mi progreso?** El progreso se guarda en el navegador. Si se borran los datos del sitio o se usa otro navegador, se empieza de nuevo.
