document.addEventListener('DOMContentLoaded', function() {
    // ==================== ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ ====================
    const floatingNav = document.querySelector('.floating-nav');
    const navLinks = document.querySelectorAll('.floating-link');
    const sections = document.querySelectorAll('section[id], header[id]');
    
    // ==================== ПЛАВАЮЩАЯ НАВИГАЦИЯ ====================
    function initNavigation() {
        function updateActiveNav() {
            let current = '';
            const scrollPosition = window.scrollY + 150;
            
            // Находим текущую секцию
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;
                const sectionId = section.getAttribute('id');
                
                if (!sectionId) return;
                
                if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                    current = sectionId;
                }
            });
            
            // Если не нашли, проверяем ближайшую
            if (!current && sections.length > 0) {
                let closestSection = null;
                let closestDistance = Infinity;
                
                sections.forEach(section => {
                    const sectionId = section.getAttribute('id');
                    if (!sectionId) return;
                    
                    const distance = Math.abs(section.offsetTop - scrollPosition);
                    if (distance < closestDistance) {
                        closestDistance = distance;
                        closestSection = sectionId;
                    }
                });
                
                current = closestSection;
            }
            
            // Обновляем активную ссылку
            navLinks.forEach(link => {
                link.classList.remove('active');
                const href = link.getAttribute('href');
                if (href === `#${current}`) {
                    link.classList.add('active');
                }
            });
            
            // Эффект при скролле
            if (window.scrollY > 50) {
                floatingNav.classList.add('scrolled');
            } else {
                floatingNav.classList.remove('scrolled');
            }
        }
        
        // Плавная прокрутка
        navLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                
                if (href === '#' || !href.startsWith('#')) return;
                
                const targetElement = document.querySelector(href);
                if (targetElement) {
                    e.preventDefault();
                    
                    // Временно обновляем активную ссылку
                    navLinks.forEach(l => l.classList.remove('active'));
                    this.classList.add('active');
                    
                    // Прокрутка с учетом фиксированной навигации
                    const navHeight = floatingNav.offsetHeight;
                    const targetPosition = targetElement.offsetTop - navHeight - 20;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
        
        // Слушатель скролла
        window.addEventListener('scroll', updateActiveNav);
        window.addEventListener('resize', updateActiveNav);
        
        // Инициализация
        updateActiveNav();
    }
    
    // ==================== АНИМАЦИИ ПРИ СКРОЛЛЕ ====================
    function initScrollAnimations() {
        // Создаем наблюдатель
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Анимация для элементов с классом .animate-on-scroll
                    const animatedElements = entry.target.querySelectorAll('.stat-card, .approach-item, .review-card, .contact-info-card, .contact-actions-card, .contact-details-card');
                    
                    animatedElements.forEach((el, index) => {
                        setTimeout(() => {
                            el.style.opacity = '1';
                            el.style.transform = 'translateY(0)';
                        }, index * 100);
                    });
                    
                    // Отключаем наблюдение после анимации
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);
        
        // Наблюдаем за секциями
        document.querySelectorAll('section').forEach(section => {
            observer.observe(section);
        });
        
        // Инициализируем начальные стили
        const elementsToAnimate = document.querySelectorAll('.stat-card, .approach-item, .review-card, .contact-info-card, .contact-actions-card, .contact-details-card');
        elementsToAnimate.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        });
    }
    
    // ==================== ПАРАЛЛАКС ЭФФЕКТ ДЛЯ ОТЗЫВОВ ====================
    function initParallaxReviews() {
        const reviewCards = document.querySelectorAll('.review-card');
        
        window.addEventListener('mousemove', (e) => {
            const mouseX = e.clientX / window.innerWidth;
            const mouseY = e.clientY / window.innerHeight;
            
            reviewCards.forEach((card, index) => {
                const speed = 0.05;
                const x = (mouseX - 0.5) * 20;
                const y = (mouseY - 0.5) * 20;
                
                // Разный эффект для каждого отзыва
                const delay = index * 0.1;
                
                setTimeout(() => {
                    card.style.transform = `
                        translateY(-10px)
                        rotateX(${y}deg)
                        rotateY(${x}deg)
                    `;
                    
                    // Эффект свечения
                    card.style.boxShadow = `
                        ${x * 0.5}px ${y * 0.5}px 40px rgba(255, 107, 53, 0.3)
                    `;
                }, delay);
            });
        });
        
        // Сброс при уходе мыши
        window.addEventListener('mouseleave', () => {
            reviewCards.forEach(card => {
                card.style.transform = 'translateY(-10px)';
                card.style.boxShadow = '0 20px 40px rgba(255, 107, 53, 0.15)';
            });
        });
    }
    
    // ==================== ПУЛЬСАЦИЯ РЕЙТИНГА ====================
    function initRatingPulse() {
        const ratingStars = document.querySelector('.rating-stars');
        if (!ratingStars) return;
        
        function pulseRating() {
            ratingStars.style.transform = 'scale(1.1)';
            ratingStars.style.filter = 'brightness(1.2) drop-shadow(0 0 10px rgba(255, 215, 0, 0.5))';
            
            setTimeout(() => {
                ratingStars.style.transform = 'scale(1)';
                ratingStars.style.filter = 'none';
            }, 300);
        }
        
        // Пульсация при загрузке
        setTimeout(pulseRating, 1000);
        
        // Пульсация при скролле к секции отзывов
        const reviewsSection = document.getElementById('reviews');
        if (reviewsSection) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        setTimeout(pulseRating, 500);
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.3 });
            
            observer.observe(reviewsSection);
        }
    }
    
    // ==================== ИНИЦИАЛИЗАЦИЯ ВСЕГО ====================
    function initAll() {
        console.log('Инициализация сайта...');
        
        // Инициализация навигации
        initNavigation();
        
        // Инициализация анимаций
        setTimeout(() => {
            initScrollAnimations();
            initParallaxReviews();
            initRatingPulse();
        }, 100);
        
        console.log('Сайт успешно инициализирован');
    }
    
    // ==================== ЗАПУСК ====================
    // Ждем полной загрузки страницы
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initAll);
    } else {
        initAll();
    }
    
    // Обработка ошибок
    window.addEventListener('error', function(e) {
        console.error('Ошибка на странице:', e.error);
    });
});