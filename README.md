# July Effect — Website

Plain HTML, CSS and JavaScript. No build step, no framework, no database.
Upload the whole folder to any static host and it works.

```
index.html                  the site (home, all work, project pages)
assets/css/style.css        all styling
assets/js/site-config.js    studio text, contact, socials, team, services, role-badge wording
assets/js/projects.js       ← THE PORTFOLIO. Add/edit/remove projects here
assets/js/main.js           site logic (no need to touch)
assets/img/                 logo, hero, share image, icons
assets/img/work/            your own project thumbnails go here
assets/img/team/            team photos go here
```

## Every project shows what July Effect did

Each project has a `scope`:

| scope          | badge on the site  | use it for                                  |
|----------------|--------------------|---------------------------------------------|
| `"production"` | Full Production    | You produced it end to end (orange badge)   |
| `"vfx"`        | VFX                | VFX on someone else's production            |
| `"motion"`     | Motion Graphics    | You designed and animated it                |

Add detail with `role`, e.g. `role: "Compositing & clean-up"`. It shows on the
project page as "July Effect's role: VFX · Compositing & clean-up".
Badge wording lives in `site-config.js → scopes` if you want to rename it.

## Add a new project (2 minutes)

1. Open `assets/js/projects.js`.
2. Copy any `{ ... },` block and paste it where you want it to appear.
3. Change the details. Save.

```js
{
  title: "New Launch Film",
  client: "Brand Name",
  scope: "production",
  category: "Ad Film",
  year: "2026",
  video: "https://drive.google.com/file/d/FILE_ID/view",
  featured: true,
  role: "Concept, shoot, edit & grade",
  description: "One or two sentences about the project."
},
```

## The `video` link: YouTube, Google Drive, Instagram or Vimeo

Paste the link as it is. The site works out the player and thumbnail.

- **YouTube** (`watch?v=`, `youtu.be/`, `/shorts/`): thumbnail is automatic. `&t=67s` start times are kept.
- **Google Drive**: in Drive, right-click the file → Share → General access → **Anyone with the link → Viewer**.
  Copy the link and paste it. Thumbnail is automatic once it's shared like that.
  If a file is private, visitors see a "Watch on Google Drive" link that asks them to sign in.
- **Instagram reels**: plays inside the page. Instagram doesn't give a thumbnail,
  so add one: save an image to `assets/img/work/` and set `thumbnail: "assets/img/work/name.jpg"`.
- **Vimeo**: plays inside the page; add a `thumbnail`.

**Swapping a client's YouTube link for your own Drive copy:** change only the
`video:` line. Title, badge and page address stay the same.

## Enquiry form → Netlify dashboard

The form is a 4-step "Build your shot" quiz: what they're making → when → budget →
name, WhatsApp (required), email and notes (optional). The same form opens as a pop-up from
"Get a consultation" (floating bar on phones, pill bottom-left on desktop), from "Roll Camera" in the header,
and from "Want a film like this?" on every project page (which also records that project as a reference).

Submissions appear in Netlify → Forms → **enquiry** with these fields:
service, timeline, budget, name, phone, email, message, reference.
Turn on email alerts in Netlify → Project configuration → Notifications → Form submission notifications.

## Before going live — checklist

In `assets/js/site-config.js`:
- [ ] Real email, phone and WhatsApp number (replace the `[...]` placeholders)
- [ ] Instagram / YouTube / LinkedIn links
- [ ] Team names, roles and photos
- [ ] `showreel` → your actual studio showreel
In `assets/js/projects.js`:
- [ ] `role` detail per project where you know it
- [ ] `thumbnail` images for the 3 Instagram projects
In `index.html` (after you have a domain):
- [ ] Change `og:image` and `og:url` to full `https://yourdomain/...` addresses so WhatsApp shows the preview card
