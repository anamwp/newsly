import {__} from "@wordpress/i18n";
import React from 'react';
import { 
    Button, 
    ResponsiveWrapper, 
    PanelBody,  
    ButtonGroup
} from '@wordpress/components';
import { closeSmall, image as icon } from '@wordpress/icons';
import SidebarControl from "./sidebarControl";
import {isBlobURL} from "@wordpress/blob";
import {
    MediaUpload,
    MediaUploadCheck,
    useBlockProps,
    InspectorControls,
    ColorPalette,
    AlignmentToolbar,
    BlockIcon,
    RichText,
    MediaPlaceholder
} from "@wordpress/block-editor";
import classnames from "classnames";

export default function edit(props) {
    // console.log('props ', props);
    const {attributes, setAttributes, className, isSelected} = props;
    
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
    const onChangeAlignment = (newAlignment) => {
        setAttributes({
            alignment: 'undefined' === newAlignment  ? none : newAlignment,
        })
    }
    const renderPlaceholderForImage = () => {
        return(
            <div className="call-to-action-image-placeholder-wrapper">
                <MediaPlaceholder
                    allowedTypes={ [ 'image' ] }
                    multiple={ false }
                    icon="format-image"
                    labels={ {
                        title: ' ',
                    } }
                    onSelect={ ( imageEntity ) => {
                        debugger;
                        console.log(imageEntity);
                        if ( isBlobURL( imageEntity?.url ) ) {
                            return;
                        }
                        setAttributes( {
                            url: imageEntity?.url,
                            alt: imageEntity?.alt,
                            media: imageEntity,
                            mediaId: imageEntity?.id,
                            mediaUrl: imageEntity?.url
                        } );
                    }
                    }
                />
            </div>
        )
    }
    const renderImage = () => {
        const {
            focalPoint
        } = attributes;
        // console.log("focalPoint", focalPoint)
        const classes = classnames('call-to-action-image-wrapper',{
            'is-selected': isSelected
        });
        return(
            <>
                <div className={ classes }>
                    {
                        isSelected && (
                            <ButtonGroup 
                            className="block-library-gallery-item__inline-menu is-right is-visible"
                            >
                                <Button
                                    icon={closeSmall}
                                    onClick={ () => {
                                        setAttributes({
                                            url: ''
                                        })
                                    } }
                                    label={__('Remove Image', 'anam-gutenberg-starter')}
                                    disabled={ !isSelected }
                                />
                            </ButtonGroup>
                        )
                    }
                    {/* <div 
                        className="call-to-action-media-wrapper"
                        style={{ textAlign: props.attributes.alignment }}
                    > */}
                        {
                            props.attributes.media 
                            &&
                            <img 
                            src={props.attributes.mediaUrl} 
                            alt=""
                            style={{
                                objectPosition: focalPoint
                                ? `${focalPoint.x * 100}% ${focalPoint.y * 100}%`
                                : undefined
                            }} 
                            />
                        }
                    {/* </div> */}
                </div>
            </>
        )

    }
    return (
        <div {...useBlockProps()}>
            <SidebarControl
                data={props}
                onSelectImage={onSelectImage}
                removeImage={removeImage}
                onChangeAlignment={onChangeAlignment}
            />
            <div>
                
                {/* {
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
                } */}
                <div className="call-to-action">
                    <div 
                        className="call-to-action-media-wrapper"
                        style={{ textAlign: props.attributes.alignment }}
                    >
                        {/* {
                            props.attributes.media 
                            &&
                            <img src={props.attributes.mediaUrl} alt="" />
                        } */}
                        {
                            props.attributes.media 
                            ? renderImage()
                            : renderPlaceholderForImage()
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
                            style={{ textAlign: props.attributes.alignment }}
                            tagName="p"
                            onChange={onChangeContent}
                            value={props.attributes.content && props.attributes.content}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}
