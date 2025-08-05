const React = require('react');

module.exports = {
	useBlockProps: jest.fn(() => ({ className: 'wp-block-test' })),
	RichText: jest.fn(({ value, placeholder }) =>
		React.createElement(
			'div',
			{ 'data-testid': 'rich-text' },
			value || placeholder
		)
	),
	AlignmentToolbar: jest.fn(() =>
		React.createElement('div', { 'data-testid': 'alignment-toolbar' })
	),
	BlockControls: jest.fn(({ children }) =>
		React.createElement(
			'div',
			{ 'data-testid': 'block-controls' },
			children
		)
	),
	ColorPalette: jest.fn(() =>
		React.createElement('div', { 'data-testid': 'color-palette' })
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
