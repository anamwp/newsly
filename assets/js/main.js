// import { registerPlugin } from '@wordpress/plugins';
// import { useSelect } from '@wordpress/data';
// import { useEffect, useState } from '@wordpress/element';

const { registerPlugin } = wp.plugins;
const { useSelect } = wp.data;
const { useEffect, useState } = wp.element;

const BlockMonitor = () => {
	const [prevBlocks, setPrevBlocks] = useState([]);
	// Get all blocks in the editor
	const blocks = useSelect((select) =>
		select('core/block-editor').getBlocks()
	);

	useEffect(() => {
		// Find removed blocks
		const removedBlocks = prevBlocks.filter(
			(prevBlock) =>
				!blocks.some((block) => block.clientId === prevBlock.clientId)
		);

		removedBlocks.forEach((block) => {
			if (block.name === 'anam-gutenberg-starter-block/theatres-movies') {
				alert('Theatres Movies block has been removed!');
			}
		});

		// Update previous blocks state
		setPrevBlocks(blocks);
	}, [blocks]);

	return null; // This plugin does not render anything in the UI
};

// Register the plugin
registerPlugin('block-removal-alert', { render: BlockMonitor });
