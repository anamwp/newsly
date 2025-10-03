import { Disabled } from '@wordpress/components';
/**
 * ❗️ Before use this component make sure below data is available ❗️
 * 👉 - postData._embedded['wp:featuredmedia']?.[0]?.source_url
 * 👉 - postData._embedded['wp:term']?.[0]
 * ❗️ Also make sure block having below atttributes ❗️
 * 👉 - attributes.showFeaturedImage
 * 👉 - attributes.showCategory
 * 👉 - attributes.showExcerpt
 */
/**
 * Component to display post card
 * accept props.data - to access post data
 * and props.parent - to access parent attributes where all the block data is stored
 * Way to pass props is - <PostCard data={post} parent={props} />
 * @param {object} props - data and parent
 * @param {object} props.data - post data
 * @param {object} props.parent - parent attributes
 * @returns HTML
 */
const GSPostCardOverlay = (props) => {
	let numberKey = props.numberKey || 0;
	let postData = props.data;
	let parentProps = props.parent;
	const featuredImage =
		postData._embedded['wp:featuredmedia']?.[0]?.source_url;
	const categories = postData._embedded['wp:term']?.[0] || [];
	// console.log('key', props);

	return (
		<div
			data-post-serial={numberKey}
			className="newsly__post_card__overlay bg-slate-200 p-4 rounded hover:bg-slate-300 transition-all"
		>
			{/* 
			if user want to show featured image 
			and post have featured image
			*/}
			{parentProps.attributes.showFeaturedImage &&
				postData.featured_media !== 0 && (
					<div className="mb-4 featured-image">
						<img
							className="inline-block w-full rounded"
							src={featuredImage}
							alt=""
						/>
					</div>
				)}
			{/* 
			If user want to show featured image
			but post have no featured image
			*/}
			{parentProps.attributes.showFeaturedImage &&
				postData.featured_media == 0 && (
					<div className="mb-4 no-featured-image">
						{__(
							'No featured image found',
							'newsly'
						)}
					</div>
				)}
			<div className="content-container">
				<div className="content-wrapper">
					{/* 
					Toggle category display
					*/}
					<div className="mb-3 categories">
						{parentProps.attributes.showCategory &&
							categories &&
							categories.map((singleCat) => {
								return (
									<a
										href={singleCat.link}
										style={{ marginRight: '10px' }}
										className="inline-block no-underline text-xs p-1 mr-1 uppercase ls-2 transition-all single-category"
									>
										{singleCat.name}
									</a>
								);
							})}
					</div>
					{/* 
					Disabled click inside editor
					*/}
					<a
						href={postData.link}
						className="inline-block w-full no-underline font-poppins text-xl text-slate-900 hover:text-slate-600 transition font-medium mb-2"
					>
						<h3>{postData.title.rendered}</h3>
					</a>

					{/* 
					excerpt of the post
					*/}
					{/* <div>{postData.excerpt.rendered}</div> */}
					{parentProps.attributes.showExcerpt &&
						parentProps.attributes.layout === 'card' && (
							<div
								className="font-poppins text-slate-900 mt-2 excerpt"
								dangerouslySetInnerHTML={{
									__html: postData.excerpt.rendered,
								}}
							/>
						)}
					{numberKey === 0 &&
						parentProps.attributes.layout === 'grid' &&
						parentProps.attributes.showFeaturedExcerpt === true && (
							<div
								className="font-poppins text-slate-900 mt-2 excerpt"
								dangerouslySetInnerHTML={{
									__html: postData.excerpt.rendered,
								}}
							/>
						)}
				</div>
			</div>
		</div>
	);
};
export default GSPostCardOverlay;
