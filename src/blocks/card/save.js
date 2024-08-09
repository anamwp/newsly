import React from 'react';
import { useBlockProps, RichText, InnerBlocks } from '@wordpress/block-editor';

export default function save({ attributes, props }) {
	/**
	 * Set classname
	 */
	const blockProps = useBlockProps.save({
		className: 'gts__card',
	});
	return (
		<div {...blockProps}>
			<div className="card shadow-md hover:shadow-lg rounded border-solid border-black-400 border-2 p-8">
				{/* image */}
				{attributes.imageId && (
					<div className="card__img rounded">
						<img
							className={
								'shadow-md hover:shadow-lg inline-block transition-all w-full rounded achievement-image wp-image-' +
								attributes.imageId
							}
							src={attributes.imageUrl}
							width={900}
							height={600}
							// alt={attributes.mediaAlt}
						/>
					</div>
				)}
				{/* card content */}
				<div className="card__content">
					{/* title */}
					<div className="card__content__title">
						<RichText.Content
							tagName="h2"
							className="mt-8 mb-3 font-poppins text-2xl text-slate-700 font-medium"
							value={attributes.title}
							style={{
								fontSize: attributes.titleFontSize + 'px',
							}}
						/>
					</div>
					{/* content */}
					<div className="card__content__description font-roboto">
						<RichText.Content
							tagName="p"
							className="text-slate-600"
							value={attributes.content}
							style={{
								fontSize: attributes.contentFontSize + 'px',
							}}
						/>
					</div>
					{/* footer */}
					<div className="card__footer mt-5">
						<InnerBlocks.Content />
					</div>
				</div>
			</div>
		</div>
	);
}
