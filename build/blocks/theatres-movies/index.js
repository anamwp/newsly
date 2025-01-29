/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/blocks/components/FetchMovie.js":
/*!*********************************************!*\
  !*** ./src/blocks/components/FetchMovie.js ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
const FetchMovie = async (url = '') => {
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
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (FetchMovie);

/***/ }),

/***/ "./src/blocks/theatres-movies/edit.js":
/*!********************************************!*\
  !*** ./src/blocks/theatres-movies/edit.js ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ edit)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/data */ "@wordpress/data");
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_data__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _sidebarControl__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./sidebarControl */ "./src/blocks/theatres-movies/sidebarControl.js");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__);







/**
 * Function to fetch API response from URL
 * @param {url} url API URL
 * @returns
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
/**
 * Handle Genre Render
 * @param {*} param0
 * @returns
 */
const HandleGenreRender = ({
  genreIDArr,
  attributes
}) => {
  // console.log('IDs', genreIDArr);
  let getGenre = attributes.genres;
  // let isFound = getGenre.some((ai) => genreIDArr.includes(ai));
  let newGenreArr = getGenre.filter(ai => genreIDArr.includes(ai.id));
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("ul", {
    children: newGenreArr.map(genre => {
      return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("li", {
        children: genre.name
      }, genre.id);
    })
  });
  // return newGenreArr;
  // console.log('getGenre', newGenreArr);
  // console.log('is found', isFound);
};
const HandleRoundNumber = (number, decimal_digit) => {
  let powerOften = Math.pow(10, decimal_digit);
  let result = Math.round(number * powerOften) / powerOften;
  return result;
};
const HandleDate = date => {
  let dateParseString = Date.parse(date);
  let newDate = new Date(dateParseString);
  let getYear = newDate.getFullYear();
  return getYear;
};
/**
 * Movie Card Component
 * @param {*} param0
 * @returns
 */
const MovieCard = ({
  movie,
  attributes
}) => {
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)("div", {
    className: "card",
    "data-movieid": movie.id,
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)("div", {
      className: "card__image",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("img", {
        src: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
        alt: movie.title
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)("div", {
        className: "rating-point",
        children: [attributes.showVoteAverage && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("span", {
          className: "vote-point",
          children: HandleRoundNumber(movie.vote_average, 1)
        }), attributes.showVoteCount && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("span", {
          class: "vote-count",
          children: movie.vote_count
        })]
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)("div", {
        className: "language-and-yeaer",
        children: [attributes.showLanguage && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("span", {
          className: "language",
          children: movie.original_language
        }), attributes.showReleaseDate && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("span", {
          className: "year",
          children: HandleDate(movie.release_date)
        })]
      })]
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("div", {
      class: "card__header",
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("h2", {
        children: movie.title
      })
    }), attributes.showDescription && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("div", {
      className: "card__body",
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("p", {
        children: movie.overview
      })
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("div", {
      className: "card__footer",
      children: attributes.showGenre && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("div", {
        className: "genre",
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(HandleGenreRender, {
          genreIDArr: movie.genre_ids,
          attributes: attributes
        })
      })
    })]
  });
};
function edit(props) {
  const blockProps = (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.useBlockProps)();
  const {
    attributes,
    setAttributes
  } = props;
  const [isLoading, setIsLoading] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_4__.useState)(false);
  const [movies, setMovies] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_4__.useState)([]);
  const handleMovieUpdateForView = newMovies => {
    setMovies(newMovies);
  };
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_4__.useEffect)(() => {
    /**
     * Fetch genres from the API
     * and set the attributes with the fetched genres
     */
    attributes.genres.length < 1 && GetAPIResponseFromUrl('https://api.themoviedb.org/3/genre/movie/list?language=en').then(res => {
      console.log('res', res);
      setAttributes({
        genres: res.genres
      });
    }).catch(err => console.log('genre err', err));
    /**
     * Fetch movies from the API
     * and set the state
     * with the fetched movies
     */
    attributes.fetchedMovies.length > 0 && setMovies(attributes.fetchedMovies);
    attributes.fetchedMovies.length < 1 && GetAPIResponseFromUrl('https://api.themoviedb.org/3/movie/now_playing?language=en-US&page=1').then(res => {
      console.log('res', res);
      /**
       * Set state with the fetched movies
       */
      setMovies(res.results);
      /**
       * Set attributes with the fetched movies
       */
      setAttributes({
        fetchedMovies: res.results
      });
    }).catch(err => console.log('err', err));
  }, []);
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)("div", {
    ...blockProps,
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_sidebarControl__WEBPACK_IMPORTED_MODULE_3__["default"], {
      props: props,
      handleMovieUpdateForView: handleMovieUpdateForView
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)("div", {
      id: "popup-modal-for-movie-card",
      style: {
        display: 'none'
      },
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("div", {
        id: "close-modal",
        children: "close"
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("div", {
        id: "fetched-movie-content"
      })]
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("div", {
      id: "theatres-movies-block",
      className: "movie-list theatres-movies-block",
      style: {
        gridTemplateColumns: `repeat(
						${attributes.movieColumn}, 1fr
					)`
      },
      children: movies && movies.map(movie => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(MovieCard, {
        movie: movie,
        attributes: attributes
      }, movie.id))
    })]
  });
}

/***/ }),

