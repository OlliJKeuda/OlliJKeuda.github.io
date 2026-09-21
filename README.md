# Keuda · Ohjelmointi — course site

Static teaching site, hosted on GitHub Pages. No build step, no dependencies:
edit HTML, push, done. Assignments stay in Moodle; this site holds the materials.

## Structure

```
index.html                     home page (course cards, generated)
assets/
  css/style.css                styles; Keuda colour and font tokens are at the top
  js/nav.js                    THE site map: courses, sections, pages, UI text
  js/site.js                   builds header, sidebar, pager, code blocks (rarely edited)
  img/                         logo.svg, logo-negative.svg, favicon.svg, screenshots
  fonts/                       put the Titillium Web files here (see README.txt)
ohjelmointi-1/
  index.html                   course overview (generated from nav.js)
  ohjelmoinnin-perusteet/
    index.html                 section overview
    osa-1-ensimmainen-ohjelma.html … osa-6-taulukot-ja-listat.html
  olio-ohjelmointi/ …
ohjelmointi-2/ …
_template/page.html            blank lesson page to copy
```

One folder per section, one HTML file per lesson. A page only contains its own
content; the header, sidebar, breadcrumb and Previous/Next buttons are added
automatically from `assets/js/nav.js`.

## Add a lesson page

1. Copy `_template/page.html` into the section folder.
2. Edit the `<title>` and the content.
3. Add it to that section's `pages` list in `assets/js/nav.js`:
   ```js
   { file: "luokat.html", title: "Luokat", desc: "One line shown on the section overview." }
   ```
   The order in this list is the reading order (and the Previous/Next order).

## Add a section or a course

Add an entry to `nav.js` and create the folder with an `index.html`. Copy an
existing section's `index.html`: it only needs a title, a lead paragraph and
`<div data-section-toc></div>`. For a new course, copy `ohjelmointi-1/index.html`.
Each course has a `color` in `nav.js`: `"green"`, `"purple"` or `"orange"`.

## Components

```html
<!-- Code, with syntax colours. Use &lt; &gt; &amp; for < > & inside code. -->
<pre data-title="Program.cs"><code class="language-csharp">int a = 1;</code></pre>

<!-- Console output -->
<pre class="output" data-title="Konsoli"><code>Hello World!</code></pre>

<!-- Callouts: note | tip | warning | task -->
<div class="callout tip"><strong class="callout-title">Vinkki</strong><p>Text.</p></div>

<!-- Table: wrap it so it scrolls on phones -->
<div class="table-wrap"><table>…</table></div>

<!-- "On this page" list built from the h2 headings: add data-toc to <main> -->
<main id="content" data-toc>

<!-- On a section overview page: automatic list of the section's lessons -->
<div data-section-toc></div>

<!-- Live editor for HTML / JavaScript lessons (C# cannot run in the browser) -->
<div class="tryit" data-mode="js"><textarea>console.log(1 + 1);</textarea></div>
```

Syntax colours exist for `language-csharp` and `language-js`. Other code stays plain.

## Moodle links

Set `moodleUrl` on a course (and optionally on a section) in `nav.js`. A
"Tehtävät Moodlessa" button then appears in the sidebar and opens the
assignments in a new tab.

## Branding

The design follows the 2025 Keuda brand book.

- **Colours:** the tokens at the top of `assets/css/style.css` (green `#009700`, black `#00232B`, site background `#FFFFFA`, text boxes `#F1F3F3` `#F4FBF6` `#FFF4FA` `#FFF7EB`). Small text uses the darker link green `#007400`, as the brand book requires for accessibility.
- **Font:** Titillium Web. Add the font files to `assets/fonts/` (see the README.txt there). Until then the site shows Arial, the brand book's fallback.
- **Logo:** `assets/img/logo.svg` and `logo-negative.svg` were traced from the brand book PDF. Replace them with the official files from Keuda's media library (keep the file names).
- **Language:** `lang: "fi"` in `nav.js` switches the interface text. Add more languages in the `strings` block.

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
