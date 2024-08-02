import { registerBlockType } from '@wordpress/blocks';
import metadata from './block.json';
import edit from './edit';
import save from './save';
import './editor.scss';
import './style.scss';

const { attributes } = metadata;

registerBlockType(metadata.name, {
	// apiVersion: 2,
	// title: 'Test',
	// icon: 'admin-post',
	// category: 'anam-starter',
	// attributes,
	// example: {
	// 	,
	// },
	edit,
	save,
});
