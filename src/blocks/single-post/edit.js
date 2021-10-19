import React from 'react';

import {
    useBlockProps
} from "@wordpress/block-editor";

export default function edit(props) {
    return (
        <div {...useBlockProps()}>
            single post block from editor.
        </div>
    )
}
