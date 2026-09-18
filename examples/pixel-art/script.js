/* A sprite is a bitmap. Render it as one element's box-shadow list --
   an original 9x9 sparkle, not the real page's compass mark. */
(function () {
  var el = document.getElementById('sprite');
  if (!el) return;
  var PX = 7;
  var palette = { k: '#1a1c2c', y: '#ffcd75' };
  var bitmap = [
    '....k....',
    '....y....',
    '....y....',
    '..k.y.k..',
    'kyyyyyyyk',
    '..k.y.k..',
    '....y....',
    '....y....',
    '....k....'
  ];
  var shadows = [];
  bitmap.forEach(function (row, y) {
    row.split('').forEach(function (ch, x) {
      if (ch === '.') return;
      shadows.push((x * PX) + 'px ' + (y * PX) + 'px 0 0 ' + (palette[ch] || palette.y));
    });
  });
  el.style.boxShadow = shadows.join(',');
})();
