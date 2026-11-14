/* BFEP install v1.0 (Аркадий 14.11): the browser's own «Install Say It!» prompt popped up by itself, in the
   browser's language (English on his phone), with no reason the player could see. Now:
   - the browser's automatic prompt is switched off (beforeinstallprompt → preventDefault, the event is kept);
   - instead a clear button «📲 Install» in the game's header (/play/<game>/, under sound/settings, on the row of
     «← Home», only on the start screen) and on the app hub (/app, next to «← bfep.space»), in the language of the game;
   - Android Chrome / Samsung: the button opens the browser's install window (its text is the phone's language —
     that window belongs to the phone, we can't change it);
   - iPhone Safari: there is no such window, so the button shows two steps: «Share» → «Add to Home Screen»;
   - hidden when already installed, inside TikTok / Instagram / Facebook (they can't install) and where nothing works.
   Events: install_view, install_click {how: prompt|ios}, install_done {outcome}. */
(function () {
  var W = window, Dc = document, ua = navigator.userAgent || '';
  if (W.Capacitor && W.Capacitor.getPlatform && W.Capacitor.getPlatform() !== 'web') return;
  if (W.top !== W) return;   // games inside the app hub: the hub has the button
  var standalone = (W.matchMedia && W.matchMedia('(display-mode: standalone)').matches) || navigator.standalone;
  if (standalone) return;
  var inApp = /musical_ly|Bytedance|TikTok|Instagram|FBAN|FBAV|FB_IAB|Line\/|Snapchat|Twitter/i.test(ua);
  var ios = /iPhone|iPad|iPod/.test(ua) || (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1);
  var iosSafari = ios && /Safari/.test(ua) && !/CriOS|FxiOS|EdgiOS|OPiOS|YaBrowser/.test(ua);
  var hub = /^\/app\/?(index\.html)?$/.test(location.pathname);
  var m = location.pathname.match(/\/play\/([a-z]+)/), game = m && m[1];
  if (!hub && !game) return;

  var T = {
    en: { btn: 'Install', t: 'Put it on your home screen', s1: 'Tap <b>Share</b> <i>⬆︎</i> at the bottom of Safari', s2: 'Choose <b>Add to Home Screen</b>', ok: 'Got it' },
    ru: { btn: 'Установить', t: 'Поставить на экран телефона', s1: 'Нажмите <b>«Поделиться»</b> <i>⬆︎</i> внизу Safari', s2: 'Выберите <b>«На экран „Домой“»</b>', ok: 'Понятно' },
    de: { btn: 'Installieren', t: 'Auf den Home-Bildschirm', s1: 'Unten in Safari auf <b>Teilen</b> <i>⬆︎</i> tippen', s2: '<b>Zum Home-Bildschirm</b> wählen', ok: 'Verstanden' },
    es: { btn: 'Instalar', t: 'Ponlo en tu pantalla de inicio', s1: 'Toca <b>Compartir</b> <i>⬆︎</i> abajo en Safari', s2: 'Elige <b>Añadir a pantalla de inicio</b>', ok: 'Entendido' },
    fr: { btn: 'Installer', t: 'Mettre sur l’écran d’accueil', s1: 'Touchez <b>Partager</b> <i>⬆︎</i> en bas de Safari', s2: 'Choisissez <b>Sur l’écran d’accueil</b>', ok: 'Compris' },
    zh: { btn: '安装', t: '添加到主屏幕', s1: '点 Safari 底部的<b>分享</b> <i>⬆︎</i>', s2: '选择<b>添加到主屏幕</b>', ok: '知道了' }
  };
  function lang() { var l = (Dc.documentElement.lang || 'en').slice(0, 2); return T[l] ? l : 'en'; }
  function track(n, p) {
    try { var B = W.BFEP; if (B && B.track) B.track(n, Object.assign({ game: game || 'app' }, p || {})); } catch (e) {}
  }

  var deferred = null, btn = null, seen = false;
  W.addEventListener('beforeinstallprompt', function (e) { e.preventDefault(); deferred = e; if (!inApp) place(); });
  W.addEventListener('appinstalled', function () { deferred = null; if (btn) btn.remove(); btn = null; track('install_done', { outcome: 'installed' }); });
  if (inApp) return;   // the event above still keeps the browser quiet

  var css = Dc.createElement('style');
  css.textContent =
    '.bfep-inst{display:inline-flex;align-items:center;gap:6px;height:44px;padding:0 14px;border-radius:999px;border:2px solid rgba(255,248,234,.35);background:rgba(18,36,43,.75);color:#FFF8EA;font:800 .85rem/1 Nunito,system-ui,sans-serif;cursor:pointer;white-space:nowrap;box-shadow:0 4px 12px rgba(0,0,0,.3);-webkit-tap-highlight-color:transparent}' +
    '.bfep-inst:hover,.bfep-inst:focus-visible{border-color:#FFC83D;color:#FFC83D}.bfep-inst[hidden]{display:none}' +
    '.bfep-inst.fx{position:fixed;top:calc(62px + env(safe-area-inset-top));right:10px;z-index:40}' +
    '.bfep-inst.hb{height:36px;padding:0 12px;font-size:.95rem;background:transparent;border-color:rgba(255,255,255,.35);box-shadow:none;color:#fff}' +
    '.bfep-instrow{display:flex;gap:8px;align-items:center;flex-wrap:wrap;margin:0 0 10px}.bfep-instrow .sitehome{margin:0!important}' +
    '#bfepInstSheet{position:fixed;inset:0;z-index:10001;background:rgba(0,0,0,.55);display:flex;align-items:flex-end;justify-content:center}' +
    '#bfepInstSheet .in{width:100%;max-width:520px;background:#FFF8EA;color:#12242B;border-radius:22px 22px 0 0;padding:22px 20px calc(18px + env(safe-area-inset-bottom));font:600 1rem/1.4 Nunito,system-ui,sans-serif}' +
    '#bfepInstSheet h3{margin:0 0 14px;font:900 1.25rem/1.2 Nunito,system-ui,sans-serif}' +
    '#bfepInstSheet ol{margin:0 0 18px;padding-left:1.4em}#bfepInstSheet li{margin:0 0 10px}#bfepInstSheet i{font-style:normal;display:inline-block;border:2px solid #12242B;border-radius:7px;padding:0 5px;font-size:.85em}' +
    '#bfepInstSheet button{width:100%;border:0;border-radius:14px;padding:13px;background:#FF6A4D;color:#fff;font:800 1rem Nunito,system-ui,sans-serif;cursor:pointer}';
  Dc.head.appendChild(css);

  function label() { if (btn) btn.lastChild.textContent = T[lang()].btn; }
  function iosSheet() {
    var t = T[lang()], sh = Dc.createElement('div');
    sh.id = 'bfepInstSheet'; sh.setAttribute('role', 'dialog'); sh.setAttribute('aria-modal', 'true');
    sh.innerHTML = '<div class="in"><h3></h3><ol><li>' + t.s1 + '</li><li>' + t.s2 + '</li></ol><button type="button"></button></div>';
    sh.querySelector('h3').textContent = t.t; sh.querySelector('button').textContent = t.ok;
    sh.onclick = function (e) { if (e.target === sh || e.target.tagName === 'BUTTON') sh.remove(); };
    Dc.body.appendChild(sh);
  }
  function click() {
    if (deferred) {
      var e = deferred; track('install_click', { how: 'prompt' });
      e.prompt();
      (e.userChoice || Promise.resolve({})).then(function (c) {
        track('install_done', { outcome: (c && c.outcome) || 'unknown' });
        if (c && c.outcome === 'accepted') { deferred = null; if (btn) btn.remove(); btn = null; }
      });
      deferred = null;   // a prompt can be shown only once; Chrome sends a new event later if it allows
      if (btn && !iosSafari) btn.hidden = true;
    } else if (iosSafari) { track('install_click', { how: 'ios' }); iosSheet(); }
  }
  function place() {
    if (btn) { btn.hidden = false; sync(); return; }
    if (!deferred && !iosSafari) return;
    var host;
    if (hub) { host = Dc.getElementById('siteHome'); if (!host) return; }
    else { host = Dc.getElementById('sndHome') || Dc.getElementById('gearBtn'); if (!host) return; }
    btn = Dc.createElement('button'); btn.type = 'button'; btn.className = 'bfep-inst ' + (hub ? 'hb' : 'fx');
    btn.innerHTML = '<span aria-hidden="true">📲</span><span></span>';
    btn.onclick = click; label();
    if (hub) {
      var row = Dc.createElement('div'); row.className = 'bfep-instrow';
      host.parentNode.insertBefore(row, host); row.appendChild(host); row.appendChild(btn);
    } else {
      Dc.body.appendChild(btn);
      new MutationObserver(sync).observe(host, { attributes: true, attributeFilter: ['hidden', 'style', 'class'] });
      var sh0 = Dc.getElementById('siteHome'); if (sh0) new MutationObserver(sync).observe(sh0, { attributes: true, attributeFilter: ['hidden', 'style'] });
    }
    new MutationObserver(label).observe(Dc.documentElement, { attributes: true, attributeFilter: ['lang'] });
    sync();
  }
  function sync() {   // in a game: visible together with the sound/settings buttons (start screen)
    if (!btn) return;
    if (!hub) {
      var h = Dc.getElementById('sndHome') || Dc.getElementById('gearBtn');
      var vis = h && !h.hidden && getComputedStyle(h).display !== 'none';
      btn.style.display = vis ? '' : 'none';
      var sh = Dc.getElementById('siteHome');   // same row as «← Home» (under the Sparks balance), on the right
      if (vis && sh && !sh.hidden) btn.style.top = sh.getBoundingClientRect().top + 'px';
    }
    if (!seen && btn.style.display !== 'none' && !btn.hidden) { seen = true; track('install_view', { how: deferred ? 'prompt' : 'ios' }); }
  }
  W.addEventListener('resize', sync);
  if (Dc.readyState === 'loading') Dc.addEventListener('DOMContentLoaded', place); else place();
})();
