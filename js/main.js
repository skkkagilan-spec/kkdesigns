/**
 * KK DESIGNS — LUXURY INTERIOR ARCHITECTURE & DESIGN STUDIO
 * Client-Side Interactive Engine
 */

document.addEventListener('DOMContentLoaded', () => {
  initThemeManager();
  initNavigation();
  initComparisonSlider();
  initPortfolioFilter();
  initProjectModal();
  initEstimator();
  initContactForm();
  initScrollAnimations();
});

/* ==========================================================================
   1. THEME MANAGER (DARK / LIGHT LUXURY EDITORIAL TOGGLE)
   ========================================================================== */
function initThemeManager() {
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const themeLabel = document.getElementById('themeLabel');
  const root = document.documentElement;

  // Retrieve saved theme or default to dark
  const savedTheme = localStorage.getItem('kk_designs_theme') || 'dark';
  setTheme(savedTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = root.getAttribute('data-theme') || 'dark';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      setTheme(newTheme);
    });
  }

  function setTheme(theme) {
    root.setAttribute('data-theme', theme);
    localStorage.setItem('kk_designs_theme', theme);
    if (themeLabel) {
      themeLabel.textContent = theme === 'dark' ? 'Light Theme' : 'Dark Theme';
    }
  }
}

/* ==========================================================================
   2. NAVIGATION, STICKY HEADER & MOBILE DRAWER
   ========================================================================== */
function initNavigation() {
  const header = document.querySelector('.main-header');
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const mobileDrawer = document.getElementById('mobileNavDrawer');
  const mobileNavClose = document.getElementById('mobileNavClose');
  const drawerOverlay = document.getElementById('drawerOverlay');
  const mobileLinks = document.querySelectorAll('.mobile-nav-links a');
  const navLinks = document.querySelectorAll('.nav-link');

  // Sticky header on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    updateActiveNavLink();
  });

  // Mobile Drawer toggles
  function openDrawer() {
    mobileDrawer.classList.add('open');
    drawerOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    mobileDrawer.classList.remove('open');
    drawerOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (hamburgerBtn) hamburgerBtn.addEventListener('click', openDrawer);
  if (mobileNavClose) mobileNavClose.addEventListener('click', closeDrawer);
  if (drawerOverlay) drawerOverlay.addEventListener('click', closeDrawer);

  mobileLinks.forEach(link => {
    link.addEventListener('click', closeDrawer);
  });

  // Auto-close mobile drawer if viewport is resized to desktop
  window.addEventListener('resize', () => {
    if (window.innerWidth > 992 && mobileDrawer.classList.contains('open')) {
      closeDrawer();
    }
  });

  // Active section indicator on scroll
  const sections = document.querySelectorAll('section[id]');
  function updateActiveNavLink() {
    const scrollY = window.pageYOffset;
    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120;
      const sectionId = current.getAttribute('id');
      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }
}

/* ==========================================================================
   3. INTERACTIVE "BEFORE & AFTER" TRANSFORMATION SLIDER
   ========================================================================== */
