<?php
/**
 * Block Name: newsly-block/post-lists-tab
 *
 * @package Newsly
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
$newsly_post_list_tab_show_featured_image = $attributes['showFeaturedImage'] ?? false;
$newsly_post_list_tab_show_category = $attributes['showCategory'] ?? false;
$newsly_post_list_tab_show_excerpt = $attributes['showExcerpt'] ?? false;
?>

<div
	class="post-lists-tab newsly__post_list_tab"
	data-postid="<?php echo esc_attr( get_the_ID() ); ?>"
>
	<?php if ( count( $attributes['categories'] ) > 0 ) : ?>
		<div class="tab mb-10 flex gap-2 p-4 pl-0">
			<button type="button" data-cat-slug="" aria-selected="true" class="active tablinks no-underline px-4 py-2 font-semibold text-sm transition-all rounded-md border shadow-sm" ><?php echo esc_html__( 'All', 'newsly' ); ?></button>
			<?php foreach ( $attributes['categories'] as $key => $site_category ) :
				?>
				<button type="button" data-cat-id="<?php echo esc_attr( $site_category['value'] ); ?>" data-cat-slug="<?php echo esc_attr( $site_category['slug'] ); ?>" aria-selected="false" class="tablinks no-underline px-4 py-2 font-semibold text-sm transition-all rounded-md capitalize border shadow-sm">
					<?php echo esc_html( $site_category['label'] ); ?>
				</button>
			<?php endforeach; ?>
		</div>
		<?php else : ?>
			<div class="tab mb-10 flex gap-2 p-4 pl-0">
				<button type="button" data-cat-slug="" aria-selected="true" class="active tablinks px-4 py-2 font-semibold text-sm transition-all rounded-full shadow-sm" ><?php echo esc_html__( 'All', 'newsly' ); ?></button>
			</div>
	<?php endif; ?>

	<div id="post-list-tab-post-content" class="post-list-tab-post-content grid grid-cols-3 gap-4">
		<?php if ( count( $attributes['fetchedPosts'] ) > 0 ) : ?>
			<?php foreach ( $attributes['fetchedPosts'] as $key => $value ) : ?>
				<div class="post-card shadow-md hover:shadow-lg rounded border-solid border-x border-y p-8">
					<?php if ( $newsly_post_list_tab_show_featured_image ) : ?>
					<div class="mb-4 thumbnail card__img rounded inline-block">
						<?php if ( has_post_thumbnail( $value['id'] ) ) : ?>
							<?php
								echo get_the_post_thumbnail( $value['id'], 'large', array( 'class' => 'post-thumbnail rounded h-80 object-cover w-full' ) );
							?>
						<?php else : ?>
							<img class="rounded h-80 object-cover w-full" src="<?php echo esc_url( plugins_url( 'assets/images/placeholder.svg', NEWSLY_FILE ) ); ?>" alt="Placeholder Image">
						<?php endif; ?>
					</div>
					<?php endif; ?>
					
					<a class="post-card__title inline-block font-poppins text-xl transition font-medium" href="<?php echo esc_url( get_the_permalink( $value['id'] ) ); ?>">
						<h2><?php echo esc_html( $value['title']['rendered'] ); ?></h2>
					</a>

					<?php if ( $newsly_post_list_tab_show_category ): ?>
					<div class="inline-block mt-2">
						<!-- Loop through categories -->
						<?php if ( count( $value['categories'] ) > 0 ) : ?>
							<?php foreach( $value['categories'] as $post_category_id ) :
								$cat = get_category( $post_category_id );
								?>
								<a href="<?php echo esc_url( get_category_link( $cat->term_id ) ); ?>" class="post-card__category inline-block text-xs capitalize p-1 mr-1 rounded-md transition-all">
									<?php echo esc_html( $cat->name ); ?>
								</a>
							<?php endforeach; ?>
						<?php endif; ?>
					</div>
					<?php endif; ?>
					<?php if ( $newsly_post_list_tab_show_excerpt ): ?>
					<div class="post-card__excerpt mt-2"><?php echo wp_kses_post( $value['excerpt']['rendered'] ); ?></div>
					<?php endif; ?>
				</div>
			<?php endforeach; ?>
		<?php else : ?>
			<div class="post-card shadow-md hover:shadow-lg rounded border-solid border-x border-y p-8">
				<h2 class="post-card__title mt-4 inline-block font-poppins text-xl transition font-medium"><?php echo esc_html__( 'No Posts Found', 'newsly' ); ?></h2>
			</div>
		<?php endif; ?>
	</div>
	
</div>

<?php
