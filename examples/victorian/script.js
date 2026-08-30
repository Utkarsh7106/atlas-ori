// Gaslight: the gilt fleurons burn rather than print. The interval
// floor (700-1400ms) and the shallow opacity dip (0.85-1) are fixed
// safety values, not aesthetic ones -- a faster, deeper version is a
// documented photosensitive-seizure risk on the reference page this
// skill was built from. The loop stops outright (not just invisibly)
// while the tab is hidden, and is skipped entirely under
// prefers-reduced-motion.
(function () {
  var reduce = window.matchMedia
    ? window.matchMedia("(prefers-reduced-motion: reduce)")
    : null;
  if (reduce && reduce.matches) return;

  document.querySelectorAll(".lamp").forEach(function (el) {
    var timer = null;
    function tick() {
      if (document.hidden) return; // resumes via visibilitychange
      var deep = Math.random() < 0.18;
      el.style.opacity = deep
        ? (0.85 + Math.random() * 0.09).toFixed(2)
        : (0.94 + Math.random() * 0.06).toFixed(2);
      timer = setTimeout(tick, 700 + Math.random() * 700);
    }
    document.addEventListener("visibilitychange", function () {
      if (!document.hidden && !timer) tick();
      if (document.hidden && timer) {
        clearTimeout(timer);
        timer = null;
      }
    });
    tick();
  });
})();
