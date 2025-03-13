/******/ (() => { // webpackBootstrap
/*!**************************************************!*\
  !*** ./src/blocks/upcoming-movie-slider/view.js ***!
  \**************************************************/
(function ($) {
  $(document).ready(function () {
    $('.upcoming-movie-list').slick({
      arrows: true,
      dots: true,
      autoplay: true,
      slidesToShow: 3,
      slidesToScroll: 3,
      autoplaySpeed: 3000,
      responsive: [{
        breakpoint: 1300,
        settings: {
          arrows: false
        }
      }]
    });
  });
})(jQuery);
/******/ })()
;
//# sourceMappingURL=view.js.map