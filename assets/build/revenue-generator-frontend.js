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
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ({

/***/ "./assets/src/js/frontend/contribution.js":
/*!************************************************!*\
  !*** ./assets/src/js/frontend/contribution.js ***!
  \************************************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils */ \"./assets/src/js/utils/index.js\");\n/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_utils__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _helpers__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../helpers */ \"./assets/src/js/helpers/index.js\");\n/* global rgVars */\n\n/**\n * JS to handle plugin Contribution Dailog.\n *\n * @package revenue-generator\n */\n\n/**\n * Internal dependencies.\n */\n\n\n\n( function( $ ) {\n\t$( function() {\n\t\tfunction revenueGeneratorContributionDailog() {\n\t\t\t// Welcome screen elements.\n\t\t\tconst $o = {\n\t\t\t\tbody: $( 'body' ),\n\n\t\t\t\t// Contribution Element.\n\t\t\t\trgAmountTip: '.rg-amount-tip',\n\n\t\t\t\t// Action element.\n\t\t\t\trg_preset_buttons: '.rev-gen-contribution-main--box-donation',\n\t\t\t\trg_contribution_amounts:\n\t\t\t\t\t'.rev-gen-contribution-main--box-donation-wrapper',\n\t\t\t\trg_customAmountButton: '.rev-gen-contribution-main-custom',\n\n\t\t\t\trg_custom_amount: $( '.rg-custom-amount-input' ),\n\t\t\t\trg_custom_amount_wrapper: $( '.rg-custom-amount-wrapper' ),\n\t\t\t\trg_custom_amout_goBack: $( '.rg-custom-amount-goback' ),\n\t\t\t\trg_singleContribution: $( '.rg-link-single' ),\n\n\t\t\t\tsnackBar: $( '#rg_js_SnackBar' ),\n\t\t\t};\n\n\t\t\t// Binding events for contribution dialog.\n\t\t\tconst bindContributionEvents = function() {\n\t\t\t\t// Event handler for clicking on the amounts in contribution dialog.\n\t\t\t\t$( $o.rg_preset_buttons ).on( 'mouseover', function() {\n\t\t\t\t\tconst revenueType = $( this ).data( 'revenue' );\n\n\t\t\t\t\tif ( 'ppu' === revenueType ) {\n\t\t\t\t\t\t$( $o.rgAmountTip ).css( 'visibility', 'visible' );\n\t\t\t\t\t} else {\n\t\t\t\t\t\t$( $o.rgAmountTip ).css( 'visibility', 'hidden' );\n\t\t\t\t\t}\n\t\t\t\t} );\n\n\t\t\t\t/**\n\t\t\t\t * Removes tip message on mouseout.\n\t\t\t\t */\n\t\t\t\t$( $o.rg_preset_buttons ).on( 'mouseout', function() {\n\t\t\t\t\t$( $o.rgAmountTip ).css( 'visibility', 'hidden' );\n\t\t\t\t} );\n\n\t\t\t\t/**\n\t\t\t\t * Open up Contribution Payment URL.\n\t\t\t\t */\n\t\t\t\t$( $o.rg_preset_buttons )\n\t\t\t\t\t.not( $o.rg_customAmountButton )\n\t\t\t\t\t.on( 'click', function() {\n\t\t\t\t\t\tconst contributionURL = $( this ).data( 'href' );\n\t\t\t\t\t\twindow.open( contributionURL );\n\t\t\t\t\t} );\n\n\t\t\t\t// Handle custom amount input.\n\t\t\t\t$o.rg_custom_amount.on(\n\t\t\t\t\t'change',\n\t\t\t\t\tObject(_helpers__WEBPACK_IMPORTED_MODULE_1__[\"debounce\"])( function() {\n\t\t\t\t\t\tconst validatedPrice = validatePrice( $( this ).val() );\n\t\t\t\t\t\t$( this ).val( validatedPrice );\n\n\t\t\t\t\t\t// Get Price amount.\n\t\t\t\t\t\tconst lpAmount = Math.round( $( this ).val() * 100 );\n\n\t\t\t\t\t\t// Compare price amount.\n\t\t\t\t\t\tif ( lpAmount <= 199 ) {\n\t\t\t\t\t\t\t$( $o.rgAmountTip ).css( 'visibility', 'visible' );\n\t\t\t\t\t\t} else {\n\t\t\t\t\t\t\t$( $o.rgAmountTip ).css( 'visibility', 'hidden' );\n\t\t\t\t\t\t}\n\t\t\t\t\t}, 800 )\n\t\t\t\t);\n\n\t\t\t\t// Handle multiple contribution button click.\n\t\t\t\t$( '.rg-custom-amount-send' ).on( 'click', function() {\n\t\t\t\t\tlet payurl = '';\n\n\t\t\t\t\tconst customAmount = $o.rg_custom_amount.val() * 100;\n\t\t\t\t\tif ( customAmount > 199 ) {\n\t\t\t\t\t\tpayurl =\n\t\t\t\t\t\t\t$o.rg_custom_amount_wrapper.data( 'sis-url' ) +\n\t\t\t\t\t\t\t'&custom_pricing=' +\n\t\t\t\t\t\t\trgVars.default_currency +\n\t\t\t\t\t\t\tcustomAmount;\n\t\t\t\t\t} else {\n\t\t\t\t\t\tpayurl =\n\t\t\t\t\t\t\t$o.rg_custom_amount_wrapper.data( 'ppu-url' ) +\n\t\t\t\t\t\t\t'&custom_pricing=' +\n\t\t\t\t\t\t\trgVars.default_currency +\n\t\t\t\t\t\t\tcustomAmount;\n\t\t\t\t\t}\n\t\t\t\t\t// Open payment url in new tab.\n\t\t\t\t\twindow.open( payurl );\n\t\t\t\t} );\n\n\t\t\t\t/**\n\t\t\t\t * Handles custom button click.\n\t\t\t\t */\n\t\t\t\t$( $o.rg_customAmountButton ).on( 'click', function() {\n\t\t\t\t\t$( $o.rg_contribution_amounts ).fadeOut(\n\t\t\t\t\t\t'slow',\n\t\t\t\t\t\tfunction() {\n\t\t\t\t\t\t\t$o.rg_custom_amount_wrapper.show();\n\t\t\t\t\t\t\t$o.rg_custom_amount_wrapper\n\t\t\t\t\t\t\t\t.removeClass( 'slide-out' )\n\t\t\t\t\t\t\t\t.addClass( 'slide-in' );\n\t\t\t\t\t\t}\n\t\t\t\t\t);\n\t\t\t\t} );\n\n\t\t\t\t/**\n\t\t\t\t * Handles back button event on custom amount box.\n\t\t\t\t */\n\t\t\t\t$o.rg_custom_amout_goBack.on( 'click', function() {\n\t\t\t\t\t$o.rg_custom_amount_wrapper\n\t\t\t\t\t\t.removeClass( 'slide-in' )\n\t\t\t\t\t\t.addClass( 'slide-out' );\n\t\t\t\t\tsetTimeout( function() {\n\t\t\t\t\t\t$o.rg_custom_amount_wrapper.hide();\n\t\t\t\t\t\t$( $o.rg_contribution_amounts ).fadeIn( 'slow' );\n\t\t\t\t\t}, 1900 );\n\t\t\t\t} );\n\n\t\t\t\t// Handle multiple contribution button click.\n\t\t\t\t$o.rg_singleContribution.on( 'click', function() {\n\t\t\t\t\twindow.open(\n\t\t\t\t\t\t$( this ).data( 'url' ) +\n\t\t\t\t\t\t\t'&custom_pricing=' +\n\t\t\t\t\t\t\trgVars.default_currency +\n\t\t\t\t\t\t\t$( this ).data( 'amount' )\n\t\t\t\t\t);\n\t\t\t\t} );\n\t\t\t};\n\n\t\t\t// Validate custom input price.\n\t\t\tconst validatePrice = function( price ) {\n\t\t\t\t// strip non-number characters\n\t\t\t\tprice = price.toString().replace( /[^0-9\\,\\.]/g, '' );\n\n\t\t\t\t// convert price to proper float value\n\t\t\t\tif ( typeof price === 'string' && price.indexOf( ',' ) > -1 ) {\n\t\t\t\t\tprice = parseFloat( price.replace( ',', '.' ) ).toFixed(\n\t\t\t\t\t\t2\n\t\t\t\t\t);\n\t\t\t\t} else {\n\t\t\t\t\tprice = parseFloat( price ).toFixed( 2 );\n\t\t\t\t}\n\n\t\t\t\t// prevent non-number prices\n\t\t\t\tif ( isNaN( price ) ) {\n\t\t\t\t\tprice = 0.05;\n\t\t\t\t}\n\n\t\t\t\t// prevent negative prices\n\t\t\t\tprice = Math.abs( price );\n\n\t\t\t\t// correct prices outside the allowed range of 0.05 - 1000.00\n\t\t\t\tif ( price > 1000.0 ) {\n\t\t\t\t\tprice = 1000.0;\n\t\t\t\t} else if ( price < 0.05 ) {\n\t\t\t\t\tprice = 0.05;\n\t\t\t\t}\n\n\t\t\t\t// format price with two digits\n\t\t\t\tprice = price.toFixed( 2 );\n\n\t\t\t\treturn price;\n\t\t\t};\n\n\t\t\t// Initialize all required events.\n\t\t\tconst initializePage = function() {\n\t\t\t\tbindContributionEvents();\n\t\t\t};\n\t\t\tinitializePage();\n\t\t}\n\n\t\trevenueGeneratorContributionDailog();\n\t} );\n} )( jQuery ); // eslint-disable-line no-undef\n\n\n//# sourceURL=webpack:///./assets/src/js/frontend/contribution.js?");

/***/ }),

