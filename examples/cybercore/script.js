// Decode the headline on load, then fire a channel-split glitch burst
// at irregular intervals. Neither loop is a CSS animation -- the
// decode is a setInterval text rewrite, the glitch is a repeating
// class toggle -- so a CSS-level reduced-motion mute can't reach
// either; both are checked explicitly and skipped outright, landing
// straight on the final, still headline.
(function () {
  var reduce = window.matchMedia
    ? window.matchMedia("(prefers-reduced-motion: reduce)")
    : null;
  var h = document.getElementById("headline");
  if (!h) return;
  var final = h.dataset.text;

  if (reduce && reduce.matches) {
    h.textContent = final;
    return;
  }

  var glyphs = "#$%&@01ABCDEF/\\|<>";
  var frame = 0;
  var total = 34;

  var decode = setInterval(function () {
    frame++;
    var shown = Math.floor((frame / total) * final.length);
    var out = "";
    for (var i = 0; i < final.length; i++) {
      if (i < shown || final[i] === " ") out += final[i];
      else out += glyphs[Math.floor(Math.random() * glyphs.length)];
    }
    h.textContent = out;
    if (frame >= total) {
      clearInterval(decode);
      h.textContent = final;
    }
  }, 26);

  (function glitch() {
    setTimeout(function () {
      h.classList.add("glitching");
      setTimeout(function () {
        h.classList.remove("glitching");
      }, 700);
      glitch();
    }, 2600 + Math.random() * 3400);
  })();
})();
