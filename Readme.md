# Newsly Plugin

## Overview

Newsly is a WordPress plugin that provides dynamic, customizable blocks for displaying news, content, and information in your WordPress site. Built with modern WordPress development practices using @wordpress/scripts and block development standards, Newsly offers a flexible and extensible solution for content management.

## Features

-   **Dynamic Blocks**: Create and use dynamic WordPress blocks within the plugin
-   **Easy Setup**: Quick installation and configuration with npm/yarn support
-   **Block Development**: Streamlined workflow for creating new blocks with the @wordpress/create-block tool
-   **Internationalization**: Built-in i18n support for multi-language compatibility
-   **Production Ready**: Optimized build process for production deployments
-   **Testing**: Comprehensive testing setup with Jest and PHP Unit

## Blocks

The plugin supports dynamic block creation and includes examples for extending functionality. Create new blocks using the block creation commands with variants including dynamic blocks with full PHP support.

### Available Blocks

-   **Category Post**: Displays posts filtered by selected categories with customizable column layout and post count
-   **Featured Posts**: Showcases featured content from specific categories with highlighted presentation
-   **Latest Posts**: Displays the most recent posts with category filtering and pagination options
-   **Post Lists Tab**: Tabbed interface for browsing different post lists with dynamic switching
-   **Smart Category Posts**: Intelligent category-based post display with advanced filtering and sorting capabilities

### Creating New Blocks

Use the following command to generate new dynamic blocks:

```
npx @wordpress/create-block@latest your-block-name --variant=dynamic --no-plugin
```

Each block supports:

-   Server-side rendering (SSR)
-   Full block styling and customization
-   Editor and frontend preview
-   Internationalization support

## Testing Methods

The plugin includes multiple testing approaches:

-   **Jest**: JavaScript/React component testing
-   **PHP Unit**: Server-side PHP testing with phpunit
-   **Coverage Reports**: Generate and track code coverage

---

## Installation Command

Please follow the below instruction to setup you plugin.

#### Composer setup

`composer install`

#### Install node dependencies

`npm install` `or` `yarn install`

#### Start development

`npm run start`

#### Build for production

`npm run build`

#### How to translate a string

`import { __ } from '@wordpress/i18n';`</br>
`console.log( __('My log text here', 'text-domain') );`

#### How to create a block inside src directory.

`npx @wordpress/create-block@latest example-one --variant=dynamic --no-plugin`</br>
`npx @wordpress/create-block@latest example-two --variant=dynamic --no-plugin`

### Important links

[@wordpress/scripts documentation from developer wordpress blog](https://developer.wordpress.org/block-editor/reference-guides/packages/packages-scripts/)</br>
[Minimal Block Example](https://github.com/WordPress/block-development-examples/tree/trunk/plugins/minimal-block-ca6eda)</br>
[How to enqueue assets from build dir with dependency and verions](https://github.com/WordPress/block-development-examples/blob/trunk/plugins/data-basics-59c8f8/plugin.php)</br>

## Testing

#### Jest

`npm run jest`
`npm run jest -- -- coverage`

#### PHP Unit

#### setup

1. check phpcs - `./vendor/bin/phpunit`</br>

2. if not work, need to setup testing environment </br>
   to setup - `bin/install-wp-tests.sh newsly root '' localhost 6.4.3` </br>

3. After successful setup</br>
   `vendor/bin/phpunit`</br>
   `./vendor/bin/phpunit --bootstrap tests/bootstrap.php tests/test-admin-options.php --verbose`</br>
   `vendor/bin/phpunit --bootstrap tests/bootstrap.php tests/test-admin-options.php tests/test-options-settings.php --verbose`</br>

4. in case if it doesn't work, run composer </br>
   `composer install`

#### Playwright

`npx playwright test tests/e2e/simple.spec.js --headed`

To run all test
`npx playwright test`

Run specific test file
`npx playwright test tests/e2e/basic.spec.js`

Run tests with browser visible
`npx playwright test --headed`

Run tests in debug mode
`npx playwright test --debug`

Run tests in UI mode (interactive)
`npx playwright test --ui`

List all available tests
`npx playwright test --list`

View test results report
`npx playwright show-report`
