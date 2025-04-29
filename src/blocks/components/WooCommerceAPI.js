import React from 'react';
const WooCommerceRestApi = require('@woocommerce/woocommerce-rest-api').default;

export default async function WooCommerceAPI({ restURL, params }) {
	/**
	 * Import env variables
	 * from .env file
	 * for Woocommerce authentication
	 */
	const api = new WooCommerceRestApi({
		url: envVars.GS_SITE_URL,
		consumerKey: envVars.WC_CONSUMER_KEY,
		consumerSecret: envVars.WC_CONSUMER_SECRET,
		version: 'wc/v3',
		headers: {
			'Custom-User-Agent': 'WooCommerceAPIClient', // Replace User-Agent with a custom header
		},
	});
	try {
		const wooAPIResponse = await api.get(restURL.toString(), params);
		await new Promise((resolve) => setTimeout(resolve, 8 * 1000)); // Wait for 3 minutes
		return await wooAPIResponse.data;
	} catch (error) {
		/**
		 * To get error details console below details
		 * message: error.message,
		 * status: error.response?.status,
		 * headers: error.response?.headers,
		 * data: error.response?.data,
		 */
		return Promise.reject(
			/**
			 * Explanation of error.response?.data?.message:
				👉 error: This is the error object thrown by the api.get() call. It contains details about what went wrong.
				👉 error.response: This property (if available) contains the HTTP response returned by the server when the request fails. It includes details like the status code, headers, and response body.
				👉 error.response?.data: This accesses the data property of the response, which typically contains the body of the error response sent by the server. The ?. (optional chaining) ensures that the code doesn't throw an error if response or data is undefined.
				👉 error.response?.data?.message: This accesses the message property within the data object. The message usually contains a human-readable description of the error, such as "Invalid API key" or "Resource not found."
			 */
			new Error(error.response?.data?.message || error.message)
		);
	}
}
