/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ({

/***/ "./assets/src/js/pages/revenue-geneator-welcome.js":
/*!*********************************************************!*\
  !*** ./assets/src/js/pages/revenue-geneator-welcome.js ***!
  \*********************************************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils */ \"./assets/src/js/utils/index.js\");\n/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_utils__WEBPACK_IMPORTED_MODULE_0__);\n/* global revenueGeneratorGlobalOptions */\n\n/**\n * JS to handle plugin welcome screen interactions.\n *\n * @package revenue-generator\n */\n\n/**\n * Internal dependencies.\n */\n\n\n( function( $ ) {\n\t$( function() {\n\t\tfunction revenueGeneratorWelcome() {\n\t\t\t// Welcome screen elements.\n\t\t\tconst $o = {\n\t\t\t\tbody: $( 'body' ),\n\n\t\t\t\t// Welcome screen wrapper.\n\t\t\t\twelcomeScreenWrapper: $( '.welcome-screen-wrapper' ),\n\n\t\t\t\t// Cards.\n\t\t\t\tlowPostCard: $( '#rg_js_lowPostCard' ),\n\t\t\t\thighPostCard: $( '#rg_js_highPostCard' ),\n\n\t\t\t\tsnackBar: $( '#rg_js_SnackBar' ),\n\t\t\t};\n\n\t\t\t/**\n\t\t\t * Bind all element events.\n\t\t\t */\n\t\t\tconst bindEvents = function() {\n\t\t\t\t$o.lowPostCard.on( 'click', function() {\n\t\t\t\t\tstorePostPublishCount( 'low' );\n\t\t\t\t} );\n\n\t\t\t\t$o.highPostCard.on( 'click', function() {\n\t\t\t\t\tstorePostPublishCount( 'high' );\n\t\t\t\t} );\n\t\t\t};\n\n\t\t\t/*\n\t\t\t * Update and store merchant selection for post publish rate.\n\t\t\t */\n\t\t\tconst storePostPublishCount = function( type = 'low' ) {\n\t\t\t\tconst formData = {\n\t\t\t\t\taction: 'rg_update_global_config',\n\t\t\t\t\tconfig_key: 'average_post_publish_count',\n\t\t\t\t\tconfig_value: type,\n\t\t\t\t\tsecurity:\n\t\t\t\t\t\trevenueGeneratorGlobalOptions.rg_global_config_nonce,\n\t\t\t\t};\n\t\t\t\tupdateGlobalConfig(\n\t\t\t\t\trevenueGeneratorGlobalOptions.ajaxUrl,\n\t\t\t\t\tformData\n\t\t\t\t);\n\t\t\t};\n\n\t\t\t/**\n\t\t\t * Update the global config with provided value.\n\t\t\t *\n\t\t\t * @param {string} ajaxURL  AJAX URL.\n\t\t\t * @param {Object} formData Form data to be submitted.\n\t\t\t */\n\t\t\tconst updateGlobalConfig = function( ajaxURL, formData ) {\n\t\t\t\t$.ajax( {\n\t\t\t\t\turl: ajaxURL,\n\t\t\t\t\tmethod: 'POST',\n\t\t\t\t\tdata: formData,\n\t\t\t\t\tdataType: 'json',\n\t\t\t\t} ).done( function( r ) {\n\t\t\t\t\t$o.snackBar.showSnackbar( r.msg, 1500 );\n\t\t\t\t\t$o.welcomeScreenWrapper.fadeOut( 1500, function() {\n\t\t\t\t\t\twindow.location.reload();\n\t\t\t\t\t} );\n\t\t\t\t} );\n\t\t\t};\n\n\t\t\t// Initialize all required events.\n\t\t\tconst initializePage = function() {\n\t\t\t\tbindEvents();\n\t\t\t};\n\t\t\tinitializePage();\n\t\t}\n\n\t\trevenueGeneratorWelcome();\n\t} );\n} )( jQuery ); // eslint-disable-line no-undef\n\n\n//# sourceURL=webpack:///./assets/src/js/pages/revenue-geneator-welcome.js?");

/***/ }),

