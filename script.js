/* ==========================================================================
   Hussain Mohiuddin Ahmed — Portfolio Scripts (shared across all pages)
   Handles: theme toggle, mobile nav, scroll reveals, contact form, footer year.
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {

  /* ---------- Footer year ---------- */
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Theme toggle (light / dark) ----------
     Initial theme is already applied by the inline script in <head>
     (before paint, to avoid a flash). This just wires up the switch. */
  const themeToggle = document.getElementById("themeToggle");

  const applyTheme = (theme) => {
    if (theme === "dark") {
      document.documentElement.setAttribute("data-theme", "dark");
    } else {
      document.documentElement.removeAttribute("data-theme");
    }
    if (themeToggle) themeToggle.setAttribute("aria-checked", String(theme === "dark"));
  };

  if (themeToggle) {
    // Reflect current state on load
    const current = document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";
    themeToggle.setAttribute("aria-checked", String(current === "dark"));

    themeToggle.addEventListener("click", () => {
      const isDark = document.documentElement.getAttribute("data-theme") === "dark";
      const next = isDark ? "light" : "dark";
      applyTheme(next);
      try { localStorage.setItem("theme", next); } catch (e) { /* storage unavailable */ }
    });
  }

  /* ---------- Mobile nav toggle ---------- */
  const navToggle = document.getElementById("navToggle");
  const navLinks = document.getElementById("navLinks");

  if (navToggle && navLinks) {
    navToggle.addEventListener("click", () => {
      const isOpen = navLinks.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
    });

    navLinks.querySelectorAll(".nav-link").forEach((link) => {
      link.addEventListener("click", () => {
        navLinks.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ---------- Reveal-on-scroll for cards/sections ---------- */
  const revealTargets = document.querySelectorAll(
    ".project-card, .cert-card, .timeline-item, .about-grid, .contact-grid, .about-teaser"
  );
  revealTargets.forEach((el) => el.classList.add("reveal"));

  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    revealTargets.forEach((el) => revealObserver.observe(el));
  } else {
    revealTargets.forEach((el) => el.classList.add("is-visible"));
  }

  /* ---------- Contact form (front-end only placeholder) ----------
     No backend is wired up yet. Swap the fetch() call below for your
     own endpoint (e.g. Formspree, a serverless function, EmailJS, etc.)
     when you're ready to receive real submissions. */
  const contactForm = document.getElementById("contactForm");
  const formStatus = document.getElementById("formStatus");

  if (contactForm) {
    contactForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const name = contactForm.name.value.trim();
      const email = contactForm.email.value.trim();
      const message = contactForm.message.value.trim();

      if (!name || !email || !message) {
        formStatus.textContent = "Please fill in every field before sending.";
        return;
      }

      // --- Placeholder "send" behaviour ---
      // Replace this block with a real request once a backend/service is connected:
      //
      // fetch("https://your-endpoint.example.com/contact", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ name, email, message }),
      // })
      //   .then(() => { formStatus.textContent = "Message sent — thanks!"; contactForm.reset(); })
      //   .catch(() => { formStatus.textContent = "Something went wrong. Please try again."; });

      formStatus.textContent = `Thanks, ${name} — this form isn't wired to a backend yet, but your message was captured locally.`;
      contactForm.reset();
    });
  }

});
