/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ 29:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(354);
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(314);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, `// extracted by mini-css-extract-plugin
export {};`, "",{"version":3,"sources":["webpack://./src/styles.css"],"names":[],"mappings":"AAAA;QACS,CAAA","sourcesContent":["// extracted by mini-css-extract-plugin\nexport {};"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ 56:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



/* istanbul ignore next  */
function setAttributesWithoutAttributes(styleElement) {
  var nonce =  true ? __webpack_require__.nc : 0;
  if (nonce) {
    styleElement.setAttribute("nonce", nonce);
  }
}
module.exports = setAttributesWithoutAttributes;

/***/ }),

/***/ 72:
/***/ ((module) => {



var stylesInDOM = [];
function getIndexByIdentifier(identifier) {
  var result = -1;
  for (var i = 0; i < stylesInDOM.length; i++) {
    if (stylesInDOM[i].identifier === identifier) {
      result = i;
      break;
    }
  }
  return result;
}
function modulesToDom(list, options) {
  var idCountMap = {};
  var identifiers = [];
  for (var i = 0; i < list.length; i++) {
    var item = list[i];
    var id = options.base ? item[0] + options.base : item[0];
    var count = idCountMap[id] || 0;
    var identifier = "".concat(id, " ").concat(count);
    idCountMap[id] = count + 1;
    var indexByIdentifier = getIndexByIdentifier(identifier);
    var obj = {
      css: item[1],
      media: item[2],
      sourceMap: item[3],
      supports: item[4],
      layer: item[5]
    };
    if (indexByIdentifier !== -1) {
      stylesInDOM[indexByIdentifier].references++;
      stylesInDOM[indexByIdentifier].updater(obj);
    } else {
      var updater = addElementStyle(obj, options);
      options.byIndex = i;
      stylesInDOM.splice(i, 0, {
        identifier: identifier,
        updater: updater,
        references: 1
      });
    }
    identifiers.push(identifier);
  }
  return identifiers;
}
function addElementStyle(obj, options) {
  var api = options.domAPI(options);
  api.update(obj);
  var updater = function updater(newObj) {
    if (newObj) {
      if (newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap && newObj.supports === obj.supports && newObj.layer === obj.layer) {
        return;
      }
      api.update(obj = newObj);
    } else {
      api.remove();
    }
  };
  return updater;
}
module.exports = function (list, options) {
  options = options || {};
  list = list || [];
  var lastIdentifiers = modulesToDom(list, options);
  return function update(newList) {
    newList = newList || [];
    for (var i = 0; i < lastIdentifiers.length; i++) {
      var identifier = lastIdentifiers[i];
      var index = getIndexByIdentifier(identifier);
      stylesInDOM[index].references--;
    }
    var newLastIdentifiers = modulesToDom(newList, options);
    for (var _i = 0; _i < lastIdentifiers.length; _i++) {
      var _identifier = lastIdentifiers[_i];
      var _index = getIndexByIdentifier(_identifier);
      if (stylesInDOM[_index].references === 0) {
        stylesInDOM[_index].updater();
        stylesInDOM.splice(_index, 1);
      }
    }
    lastIdentifiers = newLastIdentifiers;
  };
};

/***/ }),

/***/ 113:
/***/ ((module) => {



/* istanbul ignore next  */
function styleTagTransform(css, styleElement) {
  if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText = css;
  } else {
    while (styleElement.firstChild) {
      styleElement.removeChild(styleElement.firstChild);
    }
    styleElement.appendChild(document.createTextNode(css));
  }
}
module.exports = styleTagTransform;

/***/ }),

/***/ 314:
/***/ ((module) => {



/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
*/
module.exports = function (cssWithMappingToString) {
  var list = [];

  // return the list of modules as css string
  list.toString = function toString() {
    return this.map(function (item) {
      var content = "";
      var needLayer = typeof item[5] !== "undefined";
      if (item[4]) {
        content += "@supports (".concat(item[4], ") {");
      }
      if (item[2]) {
        content += "@media ".concat(item[2], " {");
      }
      if (needLayer) {
        content += "@layer".concat(item[5].length > 0 ? " ".concat(item[5]) : "", " {");
      }
      content += cssWithMappingToString(item);
      if (needLayer) {
        content += "}";
      }
      if (item[2]) {
        content += "}";
      }
      if (item[4]) {
        content += "}";
      }
      return content;
    }).join("");
  };

  // import a list of modules into the list
  list.i = function i(modules, media, dedupe, supports, layer) {
    if (typeof modules === "string") {
      modules = [[null, modules, undefined]];
    }
    var alreadyImportedModules = {};
    if (dedupe) {
      for (var k = 0; k < this.length; k++) {
        var id = this[k][0];
        if (id != null) {
          alreadyImportedModules[id] = true;
        }
      }
    }
    for (var _k = 0; _k < modules.length; _k++) {
      var item = [].concat(modules[_k]);
      if (dedupe && alreadyImportedModules[item[0]]) {
        continue;
      }
      if (typeof layer !== "undefined") {
        if (typeof item[5] === "undefined") {
          item[5] = layer;
        } else {
          item[1] = "@layer".concat(item[5].length > 0 ? " ".concat(item[5]) : "", " {").concat(item[1], "}");
          item[5] = layer;
        }
      }
      if (media) {
        if (!item[2]) {
          item[2] = media;
        } else {
          item[1] = "@media ".concat(item[2], " {").concat(item[1], "}");
          item[2] = media;
        }
      }
      if (supports) {
        if (!item[4]) {
          item[4] = "".concat(supports);
        } else {
          item[1] = "@supports (".concat(item[4], ") {").concat(item[1], "}");
          item[4] = supports;
        }
      }
      list.push(item);
    }
  };
  return list;
};

/***/ }),

