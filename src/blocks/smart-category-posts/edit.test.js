/**
 * @jest-environment jsdom
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import edit from './edit';

jest.mock('@wordpress/block-editor', () => {
	const React = require('react');
	const {
		wordPressBlockEditorMock,
	} = require('../__mocks__/wordpress-block-editor');
	return {
		...wordPressBlockEditorMock,
		useBlockProps: jest.fn(() => ({
			className: 'newsly_block__latest_posts',
		})),
		RichText: ({ tagName = 'p', value }) =>
			React.createElement(tagName, { 'data-testid': 'rich-text' }, value),
	};
});

jest.mock('@wordpress/api-fetch', () => ({
	__esModule: true,
	default: require('../__mocks__/wordpress-api-fetch').wordPressApiFetchMock,
}));

jest.mock(
	'@wordpress/element',
	() => require('../__mocks__/wordpress-element').wordPressElementMock,
);

jest.mock(
	'@wordpress/i18n',
	() => require('../__mocks__/wordpress-i18n').wordPressI18nMock,
);

jest.mock('@wordpress/data', () => {
	const { wordPressDataMock } = require('../__mocks__/wordpress-data');
	return {
		...wordPressDataMock,
		useSelect: jest.fn((callback) =>
			callback(() => ({
				getEntityRecords: jest.fn(() => null),
			})),
		),
		select: jest.fn(() => ({
			getEntityRecords: jest.fn(() => null),
			getEditorSettings: jest.fn(() => ({})),
			getCurrentPost: jest.fn(() => ({})),
		})),
	};
});

jest.mock('@wordpress/components', () => {
	const React = require('react');
	return {
		Disabled: ({ children }) =>
			React.createElement('div', { 'data-testid': 'disabled' }, children),
	};
});

jest.mock(
	'@wordpress/server-side-render',
	() => {
		const React = require('react');
		return function MockServerSideRender() {
			return React.createElement('div', {
				'data-testid': 'server-side-render',
			});
		};
	},
	{ virtual: true },
);

jest.mock('./getFeaturedImage', () => {
	const React = require('react');
	return function MockGetFeaturedImage() {
		return React.createElement('div', { 'data-testid': 'featured-image' });
	};
});

jest.mock('./components', () => {
	const React = require('react');
	return jest.fn(({ catArr }) =>
		React.createElement(
			'div',
			{
				'data-testid': 'post-category',
				'data-cat-count': catArr ? catArr.length : 0,
			},
			'Categories',
		),
	);
});

jest.mock('./sidebarControl', () => {
	const React = require('react');
	return function MockSidebarControl({
		handleCategoryToggleControl,
		handleExcerptToggleControl,
		handleFeaturedImageToggleControl,
	}) {
		return React.createElement(
			'div',
			{ 'data-testid': 'sidebar-control' },
			[
				React.createElement(
					'button',
					{
						key: 'category',
						'data-testid': 'toggle-category',
						onClick: () =>
							handleCategoryToggleControl &&
							handleCategoryToggleControl(),
					},
					'Toggle Category',
				),
				React.createElement(
					'button',
					{
						key: 'excerpt',
						'data-testid': 'toggle-excerpt',
						onClick: () =>
							handleExcerptToggleControl &&
							handleExcerptToggleControl(),
					},
					'Toggle Excerpt',
				),
				React.createElement(
					'button',
					{
						key: 'featured',
						'data-testid': 'toggle-featured',
						onClick: () =>
							handleFeaturedImageToggleControl &&
							handleFeaturedImageToggleControl(),
					},
					'Toggle Featured',
				),
			],
		);
	};
});

import apiFetch from '@wordpress/api-fetch';

describe('Smart Category Posts Edit Component', () => {
	const mockPosts = [
		{
			id: 1,
			title: { rendered: 'Post One' },
			excerpt: { rendered: '<p>Excerpt One</p>' },
			categories: [1, 2],
			featured_media: 0,
			link: '#',
		},
		{
			id: 2,
			title: { rendered: 'Post Two' },
			excerpt: { rendered: '<p>Excerpt Two</p>' },
			categories: [3],
			featured_media: 0,
			link: '#',
		},
	];

	const mockCategories = [
		{ label: 'Tech', value: 1, slug: 'tech' },
		{ label: 'News', value: 2, slug: 'news' },
	];

	const mockProps = {
		attributes: {
			categories: [],
			fetchedPosts: [],
			fetchPosts: [],
			selectedCategroyId: '',
			showCategory: true,
			showExcerpt: true,
			showFeaturedImage: false,
		},
		setAttributes: jest.fn(),
	};

	let consoleErrorSpy;
	let consoleLogSpy;

	beforeEach(() => {
		jest.clearAllMocks();
		apiFetch.mockResolvedValue([]);
		consoleErrorSpy = jest
			.spyOn(global.console, 'error')
			.mockImplementation(() => {});
		consoleLogSpy = jest
			.spyOn(global.console, 'log')
			.mockImplementation(() => {});
	});

	afterEach(() => {
		if (consoleErrorSpy) {
			consoleErrorSpy.mockClear();
			consoleErrorSpy.mockRestore();
		}
		if (consoleLogSpy) {
			consoleLogSpy.mockClear();
			consoleLogSpy.mockRestore();
		}
	});

	test('renders wrapper and sidebar control', async () => {
		const EditComponent = edit;
		const { container } = render(<EditComponent {...mockProps} />);

		await waitFor(() => expect(apiFetch).toHaveBeenCalled());

		expect(
			container.querySelector('.newsly_block__latest_posts'),
		).toBeInTheDocument();
		expect(screen.getByTestId('sidebar-control')).toBeInTheDocument();
	});

	test('fetches categories on mount when empty', async () => {
		apiFetch
			.mockResolvedValueOnce([
				{ id: 1, name: 'Tech', slug: 'tech' },
				{ id: 2, name: 'News', slug: 'news' },
			])
			.mockResolvedValueOnce(mockPosts);

		const EditComponent = edit;
		render(<EditComponent {...mockProps} />);

		await waitFor(() => {
			expect(apiFetch).toHaveBeenCalledWith({
				path: '/wp/v2/categories',
			});
		});

		await waitFor(() => {
			expect(mockProps.setAttributes).toHaveBeenCalledWith({
				categories: [
					{ label: 'Tech', value: 1, slug: 'tech' },
					{ label: 'News', value: 2, slug: 'news' },
				],
			});
		});
	});

	test('fetches posts when fetchPosts is empty', async () => {
		apiFetch.mockResolvedValueOnce([]).mockResolvedValueOnce(mockPosts);

		const EditComponent = edit;
		render(<EditComponent {...mockProps} />);

		await waitFor(() => {
			expect(apiFetch).toHaveBeenCalledWith({
				path: '/wp/v2/posts?per_page=9',
			});
		});

		await waitFor(() => {
			expect(mockProps.setAttributes).toHaveBeenCalledWith({
				fetchedPosts: mockPosts,
			});
		});
	});

	test('renders category tabs when categories exist', async () => {
		const propsWithCategories = {
			...mockProps,
			attributes: {
				...mockProps.attributes,
				categories: mockCategories,
			},
		};

		const EditComponent = edit;
		render(<EditComponent {...propsWithCategories} />);

		await waitFor(() => expect(apiFetch).toHaveBeenCalled());

		expect(screen.getByText('Tech')).toBeInTheDocument();
		expect(screen.getByText('News')).toBeInTheDocument();
	});

	test('toggles showCategory when sidebar control is clicked', async () => {
		const EditComponent = edit;
		render(<EditComponent {...mockProps} />);

		await waitFor(() => expect(apiFetch).toHaveBeenCalled());

		fireEvent.click(screen.getByTestId('toggle-category'));
		expect(mockProps.setAttributes).toHaveBeenCalledWith({
			showCategory: false,
		});
	});

	test('toggles showExcerpt when sidebar control is clicked', async () => {
		const EditComponent = edit;
		render(<EditComponent {...mockProps} />);

		await waitFor(() => expect(apiFetch).toHaveBeenCalled());

		fireEvent.click(screen.getByTestId('toggle-excerpt'));
		expect(mockProps.setAttributes).toHaveBeenCalledWith({
			showExcerpt: false,
		});
	});

	test('toggles showFeaturedImage when sidebar control is clicked', async () => {
		const EditComponent = edit;
		render(<EditComponent {...mockProps} />);

		await waitFor(() => expect(apiFetch).toHaveBeenCalled());

		fireEvent.click(screen.getByTestId('toggle-featured'));
		expect(mockProps.setAttributes).toHaveBeenCalledWith({
			showFeaturedImage: true,
		});
	});

	test('renders fetched posts with category and excerpt', async () => {
		const propsWithPosts = {
			...mockProps,
			attributes: {
				...mockProps.attributes,
				fetchedPosts: mockPosts,
				showCategory: true,
				showExcerpt: true,
			},
		};

		const EditComponent = edit;
		render(<EditComponent {...propsWithPosts} />);

		await waitFor(() => expect(apiFetch).toHaveBeenCalled());

		expect(screen.getByText('Post One')).toBeInTheDocument();
		expect(screen.getByText('Post Two')).toBeInTheDocument();
		expect(screen.getAllByTestId('post-category')).toHaveLength(2);
	});
});
