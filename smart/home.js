/* BFEP home page v1.1: keeps the source tag (?s=tt-bio-all, utm_*) on every game link, so a visitor from a profile
   still counts for that profile in the store. When a store opens (links.js live:true) its badge becomes a link
   (visitors without a tag get site-home-<game>). The waitlist form appears before «Follow us» once it is ready. */
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
  var social = document.querySelector('section.social');
  if (social) B.mountWaitlist(social, 'all');
})(window.BFEP);
