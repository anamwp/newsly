import { __ } from '@wordpress/i18n';
import React, { useEffect } from 'react';
const WooCommerceRestApi = require('@woocommerce/woocommerce-rest-api').default;

import {
	TextControl,
	ColorPicker,
	Panel,
	PanelBody,
	PanelRow,
	FontSizePicker,
	CheckboxControl,
} from '@wordpress/components';
import apiFetch from '@wordpress/api-fetch';
import { useState } from '@wordpress/element';
import { more } from '@wordpress/icons';

import {
	useBlockProps,
	RichText,
	AlignmentToolbar,
	BlockControls,
	ColorPalette,
	InnerBlocks,
	InspectorControls,
	useInnerBlocksProps,
} from '@wordpress/block-editor';

const MY_TEMPLATE = [['core/button', { placeholder: 'Book Your Demo' }]];

const api = new WooCommerceRestApi({
	url: 'https://anamstarter.local/',
	consumerKey: 'ck_c891525480173c17a6be34e0ff34797271bee966',
	consumerSecret: 'cs_2960e30b1041ff1ddebae9746b95101c7e564f8a',
	version: 'wc/v3',
});

const fontSizes = [
	{
		name: __('Small'),
		slug: 'small',
		size: 12,
	},
	{
		name: __('Big'),
		slug: 'big',
		size: 26,
	},
];
const fallbackFontSize = 16;

export default function edit({ attributes, setAttributes }) {
	const [fontSize, setFontSize] = useState(12);
	const [isChecked, setChecked] = useState(true);
	const [product, setProduct] = useState();
	let productResponseData = '';
	// console.log('process.env.WOO_CONSUMER_KEY', api);
	useEffect(() => {
		apiFetch({ path: '/wp/v2/posts' }).then((posts) => {
			console.log(posts);
		});
		api.get('products', {
			per_page: 3, // 20 products per page
		})
			.then((response) => {
				setProduct(response.data);
				setAttributes({
					product_obj: response.data,
				});
				// Successful request
				console.log('Response Status:', response.status);
				console.log('Response Headers:', response.headers);
				console.log('Response Data:', response.data);
				console.log(
					'Total of pages:',
					response.headers['x-wp-totalpages']
				);
				console.log('Total of items:', response.headers['x-wp-total']);
			})
			.catch((error) => {
				// Invalid request, for 4xx and 5xx statuses
				console.log('Response Status:', error.response.status);
				console.log('Response Headers:', error.response.headers);
				console.log('Response Data:', error.response.data);
			})
			.finally(() => {
				// Always executed.
			});
	}, []);

	// console.log('.product_obj', .product_obj);
	// console.log('fontSize', fontSize);
	/**
	 * pass style through useBlockProps()
	 */
	const blockProps = useBlockProps({
		className: 'gts_block__recent_product',
	});
	/**
	 *
	 * @param {*} newContent
	 */
	const onChangeContent = (newContent) => {
		setAttributes({
			newcontent: newContent,
		});
	};
	/**
	 *
	 * @param {*} newColor
	 */
	const onChangeTextColor = (newColor) => {
		setAttributes({
			text_color: newColor,
		});
	};
	const handleTextColor = (newColor) => {
		setAttributes({
			content_color: newColor,
		});
	};
	/**
	 *
	 * @param {*} newAlignment
	 */
	const onChangeAlignment = (newAlignment) => {
		setAttributes({
			alignment: 'undefined' === newAlignment ? none : newAlignment,
		});
	};
	console.log('productResponseData', product);
	console.log('product obj', attributes && attributes.product_obj);
	/**
	 * return edit content
	 */
	return (
		<div {...blockProps}>
			{/* block level control in the editor */}
			{<BlockControls></BlockControls>}
			{/* for sidebar control */}
			<InspectorControls key={'settings'}></InspectorControls>

			{/* View */}
			<div className="container gts_block__recent_product__container">
				<h2>Recent Products</h2>
				<div className="row">
					{product &&
						product.map(function (p, index) {
							let onSale = p.on_sale;
							return (
								<div key={index} className="col-md-3">
									<h2>
										<a href={p.permalink}>{p.name}</a>
									</h2>
									<p
										className="product_price"
										dangerouslySetInnerHTML={{
											__html: p.price_html,
										}}
									></p>
								</div>
							);
						})}
				</div>
			</div>
		</div>
	);
}
