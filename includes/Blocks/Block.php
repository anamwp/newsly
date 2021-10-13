<?php 
    namespace Anam\GutenbergStarter\Blocks;
    
    class Block{
        /**
         * Undocumented variable
         *
         * @var [type]
         */
        private static $instance;
        /**
         * Undocumented function
         *
         * @return void
         */
        public static function init() {
            if ( null === self::$instance ) {
                self::$instance = new self;
            }
            return self::$instance;
        }
        /**
         * Undocumented function
         */
        public function __construct(){
            add_action('init', [$this, 'register_starter_blocks']);
        }
        
        public function register_starter_blocks(){
            $asset_file = include(ANAM_GUTENBERG_STARTER_URL . '/build/index.asset.php');
            /**
             * register block script
             */
            wp_register_script(
                'starter-script',
                ANAM_GUTENBERG_STARTER_URL.'/build/index.js', 
                $asset_file['dependencies'], 
                $asset_file['version']
            );
            /**
             * register block type
             */
            register_block_type( 
                'anam-guternberg-starter-block/blurb', 
                array(
                    'api_version' => 2,
                    'editor_script' => 'starter-script'
                )
            );
            register_block_type( 
                'anam-guternberg-starter-block/call-to-action', 
                array(
                    'api_version' => 2,
                    'editor_script' => 'starter-script'
                )
            );
        }
    }
        
?>