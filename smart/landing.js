/* BFEP smart link page v1.1 — bfep.space/<game>/
   Phone with the store open → straight to its store (tag kept).
   Store not open yet / computer → this page: play in browser, waitlist, QR. ?stay=1 turns the jump off for checks. */
(function (B) {
  var id = document.body.dataset.game, T = window.PAGE_T, LANGS = Object.keys(T);
  var tags = B.tags('site-direct-' + id), q = B.query(tags), plat = B.platform();
  var stay = new URLSearchParams(location.search).has('stay');
  var mine = plat === 'desktop' ? null : B.store(id, plat, tags);
  var form = false;

  if (mine && !stay) B.go(mine, { game: id, store: plat, src: tags._s, auto: true }, true);

  function pick() {
    var l = null; try { l = localStorage.getItem('bfep-site-lang'); } catch (e) {}
    if (!l) { var n = (navigator.language || 'en').toLowerCase(); l = LANGS.filter(function (x) { return n.indexOf(x) === 0; })[0] || 'en'; }
    return T[l] ? l : 'en';
  }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function storeBtn(url, store, cls, label) {
    return '<a class="btn ' + cls + '" data-store="' + store + '" href="' + esc(url) + '">' + esc(label) + '</a>';
  }

  function render(l) {
    var t = T[l];
    try { localStorage.setItem('bfep-site-lang', l); } catch (e) {}
    document.documentElement.lang = l === 'zh' ? 'zh-CN' : l;
    document.querySelectorAll('[data-i]').forEach(function (el) { if (t[el.dataset.i] !== undefined) el.textContent = t[el.dataset.i]; });
    document.querySelectorAll('.langs button').forEach(function (b) { b.classList.toggle('sel', b.dataset.l === l); });

    var gp = B.store(id, 'android', tags), as = B.store(id, 'ios', tags), h = '';
    var playUrl = '/play/' + id + '/' + q;
    if (mine) {
      h += storeBtn(mine, plat, 'big', plat === 'ios' ? t.as : t.gp);
      h += '<p class="small">' + esc(stay ? '' : t.opening) + '</p>';
    } else if (plat === 'desktop' && (gp || as)) {
      if (as) h += storeBtn(as, 'ios', 'store', ' ' + t.as);
      if (gp) h += storeBtn(gp, 'android', 'store', '▶ ' + t.gp);
      h += '<a class="btn ghost" href="' + esc(playUrl) + '">' + esc(t.play) + '</a>';
    } else {
      h += '<a class="btn big" href="' + esc(playUrl) + '">' + esc(t.play) + '</a>';
      h += '<a class="btn ghost" href="' + esc(form ? '#waitlist' : B.waitlistUrl(id)) + '">' + esc(t.notify) + '</a>';
      h += '<p class="small">' + esc((gp || as) ? t.other : t.soon) + '</p>';
    }
    var acts = document.getElementById('acts');
    acts.innerHTML = h;
    acts.querySelectorAll('[data-store]').forEach(function (a) {
      a.onclick = function (e) { e.preventDefault(); B.go(a.href, { game: id, store: a.dataset.store, src: tags._s }); };
    });
    document.getElementById('qr').hidden = plat !== 'desktop';
    document.getElementById('home').href = '/' + q;
  }

  var lang = pick();
  document.getElementById('langs').innerHTML = LANGS.map(function (l) { return '<button type="button" data-l="' + l + '">' + T[l]._name + '</button>'; }).join('');
  document.querySelectorAll('.langs button').forEach(function (b) { b.onclick = function () { lang = b.dataset.l; render(lang); }; });
  render(lang);
  if (!mine) B.mountWaitlist(document.getElementById('home'), id).then(function (ok) { if (ok) { form = true; render(lang); } });
})(window.BFEP);
