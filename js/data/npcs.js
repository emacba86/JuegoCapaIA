// NPCs: posición, apariencia y diálogos.
// talk() devuelve una lista de pasos de diálogo:
//   { s: 'idHablante', t: 'texto' }       una línea ({name} = nombre del jugador, **negrita**)
//   { choices: [{ t, then: [pasos] }] }    opciones para el jugador
//   { fn() {} }                            acción en medio del diálogo
//   { end() {} }                           cierra el diálogo y ejecuta la acción
// marker() indica si el NPC muestra el "!" de misión.
(function () {
  const Q = () => PD.quests;

  // Cierre del Módulo 0: tres propuestas por familia (arriesgada, sensata y pasiva).
  const M0_PROPOSALS = {
    negocio: {
      team: 'con los analistas',
      risky: 'Que la IA haga sola el relevamiento con el cliente.',
      riskyReply: '¡Me encanta! …Aunque, pensándolo: si inventa algo que el cliente nunca pidió, ¿quién da la cara?',
      sensible: 'Tareas de texto con revisión humana: minutas, historias de usuario y revisión de documentos.',
      sensibleReply: 'Concreto, medible y sin riesgo de que el robot le hable al cliente. Me gusta.',
      tasks: 'minutas, historias de usuario, revisión de documentos',
    },
    gestion: {
      team: 'con los equipos de proyecto',
      risky: 'Que la IA arme sola los cronogramas y se los mande a los clientes.',
      riskyReply: '¡Me encanta! …Aunque, pensándolo: si promete una fecha imposible, ¿quién da la cara?',
      sensible: 'Tareas de texto con revisión humana: reportes de estado, minutas de seguimiento y borradores de riesgos.',
      sensibleReply: 'Concreto, medible y sin que el robot le prometa nada al cliente. Me gusta.',
      tasks: 'reportes de estado, minutas de seguimiento, borradores de riesgos',
    },
    tecnica: {
      team: 'con desarrollo e infraestructura',
      risky: 'Que la IA escriba código y lo suba directo a producción.',
      riskyReply: '¡Me encanta! …Aunque, pensándolo: si rompe algo un viernes a la noche, ¿quién lo arregla?',
      sensible: 'Tareas con revisión humana: explicar código heredado, revisar pull requests y escribir documentación.',
      sensibleReply: 'Concreto, medible y sin que el robot toque producción. Me gusta.',
      tasks: 'explicar código, revisar pull requests, documentar',
    },
    calidad: {
      team: 'con QA y soporte',
      risky: 'Que la IA responda sola los reclamos de los clientes.',
      riskyReply: '¡Me encanta! …Aunque, pensándolo: si le promete al cliente algo que no hacemos, ¿quién da la cara?',
      sensible: 'Tareas de texto con revisión humana: casos de prueba, clasificación de tickets e informes de incidentes.',
      sensibleReply: 'Concreto, medible y sin que el robot le conteste solo al cliente. Me gusta.',
      tasks: 'casos de prueba, clasificación de tickets, informes de incidentes',
    },
    corporativa: {
      team: 'con Recursos Humanos y Administración',
      risky: 'Que la IA decida sola a quién contratar y qué facturas pagar.',
      riskyReply: '¡Me encanta! …Aunque, pensándolo: si descarta a alguien por un sesgo o paga una factura duplicada, ¿quién da la cara?',
      sensible: 'Tareas de texto con revisión humana: borradores de búsquedas, resúmenes de políticas y respuestas a proveedores, sin datos personales.',
      sensibleReply: 'Concreto, medible y sin que el robot decida por nosotros. Me gusta.',
      tasks: 'borradores de búsquedas, resúmenes de políticas, respuestas a proveedores',
    },
  };
  const proposal = () => PD.family.pick({ $family: Object.assign({ default: M0_PROPOSALS.negocio }, M0_PROPOSALS) });

  PD.data.npcs = [
    {
      id: 'rosa',
      name: 'Rosa',
      role: 'Recepción',
      x: 3, y: 2, dir: 'down',
      look: { skin: '#e0ac7e', hair: '#7a3b1e', shirt: '#e05d5d', pants: '#5b4b6b' },
      marker: () => Q().isActive('tutorial') && !Q().has('tutorial', 'rosa'),
      talk() {
        if (Q().isActive('tutorial') && !Q().has('tutorial', 'rosa')) {
          return [
            { s: 'rosa', t: '¡{name}! Buen día. ¿Viste el revuelo? Gerencia mandó un mail a todos a primera hora.' },
            { s: 'rosa', t: 'Te reactivé el acceso. Te explico rapidito cómo moverte por acá.' },
            { s: 'rosa', t: 'Caminás con las **flechas** o **WASD**. Para hablar o usar algo, mirá hacia eso y apretá **E** o **Enter**. En el celu tenés botones en pantalla.' },
            { s: 'rosa', t: 'Arriba ves tus **ByteCoins (₿c)**: el presupuesto de IA que te asignó Gerencia. Usalos con criterio, que cada error cuesta.' },
            { s: 'rosa', t: 'Con **M** ves tus misiones y con **G** la **Wiki**, donde queda guardado todo lo que vayas aprendiendo.' },
            { choices: [
              { t: '¿Qué decía el mail?', then: [
                { s: 'rosa', t: 'Ni idea, a mí no me llegó. Pero Gustavo pasó con cara de "tengo una idea". Eso nunca es buena señal. 😅' },
              ] },
              { t: '¡Gracias, Rosa!', then: [
                { s: 'rosa', t: '¡De nada! Que tengas un buen lunes. Dentro de lo posible.' },
              ] },
            ] },
            { s: 'rosa', t: 'Tu escritorio está en el **open space**, saliendo por la derecha. Es el de la compu que brilla.' },
            { fn() { PD.wiki.unlock('bytecoins'); Q().done('tutorial', 'rosa'); } },
          ];
        }
        if (Q().isActive('m0')) {
          return [{ s: 'rosa', t: 'Si buscás a Gustavo, anda por el open space, cerca de la puerta de la sala de reuniones.' }];
        }
        if (Q().isActive('m1')) {
          return [{ s: 'rosa', t: 'Gustavo anda nervioso: Finanzas le pidió números. Está en el open space, mirando el celular como si fuera a explotar.' }];
        }
        if (Q().isDone('m1')) {
          return [{ s: 'rosa', t: 'Me contaron que alguien de Finanzas sonrió en una reunión. Dicen que fue gracias a vos.' }];
        }
        if (Q().isDone('m0')) {
          return [{ s: 'rosa', t: 'Me dijeron que tu propuesta le gustó a Gustavo. ¡Ya te veo dando una charla en el chapter!' }];
        }
        return [{ s: 'rosa', t: 'Cualquier cosa, acá estoy.' }];
      },
    },

    {
      id: 'gustavo',
      name: 'Gustavo',
      role: 'Gerencia',
      x: 18, y: 5, dir: 'left',
      look: { skin: '#f0c8a0', hair: '#9aa0a6', shirt: '#34495e', pants: '#22272e' },
      marker: () => ['m0', 'm1'].some((m) => Q().isActive(m) && (!Q().has(m, 'gerente') || (Q().has(m, 'reto') && !Q().has(m, 'cierre')))),
      talk() {
        if (!Q().isDone('tutorial')) {
          return [{ s: 'gustavo', t: 'Ah, {name}. Leé tu correo primero y después hablamos. Es importante. Creo.' }];
        }
        if (Q().isActive('m0') && !Q().has('m0', 'gerente')) {
          return [
            { s: 'gustavo', t: '¡{name}! ¿Leíste mi mail? Ahora somos **AI-First**. Lo leí en un artículo en el avión.' },
            { choices: [
              { t: '¿Para qué tareas quieren que usemos IA?', then: [
                { s: 'gustavo', t: 'Para… las tareas. Las que den resultados. Ustedes son los expertos, ¿no?' },
              ] },
              { t: '¿Con qué herramienta y qué presupuesto?', then: [
                { s: 'gustavo', t: 'Te asigné unos **ByteCoins**. ¿Herramienta? La que tenga IA. Una buena.' },
              ] },
              { t: '¿Cómo vamos a medir los resultados?', then: [
                { s: 'gustavo', t: 'Con… ¿resultados? Mirá, quiero ver algo concreto antes de fin de trimestre.' },
              ] },
            ] },
            { s: 'gustavo', t: 'Hagamos así: averiguá de qué se trata todo esto y volvé con una propuesta de **por dónde empezar** ' + proposal().team + '.' },
            { s: 'gustavo', t: 'Tito, el dev senior, sabe de estas cosas. Siempre está hablando de "modelos". Yo pensé que era de moda.' },
            { fn() { Q().done('m0', 'gerente'); } },
          ];
        }
        if (Q().isActive('m0') && !Q().has('m0', 'reto')) {
          return [{ s: 'gustavo', t: 'Hablá con Tito y volvé con algo. ¡Pensá en grande! Pero barato.' }];
        }
        if (Q().isActive('m0') && !Q().has('m0', 'cierre')) {
          return [
            { s: 'gustavo', t: '¿Y? ¿Qué averiguaste? ¿Ya podemos reemplazar a todos por un robot?' },
            { s: 'me', t: 'No exactamente. Lo que vamos a usar son **LLMs**: modelos que predicen texto. Son muy buenos con el lenguaje, pero no saben nada de nuestros proyectos si no se lo damos.' },
            { s: 'gustavo', t: 'Ajá… ¿y entonces por dónde empezamos?' },
            { choices: [
              { t: proposal().risky, then: [
                { s: 'gustavo', t: proposal().riskyReply },
                { s: 'me', t: 'Tenés razón. Mejor arrancar con tareas de texto donde siempre revisamos nosotros.' },
              ] },
              { t: proposal().sensible, then: [
                { s: 'gustavo', t: proposal().sensibleReply },
                { fn() { PD.achievements.unlock('propuesta-sensata'); } },
              ] },
              { t: 'Esperar a que la IA mejore y ver qué hace la competencia.', then: [
                { s: 'gustavo', t: 'Mmm, el mail decía AI-First, no AI-Después. Necesito algo para este trimestre.' },
                { s: 'me', t: 'Entendido. Arranquemos con tareas chicas y con revisión: ' + proposal().tasks + '.' },
              ] },
            ] },
            { s: 'gustavo', t: 'Perfecto. Armalo con tu equipo. Ah, y cuidá los ByteCoins: **Finanzas** ya me preguntó cuánto cuesta "la IA".' },
            { end() { Q().done('m0', 'cierre'); } },
          ];
        }
        if (Q().isActive('m1') && !Q().has('m1', 'gerente')) {
          return [
            { s: 'gustavo', t: '{name}, tengo a **Finanzas** encima. Preguntan cuánto cuesta "la IA". Les dije que depende. Me pidieron que dependa en números.' },
            { choices: [
              { t: '¿Y qué dicen los proveedores?', then: [
                { s: 'gustavo', t: 'Que se cobra por **token**. Tanto por millón de tokens. ¿Un millón de qué? Ni idea.' },
              ] },
              { t: '¿No se paga por usuario, como una licencia?', then: [
                { s: 'gustavo', t: 'Eso pensé yo. Pero la factura de prueba dice "tokens". Muchos tokens.' },
              ] },
            ] },
            { s: 'gustavo', t: 'Averiguá qué es un token y cuánto "pesa" un documento nuestro. Tito seguro sabe: habla de eso en el almuerzo.' },
            { fn() { Q().done('m1', 'gerente'); } },
          ];
        }
        if (Q().isActive('m1') && !Q().has('m1', 'reto')) {
          return [{ s: 'gustavo', t: 'Hablá con Tito y traeme un número. Aunque sea aproximado. Finanzas ama los aproximados. Mentira, los odia.' }];
        }
        if (Q().isActive('m1') && !Q().has('m1', 'cierre')) {
          const fix = { s: 'me', t: 'Mejor lo hago bien: una página son entre 1.500 y 3.000 tokens. Las 40 páginas, entre **60.000 y 120.000** de entrada, más lo que genere de salida.' };
          return [
            { s: 'gustavo', t: '¿Y? Finanzas quiere saber cuántos tokens tiene el documento de requerimientos del cliente. Tiene **40 páginas**.' },
            { choices: [
              { t: 'Son 40 tokens: uno por página.', then: [
                { s: 'gustavo', t: '¿Cuarenta? ¡Regalado! Ya les escribo.' },
                { s: 'me', t: 'Esperá, me equivoqué. Un token es un pedacito de texto, no una página.' },
                fix,
              ] },
              { t: 'Entre 60.000 y 120.000 tokens de entrada. Más la salida, que se cobra aparte y más cara por token.', then: [
                { s: 'gustavo', t: 'Un rango, una explicación y la letra chica. Finanzas va a llorar de emoción.' },
                { fn() { PD.achievements.unlock('finanzas-feliz'); } },
              ] },
              { t: 'No se puede saber hasta que llegue la factura.', then: [
                { s: 'gustavo', t: 'Eso no se lo puedo decir a Finanzas. Me sacan la tarjeta corporativa.' },
                fix,
              ] },
            ] },
            { s: 'gustavo', t: '¿Y si en vez de pegar el texto le mandamos el PDF con todos los diagramas? ¿Cuesta lo mismo?' },
            { s: 'me', t: 'Más: las imágenes también son tokens. Si solo necesitamos el texto, conviene pegar el texto.' },
            { s: 'gustavo', t: 'Anotado. Ah, Bruno, el pasante, me preguntó por qué la IA "se olvida" de lo que le dijo. Pensé que era un tema de él. Parece que no.' },
            { end() { Q().done('m1', 'cierre'); } },
          ];
        }
        if (Q().isDone('m1')) {
          return [{ s: 'gustavo', t: 'Finanzas está contenta. Por primera vez en la historia de la empresa. No lo arruines.' }];
        }
        if (Q().isDone('m0')) {
          return [{ s: 'gustavo', t: 'Finanzas me preguntó cuánto cuesta un "token". ¿Vos sabés qué es un token? …Yo tampoco. Averigualo.' }];
        }
        return [{ s: 'gustavo', t: 'Estoy en una call. Bueno, esperando que empiece la call.' }];
      },
    },

    {
      id: 'tito',
      name: 'Tito',
      role: 'Dev senior',
      x: 11, y: 3, dir: 'down',
      look: { skin: '#d9a07a', hair: '#2b2b2b', shirt: '#1f3b2c', pants: '#2d3436' },
      accessory: '🎧',
      marker: () => ['m0', 'm1'].some((m) => Q().isActive(m) && Q().has(m, 'gerente') && !Q().has(m, 'reto')),
      talk() {
        const challenge = [
          { choices: [
            { t: '¡Dale, el desafío!', then: [
              { end() { PD.minigames.capas.start(() => Q().done('m0', 'reto')); } },
            ] },
            { t: 'Dame un minuto para repasar la Wiki.', then: [
              { s: 'tito', t: 'Dale. Cuando quieras, hablame de nuevo.' },
            ] },
          ] },
        ];

        if (Q().isActive('m0') && Q().has('m0', 'gerente') && !Q().has('m0', 'tito')) {
          return [
            { s: 'tito', t: '¿Te mandó Gustavo? Dejame adivinar: "usen IA" y nada más. Clásico.' },
            { s: 'tito', t: 'Vamos por partes. "IA" es un paraguas enorme. Pensalo como **muñecas rusas**: una adentro de la otra.' },
            { s: 'tito', t: 'La más grande es la **Inteligencia Artificial**: cualquier sistema que hace tareas "inteligentes", aunque sea con reglas escritas a mano.' },
            { s: 'tito', t: 'Adentro está el **Machine Learning**: sistemas que aprenden patrones de los datos en vez de seguir reglas.' },
            { s: 'tito', t: 'Más adentro, el **Deep Learning**: ML con redes neuronales de muchas capas. Eso destrabó imágenes, audio y lenguaje.' },
            { s: 'tito', t: 'Después viene la **IA Generativa**, que crea contenido nuevo. Y en el centro, los **LLMs**: modelos de lenguaje como Claude, GPT o Gemini.' },
            { choices: [
              { t: '¿Y qué hace un LLM, exactamente?', then: [] },
              { t: '¿Un LLM "entiende" lo que le digo?', then: [
                { s: 'tito', t: 'Eso da para un debate filosófico largo. En la práctica, se comporta como si entendiera muy bien el lenguaje. Pero mirá lo que hace por dentro…' },
              ] },
            ] },
            { s: 'tito', t: 'Un LLM hace una sola cosa: mira el texto y **predice el siguiente token**, que es un pedacito de texto. Una y otra vez. Es el autocompletar del celular con esteroides.' },
            { s: 'tito', t: 'Por eso es buenísimo para redactar, resumir o reformular. Pero **no sabe** lo que no le diste: tu proyecto, tu cliente, la reunión de ayer.' },
            { s: 'tito', t: 'Y como predice lo **probable** y no lo **verdadero**, a veces inventa con total seguridad. Eso se llama **alucinación**.' },
            { fn() {
              ['ia', 'ml', 'dl', 'genai', 'llm', 'siguiente-token', 'tareas-llm'].forEach((id) => PD.wiki.unlock(id, true));
              PD.ui.toast('📚 7 tarjetas nuevas en la Wiki', 'gold');
              Q().done('m0', 'tito');
            } },
            { s: 'tito', t: 'Te dejé todo anotado en la **Wiki** (tecla G). ¿Te animás a un desafío para ver si quedó claro?' },
            ...challenge,
          ];
        }
        if (Q().isActive('m0') && Q().has('m0', 'tito') && !Q().has('m0', 'reto')) {
          return [{ s: 'tito', t: '¿Listo para el desafío de las capas de la IA?' }, ...challenge];
        }
        if (Q().isActive('m0') && Q().has('m0', 'reto')) {
          return [{ s: 'tito', t: 'Bien ahí. Ahora andá a contarle a Gustavo. Y no le prometas un robot.' }];
        }
        const tokenChallenge = [
          { choices: [
            { t: '¡Dale, el Tokenizador!', then: [
              { end() { PD.minigames.tokens.start(() => Q().done('m1', 'reto')); } },
            ] },
            { t: 'Dame un minuto para repasar la Wiki.', then: [
              { s: 'tito', t: 'Dale. Las fichas no se van a ningún lado.' },
            ] },
          ] },
        ];

        if (Q().isActive('m1') && Q().has('m1', 'gerente') && !Q().has('m1', 'tito')) {
          return [
            { s: 'tito', t: '¿Finanzas pregunta por los tokens? Era cuestión de tiempo. Te explico.' },
            { s: 'tito', t: 'Un LLM no lee letras ni palabras: lee **tokens**, pedacitos de texto. Pensalo como las fichas del casino: el modelo solo juega con fichas.' },
            { choices: [
              { t: '¿Un token es una palabra?', then: [
                { s: 'tito', t: 'A veces. Las palabras comunes suelen ser un token. Las largas o raras se parten: "anticonstitucionalmente" puede quedar en cinco pedazos.' },
              ] },
              { t: '¿Y por qué no cuentan letras, directamente?', then: [
                { s: 'tito', t: 'Sería ineficiente: con piezas más grandes el modelo procesa más rápido. Y con pedazos chicos igual puede armar palabras que nunca vio. Los tokens son el punto medio.' },
              ] },
            ] },
            { s: 'tito', t: 'Y acá viene lo que le importa a Finanzas: **todo se cobra en tokens**. Lo que mandás (**entrada**) y lo que el modelo genera (**salida**), por separado. La salida es más cara.' },
            { s: 'tito', t: 'Dos detalles: en **español** gastamos más tokens que en inglés para decir lo mismo. Y las **imágenes y los PDFs** también cuentan.' },
            { choices: [
              { t: '¿Por qué en español se gastan más?', then: [
                { s: 'tito', t: 'Porque los tokenizadores se armaron con muchísimo texto en inglés. Muchas palabras en inglés tienen ficha propia; las nuestras se arman con más pedazos.' },
              ] },
              { t: '¿Una imagen? ¡Si no tiene texto!', then: [
                { s: 'tito', t: 'Igual se convierte en tokens. Claude la mira en cuadraditos de 28×28 píxeles: una captura de 1.000×1.000 son unos 1.300 tokens.' },
              ] },
            ] },
            { fn() {
              ['token', 'tokenizador', 'tokens-idioma', 'tokens-io', 'tokens-multimodal'].forEach((id) => PD.wiki.unlock(id, true));
              PD.ui.toast('📚 5 tarjetas nuevas en la Wiki', 'gold');
              Q().done('m1', 'tito');
            } },
            { s: 'tito', t: 'Te lo dejé en la **Wiki**. ¿Probamos tu ojo con el **Tokenizador**?' },
            ...tokenChallenge,
          ];
        }
        if (Q().isActive('m1') && Q().has('m1', 'tito') && !Q().has('m1', 'reto')) {
          return [{ s: 'tito', t: '¿Listo para el Tokenizador?' }, ...tokenChallenge];
        }
        if (Q().isActive('m1') && Q().has('m1', 'reto')) {
          return [{ s: 'tito', t: 'Bien ahí. Ahora andá con Gustavo, que Finanzas lo tiene acorralado.' }];
        }
        if (Q().isActive('m1')) {
          return [{ s: 'tito', t: 'Si es por lo de Finanzas, primero hablá con Gustavo. Él tiene los detalles. Bueno, "detalles".' }];
        }
        if (Q().isDone('m1')) {
          return [
            { s: 'tito', t: 'Ya sabés qué es un token. Lo próximo es entender cuántos entran en la "cabeza" del modelo. Bruno es el ejemplo perfecto.' },
            { s: 'sys', t: '🚧 La Misión 2 "El pasante sin memoria" está en construcción. ¡Pronto en tu oficina!' },
          ];
        }
        if (!Q().has('m0', 'gerente') && Q().isActive('m0')) {
          return [{ s: 'tito', t: 'Estoy en medio de un deploy. Si es por el mail de Gerencia… hablá primero con Gustavo, a ver qué quiere.' }];
        }
        return [{ s: 'tito', t: 'Buen día. Ahora no puedo, estoy en un deploy. 🫠' }];
      },
    },

    {
      id: 'vale',
      name: 'Vale',
      role: 'Product Owner',
      x: 15, y: 3, dir: 'down',
      look: { skin: '#f3d2b3', hair: '#b5523b', shirt: '#f2994a', pants: '#3a3f58' },
      talk() {
        if (Q().isDone('m1')) {
          return [{ s: 'vale', t: 'Me dijeron que sabés cuánto "pesa" un documento en tokens. No me digas cuánto pesa mi backlog. Prefiero no saberlo.' }];
        }
        if (Q().isActive('m1')) {
          return [{ s: 'vale', t: 'Escuché que en inglés se gastan menos tokens. ¿Y si le escribo las historias de usuario al cliente de Córdoba en inglés? …No, ¿no? No.' }];
        }
        if (Q().isDone('m0')) {
          return [{ s: 'vale', t: 'Me enteré de que vas a armar algo con IA para el chapter. ¡Anotame para probar historias de usuario!' }];
        }
        return [{ s: 'vale', t: 'Si la IA me escribe los criterios de aceptación en Gherkin, te invito un café. Bah, dos.' }];
      },
    },

    {
      id: 'bruno',
      name: 'Bruno',
      role: 'Pasante',
      x: 10, y: 6, dir: 'up',
      look: { skin: '#ffe0bd', hair: '#e2b13c', shirt: '#56ccf2', pants: '#4a5568' },
      talk() {
        const lines = [
          { s: 'bruno', t: '¡Hola! Perdón, ¿cómo era tu nombre? Ah, {name}, cierto. Me olvido de todo lo que me dijeron hace un rato…' },
          { s: 'narr', t: 'Algo te dice que Bruno y los LLMs tienen más en común de lo que parece. 🤔 (Módulo 2)' },
        ];
        if (Q().isDone('m1')) {
          lines.push({ s: 'sys', t: '🚧 La Misión 2 "El pasante sin memoria" está en construcción. ¡Pronto en tu oficina!' });
        }
        return lines;
      },
    },
  ];
})();
