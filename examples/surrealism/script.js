/* Three disobediences, only where they appear on a given page: the eye
   watches, the button flees (clamped + capped + skipped under reduced
   motion), the CTA heading melts on hover. */
(function () {
  var reduce = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;

  var iris = document.getElementById('iris');
  var eye = iris ? iris.parentElement : null;
  if (eye) {
    window.addEventListener('pointermove', function (e) {
      if (reduce && reduce.matches) return;
      var r = eye.getBoundingClientRect();
      var dx = e.clientX - (r.left + r.width / 2);
      var dy = e.clientY - (r.top + r.height / 2);
      var a = Math.atan2(dy, dx);
      var d = Math.min(10, Math.hypot(dx, dy) / 16);
      iris.style.transform = 'translate(' + Math.cos(a) * d + 'px,' + Math.sin(a) * d + 'px)';
    });
  }

  /* Clamped to its own container, capped at 3 dodges, skipped outright
     (not just faster) under reduced motion, and untriggered by touch
     since a tap never fires the pointermove this listens for. */
  var btn = document.getElementById('flee-btn');
  if (btn) {
    var btnHome = btn.closest('.hero') || btn.parentElement;
    var dodges = 0, MAX_DODGES = 3, settled = false, nearby = false, baseRect = null;

    function measureBase() {
      var t = btn.style.transform;
      btn.style.transform = 'none';
      baseRect = btn.getBoundingClientRect();
      btn.style.transform = t;
    }
    measureBase();
    window.addEventListener('resize', measureBase);

    function settle() { settled = true; btn.style.transform = 'translate(0,0)'; }

    window.addEventListener('pointermove', function (e) {
      if (settled || (reduce && reduce.matches)) return;
      var r = btn.getBoundingClientRect();
      var cx = r.left + r.width / 2, cy = r.top + r.height / 2;
      var dist = Math.hypot(e.clientX - cx, e.clientY - cy);
      if (dist < 130) {
        if (!nearby) {
          nearby = true;
          dodges++;
          if (dodges > MAX_DODGES) { settle(); return; }
        }
        var a = Math.atan2(cy - e.clientY, cx - e.clientX);
        var tx = Math.cos(a) * 90, ty = Math.sin(a) * 60;
        var home = btnHome.getBoundingClientRect();
        var margin = 10;
        var minTx = home.left + margin - baseRect.left;
        var maxTx = home.right - margin - baseRect.right;
        var minTy = home.top + margin - baseRect.top;
        var maxTy = home.bottom - margin - baseRect.bottom;
        tx = Math.max(minTx, Math.min(maxTx, tx));
        ty = Math.max(minTy, Math.min(maxTy, ty));
        btn.style.transform = 'translate(' + tx + 'px,' + ty + 'px)';
      } else if (dist > 240) {
        nearby = false;
        btn.style.transform = 'translate(0,0)';
      }
    });
  }

  var melt = document.getElementById('melt');
  if (melt) {
    var text = melt.textContent;
    melt.textContent = '';
    /* NBSP ( ), not a literal space -- a plain " " as the SOLE
       content of an inline-block span rendered at 0 width here
       (confirmed via getBoundingClientRect: 0px vs ~20px for a normal
       space in running text). A non-breaking space is never subject
       to CSS whitespace collapsing, so it reliably holds its width. */
    text.split('').forEach(function (ch, i) {
      var s = document.createElement('span');
      s.textContent = ch === ' ' ? ' ' : ch;
      s.style.transition = 'transform .7s cubic-bezier(.2,.7,.3,1) ' + (i * 40) + 'ms';
      melt.appendChild(s);
    });
    var spans = melt.querySelectorAll('span');
    melt.addEventListener('pointerenter', function () {
      if (reduce && reduce.matches) return;
      spans.forEach(function (s, i) {
        s.style.transform = 'scaleY(' + (1.4 + (i % 4) * 0.18) + ') translateY(' + (6 + (i % 5) * 5) + 'px)';
      });
    });
    melt.addEventListener('pointerleave', function () {
      spans.forEach(function (s) { s.style.transform = 'none'; });
    });
  }
})();
