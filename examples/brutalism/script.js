/* A live status line and a blinking cursor -- information, not
   decoration. The cursor is a setInterval, not a CSS animation, so a
   sitewide reduced-motion rule can't reach it: guarded here directly,
   left solid (not blinking) when the preference is set, per WCAG 2.2.2. */
(function () {
  var reduce = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;
  var c = document.getElementById('cursor');
  if (c) {
    setInterval(function () {
      if (reduce && reduce.matches) { c.style.visibility = 'visible'; return; }
      c.style.visibility = c.style.visibility === 'hidden' ? 'visible' : 'hidden';
    }, 600);
  }

  var meta = document.getElementById('meta');
  if (meta) {
    function write() {
      meta.textContent = 'viewport: ' + window.innerWidth + 'x' + window.innerHeight +
        ' | dpr: ' + window.devicePixelRatio +
        ' | loaded: ' + new Date().toISOString();
    }
    write();
    window.addEventListener('resize', write);
  }
})();
