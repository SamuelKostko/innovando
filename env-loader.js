/**
 * ENV Loader - INNOVANDO PUBLICIDAD
 * Carga dinámicamente las variables del archivo .env y las aplica a los enlaces de la web.
 */
(function () {
  // Configuración fallback (por seguridad si falla la carga del archivo local)
  var config = {
    CONTACT_PHONE: "584123580995",
    CONTACT_EMAIL: "mabricenon@innovandopublicidad.com"
  };

  function updateLinks() {
    // 1. Actualizar enlaces de WhatsApp (wa.me)
    var waLinks = document.querySelectorAll('a[href*="wa.me/"]');
    waLinks.forEach(function (link) {
      var href = link.getAttribute('href');
      if (href) {
        // Reemplaza "CONTACT_PHONE" o cualquier número existente por el del .env
        var newHref = href.replace(/(wa\.me\/)(CONTACT_PHONE|[0-9]+)/, '$1' + config.CONTACT_PHONE);
        link.setAttribute('href', newHref);
      }
    });

    // 2. Actualizar enlaces de correo (mailto:)
    var mailLinks = document.querySelectorAll('a[href^="mailto:"]');
    mailLinks.forEach(function (link) {
      var href = link.getAttribute('href');
      if (href) {
        // Reemplaza "CONTACT_EMAIL" o cualquier dirección por la del .env
        var newHref = href.replace(/(mailto:)(CONTACT_EMAIL|[^?#\s]+)/, '$1' + config.CONTACT_EMAIL);
        link.setAttribute('href', newHref);
      }
    });

    // 3. Opcional: Actualizar elementos de texto con el atributo data-env
    var envElements = document.querySelectorAll('[data-env]');
    envElements.forEach(function (el) {
      var key = el.getAttribute('data-env');
      if (config[key]) {
        el.textContent = config[key];
      }
    });
  }

  // Intentar cargar el archivo .env desde el servidor local
  fetch('.env')
    .then(function (res) {
      if (!res.ok) throw new Error('No se pudo leer el archivo .env');
      return res.text();
    })
    .then(function (text) {
      var lines = text.split(/\r?\n/);
      lines.forEach(function (line) {
        line = line.trim();
        // Ignorar comentarios y líneas vacías
        if (!line || line.indexOf('#') === 0) return;
        var eqIndex = line.indexOf('=');
        if (eqIndex > 0) {
          var key = line.substring(0, eqIndex).trim();
          var value = line.substring(eqIndex + 1).trim();
          // Remover comillas si existen en el valor
          if ((value.indexOf('"') === 0 && value.lastIndexOf('"') === value.length - 1) ||
              (value.indexOf("'") === 0 && value.lastIndexOf("'") === value.length - 1)) {
            value = value.substring(1, value.length - 1);
          }
          config[key] = value;
        }
      });
      updateLinks();
    })
    .catch(function (err) {
      console.warn('[ENV Loader] Usando valores por defecto debido a:', err.message);
      updateLinks();
    });

  // Ejecutar inmediatamente al cargar el script y también cuando el DOM esté listo
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', updateLinks);
  } else {
    updateLinks();
  }
})();
