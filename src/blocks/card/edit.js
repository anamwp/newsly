import { __ } from '@wordpress/i18n';
import React from 'react';
import {
	Button,
	ResponsiveWrapper,
	PanelBody,
	ButtonGroup,
	FormFileUpload,
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

const MyFormFileUpload = ({ attributes, setAttributes }) => {
	const mediaPreviewHandle = !!attributes.editorPreviewUrl && (
		<img src={attributes.editorPreviewUrl} />
	);
	return (
		<MediaUpload
			render={() => (
				<>
					<MediaPlaceholder
						onSelect={(el) => {
							setAttributes({
								imageUrl: el.url,
								editorPreviewUrl: el.sizes.medium.url,
								imageId: el.id,
							});
						}}
						multiple={false}
						accept="image/*"
						// icon={<BlockIcon icon="format-image" />}
						allowedTypes={['image']}
						labels={{ title: 'Card Image' }}
						mediaPreview={mediaPreviewHandle}
					/>
				</>
			)}
		/>
	);
};

export default function edit(props) {
	const { attributes, setAttributes, className, isSelected } = props;
	const blockProps = useBlockProps({
		className: 'gts__card',
	});
	return (
		<div {...blockProps}>
			<SidebarControl props={props} />
			<div className="card">
				<div className="card__img">
					<MyFormFileUpload
						attributes={attributes}
						setAttributes={setAttributes}
					/>
				</div>
				<div className="card__content">
					<div className="card__content__title">
						<RichText
							tagName="h2"
							value={attributes.title}
							className={className}
							style={{
								fontSize: attributes.titleFontSize + 'px',
							}}
							// allowedFormats={['core/bold', 'core/italic']}
							onChange={(title) => setAttributes({ title })}
							multiline={false}
						/>
					</div>
					<div className="card__content__description">
						<RichText
							tagName="p"
							value={attributes.content}
							className={className}
							style={{
								fontSize: attributes.contentFontSize + 'px',
							}}
							// allowedFormats={['core/bold', 'core/italic']}
							onChange={(content) => setAttributes({ content })}
						/>
					</div>
				</div>
			</div>
		</div>
	);
}
