/* ==========================================================================
   Hussain Mohiuddin Ahmed — Portfolio Interactive Controller (script.js)
   Features: Scroll Progress, Reveal on Scroll, Theme Toggle, Mobile Menu,
             Dynamic Typewriter Effect, and Live Form Handling
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  initScrollProgress();
  initThemeEngine();
  initMobileNav();
  initScrollReveal();
  initActiveNavLinks();
  initTypewriter();
  initContactForm();
});

/* --------------------------------------------------------------------------
   1. Scroll Progress Bar
   -------------------------------------------------------------------------- */
function initScrollProgress() {
  const progressBar = document.getElementById("scroll-progress");
  if (!progressBar) return;

  window.addEventListener(
    "scroll",
    () => {
      const totalHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const progress = (window.scrollY / totalHeight) * 100;
        progressBar.style.width = `${progress}%`;
      }
    },
    { passive: true },
  );
}

/* --------------------------------------------------------------------------
   2. Theme Toggle & Persistence
   -------------------------------------------------------------------------- */
function initThemeEngine() {
  const toggleBtn = document.getElementById("theme-toggle");
  const storedTheme = localStorage.getItem("theme");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

  const currentTheme = storedTheme || (prefersDark ? "dark" : "light");
  document.documentElement.setAttribute("data-theme", currentTheme);

  if (toggleBtn) {
    toggleBtn.addEventListener("click", () => {
      const activeTheme = document.documentElement.getAttribute("data-theme");
      const newTheme = activeTheme === "dark" ? "light" : "dark";

      document.documentElement.setAttribute("data-theme", newTheme);
      localStorage.setItem("theme", newTheme);
    });
  }
}

/* --------------------------------------------------------------------------
   3. Mobile Navigation Toggle
   -------------------------------------------------------------------------- */
function initMobileNav() {
  const navToggle = document.getElementById("nav-toggle");
  const navLinks = document.getElementById("nav-links");

  if (!navToggle || !navLinks) return;

  navToggle.addEventListener("click", () => {
    navLinks.classList.toggle("open");
  });

  // Close when clicking an anchor
  navLinks.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("open");
    });
  });
}

/* --------------------------------------------------------------------------
   4. Intersection Observer: Reveal on Scroll
   -------------------------------------------------------------------------- */
function initScrollReveal() {
  const revealElements = document.querySelectorAll(".reveal");
  if (!revealElements.length) return;

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          obs.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: "0px 0px -40px 0px",
    },
  );

  revealElements.forEach((el) => observer.observe(el));
}

/* --------------------------------------------------------------------------
   5. Active Page Link Highlighting
   -------------------------------------------------------------------------- */
function initActiveNavLinks() {
  const currentPath = window.location.pathname.split("/").pop() || "index.html";
  const navLinks = document.querySelectorAll(".nav-link");

  navLinks.forEach((link) => {
    const href = link.getAttribute("href");
    if (href === currentPath || (currentPath === "" && href === "index.html")) {
      link.classList.add("active");
    } else {
      link.classList.remove("active");
    }
  });
}

/* --------------------------------------------------------------------------
   6. Typewriter Effect for Hero
   -------------------------------------------------------------------------- */
function initTypewriter() {
  const element = document.getElementById("typewriter-text");
  if (!element) return;

  const words = [
    "Machine Learning & NLP Pipelines.",
    "Deep Neural Architectures.",
    "Visual Authentication Systems.",
    "Generative AI & LLM Workflows.",
  ];

  let wordIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  const typeSpeed = 70;
  const deleteSpeed = 35;
  const pauseDuration = 1800;

  function type() {
    const currentWord = words[wordIndex];

    if (isDeleting) {
      element.textContent = currentWord.substring(0, charIndex - 1);
      charIndex--;
    } else {
      element.textContent = currentWord.substring(0, charIndex + 1);
      charIndex++;
    }

    if (!isDeleting && charIndex === currentWord.length) {
      isDeleting = true;
      setTimeout(type, pauseDuration);
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      wordIndex = (wordIndex + 1) % words.length;
      setTimeout(type, 300);
    } else {
      setTimeout(type, isDeleting ? deleteSpeed : typeSpeed);
    }
  }

  type();
}

/* --------------------------------------------------------------------------
   7. Contact Form Handler 
   -------------------------------------------------------------------------- */

function initContactForm() {
  const form = document.getElementById("contact-form");
  const status = document.getElementById("form-status");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    const originalText = btn.innerHTML;
    const formData = new FormData(form);

    btn.disabled = true;
    btn.innerHTML =
      '<i class="fa-solid fa-spinner fa-spin"></i> Transmitting...';

    try {
      const response = await fetch(form.action, {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json",
        },
      });

      if (response.ok) {
        form.reset();
        if (status) {
          status.textContent =
            "Message sent successfully! I'll get back to you shortly.";
          status.style.color = "var(--color-primary)";
        }
      } else {
        const errorData = await response.json();
        if (status) {
          status.textContent = errorData.errors
            ? errorData.errors.map((err) => err.message).join(", ")
            : "Oops! There was a problem submitting your form.";
          status.style.color = "var(--color-danger)";
        }
      }
    } catch (error) {
      if (status) {
        status.textContent =
          "Network error. Please try again or email me directly.";
        status.style.color = "var(--color-danger)";
      }
    } finally {
      btn.disabled = false;
      btn.innerHTML = originalText;
      setTimeout(() => {
        if (status) status.textContent = "";
      }, 6000);
    }
  });
}
