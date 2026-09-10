# GitHub Blog Unification Design

## Goal

Turn the existing portfolio, CV, and Jekyll blog into one coherent personal site without changing frameworks or public URLs.

## Architecture

- Keep Jekyll and GitHub Pages as the rendering and hosting platform.
- Introduce a shared site header, footer, design tokens, and navigation data used by the portfolio, CV, and blog layouts.
- Keep page-specific CSS for portfolio, long-form blog content, and printable CV behavior while sharing only the stable shell.
- Store repeated identity and contact information in `_data/profile.yml`; keep detailed bilingual CV copy inside the CV page because it is not reused elsewhere.

## Information Architecture

The primary navigation contains Home, Projects, Blog, and CV. About remains part of the home narrative, contact information lives in the shared footer, and category/tag archives remain secondary blog navigation.

The home page presents: introduction, proof points, selected projects, recent writing, and contact CTA. The blog archive remains at `/dates/`, and existing `/categories/`, `/tags/`, `/about/`, `/cv/`, and post URLs remain valid.

## Visual Direction

Use a graphite monochrome palette with a restrained cool-gray accent, a consistent Inter/Noto Sans KR type stack, clear spacing, and minimal motion. Remove decorative particles and animated counters. The blog uses a readable single content column with optional table of contents; CV retains print and bilingual controls.

## Content and Repository Hygiene

- Remove upstream theme demo posts and theme-release automation.
- Replace the upstream theme README with personal-site development instructions.
- Keep the MIT license and Jekyll theme source that is still used by the blog.
- Show an honest empty state until original posts are published.

## Accessibility and Quality

- Navigation toggle exposes `aria-expanded` and closes on Escape or link activation.
- Current navigation state uses `aria-current` where applicable.
- Focus styles and `prefers-reduced-motion` are supported.
- Internal assets and links use Jekyll `relative_url` filters.
- Every page receives SEO/feed metadata through the shared head include.
- A GitHub Actions workflow runs the supported Jekyll build on pushes and pull requests.

## Acceptance Criteria

- Home, CV, archives, posts, About, and 404 share the same site header, palette, typography, and footer.
- Repeated profile/contact details come from one data file where they are reused.
- No upstream sample posts or Not Pure Poole branding are visible on the deployed site.
- Home contains no unused particle, fake form, lazy-loader, or counter code.
- The mobile navigation is keyboard operable and pages do not overflow at 390px.
- `bundle exec jekyll build` succeeds in CI and locally when Ruby/Bundler are installed.

