// Leer el Cielo — página de inicio + subpáginas de jornadas.
// 1. Lee jornadas/jornadas.json (de la más reciente a la más antigua).
// 2. Inicio (#inicio o sin hash): banner de la primera jornada de la lista y tarjetas del resto.
// 3. Subpágina (#<id>, p. ej. #otono-2026): descarga jornadas/<id>/jornada.html y lo muestra.
//    Los enlaces antiguos tipo #otono-2026 siguen funcionando.
// Para añadir una jornada: crea jornadas/<id>/ (jornada.html, poster.jpg, poster-mini.jpg)
// y agrega su entrada AL INICIO de jornadas.json. Usa "tipo": "municipios" para las
// jornadas fuera de la Biblioteca Central (aparecen en su propia sección del inicio).
(function () {
  var vInicio = document.getElementById('vista-inicio');
  var vJornada = document.getElementById('vista-jornada');
  var panel = document.getElementById('jornada');
  var jnav = document.getElementById('jornada-nav');
  var navLinks = document.querySelectorAll('.year-tabs [data-nav]');
  var navReciente = document.querySelector('[data-nav="reciente"]');
  var SECCIONES_INICIO = ['', 'inicio', 'destacada', 'anteriores', 'municipios'];
  var jornadas = [];
  var cache = {};

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }
  // Resalta los textos [POR CONFIRMAR] que vengan de jornadas.json.
  function txt(s) {
    return esc(s).replace(/\[(POR CONFIRMAR[^\]]*)\]/g, '<span class="pc">[$1]</span>');
  }

  function esFutura(j) {
    if (!j.fecha) return false;
    var hoy = new Date(); hoy.setHours(0, 0, 0, 0);
    return new Date(j.fecha + 'T23:59:59') >= hoy;
  }

  // ---------- inicio ----------
  function renderInicio() {
    var d = jornadas[0];
    var box = document.getElementById('destacada');
    if (!d) { box.innerHTML = ''; return; }
    var futura = esFutura(d);
    var etiqueta = futura ? 'Próxima jornada' : 'Jornada más reciente';
    document.querySelector('.home-hero .btn-primary').textContent = etiqueta;

    box.innerHTML =
      '<article class="feature-banner">' +
        '<a class="fb-poster" href="#' + esc(d.id) + '" tabindex="-1" aria-hidden="true">' +
          '<img src="' + esc(d.poster) + '" alt="" width="520" height="800"></a>' +
        '<div class="fb-body">' +
          '<p class="fb-kicker">' + (futura ? '<span class="dot" aria-hidden="true"></span>' : '') + etiqueta + '</p>' +
          '<h2 class="fb-title">' + esc(d.tema || d.titulo) + '</h2>' +
          '<p class="fb-sub">' + esc(d.titulo) + '</p>' +
          '<dl class="facts">' +
            '<div><dt>Fecha</dt><dd>' + esc(d.fecha_texto) + '</dd></div>' +
            (d.horario ? '<div><dt>Horario</dt><dd>' + esc(d.horario) + '</dd></div>' : '') +
            '<div><dt>Lugar</dt><dd>' + txt(d.lugar) + '</dd></div>' +
          '</dl>' +
          '<p class="fb-resumen">' + txt(d.resumen) + '</p>' +
          '<div class="ctas">' +
            '<a class="btn btn-primary" href="#' + esc(d.id) + '">Ver programa completo</a>' +
            (futura ? '<p class="free free-sm"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2l2.6 6.6L21 9.3l-5 4.4 1.6 6.8L12 17l-5.6 3.5L8 13.7 3 9.3l6.4-.7z"/></svg>Entrada libre · actividades para toda la familia</p>' : '') +
          '</div>' +
        '</div>' +
      '</article>' +
      // Banner hacia las jornadas anteriores
      (jornadas.length > 1 ?
        '<a class="past-banner" href="#anteriores" data-scroll>' +
          '<span class="pb-stack" aria-hidden="true">' +
            jornadas.slice(1, 4).map(function (j) { return '<img src="' + esc(j.poster) + '" alt="" loading="lazy">'; }).join('') +
          '</span>' +
          '<span class="pb-text"><b>Jornadas anteriores</b>' +
          '<span>' + (jornadas.length - 1) + ' jornadas en León y en municipios desde ' + esc(jornadas[jornadas.length - 1].fecha.slice(0, 4)) + ': programas, invitados y pósters</span></span>' +
          '<span class="pb-arrow" aria-hidden="true">→</span>' +
        '</a>' : '');

    function tarjeta(j) {
      return '<li><a class="past-card" href="#' + esc(j.id) + '">' +
        '<span class="pc-img"><img src="' + esc(j.poster) + '" alt="" loading="lazy"></span>' +
        '<span class="pc-body">' +
          '<span class="pc-date">' + esc(j.fecha_texto) + '</span>' +
          '<span class="pc-title">' + esc(j.tema || j.titulo) + '</span>' +
          '<span class="pc-place">' + txt(j.lugar) + '</span>' +
          '<span class="pc-more">Ver jornada →</span>' +
        '</span></a></li>';
    }
    var previas = jornadas.slice(1);
    var mun = previas.filter(function (j) { return j.tipo === 'municipios'; });
    document.getElementById('lista-anteriores').innerHTML =
      previas.filter(function (j) { return j.tipo !== 'municipios'; }).map(tarjeta).join('');
    document.getElementById('lista-municipios').innerHTML = mun.map(tarjeta).join('');
    document.getElementById('municipios').hidden = !mun.length;
  }

  // ---------- subpágina de jornada ----------
  function load(j) {
    if (cache[j.id]) return Promise.resolve(cache[j.id]);
    return fetch(j.archivo, { cache: 'no-cache' })
      .then(function (r) { if (!r.ok) throw new Error(r.status); return r.text(); })
      .then(function (html) { cache[j.id] = html; return html; });
  }

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

  function renderNavJornada(i) {
    var newer = jornadas[i - 1], older = jornadas[i + 1];
    jnav.innerHTML =
      (older ? '<a class="jn-prev" href="#' + esc(older.id) + '"><small>← Jornada anterior</small>' + esc(older.pestana) + '</a>' : '<span></span>') +
      (newer ? '<a class="jn-next" href="#' + esc(newer.id) + '"><small>Jornada siguiente →</small>' + esc(newer.pestana) + '</a>' : '<span></span>');
  }

  function showJornada(j) {
    vInicio.hidden = true;
    vJornada.hidden = false;
    setActive(j.id === jornadas[0].id ? 'reciente' : 'anteriores');
    document.title = 'Leer el Cielo · ' + (j.titulo || j.pestana);
    panel.innerHTML = '<p class="loading wrap">Cargando jornada…</p>';
    renderNavJornada(jornadas.indexOf(j));
    window.scrollTo({ top: 0 });
    return load(j).then(function (html) {
      panel.innerHTML = html;
      absolutize(panel, new URL(j.archivo, location.href));
    }).catch(function () {
      panel.innerHTML = '<p class="loading wrap">No se pudo cargar esta jornada. Intenta recargar la página.</p>';
    });
  }

  function showInicio(seccion) {
    vJornada.hidden = true;
    vInicio.hidden = false;
    setActive(seccion === 'anteriores' || seccion === 'municipios' ? 'anteriores' : 'inicio');
    document.title = 'Leer el Cielo · Jornadas Astronómicas';
    var t = seccion && document.getElementById(seccion);
    if (t && seccion !== 'inicio') t.scrollIntoView({ block: 'start' });
    else window.scrollTo({ top: 0 });
  }

  function setActive(key) {
    navLinks.forEach(function (a) {
      if (a.dataset.nav === key) a.setAttribute('aria-current', 'page');
      else a.removeAttribute('aria-current');
    });
  }

  function route() {
    var id = decodeURIComponent(location.hash.slice(1));
    var j = jornadas.filter(function (x) { return x.id === id; })[0];
    if (j) return showJornada(j);
    if (SECCIONES_INICIO.indexOf(id) >= 0) return showInicio(id);
    // Ancla interna de la jornada abierta (p. ej. #programa-2026): solo desplazarse.
    var t = document.getElementById(id);
    if (t) t.scrollIntoView({ behavior: 'smooth', block: 'start' });
    else showInicio('');
  }

  // Enlaces internos con data-scroll o anclas dentro de una jornada: desplazamiento suave
  // sin cambiar de vista (p. ej. «Ver programa»).
  document.addEventListener('click', function (e) {
    var a = e.target.closest('a[href^="#"]');
    if (!a) return;
    var id = a.getAttribute('href').slice(1);
    var inPanel = panel.contains(a);
    if (!inPanel && !a.hasAttribute('data-scroll')) return;
    var target = document.getElementById(id);
    if (!target || target.closest('[hidden]')) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    if (!inPanel) history.replaceState(null, '', '#' + id);
  });

  fetch('jornadas/jornadas.json', { cache: 'no-cache' })
    .then(function (r) { return r.json(); })
    .then(function (list) {
      jornadas = list;
      if (list[0]) {
        navReciente.href = '#' + list[0].id;
        navReciente.textContent = list[0].pestana;
        navReciente.hidden = false;
      }
      renderInicio();
      route();
    })
    .catch(function () {
      document.getElementById('destacada').innerHTML = '<p class="loading">No se pudo cargar la lista de jornadas.</p>';
    });

  window.addEventListener('hashchange', route);
})();
