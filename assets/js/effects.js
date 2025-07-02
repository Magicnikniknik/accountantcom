'use strict';

document.addEventListener('DOMContentLoaded', () => {

    const logoContainer = document.querySelector(".logo-container");
    if (!logoContainer) {
        return; 
    }
    
    const logoLink = logoContainer.querySelector(".logo-text.original");
    const originalText = logoLink.innerText;
    const chars = "!<>-_\\/[]{}—=+*^?#__";
    
    let isAnimating = false; 

    /**
     * Запускает полную последовательность анимации: декодирование, затем эффекты.
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
                // Запускаем CSS-эффекты после завершения декодирования
                logoContainer.classList.add('effects-active');
                
                // Через 2 секунды сбрасываем состояние
                setTimeout(() => {
                    logoContainer.classList.remove('effects-active');
                    isAnimating = false; 
                }, 2000);
            }
            
            iteration += 1 / 3;
        }, 30);
    };
    
    // --- САМОЕ ГЛАВНОЕ ИЗМЕНЕНИЕ ЗДЕСЬ ---
    
    // Надежно определяем, является ли устройство сенсорным.
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

    // 1. Запускаем анимацию один раз при загрузке для ВСЕХ устройств.
    runAnimationSequence();
    
    // 2. Добавляем слушатель наведения ТОЛЬКО для НЕ-сенсорных устройств (десктопов).
    if (!isTouchDevice) {
        logoContainer.addEventListener("mouseenter", runAnimationSequence);
    }
    // На сенсорных устройствах этот блок кода просто не выполнится,
    // и слушатель наведения никогда не будет добавлен.
});