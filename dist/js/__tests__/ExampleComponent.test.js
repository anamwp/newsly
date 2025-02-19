import { render, screen } from '@testing-library/react';
import React from 'react';
import { TestComponents, Sub } from '../../../src/blocks/components/TestComponents';
import { jsx as _jsx } from "react/jsx-runtime";
var ExampleComponent = function ExampleComponent() {
  return /*#__PURE__*/_jsx("h1", {
    children: "Hello, Jest!"
  });
};
var Add = function Add(a, b) {
  return a + b;
};
test('renders ExampleComponent', function () {
  render(/*#__PURE__*/_jsx(ExampleComponent, {}));
  expect(screen.getByText('Hello, Jest!')).toBeInTheDocument();
});
test('Add function', function () {
  render(/*#__PURE__*/_jsx(Add, {}));
  expect(Add(1, 2)).toBe(3);
});
test('TestComponents', function () {
  render(/*#__PURE__*/_jsx(TestComponents, {}));
  expect(screen.getByText('TestComponents')).toBeInTheDocument();
});
test('Sub function', function () {
  render(/*#__PURE__*/_jsx(Sub, {}));
  expect(Sub(2, 1)).toBe(1);
});