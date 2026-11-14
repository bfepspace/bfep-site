/* BFEP hub deep links v1.2: /app/#finger opens that screen of the hub, /app/#bottle that game, /app/#games the games list.
   Lets every name in the app card on bfep.space open its own section. Uses the hub's own show() and openGame(). */
(function () {
  var SCREENS = { finger: 1, wheel: 1, cards: 1, sounds: 1, crew: 1, toast: 1, invite: 1, recap: 1 };
  var GAMES = { bottle: 1, dice: 1, words: 1, board: 1, lever: 1, bfep: 1, bluff: 1, daily: 1, sayit: 1 };
  function go() {
    var k = (location.hash || '').slice(1).toLowerCase();
    if (!k) return;
    try {
      if (SCREENS[k] && typeof show === 'function') show(k);
      else if (GAMES[k] && typeof openGame === 'function') openGame(k);
      else if (k === 'games') { var g = document.getElementById('g-play'); if (g) g.scrollIntoView({ block: 'center' }); }
      else return;
      if (window.BFEP && BFEP.track) BFEP.track('app_deeplink', { to: k });
      history.replaceState(history.state, '', location.pathname + location.search);
    } catch (e) {}
  }
  go();
  addEventListener('hashchange', go);
})();

/* v1.3 (Аркадий 14.11): «the player returns to the page where the game was started».
   v1.2 (Аркадий 14.11): a visitor who came from bfep.space straight into a game or a screen of the app
   (/app/games/dice.html → /app/?open=dice, /app/#finger…) gets back to bfep.space with «‹ Home»,
   not to the unfamiliar app home. Only that first step: inside the app afterwards «Home» works as before. */
(function () {
  function deep() {
    var gv = document.getElementById('gameview');
    if (gv && !gv.hidden) return true;
    var on = document.querySelector('.screen.on');
    return !!(on && on.id !== 's-home');
  }
  function back() {
    /* v1.3: the place on bfep.space where the game was started (sessionStorage 'bfep-return', set by the site home) */
    try { var m = sessionStorage.getItem('bfep-return'); if (m && m.charAt(0) === '/' && m.charAt(1) !== '/') { sessionStorage.removeItem('bfep-return'); location.href = m; return; } } catch (e) {}
    var r = document.referrer || '';
    try { if (r && new URL(r).origin === location.origin && !/\/app\//.test(new URL(r).pathname)) { location.href = r; return; } } catch (e) {}
    location.href = '/';
  }
  function arm() {
    if (!deep()) return;
    var done = false;
    document.addEventListener('click', function (e) {
      if (done) return;
      var t = e.target.closest && e.target.closest('#gameclose,[data-home]');
      if (!t) return;
      done = true;
      e.preventDefault(); e.stopImmediatePropagation();
      if (window.BFEP && BFEP.track) BFEP.track('app_home_to_site', {});
      back();
    }, true);
  }
  setTimeout(arm, 0);
})();
