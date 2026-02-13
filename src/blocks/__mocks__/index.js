// WordPress Mocks - Centralized mock definitions for testing
// These can be used in test files by requiring them inside jest.mock() factories

/**
 * Get mock for @wordpress/i18n
 * Usage in test: jest.mock('@wordpress/i18n', () => require('../__mocks__').getWordPressI18nMock())
 */
export function getWordPressI18nMock() {
	return {
		__: jest.fn((text) => text),
	};
}

/**
 * Get mock for @wordpress/data
 */
export function getWordPressDataMock() {
	return {
		useSelect: jest.fn(() => ({})),
		withSelect: jest.fn((selector) => (Component) => Component),
		select: jest.fn(() => ({})),
		dispatch: jest.fn(() => ({})),
		useDispatch: jest.fn(() => jest.fn()),
	};
}

/**
 * Get mock for @wordpress/element
 */
export function getWordPressElementMock() {
	return {
		RawHTML: ({ children }) => <div>{children}</div>,
		useState: jest.requireActual('react').useState,
		useRef: jest.requireActual('react').useRef,
		useEffect: jest.requireActual('react').useEffect,
		useContext: jest.fn(),
	};
}

/**
 * Get mock for @wordpress/block-editor (editor version)
 */
export function getWordPressBlockEditorMock() {
	const React = require('react');
	return {
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
}

/**
 * Get mock for @wordpress/block-editor (save version)
 */
export function getWordPressBlockEditorSaveMock() {
	return {
		useBlockProps: {
			save: jest.fn((props) => props || {}),
		},
	};
}

/**
 * Get mock for @wordpress/components (full version for sidebar controls)
 */
export function getWordPressComponentsMock() {
	const React = require('react');
	return {
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
					onChange: (e) =>
						onChange && onChange(parseInt(e.target.value)),
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
}

/**
 * Get mock for @wordpress/components (simplified for edit tests)
 */
export function getWordPressComponentsEditMock() {
	const React = require('react');
	return {
		PanelBody: jest.fn(({ children }) =>
			React.createElement(
				'div',
				{ 'data-testid': 'panel-body' },
				children,
			),
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
				type: 'range',
				value: value,
				onChange: (e) => onChange && onChange(parseInt(e.target.value)),
			}),
		),
		ToggleControl: jest.fn(({ onChange, checked }) =>
			React.createElement('input', {
				'data-testid': 'toggle-control',
				type: 'checkbox',
				checked: checked,
				onChange: (e) => onChange && onChange(e.target.checked),
			}),
		),
	};
}

/**
 * Get mock for @wordpress/api-fetch
 */
export function getWordPressApiFetchMock() {
	return jest.fn(() => Promise.resolve([]));
}

/**
 * Get mock for GSPostCardOverlay component
 */
export function getMockGSPostCardOverlay() {
	const React = require('react');
	return function MockGSPostCardOverlay({ data, parent }) {
		return React.createElement(
			'div',
			{
				'data-testid': 'post-card',
				'data-post-id': data ? data.id : '',
				'data-post-title': data ? data.title.rendered : '',
			},
			data ? data.title.rendered : '',
		);
	};
}
