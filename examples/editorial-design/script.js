// Reading progress: the only motion this style earns. Hidden outright
// (not just frozen at 0%) whenever the page already fits the viewport,
// since a bar with no progress to report is dead furniture.
(function () {
  var bar = document.getElementById("progress");
  if (!bar) return;

  function update() {
    var max = document.documentElement.scrollHeight - window.innerHeight;
    if (max <= 0) {
      bar.hidden = true;
      bar.style.width = "0%";
      return;
    }
    bar.hidden = false;
    var p = Math.min(1, Math.max(0, window.scrollY / max));
    bar.style.width = (p * 100).toFixed(2) + "%";
  }

  update();
  window.addEventListener("scroll", update, { passive: true });
  window.addEventListener("resize", update);
})();