/***/ 354:
/***/ ((module) => {



module.exports = function (item) {
  var content = item[1];
  var cssMapping = item[3];
  if (!cssMapping) {
    return content;
  }
  if (typeof btoa === "function") {
    var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(cssMapping))));
    var data = "sourceMappingURL=data:application/json;charset=utf-8;base64,".concat(base64);
    var sourceMapping = "/*# ".concat(data, " */");
    return [content].concat([sourceMapping]).join("\n");
  }
  return [content].join("\n");
};

/***/ }),

/***/ 540:
/***/ ((module) => {



/* istanbul ignore next  */
function insertStyleElement(options) {
  var element = document.createElement("style");
  options.setAttributes(element, options.attributes);
  options.insert(element, options.options);
  return element;
}
module.exports = insertStyleElement;

/***/ }),

/***/ 659:
/***/ ((module) => {



var memo = {};

/* istanbul ignore next  */
function getTarget(target) {
  if (typeof memo[target] === "undefined") {
    var styleTarget = document.querySelector(target);

    // Special case to return head of iframe instead of iframe itself
    if (window.HTMLIFrameElement && styleTarget instanceof window.HTMLIFrameElement) {
      try {
        // This will throw an exception if access to iframe is blocked
        // due to cross-origin restrictions
        styleTarget = styleTarget.contentDocument.head;
      } catch (e) {
        // istanbul ignore next
        styleTarget = null;
      }
    }
    memo[target] = styleTarget;
  }
  return memo[target];
}

/* istanbul ignore next  */
function insertBySelector(insert, style) {
  var target = getTarget(insert);
  if (!target) {
    throw new Error("Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.");
  }
  target.appendChild(style);
}
module.exports = insertBySelector;

/***/ }),

/***/ 825:
/***/ ((module) => {



/* istanbul ignore next  */
function apply(styleElement, options, obj) {
  var css = "";
  if (obj.supports) {
    css += "@supports (".concat(obj.supports, ") {");
  }
  if (obj.media) {
    css += "@media ".concat(obj.media, " {");
  }
  var needLayer = typeof obj.layer !== "undefined";
  if (needLayer) {
    css += "@layer".concat(obj.layer.length > 0 ? " ".concat(obj.layer) : "", " {");
  }
  css += obj.css;
  if (needLayer) {
    css += "}";
  }
  if (obj.media) {
    css += "}";
  }
  if (obj.supports) {
    css += "}";
  }
  var sourceMap = obj.sourceMap;
  if (sourceMap && typeof btoa !== "undefined") {
    css += "\n/*# sourceMappingURL=data:application/json;base64,".concat(btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))), " */");
  }

  // For old IE
  /* istanbul ignore if  */
  options.styleTagTransform(css, styleElement, options.options);
}
function removeStyleElement(styleElement) {
  // istanbul ignore if
  if (styleElement.parentNode === null) {
    return false;
  }
  styleElement.parentNode.removeChild(styleElement);
}

