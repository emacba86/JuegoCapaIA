// "Plantillas para llevarte": prompts y checklists listos para usar en el trabajo real.
// Una plantilla puede ser común o por familia ({ $family: { negocio: {…}, default: {…} } }).
PD.data.templates = {
  m0: { $family: { default: {
    title: '¿Le sirve la IA a esta tarea?',
    intro: 'Usá este prompt con cualquier asistente (Claude, por ejemplo) para evaluar si una tarea tuya es buena candidata para IA.',
    text:
`Actuá como consultor/a de procesos con experiencia en IA generativa.
Soy analista funcional en una software factory. Esta es una tarea que hago seguido:

[DESCRIBÍ LA TAREA: qué hacés, con qué insumos, qué entregás y cada cuánto]

1. ¿Qué partes podría hacer bien un modelo de lenguaje (redactar, resumir, clasificar, extraer, revisar)?
2. ¿Qué partes NO conviene delegarle (cálculos exactos, datos que no tiene, decisiones con impacto)?
3. ¿Qué información o contexto necesitarías que te dé para hacerlo bien?
4. Proponé un primer prompt para probarlo y cómo revisaría yo el resultado.

Si te falta información, preguntame antes de suponer. No inventes datos del proyecto.`,
    note: 'Antes de pegar documentos reales: sacá nombres de clientes, datos personales y cualquier información confidencial (lo vemos a fondo en el módulo 10).',
  } } },
  m1: {
    title: 'Calculadora rápida de tokens',
    intro: 'Reglas prácticas para estimar tokens y costos sin herramientas. Sirven para un orden de magnitud; para el número exacto, usá el contador de tokens del proveedor.',
    text:
`CALCULADORA RÁPIDA DE TOKENS

1. Texto
   - En inglés, 1 token son unos 3,5 caracteres (modelos Claude anteriores a 4.7).
   - Los modelos más nuevos generan alrededor de 30% más tokens para el mismo texto.
   - En español, contale algunos tokens más que en inglés para decir lo mismo.
   - JSON, tablas y código pesan más que el mismo dato en texto corrido.

2. Documentos
   - 1 página: entre 1.500 y 3.000 tokens, según qué tan densa sea.
   - 40 páginas: entre 60.000 y 120.000 tokens.
   - Si va como PDF, sumale la imagen de cada página.

3. Imágenes
   - Tokens = (ancho / 28) x (alto / 28), redondeando hacia arriba.
   - Una captura de 1.000 x 1.000 píxeles: unos 1.300 tokens.

4. Costo
   - Costo = entrada x precio de entrada + salida x precio de salida.
   - Los precios se publican por millón de tokens: dividí los tokens por 1.000.000.
   - La salida es más cara por token, pero si mandás mucho para recibir poco, manda la entrada.
   - Multiplicá por cuántas veces se repite la tarea (por día, por mes).

Ejemplo: resumir un documento de 20 páginas en 1 página, 100 veces por mes.
   Entrada: 20 x 2.000 = 40.000 tokens. Salida: unos 2.000 tokens.
   Por mes: 4.000.000 de entrada y 200.000 de salida. Con eso, mirá la tabla de precios.`,
    note: 'Antes de pasar un documento real por un contador de tokens online, sacá datos de clientes y cualquier información confidencial.',
  },
};
