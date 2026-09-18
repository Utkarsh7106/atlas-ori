// Blocks rise and fade in on intersection, staggered. Motes of light
// drift upward and re-seed themselves so the air is never still.
(function () {
  var items = document.querySelectorAll(".rise");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          if (!e.isIntersecting) return;
          var i = [].indexOf.call(items, e.target);
          // Capped, monotonically non-decreasing rather than a fixed
          // modulo cycle: a %4 cycle (tuned for a 4-wide grid where
          // every 4th item starts a new row anyway) resets to a lower
          // delay for whichever item lands on the next multiple of 4,
          // which visibly desyncs neighboring items on a single-column
          // list longer than four entries.
          setTimeout(function () {
            e.target.classList.add("in");
          }, Math.min(i, 3) * 260);
          io.unobserve(e.target);
        });
      },
      { threshold: 0.1 }
    );
    items.forEach(function (el) {
      io.observe(el);
    });
  } else {
    items.forEach(function (el) {
      el.classList.add("in");
    });
  }

  // Element.animate() ignores the sitewide CSS reduced-motion mute, so
  // this needs its own live check -- skipped outright rather than
  // spawned motionless, since a field of static dots isn't the point.
  var reduce = window.matchMedia
    ? window.matchMedia("(prefers-reduced-motion: reduce)")
    : null;
  if (!reduce || !reduce.matches) {
    for (var i = 0; i < 26; i++) {
      (function (n) {
        var m = document.createElement("span");
        m.className = "mote";
        var size = 2 + Math.random() * 3;
        m.style.width = m.style.height = size + "px";
        m.style.opacity = (0.3 + Math.random() * 0.5).toFixed(2);
        document.body.appendChild(m);

        function seed() {
          m.style.left = Math.random() * 100 + "vw";
          m.style.top = 60 + Math.random() * 50 + "vh";
          var a = m.animate(
            [
              { transform: "translate(0,0)", opacity: 0 },
              { opacity: Number(m.style.opacity), offset: 0.2 },
              {
                transform:
                  "translate(" +
                  (Math.random() * 90 - 45) +
                  "px," +
                  -(60 + Math.random() * 70) +
                  "vh)",
                opacity: 0,
              },
            ],
            { duration: 14000 + Math.random() * 12000, easing: "linear" }
          );
          a.onfinish = seed;
        }
        setTimeout(seed, n * 260);
      })(i);
    }
  }
})();
