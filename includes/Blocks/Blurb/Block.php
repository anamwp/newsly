<?php 
    namespace WP\PluginStarter\Blocks\Blurb;

    class Block{
       /**
        * Undocumented function
        */
        public function __construct(){
            add_action('init', [$this, 'create_blurb_block']);
        }
        /**
         * Undocumented function
         *
         * @return void
         */
        public function create_blurb_block(){
            $asset_file = include(GUTENBERG_STARTER_URL . '/build/index.asset.php');
            /**
             * register block script
             */
            wp_register_script(
                'blurb-script',
                GUTENBERG_STARTER_URL.'/build/index.js', 
                $asset_file['dependencies'], 
                $asset_file['version']
            );
            /**
             * register block type
             */
            register_block_type( 
                'starter-block/blurb', 
                array(
                    'api_version' => 2,
                    'editor_script' => 'blurb-script'
                )
            );
        }
    }
?>