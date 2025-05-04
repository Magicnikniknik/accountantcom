// assets/js/back-to-top.js

// Находим кнопку по ID только если она есть на странице
const backToTopButton = document.getElementById("backToTopBtn");

if (backToTopButton) { // Выполняем код только если кнопка найдена

  // Функция для показа/скрытия кнопки
  const scrollFunction = () => {
    // Порог прокрутки (в пикселях), после которого кнопка появляется
    const scrollThreshold = 200;

    if (document.body.scrollTop > scrollThreshold || document.documentElement.scrollTop > scrollThreshold) {
      backToTopButton.classList.add("show");
    } else {
      backToTopButton.classList.remove("show");
    }
  };

  // Функция для плавной прокрутки наверх
  const scrollToTop = (event) => {
    event.preventDefault(); // Отменяем стандартный переход по #
    window.scrollTo({
      top: 0,
      behavior: 'smooth' // Плавная прокрутка
    });
  };

  // Добавляем слушатели событий
  window.addEventListener("scroll", scrollFunction);
  backToTopButton.addEventListener("click", scrollToTop);

} // конец if (backToTopButton)