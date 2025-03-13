# Things are setup inside this plugin.

-   Composer
-   File autoload
-   Gulp automation
-   Shortcode Class
-   Demo Post Type Class

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

#### Automation Command

-   To compile and watch sass and js `gulp`
-   To zip plugin `gulp package` . Please check the specific command for more details in `gulpfile.js` If you want to change the package zip name, you need to change the name inside `package` command.
-   To clean the zip and dist directory `gulp clean`

#### How to translate a string

`import { __ } from '@wordpress/i18n';
console.log( __('My log text here', 'text-domain') );`

#### How to create a block inside src directory.

`npx @wordpress/create-block@latest example-one --variant=dynamic --no-plugin`
`npx @wordpress/create-block@latest example-two --variant=dynamic --no-plugin`

### Important links

[@wordpress/scripts documentation from developer wordpress blog](https://developer.wordpress.org/block-editor/reference-guides/packages/packages-scripts/)
[Minimal Block Example](https://github.com/WordPress/block-development-examples/tree/trunk/plugins/minimal-block-ca6eda)
[How to enqueue assets from build dir with dependency and verions](https://github.com/WordPress/block-development-examples/blob/trunk/plugins/data-basics-59c8f8/plugin.php)
