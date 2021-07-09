/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/babel-loader/lib/index.js!./src/worker.js":
/*!****************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js!./src/worker.js ***!
  \****************************************************************/
/***/ (() => {

eval("addEventListener('install', e => {\n  console.log('ServiceWorker.install', e);\n});\naddEventListener('activate', e => {\n  console.log('ServiceWorker.activate', e);\n});\naddEventListener('message', e => {\n  console.log('ServiceWorker.message', e);\n});\n\nonmessage = function (e) {\n  console.log('ServiceWorker.onmessage', e);\n};\n\n//# sourceURL=webpack://UndoBuffer/./src/worker.js?./node_modules/babel-loader/lib/index.js");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./node_modules/babel-loader/lib/index.js!./src/worker.js"]();
/******/ 	
/******/ })()
;