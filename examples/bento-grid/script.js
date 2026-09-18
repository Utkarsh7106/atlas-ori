/* Pointer-tracked spotlight per tile + bar-chart intro (scaleY, not
   height, so it never reflows the grid). The intro is script-driven,
   so it needs its own prefers-reduced-motion check. */
(function () {
  document.querySelectorAll('.tile').forEach(function (tile) {
    tile.addEventListener('pointermove', function (e) {
      var r = tile.getBoundingClientRect();
      tile.style.setProperty('--mx', ((e.clientX - r.left) / r.width * 100) + '%');
      tile.style.setProperty('--my', ((e.clientY - r.top) / r.height * 100) + '%');
    });
  });

  var reduce = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;
  var barsBox = document.querySelector('.t-stat .bars');
  if (barsBox) {
    var bars = barsBox.querySelectorAll('i');
    if (reduce && reduce.matches) {
      bars.forEach(function (b) { b.style.transform = 'scaleY(1)'; });
    } else {
      bars.forEach(function (b) {
        b.style.transformOrigin = 'bottom';
        b.style.transform = 'scaleY(0)';
        b.style.transition = 'transform .5s cubic-bezier(.2,.8,.3,1)';
      });
      requestAnimationFrame(function () {
        bars.forEach(function (b, i) {
          setTimeout(function () { b.style.transform = 'scaleY(1)'; }, 180 + i * 60);
        });
      });
    }
  }
})();
