import React from 'react';
import { Button } from '@wordpress/components';
import { image as icon } from '@wordpress/icons';

import {
    MediaUpload,
    MediaUploadCheck,
    useBlockProps,
    InspectorControls,
    ColorPalette,
    AlignmentToolbar,
    BlockIcon
} from "@wordpress/block-editor";

export default function edit(props) {
    console.log(
        props.attributes.media, 
        props.attributes.mediaId, 
        props.attributes.mediaUrl

    );
    const {attributes, setAttributes, className} = props;
    const onSelectImage = (imageObj) => {
        setAttributes({
            media: imageObj,
            mediaId: imageObj.id,
            mediaUrl: imageObj.url
        })
    }
    return (
        <div {...useBlockProps()}>
            <InspectorControls>
                <div id="call-to-action-sidebar-controls">
                    <strong>Select a image</strong>
                    <MediaUpload 
                        onSelect={ onSelectImage }
                        type="image"
                        value={props.attributes.mediaUrl}
                        render={({open}) => (
                            <button onClick={open}>
                                Upload Image
                            </button>
                        )}
                    />
                </div> 
            </InspectorControls>
            <figure>
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
            </figure>
            {/* <img src={props.attributes.mediaUrl} alt="" /> */}
        </div>
    )
}
