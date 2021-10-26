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
    const handlePostsByCategory = (selectedCatId = attributes.selectedCategroyId) => {
        /**
         * if nothing passed 
         * then assing catId from 
         * attributes
         */
        let catId = selectedCatId ? selectedCatId : attributes.selectedCategroyId;
        /**
         * fetch the data 
         * from restapi endpoint
         * for specific category
         */
        apiFetch( {
            path: `/wp/v2/posts?categories=${catId}`
        } )
        .then( res => {
            let catPostsArr = [];
            res.map(res => {
                catPostsArr.push({
                    label: res.title.rendered,
                    value: res.id
                })
            })
            setAttributes({
                selectedCategoryPosts: catPostsArr
            })
        })
        .catch(err => console.log(err))
    }
    /**
     * handle category change
     * @param {*} selectedCat 
     */
    const handleCategoryChange = (selectedCat) => {
        setAttributes({
            selectedCategroyId: selectedCat
        });
        handlePostsByCategory(selectedCat);
    }
    /**
     * fetch category 
     * specific posts
     */
    const getPosts = useSelect( ( select ) => {
        /**
         * if no selected category id 
         * return 
         */
        if( ! attributes.selectedCategroyId){
            return;
        }
        /**
         * If selected category id available 
         * then fetch specific category post
         */
        let getSelectedPosts =  select( 'core' ).getEntityRecords( 'postType', 'post', {
            categories: [attributes.selectedCategroyId]
        } );
        /**
         * if no data found 
         * return
         */
        if(null == getSelectedPosts){
            return;
        }
        return getSelectedPosts;

    }, [attributes.selectedCategroyId] );

    const handleSelectedPostData = (newPostId) => {
        console.log('selectedPost', typeof newPostId);
        let selectedPostId = newPostId ? newPostId : attributes.selectedPostId
        /**
         * set the new post ID
         * to selectedPostId attribute
         */
        if(newPostId){
            setAttributes({
                selectedPostId: newPostId
            })
        }
        /**
         * if there is no 
         * selectedPostId 
         * then return
         */
        if(!selectedPostId){
            return;
        }
        /**
         * fetch data from rest point
         */
        apiFetch({
            path: `/wp/v2/posts/?include=${selectedPostId}`
        })
        .then( res => {
            setAttributes({
                fetchedPosts: res
            })
        })
        .catch( err => console.log('err', err) );
    }

    
    return (    
        <div {...blockProps}>
            <SidebarControl 
                props={props}
                categories={attributes.categories}
                handleCategoryChange={handleCategoryChange}
                handleSelectedPostData={handleSelectedPostData}
            />
            {/* <ServerSideRender
                block="anam-gutenberg-starter-block/single-post"
            /> */}
            {attributes.fetchedPosts.length == 0 && <p>fetching post content</p>}
            {
                attributes.fetchedPosts.length > 0
                && 
                <p>
                    <GetFeaturedImage
                        postId={attributes.fetchedPosts[0].featured_media}
                    />
                    <a href={ attributes.fetchedPosts[0].link }>
                        { attributes.fetchedPosts[0].title.rendered }
                    </a>
                </p>
            }
            {/* {
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
            } */}
        </div>
    )
}
