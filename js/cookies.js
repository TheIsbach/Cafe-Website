/* Der Franzose – DSGVO Cookie Consent */

(function () {
  'use strict';

  var STORAGE_KEY = 'df_cookie_consent';
  var banner      = document.getElementById('cookie-banner');
  var btnAccept   = document.getElementById('cookie-accept');
  var btnDecline  = document.getElementById('cookie-decline');

  function getConsent() {
    try { return localStorage.getItem(STORAGE_KEY); } catch (e) { return null; }
  }

  function setConsent(value) {
    try { localStorage.setItem(STORAGE_KEY, value); } catch (e) {}
  }

  function hideBanner() {
    if (!banner) return;
    banner.classList.remove('visible');
    banner.setAttribute('aria-hidden', 'true');
    setTimeout(function () {
      banner.style.display = 'none';
    }, 600);
  }

  function showBanner() {
    if (!banner) return;
    banner.style.display = '';
    // Force reflow before adding class for transition
    void banner.offsetWidth;
    banner.classList.add('visible');
    banner.setAttribute('aria-hidden', 'false');
  }

  function init() {
    if (!banner) return;

    var consent = getConsent();

    if (consent) {
      banner.style.display = 'none';
      return;
    }

    // Show after a small delay so it doesn't flash immediately on load
    setTimeout(showBanner, 900);

    if (btnAccept) {
      btnAccept.addEventListener('click', function () {
        setConsent('all');
        hideBanner();
      });
    }

    if (btnDecline) {
      btnDecline.addEventListener('click', function () {
        setConsent('essential');
        hideBanner();
      });
    }
  }

  // Run after DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Expose for potential use in other scripts
  window.dfCookies = {
    hasConsent: function (type) {
      var c = getConsent();
      if (type === 'essential') return c !== null;
      return c === 'all';
    },
    resetConsent: function () {
      try { localStorage.removeItem(STORAGE_KEY); } catch (e) {}
    }
  };

})();