function initComparisonSlider() {
  const container = document.getElementById('comparisonContainer');
  const afterLayer = document.getElementById('comparisonAfterLayer');
  const handle = document.getElementById('comparisonHandle');
  if (!container || !afterLayer || !handle) return;

  let isDragging = false;

  function updateSliderPosition(clientX) {
    const rect = container.getBoundingClientRect();
    let x = clientX - rect.left;
    if (x < 0) x = 0;
    if (x > rect.width) x = rect.width;

    const percentage = (x / rect.width) * 100;
    afterLayer.style.clipPath = `polygon(0 0, ${percentage}% 0, ${percentage}% 100%, 0 100%)`;
    handle.style.left = `${percentage}%`;
  }

  // Mouse Events
  container.addEventListener('mousedown', (e) => {
    isDragging = true;
    updateSliderPosition(e.clientX);
  });

  window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    updateSliderPosition(e.clientX);
  });

  window.addEventListener('mouseup', () => {
    isDragging = false;
  });

  // Touch Events for Mobile / Tablet
  container.addEventListener('touchstart', (e) => {
    isDragging = true;
    if (e.touches[0]) updateSliderPosition(e.touches[0].clientX);
  }, { passive: true });

  window.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    if (e.touches[0]) updateSliderPosition(e.touches[0].clientX);
  }, { passive: true });

  window.addEventListener('touchend', () => {
    isDragging = false;
  });

  // Transformation space switchers
  const transPills = document.querySelectorAll('.trans-pill');
  const beforeImg = document.getElementById('comparisonBeforeImg');
  const afterImg = document.getElementById('comparisonAfterImg');
  const spaceTitle = document.getElementById('comparisonSpaceTitle');
  const spaceDesc = document.getElementById('comparisonSpaceDesc');

  const spacesData = {
    penthouse: {
      title: 'South Mumbai Astral Penthouse (7,200 sq.ft)',
      desc: 'Raw concrete shell reimagined with bespoke fluted American walnut, backlit travertine marble, and panoramic floor-to-ceiling twilight views.',
      before: 'assets/images/living-room-before.jpg',
      after: 'assets/images/hero-penthouse.jpg'
    },
    suite: {
      title: 'Juhu Seaside Master Haven (2,800 sq.ft)',
      desc: 'Transformed an echoey bedroom shell into a sanctuary of boucle textiles, acoustic fluted oak, sheer natural Belgian linens, and custom travertine nightstands.',
      before: 'assets/images/living-room-before.jpg',
      after: 'assets/images/residential-suite.jpg'
    },
    heritage: {
      title: 'Alibaug Courtyard Villa Samudra (12,000 sq.ft)',
      desc: 'A crumbling colonial courtyard resurrected into an emotional heritage oasis with hand-carved stone arches, water reflections, and restored teak rafters.',
      before: 'assets/images/living-room-before.jpg',
      after: 'assets/images/heritage-villa.jpg'
    }
  };

  transPills.forEach(pill => {
    pill.addEventListener('click', () => {
      transPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      const key = pill.getAttribute('data-space');
      const data = spacesData[key];
      if (data) {
        beforeImg.src = data.before;
        afterImg.src = data.after;
        spaceTitle.textContent = data.title;
        spaceDesc.textContent = data.desc;
        // Reset slider to 50%
        afterLayer.style.clipPath = 'polygon(0 0, 50% 0, 50% 100%, 0 100%)';
        handle.style.left = '50%';
      }
    });
  });
}

/* ==========================================================================
   4. PORTFOLIO CATEGORY FILTERING
   ========================================================================== */
function initPortfolioFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue) {
          card.style.display = 'block';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(15px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 300);
        }
      });
    });
  });
}

/* ==========================================================================
   5. PROJECT NARRATIVE LIGHTBOX MODAL
   ========================================================================== */
