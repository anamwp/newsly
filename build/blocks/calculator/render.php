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
global $post;
// Generate unique id for aria-controls.
// $unique_id = wp_unique_id( 'p-' );
$context = array(
	'price' => $attributes['price'],
	'contribution' => 0,
	'attributes' => $attributes
);
$burger_context = array(
	'price' => 15,
	'burgerCount' => 0,
	'burgerDonationCount' => 0,
	'burgerTotalPrice' => 0,
	'burgerDonationTotalPrice' => 0,
	'totalPrice' => 0,
	'hideDecreaseOrder' => true,
	'hideDecreaseDonationOrder' => true,
);
?>
<div
	<?php echo get_block_wrapper_attributes(); ?>
	data-wp-interactive="burger"
	<?php echo wp_interactivity_data_wp_context($burger_context); ?>
>
	<p>
		<?php echo sprintf(
			'A burger costs $%s, you can order for yourself and donate for hungry people.', 
			'<span data-wp-text="context.price"></span>'
		) ?>
	</p>
	<div style="border:solid 2px; padding:10px;margin-bottom:20px;">
		Total
		<span style="float:right;" data-wp-text="context.totalPrice"></span>
	</div>
	<div style="color:white; display:flex; justify-content:space-between; background-color:purple; padding:10px; margin-bottom:10px;">
		<div>
			<button data-wp-bind--hidden='context.hideDecreaseOrder' data-wp-on--click="actions.decreaseCount">-</button>
			<span>Order</span>
			<button data-wp-on--click="actions.increaseCount">+</button>
		</div>
		<div>
			<span data-wp-text="context.burgerCount"></span>
		</div>
		<div>
			<span data-wp-text="context.burgerTotalPrice"></span>
		</div>
		
	</div>

	<div style="display:flex; justify-content:space-between; background-color:#eee; padding:10px;">
		<div>
			<button data-wp-bind--hidden='context.hideDecreaseDonationOrder' data-wp-on--click="actions.decreaseDonationCount">-</button>
			<span>Donate</span>
			<button data-wp-on--click="actions.increaseDonationCount">+</button>
		</div>
		<div>
			<span data-wp-text="context.burgerDonationCount"></span>
		</div>
		<div>
			<span data-wp-text="context.burgerDonationTotalPrice"></span>
		</div>
	</div>

</div>
<!-- donation calculator -->
<div 
	<?php echo get_block_wrapper_attributes();?>
	data-wp-interactive="donation-calculator"
	<?php echo wp_interactivity_data_wp_context($context); ?>
>	
	<form 
	aria-label="<?php esc_attr_e('Calculate the impact of your donation');?>" 
	class="calculator">
		<label for="contribution-value" class="calculator-label">
			<?php esc_html_e('check impact of your donation'); ?>
		</label>
		<div class="calculator-input">$
			<input 
			type="number"
			data-wp-on--input="actions.calculate"
			placeholder="0"
			id="contribution-value"
			class="calculator-input-form"
			>
		</div>
		<output
			class="calculator-output"
			data-wp-class--show="state.show"
		>
			<?php 
				echo sprintf(
					esc_html__('Your %s donation will enable us to plant %s trees.'),
					'<span data-wp-text="state.donation" ></span>',
					'<span data-wp-text="state.trees" ></span>'
				)
			?>
		</output>
	</form>
	
</div>


<!-- wp context -->
<!-- Let's make this element and its children interactive and set the namespace -->
<div
    data-wp-interactive="myPlugin2"
    data-wp-context='{ "myColor" : "red", "myBgColor": "yellow" }'
>
	<p>I'm interactive now, <span data-wp-style--background-color="context.myBgColor">>and I can use directives!</span></p>
	<div>
		<p>I'm also interactive, <span data-wp-style--color="context.myColor">and I can also use directives!</span></p>
	</div>
</div>
<hr>
<br>
<h2>Practise from wp interactive API wp developer doc</h2>
<!-- This is also valid -->
<div
  	data-wp-interactive='{ "namespace": "myPlugin" }'
  	data-wp-context='{ "myColor" : "red", "myBgColor": "yellow" }'
