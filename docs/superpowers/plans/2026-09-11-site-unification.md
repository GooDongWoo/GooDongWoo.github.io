# GitHub Blog Unification Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Unify the portfolio, CV, and blog into a maintainable Jekyll site with one shared visual shell and source of repeated profile data.

**Architecture:** Keep Jekyll and existing public URLs. Add shared Liquid includes and a small shared stylesheet/script, then retain focused page-specific styling for portfolio, blog content, and CV print behavior.

**Tech Stack:** Jekyll, Liquid, YAML data, SCSS/CSS, vanilla JavaScript, GitHub Pages

**Spec:** `docs/superpowers/specs/2026-09-11-site-unification-design.md`

## Global Constraints

- Do not add a framework, CMS, JavaScript package, or CSS dependency.
- Preserve `/`, `/cv/`, `/dates/`, `/categories/`, `/tags/`, `/about/`, and existing post URL behavior.
- Retain bilingual CV, theme toggle, browser print, and PDF export behavior.
- Prefer deletion of unused code over new abstraction.

---

### Task 1: Shared site data and shell

**Files:**
- Create: `_data/profile.yml`
- Create: `_includes/site-header.html`
- Create: `_includes/site-footer.html`
- Create: `assets/css/site-shell.css`
- Create: `assets/js/site-shell.js`
- Modify: `_data/navigation.yml`
- Modify: `_includes/head.html`
- Modify: `_layouts/default.html`

**Interfaces:**
- Consumes: Jekyll `site.data.profile`, `site.data.navigation`, `page.stylesheet`, and `page.body_class`.
- Produces: shared `.site-header`, `.site-nav`, `.site-footer`, `#siteNavToggle`, and `#siteNav` interfaces used by every page.

- [ ] Create centralized profile and four-item navigation data.
- [ ] Add semantic shared header/footer includes using `relative_url` for internal paths.
- [ ] Add shared tokens, responsive navigation, focus states, and reduced-motion rules.
- [ ] Add minimal navigation JavaScript that updates `aria-expanded`, closes on Escape, and marks the current page.
- [ ] Update the shared head to load the common shell plus an optional page stylesheet.
- [ ] Replace the legacy three-column default layout with shared header, centered content, and footer.
- [ ] Verify with `rg` that the default layout no longer includes the legacy sidebars.

### Task 2: Portfolio migration and simplification

**Files:**
- Create: `_data/projects.yml`
- Modify: `index.html`
- Modify: `assets/css/portfolio.css`
- Modify: `assets/js/portfolio.js`

**Interfaces:**
- Consumes: `site.data.profile`, `site.data.projects`, `site.posts`, and the shared shell.
- Produces: `#about`, `#projects`, `#writing`, and `#contact` home sections.

- [ ] Add Jekyll front matter and replace the standalone head/nav/footer with shared includes.
- [ ] Render selected project cards from `_data/projects.yml`.
- [ ] Add a recent-writing section that renders the latest three posts or a Korean empty state.
- [ ] Replace hard-coded repeated contact values with `site.data.profile` references.
- [ ] Remove obsolete blog-card, project-image, particle, form, lazy-loading, dark-toggle, and counter code.
- [ ] Retain only smooth anchor navigation, reveal animation, active section highlighting, and scroll-to-top behavior.
- [ ] Check that no `data-target`, `.particles`, `.contact-form`, or unused optional feature remains.

### Task 3: CV and blog visual integration

**Files:**
- Modify: `cv/index.html`
- Modify: `assets/css/cv.css`
- Modify: `_layouts/archive-dates.html`
- Modify: `_layouts/archive-taxonomies.html`
- Modify: `_layouts/page.html`
- Modify: `_layouts/post.html`
- Modify: `_sass/_layout.scss`
- Modify: `_sass/_archive.scss`
- Modify: `_sass/_posts.scss`
- Modify: `_sass/_variables.scss`
- Modify: `_data/archive.yml`

**Interfaces:**
- Consumes: shared head/header/footer and existing CV element IDs required by `assets/js/cv.js`.
- Produces: consistent blog `.page-shell` and readable `.content-main`; preserves CV language/theme/print control IDs.

- [ ] Convert CV to a Jekyll-processed page using the shared head/header/footer while retaining its action toolbar.
- [ ] Align CV colors, header spacing, and mobile behavior with the shared shell without changing print output.
- [ ] Localize archive labels and add empty states for archives with no posts.
- [ ] Restyle blog/page/post layouts as a single readable column with secondary archive navigation.
- [ ] Remove visible upstream theme branding from the footer and archive pages.
- [ ] Verify CV control IDs referenced by `assets/js/cv.js` still exist exactly once.

### Task 4: Content hygiene, documentation, and CI

**Files:**
- Modify: `README.md`
- Delete: `_posts/2020-09-29-welcome-to-not-pure-poole.md`
- Delete: `_posts/2020-10-01-releasing-not-pure-poole-v0-1-0.md`
- Delete: `_posts/2020-10-02-testing-mathjax.md`
- Delete: `.github/release-drafter.yml`
- Delete: `.github/workflows/release-notes.yml`
- Create: `.github/workflows/jekyll-build.yml`
- Modify: `_config.yml`

**Interfaces:**
- Consumes: GitHub Pages' native build and the repository test scripts.
- Produces: personal-site contributor documentation and lightweight CI status alongside the native Pages build status.

- [ ] Replace the theme README with repository purpose, content locations, and local build commands.
- [ ] Remove demo content and release-drafter automation.
- [ ] Add repository structure and navigation checks for pushes and pull requests; rely on GitHub Pages for the authoritative Jekyll build.
- [ ] Remove placeholder SEO configuration and obsolete theme-package exclusions from `_config.yml`.
- [ ] Run a placeholder/branding scan for `Not Pure Poole`, `xxxx`, and demo post titles.

### Task 5: Verification, commit, and push

**Files:**
- Modify only files needed to correct verification failures.

**Interfaces:**
- Consumes: completed site tree.
- Produces: a verified commit on `master` pushed to `origin`.

- [ ] Inspect `git diff --check` and `git status --short`.
- [ ] Run static assertions for unique IDs, required links, deleted sample content, and JavaScript syntax with `node --check` when Node is available.
- [ ] Run `bundle exec jekyll build`; if Bundler is unavailable, document the local limitation and rely on the pushed CI workflow for the authoritative build.
- [ ] Inspect deployed-source rendering at desktop and 390px using a local build when available.
- [ ] Commit all scoped changes with `feat: unify portfolio and blog experience`.
- [ ] Push the current `master` branch to `origin` and report the resulting commit hash.
