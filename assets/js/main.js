/**
 * Rum River Coin - Main Application Script
 */

document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initHeaderScroll();
  initActiveNav();
  initAccordions();
  initContactForm();
  initEstimateCalculator();
});

/* Mobile Navigation Toggle */
function initMobileMenu() {
  const toggleBtn = document.getElementById('mobileMenuToggle');
  const drawer = document.getElementById('mobileNavDrawer');

  if (!toggleBtn || !drawer) return;

  function toggleMenu(open) {
    const isCurrentlyOpen = toggleBtn.getAttribute('aria-expanded') === 'true';
    const shouldOpen = open !== undefined ? open : !isCurrentlyOpen;

    toggleBtn.setAttribute('aria-expanded', String(shouldOpen));
    if (shouldOpen) {
      drawer.classList.add('open');
      document.body.style.overflow = 'hidden';
      toggleBtn.innerHTML = `
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      `;
    } else {
      drawer.classList.remove('open');
      document.body.style.overflow = '';
      toggleBtn.innerHTML = `
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <line x1="4" y1="6" x2="20" y2="6"></line>
          <line x1="4" y1="12" x2="20" y2="12"></line>
          <line x1="4" y1="18" x2="20" y2="18"></line>
        </svg>
      `;
    }
  }

  toggleBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleMenu();
  });

  // Close when clicking any nav link
  const navLinks = drawer.querySelectorAll('a');
  navLinks.forEach((link) => {
    link.addEventListener('click', () => toggleMenu(false));
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') toggleMenu(false);
  });

  // Close when clicking outside drawer
  document.addEventListener('click', (e) => {
    if (
      drawer.classList.contains('open') &&
      !drawer.contains(e.target) &&
      !toggleBtn.contains(e.target)
    ) {
      toggleMenu(false);
    }
  });
}

/* Header Scroll Class */
function initHeaderScroll() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  const onScroll = () => {
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* Highlight Active Navigation Link */
function initActiveNav() {
  const currentPath = window.location.pathname;
  const pageName = currentPath.substring(currentPath.lastIndexOf('/') + 1) || 'index.html';

  const links = document.querySelectorAll('.nav-link, .mobile-nav-link');
  links.forEach((link) => {
    const href = link.getAttribute('href');
    if (!href) return;

    const linkPage = href.substring(href.lastIndexOf('/') + 1) || 'index.html';
    if (
      linkPage === pageName ||
      (pageName === '' && linkPage === 'index.html') ||
      (pageName === 'index.html' && (href === '/' || href === 'index.html' || href === './index.html'))
    ) {
      link.classList.add('active');
      link.setAttribute('aria-current', 'page');
    } else {
      link.classList.remove('active');
      link.removeAttribute('aria-current');
    }
  });
}

/* Accordion Component */
function initAccordions() {
  const accordions = document.querySelectorAll('.accordion');
  accordions.forEach((accordion) => {
    const items = accordion.querySelectorAll('.accordion-item');
    items.forEach((item) => {
      const trigger = item.querySelector('.accordion-trigger');
      if (!trigger) return;

      trigger.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        // Close siblings if desired
        items.forEach((other) => other.classList.remove('active'));
        if (!isActive) {
          item.classList.add('active');
        }
      });
    });
  });
}