/***/ "./assets/src/js/pages/revenue-generator-paywall.js":
/*!**********************************************************!*\
  !*** ./assets/src/js/pages/revenue-generator-paywall.js ***!
  \**********************************************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils */ \"./assets/src/js/utils/index.js\");\n/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_utils__WEBPACK_IMPORTED_MODULE_0__);\n/**\n * JS to handle plugin paywall preview screen interactions.\n *\n * @package revenue-generator\n */\n\n/**\n * Internal dependencies.\n */\n\n\n(function ($) {\n\t$(function () {\n\t\tfunction revenueGeneratorPaywallPreview() {\n\t\t\t// Paywall screen elements.\n\t\t\tconst $o = {\n\t\t\t\tbody: $('body'),\n\n\t\t\t\t// Preview wrapper.\n\t\t\t\tpreviewWrapper: $('.rev-gen-preview-main'),\n\n\t\t\t\t// Search elements.\n\t\t\t\tsearchContent: $('#rg_js_searchContent'),\n\n\t\t\t\t// Post elements.\n\t\t\t\tpostPreviewWrapper: $('#rg_js_postPreviewWrapper'),\n\t\t\t\tpostExcerpt       : $('#rg_js_postPreviewExcerpt'),\n\t\t\t\tpostContent       : $('#rg_js_postPreviewContent'),\n\n\t\t\t\t// Overlay elements.\n\t\t\t\tpurchaseOverly    : $('#rg_js_purchaseOverly'),\n\t\t\t\tpurchaseOptionItem: '.rg-purchase-overlay-purchase-options-item',\n\n\t\t\t\t// Action buttons\n\t\t\t\teditOption    : '.rg-purchase-overlay-option-edit',\n\t\t\t\tmoveOptionUp  : '.rg-purchase-overlay-option-up',\n\t\t\t\tmoveOptionDown: '.rg-purchase-overlay-option-down',\n\n\t\t\t\t// Option manager.\n\t\t\t\toptionRemove: '.rg-purchase-overlay-option-remove',\n\n\t\t\t\tsnackBar: $('#rg_js_SnackBar'),\n\t\t\t};\n\n\t\t\t/**\n\t\t\t * Bind all element events.\n\t\t\t */\n\t\t\tconst bindEvents = function () {\n\n\t\t\t\t// When the page has loaded, load the post content.\n\t\t\t\t$(document).ready(function () {\n\t\t\t\t\t$('#rg_js_postPreviewWrapper').fadeIn('slow');\n\n\t\t\t\t\t$( 'div.rg-purchase-overlay-purchase-options' ).sortable({\n\t\t\t\t\t\tcursor: 'move',\n\t\t\t\t\t\tconnectWith: 'div.rg-purchase-overlay-purchase-options-item'\n\t\t\t\t\t});\n\t\t\t\t});\n\n\t\t\t\t// When merchant types in the search box blur out the rest of the area.\n\t\t\t\t$o.searchContent.on('focus', function () {\n\t\t\t\t\t$o.postPreviewWrapper.addClass('blury');\n\t\t\t\t\t$('html, body').animate({scrollTop: 0}, 'slow');\n\t\t\t\t\t$o.body.css({\n\t\t\t\t\t\toverflow: 'hidden',\n\t\t\t\t\t\theight  : '100%',\n\t\t\t\t\t});\n\t\t\t\t});\n\n\t\t\t\t// Revert back to original state once the focus is no more on search box.\n\t\t\t\t$o.searchContent.on('focusout', function () {\n\t\t\t\t\t$o.body.css({\n\t\t\t\t\t\toverflow: 'auto',\n\t\t\t\t\t\theight  : 'auto',\n\t\t\t\t\t});\n\t\t\t\t\t$o.postPreviewWrapper.removeClass('blury');\n\t\t\t\t});\n\n\t\t\t\t// Add action items on purchase item hover.\n\t\t\t\t$o.body.on('mouseenter', $o.purchaseOptionItem, function () {\n\n\t\t\t\t\t// Get the template for purchase overlay action.\n\t\t\t\t\tconst actionTemplate = wp.template('revgen-purchase-overlay-actions');\n\n\t\t\t\t\t// Send the data to our new template function, get the HTML markup back.\n\t\t\t\t\tconst data = {\n\t\t\t\t\t\tshowMoveUp  : $(this).prev('.rg-purchase-overlay-purchase-options-item').length,\n\t\t\t\t\t\tshowMoveDown: $(this).next('.rg-purchase-overlay-purchase-options-item').length\n\t\t\t\t\t};\n\n\t\t\t\t\tconst overlayMarkup = actionTemplate(data);\n\n\t\t\t\t\t// Highlight the current option being edited.\n\t\t\t\t\t$(this).addClass('option-highlight');\n\n\t\t\t\t\t// Add purchase option actions to the highlighted item.\n\t\t\t\t\t$(this).prepend(overlayMarkup);\n\t\t\t\t});\n\n\t\t\t\t// Remove action items when purchase item is not being edited.\n\t\t\t\t$o.body.on('mouseleave', $o.purchaseOptionItem, function () {\n\t\t\t\t\t$(this).removeClass('option-highlight');\n\t\t\t\t\t$(this).find('.rg-purchase-overlay-purchase-options-item-actions').remove();\n\t\t\t\t});\n\n\t\t\t\t$o.body.on('click', $o.editOption, function () {\n\n\t\t\t\t\t// Get the template for purchase overlay action.\n\t\t\t\t\tconst actionTemplate = wp.template('revgen-purchase-overlay-item-manager');\n\n\t\t\t\t\t// Add purchase option manager to the selected item.\n\t\t\t\t\t$(this).prepend(actionTemplate);\n\t\t\t\t});\n\n\t\t\t\t// Remove purchase option.\n\t\t\t\t$o.body.on('click', $o.optionRemove, function () {\n\t\t\t\t\t// @todo add functionality to delete entity from db when removed.\n\t\t\t\t\t$(this).parents('.rg-purchase-overlay-purchase-options-item').remove();\n\t\t\t\t});\n\n\t\t\t\t//  Move purchase option one up.\n\t\t\t\t$o.body.on('click', $o.moveOptionUp, function () {\n\t\t\t\t\tconst pruchaseOption = $(this).parents('.rg-purchase-overlay-purchase-options-item');\n\t\t\t\t\t$(this).parents('.rg-purchase-overlay-purchase-options-item').prev().insertAfter(pruchaseOption);\n\t\t\t\t});\n\n\t\t\t\t//  Move purchase option one down.\n\t\t\t\t$o.body.on('click', $o.moveOptionDown, function () {\n\t\t\t\t\tconst pruchaseOption = $(this).parents('.rg-purchase-overlay-purchase-options-item');\n\t\t\t\t\t$(this).parents('.rg-purchase-overlay-purchase-options-item').next().insertBefore(pruchaseOption);\n\t\t\t\t});\n\n\t\t\t};\n\n\t\t\t// Add paywall.\n\t\t\tconst addPaywall = function () {\n\t\t\t\tconst postExcerptExists = $o.postExcerpt.length ? true : false;\n\t\t\t\tif ($o.postContent) {\n\t\t\t\t\t// Blur the paid content out.\n\t\t\t\t\t$o.postContent.addClass('blur-content');\n\n\t\t\t\t\t// Get the template for purchase overlay along with data.\n\t\t\t\t\tconst template = wp.template('revgen-purchase-overlay');\n\n\t\t\t\t\t// Send the data to our new template function, get the HTML markup back.\n\t\t\t\t\t$o.purchaseOverly.append(template);\n\t\t\t\t\t$o.purchaseOverly.show();\n\t\t\t\t}\n\t\t\t};\n\n\t\t\t// Initialize all required events.\n\t\t\tconst initializePage = function () {\n\t\t\t\tbindEvents();\n\t\t\t\taddPaywall();\n\t\t\t};\n\t\t\tinitializePage();\n\t\t}\n\n\t\trevenueGeneratorPaywallPreview();\n\t});\n})(jQuery); // eslint-disable-line no-undef\n\n\n//# sourceURL=webpack:///./assets/src/js/pages/revenue-generator-paywall.js?");