/* istanbul ignore next  */
function domAPI(options) {
  if (typeof document === "undefined") {
    return {
      update: function update() {},
      remove: function remove() {}
    };
  }
  var styleElement = options.insertStyleElement(options);
  return {
    update: function update(obj) {
      apply(styleElement, options, obj);
    },
    remove: function remove() {
      removeStyleElement(styleElement);
    }
  };
}
module.exports = domAPI;

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
/******/ 			id: moduleId,
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
/******/ 	/* webpack/runtime/nonce */
/******/ 	(() => {
/******/ 		__webpack_require__.nc = undefined;
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};

// EXTERNAL MODULE: ./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js
var injectStylesIntoStyleTag = __webpack_require__(72);
var injectStylesIntoStyleTag_default = /*#__PURE__*/__webpack_require__.n(injectStylesIntoStyleTag);
// EXTERNAL MODULE: ./node_modules/style-loader/dist/runtime/styleDomAPI.js
var styleDomAPI = __webpack_require__(825);
var styleDomAPI_default = /*#__PURE__*/__webpack_require__.n(styleDomAPI);
// EXTERNAL MODULE: ./node_modules/style-loader/dist/runtime/insertBySelector.js
var insertBySelector = __webpack_require__(659);
var insertBySelector_default = /*#__PURE__*/__webpack_require__.n(insertBySelector);
// EXTERNAL MODULE: ./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js
var setAttributesWithoutAttributes = __webpack_require__(56);
var setAttributesWithoutAttributes_default = /*#__PURE__*/__webpack_require__.n(setAttributesWithoutAttributes);
// EXTERNAL MODULE: ./node_modules/style-loader/dist/runtime/insertStyleElement.js
var insertStyleElement = __webpack_require__(540);
var insertStyleElement_default = /*#__PURE__*/__webpack_require__.n(insertStyleElement);
// EXTERNAL MODULE: ./node_modules/style-loader/dist/runtime/styleTagTransform.js
var styleTagTransform = __webpack_require__(113);
var styleTagTransform_default = /*#__PURE__*/__webpack_require__.n(styleTagTransform);
// EXTERNAL MODULE: ./node_modules/css-loader/dist/cjs.js!../../../../../../node_modules/mini-css-extract-plugin/dist/loader.js!./node_modules/css-loader/dist/cjs.js!./src/styles.css
var styles = __webpack_require__(29);
;// ./src/styles.css

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (styleTagTransform_default());
options.setAttributes = (setAttributesWithoutAttributes_default());
options.insert = insertBySelector_default().bind(null, "head");
options.domAPI = (styleDomAPI_default());
options.insertStyleElement = (insertStyleElement_default());

var update = injectStylesIntoStyleTag_default()(styles/* default */.A, options);




       /* harmony default export */ const src_styles = (styles/* default */.A && styles/* default */.A.locals ? styles/* default */.A.locals : undefined);

;// ./src/game_board/gameBoard.js
/* eslint-disable no-console */
/* eslint-disable import/prefer-default-export */
class GameBoard {
  width = 10;
  height = 10;
  #placedCount = 0;
  constructor(id, ships) {
    this.id = id;
    this.ships = ships;
    this.shipPositions = new Map();
    this.guessHistory = new Set();
  }

  /**
   * @param {number} value
   */
  set incrementPlacedCountBy(value) {
    this.#placedCount += value;
    if (this.#placedCount === 5) {
      const placeElement = document.querySelector('.button-holder.place');
      const playElement = document.querySelector('.button-holder.play');
      if (this.id === 'player') {
        placeElement.classList.toggle('hidden');
        playElement.classList.toggle('hidden');
      } else {
        document.querySelector('.start-game').classList.remove('hidden');
      }
    }
  }

  /**
   * @param {number} value
   */
  set decrementPlacedValueBy(value) {
    this.#placedCount -= value;
    document.querySelector('.button-holder.place').classList.remove('hidden');
    if (this.id === 'player') {
      document.querySelector('.button-holder.play').classList.add('hidden');
    } else {
      document.querySelector('.start-game').classList.add('hidden');
    }
  }
  isWithinBounds = (x, y) => x >= 0 && y >= 0 && x < this.width && y < this.height;
  isOverlapping = coord => this.shipPositions.has(coord);
  isShipInBoundsAndNotOverlapping = (x, y, length, orientation) => {
    const occupied = this.getOccupiedCells(x, y, length, orientation);
    // eslint-disable-next-line no-restricted-syntax
    for (const coord of occupied) {
      const [cx, cy] = coord.split(',').map(Number);
      if (!this.isWithinBounds(cx, cy)) {
        return false;
      }
      if (this.isOverlapping(coord)) {
        return false;
      }
    }
    return occupied;
  };

  // eslint-disable-next-line class-methods-use-this
  getOccupiedCells = (x, y, length, orientation) => {
    const cells = [];

    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < length; i++) {
      const cx = orientation === 'horizontal' ? x + i : x;
      const cy = orientation === 'vertical' ? y + i : y;
      cells.push(`${cx},${cy}`);
    }
    return cells;
  };
  markCellsOccupied = (cells, shipId) => {
    // eslint-disable-next-line consistent-return
    cells.forEach(cell => {
      const [xs, ys] = cell.split(',');
      const x = Number(xs);
      const y = Number(ys);
      if (!this.isWithinBounds(x, y)) return false;
    });
    cells.forEach(cell => {
      this.shipPositions.set(cell, shipId);
    });
    this.ships[shipId].place(cells[0], this.ships[shipId].orientation);
    return true;
  };
  clearCells = (cells, shipId) => {
    cells.forEach(cell => {
      this.shipPositions.delete(cell, shipId);
    });
  };
  markGuess = coordinate => {
    if (this.guessHistory.has(coordinate)) {
      return false;
    }
    this.guessHistory.add(coordinate);
    return true;
  };
  isHitSuccessful(coordinate) {
    return this.shipPositions.has(coordinate);
  }
  areAllShipsSunk() {
    return Object.values(this.ships).every(s => s.isSunk);
  }
  reset = () => {
    this.shipPositions = new Map();
    this.guessHistory = new Set();
    this.decrementPlacedValueBy = this.#placedCount;
    Object.values(this.ships).forEach(ship => {
      ship.reset();
    });
  };

  // eslint-disable-next-line class-methods-use-this
  getRandomOrientation() {
    return Math.random() >= 0.5 ? 'horizontal' : 'vertical';
  }
  getRandomX() {
    return Math.floor(Math.random() * this.width) + 1;
  }
  getRandomY() {
    return Math.floor(Math.random() * this.height) + 1;
  }
}

;// ./src/ship/ship.js
/* eslint-disable import/prefer-default-export */
/* eslint-disable class-methods-use-this */
class Ship {
  constructor(id, length) {
    this.id = id;
    this.length = length;
    this.position = null;
    this.orientation = 'vertical';
    this.cellsOccupied = [];
    this.hitCells = new Set();
    this.isSunk = false;
  }
  computeCells = (x, y, orientation) => {
    const cells = [];
    for (let i = 0; i < this.length; i += 1) {
      const cx = orientation === 'horizontal' ? x + i : x;
      const cy = orientation === 'vertical' ? y + i : y;
      cells.push(`${cx},${cy}`);
    }
    return cells;
  };
  place = (pos, orientation) => {
    const [x, y] = pos.split(',').map(Number);
    this.position = {
      x,
      y
    };
    this.orientation = orientation;
    this.cellsOccupied = this.computeCells(x, y, orientation);
  };
  rotate = () => {
    this.orientation = this.orientation === 'horizontal' ? 'vertical' : 'horizontal';
    const {
      x,
      y
    } = this.position;
    this.cellsOccupied = this.computeCells(x, y, this.orientation);
    return this.cellsOccupied;
  };
  recordHit = coordinate => {
    if (this.cellsOccupied.includes(coordinate)) {
      this.hitCells.add(coordinate);
      this.checkIfSunk();
    }
  };
  checkIfSunk = () => {
    this.isSunk = this.hitCells.size === this.length;
    return this.isSunk;
  };
  reset = () => {
    this.position = null;
    this.orientation = 'vertical';
    this.cellsOccupied = [];
    this.hitCells = new Set();
    this.isSunk = false;
  };
}