>
  	<p>I'm interactisve now, <span data-wp-style--background-color="context.myBgColor">>and I cans use directives!</span></p>
	<span data-wp-text="donation-calculator::state.sampleText"></span>
	<span data-wp-style--background-color="myPlugin2::context.myBgColor" data-wp-text="donation-calculator::state.sampleText"></span>
	<div>
		<p>I'm also interactive, <span data-wp-style--color="context.myColor">and I can also use directives!</span></p>
	</div>

	<hr>
	<!-- wp-context -->
	<div data-wp-context='{ "foo": "bar" }''>
		<span data-wp-text="context.foo"><!-- Will output: "bar" --></span>

		<div data-wp-context='{ "bar": "baz" }''>
			<span data-wp-text="context.foo"><!-- Will output: "bar" --></span>

			<div data-wp-context='{ "foo": "bob" }'>
				<span data-wp-text="context.foo"><!-- Will output: "bob" --></span>
			</div>
		</div>
	</div>

	<hr>
	<!-- wp-context -->
	<div data-wp-context='{ "post": { "id": <?php echo $post->ID; ?> } }' >
		<button data-wp-on--click="actions.loggId" >
			Click Me!
		</button>
	</div>

	<hr>
	<!-- wp-bind -->
	<div data-wp-context='{"isMenuOpen" : "false"}'>
		<button 
			data-wp-on--click="actions.toggleMenu"
			data-wp-bind--aria-expanded="context.isMenuOpen"
		>toggle</button>
		<div data-wp-bind--hidden='context.isMenuOpen'>
			<span>title</span>
			<ul>Submenu Items</ul>
		</div>
	</div>

	<hr>
	<!-- wp-class -->
	<div>
		<li 
			data-wp-context='{"isSelected": "false"}'
			data-wp-on--click='actions.toggleSelection'
			data-wp-class--hello="context.isSelected"
		>
			Option 1
		</li>
		<li
			data-wp-context='{"isSelected": "false"}'
			data-wp-on--click='actions.toggleSelection'
			data-wp-class--selected="context.isSelected"
		>
			Option 2
		</li>
	</div>
	<hr>
	<!-- wp-style -->
	<div data-wp-context='{"color" : "red"}'>
		<button data-wp-on--click="actions.toogleContextColor">Toggle Text color</button>
		<p data-wp-style--color="context.color">Hello World</p>
	</div>
	<hr>
	<!-- wp-text -->
	<div data-wp-context='{ "text": "Text1" }'>
		<span data-wp-text="context.text"></span>
		<button data-wp-on--click="actions.toggleContextText">Toggle Context text</button>
	</div>
	<hr>
	<!-- data-wp-on-window -->
	<div data-wp-context='{"width": "auto"}' data-wp-on-window--resize="callbacks.logWidth">
		<span data-wp-text="context.width"></span>
	</div>
	<hr>
	<!-- data-wp-on-document -->
	<div data-wp-context='{"keydown": "Key pressed - none"}' data-wp-on-document--keydown="callbacks.logKeyDown">
		<span data-wp-text="context.keydown"></span>
	</div>

	<hr>
	<!-- wp-watch -->
	<div data-wp-context='{"counter" : 0}' data-wp-watch="callbacks.logCounter">
		<p>counter: <span data-wp-text="context.counter"></span></p>
		<button data-wp-on--click="actions.increaseCounter">+</button>
		<button data-wp-on--click="actions.decreaseCounter">-</button>
	</div>


	<hr>
	<!-- wp-init -->
	<form 
	id="wp-init-form"
	data-wp-init--log="callbacks.logTimeInit"
	data-wp-init--focus="callbacks.focusFirstElement"
	>
		<input type="text" name="name" id="name">
	</form>


	<hr>
	<!-- wp-run -->
	<div data-wp-run="callbacks.logInView">
		<p id="observe-element">Hi</p>
	</div>


	<hr>
	<!-- wp-key -->
	<ul>
		<li data-wp-key="unique-id-1">Item 1</li>
		<li data-wp-key="unique-id-2">Item 2</li>
	</ul>


	<hr>
	<!-- wp-each -->
	<ul data-wp-context='{"list" : ["John", "jenny", "Juli"]}'>
		<template data-wp-each="context.list">
			<li data-wp-text="context.item"></li>
		</template>
	</ul>
	<br>
	<ul data-wp-context='{"list" : ["rahim", "karim", "Julia"]}'>
		<template data-wp-each--gretting="context.list">
			<li data-wp-text="context.gretting"></li>
		</template>
	</ul>
	<br/>
	<ul data-wp-context='{
		"list" : [
			{"id": "one", "value": "Anam"},
			{"id": "two", "value": "Setu"},
			{"id": "three", "value": "baby"}
		]
	}'>
		<template 
		data-wp-each="context.list"
		data-wp-each-key="context.item.id"
		>
			<li data-wp-text="context.item.value"></li>
		</template>
	</ul>

	<ul data-wp-context='{ "list": [ "hello", "hola", "olá" ] }'>
		<template data-wp-each--greeting="context.list" >
			<li data-wp-text="context.greeting"></li>
		</template>
		<li data-wp-each-child>hello</li>
		<li data-wp-each-child>hola</li>
		<li data-wp-each-child>olá</li>
	</ul>

</div>


<!-- end of wp context -->