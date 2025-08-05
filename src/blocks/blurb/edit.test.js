import React from 'react';
import { render, screen } from '@testing-library/react';

// Manual mocks are automatically picked up from __mocks__ directory
import Edit from './edit';

describe('Blurb Block Edit Component', () => {
	const defaultAttributes = {
		newcontent: '',
		newmessage: '',
		text_color: '',
		content_color: '',
		blurb_bg_color: '',
		alignment: 'left',
	};

	const defaultProps = {
		attributes: defaultAttributes,
		setAttributes: jest.fn(),
	};

	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('renders the block with default attributes', () => {
		render(<Edit {...defaultProps} />);
		// console what render
		// console.log(screen.debug());
		// Check that the component renders without crashing
		expect(screen.getAllByTestId('rich-text')).toHaveLength(2);
		expect(screen.getByTestId('inspector-controls')).toBeInTheDocument();
		expect(screen.getByTestId('block-controls')).toBeInTheDocument();
		expect(screen.getByTestId('inner-blocks')).toBeInTheDocument();
	});

	it('renders with content when attributes are provided', () => {
		const propsWithContent = {
			...defaultProps,
			attributes: {
				...defaultAttributes,
				newcontent: 'Test Content',
				newmessage: 'Test Message',
			},
		};

		render(<Edit {...propsWithContent} />);
		// console.log(screen.debug());
		// Since RichText is mocked, we can't test the actual content display
		// but we can verify the component renders
		expect(screen.getAllByTestId('rich-text')).toHaveLength(2);
		expect(screen.getByText('Test Content')).toBeInTheDocument();
		expect(screen.getByText('Test Message')).toBeInTheDocument();
	});
	//getAllByPlaceholderText
	it('test with heading', () => {
		render(<Edit {...defaultProps} {...defaultAttributes} />);
		expect(
			screen.getByText('this is rich text editor')
		).toBeInTheDocument();
	});
	it('test with paragraph', () => {
		render(<Edit {...defaultProps} {...defaultAttributes} />);
		expect(screen.getByText('hello text control')).toBeInTheDocument();
	});
});
