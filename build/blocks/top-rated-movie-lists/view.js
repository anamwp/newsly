/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/blocks/components/HandleModal.js":
/*!**********************************************!*\
  !*** ./src/blocks/components/HandleModal.js ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__);



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

/**
 * Handle fetch data regarding single movie
 * @param {string} movieID ID of the single movie
 */
function handleMovieModelOpen(movieID) {
  var fetchedMovieContent = document.querySelector('#fetched-movie-content');
  document.querySelector('#popup-modal-for-movie-card').setAttribute('style', 'display: flex;');
  // .css('display', 'flex');
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
const HandleModal = (cardSelector, modalSelector) => {
  var modlCardElement = document.querySelectorAll(modalSelector);
  if (modlCardElement) {
    modlCardElement.forEach(modlCardElement => {
      const closeModalElement = modlCardElement.querySelector('#close-modal');
      var fetchedMovieContent = modlCardElement.querySelector('#fetched-movie-content');
      /**
       * Hide the modal
       */
      modlCardElement.style.display = 'none';
      /**
       * Close the modal
       */
      closeModalElement.addEventListener('click', function () {
        modlCardElement.style.display = 'none';
        fetchedMovieContent.innerHTML = '';
      });
    });
  }

  /**
   * Handle click on movie card
   */
  const MovieCardNode = document.querySelectorAll(cardSelector);
  MovieCardNode.forEach(node => {
    node.addEventListener('click', e => {
      e.preventDefault();
      var movieId = node.getAttribute('data-movieid');
      handleMovieModelOpen(movieId);
    });
  });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (HandleModal);

/***/ }),

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
/*!**************************************************!*\
  !*** ./src/blocks/top-rated-movie-lists/view.js ***!
  \**************************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _components_HandleModal__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../components/HandleModal */ "./src/blocks/components/HandleModal.js");
// import React from 'react';
// import { createRoot } from '@wordpress/element';


(0,_components_HandleModal__WEBPACK_IMPORTED_MODULE_0__["default"])('#top-rated-movie-lists.movie-list .card', '#popup-modal-for-movie-card');

