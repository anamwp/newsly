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
test('null', function () {
  var n = null;
  expect(n).toBeNull();
  expect(n).toBeDefined();
  expect(n).not.toBeUndefined();
  expect(n).not.toBeTruthy();
  expect(n).toBeFalsy();
});
test('zero', function () {
  var z = 0;
  expect(z).not.toBeNull();
  expect(z).toBeDefined();
  expect(z).not.toBeUndefined();
  expect(z).not.toBeTruthy();
  expect(z).toBeFalsy();
});
var shoppingList = ['diapers', 'kleenex', 'trash bags', 'paper towels', 'milk'];
test('the shopping list has milk on it', function () {
  expect(shoppingList).toContain('milk');
  expect(new Set(shoppingList)).toContain('milk');
});
function compileAndroidCode() {
  throw new Error('you are using the wrong JDK!');
}
test('compiling android goes as expected', function () {
  expect(function () {
    return compileAndroidCode();
  }).toThrow();
  expect(function () {
    return compileAndroidCode();
  }).toThrow(Error);

  // You can also use a string that must be contained in the error message or a regexp
  expect(function () {
    return compileAndroidCode();
  }).toThrow('you are using the wrong JDK');
  expect(function () {
    return compileAndroidCode();
  }).toThrow(/JDK/);

  // Or you can match an exact error message using a regexp like below
  // expect(() => compileAndroidCode()).toThrow(/^you are using the wrong JDK$/); // Test fails
  expect(function () {
    return compileAndroidCode();
  }).toThrow(/^you are using the wrong JDK!$/); // Test pass
});