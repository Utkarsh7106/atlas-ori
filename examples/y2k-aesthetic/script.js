// Cursor sparkle trail -- the single most Y2K interaction there is.
// Element.animate() ignores the sitewide CSS reduced-motion mute (that
// only touches CSS animation/transition durations), so this needs its
// own live prefers-reduced-motion check.
(function () {
  var reduce = window.matchMedia
    ? window.matchMedia("(prefers-reduced-motion: reduce)")
    : null;
  var last = 0,
    live = 0;
  var glyphs = ["✦", "✧", "✶"];

  function drop(x, y) {
    if (live > 26) return;
    live++;
    var s = document.createElement("span");
    s.className = "spark";
    s.textContent = glyphs[Math.floor(Math.random() * glyphs.length)];
    s.style.left = x - 6 + "px";
    s.style.top = y - 6 + "px";
    document.body.appendChild(s);

    s.animate(
      [
        { transform: "scale(.3) rotate(0deg)", opacity: 1 },
        { transform: "scale(1.25) rotate(140deg) translateY(-22px)", opacity: 0 },
      ],
      { duration: 700, easing: "ease-out" }
    );
    setTimeout(function () {
      s.remove();
      live--;
    }, 720);
  }

  window.addEventListener("pointermove", function (e) {
    if (reduce && reduce.matches) return;
    var now = Date.now();
    if (now - last < 45) return;
    last = now;
    drop(e.clientX, e.clientY);
  });

  // A mouse gets the trail for free from pointermove; a tap never
  // generates a meaningful move sequence, so give touch an equivalent
  // fixed burst at the tap point instead.
  window.addEventListener("pointerdown", function (e) {
    if (e.pointerType !== "touch" || (reduce && reduce.matches)) return;
    for (var i = 0; i < 5; i++) {
      var a = (i / 5) * Math.PI * 2;
      drop(e.clientX + Math.cos(a) * 14, e.clientY + Math.sin(a) * 14);
    }
  });
})();