const projectsDatabase = {
  1: {
    title: 'The Astral Penthouse',
    location: 'Worli, South Mumbai',
    area: '7,200 sq.ft',
    category: 'Bespoke Residential',
    palette: 'Travertine Marble, Brushed Champagne Brass, Fluted Oak, Textured Boucle',
    image: 'assets/images/hero-penthouse.jpg',
    narrative: `Commissioned by a multi-generational family, this penthouse was envisioned as an emotional sanctuary that frames the Arabian Sea while celebrating ancestral heirlooms. Keerthika introduced custom architectural fluted millwork, a bespoke sculptural bronze chandelier, and bespoke layout zoning that balances grand hospitality with intimate family memories.`
  },
  2: {
    title: 'Villa Samudra Heritage Sanctuary',
    location: 'Alibaug Coastline',
    area: '12,000 sq.ft',
    category: 'Heritage Restoration',
    palette: 'Restored Burmese Teak, Carved Sandstone, Antique Brass Lanterns, Reflection Pool',
    image: 'assets/images/heritage-villa.jpg',
    narrative: `A century-old coastal estate transformed into a timeless sanctuary. We preserved the original teak structural pillars, restored courtyard arches, and integrated contemporary black stone dining spaces. The central reflection pond cools the micro-climate and grounds the family's shared heritage.`
  },
  3: {
    title: 'The Velvet Archive Private Club',
    location: 'Bandra West, Mumbai',
    area: '4,500 sq.ft',
    category: 'Bespoke Hospitality',
    palette: 'Emerald Velvet, Fluted Nero Marquina Marble, Backlit Brass Arches',
    image: 'assets/images/hospitality-lounge.jpg',
    narrative: `An exclusive members salon celebrating literary salons of the 1920s with contemporary Mumbai flair. Arched niches illuminate curated brass curiosities, while opulent emerald velvet banquettes encourage intimate intellectual discourse and emotional connection.`
  },
  4: {
    title: 'Serene Solitude Master Haven',
    location: 'Juhu Beachfront',
    area: '2,800 sq.ft',
    category: 'Bespoke Residential',
    palette: 'Neutral Boucle, Travertine Stone, Sheer Belgian Linens, Brushed Gold',
    image: 'assets/images/residential-suite.jpg',
    narrative: `Designed as a sensory respite from Mumbai's bustling pace. Every texture is hand-selected to invoke calm and restorative sleep. The floating custom platform bed with integrated brass details stands against a fluted acoustic feature wall.`
  },
  5: {
    title: 'Monolith Architectural Studio HQ',
    location: 'Lower Parel, Mumbai',
    area: '5,400 sq.ft',
    category: 'Commercial & Workplaces',
    palette: 'Exposed Terrazzo, Smoked Glass, Raw Walnut, Acoustic Felt',
    image: 'assets/images/hospitality-lounge.jpg',
    narrative: `A corporate headquarters that feels more like an art gallery. Designed to nurture collaboration, deep focus, and executive presence with custom task lighting and biophilic interior interventions.`
  },
  6: {
    title: 'The Courtyard Manor',
    location: 'Sadashivnagar, Bengaluru',
    area: '9,800 sq.ft',
    category: 'Heritage Restorations',
    palette: 'Hand-Cut Granite, Antiqued Brass, Silk Upholstery, Teak Rafters',
    image: 'assets/images/heritage-villa.jpg',
    narrative: `A harmonious bridge between traditional Dravidian architecture and Scandinavian minimalism. Every material choice tells a generational story, from heirloom brass vessels repurposed into atmospheric lighting to custom low-slung cane furniture.`
  }
};

