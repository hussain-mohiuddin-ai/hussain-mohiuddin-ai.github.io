/* ==========================================================================
   theme-init.js
   Applies the saved (or OS-preferred) theme BEFORE first paint, so there's
   no light/dark flash. Must be loaded synchronously in <head>, before the
   stylesheet, on every page.
   ========================================================================== */
(function () {
  try {
    var saved = localStorage.getItem("theme");
    var prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    if (saved === "dark" || (!saved && prefersDark)) {
      document.documentElement.setAttribute("data-theme", "dark");
    }
  } catch (e) {
    /* localStorage unavailable (e.g. privacy mode) — default to light */
  }
})();
