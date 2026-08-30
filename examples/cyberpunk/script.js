// Meters fill on approach; the hero status line keeps talking, both
// gated behind their own live prefers-reduced-motion checks since
// neither an IntersectionObserver-driven width write nor a
// setInterval-driven content rewrite is reachable by a CSS-level mute.
(function () {
  var meters = document.querySelectorAll(".meter i");
  var reduce = window.matchMedia
    ? window.matchMedia("(prefers-reduced-motion: reduce)")
    : null;

  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(
      function (es) {
        es.forEach(function (e) {
          if (e.isIntersecting) {
            e.target.style.width = e.target.dataset.w;
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.4 }
    );
    meters.forEach(function (m) {
      io.observe(m);
    });
  } else {
    meters.forEach(function (m) {
      m.style.width = m.dataset.w;
    });
  }

  // The status line has no completion state -- it cycles forever -- so
  // under reduced motion it never starts at all rather than running
  // once and stopping.
  var line = document.getElementById("status-line");
  if (line && (!reduce || !reduce.matches)) {
    var lines = [
      "UPLINK 61% // TRACE ACTIVE // SECTOR-3",
      "ICE DETECTED // REROUTING // SECTOR-9",
      "CLIENT VERIFIED // JOB QUEUE: 4",
      "RAIN 06MM/H // AMBIENT 09C // NIGHT",
      "BLACKWALL STABLE // NO INTRUSION",
    ];
    var i = 0;
    setInterval(function () {
      i = (i + 1) % lines.length;
      line.textContent = lines[i];
    }, 2400);
  }
})();
