import { render, screen } from '@testing-library/react';
import React from 'react';
import { jsx as _jsx } from "react/jsx-runtime";
var ExampleComponent = function ExampleComponent() {
  return /*#__PURE__*/_jsx("h1", {
    children: "Hello, Jest!"
  });
};
test('renders ExampleComponent', function () {
  render(/*#__PURE__*/_jsx(ExampleComponent, {}));
  expect(screen.getByText('Hello, Jest!')).toBeInTheDocument();
});