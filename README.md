# Zelous for Jesus Church Website

A mobile-friendly static church website built with HTML, CSS and JavaScript.

## Pages included

- `index.html` - Home page with auto-scrolling hero images, upcoming event, prayer request section, mission section, ministries, latest sermon and Bible resources
- `about.html` - About us page
- `contact.html` - Contact page
- `gallery.html` - Gallery page
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

## Important note about prayer requests

This is a static front-end version. The prayer form saves requests in browser `localStorage`, so requests are visible on `admin.html` on the same browser/device only.

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