/***/ "./assets/src/js/helpers/debounce.js":
/*!*******************************************!*\
  !*** ./assets/src/js/helpers/debounce.js ***!
  \*******************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/**\n * Throttle the execution of a function by a given delay.\n *\n * @param {Function} fn    Callback function.\n * @param {number}   delay Time in ms to delay the operation.\n */\nconst debounce = function( fn, delay ) {\n\tlet timer;\n\treturn function() {\n\t\tconst context = this,\n\t\t\targs = arguments;\n\n\t\tclearTimeout( timer );\n\n\t\ttimer = setTimeout( function() {\n\t\t\tfn.apply( context, args );\n\t\t}, delay );\n\t};\n};\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (debounce);\n\n\n//# sourceURL=webpack:///./assets/src/js/helpers/debounce.js?");

/***/ }),

/***/ "./assets/src/js/helpers/index.js":
/*!****************************************!*\
  !*** ./assets/src/js/helpers/index.js ***!
  \****************************************/
/*! exports provided: debounce */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _debounce__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./debounce */ \"./assets/src/js/helpers/debounce.js\");\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"debounce\", function() { return _debounce__WEBPACK_IMPORTED_MODULE_0__[\"default\"]; });\n\n\n\n\n//# sourceURL=webpack:///./assets/src/js/helpers/index.js?");

