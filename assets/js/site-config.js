/* =========================================================
   JULY EFFECT — SITE SETTINGS
   Edit the values below. Anything in [square brackets] is a
   placeholder that should be replaced before going live.
   ========================================================= */
window.SITE = {
  name: "July Effect",
  eyebrow: "A video production studio",
  headline: ["Stories for a", "Brighter Tomorrow"],
  intro:
    "A Chennai & Hyderabad based creative studio making films, branded content, CGI and digital stories for people, brands and a more sustainable future.",
  cities: ["Chennai", "Hyderabad"],
  // Shown in the hero strip and footer. Linktree says "Chennai | Hyderabad | Remote".
  locations: ["Chennai", "Hyderabad", "Remote"],

  // Showreel button opens this video. Paste a YouTube, Google Drive or Vimeo link.
  // Placeholder for now: replace with your real studio showreel.
  showreel: "https://www.youtube.com/watch?v=QRklQGDKlHY",

  // Role badges. Every project in projects.js has scope: "production", "vfx" or "motion".
  // Change the wording here and every card and project page updates.
  scopes: {
    production: { label: "Full Production", note: "July Effect produced this film end to end: concept, shoot and post." },
    vfx:        { label: "VFX", note: "July Effect handled the visual effects. The film was produced by the client or their agency." },
    motion:     { label: "Motion Graphics", note: "July Effect designed and animated this film." }
  },

  // ---- Contact details (replace placeholders) ----
  contact: {
    email: "[hello@yourdomain.com]",
    phone: "[+91 00000 00000]",
    whatsapp: "", // e.g. "919876543210" (country code + number, digits only)
    studios: ["Chennai, Tamil Nadu", "Hyderabad, Telangana"]
  },

  // Leave a link empty ("") to hide that icon.
  socials: {
    instagram: "",
    youtube: "",
    linkedin: "",
    behance: ""
  },

  // Enquiry form.
  //   "netlify"   → submissions appear in your Netlify dashboard (Forms tab)
  //                 with email alerts. Works once the site is hosted on Netlify.
  //   "formspree" → paste your Formspree endpoint in formEndpoint.
  //   "email"     → opens the visitor's email app (not reliable inside Instagram/WhatsApp).
  formProvider: "netlify",
  formEndpoint: "",

  services: [
    { icon: "camera", title: "Video Production", text: "End-to-end film & content",
      detail: "Concept, pre-production, shoot and post for brand films, ads and digital campaigns." },
    { icon: "cube", title: "CGI & VFX", text: "From concept to final frame",
      detail: "Compositing, 3D, set extensions, clean-up and title animation that sits invisibly in the cut." },
    { icon: "layers", title: "Content for Brands", text: "Reels, YouTube, Campaigns",
      detail: "Always-on social content, campaign cut-downs and launch films built for each platform." },
    { icon: "leaf", title: "Creative Development", text: "Ideas, Scripts & Direction",
      detail: "Treatments, scripts, storyboards and direction that start from what the brand needs to say." }
  ],

  about: {
    title: "A studio built where craft meets the future",
    body: [
      "July Effect is a creative production and post-production studio working out of Chennai and Hyderabad, and remotely wherever the project is. We make brand films, ads and digital campaigns, and we deliver VFX and motion graphics for streaming platforms, agencies and music labels.",
      "Every project on this site is labelled with what we actually did on it, from full production to VFX on someone else's shoot. Planning, camera and post sit under one roof, so the idea stays intact from the first script draft to the final grade."
    ],
    principles: [
      { title: "Story first", text: "Every frame has a job. We cut anything that does not move the story or the brand forward." },
      { title: "Craft at every stage", text: "Camera, VFX and edit are planned together, so post is an extension of the shoot, not a rescue." },
      { title: "Built to last", text: "Work that still feels right a year later, made with lean crews and responsible production." }
    ]
  },

  // Team. Add, remove or reorder people. photo is optional
  // (put the image in assets/img/team/ and write its path).
  team: [
    { name: "[Name]", role: "Founder & Director", photo: "" },
    { name: "[Name]", role: "VFX & Post-Production Lead", photo: "" },
    { name: "[Name]", role: "Producer", photo: "" }
  ]
};
