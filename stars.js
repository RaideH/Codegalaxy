// Оптимизированная генерация звезд с адаптивным количеством
(function() {
    const starsContainer = document.getElementById('starsContainer');
    if (!starsContainer) return;
    
    // Адаптивное количество звезд в зависимости от размера экрана
    const isMobile = window.innerWidth < 768;
    const starCount = isMobile ? 100 : 200; // Меньше звезд на мобильных для производительности
    
    // Создаем DocumentFragment для батчевой вставки (быстрее)
    const fragment = document.createDocumentFragment();
    
    // Предварительно создаем массив параметров звезд
    const starParams = Array.from({ length: starCount }, () => ({
        size: Math.random() * 3 + 1,
        left: Math.random() * 100,
        top: Math.random() * 100,
        duration: Math.random() * 3 + 2,
        delay: Math.random() * 3
    }));
    
    // Создаем все звезды за один проход
    starParams.forEach(params => {
        const star = document.createElement('div');
        star.className = 'star';
        
        // Применяем все стили за один раз
        Object.assign(star.style, {
            width: params.size + 'px',
            height: params.size + 'px',
            left: params.left + '%',
            top: params.top + '%',
            '--duration': params.duration + 's',
            animationDelay: params.delay + 's'
        });
        
        fragment.appendChild(star);
    });
    
    // Одна вставка в DOM вместо множества
    starsContainer.appendChild(fragment);
    
    // Функция создания падающей звезды
    function createShootingStar() {
        // Проверяем, не слишком ли много анимаций уже идет
        const existingStars = starsContainer.querySelectorAll('.shooting-star').length;
        if (existingStars > 3) return; // Максимум 3 падающих звезды одновременно
        
        const shootingStar = document.createElement('div');
        shootingStar.className = 'shooting-star';
        
        // Случайная позиция старта
        const startX = Math.random() * 100;
        const startY = Math.random() * 30; // Верхняя треть экрана
        
        Object.assign(shootingStar.style, {
            position: 'absolute',
            left: startX + '%',
            top: startY + '%',
            width: '2px',
            height: '2px',
            background: 'white',
            borderRadius: '50%',
            boxShadow: '0 0 10px 2px rgba(255, 255, 255, 0.8)',
            animation: 'shooting 1.5s linear forwards'
        });
        
        starsContainer.appendChild(shootingStar);
        
        // Удаляем после анимации
        setTimeout(() => {
            shootingStar.remove();
        }, 1500);
    }
    
    // Добавляем CSS для падающих звезд если его нет
    if (!document.getElementById('shooting-star-style')) {
        const style = document.createElement('style');
        style.id = 'shooting-star-style';
        style.textContent = `
            @keyframes shooting {
                0% {
                    transform: translate(0, 0);
                    opacity: 1;
                }
                100% {
                    transform: translate(150px, 150px);
                    opacity: 0;
                }
            }
            
            .shooting-star {
                pointer-events: none;
                will-change: transform, opacity;
            }
        `;
        document.head.appendChild(style);
    }
    
    // Запускаем падающие звезды с интервалом
    // На мобильных реже для экономии ресурсов
    const shootingInterval = isMobile ? 5000 : 3000;
    setInterval(createShootingStar, shootingInterval);
    
    // Оптимизация: останавливаем анимации когда вкладка неактивна
    document.addEventListener('visibilitychange', function() {
        const stars = starsContainer.querySelectorAll('.star');
        stars.forEach(star => {
            if (document.hidden) {
                star.style.animationPlayState = 'paused';
            } else {
                star.style.animationPlayState = 'running';
            }
        });
    });
    
    // Очистка при выгрузке страницы
    window.addEventListener('beforeunload', () => {
        starsContainer.innerHTML = '';
    });
})();