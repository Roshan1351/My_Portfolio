/* ==========================================================
   Roshan's Portfolio - script.js
   Features:
   1. Mobile hamburger menu toggle
   2. Scrollspy - highlight active nav link on scroll
   3. Scroll-reveal fade-in animations (Intersection Observer)
   4. Rotating typing effect for role title
   5. Animated count-up for achievement stats
   6. Certificate image lightbox (click to enlarge)
   7. Back-to-top button
   8. Copy email to clipboard with toast notification
   ========================================================== */

document.addEventListener("DOMContentLoaded", function () {

  /* ---------- 1. Hamburger menu toggle ---------- */
  const hamburger = document.getElementById("hamburger");
  const navLinks = document.getElementById("navLinks");

  if (hamburger && navLinks) {
    hamburger.addEventListener("click", function () {
      const isOpen = navLinks.classList.toggle("open");
      hamburger.classList.toggle("open", isOpen);
      hamburger.setAttribute("aria-expanded", isOpen);
    });

    // Close the mobile menu after a link is clicked
    navLinks.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        navLinks.classList.remove("open");
        hamburger.classList.remove("open");
        hamburger.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ---------- 2. Scrollspy: highlight active nav link ---------- */
  const sections = document.querySelectorAll("section[id]");
  const navItems = document.querySelectorAll(".nav-item");

  function setActiveLink() {
    let currentId = "";
    const scrollPos = window.scrollY + 120; // offset for sticky navbar

    sections.forEach(function (section) {
      if (scrollPos >= section.offsetTop) {
        currentId = section.id;
      }
    });

    navItems.forEach(function (link) {
      link.classList.remove("active");
      if (link.getAttribute("href") === "#" + currentId) {
        link.classList.add("active");
      }
    });
  }

  window.addEventListener("scroll", setActiveLink);
  setActiveLink();

  /* ---------- 3. Scroll-reveal animations ---------- */
  const revealEls = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      function (entries, observer) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("active");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );

    revealEls.forEach(function (el) {
      revealObserver.observe(el);
    });
  } else {
    // Fallback: just show everything
    revealEls.forEach(function (el) {
      el.classList.add("active");
    });
  }

  /* ---------- 4. Rotating typing effect for role title ---------- */
  const roles = [
    "Java Backend Developer",
    "Spring Boot Developer",
    "DSA Enthusiast (400+ Problems)",
    "Aspiring Software Engineer"
  ];
  const typedEl = document.getElementById("typedRole");
  let roleIndex = 0;
  let charIndex = 0;
  let deleting = false;

  function typeLoop() {
    if (!typedEl) return;
    const currentRole = roles[roleIndex];

    if (!deleting) {
      charIndex++;
      typedEl.textContent = currentRole.substring(0, charIndex);
      if (charIndex === currentRole.length) {
        deleting = true;
        setTimeout(typeLoop, 1400); // pause before deleting
        return;
      }
    } else {
      charIndex--;
      typedEl.textContent = currentRole.substring(0, charIndex);
      if (charIndex === 0) {
        deleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
      }
    }

    const speed = deleting ? 45 : 90;
    setTimeout(typeLoop, speed);
  }

  if (typedEl) {
    typedEl.textContent = "";
    typeLoop();
  }

  /* ---------- 5. Animated count-up for achievement stats ---------- */
  const counters = document.querySelectorAll(".counter");

  function animateCounter(el) {
    const target = parseInt(el.getAttribute("data-target"), 10) || 0;
    const suffix = el.getAttribute("data-suffix") || "";
    const duration = 1500;
    const startTime = performance.now();

    function update(now) {
      const progress = Math.min((now - startTime) / duration, 1);
      const value = Math.floor(progress * target);
      el.textContent = value + suffix;
      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        el.textContent = target + suffix;
      }
    }
    requestAnimationFrame(update);
  }

  if ("IntersectionObserver" in window && counters.length) {
    const counterObserver = new IntersectionObserver(
      function (entries, observer) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    counters.forEach(function (el) {
      counterObserver.observe(el);
    });
  }

  /* ---------- 6. Certificate lightbox ---------- */
  const lightboxModal = document.getElementById("lightboxModal");
  const lightboxImage = document.getElementById("lightboxImage");
  const lightboxClose = document.getElementById("lightboxClose");
  const lightboxImgs = document.querySelectorAll(".lightbox-img");

  lightboxImgs.forEach(function (img) {
    img.addEventListener("click", function () {
      lightboxImage.src = img.src;
      lightboxModal.classList.add("open");
    });
  });

  function closeLightbox() {
    lightboxModal.classList.remove("open");
    lightboxImage.src = "";
  }

  if (lightboxClose) {
    lightboxClose.addEventListener("click", closeLightbox);
  }
  if (lightboxModal) {
    lightboxModal.addEventListener("click", function (e) {
      if (e.target === lightboxModal) closeLightbox();
    });
  }
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeLightbox();
  });

  /* ---------- 7. Back-to-top button ---------- */
  const backToTopBtn = document.getElementById("backToTop");

  window.addEventListener("scroll", function () {
    if (backToTopBtn) {
      backToTopBtn.classList.toggle("show", window.scrollY > 400);
    }
  });

  if (backToTopBtn) {
    backToTopBtn.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* ---------- 8. Copy email to clipboard ---------- */
  const copyEmailBtn = document.getElementById("copyEmailBtn");
  const toast = document.getElementById("toast");

  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("show");
    setTimeout(function () {
      toast.classList.remove("show");
    }, 2200);
  }

  if (copyEmailBtn) {
    copyEmailBtn.addEventListener("click", function () {
      const email = copyEmailBtn.getAttribute("data-email");
      if (navigator.clipboard) {
        navigator.clipboard
          .writeText(email)
          .then(function () {
            showToast("Email copied to clipboard!");
          })
          .catch(function () {
            showToast("Could not copy email.");
          });
      } else {
        showToast("Copy not supported on this browser.");
      }
    });
  }

});