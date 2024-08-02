import { __ } from '@wordpress/i18n';
import { registerBlockType } from '@wordpress/blocks';
import metadata from './block.json';
import edit from './edit';
import save from './save';
// const { attributes } = metadata;
// console.log(metadata);
import './style/editor.scss';
import './style/frontend.scss';
import './style.scss';

registerBlockType(metadata.name, {
	// apiVersion: 2,
	// title: __('Theatres Movies', 'anam-gutenberg-starter'),
	// icon: 'admin-post',
	// category: 'anam-starter',
	// attributes,
	edit,
	save,
});
// save