/***/ "./src/blocks/theatres-movies/index.js":
/*!*********************************************!*\
  !*** ./src/blocks/theatres-movies/index.js ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/blocks */ "@wordpress/blocks");
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_blocks__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _block_json__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./block.json */ "./src/blocks/theatres-movies/block.json");
/* harmony import */ var _edit__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./edit */ "./src/blocks/theatres-movies/edit.js");
/* harmony import */ var _save__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./save */ "./src/blocks/theatres-movies/save.js");
/* harmony import */ var _style_editor_scss__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./style/editor.scss */ "./src/blocks/theatres-movies/style/editor.scss");
/* harmony import */ var _style_frontend_scss__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./style/frontend.scss */ "./src/blocks/theatres-movies/style/frontend.scss");
/* harmony import */ var _style_scss__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./style.scss */ "./src/blocks/theatres-movies/style.scss");





// const { attributes } = metadata;
// console.log(metadata);



(0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_1__.registerBlockType)(_block_json__WEBPACK_IMPORTED_MODULE_2__.name, {
  // apiVersion: 2,
  // title: __('Theatres Movies', 'anam-gutenberg-starter'),
  // icon: 'admin-post',
  // category: 'anam-starter',
  // attributes,
  edit: _edit__WEBPACK_IMPORTED_MODULE_3__["default"],
  save: _save__WEBPACK_IMPORTED_MODULE_4__["default"]
});
// save

/***/ }),

/***/ "./src/blocks/theatres-movies/save.js":
/*!********************************************!*\
  !*** ./src/blocks/theatres-movies/save.js ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ save)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__);




const HandleGenreRender = ({
  genreIDArr,
  attributes
}) => {
  let getGenre = attributes.genres;
  let newGenreArr = getGenre.filter(ai => genreIDArr.includes(ai.id));
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("ul", {
    children: newGenreArr.map(genre => {
      return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("li", {
        children: genre.name
      }, genre.id);
    })
  });
};
const HandleRoundNumber = (number, decimal_digit) => {
  let powerOften = Math.pow(10, decimal_digit);
  let result = Math.round(number * powerOften) / powerOften;
  return result;
};
const HandleDate = date => {
  let dateParseString = Date.parse(date);
  let newDate = new Date(dateParseString);
  let getYear = newDate.getFullYear();
  return getYear;
};
const MovieCard = ({
  movie,
  attributes
}) => {
  // console.log('attributes', attributes);
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("div", {
    className: "card",
    "data-movieid": movie.id,
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("div", {
      className: "card__image",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("img", {
        src: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
        alt: movie.title
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("div", {
        className: "rating-point",
        children: [attributes.showVoteAverage && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("span", {
          className: "vote-point",
          children: HandleRoundNumber(movie.vote_average, 1)
        }), attributes.showVoteCount && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("span", {
          class: "vote-count",
          children: movie.vote_count
        })]
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("div", {
        className: "language-and-yeaer",
        children: [attributes.showLanguage && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("span", {
          className: "language",
          children: movie.original_language
        }), attributes.showReleaseDate && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("span", {
          className: "year",
          children: HandleDate(movie.release_date)
        })]
      })]
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("div", {
      class: "card__header",
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("h2", {
        children: movie.title
      })
    }), attributes.showDescription && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("div", {
      className: "card__body",
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("p", {
        children: movie.overview
      })
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("div", {
      className: "card__footer",
      children: attributes.showGenre && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("div", {
        className: "genre",
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(HandleGenreRender, {
          genreIDArr: movie.genre_ids,
          attributes: attributes
        })
      })
    })]
  });
};
function save({
  attributes
}) {
  const blockProps = _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.useBlockProps.save({
    className: 'gs-theatres-movie-block'
  });
  const fetchedMovies = attributes.fetchedMovies;
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("div", {
    ...blockProps,
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("div", {
      id: "popup-modal-for-movie-card",
      style: {
        display: 'none'
      },
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("div", {
        id: "close-modal",
        children: "close"
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("div", {
        id: "fetched-movie-content"
      })]
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("div", {
      id: "theatres-movies-block",
      className: "movie-list theatres-movies-block",
      style: {
        gridTemplateColumns: `repeat(
						${attributes.movieColumn}, 1fr
					)`
      },
      children: fetchedMovies && fetchedMovies.map(movie => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(MovieCard, {
        movie: movie,
        attributes: attributes
      }, movie.id))
    })]
  });
}

/***/ }),

