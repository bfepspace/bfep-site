/* BFEP "Get the app" banner v1.4 — v1.4 (site v1.95, plan «конверсия сайта» П0, 14.11): funnel counters in the browser games /play/<game>/ — game_loaded (ms to ready), game_screen (each screen once per visit: start, setup, play, results), waitlist_view when the gift banner appears; all with ab (A/B variant from the home page) and src.
   v1.3 — also in the app on bfep.space/app: games open there as /app/games/<game>.html inside the hub; the banner
   then uses the hub's BFEP (no second analytics page view) and opens the waitlist sheet over the whole hub page (map of player flows v1.1, Н6, 14.11).
   v1.2 — before release the button opens the waitlist form right here, on top of the results (no leaving the game); text: gift for the first 150 (14.11, #WAITLIST).
   v1.1 — only in the browser games on bfep.space/play/<game>/ (never inside the apps).
   Shows at the bottom of the results screen. Store open → the store for this phone (tag play-banner-<game>); not yet → the waitlist.
   "✕" hides it for a day. */
(function (B) {
  var D = document;   // the page that holds the waitlist sheet: this one, or the hub around an app game
  if (!B) { try { if (window.parent !== window && window.parent.BFEP) { B = window.parent.BFEP; D = window.parent.document; } } catch (e) {} }
  if (!B || (window.Capacitor && window.Capacitor.getPlatform && window.Capacitor.getPlatform() !== 'web')) return;
  var m = location.pathname.match(/\/play\/([a-z]+)/) || location.pathname.match(/\/app\/games\/([a-z]+)\.html/);
  var id = m && m[1], inApp = /\/app\//.test(location.pathname), g = id && (B.games[id] || (inApp ? { name: 'BEEZOO Space', color: '#FF6A4D', app: true } : null));
  if (!g || typeof window.show !== 'function') return;

  var T = {
    en: { live: 'Get the app: works offline, with vibration', soon: 'Liked it? First 150 get a gift at launch 🎁', get: 'Get the app', notify: 'Get the gift' },
    de: { live: 'Hol dir die App: offline, mit Vibration', soon: 'Gefallen? Die ersten 150 bekommen zum Start ein Geschenk 🎁', get: 'App holen', notify: 'Geschenk holen' },
    es: { live: 'Descarga la app: sin conexión y con vibración', soon: '¿Te gustó? Los primeros 150 reciben un regalo 🎁', get: 'Descargar', notify: 'Quiero el regalo' },
    ru: { live: 'Скачайте приложение: без интернета, с вибрацией', soon: 'Понравилось? Первым 150 — подарок к запуску 🎁', get: 'Скачать', notify: 'Хочу подарок' },
    fr: { live: 'Téléchargez l’appli : hors ligne, avec vibrations', soon: 'Ça vous a plu ? Un cadeau pour les 150 premiers 🎁', get: 'Télécharger', notify: 'Mon cadeau' },
    zh: { live: '下载 App：离线可玩，支持振动', soon: '喜欢吗？前 150 名上线时领礼物 🎁', get: '下载', notify: '领礼物' }
  };
  var KEY = 'bfep-banner-off';

  function off() { try { return Date.now() - (+localStorage.getItem(KEY) || 0) < 24 * 3600 * 1000; } catch (e) { return false; } }
  function lang() { var l = 'en'; try { l = LANG; } catch (e) {} return T[l] ? l : 'en'; }

  var css = document.createElement('style');
  css.textContent = '#bfepGet{position:fixed;left:50%;transform:translateX(-50%);bottom:calc(12px + env(safe-area-inset-bottom));z-index:9999;width:min(560px,calc(100% - 20px));display:flex;align-items:center;gap:10px;background:#FFF8EA;color:#12242B;border-radius:18px;padding:10px 10px 10px 12px;box-shadow:0 10px 30px rgba(0,0,0,.35);border-left:6px solid ' + g.color + ';font:600 .92rem/1.3 Nunito,system-ui,sans-serif;animation:bfepIn .35s ease-out}' +
    '#bfepGet img{width:40px;height:40px;border-radius:10px;flex:none}#bfepGet span{flex:1}' +
    '#bfepGet a{flex:none;background:' + g.color + ';color:#fff;text-decoration:none;border-radius:12px;padding:9px 13px;font-weight:800;white-space:nowrap}' +
    '#bfepGet button{flex:none;border:0;background:transparent;color:#5A6B70;font-size:1.1rem;padding:6px;cursor:pointer}' +
    '@keyframes bfepIn{from{opacity:0;transform:translate(-50%,12px)}to{opacity:1;transform:translate(-50%,0)}}';
  document.head.appendChild(css);

  function hide() { var el = document.getElementById('bfepGet'); if (el) el.remove(); }
  var cur = '', form = false;
  B.waitlistReady().then(function (h) { form = !!h; });
  function showBanner() {
    if ((cur !== 's-results' && cur !== 's-done') || off() || document.getElementById('bfepGet')) return;
    var t = T[lang()], tags = B.fromTag('play-banner-' + id);
    var plat = B.platform(), store = plat === 'desktop' ? null : B.store(id, plat, tags);
    var anyLive = B.store(id, 'android', tags) || B.store(id, 'ios', tags);
    var page = g.app ? '/' : '/' + id + '/';   // app-only games have no page of their own: the home page has the waitlist
    var href = store || (anyLive || form ? page + B.query(tags) + (anyLive ? '' : '#waitlist') : B.waitlistUrl(id));
    var el = document.createElement('div');
    el.id = 'bfepGet'; el.setAttribute('role', 'complementary');
    el.innerHTML = '<img src="' + (g.app ? '/app/icon.png' : '/icons/' + id + '.png') + '" alt=""><span></span><a target="_top"></a><button type="button" aria-label="Close">✕</button>';
    el.querySelector('span').textContent = anyLive ? t.live : t.soon;
    var a = el.querySelector('a'); a.href = href; a.textContent = anyLive ? t.get : t.notify;
    a.addEventListener('click', function () { try { localStorage.setItem('bfep-site-lang', (document.documentElement.lang || 'en').slice(0, 2)); } catch (e) {} });
    if (store) a.onclick = function (e) { e.preventDefault(); B.go(store, { game: id, store: plat, src: tags._s }); };
    else if (!anyLive && form) a.onclick = function (e) { e.preventDefault(); B.track('waitlist_open', { from: 'play-banner', game: id }); hide(); sheet(); };
    el.querySelector('button').onclick = function () { try { localStorage.setItem(KEY, Date.now()); } catch (e) {} hide(); };
    document.body.appendChild(el);
    ev('waitlist_view', { where: 'play-banner', live: anyLive ? 'yes' : 'no' });
  }

  // v1.2: the waitlist form in a sheet over the results screen
  function sheet() {
    var sh = D.getElementById('bfepSheet');
    if (sh) { sh.style.display = 'flex'; return; }
    var st = D.createElement('style');
    st.textContent = '#bfepSheet{position:fixed;inset:0;z-index:10000;background:rgba(0,0,0,.55);display:flex;align-items:flex-end;justify-content:center}' +
      '#bfepSheet .in{position:relative;width:100%;max-width:600px;max-height:92vh;overflow:auto;padding-bottom:env(safe-area-inset-bottom)}#bfepSheet .bfep-wl{margin:0 auto 10px}' +
      '#bfepSheet .x{position:absolute;right:14px;top:8px;z-index:1;border:0;background:transparent;color:#fff;font-size:1.4rem;cursor:pointer;padding:8px}';
    D.head.appendChild(st);
    sh = D.createElement('div'); sh.id = 'bfepSheet';
    sh.innerHTML = '<div class="in"><button type="button" class="x" aria-label="Close">✕</button><i></i></div>';
    sh.onclick = function (e) { if (e.target === sh || e.target.className === 'x') sh.style.display = 'none'; };
    D.body.appendChild(sh);
    if (!D.documentElement.lang) D.documentElement.lang = lang();
    B.mountWaitlist(sh.querySelector('i'), id).then(function (ok) {
      if (!ok) { sh.remove(); (D.defaultView || window).location.href = (g.app ? '/' : '/' + id + '/') + '#waitlist'; return; }
      var i = sh.querySelector('#waitlist input[type=email]'); if (i) setTimeout(function () { i.focus(); }, 300);
    });
  }

  // v1.4 П0: funnel counters (browser games only; the app hub counts its own)
  var AB = 'none'; try { AB = localStorage.getItem('bfep-ab-p1') ? 'p1' + localStorage.getItem('bfep-ab-p1') : 'none'; } catch (e) {}
  var SRC = (B.tags ? B.tags('site-direct-' + id)._s : '');
  function ev(n, p) { if (!inApp) B.track(n, Object.assign({ game: id, ab: AB, src: SRC }, p)); }
  var shown = {}, nScreens = 0;
  if (document.readyState === 'complete') ev('game_loaded', { ms: Math.round(performance.now()) });
  else window.addEventListener('load', function () { ev('game_loaded', { ms: Math.round(performance.now()) }); });
  var orig = window.show;
  window.show = function (screen) {
    cur = screen;
    if (screen && !shown[screen]) { shown[screen] = 1; nScreens++; ev('game_screen', { screen: String(screen).slice(0, 30), step: nScreens }); }
    var r = orig.apply(this, arguments);
    if (screen === 's-results' || screen === 's-done') setTimeout(showBanner, 900); else hide();
    return r;
  };
})(window.BFEP);
