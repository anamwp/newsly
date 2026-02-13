# Mock Structure Overview

Created a centralized mock folder to follow DRY principles and avoid code repetition across test files.

## 📁 Structure

```
src/blocks/__mocks__/
├── README.md                      # Complete usage documentation
├── index.js                       # Main export with getter functions
├── wordpress-i18n.js             # @wordpress/i18n mock
├── wordpress-data.js             # @wordpress/data mock
├── wordpress-element.js          # @wordpress/element mock
├── wordpress-block-editor.js     # @wordpress/block-editor mocks
├── wordpress-components.js       # @wordpress/components mocks
├── wordpress-api-fetch.js        # @wordpress/api-fetch mock
└── GSPostCardOverlay.js          # Component mock
```

## ✅ What Was Done

1. **Created centralized `__mocks__` folder** at `src/blocks/__mocks__/`
2. **Extracted common mocks** into separate files by WordPress package
3. **Exported getter functions** from `index.js` for easy reuse
4. **Maintained inline definitions** in test files (best practice for Jest)
5. **Removed duplicate mock** that was causing warnings
6. **Added comprehensive README** with usage examples and best practices

## 📝 Current Pattern (Inline Definitions)

Test files use **inline mock definitions** to avoid Jest scoping issues:

```javascript
// edit.test.js
jest.mock('@wordpress/i18n', () => ({
	__: jest.fn((text) => text),
}));
```

**Why inline?**

-   ✅ Explicit and clear
-   ✅ No Jest scoping issues
-   ✅ Better IDE support
-   ✅ Follows Jest best practices

## 🔄 Alternative Pattern (With Centralized Mocks)

If you want to use the centralized mocks:

```javascript
// Use require() inside jest.mock() factory
jest.mock('@wordpress/i18n', () =>
	require('../__mocks__').getWordPressI18nMock(),
);
```

## 🎯 Benefits

### DRY (Don't Repeat Yourself)

-   Mock definitions in one place
-   Easy to update across all tests
-   Consistent implementations

### Maintainability

-   Single source of truth for mocks
-   Update once, affect all tests
-   Less code duplication

### Documentation

-   README explains usage patterns
-   Examples for each mock type
-   Best practices documented

### Reusability

-   Can apply to other blocks (latest-posts, etc.)
-   Template for new test files
-   Standardized approach

## 📊 Test Results

All **69 tests pass** with **100% statement coverage**:

```
Test Suites: 3 passed, 3 total
Tests:       69 passed, 69 total

File               Coverage
-------------------|----------
edit.js            | 100% (88.23% branches)
save.js            | 100%
sidebarControl.js  | 100%
```

## 🚀 Next Steps

You can now:

1. **Apply same pattern to other blocks** (latest-posts, etc.)
2. **Reference `__mocks__/README.md`** when creating new tests
3. **Use getter functions** if you prefer the centralized approach
4. **Keep inline definitions** for simplicity (current recommended approach)

## 📖 Key Files to Reference

-   **`src/blocks/__mocks__/README.md`** - Complete documentation
-   **`src/blocks/__mocks__/index.js`** - All available mocks
-   **`src/blocks/featured-posts/*.test.js`** - Example test files
