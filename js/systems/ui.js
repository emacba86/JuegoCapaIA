// Modales y notificaciones (toasts).
(function () {
  let current = null;

  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  // Formato mínimo para textos del juego: **negrita** y {name}.
  const fmt = (s) => esc(String(s).replace(/\{name\}/g, PD.state.name || ''))
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');

  PD.ui = {
    esc,
    fmt,

    /**
     * Abre un modal. opts: { title, html, buttons: [{ text, primary, onClick }], mode, onClose }
     * Devuelve { body, close }.
     */
    modal(opts) {
      const overlay = document.getElementById('overlay');
      if (current) this.close(true);

      overlay.innerHTML = '';
      const box = document.createElement('div');
      box.className = 'modal';
      box.setAttribute('role', 'dialog');
      box.setAttribute('aria-modal', 'true');
      box.innerHTML =
        '<header><h2></h2><button type="button" class="x" aria-label="Cerrar">✕</button></header>' +
        '<div class="body"></div>' +
        '<footer></footer>';
      box.querySelector('h2').textContent = opts.title || '';
      const body = box.querySelector('.body');
      if (typeof opts.html === 'string') body.innerHTML = opts.html;
      else if (opts.html) body.appendChild(opts.html);

      const footer = box.querySelector('footer');
      (opts.buttons || []).forEach((b) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'btn' + (b.primary ? ' primary' : '') + (b.danger ? ' danger' : '');
        btn.textContent = b.text;
        btn.addEventListener('click', () => (b.onClick ? b.onClick() : this.close()));
        footer.appendChild(btn);
      });
      if (!footer.children.length) footer.remove();

      box.querySelector('.x').addEventListener('click', () => this.close());
      overlay.appendChild(box);
      overlay.hidden = false;

      current = { onClose: opts.onClose, prevMode: PD.game.mode === 'title' ? 'title' : 'explore' };
      PD.game.setMode(opts.mode || 'modal');

      const focusable = footer.querySelector && footer.querySelector('.btn.primary');
      (focusable || box.querySelector('.x')).focus({ preventScroll: true });
      return { body, close: () => this.close() };
    },

    // silent: se cierra para abrir otro modal (no vuelve al modo exploración).
    close(silent) {
      if (!current) return;
      const c = current;
      current = null;
      const overlay = document.getElementById('overlay');
      overlay.hidden = true;
      overlay.innerHTML = '';
      if (!silent) {
        PD.game.setMode(c.prevMode);
        if (c.onClose) c.onClose();
      }
    },

    isOpen() {
      return !!current;
    },

    toast(text, kind) {
      const wrap = document.getElementById('toasts');
      const el = document.createElement('div');
      el.className = 'toast' + (kind ? ' ' + kind : '');
      el.innerHTML = fmt(text);
      wrap.appendChild(el);
      while (wrap.children.length > 4) wrap.firstChild.remove();
      setTimeout(() => el.remove(), 3100);
    },
  };
})();
