/* Clay deforms when pressed. Driven from pointerdown, not click: click
   on touch fires only after the gesture resolves, which is too late to
   show the deformation. A minimum hold keeps a brief tap visible. */
(function () {
  var PRESSABLE = '[data-squish], .ctl, .nav ul a, .foot__links a';
  var MIN_HOLD = 170;
  document.querySelectorAll(PRESSABLE).forEach(function (el) {
    var at = 0, timer = null;
    function down() { clearTimeout(timer); at = Date.now(); el.classList.add('squish'); }
    function up() {
      var left = Math.max(0, MIN_HOLD - (Date.now() - at));
      clearTimeout(timer);
      timer = setTimeout(function () { el.classList.remove('squish'); }, left);
    }
    el.addEventListener('pointerdown', down);
    el.addEventListener('pointerup', up);
    el.addEventListener('pointercancel', up);
    el.addEventListener('pointerleave', up);
  });
})();
