/* =========================================================
   JULY EFFECT — PROJECTS
   This is the only file you need to edit to add, change or
   remove work. Each project is one { ... } block.

   FIELDS
     title       Project name (required)
     client      Brand, label, platform or artist
     scope       What July Effect did. One of:
                   "production"  → badge "Full Production"
                   "vfx"         → badge "VFX"
                   "motion"      → badge "Motion Graphics"
                 (Badge wording lives in site-config.js → scopes)
     role        Optional detail shown on the project page,
                 e.g. "Compositing & clean-up", "Concept, shoot, edit & grade"
     category    Type of film: "Brand Film", "Ad Film", "Music Video",
                 "Promo", "Corporate". Becomes a filter on the Work page.
     year        e.g. "2025" (optional)
     video       Paste ANY of these:
                   YouTube   https://www.youtube.com/watch?v=...   (or /shorts/...)
                   Drive     https://drive.google.com/file/d/FILE_ID/view
                   Instagram https://www.instagram.com/reel/CODE/
                   Vimeo     https://vimeo.com/123456789
                 Google Drive: set the file to "Anyone with the link → Viewer",
                 otherwise visitors can't play it.
     thumbnail   Optional image, e.g. "assets/img/work/malabar.jpg".
                 YouTube and Drive thumbnails load automatically;
                 Instagram ones don't, so add an image for those.
     featured    true = show on the home page "Selected Work".
                 The FIRST featured project is the large card.
     description Short paragraph for the project page
     credits     Optional list: [["Director","Name"], ["DOP","Name"]]

   ORDER: projects appear on the Work page in the order written here.

   REPLACING A CLIENT LINK WITH YOUR OWN DRIVE COPY:
   change only the `video:` line. Everything else stays the same.
   ========================================================= */
