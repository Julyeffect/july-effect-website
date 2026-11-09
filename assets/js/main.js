/* =========================================================
   JULY EFFECT — site logic
   You normally don't need to edit this file. Content lives in
   site-config.js and projects.js.
   Pages are routed with the URL hash so the site works on any
   static host:  #          home
                 #work      all projects
                 #p-<slug>  a single project
   ========================================================= */
(function () {
  "use strict";
  var SITE = window.SITE || {};
  var RAW = window.PROJECTS || [];
  var SCOPES = SITE.scopes || {
    production: { label: "Full Production", note: "" },
    vfx: { label: "VFX", note: "" },
    motion: { label: "Motion Graphics", note: "" }
  };
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var esc = function (s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  };
  var isPlaceholder = function (v) { return !v || /^\[.*\]$/.test(String(v).trim()); };
  var clean = function (v) { return String(v || "").replace(/[\[\]]/g, "").trim(); };
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Video sources: YouTube, Google Drive, Instagram, Vimeo ---------- */
  function parseStart(url) {
    var m = String(url).match(/[?&#](?:t|start)=(?:(\d+)h)?(?:(\d+)m)?(\d+)s?/);
    if (!m) return 0;
    return (+m[1] || 0) * 3600 + (+m[2] || 0) * 60 + (+m[3] || 0);
  }
  function resolveMedia(url, forceVertical) {
    url = String(url || "").trim();
    if (!url) return null;
    var m;
    if (/^[\w-]{11}$/.test(url) || /youtu\.?be/.test(url)) {
      m = url.match(/(?:v=|youtu\.be\/|embed\/|shorts\/|live\/)([\w-]{11})/);
      var id = m ? m[1] : (/^[\w-]{11}$/.test(url) ? url : "");
      if (!id) return null;
      var start = parseStart(url);
      return {
        kind: "youtube", id: id, host: "YouTube",
        vertical: forceVertical || /\/shorts\//.test(url),
        watch: "https://www.youtube.com/watch?v=" + id + (start ? "&t=" + start + "s" : ""),
        embed: "https://www.youtube-nocookie.com/embed/" + id + "?autoplay=1&rel=0&modestbranding=1&playsinline=1" + (start ? "&start=" + start : ""),
        // WebP first (about half the size), then JPEG, then the always-available smaller size
        thumbs: ["https://i.ytimg.com/vi_webp/" + id + "/maxresdefault.webp", "https://i.ytimg.com/vi/" + id + "/maxresdefault.jpg", "https://i.ytimg.com/vi/" + id + "/hqdefault.jpg"]
      };
    }
    if (/drive\.google\.com/.test(url)) {
      m = url.match(/\/d\/([\w-]{10,})/) || url.match(/[?&]id=([\w-]{10,})/);
      if (!m) return { kind: "link", host: "Google Drive", watch: url, thumbs: [] };
      return {
        kind: "drive", id: m[1], host: "Google Drive", vertical: !!forceVertical,
        watch: "https://drive.google.com/file/d/" + m[1] + "/view",
        embed: "https://drive.google.com/file/d/" + m[1] + "/preview",
        thumbs: ["https://drive.google.com/thumbnail?id=" + m[1] + "&sz=w1280"]
      };
    }
    if (/instagram\.com/.test(url)) {
      m = url.match(/instagram\.com\/(?:[\w.]+\/)?(reel|reels|p|tv)\/([\w-]+)/);
      if (!m) return { kind: "link", host: "Instagram", watch: url, thumbs: [] };
      var type = m[1] === "reels" ? "reel" : m[1];
      return {
        kind: "instagram", id: m[2], host: "Instagram", vertical: true,
        watch: "https://www.instagram.com/" + type + "/" + m[2] + "/",
        embed: "https://www.instagram.com/" + type + "/" + m[2] + "/embed/",
        thumbs: []
      };
    }
    if (/vimeo\.com/.test(url)) {
      m = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
      if (!m) return { kind: "link", host: "Vimeo", watch: url, thumbs: [] };
      return {
        kind: "vimeo", id: m[1], host: "Vimeo", vertical: !!forceVertical,
        watch: "https://vimeo.com/" + m[1],
        embed: "https://player.vimeo.com/video/" + m[1] + "?autoplay=1&playsinline=1",
        thumbs: []
      };
    }
    return { kind: "link", host: "the original site", watch: url, thumbs: [] };
  }

  /* ---------- Normalise projects ---------- */
  function slugify(s) {
    return String(s).toLowerCase().normalize("NFKD").replace(/[̀-ͯ]/g, "")
      .replace(/×/g, "x").replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  }
  var used = {};
  var PROJECTS = RAW.filter(function (p) { return p && p.title; }).map(function (p) {
    var slug = p.slug ? slugify(p.slug) : slugify(p.title);
    while (used[slug]) slug += "-2";
    used[slug] = true;
    var media = resolveMedia(p.video || p.link, p.vertical);
    var scope = SCOPES[p.scope] ? p.scope : "vfx";
    var thumbs = (p.thumbnail ? [p.thumbnail] : []).concat(media ? media.thumbs : []);
    return {
      slug: slug, title: p.title, client: p.client || "", category: p.category || "Film",
      scope: scope, scopeLabel: SCOPES[scope].label, scopeNote: SCOPES[scope].note || "",
      year: p.year || "", role: p.role || "", description: p.description || "",
      credits: Array.isArray(p.credits) ? p.credits : [], featured: !!p.featured,
      media: media, thumbs: thumbs
    };
  });
  var bySlug = {};
  PROJECTS.forEach(function (p) { bySlug[p.slug] = p; });

  /* ---------- Thumbnails with graceful fallback ---------- */
  function fallbackHTML(p) {
    return '<div class="card-fallback"><span>' + esc(p.client || p.title) + "</span></div>";
  }
  function thumbHTML(p, eager) {
    if (!p.thumbs.length) return fallbackHTML(p);
    return '<img src="' + esc(p.thumbs[0]) + '" alt="" ' + (eager ? 'fetchpriority="high" ' : 'loading="lazy" ') +
      'decoding="async" referrerpolicy="no-referrer" data-next="' + esc(p.thumbs.slice(1).join("|")) + '" data-label="' + esc(p.client || p.title) + '">';
  }
  // Step through the thumbnail list (e.g. maxres → hq), then fall back to a designed tile.
  function onThumbFail(img) {
    var rest = (img.getAttribute("data-next") || "").split("|").filter(Boolean);
    if (rest.length) {
      img.setAttribute("data-next", rest.slice(1).join("|"));
      img.src = rest[0];
      return;
    }
    var d = document.createElement("div");
    d.className = "card-fallback";
    d.innerHTML = "<span>" + esc(img.getAttribute("data-label")) + "</span>";
    img.replaceWith(d);
  }
  document.addEventListener("error", function (e) {
    if (e.target.tagName === "IMG" && e.target.hasAttribute("data-next")) onThumbFail(e.target);
  }, true);
  document.addEventListener("load", function (e) {
    var t = e.target;
    // YouTube serves a 120px grey placeholder when a size is missing
    if (t.tagName === "IMG" && t.hasAttribute("data-next") && t.naturalWidth > 0 && t.naturalWidth <= 120) onThumbFail(t);
  }, true);

  function badgeHTML(p) {
    return '<span class="badge badge-' + p.scope + '">' + esc(p.scopeLabel) + "</span>";
  }
  function cardHTML(p, i) {
    var meta = [p.client, p.category].filter(Boolean).join(" · ");
    return '<a class="card" style="--i:' + i + '" href="#p-' + p.slug + '">' +
      thumbHTML(p, false) +
      badgeHTML(p) +
      '<span class="vf" aria-hidden="true"></span>' +
      '<span class="card-body"><h3 class="card-title">' + esc(p.title) + '</h3><p class="card-meta">' + esc(meta) + "</p></span>" +
      '<span class="play" aria-hidden="true"></span></a>';
  }

  /* ---------- Static content from config ---------- */
  var ICONS = {
    camera: '<svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"><circle cx="11" cy="10" r="5"/><circle cx="22" cy="10" r="5"/><rect x="5" y="16" width="22" height="16" rx="2"/><path d="M27 21l8-4v14l-8-4z"/><circle cx="11" cy="24" r="2"/></svg>',
    cube: '<svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"><path d="M20 4l14 8v16l-14 8-14-8V12z"/><path d="M6 12l14 8 14-8M20 20v16"/></svg>',
    layers: '<svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"><path d="M20 6l15 8-15 8-15-8z"/><path d="M5 20l15 8 15-8"/><path d="M5 26l15 8 15-8"/></svg>',
    leaf: '<svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M34 6C16 6 6 15 6 28c0 2 .3 4 1 6 13 0 27-8 27-28z"/><path d="M7 34C14 24 21 18 28 13"/></svg>'
  };
  var SOCIAL_ICONS = {
    instagram: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor"/></svg>',
    youtube: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><rect x="2.5" y="5.5" width="19" height="13" rx="4"/><path d="M10 9.2v5.6l4.8-2.8z" fill="currentColor"/></svg>',
    linkedin: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M4.5 9h3v11h-3zM6 3.8a1.8 1.8 0 110 3.6 1.8 1.8 0 010-3.6zM10 9h2.9v1.5h.1c.4-.8 1.4-1.7 3-1.7 3.1 0 3.7 2 3.7 4.7V20h-3v-5.6c0-1.3 0-3-1.9-3s-2.1 1.4-2.1 2.9V20H10z"/></svg>',
    behance: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8.6 11.3c.8-.4 1.3-1 1.3-2 0-2-1.5-2.6-3.3-2.6H2v10.6h4.8c1.9 0 3.6-.9 3.6-3 0-1.3-.6-2.3-1.8-3zM4.3 8.5h2c.8 0 1.5.2 1.5 1.1s-.6 1.2-1.4 1.2H4.3zm2.2 6.9H4.3v-2.9h2.3c.9 0 1.5.4 1.5 1.4s-.7 1.5-1.6 1.5zM15 6.9h5v1.3h-5zm2.6 2.2c-2.4 0-4 1.7-4 4 0 2.4 1.5 4 4 4 1.9 0 3.1-.8 3.7-2.6h-2c-.2.6-1 1-1.6 1-1.2 0-1.9-.7-1.9-1.9h5.6c.2-2.5-1.1-4.5-3.8-4.5zm-1.8 3.2c.1-1 .7-1.6 1.7-1.6s1.5.6 1.6 1.6z"/></svg>'
  };
  var WA_ICON = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 00-8.6 15.1L2 22l5-1.3A10 10 0 1012 2zm0 18.2a8.2 8.2 0 01-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1112 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 01-3.3-2.9c-.2-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 00-.7.3 3 3 0 00-.9 2.2 5.2 5.2 0 001.1 2.8 11.9 11.9 0 004.6 4c1.7.7 2.4.8 3.2.7.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.3-.2-.5-.3z"/></svg>';

  function uniqueClients() {
    var out = [];
    PROJECTS.forEach(function (p) {
      var c = p.client.replace(/\s*\(.*\)$/, "").split(" × ")[0].trim();
      if (c && c !== "Independent" && out.indexOf(c) < 0) out.push(c);
    });
    return out;
  }

  function fillStatic() {
    document.querySelectorAll("[data-site]").forEach(function (el) { el.textContent = SITE[el.getAttribute("data-site")] || ""; });
    var hl = SITE.headline || ["Stories for a", "Brighter Tomorrow"];
    $("#heroTitle").innerHTML = hl.map(function (l, i) {
      return '<span class="line"><span>' + esc(l) + (i === hl.length - 1 ? '<span class="slash" aria-hidden="true">/</span>' : "") + "</span></span>";
    }).join("");
    var locs = SITE.locations || SITE.cities || [];
    $("#hudCities").textContent = locs.join(" / ");

    $("#servicesGrid").innerHTML = (SITE.services || []).map(function (s) {
      return '<div class="service"><span class="service-icon">' + (ICONS[s.icon] || ICONS.camera) + '</span><div><h3>' + esc(s.title) +
        "</h3><p>" + esc(s.text) + "</p>" + (s.detail ? '<p class="detail">' + esc(s.detail) + "</p>" : "") + "</div></div>";
    }).join("");

    var a = SITE.about || {};
    $("[data-about=title]").textContent = a.title || "";
    $("#aboutBody").innerHTML = (a.body || []).map(function (p) { return "<p>" + esc(p) + "</p>"; }).join("");
    $("#principles").innerHTML = (a.principles || []).map(function (p) {
      return '<div class="principle"><h3>' + esc(p.title) + "</h3><p>" + esc(p.text) + "</p></div>";
    }).join("");

    var clients = uniqueClients();
    var one = clients.map(function (c) { return "<span>" + esc(c) + "</span>"; }).join("");
    $("#clientTrack").innerHTML = one + one.replace(/<span>/g, '<span aria-hidden="true">');

    $("#stats").innerHTML =
      "<div><dt>" + PROJECTS.length + "<sup>+</sup></dt><dd>Films delivered</dd></div>" +
      "<div><dt>" + clients.length + "</dt><dd>Brands &amp; artists</dd></div>" +
      "<div><dt>" + (SITE.cities || []).length + "</dt><dd>Studio cities</dd></div>";

    var team = SITE.team || [];
    $("#teamWrap").hidden = !team.length;
    $("#teamGrid").innerHTML = team.map(function (m) {
      var name = isPlaceholder(m.name) ? "Team member" : m.name;
      var initials = isPlaceholder(m.name) ? "" : m.name.split(/\s+/).map(function (w) { return w[0]; }).slice(0, 2).join("").toUpperCase();
      return '<div class="member"><div class="member-photo">' +
        (m.photo ? '<img src="' + esc(m.photo) + '" alt="' + esc(name) + '" loading="lazy">' : '<span class="initials">' + esc(initials) + "</span>") +
        "</div><h3>" + esc(name) + "</h3><p>" + esc(m.role) + "</p></div>";
    }).join("");

    // contact
    var c = SITE.contact || {};
    var rows = [];
    if (c.email) rows.push('<li><small>Email</small><span><a href="mailto:' + esc(clean(c.email)) + '">' + esc(c.email) +
      '</a><button class="copy-btn" type="button" data-copy="' + esc(clean(c.email)) + '">Copy</button></span></li>');
    if (c.phone) rows.push('<li><small>Phone</small><span><a href="tel:' + esc(clean(c.phone).replace(/[^\d+]/g, "")) + '">' + esc(c.phone) +
      '</a><button class="copy-btn" type="button" data-copy="' + esc(clean(c.phone)) + '">Copy</button></span></li>');
    if (c.whatsapp) {
      var waLink = "https://wa.me/" + c.whatsapp + "?text=" + encodeURIComponent("Hi July Effect, I'd like to talk about a project.");
      rows.push('<li><small>WhatsApp</small><span class="wa-cell"><a class="btn btn-wa" href="' + esc(waLink) + '" target="_blank" rel="noopener">' +
        WA_ICON + 'Chat on WhatsApp</a><span class="wa-hint">Tap to open WhatsApp with a message ready to send.</span></span></li>');
    }
    if (c.studios && c.studios.length) rows.push("<li><small>Studios</small><span>" + c.studios.map(esc).join("<br>") + "</span></li>");
    $("#contactList").innerHTML = rows.join("");
    var s = SITE.socials || {};
    $("#socials").innerHTML = Object.keys(SOCIAL_ICONS).filter(function (k) { return s[k]; }).map(function (k) {
      return '<a href="' + esc(s[k]) + '" target="_blank" rel="noopener" aria-label="' + k + '">' + SOCIAL_ICONS[k] + "</a>";
    }).join("");

    // WhatsApp shortcut in the phone quote bar, only when a number is set
    var qdWa = $("#qdWa");
    if (c.whatsapp && qdWa) {
      qdWa.href = "https://wa.me/" + c.whatsapp + "?text=" + encodeURIComponent("Hi July Effect, I'd like to talk about a project.");
      qdWa.innerHTML = WA_ICON;
      qdWa.hidden = false;
    }

    $("#footerNote").textContent = "© " + new Date().getFullYear() + " " + (SITE.name || "July Effect") + " · " + locs.join(" · ");
  }

  /* ---------- Home grids ---------- */
  function renderHome() {
    // One large lead card + 8 cards fills the grid evenly at every width.
    var feat = PROJECTS.filter(function (p) { return p.featured; });
    feat = feat.concat(PROJECTS.filter(function (p) { return !p.featured; })).slice(0, 9);
    $("#featuredGrid").innerHTML = feat.map(cardHTML).join("");
  }

  /* ---------- Work page ---------- */
  var activeScope = "all", activeCat = "all";
  function filterBtn(group, value, label, count, active) {
    return '<button class="filter" type="button" aria-pressed="' + active + '" data-' + group + '="' + esc(value) + '">' +
      esc(label) + " <small>" + count + "</small></button>";
  }
  function renderWork() {
    var scopeCounts = {}, catCounts = {};
    PROJECTS.forEach(function (p) { scopeCounts[p.scope] = (scopeCounts[p.scope] || 0) + 1; });
    var inScope = PROJECTS.filter(function (p) { return activeScope === "all" || p.scope === activeScope; });
    inScope.forEach(function (p) { catCounts[p.category] = (catCounts[p.category] || 0) + 1; });
    if (activeCat !== "all" && !catCounts[activeCat]) activeCat = "all";

    $("#scopeFilters").innerHTML = filterBtn("scope", "all", "All work", PROJECTS.length, activeScope === "all") +
      Object.keys(SCOPES).filter(function (k) { return scopeCounts[k]; }).map(function (k) {
        return filterBtn("scope", k, SCOPES[k].label, scopeCounts[k], activeScope === k);
      }).join("");
    var cats = Object.keys(catCounts);
    $("#catFilters").innerHTML = cats.length > 1 ? filterBtn("cat", "all", "All types", inScope.length, activeCat === "all") +
      cats.map(function (c) { return filterBtn("cat", c, c, catCounts[c], activeCat === c); }).join("") : "";
    $("#catFilters").closest(".filter-block").hidden = cats.length < 2;

    var list = inScope.filter(function (p) { return activeCat === "all" || p.category === activeCat; });
    $("#allGrid").innerHTML = list.map(cardHTML).join("");
    var note = activeScope !== "all" && SCOPES[activeScope].note ? SCOPES[activeScope].note : "";
    $("#scopeNote").textContent = note;
    $("#scopeNote").hidden = !note;
    $("#workCount").textContent = PROJECTS.length + " projects · " + Object.keys(scopeCounts).length + " kinds of work";
  }

  /* ---------- Project page ---------- */
  function renderProject(slug) {
    var p = bySlug[slug];
    if (!p) { location.hash = "work"; return; }
    var idx = PROJECTS.indexOf(p);
    var next = PROJECTS[(idx + 1) % PROJECTS.length];
    var related = PROJECTS.filter(function (x) { return x !== p && x.scope === p.scope && x.category === p.category; }).slice(0, 3);
    if (related.length < 3) related = related.concat(PROJECTS.filter(function (x) { return x !== p && x.scope === p.scope && related.indexOf(x) < 0; }).slice(0, 3 - related.length));
    if (related.length < 3) related = related.concat(PROJECTS.filter(function (x) { return x !== p && related.indexOf(x) < 0; }).slice(0, 3 - related.length));
    var m = p.media;
    var bg = p.thumbs[0] || "";
    var roleText = p.role ? p.scopeLabel + " · " + p.role : p.scopeLabel;
    var meta = [["Our role", roleText], ["Client", p.client], ["Type", p.category], ["Year", p.year]]
      .concat(p.credits).filter(function (r) { return r[1]; });
    var playable = m && m.embed;

    $("#project").innerHTML =
      '<section class="project-hero">' + (bg ? '<div class="project-hero-bg" style="background-image:url(\'' + esc(bg) + '\')"></div>' : "") +
      '<div class="wrap"><a class="back" href="#work">← All work</a>' +
      '<div class="project-badges">' + badgeHTML(p) + '<span class="project-client">' + esc(p.client) + "</span></div>" +
      '<h1 class="project-title">' + esc(p.title) + "</h1>" +
      '<div class="player' + (m && m.vertical ? " vertical" : "") + (m && m.kind === "instagram" ? " ig" : "") + '" id="player">' +
      '<button class="player-cover" type="button" id="playerCover" aria-label="Play ' + esc(p.title) + '">' + thumbHTML(p, true) + '<span class="big-play"></span></button>' +
      "</div>" +
      (m ? '<p class="player-note">Video not playing? <a href="' + esc(m.watch) + '" target="_blank" rel="noopener">Watch on ' + esc(m.host) + " ↗</a></p>" : "") +
      "</div></section>" +
      '<div class="wrap"><div class="role-callout"><span class="role-dot" aria-hidden="true"></span><p><strong>July Effect\'s role: ' + esc(roleText) + ".</strong> " + esc(p.scopeNote) + "</p></div>" +
      '<div class="film-like"><div class="film-like-copy"><p class="film-like-title">Want a film like this?</p><p class="film-like-sub">Tell us about yours. 4 taps, one take.</p></div>' +
      '<button class="btn btn-orange" type="button" data-quote data-ref="' + esc(p.title + (p.client ? " — " + p.client : "")) + '"><span class="rec-dot" aria-hidden="true"></span>Get a consultation <span class="arrow">↗</span></button></div>' +
      '<div class="project-info"><dl class="meta-list">' +
      meta.map(function (r) { return "<div><dt>" + esc(r[0]) + "</dt><dd>" + esc(r[1]) + "</dd></div>"; }).join("") +
      '</dl><div class="project-desc"><p>' + esc(p.description) + '</p><button class="btn btn-dark" type="button" data-quote data-ref="' + esc(p.title + (p.client ? " — " + p.client : "")) + '">Start a similar project <span class="arrow">↗</span></button></div></div>' +
      '<div class="project-nav"><a class="next-link" href="#p-' + next.slug + '"><span><small>Next project</small><strong>' + esc(next.title) +
      '</strong></span><span class="play" aria-hidden="true"></span></a></div></div>' +
      '<section class="related wrap"><div class="section-head"><h2 class="label-xl">More ' + esc(p.scopeLabel) + '</h2><a class="link-arrow" href="#work">View All Projects <span>↗</span></a></div>' +
      '<div class="work-grid work-grid-3">' + related.map(cardHTML).join("") + "</div></section>";

    $("#playerCover").addEventListener("click", function () {
      if (playable) $("#player").innerHTML = iframe(m.embed);
      else if (m && m.watch) window.open(m.watch, "_blank", "noopener");
    });
    document.title = p.title + " — " + (SITE.name || "July Effect");
  }

  function iframe(src) {
    return '<iframe src="' + esc(src) + '" title="Video player" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen loading="eager" referrerpolicy="strict-origin-when-cross-origin"></iframe>';
  }

  /* ---------- Router ---------- */
  var header = $("#siteHeader");
  function show(view) {
    ["home", "work", "project"].forEach(function (v) { $("#view-" + v).hidden = v !== view; });
    document.querySelectorAll(".nav a").forEach(function (a) { a.classList.toggle("active", view === "work" && a.getAttribute("href") === "#work"); });
  }
  function setMenu(open) {
    setTimeout(function () { if (typeof updateDock === "function") updateDock(); }, 0);
    document.body.classList.toggle("menu-open", open);
    $("#menuBtn").setAttribute("aria-expanded", open);
    $("#menuBtn").setAttribute("aria-label", open ? "Close menu" : "Open menu");
  }
  function route() {
    var h = (location.hash || "").replace(/^#/, "");
    setMenu(false);
    if (h === "work") { show("work"); renderWork(); document.title = "Work — " + (SITE.name || "July Effect"); window.scrollTo(0, 0); }
    else if (h.indexOf("p-") === 0) { show("project"); renderProject(h.slice(2)); window.scrollTo(0, 0); }
    else {
      show("home"); document.title = SITE.name || "July Effect";
      if (["services", "about", "contact", "selected"].indexOf(h) > -1) setTimeout(function () { scrollToId(h); }, 30);
    }
    onScroll();
  }
  function scrollToId(id) {
    var el = document.getElementById(id);
    if (!el) return;
    var y = id === "top" ? 0 : el.getBoundingClientRect().top + window.pageYOffset - 70;
    window.scrollTo({ top: y, behavior: reduceMotion ? "auto" : "smooth" });
  }
  function goHome() {
    if (location.hash) {
      try { history.pushState(null, "", location.pathname + location.search); } catch (err) { location.hash = ""; }
      route();
    }
  }

  document.addEventListener("click", function (e) {
    var t = e.target.closest("[data-quote],[data-qp-close],[data-scroll],[data-nav],[data-scope],[data-cat],[data-copy]");
    if (!t) return;
    if (t.hasAttribute("data-quote")) { e.preventDefault(); setMenu(false); openQuote(t.getAttribute("data-ref") || ""); return; }
    if (t.hasAttribute("data-qp-close")) { closeQuote(); return; }
    if (t.hasAttribute("data-copy")) {
      var txt = t.getAttribute("data-copy");
      var done = function () { t.textContent = "Copied"; setTimeout(function () { t.textContent = "Copy"; }, 1600); };
      try { navigator.clipboard.writeText(txt).then(done, function () { selectText(t.previousElementSibling); }); }
      catch (err) { selectText(t.previousElementSibling); }
      return;
    }
    if (t.hasAttribute("data-scope")) { activeScope = t.getAttribute("data-scope"); activeCat = "all"; renderWork(); return; }
    if (t.hasAttribute("data-cat")) { activeCat = t.getAttribute("data-cat"); renderWork(); return; }
    if (t.hasAttribute("data-scroll")) {
      e.preventDefault();
      setMenu(false);
      var id = t.getAttribute("data-scroll");
      // contact lives on every page; other sections are on home
      if (id === "contact" || id === "top" || !$("#view-home").hidden) scrollToId(id);
      else { goHome(); setTimeout(function () { scrollToId(id); }, 40); }
      return;
    }
    if (t.getAttribute("data-nav") === "home") {
      e.preventDefault();
      setMenu(false);
      goHome();
      window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
    }
  });
  function selectText(el) {
    if (!el) return;
    var r = document.createRange(); r.selectNodeContents(el);
    var s = window.getSelection(); s.removeAllRanges(); s.addRange(r);
  }

  /* ---------- Header, menu, timecode ---------- */
  var ticking = false;
  function onScroll() {
    var onHome = !$("#view-home").hidden;
    var y = window.pageYOffset;
    header.classList.toggle("solid", y > 40 || (!onHome && y > 10));
    document.body.classList.toggle("scrolled", y > 500);
    ticking = false;
  }
  window.addEventListener("scroll", function () {
    if (!ticking) { ticking = true; requestAnimationFrame(onScroll); }
  }, { passive: true });
  $("#menuBtn").addEventListener("click", function () { setMenu(!document.body.classList.contains("menu-open")); });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && document.body.classList.contains("menu-open")) setMenu(false);
  });

  var start = performance.now();
  var tcEl = $("#timecode");
  var heroVisible = true;
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(function (en) { heroVisible = en[0].isIntersecting; }).observe($("#top"));
  }
  function tick(now) {
    if (heroVisible && !document.hidden) {
      var f = Math.floor((now - start) / (1000 / 24));
      var ff = f % 24, s = Math.floor(f / 24), ss = s % 60, mm = Math.floor(s / 60) % 60, hh = Math.floor(s / 3600);
      var pad = function (n) { return (n < 10 ? "0" : "") + n; };
      tcEl.textContent = pad(hh) + ":" + pad(mm) + ":" + pad(ss) + ":" + pad(ff);
    }
    requestAnimationFrame(tick);
  }
  if (!reduceMotion) requestAnimationFrame(tick);

  /* ---------- Lightbox (showreel) ---------- */
  var lb = $("#lightbox");
  var lastFocus = null;
  function openReel() {
    var m = resolveMedia(SITE.showreel);
    if (!m) return;
    if (!m.embed) { window.open(m.watch, "_blank", "noopener"); return; }
    lastFocus = document.activeElement;
    $("#lightboxInner").innerHTML = '<div class="player' + (m.vertical ? " vertical" : "") + '">' + iframe(m.embed) +
      '</div><p class="player-note">Video not playing? <a href="' + esc(m.watch) + '" target="_blank" rel="noopener">Watch on ' + esc(m.host) + " ↗</a></p>";
    lb.hidden = false;
    document.body.classList.add("lightbox-open");
    $("#lightboxClose").focus();
  }
  function closeReel() {
    lb.hidden = true;
    $("#lightboxInner").innerHTML = "";
    document.body.classList.remove("lightbox-open");
    if (lastFocus) lastFocus.focus();
  }
  $("#showreelBtn").addEventListener("click", openReel);
  $("#lightboxClose").addEventListener("click", closeReel);
  lb.addEventListener("click", function (e) { if (e.target === lb) closeReel(); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && !lb.hidden) closeReel(); });

  /* ---------- "Build your shot" quiz (the enquiry form) ---------- */
  var form = $("#enquiry");
  var steps = Array.prototype.slice.call(form.querySelectorAll(".q-step"));
  var frames = Array.prototype.slice.call(form.querySelectorAll("#qFrames li"));
  var qBack = $("#qBack"), qNext = $("#qNext"), qSend = $("#qSend"), qDone = $("#qDone");
  var status = $("#formStatus");
  var cur = 0;

  function stepAnswered(i) { return !steps[i].querySelector('input[type="radio"]') || !!steps[i].querySelector("input:checked"); }
  function showStep(i, focus) {
    cur = i;
    steps.forEach(function (s, k) { s.classList.toggle("is-active", k === i); });
    frames.forEach(function (f, k) { f.classList.toggle("on", k <= i); });
    $("#qCount").textContent = "Shot " + (i + 1) + " / " + steps.length;
    var last = i === steps.length - 1;
    qBack.hidden = i === 0;
    qSend.hidden = !last;
    qNext.hidden = last || !stepAnswered(i);
    status.textContent = ""; status.classList.remove("error");
    if (focus) {
      var target = steps[i].querySelector("input:checked") || steps[i].querySelector("input:not([type=hidden])");
      if (target) target.focus({ preventScroll: !$("#quotePanel").hidden });
    }
  }
  // Tap an answer → move to the next shot. Keyboard users get the Next button instead.
  form.addEventListener("click", function (e) {
    var r = e.target.closest('input[type="radio"]');
    if (!r) return;
    qNext.hidden = cur === steps.length - 1;
    if (e.detail > 0 && cur < steps.length - 1) setTimeout(function () { showStep(cur + 1, true); }, 220);
  });
  form.addEventListener("change", function (e) {
    if (e.target.type === "radio") qNext.hidden = cur === steps.length - 1;
  });
  qNext.addEventListener("click", function () { if (stepAnswered(cur)) showStep(cur + 1, true); });
  // Clear an error as soon as the visitor starts fixing it.
  form.addEventListener("input", function (e) {
    var f = e.target.closest(".field");
    if (f && f.classList.contains("invalid")) { f.classList.remove("invalid"); status.textContent = ""; status.classList.remove("error"); }
  });
  qBack.addEventListener("click", function () { if (cur > 0) showStep(cur - 1, true); });

  function setRef(ref) {
    $("#f-ref").value = ref || "";
    $("#qRefText").textContent = ref || "";
    $("#qRef").hidden = !ref;
  }
  $("#qRefClear").addEventListener("click", function () { setRef(""); });

  function setDone(on) {
    qDone.hidden = !on;
    ["#qTop", "#qNav"].forEach(function (sel) { $(sel).hidden = on; });
    steps.forEach(function (s) { s.hidden = on; });
    if (on) $("#qRef").hidden = true;
  }
  function resetQuiz() { form.reset(); setRef(""); setDone(false); showStep(0, false); }
  $("#qAgain").addEventListener("click", function () { resetQuiz(); showStep(0, true); });

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    if (cur < steps.length - 1) { if (stepAnswered(cur)) showStep(cur + 1, true); return; }
    for (var k = 0; k < steps.length - 1; k++) {
      if (!stepAnswered(k)) { showStep(k, true); status.textContent = "Pick one option to continue."; status.classList.add("error"); return; }
    }
    var email = clean((SITE.contact || {}).email);
    var checks = [
      { id: "f-name", label: "your name", test: function (v) { return v.length > 0; } },
      // Count digits only, so spaces, dashes and hidden characters pasted by phones don't matter.
      { id: "f-phone", label: "a WhatsApp number (10 to 15 digits)", test: function (v) { var d = v.replace(/\D/g, "").length; return d >= 10 && d <= 15; } },
      { id: "f-email", label: "a valid email (or leave it empty)", test: function (v) { return !v || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); } }
    ];
    var problems = [], firstBad = null;
    checks.forEach(function (c) {
      var el = document.getElementById(c.id);
      if (!el) return;
      var v = el.value.replace(/[​-‏‪-‮⁦-⁩﻿]/g, "").trim();
      el.value = v;
      var bad = !c.test(v);
      el.closest(".field").classList.toggle("invalid", bad);
      if (bad) { problems.push(c.label); if (!firstBad) firstBad = el; }
    });
    status.classList.remove("error");
    if (problems.length) {
      status.textContent = "Please add " + problems.join(", ") + ".";
      status.classList.add("error");
      firstBad.focus();
      return;
    }

    var data = new FormData(form);
    var first = String(data.get("name") || "").trim().split(" ")[0];
    var service = String(data.get("service") || "a project");
    var thanks = function () {
      qSend.disabled = false;
      $("#qDoneSub").textContent = "Thanks, " + first + ". We'll WhatsApp you within one working day.";
      var wa = (SITE.contact || {}).whatsapp;
      var qWa = $("#qWa");
      if (wa) {
        qWa.href = "https://wa.me/" + wa + "?text=" + encodeURIComponent("Hi July Effect, I just sent a brief for a " + service.toLowerCase() + ". I'm " + first + ".");
        qWa.innerHTML = WA_ICON + "Chat on WhatsApp now";
        qWa.hidden = false;
      }
      form.reset(); setRef("");
      setDone(true);
      status.textContent = "";
    };
    var fail = function () {
      status.textContent = "That didn't go through. Please try again, or message us on WhatsApp" + (email ? " or email " + email : "") + ".";
      status.classList.add("error");
      qSend.disabled = false;
    };
    var provider = SITE.formProvider || "netlify";
    if (provider === "netlify") {
      if (location.protocol === "file:") {
        status.textContent = "The form sends once the site is live on Netlify. Nothing was sent from this local copy.";
        return;
      }
      qSend.disabled = true;
      status.textContent = "Sending…";
      fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(data).toString()
      }).then(function (r) { if (!r.ok) throw new Error(); thanks(); }).catch(fail);
    } else if (provider === "formspree" && SITE.formEndpoint) {
      qSend.disabled = true;
      status.textContent = "Sending…";
      fetch(SITE.formEndpoint, { method: "POST", headers: { Accept: "application/json" }, body: data })
        .then(function (r) { if (!r.ok) throw new Error(); thanks(); }).catch(fail);
    } else {
      var body = ["Making: " + data.get("service"), "When: " + data.get("timeline"), "Budget: " + data.get("budget"),
        "Name: " + data.get("name"), "WhatsApp: " + data.get("phone"), "Email: " + data.get("email"),
        "Reference: " + data.get("reference"), "", data.get("message")].join("\n");
      location.href = "mailto:" + email + "?subject=" + encodeURIComponent("Project brief — " + data.get("name")) + "&body=" + encodeURIComponent(body);
    }
  });
  showStep(0, false);

  /* ---------- Quote panel (pop-up) and the always-visible quote button ---------- */
  var panel = $("#quotePanel"), formHome = $("#formHome"), qpSlot = $("#qpSlot");
  var dock = $("#quoteDock");
  var quoteFocus = null;
  function openQuote(ref) {
    quoteFocus = document.activeElement;
    if (!qDone.hidden) resetQuiz();
    if (ref) setRef(ref);
    qpSlot.appendChild(form);
    panel.hidden = false;
    document.body.classList.add("quote-open");
    updateDock();
    showStep(cur, true);
  }
  function closeQuote() {
    if (panel.hidden) return;
    formHome.appendChild(form);
    panel.hidden = true;
    document.body.classList.remove("quote-open");
    updateDock();
    if (quoteFocus && quoteFocus.focus) quoteFocus.focus({ preventScroll: true });
  }
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && !panel.hidden) closeQuote(); });

  var contactVisible = false;
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(function (en) { contactVisible = en[0].isIntersecting; updateDock(); }, { threshold: 0.15 }).observe(formHome);
  }
  function updateDock() {
    var phone = window.matchMedia("(max-width: 900px)").matches;
    var scrolled = window.pageYOffset > 500;
    var on = (phone || scrolled) && !contactVisible && panel.hidden && !document.body.classList.contains("menu-open");
    document.body.classList.toggle("dock-on", on);
  }
  window.addEventListener("scroll", updateDock, { passive: true });
  window.addEventListener("resize", updateDock);

  // Netlify's "Powered by Netlify" badge sits in the bottom-right corner and can't be moved,
  // so the button lives bottom-left on desktop and floats above the badge on phones (see style.css).

  /* ---------- Clapperboard call-to-action ---------- */
  var slateDate = $("#slateDate");
  if (slateDate) {
    var d = new Date(), pad2 = function (n) { return (n < 10 ? "0" : "") + n; };
    slateDate.textContent = pad2(d.getDate()) + "." + pad2(d.getMonth() + 1) + "." + String(d.getFullYear()).slice(2);
  }
  var slate = $("#slate");
  if (slate && "IntersectionObserver" in window && !reduceMotion) {
    var clapObs = new IntersectionObserver(function (en) {
      en.forEach(function (x) {
        if (x.isIntersecting) { slate.classList.remove("clap"); void slate.offsetWidth; slate.classList.add("clap"); }
      });
    }, { threshold: 0.6 });
    clapObs.observe(slate);
  }

  /* ---------- Boot ---------- */
  fillStatic();
  renderHome();
  window.addEventListener("hashchange", route);
  route();
})();