/***/ "./src/blocks/theatres-movies/sidebarControl.js":
/*!******************************************************!*\
  !*** ./src/blocks/theatres-movies/sidebarControl.js ***!
  \******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ sidebarControl)
/* harmony export */ });
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/data */ "@wordpress/data");
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_data__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _components_FetchMovie__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../components/FetchMovie */ "./src/blocks/components/FetchMovie.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__);








function sidebarControl({
  props,
  // categories,
  // handleCategoryChange,
  // handleSelectedPostData,
  // handleCategoryToggleControl,
  // handleExcerptToggleControl,
  // handleFeaturedImageToggleControl,
  handleMovieUpdateForView
}) {
  const {
    attributes,
    setAttributes
  } = props;
  const [hasFixedBackground, setHasFixedBackground] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_5__.useState)(false);
  const [hasFixedBg, setHasFixedBg] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_5__.useState)(false);
  const [color, setColor] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_5__.useState)();
  const [date, setDate] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_5__.useState)(new Date());
  const [checkUpdateLoader, setCheckUpdateLoader] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_5__.useState)(false);
  const [updateAttrLoader, setUpdateAttrLoader] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_5__.useState)(false);
  const [updateAvailable, setUpdateAvailable] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_5__.useState)(false);
  const [newUpdatedMovie, setNewUpdatedMovie] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_5__.useState)([]);
  const [checkUpdateMessage, setCheckUpdateMessage] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_5__.useState)('');
  const onSelect = tabName => {
    console.log('Selecting tab', tabName);
  };
  const MyCustomTabContent = () => {
    return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.ToggleControl, {
      label: "Fixed Background",
      help: hasFixedBg ? 'Has fixed background.' : 'No fixed background.',
      checked: hasFixedBg,
      onChange: newValue => {
        setHasFixedBg(newValue);
      }
    });
  };

  // Component: BorderControl
  // Component: BorderBoxControl
  const colors = [{
    name: 'Blue 20',
    color: '#72aee6'
  }];

  // Component: CheckboxControl
  const MyCheckboxControl = () => {
    const [isChecked, setChecked] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_5__.useState)(true);
    return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.CheckboxControl, {
      label: "Is author",
      help: "Is the user a author or not?",
      checked: isChecked,
      onChange: setChecked
    });
  };
  const CardGradientPicker = () => {
    // const [gradient, setGradient] = useState(null);
    // console.log('gradient', gradient);

    return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.GradientPicker, {
      value: attributes.cardGradient,
      onChange: currentGradient => setAttributes({
        cardGradient: currentGradient
      }),
      gradients: [{
        name: 'Black White',
        gradient: 'linear-gradient(180deg,rgba(255, 255, 255, 0) 0%,rgba(0, 0, 0, 0.6) 100%)',
        slug: 'jshine'
      }, {
        name: 'Moonlit Asteroid',
        gradient: 'linear-gradient(180deg,#0F202700 0%, #2c5364 100%)',
        slug: 'moonlit-asteroid'
      }, {
        name: 'Rastafarie',
        gradient: 'linear-gradient(180deg,#1E960000 0%, #FFF200 0%, #FF0000 100%)',
        slug: 'rastafari'
      }]
    });
  };
  const handleCheckForMovieUpdate = (attributes, setAttributes, remoteUrl = '') => {
    setCheckUpdateLoader(true);
    let oldTheatreMovies = attributes.fetchedMovies;
    var newTheatreMovies = [];
    var isChanged;
    let url = remoteUrl;
    let updatedDataPromise = (0,_components_FetchMovie__WEBPACK_IMPORTED_MODULE_6__["default"])(url);
    updatedDataPromise.then(res => {
      newTheatreMovies = res.results;
      /**
       * Check if the data is changed
       */
      isChanged = JSON.stringify(newTheatreMovies) !== JSON.stringify(oldTheatreMovies);
      if (isChanged) {
        setUpdateAvailable(true);
        setCheckUpdateMessage('New movies available');
      } else {
        setUpdateAvailable(false);
        setCheckUpdateMessage('No new movies available');
      }
      setCheckUpdateLoader(false);
      setNewUpdatedMovie(newTheatreMovies);
    }).catch(e => console.log(e));
    /**
     * Todo:
     * 1. Fetch the latest movie data from the API
     * 2. Update the movie data in the block
     * 3. Show a success message
     * 4. Show an error message if the update fails
     * 5. Show a loading spinner while the update is in progress
     * 6. Show a message if the movie data is already up-to-date
     * 7. Show a message if the movie data is not available
     * 8. Show a message if the API request fails
     * 9. Show a message if the API request is unauthorized
     * 10. Show a message if the API request is forbidden
     *
     */
  };
  const handleMovieUpdate = () => {
    setUpdateAttrLoader(true);
    /**
     * Update the movie data in the block attribute
     */
    setAttributes({
      fetchedMovies: newUpdatedMovie
    });
    /**
     * Update parent component with the new movie data
     */
    handleMovieUpdateForView(newUpdatedMovie);
    setTimeout(() => {
      setUpdateAttrLoader(false);
    }, 5000);
  };
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)("div", {
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.InspectorControls, {
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.Panel, {
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.PanelBody, {
          initialOpen: true,
          title: "Update",
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.PanelRow, {
            children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)("div", {
              style: {
                display: 'flex',
                flexDirection: 'column',
                gap: '10px'
              },
              children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.Button, {
                onClick: () => handleCheckForMovieUpdate(attributes, setAttributes, 'https://api.themoviedb.org/3/movie/now_playing?language=en-US&page=1'),
                variant: "primary",
                children: checkUpdateLoader ? 'Loading' : 'Check for Update'
              }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)("div", {
                style: {
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px'
                },
                children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("span", {
                  style: {
                    color: updateAvailable ? 'green' : 'black'
                  },
                  children: checkUpdateMessage
                }), updateAvailable && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.Button, {
                  variant: "secondary",
                  onClick: () => {
                    handleMovieUpdate();
                  },
                  children: updateAttrLoader ? 'Updating' : 'Update'
                })]
              })]
            })
          })
        })
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.Panel, {
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.PanelBody
        // icon="welcome-widgets-menus"
        , {
          initialOpen: true,
          title: "Block Structure",
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.SelectControl, {
            label: "Choose Column",
            value: attributes.movieColumn,
            options: [{
              label: 'Column 2',
              value: 2
            }, {
              label: 'Column 3',
              value: 3
            }, {
              label: 'Column 4',
              value: 4
            }],
            onChange: newSize => {
              setAttributes({
                movieColumn: +newSize
              });
            }
          })
        })
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.Panel, {
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.PanelBody
        // icon="welcome-widgets-menus"
        , {
          initialOpen: true,
          title: "Meta Information",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.CheckboxControl, {
            label: "Description",
            help: "Show description of the movie in the card.",
            checked: attributes.showDescription,
            onChange: newValue => {
              setAttributes({
                showDescription: newValue
              });
            }
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.CheckboxControl, {
            label: "Genre",
            help: "Show genre of the movie in the card.",
            checked: attributes.showGenre,
            onChange: newValue => {
              setAttributes({
                showGenre: newValue
              });
            }
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.CheckboxControl, {
            label: "Language",
            help: "Show Language of the movie in the card.",
            checked: attributes.showLanguage,
            onChange: newValue => {
              setAttributes({
                showLanguage: newValue
              });
            }
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.CheckboxControl, {
            label: "Release Date",
            help: "Show release date of the movie in the card.",
            checked: attributes.showReleaseDate,
            onChange: newValue => {
              setAttributes({
                showReleaseDate: newValue
              });
            }
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.CheckboxControl, {
            label: "Vote Count",
            help: "Show vote count of the movie in the card.",
            checked: attributes.showVoteCount,
            onChange: newValue => {
              setAttributes({
                showVoteCount: newValue
              });
            }
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.CheckboxControl, {
            label: "Vote Average",
            help: "Show vote average of the movie in the card.",
            checked: attributes.showVoteAverage,
            onChange: newValue => {
              setAttributes({
                showVoteAverage: newValue
              });
            }
          })]
        })
      })]
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.InspectorControls, {
      group: "styles",
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.Panel, {
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.PanelBody
        // icon="welcome-widgets-menus"
        , {
          initialOpen: true,
          title: "Gradient",
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(CardGradientPicker, {})
        })
      })
    })]
  });
}

