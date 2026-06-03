document.addEventListener('DOMContentLoaded', () => {

    // ==========================================================================
    // 1. Мобильное меню
    // ==========================================================================
    const header = document.querySelector('.header');
    const burgerBtn = document.querySelector('.header__burger');
    const navLinks = document.querySelectorAll('.header__link');

    if (burgerBtn && header) {
        burgerBtn.addEventListener('click', () => {
            header.classList.toggle('header--open');
            document.body.style.overflow = header.classList.contains('header--open') ? 'hidden' : '';
        });

        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                header.classList.remove('header--open');
                document.body.style.overflow = '';
            });
        });
    }

    // ==========================================================================
    // 2. Оверлей
    // ==========================================================================
    const overlay = document.getElementById('feedbackOverlay');
    const closeBtn = document.querySelector('.overlay__close');
    const feedbackBtns = document.querySelectorAll('.header__btn-desktop, .header__btn-mobile');

    const toggleOverlay = () => {
        if (overlay) overlay.classList.toggle('is-open');
    };

    feedbackBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            toggleOverlay();
        });
    });

    if (closeBtn) closeBtn.addEventListener('click', toggleOverlay);

    if (overlay) {
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) toggleOverlay();
        });
    }

    // ==========================================================================
    // 3. Конфигуратор цветов
    // ==========================================================================
    const colorsConfigurator = document.getElementById('colorsConfigurator');
    const swatches = colorsConfigurator ? colorsConfigurator.querySelectorAll('.colors__swatch') : [];
    const carImageFront = document.getElementById('carImageFront');
    const carImageBack = document.getElementById('carImageBack');
    const colorNameTitle = document.getElementById('colorName');

    if (swatches.length && carImageFront && carImageBack) {
        let visibleLayer = carImageFront;
        let hiddenLayer = carImageBack;

        const revealHiddenLayer = () => {
            hiddenLayer.classList.add('is-visible');
            visibleLayer.classList.remove('is-visible');
            const previousVisible = visibleLayer;
            visibleLayer = hiddenLayer;
            hiddenLayer = previousVisible;
        };

        const switchCarColor = (swatch) => {
            const imageSrc = swatch.dataset.image;
            const colorName = swatch.dataset.name;
            if (!imageSrc) return;

            // Загружаем новое изображение в скрытый слой
            hiddenLayer.src = imageSrc;
            hiddenLayer.dataset.src = imageSrc;

            // Ждём загрузку изображения
            hiddenLayer.onload = () => {
                revealHiddenLayer();
            };

            // Обновляем название цвета
            if (colorNameTitle && colorName) {
                colorNameTitle.textContent = colorName;
            }

            // Обновляем активное состояние кнопок
            swatches.forEach(s => {
                s.classList.remove('active');
                s.setAttribute('aria-selected', 'false');
            });
            swatch.classList.add('active');
            swatch.setAttribute('aria-selected', 'true');
        };

        // Добавляем обработчики кликов для каждой кнопки цвета
        swatches.forEach(swatch => {
            swatch.addEventListener('click', () => {
                switchCarColor(swatch);
            });
        });
    }

    // ==========================================================================
    // 4. Обзор 360
    // ==========================================================================
    const viewer = document.querySelector('.view360');
    const viewerImage = document.getElementById('viewerImage');
    const totalFrames = 71;
    let currentFrame = 1;

    function updateImage(frame) {
        if (frame < 1) frame = totalFrames;
        if (frame > totalFrames) frame = 1;
        currentFrame = frame;
        if (viewerImage) {
            viewerImage.src = `./images/${currentFrame}.webp`;
        }
    }

    if (viewer) {
        let isDragging = false;
        let startX;

        const startDrag = (clientX) => {
            isDragging = true;
            startX = clientX;
        };

        const stopDrag = () => {
            isDragging = false;
        };

        const handleMove = (clientX) => {
            if (!isDragging) return;
            const delta = clientX - startX;
            if (Math.abs(delta) > 10) {
                updateImage(currentFrame + (delta > 0 ? 1 : -1));
                startX = clientX;
            }
        };

        viewer.addEventListener('mousedown', (e) => {
            e.preventDefault();
            startDrag(e.clientX);
        });

        viewer.addEventListener('touchstart', (e) => {
            e.preventDefault();
            startDrag(e.touches[0].clientX);
        }, { passive: false });

        window.addEventListener('mouseup', stopDrag);
        window.addEventListener('touchend', stopDrag);
        window.addEventListener('touchcancel', stopDrag);

        window.addEventListener('mousemove', (e) => {
            handleMove(e.clientX);
        });

        window.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            e.preventDefault();
            handleMove(e.touches[0].clientX);
        }, { passive: false });

        viewer.addEventListener('dragstart', (e) => e.preventDefault());

        // Предзагрузка
        for (let i = 1; i <= totalFrames; i++) {
            const img = new Image();
            img.src = `./images/${i}.webp`;
        }
    }
});