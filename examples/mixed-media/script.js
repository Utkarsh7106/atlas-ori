// Misregistration on hover; re-paste the ransom note on click. Both
// are one-shot writes on a discrete event -- no lerp, no
// requestAnimationFrame -- so neither keeps moving after input stops
// and neither needs a matchMedia guard; the CSS steps() that carry
// them are muted by the sitewide reduced-motion rule. The plate a
// hover moves is a decorative, aria-hidden layer -- no real type is
// ever displaced.
(function () {
  document.querySelectorAll(".card, .zine").forEach(function (card) {
    var plate = card.querySelector(".wash");
    if (!plate) return;
    card.addEventListener("pointerenter", function () {
      var x = (Math.random() * 12 - 6).toFixed(1);
      var y = (Math.random() * 12 - 6).toFixed(1);
      plate.style.transform = "translate(" + x + "px," + y + "px)";
    });
    card.addEventListener("pointerleave", function () {
      plate.style.transform = "none";
    });
  });

  var words = document.querySelectorAll(".hero h1 .w");
  var shuffleBtn = document.getElementById("shufflebtn");
  if (shuffleBtn) {
    shuffleBtn.addEventListener("click", function (e) {
      e.preventDefault();
      words.forEach(function (w) {
        w.style.rotate = (Math.random() * 6 - 3).toFixed(2) + "deg";
      });
    });
  }
})();

// Press feedback that survives a touch tap.
(function () {
  var PRESSABLE = ".btn";
  var MIN_HOLD = 150;
  document.querySelectorAll(PRESSABLE).forEach(function (el) {
    var at = 0,
      timer = null;
    function down() {
      clearTimeout(timer);
      at = Date.now();
      el.classList.add("is-pressed");
    }
    function up() {
      var left = Math.max(0, MIN_HOLD - (Date.now() - at));
      clearTimeout(timer);
      timer = setTimeout(function () {
        el.classList.remove("is-pressed");
      }, left);
    }
    el.addEventListener("pointerdown", down);
    el.addEventListener("pointerup", up);
    el.addEventListener("pointercancel", up);
    el.addEventListener("pointerleave", up);
  });
})();
