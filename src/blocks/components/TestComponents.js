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

export function Sub(a, b) {
	return a - b;
}
