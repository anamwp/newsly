import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { TestComponents, TestButtonClick } from '../../../src/blocks/components/TestComponents';
import { jsx as _jsx } from "react/jsx-runtime";
describe('TestComponents', function () {
  it('renders correctly', function () {
    var _render = render(/*#__PURE__*/_jsx(TestComponents, {})),
      container = _render.container;
    // container;
    // console.log(container.innerHTML);
    expect(container).toMatchSnapshot();
  });
});
describe('TestButtonClick', function () {
  it('renders button with correct text', function () {
    var handleClick = jest.fn();
    render(/*#__PURE__*/_jsx(TestButtonClick, {
      onClick: handleClick
    }));
    var button = screen.getByText('TestButtonClick');
    expect(button.textContent).toBe('TestButtonClick');
    // fireEvent.click(button);
    // expect(handleClick).toHaveBeenCalledTimes(1);
  });
  it('check the console text', function () {
    var consoleSpy = jest.spyOn(console, 'log');
    render(/*#__PURE__*/_jsx(TestButtonClick, {}));
    var button = screen.getByText('TestButtonClick');
    fireEvent.click(button);
    expect(consoleSpy).toHaveBeenCalledWith('Button clicked!');
    consoleSpy.mockRestore();
  });
});