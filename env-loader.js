/**
 * ENV Loader - INNOVANDO PUBLICIDAD
 * Aplica valores de contacto fijos a los enlaces de la web.
 */
(function () {
  var config = {
    CONTACT_PHONE: '584241951216',
    CONTACT_EMAIL: 'mabricenon@innovandopublicidad.com'
  };

  function updateLinks() {
    // 1. Actualizar enlaces de WhatsApp (wa.me)
    if (config.CONTACT_PHONE) {
      var waLinks = document.querySelectorAll('a[href*="wa.me/"]');
      waLinks.forEach(function (link) {
        var href = link.getAttribute('href');
        if (href) {
          // Reemplaza "CONTACT_PHONE" por el valor fijo
          var newHref = href.replace(/(wa\.me\/)(CONTACT_PHONE|[0-9]+)/, '$1' + config.CONTACT_PHONE);
          link.setAttribute('href', newHref);
        }
      });
    }

    // 2. Actualizar enlaces de correo (mailto:)
    if (config.CONTACT_EMAIL) {
      var mailLinks = document.querySelectorAll('a[href^="mailto:"]');
      mailLinks.forEach(function (link) {
        var href = link.getAttribute('href');
        if (href) {
          // Reemplaza "CONTACT_EMAIL" por la dirección fija
          var newHref = href.replace(/(mailto:)(CONTACT_EMAIL|[^?#\s]+)/, '$1' + config.CONTACT_EMAIL);
          link.setAttribute('href', newHref);
        }
      });
    }

    // 3. Opcional: Actualizar elementos de texto con el atributo data-env
    var envElements = document.querySelectorAll('[data-env]');
    envElements.forEach(function (el) {
      var key = el.getAttribute('data-env');
      if (config[key]) {
        el.textContent = config[key];
      }
    });
  }

  // Ejecutar inmediatamente al cargar el script y también cuando el DOM esté listo
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', updateLinks);
  } else {
    updateLinks();
  }
})();
