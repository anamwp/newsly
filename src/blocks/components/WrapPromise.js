// utils/wrapPromise.js
export function wrapPromise(promise) {
	let status = 'pending';
	let result;
	let suspender = promise.then(
		(res) => {
			status = 'success';
			result = res;
		},
		(err) => {
			status = 'error';
			result = err;
		}
	);

	return {
		read() {
			if (status === 'pending') throw suspender;
			if (status === 'error') throw result;
			return result;
		},
	};
}
