import { __ } from '@wordpress/i18n';
import React from 'react';
import {
	Button,
	ResponsiveWrapper,
	PanelBody,
	ButtonGroup,
	ToolbarGroup,
	ToolbarItem,
} from '@wordpress/components';
import { closeSmall, color, image as icon } from '@wordpress/icons';
import SidebarControl from './sidebarControl';
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
	BlockControls,
} from '@wordpress/block-editor';
import classnames from 'classnames';

export default function edit(props) {
	const { attributes, setAttributes, className, isSelected } = props;

	const blockProps = useBlockProps({
		className: 'gts__call-to-action',
	});

	const onSelectImage = (imageObj) => {
		setAttributes({
			media: imageObj,
			mediaId: imageObj.id,
			mediaUrl: imageObj.url,
		});
	};
	const removeImage = () => {
		setAttributes({
			media: null,
			mediaId: 0,
			mediaUrl: '',
		});
	};
	const renderPlaceholderForImage = () => {
		return (
			<div className="call-to-action-image-placeholder-wrapper">
				<MediaPlaceholder
					allowedTypes={['image']}
					multiple={false}
					icon="format-image"
					labels={{
						title: __('The Image', 'gutenberg-starter'),
					}}
					onSelect={(imageEntity) => {
						if (isBlobURL(imageEntity?.url)) {
							return;
						}
						setAttributes({
							url: imageEntity?.url,
							alt: imageEntity?.alt,
							media: imageEntity,
							mediaId: imageEntity?.id,
							mediaUrl: imageEntity?.url,
						});
					}}
				/>
			</div>
		);
	};
	const renderImage = () => {
		const { focalPoint } = attributes;
		const classes = classnames('call-to-action-image-wrapper', {
			'is-selected': isSelected,
		});
		return (
			<>
				<div className={classes}>
					<div className="button-group">
						{isSelected && (
							<>
								<ButtonGroup className="">
									<Button
										icon={closeSmall}
										onClick={() => {
											setAttributes({
												media: '',
												mediaUrl: '',
											});
										}}
										label={__(
											'Remove Imagee',
											'anam-gutenberg-starter'
										)}
										text="Remove Imagee"
										disabled={!isSelected}
									/>
								</ButtonGroup>
							</>
						)}
					</div>
					<div
						className="call-to-action__media-wrapper"
						style={{ textAlign: props.attributes.alignment }}
					>
						{props.attributes.media && (
							<img
								src={props.attributes.media.sizes.large.url}
								alt=""
								style={{
									objectPosition: focalPoint
										? `${focalPoint.x * 100}% ${
												focalPoint.y * 100
										  }%`
										: undefined,
								}}
							/>
						)}
					</div>
				</div>
			</>
		);
	};
	console.log(props.attributes);

	return (
		<div {...blockProps}>
			<SidebarControl
				data={props}
				onSelectImage={onSelectImage}
				removeImage={removeImage}
				onChangeAlignment={(newAlignment) => {
					setAttributes({
						alignment:
							'undefined' === newAlignment ? none : newAlignment,
					});
				}}
			/>
			<BlockControls>
				<ToolbarGroup>
					<ToolbarItem as={Button}>
						{__('Call to Action', 'gutenberg-starter')}
					</ToolbarItem>
				</ToolbarGroup>
			</BlockControls>

			<div>
				<div
					className={`call-to-action flex flex-row ${
						props.attributes.imageLayoutPosition === 'right'
							? 'flex-row-reverse'
							: ''
					} font-roboto items-center shadow-md rounded-md overflow-hidden`}
				>
					{/* Left side */}
					{/* if showImage true, then show this block, otherwise not */}
					{props.attributes.showImage && (
						<div className="call-to-action__left basis-1/2">
							<div
								className="call-to-action__media-wrapper"
								style={{
									textAlign: props.attributes.alignment,
								}}
							>
								{props.attributes.showImage
									? props.attributes.media
										? renderImage()
										: renderPlaceholderForImage()
									: false}
							</div>
						</div>
					)}
					{/* Right side */}
					<div
						className={`call-to-action__right  ${
							props.attributes.showImage ? 'basis-1/2' : ''
						}  p-10`}
					>
						<div className="call-to-action__title">
							<RichText
								style={{
									textAlign: props.attributes.alignment,
								}}
								className="text-3xl font-medium text-slate-900 font-poppins"
								tagName="h3"
								onChange={(newTitle) => {
									setAttributes({
										title: newTitle,
									});
								}}
								value={
									props.attributes.title &&
									props.attributes.title
								}
							/>
						</div>
						<div className="call-to-action__content mt-5 font-roboto">
							<RichText
								style={{
									textAlign: props.attributes.alignment,
								}}
								tagName="p"
								onChange={(newContent) => {
									setAttributes({
										content: newContent,
									});
								}}
								value={
									props.attributes.content &&
									props.attributes.content
								}
							/>
						</div>

						<div
							className="call-to-action__button mt-8 font-roboto font-medium"
							style={{ textAlign: props.attributes.alignment }}
						>
							<InnerBlocks
								template={[
									[
										'core/button',
										{
											text: __(
												'Read More',
												'gutenberg-starter'
											),
											placeholder: __(
												'Action Link',
												'gutenberg-starter'
											),
											className: 'inline-block',
										},
									],
								]}
								allowedBlocks={['core/button']}
								templateInsertUpdatesSelection={true}
								__experimentalCaptureToolbars={true}
							/>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
