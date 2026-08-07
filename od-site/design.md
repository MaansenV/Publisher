# DESIGN.md — Unity Asset Developer Portfolio

Richtung übernommen vom **Frans Hals Museum** (franshalsmuseum.nl): eine warme, kunstgalerie-artige Atmosphäre — apricotfarbene Flächen, tiefes Teal-Schwarz als Tinte, salbeigrüner Akzent, großvolumige Display-Typographie und eine bildgeführte Galerie-Rasterlandschaft. Dein Portfolio wird zur "Galerie deiner Assets": Jedes Unity-Produkt hängt wie ein gerahmtes Werk an der Wand.

> **Ein-Satz-System:** Warme Museumsflächen (Apricot & Dunkel-Teal) als Bühne für großformatige, bildgeführte Asset-Präsentationen mit Rubik-Typographie und einem einzigen salbeigrünen Akzent.

---

## 1. Farb-Tokens (OKLch, verbindlich)

Aus den extrahierten Museumswerten abgeleitet. Nur über Tokens verwenden — keine rohen Hex-Werte im Body.

```css
:root {
  /* Flächen */
  --bg:      oklch(0.877 0.10 73.78);  /* Apricot #FECD8C  — Grundfläche, Mutig */
  --surface: oklch(0.985 0.00 89.88);  /* Off-White #FAFAFA — Karten, Gallerie-Platten */
  --surface-dark: oklch(0.171 0.03 211.12); /* Deep Teal #001317 — dunkle Sektionen, Footer */
  --nav-on-dark:  oklch(0.985 0.00 89.88);  /* Text auf dunkler Fläche */

  /* Tinte */
  --fg:    oklch(0.171 0.03 211.12);  /* Teal-Schwarz — Text auf hell */
  --muted: oklch(0.613 0.01 212.54);  /* gedämpftes Graugrün #7D8688 */
  --on-accent: oklch(0.171 0.03 211.12); /* Text auf Akzent */

  /* Kontur */
  --border:       oklch(0.171 0.03 211.12 / 0.14);
  --border-dark:  oklch(0.985 0.00 89.88 / 0.12); /* auf dunklen Flächen */

  /* Akzent (einer) */
  --accent: oklch(0.789 0.07 114.01); /* Salbeigrün #B9C089 */
  --accent-strong: oklch(0.60 0.10 120.00); /* verdunkelt für Text-Kontrast ≥ 4.5:1 */

  /* Warme Sekundär-Intonation (sparsam, für Hover-Akzente) */
  --warm:  oklch(0.828 0.14 71.28);   /* #FFB655 */

  /* Fokus */
  --focus: oklch(0.60 0.10 120.00);   /* = accent-strong */
}
```

**Verhalten / Kontrast-Regeln**
- Helle Fläche (`--bg`) + `--fg`-Tinte → Body-Verhältnis ≥ 4.5:1 ✓
- Akzent als Füllfläche (Pillen, Chips) OK; Akzent als **Textfarbe** immer `--accent-strong`, nie das helle `--accent`.
- Auf dunkler Fläche Tinte nie dunkel: immer `--nav-on-dark` (Off-White).
- Hover: Fläche um ±0.08–0.12 auf der L-Achse verschieben, Tinte nie auf `--muted` wechseln.

**Akzent-Disziplin:** max. 2 sichtbare `--accent`-Nutzungen pro Bildschirm — typisch *eine* Pillen-/Tag-Markierung + *ein* aktiver Galerie-Filter. Links = Akzent zählen mit; wenn ein CTA da ist, Links auf `--fg`-Unterstrich degradieren.

---

## 2. Typographie

Grundschrift des Museums ist **Rubik** — eine geometrische, freundlich-runde Grotesk. Für ein Developer-Portfolio ergänzt um eine technische Mono-Schrift für Code/technische Labels.

| Rolle | Font | Gewicht | Tracking | Leading |
|---|---|---|---|---|
| Display (Hero / Asset-Kopf) | Rubik | 700 / 800 | `-0.02em` | 1.05–1.1 |
| Heading H1–H3 | Rubik | 700 | `-0.01em`–`-0.02em` | 1.15 |
| Body | Rubik | 400 | `0` | 1.6 |
| Klein / Caption / Labels | Rubik | 500 | `0.02em` | 1.5 |
| **Grand Tour** | Rubik 800 | Gemischt | `0.06em` | — |
| Mono (Code, Metadaten, Kategorien) | JetBrains Mono | 400 / 500 | `0` | 1.6 |

**Font-Stacks (mit Fallback):**
```css
--font-display: "Rubik", "Avenir Next", system-ui, sans-serif;
--font-body:    "Rubik", system-ui, -apple-system, sans-serif;
--font-mono:    "JetBrains Mono", "SFMono-Regular", ui-monospace, monospace;
```

**Größen-Skala (1.25):**
- Display 72–96px (nutze 72 als Deckel auf 1440px)
- H1 48px · H2 32px · H3 24px · H4 20px
- Body 17px · Klein 14px · Caption 12px

**Regeln**
- DISPLAY (etichette wie "KATEGORIE", "RELEASES", Navigation-Gruppen) → immer `text-transform: uppercase` + `letter-spacing: 0.08em`.
- Display nie unterqueren; bei langem Hero-Titel umbrechen lassen, nie `white-space: nowrap`.
- Body-Zeilen auf `max-width: 65ch`.
- Mono für: Asset-Versionen (`v1.2.3`), technische Meta (Tool, Größe, Keywords), Datei-/Namenslabels, Bildunterschriften.

