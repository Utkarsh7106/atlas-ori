// Paint runs differently every time you paint: drips generated per
// load at randomised position/height/width, not a single reused
// graphic. The aerosol burst on the CTA is checked live against
// prefers-reduced-motion at the moment of the click (not just once at
// load), since a 60-particle burst is exactly what that preference
// exists to stop, and Element.animate() ignores the sitewide CSS mute.
(function () {
  var reduce = window.matchMedia
    ? window.matchMedia("(prefers-reduced-motion: reduce)")
    : null;

  document.querySelectorAll("[data-drips]").forEach(function (wrapEl) {
    for (var i = 0; i < 11; i++) {
      var d = document.createElement("i");
      d.style.left = (3 + Math.random() * 44).toFixed(1) + "%";
      d.style.height = (14 + Math.random() * 44).toFixed(0) + "px";
      d.style.width = (6 + Math.random() * 6).toFixed(0) + "px";
      d.style.background = wrapEl.dataset.drips;
      d.style.opacity = (0.65 + Math.random() * 0.35).toFixed(2);
      wrapEl.appendChild(d);
    }
  });

  var colors = ["#12c8ff", "#ffd400", "#ff2f3c", "#a83bff", "#5cff54", "#f2f2ef"];
  var sprayBtn = document.getElementById("spraybtn");
  if (sprayBtn) {
    sprayBtn.addEventListener("click", function (e) {
      e.preventDefault();
      if (reduce && reduce.matches) return;
      var r = this.getBoundingClientRect();
      var ox = r.left + r.width / 2,
        oy = r.top + r.height / 2;
      for (var i = 0; i < 60; i++) {
        var p = document.createElement("span");
        p.className = "aerosol-dot";
        var s = 2 + Math.random() * 7;
        p.style.width = p.style.height = s + "px";
        p.style.background = colors[Math.floor(Math.random() * colors.length)];
        p.style.left = ox + "px";
        p.style.top = oy + "px";
        p.style.opacity = (0.25 + Math.random() * 0.6).toFixed(2);
        document.body.appendChild(p);
        var ang = -Math.PI / 2 + (Math.random() - 0.5) * 1.9;
        var dist = 40 + Math.random() * 190;
        p.animate(
          [
            { transform: "translate(0,0)" },
            {
              transform:
                "translate(" +
                Math.cos(ang) * dist +
                "px," +
                Math.sin(ang) * dist +
                "px)",
              opacity: 0,
            },
          ],
          { duration: 700 + Math.random() * 400, easing: "cubic-bezier(.15,.8,.4,1)" }
        );
        setTimeout(
          (function (n) {
            return function () {
              n.remove();
            };
          })(p),
          1150
        );
      }
    });
  }
})();
