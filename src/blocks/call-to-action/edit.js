import {__} from "@wordpress/i18n";
import React from 'react';
import { Button, ResponsiveWrapper, PanelBody  } from '@wordpress/components';
import { image as icon } from '@wordpress/icons';
import SidebarControl from "./sidebarControl";
import {
    MediaUpload,
    MediaUploadCheck,
    useBlockProps,
    InspectorControls,
    ColorPalette,
    AlignmentToolbar,
    BlockIcon,
    RichText
} from "@wordpress/block-editor";

export default function edit(props) {

    const {attributes, setAttributes, className} = props;
    
    const onSelectImage = (imageObj) => {
        // console.log('imageObj', imageObj);
        setAttributes({
            media: imageObj,
            mediaId: imageObj.id,
            mediaUrl: imageObj.url
        })
    }
    const removeImage = () => {
        setAttributes({
            media: null,
            mediaId: 0,
            mediaUrl: ""
        })
    }
    const onChangeTitle = (newTitle) => {
        setAttributes({ 
            title: newTitle
        })
    }
    const onChangeContent = (newContent) => {
        setAttributes({
            content: newContent
        })
    }
    return (
        <div {...useBlockProps()}>
            <SidebarControl
                data={props}
                onSelectImage={onSelectImage}
                removeImage={removeImage}
            />
            <figure>
                {
                    !props.attributes.media
                    &&
                    <MediaUploadCheck>
                        <MediaUpload
                            onSelect={ onSelectImage }
                            value={props.attributes.mediaUrl}
                            render={ ( { open } ) => (
                                <Button onClick={ open }>
                                    {
                                        props.attributes.mediaUrl 
                                        ? 
                                        <img src={props.attributes.mediaUrl} alt="" />
                                        : 
                                        <BlockIcon icon={ icon } />
                                    }
                                </Button>
                            ) }
                            />
                    </MediaUploadCheck>
                }
                <div className="call-to-action">
                    <div className="call-to-action-media-wrapper">
                        {
                            props.attributes.media 
                            &&
                            <img src={props.attributes.mediaUrl} alt="" />
                        }
                    </div>
                    <div className="call-to-action-title">
                        <RichText
                            style={{ textAlign: props.attributes.alignment }}
                            tagName="h3"
                            onChange={onChangeTitle} 
                            value={props.attributes.title && props.attributes.title}
                        />
                    </div>
                    <div className="call-to-action-content">
                        <RichText
                            tagName="p"
                            onChange={onChangeContent}
                            value={props.attributes.content && props.attributes.content}
                        />
                    </div>
                </div>
            </figure>
        </div>
    )
}
