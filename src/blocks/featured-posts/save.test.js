/**
 * @jest-environment jsdom
 */

import { render, screen } from '@testing-library/react';
import React from 'react';
import save from './save';

// Mock WordPress dependencies
jest.mock('@wordpress/block-editor', () => ({
	useBlockProps: {
		save: jest.fn((props) => props || {}),
	},
}));

jest.mock('@wordpress/i18n', () => ({
	__: jest.fn((text) => text),
}));

jest.mock('../components/GSPostCardOverlay', () => {
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
});

describe('Featured Posts Save Component', () => {
	const mockProps = {
		attributes: {
			fetchedPosts: [],
			numberOfPosts: 5,
		},
	};

	const mockPosts = [
		{
			id: 1,
			title: { rendered: 'Test Post 1' },
			link: 'https://example.com/post-1',
		},
		{
			id: 2,
			title: { rendered: 'Test Post 2' },
			link: 'https://example.com/post-2',
		},
		{
			id: 3,
			title: { rendered: 'Test Post 3' },
			link: 'https://example.com/post-3',
		},
	];

	describe('Component Rendering', () => {
		test('renders without crashing with empty posts', () => {
			const { container } = render(React.createElement(save, mockProps));
			expect(
				container.querySelector('.newsly_block__featured_posts'),
			).toBeInTheDocument();
		});

		test('renders with correct block class name', () => {
			const { container } = render(React.createElement(save, mockProps));
			const blockElement = container.querySelector(
				'.newsly_block__featured_posts',
			);
			expect(blockElement).toBeInTheDocument();
		});

		test('renders nothing when posts array is empty', () => {
			render(React.createElement(save, mockProps));
			const postCards = screen.queryAllByTestId('post-card');
			expect(postCards).toHaveLength(0);
		});

		test('renders posts when available', () => {
			const propsWithPosts = {
				...mockProps,
				attributes: {
					...mockProps.attributes,
					fetchedPosts: mockPosts,
				},
			};
			render(React.createElement(save, propsWithPosts));
			const postCards = screen.getAllByTestId('post-card');
			expect(postCards).toHaveLength(3);
			expect(screen.getByText('Test Post 1')).toBeInTheDocument();
			expect(screen.getByText('Test Post 2')).toBeInTheDocument();
			expect(screen.getByText('Test Post 3')).toBeInTheDocument();
		});

		test('limits posts based on numberOfPosts attribute', () => {
			const propsWithPosts = {
				...mockProps,
				attributes: {
					...mockProps.attributes,
					fetchedPosts: mockPosts,
					numberOfPosts: 2,
				},
			};
			render(React.createElement(save, propsWithPosts));
			const postCards = screen.getAllByTestId('post-card');
			expect(postCards).toHaveLength(2);
		});

		test('renders all posts when numberOfPosts is greater than posts length', () => {
			const propsWithPosts = {
				...mockProps,
				attributes: {
					...mockProps.attributes,
					fetchedPosts: mockPosts,
					numberOfPosts: 10,
				},
			};
			render(React.createElement(save, propsWithPosts));
			const postCards = screen.getAllByTestId('post-card');
			expect(postCards).toHaveLength(3);
		});

		test('renders zero posts when numberOfPosts is 0', () => {
			const propsWithPosts = {
				...mockProps,
				attributes: {
					...mockProps.attributes,
					fetchedPosts: mockPosts,
					numberOfPosts: 0,
				},
			};
			render(React.createElement(save, propsWithPosts));
			const postCards = screen.queryAllByTestId('post-card');
			expect(postCards).toHaveLength(0);
		});
	});

	describe('Props Passing', () => {
		test('passes correct data prop to GSPostCardOverlay', () => {
			const propsWithPosts = {
				...mockProps,
				attributes: {
					...mockProps.attributes,
					fetchedPosts: [mockPosts[0]],
				},
			};
			render(React.createElement(save, propsWithPosts));
			const postCard = screen.getByTestId('post-card');
			expect(postCard).toHaveAttribute('data-post-id', '1');
			expect(postCard).toHaveAttribute('data-post-title', 'Test Post 1');
		});

		test('passes parent prop to GSPostCardOverlay', () => {
			const propsWithPosts = {
				...mockProps,
				attributes: {
					...mockProps.attributes,
					fetchedPosts: [mockPosts[0]],
				},
			};
			render(React.createElement(save, propsWithPosts));
			expect(screen.getByTestId('post-card')).toBeInTheDocument();
		});

		test('renders each post with unique key', () => {
			const propsWithPosts = {
				...mockProps,
				attributes: {
					...mockProps.attributes,
					fetchedPosts: mockPosts,
				},
			};
			render(React.createElement(save, propsWithPosts));
			const postCards = screen.getAllByTestId('post-card');

			expect(postCards[0]).toHaveAttribute('data-post-id', '1');
			expect(postCards[1]).toHaveAttribute('data-post-id', '2');
			expect(postCards[2]).toHaveAttribute('data-post-id', '3');
		});
	});

	describe('Edge Cases', () => {
		test('handles single post', () => {
			const propsWithPosts = {
				...mockProps,
				attributes: {
					...mockProps.attributes,
					fetchedPosts: [mockPosts[0]],
					numberOfPosts: 1,
				},
			};
			render(React.createElement(save, propsWithPosts));
			const postCards = screen.getAllByTestId('post-card');
			expect(postCards).toHaveLength(1);
			expect(screen.getByText('Test Post 1')).toBeInTheDocument();
		});

		test('handles numberOfPosts equal to posts length', () => {
			const propsWithPosts = {
				...mockProps,
				attributes: {
					...mockProps.attributes,
					fetchedPosts: mockPosts,
					numberOfPosts: 3,
				},
			};
			render(React.createElement(save, propsWithPosts));
			const postCards = screen.getAllByTestId('post-card');
			expect(postCards).toHaveLength(3);
		});

		test('handles negative numberOfPosts gracefully', () => {
			const propsWithPosts = {
				...mockProps,
				attributes: {
					...mockProps.attributes,
					fetchedPosts: mockPosts,
					numberOfPosts: -1,
				},
			};
			render(React.createElement(save, propsWithPosts));
			// slice(0, -1) will return all but last element
			const postCards = screen.queryAllByTestId('post-card');
			expect(postCards).toHaveLength(2);
		});
	});

	describe('Block Props', () => {
		test('calls useBlockProps.save with correct className', () => {
			const { useBlockProps } = require('@wordpress/block-editor');
			render(React.createElement(save, mockProps));

			expect(useBlockProps.save).toHaveBeenCalledWith({
				className: 'newsly_block__featured_posts',
			});
		});

		test('applies block props to wrapper div', () => {
			const { container } = render(React.createElement(save, mockProps));
			const blockDiv = container.querySelector(
				'.newsly_block__featured_posts',
			);
			expect(blockDiv).toBeInTheDocument();
		});
	});
});
