/* BFEP site language v1.0 (06.11.2026): the language picked on bfep.space goes with the visitor into the app
   and into every game. On any click to /app/… or /play/… the current page language is written to the app hub
   (bfe-lang) and to the save of every game (st.lang), so a game opens in that language even if it was played
   in another one before. The games already pass their language back to the site («← bfep.space»). */
(function () {
  var LANGS = ['en', 'de', 'es', 'ru', 'fr', 'zh'];
  var KEYS = ['best-fun-evening-plan-v1', 'bfep-bluff-v1', 'bfep-daily-v1', 'bfep-kmg-v1', 'bfep-sayit-v1',
    'bfep-board-v1', 'bfep-bottle-v1', 'bfep-dice-v1', 'bfep-lever-v1', 'bfep-words-v1'];
  function cur() { var l = (document.documentElement.lang || '').slice(0, 2).toLowerCase(); return LANGS.indexOf(l) >= 0 ? l : null; }
  function share(l) {
    l = l || cur(); if (!l) return;
    try {
      localStorage.setItem('bfep-site-lang', l);
      localStorage.setItem('bfe-lang', l);
      KEYS.forEach(function (k) {
        var s = null; try { s = JSON.parse(localStorage.getItem(k) || '{}'); } catch (e) {}
        if (!s || typeof s !== 'object') s = {};
        s.lang = l; localStorage.setItem(k, JSON.stringify(s));
      });
    } catch (e) {}
  }
  window.BFEPLang = { share: share };
  document.addEventListener('click', function (e) {
    var a = e.target && e.target.closest ? e.target.closest('a[href]') : null; if (!a) return;
    var u; try { u = new URL(a.getAttribute('href'), location.href); } catch (_) { return; }
    if (u.origin === location.origin && /^\/(app|play)\//.test(u.pathname)) share();
  }, true);
})();
