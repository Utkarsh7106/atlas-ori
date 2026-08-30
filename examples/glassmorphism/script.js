/* Parallax the orbs so the refraction through the glass moves.
   requestAnimationFrame is not a CSS animation, so it needs its own
   prefers-reduced-motion check -- the loop parks the orbs at rest. */
(function () {
  var reduce = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;
  var orbs = [].slice.call(document.querySelectorAll('.orb'));
  var tx = 0, ty = 0, cx = 0, cy = 0;

  window.addEventListener('pointermove', function (e) {
    if (reduce && reduce.matches) return;
    tx = (e.clientX / window.innerWidth - 0.5) * 2;
    ty = (e.clientY / window.innerHeight - 0.5) * 2;
  });

  (function frame() {
    if (reduce && reduce.matches) {
      orbs.forEach(function (o) { o.style.transform = 'none'; });
      requestAnimationFrame(frame);
      return;
    }
    cx += (tx - cx) * 0.06;
    cy += (ty - cy) * 0.06;
    orbs.forEach(function (o) {
      var d = parseFloat(o.dataset.depth);
      o.style.transform = 'translate(' + (cx * d) + 'px,' + (cy * d) + 'px)';
    });
    requestAnimationFrame(frame);
  })();
})();
