/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "react":
/*!************************!*\
  !*** external "React" ***!
  \************************/
/***/ ((module) => {

module.exports = window["React"];

/***/ }),

/***/ "react/jsx-runtime":
/*!**********************************!*\
  !*** external "ReactJSXRuntime" ***!
  \**********************************/
/***/ ((module) => {

module.exports = window["ReactJSXRuntime"];

/***/ }),

/***/ "@wordpress/element":
/*!*********************************!*\
  !*** external ["wp","element"] ***!
  \*********************************/
/***/ ((module) => {

module.exports = window["wp"]["element"];

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
/*!****************************************!*\
  !*** ./src/blocks/movie-lists/view.js ***!
  \****************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__);


/**
 * Select elements
 */

let cardElement = document.querySelectorAll('.movie-card');
var modlCardElement = document.querySelectorAll('#popup-modal-for-movie-card');
var modalCloseElement = document.querySelectorAll('#close-modal');
var fetchedMovieContent = document.getElementById('fetched-movie-content');

/**
 * Hide the modal
 */
modlCardElement[0].style.display = 'none';
/**
 * Close the modal
 */
modalCloseElement[0].addEventListener('click', function () {
  modlCardElement[0].style.display = 'none';
  fetchedMovieContent.innerHTML = '';
});
/**
 * Fetch data from the API
 * @param {string} url url to fetch data from
 * @returns Promise
 */
const GetAPIResponseFromUrl = async (url = '') => {
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI5NDQxMzQ5MmRiNWUyZTRjYTVlOTM0MDJjYTYyM2ZjYSIsIm5iZiI6MTcxOTIwNzU0OC45NzY5OCwic3ViIjoiNjY3OTA0YWNlZmRiOGMxNzc0MGI1MmZkIiwic2NvcGVzIjpbImFwaV9yZWFkIl0sInZlcnNpb24iOjF9.3LtMcOLpN8GfR8UiFDFPUYYHJVft69TrEzPssuTqnBA'
    }
  };
  const getMovieAPIResponse = await fetch(url, options);
  console.log('getMovieAPIResponse', getMovieAPIResponse);
  const getMovieAPIResponseJSON = await getMovieAPIResponse.json();
  if (getMovieAPIResponseJSON.success === false) {
    throw new Error(getMovieAPIResponseJSON.status_message);
  }
  return getMovieAPIResponseJSON;
};
const LoadingState = () => {
  const style = {
    width: '100%',
    height: '100%'
  };
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("div", {
    class: "flex flex-row align-top h-full p-10 gap-5 overflow-hidden",
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("div", {
      className: "left w-1/2 h-full",
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("span", {
        class: "bg-slate-300 flex items-center justify-center text-2xl",
        style: style,
        children: "Image is loading."
      })
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("div", {
      className: "right w-1/2 overflow-scroll items-center justify-center flex text-2xl",
      children: "Data is loading. Please wait..."
    })]
  });
};
const HandleMovieContentRender = props => {
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("div", {
    class: "flex flex-row align-top h-full p-10 gap-5 overflow-hidden",
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("div", {
      className: "left w-1/2 h-full",
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("img", {
        class: "w-full object-cover h-full",
        src: `https://image.tmdb.org/t/p/w500${props.data.poster_path}`,
        alt: props.data.title
      })
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("div", {
      className: "right w-1/2 overflow-scroll",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("h1", {
        class: "text-2xl font-bold font-poppins font-medium",
        children: props.data.title
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("div", {
        className: "overview mb-3",
        children: props.data.overview
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("div", {
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("span", {
          class: "font-bold font-poppins capitalize",
          children: ["genres -", ' ']
        }), props.data.genres.map(genre => genre.name).join(', ')]
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("div", {
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("span", {
          class: "font-bold font-poppins capitalize",
          children: ["Production Companies -", ' ']
        }), props.data.production_companies.map(company => company.name).join(', ')]
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("div", {
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("span", {
          class: "font-bold font-poppins capitalize",
          children: ["Spoken Language -", ' ']
        }), props.data.spoken_languages.map(language => language.name).join(', ')]
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("ul", {
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("li", {
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("span", {
            class: "font-bold font-poppins capitalize",
            children: "ID"
          }), ' ', "- ", props.data.id]
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("li", {
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("span", {
            class: "font-bold font-poppins capitalize",
            children: "Release Data"
          }), ' ', "- ", props.data.release_date]
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("li", {
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("span", {
            class: "font-bold font-poppins capitalize",
            children: "Status"
          }), ' ', "- ", props.data.status]
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("li", {
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("span", {
            class: "font-bold font-poppins capitalize",
            children: "tagline"
          }), ' ', "- ", props.data.tagline]
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("li", {
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("span", {
            class: "font-bold font-poppins capitalize",
            children: "Original language"
          }), ' ', "- ", props.data.original_language]
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("li", {
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("span", {
            class: "font-bold font-poppins capitalize",
            children: "IMDb ID"
          }), ' ', "- ", props.data.imdb_id]
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("li", {
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("span", {
            class: "font-bold font-poppins capitalize",
            children: "video"
          }), ' ', "- ", props.data.video]
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("li", {
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("span", {
            class: "font-bold font-poppins capitalize",
            children: "vote_average"
          }), ' ', "- ", props.data.vote_average]
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("li", {
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("span", {
            class: "font-bold font-poppins capitalize",
            children: "vote_count"
          }), ' ', "- ", props.data.vote_count]
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("li", {
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("span", {
            class: "font-bold font-poppins capitalize",
            children: "runtime"
          }), ' ', "- ", props.data.runtime]
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("li", {
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("span", {
            class: "font-bold font-poppins capitalize",
            children: "revenue"
          }), ' ', "- ", props.data.revenue]
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("li", {
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("span", {
            class: "font-bold font-poppins capitalize",
            children: "homepage"
          }), ' ', "- ", props.data.homepage]
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("li", {
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("span", {
            class: "font-bold font-poppins capitalize",
            children: "budget"
          }), ' ', "- ", props.data.budget]
        })]
      })]
    })]
  });
};
(function ($) {
  $(document).ready(function () {
    function getPageNumberFromUrl(url) {
      // Extract query parameters from the URL
      // var queryParams = getPageNumberFromUrl(anchor.href)
      var queryParams = url.split('&');
      // Iterate through query parameters to find 'page' parameter
      for (var i = 0; i < queryParams.length; i++) {
        var param = queryParams[i].split('=');
        if (param[0] === 'page') {
          return param[1];
        }
      }
      // Return null if 'page' parameter is not found
      return null;
    }
    $(document).on('click', '.movie-list-ajax-number-pagination a', function (e) {
      e.preventDefault();
      var page = $(this).attr('href');
      const urlParams = new URL(page).searchParams;
      const blockId = urlParams.get('blockId');
      var pageNumber = getPageNumberFromUrl(page);
      pageNumber = pageNumber ? pageNumber : 1;
      $.ajax({
        url: anamajaxpagination.ajaxurl,
        type: 'post',
        data: {
          action: 'popular_movie_pagination',
          pageNumber: pageNumber,
          blockId: blockId
        },
        success: function (response) {
          // console.log('response', response);
          $('.movie-list').empty().append(response);
          $(window).scrollTop(0);
        }
      });
    });
  });
  /**
   * Handle click on movie card
   */
  $(document).on('click', '.new-movie-list-block .movie-list .movie-card', function (e) {
    e.preventDefault();
    var movieId = this.getAttribute('data-movieid');
    handleMovieModelOpen(movieId);
  });
  /**
   * Handle fetch data regarding single movie
   * @param {string} movieID ID of the single movie
   */
  function handleMovieModelOpen(movieID) {
    $('#popup-modal-for-movie-card').css('display', 'flex');
    let movieId = movieID;
    var loading = true;
    if (loading) {
      (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createRoot)(fetchedMovieContent).render( /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(LoadingState, {}));
    }
    GetAPIResponseFromUrl(`https://api.themoviedb.org/3/movie/${movieId}?language=en-US`).then(res => {
      loading = false;
      (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createRoot)(fetchedMovieContent).render( /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(HandleMovieContentRender, {
        data: res
      }));
    }).catch(err => console.log('genre err', err));
  }
})(jQuery);
/******/ })()
;
//# sourceMappingURL=view.js.map