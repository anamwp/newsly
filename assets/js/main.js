const { registerPlugin } = wp.plugins;
const { useSelect } = wp.data;
const { useEffect, useState } = wp.element;

console.log('hello from main.js');

const BlockMonitor = () => {
	const postId = useSelect((select) =>
		select('core/editor').getCurrentPostId()
	);
	const [prevBlocks, setPrevBlocks] = useState([]);
	// Get all blocks in the editor
	const blocks = useSelect((select) =>
		select('core/block-editor').getBlocks()
	);
	const restRouteForRemoveMeta =
		'/wp-json/anam-gutenberg-starter-block/v1/remove-meta';

	useEffect(() => {
		// Find removed blocks
		const removedBlocks = prevBlocks.filter(
			(prevBlock) =>
				!blocks.some((block) => block.clientId === prevBlock.clientId)
		);

		removedBlocks.forEach((block) => {
			if (block.name === 'anam-gutenberg-starter-block/theatres-movies') {
				// split the block name to get the block slug
				const blockSlug = block.name.split('/')[1];
				/**
				 * Fetch meta status from the API
				 */
				const metaRemoveStatusPromise = fetch(
					`${restRouteForRemoveMeta}/${postId}`,
					{
						method: 'POST',
						headers: { 'Content-Type': 'application/json' },
						body: JSON.stringify({ blockSlug }),
					}
				);
				metaRemoveStatusPromise
					.then((response) => {
						if (!response.ok) {
							throw new Error(
								`HTTP error! Status: ${response.status}`
							);
						}
						return response.json(); // Parse the response JSON
					})
					.then((data) => {
						// delete meta status from localStorage
						localStorage.removeItem(`meta_status_${postId}`);
					})
					.catch((error) => {
						console.error('Error adding meta:', error);
					});
			}
		});

		// Update previous blocks state
		setPrevBlocks(blocks);
	}, [blocks]);

	return null; // This plugin does not render anything in the UI
};

// Register the plugin
registerPlugin('block-removal-alert', { render: BlockMonitor });
