const React = require('react');

module.exports = {
	TextControl: jest.fn(() =>
		React.createElement('div', { 'data-testid': 'text-control' })
	),
	ColorPicker: jest.fn(() =>
		React.createElement('div', { 'data-testid': 'color-picker' })
	),
	Panel: jest.fn(({ children }) =>
		React.createElement('div', { 'data-testid': 'panel' }, children)
	),
	PanelBody: jest.fn(({ children, title }) =>
		React.createElement(
			'div',
			{ 'data-testid': 'panel-body', 'data-title': title },
			children
		)
	),
	PanelRow: jest.fn(({ children }) =>
		React.createElement('div', { 'data-testid': 'panel-row' }, children)
	),
	FontSizePicker: jest.fn(() =>
		React.createElement('div', { 'data-testid': 'font-size-picker' })
	),
	CheckboxControl: jest.fn(() =>
		React.createElement('div', { 'data-testid': 'checkbox-control' })
	),
};
