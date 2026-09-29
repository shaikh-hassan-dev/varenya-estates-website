# Varenya Estates

Single-page marketing website prototype for Varenya Estates, a luxury real estate agency in Mumbai.
Built as a static site with Vite, React, TypeScript and Tailwind CSS v4; motion uses GSAP and Lenis.

> **Prototype.** Prices, team members, testimonials and several photographs are illustrative placeholders.
> The site is not for public deployment until every item in [docs/LAUNCH-CHECKLIST.md](docs/LAUNCH-CHECKLIST.md)
> is cleared. `public/robots.txt` currently blocks all crawlers.

## Requirements
- Node.js 20 or later (developed with Node.js 24) and npm.
- For the measurement and test scripts only: Playwright browsers (`npx playwright install chromium`;
  add `firefox webkit` for the cross-browser smoke test).

## Install and run
```sh
npm install
npm run dev       # development server at http://localhost:5173/
npm run build     # type-check and build the static site into dist/
npm run preview   # serve the production build at http://localhost:4173/
npm run lint      # oxlint
```
`dist/` is a plain static site and can be served by any static host.

## Measurement and test scripts
All scripts drive a running site (start `npm run dev` or `npm run preview` first) and print JSON or tables.
Pass the site URL as the first argument.

| Script | Checks |
|---|---|
| `npm run measure` (`scripts/measure.mjs`) | Typography scale, H1 line count and navigation size per viewport width |
| `node scripts/measure-sections.mjs <url>` | Hero, About, Properties and Services geometry at 7 widths |
| `node scripts/measure-p4.mjs <url>` | Executive Team, By The Numbers and Testimonials geometry at 7 widths |
| `node scripts/measure-page.mjs <url>` | Every section's position and height, the contact card and the footer |
| `node scripts/measure-phase5.mjs <url>` | Entrance animation timeline, magnetic buttons, URL without hash, reduced motion |
| `node scripts/smoke.mjs <url>` | Chromium, Firefox and WebKit: render, menu, carousels, smooth scrolling |

Add a label and a screenshot folder as further arguments to save screenshots, for example
`node scripts/measure-p4.mjs http://localhost:5173/ build shots`.

## How to edit content
All visible text, links and image references are in **`src/content/content.ts`**. Components only read from it,
so content changes never require editing components. After editing, run `npm run build` to check for errors.

| What | Where in `content.ts` | Notes |
|---|---|---|
| Company name, navigation, button labels | `site`, `nav` | `nav.menu[].target` is the section id, e.g. `#team`. |
| Hero, About, section headings and intros | `hero`, `about`, `properties`, `services`, `team`, `numbers`, `testimonials`, `cta` | `eyebrow` is the small label above each heading. |
| Property names, details and prices | `properties.items[]` (`name`, `detail`, `price`) | Current prices are illustrative placeholders. |
| Team names, roles and photos | `team.members[]` | Photo helper `teamPhoto('<file name>', '<alt text>')`. |
| Statistics | `numbers.stats[]` (`label`, `value`, `icon`) | `icon` is one of `house`, `users`, `indian-rupee`, `trending-up`. |
| Testimonials | `testimonials.items[]` (`tag`, `title`, `quote`, `name`, `date`, `avatar`, `image`) | Current entries are placeholders. |
| Footer links, copyright, tagline | `footer.columns[]`, `footer.copyright`, `footer.tagline` | A link target of `#` renders an inactive item. |
| MahaRERA registration number | `site.reraRegistrationNumber` (label: `site.reraLabel`) | Nothing is shown while it is empty; once filled in, it appears below the footer. |
| Contact details | `contact` | Placeholders; the current design does not display them. |

### Images
- Image files live in `public/images/` as WebP, each in a 1x and a 2x size; the helpers at the top of
  `content.ts` (`heroPhoto`, `tallPhoto`, `teamPhoto`, `avatar`, `testimonialPhoto`) build the file names,
  responsive `srcset`, sizes and dimensions.
- To replace a photo, export it at the same pixel sizes and aspect ratio as the file it replaces and keep the
  file name, or change the name passed to the helper. Update the `alt` text to describe the new photo.
- Some photos are reused across sections by design (for example, the testimonial avatars are the team
  portraits). Replacing a team portrait therefore also changes the matching avatar files.
- Record the source and licence of every photo in `docs/image-credits.md`.

## Project structure
```
src/content/content.ts   all copy, links and image references
src/components/          one component per section, plus shared Button, Photo, Reveal, AnimatedText
src/motion.ts            smooth scrolling and entrance animation helpers (reduced-motion aware)
src/index.css            design tokens and type scale
public/images/           photography
scripts/                 measurement and test scripts
docs/                    image credits and launch checklist
```
