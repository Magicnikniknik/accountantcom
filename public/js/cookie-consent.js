// static/js/cookie-consent.js
console.log('🍪 cookie-consent.js V2 (with Consent Mode) загружен');

(function() {
    // Используем тот же ключ для простоты - он будет хранить 'granted' или 'denied'
    // или можно использовать новый ключ типа 'consent_choice_made'
    const consentPropertyName = 'cookie_consent_status'; // Переименовали для ясности
    const bannerId = 'cookie-consent-banner';
    const acceptBtnId = 'cookie-accept-btn';
    const declineBtnId = 'cookie-decline-btn';

    // --- Функции для работы с localStorage/cookie (остаются почти такими же) ---
    function saveConsentDecision(status) { // status будет 'granted' или 'denied'
      try {
        localStorage.setItem(consentPropertyName, status);
        console.log(`Consent status saved to localStorage: ${status}`);
      } catch (e) {
        console.error('Could not save consent status in localStorage', e);
        const expiryDate = new Date();
        expiryDate.setFullYear(expiryDate.getFullYear() + 1);
        document.cookie = `${consentPropertyName}=${status}; expires=${expiryDate.toUTCString()}; path=/; SameSite=Lax`;
        console.log(`Consent status saved to cookie as fallback: ${status}`);
      }
    }

    function hasMadeDecision() {
      let decision = null;
      try {
        decision = localStorage.getItem(consentPropertyName);
      } catch (e) {
        console.warn('Could not read consent status from localStorage', e);
      }
      if (decision !== null) {
        return true; // Решение было принято (granted или denied)
      }
      // fallback: проверяем cookie
      const matches = document.cookie.match(
        new RegExp('(?:^|; )' + consentPropertyName.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + '=([^;]*)')
      );
      return matches ? true : false; // Есть cookie - решение было
    }
    // --- Конец функций для работы с хранилищем ---


    // --- Функция обновления Google Consent Mode ---
    function updateConsent(granted) {
       // Проверяем, доступна ли функция gtag (она должна быть из Default State или GTM)
       if (typeof gtag !== 'function') {
           console.error('gtag function is not defined. Make sure GTM or Default Consent is loaded before this script.');
           return;
       }

       const consentState = {
           'analytics_storage': granted ? 'granted' : 'denied',
           // Добавьте другие типы, если нужно (например, ad_storage)
           // 'ad_storage': granted ? 'granted' : 'denied',
           // 'ad_user_data': granted ? 'granted' : 'denied',
           // 'ad_personalization': granted ? 'granted' : 'denied'
       };

       gtag('consent', 'update', consentState);
       console.log('Google Consent Mode updated:', consentState);

       // Также сохраняем сам факт принятия решения для постоянного скрытия баннера
       saveConsentDecision(granted ? 'granted' : 'denied');
    }
    // --- Конец функции обновления ---


    document.addEventListener('DOMContentLoaded', () => {
      const banner = document.getElementById(bannerId);
      if (!banner) {
        console.error('Cookie banner element not found');
        return;
      }

      const acceptBtn = document.getElementById(acceptBtnId);
      const declineBtn = document.getElementById(declineBtnId);

      // Если решение еще НЕ было принято, показываем баннер
      if (!hasMadeDecision()) {
        console.log('No prior consent decision found. Showing banner.');
        banner.hidden = false;
      } else {
         console.log('Prior consent decision found. Banner remains hidden.');
      }

      // Обработчик «Принять»
      if (acceptBtn) {
        acceptBtn.addEventListener('click', () => {
          console.log('Accept button clicked.');
          updateConsent(true); // Отправляем 'granted'
          banner.hidden = true;
        });
      } else {
         console.error('Accept button not found');
      }

      // Обработчик «Отклонить»
      if (declineBtn) {
        declineBtn.addEventListener('click', () => {
          console.log('Decline button clicked.');
          updateConsent(false); // Отправляем 'denied'
          banner.hidden = true;
        });
      } else {
         console.error('Decline button not found');
      }
    });
  })();