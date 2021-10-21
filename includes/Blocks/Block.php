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
            // $asset_file = require(ANAM_GUTENBERG_STARTER_DIR_URL . 'build/index.asset.php');
            $asset_file = include(ANAM_GUTENBERG_STARTER_PATH . '/build/index.asset.php');
            /**
             * register block script
             */
            wp_register_script(
                'starter-script',
                ANAM_GUTENBERG_STARTER_DIR_URL.'build/index.js', 
                $asset_file['dependencies'], 
                $asset_file['version']
            );
            /**
             * register blocks editor style
             */
            wp_register_style(
                'starter-editor-style', 
                ANAM_GUTENBERG_STARTER_DIR_URL.'build/index.css', 
                [], 
                $asset_file['version']
            );
            /**
             * register blocks frontend style 
             */
            wp_register_style(
                'starter-frontend-style', 
                ANAM_GUTENBERG_STARTER_DIR_URL.'build/style-index.css', 
                [], 
                $asset_file['version']
            );

            /**
             * register block type
             */
            register_block_type( 
                'anam-guternberg-starter-block/blurb', 
                array(
                    'api_version' => 2,
                    'editor_script' => 'starter-script',
                    'editor_style' => 'starter-editor-style',
                    'style' => 'starter-frontend-style'
                )
            );
            register_block_type( 
                'anam-guternberg-starter-block/call-to-action', 
                array(
                    'api_version' => 2,
                    'editor_script' => 'starter-script',
                    'editor_style' => 'starter-editor-style',
                    'style' => 'starter-frontend-style'
                )
            );
            register_block_type( 
                'anam-gutenberg-starter-block/single-post', 
                array(
                    'api_version' => 2,
                    'editor_script' => 'starter-script',
                    'editor_style' => 'starter-editor-style',
                    'style' => 'starter-frontend-style',
                    'render_callback' => [$this, 'single_post_render_frontend_callback']
                )
            );
        }

        public function single_post_render_frontend_callback( $block_attributes, $content ) {
            $selected_category_ID = array_key_exists('selectedCategroyId', $block_attributes) ? +$block_attributes['selectedCategroyId'] : '';
            $recent_posts = wp_get_recent_posts( array(
                'numberposts' => -1,
                'post_status' => 'publish',
                'cat' => $selected_category_ID
            ) );
            if ( count( $recent_posts ) === 0 ) {
                return 'No posts';
            }
            ob_start();
            if( array_key_exists('selectedCategroyId', $block_attributes)):
            ?>
            <div>
                <?php foreach($recent_posts as $post): ?>
                    <p>
                        <?php 
                            echo get_the_post_thumbnail($post['ID'], 'full');
                        ?>
                        <a href="<?php echo get_the_permalink($post['ID']); ?>">
                            <?php echo get_the_title( $post['ID'] ); ?>
                        </a>
                    </p>
                <?php endforeach; ?>
            </div>
            <?php
            else:
                ?>
                <div>
                    <p>Please select a category first from block settings</p>
                </div>
                <?php
            endif;
            $output = ob_get_clean();
            return $output;
        }
    }
        
?>