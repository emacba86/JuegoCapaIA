// Familias de roles. El contenido aplicado (ejemplos, quiz, plantillas, Wiki) se escribe por familia.
// Los conceptos y la historia son comunes a todas.
PD.data.families = {
  gestion:     { name: 'Gestión',            icon: '📊', members: ['Gerencia', 'Project Managers', 'Project Leaders'] },
  tecnica:     { name: 'Técnica',            icon: '🛠️', members: ['Desarrolladores', 'Infraestructura y Seguridad'] },
  calidad:     { name: 'Calidad y servicio', icon: '✅', members: ['Quality Assurance', 'Service Assurance'] },
  negocio:     { name: 'Negocio',            icon: '💼', members: ['Analistas funcionales'] },
  corporativa: { name: 'Áreas corporativas', icon: '🏢', members: ['Recursos Humanos', 'Administración'] },
};

// Familia de las partidas guardadas antes de que existieran las familias.
PD.data.defaultFamily = 'negocio';

PD.family = {
  id: () => (PD.data.families[PD.state.family] ? PD.state.family : PD.data.defaultFamily),
  get() { return PD.data.families[this.id()]; },
  members(id) { return PD.data.families[id || this.id()].members.join(', '); },

  // Contenido por familia: { $family: { negocio: X, default: Y } }.
  // Devuelve la variante de la familia actual, si no la de "default", y si no null.
  // Un valor sin $family es común a todas las familias y se devuelve tal cual.
  pick(value) {
    if (!value || !value.$family) return value;
    const v = value.$family;
    const own = v[this.id()];
    if (own !== undefined) return own;
    return v.default !== undefined ? v.default : null;
  },
};
