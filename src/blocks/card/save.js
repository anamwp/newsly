import React from 'react';
import { useBlockProps, RichText, InnerBlocks } from '@wordpress/block-editor';

export default function save(props) {
	const blockProps = useBlockProps.save({
		className: 'call-to-action',
	});
	console.log(blockProps);
	debugger;
	return (
		<div {...blockProps}>
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
