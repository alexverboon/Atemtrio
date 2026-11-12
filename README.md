# Atemtrio – Website

Statische Website (eine Seite, vier Sprachen) für GitHub Pages.

## Aufbau

```
index.html               Inhalt (Deutsch ist direkt im HTML)
css/style.css            Gestaltung
js/uebersetzungen.js     Texte für FR / IT / EN (nur reiner Text, kein HTML)
js/main.js               Sprachwahl, Jahreszahl, Foto-Fallback
bilder/                  Logos, Favicon, Gruppenfoto (atemtrio.jpg)
.nojekyll                GitHub Pages liefert die Dateien unverändert aus
```

Texte ändern: Deutsch in `index.html`, die anderen Sprachen in `js/uebersetzungen.js`
(gleicher Schlüssel wie im Attribut `data-i18n`).

## Sicherheit

- **Content-Security-Policy** (Meta-Tag in `index.html`): nur eigene Skripte und Bilder,
  Stylesheets/Schriften nur von Google Fonts, keine Formulare, keine Verbindungen nach aussen.
  Wer neue externe Quellen einbindet, muss die Richtlinie anpassen.
- Kein Inline-JavaScript, keine Inline-Event-Handler, kein `innerHTML`:
  Übersetzungen werden mit `textContent` gesetzt.
- Externe Links mit `rel="noopener noreferrer"`; Referrer-Policy `strict-origin-when-cross-origin`.
- Keine Cookies, kein Tracking. Im Browser wird nur die gewählte Sprache gespeichert
  (`localStorage`, Schlüssel `atemtrio-sprache`).

## Einstellungen auf GitHub

- Settings → Pages → **Enforce HTTPS** aktivieren.
- GitHub-Konto mit **Zwei-Faktor-Authentifizierung** schützen.
- Settings → Branches: Schutzregel für `main` (kein Force-Push, kein Löschen).
- Bei eigener Domain: Domain unter Settings → Pages **verifizieren** (schützt vor Übernahme).
- Keine Passwörter, Schlüssel oder privaten Dokumente ins Repository legen – es ist öffentlich.
