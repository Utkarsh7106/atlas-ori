// Re-roll every .drawn box's 8 corner-radius values within set ranges
// on each load, so no two boxes -- or two reloads -- ever match. This is
// what keeps the hand-drawn illusion from reading as a repeated template
// (Core Rule 2 / Common Mistakes).
(function () {
  function rand(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function reroll() {
    document.querySelectorAll(".drawn").forEach(function (el) {
      var a = [rand(180, 255), rand(10, 30), rand(180, 255), rand(10, 30)];
      var b = [rand(10, 30), rand(180, 255), rand(10, 30), rand(180, 255)];
      el.style.borderRadius =
        a[0] + "px " + a[1] + "px " + a[2] + "px " + a[3] + "px / " +
        b[0] + "px " + b[1] + "px " + b[2] + "px " + b[3] + "px";
    });
  }

  reroll();
})();
