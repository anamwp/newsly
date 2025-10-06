// Mock for @wordpress/data
const useSelect = jest.fn((selector) => {
	// Return mock data based on the selector
	if (typeof selector === 'function') {
		return selector({
			'core/editor': {
				getCurrentPost: () => ({ id: 1, title: 'Test Post' }),
				getEditedPostAttribute: () => 'test',
			},
			'core': {
				getEntityRecords: () => [],
				getEntityRecord: () => ({}),
			},
		});
	}
	return {};
});

const withSelect = jest.fn((selector) => (Component) => Component);

const select = jest.fn((store) => ({
	getCurrentPost: () => ({ id: 1, title: 'Test Post' }),
	getEditedPostAttribute: () => 'test',
	getEntityRecords: () => [],
	getEntityRecord: () => ({}),
}));

const dispatch = jest.fn((store) => ({
	editPost: jest.fn(),
	savePost: jest.fn(),
}));

const useDispatch = jest.fn(() => dispatch);

module.exports = {
	useSelect,
	withSelect,
	select,
	dispatch,
	useDispatch,
	withDispatch: jest.fn((selector) => (Component) => Component),
	registerStore: jest.fn(),
	createReduxStore: jest.fn(),
	combineReducers: jest.fn(),
};
