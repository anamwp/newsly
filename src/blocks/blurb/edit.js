import {__} from "@wordpress/i18n";
import React from 'react';
import { TextControl } from "@wordpress/components";

import {
    useBlockProps, 
    RichText, 
    AlignmentToolbar, 
    BlockControls,
    ColorPalette,
    InspectorControls
} from "@wordpress/block-editor";

const blockStyle = {
    backgroundColor: '#900',
    color: '#fff',
    padding: '20px',
};

export default function edit({attributes, setAttributes}) {
        /**
         * pass style through useBlockProps()
         */
     const blockProps = useBlockProps({
        style: blockStyle
    })
    /**
     * 
     * @param {*} newContent 
     */
    const onChangeContent = (newContent) => {
        setAttributes({
            content: newContent
        })
    }
    /**
     * 
     * @param {*} newColor 
     */
    const onChangeTextColor = (newColor) => {
        setAttributes({
            text_color: newColor
        })
    }
    /**
     * 
     * @param {*} newBGColor 
     */
    const onChangeBGColor = (newBGColor) => {
        setAttributes({
            bg_color: newBGColor
        })
    }
    /**
     * 
     * @param {*} newAlignment 
     */
    const onChangeAlignment = (newAlignment) => {
        setAttributes({
            alignment: 'undefined' === newAlignment  ? none : newAlignment,
        })
    }
    /**
     * return edit content
     */
    return (
        <div {...useBlockProps()} >
            {/* block level control in the editor */}
            {
                <BlockControls>
                    <AlignmentToolbar 
                        value={attributes.alignment}
                        onChange={onChangeAlignment}
                        />
                </BlockControls>
            }
            {/* for sidebar control */}
            <InspectorControls key={'settings'}>
                <div id="blurb-controls">
                    <fieldset>
                        <legend className="blurb-control-label">
                            {__('Text', 'wp-plugin-starter')}
                        </legend>
                        <ColorPalette 
                            onChange={onChangeTextColor}
                        />
                    </fieldset>
                    <fieldset>
                        <legend className="blurb-control-label">
                            {__('Background', 'wp-plugin-starter')}
                        </legend>
                        <ColorPalette 
                            onChange={onChangeBGColor}
                        />
                    </fieldset>
                </div>
            </InspectorControls>
            {/* Rich Text control */}
            <RichText
                className= {attributes.className}
                style={{ textAlign: attributes.alignment }}
                tagName="p"
                onChange={onChangeContent} 
                value={attributes.content ? attributes.content : 'This is rich text editor content'}
            />
            {/* Text Control */}
            <TextControl
                value={attributes.message}
                onChange = { val => setAttributes({message: val}) }
                style={{
                    backgroundColor: attributes.bg_color,
                    color: attributes.text_color
                }}
            />
        </div>
    )
}
