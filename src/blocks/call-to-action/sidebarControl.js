import {__} from "@wordpress/i18n";
import React from 'react';
import {Button, ResponsiveWrapper, PanelBody} from "@wordpress/components"
import{
    InspectorControls,
    MediaUpload,
    MediaUploadCheck
} from "@wordpress/block-editor";

export default function SidebarControl({data, onSelectImage, removeImage}) {
    const {attributes} = data;
    return (
        <div>
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
                            value={attributes.mediaId}
                            render={({open}) => (
                                <Button
                                    className={attributes.mediaId == 0 ? 'editor-post-featured-image__toggle' : 'editor-post-featured-image__preview'}
                                    onClick={open}
                                >
                                    { !attributes.mediaId && __("Add Image", "anam-gutenberg-starter") }
                                    {
                                        attributes.media 
                                        && 
                                        <ResponsiveWrapper
                                        naturalWidth={ attributes.media.width }
                                        naturalHeight={ attributes.media.height }
                                        >
                                            <img src={attributes.media.url} />
                                        </ResponsiveWrapper>
                                    }
                                </Button>
                            )}
                        />
                    </MediaUploadCheck>
                    </p>
                    <p>
                    {
                        attributes.media
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
                        attributes.media 
                        &&
                        <MediaUploadCheck>
                            <MediaUpload
                                title={__("Replace Image", "anam-gutenberg-starter")}
                                value={attributes.mediaId}
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
        </div>
    )
}
