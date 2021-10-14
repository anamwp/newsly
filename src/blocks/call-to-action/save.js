import React from 'react'

export default function save(props) {
    return (
        <div className="call-to-action">
            <div className="call-to-action-media-wrapper">
                {
                    props.attributes.media 
                    &&
                    <img src={props.attributes.mediaUrl} alt="" />
                }
            </div>
        </div>
    )
}
