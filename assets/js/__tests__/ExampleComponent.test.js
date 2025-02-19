import { render, screen } from '@testing-library/react';
import React from 'react';

const ExampleComponent = () => <h1>Hello, Jest!</h1>;

test('renders ExampleComponent', () => {
	render(<ExampleComponent />);
	expect(screen.getByText('Hello, Jest!')).toBeInTheDocument();
});