function initProjectModal() {
  const modalOverlay = document.getElementById('projectModal');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const projectCards = document.querySelectorAll('.project-card');

  const modalImg = document.getElementById('modalProjectImg');
  const modalCategory = document.getElementById('modalProjectCategory');
  const modalTitle = document.getElementById('modalProjectTitle');
  const modalLocation = document.getElementById('modalProjectLocation');
  const modalArea = document.getElementById('modalProjectArea');
  const modalPalette = document.getElementById('modalProjectPalette');
  const modalNarrative = document.getElementById('modalProjectNarrative');

  projectCards.forEach(card => {
    card.addEventListener('click', () => {
      const id = card.getAttribute('data-id');
      const project = projectsDatabase[id];
      if (!project) return;

      modalImg.src = project.image;
      modalCategory.textContent = project.category;
      modalTitle.textContent = project.title;
      modalLocation.textContent = project.location;
      modalArea.textContent = project.area;
      modalPalette.textContent = project.palette;
      modalNarrative.textContent = project.narrative;

      modalOverlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  function closeModal() {
    modalOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) closeModal();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
      closeModal();
    }
  });
}

/* ==========================================================================
   6. INTERACTIVE STORY & CONSULTATION CALCULATOR
   ========================================================================== */
function initEstimator() {
  const typeInputs = document.querySelectorAll('input[name="spaceType"]');
  const areaSlider = document.getElementById('areaSlider');
  const areaValueDisplay = document.getElementById('areaValueDisplay');
  const moodInputs = document.querySelectorAll('input[name="designMood"]');

  const estTimeline = document.getElementById('estTimeline');
  const estCuration = document.getElementById('estCuration');
  const prefillCtaBtn = document.getElementById('prefillConsultationBtn');

  function calculateEstimate() {
    const area = parseInt(areaSlider.value, 10);
    areaValueDisplay.textContent = `${area.toLocaleString()} sq.ft`;

    let selectedType = 'Residential Penthouse';
    typeInputs.forEach(i => {
      if (i.checked) {
        selectedType = i.value;
        i.closest('.option-pill-label').classList.add('selected');
      } else {
        i.closest('.option-pill-label').classList.remove('selected');
      }
    });

    let selectedMood = 'Warm Minimalist';
    moodInputs.forEach(m => {
      if (m.checked) {
        selectedMood = m.value;
        m.closest('.option-pill-label').classList.add('selected');
      } else {
        m.closest('.option-pill-label').classList.remove('selected');
      }
    });

    // Timeline logic
    let timelineWeeks = 12;
    if (area < 2500) timelineWeeks = 10;
    else if (area < 5000) timelineWeeks = 16;
    else if (area < 8000) timelineWeeks = 22;
    else timelineWeeks = 28;

    estTimeline.textContent = `${timelineWeeks} — ${timelineWeeks + 4} Weeks`;

    // Curation Level
    if (area >= 6000 || selectedMood.includes('Heritage')) {
      estCuration.textContent = 'Haute Bespoke (Master Artisans)';
    } else if (area >= 3000) {
      estCuration.textContent = 'Artisanal Tailored Curation';
    } else {
      estCuration.textContent = 'Signature Studio Collection';
    }
  }

  if (areaSlider) areaSlider.addEventListener('input', calculateEstimate);
  typeInputs.forEach(input => input.addEventListener('change', calculateEstimate));
  moodInputs.forEach(input => input.addEventListener('change', calculateEstimate));

  // Pre-fill CTA to jump directly to Contact Form
  if (prefillCtaBtn) {
    prefillCtaBtn.addEventListener('click', () => {
      const type = document.querySelector('input[name="spaceType"]:checked')?.value || 'Bespoke Residence';
      const area = areaSlider.value;
      const mood = document.querySelector('input[name="designMood"]:checked')?.value || 'Warm Minimalist';

      const messageBox = document.getElementById('contactMessage');
      const projectTypeSelect = document.getElementById('contactProjectType');

      if (messageBox) {
        messageBox.value = `I am interested in designing a ${type} (~${area} sq.ft) with a "${mood}" aesthetic narrative. Please get in touch for a bespoke consultation.`;
      }
      if (projectTypeSelect) {
        projectTypeSelect.value = type.includes('Commercial') ? 'Commercial' : type.includes('Hospitality') ? 'Hospitality' : 'Residential';
      }

      // Smooth scroll to contact
      const contactSec = document.getElementById('contact');
      if (contactSec) {
        contactSec.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  calculateEstimate();
}

/* ==========================================================================
   7. CONTACT FORM HANDLER WITH FEEDBACK TOAST
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('consultationForm');
  const notification = document.getElementById('formNotification');

  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('contactName').value;
    const email = document.getElementById('contactEmail').value;
    const phone = document.getElementById('contactPhone').value;

    if (!name || !email) {
      alert('Please provide your name and email address so Keerthika and our team may connect with you.');
      return;
    }

    // Submit state simulation
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = 'Sending Story to Keerthika...';
    submitBtn.disabled = true;

    setTimeout(() => {
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
      form.reset();

      if (notification) {
        notification.className = 'form-notification success';
        notification.innerHTML = `
          <strong>Thank you, ${name}!</strong> Your narrative has been received. Keerthika will personally review your space's vision and connect with you via ${email} or ${phone || 'phone'} within 24 hours.
        `;
        notification.style.display = 'block';

        setTimeout(() => {
          notification.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 100);
      }
    }, 1200);
  });
}

/* ==========================================================================
   8. SCROLL ANIMATIONS & METRIC COUNTERS
   ========================================================================== */
function initScrollAnimations() {
  const statNumbers = document.querySelectorAll('.hero-stat-number');
  let animated = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !animated) {
        animated = true;
        animateCounters();
      }
    });
  }, { threshold: 0.3 });

  const statsStrip = document.querySelector('.hero-stats-strip');
  if (statsStrip) observer.observe(statsStrip);

  function animateCounters() {
    statNumbers.forEach(stat => {
      const target = parseInt(stat.getAttribute('data-count'), 10);
      const prefix = stat.getAttribute('data-prefix') || '';
      const suffix = stat.getAttribute('data-suffix') || '';
      if (isNaN(target)) return;

      let current = 0;
      const step = Math.ceil(target / 40);
      const timer = setInterval(() => {
        current += step;
        if (current >= target) {
          current = target;
          clearInterval(timer);
        }
        stat.textContent = `${prefix}${current}${suffix}`;
      }, 35);
    });
  }
}
