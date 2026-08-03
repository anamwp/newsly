# Newsly Wiki

Newsly is a WordPress plugin providing dynamic Gutenberg blocks for displaying news/post content, built with `@wordpress/scripts`.

This wiki holds the details that don't belong in the repo's `Readme.md` (which stays a quick-start). Start here, then jump to the page you need:

- **[Blocks Overview](Blocks-Overview)** — what each block does, its attributes, and its shared components.
- **[Development Workflow](Development-Workflow)** — creating a new block, i18n, the block-audit process used when reviewing a block against the React/performance ruleset.
- **[Testing Guide](Testing-Guide)** — Jest, PHPUnit, and Playwright setup and commands, plus how this repo's two `__mocks__` folders work together.
- **[Known Issues & Fixes](Known-Issues-And-Fixes)** — a running log of real bugs found (and fixed) in this codebase, several of them subtle enough to bite again if reintroduced. Worth reading before touching `save.js` on any block.
- **[Deployment](Deployment)** — how `dev`/`master` pushes reach WP Engine via GitHub Actions.

## Plugin at a glance

- **Author**: Anam ([anam.rocks](https://anam.rocks))
- **Requires**: PHP (see `composer.json`), Node `v16.15.0` (see `.nvmrc`), Composer 2.x
- **Text domain**: `newsly`
- **Build tooling**: `@wordpress/scripts`, Babel, PostCSS/Tailwind for legacy `assets/` styles
