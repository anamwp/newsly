import { render, screen } from '@testing-library/react';
import React from 'react';
import { TestComponents, Sub } from '../../../src/blocks/components/TestComponents';

// ===================================================
// const ExampleComponent = () => <h1>Hello, Jest!</h1>;

// test('renders ExampleComponent', () => {
// 	render(<ExampleComponent />);
// 	expect(screen.getByText('Hello, Jest!')).toBeInTheDocument();
// });

// ===================================================
// const Add = (a, b) => {
// 	return a + b;
// };
// test('Add function', () => {
// 	render(<Add />);
// 	expect(Add(1, 2)).toBe(3);
// });

// ===================================================
// test('TestComponents', () => {
// 	render(<TestComponents />);
// 	expect(screen.getByText('TestComponents')).toBeInTheDocument();
// });

// test('Sub function', () => {
// 	render(<Sub />);
// 	expect(Sub(2, 1)).toBe(1);
// });

// ===================================================
// test('null', () => {
// 	const n = null;
// 	expect(n).toBeNull();
// 	expect(n).toBeDefined();
// 	expect(n).not.toBeUndefined();
// 	expect(n).not.toBeTruthy();
// 	expect(n).toBeFalsy();
// });

// // test('zero', () => {
// // 	const z = 0;
// // 	expect(z).not.toBeNull();
// // 	expect(z).toBeDefined();
// // 	expect(z).not.toBeUndefined();
// // 	expect(z).not.toBeTruthy();
// // 	expect(z).toBeFalsy();
// // });
// ===================================================
// const shoppingList = [
// 	'diapers',
// 	'kleenex',
// 	'trash bags',
// 	'paper towels',
// 	'milk',
// ];

// test('the shopping list has milk on it', () => {
// 	expect(shoppingList).toContain('milk');
// 	expect(new Set(shoppingList)).toContain('milk');
// });

// ===================================================
// function compileAndroidCode() {
// 	throw new Error('you are using the wrong JDK!');
// }

// test('compiling android goes as expected', () => {
// 	expect(() => compileAndroidCode()).toThrow();
// 	expect(() => compileAndroidCode()).toThrow(Error);

// 	// You can also use a string that must be contained in the error message or a regexp
// 	expect(() => compileAndroidCode()).toThrow('you are using the wrong JDK');
// 	expect(() => compileAndroidCode()).toThrow(/JDK/);

// 	// Or you can match an exact error message using a regexp like below
// 	// expect(() => compileAndroidCode()).toThrow(/^you are using the wrong JDK$/); // Test fails
// 	expect(() => compileAndroidCode()).toThrow(
// 		/^you are using the wrong JDK!$/
// 	); // Test pass
// });

// ===================================================
var userService = {
  getUser: function getUser(id) {
    return {
      id: id,
      name: 'john'
    };
  }
};
var getUserSpy = jest.spyOn(userService, 'getUser').mockReturnValue({
  id: 1,
  name: 'Mocked User'
});
var user = userService.getUser(1);
test('userService getUser', function () {
  expect(getUserSpy).toHaveBeenCalledWith(1);
  expect(user).toEqual({
    id: 1,
    name: 'Mocked User'
  });
});