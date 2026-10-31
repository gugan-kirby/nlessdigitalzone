/* N'LESS Digital Zone — main.js */
(() => {
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];

  /* Header background + floating WhatsApp button on scroll */
  const header = $('#header');
  const waFloat = $('.wa-float');
  const onScroll = () => {
    const y = window.scrollY;
    header.classList.toggle('is-scrolled', y > 40);
    waFloat.classList.toggle('is-shown', y > 500);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* Mobile menu */
  const burger = $('#burger');
  const nav = $('#nav');
  const setMenu = (open) => {
    nav.classList.toggle('is-open', open);
    burger.setAttribute('aria-expanded', open);
    burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  };
  burger.addEventListener('click', () => setMenu(!nav.classList.contains('is-open')));
  $$('a', nav).forEach((a) => a.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', (e) => e.key === 'Escape' && setMenu(false));

  /* Active nav link follows the section in view */
  const links = $$('.nav__link');
  const sections = links.map((l) => $(l.getAttribute('href'))).filter(Boolean);
  const spy = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (!en.isIntersecting) return;
      links.forEach((l) => l.classList.toggle('is-active', l.getAttribute('href') === '#' + en.target.id));
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  sections.forEach((s) => spy.observe(s));

  /* Scroll reveal */
  const revealer = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (!en.isIntersecting) return;
      const el = en.target;
      setTimeout(() => el.classList.add('is-visible'), +(el.dataset.delay || 0));
      revealer.unobserve(el);
    });
  }, { threshold: 0.12 });
  $$('.reveal').forEach((el) => revealer.observe(el));

  /* Count-up numbers: <span data-count="7000" data-format="in"> */
  const fmt = (n, el) => (el.dataset.format === 'in' ? Math.round(n).toLocaleString('en-IN') : Math.round(n));
  const counter = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (!en.isIntersecting) return;
      const el = en.target;
      const end = parseFloat(el.dataset.count);
      const start = performance.now();
      const dur = 1400;
      const tick = (now) => {
        const p = Math.min((now - start) / dur, 1);
        el.textContent = fmt(end * (1 - Math.pow(1 - p, 3)), el);
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      counter.unobserve(el);
    });
  }, { threshold: 0.6 });
  if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
    $$('[data-count]').forEach((el) => counter.observe(el));
  }

  /* Audit form — validates, then opens WhatsApp with the enquiry pre-filled.
     No backend: nothing is stored on the website. */
  const form = $('#auditForm');
  const status = $('#formStatus');

  // "Start with <plan>" buttons drop the plan name into the message box.
  $$('[data-plan]').forEach((btn) => btn.addEventListener('click', () => {
    const msg = form.elements.message;
    if (!msg.value.trim()) msg.value = `I'm interested in the ${btn.dataset.plan} plan.`;
  }));

  const validate = (field) => {
    if (!field.name) return true;
    const ok = field.checkValidity() && (!field.required || field.value.trim() !== '');
    field.closest('.field')?.classList.toggle('is-invalid', !ok);
    return ok;
  };
  $$('input, select, textarea', form).forEach((f) => {
    f.addEventListener('blur', () => f.value && validate(f));
    f.addEventListener('input', () => f.closest('.field.is-invalid') && validate(f));
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const bad = $$('input, select, textarea', form).filter((f) => !validate(f));
    if (bad.length) {
      bad[0].focus();
      status.className = 'form__status is-error';
      status.textContent = 'Please fix the highlighted fields and try again.';
      return;
    }

    const get = (n) => form.elements[n].value.trim();
    const lines = [
      'New practice audit request',
      '',
      `Name: ${get('name')}`,
      `Specialty: ${get('specialty')}`,
      `City: ${get('city')}`,
      `Phone: ${get('phone')}`,
      get('email') ? `Email: ${get('email')}` : null,
      get('message') ? `Notes: ${get('message')}` : null,
    ].filter((l) => l !== null);

    const number = form.dataset.whatsapp.replace(/\D/g, '');
    const url = `https://wa.me/${number}?text=${encodeURIComponent(lines.join('\n'))}`;
    status.className = 'form__status is-ok';
    status.textContent = 'Opening WhatsApp with your details…';
    window.open(url, '_blank', 'noopener');
  });

  /* Footer year */
  $('#year').textContent = new Date().getFullYear();
})();
