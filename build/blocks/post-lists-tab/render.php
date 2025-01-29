<?php
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
$context           = array(
	'label'        => $attributes['label'],
	'contribution' => 0,
	'attributes'   => $attributes,
);
$fetchedPosts      = $attributes['fetchedPosts'];
$fetchedCategories = $attributes['categories'];
// dump($fetchedCategories);
// dump($fetchedPosts);
$post_context = array(
	'text'                      => 'Hello World',
	'price'                     => 15,
	'burgerCount'               => 0,
	'burgerDonationCount'       => 0,
	'burgerTotalPrice'          => 0,
	'burgerDonationTotalPrice'  => 0,
	'totalPrice'                => 0,
	'hideDecreaseOrder'         => true,
	'hideDecreaseDonationOrder' => true,
);

?>

<div 
	<?php echo get_block_wrapper_attributes(); ?>
	data-wp-interactive="anam-gutenberg-starter-block/postlisttab"
	<?php echo wp_interactivity_data_wp_context( $post_context ); ?>
>

	<?php if ( count( $fetchedCategories ) > 0 ) : ?>
		<div class="tab mb-10 flex gap-2 p-4 pl-0">
			<button data-wp-on--click="actions.fetchCategoryPosts" class="active tablinks px-4 py-2 font-semibold text-sm bg-emerald-800 transition-all text-white rounded-full shadow-sm" ><?php echo esc_html( 'All', 'anam-starter' ); ?></button>
			<?php foreach ( $fetchedCategories as $key => $category ) : ?>
				<!-- <button class="tablinks" onclick="openTab(event, '<?php // echo $category->slug; ?>')"><?php // echo $category->name; ?></button> -->
				<button data-wp-on--click="actions.fetchCategoryPosts" class="tablinks px-4 py-2 font-semibold text-sm bg-emerald-500 hover:bg-emerald-800 transition-all text-white rounded-full shadow-sm" ><?php echo $category['label']; ?></button>
			<?php endforeach; ?>
		</div>
	<?php endif; ?>

	<div class="grid grid-cols-3 gap-4">
	<?php if ( count( $fetchedPosts ) > 0 ) : ?>
		<?php foreach ( $fetchedPosts as $key => $value ) : ?>
			<?php // dump($value) ?>
			<div class="post card shadow-md hover:shadow-lg rounded border-solid border-black-200 border-x border-y p-8">
				<div class="thumbnail card__img rounded">
					<?php
					// dump(has_post_thumbnail($value['id']) );
					?>
					<?php if ( has_post_thumbnail( $value['id'] ) ) : ?>
						<?php
							echo get_the_post_thumbnail( $value['id'], 'large', array( 'class' => 'post-thumbnail rounded h-80 object-cover w-full' ) );
						?>
					<?php else : ?>
						<img class="rounded h-80 object-cover w-full" src="https://via.placeholder.com/900" alt="Placeholder Image">
					<?php endif; ?>
				</div>
				<a class="mt-4 inline-block font-poppins text-2xl text-slate-900 hover:text-emerald-600	transition font-medium" href="<?php echo esc_url( get_the_permalink( $value['id'] ) ); ?>">
					<h2><?php echo esc_html( $value['title']['rendered'] ); ?></h2>
				</a>
				<div class="text-slate-600 mt-2"><?php echo wp_kses_post( $value['excerpt']['rendered'] ); ?></div>
			</div>
		<?php endforeach; ?>
	<?php endif; ?>
	</div>
	
</div>
