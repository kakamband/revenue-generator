!function(e){var n={};function o(r){if(n[r])return n[r].exports;var t=n[r]={i:r,l:!1,exports:{}};return e[r].call(t.exports,t,t.exports,o),t.l=!0,t.exports}o.m=e,o.c=n,o.d=function(e,n,r){o.o(e,n)||Object.defineProperty(e,n,{enumerable:!0,get:r})},o.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},o.t=function(e,n){if(1&n&&(e=o(e)),8&n)return e;if(4&n&&"object"==typeof e&&e&&e.__esModule)return e;var r=Object.create(null);if(o.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:e}),2&n&&"string"!=typeof e)for(var t in e)o.d(r,t,function(n){return e[n]}.bind(null,t));return r},o.n=function(e){var n=e&&e.__esModule?function(){return e.default}:function(){return e};return o.d(n,"a",n),n},o.o=function(e,n){return Object.prototype.hasOwnProperty.call(e,n)},o.p="",o(o.s=1)}([function(e,n){var o;(o=jQuery).fn.showSnackbar=function(e,n){const r=o(this);r.text(e),r.addClass("rev-gen-snackbar--show"),setTimeout((function(){r.removeClass("rev-gen-snackbar--show")}),n)}},function(e,n,o){o(4),e.exports=o(2)},function(e,n,o){},,function(e,n,o){"use strict";o.r(n);var r;o(0);(r=jQuery)((function(){!function(){const e={body:r("body"),welcomeScreenWrapper:r(".welcome-screen-wrapper"),lowPostCard:r("#rg_js_lowPostCard"),highPostCard:r("#rg_js_highPostCard"),snackBar:r("#rg_js_SnackBar")},n=function(e="low"){const n={action:"rg_update_global_config",config_key:"average_post_publish_count",config_value:e,security:revenueGeneratorGlobalOptions.rg_global_config_nonce};o(revenueGeneratorGlobalOptions.ajaxUrl,n)},o=function(n,o){r.ajax({url:n,method:"POST",data:o,dataType:"json"}).done((function(n){e.snackBar.showSnackbar(n.msg,1500),e.welcomeScreenWrapper.fadeOut(1500,(function(){window.location.reload()}))}))};e.lowPostCard.on("click",(function(){n("low")})),e.highPostCard.on("click",(function(){n("high")}))}()})),function(e){e((function(){!function(){const n={body:e("body"),previewWrapper:e(".rev-gen-preview-main"),searchContent:e("#rg_js_searchContent"),postPreviewWrapper:e("#rg_js_postPreviewWrapper"),postExcerpt:e("#rg_js_postPreviewExcerpt"),postContent:e("#rg_js_postPreviewContent"),purchaseOverly:e("#rg_js_purchaseOverly"),snackBar:e("#rg_js_SnackBar")};e(document).ready((function(){e("#rg_js_postPreviewWrapper").fadeIn("slow")})),n.searchContent.on("focus",(function(){n.postPreviewWrapper.addClass("blury"),e("html, body").animate({scrollTop:0},"slow"),n.body.css({overflow:"hidden",height:"100%"})})),n.searchContent.on("focusout",(function(){n.body.css({overflow:"auto",height:"auto"}),n.postPreviewWrapper.removeClass("blury")})),function(){if(n.postExcerpt.length,n.postContent){n.postContent.addClass("blur-content");const e=wp.template("revgen-purchase-overlay")();n.purchaseOverly.append(e),n.purchaseOverly.show()}}()}()}))}(jQuery)}]);