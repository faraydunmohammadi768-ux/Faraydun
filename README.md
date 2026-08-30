# FrameForge

AI-powered video production and automation. Landing page with a Google Sheets waitlist.

## Project structure

```
index.html            Landing page (deploy to GitHub Pages)
apps-script/Code.gs   Google Apps Script backend (deploy to Google)
```

## Waitlist setup

The waitlist form submits emails to a Google Apps Script Web App, which stores them in a Google Sheet. No API keys or credentials are exposed in the frontend — the Apps Script URL is a public endpoint secured by Google's infrastructure.

### 1. Create the Google Sheet

1. Go to [Google Sheets](https://sheets.google.com) and create a new spreadsheet.
2. Name it something like **FrameForge Waitlist**.
3. You don't need to add any headers — the script creates a "Waitlist" sheet with headers automatically on the first submission.

### 2. Deploy the Apps Script

1. In your Google Sheet, go to **Extensions → Apps Script**.
2. Delete any code in the editor and paste the contents of [`apps-script/Code.gs`](apps-script/Code.gs).
3. Click **Deploy → New deployment**.
4. Click the gear icon next to "Select type" and choose **Web app**.
5. Set the following:
   - **Description**: `FrameForge Waitlist`
   - **Execute as**: `Me`
   - **Who has access**: `Anyone`
6. Click **Deploy**.
7. Authorize the script when prompted (review permissions → allow).
8. Copy the **Web app URL** — it looks like `https://script.google.com/macros/s/XXXXXXXXX/exec`.

### 3. Connect the frontend

In `index.html`, find this line in the waitlist form:

```html
data-endpoint="YOUR_APPS_SCRIPT_URL_HERE"
```

Replace `YOUR_APPS_SCRIPT_URL_HERE` with the Web app URL you copied in step 2.

### 4. Deploy to GitHub Pages

1. Push your changes to the `main` branch.
2. Go to **Settings → Pages** in your GitHub repository.
3. Set the source to **Deploy from a branch** and select `main` / `/ (root)`.
4. Your site will be live at `https://<username>.github.io/<repo>/`.

## How the waitlist works

**Frontend (`index.html`)**:
- Validates email format on the client before sending.
- Shows inline error messages for empty, invalid, or duplicate emails.
- Displays a loading state while the request is in flight.
- Remembers signups in `localStorage` to prevent repeat submissions from the same browser.
- Falls back gracefully if the Apps Script URL hasn't been configured yet (shows a success message without submitting).

**Backend (`apps-script/Code.gs`)**:
- Receives POST requests with a JSON body containing an `email` field.
- Validates the email format server-side.
- Checks for duplicate emails in the sheet before adding.
- Appends a new row with the email, ISO timestamp, and source tag.
- Returns JSON responses with appropriate status codes (200, 400, 409, 500).

## Updating the Apps Script

If you change `Code.gs`, redeploy in Apps Script:

1. Go to **Extensions → Apps Script** in your Google Sheet.
2. Paste the updated code.
3. Click **Deploy → Manage deployments**.
4. Click the pencil icon on your deployment, set **Version** to `New version`, and click **Deploy**.

The Web app URL stays the same — no frontend changes needed.
