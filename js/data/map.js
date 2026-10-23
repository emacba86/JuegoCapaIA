// Mapa de la oficina. Cada carácter es un tile:
//   #  pared            .  piso (open space)    ,  alfombra (recepción)   :  piso de madera (sala)
//   K  mostrador        D  escritorio           C  escritorio con compu   c  silla
//   T  mesa de reunión  s  sillón               p  planta                 M  máquina de café
//   L  puerta de la sala de reuniones (bloqueada hasta que se habilita)
PD.data.map = {
  rows: [
    '##########################',
    '#p,,,,,#M.........p#::::p#',
    '#,,,,,,#..DD..DD...#:TTT:#',
    '#,KKK,,#..cc..cc...#:TTT:#',
    '#,,,,,,,...........L:::::#',
    '#,,,,,,#..DD..CD...#:::::#',
    '#ss,,,,#..cc..cc...#::::p#',
    '#,,,,,,#.........p.#:::::#',
    '##########################',
  ],

  // Zonas: definen el piso base de los props y el nombre que muestra el HUD.
  zones: [
    { id: 'recepcion', name: 'Recepción',          x0: 0,  x1: 6,  floor: 'carpet' },
    { id: 'open',      name: 'Open space',         x0: 7,  x1: 18, floor: 'floor' },
    { id: 'sala',      name: 'Sala de reuniones',  x0: 19, x1: 25, floor: 'meet' },
  ],

  labels: [
    { x: 1,  y: 0, text: 'RECEPCIÓN' },
    { x: 9,  y: 0, text: 'OPEN SPACE · ANALISTAS' },
    { x: 20, y: 0, text: 'SALA DE REUNIONES' },
  ],

  start: { x: 3, y: 5, dir: 'up' },

  // Escritorio del jugador (resaltado con brillo).
  playerDesk: { x: 14, y: 5 },
};
