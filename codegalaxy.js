// --- Данные о планетах (Исправлен синтаксис и переведено на русский) ---
const allPlanetInfo = {
    planet1: {
        name: 'JavaScript',
        shortDesc: 'The web language used for interactive websites.',
        fullInfo: 'JavaScript is a versatile scripting language for web development that makes websites interactive.'
    },
    planet2: {
        name: 'Python',
        shortDesc: 'Popular for AI, Data Science, and scripting.',
        fullInfo: 'Python is a popular language for AI, data science, and general-purpose programming.'
    },
    planet3: {
        name: 'HTML',
        shortDesc: 'The foundation of web pages.',
        fullInfo: 'HTML structures websites and is the backbone of any web page.'
    },
    planet4: {
        name: 'C++',
        shortDesc: 'Powerful language for systems and game programming.',
        fullInfo: 'C++ is a powerful language for building systems software, games, and high-performance applications.'
    },
    planet5: {
        name: 'Java',
        shortDesc: 'Widely used in enterprise apps and Android.',
        fullInfo: 'Java is a reliable language for enterprise systems, backend services, and Android development.'
    },
    planet6: {
        name: 'CSS',
        shortDesc: 'Styles and layouts for web pages.',
        fullInfo: 'CSS controls the look of web pages, managing layout, colors, and fonts.'
    },
    planet7: {
        name: 'Go',
        shortDesc: 'Efficient language for cloud and backend.',
        fullInfo: 'Go (Golang) is a statically typed language built for scalable cloud systems.'
    },
    planet8: {
        name: 'Rust',
        shortDesc: 'Safe and fast, great for systems.',
        fullInfo: 'Rust is known for memory safety and performance, ideal for systems programming.'
    }
};

// --- Функции логики ---

/**
 * Получает данные планеты по её классу (например, 'planet1').
 */
function getPlanetData(planetElement) {
    // Ищем класс, который начинается с 'planet' и длиннее 6 символов (чтобы исключить просто класс .planet)
    const planetClass = Array.from(planetElement.classList).find(cls => cls.startsWith('planet') && cls.length > 6);
    return allPlanetInfo[planetClass] || null;
}

/**
 * Открывает модальное окно.
 */
function openModal(data) {
    const titleEl = document.getElementById('modal-title');
    const descEl = document.getElementById('modal-desc');
    const modal = document.getElementById('planet-modal');

    if (titleEl) titleEl.textContent = data.name;
    if (descEl) descEl.textContent = data.shortDesc; // Используем shortDesc для модального окна или fullInfo по желанию
    
    if (modal) {
        modal.style.display = 'flex';
        modal.setAttribute('aria-hidden', 'false');
    }
}

/**
 * Закрывает модальное окно.
 */
function closeModal() {
    const modal = document.getElementById('planet-modal');
    if (modal) {
        modal.style.display = 'none';
        modal.setAttribute('aria-hidden', 'true');
    }
    removePopup(); // При закрытии модального окна убираем и тултип
}

/**
 * Удаляет всплывающую подсказку, если она есть.
 */
function removePopup() {
    const oldPopup = document.getElementById('planet-popup');
    if (oldPopup) oldPopup.remove();
}

/**
 * Показывает всплывающий тултип рядом с курсором.
 */
function showPlanetPopup(data, event) {
    removePopup();

    const popup = document.createElement('div');
    popup.id = 'planet-popup';
    
    // Стили
    Object.assign(popup.style, {
        position: 'fixed',
        left: (event.clientX + 15) + 'px',
        top: (event.clientY + 15) + 'px',
        background: 'rgba(34, 44, 44, 0.95)',
        color: '#fff',
        padding: '15px 20px',
        borderRadius: '12px',
        zIndex: 9999,
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.6)',
        maxWidth: '280px',
        fontSize: '0.95rem',
        lineHeight: '1.4',
        cursor: 'default',
        pointerEvents: 'auto' // Чтобы можно было нажать кнопку закрытия внутри
    });

    // Контент тултипа
    popup.innerHTML = `
        <strong style="font-size:1.1em; display:block; margin-bottom:5px; color:#4fc3f7;">${data.name}</strong>
        ${data.fullInfo}
        <div style="margin-top:10px; text-align:right;">
            <span style="font-size:0.85em; color:#ffeb3b; cursor:pointer; text-decoration:underline;" onclick="document.getElementById('planet-popup').remove()">Закрыть</span>
        </div>
    `;

    document.body.appendChild(popup);
}

// --- Инициализация и обработка событий ---

