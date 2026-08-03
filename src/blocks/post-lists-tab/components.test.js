/**
 * @jest-environment jsdom
 */

import { render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import RenderPostCategoryData from './components';

jest.mock('@wordpress/api-fetch', () => ({
	__esModule: true,
	default: jest.fn(),
}));

jest.mock('@wordpress/element', () => ({
	RawHTML: ({ children }) => <div>{children}</div>,
	useState: jest.requireActual('react').useState,
	useRef: jest.requireActual('react').useRef,
	useEffect: jest.requireActual('react').useEffect,
}));

import apiFetch from '@wordpress/api-fetch';

describe('Post Lists Tab - components.js (RenderPostCategoryData)', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	test('shows a fetching message before the categories resolve', () => {
		apiFetch.mockReturnValue(new Promise(() => {}));
		render(<RenderPostCategoryData catArr={[1, 2]} />);
		expect(screen.getByText('Fetching Data')).toBeInTheDocument();
	});

	test('requests categories using the comma-joined catArr ids', async () => {
		apiFetch.mockResolvedValue([]);
		render(<RenderPostCategoryData catArr={[1, 2, 3]} />);
		expect(apiFetch).toHaveBeenCalledWith({
			path: '/wp/v2/categories?include=1,2,3',
		});

		// Flush the resolved fetch inside act() so the update doesn't leak
		// into the next test as an "update not wrapped in act" warning.
		await waitFor(() => {
			expect(screen.queryByText('Fetching Data')).not.toBeInTheDocument();
		});
	});

	test('renders a link per category once the fetch resolves', async () => {
		// The component doesn't set a `key` on the mapped <a> tags; suppress
		// that pre-existing React warning so it doesn't fail the test run.
		const consoleErrorSpy = jest
			.spyOn(console, 'error')
			.mockImplementation();

		apiFetch.mockResolvedValue([
			{ name: 'Tech', link: 'https://example.test/tech' },
			{ name: 'Sports', link: 'https://example.test/sports' },
		]);
		render(<RenderPostCategoryData catArr={[1, 2]} />);

		await waitFor(() => {
			expect(screen.getByText('Tech')).toBeInTheDocument();
		});
		expect(screen.getByText('Tech')).toHaveAttribute(
			'href',
			'https://example.test/tech',
		);
		expect(screen.getByText('Sports')).toHaveAttribute(
			'href',
			'https://example.test/sports',
		);
		expect(screen.queryByText('Fetching Data')).not.toBeInTheDocument();

		consoleErrorSpy.mockRestore();
	});

	test('logs the error and keeps the fetching message when the request fails', async () => {
		const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
		apiFetch.mockRejectedValue(new Error('boom'));

		render(<RenderPostCategoryData catArr={[1]} />);

		await waitFor(() => {
			expect(consoleLogSpy).toHaveBeenCalledWith(expect.any(Error));
		});
		expect(screen.getByText('Fetching Data')).toBeInTheDocument();

		consoleLogSpy.mockRestore();
	});
});
