// Modelos que aparecen en el juego. Único lugar a actualizar cuando salgan versiones nuevas.
// Los precios están en ByteCoins (₿c) por millón de tokens: son FICTICIOS pero mantienen
// las proporciones reales (Haiku < Sonnet < Opus; output más caro que input;
// caché y batch más baratos). Para precios reales, ver la página oficial del proveedor.
PD.data.models = {
  haiku:  { name: 'Haiku',  animal: '🐇', speed: 3, quality: 1, priceIn: 1, priceOut: 5,
            pitch: 'Rápido y barato. Ideal para tareas simples y de mucho volumen.' },
  sonnet: { name: 'Sonnet', animal: '🦊', speed: 2, quality: 2, priceIn: 3, priceOut: 15,
            pitch: 'Equilibrio entre calidad, velocidad y precio. El caballo de batalla.' },
  opus:   { name: 'Opus',   animal: '🦉', speed: 1, quality: 3, priceIn: 5, priceOut: 25,
            pitch: 'El más capaz. Para problemas complejos donde la calidad manda.' },
};

PD.data.pricing = {
  cacheReadFactor: 0.1, // leer de caché cuesta ~10% del input normal
  batchFactor: 0.5,     // procesamiento diferido: ~50% de descuento
};
