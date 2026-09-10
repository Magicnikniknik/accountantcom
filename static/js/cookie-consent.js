(function () {
  'use strict';

  const KEY = 'cookie_consent_status';
  const MAX_AGE_SECONDS = 60 * 60 * 24 * 365;
  const banner = () => document.getElementById('cookie-consent-banner');
  let optionalLoaded = false;

  function privacySignalActive() {
    return navigator.globalPrivacyControl === true ||
      navigator.doNotTrack === '1' ||
      window.doNotTrack === '1';
  }

  function readDecision() {
    if (privacySignalActive()) return 'denied';
    try {
      const value = localStorage.getItem(KEY);
      if (value === 'granted' || value === 'denied') return value;
    } catch (_) {}
    const match = document.cookie.match(new RegExp('(?:^|; )' + KEY + '=([^;]*)'));
    return match ? decodeURIComponent(match[1]) : null;
  }

  function saveDecision(value) {
    try { localStorage.setItem(KEY, value); } catch (_) {}
    document.cookie = `${KEY}=${encodeURIComponent(value)}; Max-Age=${MAX_AGE_SECONDS}; Path=/; SameSite=Lax; Secure`;
  }

  function gtag() {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(arguments);
  }

  function loadGTM(config) {
    if (!config || !config.gtmId || document.querySelector('script[data-accountant-gtm]')) return;
    gtag('consent', 'default', {
      analytics_storage: 'granted',
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied'
    });
    window.dataLayer.push({ 'gtm.start': Date.now(), event: 'gtm.js' });
    const script = document.createElement('script');
    script.async = true;
    script.dataset.accountantGtm = '1';
    script.src = `https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(config.gtmId)}`;
    document.head.appendChild(script);
  }

  function loadFirstPartyAnalytics(config) {
    if (!config || !config.analyticsSrc || document.querySelector('script[data-accountant-analytics]')) return;
    const script = document.createElement('script');
    script.defer = true;
    script.dataset.accountantAnalytics = '1';
    script.dataset.project = config.analyticsProject || 'accountantandco';
    script.dataset.endpoint = config.analyticsEndpoint || '';
    script.dataset.redactPath = 'false';
    script.src = config.analyticsSrc;
    document.head.appendChild(script);
  }

  function loadOptionalServices() {
    if (optionalLoaded || privacySignalActive()) return;
    optionalLoaded = true;
    const config = window.ACCOUNTANT_PRIVACY || {};
    loadGTM(config);
    loadFirstPartyAnalytics(config);
    window.dispatchEvent(new CustomEvent('accountant:optional-services-enabled'));
  }

  function applyDecision(value) {
    saveDecision(value);
    if (value === 'granted') loadOptionalServices();
  }

  function openBanner() {
    const el = banner();
    if (el) el.hidden = false;
  }

  function closeBanner() {
    const el = banner();
    if (el) el.hidden = true;
  }

  document.addEventListener('DOMContentLoaded', function () {
    const current = readDecision();
    if (current === 'granted') loadOptionalServices();
    if (!current && !privacySignalActive()) openBanner();

    document.getElementById('cookie-accept-btn')?.addEventListener('click', function (event) {
      event.preventDefault();
      applyDecision('granted');
      closeBanner();
    });

    document.getElementById('cookie-decline-btn')?.addEventListener('click', function (event) {
      event.preventDefault();
      applyDecision('denied');
      closeBanner();
    });

    document.querySelectorAll('[data-cookie-settings]').forEach(function (control) {
      control.addEventListener('click', function (event) {
        event.preventDefault();
        openBanner();
      });
    });
  });
})();
