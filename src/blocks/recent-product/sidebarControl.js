import { __ } from '@wordpress/i18n';
import { useSelect, withSelect, select } from '@wordpress/data';
import { InspectorControls } from '@wordpress/block-editor';
import {
	PanelBody,
	SelectControl,
	ToggleControl,
	Button,
	RangeControl,
} from '@wordpress/components';
import React from 'react';
import { RawHTML, useState, useRef, useEffect } from '@wordpress/element';

export default function sidebarControl({
	attributes,
	setAttributes,
	handleUpdateRecentProduct,
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
							onClick={handleUpdateRecentProduct}
							disabled={loading}
							aria-disabled={loading}
							aria-label={__(
								'Refresh Products',
								'gutenberg-starter'
							)}
							icon={loading ? 'update' : 'update'}
							iconPosition="left"
						>
							Refresh Products
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
