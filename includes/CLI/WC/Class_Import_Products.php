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

			// Add categories and tags
            if (!empty($product['category'])) {
                $cat_assign_status = wp_set_object_terms($product_id, $product['category'], 'product_cat');
				if( is_wp_error( $cat_assign_status ) ){
					\WP_CLI::warning('Failed to assign category: '.$product['category']);
				}else{
					\WP_CLI::log('Category assigned on - '.$product['title']);
				}
            }

            if (!empty($product['tags'])) {
                $tag_assign_status = wp_set_object_terms($product_id, $product['tags'], 'product_tag');
				if( is_wp_error( $tag_assign_status ) ){
					\WP_CLI::warning('Failed to assign tags: '.$product['category']);
				}else{
					\WP_CLI::log('Tag assigned on - '.$product['title']);
				}
            }

			/**
			 * Add featured image
			 */
            if (!empty($product['thumbnail'])) {
                $featured_image_id = $this->download_image($product['thumbnail'], $product_id);
                if ($featured_image_id) {
                    set_post_thumbnail($product_id, $featured_image_id, true);
					\WP_CLI::log('Featured image added on - '.$product['title']);
                }
            }

            /**
			 * Add product gallery images
			 */
            if (!empty($product['images'])) {
                $gallery_ids = [];
                foreach ($product['images'] as $image_url) {
                    $image_id = $this->download_image($image_url, $product_id, true);
                    if ($image_id) {
                        $gallery_ids[] = $image_id;
                    }
                }
                if (!empty($gallery_ids)) {
                    update_post_meta($product_id, '_product_image_gallery', implode(',', $gallery_ids));
					\WP_CLI::log('Gallery images added on - '.$product['title']);
                }
            }


			// Add categories
			// if (!empty($product['categories'])) {
			// 	$categories = [];
			// 	foreach ($product['categories'] as $category) {
			// 		$term = term_exists($category, 'product_cat');
			// 		if ($term) {
			// 			$categories[] = $term['term_id'];
			// 		} else {
			// 			$term = wp_insert_term($category, 'product_cat');
			// 			if (!is_wp_error($term)) {
			// 				$categories[] = $term['term_id'];
			// 			}
			// 		}
			// 	}
			// 	wp_set_object_terms($product_id, $categories, 'product_cat');
			// }

			// // Add tags
			// if (!empty($product['tags'])) {
			// 	$tags = [];
			// 	foreach ($product['tags'] as $tag) {
			// 		$term = term_exists($tag, 'product_tag');
			// 		if ($term) {
			// 			$tags[] = $term['term_id'];
			// 		} else {
			// 			$term = wp_insert_term($tag, 'product_tag');
			// 			if (!is_wp_error($term)) {
			// 				$tags[] = $term['term_id'];
			// 			}
			// 		}
			// 	}
			// 	wp_set_object_terms($product_id, $tags, 'product_tag');
			// }

			// Add reviews
            if (!empty($product['reviews'])) {
                foreach ($product['reviews'] as $review) {
                    $this->add_product_review($product_id, $review);
                }
            }
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
	private function download_image($image_url, $post_id, $show_loading = false) {
		if ($show_loading) {
			// Simulate loading animation
			$this->show_loading_message("Downloading image...");
		}
		$temp_file = download_url($image_url);

		if (is_wp_error($temp_file)) {
			\WP_CLI::warning("Failed to download image: $image_url");
			return false;
		}

		$file_info = [
			'name'     => basename($image_url),
			'type'     => mime_content_type($temp_file),
			'tmp_name' => $temp_file,
			'error'    => 0,
			'size'     => filesize($temp_file),
		];

		$attachment_id = media_handle_sideload($file_info, $post_id);
		@unlink($temp_file);

		if (is_wp_error($attachment_id)) {
			\WP_CLI::warning("Failed to attach image: $image_url");
			return false;
		}
		if ($show_loading) {
			\WP_CLI::log("Image downloaded and attached successfully!");
		}

		return $attachment_id;
	}
	private function show_loading_message($message) {
		// Display a loading message with animation
		$dots = '';
		for ($i = 0; $i < 3; $i++) {
			$dots .= '.';
			\WP_CLI::line("$message$dots");
			sleep(1); // Simulate loading delay
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
					$product_id = $product_available_status_arr['product_id'] ?? false;
					if (!$product_id) {
						\WP_CLI::error("Invalid product ID.");
						return;
					}
					if($product_available_status_arr['product_status']){
						// Remove attached featured and gallery images
						$this->remove_attached_images($product_id);
						$this->delete_inserted_product($product_available_status_arr['product_id']);
					}else{
						\WP_CLI::warning('Product not found: '.$product['title']);
					}
				}
			}
		}
	}
	private function remove_attached_images($product_id) {
		// Remove featured image
		$featured_image_id = get_post_thumbnail_id($product_id);
		if ($featured_image_id) {
			wp_delete_attachment($featured_image_id, true);
			\WP_CLI::log("Deleted featured image (ID: $featured_image_id) for product ID - $product_id.");
		}

		// Remove gallery images
		$gallery_image_ids = get_post_meta($product_id, '_product_image_gallery', true);
		if (!empty($gallery_image_ids)) {
			$gallery_image_ids = explode(',', $gallery_image_ids);
			foreach ($gallery_image_ids as $image_id) {
				wp_delete_attachment($image_id, true);
				\WP_CLI::log("Deleted gallery image (ID: $image_id) for product ID - $product_id.");
			}
		}
	}

	public function delete_inserted_product($product_id){
		wp_delete_post( $product_id, true );
		\WP_CLI::success('Product deleted: '.$product_id);
	}


}