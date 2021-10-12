<?php 
    namespace WP\PluginStarter\PostType;

    class Demo {
        /**
         * custom post type
         *
         * @var string
         */
        private $post_type = 'demo';
        /**
         * taxonomy type
         *
         * @var string
         */        
        private $taxonomy = 'demo-category';

       /**
        * self instance
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
         * constructor of this class
         */
        private function __construct() {
            add_action( 'init', array( $this, 'register_post_type' ), 0 );
            add_action( 'init', array( $this, 'register_taxonomy' ), 0 );
        }
        /**
         * function to
         * register custom post type
         * @return void
         */
        public function register_post_type() {
            $labels = array(
                'name'                  => _x( 'Demo', 'Post Type General Name', 'wp-plugin-starter' ),
                'singular_name'         => _x( 'Demo', 'Post Type Singular Name', 'wp-plugin-starter' ),
                'menu_name'             => __( 'Demo', 'wp-plugin-starter' ),
                'name_admin_bar'        => __( 'Demo', 'wp-plugin-starter' ),
                'archives'              => __( 'Demo Archives', 'wp-plugin-starter' ),
                'parent_item_colon'     => __( 'Parent Demo:', 'wp-plugin-starter' ),
                'all_items'             => __( 'All Demo', 'wp-plugin-starter' ),
                'add_new_item'          => __( 'Add New Demo', 'wp-plugin-starter' ),
                'add_new'               => __( 'Add New', 'wp-plugin-starter' ),
                'new_item'              => __( 'New Demo', 'wp-plugin-starter' ),
                'edit_item'             => __( 'Edit Demo', 'wp-plugin-starter' ),
                'update_item'           => __( 'Update Demo', 'wp-plugin-starter' ),
                'view_item'             => __( 'View Demo', 'wp-plugin-starter' ),
                'search_items'          => __( 'Search Demo', 'wp-plugin-starter' ),
                'not_found'             => __( 'Not found', 'wp-plugin-starter' ),
                'not_found_in_trash'    => __( 'Not found in Trash', 'wp-plugin-starter' ),
                'featured_image'        => __( 'Featured Image', 'wp-plugin-starter' ),
                'set_featured_image'    => __( 'Set featured image', 'wp-plugin-starter' ),
                'remove_featured_image' => __( 'Remove featured image', 'wp-plugin-starter' ),
                'use_featured_image'    => __( 'Use as featured image', 'wp-plugin-starter' ),
                'insert_into_item'      => __( 'Insert into Demo', 'wp-plugin-starter' ),
                'uploaded_to_this_item' => __( 'Uploaded to this Demo', 'wp-plugin-starter' ),
                'items_list'            => __( 'Demo list', 'wp-plugin-starter' ),
                'items_list_navigation' => __( 'Demo list navigation', 'wp-plugin-starter' ),
                'filter_items_list'     => __( 'Filter Demo list', 'wp-plugin-starter' ),
            );
            /**
             * arguments for 
             * custom post type
             */
            $args = array(
                'label'                 => __( 'Demo ', 'wp-plugin-starter' ),
                'description'           => __( 'Add and manage Demo information', 'wp-plugin-starter' ),
                'labels'                => $labels,
                'supports'              => array( 'title', 'editor', 'thumbnail', 'excerpt' ),
                'taxonomies'            => array( ),
                'hierarchical'          => false,
                'public'                => true,
                'show_ui'               => true,
                'show_in_menu'          => true,
                'menu_position'         => 25,
                'menu_icon'             => 'dashicons-admin-post',
                'show_in_admin_bar'     => true,
                'show_in_nav_menus'     => true,
                'can_export'            => true,
                'has_archive'           => true,
                'exclude_from_search'   => false,
                'publicly_queryable'    => true,
                'capability_type'       => 'page',
                'rewrite'               => array( 'slug' => 'demo' ),
            );
            /**
             * kick the registration
             */
            register_post_type( $this->post_type, $args );
        }
        /**
         * function to
         * register taxonomy
         *
         * @return void
         */
        public function register_taxonomy() {
            $labels = array(
                'name'                       => _x( 'Categories', 'Taxonomy General Name', 'wp-plugin-starter' ),
                'singular_name'              => _x( 'Category', 'Taxonomy Singular Name', 'wp-plugin-starter' ),
                'menu_name'                  => __( 'Categories', 'wp-plugin-starter' ),
                'all_items'                  => __( 'All Items', 'wp-plugin-starter' ),
                'parent_item'                => __( 'Parent Item', 'wp-plugin-starter' ),
                'parent_item_colon'          => __( 'Parent Item:', 'wp-plugin-starter' ),
                'new_item_name'              => __( 'New Item Name', 'wp-plugin-starter' ),
                'add_new_item'               => __( 'Add New', 'wp-plugin-starter' ),
                'edit_item'                  => __( 'Edit', 'wp-plugin-starter' ),
                'update_item'                => __( 'Update', 'wp-plugin-starter' ),
                'separate_items_with_commas' => __( 'Separate with commas', 'wp-plugin-starter' ),
                'search_items'               => __( 'Search', 'wp-plugin-starter' ),
                'add_or_remove_items'        => __( 'Add or remove items', 'wp-plugin-starter' ),
                'choose_from_most_used'      => __( 'Choose from the most used items', 'wp-plugin-starter' ),
                'not_found'                  => __( 'Not Found', 'wp-plugin-starter' )
            );
            /**
             * arguments to 
             * register taxonomy
             */
            $args = array(
                'labels'                     => $labels,
                'hierarchical'               => true,
                'public'                     => true,
                'show_ui'                    => true,
                'show_admin_column'          => true,
                'show_in_nav_menus'          => true,
                'show_tagcloud'              => true,
                'rewrite'                    => array( 'slug' => 'demo-category' ),
            );
            /**
             * kick the registration
             */
            register_taxonomy( $this->taxonomy, $this->post_type, $args );
        }


    }

?>