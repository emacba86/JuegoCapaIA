// "Plantillas para llevarte": prompts y checklists listos para usar en el trabajo real.
PD.data.templates = {
  m0: {
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
  },
};
