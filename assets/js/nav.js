/* ==========================================================================
   nav.js — the ONE place that describes the site.

   The sidebar, course tabs, home page cards, breadcrumbs and
   previous/next buttons are all generated from this file.

   To add a page:
     1. Copy _template/page.html into the section's folder.
     2. Add { file: "my-page.html", title: "My page" } to that section's
        `pages` list below, in the order students should read them.
   ========================================================================== */
window.SITE = {
  org: "Keuda",
  name: "Ohjelmointi",
  lang: "fi",                       // "fi" or "en" (see `strings` below)

  // Optional. When set, every page footer gets an "Edit this page" link.
  repoUrl: "",                      // e.g. "https://github.com/your-org/ohjelmointi"
  repoBranch: "main",

  courses: [
    {
      id: "ohjelmointi-1",          // folder name
      title: "Ohjelmointi #1",
      description: "Ohjelmoinnin peruskäsitteet, olio-ohjelmointi, JavaScript ja pelinohjelmointi.",
      moodleUrl: "",                // link to this course's assignments in Moodle
      sections: [
        {
          id: "ohjelmoinnin-perusteet",
          title: "Ohjelmoinnin perusteet",
          description: "Muuttujat, ehtolauseet, silmukat ja funktiot: ohjelmoinnin peruskäsitteet.",
          moodleUrl: "",            // optional: link to this section's assignments in Moodle
          pages: [
            { file: "index.html", title: "Yleiskatsaus" },
            { file: "muuttujat.html", title: "Muuttujat" }
          ]
        },
        {
          id: "olio-ohjelmointi",
          title: "Olio-ohjelmointi",
          description: "Luokat, oliot, perintä ja kapselointi.",
          pages: [
            { file: "index.html", title: "Yleiskatsaus" }
          ]
        },
        {
          id: "javascript-perusteet",
          title: "JavaScript perusteet",
          description: "JavaScriptin syntaksi, DOM ja tapahtumat selaimessa.",
          pages: [
            { file: "index.html", title: "Yleiskatsaus" }
          ]
        },
        {
          id: "pelinohjelmointi",
          title: "Pelinohjelmointi",
          description: "Pelisilmukka, syötteet, törmäykset ja pelin rakenne.",
          pages: [
            { file: "index.html", title: "Yleiskatsaus" }
          ]
        }
      ]
    },
    {
      id: "ohjelmointi-2",
      title: "Ohjelmointi #2",
      description: "Ohjelmistoprojektin työkalut: versionhallinta, ketterä kehitys ja tuotantoputki.",
      moodleUrl: "",
      sections: [
        {
          id: "versionhallinta-git",
          title: "Versionhallinta (Git)",
          description: "Repositoriot, commitit, haarat ja yhteistyö GitHubissa.",
          pages: [
            { file: "index.html", title: "Yleiskatsaus" }
          ]
        },
        {
          id: "ketteran-kehityksen-perusteet",
          title: "Ketterän kehityksen perusteet",
          description: "Ketterät menetelmät, työn suunnittelu Trellossa ja dokumentointi.",
          pages: [
            { file: "index.html", title: "Yleiskatsaus" }
          ]
        },
        {
          id: "tuotantoputken-perusteet",
          title: "Tuotantoputken perusteet",
          description: "Koodista tuotantoon: rakentaminen, testaus ja julkaisu.",
          pages: [
            { file: "index.html", title: "Yleiskatsaus" }
          ]
        }
      ]
    }
  ],

  /* Interface text. Add another language block here if you need one. */
  strings: {
    fi: {
      home: "Etusivu",
      menu: "Valikko",
      theme: "Vaihda vaalea/tumma teema",
      skip: "Siirry sisältöön",
      courseNav: "Kurssit",
      sidebarNav: "Kurssin sisältö",
      prev: "Edellinen",
      next: "Seuraava",
      start: "Avaa kurssi",
      moodle: "Tehtävät Moodlessa",
      tryit: "Kokeile itse",
      run: "Suorita",
      reset: "Palauta",
      output: "Tulos",
      editor: "Koodieditori",
      line: "rivi",
      copy: "Kopioi",
      copied: "Kopioitu",
      comingSoon: "Sisältö tulossa.",
      contents: "Sisältö",
      edit: "Muokkaa tätä sivua"
    },
    en: {
      home: "Home",
      menu: "Menu",
      theme: "Toggle light/dark theme",
      skip: "Skip to content",
      courseNav: "Courses",
      sidebarNav: "Course contents",
      prev: "Previous",
      next: "Next",
      start: "Open course",
      moodle: "Assignments in Moodle",
      tryit: "Try it yourself",
      run: "Run",
      reset: "Reset",
      output: "Result",
      editor: "Code editor",
      line: "line",
      copy: "Copy",
      copied: "Copied",
      comingSoon: "Content coming soon.",
      contents: "Contents",
      edit: "Edit this page"
    }
  }
};