;// ./src/drag_drop_controller/dragDropController.js
/* eslint-disable no-param-reassign */
/* eslint-disable class-methods-use-this */
/* eslint-disable import/prefer-default-export */
class DragDropController {
  constructor(board) {
    this.board = board;
    this.dragState = null;
    this.boardElement = null;
    this.suppressClick = true;
  }
  setUp() {
    const ships = document.querySelectorAll(`.${this.board.id}.ship`);
    this.boardElement = document.getElementById(`${this.board.id}`);
    const cells = this.boardElement.querySelectorAll('.cell');
    ships.forEach(shipElement => {
      shipElement.addEventListener('dragstart', e => {
        this.suppressClick = true;
        document.querySelector('.drag.instructions').classList.add('hidden');
        const rect = shipElement.getBoundingClientRect();
        const offsetX = e.clientX - rect.left;
        const offsetY = e.clientY - rect.top;
        this.startDrag(shipElement, {
          x: offsetX,
          y: offsetY
        });
      });

      // click to rotate if ship is placed on the board
      // and if ship's rotation will not place it off the board
      shipElement.addEventListener('click', e => {
        this.rotateHandler(e);
      });
    });
    cells.forEach(cell => {
      cell.addEventListener('dragover', e => {
        e.preventDefault();
        this.removeHighlights();
        this.updateDragState(e);
      });
    });
    this.boardElement.addEventListener('drop', e => {
      e.preventDefault();
      document.querySelector('.rotate.instructions').classList.remove('hidden');
      if (this.dragState.isValidPosition) {
        this.board.markCellsOccupied(this.board.getOccupiedCells(this.dragState.ship.position.x, this.dragState.ship.position.y, this.dragState.ship.length, this.dragState.ship.orientation), this.dragState.ship.id);
        this.snapShipInPlace();
        this.board.incrementPlacedCountBy = 1;
      }
      this.dragState = null;
      this.removeAllHighlights();
      this.suppressClick = false;
    });
    document.addEventListener('dragover', e => {
      e.preventDefault();
      const boardRect = this.boardElement.getBoundingClientRect();
      const isInsideBoard = e.clientX >= boardRect.left && e.clientX <= boardRect.right && e.clientY >= boardRect.top && e.clientY <= boardRect.bottom;
      if (!isInsideBoard) {
        this.removeAllHighlights();
      }
    });
  }
  startDrag(shipElement, clientOffset) {
    const cellSize = document.querySelector('.cell').offsetHeight;
    this.dragState = {
      shipElement,
      ship: this.board.ships[shipElement.dataset.ship],
      cellSize,
      shipOffset: {
        x: clientOffset.x,
        y: clientOffset.y
      },
      isValidPosition: false,
      coveredCellElements: null
    };
    this.dragState.ship.position = null;
    const cellsToUnmark = this.dragState.ship.cellsOccupied;
    if (cellsToUnmark.length > 0) {
      this.board.clearCells(cellsToUnmark);
    }
    this.dragState.ship.cellsOccupied = [];
  }
  getCoordinatesOfCellOccupiedByMouse(mousePosition) {
    const rect = this.boardElement.getBoundingClientRect();
    const x = Math.floor((mousePosition.x - rect.left - this.dragState.shipOffset.x) / this.dragState.cellSize);
    const y = Math.floor((mousePosition.y - rect.top - this.dragState.shipOffset.y) / this.dragState.cellSize);
    const clampedX = Math.max(0, Math.min(this.board.width - 1, x));
    const clampedY = Math.max(0, Math.min(this.board.height - 1, y));
    return {
      x: clampedX,
      y: clampedY
    };
  }
  getAllCoveredCellElements() {
    const cellCoordinates = this.board.getOccupiedCells(this.dragState.ship.position.x, this.dragState.ship.position.y, this.dragState.ship.length, this.dragState.ship.orientation);
    const occupiedElements = [];
    cellCoordinates.forEach(coordinate => {
      occupiedElements.push(document.querySelector(`[data-coordinate="${coordinate}"]`));
    });
    return occupiedElements;
  }
  removeHighlights() {
    if (!this.dragState || !this.dragState.coveredCellElements) return;
    if (this.dragState.coveredCellElements) {
      this.dragState.coveredCellElements.forEach(element => {
        if (element) {
          element.classList.remove('good-drag');
          element.classList.remove('bad-drag');
        }
      });
    }
  }
  removeAllHighlights() {
    const allCells = document.querySelectorAll('.cell');
    if (!allCells) return;
    allCells.forEach(cell => {
      if (cell) {
        cell.classList.remove('good-drag');
        cell.classList.remove('bad-drag');
      }
    });
  }
  updateDragState(e) {
    this.dragState.ship.position = this.getCoordinatesOfCellOccupiedByMouse({
      x: e.clientX,
      y: e.clientY
    });
    this.dragState.coveredCellElements = this.getAllCoveredCellElements();
    if (this.board.isShipInBoundsAndNotOverlapping(this.dragState.ship.position.x, this.dragState.ship.position.y, this.dragState.ship.length, this.dragState.ship.orientation)) {
      this.dragState.coveredCellElements.forEach(element => {
        if (element) {
          element.classList.add('good-drag');
        }
      });
      this.dragState.isValidPosition = true;
    } else {
      this.dragState.coveredCellElements.forEach(element => {
        if (element) {
          element.classList.add('bad-drag');
        }
      });
      this.dragState.isValidPosition = false;
    }
  }
  snapShipInPlace() {
    // Snap ship to the top-left cell
    const rect = this.boardElement.getBoundingClientRect();
    const topLeftX = this.dragState.coveredCellElements[0].offsetLeft;
    const topLeftY = this.dragState.coveredCellElements[0].offsetTop;
    this.dragState.shipElement.style.position = 'absolute';
    this.dragState.shipElement.style.left = `${topLeftX + rect.left}px`;
    this.dragState.shipElement.style.top = `${topLeftY + rect.top}px`;
  }
  rotateHandler(e) {
    if (this.suppressClick) {
      return;
    }
    const ship = this.board.ships[e.target.dataset.ship];
    if (ship.position) {
      this.rotateShip(e.target, ship);
    }
  }
  rotateShip(shipElement, ship) {
    let newOrientation;
    if (ship.orientation === 'vertical') {
      newOrientation = 'horizontal';
    } else newOrientation = 'vertical';
    const oldCells = ship.cellsOccupied;
    this.board.clearCells(oldCells);
    if (this.board.isShipInBoundsAndNotOverlapping(ship.position.x, ship.position.y, ship.length, newOrientation)) {
      this.board.markCellsOccupied(ship.rotate(), ship.id);
      if (ship.orientation === 'vertical') {
        shipElement.style.transform = 'rotate(0deg) translate(0,0)';
      } else {
        const cellSize = document.querySelector('.cell').offsetHeight;
        shipElement.style.transform = `rotate(-90deg) translate(-${cellSize}px, 0)`;
      }
    } else {
      this.board.markCellsOccupied(oldCells, ship.id);
    }
  }
}

