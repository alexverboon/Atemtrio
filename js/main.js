/* Atemtrio – Seitenlogik
   - Jahreszahl im Copyright
   - Gruppenfoto ausblenden, falls die Datei fehlt
   - Sprachwahl (DE/FR/IT/EN): Texte werden ausschliesslich mit textContent gesetzt */
(function () {
  'use strict';

  var SPRACHEN = ['de', 'fr', 'it', 'en'];
  var SPEICHER_SCHLUESSEL = 'atemtrio-sprache';
  var EMAIL = 'info.atemtrio@gmx.ch';

  // Copyright-Jahr
  var jahr = document.getElementById('jahr');
  if (jahr) jahr.textContent = String(new Date().getFullYear());

  // Gruppenfoto: bei fehlender Datei entfernen, damit nur die Kreise sichtbar bleiben
  var foto = document.querySelector('.hero-visual img');
  if (foto) {
    var entfernen = function () { foto.remove(); };
    if (foto.complete && foto.naturalWidth === 0) entfernen();
    else foto.addEventListener('error', entfernen, { once: true });
  }

  // Sprachwahl
  var TEXTE = window.ATEMTRIO_TEXTE || {};
  var META = window.ATEMTRIO_META || {};
  var elemente = Array.prototype.slice.call(document.querySelectorAll('[data-i18n]'));
  var original = elemente.map(function (el) { return el.textContent; });
  var metaDesc = document.querySelector('meta[name="description"]');
  if (META.de) META = Object.assign({}, META, { de: Object.assign({}, META.de, { desc: metaDesc ? metaDesc.content : '' }) });

  function gueltig(l) { return SPRACHEN.indexOf(l) >= 0 ? l : null; }

  function setzeSprache(l, speichern) {
    l = gueltig(l) || 'de';
    var tabelle = TEXTE[l] || {};
    elemente.forEach(function (el, i) {
      var k = el.getAttribute('data-i18n');
      var text = (l !== 'de' && Object.prototype.hasOwnProperty.call(tabelle, k)) ? tabelle[k] : original[i];
      el.textContent = text;
    });
    var m = META[l];
    if (m) {
      document.documentElement.lang = m.lang;
      document.title = m.title;
      if (metaDesc) metaDesc.content = m.desc;
      var nav = document.querySelector('.kopf nav'); if (nav) nav.setAttribute('aria-label', m.nav);
      var svg = document.querySelector('svg.atem'); if (svg) svg.setAttribute('aria-label', m.svg);
      var img = document.querySelector('.hero-visual img'); if (img) img.alt = m.alt;
      document.querySelectorAll('a.knopf[href^="mailto:"]').forEach(function (a) {
        a.href = 'mailto:' + EMAIL + '?subject=' + encodeURIComponent(m.subject);
      });
    }
    document.querySelectorAll('.sprachen button').forEach(function (b) {
      b.setAttribute('aria-pressed', String(b.getAttribute('data-lang') === l));
    });
    if (speichern) {
      try { localStorage.setItem(SPEICHER_SCHLUESSEL, l); } catch (e) { /* Speicher nicht verfügbar */ }
      try {
        var url = new URL(window.location.href);
        if (l === 'de') url.searchParams.delete('lang'); else url.searchParams.set('lang', l);
        window.history.replaceState(null, '', url);
      } catch (e) { /* z. B. lokale Datei */ }
    }
  }

  document.querySelectorAll('.sprachen button').forEach(function (b) {
    b.addEventListener('click', function () { setzeSprache(b.getAttribute('data-lang'), true); });
  });

  // Startsprache: URL-Parameter > gespeicherte Wahl > Browsersprache > Deutsch
  var start = null;
  try { start = gueltig(new URL(window.location.href).searchParams.get('lang')); } catch (e) {}
  if (!start) { try { start = gueltig(localStorage.getItem(SPEICHER_SCHLUESSEL)); } catch (e) {} }
  if (!start) {
    var bevorzugt = navigator.languages || [navigator.language || 'de'];
    for (var i = 0; i < bevorzugt.length && !start; i++) start = gueltig(String(bevorzugt[i]).slice(0, 2).toLowerCase());
  }
  if (start && start !== 'de') setzeSprache(start, false);
})();
