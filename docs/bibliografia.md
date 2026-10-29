# Bibliografía · Prompt & Deploy

Fuentes que respaldan las definiciones de la Wiki, los diálogos y los desafíos. Cada entrada indica qué afirmación del juego sostiene.

> **Criterio:** priorizamos papers revisados por pares y documentación oficial de proveedores. Las analogías del juego (muñecas rusas, autocompletar con esteroides, el pasante sin memoria, la mochila de contexto) son recursos pedagógicos propios y no tienen respaldo bibliográfico: se presentan como metáforas, no como definiciones.

> **Vigencia:** las páginas de documentación de proveedores cambian seguido (precios, tokenizadores, límites). Consultadas en **octubre de 2026**. Revisarlas antes de cada edición del chapter.

## Módulo 0 · Panorama general

| Afirmación del juego | Dónde aparece | Fuente |
|---|---|---|
| El término "inteligencia artificial" aparece en 1955, en la propuesta del taller de Dartmouth, que se hizo en 1956. | Wiki: *Inteligencia Artificial* | [1] |
| El Machine Learning aprende patrones a partir de ejemplos en vez de seguir reglas escritas a mano. | Wiki: *Machine Learning*; diálogo de Tito | [2] |
| En 2017 aparece la arquitectura Transformer, base de los modelos de lenguaje actuales. | Wiki: *Deep Learning* | [3] |
| Un LLM se entrena para predecir el siguiente token a partir del texto anterior. | Wiki: *Predecir el siguiente token*; desafío de las capas | [4] |
| Un LLM es un modelo de lenguaje con muchos parámetros, entrenado con enormes cantidades de texto. | Wiki: *LLM* | [5] |
| Los modelos pueden generar contenido fluido pero incorrecto o no respaldado (alucinación). | Wiki: *IA Generativa*, *Predecir el siguiente token*; quiz de delegación | [6] |
| Que un modelo produzca lenguaje convincente no implica que "entienda" el significado. | Diálogo de Tito: "¿Un LLM entiende lo que le digo?" | [7] |

**Sin fuente académica (por diseño):**
- Jerarquía IA ⊃ ML ⊃ DL ⊃ IA Generativa ⊃ LLM: es una simplificación didáctica de consenso, no una taxonomía formal.
- "Basura entra, basura sale": refrán de la informática, se usa como dicho popular.

## Referencias

1. McCarthy, J., Minsky, M. L., Rochester, N. y Shannon, C. E. (1955). *A Proposal for the Dartmouth Summer Research Project on Artificial Intelligence*. Reeditado en *AI Magazine*, 27(4), 2006. <https://ojs.aaai.org/aimagazine/index.php/aimagazine/article/view/1904> · Texto original: <http://jmc.stanford.edu/articles/dartmouth.html>
2. Samuel, A. L. (1959). Some Studies in Machine Learning Using the Game of Checkers. *IBM Journal of Research and Development*, 3(3), 210–229. <https://doi.org/10.1147/rd.33.0210>
   - Ojo: la frase "darle a la computadora la capacidad de aprender sin ser programada explícitamente" se le atribuye a Samuel, pero es una paráfrasis posterior y no una cita textual del paper.
3. Vaswani, A., Shazeer, N., Parmar, N., Uszkoreit, J., Jones, L., Gomez, A. N., Kaiser, Ł. y Polosukhin, I. (2017). Attention Is All You Need. *Advances in Neural Information Processing Systems 30*. <https://arxiv.org/abs/1706.03762>
4. Radford, A., Wu, J., Child, R., Luan, D., Amodei, D. y Sutskever, I. (2019). *Language Models are Unsupervised Multitask Learners*. OpenAI. <https://cdn.openai.com/better-language-models/language_models_are_unsupervised_multitask_learners.pdf>
5. Anthropic. *Glossary* (entradas "Tokens", "Context window" y "LLM"). Documentación de Claude Platform. <https://platform.claude.com/docs/en/about-claude/glossary>
6. Ji, Z., Lee, N., Frieske, R., Yu, T., Su, D., Xu, Y., Ishii, E., Bang, Y. J., Madotto, A. y Fung, P. (2023). Survey of Hallucination in Natural Language Generation. *ACM Computing Surveys*, 55(12), artículo 248. <https://doi.org/10.1145/3571730>
7. Bender, E. M. y Koller, A. (2020). Climbing towards NLU: On Meaning, Form, and Understanding in the Age of Data. *Proceedings of ACL 2020*, 5185–5198. <https://doi.org/10.18653/v1/2020.acl-main.463>
