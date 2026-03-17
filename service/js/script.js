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
            'block-2-title': 'В стоимость проживания включено:',
            'marked-list-item-1': 'НДС (0%)',
            'marked-list-item-2': 'использование парковки',
            'marked-list-item-3': 'безлимитное использование Wi-Fi Интернета',
            'marked-list-item-4': 'посещение хамама, сауны, тренажерного зала.',
            'marked-list-item-5': 'бассейн для проживающих на 24 этаже и во всех номерах гостиницы «Корстон Роял»',
            'marked-list-item-6': 'глажение двух вещей в день - распространяется для проживающих на 24 этаже и во всех номерах гостиницы «Корстон Роял»',
            'marked-list-item-7': 'стоимость проживания всех категорий включает в себя завтрак на выбор в ресторане «Ле буфет» с 7.00 до 12.00 в формате шведский стол или завтрак в ресторане «Экстра Лаундж» *с 12.00 до 15.00 в формате а-ля-карт, или завтрак в ресторане «У СоСо»* с 11.00 до 12.00 в формате а-ля-карт (депозит 950 р. на каждого гостя и детей с 6 лет),',
            'underline-link': 'кроме проживания по тарифу без завтрака',
            'note-text': 'О возможности завтрака в формате а-ля-карт необходимо уточнять на ресепшен*.',
            'block-3-item-1': 'Приветственный коктейль (воспользуйтесь данным предложением до 7 утра следующего дня после заезда).',
            'block-3-item-1-link': 'Необходимо скачать приложение Korston app',
            'block-3-item-2': 'Счастливые часы для гостей, проживающих в номерах, расположенных на 24 этаже гостиницы «Корстон Тауэр», и на 11 этаже гостиницы «Корстон Роял», и для гостей с картой Platinum (возможность посещения уточнить на ресепшен).',
            'block-3-item-3': 'Шампанское на завтрак.',
            'block-3-item-3-link': 'Необходимо скачать приложение Korston app',
            'info-text-1': 'Фитнес-центр расположен на 12 этаже гостиницы «Корстон Роял». Время работы: 07:00 - 22:00',
            'info-text-2': 'Ресторан «Ле буфет» и ресторан «У СоСо» расположены на 1 этаже;',
            'info-text-3': 'Ресторан «Экстра Лаундж» расположен на 25 этаже в «Корстон Тауэр».',
            'info-text-4': 'Чтобы позвонить на ресепшен из номера, наберите цифру 1',
            'app-description': 'Чтобы сделать Ваше пребывание еще приятнее, скачайте наше приложение "KorstonApp" - в нем Вы найдете все необходимое для комфортного отдыха: актуальную информацию, услуги и специальные предложения.',
            'app-cta-bold': 'Скачивайте приложение прямо сейчас и наслаждайтесь всеми преимуществами!',
            'app-button': 'Korston App',
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
            'block-2-title': 'Included in the accommodation cost:',
            'marked-list-item-1': 'VAT (0%)',
            'marked-list-item-2': 'parking usage',
            'marked-list-item-3': 'unlimited Wi-Fi Internet',
            'marked-list-item-4': 'access to hammam, sauna, gym.',
            'marked-list-item-5': 'pool for guests on the 24th floor and in all rooms of the Korston Royal Hotel',
            'marked-list-item-6': 'ironing of two items per day - applies to guests on the 24th floor and in all rooms of the Korston Royal Hotel',
            'marked-list-item-7': 'the cost of accommodation for all categories includes breakfast of your choice at the restaurant «Le Buffet» from 7.00 to 12.00 in buffet format or breakfast at the restaurant «Extra Lounge» *from 12.00 to 15.00 in à la carte format, or breakfast at the restaurant «U SoSo»* from 11.00 to 12.00 in à la carte format (deposit 950 rubles per guest and children from 6 years),',
            'underline-link': 'except for accommodation without breakfast',
            'note-text': 'The possibility of breakfast in à la carte format should be checked at the reception*.',
            'block-3-item-1': 'Welcome drink (use this offer until 7 am the next day after check-in).',
            'block-3-item-1-link': 'You need to download the Korston app',
            'block-3-item-2': 'Happy Hour for guests staying in rooms on the 24th floor of the Korston Tower Hotel and on the 11th floor of the Korston Royal Hotel, and for guests with a Platinum card (check the possibility of visiting at the reception).',
            'block-3-item-3': 'Champagne for breakfast.',
            'block-3-item-3-link': 'You need to download the Korston app',
            'info-text-1': 'The fitness center is located on the 12th floor of the Korston Royal Hotel. Opening hours: 07:00 - 22:00',
            'info-text-2': 'Restaurant «Le Buffet» and restaurant «U SoSo» are located on the 1st floor;',
            'info-text-3': 'Restaurant «Extra Lounge» is located on the 25th floor of the Korston Tower.',
            'info-text-4': 'To call the reception from your room, dial 1',
            'app-description': 'To make your stay even more pleasant, download our KorstonApp - you will find everything you need for a comfortable stay: up-to-date information, services and special offers.',
            'app-cta-bold': 'Download the app now and enjoy all the benefits!',
            'app-button': 'Korston App',
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
            
            // Заголовок блока 2
            const blockTitle = document.querySelector('.block-title');
            if (blockTitle) blockTitle.textContent = translations[lang]['block-2-title'];
            
            // Маркированный список (7 элементов) - с сохранением HTML ссылок
            const markedListItems = document.querySelectorAll('.marked-list li');
            if (markedListItems.length >= 7) {
                // Простые пункты (1-6) меняем текст
                for (let i = 0; i < 6; i++) {
                    if (markedListItems[i]) {
                        markedListItems[i].innerHTML = translations[lang][`marked-list-item-${i+1}`];
                    }
                }
                
                // Седьмой пункт со ссылками на рестораны
                const seventhItem = markedListItems[6];
                if (seventhItem) {
                    // Сохраняем структуру ссылок, меняем только текст
                    const links = seventhItem.querySelectorAll('.restaurant-link');
                    if (links.length === 3) {
                        // Базовая структура седьмого пункта с ссылками
                        seventhItem.innerHTML = `стоимость проживания всех категорий включает в себя завтрак на выбор в ресторане <a href="https://korston.ru/kazan/restaurants/shvedskiy-stol-le-buffet/" class="restaurant-link" target="_blank">«Ле буфет»</a> с 7.00 до 12.00 в формате шведский стол или завтрак в ресторане <a href="https://korston.ru/kazan/restaurants/extra-lounge/" class="restaurant-link" target="_blank">«Экстра Лаундж»</a> *с 12.00 до 15.00 в формате а-ля-карт, или завтрак в ресторане <a href="https://korston.ru/kazan/restaurants/u-soso/" class="restaurant-link" target="_blank">«У СоСо»</a>* с 11.00 до 12.00 в формате а-ля-карт (депозит 950 р. на каждого гостя и детей с 6 лет), кроме проживания по тарифу без завтрака.`;
                        
                        // Меняем текст ссылок на английские названия, если нужно
                        if (lang === 'en') {
                            const restaurantLinks = seventhItem.querySelectorAll('.restaurant-link');
                            if (restaurantLinks.length >= 3) {
                                restaurantLinks[0].textContent = '«Le Buffet»';
                                restaurantLinks[1].textContent = '«Extra Lounge»';
                                restaurantLinks[2].textContent = '«U SoSo»';
                            }
                            // Меняем остальной текст
                            const textNodes = [];
                            const walk = document.createTreeWalker(seventhItem, NodeFilter.SHOW_TEXT, null, false);
                            let node;
                            while (node = walk.nextNode()) {
                                if (node.parentElement && !node.parentElement.classList.contains('restaurant-link')) {
                                    textNodes.push(node);
                                }
                            }
                            if (textNodes.length > 0) {
                                // Первый текстовый узел (до первой ссылки)
                                if (textNodes[0]) textNodes[0].textContent = 'the cost of accommodation for all categories includes breakfast of your choice at the restaurant ';
                                // Второй текстовый узел (между первой и второй ссылкой)
                                if (textNodes[1]) textNodes[1].textContent = ' from 7.00 to 12.00 in buffet format or breakfast at the restaurant ';
                                // Третий текстовый узел (между второй и третьей ссылкой)
                                if (textNodes[2]) textNodes[2].textContent = ' *from 12.00 to 15.00 in à la carte format, or breakfast at the restaurant ';
                                // Четвертый текстовый узел (после третьей ссылки)
                                if (textNodes[3]) textNodes[3].textContent = '* from 11.00 to 12.00 in à la carte format (deposit 950 rubles per guest and children from 6 years), except for accommodation without breakfast.';
                            }
                        }
                    }
                }
            }
            
            // Текст-примечание
            const noteText = document.querySelector('.note-text');
            if (noteText) noteText.textContent = translations[lang]['note-text'];
            
            // Блок 3 - элементы списка с сохранением ссылок
            const block3Items = document.querySelectorAll('.block-3 .marked-list li');
            if (block3Items.length >= 3) {
                // Первый пункт с ссылкой на приложение
                const firstItem = block3Items[0];
                if (firstItem) {
                    const appLink = firstItem.querySelector('.app-link');
                    if (appLink) {
                        firstItem.innerHTML = `${translations[lang]['block-3-item-1']} (<a href="https://korston.ru/app/" class="app-link" target="_blank">${translations[lang]['block-3-item-1-link']}</a>).`;
                    }
                }
                
                // Второй пункт (без ссылок)
                if (block3Items[1]) {
                    block3Items[1].innerHTML = translations[lang]['block-3-item-2'];
                }
                
                // Третий пункт с ссылкой
                if (block3Items[2]) {
                    const underlineLink = block3Items[2].querySelector('.underline-link');
                    if (underlineLink) {
                        block3Items[2].innerHTML = `${translations[lang]['block-3-item-3']} <a href="https://korston.ru/app/" class="underline-link" target="_blank"> ${translations[lang]['block-3-item-3-link']}.</a>`;
                    }
                }
            }
            
            // Блок 4 - информационные тексты с сохранением ссылок
            const infoTexts = document.querySelectorAll('.info-text');
            if (infoTexts.length >= 4) {
                // Первый (без ссылок)
                infoTexts[0].innerHTML = translations[lang]['info-text-1'];
                
                // Второй со ссылками на рестораны
                const secondText = infoTexts[1];
                if (secondText) {
                    const links = secondText.querySelectorAll('.restaurant-link');
                    if (links.length === 2) {
                        secondText.innerHTML = `Ресторан <a href="https://korston.ru/kazan/restaurants/shvedskiy-stol-le-buffet/" class="restaurant-link" target="_blank">«Ле буфет»</a> и ресторан <a href="https://korston.ru/kazan/restaurants/u-soso/" class="restaurant-link" target="_blank">«У СоСо»</a> расположены на 1 этаже;`;
                        if (lang === 'en') {
                            const restaurantLinks = secondText.querySelectorAll('.restaurant-link');
                            if (restaurantLinks.length >= 2) {
                                restaurantLinks[0].textContent = '«Le Buffet»';
                                restaurantLinks[1].textContent = '«U SoSo»';
                            }
                            const textNodes = [];
                            const walk = document.createTreeWalker(secondText, NodeFilter.SHOW_TEXT, null, false);
                            let node;
                            while (node = walk.nextNode()) {
                                if (node.parentElement && !node.parentElement.classList.contains('restaurant-link')) {
                                    textNodes.push(node);
                                }
                            }
                            if (textNodes.length > 0) {
                                if (textNodes[0]) textNodes[0].textContent = 'Restaurant ';
                                if (textNodes[1]) textNodes[1].textContent = ' and restaurant ';
                                if (textNodes[2]) textNodes[2].textContent = ' are located on the 1st floor;';
                            }
                        }
                    }
                }
                
                // Третий с ссылкой
                const thirdText = infoTexts[2];
                if (thirdText) {
                    const link = thirdText.querySelector('.restaurant-link');
                    if (link) {
                        thirdText.innerHTML = `Ресторан <a href="https://korston.ru/kazan/restaurants/extra-lounge/" class="restaurant-link" target="_blank">«Экстра Лаундж»</a> расположен на 25 этаже в «Корстон Тауэр».`;
                        if (lang === 'en') {
                            const restaurantLink = thirdText.querySelector('.restaurant-link');
                            if (restaurantLink) restaurantLink.textContent = '«Extra Lounge»';
                            const textNodes = [];
                            const walk = document.createTreeWalker(thirdText, NodeFilter.SHOW_TEXT, null, false);
                            let node;
                            while (node = walk.nextNode()) {
                                if (node.parentElement && !node.parentElement.classList.contains('restaurant-link')) {
                                    textNodes.push(node);
                                }
                            }
                            if (textNodes.length > 0) {
                                if (textNodes[0]) textNodes[0].textContent = 'Restaurant ';
                                if (textNodes[1]) textNodes[1].textContent = ' is located on the 25th floor of the Korston Tower.';
                            }
                        }
                    }
                }
                
                // Четвертый (без ссылок)
                infoTexts[3].innerHTML = translations[lang]['info-text-4'];
            }
            
            // Блок 5 - приложение
            const appDescription = document.querySelector('.app-description');
            if (appDescription) appDescription.textContent = translations[lang]['app-description'];
            
            const appCtaBold = document.querySelector('.app-cta-bold');
            if (appCtaBold) appCtaBold.textContent = translations[lang]['app-cta-bold'];
            
            const appButton = document.querySelector('.block-5 .app-button');
            if (appButton) appButton.textContent = translations[lang]['app-button'];
            
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
})();