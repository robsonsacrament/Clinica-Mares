// ============================================================
// MAIN.JS - Navegação, Scroll Reveal, Contadores
// ============================================================

document.addEventListener('DOMContentLoaded', function() {

    // ---------- MENU MOBILE ----------
    const menuToggle = document.getElementById('menuToggle');
    const menuMobile = document.getElementById('menuMobile');

    if (menuToggle && menuMobile) {
        menuToggle.addEventListener('click', function() {
            const isOpen = menuMobile.classList.toggle('open');
            menuToggle.classList.toggle('active');
            menuToggle.setAttribute('aria-expanded', isOpen);
            document.body.style.overflow = isOpen ? 'hidden' : '';
        });

        document.querySelectorAll('.menu-mobile-link').forEach(link => {
            link.addEventListener('click', function() {
                menuMobile.classList.remove('open');
                menuToggle.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }

    // ---------- HEADER SCROLL ----------
    const header = document.getElementById('header');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 20) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // ---------- SCROLL REVEAL ----------
    const revealElements = document.querySelectorAll('.scroll-reveal');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -30px 0px'
    });
    revealElements.forEach(element => {
        revealObserver.observe(element);
    });

    // ---------- CONTADORES ANIMADOS ----------
    const counters = document.querySelectorAll('.counter');
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = parseInt(entry.target.getAttribute('data-target'));
                animateCounter(entry.target, target);
                counterObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.5
    });
    counters.forEach(counter => {
        counterObserver.observe(counter);
    });

    function animateCounter(element, target, duration = 2000) {
        let start = 0;
        const increment = target / (duration / 16);
        const isYear = target === 2011;

        function update() {
            start += increment;
            if (start < target) {
                element.textContent = isYear ? Math.floor(start) : Math.floor(start) + '+';
                requestAnimationFrame(update);
            } else {
                element.textContent = isYear ? target : target + '+';
            }
        }
        update();
    }

    // ---------- SCROLL SUAVE ----------
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - headerHeight - 20;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

// ============================================================
// ⚠️ FECHE AQUI O PRIMEIRO addEventListener
// ============================================================
}); // <-- ISSO É CRÍTICO! FECHA O PRIMEIRO EVENTO



// ============================================================
// TYPEWRITER EFFECT (SEM CURSOR)
// ============================================================
document.addEventListener('DOMContentLoaded', function() {
    const titleElement = document.getElementById('typewriter-title');
    if (!titleElement) return;

    const fullText = 'Especialista em Implantes, Estética e Ortodontia em Palhoça';
    const italicStartIndex = 16;

    const textSpan = titleElement.querySelector('.typewriter-text');
    // const cursorSpan = titleElement.querySelector('.typewriter-cursor'); ← REMOVA ESTA LINHA

    let charIndex = 0;

    function typeWriter() {
        const currentText = fullText.substring(0, charIndex);
        let displayHtml = currentText;
        
        if (charIndex > italicStartIndex) {
            const beforeItalic = currentText.substring(0, italicStartIndex);
            const italicPart = currentText.substring(italicStartIndex);
            displayHtml = `${beforeItalic}<em>${italicPart}</em>`;
        }
        textSpan.innerHTML = displayHtml;

        if (charIndex < fullText.length) {
            charIndex++;
            setTimeout(typeWriter, 80);
        }
        // ← REMOVA O BLOCO QUE ESCONDIA O CURSOR
        // else {
        //     if (cursorSpan) {
        //         cursorSpan.style.display = 'none';
        //     }
        // }
    }

    setTimeout(typeWriter, 500);
});