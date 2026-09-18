// Everything arrives slowly, and only once. Deliberately NOT behind a
// matchMedia guard: this observer does not animate anything itself --
// one class write per block, then it unobserves. The motion is the CSS
// transition on .fade, which the sitewide reduced-motion rule already
// collapses to near-zero. Guarding the observer away would not remove
// motion; it would leave every block stranded at opacity:0.
(function () {
  var items = document.querySelectorAll(".fade");
  if (!("IntersectionObserver" in window)) {
    items.forEach(function (el) {
      el.classList.add("in");
    });
    return;
  }
  var io = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        var i = [].indexOf.call(items, e.target);
        setTimeout(function () {
          e.target.classList.add("in");
        }, (i % 4) * 220);
        io.unobserve(e.target);
      });
    },
    { threshold: 0.12 }
  );
  items.forEach(function (el) {
    io.observe(el);
  });
})();

// Press feedback that survives a touch tap: the pressed state applies
// immediately and is held for a minimum duration, since a finger lifts
// long before this page's slow 1.1-2.4s eases would otherwise resolve.
(function () {
  var PRESSABLE = ".btn";
  var MIN_HOLD = 160;
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
