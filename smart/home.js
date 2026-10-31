/* BFEP home page v1.2: keeps the source tag (?s=tt-bio-all, utm_*) on every game link, so a visitor from a profile
   still counts for that profile in the store. When a store opens (links.js live:true) its badge becomes a link
   (visitors without a tag get site-home-<game>). The waitlist form appears before «Follow us» once it is ready.
   v1.2: a visitor from a profile link (#waitlist or ?s=<net>-bio-…) first gets «▶ Play now» (the app + the 5 games, tag kept),
   with the waitlist form right below it: play first, e-mail after (OK Аркадий 31.10, #PLAY-NOW). GA4 event play_now_click. */
(function (B) {
  if (!B) return;
  var q0 = new URLSearchParams(location.search), tagged = !!(q0.get('s') || q0.get('utm_source'));
  var tags = B.tags('site-direct-all'), q = B.query(tags);
  document.querySelectorAll('article.card').forEach(function (card) {
    var id = card.id;
    if (!B.games[id]) return;
    var play = card.querySelector('a.btn');
    if (play) play.href = '/play/' + id + '/' + q;
    var t = tagged ? tags : B.fromTag('site-home-' + id);
    var badges = card.querySelectorAll('.badge'), anyLive = false;
    [['ios', badges[0]], ['android', badges[1]]].forEach(function (p) {
      var url = B.store(id, p[0], t);
      if (!url || !p[1]) return;
      anyLive = true;
      var a = document.createElement('a');
      a.className = 'badge live'; a.textContent = p[1].textContent; a.href = url;
      a.onclick = function (e) { e.preventDefault(); B.go(url, { game: id, store: p[0], src: t._s }); };
      p[1].replaceWith(a);
    });
    if (anyLive) { var s = card.querySelector('.soon'); if (s) s.hidden = true; }
  });
  var st = document.createElement('style');
  st.textContent = '.badge.live{color:var(--ink);border-color:var(--c);text-decoration:none}';
  document.head.appendChild(st);

  /* «Play now» block for visitors from a profile link (v1.2). */
  var fromBio = location.hash === '#waitlist' || /-bio-/.test(tags._s || '');
  var PN = {
    en: { h: 'Play free right now', p: 'In your browser · no download · one phone for everyone', b: '▶ Play now', g: 'or pick a game:', w: 'Want to know when the apps are out? Leave your e-mail below.' },
    de: { h: 'Jetzt kostenlos spielen', p: 'Im Browser · ohne Download · ein Handy für alle', b: '▶ Jetzt spielen', g: 'oder wähle ein Spiel:', w: 'Willst du wissen, wann die Apps erscheinen? Trag unten deine E-Mail ein.' },
    es: { h: 'Juega gratis ahora mismo', p: 'En el navegador · sin descargas · un móvil para todos', b: '▶ Jugar ahora', g: 'o elige un juego:', w: '¿Quieres saber cuándo salen las apps? Deja tu correo abajo.' },
    ru: { h: 'Играйте бесплатно прямо сейчас', p: 'В браузере · без скачивания · один телефон на всех', b: '▶ Играть сейчас', g: 'или выберите игру:', w: 'Хотите узнать о выходе приложений? Оставьте почту ниже.' },
    fr: { h: 'Jouez gratuitement maintenant', p: 'Dans le navigateur · sans téléchargement · un téléphone pour tous', b: '▶ Jouer maintenant', g: 'ou choisissez un jeu :', w: 'Envie de savoir quand les apps sortent ? Laissez votre e-mail ci-dessous.' },
    zh: { h: '现在就免费玩', p: '浏览器里直接玩 · 无需下载 · 一部手机大家玩', b: '▶ 立即开玩', g: '或选择一款游戏：', w: '想知道应用何时上线？在下方留下邮箱。' }
  };
  function pnLang() { var l = document.documentElement.lang === 'zh-CN' ? 'zh' : document.documentElement.lang; return PN[l] ? l : 'en'; }
  function pnRender(box) {
    var t = PN[pnLang()];
    box.querySelector('h2').textContent = t.h; box.querySelector('.pn-p').textContent = t.p;
    box.querySelector('.pn-b').textContent = t.b; box.querySelector('.pn-g').textContent = t.g; box.querySelector('.pn-w').textContent = t.w;
  }
  function playNow(before) {
    if (!fromBio || !before || document.getElementById('playnow')) return null;
    var css = document.createElement('style');
    css.textContent = '#playnow{margin:26px 0 0;background:var(--paper);color:var(--ink);border-radius:24px;padding:22px 18px;text-align:center;box-shadow:0 12px 30px rgba(0,0,0,.3);border-top:8px solid var(--sun);scroll-margin-top:16px}'
      + '#playnow h2{margin:0 0 4px;font-size:1.6rem}#playnow .pn-p{margin:0 0 14px;color:var(--muted)}'
      + '#playnow .pn-b{display:block;max-width:420px;margin:0 auto;background:var(--coral);color:#fff;font-size:1.3rem;padding:15px 18px}'
      + '#playnow .pn-g{margin:16px 0 8px;font-weight:700}#playnow .pn-games{display:flex;justify-content:center;gap:10px;flex-wrap:wrap}'
      + '#playnow .pn-games a{display:flex;flex-direction:column;align-items:center;gap:4px;width:84px;color:var(--ink);text-decoration:none;font-size:.78rem;font-weight:700;line-height:1.15}'
      + '#playnow .pn-games img{width:60px;height:60px;border-radius:16px;box-shadow:0 4px 10px rgba(0,0,0,.18)}#playnow .pn-w{margin:16px 0 0;font-size:.92rem;color:var(--muted)}';
    document.head.appendChild(css);
    var box = document.createElement('section');
    box.id = 'playnow';
    box.innerHTML = '<h2></h2><p class="pn-p"></p><a class="btn pn-b" data-to="app" href="/app/' + q + '"></a><p class="pn-g"></p><div class="pn-games">'
      + Object.keys(B.games).map(function (id) {
          return '<a data-to="' + id + '" href="/play/' + id + '/' + q + '"><img src="/icons/' + id + '.jpg?v=1.45" alt="" width="60" height="60">' + B.games[id].name + '</a>';
        }).join('') + '</div><p class="pn-w"></p>';
    box.querySelectorAll('a[data-to]').forEach(function (a) {
      a.onclick = function (e) {
        e.preventDefault(); B.track('play_now_click', { target: a.dataset.to, src: tags._s });
        setTimeout(function () { location.href = a.href; }, B.ga4 ? 350 : 0);
      };
    });
    before.parentNode.insertBefore(box, before);
    pnRender(box);
    var langs = document.getElementById('langs');
    if (langs) langs.addEventListener('click', function () { setTimeout(function () { pnRender(box); }, 0); });
    return box;
  }
  var social = document.querySelector('section.social');
  if (social) {
    var pn = playNow(social);
    B.mountWaitlist(social, 'all').then(function (ok) {
      var wl = ok && document.getElementById('waitlist');
      if (pn && wl) wl.parentNode.insertBefore(pn, wl);
      if (pn) pn.scrollIntoView();
    });
  }
})(window.BFEP);
