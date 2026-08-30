// Characters are alive when nobody is looking at them: independent,
// randomized blink timers so faces never blink in unison. setTimeout is
// not a CSS animation, so the sitewide reduced-motion rule can't reach
// it -- guarded here with a live matchMedia check.
(function () {
  var reduce = window.matchMedia
    ? window.matchMedia("(prefers-reduced-motion: reduce)")
    : null;

  document.querySelectorAll("[data-face]").forEach(function (face) {
    (function loop() {
      setTimeout(function () {
        if (!(reduce && reduce.matches)) {
          face.classList.add("blinking");
          setTimeout(function () {
            face.classList.remove("blinking");
          }, 130);
        }
        loop();
      }, 3200 + Math.random() * 5800);
    })();
  });

  // Cards react to being addressed.
  document.querySelectorAll(".card, .cast-card").forEach(function (card) {
    var face = card.querySelector("[data-face]");
    if (!face) return;
    card.addEventListener("pointerenter", function () {
      face.classList.add("happy");
    });
    card.addEventListener("pointerleave", function () {
      face.classList.remove("happy");
    });
  });

  var hero = document.querySelector(".hero");
  var mascotFace = document.querySelector(".mascot [data-face]");
  if (hero && mascotFace) {
    hero.addEventListener("pointerenter", function () {
      mascotFace.classList.add("happy");
    });
    hero.addEventListener("pointerleave", function () {
      mascotFace.classList.remove("happy");
    });
  }
})();
