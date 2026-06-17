# Qultre Validation Landing Page & MVP

Welcome to the **Qultre** codebase. This project represents the validation MVP for Qultre.com, built to gauge market interest in the **Culture Graph** concept and capture interested users' emails.

The site is built as a fast, hybrid Astro project utilizing Astro's islands architecture, React, Tailwind CSS v4, Zustand, Zod, and interactive Three.js 3D cards.

---

## 1. Technical Architecture & Tech Stack

```
┌────────────────────────────────────────────────────────────────────────┐
│                              Astro Engine                              │
│                                                                        │
│  ┌────────────────────────┐            ┌────────────────────────────┐  │
│  │    Static MDX/HTML     │            │    React Island (<Form>)   │  │
│  │ (Copy, Layout, Styles) │            │ (Zustand, Zod, Validation) │  │
│  └────────────────────────┘            └─────────────┬──────────────┘  │
│                                                      │                 │
│  ┌────────────────────────┐                          │                 │
│  │ React Island (<Card>)  │                          ▼                 │
│  │   (Three.js Animation) │            ┌────────────────────────────┐  │
│  └────────────────────────┘            │     Serverless API Route   │  │
│                                        │     (/api/submit-email)    │  │
│                                        └─────────────┬──────────────┘  │
└──────────────────────────────────────────────────────│─────────────────┘
                                                       ▼
                                         ┌────────────────────────────┐
                                         │  Google Sheets Database    │
                                         └────────────────────────────┘
```

*   **Framework**: AstroJS (v5) configured with `output: 'hybrid'` for pre-rendered fast pages and server-side endpoints.
*   **State Management**: Zustand (v5) dynamically syncing interactive card selection with preferred waitlist entries.
*   **Form Validation**: React Hook Form with Zod schemas ensuring clean user registrations.
*   **3D Animations**: React Three Fiber & Drei executing dynamic 3D card spins and hover reflections.
*   **Localization (i18n)**: `i18next` integration routing path-based locales (e.g., `/` for Spanish default and `/en` for English).
*   **Virtualization**: Docker containerized running on Node 24-alpine.
*   **Hosting**: Configured for Cloudflare Pages edge deployment (`wrangler.jsonc` and Cloudflare Adapter).

---

## 2. Getting Started

### 2.1 Prerequisites
Make sure you have [pnpm](https://pnpm.io/) and [Docker](https://www.docker.com/) installed on your machine.

### 2.2 Environment Configuration
Create a `.env` file in the root of the project:
```bash
cp .env.example .env
```
Open `.env` and set your `GOOGLE_SHEETS_WEBHOOK_URL` (see setup instructions below).

---

## 3. Integration & Webhooks

### 3.1 Google Sheets Webhook Setup
We write waitlist entries directly to a Google Sheet using an Apps Script.
1. Open the Google Sheet where you want to store waitlist users.
2. Go to **Extensions** -> **Apps Script**.
3. Replace all default code with the contents of the script located at `scripts/google-sheets-script.js`.
4. Deploy the script by selecting **Deploy** -> **New deployment**.
5. Set the Type to **Web app**, Execute as **Me**, and Access to **Anyone**.
6. Copy the generated Web App URL and assign it to `GOOGLE_SHEETS_WEBHOOK_URL` in your `.env` file.

---

## 4. Running the Project

### 4.1 Running with Docker (Recommended)
We include a `Makefile` to quickly manage virtualized containers:
*   **Start development environment**:
    ```bash
    make dev
    ```
*   **Build production images**:
    ```bash
    make build
    ```
*   **View container logs**:
    ```bash
    make logs
    ```
*   **Stop containers**:
    ```bash
    make stop
    ```

### 4.2 Running Locally on Host
If you prefer running directly in your terminal:
*   **Install dependencies**:
    ```bash
    pnpm install
    ```
*   **Start local server**:
    ```bash
    pnpm run dev
    ```
*   **Build static dist**:
    ```bash
    pnpm run build
    ```

---

## 5. Running Tests

Automated unit tests check form schemas, language parameters, and Zustand state synchronization.

To execute tests:
```bash
pnpm run test
```
To run tests inside Docker containers:
```bash
make test
```
