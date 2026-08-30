/* Count the hero badge number up on load -- requestAnimationFrame, not
   CSS, so it needs its own prefers-reduced-motion check: the final
   figure is written immediately rather than counting up. */
(function () {
  var el = document.getElementById('count');
  if (!el) return;
  var target = parseInt(el.getAttribute('data-target'), 10) || 0;
  var reduce = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;
  function render(n) { el.textContent = String(n).padStart(2, '0'); }
  if (reduce && reduce.matches) { render(target); return; }
  var start = null;
  function step(ts) {
    if (!start) start = ts;
    var p = Math.min((ts - start) / 900, 1);
    render(Math.round(p * target));
    if (p < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
})();

/* Press feedback that survives a touch tap: Chromium withholds :active
   on touch until it knows the gesture isn't a scroll, so a fast tap
   never renders the depress with CSS alone. */
(function () {
  var PRESSABLE = '.btn, .cta .cta-btn, .nav ul a, .site-footer__links a';
  var MIN_HOLD = 140;
  document.querySelectorAll(PRESSABLE).forEach(function (el) {
    var at = 0, timer = null;
    function down() {
      clearTimeout(timer);
      at = Date.now();
      el.classList.add('is-pressed');
    }
    function up() {
      var left = Math.max(0, MIN_HOLD - (Date.now() - at));
      clearTimeout(timer);
      timer = setTimeout(function () { el.classList.remove('is-pressed'); }, left);
    }
    el.addEventListener('pointerdown', down);
    el.addEventListener('pointerup', up);
    el.addEventListener('pointercancel', up);
    el.addEventListener('pointerleave', up);
  });
})();
