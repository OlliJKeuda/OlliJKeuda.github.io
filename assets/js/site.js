/* ==========================================================================
   site.js — builds the page chrome from nav.js.

   Content pages only contain <main id="content">…</main>. This script adds
   the header, sidebar, breadcrumb, previous/next buttons and footer, and
   makes code blocks and .tryit editors interactive.
   ========================================================================== */
(function () {
  "use strict";

  var S = window.SITE;
  var T = S.strings[S.lang] || S.strings.fi;

  // This file lives at <root>/assets/js/site.js, so the site root is two levels up.
  // Works on GitHub Pages project sites (/repo-name/), custom domains and file://.
  var ROOT = new URL("../../", document.currentScript.src).href;

  /* ── helpers ─────────────────────────────────────────────────────────── */
  function h(tag, props, kids) {
    var node = document.createElement(tag);
    Object.keys(props || {}).forEach(function (k) {
      var v = props[k];
      if (v === undefined || v === null || v === false) return;
      if (k === "text") node.textContent = v;
      else if (k === "html") node.innerHTML = v;
      else node.setAttribute(k, v);
    });
    (kids || []).forEach(function (c) { if (c) node.appendChild(c); });
    return node;
  }

  function link(href, text, cls) {
    return h("a", { href: href, "class": cls, text: text });
  }

  function courseUrl(c) { return ROOT + c.id + "/index.html"; }
  function sectionUrl(c, s) { return ROOT + c.id + "/" + s.id + "/index.html"; }
  function pageUrl(c, s, p) { return ROOT + c.id + "/" + s.id + "/" + p.file; }

  /* ── where are we? ───────────────────────────────────────────────────── */
  var rel = location.href.split("#")[0].split("?")[0];
  rel = rel.indexOf(ROOT) === 0 ? rel.slice(ROOT.length) : "index.html";
  if (rel === "" || rel.slice(-1) === "/") rel += "index.html";
  try { rel = decodeURI(rel); } catch (e) { /* keep as is */ }

  var seg = rel.split("/");
  var course = S.courses.filter(function (c) { return c.id === seg[0]; })[0] || null;
  var section = course
    ? course.sections.filter(function (s) { return s.id === seg[1]; })[0] || null
    : null;

  var main = document.getElementById("content") || document.querySelector("main");
  if (!main) return;

  /* ── theme ───────────────────────────────────────────────────────────── */
  var root = document.documentElement;
  try {
    var savedTheme = localStorage.getItem("theme");
    if (savedTheme) root.setAttribute("data-theme", savedTheme);
  } catch (e) { /* storage may be blocked; ignore */ }

  function currentTheme() {
    return root.getAttribute("data-theme") ||
      (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
  }

  function toggleTheme() {
    var next = currentTheme() === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    try { localStorage.setItem("theme", next); } catch (e) { /* ignore */ }
  }

  /* ── header ──────────────────────────────────────────────────────────── */
  var ICON_MENU =
    '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
    'stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M4 6h16M4 12h16M4 18h16"/></svg>';
  var ICON_THEME =
    '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
    'stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="9"/>' +
    '<path d="M12 3a9 9 0 0 1 0 18z" fill="currentColor"/></svg>';

  function buildHeader() {
    var header = h("header", { "class": "site-header" });

    if (course) {
      var menuBtn = h("button", {
        type: "button", "class": "icon-btn menu-btn", "aria-label": T.menu,
        "aria-controls": "sidebar", "aria-expanded": "false", html: ICON_MENU
      });
      menuBtn.addEventListener("click", function () {
        var open = document.body.classList.toggle("nav-open");
        menuBtn.setAttribute("aria-expanded", String(open));
      });
      header.appendChild(menuBtn);
    }

    var brand = h("a", { "class": "brand", href: ROOT + "index.html" }, [
      h("img", { src: ROOT + "assets/img/logo.svg", alt: S.org }),
      h("span", { "class": "brand-name", text: S.name })
    ]);
    header.appendChild(brand);

    var tabs = h("nav", { "class": "course-tabs", "aria-label": T.courseNav });
    S.courses.forEach(function (c) {
      tabs.appendChild(h("a", {
        href: courseUrl(c), text: c.title,
        "aria-current": c === course ? "true" : false
      }));
    });
    header.appendChild(tabs);

    var themeBtn = h("button", {
      type: "button", "class": "icon-btn", "aria-label": T.theme, title: T.theme, html: ICON_THEME
    });
    themeBtn.addEventListener("click", toggleTheme);
    header.appendChild(h("div", { "class": "header-actions" }, [themeBtn]));

    return header;
  }

  /* ── sidebar ─────────────────────────────────────────────────────────── */
  function moodleLink(url) {
    return h("a", {
      "class": "moodle-link", href: url, target: "_blank", rel: "noopener", text: T.moodle
    });
  }

  function buildSidebar() {
    var side = h("nav", { "class": "sidebar", id: "sidebar", "aria-label": T.sidebarNav });

    // Course switcher: only visible on small screens, where the header tabs are hidden.
    var switcher = h("div", { "class": "sidebar-courses" });
    S.courses.forEach(function (c) {
      switcher.appendChild(h("a", {
        href: courseUrl(c), text: c.title, "aria-current": c === course ? "true" : false
      }));
    });
    side.appendChild(switcher);

    side.appendChild(h("a", {
      "class": "sidebar-course", href: courseUrl(course), text: course.title,
      "aria-current": rel === course.id + "/index.html" ? "page" : false
    }));
    if (course.moodleUrl) side.appendChild(moodleLink(course.moodleUrl));

    course.sections.forEach(function (s) {
      var details = h("details", { open: s === section ? "" : false });
      details.appendChild(h("summary", { text: s.title }));

      var ul = h("ul");
      s.pages.forEach(function (p) {
        var key = course.id + "/" + s.id + "/" + p.file;
        ul.appendChild(h("li", {}, [h("a", {
          href: pageUrl(course, s, p), text: p.title,
          "aria-current": key === rel ? "page" : false
        })]));
      });
      details.appendChild(ul);

      var url = s.moodleUrl || "";
      if (url) details.appendChild(moodleLink(url));

      side.appendChild(details);
    });

    return side;
  }

  /* ── breadcrumb ──────────────────────────────────────────────────────── */
  function buildBreadcrumb() {
    var crumbs = [{ text: T.home, url: ROOT + "index.html" }];
    if (course) crumbs.push({ text: course.title, url: courseUrl(course) });
    if (section) crumbs.push({ text: section.title, url: sectionUrl(course, section) });

    var ol = h("ol");
    crumbs.forEach(function (c, i) {
      var isPage = c.url === ROOT + rel;
      var last = i === crumbs.length - 1;
      ol.appendChild(h("li", {}, [
        isPage && last
          ? h("span", { text: c.text, "aria-current": "page" })
          : link(c.url, c.text)
      ]));
    });
    return h("nav", { "class": "breadcrumb", "aria-label": "Breadcrumb" }, [ol]);
  }

  /* ── previous / next ────────────────────────────────────────────────── */
  function buildPager() {
    var flat = [];
    course.sections.forEach(function (s) {
      s.pages.forEach(function (p) {
        flat.push({
          key: course.id + "/" + s.id + "/" + p.file,
          url: pageUrl(course, s, p),
          // A section's overview page is labelled with the section name.
          label: p.file === "index.html" ? s.title : p.title
        });
      });
    });

    var i = -1;
    flat.forEach(function (f, n) { if (f.key === rel) i = n; });
    if (i < 0) return null;

    function btn(item, cls, dir) {
      return h("a", { "class": "btn " + cls, href: item.url }, [
        h("span", { "class": "pager-dir", text: dir }),
        h("span", { text: item.label })
      ]);
    }

    var pager = h("nav", { "class": "pager", "aria-label": T.prev + " / " + T.next });
    if (flat[i - 1]) pager.appendChild(btn(flat[i - 1], "pager-prev", T.prev));
    if (flat[i + 1]) pager.appendChild(btn(flat[i + 1], "pager-next", T.next));
    return pager;
  }

  /* ── content placeholders ───────────────────────────────────────────── */
  function renderCards(target) {
    var wrap = h("div", { "class": "cards" });
    S.courses.forEach(function (c) {
      var ul = h("ul");
      c.sections.forEach(function (s) {
        ul.appendChild(h("li", {}, [link(sectionUrl(c, s), s.title)]));
      });
      wrap.appendChild(h("article", { "class": "card" }, [
        h("h2", { text: c.title }),
        h("p", { text: c.description }),
        ul,
        link(courseUrl(c), T.start, "btn")
      ]));
    });
    target.appendChild(wrap);
  }

  function renderCourseOverview(target) {
    if (!course) return;
    course.sections.forEach(function (s) {
      target.appendChild(h("h2", {}, [link(sectionUrl(course, s), s.title)]));
      if (s.description) target.appendChild(h("p", { text: s.description }));
    });
  }

  function renderSectionToc(target) {
    if (!course || !section) return;
    var pages = section.pages.filter(function (p) { return p.file !== "index.html"; });
    if (!pages.length) {
      target.appendChild(h("p", { "class": "coming-soon", text: T.comingSoon }));
      return;
    }
    var ul = h("ul", { "class": "toc-list" });
    pages.forEach(function (p) {
      ul.appendChild(h("li", {}, [link(pageUrl(course, section, p), p.title)]));
    });
    target.appendChild(ul);
  }

  /* ── code blocks ─────────────────────────────────────────────────────── */
  function enhanceCodeBlocks() {
    Array.prototype.forEach.call(main.querySelectorAll("pre"), function (pre) {
      if (pre.closest(".tryit") || pre.closest(".codeblock")) return;

      var wrap = h("div", { "class": "codeblock" });
      pre.parentNode.insertBefore(wrap, pre);

      var title = pre.getAttribute("data-title");
      if (title) wrap.appendChild(h("div", { "class": "codeblock-title", text: title }));
      wrap.appendChild(pre);

      var btn = h("button", { type: "button", "class": "copy-btn", text: T.copy });
      btn.addEventListener("click", function () {
        var done = function () {
          btn.textContent = T.copied;
          setTimeout(function () { btn.textContent = T.copy; }, 1500);
        };
        try {
          navigator.clipboard.writeText(pre.textContent).then(done, function () {});
        } catch (e) { /* clipboard unavailable (e.g. insecure context) */ }
      });
      wrap.appendChild(btn);

      // Optional syntax highlighting: works if highlight.js is loaded on the page.
      var code = pre.querySelector("code");
      if (code && window.hljs) window.hljs.highlightElement(code);
    });
  }

  /* ── try-it editor ───────────────────────────────────────────────────── */
  function htmlDoc(code) { return code; }

  function jsDoc(code) {
    var runtime =
      "(function(){var o=document.getElementById('out');" +
      "function add(t,c){var s=document.createElement('span');if(c)s.className=c;" +
      "s.textContent=t+'\\n';o.appendChild(s);}" +
      "function fmt(a){return Array.prototype.map.call(a,function(x){" +
      "if(typeof x==='object'&&x!==null){try{return JSON.stringify(x)}catch(e){}}" +
      "return String(x)}).join(' ')}" +
      "console.log=function(){add(fmt(arguments))};console.info=console.log;" +
      "console.warn=console.log;console.error=function(){add(fmt(arguments),'err')};" +
      "window.onerror=function(m,s,l){add(m+' (" + T.line + " '+l+')','err');return true};" +
      "})();";

    return "<!doctype html><meta charset=\"utf-8\">" +
      "<style>body{margin:0;padding:12px;font:14px/1.5 ui-monospace,Consolas,monospace;" +
      "color:#111;background:#fff}pre{margin:0;white-space:pre-wrap}.err{color:#b3261e}</style>" +
      "<pre id=\"out\"></pre>" +
      "<script>" + runtime + "<\/script>" +
      "<script>" + code.replace(/<\/script/gi, "<\\/script") + "<\/script>";
  }

  function initTryit(box) {
    var source = box.querySelector("textarea");
    if (!source) return;

    var mode = box.getAttribute("data-mode") || "html";
    var initial = source.value.replace(/^\n+|\s+$/g, "");

    var editor = h("textarea", {
      "aria-label": T.editor, spellcheck: "false", autocapitalize: "off",
      rows: Math.max(8, initial.split("\n").length + 1)
    });
    editor.value = initial;

    var frame = h("iframe", {
      title: T.output, sandbox: "allow-scripts allow-modals"
    });

    function run() {
      frame.srcdoc = mode === "js" ? jsDoc(editor.value) : htmlDoc(editor.value);
    }

    var runBtn = h("button", { type: "button", "class": "btn small", text: T.run });
    var resetBtn = h("button", { type: "button", "class": "btn small secondary", text: T.reset });
    runBtn.addEventListener("click", run);
    resetBtn.addEventListener("click", function () {
      editor.value = initial;
      frame.srcdoc = "";
    });

    box.textContent = "";
    box.appendChild(h("div", { "class": "tryit-bar" }, [
      h("span", { text: T.tryit }),
      h("div", { "class": "tryit-actions" }, [resetBtn, runBtn])
    ]));
    box.appendChild(h("div", { "class": "tryit-body" }, [editor, frame]));

    if (box.hasAttribute("data-autorun")) run();
  }

  /* ── assemble the page ───────────────────────────────────────────────── */
  var skip = h("a", { "class": "skip-link", href: "#content", text: T.skip });
  document.body.insertBefore(skip, document.body.firstChild);
  document.body.insertBefore(buildHeader(), skip.nextSibling);

  var layout = h("div", { "class": "layout" + (course ? "" : " no-sidebar") });
  main.parentNode.insertBefore(layout, main);
  if (course) layout.appendChild(buildSidebar());
  layout.appendChild(main);
  main.classList.add("content");
  main.setAttribute("id", "content");

  Array.prototype.forEach.call(main.querySelectorAll("[data-course-cards]"), renderCards);
  Array.prototype.forEach.call(main.querySelectorAll("[data-course-overview]"), renderCourseOverview);
  Array.prototype.forEach.call(main.querySelectorAll("[data-section-toc]"), renderSectionToc);

  if (course) {
    main.insertBefore(buildBreadcrumb(), main.firstChild);
    var pager = buildPager();
    if (pager) main.appendChild(pager);
  }

  enhanceCodeBlocks();
  Array.prototype.forEach.call(main.querySelectorAll(".tryit"), initTryit);

  var footer = h("footer", { "class": "site-footer" }, [
    h("span", { text: S.org + " · " + S.name })
  ]);
  if (S.repoUrl) {
    footer.appendChild(document.createTextNode(" · "));
    footer.appendChild(link(
      S.repoUrl + "/edit/" + (S.repoBranch || "main") + "/" + rel, T.edit
    ));
  }
  document.body.appendChild(footer);

  /* ── mobile sidebar: close on link click, Escape, or tap outside ────── */
  function closeNav() {
    document.body.classList.remove("nav-open");
    var btn = document.querySelector(".menu-btn");
    if (btn) btn.setAttribute("aria-expanded", "false");
  }
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeNav(); });
  document.addEventListener("click", function (e) {
    if (e.target === document.body || (e.target.closest && e.target.closest(".sidebar a"))) closeNav();
  });
})();
