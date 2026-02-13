# Shared Test Mocks

This folder contains centralized mock definitions for WordPress dependencies and custom components used across test files.

## Why Centralized Mocks?

-   **DRY Principle**: Avoid repeating the same mock definitions across multiple test files
-   **Consistency**: Ensure all tests use the same mock implementations
-   **Maintainability**: Update mocks in one place instead of multiple files
-   **Reusability**: Easily import and use mocks in any test file

## Usage Pattern

### Important: Jest Mock Scoping Rules

Jest `jest.mock()` factories **cannot reference out-of-scope variables**. Therefore, you need to:

1. **Inline the mock definition** directly in `jest.mock()`, OR
2. **Use `require()` inside the mock factory** to import the mock

### ✅ Correct Usage (with require)

```javascript
// In your test file
jest.mock('@wordpress/i18n', () =>
	require('../__mocks__').getWordPressI18nMock(),
);
```

### ✅ Also Correct (inline definition - current pattern)

```javascript
// In your test file
jest.mock('@wordpress/i18n', () => ({
	__: jest.fn((text) => text),
}));
```

### ❌ Incorrect Usage (will fail)

```javascript
// In your test file
import { getWordPressI18nMock } from '../__mocks__';

// This will fail with "out-of-scope variable" error
jest.mock('@wordpress/i18n', () => getWordPressI18nMock());
```

## Available Mocks

### WordPress Core Mocks

#### `getWordPressI18nMock()`

Mock for `@wordpress/i18n` package (internationalization).

```javascript
jest.mock('@wordpress/i18n', () =>
	require('../__mocks__').getWordPressI18nMock(),
);
```

#### `getWordPressDataMock()`

Mock for `@wordpress/data` package (data stores).

```javascript
jest.mock('@wordpress/data', () =>
	require('../__mocks__').getWordPressDataMock(),
);
```

#### `getWordPressElementMock()`

Mock for `@wordpress/element` package (React abstractions).

```javascript
jest.mock('@wordpress/element', () =>
	require('../__mocks__').getWordPressElementMock(),
);
```

#### `getWordPressBlockEditorMock()`

Mock for `@wordpress/block-editor` (editor version with useBlockProps).

```javascript
jest.mock('@wordpress/block-editor', () =>
	require('../__mocks__').getWordPressBlockEditorMock(),
);
```

#### `getWordPressBlockEditorSaveMock()`

Mock for `@wordpress/block-editor` (save version with useBlockProps.save).

```javascript
jest.mock('@wordpress/block-editor', () =>
	require('../__mocks__').getWordPressBlockEditorSaveMock(),
);
```

#### `getWordPressComponentsMock()`

Mock for `@wordpress/components` (full version for sidebar controls).

```javascript
jest.mock('@wordpress/components', () =>
	require('../__mocks__').getWordPressComponentsMock(),
);
```

#### `getWordPressComponentsEditMock()`

Mock for `@wordpress/components` (simplified version for edit tests).

```javascript
jest.mock('@wordpress/components', () =>
	require('../__mocks__').getWordPressComponentsEditMock(),
);
```

#### `getWordPressApiFetchMock()`

Mock for `@wordpress/api-fetch` (API requests).

```javascript
jest.mock('@wordpress/api-fetch', () => ({
	__esModule: true,
	default: require('../__mocks__').getWordPressApiFetchMock(),
}));
```

### Component Mocks

#### `getMockGSPostCardOverlay()`

Mock for the GSPostCardOverlay component.

```javascript
jest.mock('../components/GSPostCardOverlay', () =>
	require('../__mocks__').getMockGSPostCardOverlay(),
);
```

## Example Test File

```javascript
/**
 * @jest-environment jsdom
 */

import { render, screen } from '@testing-library/react';
import React from 'react';
import MyComponent from './MyComponent';

// Option 1: Use require() in mock factory (if you want to use centralized mocks)
jest.mock('@wordpress/i18n', () =>
	require('../__mocks__').getWordPressI18nMock(),
);
jest.mock('@wordpress/block-editor', () =>
	require('../__mocks__').getWordPressBlockEditorMock(),
);

// Option 2: Inline definition (current pattern - simpler and more explicit)
jest.mock('@wordpress/i18n', () => ({
	__: jest.fn((text) => text),
}));

jest.mock('@wordpress/block-editor', () => ({
	useBlockProps: jest.fn(() => ({
		className: 'my-class',
	})),
}));

describe('MyComponent', () => {
	test('renders correctly', () => {
		render(<MyComponent />);
		expect(screen.getByText('Hello')).toBeInTheDocument();
	});
});
```

## Current Implementation

Our test files currently use **inline definitions** for clarity and to avoid the require() pattern. The centralized mocks in `__mocks__/index.js` serve as:

1. **Documentation**: Reference implementations for consistent mocking
2. **Templates**: Copy-paste templates for new test files
3. **Future Use**: Ready to use with require() pattern if needed

## Benefits of Current Approach

-   ✅ **Explicit**: Each test file clearly shows what it's mocking
-   ✅ **No scoping issues**: Inline definitions avoid Jest scoping rules
-   ✅ **IDE-friendly**: Better autocomplete and type checking
-   ✅ **Consistency**: Copy from centralized reference for consistency

## File Structure

```
src/blocks/__mocks__/
├── README.md                      # This file
├── index.js                       # Centralized mock exports
├── wordpress-i18n.js             # Individual mock files (deprecated)
├── wordpress-data.js
├── wordpress-element.js
├── wordpress-block-editor.js
├── wordpress-components.js
├── wordpress-api-fetch.js
└── GSPostCardOverlay.js
```

**Note**: The individual mock files (wordpress-\*.js) are kept for backward compatibility but the main export is now through `index.js` getter functions.
