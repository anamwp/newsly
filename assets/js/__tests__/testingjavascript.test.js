import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { TestComponents } from '../../../src/blocks/components/TestComponents';

describe('TestComponents', () => {
	it('renders correctly', () => {
		const { container } = render(<TestComponents />);
		// container;
		// console.log(container.innerHTML);
		expect(container).toMatchSnapshot();
	});
});
