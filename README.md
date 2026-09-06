# Zelous for Jesus Church Website

A mobile-friendly static church website built with HTML, CSS and JavaScript.

## Pages included

- `index.html` - Home page with auto-scrolling hero images, upcoming event, prayer request section, mission section, ministries, latest sermon and Bible resources
- `about.html` - About us page
- `contact.html` - Contact page
- `gallery.html` - View-only public gallery
- `sermons.html` - Sermons page
- `events.html` - Events page with month filter
- `bible-resources.html` - Bible resource links that open in a separate tab
- `ministries.html` - Ministries overview
- `ministry-children.html`, `ministry-youth.html`, `ministry-fellowship.html`, `ministry-outreach.html` - Dedicated ministry pages
- `prayer.html` - Prayer request form
- `admin.html` - Hidden admin page. This is not linked in the public menu.

## Admin page

Open this directly:

```text
admin.html
```

From there you can:

- Turn the live red button on/off
- Add/delete events
- Highlight one event on the home page
- View/filter/sort prayer requests
- Mark prayer requests as answered
- Export prayer requests as CSV, which can be opened in Excel
- Update latest sermon YouTube link
- Update Bible resource links
- Update social media links
- Add, upload and delete gallery photos from the hidden admin page

## Important note about prayer requests

This is a static front-end version. The prayer form saves requests in browser `localStorage`, so requests are visible on `admin.html` on the same browser/device only.

Events, gallery updates and other admin edits are also saved in browser `localStorage` until they are published. They will not automatically appear on another device.

To publish an event or gallery change for everyone:

1. Make the change in `admin.html`.
2. Open **Site settings** and select **Download site-data.json**.
3. Replace `assets/data/site-data.json` in the project with the downloaded file.
4. Commit and push/redeploy the project. Visitors will then receive the published content on every device.

For automatic multi-device editing, replace this static storage flow with a secured backend or CMS such as Supabase, Firebase, SharePoint, Airtable, or an API/database. The admin page currently has no authentication, so it should not be exposed publicly without protection.

For a real public church website, connect the prayer request form to one of these:

- SharePoint list
- Google Sheet using Apps Script
- Airtable
- Firebase / Supabase
- A small backend API with a database
- A form service such as Formspree or Netlify Forms

The admin page has CSV export so the prayer list can be backed up into Excel.

## How to customise

### Change text and default content

Edit:

```text
assets/js/data.js
```

This file contains default sample content for events, ministries, sermons, Bible links and social media.

### Change colours and styling

Edit:

```text
assets/css/styles.css
```

The main colour variables are at the top of the file:

```css
:root {
  --primary: #2f80ed;
  --accent: #f2994a;
  --deep: #18233f;
}
```

### Replace images

Replace the files in:

```text
assets/images/
```

Keep the same file names, or update the image paths in `assets/js/data.js`.

## How to run locally

You can open `index.html` directly in a browser.

Better option: run a simple local server from this folder:

```bash
python -m http.server 8000
```

Then open:

```text
http://localhost:8000
```

## Hosting options

This website can be hosted on:

- GitHub Pages
- Netlify
- Vercel
- Azure Static Web Apps
- Any normal web hosting provider

For production, add proper security to the admin page and connect forms to a backend.
