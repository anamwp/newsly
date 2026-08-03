/**
 * @jest-environment jsdom
 */

import { render, screen } from '@testing-library/react';
import React from 'react';
import save from './save';

describe('Post Lists Tab - Save', () => {
	test('renders the static frontend placeholder text', () => {
		render(React.createElement(save));
		expect(
			screen.getByText('single post block from frontend.'),
		).toBeInTheDocument();
	});

	test('output is unaffected by any props passed in (save has no attributes yet)', () => {
		const { container } = render(
			React.createElement(save, { attributes: { foo: 'bar' } }),
		);
		expect(container.textContent).toBe('single post block from frontend.');
	});
});
