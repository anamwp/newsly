import { __ } from '@wordpress/i18n';
import { registerBlockType } from '@wordpress/blocks';
import metadata from './block.json';
import edit from './edit';
// import save from './save';
const { attributes } = metadata;

registerBlockType('anam-gutenberg-starter-block/single-post', {
	apiVersion: 2,
	title: __('Single Post', 'anam-gutenberg-starter'),
	icon: 'admin-post',
	category: 'anam-starter',
	attributes,
	edit,
});
// save
