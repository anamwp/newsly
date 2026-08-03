# Newsly Plugin

## Overview

Newsly is a WordPress plugin that provides dynamic, customizable Gutenberg blocks for displaying news, content, and information on your WordPress site. Built with `@wordpress/scripts` and standard block development practices, Newsly offers a flexible, extensible solution for content management.

## Features

- **Dynamic Blocks**: Server-side rendered (SSR) Gutenberg blocks for post/category display
- **Block Development**: Streamlined workflow for creating new blocks with `@wordpress/create-block`
- **Internationalization**: Built-in i18n support (text domain `newsly`)
- **Testing**: Jest, PHPUnit, and Playwright test coverage

## Blocks

- **Category Post**: Displays posts filtered by selected categories with a customizable column layout and post count
- **Featured Posts**: Showcases featured content from a category in a highlighted card layout
- **Latest Posts**: Displays the most recent posts with category filtering and pagination options
- **Post Lists Tab**: Tabbed interface for browsing different post lists with dynamic switching
- **Smart Category Posts**: Category-based post display with advanced filtering and sorting

See the [Blocks Overview wiki page](../../wiki/Blocks-Overview) for attributes, shared components, and per-block notes.

## Installation

```
composer install
npm install        # or: yarn install
```

Node version is pinned in `.nvmrc` — run `nvm use` first if your global Node differs.

## Common commands

| Command | Purpose |
|---|---|
| `npm run start` | Start development (watches blocks + legacy assets) |
| `npm run build` | Production build |
| `npm run jest` | Run JS unit tests |
| `npm run jest -- --coverage` | Run JS unit tests with coverage |
| `vendor/bin/phpunit` | Run PHP unit tests |
| `npx playwright test` | Run e2e tests |

## Creating a new block

```
npx @wordpress/create-block@latest your-block-name --variant=dynamic --no-plugin
```

## Translating a string

```js
import { __ } from '@wordpress/i18n';
console.log( __( 'My log text here', 'newsly' ) );
```

## Documentation

Deeper documentation lives in this repo's [Wiki](../../wiki) rather than here, so it can grow without bloating this file:

- **[Blocks Overview](../../wiki/Blocks-Overview)** — what each block does, attributes, shared components
- **[Development Workflow](../../wiki/Development-Workflow)** — full setup, block creation, the block-audit process
- **[Testing Guide](../../wiki/Testing-Guide)** — detailed Jest/PHPUnit/Playwright commands, how the two `__mocks__` folders work
- **[Known Issues & Fixes](../../wiki/Known-Issues-And-Fixes)** — real bugs found in this codebase and how they were fixed — read before editing `save.js`, `view.js`, or shared post-card components
- **[Deployment](../../wiki/Deployment)** — how `dev`/`master` reach WP Engine via GitHub Actions

If the Wiki tab is empty, the source pages are drafted in [`wiki/`](wiki/) in this repo — see [`wiki/_publishing.md`](wiki/_publishing.md) for how to push them live.

### Reference links

- [@wordpress/scripts documentation](https://developer.wordpress.org/block-editor/reference-guides/packages/packages-scripts/)
- [Minimal Block Example](https://github.com/WordPress/block-development-examples/tree/trunk/plugins/minimal-block-ca6eda)
- [Enqueuing built assets with dependencies/versions](https://github.com/WordPress/block-development-examples/blob/trunk/plugins/data-basics-59c8f8/plugin.php)
