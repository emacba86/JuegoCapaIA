// Sprites de personajes hechos con CSS (sin imágenes).
(function () {
  PD.makeChar = function (look, extraClass, accessory) {
    const el = document.createElement('div');
    el.className = 'char' + (extraClass ? ' ' + extraClass : '');
    el.dataset.dir = 'down';
    el.style.setProperty('--skin', look.skin);
    el.style.setProperty('--hair', look.hair);
    el.style.setProperty('--shirt', look.shirt);
    el.style.setProperty('--pants', look.pants);
    el.innerHTML =
      '<span class="c-legs"></span>' +
      '<span class="c-body"></span>' +
      '<span class="c-head"><i class="l"></i><i class="r"></i></span>' +
      '<span class="c-hair"></span>' +
      (accessory ? '<span class="c-acc">' + accessory + '</span>' : '') +
      '<span class="c-marker">!</span>';
    return el;
  };

  PD.placeChar = function (el, x, y) {
    el.style.transform = 'translate(calc(' + x + ' * var(--tile)), calc(' + y + ' * var(--tile)))';
    el.style.zIndex = String(10 + y);
  };

  PD.DIRS = {
    up: [0, -1],
    down: [0, 1],
    left: [-1, 0],
    right: [1, 0],
  };
  PD.OPPOSITE = { up: 'down', down: 'up', left: 'right', right: 'left' };
})();