/***/ }),

/***/ "./src/blocks/theatres-movies/style.scss":
/*!***********************************************!*\
  !*** ./src/blocks/theatres-movies/style.scss ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./src/blocks/theatres-movies/style/editor.scss":
/*!******************************************************!*\
  !*** ./src/blocks/theatres-movies/style/editor.scss ***!
  \******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./src/blocks/theatres-movies/style/frontend.scss":
/*!********************************************************!*\
  !*** ./src/blocks/theatres-movies/style/frontend.scss ***!
  \********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


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

/***/ "@wordpress/block-editor":
/*!*************************************!*\
  !*** external ["wp","blockEditor"] ***!
  \*************************************/
/***/ ((module) => {

module.exports = window["wp"]["blockEditor"];

/***/ }),

/***/ "@wordpress/blocks":
/*!********************************!*\
  !*** external ["wp","blocks"] ***!
  \********************************/
/***/ ((module) => {

module.exports = window["wp"]["blocks"];

/***/ }),

/***/ "@wordpress/components":
/*!************************************!*\
  !*** external ["wp","components"] ***!
  \************************************/
/***/ ((module) => {

module.exports = window["wp"]["components"];

/***/ }),

/***/ "@wordpress/data":
/*!******************************!*\
  !*** external ["wp","data"] ***!
  \******************************/
