import React from "react";
import { useBlockProps, RichText, InnerBlocks } from "@wordpress/block-editor";

export default function save(props) {
    const blockProps = useBlockProps.save({
        className: "call-to-action",
    });
    return (
        <div {...blockProps}>
            <h2>hellow world</h2>
        </div>
    );
}
