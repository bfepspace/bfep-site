/* BFEP home page v1.2: keeps the source tag (?s=tt-bio-all, utm_*) on every game link, so a visitor from a profile
   still counts for that profile in the store. When a store opens (links.js live:true) its badge becomes a link
   (visitors without a tag get site-home-<game>). The waitlist form appears before «Follow us» once it is ready.
   v1.2: a visitor from a profile link (#waitlist or ?s=<net>-bio-…) first gets «▶ Play now» (the app + the 5 games, tag kept),
   with the waitlist form right below it: play first, e-mail after (OK Аркадий 31.10, #PLAY-NOW). GA4 event play_now_click.
   v1.4 (site v1.74, Аркадий 09.11): every visitor from TikTok (?s=tt-…, utm_source=tiktok) gets the block on the FIRST screen,
   right under the header, with one big «▶ Play Bluff Night» button; the other games and the app below it, the waitlist form right after.
   v1.5 (site v1.93, Аркадий 14.11 «Один или компания»): a TikTok visitor is usually alone, so the first screen offers two ways:
   «Play solo: Three Clues Daily» and «Tonight with friends: Bluff Night», plus «Send to friends» (WhatsApp, link tagged wa-share-tt).
   GA4: play_now_click target=daily|bluff, share_click net=whatsapp. */
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
  var fromTT = /^(tt|tiktok)-/i.test(tags._s || '') || /tiktok/i.test(q0.get('utm_source') || '');
  var fromBio = fromTT || location.hash === '#waitlist' || /-bio-/.test(tags._s || '');
  var PN = {
    en: { so: 'Play solo', sos: 'Three Clues Daily · 2 minutes', fr2: 'Tonight with friends', frs: 'Bluff Night · one phone for everyone', sh: 'Send to friends', sht: 'Let\u2019s play this tonight 🎉', h2: 'How do you want to play?', bl: '▶ Play Bluff Night', o: 'or another game:', h: 'Play free right now', p: 'In your browser · no download · one phone for everyone', b: '▶ Play now', g: 'or pick a game:', w: 'Liked it? The first 150 who leave an email get a gift at launch 🎁' },
    de: { so: 'Allein spielen', sos: 'Three Clues Daily · 2 Minuten', fr2: 'Heute Abend mit Freunden', frs: 'Bluff Night · ein Handy für alle', sh: 'An Freunde senden', sht: 'Lass uns das heute Abend spielen 🎉', h2: 'Wie willst du spielen?', bl: '▶ Bluff Night spielen', o: 'oder ein anderes Spiel:', h: 'Jetzt kostenlos spielen', p: 'Im Browser · ohne Download · ein Handy für alle', b: '▶ Jetzt spielen', g: 'oder wähle ein Spiel:', w: 'Gefallen? Die ersten 150 mit E-Mail bekommen zum Start ein Geschenk 🎁' },
    es: { so: 'Jugar solo', sos: 'Three Clues Daily · 2 minutos', fr2: 'Esta noche con amigos', frs: 'Bluff Night · un móvil para todos', sh: 'Enviar a amigos', sht: 'Juguemos a esto esta noche 🎉', h2: '¿Cómo quieres jugar?', bl: '▶ Jugar a Bluff Night', o: 'u otro juego:', h: 'Juega gratis ahora mismo', p: 'En el navegador · sin descargas · un móvil para todos', b: '▶ Jugar ahora', g: 'o elige un juego:', w: '¿Te gusta? Los primeros 150 que dejen su correo reciben un regalo 🎁' },
    ru: { so: 'Сыграть одному', sos: 'Three Clues Daily · 2 минуты', fr2: 'Вечером с друзьями', frs: 'Bluff Night · один телефон на всех', sh: 'Отправить друзьям', sht: 'Давай сыграем вечером 🎉', h2: 'Как хотите играть?', bl: '▶ Играть в Bluff Night', o: 'или другая игра:', h: 'Играйте бесплатно прямо сейчас', p: 'В браузере · без скачивания · один телефон на всех', b: '▶ Играть сейчас', g: 'или выберите игру:', w: 'Понравилось? Первым 150, кто оставит почту, — подарок к запуску 🎁' },
    fr: { so: 'Jouer seul', sos: 'Three Clues Daily · 2 minutes', fr2: 'Ce soir entre amis', frs: 'Bluff Night · un téléphone pour tous', sh: 'Envoyer à des amis', sht: 'On joue à ça ce soir ? 🎉', h2: 'Comment voulez-vous jouer ?', bl: '▶ Jouer à Bluff Night', o: 'ou un autre jeu :', h: 'Jouez gratuitement maintenant', p: 'Dans le navigateur · sans téléchargement · un téléphone pour tous', b: '▶ Jouer maintenant', g: 'ou choisissez un jeu :', w: 'Ça vous plaît ? Les 150 premiers à laisser leur e-mail reçoivent un cadeau 🎁' },
    zh: { so: '一个人玩', sos: 'Three Clues Daily · 2 分钟', fr2: '今晚和朋友玩', frs: 'Bluff Night · 一部手机大家玩', sh: '发给朋友', sht: '今晚一起玩这个吧 🎉', h2: '你想怎么玩？', bl: '▶ 玩 Bluff Night', o: '或者换个游戏：', h: '现在就免费玩', p: '浏览器里直接玩 · 无需下载 · 一部手机大家玩', b: '▶ 立即开玩', g: '或选择一款游戏：', w: '喜欢吗？前 150 名留下邮箱的人上线时领礼物 🎁' }
  };
  function pnLang() { var l = document.documentElement.lang === 'zh-CN' ? 'zh' : document.documentElement.lang; return PN[l] ? l : 'en'; }
  function pnRender(box) {
    var t = PN[pnLang()];
    box.querySelector('h2').textContent = fromTT ? t.h2 : t.h; box.querySelector('.pn-p').textContent = t.p;
    if (fromTT) {
      box.querySelector('.pn-solo b').textContent = t.so; box.querySelector('.pn-solo small').textContent = t.sos;
      box.querySelector('.pn-fr b').textContent = t.fr2; box.querySelector('.pn-fr small').textContent = t.frs;
      box.querySelector('.pn-sh span').textContent = t.sh;
      box.querySelector('.pn-sh').href = 'https://wa.me/?text=' + encodeURIComponent(t.sht + ' https://bfep.space/?s=wa-share-tt');
    } else box.querySelector('.pn-b').textContent = t.b; box.querySelector('.pn-g').textContent = fromTT ? t.o : t.g; box.querySelector('.pn-w').textContent = t.w;
  }
  function playNow(before) {
    if (!fromBio || !before || document.getElementById('playnow')) return null;
    var css = document.createElement('style');
    css.textContent = '#playnow{margin:26px 0 0;background:var(--paper);color:var(--ink);border-radius:24px;padding:22px 18px;text-align:center;box-shadow:0 12px 30px rgba(0,0,0,.3);border-top:8px solid var(--sun);scroll-margin-top:16px}'
      + '#playnow h2{margin:0 0 4px;font-size:1.6rem}#playnow .pn-p{margin:0 0 14px;color:var(--muted)}'
      + '#playnow .pn-b{display:block;max-width:420px;margin:0 auto;background:var(--coral);color:#fff;font-size:1.3rem;padding:15px 18px}'
      + '#playnow .pn-g{margin:16px 0 8px;font-weight:700}#playnow .pn-games{display:flex;justify-content:center;gap:10px;flex-wrap:wrap}'
      + '#playnow .pn-games a{display:flex;flex-direction:column;align-items:center;gap:4px;width:84px;color:var(--ink);text-decoration:none;font-size:.78rem;font-weight:700;line-height:1.15}'
      + '#playnow .pn-bluff{background:#6B3FA0;font-size:1.45rem;padding:18px}#playnow.top{margin-top:10px;padding-top:16px}#playnow.top h2{font-size:1.4rem}'
      + '#playnow .pn-two{display:flex;flex-direction:column;gap:10px;max-width:420px;margin:0 auto}'
      + '#playnow .pn-two .btn{display:flex;flex-direction:column;align-items:center;padding:13px 16px;color:#fff;line-height:1.2}'
      + '#playnow .pn-two b{font-size:1.3rem;font-weight:900}#playnow .pn-two small{font-size:.88rem;font-weight:700;opacity:.92;margin-top:2px}'
      + '#playnow .pn-solo{background:#2E9F68}#playnow .pn-fr{background:#6B3FA0}'
      + '#playnow .pn-sh{display:inline-flex;align-items:center;gap:8px;margin:12px auto 0;padding:9px 16px;border:2px solid #25D366;border-radius:14px;color:var(--ink);font-weight:800;text-decoration:none}'
      + '#playnow .pn-sh svg{width:20px;height:20px;fill:#25D366}'
      + '#playnow .pn-games img{width:60px;height:60px;border-radius:16px;box-shadow:0 4px 10px rgba(0,0,0,.18)}#playnow .pn-w{margin:16px 0 0;font-size:.92rem;color:var(--muted)}';
    document.head.appendChild(css);
    var box = document.createElement('section');
    box.id = 'playnow';
    box.innerHTML = '<h2></h2><p class="pn-p"></p>' + (fromTT
        ? '<div class="pn-two"><a class="btn pn-solo" data-to="daily" href="/play/daily/' + q + '"><b></b><small></small></a>'
          + '<a class="btn pn-fr" data-to="bluff" href="/play/bluff/' + q + '"><b></b><small></small></a></div>'
          + '<a class="pn-sh" href="https://wa.me/" target="_blank" rel="noopener"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm5.3 14.1c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .1-3.3-.8-2.8-1.1-4.5-3.9-4.7-4.1-.1-.2-1.1-1.5-1.1-2.8s.7-2 1-2.3c.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.8 2c.1.2.1.3 0 .5l-.4.6-.3.4c.1.2.6 1 1.3 1.6.9.8 1.6 1 1.9 1.1.2.1.4.1.5-.1l.7-.9c.2-.2.3-.2.6-.1l1.9.9c.3.1.5.2.5.3.1.2.1.7-.1 1.3z"/></svg><span></span></a>'
        : '<a class="btn pn-b" data-to="app" href="/app/' + q + '"></a>') + '<p class="pn-g"></p><div class="pn-games">'
      + (fromTT ? '<a data-to="app" href="/app/' + q + '"><img src="/icons/app.jpg?v=1.71" alt="" width="60" height="60">BEEZOO Space</a>' : '')
      + Object.keys(B.games).filter(function (id) { return !fromTT || (id !== 'bluff' && id !== 'daily'); }).map(function (id) {
          return '<a data-to="' + id + '" href="/play/' + id + '/' + q + '"><img src="/icons/' + id + '.jpg?v=1.45" alt="" width="60" height="60">' + B.games[id].name + '</a>';
        }).join('') + '</div><p class="pn-w"></p>';
    box.querySelectorAll('a[data-to]').forEach(function (a) {
      a.onclick = function (e) {
        e.preventDefault(); B.track('play_now_click', { target: a.dataset.to, src: tags._s });
        setTimeout(function () { location.href = a.href; }, B.ga4 ? 350 : 0);
      };
    });
    var sh = box.querySelector('.pn-sh');
    if (sh) sh.addEventListener('click', function () { B.track('share_click', { net: 'whatsapp', src: tags._s }); });
    before.parentNode.insertBefore(box, before);
    pnRender(box);
    var langs = document.getElementById('langs');
    if (langs) langs.addEventListener('click', function () { setTimeout(function () { pnRender(box); }, 0); });
    return box;
  }
  var social = document.querySelector('section.social');
  if (social) {
    var head = document.querySelector('main > header');
    var pn = playNow(fromTT && head && head.nextElementSibling ? head.nextElementSibling : social);
    if (pn && fromTT) { pn.classList.add('top'); var fam = head.querySelector('.family'); if (fam) fam.style.display = 'none'; } // the icons repeat in the block: button fits the in-app browser screen
    B.mountWaitlist(social, 'all').then(function (ok) {
      var wl = ok && document.getElementById('waitlist');
      // v1.3: visitors from an ad (?s=…-ad-…) came for the waitlist → form first, «Play now» right below it (Аркадий 07.11, #TT-PROMOTE)
      var fromAd = /-ad-/.test(tags._s || '');
      if (fromTT) { if (pn && wl) pn.parentNode.insertBefore(wl, pn.nextSibling); return; } // v1.4: Bluff block on top, form right after it, no scrolling
      if (pn && wl) { if (fromAd) wl.parentNode.insertBefore(pn, wl.nextSibling); else wl.parentNode.insertBefore(pn, wl); }
      if (fromAd && wl) wl.scrollIntoView({block: 'start'}); else if (pn) pn.scrollIntoView();
    });
  }
})(window.BFEP);
