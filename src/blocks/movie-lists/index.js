import { __ } from '@wordpress/i18n';
import { registerBlockType } from '@wordpress/blocks';
import metadata from './block.json';
import edit from './edit';
import save from './save';
// import './editor.scss';
// import './style.scss';

registerBlockType(metadata.name, {
	edit,
	save,
});
