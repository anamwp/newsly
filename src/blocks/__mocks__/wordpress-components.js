const React = require('react');

export const wordPressComponentsMock = {
	PanelBody: ({ children, title, initialOpen }) =>
		React.createElement(
			'div',
			{
				'data-testid': 'panel-body',
				'data-title': title,
				'data-initial-open': initialOpen,
			},
			children,
		),
	SelectControl: ({ label, value, options, onChange }) =>
		React.createElement('div', { 'data-testid': 'select-control' }, [
			React.createElement('label', { key: 'label' }, label),
			React.createElement(
				'select',
				{
					key: 'select',
					'data-testid': 'select-input',
					value: value,
					onChange: (e) => onChange && onChange(e.target.value),
				},
				options
					? options.map((opt) =>
							React.createElement(
								'option',
								{ key: opt.value, value: opt.value },
								opt.label,
							),
					  )
					: [],
			),
		]),
	RangeControl: ({ label, value, onChange, min, max, step }) =>
		React.createElement('div', { 'data-testid': 'range-control' }, [
			React.createElement('label', { key: 'label' }, label),
			React.createElement('input', {
				key: 'input',
				'data-testid': 'range-input',
				type: 'range',
				value: value,
				min: min,
				max: max,
				step: step,
				onChange: (e) => onChange && onChange(parseInt(e.target.value)),
			}),
		]),
	ToggleControl: ({ label, checked, onChange }) =>
		React.createElement(
			'div',
			{ 'data-testid': 'toggle-control', 'data-label': label },
			[
				React.createElement('label', { key: 'label' }, label),
				React.createElement('input', {
					key: 'input',
					'data-testid': `toggle-${label
						.toLowerCase()
						.replace(/\s+/g, '-')}`,
					type: 'checkbox',
					checked: checked,
					onChange: (e) => onChange && onChange(e.target.checked),
				}),
			],
		),
};

// Simplified version for edit tests
export const wordPressComponentsEditMock = {
	PanelBody: jest.fn(({ children }) =>
		React.createElement('div', { 'data-testid': 'panel-body' }, children),
	),
	SelectControl: jest.fn(({ onChange, options }) =>
		React.createElement(
			'select',
			{
				'data-testid': 'select-control',
				onChange: (e) => onChange && onChange(e.target.value),
			},
			options
				? options.map((opt) =>
						React.createElement(
							'option',
							{ key: opt.value, value: opt.value },
							opt.label,
						),
				  )
				: [],
		),
	),
	RangeControl: jest.fn(({ onChange, value }) =>
		React.createElement('input', {
			'data-testid': 'range-control',
			type: 'number',
			value: value,
			onChange: (e) =>
				onChange && onChange(parseInt(e.target.value) || 0),
		}),
	),
};
