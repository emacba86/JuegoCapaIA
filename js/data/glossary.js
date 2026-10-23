// Tarjetas de la Wiki. Se desbloquean durante el juego.
// simple: explicación con analogía · deeper: "Para profundizar" · analyst: cómo impacta en el trabajo del analista.
PD.data.glossary = {
  bytecoins: {
    module: 'tutorial',
    title: 'ByteCoins (₿c)',
    simple: 'La moneda del juego. Representan el presupuesto que Gerencia te asigna para experimentar con IA. Las malas decisiones (modelo equivocado, prompts ineficientes, errores en los desafíos) te hacen gastar de más.',
    deeper: 'Los precios en ₿c son ficticios pero proporcionales a los reales: un modelo grande cuesta más que uno chico y generar texto (output) cuesta más que leerlo (input). Para precios reales, consultá siempre la página oficial del proveedor.',
  },
  ia: {
    module: 'm0',
    title: 'Inteligencia Artificial (IA)',
    simple: 'El paraguas más grande: cualquier sistema que realiza tareas que asociamos a la inteligencia humana. Incluye desde reglas "si pasa X, hacé Y" hasta Claude o ChatGPT.',
    deeper: 'El término nace en 1956. Durante décadas la IA fue mayormente "simbólica" (reglas escritas a mano). El boom actual viene de los modelos que aprenden de datos.',
  },
  ml: {
    module: 'm0',
    title: 'Machine Learning (ML)',
    simple: 'IA que aprende patrones a partir de ejemplos en vez de seguir reglas escritas a mano. Como aprender a detectar spam viendo miles de mails, no leyendo un manual.',
    deeper: 'Ejemplos clásicos: scoring crediticio, recomendaciones, detección de fraude. Necesita datos de calidad: "basura entra, basura sale".',
  },
  dl: {
    module: 'm0',
    title: 'Deep Learning',
    simple: 'Machine Learning con redes neuronales de muchas capas. Es lo que permitió que las máquinas entiendan imágenes, audio y lenguaje.',
    deeper: 'En 2017 aparece la arquitectura Transformer ("Attention is all you need"), base de todos los modelos de lenguaje actuales.',
  },
  genai: {
    module: 'm0',
    title: 'IA Generativa',
    simple: 'Modelos que crean contenido nuevo: texto, imágenes, código, audio. No buscan una respuesta guardada: la generan.',
    deeper: 'Como generan en vez de buscar, pueden producir contenido muy convincente… y también incorrecto. Por eso la revisión humana sigue siendo clave.',
  },
  llm: {
    module: 'm0',
    title: 'LLM (modelo de lenguaje grande)',
    simple: 'IA generativa entrenada con enormes cantidades de texto. Claude (Haiku, Sonnet, Opus), GPT y Gemini son LLMs.',
    deeper: 'Tienen "fecha de corte": no saben lo que pasó después de su entrenamiento ni lo que pasa en tu proyecto, salvo que se lo pases en el mensaje.',
    analyst: 'Para el analista: un LLM no conoce tu proyecto, tu cliente ni lo que se habló en la última reunión. Todo lo que necesite saber se lo tenés que dar.',
  },
  'siguiente-token': {
    module: 'm0',
    title: 'Predecir el siguiente token',
    simple: 'Lo único que hace un LLM, en el fondo: mirar el texto que tiene y predecir qué pedacito de texto (token) viene después. Una y otra vez. Es el autocompletar del celular… con esteroides.',
    deeper: 'Como predice lo más probable y no lo "verdadero", puede inventar con total seguridad: eso se llama alucinación. Lo vemos en el módulo 10.',
  },
  'tareas-llm': {
    module: 'm0',
    title: '¿Qué le delego a un LLM?',
    simple: 'Bien: redactar, resumir, reformular, clasificar, extraer datos de texto, detectar inconsistencias, generar borradores. Con cuidado: cálculos exactos o datos que no tiene (necesita herramientas o que le pases la info). Nunca solo: decisiones con impacto sin revisión humana.',
    analyst: 'Buenos primeros casos para analistas: resumir minutas, borradores de historias de usuario y criterios de aceptación, revisar un documento buscando ambigüedades, armar preguntas para un relevamiento.',
  },
};
