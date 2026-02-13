const React = require('react');

export const wordPressBlockEditorMock = {
	useBlockProps: jest.fn(() => ({
		className: 'newsly_block__featured_posts',
	})),
	InspectorControls: ({ children }) =>
		React.createElement(
			'div',
			{ 'data-testid': 'inspector-controls' },
			children,
		),
};

export const wordPressBlockEditorSaveMock = {
	useBlockProps: {
		save: jest.fn((props) => props || {}),
	},
};
