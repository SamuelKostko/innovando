/* =========================================================================
   INNOVANDO - SUPER PREMIUM INTERACTIVE EXPERIENCES
   ========================================================================= */

document.addEventListener('DOMContentLoaded', () => {

  // 1. MAGNETIC BUTTONS (Fuerte impacto visual al interactuar)
  document.querySelectorAll('a[href="#contacto"], .bg-primary-container').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${x * 0.25}px, ${y * 0.25}px) scale(1.05)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = 'translate(0px, 0px) scale(1)';
    });
    btn.style.transition = 'transform 0.1s ease-out';
  });

  // 2. PARALLAX EN LOS HERO (Sensación de profundidad 3D extrema)
  const heroes = document.querySelectorAll('.mesh-bg, .min-h-[88vh], .min-h-[90vh], .min-h-screen');
  heroes.forEach(hero => {
    const bg = hero.querySelector('.skeleton img, .absolute.inset-0 img');
    if(bg) {
      bg.style.transition = "transform 0.1s linear";
      window.addEventListener('scroll', () => {
        const scrollPos = window.scrollY;
        if(scrollPos < hero.offsetHeight) {
          bg.style.transform = `translateY(${scrollPos * 0.3}px) scale(1.05)`;
        }
      });
    }
  });

  // 3. SECCIÓN DE REVELADO EN SCROLL Y TILT 3D
  const revealElements = document.querySelectorAll('.gallery-wrap, .stat-box, .solution-card, .animate-fade-up, .anim-up');
  
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0) scale(1)';
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  revealElements.forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(60px) scale(0.95)';
    el.style.transition = `all 1s cubic-bezier(0.16, 1, 0.3, 1) ${i * 0.05}s`;
    revealObserver.observe(el);
    
    // TILT 3D EFFECT INTERACTIVO
    el.addEventListener('mousemove', e => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const rotateX = ((y / rect.height) - 0.5) * -10; // Max rotation 10deg
      const rotateY = ((x / rect.width) - 0.5) * 10;
      el.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
      el.style.transition = 'transform 0.1s ease-out';
      el.style.zIndex = '40';
    });
    
    el.addEventListener('mouseleave', () => {
      el.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
      el.style.transition = 'transform 0.5s ease-out';
      el.style.zIndex = '1';
    });
  });

  // 4. CURSOR GLOW (Follow mouse)
  const cursorGlow = document.createElement('div');
  cursorGlow.id = 'cursor-glow-fx';
  document.body.appendChild(cursorGlow);

  const cursorStyle = document.createElement('style');
  cursorStyle.innerHTML = `
    #cursor-glow-fx {
      position: fixed;
      top: 0; left: 0;
      width: 500px; height: 500px;
      background: radial-gradient(circle, rgba(46, 91, 255, 0.12) 0%, rgba(46,91,255,0) 60%);
      border-radius: 50%;
      pointer-events: none;
      transform: translate(-50%, -50%);
      z-index: 9999;
      mix-blend-mode: screen;
      transition: width 0.3s, height 0.3s, background 0.3s;
    }
    a:hover ~ #cursor-glow-fx, button:hover ~ #cursor-glow-fx {
       width: 150px;
       height: 150px;
       background: radial-gradient(circle, rgba(233, 30, 99, 0.3) 0%, rgba(233, 30, 99,0) 70%);
    }
  `;
  document.head.appendChild(cursorStyle);

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursorGlow.style.left = mouseX + 'px';
    cursorGlow.style.top = mouseY + 'px';
  });

  // 5. EFECTO CRISTAL DINÁMICO NAV
  const navContainer = document.querySelector('nav > div');
  if(navContainer) {
    navContainer.style.transition = 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)';
    window.addEventListener('scroll', () => {
      if(window.scrollY > 50) {
        navContainer.style.background = 'rgba(255, 255, 255, 0.85)';
        navContainer.style.backdropFilter = 'blur(20px)';
        navContainer.style.paddingTop = '8px';
        navContainer.style.paddingBottom = '8px';
        navContainer.classList.add('shadow-xl', 'shadow-primary-container/10');
      } else {
        navContainer.style.background = 'white';
        navContainer.style.backdropFilter = 'none';
        navContainer.style.paddingTop = '12px';
        navContainer.style.paddingBottom = '12px';
        navContainer.classList.remove('shadow-xl', 'shadow-primary-container/10');
      }
    });
  }

});

