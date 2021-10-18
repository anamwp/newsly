import {registerBlockType} from "@wordpress/blocks";
import metadata from './block.json';
import edit from './edit';
import save from './save';
const {attributes} = metadata;

registerBlockType( 'anam-gutenberg-starter-block/call-to-action', {
    apiVersion: 2,
    title: 'Call To Action', 
    icon: 'smiley', 
    category: 'design', 
    attributes,
    edit,
    save
} );