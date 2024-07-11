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
const CARD_FOOTER_TEMPLATE = [
	[
		'core/button',
		{
			text: 'Read More',
			placeholder: 'Book Your Demo',
		},
	],
];
const MyFormFileUpload = ({ attributes, setAttributes }) => {
	const mediaPreviewHandle = !!attributes.editorPreviewUrl && (
		<img
			class="inline-block w-full shadow-md hover:shadow-lg transition-all rounded"
			src={attributes.editorPreviewUrl}
		/>
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
	console.log('edit attributes', blockProps);
	return (
		<div {...blockProps}>
			<SidebarControl props={props} />
			<div className="card shadow-md hover:shadow-lg rounded border-solid border-black-400 border-2 p-8">
				<div className="card__img rounded">
					<MyFormFileUpload
						attributes={attributes}
						setAttributes={setAttributes}
					/>
				</div>
				<div className="card__content">
					<div className="card__content__title">
						<RichText
							tagName="h2"
							className="mt-8 mb-3 font-poppins text-2xl text-slate-700 font-medium"
							value={attributes.title}
							style={{
								fontSize: attributes.titleFontSize + 'px',
							}}
							allowedFormats={['core/bold', 'core/italic']}
							onChange={(title) => setAttributes({ title })}
							multiline={false}
							placeholder={__('Heading...')}
						/>
					</div>
					<div className="card__content__description font-roboto">
						<RichText
							tagName="p"
							value={attributes.content}
							className="text-slate-600"
							style={{
								fontSize: attributes.contentFontSize + 'px',
							}}
							allowedFormats={['core/bold', 'core/italic']}
							onChange={(content) => setAttributes({ content })}
						/>
					</div>
					<div className="card__footer">
						<InnerBlocks
							template={CARD_FOOTER_TEMPLATE}
							templateLock="all"
							allowedBlocks={['core/button']}
						/>
					</div>
				</div>
			</div>
		</div>
	);
}
