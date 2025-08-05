const React = require('react');

module.exports = {
	useBlockProps: jest.fn(() => ({ className: 'wp-block-test' })),
	RichText: jest.fn(
		({
			value,
			placeholder,
			onChange,
			tagName: Tag = 'div',
			id,
			className,
			style,
		}) =>
			React.createElement('input', {
				'data-testid': 'rich-text',
				placeholder: placeholder,
				value: value || '',
				onChange: (e) => onChange && onChange(e.target.value),
				id: id,
				className: className,
				style: style,
				type: 'text',
			})
	),
	AlignmentToolbar: jest.fn(({ value, onChange }) =>
		React.createElement(
			'div',
			{
				'data-testid': 'alignment-toolbar',
			},
			[
				React.createElement(
					'button',
					{
						key: 'left',
						'data-testid': 'align-left',
						onClick: () => onChange('left'),
					},
					'Left'
				),
				React.createElement(
					'button',
					{
						key: 'center',
						'data-testid': 'align-center',
						onClick: () => onChange('center'),
					},
					'Center'
				),
				React.createElement(
					'button',
					{
						key: 'right',
						'data-testid': 'align-right',
						onClick: () => onChange('right'),
					},
					'Right'
				),
			]
		)
	),
	BlockControls: jest.fn(({ children }) =>
		React.createElement(
			'div',
			{ 'data-testid': 'block-controls' },
			children
		)
	),
	ColorPalette: jest.fn(({ onChange, value }) =>
		React.createElement(
			'div',
			{
				'data-testid': 'color-palette',
			},
			[
				React.createElement(
					'button',
					{
						key: 'red',
						'data-testid': 'color-red',
						onClick: () => onChange('#ff0000'),
					},
					'Red'
				),
				React.createElement(
					'button',
					{
						key: 'green',
						'data-testid': 'color-green',
						onClick: () => onChange('#00ff00'),
					},
					'Green'
				),
				React.createElement(
					'button',
					{
						key: 'blue',
						'data-testid': 'color-blue',
						onClick: () => onChange('#0000ff'),
					},
					'Blue'
				),
			]
		)
	),
	InnerBlocks: jest.fn(() =>
		React.createElement('div', { 'data-testid': 'inner-blocks' })
	),
	InspectorControls: jest.fn(({ children }) =>
		React.createElement(
			'div',
			{ 'data-testid': 'inspector-controls' },
			children
		)
	),
	useInnerBlocksProps: jest.fn(() => ({})),
};
