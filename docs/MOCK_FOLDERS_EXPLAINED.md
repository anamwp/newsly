# Jest Mock Folders - Best Practices Guide

## 📁 Two Different Mock Folders Explained

Your plugin has **TWO `__mocks__` folders** and **BOTH are needed**. They serve different purposes:

### 1. Root `__mocks__/` (Required ✅)

**Location**: `/newsly/__mocks__/`

**Purpose**: **Automatic Module Mocking** - Jest's standard feature

-   Jest **automatically** uses this folder for mocking npm packages and scoped packages
-   When you mock `@wordpress/block-editor`, Jest looks for `__mocks__/@wordpress/block-editor.js`
-   This is a **Jest convention** - the folder MUST be at the project root (where package.json is)

**What's inside**:

```
__mocks__/
├── @wordpress/          # Mocks for @wordpress/* packages
│   ├── api-fetch.js
│   ├── block-editor.js
│   ├── components.js
│   ├── data.js
│   ├── element.js
│   ├── i18n.js
│   └── icons.js
├── classnames.js        # Mock for classnames npm package
└── sidebarControl.js    # Mock for local component (OUTDATED)
```

### 2. `src/blocks/__mocks__/` (Best Practice ✅)

**Location**: `/newsly/src/blocks/__mocks__/`

**Purpose**: **Reusable Mock Helpers** - Your custom organization

-   Provides reusable getter functions for mock definitions
-   Serves as a **reference template** for test files
-   Better organized by WordPress package
-   Includes comprehensive documentation

**What's inside**:

```
src/blocks/__mocks__/
├── README.md               # Complete usage guide
├── STRUCTURE.md            # Overview document
├── index.js                # Main exports
├── wordpress-*.js          # Individual mock files
└── GSPostCardOverlay.js    # Component mock
```

## 🎯 How They Work Together

### Jest's Resolution Order:

1. **Inline `jest.mock()` definitions** (highest priority - what we're using)
2. **Root `__mocks__/` folder** (automatic resolution)
3. **Actual npm packages** (fallback)

### Current Pattern:

```javascript
// In test files - Inline definition (overrides root __mocks__)
jest.mock('@wordpress/i18n', () => ({
	__: jest.fn((text) => text),
}));

// Behind the scenes - Jest ALSO checks root __mocks__/@wordpress/i18n.js
// But our inline definition takes precedence
```

## ⚠️ Why Root `__mocks__/` is Required

**Test Results**:

-   ✅ **With root `__mocks__/`**: All tests pass
-   ❌ **Without root `__mocks__/`**: Tests fail with "Cannot find module '@wordpress/block-editor'"

Jest needs the root `__mocks__/@wordpress/` structure to resolve scoped packages, even if you override them with inline definitions.

## 🔄 What Needs to be Cleaned Up

### ❌ **REMOVE** from Root `__mocks__/`:

```
__mocks__/sidebarControl.js  ← OUTDATED - Not used anymore
```

This file is **outdated** because:

-   The actual `sidebarControl.js` is now in `src/blocks/featured-posts/`
-   Tests mock it inline with `jest.mock('./sidebarControl', () => {...})`
-   It's not in the right location for Jest to auto-mock it

### ✅ **KEEP** in Root `__mocks__/`:

```
__mocks__/@wordpress/*       ← Required for Jest resolution
__mocks__/classnames.js      ← May be used by other tests
```

## 📋 Recommended Actions

### 1. Delete Outdated Mock ✅

```bash
rm __mocks__/sidebarControl.js
```

### 2. Keep Both Mock Folders ✅

-   **Root `__mocks__/`** - Required for Jest automatic mocking
-   **`src/blocks/__mocks__/`** - Best practice for organization

### 3. Current Best Practice Pattern ✅

Your tests are already following the best pattern:

```javascript
/**
 * Inline mock definitions in test files
 * - More explicit and clear
 * - Overrides automatic mocking
 * - Better IDE support
 */
jest.mock('@wordpress/i18n', () => ({
	__: jest.fn((text) => text),
}));
```

## 🌟 Best Practices Summary

### ✅ DO:

1. **Keep root `__mocks__/`** - Required for Jest to work
2. **Keep `src/blocks/__mocks__/`** - Good organization and documentation
3. **Use inline mock definitions** in test files (current approach)
4. **Remove unused mocks** (like sidebarControl.js)
5. **Document mock purpose** with README files

### ❌ DON'T:

1. **Delete root `__mocks__/`** - Tests will break
2. **Mix manual mocks with automatic mocks** without understanding precedence
3. **Create mocks in random locations** - Follow Jest conventions
4. **Leave outdated mocks** - Creates confusion

## 📖 Further Reading

### Jest Manual Mocks Documentation:

-   Mocks in `__mocks__/` subfolder next to modules: Manual mocks for local modules
-   Mocks in root `__mocks__/`: Manual mocks for node_modules
-   Scoped packages: `__mocks__/@scope/package.js`

### Your Setup:

-   ✅ Follows Jest conventions
-   ✅ Well-documented with README
-   ✅ Clean test files with inline definitions
-   ⚠️ Has one outdated file to remove

## 🎓 Conclusion

**Both folders are needed**, but they serve different purposes:

1. **Root `__mocks__/`** = Jest's automatic mocking system (required)
2. **`src/blocks/__mocks__/`** = Your organizational structure (best practice)

Just delete the outdated `__mocks__/sidebarControl.js` file and you'll have a perfectly clean setup! 🚀
