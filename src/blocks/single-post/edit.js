import React from 'react';
import {useSelect, withSelect, select} from '@wordpress/data';
import { useBlockProps } from "@wordpress/block-editor";
import ServerSideRender from '@wordpress/server-side-render';
import SidebarControl from './sidebarControl';
import { RawHTML, useState, useRef, useEffect } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';

export default function edit( props ) {
    const blockProps = useBlockProps();

    const {attributes, setAttributes} = props;
    const {getEntityRecords, getmedia} = select('core');
    const {getEditorSettings, getCurrentPost} = select('core/editor');
    // let __catDataa = getEntityRecords('taxonomy', 'category');
    {
        attributes.categories.length === 0 &&
        apiFetch( { path: '/wp/v2/categories' } ).then( ( cat ) => {
            let catArr = [];
            cat.map(cat => {
                catArr.push({
                    label: cat.name,
                    value: cat.id
                })
            })
            setAttributes({
                categories: catArr
            })
        } );
    }

    const handleCategoryChange = (selectedCat) => {
        setAttributes({
            selectedCategroyId: selectedCat
        })
    }

    return (    
        <div {...blockProps}>
            <SidebarControl 
                props={props}
                categories={attributes.categories}
                handleCategoryChange={handleCategoryChange}
            />
            <ServerSideRender
                block="anam-gutenberg-starter-block/single-post"
                // attributes={ attributes }
            />
        </div>
    )
}
