# Things are setup inside this plugin.

-   Composer
-   File autoload
-   Gulp automation
-   Shortcode Class
-   Demo Post Type Class

## Environment Configuration

### API Key Setup

The plugin uses The Movie Database (TMDb) API for the movie lists block. You can configure the API key in two ways:

#### Method 1: WordPress Admin (Recommended)

1. Go to **Settings > Gutenberg Starter** in your WordPress admin
2. Enter your TMDb API key in the "The Movie Database API Key" field
3. Click "Save Changes"

#### Method 2: Environment Variables

1. Copy `.env.example` to `.env` in the plugin root directory
2. Add your API key to the `.env` file:
    ```
    MOVIE_BEARER_TOKEN=your_actual_bearer_token_here
    ```
3. Make sure your WordPress installation loads environment variables

### Getting a TMDb API Key

1. Create an account at [The Movie Database](https://www.themoviedb.org/)
2. Go to [API Settings](https://www.themoviedb.org/settings/api)
3. Request an API key
4. Use the API Read Access Token (v4 auth) for bearer token authentication

### Priority Order

The plugin checks for the API key in this order:

1. WordPress admin settings (highest priority)
2. PHP constant `MOVIE_BEARER_TOKEN`
3. Environment variable `$_ENV['MOVIE_BEARER_TOKEN']` (lowest priority)

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
