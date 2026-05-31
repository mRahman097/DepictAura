/* ========================================
   Video Editing Agency — Interactive JS
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {

  // ---- Cursor Glow Follow ----
  const cursorGlow = document.getElementById('cursorGlow');
  if (cursorGlow && window.matchMedia('(pointer: fine)').matches) {
    let mouseX = 0, mouseY = 0, glowX = 0, glowY = 0;
    document.addEventListener('mousemove', (e) => { mouseX = e.clientX; mouseY = e.clientY; });
    (function animateGlow() {
      glowX += (mouseX - glowX) * 0.08;
      glowY += (mouseY - glowY) * 0.08;
      cursorGlow.style.left = glowX + 'px';
      cursorGlow.style.top = glowY + 'px';
      requestAnimationFrame(animateGlow);
    })();
  } else if (cursorGlow) {
    cursorGlow.style.display = 'none';
  }

  // ---- Navbar Scroll Effect ----
  const nav = document.getElementById('mainNav');
  function handleNavScroll() {
    if (window.scrollY > 50) nav.classList.add('nav--scrolled');
    else nav.classList.remove('nav--scrolled');
  }
  window.addEventListener('scroll', handleNavScroll, { passive: true });
  handleNavScroll();

  // ---- Active Nav Link Highlight ----
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav__link[data-nav]');
  function updateActiveNav() {
    const scrollPos = window.scrollY + 200;
    sections.forEach((section) => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');
      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach((link) => {
          link.classList.remove('nav__link--active');
          if (link.getAttribute('href') === `#${id}`) link.classList.add('nav__link--active');
        });
      }
    });
  }
  window.addEventListener('scroll', updateActiveNav, { passive: true });

  // ---- Mobile Menu Toggle ----
  const navToggle = document.getElementById('navToggle');
  const navLinksContainer = document.getElementById('navLinks');
  if (navToggle) {
    navToggle.addEventListener('click', () => {
      const isOpen = navLinksContainer.classList.toggle('nav__links--open');
      const spans = navToggle.querySelectorAll('span');
      if (isOpen) {
        spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
        document.body.style.overflow = 'hidden';
      } else {
        spans[0].style.transform = ''; spans[1].style.opacity = ''; spans[2].style.transform = '';
        document.body.style.overflow = '';
      }
    });
    navLinksContainer.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        navLinksContainer.classList.remove('nav__links--open');
        const spans = navToggle.querySelectorAll('span');
        spans[0].style.transform = ''; spans[1].style.opacity = ''; spans[2].style.transform = '';
        document.body.style.overflow = '';
      });
    });
  }

  // ---- Smooth Scroll ----
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(a.getAttribute('href'));
      if (target) target.scrollIntoView({ behavior: 'smooth' });
    });
  });

  // ---- Scroll Reveal (Intersection Observer) ----
  const revealObserver = new IntersectionObserver(
    (entries) => entries.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add('revealed'); revealObserver.unobserve(e.target); }
    }),
    { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
  );
  document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));

  // ---- Animated Counters ----
  const counterObserver = new IntersectionObserver(
    (entries) => entries.forEach((e) => {
      if (e.isIntersecting) { animateCounter(e.target, parseInt(e.target.dataset.count, 10)); counterObserver.unobserve(e.target); }
    }),
    { threshold: 0.5 }
  );
  document.querySelectorAll('[data-count]').forEach((c) => counterObserver.observe(c));

  function animateCounter(el, target) {
    const duration = 2000, startTime = performance.now();
    const suffix = el.dataset.suffix || '+';
    (function update(now) {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target) + suffix;
      if (progress < 1) requestAnimationFrame(update);
    })(startTime);
  }

  // ---- Portfolio Filter Tabs ----
  const filterBtns = document.querySelectorAll('[data-filter]');
  const portfolioItems = document.querySelectorAll('[data-category]');

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => b.classList.remove('portfolio__filter--active'));
      btn.classList.add('portfolio__filter--active');
      const filter = btn.dataset.filter;

      portfolioItems.forEach((item) => {
        if (filter === 'all' || item.dataset.category === filter) {
          item.style.display = '';
          item.style.animation = 'fadeInUp 0.5s ease-out forwards';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });

  // ---- Video Modal ----
  const modal = document.getElementById('videoModal');
  const modalClose = document.getElementById('modalClose');
  const modalBackdrop = document.getElementById('modalBackdrop');
  const modalTitle = document.getElementById('modalTitle');
  const modalCategory = document.getElementById('modalCategory');
  const modalDesc = document.getElementById('modalDesc');
  const modalVideoArea = document.querySelector('.modal__video-area');
  const originalVideoPlaceholder = modalVideoArea ? modalVideoArea.innerHTML : '';

  document.querySelectorAll('[data-video-title]').forEach((trigger) => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const title = trigger.dataset.videoTitle;
      const cat = trigger.dataset.videoCategory || '';
      const desc = trigger.dataset.videoDesc || '';
      const embedUrl = trigger.dataset.videoEmbed;

      if (modalTitle) modalTitle.textContent = title;
      if (modalCategory) modalCategory.textContent = cat;
      if (modalDesc) modalDesc.textContent = desc;

      if (modalVideoArea && embedUrl) {
        const isLocalVideo = embedUrl.endsWith('.mp4') || embedUrl.endsWith('.webm') || embedUrl.endsWith('.ogg') || embedUrl.includes('images/');
        if (isLocalVideo) {
          modalVideoArea.innerHTML = `<video src="${embedUrl}" autoplay controls style="width:100%; height:100%; border:none; border-radius: var(--radius-lg); object-fit: cover; outline: none; background: #000;"></video>`;
        } else {
          modalVideoArea.innerHTML = `<iframe src="${embedUrl}?autoplay=1&rel=0" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen style="width:100%; height:100%; border:none; border-radius: var(--radius-lg);" referrerpolicy="strict-origin-when-cross-origin"></iframe>`;
        }
      }

      if (modal) {
        modal.classList.add('video-modal--open');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  function closeModal() {
    if (modal) {
      modal.classList.remove('video-modal--open');
      document.body.style.overflow = '';
      if (modalVideoArea) {
        modalVideoArea.innerHTML = originalVideoPlaceholder;
      }
    }
  }

  if (modalClose) modalClose.addEventListener('click', closeModal);
  if (modalBackdrop) modalBackdrop.addEventListener('click', closeModal);
  if (modal) modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });

  // ---- 3D Tilt on Glass Cards (desktop) ----
  if (window.matchMedia('(pointer: fine)').matches) {
    document.querySelectorAll('.glass-card').forEach((card) => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left, y = e.clientY - rect.top;
        const rotateX = ((y - rect.height / 2) / (rect.height / 2)) * -3;
        const rotateY = ((x - rect.width / 2) / (rect.width / 2)) * 3;
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
      });
      card.addEventListener('mouseleave', () => { card.style.transform = ''; });
    });
  }

  // ---- Particle Stars Background ----
  const canvas = document.createElement('canvas');
  canvas.id = 'particleCanvas';
  canvas.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:0;opacity:0.4;';
  document.body.prepend(canvas);
  const ctx = canvas.getContext('2d');
  let particles = [];
  const PARTICLE_COUNT = 50;

  function resizeCanvas() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x = Math.random() * canvas.width; this.y = Math.random() * canvas.height;
      this.size = Math.random() * 1.8 + 0.4;
      this.speedX = (Math.random() - 0.5) * 0.25; this.speedY = (Math.random() - 0.5) * 0.25;
      this.opacity = Math.random() * 0.4 + 0.1;
      this.hue = [270, 230, 320, 280][Math.floor(Math.random() * 4)];
    }
    update() {
      this.x += this.speedX; this.y += this.speedY;
      if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
      if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
    }
    draw() {
      ctx.beginPath(); ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${this.hue}, 70%, 70%, ${this.opacity})`; ctx.fill();
    }
  }

  for (let i = 0; i < PARTICLE_COUNT; i++) particles.push(new Particle());

  (function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach((p) => { p.update(); p.draw(); });
    // Draw connections
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x, dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 130) {
          ctx.beginPath(); ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(147, 51, 234, ${(1 - dist / 130) * 0.12})`;
          ctx.lineWidth = 0.5; ctx.stroke();
        }
      }
    }
    requestAnimationFrame(animate);
  })();

  // ---- Contact Form Handler ----
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = contactForm.querySelector('.btn--primary');
      const original = btn.innerHTML;
      btn.innerHTML = '✓ Message Sent!';
      btn.style.background = 'linear-gradient(135deg, #22c55e, #16a34a)';
      btn.style.boxShadow = '0 4px 20px rgba(34, 197, 94, 0.35)';
      setTimeout(() => { btn.innerHTML = original; btn.style.background = ''; btn.style.boxShadow = ''; contactForm.reset(); }, 3000);
    });
  }

  // ---- Marquee Pause on Hover ----
  document.querySelectorAll('.marquee, .testimonials').forEach((container) => {
    const track = container.querySelector('.marquee-track, .testimonials__track');
    if (track) {
      container.addEventListener('mouseenter', () => { track.style.animationPlayState = 'paused'; });
      container.addEventListener('mouseleave', () => { track.style.animationPlayState = 'running'; });
    }
  });

  // ---- Packages Modal ----
  const packagesModal = document.getElementById('packagesModal');
  const viewPackagesBtn = document.getElementById('viewPackagesBtn');
  const packagesClose = document.getElementById('packagesClose');
  const packagesBackdrop = document.getElementById('packagesBackdrop');
  const packagesSelectBtn = document.getElementById('packagesSelectBtn');

  if (viewPackagesBtn && packagesModal) {
    viewPackagesBtn.addEventListener('click', (e) => {
      e.preventDefault();
      packagesModal.classList.add('video-modal--open');
      document.body.style.overflow = 'hidden';
    });

    const closePackages = () => {
      packagesModal.classList.remove('video-modal--open');
      document.body.style.overflow = '';
    };

    if (packagesClose) packagesClose.addEventListener('click', closePackages);
    if (packagesBackdrop) packagesBackdrop.addEventListener('click', closePackages);
    if (packagesSelectBtn) {
      packagesSelectBtn.addEventListener('click', () => {
        closePackages();
        // Pre-select wedding in projectType dropdown
        const projectDropdown = document.getElementById('projectType');
        if (projectDropdown) {
          projectDropdown.value = 'wedding';
        }
      });
    }

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && packagesModal.classList.contains('video-modal--open')) {
        closePackages();
      }
    });
  }

});
