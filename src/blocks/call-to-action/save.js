import React from 'react';
import { useBlockProps, RichText, InnerBlocks } from '@wordpress/block-editor';

export default function save({ attributes }) {
	const blockProps = useBlockProps.save({
		className: 'gts__call-to-action',
	});

	return (
		<div {...blockProps}>
			<div
				className={`call-to-action font-roboto flex flex-row ${
					attributes.imageLayoutPosition === 'right'
						? 'flex-row-reverse'
						: ''
				} items-center shadow-md rounded-md overflow-hidden`}
			>
				<div className="call-to-action__left basis-1/2">
					{attributes.showImage && (
						<div
							className="call-to-action__media-wrapper"
							style={{ textAlign: attributes.alignment }}
						>
							{attributes.media && (
								<img
									src={attributes.mediaUrl}
									alt=""
									style={{
										objectPosition: attributes.focalPoint
											? `${
													attributes.focalPoint.x *
													100
											  }% ${
													attributes.focalPoint.y *
													100
											  }%`
											: undefined,
									}}
								/>
							)}
						</div>
					)}
				</div>
				<div className="call-to-action__right basis-1/2 p-10">
					<div className="call-to-action__title">
						<RichText.Content
							style={{ textAlign: attributes.alignment }}
							tagName="h3"
							className="text-3xl font-medium text-slate-900 font-poppins"
							value={attributes.title && attributes.title}
						/>
					</div>
					<div className="call-to-action__content mt-5 font-roboto">
						<RichText.Content
							style={{ textAlign: attributes.alignment }}
							tagName="p"
							value={attributes.content && attributes.content}
						/>
					</div>
					<div
						className="call-to-action__button mt-8 font-roboto font-medium"
						style={{ textAlign: attributes.alignment }}
					>
						<InnerBlocks.Content />
					</div>
				</div>
			</div>
		</div>
	);
}
