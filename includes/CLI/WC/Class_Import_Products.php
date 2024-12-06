<?php
namespace Anam\GutenbergStarter\CLI\WC;
/**
 * Fetch products from dummyjson.com/products.
 *
 * @since 1.0.0
 */
class Class_Import_Products {
	private static $instance;
	private static $api_url = 'https://dummyjson.com/products';
	/**
	 * Instance of this class
	 *
	 * @return void
	 */
	public static function init() {
		if ( null === self::$instance ) {
			self::$instance = new self();
		}
		return self::$instance;
	}
	/**
	 * Construct of Class
	 */
	public function __construct() {}
	/**
	 * Fetch products from dummyjson.com/products
	 *
	 * @return void
	 */
	public function fetch_product_from_api(){
		$response = wp_remote_get( self::$api_url );
		if ( is_wp_error( $response ) ) {
			\WP_CLI::error('Failed to fetch data from the API');
			return [];
		}
		$response_body = wp_remote_retrieve_body( $response );
		$response_body_obj = json_decode( $response_body, true );
		$product_arr = $response_body_obj['products'];
		/**
		 * If no products found then return error
		 */
		if( empty( $product_arr ) ){
			\WP_CLI::error('No products found');
			return [];
		}
		return $product_arr;
	}
	/**
	 * Check if product exists
	 *
	 * @param [string] $sku - product sku.
	 * @return void
	 */
	public function check_product_exists( $sku ){
		global $wpdb;
		/**
		 * get post id by meta key and value
		 */
		$product_exists = $wpdb->get_var( $wpdb->prepare( "SELECT post_id FROM $wpdb->postmeta WHERE meta_key = '_sku' AND meta_value = %s", $sku ) );
		if( $product_exists ){
			return [
				'product_id' => $product_exists,
				'product_status' => true
			];
		}
		return [
			'product_id' => false,
			'product_status' => false
		];
	}
	/**
	 * Insert or update products in woocommerce
	 *
	 * @param [array] $product - product array.
	 * @return void
	 */
	public function manage_products_in_woocommerce( $product ){
		/**
		 * Check if product already exists
		 */
		$product_exists = $this->check_product_exists( 'gs-dummy-'.$product['sku'] );
		if($product_exists['product_status']){
			dump($product['dimensions']['depth']);
			\WP_CLI::warning('Product already exists: '.$product['title']);
			return false;
		}else{
			/**
			 * Insert new product
			 */
			\WP_CLI::log('Inserting new proudct where title is - : '.$product['title']);
			$product_id = wp_insert_post([
				'post_title' => $product['title'],
				'post_content' => $product['description'],
				'post_status' => 'publish',
				'post_type' => 'product'
			]);
			/**
			 * if something wrong then return false
			 */
			if(is_wp_error( $product_id ) || !$product_id ){
				\WP_CLI::warning('Failed to insert product: '.$product['title']);
				return false;
			}
			\WP_CLI::log("Product inserted. Now adding Meta for - {$product['title']}");
			/**
			 * Set product price
			 */
			update_post_meta( $product_id, '_regular_price', $product['price'] );
			update_post_meta( $product_id, '_price', $product['price'] );
			/**
			 * Set product SKU
			 */
			update_post_meta( $product_id, '_sku', 'gs-dummy-'.$product['sku'] );
			/**
			 * Set stock
			 */
			if( $product['stock'] > 0 ){
				update_post_meta( $product_id, '_manage_stock', 'yes' );
				update_post_meta( $product_id, '_stock', $product['stock'] );
				update_post_meta( $product_id, '_stock_status', 'instock' );
			}else{
				update_post_meta( $product_id, '_manage_stock', 'no' );
				// update_post_meta( $product_id, '_stock_status', 'outofstock' );
			}
			// Add dimensions
			
            update_post_meta($product_id, '_length', $product['dimensions']['depth'] ?? '0');
            update_post_meta($product_id, '_width', $product['dimensions']['width'] ?? '0');
            update_post_meta($product_id, '_height', $product['dimensions']['height'] ?? '0');

            // Add weight
            update_post_meta($product_id, '_weight', $product['weight'] ?? '0');

            // Add brand as a custom meta field or taxonomy
            $brand = $product['brand'] ?? 'Unknown Brand';
            update_post_meta($product_id, 'brand', sanitize_text_field($brand));

            // Add warranty information as a custom meta field
            $warranty = $product['warrantyInformation'] ?? 'No warranty information provided.';
            update_post_meta($product_id, 'warrantyInformation', sanitize_textarea_field($warranty));

			// Add shipping information (custom tab)
            $shipping_info = $product['shippingInformation'] ?? 'No shipping information provided.';
            update_post_meta($product_id, 'shipping_tab_information', sanitize_textarea_field($shipping_info));
			
			// Return policy
            $return_policy = $product['returnPolicy'] ?? 'No return policy.';
            update_post_meta($product_id, 'return_policy', sanitize_textarea_field($return_policy));

			\WP_CLI::log("Meta information added for product - {$product['title']}");

			// Add reviews
            if (!empty($product['reviews'])) {
                foreach ($product['reviews'] as $review) {
                    $this->add_product_review($product_id, $review);
                }
            }

			/**
			 * Add featured image
			 */
			/**
			 * Log the info in the wp-cli
			 */
			\WP_CLI::success('Product inserted: '.$product['title']);
		}
	}
	public function manage_attributes(){

	}
	private function add_product_review($product_id, $review_data) {
		$comment_data = [
			'comment_post_ID' => $product_id,
			'comment_author' => $review_data['reviewerName'] ?? 'Anonymous',
			'comment_author_email' => $review_data['reviewerEmail'] ?? '',
			'comment_content' => $review_data['comment'] ?? 'No review content provided.',
			'comment_type' => 'review',
			'comment_date' => $review_data['date'] ?? current_time('mysql'),
			'comment_approved' => 1,
		];

		$comment_id = wp_insert_comment($comment_data);

		if (!is_wp_error($comment_id)) {
			update_comment_meta($comment_id, 'rating', $review_data['rating'] ?? 0);
			\WP_CLI::log("Review added for product ID {$product_id} (Review ID: {$comment_id})");
		} else {
			\WP_CLI::warning("Failed to add review for product ID {$product_id}");
		}
	}
	/**
	 * CLI function to import products
	 * 
	 * @return void
	 */
	public function import_products(){
		$product_arr = $this->fetch_product_from_api();
		/**
		 * Loop through the products and insert or update in woocommerce
		 */
		if ( ! empty( $product_arr ) ) {
			foreach ( $product_arr as $product ) {
				if($product){
					$this->manage_products_in_woocommerce( $product );
				}
			}
		}
	}

	public function delete_products(){
		$product_arr = $this->fetch_product_from_api();
		/**
		 * Loop through the products and delete from woocommerce
		 */
		if ( ! empty( $product_arr ) ) {
			foreach ( $product_arr as $product ) {
				if($product){
					$product_sku = 'gs-dummy-'.$product['sku'];
					$product_available_status_arr = $this->check_product_exists( $product_sku );
					if($product_available_status_arr['product_status']){
						$this->delete_inserted_product($product_available_status_arr['product_id']);
					}else{
						\WP_CLI::warning('Product not found: '.$product['title']);
					}
				}
			}
		}
	}

	public function delete_inserted_product($product_id){
		wp_delete_post( $product_id, true );
		\WP_CLI::success('Product deleted: '.$product_id);
	}

}