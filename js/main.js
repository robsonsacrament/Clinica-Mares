/* ============================================================
   CLÍNICA MARÉS — main.js (único arquivo, sem dependências)
   ============================================================ */
(function () {
    'use strict';

    const $  = (s, c) => (c || document).querySelector(s);
    const $$ = (s, c) => Array.from((c || document).querySelectorAll(s));

    /* ---------- 1. SCROLL PROGRESS + HEADER SHADOW ---------- */
    const progress = $('#scrollProgress');
    const header = $('#header');
    let ticking = false;

    function onScroll() {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(() => {
            const max = document.documentElement.scrollHeight - innerHeight;
            if (progress) progress.style.transform = 'scaleX(' + (max > 0 ? scrollY / max : 0) + ')';
            if (header) header.classList.toggle('scrolled', scrollY > 10);
            ticking = false;
        });
    }
    addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    /* ---------- 2. MENU MOBILE (focus trap + ESC + ARIA) ---------- */
    const toggle = $('#menuToggle');
    const menu = $('#menuMobile');

    function setMenu(open) {
        menu.classList.toggle('open', open);
        toggle.classList.toggle('active', open);
        toggle.setAttribute('aria-expanded', String(open));
        toggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
        document.body.style.overflow = open ? 'hidden' : '';
        if (open) {
            const first = menu.querySelector('a');
            first && first.focus();
        } else {
            toggle.focus();
        }
    }

    if (toggle && menu) {
        toggle.addEventListener('click', () => setMenu(!menu.classList.contains('open')));

        menu.addEventListener('click', (e) => {
            if (e.target.closest('a')) setMenu(false);
        });

        document.addEventListener('keydown', (e) => {
            if (!menu.classList.contains('open')) return;
            if (e.key === 'Escape') { setMenu(false); return; }
            if (e.key === 'Tab') {
                const focusables = $$('a, button', menu).filter(el => el.offsetParent !== null);
                if (!focusables.length) return;
                const first = focusables[0], last = focusables[focusables.length - 1];
                if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
                else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
            }
        });
    }

    /* ---------- 3. DROPDOWNS DESKTOP (teclado + toque) ---------- */
    $$('.nav-dropdown').forEach((dd) => {
        const btn = $('.nav-dropdown-trigger', dd);
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const open = dd.classList.toggle('open');
            btn.setAttribute('aria-expanded', String(open));
        });
    });
    document.addEventListener('click', () => {
        $$('.nav-dropdown.open').forEach((dd) => {
            dd.classList.remove('open');
            $('.nav-dropdown-trigger', dd).setAttribute('aria-expanded', 'false');
        });
    });

    /* ---------- 4. SCROLL REVEAL ---------- */
    if ('IntersectionObserver' in window) {
        const revealIO = new IntersectionObserver((entries) => {
            entries.forEach((en) => {
                if (en.isIntersecting) { en.target.classList.add('visible'); revealIO.unobserve(en.target); }
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
        $$('.scroll-reveal').forEach((el) => revealIO.observe(el));
    } else {
        $$('.scroll-reveal').forEach((el) => el.classList.add('visible'));
    }

    /* ---------- 5. HERO: reveal de entrada ---------- */
    const hero = $('.hero-cine');
    if (hero) {
        const activate = () => requestAnimationFrame(() => hero.classList.add('is-loaded'));
        if (document.readyState === 'complete') activate();
        else addEventListener('load', activate);
        setTimeout(activate, 2000); /* fallback */
    }

    /* ---------- 6. HERO: slideshow cinematográfico ---------- */
    if (hero) {
        const frames = $$('.hero-frame', hero);
        if (frames.length > 1 && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
            let current = 0, timer = null;
            const INTERVAL = 6500;

            const next = () => {
                frames[current].classList.remove('is-active');
                current = (current + 1) % frames.length;
                frames[current].classList.add('is-active');
            };
            const start = () => { if (!timer) timer = setInterval(next, INTERVAL); };
            const stop  = () => { clearInterval(timer); timer = null; };

            addEventListener('load', () => setTimeout(start, 2500));
            document.addEventListener('visibilitychange', () => (document.hidden ? stop() : start()));
            if ('IntersectionObserver' in window) {
                new IntersectionObserver((es) => es.forEach((e) => (e.isIntersecting ? start() : stop())), { threshold: 0.15 }).observe(hero);
            }
        }
    }

    /* ---------- 7. CONTADORES ANIMADOS ---------- */
    const easeOutQuart = (t) => 1 - Math.pow(1 - t, 4);

    function animateCounter(el) {
        const target = parseInt(el.dataset.target, 10);
        const suffix = el.dataset.suffix || '';
        const useSep = el.dataset.separator === 'true';
        const duration = 2200;
        const t0 = performance.now();

        (function tick(now) {
            const p = Math.min((now - t0) / duration, 1);
            const val = Math.floor(easeOutQuart(p) * target);
            el.textContent = (useSep ? val.toLocaleString('pt-BR') : val) + (p === 1 ? suffix : '');
            if (p < 1) requestAnimationFrame(tick);
        })(t0);
    }

    if ('IntersectionObserver' in window) {
        const counterIO = new IntersectionObserver((es) => {
            es.forEach((en) => { if (en.isIntersecting) { animateCounter(en.target); counterIO.unobserve(en.target); } });
        }, { threshold: 0.4 });
        $$('.js-counter').forEach((el) => counterIO.observe(el));
    } else {
        $$('.js-counter').forEach((el) => (el.textContent = el.dataset.target));
    }

    /* ---------- 8. FAQ ACCORDION ---------- */
    $$('.faq-question').forEach((btn) => {
        btn.addEventListener('click', () => {
            const item = btn.closest('.faq-item');
            const open = item.classList.contains('open');
            $$('.faq-item.open').forEach((i) => {
                i.classList.remove('open');
                $('.faq-question', i).setAttribute('aria-expanded', 'false');
            });
            if (!open) {
                item.classList.add('open');
                btn.setAttribute('aria-expanded', 'true');
            }
        });
    });

    /* ---------- 9. MAPA LAZY (só carrega perto da viewport) ---------- */
    const map = $('#lazyMap');
    if (map && 'IntersectionObserver' in window) {
        const mapIO = new IntersectionObserver((es) => {
            es.forEach((en) => {
                if (en.isIntersecting) { map.src = map.dataset.src; mapIO.disconnect(); }
            });
        }, { rootMargin: '300px' });
        mapIO.observe(map);
    } else if (map) {
        map.src = map.dataset.src;
    }

    /* ---------- 10. FORMULÁRIO (feedback visual) ---------- */
    const form = $('#contactForm');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            if (!form.checkValidity()) { form.reportValidity(); return; }
            const status = $('#formStatus');
            status.textContent = '✓ Mensagem enviada! Retornaremos em até 2 horas úteis.';
            status.style.color = '#2b8a6e';
            form.reset();
        });
    }

    /* ---------- 11. ANO DINÂMICO NO FOOTER ---------- */
    const year = $('#year');
    if (year) year.textContent = new Date().getFullYear();
})();

/* ---------- 12. CALCULADORA DE ROTA (páginas locais) ---------- */
(function initRouteWidget() {
    const form = document.getElementById('routeForm');
    if (!form) return;

    const DESTINO = 'R. da Praça, 41 - Cidade Universitária Pedra Branca, Palhoça - SC';
    const iframe = document.getElementById('routeMap');
    const input = document.getElementById('routeOrigin');
    const linkMaps = document.getElementById('routeLinkMaps');

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        const origem = input.value.trim();
        if (!origem) { input.focus(); return; }

        // Atualiza o mapa embutido com a rota + tempo estimado
        iframe.src = 'https://maps.google.com/maps?saddr=' + encodeURIComponent(origem) +
                     '&daddr=' + encodeURIComponent(DESTINO) + '&output=embed';

        // Atualiza o link "abrir no Google Maps"
        if (linkMaps) {
            linkMaps.href = 'https://www.google.com/maps/dir/?api=1&origin=' + encodeURIComponent(origem) +
                            '&destination=' + encodeURIComponent(DESTINO);
        }

        // Evento de conversão (GA4, se instalado)
        if (window.gtag) gtag('event', 'rota_calculada', { page: location.pathname });
    });
})();