// Same suite, run against the published site on GitHub Pages (npm run test:pages).
const base = require('./playwright.config.js');

module.exports = {
  ...base,
  use: { ...base.use, baseURL: 'https://emacba86.github.io/JuegoCapaIA/' },
  webServer: undefined,
};
