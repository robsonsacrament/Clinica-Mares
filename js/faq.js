// ============================================================
// FAQ.JS - Accordion com animação suave
// ============================================================

document.addEventListener('DOMContentLoaded', function() {
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');

        if (!question || !answer) return;

        question.addEventListener('click', function() {
            const isOpen = item.classList.contains('open');

            // Fecha todos os outros itens
            faqItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('open')) {
                    otherItem.classList.remove('open');
                    otherItem.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
                }
            });

            // Alterna o item clicado
            if (isOpen) {
                item.classList.remove('open');
                question.setAttribute('aria-expanded', 'false');
            } else {
                item.classList.add('open');
                question.setAttribute('aria-expanded', 'true');
            }
        });

        // Suporte a teclado (Enter e Espaço já funcionam por padrão em buttons)
        question.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    });
});