(function () {
  var body = document.body;

  // a saved/reopened URL can carry a #connect (or similar) hash from a
  // past visit (e.g. after tapping a nav link), and mobile Safari also
  // restores the previous scroll position on reopen - either would skip
  // the opening AXOn world entirely once the gate's scroll-lock lifts
  if (location.hash) history.replaceState(null, '', location.pathname + location.search);
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  window.scrollTo({ top: 0, left: 0, behavior: 'instant' });

  function forcePlayVideos() {
    document.querySelectorAll('video[autoplay]').forEach(function (v) {
      var p = v.play();
      if (p && p.catch) p.catch(function () {});
    });
  }
  forcePlayVideos();

  var codeIntro = document.getElementById('codeIntro');
  var codeIntroBlock = document.getElementById('codeIntroBlock');
  var codeIntroDone = false;
  var gateVideo = document.getElementById('gateVideo');

  function hideCodeIntro() {
    if (codeIntroDone) return;
    codeIntroDone = true;
    codeIntro.classList.add('code-intro-hidden');
    forcePlayVideos();
    // gate-video has no autoplay attribute (so it can't finish playing
    // in the background while hidden behind the code intro) - start it
    // explicitly now that it's actually visible
    var p = gateVideo.play();
    if (p && p.catch) p.catch(function () {});
  }

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
        codeIntro.scrollTop = codeIntro.scrollHeight;
        setTimeout(tick, 9);
      } else {
        segIndex += 1;
        tick();
      }
    }
    tick();
  })();

  var gate = document.getElementById('gate');
  var gateOpened = false;

  function openGate() {
    if (gateOpened) return;
    gateOpened = true;
    body.classList.add('gate-opened');
    gate.classList.add('gate-hidden');
    forcePlayVideos();
    // the restored scroll position only becomes visible once this unlocks
    // the body, so re-assert the top instantly (bypassing the global
    // smooth-scroll) right as the lock lifts
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }

  gateVideo.addEventListener('ended', openGate);

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

  var savedLang = localStorage.getItem('axon-lang') === 'ja' ? 'ja' : 'en';
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

  document.addEventListener('click', function (e) {
    if (!mainNav.classList.contains('open')) return;
    if (mainNav.contains(e.target) || navToggle.contains(e.target)) return;
    mainNav.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
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

  var storyDetails = document.querySelectorAll('.story-details');
  storyDetails.forEach(function (details) {
    var videos = details.querySelectorAll('video');
    var content = details.querySelector('.story-details-content');
    if (!content) return;

    // show the chapter number inside the opened overlay too, since the
    // "01|CONNECTION" summary label is hidden behind it once open -
    // prefixed onto the first line itself, not a separate small line.
    // Journal cards handle their own "AXON JOURNAL / 001" labeling, so
    // they're excluded from this.
    var summaryEl = details.querySelector('summary');
    var innerEl = content.querySelector('.story-details-inner');
    var isJournalEntry = details.classList.contains('journal-card') || details.classList.contains('journal-page');
    var numMatch = !isJournalEntry && summaryEl && summaryEl.textContent.match(/^\s*(\d+)/);
    if (numMatch && innerEl && innerEl.firstElementChild) {
      var firstChild = innerEl.firstElementChild;
      // drop a leading whitespace-only text node (from the HTML
      // formatting) so the number sits on the same line as the text
      // instead of wrapping onto its own line under white-space:pre-line
      while (firstChild.firstChild && firstChild.firstChild.nodeType === 3 && !firstChild.firstChild.textContent.trim()) {
        firstChild.removeChild(firstChild.firstChild);
      }
      var numEl = document.createElement('span');
      numEl.className = 'story-chapter-num';
      numEl.textContent = numMatch[1] + '｜';
      firstChild.insertBefore(numEl, firstChild.firstChild);
    }

    // move the overlay content to <body> so its position:fixed is relative
    // to the viewport, not to an ancestor section that has its own
    // transform (any transform, even translateY(0), creates a new
    // containing block that would otherwise trap position:fixed)
    body.appendChild(content);

    var closeBtn = content.querySelector('.story-close');

    details.addEventListener('toggle', function () {
      if (details.open) {
        storyDetails.forEach(function (other) {
          if (other !== details) other.open = false;
        });
        content.classList.add('is-open');
        content.scrollTop = 0;
        body.classList.add('story-modal-open');
        videos.forEach(function (video) {
          var p = video.play();
          if (p && p.catch) p.catch(function () {});
        });
      } else {
        content.classList.remove('is-open');
        var anyOpen = false;
        storyDetails.forEach(function (other) { if (other.open) anyOpen = true; });
        if (!anyOpen) body.classList.remove('story-modal-open');
        videos.forEach(function (video) { video.pause(); });
      }
    });

    if (closeBtn) {
      closeBtn.addEventListener('click', function () {
        details.open = false;
      });
    }

    var inner = content.querySelector('.story-details-inner');
    content.addEventListener('click', function (e) {
      if (e.target === content || e.target === inner) details.open = false;
    });

    var nextBtn = content.querySelector('.story-next');
    if (nextBtn) {
      nextBtn.addEventListener('click', function () {
        var target = document.getElementById(nextBtn.dataset.next);
        details.open = false;
        if (target) target.open = true;
      });
    }
  });
})();