/* Interactive Contact Form Validation */
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  const statusBox = document.getElementById('formStatus');

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    let isValid = true;
    const nameInput = form.querySelector('#fullName');
    const emailInput = form.querySelector('#emailAddress');
    const phoneInput = form.querySelector('#phoneNumber');
    const messageInput = form.querySelector('#messageText');

    function validateField(input, testFn, errorId) {
      const errorEl = document.getElementById(errorId);
      if (!testFn(input.value.trim())) {
        isValid = false;
        if (errorEl) errorEl.classList.add('visible');
        input.classList.add('border-red-500');
      } else {
        if (errorEl) errorEl.classList.remove('visible');
        input.classList.remove('border-red-500');
      }
    }

    if (nameInput) {
      validateField(nameInput, (val) => val.length >= 2, 'nameError');
    }

    if (emailInput) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      validateField(emailInput, (val) => emailRegex.test(val), 'emailError');
    }

    if (messageInput) {
      validateField(messageInput, (val) => val.length >= 10, 'messageError');
    }

    if (!isValid) {
      if (statusBox) {
        statusBox.className = 'form-status error';
        statusBox.textContent = 'Please correct the highlighted fields before submitting.';
      }
      return;
    }

    // Process submission
    const submitBtn = form.querySelector('button[type="submit"]');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending Message...';
    }

    setTimeout(() => {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Send Message';
      }
      if (statusBox) {
        statusBox.className = 'form-status success';
        statusBox.innerHTML = `
          <strong>Message Received!</strong> Thank you for reaching out to Rum River Coin. 
          Jason and our numismatic team will review your message and reply promptly.
          <br><small class="text-xs text-slate-500 mt-1 block">Note: For urgent evaluations or to confirm store hours today, please call us directly at (763) 213-7028.</small>
        `;
      }
      form.reset();
    }, 600);
  });
}

/* Interactive Numismatic Valuation Checklist / Estimator */
function initEstimateCalculator() {
  const categorySelect = document.getElementById('calcCategory');
  const resultBox = document.getElementById('calcResult');
  if (!categorySelect || !resultBox) return;

  const guidanceData = {
    coins: {
      title: 'Rare & Collectible Coins (U.S. & World)',
      details: 'We evaluate date, mint mark, strike quality, toning, eye appeal, and wear. Certified PCGS/NGC coins are especially sought after. Please do NOT clean or wipe your coins before bringing them in—uncleaned original surfaces preserve maximum numismatic value!',
      badge: 'Appraisal Tip: Keep in albums or original holders'
    },
    gold: {
      title: 'Gold Bullion & Gold Jewelry',
      details: 'Evaluated by precise weight in troy ounces or grams and karat purity (10k, 14k, 18k, 22k, 24k). We pay competitive live spot-market rates on American Gold Eagles, Buffaloes, Krugerrands, and fine bars.',
      badge: 'Live Market Payouts'
    },
    silver: {
      title: 'Silver Dollars, Rounds & Bullion',
      details: 'We buy Morgan and Peace Silver Dollars (1878–1935), 90% silver pre-1965 dimes, quarters, and halves, plus 1 oz to 100 oz .999 fine silver bars and American Silver Eagles.',
      badge: 'High Demand Category'
    },
    currency: {
      title: 'Paper Currency & Banknotes',
      details: 'We inspect large-size US notes, silver certificates (blue seal), legal tender (red seal), obsolete banknotes, and National Bank Notes. Crisp condition and absence of folds yield top value.',
      badge: 'All Denominations Welcome'
    },
    estate: {
      title: 'Estate & Inherited Collections',
      details: 'Whether you inherited a few cigar boxes or a multi-decade organized collection, we provide honest, patient, zero-pressure appraisals in front of you. Schedule an appointment for larger estates.',
      badge: 'Trusted Family Guidance'
    }
  };

  categorySelect.addEventListener('change', () => {
    const val = categorySelect.value;
    const item = guidanceData[val];
    if (!item) return;

    resultBox.innerHTML = `
      <div style="border-left: 3px solid #c59b27; padding-left: 1rem; margin-top: 1rem;">
        <span style="font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.05em; color: #c59b27; font-weight: 700;">${item.badge}</span>
        <h4 style="font-family: var(--font-serif); font-size: 1.125rem; color: #0f172a; margin: 0.25rem 0 0.5rem 0;">${item.title}</h4>
        <p style="font-size: 0.9375rem; color: #475569; line-height: 1.6;">${item.details}</p>
      </div>
    `;
  });
}
