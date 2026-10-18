// Leer el Cielo — carga de jornadas.
// 1. Lee jornadas/jornadas.json (lista de jornadas, la primera es la que se abre por defecto).
// 2. Crea una pestaña por jornada.
// 3. Al elegir una pestaña, descarga su archivo HTML y lo muestra en <section id="jornada">.
// La jornada activa se refleja en la URL (#otono-2026) para compartir enlaces directos.
(function () {
  var nav = document.querySelector('.year-tabs');
  var panel = document.getElementById('jornada');
  var jornadas = [];
  var tabs = [];
  var cache = {};

  function absolutize(root, base) {
    // Rutas relativas dentro del archivo de la jornada se resuelven desde su carpeta.
    root.querySelectorAll('[src],[href]').forEach(function (el) {
      ['src', 'href'].forEach(function (attr) {
        var v = el.getAttribute(attr);
        if (!v || /^(#|[a-z]+:|\/\/|\/)/i.test(v)) return;
        el.setAttribute(attr, new URL(v, base).href);
      });
    });
  }

  function load(j) {
    if (cache[j.id]) return Promise.resolve(cache[j.id]);
    return fetch(j.archivo, { cache: 'no-cache' })
      .then(function (r) { if (!r.ok) throw new Error(r.status); return r.text(); })
      .then(function (html) { cache[j.id] = html; return html; });
  }

  function show(id, opts) {
    opts = opts || {};
    var j = jornadas.filter(function (x) { return x.id === id; })[0] || jornadas[0];
    tabs.forEach(function (t) {
      var on = t.dataset.id === j.id;
      t.setAttribute('aria-selected', on ? 'true' : 'false');
      t.tabIndex = on ? 0 : -1;
      if (on && opts.focus) t.focus();
    });
    panel.setAttribute('aria-labelledby', 'tab-' + j.id);
    document.title = 'Leer el Cielo · ' + (j.titulo || j.pestana);
    if (opts.push) history.replaceState(null, '', '#' + j.id);
    return load(j).then(function (html) {
      panel.innerHTML = html;
      absolutize(panel, new URL(j.archivo, location.href));
      if (opts.top) window.scrollTo({ top: 0 });
    }).catch(function () {
      panel.innerHTML = '<p class="loading wrap">No se pudo cargar esta jornada. Intenta recargar la página.</p>';
    });
  }

  // Enlaces internos (p. ej. "Ver programa") hacen scroll sin cambiar la jornada de la URL.
  panel.addEventListener('click', function (e) {
    var a = e.target.closest('a[href^="#"]');
    if (!a) return;
    var target = document.getElementById(a.getAttribute('href').slice(1));
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  fetch('jornadas/jornadas.json', { cache: 'no-cache' })
    .then(function (r) { return r.json(); })
    .then(function (list) {
      jornadas = list;
      tabs = list.map(function (j, i) {
        var b = document.createElement('button');
        b.type = 'button';
        b.setAttribute('role', 'tab');
        b.id = 'tab-' + j.id;
        b.dataset.id = j.id;
        b.setAttribute('aria-controls', 'jornada');
        b.textContent = j.pestana;
        b.addEventListener('click', function () { show(j.id, { push: true, top: true }); });
        b.addEventListener('keydown', function (e) {
          var d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
          if (!d) return;
          var n = list[(i + d + list.length) % list.length];
          show(n.id, { push: true, focus: true });
        });
        nav.appendChild(b);
        return b;
      });
      show(location.hash.slice(1));
    })
    .catch(function () {
      panel.innerHTML = '<p class="loading wrap">No se pudo cargar la lista de jornadas.</p>';
    });

  window.addEventListener('hashchange', function () {
    var id = location.hash.slice(1);
    if (jornadas.some(function (j) { return j.id === id; })) show(id, { top: true });
  });
})();
