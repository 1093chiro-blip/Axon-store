(function () {
  var canvas = document.getElementById('logoCanvas');
  if (!canvas || !canvas.getContext) return;
  var ctx = canvas.getContext('2d');

  var VB_W = 720, VB_H = 260;
  var STROKE_W = 3.2;

  var pathData = [
    'M120,34 L48,230',
    'M120,34 L194,230',
    'M122.56,151.32 L123.53,151.29 L124.57,151.51 L125.60,152.01 L126.56,152.79 L127.37,153.84 L127.97,155.13 L128.29,156.60 L128.29,158.21 L127.92,159.86 L127.17,161.49 L126.04,163.00 L124.54,164.29 L122.72,165.30 L120.65,165.93 L118.39,166.13 L116.04,165.85 L113.71,165.06 L111.51,163.76 L109.55,161.98 L107.93,159.76 L106.76,157.17 L106.12,154.30 L106.07,151.27 L106.65,148.19 L107.87,145.20 L109.72,142.44 L112.17,140.04 L115.12,138.12 L118.49,136.81 L122.15,136.17 L125.96,136.29 L129.77,137.19 L133.40,138.87 L136.71,141.30 L139.53,144.42 L141.72,148.11 L143.16,152.27 L143.76,156.72 L143.45,161.30 L142.21,165.82 L140.06,170.09 L137.03,173.93 L133.23,177.15 L128.78,179.59 L123.85,181.14 L118.60,181.68 L113.25,181.16 L108.03,179.56 L103.13,176.91 L98.79,173.28 L95.19,168.78 L92.50,163.57 L90.88,157.84 L90.42,151.81 L91.17,145.70 L93.15,139.77 L96.31,134.27 L100.57,129.43 L105.77,125.47 L111.75,122.57 L118.27,120.89 L125.10,120.53 L131.96,121.54 L138.57,123.92 L144.67,127.62 L149.99,132.51 L154.29,138.43 L157.38,145.18 L159.10,152.50 L159.33,160.12 L158.05,167.72 L155.24,175.02 L151.00,181.70 L145.46,187.48 L138.80,192.10 L131.27,195.36 L123.15,197.09 L114.75,197.18 L106.40,195.59 L98.44,192.35 L91.20,187.54 L84.98,181.33 L80.05,173.93 L76.64,165.62 L74.93,156.69',
    'M274,108 C295,134 316,159 341,181',
    'M341,109 C320,132 300,155 277,179',
    'M341,109 C351,99 362,95 372,99',
    'M406,183 L477,116',
    'M535,182 L535,116',
    'M535,116 C535,100 565,100 565,120',
    'M565,120 L565,182',
    'M565,182 C581,187 596,182 611,167'
  ];
  var circleData = { cx: 440, cy: 150, r: 31 };

  function samplePoints() {
    var SCALE = 3;
    var off = document.createElement('canvas');
    off.width = VB_W * SCALE;
    off.height = VB_H * SCALE;
    var octx = off.getContext('2d');
    octx.scale(SCALE, SCALE);
    octx.strokeStyle = '#fff';
    octx.lineWidth = STROKE_W;
    octx.lineCap = 'round';
    octx.lineJoin = 'round';
    pathData.forEach(function (d) {
      octx.stroke(new Path2D(d));
    });
    octx.beginPath();
    octx.arc(circleData.cx, circleData.cy, circleData.r, 0, Math.PI * 2);
    octx.stroke();

    var img = octx.getImageData(0, 0, off.width, off.height).data;
    var pts = [];
    var stride = 3;
    for (var y = 0; y < off.height; y += stride) {
      for (var x = 0; x < off.width; x += stride) {
        var idx = (y * off.width + x) * 4;
        if (img[idx + 3] > 120) pts.push([x / SCALE, y / SCALE]);
      }
    }
    return pts;
  }

  function shuffle(arr) {
    for (var i = arr.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = arr[i]; arr[i] = arr[j]; arr[j] = t;
    }
    return arr;
  }

  var MAX_PARTICLES = 1100;
  var targets = shuffle(samplePoints()).slice(0, MAX_PARTICLES);

  var particles = targets.map(function (t) {
    var angle = Math.random() * Math.PI * 2;
    var dist = 220 + Math.random() * 260;
    return {
      tx: t[0], ty: t[1],
      sx: t[0] + Math.cos(angle) * dist,
      sy: t[1] + Math.sin(angle) * dist,
      delay: Math.random() * 1.0,
      dur: 2.2 + Math.random() * 1.8,
      r: 0.55 + Math.random() * 0.55,
      seed: Math.random() * 1000
    };
  });

  function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }

  var dpr = Math.min(window.devicePixelRatio || 1, 2);
  function syncCanvasSize() {
    var rect = canvas.getBoundingClientRect();
    var w = Math.round(rect.width * dpr);
    var h = Math.round(rect.height * dpr);
    if (canvas.width !== w) canvas.width = w;
    if (canvas.height !== h) canvas.height = h;
  }

  var startTime = null;
  var particleColor = '#F0ECE4';
  var started = false;

  function draw(now) {
    if (!startTime) startTime = now;
    var elapsed = (now - startTime) / 1000;

    syncCanvasSize();
    var scaleX = canvas.width / VB_W;
    var scaleY = canvas.height / VB_H;
    var scaleAvg = (scaleX + scaleY) / 2;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = particleColor;

    particles.forEach(function (p) {
      var t = (elapsed - p.delay) / p.dur;
      if (t < 0) t = 0;
      if (t > 1) t = 1;
      var e = easeOutCubic(t);

      var px, py, alpha;
      if (t >= 1) {
        px = p.tx + Math.sin(elapsed * 1.6 + p.seed) * 0.4;
        py = p.ty + Math.cos(elapsed * 1.4 + p.seed) * 0.4;
        alpha = 0.85 + Math.sin(elapsed * 1.2 + p.seed) * 0.15;
      } else {
        var jitter = (1 - e);
        px = p.sx + (p.tx - p.sx) * e + Math.sin(elapsed * 5 + p.seed) * jitter * 3;
        py = p.sy + (p.ty - p.sy) * e + Math.cos(elapsed * 4 + p.seed) * jitter * 3;
        alpha = 0.3 + e * 0.7;
      }

      ctx.globalAlpha = alpha;
      ctx.beginPath();
      ctx.arc(px * scaleX, py * scaleY, p.r * scaleAvg, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.globalAlpha = 1;

    requestAnimationFrame(draw);
  }

  window.axonStartLogoParticles = function () {
    if (started) return;
    started = true;
    var bodyColor = getComputedStyle(document.body).color;
    if (bodyColor) particleColor = bodyColor;
    requestAnimationFrame(draw);
  };
})();
