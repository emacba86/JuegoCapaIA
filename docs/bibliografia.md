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

## Módulo 1 · Tokens

| Afirmación del juego | Dónde aparece | Fuente |
|---|---|---|
| Un token es la unidad mínima con la que trabaja el modelo: puede ser una palabra, parte de una palabra, un signo o un byte. | Wiki: *Token*; diálogo de Tito | [5] |
| Los tokenizadores cortan el texto en subpalabras: las palabras frecuentes quedan enteras y las raras se parten en pedazos. | Wiki: *Tokenizador* | [8] |
| La cantidad de caracteres por token depende del modelo y del idioma. En modelos Claude anteriores a 4.7, un token equivale a unos 3,5 caracteres en inglés. Claude 4.7 y posteriores producen alrededor de 30% más tokens para el mismo texto. | Wiki: *Token*; plantilla *Calculadora rápida de tokens* | [5] |
| El mismo contenido usa más tokens en otros idiomas que en inglés (incluido el español), y por eso cuesta más. | Wiki: *Tokens e idioma*; desafío del Tokenizador | [9], [10] |
| Los precios se cobran por millón de tokens, separados en entrada y salida, y la salida cuesta varias veces más que la entrada. | Wiki: *Entrada y salida*; `js/data/models.js` | [11] |
| La caché de prompts y el procesamiento por lotes (batch) abaratan el costo. | `js/data/models.js` (`cacheReadFactor`, `batchFactor`) | [11], [12], [13] |
| Las imágenes se procesan en bloques de 28×28 píxeles: una imagen cuesta ⌈ancho/28⌉ × ⌈alto/28⌉ tokens visuales. | Wiki: *Imágenes y PDFs*; desafío del Tokenizador | [14] |
| Cada página de un PDF usa típicamente entre 1.500 y 3.000 tokens de texto, más el costo de la imagen de la página. | Wiki: *Imágenes y PDFs*; guía del facilitador | [15] |

**Nota sobre el desafío del Tokenizador:** los cortes en tokens que muestra el juego son **ilustrativos**. Cada modelo usa su propio tokenizador y el de Claude no está disponible offline. Las comparaciones relativas del desafío (qué texto usa más tokens) se verificaron con un tokenizador BPE abierto (`o200k_base`, de la librería `tiktoken`) como aproximación.

## Referencias

1. McCarthy, J., Minsky, M. L., Rochester, N. y Shannon, C. E. (1955). *A Proposal for the Dartmouth Summer Research Project on Artificial Intelligence*. Reeditado en *AI Magazine*, 27(4), 2006. <https://ojs.aaai.org/aimagazine/index.php/aimagazine/article/view/1904> · Texto original: <http://jmc.stanford.edu/articles/dartmouth.html>
2. Samuel, A. L. (1959). Some Studies in Machine Learning Using the Game of Checkers. *IBM Journal of Research and Development*, 3(3), 210–229. <https://doi.org/10.1147/rd.33.0210>
   - Ojo: la frase "darle a la computadora la capacidad de aprender sin ser programada explícitamente" se le atribuye a Samuel, pero es una paráfrasis posterior y no una cita textual del paper.
3. Vaswani, A., Shazeer, N., Parmar, N., Uszkoreit, J., Jones, L., Gomez, A. N., Kaiser, Ł. y Polosukhin, I. (2017). Attention Is All You Need. *Advances in Neural Information Processing Systems 30*. <https://arxiv.org/abs/1706.03762>
4. Radford, A., Wu, J., Child, R., Luan, D., Amodei, D. y Sutskever, I. (2019). *Language Models are Unsupervised Multitask Learners*. OpenAI. <https://cdn.openai.com/better-language-models/language_models_are_unsupervised_multitask_learners.pdf>
5. Anthropic. *Glossary* (entradas "Tokens", "Context window" y "LLM"). Documentación de Claude Platform. <https://platform.claude.com/docs/en/about-claude/glossary>
6. Ji, Z., Lee, N., Frieske, R., Yu, T., Su, D., Xu, Y., Ishii, E., Bang, Y. J., Madotto, A. y Fung, P. (2023). Survey of Hallucination in Natural Language Generation. *ACM Computing Surveys*, 55(12), artículo 248. <https://doi.org/10.1145/3571730>
7. Bender, E. M. y Koller, A. (2020). Climbing towards NLU: On Meaning, Form, and Understanding in the Age of Data. *Proceedings of ACL 2020*, 5185–5198. <https://doi.org/10.18653/v1/2020.acl-main.463>
8. Sennrich, R., Haddow, B. y Birch, A. (2016). Neural Machine Translation of Rare Words with Subword Units. *Proceedings of ACL 2016*, 1715–1725. <https://doi.org/10.18653/v1/P16-1162>
9. Petrov, A., La Malfa, E., Torr, P. H. S. y Bibi, A. (2023). Language Model Tokenizers Introduce Unfairness Between Languages. *Advances in Neural Information Processing Systems 36*. <https://arxiv.org/abs/2305.15425>
10. Ahia, O., Kumar, S., Gonen, H., Kasai, J., Mortensen, D. R., Smith, N. A. y Tsvetkov, Y. (2023). Do All Languages Cost the Same? Tokenization in the Era of Commercial Language Models. *Proceedings of EMNLP 2023*, 9904–9923. <https://aclanthology.org/2023.emnlp-main.614/>
11. Anthropic. *Pricing*. Documentación de Claude Platform. <https://platform.claude.com/docs/en/about-claude/pricing>
12. Anthropic. *Prompt caching*. Documentación de Claude Platform. <https://platform.claude.com/docs/en/build-with-claude/prompt-caching>
13. Anthropic. *Batch processing*. Documentación de Claude Platform. <https://platform.claude.com/docs/en/build-with-claude/batch-processing>
14. Anthropic. *Vision* (sección sobre el costo de las imágenes). Documentación de Claude Platform. <https://platform.claude.com/docs/en/build-with-claude/vision>
15. Anthropic. *PDF support* (sección "Estimate your costs"). Documentación de Claude Platform. <https://platform.claude.com/docs/en/build-with-claude/pdf-support>
