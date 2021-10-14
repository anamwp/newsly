import {__} from "@wordpress/i18n";
import React from 'react';
import { Button, ResponsiveWrapper, PanelBody  } from '@wordpress/components';
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
        console.log('imageObj', imageObj);
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
    return (
        <div {...useBlockProps()}>
            <InspectorControls>
                <PanelBody
                    title={__("Call to action Image", "anam-gutenberg-starter")}
                    initialOpen={true}
                >   
                    <p>
                    <MediaUploadCheck>
                        <MediaUpload 
                            onSelect={ onSelectImage }
                            type="image"
                            value={props.attributes.mediaId}
                            render={({open}) => (
                                <Button
                                    className={props.attributes.mediaId == 0 ? 'editor-post-featured-image__toggle' : 'editor-post-featured-image__preview'}
                                    onClick={open}
                                >
                                    { !props.attributes.mediaId && __("Add Image", "anam-gutenberg-starter") }
                                    {
                                        props.attributes.media 
                                        && 
                                        <ResponsiveWrapper
                                        naturalWidth={ props.attributes.media.width }
                                        naturalHeight={ props.attributes.media.height }
                                        >
                                            <img src={props.attributes.media.url} />
                                        </ResponsiveWrapper>
                                    }
                                </Button>
                            )}
                        />
                    </MediaUploadCheck>
                    </p>
                    <p>
                    {
                        props.attributes.media
                        &&
                        <MediaUploadCheck>
                            <Button onClick={removeImage} isLink isDestructive >
                                {__("Remove Image", "anam-gutenberg-starter")}
                            </Button>
                        </MediaUploadCheck>
                    }
                    </p>
                    <p>
                    {
                        props.attributes.media 
                        &&
                        <MediaUploadCheck>
                            <MediaUpload
                                title={__("Replace Image", "anam-gutenberg-starter")}
                                value={props.attributes.mediaId}
                                onSelect={onSelectImage}
                                allowedTypes={['image']}
                                render={({open})=>(
                                    <Button onClick={open} isDefault isLarge>
                                        {__("Replace Image", "anam-gutenberg-starter")}
                                    </Button>
                                )}
                            />
                        </MediaUploadCheck>
                    }
                    </p>
                    </PanelBody>
            </InspectorControls>
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
                </div>
            </figure>
            {/* <img src={props.attributes.mediaUrl} alt="" /> */}
        </div>
    )
}
