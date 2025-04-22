import { __ } from '@wordpress/i18n';
import React from 'react';
import { InspectorControls } from '@wordpress/block-editor';
import { PanelBody, Button, RangeControl } from '@wordpress/components';

export default function sidebarControl({
	attributes,
	setAttributes,
	handleUpdateFeaturedProduct,
	loading,
}) {
	const default_product_to_show_value = 3;
	return (
		<div>
			<InspectorControls>
				<PanelBody
					title={__('Product', 'gutenberg-starter')}
					initialOpen={true}
				>
					<p className="display-single-post-featured-image">
						<Button
							type="button"
							className="button is-primary"
							onClick={handleUpdateFeaturedProduct}
							disabled={loading}
							aria-disabled={loading}
							aria-label={__(
								'Refresh Products',
								'gutenberg-starter'
							)}
							icon={loading ? 'update' : 'update'}
							iconPosition="left"
						>
							{loading
								? __('Loading...', 'gutenberg-starter')
								: __('Refresh Products', 'gutenberg-starter')}
						</Button>
						{loading && <span className="spinner is-active"></span>}
					</p>

					<RangeControl
						label={__('Number of Products', 'gutenberg-starter')}
						value={attributes.no_of_product_to_show}
						onChange={(value) =>
							setAttributes({ no_of_product_to_show: value })
						}
						__next40pxDefaultSize={true}
						__nextHasNoMarginBottom={true}
						min={1}
						max={9}
						step={1}
						initialPosition={default_product_to_show_value}
						allowReset={true}
						resetFallbackValue={default_product_to_show_value}
						resetLabel={__('Reset', 'gutenberg-starter')}
						resetTooltip={__(
							'Reset to default value',
							'gutenberg-starter'
						)}
					/>
				</PanelBody>
			</InspectorControls>
		</div>
	);
}
