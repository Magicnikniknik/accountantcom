// static/js/cookie-consent.js
console.log('🍪 cookie-consent.js загружен');

(function() {
    // Ключ для хранения согласия в localStorage / cookie
    const consentPropertyName = 'cookie_consent_accepted';
    const bannerId = 'cookie-consent-banner';
    const acceptBtnId = 'cookie-accept-btn';
    const declineBtnId = 'cookie-decline-btn';
  
    // Сохраняем согласие
    function setConsent(value) {
      try {
        localStorage.setItem(consentPropertyName, value ? 'true' : 'false');
      } catch (e) {
        console.error('Could not set cookie consent in localStorage', e);
        // fallback на cookie
        const expiryDate = new Date();
        expiryDate.setFullYear(expiryDate.getFullYear() + 1);
        document.cookie = `${consentPropertyName}=${value ? 'true' : 'false'}; expires=${expiryDate.toUTCString()}; path=/; SameSite=Lax`;
      }
    }
  
    // Читаем согласие
    function getConsent() {
      try {
        const consent = localStorage.getItem(consentPropertyName);
        if (consent !== null) {
          return consent === 'true';
        }
      } catch (e) {
        console.warn('Could not read cookie consent from localStorage', e);
      }
      // fallback: проверяем cookie
      const matches = document.cookie.match(
        new RegExp('(?:^|; )' + consentPropertyName.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + '=([^;]*)')
      );
      return matches ? decodeURIComponent(matches[1]) === 'true' : null;
    }
  
    document.addEventListener('DOMContentLoaded', () => {
      const banner = document.getElementById(bannerId);
      if (!banner) return;
  
      const acceptBtn = document.getElementById(acceptBtnId);
      const declineBtn = document.getElementById(declineBtnId);
  
      // Если согласия нет (возвращает null), показываем баннер
      if (getConsent() === null) {
        banner.hidden = false;
      }
  
      // Обработчик «Принять»
      if (acceptBtn) {
        acceptBtn.addEventListener('click', () => {
          setConsent(true);
          banner.hidden = true;
          console.log('Cookie consent accepted.');
          // Здесь можно запустить аналитику и другие скрипты
        });
      }
  
      // Обработчик «Отклонить»
      if (declineBtn) {
        declineBtn.addEventListener('click', () => {
          setConsent(false);
          banner.hidden = true;
          console.log('Cookie consent declined.');
        });
      }
    });
  })();
  