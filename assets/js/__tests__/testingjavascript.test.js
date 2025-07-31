import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import {
	TestComponents,
	TestButtonClick,
} from '../../../src/blocks/components/TestComponents';

describe('TestComponents', () => {
	it('renders correctly', () => {
		const { container } = render(<TestComponents />);
		// container;
		// console.log(container.innerHTML);
		expect(container).toMatchSnapshot();
	});
});

describe('TestButtonClick', () => {
	it('renders button with correct text', () => {
		const handleClick = jest.fn();
		render(<TestButtonClick onClick={handleClick} />);
		const button = screen.getByText('TestButtonClick');
		expect(button.textContent).toBe('TestButtonClick');
		// fireEvent.click(button);
		// expect(handleClick).toHaveBeenCalledTimes(1);
	});
	it('check the console text', () => {
		const consoleSpy = jest.spyOn(console, 'log');
		render(<TestButtonClick />);
		const button = screen.getByText('TestButtonClick');
		fireEvent.click(button);
		expect(consoleSpy).toHaveBeenCalledWith('Button clicked!');
		consoleSpy.mockRestore();
	});
});
