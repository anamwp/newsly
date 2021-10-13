import {__} from "@wordpress/i18n";
import {registerBlockType} from "@wordpress/blocks";
// import { TextControl } from "@wordpress/components";
import metadata from "./block.json";
import edit from './edit';
import save from './save';

const {attributes} = metadata;

registerBlockType('guternberg-starter-block/blurb', {
    apiVersion: 2,
    title: 'Blurb', 
    icon: 'smiley',
    category: 'design', 
    attributes,
    example: {
        attributes: {
            content: 'Hello World',
            alignment: 'right'
        },
    },
    edit,
    save
    
});