;// ./src/ui_renderer/uiRenderer.js
/* eslint-disable no-param-reassign */
/* eslint-disable class-methods-use-this */


class UIRenderer {
  constructor(playerBoard, opponentBoard, onStartCallback) {
    this.board = playerBoard;
    this.playerBoard = playerBoard;
    this.playerDragDropController = new DragDropController(playerBoard);
    this.playerShipElements = null;
    this.opponentBoard = opponentBoard;
    this.opponentDragDropController = null;
    this.opponentShipElements = null;
    this.setUp();
    this.onStartCallback = onStartCallback;
    this.startGameListeners();
  }
  setUp() {
    this.renderBoard();
    this.playerShipElements = document.querySelectorAll('.player.ship');
    this.opponentShipElements = document.querySelectorAll('.opponent.ship');
    this.playerDragDropController.setUp();
    const resetButton = document.getElementById('reset');
    resetButton.addEventListener('click', () => {
      this.reset();
    });
    const randomizeButton = document.getElementById('randomize');
    randomizeButton.addEventListener('click', () => {
      this.reset();
      this.randomizePlacement();
      this.board.incrementPlacedCountBy = 5;
    });

    // const opponentPlayerButton = document.getElementById('opponent-player');
    // opponentPlayerButton.addEventListener('click', () => {
    //   this.appendShipsToBoard();
    //   document.getElementById('player').classList.add('hidden');
    //   this.board = this.opponentBoard;
    //   this.renderBoard();
    //   this.opponentDragDropController = new DragDropController(this.board);
    //   this.opponentDragDropController.setUp();

    //   // reset screen for opponent
    //   document.querySelector('.button-holder.place').classList.remove('hidden');
    //   document.querySelector('.button-holder.play').classList.add('hidden');
    //   this.playerShipElements.forEach((element) => {
    //     element.classList.add('hidden');
    //   });
    //   this.opponentShipElements.forEach((element) => {
    //     element.classList.remove('hidden');
    //   });
    // });
  }
  startGameListeners() {
    // start PvC game
    const computerPlayerButton = document.getElementById('opponent-computer');
    computerPlayerButton.addEventListener('click', () => {
      this.appendShipsToBoard();
      this.opponentBoard.id = 'computer';
      this.board = this.opponentBoard;
      this.renderBoard();
      this.randomizePlacement();
      document.querySelector('.drag.section').classList.add('hidden');
      const ships = document.querySelectorAll('.ship');
      ships.forEach(ship => {
        ship.draggable = false;
      });
      this.startGame('computer');
    });

    // start PvP game
    const playButton = document.querySelector('.start-game');
    playButton.addEventListener('click', () => {
      this.appendShipsToBoard();
      document.querySelector('.drag.section').classList.add('hidden');
      document.getElementById('player').classList.remove('hidden');
      const ships = document.querySelectorAll('.ship');
      ships.forEach(ship => {
        ship.draggable = false;
        ship.classList.add('hidden');
      });
      this.startGame('opponent');
    });
  }
  startGame(matchType) {
    this.playerDragDropController.suppressClick = true;
    if (matchType !== 'computer') {
      this.opponentDragDropController.suppressClick = true;
    }
    this.onStartCallback(matchType);
  }
  renderBoard() {
    const container = document.createElement('div');
    container.id = this.board.id;
    container.classList.add('board');
    for (let y = 0; y < this.board.height; y += 1) {
      const row = document.createElement('div');
      row.className = 'row';
      for (let x = 0; x < this.board.width; x += 1) {
        const cell = document.createElement('div');
        const coord = `${x},${y}`;
        cell.className = 'cell';
        cell.dataset.coordinate = coord;
        row.appendChild(cell);
      }
      container.appendChild(row);
    }
    const mainContainer = document.getElementById('main-container');
    if (this.board.id === 'player') {
      mainContainer.prepend(container);
    } else {
      mainContainer.append(container);
    }
  }
  reset() {
    Object.values(this.board.ships).forEach(ship => {
      const shipElement = document.querySelector(`.${this.board.id}[data-ship="${ship.id}"]`);
      shipElement.style.transform = 'rotate(0deg) translate(0,0)';
      shipElement.style.top = '';
      shipElement.style.left = '';
    });
    this.board.reset();
  }
  randomizePlacement() {
    Object.values(this.board.ships).forEach(ship => {
      let placed = false;
      let x;
      let y;
      let orient;
      while (!placed) {
        x = this.board.getRandomX();
        y = this.board.getRandomY();
        orient = this.board.getRandomOrientation();
        const canOccupy = this.board.isShipInBoundsAndNotOverlapping(x, y, ship.length, orient);
        if (canOccupy) {
          ship.orientation = orient;
          this.board.markCellsOccupied(canOccupy, ship.id);
          if (this.board.id !== 'computer') {
            this.setRandomPlacement(document.querySelector(`.${this.board.id}[data-ship="${ship.id}"]`), document.querySelector(`#${this.board.id} [data-coordinate="${x},${y}"]`), orient);
          }
          placed = true;
        }
      }
    });
  }
  setRandomPlacement(shipElement, cellElement, orientation) {
    const boardRect = document.getElementById(this.board.id).getBoundingClientRect();
    const cellX = cellElement.offsetLeft;
    const cellY = cellElement.offsetTop;
    const cellRect = cellElement.getBoundingClientRect();
    shipElement.style.position = 'absolute';
    shipElement.style.left = `${cellX + boardRect.left}px`;
    shipElement.style.top = `${cellY + boardRect.top}px`;
    if (orientation === 'horizontal') {
      shipElement.style.transform = `rotate(-90deg) translate(-${cellRect.height}px, 0)`;
    }
  }
  appendShipsToBoard() {
    const ships = document.querySelectorAll(`.${this.board.id}.ship`);
    const board = document.getElementById(`${this.board.id}`);
    ships.forEach(element => {
      board.appendChild(element);
      const currentLeft = parseFloat(element.style.left) || 0;
      const currentTop = parseFloat(element.style.top) || 0;
      const rect = board.getBoundingClientRect();
      element.style.left = `${currentLeft - rect.left}px`;
      element.style.top = `${currentTop - rect.top}px`;
    });
  }
}

