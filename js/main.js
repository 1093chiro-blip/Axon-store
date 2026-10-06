(function () {
  var body = document.body;

  var codeIntro = document.getElementById('codeIntro');
  var codeIntroBlock = document.getElementById('codeIntroBlock');
  var codeIntroDone = false;

  var codeIntroHiddenAt = 0;

  function hideCodeIntro() {
    if (codeIntroDone) return;
    codeIntroDone = true;
    codeIntroHiddenAt = Date.now();
    codeIntro.classList.add('code-intro-hidden');
  }

  codeIntro.addEventListener('click', hideCodeIntro);

  var CODE_LINES = [
    [{ t: '$ axon --build', c: 'dim' }],
    [{ t: '> initializing neural-signal.axon.io...', c: 'dim' }],
    [{ t: '> [', c: 'dim' }, { t: '14:22:01.004', c: 'num' }, { t: '] connecting...', c: 'dim' }],
    [{ t: '> packet #', c: 'dim' }, { t: '0472', c: 'num' }, { t: ' received', c: 'dim' }],
    [{ t: '- signal: 12% (weak)', c: 'err' }],
    [{ t: '+ signal: 98% (stable)', c: 'add' }],
    [{ t: '> handshake established ✓', c: 'add' }],
    [],
    [{ t: '.hero-bg-video{', c: 'dim' }],
    [{ t: '  position:absolute; inset:0;', c: 'dim' }],
    [{ t: '-  opacity:.55;', c: 'del' }],
    [{ t: '+  opacity:1;', c: 'add' }],
    [{ t: '}', c: 'dim' }],
    [],
    [{ t: 'function openGate() {', c: 'dim' }],
    [{ t: "  body.classList.add('gate-opened');", c: 'dim' }],
    [{ t: '+  forcePlayVideos();', c: 'add' }],
    [{ t: '}', c: 'dim' }],
    [],
    [{ t: 'class AXOn {', c: 'dim' }],
    [{ t: '  constructor(signal) {', c: 'dim' }],
    [{ t: '    this.signal = signal;', c: 'dim' }],
    [{ t: '    this.connections = [];', c: 'dim' }],
    [{ t: '  }', c: 'dim' }],
    [{ t: '  connect(node) {', c: 'dim' }],
    [{ t: '    this.connections.push(node);', c: 'dim' }],
    [{ t: "+   console.log('[AXOn] connection established →', node.id);", c: 'add' }],
    [{ t: '  }', c: 'dim' }],
    [{ t: '}', c: 'dim' }],
    [],
    [{ t: "const network = new AXOn('nerve-01');", c: 'dim' }],
    [{ t: "+ network.connect({ id: 'CONNECT', node: ", c: 'add' }, { t: '47', c: 'num' }, { t: ' });', c: 'add' }],
    [{ t: "+ network.connect({ id: 'REPEAT', node: ", c: 'add' }, { t: '128', c: 'num' }, { t: ' });', c: 'add' }],
    [{ t: "+ network.connect({ id: 'ADAPT', node: ", c: 'add' }, { t: '256', c: 'num' }, { t: ' });', c: 'add' }],
    [{ t: "+ network.connect({ id: 'BECOME', node: ", c: 'add' }, { t: '512', c: 'num' }, { t: ' });', c: 'add' }],
    [],
    [{ t: '> transmitting signal... ', c: 'dim' }, { t: '100%', c: 'num' }],
    [{ t: '> AXOn — recovery × identity.', c: 'add' }]
  ];

  (function typeCodeIntro() {
    var segments = [];
    CODE_LINES.forEach(function (line, li) {
      if (li > 0) codeIntroBlock.appendChild(document.createTextNode('\n'));
      line.forEach(function (seg) {
        var span = document.createElement('span');
        span.className = 'code-' + seg.c;
        codeIntroBlock.appendChild(span);
        segments.push({ el: span, text: seg.t, i: 0 });
      });
    });

    var cursor = document.createElement('span');
    cursor.className = 'code-cursor';
    codeIntroBlock.appendChild(cursor);

    var segIndex = 0;
    function tick() {
      if (codeIntroDone) return;
      if (segIndex >= segments.length) {
        cursor.parentNode && cursor.parentNode.removeChild(cursor);
        setTimeout(hideCodeIntro, 500);
        return;
      }
      var seg = segments[segIndex];
      if (seg.i < seg.text.length) {
        seg.i += 1;
        seg.el.textContent = seg.text.slice(0, seg.i);
        seg.el.parentNode.insertBefore(cursor, seg.el.nextSibling);
        setTimeout(tick, 9);
      } else {
        segIndex += 1;
        tick();
      }
    }
    tick();
  })();

  var gate = document.getElementById('gate');
  var gateVideo = document.getElementById('gateVideo');
  var gateOpened = false;

  function openGate() {
    if (gateOpened) return;
    gateOpened = true;
    body.classList.add('gate-opened');
    gate.classList.add('gate-hidden');
  }

  gateVideo.addEventListener('ended', openGate);
  gate.addEventListener('click', function () {
    // ignore a tap that's really the tail end of the code-intro skip tap,
    // so one tap can't fall through both overlays at once
    if (Date.now() - codeIntroHiddenAt < 600) return;
    openGate();
  });

  var langToggle = document.getElementById('langToggle');
  var navToggle = document.getElementById('navToggle');
  var mainNav = document.getElementById('mainNav');
  var i18nNodes = document.querySelectorAll('[data-ja][data-en]');

  function applyLang(lang) {
    i18nNodes.forEach(function (el) {
      el.textContent = lang === 'en' ? el.dataset.en : el.dataset.ja;
    });
    document.documentElement.lang = lang;
    body.classList.toggle('lang-en', lang === 'en');
  }

  var savedLang = localStorage.getItem('axon-lang') === 'en' ? 'en' : 'ja';
  applyLang(savedLang);

  langToggle.addEventListener('click', function () {
    var next = body.classList.contains('lang-en') ? 'ja' : 'en';
    applyLang(next);
    localStorage.setItem('axon-lang', next);
  });

  navToggle.addEventListener('click', function () {
    var open = mainNav.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  });

  mainNav.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      mainNav.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });

  var accessForm = document.getElementById('accessForm');
  var accessStatus = document.getElementById('accessStatus');
  if (accessForm) {
    accessForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var isEn = body.classList.contains('lang-en');
      var submitBtn = accessForm.querySelector('.access-submit');
      submitBtn.disabled = true;
      accessStatus.textContent = isEn ? 'Sending…' : '送信中…';

      fetch(accessForm.action, {
        method: 'POST',
        body: new FormData(accessForm),
        headers: { Accept: 'application/json' }
      })
        .then(function (res) {
          if (res.ok) {
            accessStatus.textContent = isEn
              ? 'You’re in. Watch your inbox.'
              : '登録しました。案内をお待ちください。';
            accessForm.reset();
          } else {
            accessStatus.textContent = isEn
              ? 'Something went wrong. Please try again.'
              : '送信に失敗しました。もう一度お試しください。';
          }
        })
        .catch(function () {
          accessStatus.textContent = isEn
            ? 'Something went wrong. Please try again.'
            : '送信に失敗しました。もう一度お試しください。';
        })
        .finally(function () {
          submitBtn.disabled = false;
        });
    });
  }

  var revealTargets = document.querySelectorAll('.section, .track, .concept-fragments, .story-step, .story-finale');
  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    revealTargets.forEach(function (el) { observer.observe(el); });
  } else {
    revealTargets.forEach(function (el) { el.classList.add('in-view'); });
  }
})();
