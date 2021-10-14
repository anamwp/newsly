import React from 'react';
import {
    RichText
} from "@wordpress/block-editor";

export default function save(props) {
    return (
        <div className="call-to-action" >
            <div className="call-to-action-media-wrapper">
                {
                    props.attributes.media 
                    &&
                    <img src={props.attributes.mediaUrl} alt="" />
                }
            </div>
            <div className="call-to-action-title">
                <RichText.Content
                    tagName="h3"
                    value={props.attributes.title && props.attributes.title }
                />
            </div>
            <div className="call-to-action-content">
                <RichText.Content
                    tagName="p"
                    value={props.attributes.content && props.attributes.content}
                />
            </div>
        </div>
    )
}
