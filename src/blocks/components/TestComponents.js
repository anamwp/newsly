import React from 'react';

export function TestComponents() {
	return (
		<div
			style={{
				color: 'red',
				backgroundColor: 'yellow',
				fontWeight: 'bold',
				fontSize: '20px',
			}}
		>
			TestComponents is updated again updated and again
		</div>
	);
}

export function TestButtonClick() {
	return (
		<button
			style={{
				color: 'white',
				backgroundColor: 'blue',
				fontWeight: 'bold',
				fontSize: '16px',
			}}
			onClick={() => console.log('Button clicked!')}
		>
			TestButtonClick
		</button>
	);
}

export function Sub(a, b) {
	return a - b;
}
