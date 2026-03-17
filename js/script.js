(function() {
    // Запрет перетаскивания изображений
    document.querySelectorAll('img').forEach(img => {
        img.addEventListener('dragstart', (e) => e.preventDefault());
        img.setAttribute('draggable', 'false');
    });

    // Защита от выделения текста в шапке
    const headerElements = document.querySelectorAll('.glass-header, .location-text');
    headerElements.forEach(el => {
        el.style.userSelect = 'none';
        el.style.webkitUserSelect = 'none';
        el.style.msUserSelect = 'none';
    });

    // ===== ПЕРВЫЙ БЛОК (3 карточки) =====
    const wrapper = document.getElementById('cardsWrapper');
    const section = document.getElementById('cardsSection');

    let isMobile = window.innerWidth <= 768;

    const CONFIG = {
        cardWidth: 252,
        cardsData: [
            { url: 'roomservice.html', image: 'img/room_service.svg', text: 'Рум сервис', textEn: 'Room service' },
            { url: 'service.html', image: 'img/enabled.svg', text: 'Включено в проживание', textEn: 'Included in stay' },
            { url: 'https://shop.hotbot.ai/korstonkazan', image: 'img/dop_in_room.svg', text: 'Дополнительный сервис', textEn: 'Service' }
        ]
    };

    function createCard(data) {
        const link = document.createElement('a');
        link.href = data.url;
        link.className = 'card-link';

        const card = document.createElement('div');
        card.className = 'card';

        const img = document.createElement('img');
        img.src = data.image;
        img.alt = 'Card image';
        img.className = 'card-image';
        img.loading = 'lazy';

        const cardText = document.createElement('div');
        cardText.className = 'card-text';
        cardText.setAttribute('data-ru', data.text);
        cardText.setAttribute('data-en', data.textEn);
        cardText.textContent = data.text;

        card.appendChild(img);
        card.appendChild(cardText);
        link.appendChild(card);

        return link;
    }

    function initFirstBlock() {
        if (!wrapper || !section) return;

        section.innerHTML = '';

        if (isMobile) {
            for (let i = 0; i < 5; i++) {
                CONFIG.cardsData.forEach(data => {
                    section.appendChild(createCard(data));
                });
            }

            const startPosition = CONFIG.cardWidth * CONFIG.cardsData.length * 2;
            wrapper.scrollLeft = startPosition;

            setupInfiniteScroll();
        } else {
            CONFIG.cardsData.forEach(data => {
                section.appendChild(createCard(data));
            });
        }
    }

    function setupInfiniteScroll() {
        if (!wrapper || !section) return;

        let isDragging = false;
        let startX, scrollLeft;
        let rafId = null;

        wrapper.addEventListener('mousedown', (e) => {
            isDragging = true;
            wrapper.classList.add('dragging');
            startX = e.pageX - wrapper.offsetLeft;
            scrollLeft = wrapper.scrollLeft;
            e.preventDefault();
        });

        window.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            e.preventDefault();
            const x = e.pageX - wrapper.offsetLeft;
            const walk = (x - startX) * 1.5;
            wrapper.scrollLeft = scrollLeft - walk;
        });

        window.addEventListener('mouseup', () => {
            isDragging = false;
            wrapper.classList.remove('dragging');
        });

        function checkInfiniteScroll() {
            const scrollPos = wrapper.scrollLeft;
            const totalWidth = section.scrollWidth;
            const wrapperWidth = wrapper.clientWidth;
            const setWidth = CONFIG.cardWidth * CONFIG.cardsData.length;
            const buffer = 100;

            if (scrollPos < buffer) {
                wrapper.scrollLeft = scrollPos + setWidth;
                return;
            }

            if (scrollPos + wrapperWidth > totalWidth - buffer) {
                wrapper.scrollLeft = scrollPos - setWidth;
                return;
            }
        }

        wrapper.addEventListener('scroll', () => {
            if (rafId) {
                cancelAnimationFrame(rafId);
            }
            rafId = requestAnimationFrame(() => {
                checkInfiniteScroll();
                rafId = null;
            });
        });

        wrapper.addEventListener('wheel', (e) => {
            e.preventDefault();
            wrapper.scrollLeft += e.deltaY;
        }, { passive: false });

        wrapper.addEventListener('touchstart', (e) => {
            isDragging = true;
            startX = e.touches[0].pageX - wrapper.offsetLeft;
            scrollLeft = wrapper.scrollLeft;
        });

        wrapper.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            e.preventDefault();
            const x = e.touches[0].pageX - wrapper.offsetLeft;
            const walk = (x - startX) * 1.5;
            wrapper.scrollLeft = scrollLeft - walk;
        });

        wrapper.addEventListener('touchend', () => {
            isDragging = false;
        });

        wrapper.addEventListener('touchcancel', () => {
            isDragging = false;
        });
    }

    function handleResize() {
        const newIsMobile = window.innerWidth <= 768;

        if (newIsMobile !== isMobile) {
            isMobile = newIsMobile;
            initFirstBlock();
        }
    }

    initFirstBlock();

    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(handleResize, 250);
    });

