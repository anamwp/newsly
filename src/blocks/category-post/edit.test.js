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
		useBlockProps: jest.fn((props = {}) => props),
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

jest.mock('@wordpress/components', () => {
	const React = require('react');
	return {
		Disabled: ({ children }) =>
			React.createElement('div', { 'data-testid': 'disabled' }, children),
	};
});

jest.mock('../components/GSPostCard', () => {
	const React = require('react');
	return function MockGSPostCard({ data }) {
		return React.createElement(
			'div',
			{
				'data-testid': 'post-card',
				'data-post-id': data ? data.id : '',
			},
			data ? data.title.rendered : '',
		);
	};
});

jest.mock('./sidebarControl', () => {
	const React = require('react');
	return function MockSidebarControl({
		handleCategoryChange,
		handleNumberofPoststoShow,
		handleNumberofPostsColumn,
		handleCategoryToggleControl,
		handleExcerptToggleControl,
		handleFeaturedExcerptToggleControl,
		handleFeaturedImageToggleControl,
	}) {
		return React.createElement(
			'div',
			{ 'data-testid': 'sidebar-control' },
			[
				React.createElement(
					'button',
					{
						key: 'category-change',
						'data-testid': 'category-change',
						onClick: () =>
							handleCategoryChange &&
							handleCategoryChange(['1', '2']),
					},
					'Change Category',
				),
				React.createElement(
					'button',
					{
						key: 'posts-to-show',
						'data-testid': 'posts-to-show',
						onClick: () =>
							handleNumberofPoststoShow &&
							handleNumberofPoststoShow(4),
					},
					'Posts To Show',
				),
				React.createElement(
					'button',
					{
						key: 'posts-column',
						'data-testid': 'posts-column',
						onClick: () =>
							handleNumberofPostsColumn &&
							handleNumberofPostsColumn(3),
					},
					'Posts Column',
				),
				React.createElement(
					'button',
					{
						key: 'toggle-category',
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
						key: 'toggle-excerpt',
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
						key: 'toggle-featured-excerpt',
						'data-testid': 'toggle-featured-excerpt',
						onClick: () =>
							handleFeaturedExcerptToggleControl &&
							handleFeaturedExcerptToggleControl(),
					},
					'Toggle Featured Excerpt',
				),
				React.createElement(
					'button',
					{
						key: 'toggle-featured-image',
						'data-testid': 'toggle-featured-image',
						onClick: () =>
							handleFeaturedImageToggleControl &&
							handleFeaturedImageToggleControl(),
					},
					'Toggle Featured Image',
				),
			],
		);
	};
});

import apiFetch from '@wordpress/api-fetch';

