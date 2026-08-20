/* ==========================================================================
   partials.js
   The site header and footer live here ONCE. Each page just drops an empty
   <header id="site-header"> / <footer id="site-footer"> placeholder and
   calls renderHeader('page-id') / renderFooter() to fill it in.

   Edit the nav links, logo, or footer text here and it updates everywhere.
   ========================================================================== */

var SITE_PAGES = [
  { id: "home", href: "index.html", label: "Home" },
  { id: "about", href: "about.html", label: "About" },
  { id: "projects", href: "projects.html", label: "Projects" },
  { id: "experience", href: "experience.html", label: "Experience" },
  { id: "certificates", href: "certificates.html", label: "Certificates" },
  { id: "contact", href: "contact.html", label: "Contact" },
];

function renderHeader(activePageId) {
  var target = document.getElementById("site-header");
  if (!target) return;

  var linksHtml = SITE_PAGES.map(function (page) {
    var activeClass = page.id === activePageId ? " active" : "";
    return (
      '<li><a href="' + page.href + '" class="nav-link' + activeClass + '">' +
      page.label +
      "</a></li>"
    );
  }).join("");

  target.innerHTML =
    '<nav class="nav container">' +
      '<a href="index.html" class="nav-logo">' +
        '<span class="nav-logo-bracket">&lt;</span>Hussain<span class="nav-logo-bracket">/&gt;</span>' +
      "</a>" +
      '<ul class="nav-links" id="navLinks">' + linksHtml + "</ul>" +
      '<div class="nav-actions">' +
        '<button class="theme-toggle" id="themeToggle" role="switch" aria-checked="false" aria-label="Toggle dark mode">' +
          '<span class="theme-toggle-knob">🌙</span>' +
        "</button>" +
        '<button class="nav-toggle" id="navToggle" aria-label="Toggle navigation menu" aria-expanded="false">' +
          "<span></span><span></span><span></span>" +
        "</button>" +
      "</div>" +
    "</nav>";
}

function renderFooter() {
  var target = document.getElementById("site-footer");
  if (!target) return;

  target.innerHTML =
    '<div class="container footer-inner">' +
      "<p>&copy; <span id=\"year\"></span> Hussain Mohiuddin Ahmed. All rights reserved.</p>" +
      '<a href="#main" class="footer-top">Back to top ↑</a>' +
    "</div>";
}
