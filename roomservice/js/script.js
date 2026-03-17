(function() {
    // Запрет перетаскивания изображений
    document.querySelectorAll('img').forEach(img => {
        img.addEventListener('dragstart', (e) => e.preventDefault());
    });

    // Защита от выделения текста в шапке
    const headerElements = document.querySelectorAll('.glass-header, .location-text');
    headerElements.forEach(el => {
        el.style.userSelect = 'none';
        el.style.webkitUserSelect = 'none';
        el.style.msUserSelect = 'none';
    });

    // Защита от перетаскивания для иконок в шапке
    const headerImages = document.querySelectorAll('.glass-header img');
    headerImages.forEach(img => {
        img.addEventListener('dragstart', (e) => e.preventDefault());
        img.setAttribute('draggable', 'false');
    });

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

    let resizeTimeout;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(function() {
            initFooterAccordion();
        }, 150);
    });

    // ===== Функционал переключателя языка =====
    const languageSwitcher = document.getElementById('languageSwitcher');
    const languageDropdown = document.getElementById('languageDropdown');
    const currentFlag = document.getElementById('currentFlag');
    const languageOptions = document.querySelectorAll('.language-option');
    
    // Словарь перевода
    const translations = {
        ru: {
            'location-text': 'Казань',
            'nav-back-text': 'Назад',
            'room-service-title': 'Рум сервис',
            'room-service-description': 'Обслуживание в номерах работает для Вас круглосуточно.',
            'room-service-text-1': 'Чтобы сделать заказ, наберите «0» со стационарного телефона.',
            'room-service-text-2': 'Также у нас есть приложение KORSTON APP, через которое можно заказать доставку с Фуд Молл в номер.',
            'app-button-1': 'Заказать в приложение Korston App',
            'app-button-2': 'Заказать в чат боте',
            'image-text': 'Меню',
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
            'nav-back-text': 'Back',
            'room-service-title': 'Room Service',
            'room-service-description': 'Room service is available 24/7 for your convenience.',
            'room-service-text-1': 'To place an order, dial "0" from your room phone.',
            'room-service-text-2': 'We also have the KORSTON APP, through which you can order delivery from Food Mall to your room.',
            'app-button-1': 'Order in Korston App',
            'app-button-2': 'Order in chat bot',
            'image-text': 'Menu',
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

    // Пути к флагам - ИСПРАВЛЕНО на flag_eng.svg
    const flagPaths = {
        ru: 'img/flag.svg',
        en: 'img/flag_eng.svg'
    };

    // Функция для проверки существования изображения
    function checkImageExists(src, callback) {
        const img = new Image();
        img.onload = () => callback(true);
        img.onerror = () => callback(false);
        img.src = src;
    }

    // Функция применения перевода
    function applyLanguage(lang) {
        try {
            // Город
            const locationText = document.querySelector('.location-text');
            if (locationText) locationText.textContent = translations[lang]['location-text'];
            
            // Навигация назад
            const navBackText = document.querySelector('.nav-back-text');
            if (navBackText) navBackText.textContent = translations[lang]['nav-back-text'];
            
            // Заголовок и описание
            const title = document.querySelector('.room-service-title');
            if (title) title.textContent = translations[lang]['room-service-title'];
            
            const description = document.querySelector('.room-service-description');
            if (description) description.textContent = translations[lang]['room-service-description'];
            
            // Текстовые блоки
            const roomServiceTexts = document.querySelectorAll('.room-service-text');
            if (roomServiceTexts.length >= 2) {
                roomServiceTexts[0].textContent = translations[lang]['room-service-text-1'];
                roomServiceTexts[1].textContent = translations[lang]['room-service-text-2'];
            }
            
            // Кнопки
            const appButtons = document.querySelectorAll('.app-button');
            if (appButtons.length >= 2) {
                // Первая кнопка (с переносом)
                if (lang === 'ru') {
                    appButtons[0].innerHTML = 'Заказать в приложение <span class="mobile-break">Korston App</span>';
                } else {
                    appButtons[0].textContent = translations[lang]['app-button-1'];
                }
                appButtons[1].textContent = translations[lang]['app-button-2'];
            }
            
            // Текст на картинке
            const imageText = document.querySelector('.image-text');
            if (imageText) imageText.textContent = translations[lang]['image-text'];
            
            // Футер
            const footerTitles = document.querySelectorAll('.footer__title');
            if (footerTitles.length >= 2) {
                footerTitles[0].textContent = translations[lang]['footer-title-1'];
                footerTitles[1].textContent = translations[lang]['footer-title-2'];
            }
            
            const footerLinks = document.querySelectorAll('.footer__link');
            if (footerLinks.length >= 6) {
                footerLinks[0].textContent = translations[lang]['footer-link-1'];
                footerLinks[1].textContent = translations[lang]['footer-link-2'];
                footerLinks[2].textContent = translations[lang]['footer-link-3'];
                footerLinks[3].textContent = translations[lang]['footer-link-4'];
                footerLinks[4].textContent = translations[lang]['footer-link-5'];
                footerLinks[5].textContent = translations[lang]['footer-link-6'];
            }
            
            const copyrightText = document.querySelector('.footer__copyright-text');
            if (copyrightText) copyrightText.textContent = translations[lang]['footer-copyright'];
            
            // Обновляем активный класс в выпадающем меню
            languageOptions.forEach(opt => {
                if (opt.dataset.lang === lang) {
                    opt.classList.add('active');
                } else {
                    opt.classList.remove('active');
                }
            });
            
            // Проверяем существование файла флага перед заменой
            checkImageExists(flagPaths[lang], (exists) => {
                if (exists && currentFlag) {
                    // Добавляем параметр timestamp, чтобы избежать кэширования
                    currentFlag.src = flagPaths[lang] + '?t=' + new Date().getTime();
                    console.log(`Флаг ${lang} загружен:`, flagPaths[lang]);
                } else {
                    console.error(`Флаг ${lang} не найден по пути:`, flagPaths[lang]);
                    // Если флаг не найден, пробуем альтернативный путь
                    if (lang === 'en') {
                        const altPath = 'img/flag-uk.svg';
                        checkImageExists(altPath, (altExists) => {
                            if (altExists && currentFlag) {
                                currentFlag.src = altPath + '?t=' + new Date().getTime();
                                console.log(`Флаг ${lang} загружен по альтернативному пути:`, altPath);
                            }
                        });
                    }
                }
            });
            
            // Сохраняем выбранный язык в localStorage
            localStorage.setItem('selectedLanguage', lang);
            
        } catch (error) {
            console.error('Ошибка при применении языка:', error);
        }
    }

    // Загрузка сохраненного языка при инициализации
    function loadSavedLanguage() {
        const savedLang = localStorage.getItem('selectedLanguage');
        if (savedLang && (savedLang === 'ru' || savedLang === 'en')) {
            // Небольшая задержка для полной загрузки DOM
            setTimeout(() => {
                applyLanguage(savedLang);
            }, 100);
        }
    }

    // Открытие/закрытие выпадающего меню
    if (languageSwitcher) {
        languageSwitcher.addEventListener('click', function(e) {
            e.stopPropagation();
            languageDropdown.classList.toggle('active');
        });
    }

    // Обработка выбора языка
    languageOptions.forEach(option => {
        option.addEventListener('click', function(e) {
            e.stopPropagation();
            const selectedLang = this.dataset.lang;
            applyLanguage(selectedLang);
            languageDropdown.classList.remove('active');
        });
    });

    // Закрытие меню при клике вне его
    document.addEventListener('click', function(e) {
        if (languageSwitcher && !languageSwitcher.contains(e.target)) {
            languageDropdown.classList.remove('active');
        }
    });

    // Загружаем сохраненный язык при загрузке страницы
    document.addEventListener('DOMContentLoaded', function() {
        loadSavedLanguage();
    });

    // Обработчик клика на картинку
    const imageLink = document.querySelector('.image-link');
    if (imageLink) {
        imageLink.addEventListener('click', function(e) {
            console.log('Переход на страницу меню');
        });
    }

    // Обработчики для кнопок
    const appButtons = document.querySelectorAll('.app-button');
    appButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            console.log('Переход по ссылке:', this.href);
        });
    });
})();