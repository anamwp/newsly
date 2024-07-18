console.log('hello asdfads');
import { store, getContext } from '@wordpress/interactivity';
console.log('store', store);
console.log('getContext', getContext);
store('anam-gutenberg-starter-block/postlisttab', {
	actions: {
		toggle: () => {
			const context = getContext();
			context.isOpen = !context.isOpen;
		},
	},
	callbacks: {
		logIsOpen: () => {
			const { isOpen } = getContext();
			// Log the value of `isOpen` each time it changes.
			console.log(`Is open: ${isOpen}`);
		},
	},
});
