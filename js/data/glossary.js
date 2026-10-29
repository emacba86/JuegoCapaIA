// Tarjetas de la Wiki. Se desbloquean durante el juego.
// simple: explicación con analogía · deeper: "Para profundizar"
// apply: cómo impacta en el trabajo, por familia ({ $family: { negocio: '…' } }). Si la familia no tiene la suya, no se muestra.
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
    deeper: 'El término aparece en 1955, en la propuesta del taller de Dartmouth, que se hizo en 1956. Durante décadas la IA fue mayormente "simbólica" (reglas escritas a mano). El boom actual viene de los modelos que aprenden de datos.',
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
    apply: { $family: { negocio: 'Para el analista: un LLM no conoce tu proyecto, tu cliente ni lo que se habló en la última reunión. Todo lo que necesite saber se lo tenés que dar.' } },
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
    apply: { $family: { negocio: 'Buenos primeros casos para analistas: resumir minutas, borradores de historias de usuario y criterios de aceptación, revisar un documento buscando ambigüedades, armar preguntas para un relevamiento.' } },
  },
  token: {
    module: 'm1',
    title: 'Token',
    simple: 'El pedacito de texto con el que trabaja un LLM: una palabra entera, parte de una palabra o un signo. Es como la ficha del casino: el modelo no ve letras ni palabras, ve fichas. Y todo se mide en fichas: el costo, la velocidad y cuánto texto entra.',
    deeper: 'Cuántos caracteres entran en un token depende del modelo y del idioma. Anthropic indica que, en sus modelos anteriores a Claude 4.7, un token equivale a unos 3,5 caracteres en inglés, y que los modelos más nuevos producen alrededor de un 30% más de tokens para el mismo texto. Para el número exacto, se usa el contador de tokens del proveedor.',
    apply: { $family: { negocio: 'Para el analista: cuando alguien pregunta "cuánto cuesta la IA", la respuesta empieza por "cuántos tokens". Un documento largo o un chat eterno se pagan por su tamaño.' } },
  },
  tokenizador: {
    module: 'm1',
    title: 'Tokenizador',
    simple: 'La parte que corta el texto en tokens antes de que el modelo lo lea. Las palabras frecuentes quedan enteras; las raras o largas se parten en pedazos ("anticonstitucionalmente" puede quedar en cinco).',
    deeper: 'La técnica más usada se basa en subpalabras: se arma un vocabulario con los pedazos de texto más frecuentes (por ejemplo, con el algoritmo BPE). Cada proveedor usa su propio tokenizador, así que el mismo texto puede dar cantidades distintas en Claude, GPT o Gemini.',
  },
  'tokens-idioma': {
    module: 'm1',
    title: 'Tokens e idioma',
    simple: 'Decir lo mismo en español suele usar más tokens que en inglés, porque los tokenizadores se armaron con mucho texto en inglés. También pesan más el JSON, las tablas y el código: las llaves, comillas y barras son tokens.',
    deeper: 'Hay estudios que muestran que el mismo contenido puede costar bastante más según el idioma: más tokens significa más costo, más demora y menos texto dentro del límite del modelo.',
    apply: { $family: { negocio: 'Para el analista: si pasás una planilla como tabla o como JSON, pesa más que el mismo dato en una frase. No es grave, pero en volúmenes grandes suma.' } },
  },
  'tokens-io': {
    module: 'm1',
    title: 'Entrada y salida',
    simple: 'Los tokens de **entrada** son todo lo que le mandás al modelo (tu pedido, documentos, historial). Los de **salida** son lo que genera. Se cobran aparte y la salida es varias veces más cara por token.',
    deeper: 'Costo = tokens de entrada × precio de entrada + tokens de salida × precio de salida. Los precios se publican por millón de tokens. Ojo: aunque la salida sea más cara por token, si mandás 20 páginas para recibir un párrafo, lo que más pesa es la entrada.',
  },
  'tokens-multimodal': {
    module: 'm1',
    title: 'Imágenes y PDFs',
    simple: 'Las capturas de pantalla, los diagramas y los PDFs también se convierten en tokens. Una imagen no es gratis por no tener texto.',
    deeper: 'Según la documentación de Anthropic, Claude mira las imágenes en bloques de 28×28 píxeles: una captura de 1.000×1.000 son unos 1.300 tokens. En un PDF, cada página usa típicamente entre 1.500 y 3.000 tokens de texto, más el costo de la página como imagen.',
    apply: { $family: { negocio: 'Para el analista: si solo necesitás el texto de un documento, pegar el texto suele salir más barato que adjuntar el PDF entero.' } },
  },
};
