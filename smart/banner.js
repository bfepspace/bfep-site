/* BFEP "Get the app" banner v1.1 — only in the browser games on bfep.space/play/<game>/ (never inside the apps).
   Shows at the bottom of the results screen. Store open → the store for this phone (tag play-banner-<game>); not yet → the waitlist.
   "✕" hides it for a day. */
(function (B) {
  if (!B || (window.Capacitor && window.Capacitor.getPlatform && window.Capacitor.getPlatform() !== 'web')) return;
  var id = (location.pathname.match(/\/play\/([a-z]+)/) || [])[1], g = id && B.games[id];
  if (!g || typeof window.show !== 'function') return;

  var T = {
    en: { live: 'Get the app: works offline, with vibration', soon: 'The app is coming soon: offline, with vibration', get: 'Get the app', notify: 'Notify me' },
    de: { live: 'Hol dir die App: offline, mit Vibration', soon: 'Die App kommt bald: offline, mit Vibration', get: 'App holen', notify: 'Benachrichtigen' },
    es: { live: 'Descarga la app: sin conexión y con vibración', soon: 'La app llega pronto: sin conexión y con vibración', get: 'Descargar', notify: 'Avísame' },
    ru: { live: 'Скачайте приложение: без интернета, с вибрацией', soon: 'Скоро приложение: без интернета, с вибрацией', get: 'Скачать', notify: 'Сообщить мне' },
    fr: { live: 'Téléchargez l’appli : hors ligne, avec vibrations', soon: 'L’appli arrive bientôt : hors ligne, avec vibrations', get: 'Télécharger', notify: 'Me prévenir' },
    zh: { live: '下载 App：离线可玩，支持振动', soon: 'App 即将上线：离线可玩，支持振动', get: '下载', notify: '上线提醒' }
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
    var href = store || (anyLive || form ? '/' + id + '/' + B.query(tags) + (anyLive ? '' : '#waitlist') : B.waitlistUrl(id));
    var el = document.createElement('div');
    el.id = 'bfepGet'; el.setAttribute('role', 'complementary');
    el.innerHTML = '<img src="/icons/' + id + '.png" alt=""><span></span><a target="_top"></a><button type="button" aria-label="Close">✕</button>';
    el.querySelector('span').textContent = anyLive ? t.live : t.soon;
    var a = el.querySelector('a'); a.href = href; a.textContent = anyLive ? t.get : t.notify;
    if (store) a.onclick = function (e) { e.preventDefault(); B.go(store, { game: id, store: plat, src: tags._s }); };
    el.querySelector('button').onclick = function () { try { localStorage.setItem(KEY, Date.now()); } catch (e) {} hide(); };
    document.body.appendChild(el);
  }

  var orig = window.show;
  window.show = function (screen) {
    cur = screen;
    var r = orig.apply(this, arguments);
    if (screen === 's-results' || screen === 's-done') setTimeout(showBanner, 900); else hide();
    return r;
  };
})(window.BFEP);
