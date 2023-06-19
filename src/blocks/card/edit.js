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
import SidebarControl from './sidebarControl';

export default function edit(props) {
	const { attributes, setAttributes, className, isSelected } = props;
	const blockProps = useBlockProps({
		className: 'gts__card',
	});
	return (
		<div {...blockProps}>
			<SidebarControl props={props} />
			<div className="">
				{/* <div className="card__img">this is card</div> */}
				<div className="card__title">
					<RichText
						tagName="h2"
						value={attributes.title}
						allowedFormats={['core/bold', 'core/italic']}
						onChange={(title) => setAttributes({ title })}
					/>
				</div>
				<div className="card__description">
					<RichText
						tagName="p"
						value={attributes.content}
						allowedFormats={['core/bold', 'core/italic']}
						onChange={(content) => setAttributes({ content })}
					/>
				</div>
			</div>
		</div>
	);
}