---

## 3. Layout-System

Galerie-inspiriert: viel Luft, großzügige Ränder, gestaffelten Dichte.

**Grid & Flow**
- 12-Spalten-Container, `max-width: 1280px`, Abstand `24px` auf Desktop / `16px` mobil.
- 1 Groß-Sektion (Hero, dunkles Teal) → wechselnd helle Karten-Sektionen → dunkler Footer = der Museums-Rhythmus Apricot ↔ Dunkel.
- "Galeriesaal": Assets im Raster hängen wie Werke an der Wand — pro Zeile 2–3 große Platten + gelegentlich eine hero-breite Platte für Leitprodukte, für Varianz.

**Sektionen (für dein Portfolio)**
1. **Hero (dunkle Fläche `--surface-dark`)** — Name + Ein-Satz-Wertversprechen groß im Display, eine Primary-CTA "Assets erkunden". Layout: Tinte weiß, eine `--accent`-Pille als Eyebrow ("Unity Asset Developer").
2. **Featured / Galerie** — 2–3 Leitprodukte als große Bildplatten. Featured-Platte mit `--accent`-Rahmen-Pille "Neu".
3. **Alle Assets** — filterbares Raster (Kategorie, Tool, Sortierung). Mono-Kategorien in großzügiger Zeile überm Grid; aktiver Filter = `--accent`-Pille.
4. **Über mich** — kurze, human wirkende Story, Portrait-Bild (kein Clip). Galerie-Look: Bild als rahmenartige Platte.
5. **Kontakt / Download** — eine Primary-CTA, sonst alle Einstiege als Sekundär-/Text-Links.
6. **Footer (dunkel)** — Mono-Metadaten, Links, Social.

**Buttons — One Action, One Primary CTA**
- *Eine* Primary-CTA pro Bildschirm. Alle anderen Einstiege (Nav, Karten, Footer) = Sekundär oder Text-Link, nicht wörtlich wiederholen.
- Primary: `--accent` Füllung, Text `--on-accent` (Teal). Hover: Füllung L +0.08.
- Secondary: transparent, `--border` Rahmen, `--fg` Text. Hover: Rahmen kräftiger, Hintergrund minimal rückwärts (dunkler bei hell, heller bei dunkel).
- Touch-Targets ≥ 44px. Jedes fokussierbare Element: klarer `:focus-visible`-Ring über `--focus`.

---

## 4. Bilder & Asset-Präsentation

- **Große, realistische Renderings** der Assets (Game-Screenshots, Tool-Demos). Kein Handgezeichnetes, keine leeren Slots.
- Plattenhülle: `--surface` Karte, feiner `--border`, schmaler Radius (10–14px) — **kein** farbiger Link streifen, wenn ein Radius da ist (anti-AI-Dashboard-Shape).
- Asset-Vorschau dominiert jede Karte; Text (Name in Rubik 700, Kategorie in Mono, Kurzbeschreibung Body) darunter — nie über das Bild gezwungen, außer bewusst an einer Ecke verankert.
- Bild-Overlays (Badges "Neu", "v2.1", "Full HD"): an eine Ecke, konsistente Einzüge, komplett innerhalb des Bildes, festes/gefrostetes Glas + Schatten, Gesicht/Hauptmotiv nicht verdecken.

---

## 5. Sprache & Microcopy

Deutsch, konkret, kein Blabla. Keine erfundenen Metriken — reale Werte oder klar beschriftete Platzhalter ("–" statt Fake-Zahlen).

- CTA-Mikro: "Assets entdecken", "Galerie ansehen" statt "Mehr erfahren".
- Kategorien-Mono-Labels technisch ehrlich: `Terrain`, `Tools & Editor`, `VFX`, `Shaders`.
- Ein Detail, das nur jemand eingebaut hätte, der das Produkt nutzt: eine Unity-Versions-Badge (`Unity 6000.3`), ein `[L]`-Keycap-Hinweis, ein "Burst-compiled" label.

---

## 6. Beobachtete Design-Gesetze (aus dem Museum)

1. **Mutige Grundfläche:** Apricot ist keine zaghafte Beige — sie trägt die Seite und gibt den Bildern einen warmen Glanz. Nicht in Richtung Grau/Weiß ausweichen.
2. **Ein starker Rhythmus Apricot ↔ Teal:** Helle, luftige Sektionen wechseln mit dunklen, gebündelten Blöcken (Hero, Footer). Keine durchgehend graue Seite.
3. **Bild ist König:** Die Werke/Assets tragen die Gestaltung; UI zieht sich zurück. Wenig Kasten-Dekoration, viel Leerraum.
4. **Eine einzige Akzentfarbe (Salbeigrün):** Niemals mehrfarbig. Warmes `--warm` nur als mikroskopischer Hover-Akzent.
5. **Großzügige Display-Type:** Rubik in großer, enger Staffelung statt kleiner Headlines. Typographie trägt die Hierarchie, nicht Rahmen.

---

## 7. Dateistruktur (Vorschlag)

```
design.md            ← dieses Dokument
index.html           ← Einstieg / Portfolio-Page
assets/              ← Renderings, Portrait, Icons (SVG, nicht Emoji)
```

Jede neue Version des Mainfiles als `-v2`-Kopie sichern.

---

*Implementierung: HTML/CSS selbstenthalten in `index.html`, alle Tokens über die `:root`-Variablen oben, keine externen Hotlinks für Bilder.*