/******/ (() => { // webpackBootstrap
/*!*************************************************!*\
  !*** ./src/blocks/smart-category-posts/view.js ***!
  \*************************************************/
var handleCategoryChange = function handleCategoryChange(event) {
  var $ = jQuery;
  event.preventDefault();
  var catSlug = event.currentTarget.getAttribute('data-cat-slug');
  var posdID = event.target.parentElement.getAttribute('data-postid');
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
      gsAjaxNonce: anamajaxpagination.gs_ajax_nonce,
      posdID: posdID
    },
    success: function success(response) {
      $('#post-list-tab-post-content').empty().append(response);
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