// eslint-disable-next-line import/prefer-default-export

;// ./src/ai_strategy/aiStrategy.js
/* eslint-disable no-console */
class AIStrategy {
  constructor(playerBoard) {
    this.hitQueue = [];
    this.initialHit = null;
    this.axis = null;
    this.increasingMoveCount = 1;
    this.decreasingMoveCount = 1;
    this.increasingEndFound = false;
    this.decreasingEndFound = false;
    this.board = playerBoard;
  }

  // eslint-disable-next-line consistent-return
  getNextMove() {
    // If both ends found, reset
    if (this.increasingEndFound && this.decreasingEndFound) {
      this.resetNextMoveState();
      console.log('cleared');
    }

    // If no moves left, reset
    if (this.hitQueue.length === 0) {
      this.resetNextMoveState();
    }

    // Prioritize queued targets from previous hits
    if (this.hitQueue.length !== 0) {
      const coord = this.hitQueue.shift();
      this.board.markGuess(coord);
      console.log('coord from queue just selected', coord);
      const [nx, ny] = coord.split(',');
      const newX = Number(nx);
      const newY = Number(ny);
      const [ix, iy] = this.initialHit.split(',');
      const initialX = Number(ix);
      const initialY = Number(iy);
      // If unsuccessful hit on directionally targeted ship
      // Check if coordinate is endpoint
      if (!this.board.isHitSuccessful(coord) && this.axis) {
        if (newX > initialX || newY > initialY) {
          this.increasingEndFound = true;
          console.log('increasing end found');
        }
        if (newX < initialX || newY < initialY) {
          this.decreasingEndFound = true;
          console.log('decreasing end found');
        }
      }

      // If successful hit...
      if (this.board.isHitSuccessful(coord)) {
        // ...on a ship hit once
        if (!this.axis) {
          this.hitQueue = [];
          // hit count must move one up in the direction hit
          if (newX > initialX || newY > initialY) {
            this.increasingMoveCount += 1;
            console.log('increasing move count incremented');
          }
          if (newX < initialX || newY < initialY) {
            this.decreasingMoveCount += 1;
            console.log('decreasing move count incremented');
          }
        }
        // ...on a ship hit any number of times
        this.fillGuessQueue(coord);
      }
      return coord;
    }

    // make guess if ship not actively being targeted
    if (this.initialHit === null) {
      const limit = this.board.width * this.board.height;
      for (let i = 0; i < limit; i += 1) {
        const x = Math.floor(Math.random() * this.board.width);
        const y = Math.floor(Math.random() * this.board.height);
        const coord = `${x},${y}`;
        // eslint-disable-next-line no-continue
        if (!this.board.markGuess(coord)) continue;
        const wasHit = this.board.isHitSuccessful(coord);
        if (wasHit) this.fillInitialGuessQueue(coord);
        return coord;
      }
      // Fallback: linear scan for any remaining unguessed cell
      for (let x = 0; x < this.board.width; x += 1) {
        for (let y = 0; y < this.board.height; y += 1) {
          const coord = `${x},${y}`;
          if (this.board.markGuess(coord)) return coord;
        }
      }
    }
  }
  fillInitialGuessQueue(coordinate) {
    // when no actively targeted ship
    // get all four surrounding coordinates
    this.initialHit = coordinate;
    const [xs, ys] = coordinate.split(',');
    const x = Number(xs);
    const y = Number(ys);
    const deltas = [[1, 0], [-1, 0], [0, 1], [0, -1]];
    deltas.forEach(([dx, dy]) => {
      const nx = x + dx;
      const ny = y + dy;
      const nCoord = `${nx},${ny}`;
      if (this.board.isWithinBounds(nx, ny) && !this.board.guessHistory.has(nCoord)) {
        this.hitQueue.push(nCoord);
      }
    });
    console.log('hit queue initial', this.hitQueue);
  }
  fillGuessQueue(coordinate) {
    console.log('hit queue before fill', this.hitQueue);
    const [nx, ny] = coordinate.split(',');
    const newX = Number(nx);
    const newY = Number(ny);
    const [ix, iy] = this.initialHit.split(',');
    const initialX = Number(ix);
    const initialY = Number(iy);
    if (newX === initialX) {
      this.axis = 'vertical';
      this.getVerticalMoves(initialX, initialY);
    } else if (newY === initialY) {
      this.axis = 'horizontal';
      this.getHorizontalMoves(initialX, initialY);
    }
    console.log('axis', this.axis);
    console.log('hit queue after fill', this.hitQueue);
  }

