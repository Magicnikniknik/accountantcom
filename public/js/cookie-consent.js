// static/js/cookie-consent.js
console.log('🍪 cookie-consent.js V2 (with Consent Mode) загружен');

(function() {
    // Ключ для хранения согласия в localStorage / cookie
    const consentPropertyName = 'cookie_consent_status'; // Ключ для хранения 'granted' или 'denied'
    const bannerId = 'cookie-consent-banner';
    const acceptBtnId = 'cookie-accept-btn';
    const declineBtnId = 'cookie-decline-btn';

    /**
     * Сохраняет статус согласия (granted/denied) в localStorage с fallback на cookie.
     * @param {string} status - 'granted' или 'denied'.
     */
    function saveConsentDecision(status) {
      try {
        localStorage.setItem(consentPropertyName, status);
        console.log(`[Cookie Consent] Consent status saved to localStorage: ${status}`);
      } catch (e) {
        console.error('[Cookie Consent] Could not save consent status in localStorage', e);
        // Fallback на cookie, если localStorage недоступен или переполнен
        const expiryDate = new Date();
        expiryDate.setFullYear(expiryDate.getFullYear() + 1); // Срок действия - 1 год
        document.cookie = `${consentPropertyName}=${status}; expires=${expiryDate.toUTCString()}; path=/; SameSite=Lax; Secure`; // Добавлен Secure флаг
        console.log(`[Cookie Consent] Consent status saved to cookie as fallback: ${status}`);
      }
    }

    /**
     * Проверяет, было ли ранее принято какое-либо решение о согласии (granted или denied).
     * @returns {boolean} - true, если решение найдено, false - если нет.
     */
    function hasMadeDecision() {
      let decision = null;
      let source = 'none';
      try {
        decision = localStorage.getItem(consentPropertyName);
        if (decision !== null) {
          source = 'localStorage';
        }
      } catch (e) {
        console.warn('[Cookie Consent] Could not read consent status from localStorage', e);
      }

      if (decision === null) {
        // Fallback: проверяем cookie
        const cookieNameEscaped = consentPropertyName.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1');
        const matches = document.cookie.match(new RegExp('(?:^|; )' + cookieNameEscaped + '=([^;]*)'));
        if (matches) {
          decision = decodeURIComponent(matches[1]);
          source = 'cookie';
        }
      }

      // Логируем результат проверки
      if (decision !== null) {
         console.log(`[Cookie Consent] Found prior decision '${decision}' from ${source}.`);
         return true;
      } else {
         console.log('[Cookie Consent] No prior decision found in localStorage or cookie.');
         return false;
      }
    }

    /**
     * Обновляет Google Consent Mode и сохраняет решение пользователя.
     * Отправляет кастомное событие в dataLayer при предоставлении согласия.
     * @param {boolean} granted - true, если согласие дано, false - если отклонено.
     */
    function updateConsent(granted) {
       // Убедимся, что dataLayer существует и gtag - функция
       window.dataLayer = window.dataLayer || [];
       function gtag(){dataLayer.push(arguments);} // Объявляем gtag локально для надежности

       if (typeof gtag !== 'function') {
           // В этом случае Default Consent state не был установлен правильно перед GTM
           console.error('[Cookie Consent] gtag function is not defined. Consent update failed. Check script order in <head>.');
           // Все равно сохраним решение, чтобы скрыть баннер
           saveConsentDecision(granted ? 'granted' : 'denied');
           return;
       }

       // Формируем объект состояния согласия
       const consentState = {
           'analytics_storage': granted ? 'granted' : 'denied',
           'ad_storage': granted ? 'granted' : 'denied', // Добавляем и рекламное согласие
           'ad_user_data': granted ? 'granted' : 'denied',
           'ad_personalization': granted ? 'granted' : 'denied'
           // Добавьте/удалите другие типы по необходимости
       };

       // 1. Отправляем команду обновления в Consent Mode
       gtag('consent', 'update', consentState);
       console.log('[Cookie Consent] Google Consent Mode updated:', consentState);

       // 2. Сохраняем решение локально ('granted' или 'denied')
       saveConsentDecision(granted ? 'granted' : 'denied');

       // 3. Отправляем кастомное событие в dataLayer, ТОЛЬКО если согласие ПОЛУЧЕНО
       if (granted) {
           window.dataLayer.push({'event': 'consent_update_success'});
           console.log('[Cookie Consent] Pushed "consent_update_success" event to dataLayer.');
       } else {
            // Можно добавить другое событие при отказе, если нужно
            // window.dataLayer.push({'event': 'consent_update_denied'});
            // console.log('[Cookie Consent] Pushed "consent_update_denied" event to dataLayer.');
       }
    }

    // --- Основная логика при загрузке DOM ---
    document.addEventListener('DOMContentLoaded', () => {
      console.log('[Cookie Consent] DOM Content Loaded. Initializing banner logic...');
      const banner = document.getElementById(bannerId);
      if (!banner) {
        console.error(`[Cookie Consent] Cookie banner element NOT found (ID: ${bannerId})`);
        return;
      }
      console.log('[Cookie Consent] Cookie banner element FOUND:', banner);

      const acceptBtn = document.getElementById(acceptBtnId);
      const declineBtn = document.getElementById(declineBtnId);

      // Проверяем кнопки
      if (!acceptBtn) console.error(`[Cookie Consent] Accept button NOT found (ID: ${acceptBtnId})`);
      if (!declineBtn) console.error(`[Cookie Consent] Decline button NOT found (ID: ${declineBtnId})`);

      // Проверяем, было ли решение принято ранее
      const decisionMade = hasMadeDecision(); // Эта функция уже выводит лог

      // Показываем баннер, только если решение НЕ было принято
      if (!decisionMade) {
        console.log('[Cookie Consent] Decision not made previously. Trying to show banner...');
        banner.hidden = false;
        // Дополнительная проверка display стиля
        setTimeout(() => {
            try {
                const styles = window.getComputedStyle(banner);
                console.log(`[Cookie Consent] Banner display style after setting hidden=false: ${styles.display}`);
                if (styles.display === 'none' && !banner.hidden) { // Добавили проверку !banner.hidden
                    console.warn('[Cookie Consent] Banner display is "none" despite hidden=false. Check CSS conflicts.');
                } else if (styles.display !== 'none' && banner.hidden) {
                     console.warn('[Cookie Consent] Banner has hidden attribute but display is not "none". Check CSS.');
                }
            } catch(e) {
                console.error('[Cookie Consent] Error getting computed style for banner', e);
            }
        }, 150); // Немного увеличили задержку
      }
      // Нет else, hasMadeDecision уже вывел лог

      // Назначаем обработчики кнопок, если они найдены
      if (acceptBtn) {
        acceptBtn.addEventListener('click', (e) => {
          e.preventDefault(); // Предотвращаем стандартное действие кнопки
          console.log('[Cookie Consent] Accept button clicked.');
          updateConsent(true); // Обновляем согласие как 'granted'
          banner.hidden = true;  // Скрываем баннер
          console.log('[Cookie Consent] Banner hidden after Accept.');
        });
      }

      if (declineBtn) {
        declineBtn.addEventListener('click', (e) => {
          e.preventDefault();
          console.log('[Cookie Consent] Decline button clicked.');
          updateConsent(false); // Обновляем согласие как 'denied'
          banner.hidden = true;   // Скрываем баннер
           console.log('[Cookie Consent] Banner hidden after Decline.');
        });
      }
    });
  })();