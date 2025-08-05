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
});