window.PROJECTS = [
  /* =========== FULL PRODUCTION =========== */
  {
    title: "Traditional 3BHK at Rajapushpa Imperia",
    client: "Apricus Homes",
    scope: "production",
    category: "Brand Film",
    video: "https://www.youtube.com/watch?v=QRklQGDKlHY&t=67s",
    featured: true,
    role: "",
    description: "An interior walkthrough of a traditional 3BHK home in Hyderabad for Apricus Homes, built around its pooja room and handcrafted details."
  },
  {
    title: "Elegant Living at Gem Nakshatra",
    client: "Apricus Homes",
    scope: "production",
    category: "Brand Film",
    video: "https://www.youtube.com/watch?v=73iCcRuClLc&t=6s",
    featured: true,
    role: "",
    description: "An interior film for Apricus Homes showing a luxury home at Gem Nakshatra, Kokapet, Hyderabad."
  },
  {
    title: "A Home They Dreamed Of",
    client: "Apricus Homes",
    scope: "production",
    category: "Brand Film",
    video: "https://www.youtube.com/watch?v=6KCSnNSoQXc",
    featured: true,
    role: "",
    description: "A homeowner story for Apricus Homes at Aparna Zicon, Hyderabad, about the home a family imagined and the one they now live in."
  },

  /* =========== VFX — BRAND CAMPAIGNS & PROMOS =========== */
  {
    title: "Samantha's Day In",
    client: "ChatGPT",
    scope: "vfx",
    category: "Ad Film",
    video: "https://www.youtube.com/watch?v=BYIuWqt2KF4",
    featured: true,
    description: "A ChatGPT film featuring Samantha spending a day in with the assistant."
  },
  {
    title: "A Few Questions for ChatGPT",
    client: "ChatGPT",
    scope: "vfx",
    category: "Ad Film",
    video: "https://www.youtube.com/watch?v=oulEjnDc8i0",
    description: "A ChatGPT film featuring Lakshmi Manchu."
  },
  {
    title: "Super Subbu × Dinesh Karthik",
    client: "Netflix India",
    scope: "vfx",
    category: "Promo",
    video: "https://www.youtube.com/watch?v=F-5M0fQE3XE",
    featured: true,
    description: "A Netflix India promo for Super Subbu in which Dinesh Karthik explains sex education in cricket terms."
  },
  {
    title: "Vishwanath & Sons",
    client: "Netflix India",
    scope: "vfx",
    category: "Promo",
    video: "https://youtube.com/shorts/Eq3R6Vsx7qE",
    featured: true,
    description: "A vertical promo for Vishwanath & Sons on Netflix India, starring Suriya and Mamitha Baiju."
  },
  {
    title: "Malabar Gold & Diamonds",
    client: "Malabar Gold & Diamonds",
    scope: "vfx",
    category: "Ad Film",
    video: "https://www.instagram.com/reel/DelSQ1-IASy/",
    description: "A digital film for Malabar Gold & Diamonds."
  },
  {
    title: "How To Aura Farm",
    client: "Hiphop Tamizha",
    scope: "vfx",
    category: "Promo",
    video: "https://www.youtube.com/watch?v=MIjSaRh8txk",
    description: "How To Aura Farm, featuring Hiphop Tamizha."
  },
  {
    title: "Raasi Palan with Vikkals",
    client: "Netflix India",
    scope: "vfx",
    category: "Promo",
    video: "https://www.youtube.com/watch?v=K8j5A_cI-vc&t=39s",
    description: "Netflix India's October horoscope of Tamil recommendations, presented with Vikkals."
  },
  {
    title: "Discover Sri Lanka",
    client: "Satkinn Holidays",
    scope: "vfx",
    category: "Ad Film",
    video: "https://www.youtube.com/watch?v=jt5XEOSPdFs",
    description: "A travel film inviting viewers to discover Sri Lanka with Satkinn Holidays."
  },
  {
    title: "Tender Coco",
    client: "Tender Coco",
    scope: "vfx",
    category: "Ad Film",
    video: "https://www.instagram.com/reel/De1uSJmvuEN/",
    description: "A digital ad film for Tender Coco."
  },
  {
    title: "10x Freshness × Pushpa 2",
    client: "Comfort",
    scope: "vfx",
    category: "Ad Film",
    video: "https://www.youtube.com/watch?v=7YsacApzJqU",
    featured: true,
    description: "A 15-second Tamil spot for Comfort's 10x Freshness campaign, tied in with the release of Pushpa 2."
  },
  {
    title: "Mouth Matters",
    client: "Total Orocare Foundation",
    scope: "vfx",
    category: "Ad Film",
    year: "2024",
    video: "https://www.instagram.com/reel/DB3O0iSSSVq/",
    description: "Launch film for the Mouth Matters 2024 campaign."
  },
  {
    title: "Sri Balagopalan Jewellery Mart",
    client: "Sri Balagopalan Jewellery Mart",
    scope: "vfx",
    category: "Ad Film",
    video: "https://www.youtube.com/watch?v=hqRAm7Blgqc",
    description: "Brand TVC for Sri Balagopalan Jewellery Mart."
  },
  {
    title: "ON&ON Hair Colour Shampoo",
    client: "ON&ON",
    scope: "vfx",
    category: "Ad Film",
    video: "https://www.youtube.com/watch?v=G-p_x12l5Pg",
    description: "Product film for ON&ON hair colour shampoo."
  },

  /* =========== VFX — MUSIC VIDEOS =========== */
  {
    title: "Aeroplane",
    client: "Paal Dabba × Think Indie",
    scope: "vfx",
    category: "Music Video",
    video: "https://www.youtube.com/watch?v=LT9kzvUfvsk",
    featured: true,
    description: "Music video for Aeroplane by Paal Dabba with Ananya, released on Think Indie."
  },
  {
    title: "Devaloka Sundari",
    client: "Siri Xander",
    scope: "vfx",
    category: "Music Video",
    video: "https://www.youtube.com/watch?v=ZRy8G9WK0eg",
    description: "Official music video for Devaloka Sundari, a Tamil indie pop single."
  },
  {
    title: "Akkenam — Title Song",
    client: "Divo Music",
    scope: "vfx",
    category: "Music Video",
    video: "https://www.youtube.com/watch?v=YAI0IcL3_1I",
    description: "Title song video for the film Akkenam."
  },
  {
    title: "Peekachu",
    client: "SSK Brothers Production",
    scope: "vfx",
    category: "Music Video",
    video: "https://www.youtube.com/watch?v=ETMxZezJgbM",
    description: "Music video for Peekachu, featuring Arshad Khan."
  },
  {
    title: "Kaadhal Yaathiriye",
    client: "Think Indie",
    scope: "vfx",
    category: "Music Video",
    video: "https://www.youtube.com/watch?v=wPiD8kJcgyg",
    description: "Music video for Kaadhal Yaathiriye from Think Indie."
  },
  {
    title: "What The Heck",
    client: "The She Unit × MR NURA",
    scope: "vfx",
    category: "Music Video",
    video: "https://www.youtube.com/watch?v=028tNPCfEIo",
    description: "Official music video for What The Heck."
  },
  {
    title: "Thakka Thai",
    client: "Cheers Music",
    scope: "vfx",
    category: "Music Video",
    video: "https://www.youtube.com/watch?v=22ONQya9b_o",
    description: "Official music video for Thakka Thai from Ritual."
  },
  {
    title: "Kareena",
    client: "RAKET × Flameboi",
    scope: "vfx",
    category: "Music Video",
    video: "https://www.youtube.com/watch?v=px4YsGmEEWA",
    featured: true,
    description: "Music video for Kareena, featuring Jaanyaa Joshi."
  },
  {
    title: "Thanga Sela",
    client: "Independent",
    scope: "vfx",
    category: "Music Video",
    video: "https://www.youtube.com/watch?v=pHLflAT9hnk",
    description: "Music video for Thanga Sela."
  },
  {
    title: "Chikku Maaney",
    client: "Sathyaprakash Originals",
    scope: "vfx",
    category: "Music Video",
    video: "https://www.youtube.com/watch?v=FOOrtKxnVpI",
    description: "Music video for Chikku Maaney."
  },
  {
    title: "Enna Kanakku Makka",
    client: "Keys & Verses Collective",
    scope: "vfx",
    category: "Music Video",
    video: "https://www.youtube.com/watch?v=pBTjqdFwl24",
    description: "Official music video by Keys & Verses Collective with Makka Band."
  },

  /* =========== MOTION GRAPHICS — CORPORATE =========== */
  {
    title: "CAMSpay",
    client: "CAMSpay",
    scope: "motion",
    category: "Corporate",
    video: "https://www.youtube.com/watch?v=VBRKUzvysfw",
    description: "Motion graphics explainer for CAMSpay."
  },
  {
    title: "Start Your Business From Home",
    client: "Encirckle",
    scope: "motion",
    category: "Corporate",
    video: "https://www.youtube.com/watch?v=-Ch6XskKWk4",
    description: "Motion graphics explainer for Encirckle."
  },
  {
    title: "Person Search API",
    client: "Crustdata",
    scope: "motion",
    category: "Corporate",
    video: "https://www.youtube.com/watch?v=1Jd6wWcf1Rk",
    description: "Product explainer for Crustdata's Person Search API."
  }
];
