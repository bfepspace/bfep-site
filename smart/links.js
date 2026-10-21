/* BFEP smart links v1.2 — the ONE place with store ids and the analytics id.
   On release day: fill ios (number from App Store Connect → App Information → Apple ID),
   set live:true and upload only this file. Every smart link, QR code, banner and share link follows. */
window.BFEP = {
  games: {
    bfep:  { name: 'Best Fun Evening Plan!', color: '#D27F00', android: 'com.bestfuneveningplan.app',   ios: null, live: false },
    bluff: { name: 'Bluff Night',            color: '#6B3FA0', android: 'com.bestfuneveningplan.bluff', ios: null, live: false },
    daily: { name: 'Three Clues Daily',      color: '#2E9F68', android: 'com.bestfuneveningplan.daily', ios: null, live: false },
    sayit: { name: 'Say It!',                color: '#E8573A', android: 'com.bestfuneveningplan.sayit', ios: null, live: false },
    kmg:   { name: 'Kiss, Marry, Ghost',     color: '#D6336C', android: 'com.bestfuneveningplan.kmg',   ios: null, live: false }
  },
  // App Store Connect → Analytics → Sources → "Campaign links": the pt=... value. Empty = links still work, just without campaign stats.
  applePt: '',
  // Google Analytics 4 stream id, like 'G-ABC123XYZ'. Empty = no analytics code on the site at all.
  ga4: 'G-D5DJJXNQMX',
  // Fallback waitlist while /smart/waitlist.html still has no Brevo form addresses.
  waitlist: 'mailto:office@bfep.space?subject=Notify%20me%3A%20{name}&body=Please%20let%20me%20know%20when%20{name}%20is%20in%20the%20stores.'
};

(function (B) {
  /* Source tag ?s=<channel>-<place>-<game>[-extra] (table BFEP-метки-источников).
     Becomes utm_source=<channel>, utm_medium=<place>, utm_campaign=<whole tag>; App Store ct=<whole tag>.
     Plain utm_* in the address are accepted too. No tag at all → the page default (site-direct-<game>). */
  function clean(v) { return String(v).toLowerCase().replace(/[^a-z0-9_-]/g, '').slice(0, 40); }
  B.fromTag = function (s) {
    s = clean(s); var p = s.split('-');
    return { utm_source: p[0] || 'site', utm_medium: p[1] || 'link', utm_campaign: s, _s: s };
  };
  B.tags = function (def) {
    var q = new URLSearchParams(location.search), t;
    if (q.get('s')) t = B.fromTag(q.get('s'));
    else if (q.get('utm_source')) {
      t = { utm_source: clean(q.get('utm_source')), utm_medium: clean(q.get('utm_medium') || 'link'), utm_campaign: clean(q.get('utm_campaign') || '') };
      if (!t.utm_campaign) t.utm_campaign = t.utm_source + '-' + t.utm_medium;
      t._s = t.utm_campaign.indexOf('-') > 0 ? t.utm_campaign : (t.utm_source + '-' + t.utm_medium + '-' + t.utm_campaign).slice(0, 40);
    } else t = B.fromTag(def || 'site-direct-all');
    if (q.get('utm_content')) t.utm_content = clean(q.get('utm_content'));
    return t;
  };
  B.query = function (t) {
    var o = {};
    Object.keys(t).forEach(function (k) { if (k.charAt(0) !== '_') o[k] = t[k]; });
    return '?' + new URLSearchParams(o).toString();
  };

  B.platform = function () {
    var ua = navigator.userAgent || '';
    if (/android/i.test(ua)) return 'android';
    if (/iPhone|iPad|iPod/.test(ua) || (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1)) return 'ios';
    return 'desktop';
  };

  // Store address for a game on a platform, or null while that store is not open yet.
  B.store = function (id, platform, t) {
    var g = B.games[id];
    if (!g || !g.live) return null;
    if (platform === 'android' && g.android) {
      var ref = 'utm_source=' + t.utm_source + '&utm_medium=' + t.utm_medium + '&utm_campaign=' + t.utm_campaign;
      if (t.utm_content) ref += '&utm_content=' + t.utm_content;
      return 'https://play.google.com/store/apps/details?id=' + g.android + '&referrer=' + encodeURIComponent(ref);
    }
    if (platform === 'ios' && g.ios) {
      return 'https://apps.apple.com/app/id' + g.ios + '?' + (B.applePt ? 'pt=' + B.applePt + '&' : '') + 'ct=' + encodeURIComponent(t._s) + '&mt=8';
    }
    return null;
  };

  B.waitlistUrl = function (id) {
    var n = encodeURIComponent((B.games[id] || {}).name || 'Best Fun Evening');
    return B.waitlist.split('{name}').join(n);
  };

  /* Waitlist form (branch «Рассылка»): /smart/waitlist.html. Shown only once its Brevo addresses are filled in. */
  var wl = null;
  B.waitlistReady = function () {
    if (!wl) wl = fetch('/smart/waitlist.html', { cache: 'no-cache' })
      .then(function (r) { return r.ok ? r.text() : ''; })
      .then(function (h) { return h && h.indexOf('id="waitlist"') > 0 && !/ВСТАВИТЬ_АДРЕС|INSERT_/.test(h) ? h : ''; })
      .catch(function () { return ''; });
    return wl;
  };
  B.mountWaitlist = function (before, game) {
    return B.waitlistReady().then(function (h) {
      if (!h || document.getElementById('waitlist')) return !!h;
      var box = document.createElement('div');
      box.innerHTML = h;
      var sec = box.querySelector('#waitlist');
      if (sec) sec.setAttribute('data-game', game);
      box.querySelectorAll('script').forEach(function (old) {
        var s = document.createElement('script'); s.textContent = old.textContent; old.replaceWith(s);
      });
      while (box.firstChild) before.parentNode.insertBefore(box.firstChild, before);
      if (location.hash === '#waitlist') document.getElementById('waitlist').scrollIntoView();
      return true;
    });
  };

  /* GA4 without cookies (client_storage: 'none') and without ad signals → no consent banner needed,
     but visits still reach the reports (realtime included). Privacy policy 2.5 says the same. */
  if (B.ga4) {
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { dataLayer.push(arguments); };
    gtag('consent', 'default', { analytics_storage: 'granted', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied' });
    gtag('js', new Date());
    gtag('config', B.ga4, { client_storage: 'none', allow_google_signals: false, allow_ad_personalization_signals: false });
    var gs = document.createElement('script'); gs.async = true;
    gs.src = 'https://www.googletagmanager.com/gtag/js?id=' + B.ga4;
    document.head.appendChild(gs);
  }
  B.track = function (name, params) {
    try { if (window.gtag && B.ga4) gtag('event', name, Object.assign({ transport_type: 'beacon' }, params)); } catch (e) {}
  };
  // Open a store with the store_click event; waits a moment so the event leaves before the page does.
  B.go = function (url, params, replace) {
    B.track('store_click', params);
    setTimeout(function () { replace ? location.replace(url) : (location.href = url); }, B.ga4 ? 350 : 0);
  };
})(window.BFEP);
