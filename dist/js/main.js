import _slicedToArray from "@babel/runtime/helpers/slicedToArray";
var registerPlugin = wp.plugins.registerPlugin;
var useSelect = wp.data.useSelect;
var _wp$element = wp.element,
  useEffect = _wp$element.useEffect,
  useState = _wp$element.useState;
console.log('hello from main.js');
var BlockMonitor = function BlockMonitor() {
  var postId = useSelect(function (select) {
    return select('core/editor').getCurrentPostId();
  });
  var _useState = useState([]),
    _useState2 = _slicedToArray(_useState, 2),
    prevBlocks = _useState2[0],
    setPrevBlocks = _useState2[1];
  // Get all blocks in the editor
  var blocks = useSelect(function (select) {
    return select('core/block-editor').getBlocks();
  });
  var restRouteForRemoveMeta = '/wp-json/anam-gutenberg-starter-block/v1/remove-meta';
  useEffect(function () {
    // Find removed blocks
    var removedBlocks = prevBlocks.filter(function (prevBlock) {
      return !blocks.some(function (block) {
        return block.clientId === prevBlock.clientId;
      });
    });
    removedBlocks.forEach(function (block) {
      if (block.name === 'anam-gutenberg-starter-block/theatres-movies') {
        // split the block name to get the block slug
        var blockSlug = block.name.split('/')[1];
        /**
         * Fetch meta status from the API
         */
        var metaRemoveStatusPromise = fetch("".concat(restRouteForRemoveMeta, "/").concat(postId), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            blockSlug: blockSlug
          })
        });
        metaRemoveStatusPromise.then(function (response) {
          if (!response.ok) {
            throw new Error("HTTP error! Status: ".concat(response.status));
          }
          return response.json(); // Parse the response JSON
        }).then(function (data) {
          // delete meta status from localStorage
          localStorage.removeItem("meta_status_".concat(postId));
        })["catch"](function (error) {
          console.error('Error adding meta:', error);
        });
      }
    });

    // Update previous blocks state
    setPrevBlocks(blocks);
  }, [blocks]);
  return null; // This plugin does not render anything in the UI
};

// Register the plugin
registerPlugin('block-removal-alert', {
  render: BlockMonitor
});