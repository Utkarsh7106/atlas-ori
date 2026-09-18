// One light source in a dark nave. Written straight from the pointer
// with no lerp, no requestAnimationFrame and no easing, so it never
// moves on its own once input stops -- direct manipulation, not
// motion, so it needs no reduced-motion guard (unlike a damped/eased
// version of the same effect would).
(function () {
  var torch = document.getElementById("torch");
  if (!torch) return;
  window.addEventListener("pointermove", function (e) {
    torch.style.setProperty("--tx", e.clientX + "px");
    torch.style.setProperty("--ty", e.clientY + "px");
  });
})();

// Press feedback that survives a touch tap: hold the pressed state for
// a minimum duration so even a very fast tap is visibly answered.
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
