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

`import { __ } from '@wordpress/i18n';
console.log( __('My log text here', 'text-domain') );`

#### How to create a block inside src directory.

`npx @wordpress/create-block@latest example-one --variant=dynamic --no-plugin`
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

setup
check phpcs - `./vendor/bin/phpunit`
if not work, need to setup testing environment
to setup - `bin/install-wp-tests.sh newsly root '' localhost 6.4.3`
After successful setup
`vendor/bin/phpunit`
`./vendor/bin/phpunit --bootstrap tests/bootstrap.php tests/test-admin-options.php --verbose`
`vendor/bin/phpunit --bootstrap tests/bootstrap.php tests/test-admin-options.php tests/test-options-settings.php --verbose`
in case if it doesn't work, run composer
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
