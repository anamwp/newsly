import { __ } from '@wordpress/i18n';
import React from 'react';
import {
	Button,
	ResponsiveWrapper,
	PanelBody,
	ButtonGroup,
} from '@wordpress/components';
import { closeSmall, image as icon } from '@wordpress/icons';
import { isBlobURL } from '@wordpress/blob';
import {
	MediaUpload,
	MediaUploadCheck,
	useBlockProps,
	InspectorControls,
	ColorPalette,
	AlignmentToolbar,
	BlockIcon,
	RichText,
	MediaPlaceholder,
	InnerBlocks,
} from '@wordpress/block-editor';
import classnames from 'classnames';

export default function edit(props) {
	const { attributes, setAttributes, className, isSelected } = props;

	return (
		<div {...useBlockProps()}>
			<div className="card">
				<div className="card__img">this is card</div>
				<div className="card__title">this is card title</div>
				<div className="card__description">
					this is card description
				</div>
			</div>
		</div>
	);
}
