import React from 'react';
import {
    useBlockProps, 
    RichText, 
    AlignmentToolbar, 
    BlockControls,
    ColorPalette,
    InspectorControls
} from "@wordpress/block-editor";


export default function save(props) {
    /**
     * get block props and 
     * assign it to a variable
     */
     const blockProps = useBlockProps.save();
     /**
      * return save data
      *  */     
    return (
         <div { ...blockProps }>
             <RichText.Content
                 className={ `gutenberg-examples-align-${ props.attributes.alignment }` }
                 style={{ textAlign: props.attributes.alignment }}
                 tagName="p"
                 value={ props.attributes.content }
             />
             <div style={{
                 backgroundColor: props.attributes.bg_color,
                 color: props.attributes.text_color
             }}>
                 {props.attributes.message}
             </div>
         </div>
    );
}
