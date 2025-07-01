'use strict';

document.addEventListener('DOMContentLoaded', () => {

    const logoContainer = document.querySelector(".logo-container");
    const logoLink = logoContainer ? logoContainer.querySelector(".logo-text.original") : null;

    if (!logoContainer || !logoLink) {
        console.error("ОШИБКА: Не могу найти '.logo-container' или '.logo-text.original'. Проверьте HTML в header.html.");
        return;
    }
    
    console.log("УСПЕХ: Элементы для анимации найдены.");

    const originalText = logoLink.innerText;
    const chars = "!<>-_\\/[]{}—=+*^?#________";
    let animationTimeout;
    let isAnimating = false;

    const animateLogo = () => {
        if (isAnimating) return;
        isAnimating = true;

        if(animationTimeout) clearTimeout(animationTimeout);
        logoContainer.classList.remove('effects-active');

        let iteration = 0;
        const interval = setInterval(() => {
            logoLink.innerText = originalText.split("").map((letter, index) => {
                if (index < iteration) return originalText[index];
                return chars[Math.floor(Math.random() * chars.length)];
            }).join("");

            if (iteration >= originalText.length) {
                clearInterval(interval);
                triggerAllEffects();
            }
            iteration += 1 / 3;
        }, 30);
    };

    const triggerAllEffects = () => {
        console.log("ЛОГО: Запускаю эффекты ореола и волны.");
        logoContainer.classList.add('effects-active');

        animationTimeout = setTimeout(() => {
            logoContainer.classList.remove('effects-active');
            isAnimating = false;
        }, 2000);
    };

    const hasAnimatedBefore = localStorage.getItem('logoAnimationPlayed');
    if (!hasAnimatedBefore) {
        animateLogo();
        localStorage.setItem('logoAnimationPlayed', 'true');
    } else {
        isAnimating = false;
    }
    
    logoContainer.addEventListener("mouseover", animateLogo);
});