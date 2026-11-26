/* Frenzel · Goetzl · Wild – kleines Skript ohne Abhängigkeit außer GSAP (selbst gehostet).
   Alles ist ohne Skript sichtbar und bedienbar. */
(function () {
  'use strict';

  // Menü (mobil)
  var knopf = document.querySelector('.menue-knopf');
  var menue = document.getElementById('menue');
  if (knopf && menue) {
    knopf.addEventListener('click', function () {
      var offen = knopf.getAttribute('aria-expanded') === 'true';
      knopf.setAttribute('aria-expanded', String(!offen));
      knopf.textContent = offen ? 'Menü' : 'Schließen';
      menue.classList.toggle('ist-offen', !offen);
    });
    menue.addEventListener('click', function (e) {
      if (e.target.closest('a')) {
        knopf.setAttribute('aria-expanded', 'false');
        knopf.textContent = 'Menü';
        menue.classList.remove('ist-offen');
      }
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && menue.classList.contains('ist-offen')) {
        knopf.click();
        knopf.focus();
      }
    });
  }

  var leiste = document.querySelector('.leiste');
  var register = Array.prototype.slice.call(document.querySelectorAll('[data-register]'));
  var deckel = document.querySelector('.deckel');

  function setzeAktiv(farbe) {
    if (!leiste) return;
    leiste.querySelectorAll('a').forEach(function (a) {
      a.classList.toggle('ist-aktiv', a.getAttribute('data-farbe') === farbe);
    });
  }

  // Themensuche (Rechtsgebiete A–Z)
  var suche = document.getElementById('themensuche');
  var tabelle = document.getElementById('themenindex');
  if (suche && tabelle) {
    var zeilen = Array.prototype.slice.call(tabelle.tBodies[0].rows);
    var leer = document.getElementById('index-leer');
    suche.addEventListener('input', function () {
      var q = suche.value.trim().toLowerCase();
      var treffer = 0;
      zeilen.forEach(function (z) {
        var an = !q || z.textContent.toLowerCase().indexOf(q) !== -1;
        z.hidden = !an;
        if (an) treffer++;
      });
      if (leer) leer.hidden = treffer !== 0;
    });
  }

  if (!window.gsap) {
    // Ohne GSAP: Leiste bleibt verborgen, Seite funktioniert vollständig.
    return;
  }

  var gsap = window.gsap;
  if (window.ScrollTrigger) gsap.registerPlugin(window.ScrollTrigger);

  // Reiterleiste: erscheint nach dem Deckel, nur das gelesene Register leuchtet.
  if (leiste && deckel && window.ScrollTrigger) {
    window.ScrollTrigger.create({
      trigger: deckel,
      start: 'bottom top+=64',
      onEnter: function () { leiste.classList.add('ist-sichtbar'); },
      onLeaveBack: function () { leiste.classList.remove('ist-sichtbar'); setzeAktiv(null); }
    });
    register.forEach(function (sektion) {
      window.ScrollTrigger.create({
        trigger: sektion,
        start: 'top center',
        end: 'bottom center',
        onToggle: function (self) { if (self.isActive) setzeAktiv(sektion.getAttribute('data-register')); },
      });
    });
    var nachRegister = document.querySelector('.register--anthrazit + .blatt');
    if (nachRegister) {
      window.ScrollTrigger.create({
        trigger: nachRegister, start: 'top center',
        onEnter: function () { setzeAktiv(null); },
        onLeaveBack: function () { setzeAktiv('anthrazit'); }
      });
    }
  }

  // Einstieg: die drei Reiter schieben sich einmal aus dem Stapel. Nur ohne reduzierte Bewegung.
  var mm = gsap.matchMedia();
  mm.add('(prefers-reduced-motion: no-preference)', function () {
    var reiter = gsap.utils.toArray('.stapel .reiter');
    if (reiter.length) {
      gsap.from(reiter, {
        y: 18,
        duration: 0.55,
        ease: 'power3.out',
        stagger: 0.09,
        delay: 0.15,
        clearProps: 'transform'
      });
    }
    var namensfolge = document.querySelector('.deckel .namensfolge');
    if (namensfolge) {
      gsap.from(namensfolge, { y: 10, autoAlpha: 0.001, duration: 0.6, ease: 'power2.out', clearProps: 'all' });
    }
  });
})();
