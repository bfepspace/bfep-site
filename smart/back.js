/* BFEP back v1.0 (Аркадий 14.11): after a game the player returns to the page where the game was started.
   bfep.space remembers the starting place in sessionStorage 'bfep-return' (e.g. "/#bluff", "/#app");
   «‹ Home» of the browser games (/play/…) leads there; no memory (opened from a link, a QR…) → bfep.space. */
(function () {
  var a = document.getElementById('siteHome');
  if (!a) return;
  var r = null;
  try { r = sessionStorage.getItem('bfep-return'); } catch (e) {}
  if (!r || r.charAt(0) !== '/' || r.charAt(1) === '/') r = '/';
  a.href = r;
  a.addEventListener('click', function () {
    try { sessionStorage.removeItem('bfep-return'); localStorage.setItem('bfep-site-lang', (document.documentElement.lang || 'en').slice(0, 2)); } catch (e) {}
  });
})();
