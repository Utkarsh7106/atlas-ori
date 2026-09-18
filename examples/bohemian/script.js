// Macrame: hand-knotted means no two cords the same length. Generated
// with randomized length and per-cord delay so the row ripples rather
// than moving as one block -- a static, pre-authored fringe graphic
// loses that uneven, hand-knotted quality.
(function () {
  var f = document.getElementById("fringe");
  if (!f) return;
  for (var i = 0; i < 48; i++) {
    var cord = document.createElement("i");
    cord.style.height = (18 + Math.random() * 34).toFixed(0) + "px";
    cord.style.animationDelay = (-Math.random() * 4.6).toFixed(2) + "s";
    f.appendChild(cord);
  }
})();
