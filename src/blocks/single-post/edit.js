import React from 'react';
import {useSelect, withSelect, select} from '@wordpress/data';
import { useBlockProps } from "@wordpress/block-editor";
import ServerSideRender from '@wordpress/server-side-render';
import SidebarControl from './sidebarControl';
import { RawHTML, useState, useRef, useEffect } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';
import GetFeaturedImage from './getFeaturedImage';

export default function edit( props ) {
    const blockProps = useBlockProps();

    const {attributes, setAttributes} = props;
    const {getEntityRecords, getMedia} = select('core');
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

    const getPosts = useSelect( ( select ) => {
        return select( 'core' ).getEntityRecords( 'postType', 'post', {
            categories: [attributes.selectedCategroyId]
        } );
    }, [attributes.selectedCategroyId] );

    
    return (    
        <div {...blockProps}>
            <SidebarControl 
                props={props}
                categories={attributes.categories}
                handleCategoryChange={handleCategoryChange}
            />
            {/* <ServerSideRender
                block="anam-gutenberg-starter-block/single-post"
            /> */}
            
            {
                !attributes.selectedCategroyId && <p>Select a category first.</p>
            }
            { ! getPosts && 'Loading' }
            { getPosts && getPosts.length === 0 && 'No Posts' }
            { getPosts && getPosts.length > 0 && 
                getPosts.map(singlePost => {
                    return(
                        <p>
                            <GetFeaturedImage
                                postId={singlePost.featured_media}
                            />
                            <a href={ singlePost.link }>
                                { singlePost.title.rendered }
                            </a>
                        </p>
                    )
                })
            }
        </div>
    )
}
