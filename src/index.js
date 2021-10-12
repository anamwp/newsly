import {__} from "@wordpress/i18n";
import {registerBlockType} from "@wordpress/blocks";
import { TextControl } from "@wordpress/components"
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
 
registerBlockType('starter-block/blurb', {
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
    // edit(props){
    //     console.log('edit props', props);
    //     const {
    //         attributes: {content},
    //         setAttributes,
    //         className
    //     } = props;

    //     const blockProps = useBlockProps({
    //         style: blockStyle
    //     })

    //     const onChangeContent = (newContent) => {
    //         setAttributes({
    //             content: newContent
    //         })
    //     }

    //     return (
    //         <>
    //             <RichText
    //                 { ...blockProps }
    //                 tagName="p"
    //                 onChange={onChangeContent} 
    //                 value={content}
    //             />
    //             <div {...blockProps}>
    //                 Hellow world from the editor
    //             </div>
    //         </>
    //     )
    // },
    edit({attributes, setAttributes}){

        // const blockProps = useBlockProps({
        //     style: blockStyle
        // })

        const onChangeContent = (newContent) => {
            setAttributes({
                content: newContent
            })
        }

        const onChangeTextColor = (newColor) => {
            setAttributes({
                text_color: newColor
            })
        }

        const onChangeBGColor = (newBGColor) => {
            setAttributes({
                bg_color: newBGColor
            })
        }

        const onChangeAlignment = (newAlignment) => {
            setAttributes({
                alignment: 'undefined' === newAlignment  ? none : newAlignment,
            })
        }

        return (
            <div {...useBlockProps()} >
                {
                    <BlockControls>
                        <AlignmentToolbar 
                            value={attributes.alignment}
                            onChange={onChangeAlignment}
                            />
                    </BlockControls>
                }
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
                <RichText
                    className= {attributes.className}
                    style={{ textAlign: attributes.alignment }}
                    tagName="p"
                    onChange={onChangeContent} 
                    value={attributes.content ? attributes.content : 'This is rich text editor content'}
                />
                <TextControl
                    value={attributes.message}
                    onChange = { val => setAttributes({message: val}) }
                    style={{
                        backgroundColor: attributes.bg_color,
                        color: attributes.text_color
                    }}
                />
                {/* <div {...blockProps}>
                    Hellow world from the editor
                </div> */}
            </div>
        )
    },

    // save(props){
    //     // console.log('save props', props);
    //     const blockProps = useBlockProps.save();
    //     return (
    //         <div {...blockProps }>
    //             <RichText.Content
    //                 className={`blurb-align-${props.attributes.alignment}`}
    //                 tagName="p"
    //                 value={props.attributes.content}
    //             />
    //             {/* <div {...blockProps}>
    //                 hello world for the frontend. 
    //             </div> */}
    //         </div>
    //     )
    // }
    save: ( props ) => {
        console.log('save props', props);
        const blockProps = useBlockProps.save();
 
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
    },
});