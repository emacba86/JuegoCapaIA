// Misiones. Los objetivos se cumplen en orden; "next" es la misión que se habilita al terminar.
// comingSoon: misión planificada pero todavía no desarrollada.
PD.data.quests = {
  tutorial: {
    module: 'Tutorial',
    title: 'Lunes, 9:00',
    objectives: [
      { id: 'rosa', text: 'Saludá a Rosa en recepción' },
      { id: 'pc',   text: 'Revisá tu correo en tu escritorio (open space)' },
    ],
    silent: true,
    next: 'm0',
    achievement: 'primer-dia',
  },

  m0: {
    module: 'Módulo 0 · Panorama general',
    title: 'El mail de Gerencia',
    objectives: [
      { id: 'gerente', text: 'Preguntale a Gustavo (Gerencia) qué espera exactamente' },
      { id: 'tito',    text: 'Pedile ayuda a Tito, el dev senior del open space' },
      { id: 'reto',    text: 'Superá el desafío de Tito: "Las capas de la IA"' },
      { id: 'cierre',  text: 'Volvé con Gustavo y proponele por dónde empezar' },
    ],
    reward: { rep: 1, coins: 50 },
    template: 'm0',
    keypoints: [
      'IA ⊃ Machine Learning ⊃ Deep Learning ⊃ IA Generativa ⊃ LLM. Claude, GPT y Gemini son LLMs.',
      'Un LLM predice el siguiente token: es excelente con texto, pero no "sabe" lo que no le diste y puede inventar con seguridad.',
      { $family: {
        negocio: 'Buen punto de partida para analistas: tareas de texto (minutas, historias de usuario, revisión de documentos) siempre con revisión humana.',
        default: 'Buen punto de partida: tareas de texto (resúmenes, borradores, revisión de documentos) siempre con revisión humana.',
      } },
    ],
    next: 'm1',
    achievement: 'm0',
  },

  m1: {
    module: 'Módulo 1 · Tokens',
    title: 'La moneda del reino',
    objectives: [
      { id: 'gerente', text: 'Preguntale a Gustavo qué necesita Finanzas' },
      { id: 'tito',    text: 'Pedile a Tito que te explique qué es un token' },
      { id: 'reto',    text: 'Superá el desafío de Tito: "El Tokenizador"' },
      { id: 'cierre',  text: 'Volvé con Gustavo y explicale cuánto "pesa" un documento' },
    ],
    reward: { rep: 1, coins: 50 },
    template: 'm1',
    keypoints: [
      'Un token es un pedacito de texto: una palabra, parte de una palabra o un signo. Todo se mide en tokens: el costo, la velocidad y los límites.',
      'El mismo contenido usa más tokens en español que en inglés, y más en JSON o tablas que en texto corrido.',
      'Se cobran aparte los tokens de entrada (lo que mandás) y los de salida (lo que genera el modelo). La salida es más cara por token, pero muchas veces lo que más pesa es el volumen de entrada.',
      'Las imágenes y los PDFs también se convierten en tokens.',
    ],
    next: 'm2',
    achievement: 'm1',
  },

  m2: {
    module: 'Módulo 2 · Contexto',
    title: 'El pasante sin memoria',
    comingSoon: true,
    objectives: [{ id: 'wip', text: 'Próximamente: Bruno, el pasante, te va a enseñar qué es el contexto' }],
  },
};

// Hoja de ruta completa (se muestra en el panel de misiones).
PD.data.roadmap = [
  { id: 'm0',  module: 'Módulo 0 · Panorama general', title: 'El mail de Gerencia' },
  { id: 'm1',  module: 'Módulo 1 · Tokens',           title: 'La moneda del reino' },
  { id: 'm2',  module: 'Módulo 2 · Contexto',         title: 'El pasante sin memoria' },
  { id: 'm3',  module: 'Módulo 3 · Consumo',          title: '¿Dónde se fue la plata?' },
  { id: 'm4',  module: 'Módulo 4 · Modelos',          title: 'El zoológico de modelos' },
  { id: 'm5',  module: 'Módulo 5 · Costos',           title: 'Finanzas ataca' },
  { id: 'm6',  module: 'Módulo 6 · Pensamiento',      title: 'La cafetera filósofa' },
  { id: 'm7',  module: 'Módulo 7 · Velocidad',        title: 'Carrera de respuestas' },
  { id: 'm8',  module: 'Módulo 8 · Prompting',        title: 'El arte de pedir' },
  { id: 'm9',  module: 'Módulo 9 · Herramientas, RAG y agentes', title: 'Mi primer agente' },
  { id: 'm10', module: 'Módulo 10 · Riesgos',         title: 'El incidente' },
  { id: 'm11', module: 'Módulo 11 · Proyecto integrador', title: 'La presentación final' },
];

PD.data.achievements = {
  'primer-dia':      { title: 'Primer día (otra vez)', text: 'Completaste el tutorial.' },
  'cebolla':         { title: 'Cebolla perfecta', text: 'Ordenaste las capas de la IA sin errores.' },
  'buen-criterio':   { title: 'Buen criterio', text: 'Respondiste todo el quiz de delegación sin errores.' },
  'm0':              { title: 'AI-First (de verdad)', text: 'Completaste el Módulo 0.' },
  'propuesta-sensata': { title: 'Propuesta sensata', text: 'Le propusiste a Gerencia un arranque realista.' },
  'balanza':         { title: 'Balanza de precisión', text: 'Adivinaste qué texto pesa más en tokens sin errores.' },
  'calculadora':     { title: 'Calculadora humana', text: 'Respondiste todo el quiz de tokens sin errores.' },
  'm1':              { title: 'Moneda corriente', text: 'Completaste el Módulo 1.' },
  'finanzas-feliz':  { title: 'Finanzas te saluda', text: 'Le explicaste a Gerencia el costo de un documento con números realistas.' },
};
