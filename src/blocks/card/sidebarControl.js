import { __ } from '@wordpress/i18n';
import { InspectorControls } from '@wordpress/block-editor';
import { PanelBody, SelectControl, ToggleControl } from '@wordpress/components';
import React from 'react';

export default function sidebarControl({ props }) {
	const { attributes, setAttributes } = props;
	console.log('attributes', attributes);
	return (
		<div>
			<InspectorControls>
				<PanelBody
					title={__('Single Post Controls', 'anam-gutenberg-starter')}
					initialOpen={true}
				>
					<p>hello world</p>
				</PanelBody>
			</InspectorControls>
		</div>
	);
}
