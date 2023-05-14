import { registerBlockType } from '@wordpress/blocks';
import metadata from './block.json';
import edit from './edit';
import save from './save';

const { attributes } = metadata;

registerBlockType('anam-guternberg-starter-block/test', {
	apiVersion: 2,
	title: 'Test',
	icon: 'admin-post',
	category: 'anam-starter',
	attributes,
	example: {
		attributes: {
			content: 'Hello World',
			alignment: 'right',
		},
	},
	edit,
	save,
});
