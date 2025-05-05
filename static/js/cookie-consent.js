// static/js/cookie-consent.js
console.log('🍪 cookie-consent.js V2 (with Consent Mode) загружен');

(function() {
    const consentPropertyName = 'cookie_consent_status';
    const bannerId = 'cookie-consent-banner';
    const acceptBtnId = 'cookie-accept-btn';
    const declineBtnId = 'cookie-decline-btn';

    // --- Функции для работы с localStorage/cookie ---
    function saveConsentDecision(status) {
      try {
        localStorage.setItem(consentPropertyName, status);
        console.log(`[Cookie Consent] Consent status saved to localStorage: ${status}`); // Добавлен префикс
      } catch (e) {
        console.error('[Cookie Consent] Could not save consent status in localStorage', e);
        const expiryDate = new Date();
        expiryDate.setFullYear(expiryDate.getFullYear() + 1);
        document.cookie = `${consentPropertyName}=${status}; expires=${expiryDate.toUTCString()}; path=/; SameSite=Lax`;
        console.log(`[Cookie Consent] Consent status saved to cookie as fallback: ${status}`); // Добавлен префикс
      }
    }

    function hasMadeDecision() {
      let decision = null;
      let source = 'none'; // Источник найденного решения
      try {
        decision = localStorage.getItem(consentPropertyName);
        if (decision !== null) {
          source = 'localStorage';
        }
      } catch (e) {
        console.warn('[Cookie Consent] Could not read consent status from localStorage', e);
      }

      // Если не нашли в localStorage, проверяем cookie
      if (decision === null) {
        const matches = document.cookie.match(
          new RegExp('(?:^|; )' + consentPropertyName.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + '=([^;]*)')
        );
        if (matches) {
          decision = decodeURIComponent(matches[1]);
          source = 'cookie';
        }
      }

      // ЛОГ: Выводим, что нашли (или не нашли)
      if (decision !== null) {
         console.log(`[Cookie Consent] Found prior decision '${decision}' from ${source}.`); // <-- ЛОГ 1 (что нашли)
         return true; // Решение было принято
      } else {
         console.log('[Cookie Consent] No prior decision found in localStorage or cookie.'); // <-- ЛОГ 2 (ничего не нашли)
         return false; // Решение не было принято
      }
    }
    // --- Конец функций ---


    // --- Функция обновления Google Consent Mode ---
    function updateConsent(granted) {
       if (typeof gtag !== 'function') {
           console.error('[Cookie Consent] gtag function is not defined.'); // Добавлен префикс
           return;
       }
       const consentState = {
           'analytics_storage': granted ? 'granted' : 'denied',
           // 'ad_storage': granted ? 'granted' : 'denied', // Раскомментируйте если нужно
       };
       gtag('consent', 'update', consentState);
       console.log('[Cookie Consent] Google Consent Mode updated:', consentState); // Добавлен префикс
       saveConsentDecision(granted ? 'granted' : 'denied'); // Сохраняем 'granted' или 'denied'
    }
    // --- Конец функции ---


    document.addEventListener('DOMContentLoaded', () => {
      console.log('[Cookie Consent] DOM Content Loaded'); // Добавлен префикс
      const banner = document.getElementById(bannerId);
      if (!banner) {
        console.error('[Cookie Consent] Cookie banner element NOT found (ID: ' + bannerId + ')'); // Уточнили ID
        return;
      }
      console.log('[Cookie Consent] Cookie banner element FOUND:', banner); // Добавлен префикс

      const acceptBtn = document.getElementById(acceptBtnId);
      const declineBtn = document.getElementById(declineBtnId);

      if (!acceptBtn) console.error('[Cookie Consent] Accept button NOT found (ID: ' + acceptBtnId + ')');
      if (!declineBtn) console.error('[Cookie Consent] Decline button NOT found (ID: ' + declineBtnId + ')');

      // Проверяем, было ли решение принято РАНЬШЕ
      const decisionMade = hasMadeDecision(); // Эта функция уже содержит логи

      if (!decisionMade) {
        console.log('[Cookie Consent] Trying to show banner...'); // Добавлен префикс
        banner.hidden = false;
        // Проверка стиля через небольшую задержку
        setTimeout(() => {
            try {
                const styles = window.getComputedStyle(banner);
                console.log('[Cookie Consent] Banner display style after setting hidden=false:', styles.display);
                if (styles.display === 'none') {
                    console.warn('[Cookie Consent] Banner display is "none" even after setting hidden=false. Check CSS conflicts or other scripts.');
                }
            } catch(e) {
                console.error('[Cookie Consent] Error getting computed style for banner', e);
            }
        }, 100);
      }
      // Нет 'else', т.к. hasMadeDecision уже вывела лог, если решение найдено

      // Обработчик «Принять»
      if (acceptBtn) {
        acceptBtn.addEventListener('click', (e) => {
          e.preventDefault(); // На всякий случай, если это ссылка или тип submit
          console.log('[Cookie Consent] Accept button clicked.'); // Добавлен префикс
          updateConsent(true);
          banner.hidden = true;
        });
      }

      // Обработчик «Отклонить»
      if (declineBtn) {
        declineBtn.addEventListener('click', (e) => {
          e.preventDefault(); // На всякий случай
          console.log('[Cookie Consent] Decline button clicked.'); // Добавлен префикс
          updateConsent(false);
          banner.hidden = true;
        });
      }
    });
  })();