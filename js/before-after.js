// ============================================================
// BEFORE-AFTER.JS - Slider interativo de comparação
// ============================================================

document.addEventListener('DOMContentLoaded', function() {
    const slider = document.getElementById('slider');
    if (!slider) return;

    const beforeWrapper = document.getElementById('beforeWrapper');
    const divider = document.getElementById('divider');
    const handle = slider.querySelector('.ba-handle');

    let isDragging = false;
    let currentPos = 50;

    function updatePosition(clientX) {
        const rect = slider.getBoundingClientRect();
        let x = (clientX - rect.left) / rect.width;
        x = Math.max(0, Math.min(1, x));
        currentPos = x * 100;
        beforeWrapper.style.width = currentPos + '%';
        divider.style.left = currentPos + '%';
        if (handle) {
            handle.setAttribute('aria-valuenow', Math.round(currentPos));
        }
    }

    // ----- MOUSE EVENTS -----
    const onMouseDown = function(e) {
        isDragging = true;
        slider.classList.add('dragging');
        document.body.style.cursor = 'ew-resize';
        document.body.style.userSelect = 'none';
        e.preventDefault();
    };

    const onMouseMove = function(e) {
        if (!isDragging) return;
        updatePosition(e.clientX);
    };

    const onMouseUp = function() {
        isDragging = false;
        slider.classList.remove('dragging');
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
    };

    // ----- TOUCH EVENTS (mobile) -----
    const onTouchStart = function(e) {
        isDragging = true;
        slider.classList.add('dragging');
        e.preventDefault();
    };

    const onTouchMove = function(e) {
        if (!isDragging) return;
        const touch = e.touches[0];
        updatePosition(touch.clientX);
    };

    const onTouchEnd = function() {
        isDragging = false;
        slider.classList.remove('dragging');
    };

    // ----- KEYBOARD SUPPORT (acessibilidade) -----
    const onKeyDown = function(e) {
        if (e.key === 'ArrowLeft') {
            e.preventDefault();
            currentPos = Math.max(0, currentPos - 5);
            beforeWrapper.style.width = currentPos + '%';
            divider.style.left = currentPos + '%';
            if (handle) handle.setAttribute('aria-valuenow', Math.round(currentPos));
        } else if (e.key === 'ArrowRight') {
            e.preventDefault();
            currentPos = Math.min(100, currentPos + 5);
            beforeWrapper.style.width = currentPos + '%';
            divider.style.left = currentPos + '%';
            if (handle) handle.setAttribute('aria-valuenow', Math.round(currentPos));
        } else if (e.key === 'Home') {
            e.preventDefault();
            currentPos = 0;
            beforeWrapper.style.width = '0%';
            divider.style.left = '0%';
            if (handle) handle.setAttribute('aria-valuenow', 0);
        } else if (e.key === 'End') {
            e.preventDefault();
            currentPos = 100;
            beforeWrapper.style.width = '100%';
            divider.style.left = '100%';
            if (handle) handle.setAttribute('aria-valuenow', 100);
        }
    };

    // ----- ADICIONAR EVENT LISTENERS -----
    if (divider) {
        divider.addEventListener('mousedown', onMouseDown);
        divider.addEventListener('touchstart', onTouchStart, { passive: true });
    }

    if (handle) {
        handle.addEventListener('keydown', onKeyDown);
    }

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
    document.addEventListener('touchmove', onTouchMove, { passive: true });
    document.addEventListener('touchend', onTouchEnd);
});