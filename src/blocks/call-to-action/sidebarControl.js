import { __ } from '@wordpress/i18n';
import React from 'react';
import {
	Panel,
	PanelBody,
	PanelRow,
	Button,
	ResponsiveWrapper,
	FocalPointPicker,
	ToggleControl,
	SelectControl,
} from '@wordpress/components';
import {
	BlockControls,
	AlignmentToolbar,
	InspectorControls,
	MediaUpload,
	MediaUploadCheck,
} from '@wordpress/block-editor';

export default function SidebarControl({
	data,
	onSelectImage,
	removeImage,
	onChangeAlignment,
}) {
	const { attributes, setAttributes } = data;
	/**
	 * hangle image conditional render
	 */
	const handleImageToggleControl = () => {
		const showCTAImage = !attributes.showImage;
		setAttributes({ showImage: showCTAImage });
	};
	const ImageLayoutControl = () => {
		// const [ size, setSize ] = useState( '50%' );

		return (
			<SelectControl
				label=""
				value={attributes.imageLayoutPosition}
				options={[
					{ label: 'Left', value: 'left' },
					{ label: 'Right', value: 'right' },
				]}
				onChange={(newSize) =>
					setAttributes({
						imageLayoutPosition: newSize,
					})
				}
				__nextHasNoMarginBottom
			/>
		);
	};
	return (
		<div>
			{/* <BlockControls>
                <AlignmentToolbar 
                    value={attributes.alignment}
                    onChange={onChangeAlignment}
                    />
            </BlockControls> */}
			<InspectorControls>
				<Panel>
					<PanelBody initialOpen={true} title="Image Layout">
						<PanelRow>
							<ImageLayoutControl />
						</PanelRow>
					</PanelBody>
				</Panel>
				{/* image layout */}
				<PanelBody
					title={__('Call to action Image', 'anam-gutenberg-starter')}
					initialOpen={true}
				>
					<p className="cta-image-switcher">
						<ToggleControl
							label={__('Image', 'anam-gutenberg-starter')}
							help={
								attributes.showImage
									? __(' ', 'anam-gutenberg-starter')
									: __(
											'Display Image for Call to action',
											'anam-gutenberg-starter'
									  )
							}
							checked={attributes.showImage}
							onChange={handleImageToggleControl}
						/>
					</p>
					{/* add image */}
					{attributes.showImage && (
						<>
							{/* add image */}
							<p className="cta-add-image">
								<MediaUploadCheck>
									<MediaUpload
										onSelect={onSelectImage}
										type="image"
										value={attributes.mediaId}
										render={({ open }) => (
											<Button
												className={
													attributes.mediaId == 0
														? 'editor-post-featured-image__toggle'
														: 'editor-post-featured-image__preview'
												}
												onClick={open}
											>
												{!attributes.mediaId &&
													__(
														'Add Image',
														'anam-gutenberg-starter'
													)}
												{attributes.media && (
													<ResponsiveWrapper
														naturalWidth={
															attributes.media
																.width
														}
														naturalHeight={
															attributes.media
																.height
														}
													>
														<img
															src={
																attributes.media
																	.url
															}
														/>
													</ResponsiveWrapper>
												)}
											</Button>
										)}
									/>
								</MediaUploadCheck>
							</p>
							{/* remove image button */}
							<p className="cta-remove-image">
								{attributes.media && (
									<MediaUploadCheck>
										<Button
											onClick={removeImage}
											isLink
											isDestructive
										>
											{__(
												'Remove Image',
												'anam-gutenberg-starter'
											)}
										</Button>
									</MediaUploadCheck>
								)}
							</p>
							{/* replace image button */}
							<p className="cta-replace-image">
								{attributes.media && (
									<MediaUploadCheck>
										<MediaUpload
											title={__(
												'Replace Image',
												'anam-gutenberg-starter'
											)}
											value={attributes.mediaId}
											onSelect={onSelectImage}
											allowedTypes={['image']}
											render={({ open }) => (
												<Button
													onClick={open}
													isDefault
													isLarge
												>
													{__(
														'Replace Image',
														'anam-gutenberg-starter'
													)}
												</Button>
											)}
										/>
									</MediaUploadCheck>
								)}
							</p>
							{/* Image focal pointer */}
							<p>
								{attributes.mediaUrl && (
									<FocalPointPicker
										label={__(
											'Focal Point',
											'anam-gutenberg-starter'
										)}
										url={attributes.mediaUrl}
										value={attributes.focalPoint}
										onChange={(value) =>
											setAttributes({
												focalPoint: value,
											})
										}
									/>
								)}
							</p>
						</>
					)}
				</PanelBody>

				{/* content alignment */}
				<PanelBody
					title={__('Alignment', 'anam-gutenberg-starter')}
					initialOpen={true}
				>
					<AlignmentToolbar
						value={attributes.alignment}
						onChange={onChangeAlignment}
					/>
				</PanelBody>
			</InspectorControls>
		</div>
	);
}
