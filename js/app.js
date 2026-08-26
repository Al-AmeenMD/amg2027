/* ==========================================================================
   BORNO APC 2027 CAMPAIGN - CORE APPLICATION LOGIC
   Navigation, FAQ Accordion, Lightbox Gallery & Election Countdown
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  initStickyHeader();
  initMobileMenu();
  initFAQAccordion();
  initLightbox();
  initCountdown();
});

/* ==========================================================================
   1. Sticky Header & Scrollspy
   ========================================================================== */

function initStickyHeader() {
  const header = document.querySelector(".site-header");
  if (!header) return;

  window.addEventListener("scroll", () => {
    if (window.scrollY > 20) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  });
}

/* ==========================================================================
   2. Mobile Menu Navigation
   ========================================================================== */

function initMobileMenu() {
  const toggleBtn = document.querySelector(".menu-toggle");
  const navMenu = document.querySelector(".nav-menu");

  if (!toggleBtn || !navMenu) return;

  toggleBtn.addEventListener("click", () => {
    navMenu.classList.toggle("open");
    const isOpen = navMenu.classList.contains("open");
    document.body.classList.toggle("nav-open", isOpen);
    toggleBtn.setAttribute("aria-expanded", String(isOpen));
    toggleBtn.innerHTML = isOpen ? "✕" : "☰";
  });

  // Close menu when clicking any nav link
  navMenu.querySelectorAll(".nav-link").forEach(link => {
    link.addEventListener("click", () => {
      navMenu.classList.remove("open");
      document.body.classList.remove("nav-open");
      toggleBtn.setAttribute("aria-expanded", "false");
      toggleBtn.innerHTML = "☰";
    });
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 1120 && navMenu.classList.contains("open")) {
      navMenu.classList.remove("open");
      document.body.classList.remove("nav-open");
      toggleBtn.setAttribute("aria-expanded", "false");
      toggleBtn.innerHTML = "☰";
    }
  });
}

/* ==========================================================================
   3. FAQ Accordion Interaction
   ========================================================================== */

function initFAQAccordion() {
  const faqItems = document.querySelectorAll(".faq-item");

  faqItems.forEach(item => {
    const header = item.querySelector(".faq-header");
    const body = item.querySelector(".faq-body");

    if (!header || !body) return;

    header.addEventListener("click", () => {
      const isActive = item.classList.contains("active");

      // Close all other FAQ items for a clean single-open accordion feel
      faqItems.forEach(otherItem => {
        otherItem.classList.remove("active");
        const otherBody = otherItem.querySelector(".faq-body");
        if (otherBody) otherBody.style.maxHeight = null;
      });

      // Toggle current item
      if (!isActive) {
        item.classList.add("active");
        body.style.maxHeight = body.scrollHeight + "px";
      }
    });
  });
}

/* ==========================================================================
   4. Photo Gallery Lightbox Viewer
   ========================================================================== */

let currentGalleryIndex = 0;
const galleryImages = [];

function initLightbox() {
  const galleryItems = document.querySelectorAll(".gallery-item");
  if (galleryItems.length === 0) return;

  galleryItems.forEach((item, index) => {
    const img = item.querySelector("img");
    const caption = item.querySelector(".gallery-caption")?.textContent || "";
    if (img) {
      galleryImages.push({
        src: img.src,
        caption: caption
      });

      item.addEventListener("click", () => {
        openLightbox(index);
      });
    }
  });

  const lightbox = document.getElementById("galleryLightbox");
  if (!lightbox) return;

  const closeBtn = lightbox.querySelector(".lightbox-close");
  const prevBtn = lightbox.querySelector(".lightbox-prev");
  const nextBtn = lightbox.querySelector(".lightbox-next");

  if (closeBtn) closeBtn.addEventListener("click", closeLightbox);
  if (prevBtn) prevBtn.addEventListener("click", () => navigateLightbox(-1));
  if (nextBtn) nextBtn.addEventListener("click", () => navigateLightbox(1));

  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener("keydown", (e) => {
    if (!lightbox.classList.contains("open")) return;
    if (e.key === "ArrowLeft") navigateLightbox(-1);
    if (e.key === "ArrowRight") navigateLightbox(1);
    if (e.key === "Escape") closeLightbox();
  });
}

function openLightbox(index) {
  const lightbox = document.getElementById("galleryLightbox");
  if (!lightbox || !galleryImages[index]) return;

  currentGalleryIndex = index;
  updateLightboxContent();
  lightbox.classList.add("open");
  document.body.style.overflow = "hidden";
}

function closeLightbox() {
  const lightbox = document.getElementById("galleryLightbox");
  if (!lightbox) return;
  lightbox.classList.remove("open");
  document.body.style.overflow = "";
}

function navigateLightbox(direction) {
  currentGalleryIndex = (currentGalleryIndex + direction + galleryImages.length) % galleryImages.length;
  updateLightboxContent();
}

function updateLightboxContent() {
  const lightboxImg = document.getElementById("lightboxImage");
  const lightboxCap = document.getElementById("lightboxCaption");
  const item = galleryImages[currentGalleryIndex];

  if (lightboxImg && item) {
    lightboxImg.src = item.src;
  }
  if (lightboxCap && item) {
    lightboxCap.textContent = item.caption;
  }
}

/* ==========================================================================
   5. Election Day Countdown (February 27, 2027)
   ========================================================================== */

function initCountdown() {
  const countdownEl = document.getElementById("electionCountdown");
  if (!countdownEl) return;

  // Approximate 2027 General Gubernatorial Election Date
  const targetDate = new Date("2027-02-27T08:00:00+01:00").getTime();

  function update() {
    const now = new Date().getTime();
    const distance = targetDate - now;

    if (distance < 0) {
      countdownEl.textContent = "Election Day is Today!";
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    countdownEl.textContent = `${days} Days ${hours}h to 2027 Polls`;
  }

  update();
  setInterval(update, 60000);
}
