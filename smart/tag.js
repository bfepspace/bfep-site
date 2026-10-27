/* BFEP source tag v1.1: turns ?s=<channel>-<place>-<what> into utm_source/utm_medium/utm_campaign in the address
   before /smart/links.js starts Google Analytics, so a visit from a profile link (bfep.space/app?s=tt-bio-app)
   is counted for that profile. ?s= stays in the address, smart links read it as before. Load it before links.js.
   v1.1: Instagram/Threads turn ?s=ig-bio-all#waitlist into ?s=ig-bio-all%23waitlist — the part after %23 becomes the hash again. */
(function () {
  try {
    var q = new URLSearchParams(location.search), s = q.get('s'), h = location.hash;
    if (s && s.indexOf('#') >= 0) {
      h = h || '#' + s.slice(s.indexOf('#') + 1); s = s.slice(0, s.indexOf('#')); q.set('s', s);
      history.replaceState(history.state, '', location.pathname + '?' + q.toString() + h);
    }
    if (!s || q.get('utm_source')) return;
    s = s.toLowerCase().replace(/[^a-z0-9_-]/g, '').slice(0, 40);
    if (!s) return;
    var p = s.split('-');
    q.set('utm_source', p[0] || 'site'); q.set('utm_medium', p[1] || 'link'); q.set('utm_campaign', s);
    history.replaceState(history.state, '', location.pathname + '?' + q.toString() + h);
  } catch (e) {}
})();
