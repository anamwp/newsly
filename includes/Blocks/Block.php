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
            new Blurb\Block();
        }
    }
        
?>