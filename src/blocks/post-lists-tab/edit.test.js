/**
 * @jest-environment jsdom
 */

import { render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import edit from './edit';

jest.mock('@wordpress/block-editor', () => ({
	useBlockProps: jest.fn(() => ({
		className: 'wp-block-newsly-block-post-lists-tab',
	})),
}));

jest.mock(
	'@wordpress/server-side-render',
	() => ({
		__esModule: true,
		default: () => null,
	}),
	{ virtual: true },
);

jest.mock('@wordpress/api-fetch', () => ({
	__esModule: true,
	default: jest.fn(() => Promise.resolve([])),
}));

jest.mock('@wordpress/element', () => ({
	RawHTML: ({ children }) => <div>{children}</div>,
	useState: jest.requireActual('react').useState,
	useEffect: jest.requireActual('react').useEffect,
	useRef: jest.requireActual('react').useRef,
}));

jest.mock('@wordpress/i18n', () => ({
	__: jest.fn((text) => text),
}));

// getEntityRecords backing the dead-code `getPosts` selector inside edit.js;
// exposed via a `mock`-prefixed name so the jest.mock factory can reference it.
const mockGetEntityRecords = jest.fn();

jest.mock('@wordpress/data', () => ({
	// Actually invokes the selector callback (unlike a no-op stub) so the
	// getPosts branches inside edit.js execute and are covered.
	useSelect: jest.fn((callback) =>
		callback(() => ({ getEntityRecords: mockGetEntityRecords })),
	),
	withSelect: jest.fn((selector) => (Component) => Component),
	select: jest.fn(() => ({
		getEntityRecords: jest.fn(),
		getMedia: jest.fn(),
		getEditorSettings: jest.fn(),
		getCurrentPost: jest.fn(),
	})),
}));

jest.mock('./sidebarControl', () => {
	const React = require('react');
	return function MockSidebarControl({
		handleCategoryToggleControl,
		handleExcerptToggleControl,
		handleFeaturedImageToggleControl,
	}) {
		return React.createElement('div', { 'data-testid': 'sidebar-control' }, [
			React.createElement(
				'button',
				{
					key: 'category-toggle',
					'data-testid': 'category-toggle',
					onClick: () =>
						handleCategoryToggleControl &&
						handleCategoryToggleControl(),
				},
				'Toggle Category',
			),
			React.createElement(
				'button',
				{
					key: 'excerpt-toggle',
					'data-testid': 'excerpt-toggle',
					onClick: () =>
						handleExcerptToggleControl && handleExcerptToggleControl(),
				},
				'Toggle Excerpt',
			),
			React.createElement(
				'button',
				{
					key: 'featured-image-toggle',
					'data-testid': 'featured-image-toggle',
					onClick: () =>
						handleFeaturedImageToggleControl &&
						handleFeaturedImageToggleControl(),
				},
				'Toggle Featured Image',
			),
		]);
	};
});

jest.mock('./getFeaturedImage', () => {
	const React = require('react');
	return function MockGetFeaturedImage({ postId }) {
		return React.createElement('div', {
			'data-testid': 'featured-image',
			'data-post-id': postId,
		});
	};
});

jest.mock('./components', () => {
	const React = require('react');
	return function MockRenderPostCategoryData({ catArr }) {
		return React.createElement('div', {
			'data-testid': 'post-category-data',
			'data-cat-arr': JSON.stringify(catArr),
		});
	};
});

// Import the mocked apiFetch
import apiFetch from '@wordpress/api-fetch';

describe('Post Lists Tab - Edit', () => {
	const mockProps = {
		attributes: {
			categories: [],
			fetchedPosts: [],
			showExcerpt: true,
			showCategory: true,
			showFeaturedImage: true,
		},
		setAttributes: jest.fn(),
	};

	const mockPosts = [
		{
			title: { rendered: 'Post One' },
			featured_media: 5,
			categories: [1, 2],
			excerpt: { rendered: '<p>Excerpt one</p>' },
		},
		{
			title: { rendered: 'Post Two' },
			featured_media: 0,
			categories: [],
			excerpt: { rendered: '<p>Excerpt two</p>' },
		},
	];

	beforeEach(() => {
		jest.clearAllMocks();
		apiFetch.mockImplementation(() => Promise.resolve([]));
		mockProps.setAttributes.mockClear();
		mockGetEntityRecords.mockReset();
	});

	/**
	 * edit.js kicks off a real `isLoading` state update from its mount
	 * effect's apiFetch promise. Awaiting its settling keeps that update
	 * inside act() instead of leaking a warning into the next test.
	 */
	async function renderEdit(props) {
		const utils = render(React.createElement(edit, props));
		await waitFor(() => {
			expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
		});
		return utils;
	}

	describe('Component Rendering', () => {
		test('renders the sidebar control and the "All" tab', async () => {
			await renderEdit(mockProps);
			expect(
				screen.getByTestId('sidebar-control'),
			).toBeInTheDocument();
			expect(screen.getByText('All')).toBeInTheDocument();
		});

		test('renders no category tab links when categories is empty', async () => {
			const { container } = await renderEdit(mockProps);
			expect(container.querySelectorAll('.tablinks')).toHaveLength(1);
		});

		test('renders one tab link per category', async () => {
			const propsWithCategories = {
				...mockProps,
				attributes: {
					...mockProps.attributes,
					categories: [
						{ label: 'Tech', value: 1, slug: 'tech' },
						{ label: 'Sports', value: 2, slug: 'sports' },
					],
				},
			};
			const { container } = await renderEdit(propsWithCategories);
			expect(container.querySelectorAll('.tablinks')).toHaveLength(3);
			expect(screen.getByText('Tech')).toBeInTheDocument();
			expect(screen.getByText('Sports')).toBeInTheDocument();
		});

		test('renders nothing in the post list when fetchedPosts is empty', async () => {
			const { container } = await renderEdit(mockProps);
			expect(container.querySelectorAll('.post-card')).toHaveLength(0);
		});

		test('renders a post card per fetched post', async () => {
			const propsWithPosts = {
				...mockProps,
				attributes: { ...mockProps.attributes, fetchedPosts: mockPosts },
			};
			const { container } = await renderEdit(propsWithPosts);
			expect(container.querySelectorAll('.post-card')).toHaveLength(2);
			expect(screen.getByText('Post One')).toBeInTheDocument();
			expect(screen.getByText('Post Two')).toBeInTheDocument();
		});
	});

	describe('Loading indicator', () => {
		test('shows "Loading..." while the initial posts request is in flight', async () => {
			let resolvePosts;
			apiFetch.mockImplementation(({ path }) => {
				if (path === '/wp/v2/posts?per_page=9') {
					return new Promise((resolve) => {
						resolvePosts = resolve;
					});
				}
				return Promise.resolve([]);
			});

			render(React.createElement(edit, mockProps));

			expect(screen.getByText('Loading...')).toBeInTheDocument();

			resolvePosts([]);
			await waitFor(() => {
				expect(
					screen.queryByText('Loading...'),
				).not.toBeInTheDocument();
			});
		});

		test('hides "Loading..." once the posts request resolves', async () => {
			apiFetch.mockImplementation(({ path }) => {
				if (path === '/wp/v2/posts?per_page=9') {
					return Promise.resolve(mockPosts);
				}
				return Promise.resolve([]);
			});

			render(React.createElement(edit, mockProps));

			await waitFor(() => {
				expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
			});
		});
	});

	describe('Data fetching on mount', () => {
		test('fetches the initial batch of posts and stores them via setAttributes', async () => {
			apiFetch.mockImplementation(({ path }) => {
				if (path === '/wp/v2/posts?per_page=9') {
					return Promise.resolve(mockPosts);
				}
				return Promise.resolve([]);
			});

			render(React.createElement(edit, mockProps));

			await waitFor(() => {
				expect(mockProps.setAttributes).toHaveBeenCalledWith({
					fetchedPosts: mockPosts,
				});
			});
		});

		test('fetches categories and normalizes them to label/value/slug when categories is empty', async () => {
			apiFetch.mockImplementation(({ path }) => {
				if (path === '/wp/v2/categories') {
					return Promise.resolve([
						{ id: 1, name: 'Tech', slug: 'tech' },
						{ id: 2, name: 'Sports', slug: 'sports' },
					]);
				}
				return Promise.resolve([]);
			});

			render(React.createElement(edit, mockProps));

			await waitFor(() => {
				expect(mockProps.setAttributes).toHaveBeenCalledWith({
					categories: [
						{ label: 'Tech', value: 1, slug: 'tech' },
						{ label: 'Sports', value: 2, slug: 'sports' },
					],
				});
			});
		});

		test('does not re-fetch categories when categories are already populated', async () => {
			const propsWithCategories = {
				...mockProps,
				attributes: {
					...mockProps.attributes,
					categories: [{ label: 'Tech', value: 1, slug: 'tech' }],
				},
			};

			render(React.createElement(edit, propsWithCategories));

			await waitFor(() => {
				expect(apiFetch).toHaveBeenCalledWith({
					path: '/wp/v2/posts?per_page=9',
				});
			});

			expect(apiFetch).not.toHaveBeenCalledWith({
				path: '/wp/v2/categories',
			});
		});

		test('logs an error when the initial posts request fails', async () => {
			const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
			apiFetch.mockImplementation(({ path }) => {
				if (path === '/wp/v2/posts?per_page=9') {
					return Promise.reject(new Error('network down'));
				}
				return Promise.resolve([]);
			});

			render(React.createElement(edit, mockProps));

			await waitFor(() => {
				expect(consoleSpy).toHaveBeenCalledWith(
					'err',
					expect.any(Error),
				);
			});

			consoleSpy.mockRestore();
		});

		test('clears the loading indicator when the initial posts request fails', async () => {
			const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
			apiFetch.mockImplementation(({ path }) => {
				if (path === '/wp/v2/posts?per_page=9') {
					return Promise.reject(new Error('network down'));
				}
				return Promise.resolve([]);
			});

			render(React.createElement(edit, mockProps));

			expect(screen.getByText('Loading...')).toBeInTheDocument();

			await waitFor(() => {
				expect(
					screen.queryByText('Loading...'),
				).not.toBeInTheDocument();
			});

			consoleSpy.mockRestore();
		});
	});

	describe('getPosts selector (useSelect)', () => {
		test('returns undefined without calling getEntityRecords when no category is selected', async () => {
			await renderEdit(mockProps);
			expect(mockGetEntityRecords).not.toHaveBeenCalled();
		});

		test('fetches entity records for the selected category when one is set', async () => {
			mockGetEntityRecords.mockReturnValue([{ id: 1 }]);
			const propsWithCategory = {
				...mockProps,
				attributes: {
					...mockProps.attributes,
					selectedCategroyId: 7,
				},
			};

			await renderEdit(propsWithCategory);

			expect(mockGetEntityRecords).toHaveBeenCalledWith(
				'postType',
				'post',
				{ categories: [7] },
			);
		});

		test('handles getEntityRecords returning no data for the selected category', async () => {
			mockGetEntityRecords.mockReturnValue(null);
			const propsWithCategory = {
				...mockProps,
				attributes: {
					...mockProps.attributes,
					selectedCategroyId: 7,
				},
			};

			await renderEdit(propsWithCategory);

			expect(mockGetEntityRecords).toHaveBeenCalledWith(
				'postType',
				'post',
				{ categories: [7] },
			);
		});
	});

	describe('Post card content', () => {
		test('renders the featured image when showFeaturedImage is on and the post has one', async () => {
			const propsWithPosts = {
				...mockProps,
				attributes: { ...mockProps.attributes, fetchedPosts: mockPosts },
			};
			await renderEdit(propsWithPosts);

			const featuredImages = screen.getAllByTestId('featured-image');
			expect(featuredImages).toHaveLength(1);
			expect(featuredImages[0]).toHaveAttribute('data-post-id', '5');
		});

		test('does not render the featured image when the post has no featured media', async () => {
			const propsWithPosts = {
				...mockProps,
				attributes: {
					...mockProps.attributes,
					fetchedPosts: [mockPosts[1]],
				},
			};
			await renderEdit(propsWithPosts);

			expect(
				screen.queryByTestId('featured-image'),
			).not.toBeInTheDocument();
		});

		test('does not render the featured image when showFeaturedImage is off', async () => {
			const propsWithPosts = {
				...mockProps,
				attributes: {
					...mockProps.attributes,
					fetchedPosts: mockPosts,
					showFeaturedImage: false,
				},
			};
			await renderEdit(propsWithPosts);

			expect(
				screen.queryByTestId('featured-image'),
			).not.toBeInTheDocument();
		});

		test('renders the category data component when showCategory is on', async () => {
			const propsWithPosts = {
				...mockProps,
				attributes: {
					...mockProps.attributes,
					fetchedPosts: [mockPosts[0]],
				},
			};
			await renderEdit(propsWithPosts);

			const categoryData = screen.getByTestId('post-category-data');
			expect(categoryData).toHaveAttribute(
				'data-cat-arr',
				JSON.stringify([1, 2]),
			);
		});

		test('does not render the category data component when showCategory is off', async () => {
			const propsWithPosts = {
				...mockProps,
				attributes: {
					...mockProps.attributes,
					fetchedPosts: mockPosts,
					showCategory: false,
				},
			};
			await renderEdit(propsWithPosts);

			expect(
				screen.queryByTestId('post-category-data'),
			).not.toBeInTheDocument();
		});

		test('renders the excerpt html when showExcerpt is on', async () => {
			const propsWithPosts = {
				...mockProps,
				attributes: {
					...mockProps.attributes,
					fetchedPosts: [mockPosts[0]],
				},
			};
			const { container } = await renderEdit(propsWithPosts);

			expect(
				container.querySelector('.post-card__excerpt').innerHTML,
			).toBe('<p>Excerpt one</p>');
		});

		test('does not render the excerpt when showExcerpt is off', async () => {
			const propsWithPosts = {
				...mockProps,
				attributes: {
					...mockProps.attributes,
					fetchedPosts: mockPosts,
					showExcerpt: false,
				},
			};
			const { container } = await renderEdit(propsWithPosts);

			expect(
				container.querySelector('.post-card__excerpt'),
			).not.toBeInTheDocument();
		});
	});

	describe('Toggle handlers', () => {
		test('handleCategoryToggleControl flips showCategory', async () => {
			await renderEdit(mockProps);
			screen.getByTestId('category-toggle').click();
			expect(mockProps.setAttributes).toHaveBeenCalledWith({
				showCategory: false,
			});
		});

		test('handleExcerptToggleControl flips showExcerpt', async () => {
			await renderEdit(mockProps);
			screen.getByTestId('excerpt-toggle').click();
			expect(mockProps.setAttributes).toHaveBeenCalledWith({
				showExcerpt: false,
			});
		});

		test('handleFeaturedImageToggleControl flips showFeaturedImage', async () => {
			await renderEdit(mockProps);
			screen.getByTestId('featured-image-toggle').click();
			expect(mockProps.setAttributes).toHaveBeenCalledWith({
				showFeaturedImage: false,
			});
		});
	});
});
