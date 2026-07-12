(function () {
  var body = document.body;
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

  var revealTargets = document.querySelectorAll('.section, .look-item, .concept-fragments');
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
