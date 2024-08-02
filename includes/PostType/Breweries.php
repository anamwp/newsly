<?php
	namespace Anam\GutenbergStarter\PostType;

class Breweries {
	/**
	 * custom post type
	 *
	 * @var string
	 */
	private $post_type = 'breweries';

	/**
	 * self instance
	 *
	 * @var [type]
	 */
	private static $instance;
	public static function init() {
		if ( null === self::$instance ) {
			self::$instance = new self();
		}
		return self::$instance;
	}
	/**
	 * constructor of this class
	 */
	private function __construct() {
		add_action( 'init', array( $this, 'register_post_type' ), 0 );
		/**
		 * Run cron
		 */
		$this->run_custom_cron();
		/**
		 * Set the ajax handle action
		 */
		add_action('wp_ajax_nopriv_get_breweries_from_api', [$this, 'handle_content_for_breweries']);
		add_action('wp_ajax_get_breweries_from_api', [$this, 'handle_content_for_breweries']);

	}
	public function run_custom_cron(){
		$cron_args = array( false );
		if ( ! wp_next_scheduled( 'get_breweries_from_api', $cron_args ) ) {
			wp_schedule_event( time(), 'weekly', 'get_breweries_from_api', $cron_args );
		}
	}
	/**
	 * function to
	 * register custom post type
	 *
	 * @return void
	 */
	public function register_post_type() {
		$labels = array(
			'name'                  => _x( 'Brewery', 'Post Type General Name', 'wp-plugin-starter' ),
			'singular_name'         => _x( 'Brewery', 'Post Type Singular Name', 'wp-plugin-starter' ),
			'menu_name'             => __( 'Brewery', 'wp-plugin-starter' ),
			'name_admin_bar'        => __( 'Brewery', 'wp-plugin-starter' ),
			'archives'              => __( 'Brewery Archives', 'wp-plugin-starter' ),
			'parent_item_colon'     => __( 'Parent Brewery:', 'wp-plugin-starter' ),
			'all_items'             => __( 'All Breweries', 'wp-plugin-starter' ),
			'add_new_item'          => __( 'Add New Brewery', 'wp-plugin-starter' ),
			'add_new'               => __( 'Add New', 'wp-plugin-starter' ),
			'new_item'              => __( 'New Brewery', 'wp-plugin-starter' ),
			'edit_item'             => __( 'Edit Brewery', 'wp-plugin-starter' ),
			'update_item'           => __( 'Update Brewery', 'wp-plugin-starter' ),
			'view_item'             => __( 'View Brewery', 'wp-plugin-starter' ),
			'search_items'          => __( 'Search Brewery', 'wp-plugin-starter' ),
			'not_found'             => __( 'Not found', 'wp-plugin-starter' ),
			'not_found_in_trash'    => __( 'Not found in Trash', 'wp-plugin-starter' ),
			'featured_image'        => __( 'Featured Image', 'wp-plugin-starter' ),
			'set_featured_image'    => __( 'Set featured image', 'wp-plugin-starter' ),
			'remove_featured_image' => __( 'Remove featured image', 'wp-plugin-starter' ),
			'use_featured_image'    => __( 'Use as featured image', 'wp-plugin-starter' ),
			'insert_into_item'      => __( 'Insert into Brewery', 'wp-plugin-starter' ),
			'uploaded_to_this_item' => __( 'Uploaded to this Brewery', 'wp-plugin-starter' ),
			'items_list'            => __( 'Brewery list', 'wp-plugin-starter' ),
			'items_list_navigation' => __( 'Brewery list navigation', 'wp-plugin-starter' ),
			'filter_items_list'     => __( 'Filter Brewery list', 'wp-plugin-starter' ),
		);
		/**
		 * arguments for
		 * custom post type
		 */
		$args = array(
			'label'               => __( 'Brewery ', 'wp-plugin-starter' ),
			'description'         => __( 'Add and manage Brewery information', 'wp-plugin-starter' ),
			'labels'              => $labels,
			'supports'            => array( 'title', 'thumbnail', 'excerpt' ),
			'taxonomies'          => array(),
			'hierarchical'        => false,
			'public'              => true,
			'show_ui'             => true,
			'show_in_menu'        => true,
			'show_in_rest'        => true,
			'menu_position'       => 25,
			'menu_icon'           => 'dashicons-admin-post',
			'show_in_admin_bar'   => true,
			'show_in_nav_menus'   => true,
			'can_export'          => true,
			'has_archive'         => true,
			'exclude_from_search' => false,
			'publicly_queryable'  => true,
			'capability_type'     => 'page',
			'rewrite'             => array( 'slug' => 'breweries' ),
		);
		/**
		 * kick the registration
		 */
		register_post_type( $this->post_type, $args );
	}
	public function handle_content_for_breweries() {
		/**
		 * Resource - https://www.youtube.com/watch?v=LWM41Rcao3s
		 */
		/**
		 * file to add log
		 */
		$file = plugin_dir_path( __DIR__ ). '/report.txt';

		/**
		 * Set current page for the pagination
		 */
		$current_page = ! empty( $_POST['current_page'] ) ? $_POST['current_page'] : 1;
		/**
		 * Brewries array to store results
		 */
		$breweries = [];
		/**
		 * Get results from remote API
		 */
		$results = wp_remote_retrieve_body(wp_remote_get('https://api.openbrewerydb.org/v1/breweries?page=' . $current_page . '&per_page=50'));
		/**
		 * Put data in the file
		 */
		file_put_contents($file, "current Page: ". $current_page. "\n\n", FILE_APPEND);
		/**
		 * Decode the results
		 */
		$results = json_decode($results);
		/**
		 * Return false
		 * if result is not array or empty
		 */
		if(! is_array($results) || empty($results)){
			return false;
		}
		/**
		 * Update breweries array for the results
		 */
		$breweries[] = $results;
		/**
		 * Loop through each brewries
		 * Prepare the slug
		 * Create post
		 */
		foreach( $breweries[0] as $brewery ):
			/**
			 * Prepare the slug for title
			 */
			$brewery_slug = sanitize_title($brewery->name.'-'.$brewery->id);
			/**
			 * Get existing brewery post object data
			 */
			$existing_brewery = get_page_by_path( $brewery_slug, 'OBJECT', 'breweries' );
			/**
			 * If no brewery found
			 * then create and update
			 */
			if( $existing_brewery === null ){
				/**
				 * Create post for the brewries
				 */
				$inserted_brewery = wp_insert_post([
					'post_name' => $brewery_slug,
					'post_title' => $brewery_slug,
					'post_type' => 'breweries',
					'post_status' => 'publish',
				]);
				/**
				 * If error then continue to the next
				 */
				if(is_wp_error($inserted_brewery)){
					continue;
				}
				/**
				 * Get the ACF key to insert the data
				 */
				$fillable_keys = [
					'name',
					'brewery_type',
					'address_1',
					'address_2',
					'address_3',
					'city',
					'state_province',
					'postal_code',
					'country',
					'longitude',
					'latitude',
					'phone',
					'website_url',
					'state',
					'street'
				];
				/**
				 * Loop throught each key and update ACF fields
				 * for the respective post ID
				 */
				foreach($fillable_keys as $key):
					update_field($key, $brewery->$key, $inserted_brewery);
				endforeach;
				file_put_contents($file, "\t\t\t New data added for ". $brewery->id. "\n\n", FILE_APPEND);
			}else{
				$existing_brewery_id = $existing_brewery->ID;
				/**
				 * if found existing brewery
				 * Compare the id with title
				 */
				$existing_brewery_title = $existing_brewery->post_title;
				$new_brewery_title = $brewery_slug;
				/**
				 * if title with slug is not similar
				 * update existing brewery
				 */
				if( $new_brewery_title !== $existing_brewery_title ){
					/**
					 * Update brewery
					 */
					/**
					 * Get the ACF key to insert the data
					 */
					$fillable_keys = [
						'name',
						'brewery_type',
						'address_1',
						'address_2',
						'address_3',
						'city',
						'state_province',
						'postal_code',
						'country',
						'longitude',
						'latitude',
						'phone',
						'website_url',
						'state',
						'street'
					];
					/**
					 * Loop throught each key and update ACF fields
					 * for the respective post ID
					 */
					foreach($fillable_keys as $key):
						update_field($key, $brewery->$key, $existing_brewery_id);
					endforeach;
					file_put_contents($file, "\t\t\t Old brewery updated for ". $existing_brewery_title. "\n\n", FILE_APPEND);
				}
				file_put_contents($file, "\t\t Nothing happend for ". $existing_brewery_title. "\n\n", FILE_APPEND);
			}
			file_put_contents($file, "\t == Nothing happend for nore ==". "\n\n", FILE_APPEND);

		endforeach;
		/**
		 * Increment page number
		 */
		$current_page = $current_page + 1;
		/**
		 * Set the remove post call recursively
		 */
		wp_remote_post( admin_url('admin-ajax.php?action=get_breweries_from_api'), [
			'blocking' => false,
			'sslverify' => false,
			'body' => [
				'current_page' => $current_page
			]
		] );
	}
}


