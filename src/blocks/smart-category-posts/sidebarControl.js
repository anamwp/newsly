import { __ } from '@wordpress/i18n';
import { useSelect, withSelect, select } from '@wordpress/data';
import { InspectorControls } from '@wordpress/block-editor';
import { PanelBody, SelectControl, ToggleControl } from '@wordpress/components';
import React from 'react';
import { RawHTML, useState, useRef, useEffect } from '@wordpress/element';

export default function sidebarControl({
	props,
	handleCategoryToggleControl,
	handleExcerptToggleControl,
	handleFeaturedImageToggleControl,
}) {
	const { attributes, setAttributes } = props;

	return (
		<div>
			<InspectorControls>
				<PanelBody
					title={__('Post Card Controls', 'newsly')}
					initialOpen={true}
				>
					<p className="display-single-post-featured-image">
						<ToggleControl
							label={__(
								'Show Featured Image',
								'newsly'
							)}
							checked={attributes.showFeaturedImage}
							onChange={handleFeaturedImageToggleControl}
						/>
					</p>

					<p className="display-single-post-category-switch">
						<ToggleControl
							label={__('Show Category', 'newsly')}
							checked={attributes.showCategory}
							onChange={handleCategoryToggleControl}
						/>
					</p>

					<p className="display-single-post-excerpt-switch">
						<ToggleControl
							label={__('Show Excerpt', 'newsly')}
							checked={attributes.showExcerpt}
							onChange={handleExcerptToggleControl}
						/>
					</p>
				</PanelBody>
			</InspectorControls>
		</div>
	);
}
