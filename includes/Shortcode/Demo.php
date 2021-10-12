<?php 
    namespace WP\PluginStarter\Shortcode;

    class Demo{
        /**
         * self instance 
         * of this shortcode
         *
         * @var [type]
         */
        private static $instance;
        public static function init() {
            if ( null === self::$instance ) {
                self::$instance = new self;
            }
            return self::$instance;
        }
        /**
         * constructor of 
         * this class
         */
        private function __construct(){
            add_shortcode('demo-shortcode', [$this, 'render_shortcode_content_for_demo']);
        }
        /**
         * function to render
         * shortcode content
         *
         * @param [type] $atts
         * @param string $content
         * @return void
         */
        public function render_shortcode_content_for_demo( $atts, $content='' ){
            ob_start();
            $option = array(
                'param1'	=> __('Value for parameter one', 'wp-plugin-starter'),
                'param2'	=> __('Value for parameter two', 'wp-plugin-starter'),
            );
            $data = shortcode_atts( $option, $atts );
            ?>
            <div class="shortcode-wrapper">
                <p><?php echo esc_html($data['param1']); ?></p>
                <p><?php echo esc_html($data['param2']); ?></p>
            </div>
            <?php
            $output = ob_get_clean();
            return $output;
        }
    }

?>