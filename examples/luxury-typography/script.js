// Split the hero headline into per-word spans and reveal them in
// sequence -- the line assembles itself instead of just appearing.
// Driven by a single class toggle per word so a CSS transition does the
// animating; prefers-reduced-motion (see style.css) collapses that
// transition to near-zero for free, with no separate script-side guard.
(function () {
  var h = document.getElementById("headline");
  if (!h) return;
  var nodes = [].slice.call(h.childNodes);
  h.textContent = "";

  nodes.forEach(function (node) {
    var isEm = node.nodeType === 1 && node.tagName === "EM";
    var text = node.textContent;
    text.split(/(\s+)/).forEach(function (chunk) {
      if (!chunk) return;
      if (/^\s+$/.test(chunk)) {
        h.appendChild(document.createTextNode(" "));
        return;
      }
      var span = document.createElement(isEm ? "em" : "span");
      span.className = "word";
      span.textContent = chunk;
      h.appendChild(span);
    });
  });

  var words = h.querySelectorAll(".word");
  words.forEach(function (w, i) {
    setTimeout(function () {
      w.classList.add("in");
    }, 120 + i * 90);
  });
})();
