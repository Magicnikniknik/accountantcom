'use strict';

document.addEventListener('DOMContentLoaded', () => {

    const logoContainer = document.querySelector(".logo-container");
    if (!logoContainer) {
        return; 
    }
    
    const logoLink = logoContainer.querySelector(".logo-text.original");
    const originalText = logoLink.innerText;
    const chars = "!<>-_\\/[]{}—=+*^?#________";
    
    let isAnimating = false;

    /**
     * Запускает полную последовательность анимации.
     */
    const runAnimationSequence = () => {
        if (isAnimating) {
            return;
        }
        isAnimating = true;

        let iteration = 0;
        const interval = setInterval(() => {
            logoLink.innerText = originalText.split("").map((letter, index) => {
                if (index < iteration) {
                    return originalText[index];
                }
                return chars[Math.floor(Math.random() * chars.length)];
            }).join("");

            if (iteration >= originalText.length) {
                clearInterval(interval);
                logoContainer.classList.add('effects-active');
                
                setTimeout(() => {
                    logoContainer.classList.remove('effects-active');
                    isAnimating = false; 
                }, 2000);
            }
            
            iteration += 1 / 3;
        }, 30);
    };
    
    // --- ЛОГИКА ЗАПУСКА (ИСПРАВЛЕНА) ---
    
    // 1. Проверяем, проигрывалась ли анимация в ТЕКУЩЕЙ СЕССИИ.
    if (!sessionStorage.getItem('logoAnimationPlayed')) {
        // Если нет - запускаем анимацию.
        runAnimationSequence();
      
        // И сразу же ставим флаг, чтобы на других страницах сайта она больше не запускалась.
        sessionStorage.setItem('logoAnimationPlayed', 'true');
    }

    // 2. Добавляем слушатель наведения ТОЛЬКО для НЕ-сенсорных устройств (десктопов).
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (!isTouchDevice) {
        logoContainer.addEventListener("mouseenter", runAnimationSequence);
    }
});