# 🎮 Prompt & Deploy

Juego 2D (HTML + CSS + JavaScript) para que **todas las áreas de la empresa** aprendan IA jugando, con contenido adaptado a cada familia de roles (Gestión, Técnica, Calidad y servicio, Negocio y Áreas corporativas): tokens, contexto, modelos, costos, pensamiento, velocidad, prompting, agentes y riesgos.

> Lunes, 9:00. Gerencia manda un mail: *"A partir de hoy somos una empresa AI-First"*. No dice cómo ni en qué. Te toca averiguarlo.

## Cómo jugar
1. Descargá o cloná el repo.
2. Abrí `index.html` en el navegador. No hace falta instalar nada ni levantar un servidor.

| Acción | Teclado | Celular |
|---|---|---|
| Moverse | Flechas / WASD | D-pad en pantalla |
| Hablar / usar | E, Enter o Espacio | Botón **E** |
| Misiones | M | 📋 |
| Wiki | G | 📚 |
| Cerrar ventana | Esc | ✕ |

El progreso se guarda automáticamente en el navegador.

## Estado
- ✅ Tutorial, **Módulo 0: "El mail de Gerencia"** y **Módulo 1: "La moneda del reino"** jugables, con desafío, Wiki, logros y plantilla para llevarte.
- ⏳ Módulos 2 a 11 en desarrollo (ver [docs/diseno.md](docs/diseno.md)).

## Pruebas
El juego no tiene dependencias. Las pruebas usan [Playwright](https://playwright.dev) y juegan como una persona: caminan con el teclado, hablan con los personajes y resuelven los desafíos.

```bash
npm install          # solo la primera vez (instala Playwright)
npm test             # contra una copia local (levanta tests/serve.js)
npm run test:headed  # lo mismo, mirando el navegador
npm run test:pages   # contra el sitio publicado en GitHub Pages
```

- Usan **Microsoft Edge** (ya viene en Windows). Para usar el Chromium de Playwright: `npx playwright install chromium` y `PW_CHANNEL=chromium npm test`.
- El reporte HTML queda en `playwright-report/` (`npx playwright show-report`).

| Archivo | Qué prueba |
|---|---|
| `tests/title.spec.js` | Pantalla de título, familias y sus integrantes, cambio de área en Opciones, partidas viejas. |
| `tests/mission0.spec.js` | Tutorial y Módulo 0 jugados con el teclado, una vez por familia. |
| `tests/mission1.spec.js` | Módulo 1 completo: Tokenizador, quiz, cierre con Gustavo (respuesta correcta y equivocada). |
| `tests/content.spec.js` | Que cada familia tenga diálogos, quiz, plantilla y notas de la Wiki completos. |

## Documentación
- 📘 [Guía del facilitador](docs/guia-facilitador.md): cómo usar el juego en encuentros del chapter, con preguntas de debate y actividades por módulo.
- 🛠️ [Documento de diseño](docs/diseno.md): mecánicas, hoja de ruta, estructura del código y cómo agregar misiones.
- 📖 [Bibliografía](docs/bibliografia.md): fuentes que respaldan cada definición del juego.

## Aviso
Proyecto educativo interno. Los precios del juego están en **ByteCoins (₿c) ficticios**, proporcionales a los reales. Para precios reales, consultá la página oficial de cada proveedor. Sin afiliación con los proveedores de IA mencionados.