  // ISSUE
  getVerticalMoves(x, y) {
    if (this.board.isWithinBounds(x, y - this.decreasingMoveCount) && !this.board.guessHistory.has(`${x},${y - this.decreasingMoveCount}`) && this.decreasingEndFound === false) {
      const proposedXDownwards = `${x},${y - this.decreasingMoveCount}`;
      this.hitQueue.push(proposedXDownwards);
      this.decreasingMoveCount += 1;
      console.log('decreasing move count', this.decreasingMoveCount);
    }
    if (this.board.isWithinBounds(x, y + this.increasingMoveCount) && !this.board.guessHistory.has(`${x},${y + this.increasingMoveCount}`) && this.increasingEndFound === false) {
      const proposedXUpwards = `${x},${y + this.increasingMoveCount}`;
      this.hitQueue.push(proposedXUpwards);
      this.increasingMoveCount += 1;
      console.log('increasing move count', this.increasingMoveCount);
    }
  }
  getHorizontalMoves(initialX, initialY) {
    if (this.board.isWithinBounds(initialX - this.decreasingMoveCount, initialY) && !this.board.guessHistory.has(`${initialX - this.decreasingMoveCount},${initialY}`) && this.decreasingEndFound === false) {
      const proposedYBackwards = `${initialX - this.decreasingMoveCount},${initialY}`;
      this.hitQueue.push(proposedYBackwards);
      this.decreasingMoveCount += 1;
      console.log('decreasing move count', this.decreasingMoveCount);
    }
    if (this.board.isWithinBounds(initialX + this.increasingMoveCount, initialY) && !this.board.guessHistory.has(`${initialX + this.increasingMoveCount},${initialY}`) && this.increasingEndFound === false) {
      const proposedYForwards = `${initialX + this.increasingMoveCount},${initialY}`;
      this.hitQueue.push(proposedYForwards);
      this.increasingMoveCount += 1;
      console.log('increasing move count', this.increasingMoveCount);
    }
  }
  resetNextMoveState() {
    this.hitQueue = [];
    this.initialHit = null;
    this.axis = null;
    this.increasingMoveCount = 1;
    this.decreasingMoveCount = 1;
    this.increasingEndFound = false;
    this.decreasingEndFound = false;
  }
}

// eslint-disable-next-line import/prefer-default-export

;// ./src/pvc_game/pVcGame.js
/* eslint-disable no-param-reassign */
/* eslint-disable no-console */
/* eslint-disable class-methods-use-this */

class PvCGame {
  constructor(playerBoard, opponentBoard) {
    this.playerBoard = playerBoard;
    this.opponentBoard = opponentBoard;
    this.aiStrategy = new AIStrategy(playerBoard);
    this.gamePhase = 'player-turn';
    this.cellClickHandlers = new Map();
    this.setUp();
  }
  setUp() {
    const cellsForSelection = document.querySelectorAll('#computer .cell');
    cellsForSelection.forEach(cell => {
      const handler = () => this.handlePlayerGuess(cell);
      this.cellClickHandlers.set(cell, handler);
      cell.addEventListener('click', handler);
    });
  }
  handlePlayerGuess(cell) {
    if (this.gamePhase !== 'player-turn') return;
    // eslint-disable-next-line prefer-destructuring
    const coordinate = cell.dataset.coordinate;
    this.opponentBoard.markGuess(coordinate);
    if (this.opponentBoard.isHitSuccessful(coordinate)) {
      // eslint-disable-next-line no-restricted-syntax
      for (const ship of Object.values(this.opponentBoard.ships)) {
        if (ship.cellsOccupied.includes(coordinate)) {
          ship.recordHit(coordinate);
          this.showHit(cell);
          if (ship.checkIfSunk() && this.opponentBoard.areAllShipsSunk()) {
            this.onPlayerWin();
          }
          break;
        }
      }
    } else {
      this.showMiss(cell);
    }
    this.gamePhase = 'computer-turn';
    this.executeComputerTurn();
  }
  executeComputerTurn() {
    const coordinate = this.aiStrategy.getNextMove();
    const cell = document.querySelector(`#player [data-coordinate="${coordinate}"]`);
    if (!coordinate) {
      console.warn('AI returned no move; ending turn safely.');
      this.gamePhase = 'player-turn';
      return;
    }
    if (this.playerBoard.isHitSuccessful(coordinate)) {
      // eslint-disable-next-line no-restricted-syntax
      for (const ship of Object.values(this.playerBoard.ships)) {
        if (ship.cellsOccupied.includes(coordinate)) {
          ship.recordHit(coordinate);
          this.showHit(cell);
          if (this.playerBoard.areAllShipsSunk()) {
            this.onComputerWin();
          }
          break;
        }
      }
    } else {
      this.showMiss(cell);
    }
    this.gamePhase = 'player-turn';
  }
  showHit(cell) {
    cell.style.backgroundColor = 'rgba(248, 3, 252, 0.4)';
    this.removeClickListener(cell);
  }
  showMiss(cell) {
    cell.style.backgroundColor = 'transparent';
    this.removeClickListener(cell);
  }
  removeClickListener(cell) {
    const handler = this.cellClickHandlers.get(cell);
    cell.removeEventListener('click', handler);
    this.cellClickHandlers.delete(cell);
  }
  onPlayerWin() {
    this.gamePhase = 'player-win';
    document.getElementById('main-container').classList.add('hidden');
    document.getElementById('player-wins').classList.remove('hidden');
    document.getElementById('play-again').classList.remove('hidden');
  }
  onComputerWin() {
    this.gamePhase = 'computer-win';
    document.getElementById('main-container').classList.add('hidden');
    document.getElementById('computer-wins').classList.remove('hidden');
    document.getElementById('play-again').classList.remove('hidden');
  }
}

