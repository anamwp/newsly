import { __ } from '@wordpress/i18n';
import React from 'react';

export default function PopupModal() {
	return (
		<div id="popup-modal-for-movie-card" style={{ display: 'none' }}>
			<div id="close-modal">{__('close', 'newsly')}</div>
			<div id="fetched-movie-content"></div>
		</div>
	);
}
