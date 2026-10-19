/* BFEP hub deep links v1.1: /app/#finger opens that screen of the hub, /app/#bottle that game, /app/#games the games list.
   Lets every name in the app card on bfep.space open its own section. Uses the hub's own show() and openGame(). */
(function () {
  var SCREENS = { finger: 1, wheel: 1, cards: 1, sounds: 1, crew: 1, toast: 1, invite: 1, recap: 1 };
  var GAMES = { bottle: 1, dice: 1, board: 1, lever: 1, bfep: 1, bluff: 1, daily: 1, sayit: 1 };
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