/***/ ((module) => {

module.exports = window["wp"]["data"];

/***/ }),

/***/ "@wordpress/element":
/*!*********************************!*\
  !*** external ["wp","element"] ***!
  \*********************************/
/***/ ((module) => {

module.exports = window["wp"]["element"];

/***/ }),

/***/ "@wordpress/i18n":
/*!******************************!*\
  !*** external ["wp","i18n"] ***!
  \******************************/
/***/ ((module) => {

module.exports = window["wp"]["i18n"];

/***/ }),

/***/ "./src/blocks/theatres-movies/block.json":
/*!***********************************************!*\
  !*** ./src/blocks/theatres-movies/block.json ***!
  \***********************************************/
/***/ ((module) => {

module.exports = /*#__PURE__*/JSON.parse('{"$schema":"https://schemas.wp.org/trunk/block.json","apiVersion":3,"name":"anam-gutenberg-starter-block/theatres-movies","version":"0.1.0","title":"Theatres Movies","category":"widgets","icon":"media-interactive","description":"An interactive block with the Interactivity API","example":{},"supports":{"html":false},"attributes":{"postId":{"type":"number","default":null},"genres":{"type":"array","default":[]},"selectedCategroyId":{"type":"string","default":""},"selectedPostId":{"type":"string","default":""},"selectedCategoryPosts":{"type":"array","default":[]},"fetchedMovies":{"type":"array","default":[]},"movieColumn":{"type":"number","default":4},"showDescription":{"type":"boolean","default":false},"showGenre":{"type":"boolean","default":true},"showLanguage":{"type":"boolean","default":true},"showReleaseDate":{"type":"boolean","default":true},"showVoteCount":{"type":"boolean","default":true},"showVoteAverage":{"type":"boolean","default":true},"cardGradient":{"type":"string","default":"linear-gradient(180deg, rgba(255,255,255,0.) 0%, rgba(0,0,0,0.6) 100%)"}},"textdomain":"anam-gutenberg-starter","editorScript":"file:./index.js","editorStyle":"file:./index.css","style":"file:./style-index.css","viewScript":"file:./view.js"}');

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
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/chunk loaded */
/******/ 	(() => {
/******/ 		var deferred = [];
/******/ 		__webpack_require__.O = (result, chunkIds, fn, priority) => {
/******/ 			if(chunkIds) {
/******/ 				priority = priority || 0;
/******/ 				for(var i = deferred.length; i > 0 && deferred[i - 1][2] > priority; i--) deferred[i] = deferred[i - 1];
/******/ 				deferred[i] = [chunkIds, fn, priority];
/******/ 				return;
/******/ 			}
/******/ 			var notFulfilled = Infinity;
/******/ 			for (var i = 0; i < deferred.length; i++) {
/******/ 				var chunkIds = deferred[i][0];
/******/ 				var fn = deferred[i][1];
/******/ 				var priority = deferred[i][2];
/******/ 				var fulfilled = true;
/******/ 				for (var j = 0; j < chunkIds.length; j++) {
/******/ 					if ((priority & 1 === 0 || notFulfilled >= priority) && Object.keys(__webpack_require__.O).every((key) => (__webpack_require__.O[key](chunkIds[j])))) {
/******/ 						chunkIds.splice(j--, 1);
/******/ 					} else {
/******/ 						fulfilled = false;
/******/ 						if(priority < notFulfilled) notFulfilled = priority;
/******/ 					}
/******/ 				}
/******/ 				if(fulfilled) {
/******/ 					deferred.splice(i--, 1)
/******/ 					var r = fn();
/******/ 					if (r !== undefined) result = r;
/******/ 				}
/******/ 			}
/******/ 			return result;
/******/ 		};
/******/ 	})();
/******/ 	
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
/******/ 	/* webpack/runtime/jsonp chunk loading */
/******/ 	(() => {
/******/ 		// no baseURI
/******/ 		
/******/ 		// object to store loaded and loading chunks
/******/ 		// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 		// [resolve, reject, Promise] = chunk loading, 0 = chunk loaded
/******/ 		var installedChunks = {
/******/ 			"blocks/theatres-movies/index": 0,
/******/ 			"blocks/theatres-movies/style-index": 0
/******/ 		};
/******/ 		
/******/ 		// no chunk on demand loading
/******/ 		
/******/ 		// no prefetching
/******/ 		
/******/ 		// no preloaded
/******/ 		
/******/ 		// no HMR
/******/ 		
/******/ 		// no HMR manifest
/******/ 		
/******/ 		__webpack_require__.O.j = (chunkId) => (installedChunks[chunkId] === 0);
/******/ 		
/******/ 		// install a JSONP callback for chunk loading
/******/ 		var webpackJsonpCallback = (parentChunkLoadingFunction, data) => {
/******/ 			var chunkIds = data[0];
/******/ 			var moreModules = data[1];
/******/ 			var runtime = data[2];
/******/ 			// add "moreModules" to the modules object,
/******/ 			// then flag all "chunkIds" as loaded and fire callback
/******/ 			var moduleId, chunkId, i = 0;
/******/ 			if(chunkIds.some((id) => (installedChunks[id] !== 0))) {
/******/ 				for(moduleId in moreModules) {
/******/ 					if(__webpack_require__.o(moreModules, moduleId)) {
/******/ 						__webpack_require__.m[moduleId] = moreModules[moduleId];
/******/ 					}
/******/ 				}
/******/ 				if(runtime) var result = runtime(__webpack_require__);
/******/ 			}
/******/ 			if(parentChunkLoadingFunction) parentChunkLoadingFunction(data);
/******/ 			for(;i < chunkIds.length; i++) {
/******/ 				chunkId = chunkIds[i];
/******/ 				if(__webpack_require__.o(installedChunks, chunkId) && installedChunks[chunkId]) {
/******/ 					installedChunks[chunkId][0]();
/******/ 				}
/******/ 				installedChunks[chunkId] = 0;
/******/ 			}
/******/ 			return __webpack_require__.O(result);
/******/ 		}
/******/ 		
/******/ 		var chunkLoadingGlobal = self["webpackChunkanam_gutenberg_starter"] = self["webpackChunkanam_gutenberg_starter"] || [];
/******/ 		chunkLoadingGlobal.forEach(webpackJsonpCallback.bind(null, 0));
/******/ 		chunkLoadingGlobal.push = webpackJsonpCallback.bind(null, chunkLoadingGlobal.push.bind(chunkLoadingGlobal));
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module depends on other loaded chunks and execution need to be delayed
/******/ 	var __webpack_exports__ = __webpack_require__.O(undefined, ["blocks/theatres-movies/style-index"], () => (__webpack_require__("./src/blocks/theatres-movies/index.js")))
/******/ 	__webpack_exports__ = __webpack_require__.O(__webpack_exports__);
/******/ 	
/******/ })()
;
//# sourceMappingURL=index.js.map