// eslint-disable-next-line import/prefer-default-export

;// ./src/pvp_game/pVpGame.js
/* eslint-disable no-console */
/* eslint-disable class-methods-use-this */

class PvPGame {
  constructor(playerBoard, opponentBoard) {
    this.playerBoard = playerBoard;
    this.opponentBoard = opponentBoard;
    this.gamePhase = 'setup';
    this.setUp();
  }
  setUp() {
    document.querySelector('#opponent .cell');
  }
  handlePlayerGuess(x, y) {
    const coord = `${x},${y}`;
    if (!this.gameState.isPlayerTurn()) {
      this.eventBus.emit({
        type: 'INVALID_GUESS',
        playerId: 'player',
        target: coord,
        reason: 'NOT_YOUR_TURN',
        timestamp: Date.now()
      });
      return;
    }
    let result;
    try {
      result = this.computerFleet.recordAttack(coord);
    } catch (error) {
      this.eventBus.emit({
        type: 'INVALID_GUESS',
        playerId: 'player',
        target: coord,
        reason: error.message,
        timestamp: Date.now()
      });
      return;
    }
    this.eventBus.emit({
      type: 'GUESS_MADE',
      playerId: 'player',
      target: coord,
      result,
      timestamp: Date.now()
    });
    if (this.computerFleet.areAllShipsSunk && this.computerFleet.areAllShipsSunk()) {
      this.gameState.endGame('player');
    } else {
      this.gameState.switchTurn();
    }
  }
  executeComputerTurn() {
    if (this.gameState.isPlayerTurn()) return;
    const coord = this.aiStrategy.getNextMove(this.playerFleet.board);
    const result = this.playerFleet.recordAttack(coord);
    this.aiStrategy.recordResult(coord, result, this.playerFleet.board);
    this.eventBus.emit({
      type: 'GUESS_MADE',
      playerId: 'computer',
      target: coord,
      result,
      timestamp: Date.now()
    });
    if (this.playerFleet.areAllShipsSunk && this.playerFleet.areAllShipsSunk()) {
      this.gameState.endGame('computer');
    } else {
      this.gameState.switchTurn();
    }
  }
  handleReset() {
    if (this.dragDropController && this.dragDropController.isDragging && this.dragDropController.isDragging()) {
      try {
        this.dragDropController.cancelDrag();
      } catch (e) {
        // ignore
      }
    }
    this.playerFleet.reset();
    this.computerFleet.reset();
    this.gameState.reset();
    this.aiStrategy.reset();
    this.eventBus.emit({
      type: 'GAME_RESET',
      timestamp: Date.now()
    });
  }
  addEventListener(eventType, handler) {
    this.eventBus.subscribe(eventType, handler);
  }
  getGameStatus() {
    return {
      phase: this.gameState.getCurrentPhase()
    };
  }
}

// eslint-disable-next-line import/prefer-default-export

;// ./src/index.js
/* eslint-disable no-new */







// const computerBoard = new GameBoard();

function initGame() {
  const template = document.getElementById('body');
  const clone = template.content.cloneNode(true);
  document.body.appendChild(clone);
  const createShips = () => ({
    carrier: new Ship('carrier', 5),
    battleship: new Ship('battleship', 4),
    destroyer: new Ship('destroyer', 3),
    submarine: new Ship('submarine', 2),
    patrol: new Ship('patrol', 1)
  });
  const playerBoard = new GameBoard('player', createShips());
  const opponentBoard = new GameBoard('opponent', createShips());
  // Phase 3: UI layer

  // const aiStrategy = new AIStrategy();
  const onStartCallback = async matchType => {
    if (matchType === 'computer') {
      new PvCGame(playerBoard, opponentBoard);
    } else {
      new PvPGame(playerBoard, opponentBoard);
    }
  };
  new UIRenderer(playerBoard, opponentBoard, onStartCallback);
  document.getElementById('play-again').addEventListener('click', () => {
    window.location.reload();
  });
}
initGame();
/******/ })()
;
//# sourceMappingURL=main.js.map