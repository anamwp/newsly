function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
// import { registerPlugin } from '@wordpress/plugins';
// import { useSelect } from '@wordpress/data';
// import { useEffect, useState } from '@wordpress/element';

var registerPlugin = wp.plugins.registerPlugin;
var useSelect = wp.data.useSelect;
var _wp$element = wp.element,
  useEffect = _wp$element.useEffect,
  useState = _wp$element.useState;
var BlockMonitor = function BlockMonitor() {
  var _useState = useState([]),
    _useState2 = _slicedToArray(_useState, 2),
    prevBlocks = _useState2[0],
    setPrevBlocks = _useState2[1];
  // Get all blocks in the editor
  var blocks = useSelect(function (select) {
    return select('core/block-editor').getBlocks();
  });
  useEffect(function () {
    // Find removed blocks
    var removedBlocks = prevBlocks.filter(function (prevBlock) {
      return !blocks.some(function (block) {
        return block.clientId === prevBlock.clientId;
      });
    });
    removedBlocks.forEach(function (block) {
      if (block.name === 'anam-gutenberg-starter-block/theatres-movies') {
        alert('Theatres Movies block has been removed!');
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