// ===== ВТОРОЙ БЛОК: Инициализация Swiper с бесконечной прокруткой =====
if (document.querySelector('.swiper-container')) {
    const gallerySwiper = new Swiper('.swiper-container', {
        slidesPerView: 'auto',
        centeredSlides: true,
        loop: true,
        speed: 800,
        grabCursor: true,
        effect: 'coverflow', // Добавляем эффект coverflow
        coverflowEffect: {
            rotate: 0,          // Убираем вращение
            stretch: 0,         // Убираем растяжение
            depth: 200,         // Глубина для 3D эффекта
            modifier: 1,        // Модификатор эффекта
            slideShadows: false // Отключаем тени для чистоты
        },
        breakpoints: {
            320: {
                spaceBetween: 10,
            },
            768: {
                spaceBetween: 15,
            },
            1024: {
                spaceBetween: 20,
            }
        }
    });
}

    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 600,
            once: true,
            offset: 50
        });
    }

    // ===== Функционал аккордеона в футере =====
    function initFooterAccordion() {
        const isMobile = window.innerWidth <= 768;
        const footerColumns = document.querySelectorAll('.footer__column');

        footerColumns.forEach(column => {
            const title = column.querySelector('.footer__title');
            const menu = column.querySelector('.footer__menu');

            if (!title || !menu) return;

            if (column.clickHandler) {
                title.removeEventListener('click', column.clickHandler);
            }

            if (isMobile) {
                column.classList.remove('active');
                menu.style.display = 'none';

                column.clickHandler = function(e) {
                    e.preventDefault();

                    const isActive = column.classList.contains('active');

                    if (isActive) {
                        column.classList.remove('active');
                        menu.style.display = 'none';
                    } else {
                        footerColumns.forEach(otherColumn => {
                            if (otherColumn !== column && otherColumn.classList.contains('active')) {
                                otherColumn.classList.remove('active');
                                const otherMenu = otherColumn.querySelector('.footer__menu');
                                if (otherMenu) {
                                    otherMenu.style.display = 'none';
                                }
                            }
                        });

                        column.classList.add('active');
                        menu.style.display = 'block';
                    }
                };

                title.addEventListener('click', column.clickHandler);
            } else {
                column.classList.remove('active');
                menu.style.display = 'block';
            }
        });
    }

    initFooterAccordion();

    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(function() {
            initFooterAccordion();
        }, 150);
    });

    // ===== ПЕРЕКЛЮЧАТЕЛЬ ЯЗЫКА =====

    const languageSwitcher = document.getElementById('languageSwitcher');
    const languageDropdown = document.getElementById('languageDropdown');
    const currentFlag = document.getElementById('currentFlag');

    if (!languageSwitcher || !languageDropdown || !currentFlag) {
        console.error('Элементы переключателя языка не найдены');
        return;
    }

    // Словарь перевода
    const translations = {
        ru: {
            'location-text': 'Казань',
            'hero-title': 'Больше чем отель',
            'hero-text-1': 'Отдых • Бизнес •',
            'hero-text-2': 'Эмоции',
            'hero-text-3': 'в один клик',
            'scroll-text': 'Покрутите вниз',
            'card-text-1': 'Рум сервис',
            'card-text-2': 'Включено в проживание',
            'card-text-3': 'Дополнительный сервис',
            'service-title-1': 'Афиша',
            'service-title-2': 'Рестораны',
            'service-title-3': 'Кинотеатр',
            'service-title-4': 'Фуд Молл',
            'service-title-5': 'Дринк Молл',
            'feedback-text': 'Оставить отзыв',
            'social-title': 'Следите за актуальными новостями в наших социальных сетях',
            'cashback-title': 'Больше эмоций, меньше затрат',
            'cashback-word': 'КЭШБЭК',
            'cashback-description': 'Присоединяйтесь к программе лояльности и получайте выгоду с каждой покупки в Korston',
            'cashback-button': 'Скачать Korston App',
            'footer-title-1': 'Компания',
            'footer-title-2': 'Юридическая информация',
            'footer-link-1': 'Контакты',
            'footer-link-2': 'Реквизиты',
            'footer-link-3': 'Главная',
            'footer-link-4': 'Документы',
            'footer-link-5': 'Политика обработки персональных данных',
            'footer-link-6': 'Пользовательское соглашение',
            'footer-copyright': '© 2026 Korston Club Hotel. Все права защищены.'
        },
        en: {
            'location-text': 'Kazan',
            'hero-title': 'More than a hotel',
            'hero-text-1': 'Relax • Business •',
            'hero-text-2': 'Emotions',
            'hero-text-3': 'in one click',
            'scroll-text': 'Scroll down',
            'card-text-1': 'Room service',
            'card-text-2': 'Included in stay',
            'card-text-3': 'Additional service',
            'service-title-1': 'Poster',
            'service-title-2': 'Restaurants',
            'service-title-3': 'Cinema',
            'service-title-4': 'Food Mall',
            'service-title-5': 'Drink Mall',
            'feedback-text': 'Leave feedback',
            'social-title': 'Follow the latest news on our social networks',
            'cashback-title': 'More emotions, less cost',
            'cashback-word': 'CASHBACK',
            'cashback-description': 'Join the loyalty program and benefit from every purchase at Korston',
            'cashback-button': 'Download Korston App',
            'footer-title-1': 'Company',
            'footer-title-2': 'Legal Information',
            'footer-link-1': 'Contacts',
            'footer-link-2': 'Details',
            'footer-link-3': 'Home',
            'footer-link-4': 'Documents',
            'footer-link-5': 'Privacy Policy',
            'footer-link-6': 'Terms of Use',
            'footer-copyright': '© 2026 Korston Club Hotel. All rights reserved.'
        }
    };

    // Пути к флагам
    const flagPaths = {
        ru: 'img/flag.svg',
        en: 'img/flag_eng.svg'
    };

    // Функция применения перевода
    function applyLanguage(lang) {
        try {
            // Город
            const locationText = document.querySelector('.location-text');
            if (locationText) locationText.textContent = translations[lang]['location-text'];

            // Hero секция
            const heroTitle = document.querySelector('.hero-title');
            if (heroTitle) heroTitle.textContent = translations[lang]['hero-title'];

            const heroText1 = document.querySelector('.hero-text-1');
            if (heroText1) heroText1.textContent = translations[lang]['hero-text-1'];

            const heroText2 = document.querySelector('.hero-text-2');
            if (heroText2) heroText2.textContent = translations[lang]['hero-text-2'];

            const heroText3 = document.querySelector('.hero-text-3');
            if (heroText3) heroText3.textContent = translations[lang]['hero-text-3'];

            // Scroll text
            const scrollTextRu = document.querySelector('.scroll-text-ru');
            const scrollTextEn = document.querySelector('.scroll-text-en');
            if (scrollTextRu && scrollTextEn) {
                scrollTextRu.style.display = lang === 'ru' ? 'block' : 'none';
                scrollTextEn.style.display = lang === 'en' ? 'block' : 'none';
            }

            // Карточки первого блока
            const cardText1 = document.querySelector('.card-text-1');
            const cardText2 = document.querySelector('.card-text-2');
            const cardText3 = document.querySelector('.card-text-3');

            if (cardText1) cardText1.textContent = translations[lang]['card-text-1'];
            if (cardText2) cardText2.textContent = translations[lang]['card-text-2'];
            if (cardText3) cardText3.textContent = translations[lang]['card-text-3'];

            // Второй блок - заголовки сервисов
            for (let i = 1; i <= 5; i++) {
                const titleRu = document.querySelector(`.service-preview__title-${i}`);
                const titleEn = document.querySelector(`.service-preview__title-${i}-en`);
                if (titleRu && titleEn) {
                    titleRu.style.display = lang === 'ru' ? 'block' : 'none';
                    titleEn.style.display = lang === 'en' ? 'block' : 'none';
                }
            }

            // Feedback text
            const feedbackTextRu = document.querySelector('.feedback-text-ru');
            const feedbackTextEn = document.querySelector('.feedback-text-en');
            if (feedbackTextRu && feedbackTextEn) {
                feedbackTextRu.style.display = lang === 'ru' ? 'block' : 'none';
                feedbackTextEn.style.display = lang === 'en' ? 'block' : 'none';
            }

            // Cashback блок
            const cashbackTitleRu = document.querySelector('.cashback-title-ru');
            const cashbackTitleEn = document.querySelector('.cashback-title-en');
            if (cashbackTitleRu && cashbackTitleEn) {
                cashbackTitleRu.style.display = lang === 'ru' ? 'block' : 'none';
                cashbackTitleEn.style.display = lang === 'en' ? 'block' : 'none';
            }

            const cashbackWordRu = document.querySelector('.cashback-word-ru');
            const cashbackWordEn = document.querySelector('.cashback-word-en');
            if (cashbackWordRu && cashbackWordEn) {
                cashbackWordRu.style.display = lang === 'ru' ? 'inline-block' : 'none';
                cashbackWordEn.style.display = lang === 'en' ? 'inline-block' : 'none';
            }

            const cashbackDescRu = document.querySelector('.cashback-description-ru');
            const cashbackDescEn = document.querySelector('.cashback-description-en');
            if (cashbackDescRu && cashbackDescEn) {
                cashbackDescRu.style.display = lang === 'ru' ? 'block' : 'none';
                cashbackDescEn.style.display = lang === 'en' ? 'block' : 'none';
            }

            const cashbackButtonRu = document.querySelector('.cashback-button-ru');
            const cashbackButtonEn = document.querySelector('.cashback-button-en');
            if (cashbackButtonRu && cashbackButtonEn) {
                cashbackButtonRu.style.display = lang === 'ru' ? 'inline-block' : 'none';
                cashbackButtonEn.style.display = lang === 'en' ? 'inline-block' : 'none';
            }

            // Social title
            const socialTitleRu = document.querySelector('.social-title-ru');
            const socialTitleEn = document.querySelector('.social-title-en');
            if (socialTitleRu && socialTitleEn) {
                socialTitleRu.style.display = lang === 'ru' ? 'block' : 'none';
                socialTitleEn.style.display = lang === 'en' ? 'block' : 'none';
            }

            // Футер
            const footerTitle1 = document.querySelector('.footer-title-1');
            const footerTitle2 = document.querySelector('.footer-title-2');
            if (footerTitle1) footerTitle1.textContent = translations[lang]['footer-title-1'];
            if (footerTitle2) footerTitle2.textContent = translations[lang]['footer-title-2'];

            const footerLink1 = document.querySelector('.footer-link-1');
            const footerLink2 = document.querySelector('.footer-link-2');
            const footerLink3 = document.querySelector('.footer-link-3');
            const footerLink4 = document.querySelector('.footer-link-4');
            const footerLink5 = document.querySelector('.footer-link-5');
            const footerLink6 = document.querySelector('.footer-link-6');

            if (footerLink1) footerLink1.textContent = translations[lang]['footer-link-1'];
            if (footerLink2) footerLink2.textContent = translations[lang]['footer-link-2'];
            if (footerLink3) footerLink3.textContent = translations[lang]['footer-link-3'];
            if (footerLink4) footerLink4.textContent = translations[lang]['footer-link-4'];
            if (footerLink5) footerLink5.textContent = translations[lang]['footer-link-5'];
            if (footerLink6) footerLink6.textContent = translations[lang]['footer-link-6'];

            const footerCopyrightRu = document.querySelector('.footer-copyright-ru');
            const footerCopyrightEn = document.querySelector('.footer-copyright-en');
            if (footerCopyrightRu && footerCopyrightEn) {
                footerCopyrightRu.style.display = lang === 'ru' ? 'block' : 'none';
                footerCopyrightEn.style.display = lang === 'en' ? 'block' : 'none';
            }

            // Обновляем активный класс в выпадающем меню
            document.querySelectorAll('.language-option').forEach(opt => {
                if (opt.dataset.lang === lang) {
                    opt.classList.add('active');
                } else {
                    opt.classList.remove('active');
                }
            });

            // Меняем флаг
            currentFlag.src = flagPaths[lang] + '?t=' + new Date().getTime();

            // Сохраняем выбранный язык
            localStorage.setItem('selectedLanguage', lang);

        } catch (error) {
            console.error('Ошибка при применении языка:', error);
        }
    }

    // Загрузка сохраненного языка при инициализации
    function loadSavedLanguage() {
        const savedLang = localStorage.getItem('selectedLanguage');
        if (savedLang && (savedLang === 'ru' || savedLang === 'en')) {
            setTimeout(() => {
                applyLanguage(savedLang);
            }, 100);
        } else {
            applyLanguage('ru');
        }
    }

    // Открытие/закрытие выпадающего меню
    if (languageSwitcher) {
        languageSwitcher.addEventListener('click', function(e) {
            e.stopPropagation();
            e.preventDefault();
            languageDropdown.classList.toggle('active');
        });
    }

    // Прямая обработка кликов для опций языка
    setTimeout(function() {
        const options = document.querySelectorAll('.language-option');
        console.log('Найдено опций:', options.length);

        options.forEach((option) => {
            // Убираем все старые обработчики
            const newOption = option.cloneNode(true);
            option.parentNode.replaceChild(newOption, option);

            // Добавляем прямой обработчик
            newOption.onclick = function(e) {
                e.stopPropagation();
                e.preventDefault();

                const lang = this.dataset.lang;
                console.log('Клик! Язык:', lang);

                if (lang) {
                    applyLanguage(lang);
                    languageDropdown.classList.remove('active');
                }

                return false;
            };

            newOption.style.cursor = 'pointer';
        });
    }, 300);

    // Закрытие при клике вне
    document.addEventListener('click', function(e) {
        if (languageSwitcher && !languageSwitcher.contains(e.target)) {
            languageDropdown.classList.remove('active');
        }
    });

    // Загружаем сохраненный язык
    loadSavedLanguage();

    console.log('Переключатель языка инициализирован');
})();