// Обработчики для планет
const planets = document.querySelectorAll('.planet');
planets.forEach(planet => {
    // Клик мышкой
    planet.addEventListener('click', (event) => {
        const data = getPlanetData(planet);
        if (!data) return;
        
        // Логика: можно открывать либо модалку, либо попап. 
        // В оригинальном коде открывалось и то, и то. Оставляю как было:
        openModal(data);
        showPlanetPopup(data, event);
    });

    // Клавиатура (Enter или Пробел)
    planet.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            planet.click();
        }
    });

    // Ховер эффекты (добавляем класс для CSS анимаций)
    planet.addEventListener('mouseenter', () => planet.classList.add('planet-hover'));
    planet.addEventListener('mouseleave', () => planet.classList.remove('planet-hover'));
});

// Закрытие модального окна по Esc
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
});

// Закрытие тултипа при клике в пустое место
document.body.addEventListener('click', function(e) {
    // Если клик не по планете и не по самому попапу
    if (!e.target.closest('.planet') && !e.target.closest('#planet-popup')) {
        removePopup();
    }
}, true);

// --- Логика переходов между экранами (Intro -> Solar System) ---
window.addEventListener('DOMContentLoaded', () => {
    const main = document.querySelector('.main');
    const pagetwo = document.querySelector('.pagetwo');

    // Если элементов нет, не запускаем анимацию, чтобы не было ошибок
    if (!main || !pagetwo) return;

    // Начальное состояние второй страницы
    pagetwo.style.display = 'block';
    pagetwo.style.opacity = '0'; // Скрыто, но в потоке

    setTimeout(() => {
        // Шаг 1: Исчезновение main
        main.style.transition = 'opacity 1s ease-in-out';
        main.style.opacity = '0';

        setTimeout(() => {
            // Шаг 2: Убираем main и показываем pagetwo
            main.style.display = 'none';
            
            pagetwo.style.transition = 'opacity 1s ease-in-out';
            pagetwo.style.opacity = '1';
        }, 1000);
    }, 2000);
});

// --- Навигация с клавиатуры и вращение системы ---
let currentPlanetIndex = 0;
const planetEls = Array.from(document.querySelectorAll('.planet'));
const solarSystem = document.querySelector('.solar-system');
let rotation = 0;

function highlightPlanet(index) {
    if (!planetEls[index]) return;

    planetEls.forEach((el, i) => {
        // Убираем подсветку у остальных
        if (i !== index) {
            el.style.boxShadow = '';
            el.blur();
        }
    });

    // Подсвечиваем текущую
    const activeEl = planetEls[index];
    activeEl.style.boxShadow = '0 0 40px 10px rgba(255, 255, 255, 0.6)';
    activeEl.focus();
}

// Фокус на первой планете при загрузке
if (planetEls.length > 0) {
    // Небольшая задержка, чтобы элементы успели отрисоваться после transition
    setTimeout(() => {
        highlightPlanet(0);
    }, 3100);
}

document.addEventListener('keydown', e => {
    const modal = document.getElementById('planet-modal');
    // Блокируем управление системой, если открыта модалка
    const isModalOpen = modal && modal.style.display === 'flex';

    if (solarSystem && !isModalOpen) {
        // Вращение (A / D)
        if (e.key === 'a' || e.key === 'A' || e.key === 'ф' || e.key === 'Ф') {
            rotation -= 15;
            solarSystem.style.transform = `rotate(${rotation}deg)`;
            solarSystem.style.transition = 'transform 0.5s';
        }
        if (e.key === 'd' || e.key === 'D' || e.key === 'в' || e.key === 'В') {
            rotation += 15;
            solarSystem.style.transform = `rotate(${rotation}deg)`;
            solarSystem.style.transition = 'transform 0.5s';
        }
    }

    // Навигация стрелками
    if (!isModalOpen && planetEls.length > 0) {
        if (e.key === 'ArrowRight') {
            currentPlanetIndex = (currentPlanetIndex + 1) % planetEls.length;
            highlightPlanet(currentPlanetIndex);
            e.preventDefault();
        }
        if (e.key === 'ArrowLeft') {
            currentPlanetIndex = (currentPlanetIndex - 1 + planetEls.length) % planetEls.length;
            highlightPlanet(currentPlanetIndex);
            e.preventDefault();
        }
    }
});

// Плавный скролл для якорных ссылок
document.querySelectorAll('.buttons a[href^="#"]').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        const href = this.getAttribute('href');
        if (href.length > 1) {
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        }
    });
});