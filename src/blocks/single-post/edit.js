import React from 'react';
import {useSelect, withSelect, select} from '@wordpress/data';
import { RichText, useBlockProps } from "@wordpress/block-editor";
import ServerSideRender from '@wordpress/server-side-render';
import SidebarControl from './sidebarControl';
import { RawHTML, useState, useRef, useEffect } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';
import GetFeaturedImage from './getFeaturedImage';
import RenderPostCategoryData from './components';
import { Disabled } from '@wordpress/components';

export default function edit( props ) {
    const blockProps = useBlockProps();

    const {attributes, setAttributes} = props;
    const {getEntityRecords, getMedia} = select('core');
    const {getEditorSettings, getCurrentPost} = select('core/editor');
    // let __catDataa = getEntityRecords('taxonomy', 'category');
    /**
     * fetch all categoris 
     * at first loading
     */
    useEffect(() => {
        attributes.categories.length === 0 &&
        apiFetch( { path: '/wp/v2/categories' } ).then( ( cat ) => {
            let catArr = [{
                label: 'Select a category',
                value: ''
            }];
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
    }, [])
    /**
     * set posts while change the category
     * @param {*} selectedCatId 
     */
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
            /**
             * set response first data 
             * to fetchPosts attribute
             */
            setAttributes({
                fetchedPosts: [res[0]]
            })
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
        /**
         * if no value passed 
         * then reset all data
         */
        if(!selectedCat){
            setAttributes({
                selectedCategroyId: '',
                selectedCategoryPosts: [],
                fetchedPosts: []
            });
            return;
        }
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
    /**
     * fetch posts by id 
     * and then assign
     * fetchedPosts attribute 
     * @param {*} newPostId 
     * @returns 
     */
    const handleSelectedPostData = (newPostId) => {
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
    /**
     * Fallback message
     * @param {*} props 
     * @returns 
     */
    const FallbackMessage = (props) => {
        return(
            <p>
                {props.message}
            </p>
        )
    }
    /**
     * component to display post card
     * @param {*} props 
     * @returns 
     */
    const PostCard = (props) => {
        let postData = props.data;
        return(
            <div>
                <GetFeaturedImage
                    postId={postData.featured_media}
                />
                {
                    attributes.showCategory &&
                    <RenderPostCategoryData
                    catArr={postData.categories}
                    />
                }
                <Disabled>
                    <h3>
                        <a href={ postData.link }>
                            { postData.title.rendered }
                        </a>
                    </h3>
                </Disabled>
                {
                    attributes.showExcerpt &&
                    <RichText
                    tagName="p"
                    value={postData.excerpt.rendered}
                    />
                }
            </div>
        )
    }
    /**
     * handle category display control
     * in post card
     */
    const handleCategoryToggleControl = () => {
        setAttributes({
            showCategory: !attributes.showCategory
        })
    }
    /**
     * handle excerpt display control 
     * in post card
     */
    const handleExcerptToggleControl = () => {
        setAttributes({
            showExcerpt: !attributes.showExcerpt
        })
    }
    
    return (    
        <div {...blockProps}>
            <SidebarControl 
                props={props}
                categories={attributes.categories}
                handleCategoryChange={handleCategoryChange}
                handleSelectedPostData={handleSelectedPostData}
                handleCategoryToggleControl={handleCategoryToggleControl}
                handleExcerptToggleControl={handleExcerptToggleControl}
            />
            {/* <ServerSideRender
                block="anam-gutenberg-starter-block/single-post"
            /> */}
            {
                attributes.fetchedPosts.length == 0 
                && 
                <FallbackMessage
                    message="Please select a post to display"
                />
            }
            {
                (!attributes.selectedPostId && attributes.categories.length > 0 && attributes.fetchedPosts.length > 0) &&
                <PostCard
                    data={attributes.fetchedPosts[0]}
                    before="1"
                />
            }
            {
                (attributes.selectedPostId && attributes.fetchedPosts.length > 0)
                && 
                <PostCard
                    data={attributes.fetchedPosts[0]}
                    before="0"
                />
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
