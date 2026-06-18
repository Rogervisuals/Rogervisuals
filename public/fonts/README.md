# Font files

Add your licensed Nexa font files here, then update `@font-face` in `app/globals.css`:

- `Nexa-Bold.woff2` — headings
- `Nexa-Light.woff2` — body text

Example once files are present:

```css
@font-face {
  font-family: "Nexa Bold";
  src:
    url("/fonts/Nexa-Bold.woff2") format("woff2"),
    local("Segoe UI Semibold");
  font-weight: 700;
  font-style: normal;
  font-display: swap;
}
```

Until Nexa files are added, the site uses system sans-serif fallbacks mapped to the Nexa family names.

Questrial is loaded automatically via Google Fonts.