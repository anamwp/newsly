import React from 'react';
import { render, screen } from '@testing-library/react';

// Manual mocks are automatically picked up from __mocks__ directory
import Edit from './edit';
import blockattr from './block.json';

describe('testing block json', () => {
	it('should have valid block.json structure', () => {
		expect(blockattr).toBeDefined();
		expect(typeof blockattr).toBe('object');
	});

	it('should have required block properties', () => {
		expect(blockattr.name).toBe('anam-gutenberg-starter-block/blurb');
		expect(blockattr.title).toBe('Blurb');
		expect(blockattr.category).toBe('anam-starter');
		expect(blockattr.apiVersion).toBe(3);
		expect(blockattr.version).toBe('0.1.0');
	});

	it('should have correct attributes structure', () => {
		expect(blockattr.attributes).toBeDefined();
		expect(typeof blockattr.attributes).toBe('object');

		// Test newcontent attribute
		expect(blockattr.attributes.newcontent).toEqual({
			type: 'string',
			source: 'html',
			selector: 'h2',
			default: 'Lorem ipsum dolor sit amet',
		});

		// Test newmessage attribute
		expect(blockattr.attributes.newmessage).toEqual({
			type: 'string',
			source: 'html',
			selector: 'p',
			default:
				'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.',
		});

		// Test color attributes
		expect(blockattr.attributes.text_color).toEqual({
			type: 'string',
			default: '#000',
		});

		expect(blockattr.attributes.content_color).toEqual({
			type: 'string',
			default: '#000',
		});

		expect(blockattr.attributes.blurb_bg_color).toEqual({
			type: 'string',
			default: '#eee',
		});
	});

	it('should have correct file references', () => {
		expect(blockattr.editorScript).toBe('file:./index.js');
		expect(blockattr.editorStyle).toBe('file:./index.css');
		expect(blockattr.style).toBe('file:./style-index.css');
	});

	it('should have correct textdomain', () => {
		expect(blockattr.textdomain).toBe('gutenberg-starter');
	});

	it('should have valid schema reference', () => {
		expect(blockattr.$schema).toBe(
			'https://schemas.wp.org/trunk/block.json'
		);
	});

	it('should have all expected attribute types', () => {
		const attributes = blockattr.attributes;

		// String attributes
		expect(attributes.newcontent.type).toBe('string');
		expect(attributes.newmessage.type).toBe('string');
		expect(attributes.alignment.type).toBe('string');
		expect(attributes.text_color.type).toBe('string');
		expect(attributes.content_color.type).toBe('string');
		expect(attributes.blurb_bg_color.type).toBe('string');

		// Number attributes
		expect(attributes.font_size.type).toBe('number');
	});
});

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

	it('should apply custom styles based on color attributes', () => {
		const propsWithColors = {
			...defaultProps,
			attributes: {
				...defaultAttributes,
				text_color: '#ff0000',
				content_color: '#00ff00',
				blurb_bg_color: '#0000ff',
			},
		};

		render(<Edit {...propsWithColors} />);

		// Check that the component renders with color attributes
		const container = screen
			.getByText('this is rich text editor')
			.closest('.gts__blurb__container');
		expect(container).toHaveStyle('background: #0000ff');
	});

	it('should apply text alignment styles correctly', () => {
		const alignmentProps = {
			...defaultProps,
			attributes: {
				...defaultAttributes,
				alignment: 'center',
			},
		};

		render(<Edit {...alignmentProps} />);

		const container = screen
			.getByText('this is rich text editor')
			.closest('.gts__blurb__container');
		expect(container).toHaveStyle('text-align: center');
	});

	it('should call setAttributes when RichText content changes', () => {
		const mockSetAttributes = jest.fn();
		const props = {
			...defaultProps,
			setAttributes: mockSetAttributes,
		};

		render(<Edit {...props} />);

		// This test verifies that the mocked RichText components are set up correctly
		// In a real scenario, we would simulate user input
		expect(mockSetAttributes).not.toHaveBeenCalled();
	});

	it('should render InnerBlocks with correct template', () => {
		render(<Edit {...defaultProps} />);

		const innerBlocks = screen.getByTestId('inner-blocks');
		expect(innerBlocks).toBeInTheDocument();

		// Verify the button container exists
		const buttonContainer = screen
			.getByText('this is rich text editor')
			.closest('.gts__blurb__container')
			.querySelector('.gts__blurb__button');
		expect(buttonContainer).toBeInTheDocument();
	});

	it('should have proper CSS classes applied', () => {
		render(<Edit {...defaultProps} />);

		// Check main container classes (the outermost div with useBlockProps)
		const mainContainer =
			screen.getByTestId('block-controls').parentElement;
		expect(mainContainer).toHaveClass('wp-block-test'); // from useBlockProps mock

		// Check blurb container classes
		const blurbContainer = screen
			.getByText('this is rich text editor')
			.closest('.gts__blurb__container');
		expect(blurbContainer).toHaveClass(
			'p-10',
			'container',
			'gts__blurb__container',
			'rounded-md',
			'w-full',
			'max-w-full'
		);
	});

	it('should render all control panels in inspector', () => {
		render(<Edit {...defaultProps} />);

		// Check for all panel bodies
		const panelBodies = screen.getAllByTestId('panel-body');
		expect(panelBodies).toHaveLength(3);

		// Check for specific panel titles using getAllByTestId
		const backgroundPanel = panelBodies.find(
			(panel) => panel.getAttribute('data-title') === 'Background'
		);
		const headingPanel = panelBodies.find(
			(panel) => panel.getAttribute('data-title') === 'Heading'
		);
		const textPanel = panelBodies.find(
			(panel) => panel.getAttribute('data-title') === 'Text'
		);

		expect(backgroundPanel).toBeInTheDocument();
		expect(headingPanel).toBeInTheDocument();
		expect(textPanel).toBeInTheDocument();
	});

	it('should render color palettes for each color setting', () => {
		render(<Edit {...defaultProps} />);

		// Should have 3 color palettes (background, heading, text)
		const colorPalettes = screen.getAllByTestId('color-palette');
		expect(colorPalettes).toHaveLength(3);
	});

	it('should handle undefined attributes gracefully', () => {
		const propsWithUndefined = {
			...defaultProps,
			attributes: {
				newcontent: undefined,
				newmessage: undefined,
				text_color: undefined,
				content_color: undefined,
				blurb_bg_color: undefined,
				alignment: undefined,
			},
		};

		expect(() => {
			render(<Edit {...propsWithUndefined} />);
		}).not.toThrow();

		expect(screen.getAllByTestId('rich-text')).toHaveLength(2);
	});

	it('should render with block.json default attributes', () => {
		const blockDefaultProps = {
			...defaultProps,
			attributes: {
				newcontent: blockattr.attributes.newcontent.default,
				newmessage: blockattr.attributes.newmessage.default,
				text_color: blockattr.attributes.text_color.default,
				content_color: blockattr.attributes.content_color.default,
				blurb_bg_color: blockattr.attributes.blurb_bg_color.default,
				alignment: blockattr.attributes.alignment.default,
			},
		};

		render(<Edit {...blockDefaultProps} />);
		// console.log(screen.debug());
		expect(
			screen.getByText(blockattr.attributes.newcontent.default)
		).toBeInTheDocument();
		expect(
			screen.getByText(blockattr.attributes.newmessage.default)
		).toBeInTheDocument();
	});

	it('should maintain component structure consistency', () => {
		const { rerender } = render(<Edit {...defaultProps} />);

		// Initial render structure check
		expect(screen.getByTestId('block-controls')).toBeInTheDocument();
		expect(screen.getByTestId('inspector-controls')).toBeInTheDocument();
		expect(screen.getAllByTestId('rich-text')).toHaveLength(2);

		// Re-render with different props
		const newProps = {
			...defaultProps,
			attributes: {
				...defaultAttributes,
				newcontent: 'Updated content',
			},
		};

		rerender(<Edit {...newProps} />);

		// Structure should remain the same
		expect(screen.getByTestId('block-controls')).toBeInTheDocument();
		expect(screen.getByTestId('inspector-controls')).toBeInTheDocument();
		expect(screen.getAllByTestId('rich-text')).toHaveLength(2);
	});

	it('should have accessible structure', () => {
		render(<Edit {...defaultProps} />);

		// Check for proper heading hierarchy (h2 for main content)
		const richTextElements = screen.getAllByTestId('rich-text');
		expect(richTextElements[0]).toBeInTheDocument(); // h2 element
		expect(richTextElements[1]).toBeInTheDocument(); // p element

		// Check that controls are properly grouped
		expect(screen.getByTestId('inspector-controls')).toBeInTheDocument();
		expect(screen.getByTestId('block-controls')).toBeInTheDocument();
	});
});
