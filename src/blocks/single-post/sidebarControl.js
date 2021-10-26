import {__} from "@wordpress/i18n";
import {useSelect, withSelect, select} from '@wordpress/data';
import { InspectorControls } from '@wordpress/block-editor';
import { PanelBody, SelectControl } from '@wordpress/components';
import React from 'react';
import { RawHTML, useState, useRef, useEffect } from '@wordpress/element';

export default function sidebarControl({props, categories, handleCategoryChange, handleSelectedPostData}) {
    const {attributes, setAttributes} = props;

    return (
        <div>
            <InspectorControls>
                <PanelBody 
                    title={__("Single Post Controls", "anam-gutenberg-starter")}
                    initialOpen={true}
                >
                    <p className="single-post-category-picker">
                        <SelectControl
                            label={__('Choose Category', 'anam-gutenberg-starter')}
                            value={attributes.selectedCategroyId}
                            options={categories}
                            onChange={handleCategoryChange}
                        />
                    </p>
                    <p>
                        <SelectControl
                            label={__('Choose post to display', 'anam-gutenberg-starter')}
                            options={attributes.selectedCategoryPosts}
                            onChange={handleSelectedPostData}
                        />
                    </p>
                </PanelBody>
            </InspectorControls>
        </div>
    )
}