// /**
//  * Select elements
//  */
// let cardElement = document.querySelectorAll('.card');
// var modlCardElement = document.querySelectorAll('#popup-modal-for-movie-card');
// var modalCloseElement = document.querySelectorAll('#close-modal');
// var fetchedMovieContent = document.getElementById('fetched-movie-content');
// console.log('fetchedMovieContent', fetchedMovieContent);
// /**
//  * Hide the modal
//  */
// modlCardElement[0].style.display = 'none';
// /**
//  * Close the modal
//  */
// modalCloseElement[0].addEventListener('click', function () {
// 	modlCardElement[0].style.display = 'none';
// 	fetchedMovieContent.innerHTML = '';
// });
// const GetAPIResponseFromUrl = async (url = '') => {
// 	const options = {
// 		method: 'GET',
// 		headers: {
// 			accept: 'application/json',
// 			Authorization:
// 				'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI5NDQxMzQ5MmRiNWUyZTRjYTVlOTM0MDJjYTYyM2ZjYSIsIm5iZiI6MTcxOTIwNzU0OC45NzY5OCwic3ViIjoiNjY3OTA0YWNlZmRiOGMxNzc0MGI1MmZkIiwic2NvcGVzIjpbImFwaV9yZWFkIl0sInZlcnNpb24iOjF9.3LtMcOLpN8GfR8UiFDFPUYYHJVft69TrEzPssuTqnBA',
// 		},
// 	};
// 	const getMovieAPIResponse = await fetch(url, options);
// 	const getMovieAPIResponseJSON = await getMovieAPIResponse.json();
// 	if (getMovieAPIResponseJSON.success === false) {
// 		throw new Error(getMovieAPIResponseJSON.status_message);
// 	}
// 	return getMovieAPIResponseJSON;
// };
// const LoadingState = () => {
// 	console.log('hello');
// 	return <div>Loading...</div>;
// };
// const HandleMovieContentRender = (props) => {
// 	return (
// 		<div class="flex flex-row align-top h-full p-10 gap-5 overflow-hidden">
// 			<div className="left w-1/2 h-full">
// 				<img
// 					class="w-full object-cover h-full"
// 					src={`https://image.tmdb.org/t/p/w500${props.data.poster_path}`}
// 					alt={props.data.title}
// 				/>
// 			</div>
// 			<div className="right w-1/2 overflow-scroll">
// 				<h1 class="text-2xl font-bold font-poppins font-medium">
// 					{props.data.title}
// 				</h1>
// 				<div className="overview mb-3">{props.data.overview}</div>
// 				<div>
// 					<span class="font-bold font-poppins capitalize">
// 						genres -{' '}
// 					</span>
// 					{props.data.genres.map((genre) => genre.name).join(', ')}
// 				</div>
// 				<div>
// 					<span class="font-bold font-poppins capitalize">
// 						Production Companies -{' '}
// 					</span>
// 					{props.data.production_companies
// 						.map((company) => company.name)
// 						.join(', ')}
// 				</div>
// 				<div>
// 					<span class="font-bold font-poppins capitalize">
// 						Spoken Language -{' '}
// 					</span>
// 					{props.data.spoken_languages
// 						.map((language) => language.name)
// 						.join(', ')}
// 				</div>
// 				<ul>
// 					<li>
// 						<span class="font-bold font-poppins capitalize">
// 							ID
// 						</span>{' '}
// 						- {props.data.id}
// 					</li>
// 					<li>
// 						<span class="font-bold font-poppins capitalize">
// 							Release Data
// 						</span>{' '}
// 						- {props.data.release_date}
// 					</li>
// 					<li>
// 						<span class="font-bold font-poppins capitalize">
// 							Status
// 						</span>{' '}
// 						- {props.data.status}
// 					</li>
// 					<li>
// 						<span class="font-bold font-poppins capitalize">
// 							tagline
// 						</span>{' '}
// 						- {props.data.tagline}
// 					</li>
// 					<li>
// 						<span class="font-bold font-poppins capitalize">
// 							Original language
// 						</span>{' '}
// 						- {props.data.original_language}
// 					</li>
// 					<li>
// 						<span class="font-bold font-poppins capitalize">
// 							IMDb ID
// 						</span>{' '}
// 						- {props.data.imdb_id}
// 					</li>
// 					<li>
// 						<span class="font-bold font-poppins capitalize">
// 							video
// 						</span>{' '}
// 						- {props.data.video}
// 					</li>
// 					<li>
// 						<span class="font-bold font-poppins capitalize">
// 							vote_average
// 						</span>{' '}
// 						- {props.data.vote_average}
// 					</li>
// 					<li>
// 						<span class="font-bold font-poppins capitalize">
// 							vote_count
// 						</span>{' '}
// 						- {props.data.vote_count}
// 					</li>
// 					<li>
// 						<span class="font-bold font-poppins capitalize">
// 							runtime
// 						</span>{' '}
// 						- {props.data.runtime}
// 					</li>
// 					<li>
// 						<span class="font-bold font-poppins capitalize">
// 							revenue
// 						</span>{' '}
// 						- {props.data.revenue}
// 					</li>
// 					<li>
// 						<span class="font-bold font-poppins capitalize">
// 							homepage
// 						</span>{' '}
// 						- {props.data.homepage}
// 					</li>
// 					<li>
// 						<span class="font-bold font-poppins capitalize">
// 							budget
// 						</span>{' '}
// 						- {props.data.budget}
// 					</li>
// 				</ul>
// 			</div>
// 		</div>
// 	);
// };
// /**
//  * Open the modal
//  */
// cardElement.forEach((element) => {
// 	element.addEventListener('click', function () {
// 		modlCardElement[0].style.display = 'flex';
// 		let movieId = this.getAttribute('data-movieId');
// 		GetAPIResponseFromUrl(
// 			`https://api.themoviedb.org/3/movie/${movieId}?language=en-US`
// 		)
// 			.then((res) => {
// 				console.log('res from api', res);
// 				// setAttributes({ genres: res.genres });
// 				// fetchedMovieContent.append(res);
// 				// var NewContent = ;
// 				// NewContent.then((res) => {
// 				// 	console.log('resss', res);
// 				// });
// 				// console.log(JSON.stringify(NewContent));
// 				createRoot(fetchedMovieContent).render(
// 					<HandleMovieContentRender data={res} />
// 				);

// 				// fetchedMovieContent.render(<h1>Hello world</h1>);
// 			})
// 			.catch((err) => console.log('genre err', err));
// 	});
// });
/******/ })()
;
//# sourceMappingURL=view.js.map