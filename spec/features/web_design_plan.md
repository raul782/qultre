# Qultre Validation MVP - Feature & Web Design Plan

This specification details the architecture, design token definitions, user flows, and functional behavior for the initial validation stage of **Qultre**
---

## 1. Visual Strategy & Design Language

The visual system is designed to evoke discovery, depth, and structural organization. It targets an audience interested in intellectual, localized, and cultural exploration.

### 1.1 Color Palette
We establish three primary color tones representing our layers of depth (Static Layer, Context Layer, and Graph Connections).

*   **Primary (Theme Shell)**: Deep Space Indigo (`#6366f1` / HSL `239, 84%, 66%`)
*   **Secondary (Interactivity & Focus)**: Electric Violet (`#9333ea` / HSL `270, 76%, 53%`)
*   **Tertiary / Accent (Validation / Micro-Utilities)**: Vivid Cyan (`#06b6d4` / HSL `189, 94%, 43%`)
*   **Light Mode Backgrounds**: Ice Blue Slate (`#f8fafc` to `#eff6ff`)
*   **Dark Mode Backgrounds**: Deep Void Space (`#030712` to `#0f172a`)

### 1.2 Typography
*   **Headlines**: `Outfit`, Sans-Serif (loaded from Google Fonts). Used at heavy weights (`font-black`, `font-extrabold`) for headers.
*   **Body Content**: `Inter`, Sans-Serif. Selected for legibility in information cards and descriptions.

---

## 2. Interactive Flow & Navigation

```mermaid
graph TD
    A[Visitor Lands] --> B{Choose Language}
    B -- ES --> C[Root Page]
    B -- EN --> D[/en/ Subdirectory]
    C --> E[Explore 3D City Cards]
    D --> E
    E --> F[Select Category: Finance/Tourism/Demographics/Weather]
    F --> G[Card Animates / Flips to reveal details]
    G --> H[Enter Email for Waitlist]
    H --> I[Astro API Validation]
    I --> J[Write to Google Sheets]
    J --> K[Show Success Feedback]
```

---

## 3. Curated Cards Schema (`cards.json`)
Cities: **Madrid**, **Lisbon**, **London**.
Categories:
1.  **Finance**: Curated local coffee price, basic taxi flat rate, currency, average restaurant meal.
2.  **Tourism**: Top neighborhood, local custom (e.g., tipping), primary attraction.
3.  **Demographics**: Population density, primary languages spoken, average age.
4.  **Weather**: Best travel month, average high temp, average low temp.

---

## 4. Operational Pipeline
Submissions from the waitlist form trigger a POST request to `/api/submit-email`.
The Astro server:
1.  Validates input data with Zod (fields: `email`, `name`, `language`, `timestamp`).
2.  Forwards the request payload to the deployed `GOOGLE_SHEETS_WEBHOOK_URL` endpoint configured via Google Apps Script.
3.  Returns a successful JSON response to hydration islands.
