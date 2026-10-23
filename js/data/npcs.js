// NPCs: posición, apariencia y diálogos.
// talk() devuelve una lista de pasos de diálogo:
//   { s: 'idHablante', t: 'texto' }       una línea ({name} = nombre del jugador, **negrita**)
//   { choices: [{ t, then: [pasos] }] }    opciones para el jugador
//   { fn() {} }                            acción en medio del diálogo
//   { end() {} }                           cierra el diálogo y ejecuta la acción
// marker() indica si el NPC muestra el "!" de misión.
(function () {
  const Q = () => PD.quests;

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
      marker: () => Q().isActive('m0') && (!Q().has('m0', 'gerente') || (Q().has('m0', 'reto') && !Q().has('m0', 'cierre'))),
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
            { s: 'gustavo', t: 'Hagamos así: averiguá de qué se trata todo esto y volvé con una propuesta de **por dónde empezar** con los analistas.' },
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
              { t: 'Que la IA haga sola el relevamiento con el cliente.', then: [
                { s: 'gustavo', t: '¡Me encanta! …Aunque, pensándolo: si inventa algo que el cliente nunca pidió, ¿quién da la cara?' },
                { s: 'me', t: 'Tenés razón. Mejor arrancar con tareas de texto donde siempre revisamos nosotros.' },
              ] },
              { t: 'Tareas de texto con revisión humana: minutas, historias de usuario y revisión de documentos.', then: [
                { s: 'gustavo', t: 'Concreto, medible y sin riesgo de que el robot le hable al cliente. Me gusta.' },
                { fn() { PD.achievements.unlock('propuesta-sensata'); } },
              ] },
              { t: 'Esperar a que la IA mejore y ver qué hace la competencia.', then: [
                { s: 'gustavo', t: 'Mmm, el mail decía AI-First, no AI-Después. Necesito algo para este trimestre.' },
                { s: 'me', t: 'Entendido. Arranquemos con tareas de texto chicas y con revisión: minutas, historias de usuario, revisión de documentos.' },
              ] },
            ] },
            { s: 'gustavo', t: 'Perfecto. Armalo con el chapter. Ah, y cuidá los ByteCoins: **Finanzas** ya me preguntó cuánto cuesta "la IA".' },
            { end() { Q().done('m0', 'cierre'); } },
          ];
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
      marker: () => Q().isActive('m0') && Q().has('m0', 'gerente') && !Q().has('m0', 'reto'),
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
        if (Q().isDone('m0')) {
          return [
            { s: 'tito', t: 'Lo próximo que tenés que entender son los **tokens**: la moneda con la que se paga todo esto.' },
            { s: 'sys', t: '🚧 La Misión 1 "La moneda del reino" está en construcción. ¡Pronto en tu oficina!' },
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
        return [
          { s: 'bruno', t: '¡Hola! Perdón, ¿cómo era tu nombre? Ah, {name}, cierto. Me olvido de todo lo que me dijeron hace un rato…' },
          { s: 'narr', t: 'Algo te dice que Bruno y los LLMs tienen más en común de lo que parece. 🤔 (Módulo 2)' },
        ];
      },
    },
  ];
})();
