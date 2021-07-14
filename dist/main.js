/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["UndoBuffer"] = factory();
	else
		root["UndoBuffer"] = factory();
})(self, function() {
return /******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("const Worker = __webpack_require__(/*! ./worker.js */ \"./src/worker.js\");\n/**\n * UndoBuffer\n *\n * @type {class}\n * @param {Object} [settings] Configuration options\n * @param {Number} [settings.limit] Length of undo window\n * @param {Function} [settings.objectHash] Callback to map arrays of objects by internal keys rather than array index position\n */\n\n\nconst UndoBuffer = function (settings) {\n  this.enabled = true;\n  this.config = { // TODO: Pass these through to the worker.\n    //limit: 10,\n    //objectHash: undefined,\n    ...settings\n  };\n  this._worker = new Worker();\n  /**\n   * Record a variable modification\n   *\n   * @type {method}\n   * @param {Object} newVal Changed value as reported by watchers\n   * @param {Object} [oldVal] Previous value before change\n   */\n\n  this.update = (newVal, oldVal) => {\n    if (!this.enabled) return;\n    if (!oldVal) return;\n    console.log('UndoBuffer.update', newVal, oldVal);\n\n    this._worker.postMessage({\n      opcode: 'update',\n      data: [newVal, oldVal]\n    });\n  };\n  /**\n   * Execute an undo action\n   *\n   * @type {method}\n   * @param {Object} doc The current state to patch\n   */\n\n\n  this.undo = doc => {\n    if (!doc) return Promise.resolve(); // TODO: Reject on messaging timeout or error\n\n    return new Promise((resolve, reject) => {\n      console.log('UndoBuffer.undo', doc);\n\n      const workerResponse = e => {\n        if (e.data.opcode !== 'undone') return resolve();\n        console.log('UndoBuffer response', e);\n\n        this._worker.removeEventListener('message', workerResponse);\n\n        resolve(e.data.data);\n      };\n\n      this._worker.addEventListener('message', workerResponse);\n\n      this._worker.postMessage({\n        opcode: 'undo',\n        data: doc\n      });\n    });\n  };\n  /**\n   * Execute a redo action\n   *\n   * @type {method}\n   * @param {Object} doc The current state to patch\n   */\n\n\n  this.redo = doc => {\n    if (!doc) return Promise.resolve(); // TODO: Reject on messaging timeout or error\n\n    return new Promise((resolve, reject) => {\n      console.log('UndoBuffer.redo', doc);\n\n      const workerResponse = e => {\n        if (e.data.opcode !== 'redone') return resolve();\n        console.log('UndoBuffer response', e);\n\n        this._worker.removeEventListener('message', workerResponse);\n\n        resolve(e.data.data);\n      };\n\n      this._worker.addEventListener('message', workerResponse);\n\n      this._worker.postMessage({\n        opcode: 'redo',\n        data: doc\n      });\n    });\n  };\n};\n\nmodule.exports = UndoBuffer;\n\n//# sourceURL=webpack://UndoBuffer/./src/index.js?");

/***/ }),

/***/ "./src/worker.js":
/*!***********************!*\
  !*** ./src/worker.js ***!
  \***********************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("module.exports = function Worker_fn() {\n  return new Worker(__webpack_require__.p + \"main.worker.js\");\n}\n\n\n//# sourceURL=webpack://UndoBuffer/./src/worker.js?");

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
/******/ 	/* webpack/runtime/publicPath */
/******/ 	(() => {
/******/ 		__webpack_require__.p = "/undo-buffer/";
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__("./src/index.js");
/******/ 	
/******/ 	return __webpack_exports__;
/******/ })()
;
});