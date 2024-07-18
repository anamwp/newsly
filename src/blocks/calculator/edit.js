/**
 * Retrieves the translation of text.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-i18n/
 */
import { __ } from '@wordpress/i18n';

/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/#useblockprops
 */
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import {
	__experimentalNumberControl as NumberControl,
	PanelBody,
} from '@wordpress/components';

/**
 * The edit function describes the structure of your block in the context of the
 * editor. This represents what the editor will render when the block is used.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#edit
 *
 * @param {Object}   props               Properties passed to the function.
 * @param {Object}   props.attributes    Available block attributes.
 * @param {Function} props.setAttributes Function that updates individual attributes.
 *
 * @return {Element} Element to render.
 */
export default function Edit({ attributes, setAttributes }) {
	const blockProps = useBlockProps();
	const { price } = attributes;
	const exampleDonationAmount = 1000;
	const trees = Math.floor(exampleDonationAmount / price);

	return (
		<div {...blockProps}>
			<InspectorControls>
				<PanelBody title={__('Calculator Settings')}>
					<NumberControl
						label={__('set the price for one tree')}
						help={__('The value will be used for calculation')}
						value={price}
						min={1}
						onChange={(value) =>
							setAttributes({
								price: Number(value),
							})
						}
					/>
				</PanelBody>
			</InspectorControls>
			<form className="calculator">
				<label
					htmlFor="contribution-value"
					className="calculator-label"
				>
					{__('Check the impact of your donation')}
				</label>
				<div className="calculator-input">
					$
					<input
						disabled
						type="number"
						value={exampleDonationAmount}
						className="calculator-input-form"
						id="contribution-value"
					/>
				</div>
				<output className="calculator-output">
					{[
						__('Your'),
						<span>${exampleDonationAmount}</span>,
						__('donation will enable us to plant'),
						<span>{trees}</span>,
						__('trees'),
					]}
				</output>
			</form>
		</div>
	);
}
