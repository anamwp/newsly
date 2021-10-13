import {__} from "@wordpress/i18n";
import {registerBlockType} from "@wordpress/blocks";
// import { TextControl } from "@wordpress/components";
import edit from './edit';
import save from './save';

registerBlockType('guternberg-starter-block/blurb', {
    apiVersion: 2,
    title: 'Blurb', 
    icon: 'smiley',
    category: 'design', 
    attributes: {
        content: {
            type: 'array',
            source: 'children',
            selector: 'p',
        },
        message: {
            type: 'string',
            source: 'text',
            selector: 'div',
            default: 'Hello message attributes'
        },
        alignment: {
            type: 'string', 
            default: 'none'
        },
        text_color: {
            type: 'string',
            default: '#fff'
        },
        bg_color: {
            type: 'string',
            default: '#000'
        }
    },
    example: {
        attributes: {
            content: 'Hello World',
            alignment: 'right'
        },
    },
    edit,
    save
    /**
     * 
     * @param {*} param0 
     * @returns 
     */
    // edit({attributes, setAttributes}){
    //     /**
    //      * pass style through useBlockProps()
    //      */
    //     const blockProps = useBlockProps({
    //         style: blockStyle
    //     })
    //     /**
    //      * 
    //      * @param {*} newContent 
    //      */
    //     const onChangeContent = (newContent) => {
    //         setAttributes({
    //             content: newContent
    //         })
    //     }
    //     /**
    //      * 
    //      * @param {*} newColor 
    //      */
    //     const onChangeTextColor = (newColor) => {
    //         setAttributes({
    //             text_color: newColor
    //         })
    //     }
    //     /**
    //      * 
    //      * @param {*} newBGColor 
    //      */
    //     const onChangeBGColor = (newBGColor) => {
    //         setAttributes({
    //             bg_color: newBGColor
    //         })
    //     }
    //     /**
    //      * 
    //      * @param {*} newAlignment 
    //      */
    //     const onChangeAlignment = (newAlignment) => {
    //         setAttributes({
    //             alignment: 'undefined' === newAlignment  ? none : newAlignment,
    //         })
    //     }
    //     /**
    //      * return edit content
    //      */
    //     return (
    //         <div {...useBlockProps()} >
    //             {/* block level control in the editor */}
    //             {
    //                 <BlockControls>
    //                     <AlignmentToolbar 
    //                         value={attributes.alignment}
    //                         onChange={onChangeAlignment}
    //                         />
    //                 </BlockControls>
    //             }
    //             {/* for sidebar control */}
    //             <InspectorControls key={'settings'}>
    //                 <div id="blurb-controls">
    //                     <fieldset>
    //                         <legend className="blurb-control-label">
    //                             {__('Text', 'wp-plugin-starter')}
    //                         </legend>
    //                         <ColorPalette 
    //                             onChange={onChangeTextColor}
    //                         />
    //                     </fieldset>
    //                     <fieldset>
    //                         <legend className="blurb-control-label">
    //                             {__('Background', 'wp-plugin-starter')}
    //                         </legend>
    //                         <ColorPalette 
    //                             onChange={onChangeBGColor}
    //                         />
    //                     </fieldset>
    //                 </div>
    //             </InspectorControls>
    //             {/* Rich Text control */}
    //             <RichText
    //                 className= {attributes.className}
    //                 style={{ textAlign: attributes.alignment }}
    //                 tagName="p"
    //                 onChange={onChangeContent} 
    //                 value={attributes.content ? attributes.content : 'This is rich text editor content'}
    //             />
    //             {/* Text Control */}
    //             <TextControl
    //                 value={attributes.message}
    //                 onChange = { val => setAttributes({message: val}) }
    //                 style={{
    //                     backgroundColor: attributes.bg_color,
    //                     color: attributes.text_color
    //                 }}
    //             />
    //         </div>
    //     )
    // },
    /**
     * 
     * @param {*} props 
     * @returns 
     */
    // save: ( props ) => {
    //     /**
    //      * get block props and 
    //      * assign it to a variable
    //      */
    //     const blockProps = useBlockProps.save();
    //     /**
    //      * return save data
    //      *  */     
    //     return (
    //         <div { ...blockProps }>
    //             <RichText.Content
    //                 className={ `gutenberg-examples-align-${ props.attributes.alignment }` }
    //                 style={{ textAlign: props.attributes.alignment }}
    //                 tagName="p"
    //                 value={ props.attributes.content }
    //             />
    //             <div style={{
    //                 backgroundColor: props.attributes.bg_color,
    //                 color: props.attributes.text_color
    //             }}>
    //                 {props.attributes.message}
    //             </div>
    //         </div>
    //     );
    // },
});