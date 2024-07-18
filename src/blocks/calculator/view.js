console.log('hello wordld new');
/**
 * WordPress dependencies
 */
import {
	store,
	getContext,
	useState,
	getElement,
	useEffect,
} from '@wordpress/interactivity';

console.log('hello from view js');

store('burger', {
	state: {
		get countOrder() {
			const context = getContext();
			context.burgerTotalPrice =
				context.burgerCount * context.price > 0
					? context.burgerCount * context.price
					: 0;
			return context.burgerTotalPrice;
		},
		get countDonationOrder() {
			const context = getContext();
			context.burgerDonationTotalPrice =
				context.burgerDonationCount * context.price > 0
					? context.burgerDonationCount * context.price
					: 0;
			return context.burgerDonationTotalPrice;
		},
		get countTotalPrice() {
			const context = getContext();
			// console.log(state.countOrder);
			return context.totalPrice + state.countOrder + countDonationOrder;
		},
	},
	actions: {
		increaseCount: () => {
			const context = getContext();
			context.burgerCount++;
			context.hideDecreaseOrder = false;
			context.burgerTotalPrice = context.burgerCount * context.price;
			context.totalPrice =
				context.burgerTotalPrice + context.burgerDonationTotalPrice;
		},
		decreaseCount: () => {
			const context = getContext();
			context.burgerCount--;
			context.hideDecreaseOrder = context.burgerCount == 0 ? true : false;
			context.burgerTotalPrice =
				context.burgerCount * context.price < 0
					? 0
					: context.burgerCount * context.price;
			context.totalPrice =
				context.burgerTotalPrice + context.burgerDonationTotalPrice;
		},
		increaseDonationCount: () => {
			const context = getContext();
			context.burgerDonationCount++;
			context.hideDecreaseDonationOrder = false;
			context.burgerDonationTotalPrice =
				context.burgerDonationCount * context.price;
			context.totalPrice =
				context.burgerTotalPrice + context.burgerDonationTotalPrice;
		},
		decreaseDonationCount: () => {
			const context = getContext();
			context.burgerDonationCount--;
			context.hideDecreaseDonationOrder =
				context.burgerDonationCount == 0 ? true : false;
			context.burgerDonationTotalPrice =
				context.burgerDonationCount * context.price < 0
					? 0
					: context.burgerDonationCount * context.price;
			context.totalPrice =
				context.burgerTotalPrice + context.burgerDonationTotalPrice;
		},
	},
	callbacks: {
		countTotalPrice: () => {
			const context = getContext();
			// console.log('total price', state.countTotalPrice);
			context.totalPrice = state.countOrder + state.countDonationOrder;
		},
	},
});

store('donation-calculator', {
	state: {
		get display() {
			const context = getContext();
			return context.isOpen ? 'block' : 'none';
		},
		get donation() {
			const context = getContext();
			return `$${context.contribution}`;
		},
		get trees() {
			const context = getContext();
			return Math.floor(context.contribution / context.price);
		},
		get show() {
			const context = getContext();
			return context.contribution > 0;
		},
		get sampleText() {
			return 'helloasdfasdfasdfworld';
		},
	},
	actions: {
		toggle: () => {
			const context = getContext();
			context.isOpen = !context.isOpen;
		},
		calculate: (e) => {
			const context = getContext();
			context.contribution = Number(e.target.value);
		},
		logID: () => {
			const { post } = getContext();
			console.log('post', post);
			console.log(post.id);
		},
		toggleMenu: () => {
			const context = getContext();
			console.log(context);
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

const useInView = (ref) => {
	const [inView, setInView] = useState(false);
	useEffect(() => {
		const observer = new IntersectionObserver(([entry]) => {
			// console.log('entry', entry);
			setInView(entry.isIntersecting);
		});
		if (ref) observer.observe(ref);
		return () => ref && observer.unobserve(ref);
	}, []);
	return inView;
};

store('myPlugin', {
	state: {},
	actions: {
		loggId: () => {
			const { post } = getContext();
			console.log('post', post);
			console.log(post.id);
		},
		toggleMenu: () => {
			const context = getContext();
			context.isMenuOpen = !context.isMenuOpen;
		},
		toggleSelection: () => {
			const context = getContext();
			context.isSelected = !context.isSelected;
		},
		toogleContextColor: () => {
			const context = getContext();
			context.color = context.color === 'red' ? 'blue' : 'red';
		},
		toggleContextText: () => {
			const context = getContext();
			context.text = context.text === 'Text1' ? 'Text2' : 'Text1';
		},
		increaseCounter: () => {
			const context = getContext();
			context.counter++;
		},
		decreaseCounter: () => {
			const context = getContext();
			context.counter--;
		},
	},
	callbacks: {
		logWidth() {
			const context = getContext();
			context.width = window.innerWidth + 'px';
			// console.log('window width: ', window.innerWidth);
		},
		logKeyDown(event) {
			const context = getContext();
			context.keydown = 'key Pressed - ' + event.key;
			// console.log('key pressed: ', event.key);
		},
		logCounter: () => {
			const context = getContext();
			// console.log('counter', context.counter);
		},
		logTimeInit: () => {
			// console.log('Init at ' + new Date());
		},
		focusFirstElement: () => {
			const ref = document.getElementById('wp-init-form');
			// console.log(ref.querySelector('input:first-child'));
			// ref.querySelector('input:first-child').focus();
		},
		logInView: () => {
			const observeElement = document.getElementById('observe-element');
			// const { ref } = getElement();
			// console.log('ref', ref);
			const isInView = useInView(observeElement);
			// console.log('isInView', isInView);
			useEffect(() => {
				if (isInView) {
					// console.log('Element is in view');
				} else {
					// console.log('Element is not in view');
				}
			});
		},
	},
});
