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
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils */ \"./assets/src/js/utils/index.js\");\n/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_utils__WEBPACK_IMPORTED_MODULE_0__);\n/* global revenueGeneratorGlobalOptions */\n/**\n * JS to handle plugin paywall preview screen interactions.\n *\n * @package revenue-generator\n */\n\n/**\n * Internal dependencies.\n */\n\n\n(function ($) {\n\t$(function () {\n\t\tfunction revenueGeneratorPaywallPreview() {\n\t\t\t// Paywall screen elements.\n\t\t\tconst $o = {\n\t\t\t\tbody: $('body'),\n\n\t\t\t\t// Preview wrapper.\n\t\t\t\tpreviewWrapper: $('.rev-gen-preview-main'),\n\n\t\t\t\t// Search elements.\n\t\t\t\tsearchContent: $('#rg_js_searchContent'),\n\n\t\t\t\t// Post elements.\n\t\t\t\tpostPreviewWrapper: $('#rg_js_postPreviewWrapper'),\n\t\t\t\tpostExcerpt       : $('#rg_js_postPreviewExcerpt'),\n\t\t\t\tpostContent       : $('#rg_js_postPreviewContent'),\n\n\t\t\t\t// Overlay elements.\n\t\t\t\tpurchaseOverly         : $('#rg_js_purchaseOverly'),\n\t\t\t\tpurchaseOptionItems    : '.rg-purchase-overlay-purchase-options',\n\t\t\t\tpurchaseOptionItem     : '.rg-purchase-overlay-purchase-options-item',\n\t\t\t\tpurchaseOptionItemInfo : '.rg-purchase-overlay-purchase-options-item-info',\n\t\t\t\tpurchaseOptionItemTitle: '.rg-purchase-overlay-purchase-options-item-info-title',\n\t\t\t\tpurchaseOptionItemDesc : '.rg-purchase-overlay-purchase-options-item-info-description',\n\t\t\t\tpurchaseOptionItemPrice: '.rg-purchase-overlay-purchase-options-item-price-span',\n\n\t\t\t\t// Action buttons\n\t\t\t\teditOption    : '.rg-purchase-overlay-option-edit',\n\t\t\t\tmoveOptionUp  : '.rg-purchase-overlay-option-up',\n\t\t\t\tmoveOptionDown: '.rg-purchase-overlay-option-down',\n\n\t\t\t\t// Option manager.\n\t\t\t\toptionRemove              : '.rg-purchase-overlay-option-remove',\n\t\t\t\tpurchaseOptionType        : '#rg_js_purchaseOptionType',\n\t\t\t\tindividualPricingWrapper  : '.rg-purchase-overlay-option-manager-pricing',\n\t\t\t\tindividualPricingSelection: '.rg-purchase-overlay-option-pricing-selection',\n\t\t\t\tpurchaseRevenueWrapper    : '.rg-purchase-overlay-option-manager-revenue',\n\t\t\t\tpurchaseRevenueSelection  : '.rg-purchase-overlay-option-revenue-selection',\n\t\t\t\tdurationWrapper           : '.rg-purchase-overlay-option-manager-duration',\n\t\t\t\tperiodCountSelection      : '.rg-purchase-overlay-option-manager-duration-count',\n\t\t\t\tperiodSelection           : '.rg-purchase-overlay-option-manager-duration-period',\n\n\t\t\t\t// Paywall publish actions.\n\t\t\t\tactivatePaywall     : $('#rg_js_activatePaywall'),\n\t\t\t\tsavePaywall         : $('#rg_js_savePaywall'),\n\t\t\t\tsearchPaywallContent: $('#rg_js_searchPaywallContent'),\n\t\t\t\tpaywallName         : $('.rev-gen-preview-main-paywall-name'),\n\t\t\t\tpaywallTitle        : '.rg-purchase-overlay-title',\n\t\t\t\tpaywallDesc         : '.rg-purchase-overlay-description',\n\n\t\t\t\tsnackBar: $('#rg_js_SnackBar'),\n\t\t\t};\n\n\t\t\t/**\n\t\t\t * Bind all element events.\n\t\t\t */\n\t\t\tconst bindEvents = function () {\n\n\t\t\t\t// When the page has loaded, load the post content.\n\t\t\t\t$(document).ready(function () {\n\t\t\t\t\t$('#rg_js_postPreviewWrapper').fadeIn('slow');\n\t\t\t\t});\n\n\t\t\t\t// When merchant types in the search box blur out the rest of the area.\n\t\t\t\t$o.searchContent.on('focus', function () {\n\t\t\t\t\t$o.postPreviewWrapper.addClass('blury');\n\t\t\t\t\t$('html, body').animate({scrollTop: 0}, 'slow');\n\t\t\t\t\t$o.body.css({\n\t\t\t\t\t\toverflow: 'hidden',\n\t\t\t\t\t\theight  : '100%',\n\t\t\t\t\t});\n\t\t\t\t});\n\n\t\t\t\t// Revert back to original state once the focus is no more on search box.\n\t\t\t\t$o.searchContent.on('focusout', function () {\n\t\t\t\t\t$o.body.css({\n\t\t\t\t\t\toverflow: 'auto',\n\t\t\t\t\t\theight  : 'auto',\n\t\t\t\t\t});\n\t\t\t\t\t$o.postPreviewWrapper.removeClass('blury');\n\t\t\t\t});\n\n\t\t\t\t// Add action items on purchase item hover.\n\t\t\t\t$o.body.on('mouseenter', $o.purchaseOptionItem, function () {\n\n\t\t\t\t\tconst currentActions = $(this).find('.rg-purchase-overlay-purchase-options-item-actions');\n\n\t\t\t\t\tif (currentActions.length) {\n\t\t\t\t\t\tcurrentActions.find('.rg-purchase-overlay-option-manager').hide();\n\t\t\t\t\t\tcurrentActions.show();\n\t\t\t\t\t} else {\n\t\t\t\t\t\t// Get the template for purchase overlay action.\n\t\t\t\t\t\tconst actionTemplate = wp.template('revgen-purchase-overlay-actions');\n\n\t\t\t\t\t\t// Send the data to our new template function, get the HTML markup back.\n\t\t\t\t\t\tconst data = {\n\t\t\t\t\t\t\tshowMoveUp  : $(this).prev('.rg-purchase-overlay-purchase-options-item').length,\n\t\t\t\t\t\t\tshowMoveDown: $(this).next('.rg-purchase-overlay-purchase-options-item').length\n\t\t\t\t\t\t};\n\n\t\t\t\t\t\tconst overlayMarkup = actionTemplate(data);\n\n\t\t\t\t\t\t// Highlight the current option being edited.\n\t\t\t\t\t\t$(this).addClass('option-highlight');\n\n\t\t\t\t\t\t// Add purchase option actions to the highlighted item.\n\t\t\t\t\t\t$(this).prepend(overlayMarkup);\n\t\t\t\t\t}\n\t\t\t\t});\n\n\t\t\t\t// Remove action items when purchase item is not being edited.\n\t\t\t\t$o.body.on('mouseleave', $o.purchaseOptionItem, function () {\n\t\t\t\t\t$(this).removeClass('option-highlight');\n\t\t\t\t\t$(this).find('.rg-purchase-overlay-purchase-options-item-actions').hide();\n\t\t\t\t});\n\n\t\t\t\t$o.body.on('click', $o.editOption, function () {\n\n\t\t\t\t\tconst optionItem = $(this).parents('.rg-purchase-overlay-purchase-options-item');\n\t\t\t\t\tconst actionItems = optionItem.find('.rg-purchase-overlay-purchase-options-item-actions');\n\t\t\t\t\tconst actionManager = actionItems.find('.rg-purchase-overlay-option-manager');\n\n\t\t\t\t\tif (!actionManager.length) {\n\n\t\t\t\t\t\tconst entityType = optionItem.data('purchase-type');\n\n\t\t\t\t\t\t// Send the data to our new template function, get the HTML markup back.\n\t\t\t\t\t\tconst data = {\n\t\t\t\t\t\t\tentityType,\n\t\t\t\t\t\t};\n\n\t\t\t\t\t\t// Get the template for purchase overlay action.\n\t\t\t\t\t\tconst actionTemplate = wp.template('revgen-purchase-overlay-item-manager');\n\n\t\t\t\t\t\tconst actionMarkup = actionTemplate(data);\n\n\t\t\t\t\t\t// Add purchase option manager to the selected item.\n\t\t\t\t\t\tactionItems.prepend(actionMarkup);\n\n\t\t\t\t\t\tif ('individual' !== entityType) {\n\t\t\t\t\t\t\t// hide pricing type selection if not individual.\n\t\t\t\t\t\t\tconst dynamicPricing = actionItems.find($o.individualPricingWrapper);\n\t\t\t\t\t\t\tconst periodSelection = actionItems.find($o.durationWrapper);\n\t\t\t\t\t\t\tdynamicPricing.hide();\n\n\t\t\t\t\t\t\t// show period selection if not individual.\n\t\t\t\t\t\t\tperiodSelection.find($o.periodSelection).val(optionItem.data('expiry-unit'));\n\t\t\t\t\t\t\tperiodSelection.find($o.periodCountSelection).val(optionItem.data('expiry-value'));\n\t\t\t\t\t\t\tperiodSelection.show();\n\t\t\t\t\t\t}\n\n\t\t\t\t\t\tconst revenueWrapper = actionItems.find($o.purchaseRevenueWrapper);\n\t\t\t\t\t\tif ('subscription' === entityType) {\n\t\t\t\t\t\t\trevenueWrapper.hide();\n\t\t\t\t\t\t} else {\n\t\t\t\t\t\t\trevenueWrapper.show();\n\t\t\t\t\t\t}\n\n\t\t\t\t\t} else {\n\t\t\t\t\t\tactionManager.show();\n\t\t\t\t\t}\n\t\t\t\t});\n\n\t\t\t\t// Remove purchase option.\n\t\t\t\t$o.body.on('click', $o.optionRemove, function () {\n\t\t\t\t\t// @todo add functionality to delete entity from db when removed.\n\t\t\t\t\t$(this).parents('.rg-purchase-overlay-purchase-options-item').remove();\n\t\t\t\t});\n\n\t\t\t\t//  Move purchase option one up.\n\t\t\t\t$o.body.on('click', $o.moveOptionUp, function () {\n\t\t\t\t\tconst pruchaseOption = $(this).parents('.rg-purchase-overlay-purchase-options-item');\n\t\t\t\t\t$(this).parents('.rg-purchase-overlay-purchase-options-item').prev().insertAfter(pruchaseOption);\n\t\t\t\t});\n\n\t\t\t\t//  Move purchase option one down.\n\t\t\t\t$o.body.on('click', $o.moveOptionDown, function () {\n\t\t\t\t\tconst purchaseOption = $(this).parents('.rg-purchase-overlay-purchase-options-item');\n\t\t\t\t\t$(this).parents('.rg-purchase-overlay-purchase-options-item').next().insertBefore(purchaseOption);\n\t\t\t\t});\n\n\t\t\t\t// Handle change of purchase option type.\n\t\t\t\t$o.body.on('change', $o.purchaseOptionType, function () {\n\t\t\t\t\tconst purchaseManager = $(this).parents('.rg-purchase-overlay-option-manager');\n\t\t\t\t\tconst pricingManager = purchaseManager.find('.rg-purchase-overlay-option-manager-entity');\n\t\t\t\t\tconst staticPricingOptions = purchaseManager.find($o.individualPricingWrapper);\n\t\t\t\t\tconst revenueWrapper = purchaseManager.find($o.purchaseRevenueWrapper);\n\t\t\t\t\tconst durationWrapper = purchaseManager.find($o.durationWrapper);\n\n\t\t\t\t\t// Hide dynamic pricing selection options if not Individual type.\n\t\t\t\t\tif ('individual' === pricingManager.val()) {\n\t\t\t\t\t\tstaticPricingOptions.show();\n\t\t\t\t\t\tdurationWrapper.hide();\n\t\t\t\t\t} else {\n\t\t\t\t\t\tstaticPricingOptions.hide();\n\t\t\t\t\t\tdurationWrapper.show();\n\t\t\t\t\t}\n\n\t\t\t\t\t// Hide revenue mode selection options if not Subscription type.\n\t\t\t\t\tif ('subscription' === pricingManager.val()) {\n\t\t\t\t\t\trevenueWrapper.hide();\n\t\t\t\t\t} else {\n\t\t\t\t\t\trevenueWrapper.show();\n\t\t\t\t\t}\n\t\t\t\t});\n\n\t\t\t\t// Handle revenue model change.\n\t\t\t\t$o.body.on('change', $o.individualPricingSelection, function () {\n\t\t\t\t\tconst optionItem = $(this).parents($o.purchaseOptionItem);\n\t\t\t\t\tconst purchaseManager = $(this).parents('.rg-purchase-overlay-option-manager');\n\t\t\t\t\tconst pricingSelection = purchaseManager.find($o.individualPricingSelection);\n\t\t\t\t\tif (pricingSelection.prop('checked')) {\n\t\t\t\t\t\toptionItem.data('pricing-type', 'dynamic');\n\t\t\t\t\t\tpricingSelection.val(1);\n\t\t\t\t\t} else {\n\t\t\t\t\t\toptionItem.data('pricing-type', 'static');\n\t\t\t\t\t\tpricingSelection.val(0);\n\t\t\t\t\t}\n\t\t\t\t});\n\n\t\t\t\t// Handle pricing type change for individual type..\n\t\t\t\t$o.body.on('change', $o.purchaseRevenueSelection, function () {\n\t\t\t\t\tconst optionItem = $(this).parents($o.purchaseOptionItem);\n\t\t\t\t\tconst purchaseManager = $(this).parents('.rg-purchase-overlay-option-manager');\n\t\t\t\t\tconst revenueSelection = purchaseManager.find($o.purchaseRevenueSelection);\n\t\t\t\t\tconst priceItem = optionItem.find($o.purchaseOptionItemPrice);\n\t\t\t\t\tif (revenueSelection.prop('checked')) {\n\t\t\t\t\t\tpriceItem.data('pay-model', 'ppu');\n\t\t\t\t\t\trevenueSelection.val(1);\n\t\t\t\t\t} else {\n\t\t\t\t\t\tpriceItem.data('pay-model', 'sis');\n\t\t\t\t\t\trevenueSelection.val(0);\n\t\t\t\t\t}\n\t\t\t\t});\n\n\t\t\t\t// Period selection change handler.\n\t\t\t\t$o.body.on('change', $o.periodSelection, function () {\n\t\t\t\t\tconst purchaseManager = $(this).parents('.rg-purchase-overlay-option-manager');\n\t\t\t\t\tconst periodSelection = purchaseManager.find($o.periodSelection);\n\t\t\t\t\tconst periodCountSelection = purchaseManager.find($o.periodCountSelection);\n\t\t\t\t\tchangeDurationOptions(periodSelection.val(), periodCountSelection);\n\t\t\t\t\tconst optionItem = $(this).parents($o.purchaseOptionItem);\n\t\t\t\t\toptionItem.data('expiry-unit', periodSelection.val());\n\t\t\t\t});\n\n\t\t\t\t// Period count selection change handler.\n\t\t\t\t$o.body.on('change', $o.periodCountSelection, function () {\n\t\t\t\t\tconst purchaseManager = $(this).parents('.rg-purchase-overlay-option-manager');\n\t\t\t\t\tconst periodCountSelection = purchaseManager.find($o.periodCountSelection);\n\t\t\t\t\tconst optionItem = $(this).parents($o.purchaseOptionItem);\n\t\t\t\t\toptionItem.data('expiry-value', periodCountSelection.val());\n\t\t\t\t});\n\n\t\t\t\t$o.savePaywall.on('click', function () {\n\n\t\t\t\t\tconst purchaseOptions = $($o.purchaseOptionItems);\n\n\t\t\t\t\tpurchaseOptions.children($o.purchaseOptionItem).each(function () {\n\t\t\t\t\t\t// To add appropriate ids after saving.\n\t\t\t\t\t\t$(this).data('uid', createUniqueID());\n\t\t\t\t\t});\n\n\t\t\t\t\t// Store individual pricing.\n\t\t\t\t\tconst individualOption = purchaseOptions.find(\"[data-purchase-type='individual']\");\n\t\t\t\t\tlet individualObj;\n\n\t\t\t\t\tif (individualOption.length) {\n\t\t\t\t\t\tindividualObj = {\n\t\t\t\t\t\t\ttitle  : individualOption.find($o.purchaseOptionItemTitle).text().trim(),\n\t\t\t\t\t\t\tdesc   : individualOption.find($o.purchaseOptionItemDesc).text().trim(),\n\t\t\t\t\t\t\tprice  : individualOption.find($o.purchaseOptionItemPrice).text().trim(),\n\t\t\t\t\t\t\trevenue: individualOption.find($o.purchaseOptionItemPrice).data('pay-model'),\n\t\t\t\t\t\t\ttype   : individualOption.data('pricing-type')\n\t\t\t\t\t\t};\n\t\t\t\t\t}\n\n\t\t\t\t\t// Store time pass pricing.\n\t\t\t\t\tconst timePassOptions = purchaseOptions.find(\"[data-purchase-type='time-pass']\");\n\t\t\t\t\tconst timePasses = [];\n\n\t\t\t\t\ttimePassOptions.each(function () {\n\t\t\t\t\t\tconst timePass = $(this);\n\t\t\t\t\t\tconst timePassObj = {\n\t\t\t\t\t\t\ttitle  : timePass.find($o.purchaseOptionItemTitle).text().trim(),\n\t\t\t\t\t\t\tdesc   : timePass.find($o.purchaseOptionItemDesc).text().trim(),\n\t\t\t\t\t\t\tprice  : timePass.find($o.purchaseOptionItemPrice).text().trim(),\n\t\t\t\t\t\t\trevenue: $(timePass.find($o.purchaseOptionItemPrice)).data('pay-model'),\n\t\t\t\t\t\t\tunit   : $(timePass).data('expiry-unit'),\n\t\t\t\t\t\t\tvalue  : $(timePass).data('expiry-value'),\n\t\t\t\t\t\t\ttlp_id : $(timePass).data('tlp-id'),\n\t\t\t\t\t\t\tuid    : $(timePass).data('uid'),\n\t\t\t\t\t\t};\n\t\t\t\t\t\ttimePasses.push(timePassObj)\n\t\t\t\t\t});\n\n\t\t\t\t\t// Store subscription pricing.\n\t\t\t\t\tconst subscriptionOptions = purchaseOptions.find(\"[data-purchase-type='subscription']\");\n\t\t\t\t\tconst subscriptions = [];\n\n\t\t\t\t\tsubscriptionOptions.each(function () {\n\t\t\t\t\t\tconst subscription = $(this);\n\t\t\t\t\t\tconst subscriptionObj = {\n\t\t\t\t\t\t\ttitle  : subscription.find($o.purchaseOptionItemTitle).text().trim(),\n\t\t\t\t\t\t\tdesc   : subscription.find($o.purchaseOptionItemDesc).text().trim(),\n\t\t\t\t\t\t\tprice  : subscription.find($o.purchaseOptionItemPrice).text().trim(),\n\t\t\t\t\t\t\trevenue: $(subscription.find($o.purchaseOptionItemPrice)).data('pay-model'),\n\t\t\t\t\t\t\tunit   : $(subscription).data('expiry-unit'),\n\t\t\t\t\t\t\tvalue  : $(subscription).data('expiry-value'),\n\t\t\t\t\t\t\tsub_id : $(subscription).data('sub-id'),\n\t\t\t\t\t\t\tuid    : $(subscription).data('uid'),\n\t\t\t\t\t\t};\n\t\t\t\t\t\tsubscriptions.push(subscriptionObj)\n\t\t\t\t\t});\n\n\t\t\t\t\tconst paywall = {\n\t\t\t\t\t\tid   : purchaseOptions.data('paywall-id'),\n\t\t\t\t\t\ttitle: $o.purchaseOverly.find($o.paywallTitle).text().trim(),\n\t\t\t\t\t\tdesc : $o.purchaseOverly.find($o.paywallDesc).text().trim(),\n\t\t\t\t\t\tname : $o.paywallName.text().trim(),\n\t\t\t\t\t};\n\n\t\t\t\t\tconst data = {\n\t\t\t\t\t\taction       : 'rg_update_paywall',\n\t\t\t\t\t\tpost_id      : $o.postPreviewWrapper.data('post-id'),\n\t\t\t\t\t\tpaywall,\n\t\t\t\t\t\tindividual   : individualObj,\n\t\t\t\t\t\ttime_passes  : timePasses,\n\t\t\t\t\t\tsubscriptions,\n\t\t\t\t\t\tsecurity     : revenueGeneratorGlobalOptions.rg_paywall_nonce,\n\t\t\t\t\t};\n\n\t\t\t\t\tupdatePaywall(revenueGeneratorGlobalOptions.ajaxUrl, data);\n\n\t\t\t\t});\n\n\t\t\t};\n\n\t\t\t/**\n\t\t\t *\n\t\t\t * @param {string} ajaxURL  AJAX URL.\n\t\t\t * @param {Object} formData Form data to be submitted.\n\t\t\t */\n\t\t\tconst updatePaywall = function (ajaxURL, formData) {\n\t\t\t\t$.ajax({\n\t\t\t\t\turl     : ajaxURL,\n\t\t\t\t\tmethod  : 'POST',\n\t\t\t\t\tdata    : formData,\n\t\t\t\t\tdataType: 'json',\n\t\t\t\t}).done(function (r) {\n\t\t\t\t\t$o.snackBar.showSnackbar(r.msg, 1500);\n\n\t\t\t\t\tconst purchaseOptions = $($o.purchaseOptionItems);\n\n\t\t\t\t\tpurchaseOptions.data('paywall-id', r.paywall_id );\n\n\t\t\t\t\tconst timePassOptions = purchaseOptions.find(\"[data-purchase-type='time-pass']\");\n\n\t\t\t\t\ttimePassOptions.each(function () {\n\t\t\t\t\t\tconst timePassUID = $(this).data('uid');\n\t\t\t\t\t\t$(this).data('tlp-id',r.time_passes[timePassUID]);\n\t\t\t\t\t} );\n\n\t\t\t\t\tconst subscriptionOptions = purchaseOptions.find(\"[data-purchase-type='subscription']\");\n\n\t\t\t\t\tsubscriptionOptions.each(function () {\n\t\t\t\t\t\tconst subscriptionUID = $(this).data('uid');\n\t\t\t\t\t\t$(this).data('sub-id',r.subscriptions[subscriptionUID]);\n\t\t\t\t\t});\n\t\t\t\t});\n\t\t\t};\n\n\t\t\t/**\n\t\t\t * Create a unique identifier.\n\t\t\t */\n\t\t\tconst createUniqueID = function () {\n\t\t\t\treturn 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {\n\t\t\t\t\tconst r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);\n\t\t\t\t\treturn v.toString(16);\n\t\t\t\t});\n\t\t\t};\n\n\t\t\t/**\n\t\t\t * Create options markup based on period selection.\n\t\t\t *\n\t\t\t * @param {string} period   Type of period, i.e Year, Month, Day, Hour.\n\t\t\t * @param {Object} $wrapper Select wrapper.\n\t\t\t */\n\t\t\tconst changeDurationOptions = function (period, $wrapper) {\n\t\t\t\tlet options = [], limit = 24;\n\n\t\t\t\t// change duration options.\n\t\t\t\tif (period === 'y') {\n\t\t\t\t\tlimit = 1;\n\t\t\t\t} else if (period === 'm') {\n\t\t\t\t\tlimit = 12;\n\t\t\t\t}\n\n\t\t\t\tfor (let i = 1; i <= limit; i++) {\n\t\t\t\t\tconst option = $('<option/>', {\n\t\t\t\t\t\tvalue: i,\n\t\t\t\t\t});\n\t\t\t\t\toption.text(i);\n\t\t\t\t\toptions.push(option);\n\t\t\t\t}\n\n\t\t\t\t$($wrapper).find('option').remove().end().append(options);\n\t\t\t};\n\n\t\t\t/**\n\t\t\t * Adds paywall.\n\t\t\t */\n\t\t\tconst addPaywall = function () {\n\t\t\t\tconst postExcerptExists = $o.postExcerpt.length ? true : false;\n\t\t\t\tif ($o.postContent) {\n\t\t\t\t\t// Blur the paid content out.\n\t\t\t\t\t$o.postContent.addClass('blur-content');\n\n\t\t\t\t\t// Get the template for purchase overlay along with data.\n\t\t\t\t\tconst template = wp.template('revgen-purchase-overlay');\n\n\t\t\t\t\t// Send the data to our new template function, get the HTML markup back.\n\t\t\t\t\t$o.purchaseOverly.append(template);\n\t\t\t\t\t$o.purchaseOverly.show();\n\t\t\t\t}\n\t\t\t};\n\n\t\t\t// Initialize all required events.\n\t\t\tconst initializePage = function () {\n\t\t\t\tbindEvents();\n\t\t\t\taddPaywall();\n\t\t\t};\n\t\t\tinitializePage();\n\t\t}\n\n\t\trevenueGeneratorPaywallPreview();\n\t});\n})(jQuery); // eslint-disable-line no-undef\n\n\n//# sourceURL=webpack:///./assets/src/js/pages/revenue-generator-paywall.js?");

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