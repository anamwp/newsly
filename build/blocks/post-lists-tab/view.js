/******/ (() => { // webpackBootstrap
/*!*******************************************!*\
  !*** ./src/blocks/post-lists-tab/view.js ***!
  \*******************************************/
var handleCategoryChange = function handleCategoryChange(event) {
  // console.log('handleCategoryChange', jQuery);
  var $ = jQuery;
  event.preventDefault();
  var catSlug = event.currentTarget.getAttribute('data-cat-slug');
  categoryButton.forEach(function (btn) {
    return btn.classList.remove('active', 'bg-slate-800', 'text-white', 'border-slate-800');
  });
  event.currentTarget.classList.add('active', 'bg-slate-800', 'text-white', 'border-slate-800');
  $.ajax({
    url: anamajaxpagination.ajaxurl,
    type: 'post',
    data: {
      action: 'handle_category_post_content',
      catSlug: catSlug,
      gsAjaxNonce: anamajaxpagination.gs_ajax_nonce
      // blockId: blockId,
    },
    success: function success(response) {
      // clean post-list-tab-post-content id inner html
      $('#post-list-tab-post-content').empty().append(response);
      // console.log('response', response);
      // $('.movie-list').empty().append(response);
      // $(window).scrollTop(0);
    }
  });
};
var categoryButton = document.querySelectorAll('.post-lists-tab .tablinks');
categoryButton.forEach(function (element) {
  element.addEventListener('click', handleCategoryChange);
});
/******/ })()
;
//# sourceMappingURL=view.js.map