describe('Category Posts Edit Component', () => {
	const mockPostsCategory1 = [
		{
			id: 11,
			title: { rendered: 'Cat 1 Post' },
			excerpt: { rendered: '<p>Excerpt 1</p>' },
			categories: [1],
			featured_media: 0,
			link: '#',
		},
	];

	const mockPostsCategory2 = [
		{
			id: 21,
			title: { rendered: 'Cat 2 Post' },
			excerpt: { rendered: '<p>Excerpt 2</p>' },
			categories: [2],
			featured_media: 0,
			link: '#',
		},
	];

	const mockCategories = [
		{ label: 'Tech', value: '1' },
		{ label: 'News', value: '2' },
	];

	const baseProps = {
		attributes: {
			layout: 'grid',
			postColumn: 3,
			postsToShow: 3,
			categories: [],
			selectedCategroyId: [],
			selectedCategories: [],
			fetchedPosts: [],
			allCategoryPosts: {},
			activeTab: null,
			selectedPostId: null,
			showCategory: true,
			showExcerpt: true,
			showFeaturedImage: false,
			showFeaturedExcerpt: false,
		},
		setAttributes: jest.fn(),
	};

	let consoleLogSpy;
	let consoleErrorSpy;

	beforeEach(() => {
		jest.clearAllMocks();
		apiFetch.mockResolvedValue([]);
		consoleLogSpy = jest
			.spyOn(global.console, 'log')
			.mockImplementation(() => {});
		consoleErrorSpy = jest
			.spyOn(global.console, 'error')
			.mockImplementation(() => {});
	});

	afterEach(() => {
		if (consoleLogSpy) {
			consoleLogSpy.mockRestore();
		}
		if (consoleErrorSpy) {
			consoleErrorSpy.mockRestore();
		}
	});

	test('renders wrapper, sidebar, and fallback message', async () => {
		const EditComponent = edit;
		render(<EditComponent {...baseProps} />);

		await waitFor(() => expect(apiFetch).toHaveBeenCalled());
		expect(screen.getByTestId('sidebar-control')).toBeInTheDocument();
		expect(
			screen.getByText(
				'Please select one or more categories to display posts',
			),
		).toBeInTheDocument();
	});

	test('fetches categories on mount when categories are empty', async () => {
		apiFetch.mockResolvedValueOnce([
			{ id: 1, name: 'Tech' },
			{ id: 2, name: 'News' },
		]);

		const EditComponent = edit;
		render(<EditComponent {...baseProps} />);

		await waitFor(() => {
			expect(apiFetch).toHaveBeenCalledWith({
				path: '/wp/v2/categories?per_page=100&orderby=count&order=desc',
			});
		});

		await waitFor(() => {
			expect(baseProps.setAttributes).toHaveBeenCalledWith({
				categories: [
					{ label: 'Tech', value: '1' },
					{ label: 'News', value: '2' },
				],
			});
		});
	});

	test('handles category change and fetches posts for selected categories', async () => {
		apiFetch
			.mockResolvedValueOnce(mockPostsCategory1)
			.mockResolvedValueOnce(mockPostsCategory2);

		const propsWithCategories = {
			...baseProps,
			attributes: {
				...baseProps.attributes,
				categories: mockCategories,
			},
		};

		const EditComponent = edit;
		render(<EditComponent {...propsWithCategories} />);

		fireEvent.click(screen.getByTestId('category-change'));

		await waitFor(() => {
			expect(baseProps.setAttributes).toHaveBeenCalledWith({
				selectedCategroyId: ['1', '2'],
				selectedCategories: [
					{ id: 1, label: 'Tech' },
					{ id: 2, label: 'News' },
				],
			});
		});

		await waitFor(() => {
			expect(apiFetch).toHaveBeenCalledWith({
				path: '/wp/v2/posts?categories=1&per_page=24&_embed',
			});
			expect(apiFetch).toHaveBeenCalledWith({
				path: '/wp/v2/posts?categories=2&per_page=24&_embed',
			});
		});

		await waitFor(() => {
			expect(baseProps.setAttributes).toHaveBeenCalledWith(
				expect.objectContaining({
					activeTab: '1',
					selectedPostId: 11,
					allCategoryPosts: expect.any(Object),
				}),
			);
		});
	});

	test('toggles display flags via sidebar controls', async () => {
		const EditComponent = edit;
		render(<EditComponent {...baseProps} />);

		await waitFor(() => expect(apiFetch).toHaveBeenCalled());

		fireEvent.click(screen.getByTestId('toggle-category'));
		expect(baseProps.setAttributes).toHaveBeenCalledWith({
			showCategory: false,
		});

		fireEvent.click(screen.getByTestId('toggle-excerpt'));
		expect(baseProps.setAttributes).toHaveBeenCalledWith({
			showExcerpt: false,
		});

		fireEvent.click(screen.getByTestId('toggle-featured-image'));
		expect(baseProps.setAttributes).toHaveBeenCalledWith({
			showFeaturedImage: true,
		});

		fireEvent.click(screen.getByTestId('toggle-featured-excerpt'));
		expect(baseProps.setAttributes).toHaveBeenCalledWith({
			showFeaturedExcerpt: true,
		});
	});

	test('renders category tabs and post cards from allCategoryPosts', async () => {
		const propsWithPosts = {
			...baseProps,
			attributes: {
				...baseProps.attributes,
				selectedCategories: [
					{ id: 1, label: 'Tech' },
					{ id: 2, label: 'News' },
				],
				activeTab: 1,
				allCategoryPosts: {
					1: mockPostsCategory1,
					2: mockPostsCategory2,
				},
				postsToShow: 1,
			},
		};

		const EditComponent = edit;
		render(<EditComponent {...propsWithPosts} />);

		await waitFor(() => expect(apiFetch).toHaveBeenCalled());

		expect(screen.getByText('Tech')).toBeInTheDocument();
		expect(screen.getByText('News')).toBeInTheDocument();

		const postCards = screen.getAllByTestId('post-card');
		expect(postCards).toHaveLength(2);
	});

	test('updates active tab on tab click', async () => {
		const propsWithPosts = {
			...baseProps,
			attributes: {
				...baseProps.attributes,
				selectedCategories: [
					{ id: 1, label: 'Tech' },
					{ id: 2, label: 'News' },
				],
				activeTab: 1,
				allCategoryPosts: {
					1: mockPostsCategory1,
					2: mockPostsCategory2,
				},
				postsToShow: 1,
			},
		};

		const EditComponent = edit;
		render(<EditComponent {...propsWithPosts} />);

		await waitFor(() => expect(apiFetch).toHaveBeenCalled());

		fireEvent.click(screen.getByRole('tab', { name: 'News' }));

		expect(baseProps.setAttributes).toHaveBeenCalledWith({
			activeTab: 2,
			fetchedPosts: [mockPostsCategory2],
			selectedPostId: 21,
		});
	});
});
