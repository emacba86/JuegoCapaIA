// Objetos interactivos. Por coordenada ("x,y") o, si no hay, por tipo de tile.
(function () {
  const Q = () => PD.quests;
  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

  PD.data.objects = {
    '14,5': {
      talk() {
        if (Q().isActive('tutorial') && !Q().has('tutorial', 'rosa')) {
          return [{ s: 'pc', t: 'Tu compu quiere instalar 47 actualizaciones. Mejor pasá primero por recepción: Rosa tiene tu acceso.' }];
        }
        if (Q().isActive('tutorial') && !Q().has('tutorial', 'pc')) {
          return [
            { s: 'pc', t: 'Tenés **1 correo nuevo** de Gerencia. Asunto: "URGENTE!!! IA".' },
            { s: 'mail', t: 'Equipo: a partir de hoy somos una empresa **AI-First**. Todos los equipos tienen que empezar a usar inteligencia artificial.' },
            { s: 'mail', t: 'Esperamos resultados concretos este trimestre. Ya se asignó un presupuesto de ByteCoins por persona.' },
            { s: 'mail', t: 'Saludos. — Gustavo, Gerencia. Enviado desde mi celular.' },
            { s: 'me', t: '…¿Y cómo? ¿En qué? ¿Con qué herramienta? El mail no dice nada.' },
            { s: 'narr', t: 'Parece que lo vas a tener que averiguar por tu cuenta. Gustavo anda por el open space, cerca de la sala de reuniones.' },
            { end() { Q().done('tutorial', 'pc'); } },
          ];
        }
        return [{ s: 'pc', t: 'Bandeja de entrada: 0 sin leer. 214 en "Leer después". Mejor no mirar.' }];
      },
    },
    '8,1': {
      talk: () => [
        { s: 'cafe', t: 'Una cafetera nueva "con IA". Tarda tres minutos en pensar antes de servir un cortado.' },
        { s: 'narr', t: 'Pista: la vas a volver a ver en el Módulo 6 (Pensamiento).' },
      ],
    },
    '19,4': {
      talk: () => [{ s: 'narr', t: 'La sala de reuniones está cerrada. Un cartel dice: "Reservada para la presentación final a Gerencia".' }],
    },
  };

  PD.data.tileTalk = {
    p: () => [{ s: 'narr', t: pick(['Una planta. Más hidratada que vos.', 'Un ficus de plástico. Nadie se anima a decírselo a Rosa.', 'Una planta con un post-it: "NO REGAR (es de plástico)".']) }],
    D: () => [{ s: 'narr', t: pick(['Un escritorio lleno de post-its que dicen "refinar".', 'Un escritorio con tres monitores y una taza que dice "Funciona en mi máquina".']) }],
    s: () => [{ s: 'narr', t: 'El sillón de las visitas. Ideal para esperar que compile.' }],
  };
})();
