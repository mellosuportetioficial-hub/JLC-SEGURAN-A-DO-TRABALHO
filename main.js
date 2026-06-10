javascript

/**
 * JLC Assessoria e Consultoria
 * main.js — Interatividade e comportamentos
 */

'use strict';

/* =====================================================
   1. MENU MOBILE — toggle abrir/fechar
   ===================================================== */
(function initMenuMobile() {
  const toggle = document.getElementById('menuToggle');
  const nav    = document.getElementById('mainNav');
  if (!toggle || !nav) return;

  toggle.addEventListener('click', () => {
    const aberto = nav.classList.toggle('aberta');
    toggle.classList.toggle('aberto', aberto);
    toggle.setAttribute('aria-label', aberto ? 'Fechar menu' : 'Abrir menu');
  });

  // Fecha o menu ao clicar em um link interno
  nav.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('aberta');
      toggle.classList.remove('aberto');
      toggle.setAttribute('aria-label', 'Abrir menu');
    });
  });
})();


/* =====================================================
   2. HEADER — muda aparência ao rolar
   ===================================================== */
(function initHeaderScroll() {
  const header = document.getElementById('header');
  if (!header) return;

  function atualizarHeader() {
    if (window.scrollY > 40) {
      header.style.boxShadow = '0 4px 20px rgba(0,0,0,0.25)';
    } else {
      header.style.boxShadow = '';
    }
  }

  window.addEventListener('scroll', atualizarHeader, { passive: true });
  atualizarHeader();
})();


/* =====================================================
   3. SMOOTH SCROLL — âncoras internas
   ===================================================== */
(function initSmoothScroll() {
  const OFFSET_HEADER = 80; // altura do header fixo em px

  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const alvo = link.getAttribute('href');
      if (alvo === '#') return;

      const elemento = document.querySelector(alvo);
      if (!elemento) return;

      e.preventDefault();
      const topo = elemento.getBoundingClientRect().top + window.scrollY - OFFSET_HEADER;
      window.scrollTo({ top: topo, behavior: 'smooth' });
    });
  });
})();


/* =====================================================
   4. ANIMAÇÃO AO SCROLL — revela seções com IntersectionObserver
   ===================================================== */
(function initReveal() {
  const css = `
    .reveal { opacity: 0; transform: translateY(28px); transition: opacity .55s ease, transform .55s ease; }
    .reveal.visivel { opacity: 1; transform: translateY(0); }
  `;
  const style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

  const alvos = document.querySelectorAll(
    '.card, .norma-card, .destaque-inner > *, .contato-inner > *, .quote, .depoimento-img'
  );

  alvos.forEach(el => el.classList.add('reveal'));

  if ('IntersectionObserver' in window) {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visivel');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    alvos.forEach(el => obs.observe(el));
  } else {
    // Fallback para navegadores antigos
    alvos.forEach(el => el.classList.add('visivel'));
  }
})();


/* =====================================================
   5. FORMULÁRIO DE CONTATO — validação e feedback
   ===================================================== */
(function initFormContato() {
  const form     = document.getElementById('contatoForm');
  const feedback = document.getElementById('formFeedback');
  if (!form || !feedback) return;

  form.addEventListener('submit', e => {
    e.preventDefault();

    const nome     = form.nome.value.trim();
    const email    = form.email.value.trim();
    const mensagem = form.mensagem.value.trim();

    // Validação simples
    if (!nome || !email || !mensagem) {
      mostrarFeedback('Por favor, preencha todos os campos.', 'erro');
      return;
    }

    if (!validarEmail(email)) {
      mostrarFeedback('Informe um e-mail válido.', 'erro');
      return;
    }

    // Simula envio (integrar backend/EmailJS/Formspree aqui)
    const btn = form.querySelector('button[type="submit"]');
    btn.disabled = true;
    btn.textContent = 'Enviando…';

    setTimeout(() => {
      mostrarFeedback('✅ Mensagem enviada! Entraremos em contato em breve.', 'ok');
      form.reset();
      btn.disabled = false;
      btn.textContent = 'Enviar Mensagem';
    }, 1400);
  });

  function validarEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function mostrarFeedback(msg, tipo) {
    feedback.textContent = msg;
    feedback.style.color = tipo === 'erro' ? '#ff6b6b' : '#5ef08a';
    clearTimeout(feedback._timer);
    if (tipo === 'ok') {
      feedback._timer = setTimeout(() => { feedback.textContent = ''; }, 6000);
    }
  }
})();


/* =====================================================
   6. ANO ATUAL NO FOOTER
   ===================================================== */
(function initAnoAtual() {
  const span = document.getElementById('anoAtual');
  if (span) span.textContent = new Date().getFullYear();
})();


/* =====================================================
   7. LINK ATIVO NO MENU conforme seção visível
   ===================================================== */
(function initNavAtiva() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  if (!sections.length || !navLinks.length) return;

  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => {
          const href = link.getAttribute('href');
          link.style.color = href === `#${entry.target.id}`
            ? 'var(--cor-destaque)'
            : '';
        });
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });

  sections.forEach(sec => obs.observe(sec));
})();