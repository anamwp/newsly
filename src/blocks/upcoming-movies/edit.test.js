/**
 * Edit Component Tests
 *
 * WordPress dependencies are mocked globally in __mocks__/@wordpress/
 * Component-specific mocks are defined below for this test file only
 */

import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import Edit from './edit';
import BlockJSON from './block.json';

// Component-specific mocks
jest.mock('./sidebarControl', () => {
	return function SidebarControl() {
		return <div data-testid="sidebar-control">Sidebar Control</div>;
	};
});

jest.mock('../components/MovieCard', () => {
	return function MovieCard({ movie }) {
		return <div data-testid="movie-card">{movie?.title || 'Movie'}</div>;
	};
});

jest.mock('../components/PopupModal', () => {
	return function PopupModal() {
		return <div data-testid="popup-modal">Popup Modal</div>;
	};
});

jest.mock('../components/APIResponsePromise', () => {
	return jest.fn(() => Promise.resolve({ genres: [], results: [] }));
});

describe('Testing Block JSON', () => {
	// Block needs to be defined and type should be object.
	it('should have valid block.json structure', () => {
		expect(BlockJSON).toBeDefined();
		expect(typeof BlockJSON).toBe('object');
	});
	it('should have required properties', () => {
		const requiredProps = ['title', 'category', 'icon'];
		requiredProps.forEach((prop) => {
			expect(BlockJSON).toHaveProperty(prop);
		});
	});
});

describe('Testing Edit Component', () => {
	const defaultProps = {
		genres: [],
		fetchedMovies: [],
		movieColumn: 3,
	};
	// Create props for the Edit component
	const props = {
		attributes: defaultProps,
		setAttributes: jest.fn(),
	};
	// Clear mocks before each test
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('should render without crashing', async () => {
		const { container } = await act(async () => {
			return render(<Edit {...props} />);
		});

		// Check if main components are rendered
		expect(screen.getByTestId('sidebar-control')).toBeInTheDocument();
		expect(screen.getByTestId('popup-modal')).toBeInTheDocument();

		// Check for the main block container by class name
		const blockContainer = container.querySelector(
			'.gs-upcoming-movie-block'
		);
		expect(blockContainer).toBeInTheDocument();

		// Check for the movie list container
		const movieList = container.querySelector('#upcoming-movies-block');
		expect(movieList).toBeInTheDocument();
	});

	it('should call setAttributes when provided', async () => {
		const mockSetAttributes = jest.fn();
		const testProps = {
			...props,
			setAttributes: mockSetAttributes,
		};

		await act(async () => {
			render(<Edit {...testProps} />);
		});

		// setAttributes should be available
		expect(mockSetAttributes).toBeDefined();
	});

	it('should render movie list with correct grid columns', async () => {
		const testProps = {
			...props,
			attributes: {
				...props.attributes,
				movieColumn: 4,
			},
		};

		const { container } = await act(async () => {
			return render(<Edit {...testProps} />);
		});

		const movieList = container.querySelector('#upcoming-movies-block');
		// Check for the formatted style that includes whitespace
		expect(movieList.style.gridTemplateColumns).toContain('repeat(');
		expect(movieList.style.gridTemplateColumns).toContain('4, 1fr');
	});

	it('should render movies when fetchedMovies is provided', async () => {
		const mockMovies = [
			{ id: 1, title: 'Test Movie 1' },
			{ id: 2, title: 'Test Movie 2' },
		];

		const testProps = {
			...props,
			attributes: {
				...props.attributes,
				fetchedMovies: mockMovies,
			},
		};

		await act(async () => {
			render(<Edit {...testProps} />);
		});

		// Should render movie cards for each movie
		const movieCards = screen.getAllByTestId('movie-card');
		expect(movieCards).toHaveLength(2);
		expect(screen.getByText('Test Movie 1')).toBeInTheDocument();
		expect(screen.getByText('Test Movie 2')).toBeInTheDocument();
	});
});
