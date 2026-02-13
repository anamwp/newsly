/**
 * @jest-environment jsdom
 */

import { render, screen } from '@testing-library/react';
import React from 'react';
import save from './save';

// Mock WordPress dependencies using shared mocks
jest.mock(
	'@wordpress/block-editor',
	() =>
		require('../__mocks__/wordpress-block-editor')
			.wordPressBlockEditorSaveMock,
);

jest.mock(
	'@wordpress/i18n',
	() => require('../__mocks__/wordpress-i18n').wordPressI18nMock,
);

jest.mock(
	'../components/GSPostCardOverlay',
	() => require('../__mocks__/GSPostCardOverlay').MockGSPostCardOverlay,
);

describe('Latest Posts Save Component', () => {
	const mockPosts = [
		{
			id: 1,
			title: { rendered: 'Test Post 1' },
			_embedded: { author: [{ name: 'Author 1' }] },
		},
		{
			id: 2,
			title: { rendered: 'Test Post 2' },
			_embedded: { author: [{ name: 'Author 2' }] },
		},
		{
			id: 3,
			title: { rendered: 'Test Post 3' },
			_embedded: { author: [{ name: 'Author 3' }] },
		},
		{
			id: 4,
			title: { rendered: 'Test Post 4' },
			_embedded: { author: [{ name: 'Author 4' }] },
		},
		{
			id: 5,
			title: { rendered: 'Test Post 5' },
			_embedded: { author: [{ name: 'Author 5' }] },
		},
	];

	const mockProps = {
		attributes: {
			fetchedPosts: mockPosts,
			numberOfPosts: 3,
		},
	};

	beforeEach(() => {
		jest.clearAllMocks();
	});

	describe('Component Rendering', () => {
		test('renders without crashing', () => {
			const SaveComponent = save;
			const { container } = render(<SaveComponent {...mockProps} />);
			expect(
				container.querySelector('.newsly_block__latest_posts'),
			).toBeInTheDocument();
		});

		test('calls useBlockProps.save with correct className', () => {
			const { useBlockProps } = require('@wordpress/block-editor');
			const SaveComponent = save;
			render(<SaveComponent {...mockProps} />);

			expect(useBlockProps.save).toHaveBeenCalledWith({
				className: 'newsly_block__latest_posts',
			});
		});

		test('applies blockProps to wrapper div', () => {
			const SaveComponent = save;
			const { container } = render(<SaveComponent {...mockProps} />);
			const wrapper = container.querySelector(
				'.newsly_block__latest_posts',
			);

			expect(wrapper).toBeInTheDocument();
		});
	});

	describe('Post Rendering', () => {
		test('renders GSPostCardOverlay for each post', () => {
			const SaveComponent = save;
			render(<SaveComponent {...mockProps} />);

			const postCards = screen.getAllByTestId('post-card');
			expect(postCards).toHaveLength(3);
		});

		test('passes correct data prop to GSPostCardOverlay', () => {
			const SaveComponent = save;
			render(<SaveComponent {...mockProps} />);

			const postCards = screen.getAllByTestId('post-card');
			expect(postCards[0]).toHaveAttribute('data-post-id', '1');
			expect(postCards[0]).toHaveAttribute(
				'data-post-title',
				'Test Post 1',
			);
		});

		test('passes parent prop to GSPostCardOverlay', () => {
			const SaveComponent = save;
			render(<SaveComponent {...mockProps} />);

			const postCards = screen.getAllByTestId('post-card');
			expect(postCards.length).toBeGreaterThan(0);
		});

		test('renders correct post titles', () => {
			const SaveComponent = save;
			render(<SaveComponent {...mockProps} />);

			expect(screen.getByText('Test Post 1')).toBeInTheDocument();
			expect(screen.getByText('Test Post 2')).toBeInTheDocument();
			expect(screen.getByText('Test Post 3')).toBeInTheDocument();
		});

		test('uses correct key prop for each post', () => {
			const SaveComponent = save;
			const { container } = render(<SaveComponent {...mockProps} />);

			const postCards = container.querySelectorAll(
				'[data-testid="post-card"]',
			);
			expect(postCards[0]).toHaveAttribute('data-post-id', '1');
			expect(postCards[1]).toHaveAttribute('data-post-id', '2');
			expect(postCards[2]).toHaveAttribute('data-post-id', '3');
		});
	});

	describe('numberOfPosts Slicing', () => {
		test('limits posts displayed to numberOfPosts', () => {
			const SaveComponent = save;
			render(<SaveComponent {...mockProps} />);

			const postCards = screen.getAllByTestId('post-card');
			expect(postCards).toHaveLength(3);
		});

		test('displays all posts when numberOfPosts exceeds array length', () => {
			const propsWithHighLimit = {
				attributes: {
					fetchedPosts: mockPosts,
					numberOfPosts: 10,
				},
			};

			const SaveComponent = save;
			render(<SaveComponent {...propsWithHighLimit} />);

			const postCards = screen.getAllByTestId('post-card');
			expect(postCards).toHaveLength(5);
		});

		test('displays no posts when numberOfPosts is 0', () => {
			const propsWithZero = {
				attributes: {
					fetchedPosts: mockPosts,
					numberOfPosts: 0,
				},
			};

			const SaveComponent = save;
			render(<SaveComponent {...propsWithZero} />);

			const postCards = screen.queryAllByTestId('post-card');
			expect(postCards).toHaveLength(0);
		});

		test('displays single post when numberOfPosts is 1', () => {
			const propsWithOne = {
				attributes: {
					fetchedPosts: mockPosts,
					numberOfPosts: 1,
				},
			};

			const SaveComponent = save;
			render(<SaveComponent {...propsWithOne} />);

			const postCards = screen.getAllByTestId('post-card');
			expect(postCards).toHaveLength(1);
			expect(screen.getByText('Test Post 1')).toBeInTheDocument();
		});

		test('slices correct range of posts', () => {
			const propsWithTwo = {
				attributes: {
					fetchedPosts: mockPosts,
					numberOfPosts: 2,
				},
			};

			const SaveComponent = save;
			render(<SaveComponent {...propsWithTwo} />);

			expect(screen.getByText('Test Post 1')).toBeInTheDocument();
			expect(screen.getByText('Test Post 2')).toBeInTheDocument();
			expect(screen.queryByText('Test Post 3')).not.toBeInTheDocument();
		});
	});

	describe('Empty State', () => {
		test('renders empty div when fetchedPosts is empty array', () => {
			const propsWithNoPosts = {
				attributes: {
					fetchedPosts: [],
					numberOfPosts: 3,
				},
			};

			const SaveComponent = save;
			const { container } = render(
				<SaveComponent {...propsWithNoPosts} />,
			);

			const wrapper = container.querySelector(
				'.newsly_block__latest_posts',
			);
			expect(wrapper).toBeInTheDocument();
			expect(wrapper.children.length).toBe(0);
		});

		test('does not render GSPostCardOverlay when no posts', () => {
			const propsWithNoPosts = {
				attributes: {
					fetchedPosts: [],
					numberOfPosts: 3,
				},
			};

			const SaveComponent = save;
			render(<SaveComponent {...propsWithNoPosts} />);

			const postCards = screen.queryAllByTestId('post-card');
			expect(postCards).toHaveLength(0);
		});
	});

	describe('Edge Cases', () => {
		test('handles single post in array', () => {
			const propsWithSinglePost = {
				attributes: {
					fetchedPosts: [mockPosts[0]],
					numberOfPosts: 5,
				},
			};

			const SaveComponent = save;
			render(<SaveComponent {...propsWithSinglePost} />);

			const postCards = screen.getAllByTestId('post-card');
			expect(postCards).toHaveLength(1);
		});

		test('handles exact match of numberOfPosts and array length', () => {
			const propsExactMatch = {
				attributes: {
					fetchedPosts: mockPosts.slice(0, 3),
					numberOfPosts: 3,
				},
			};

			const SaveComponent = save;
			render(<SaveComponent {...propsExactMatch} />);

			const postCards = screen.getAllByTestId('post-card');
			expect(postCards).toHaveLength(3);
		});

		test('renders correctly with different numberOfPosts values', () => {
			const testCases = [
				{ numberOfPosts: 1, expected: 1 },
				{ numberOfPosts: 2, expected: 2 },
				{ numberOfPosts: 4, expected: 4 },
				{ numberOfPosts: 5, expected: 5 },
			];

			const SaveComponent = save;
			testCases.forEach(({ numberOfPosts, expected }) => {
				const { unmount } = render(
					<SaveComponent
						attributes={{
							fetchedPosts: mockPosts,
							numberOfPosts,
						}}
					/>,
				);

				const postCards = screen.getAllByTestId('post-card');
				expect(postCards).toHaveLength(expected);
				unmount();
			});
		});
	});

	describe('Integration', () => {
		test('complete render with all props and data', () => {
			const completeProps = {
				attributes: {
					fetchedPosts: mockPosts,
					numberOfPosts: 3,
					categories: [],
					selectedCategroyId: '1',
					showCategory: true,
				},
			};

			const SaveComponent = save;
			const { container } = render(<SaveComponent {...completeProps} />);

			const wrapper = container.querySelector(
				'.newsly_block__latest_posts',
			);
			expect(wrapper).toBeInTheDocument();

			const postCards = screen.getAllByTestId('post-card');
			expect(postCards).toHaveLength(3);

			expect(screen.getByText('Test Post 1')).toBeInTheDocument();
			expect(screen.getByText('Test Post 2')).toBeInTheDocument();
			expect(screen.getByText('Test Post 3')).toBeInTheDocument();
		});
	});
});
