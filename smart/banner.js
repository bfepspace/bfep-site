/* BFEP "Get the app" banner v1.7 — v1.7 (20.11, макет «Поставь BEEZOO Space» для гостей, OK Аркадия): the banner of the BEEZOO games speaks for BEEZOO Space (its icon, «Take the game with you», store of this phone);
   a guest who joined Bluff Night by QR gets a sheet once, after hiding their card (store of this phone, before release the waitlist gift). v1.6 — v1.6 (14.11): no «gift» banner for visitors already on the waitlist (bfep-wl-done). v1.5 — v1.5 (14.11): the waitlist sheet always speaks the game's language (BFEP_WL_LANG + repaint), also over the app hub whose page language may differ.
   v1.4 — v1.4 (site v1.95, plan «конверсия сайта» П0, 14.11): funnel counters in the browser games /play/<game>/ — game_loaded (ms to ready), game_screen (each screen once per visit: start, setup, play, results), waitlist_view when the gift banner appears; all with ab (A/B variant from the home page) and src.
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
  var G = {"en": {"app_h": "Take the game with you", "app_s": "BEEZOO Space · 13 games · works offline", "g_h": "Enjoyed hunting the impostor?", "g_p": "Bluff Night and 12 more party games in BEEZOO Space. One phone for the whole group, no internet needed.", "g_soon": "Out in December. The first 150 get a gift 🎁", "later": "Not now", "as": "App Store", "gp": "Google Play", "dl": "Download on the"}, "de": {"app_h": "Nimm das Spiel mit", "app_s": "BEEZOO Space · 13 Spiele · offline", "g_h": "Hat die Hochstapler-Jagd Spaß gemacht?", "g_p": "Bluff Night und 12 weitere Partyspiele in BEEZOO Space. Ein Handy für alle, ohne Internet.", "g_soon": "Erscheint im Dezember. Die ersten 150 bekommen ein Geschenk 🎁", "later": "Nicht jetzt", "as": "App Store", "gp": "Google Play", "dl": "Laden im"}, "es": {"app_h": "Llévate el juego", "app_s": "BEEZOO Space · 13 juegos · sin conexión", "g_h": "¿Te gustó cazar al impostor?", "g_p": "Bluff Night y 12 juegos de fiesta más en BEEZOO Space. Un móvil para todo el grupo, sin internet.", "g_soon": "Sale en diciembre. Los primeros 150 reciben un regalo 🎁", "later": "Ahora no", "as": "App Store", "gp": "Google Play", "dl": "Descargar en"}, "ru": {"app_h": "Возьмите игру с собой", "app_s": "BEEZOO Space · 13 игр · без интернета", "g_h": "Понравилось искать обманщика?", "g_p": "Bluff Night и ещё 12 игр для вечера в BEEZOO Space. Один телефон на всю компанию, работает без интернета.", "g_soon": "Выходит в декабре. Первым 150 — подарок 🎁", "later": "Не сейчас", "as": "App Store", "gp": "Google Play", "dl": "Загрузить в"}, "fr": {"app_h": "Emportez le jeu", "app_s": "BEEZOO Space · 13 jeux · hors ligne", "g_h": "Vous avez aimé traquer l’imposteur ?", "g_p": "Bluff Night et 12 autres jeux de soirée dans BEEZOO Space. Un téléphone pour tout le groupe, sans internet.", "g_soon": "Sortie en décembre. Un cadeau pour les 150 premiers 🎁", "later": "Pas maintenant", "as": "App Store", "gp": "Google Play", "dl": "Télécharger dans l’"}, "zh": {"app_h": "把游戏带回家", "app_s": "BEEZOO Space · 13 款游戏 · 离线可玩", "g_h": "喜欢找卧底吗？", "g_p": "Bluff Night 和另外 12 款聚会游戏都在 BEEZOO Space。全组一部手机，无需联网。", "g_soon": "12 月上线。前 150 名送礼物 🎁", "later": "以后再说", "as": "App Store", "gp": "Google Play", "dl": "下载："}};   // v1.7
  var BZ = !!(B.games[id] && B.games[id].in === 'app') || !!g.app;   // a game of BEEZOO Space
  var KEY = 'bfep-banner-off';

  function off() { try { return Date.now() - (+localStorage.getItem(KEY) || 0) < 24 * 3600 * 1000; } catch (e) { return false; } }
  function lang() { var l = 'en'; try { l = LANG; } catch (e) {} return T[l] ? l : 'en'; }

  var css = document.createElement('style');
  css.textContent = '#bfepGet{position:fixed;left:50%;transform:translateX(-50%);bottom:calc(12px + env(safe-area-inset-bottom));z-index:9999;width:min(560px,calc(100% - 20px));display:flex;align-items:center;gap:10px;background:#FFF8EA;color:#12242B;border-radius:18px;padding:10px 10px 10px 12px;box-shadow:0 10px 30px rgba(0,0,0,.35);border-left:6px solid ' + g.color + ';font:600 .92rem/1.3 Nunito,system-ui,sans-serif;animation:bfepIn .35s ease-out}' +
    '#bfepGet img{width:40px;height:40px;border-radius:10px;flex:none}#bfepGet span{flex:1}#bfepGet.bz img{width:52px;height:52px;border-radius:13px}#bfepGet b{display:block;font-weight:900}#bfepGet small{display:block;font-size:.8em;opacity:.75;font-weight:600}#bfepGet.bz a{background:#12242B}' +
    '#bfepGet a{flex:none;background:' + g.color + ';color:#fff;text-decoration:none;border-radius:12px;padding:9px 13px;font-weight:800;white-space:nowrap}' +
    '#bfepGet button{flex:none;border:0;background:transparent;color:#5A6B70;font-size:1.1rem;padding:6px;cursor:pointer}' +
    '@keyframes bfepIn{from{opacity:0;transform:translate(-50%,12px)}to{opacity:1;transform:translate(-50%,0)}}';
  document.head.appendChild(css);

  function hide() { var el = document.getElementById('bfepGet'); if (el) el.remove(); }
  var cur = '', form = false;
  B.waitlistReady().then(function (h) { form = !!h; });
  function showBanner() {
    if ((cur !== 's-results' && cur !== 's-done') || off() || document.getElementById('bfepGet')) return;
    var wlDone = false; try { wlDone = !!localStorage.getItem('bfep-wl-done'); } catch (e) {}   // v1.6: already on the waitlist → no gift offer again
    var t = T[lang()], tags = B.fromTag('play-banner-' + id);
    var plat = B.platform(), store = plat === 'desktop' ? null : B.store(id, plat, tags);
    var anyLive = B.store(id, 'android', tags) || B.store(id, 'ios', tags);
    if (wlDone && !anyLive) return;
    var page = g.app ? '/' : '/' + id + '/';   // app-only games have no page of their own: the home page has the waitlist
    var href = store || (anyLive || form ? page + B.query(tags) + (anyLive ? '' : '#waitlist') : B.waitlistUrl(id));
    var el = document.createElement('div');
    el.id = 'bfepGet'; el.setAttribute('role', 'complementary');
    el.innerHTML = '<img src="' + (g.app ? '/app/icon.png' : '/icons/' + id + '.png') + '" alt=""><span></span><a target="_top"></a><button type="button" aria-label="Close">✕</button>';
    el.querySelector('span').textContent = anyLive ? t.live : t.soon;
    var a = el.querySelector('a'); a.href = href; a.textContent = anyLive ? t.get : t.notify;
    if (BZ) {   // v1.7: BEEZOO Space card — app icon, «Take the game with you», the store of this phone
      var gz = G[lang()] || G.en; el.className = 'bz'; el.querySelector('img').src = '/icons/app.png';
      var sp = el.querySelector('span'); sp.textContent = ''; var bb = document.createElement('b'), sm = document.createElement('small');
      bb.textContent = gz.app_h; sm.textContent = anyLive ? gz.app_s : t.soon; sp.append(bb, sm);
      if (store) a.textContent = (plat === 'ios' ? gz.as : '▶ ' + gz.gp);
    }
    a.addEventListener('click', function () { try { localStorage.setItem('bfep-site-lang', (document.documentElement.lang || 'en').slice(0, 2)); } catch (e) {} });
    if (store) a.onclick = function (e) { e.preventDefault(); B.go(store, { game: id, store: plat, src: tags._s }); };
    else if (!anyLive && form) a.onclick = function (e) { e.preventDefault(); B.track('waitlist_open', { from: 'play-banner', game: id }); hide(); sheet(); };
    el.querySelector('button').onclick = function () { try { localStorage.setItem(KEY, Date.now()); } catch (e) {} hide(); };
    document.body.appendChild(el);
    ev('waitlist_view', { where: 'play-banner', live: anyLive ? 'yes' : 'no' });
  }

  // v1.2: the waitlist form in a sheet over the results screen
  function sheet() {
    var W = D.defaultView || window; W.BFEP_WL_LANG = lang();   // v1.5: the form follows the game's language
    var sh = D.getElementById('bfepSheet');
    if (sh) { var wl0 = sh.querySelector('#waitlist'); if (wl0 && wl0.bfepPaint) wl0.bfepPaint(); sh.style.display = 'flex'; return; }
    var st = D.createElement('style');
    st.textContent = '#bfepSheet{position:fixed;inset:0;z-index:10000;background:rgba(0,0,0,.55);display:flex;align-items:flex-end;justify-content:center}' +
      '#bfepSheet .in{position:relative;width:100%;max-width:600px;max-height:92vh;overflow:auto;padding-bottom:env(safe-area-inset-bottom)}#bfepSheet .bfep-wl{margin:0 auto 10px}' +
      '#bfepSheet .x{position:absolute;right:14px;top:8px;z-index:1;border:0;background:transparent;color:#fff;font-size:1.4rem;cursor:pointer;padding:8px}';
    D.head.appendChild(st);
    sh = D.createElement('div'); sh.id = 'bfepSheet';
    sh.innerHTML = '<div class="in"><button type="button" class="x" aria-label="Close">✕</button><i></i></div>';
    sh.onclick = function (e) { if (e.target === sh || e.target.className === 'x') sh.style.display = 'none'; };
    D.body.appendChild(sh);
    B.mountWaitlist(sh.querySelector('i'), id).then(function (ok) {
      if (!ok) { sh.remove(); (D.defaultView || window).location.href = (g.app ? '/' : '/' + id + '/') + '#waitlist'; return; }
      var i = sh.querySelector('#waitlist input[type=email]'); if (i) setTimeout(function () { i.focus(); }, 300);
    });
  }

  // v1.7: a Bluff Night guest who joined by QR — once per visit, after hiding the card (макет «Поставь BEEZOO Space», место 1)
  var GKEY = 'bfep-guest-sheet', joined = id === 'bluff' && !inApp && /[?&]j=/.test(location.search);
  function guestSheet() {
    try { if (sessionStorage.getItem(GKEY)) return; sessionStorage.setItem(GKEY, '1'); } catch (e) {}
    var gz = G[lang()] || G.en, tags = B.fromTag('qr-join-bluff-app'), plat = B.platform();
    var store = plat === 'desktop' ? null : B.store(id, plat, tags), anyLive = B.store(id, 'android', tags) || B.store(id, 'ios', tags);
    var wlDone = false; try { wlDone = !!localStorage.getItem('bfep-wl-done'); } catch (e) {}
    if (!anyLive && (wlDone || !form)) return;   // before release: only with the waitlist form, once
    var st = document.createElement('style');
    st.textContent = '#bfepGuest{position:fixed;inset:0;z-index:10001;background:rgba(5,20,26,.62);display:flex;align-items:flex-end;justify-content:center;font-family:inherit}' +
      '#bfepGuest .in{width:100%;max-width:520px;background:#FFF8EA;color:#12242B;border-radius:28px 28px 0 0;padding:14px 22px calc(22px + env(safe-area-inset-bottom));text-align:center;animation:bfepUp .25s ease-out}' +
      '#bfepGuest .gr{width:46px;height:5px;border-radius:3px;background:#ccc;margin:0 auto 12px}#bfepGuest img{width:84px;height:84px;border-radius:22px;box-shadow:0 6px 16px rgba(0,0,0,.25)}' +
      '#bfepGuest h2{margin:8px 0 6px;font-size:1.35rem;line-height:1.15}#bfepGuest p{margin:0 0 14px;line-height:1.35}' +
      '#bfepGuest a{display:block;padding:14px;border-radius:16px;background:#12242B;color:#fff;font-weight:900;font-size:1.1rem;text-decoration:none;box-shadow:0 5px 0 rgba(0,0,0,.25)}' +
      '#bfepGuest a small{display:block;font-size:.7rem;font-weight:700;opacity:.8}#bfepGuest button{margin-top:10px;border:0;background:none;font:inherit;font-weight:800;opacity:.6;padding:8px;cursor:pointer;color:inherit}' +
      '@keyframes bfepUp{from{transform:translateY(40px);opacity:0}to{transform:none;opacity:1}}';
    document.head.appendChild(st);
    var el = document.createElement('div'); el.id = 'bfepGuest'; el.setAttribute('role', 'dialog');
    el.innerHTML = '<div class="in"><div class="gr"></div><img src="/icons/app.png" alt=""><h2></h2><p></p><a href="#" target="_top"></a><button type="button"></button></div>';
    el.querySelector('h2').textContent = gz.g_h; el.querySelector('p').textContent = anyLive ? gz.g_p : gz.g_p + ' ' + gz.g_soon;
    var a = el.querySelector('a'), close = function () { el.remove(); };
    if (store) { a.innerHTML = '<small></small>'; a.firstChild.textContent = gz.dl; a.append(plat === 'ios' ? gz.as : gz.gp); a.href = store;
      a.onclick = function (e) { e.preventDefault(); B.go(store, { game: id, store: plat, src: tags._s }); }; }
    else if (anyLive) { a.textContent = T[lang()].get; a.href = '/' + B.query(tags); }   // computer: the site has both stores and a QR
    else { a.textContent = T[lang()].notify; a.onclick = function (e) { e.preventDefault(); B.track('waitlist_open', { from: 'qr-guest', game: id }); close(); sheet(); }; }
    el.querySelector('button').textContent = gz.later; el.querySelector('button').onclick = close;
    el.onclick = function (e) { if (e.target === el) close(); };
    document.body.appendChild(el);
    ev('waitlist_view', { where: 'qr-guest', live: anyLive ? 'yes' : 'no' });
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
    var was = cur; cur = screen;
    if (joined && screen === 's-join' && was === 's-card') setTimeout(guestSheet, 700);   // v1.7
    if (screen && !shown[screen]) { shown[screen] = 1; nScreens++; ev('game_screen', { screen: String(screen).slice(0, 30), step: nScreens }); }
    var r = orig.apply(this, arguments);
    if (screen === 's-results' || screen === 's-done') setTimeout(showBanner, 900); else hide();
    return r;
  };
})(window.BFEP);