/***/ }),

/***/ "./assets/src/js/revenue-generator-frontend.js":
/*!*****************************************************!*\
  !*** ./assets/src/js/revenue-generator-frontend.js ***!
  \*****************************************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _frontend_contribution__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./frontend/contribution */ \"./assets/src/js/frontend/contribution.js\");\n/**\n * Import all required frontend scripts here.\n */\n\n\n\n//# sourceURL=webpack:///./assets/src/js/revenue-generator-frontend.js?");

/***/ }),

/***/ "./assets/src/js/utils/index.js":
/*!**************************************!*\
  !*** ./assets/src/js/utils/index.js ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("/**\n * jQuery plugins used inside the plugin.\n */\n( function( $ ) {\n\t/**\n\t * Show snackbar with message.\n\t *\n\t * @param {string} message  Message to be displayed in snackbar.\n\t * @param {number} duration Duration for setTimeout.\n\t */\n\t$.fn.showSnackbar = function( message, duration ) {\n\t\tconst $container = $( this );\n\t\t$container.text( message );\n\t\t$container.addClass( 'rev-gen-snackbar--show' );\n\t\tsetTimeout( function() {\n\t\t\t$container.removeClass( 'rev-gen-snackbar--show' );\n\t\t}, duration );\n\t};\n} )( jQuery ); // eslint-disable-line no-undef\n\n\n//# sourceURL=webpack:///./assets/src/js/utils/index.js?");

/***/ }),

/***/ "./assets/src/scss/revenue-generator-frontend.scss":
/*!*********************************************************!*\
  !*** ./assets/src/scss/revenue-generator-frontend.scss ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("// extracted by mini-css-extract-plugin\n\n//# sourceURL=webpack:///./assets/src/scss/revenue-generator-frontend.scss?");

/***/ }),

/***/ 1:
/*!*************************************************************************************************************!*\
  !*** multi ./assets/src/js/revenue-generator-frontend.js ./assets/src/scss/revenue-generator-frontend.scss ***!
  \*************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("__webpack_require__(/*! ./assets/src/js/revenue-generator-frontend.js */\"./assets/src/js/revenue-generator-frontend.js\");\nmodule.exports = __webpack_require__(/*! ./assets/src/scss/revenue-generator-frontend.scss */\"./assets/src/scss/revenue-generator-frontend.scss\");\n\n\n//# sourceURL=webpack:///multi_./assets/src/js/revenue-generator-frontend.js_./assets/src/scss/revenue-generator-frontend.scss?");

/***/ })

/******/ });