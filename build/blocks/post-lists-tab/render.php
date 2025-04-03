<?php
/**
 * Block Name: gutenberg-starter/post-lists-tab
 *
 * @package gutenberg-starter
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * PHP file to use when rendering the block type on the server to show on the front end.
 *
 * The following variables are exposed to the file:
 *     $attributes (array): The block attributes.
 *     $content (string): The block default content.
 *     $block (WP_Block): The block instance.
 *
 * @see https://github.com/WordPress/gutenberg/blob/trunk/docs/reference-guides/block-api/block-metadata.md#render
 */

 /**
  * The block settings value.
  */
$gutenberg_starter_post_list_tab_show_featured_image = $attributes['showFeaturedImage'] ?? false;
$gutenberg_starter_post_list_tab_show_category = $attributes['showCategory'] ?? false;
$gutenberg_starter_post_list_tab_show_excerpt = $attributes['showExcerpt'] ?? false;
?>

<div 
	class="post-lists-tab" 
	data-wp-component="post-lists-tab"
>
	<?php if ( count( $attributes['categories'] ) > 0 ) : ?>
		<div class="tab mb-10 flex gap-2 p-4 pl-0" data-postid="<?php echo esc_attr( get_the_ID() ); ?>">
			<button data-wp-on--click="actions.fetchCategoryPosts" class="active tablinks no-underline px-4 py-2 font-semibold transition-all text-sm bg-slate-800  bg-slate-50 text-white hover:bg-slate-800 hover:text-white border border-slate-100 rounded-md shadow-sm" ><?php echo esc_html( 'All', 'gutenberg-starter' ); ?></button>
			<?php foreach ( $attributes['categories'] as $key => $site_category ) :
				?>
				<button data-cat-id="<?php echo esc_attr( $site_category['value'] ); ?>" data-cat-slug="<?php echo esc_attr( $site_category['slug'] ); ?>" class="tablinks no-underline px-4 py-2 font-semibold text-sm transition-all rounded-md capitalize bg-slate-50 hover:bg-slate-800 hover:text-white  text-slate-800 border border-slate-100 hover:border-slate-800 shadow-sm">
					<?php echo esc_html( $site_category['label'] ); ?>
				</button>
			<?php endforeach; ?>
		</div>
		<?php else : ?>
			<div class="tab mb-10 flex gap-2 p-4 pl-0">
				<button data-wp-on--click="actions.fetchCategoryPosts" class="active tablinks px-4 py-2 font-semibold text-sm bg-slate-800 transition-all text-white rounded-full shadow-sm" ><?php echo esc_html( 'All', 'gutenberg-starter' ); ?></button>
			</div>
	<?php endif; ?>

	<div id="post-list-tab-post-content" class="grid grid-cols-3 gap-4">
		<?php if ( count( $attributes['fetchedPosts'] ) > 0 ) : ?>
			<?php foreach ( $attributes['fetchedPosts'] as $key => $value ) : ?>
				<div class="post card shadow-md hover:shadow-lg rounded border-solid border-black-200 border-x border-y p-8">
					<?php if ( $gutenberg_starter_post_list_tab_show_featured_image ) : ?>
					<div class="mb-4 thumbnail card__img rounded inline-block">
						<?php if ( has_post_thumbnail( $value['id'] ) ) : ?>
							<?php
								echo get_the_post_thumbnail( $value['id'], 'large', array( 'class' => 'post-thumbnail rounded h-80 object-cover w-full' ) );
							?>
						<?php else : ?>
							<img class="rounded h-80 object-cover w-full" src="https://placehold.co/600x400" alt="Placeholder Image">
						<?php endif; ?>
					</div>
					<?php endif; ?>
					
					<a class="inline-block font-poppins text-xl text-slate-900 hover:text-slate-600	transition font-medium" href="<?php echo esc_url( get_the_permalink( $value['id'] ) ); ?>">
						<h2><?php echo esc_html( $value['title']['rendered'] ); ?></h2>
					</a>
					
					<?php if ( $gutenberg_starter_post_list_tab_show_category ): ?>
					<div class="inline-block mt-2">
						<!-- Loop through categories -->
						<?php if ( count( $value['categories'] ) > 0 ) : ?>
							<?php foreach( $value['categories'] as $post_category_id ) :
								$cat = get_category( $post_category_id );
								?>
								<a href="<?php echo esc_url( get_category_link( $cat->term_id ) ); ?>" class="inline-block text-xs text-slate-600 hover:text-slate-800 bg-slate-100 hover:bg-slate-300 capitalize p-1 mr-1 rounded-md transition-all">
									<?php echo esc_html( $cat->name ); ?>
								</a>
							<?php endforeach; ?>
						<?php endif; ?>
					</div>
					<?php endif; ?>
					<?php if ( $gutenberg_starter_post_list_tab_show_excerpt ): ?>
					<div class="text-slate-600 mt-2"><?php echo wp_kses_post( $value['excerpt']['rendered'] ); ?></div>
					<?php endif; ?>
				</div>
			<?php endforeach; ?>
		<?php else : ?>
			<div class="post card shadow-md hover:shadow-lg rounded border-solid border-black-200 border-x border-y p-8">
				<h2 class="mt-4 inline-block font-poppins text-xl text-slate-900 hover:text-slate-600	transition font-medium"><?php echo esc_html( 'No Posts Found', 'gutenberg-starter' ); ?></h2>
			</div>
		<?php endif; ?>
	</div>
	
</div>

<?php
