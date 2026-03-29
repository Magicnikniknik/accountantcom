'use strict';

document.addEventListener('DOMContentLoaded', () => {

    const logoContainer = document.querySelector(".logo-container");
    const logoLink = logoContainer ? logoContainer.querySelector(".logo-text.original") : null;

    // Запускаем хакер-анимацию только если есть нужный элемент
    if (logoContainer && logoLink) {
        const originalText = logoLink.innerText;
        const chars = "!<>-_\\/[]{}—=+*^?#__";
        let isAnimating = false;

        const runAnimationSequence = () => {
            if (isAnimating) return;
            isAnimating = true;
            let iteration = 0;
            const interval = setInterval(() => {
                logoLink.innerText = originalText.split("").map((letter, index) => {
                    if (index < iteration) return originalText[index];
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

        if (!sessionStorage.getItem('logoAnimationPlayed')) {
            runAnimationSequence();
            sessionStorage.setItem('logoAnimationPlayed', 'true');
        }

        const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        if (!isTouchDevice) {
            logoContainer.addEventListener("mouseenter", runAnimationSequence);
        }
    }

    // Анимация сворачивания navbar-логотипа
    const navLogo = document.getElementById('brand-logo');
    if (navLogo) {
        setTimeout(() => {
            navLogo.classList.add('animating');
            setTimeout(() => {
                navLogo.classList.add('collapsed');
                navLogo.classList.remove('animating');
            }, 1200);
        }, 1200);
    }
});