/***/ }),

/***/ "./assets/src/js/revenue-generator-admin.js":
/*!**************************************************!*\
  !*** ./assets/src/js/revenue-generator-admin.js ***!
  \**************************************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _pages_revenue_geneator_welcome__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./pages/revenue-geneator-welcome */ \"./assets/src/js/pages/revenue-geneator-welcome.js\");\n/* harmony import */ var _pages_revenue_generator_paywall__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./pages/revenue-generator-paywall */ \"./assets/src/js/pages/revenue-generator-paywall.js\");\n/**\n * Import all required admin scripts here.\n *\n * @package revenue-generator\n */\n\n\n\n\n\n//# sourceURL=webpack:///./assets/src/js/revenue-generator-admin.js?");

/***/ }),

/***/ "./assets/src/js/utils/index.js":
/*!**************************************!*\
  !*** ./assets/src/js/utils/index.js ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("/**\n * jQuery plugins used inside the plugin.\n */\n( function( $ ) {\n\t/**\n\t * Show snackbar with message.\n\t *\n\t * @param {string} message  Message to be displayed in snackbar.\n\t * @param {number} duration Duration for setTimeout.\n\t */\n\t$.fn.showSnackbar = function( message, duration ) {\n\t\tconst $container = $( this );\n\t\t$container.text( message );\n\t\t$container.addClass( 'rev-gen-snackbar--show' );\n\t\tsetTimeout( function() {\n\t\t\t$container.removeClass( 'rev-gen-snackbar--show' );\n\t\t}, duration );\n\t};\n} )( jQuery ); // eslint-disable-line no-undef\n\n\n//# sourceURL=webpack:///./assets/src/js/utils/index.js?");

/***/ }),

/***/ "./assets/src/scss/revenue-generator-admin.scss":
/*!******************************************************!*\
  !*** ./assets/src/scss/revenue-generator-admin.scss ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("// extracted by mini-css-extract-plugin\n\n//# sourceURL=webpack:///./assets/src/scss/revenue-generator-admin.scss?");

/***/ }),

/***/ 0:
/*!*******************************************************************************************************!*\
  !*** multi ./assets/src/js/revenue-generator-admin.js ./assets/src/scss/revenue-generator-admin.scss ***!
  \*******************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("__webpack_require__(/*! ./assets/src/js/revenue-generator-admin.js */\"./assets/src/js/revenue-generator-admin.js\");\nmodule.exports = __webpack_require__(/*! ./assets/src/scss/revenue-generator-admin.scss */\"./assets/src/scss/revenue-generator-admin.scss\");\n\n\n//# sourceURL=webpack:///multi_./assets/src/js/revenue-generator-admin.js_./assets/src/scss/revenue-generator-admin.scss?");

/***/ })

/******/ });