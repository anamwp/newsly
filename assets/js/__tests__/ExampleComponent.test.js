import { render, screen } from '@testing-library/react';
import React from 'react';
import {
	TestComponents,
	Sub,
} from '../../../src/blocks/components/TestComponents';

const ExampleComponent = () => <h1>Hello, Jest!</h1>;

const Add = (a, b) => {
	return a + b;
};

test('renders ExampleComponent', () => {
	render(<ExampleComponent />);
	expect(screen.getByText('Hello, Jest!')).toBeInTheDocument();
});

test('Add function', () => {
	render(<Add />);
	expect(Add(1, 2)).toBe(3);
});

test('TestComponents', () => {
	render(<TestComponents />);
	expect(screen.getByText('TestComponents')).toBeInTheDocument();
});

test('Sub function', () => {
	render(<Sub />);
	expect(Sub(2, 1)).toBe(1);
});
