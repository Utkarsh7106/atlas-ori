/* Confetti burst on primary CTA clicks. Web Animations API, not CSS, so
   it needs its own prefers-reduced-motion check -- a sitewide CSS rule
   cannot reach into a script-driven animation. */
(function () {
  var reduce = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;
  function motionOK() { return !(reduce && reduce.matches); }

  var colors = ['#ff2d95', '#ffe600', '#00e5ff', '#6a00f4', '#b6ff00', '#ffffff'];
  function burst(x, y) {
    for (var i = 0; i < 18; i++) {
      var bit = document.createElement('i');
      bit.className = 'bit';
      bit.style.background = colors[i % colors.length];
      bit.style.left = x + 'px';
      bit.style.top = y + 'px';
      bit.style.borderRadius = i % 3 === 0 ? '50%' : '2px';
      document.body.appendChild(bit);
      var dx = (Math.random() - 0.5) * 380;
      var dy = -(120 + Math.random() * 260);
      bit.animate(
        [
          { transform: 'translate(0,0) rotate(0deg)', opacity: 1 },
          { transform: 'translate(' + dx + 'px,' + (dy + 460) + 'px) rotate(' + (Math.random() * 900 - 450) + 'deg)', opacity: 0 }
        ],
        { duration: 1100 + Math.random() * 400, easing: 'cubic-bezier(.2,.7,.5,1)' }
      );
      setTimeout(function (n) { return function () { n.remove(); }; }(bit), 1500);
    }
  }
  document.querySelectorAll('a.btn, .cta .cta-btn').forEach(function (el) {
    el.addEventListener('click', function () {
      if (!motionOK()) { return; }
      var r = el.getBoundingClientRect();
      burst(r.left + r.width / 2, r.top + r.height / 2);
    });
  });
})();
