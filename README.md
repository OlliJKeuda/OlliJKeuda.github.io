# Keuda · Ohjelmointi — course site

Static teaching site, hosted on GitHub Pages. No build step, no dependencies:
edit HTML, push, done. Assignments stay in Moodle; this site holds the materials.

## Structure

```
index.html                     home page (course cards, generated)
assets/
  css/style.css                styles; brand colours are at the top
  js/nav.js                    THE site map: courses, sections, pages, UI text
  js/site.js                   builds header, sidebar, pager, editors (rarely edited)
  img/logo.svg                 placeholder logo, replace with the official one
ohjelmointi-1/
  index.html                   course overview (generated from nav.js)
  ohjelmoinnin-perusteet/
    index.html                 section overview
    muuttujat.html             a lesson page
  olio-ohjelmointi/ …
ohjelmointi-2/ …
_template/page.html            blank lesson page to copy
```

One folder per section, one HTML file per lesson. Every page only contains its
own content; the header, sidebar, breadcrumb and Previous/Next buttons are added
automatically from `assets/js/nav.js`.

## Add a lesson page

1. Copy `_template/page.html` into the section folder, e.g. `ohjelmointi-1/olio-ohjelmointi/luokat.html`.
2. Edit the `<title>` and the content.
3. Add it to that section's `pages` list in `assets/js/nav.js`:
   ```js
   { file: "luokat.html", title: "Luokat" }
   ```
   The order in this list is the reading order (and the Previous/Next order).

## Add a section or a course

Add an entry to `nav.js` and create the folder with an `index.html`. Copy an
existing section's `index.html`: it only needs the title, a lead paragraph and
`<div data-section-toc></div>`. For a new course, copy `ohjelmointi-1/index.html`.

## Components

```html
<!-- Code block (copy button added automatically; data-title is optional) -->
<pre data-title="app.js"><code>console.log("Hei");</code></pre>

<!-- Callouts: note (default) | tip | warning | task -->
<div class="callout tip">
  <strong class="callout-title">Vinkki</strong>
  <p>Text.</p>
</div>

<!-- Live editor: data-mode="js" (console.log output) or "html" (rendered page).
     Add data-autorun to run on page load. Use &lt; and &amp; inside the textarea. -->
<div class="tryit" data-mode="js"><textarea>console.log(1 + 1);</textarea></div>

<!-- Table: wrap it so it scrolls on phones -->
<div class="table-wrap"><table>…</table></div>

<!-- Button-style link -->
<a class="btn" href="…">Text</a>

<!-- On a section overview page: automatic list of the section's lessons -->
<div data-section-toc></div>
```

The `.tryit` editor only runs HTML and JavaScript (in a sandboxed frame). For
other languages use plain code blocks.

## Moodle links

Set `moodleUrl` on a course (and optionally on a section) in `nav.js`. A
"Tehtävät Moodlessa" button then appears in the sidebar and opens the
assignments in a new tab.

## Branding

- **Colours:** edit the values marked `BRAND` at the top of `assets/css/style.css`.
- **Logo:** replace `assets/img/logo.svg` (keep the file name). The header is dark, so use the reversed/white logo.
- **Language:** `lang: "fi"` in `nav.js` switches the interface text. Add more languages in the `strings` block.

## Syntax highlighting (optional)

Code blocks are plain by default. If you add highlight.js (self-hosted files or
a CDN `<script>` plus a theme stylesheet) to a page, `site.js` highlights every
`<pre><code>` automatically.

## Publish on GitHub Pages

1. Create a repository and push these files to the `main` branch.
2. Repository **Settings → Pages → Build and deployment**: source **Deploy from a branch**, branch `main`, folder `/ (root)`.
3. The site appears at `https://<user-or-org>.github.io/<repository>/`. All links are relative, so this works without configuration.

`.nojekyll` is included so GitHub serves the files as they are.

Set `repoUrl` in `nav.js` (e.g. `https://github.com/your-org/ohjelmointi`) to add an
"Edit this page" link to every footer. It is handy when two people edit content.

## Preview locally

Open `index.html` in a browser, or run a tiny server in this folder:

```
python -m http.server 8000
```

and visit http://localhost:8000.
