(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["Can"] = factory();
	else
		root["Can"] = factory();
})(this, () => {
return /******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/devtools/devtools.ts"
/*!**********************************!*\
  !*** ./src/devtools/devtools.ts ***!
  \**********************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   DevToolsEvents: () => (/* binding */ DevToolsEvents),
/* harmony export */   devtools: () => (/* binding */ devtools)
/* harmony export */ });
/* harmony import */ var _emitter__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./emitter */ "./src/devtools/emitter.ts");
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _callSuper(t, o, e) { return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e)); }
function _possibleConstructorReturn(t, e) { if (e && ("object" == _typeof(e) || "function" == typeof e)) return e; if (void 0 !== e) throw new TypeError("Derived constructors may only return object or undefined"); return _assertThisInitialized(t); }
function _assertThisInitialized(e) { if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); return e; }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
function _superPropGet(t, o, e, r) { var p = _get(_getPrototypeOf(1 & r ? t.prototype : t), o, e); return 2 & r && "function" == typeof p ? function (t) { return p.apply(e, t); } : p; }
function _get() { return _get = "undefined" != typeof Reflect && Reflect.get ? Reflect.get.bind() : function (e, t, r) { var p = _superPropBase(e, t); if (p) { var n = Object.getOwnPropertyDescriptor(p, t); return n.get ? n.get.call(arguments.length < 3 ? e : r) : n.value; } }, _get.apply(null, arguments); }
function _superPropBase(t, o) { for (; !{}.hasOwnProperty.call(t, o) && null !== (t = _getPrototypeOf(t));); return t; }
function _getPrototypeOf(t) { return _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function (t) { return t.__proto__ || Object.getPrototypeOf(t); }, _getPrototypeOf(t); }
function _inherits(t, e) { if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function"); t.prototype = Object.create(e && e.prototype, { constructor: { value: t, writable: !0, configurable: !0 } }), Object.defineProperty(t, "prototype", { writable: !1 }), e && _setPrototypeOf(t, e); }
function _setPrototypeOf(t, e) { return _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) { return t.__proto__ = e, t; }, _setPrototypeOf(t, e); }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }

var DevToolsEvents = /*#__PURE__*/function (DevToolsEvents) {
  DevToolsEvents["COMPONENT_MOUNT"] = "component:mount";
  DevToolsEvents["COMPONENT_UNMOUNT"] = "component:unmount";
  DevToolsEvents["SIGNAL_INIT"] = "signal:init";
  DevToolsEvents["SIGNAL_UPDATE"] = "signal:update";
  DevToolsEvents["EFFECT_TRIGGER"] = "effect:trigger";
  DevToolsEvents["STORE_MUTATION"] = "store:mutation";
  DevToolsEvents["STORE_ACTION"] = "store:action";
  return DevToolsEvents;
}({});
var CanDevTools = /*#__PURE__*/function (_EventEmitter) {
  function CanDevTools() {
    var _this;
    _classCallCheck(this, CanDevTools);
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    _this = _callSuper(this, CanDevTools, [].concat(args));
    _defineProperty(_this, "enabled", false);
    _defineProperty(_this, "_maxHistorySize", 1000);
    _defineProperty(_this, "_history", []);
    _defineProperty(_this, "_signals", new Map());
    _defineProperty(_this, "_components", new Set());
    return _this;
  }
  _inherits(CanDevTools, _EventEmitter);
  return _createClass(CanDevTools, [{
    key: "init",
    value: function init() {
      var _this2 = this;
      if (typeof window === 'undefined' || this.enabled) return;
      if (!this.enabled) {
        // Standard bridge for browser extensions
        window.__CAN_DEVTOOLS__ = this;
        this.enabled = true;

        // Internal listeners to support Time-Travel
        this.on(DevToolsEvents.SIGNAL_INIT, function (data) {
          if (data.internal) return; // Filter out internal framework signals
          _this2._signals.set(data.id, data.signal);
        });
        this.on(DevToolsEvents.SIGNAL_UPDATE, function (data) {
          if (!_this2._signals.has(data.id)) return; // Only record history for tracked signals
          _this2._history.push(data);
          if (_this2._history.length > _this2._maxHistorySize) {
            _this2._history.shift();
          }
        });
        this.on(DevToolsEvents.COMPONENT_MOUNT, function (vm) {
          return _this2._components.add(vm);
        });
        this.on(DevToolsEvents.COMPONENT_UNMOUNT, function (vm) {
          return _this2._components["delete"](vm);
        });
        this.emit('init', 'Can Framework Connected');
      }
    }
  }, {
    key: "emit",
    value: function emit(event) {
      if (!this.enabled && event !== 'init') return;
      for (var _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
        args[_key2 - 1] = arguments[_key2];
      }
      _superPropGet(CanDevTools, "emit", this, 3)([event].concat(args));

      // Broadcast for browser extensions via postMessage
      if (typeof window !== 'undefined') {
        window.postMessage({
          source: 'can-devtools-bridge',
          event: event,
          payload: args
        }, '*');
      }
    }

    /**
     * Reverts the application state to a specific point in time.
     * @param step The index in the history array to jump to.
     */
  }, {
    key: "jumpTo",
    value: function jumpTo(step) {
      var _this3 = this;
      if (step < 0 || step >= this._history.length) return;

      // Pause recording to prevent the jump itself from being added to history
      var wasEnabled = this.enabled;
      this.enabled = false;
      try {
        var stateAtStep = new Map();
        // Determine the value of every signal at the requested step
        for (var i = 0; i <= step; i++) {
          var _this$_history$i = this._history[i],
            id = _this$_history$i.id,
            newValue = _this$_history$i.newValue;
          stateAtStep.set(id, newValue);
        }

        // Apply the captured values to the live signals
        stateAtStep.forEach(function (value, id) {
          var s = _this3._signals.get(id);
          if (s) s.value = value;
        });
      } finally {
        this.enabled = wasEnabled;
      }
    }

    /**
     * Clears the recorded history of state changes.
     */
  }, {
    key: "clearHistory",
    value: function clearHistory() {
      this._history = [];
    }

    /**
     * Captures the current value of all registered signals in the application.
     */
  }, {
    key: "getSnapshot",
    value: function getSnapshot() {
      var snapshot = {};
      this._signals.forEach(function (s, id) {
        snapshot[id] = s.value;
      });
      return snapshot;
    }

    /**
     * Restores the application state from a previously captured snapshot.
     * @param snapshot An object mapping signal IDs to their intended values.
     */
  }, {
    key: "restoreSnapshot",
    value: function restoreSnapshot(snapshot) {
      var _this4 = this;
      var wasEnabled = this.enabled;
      this.enabled = false; // Pause recording during restoration

      try {
        Object.entries(snapshot).forEach(function (_ref) {
          var _ref2 = _slicedToArray(_ref, 2),
            id = _ref2[0],
            value = _ref2[1];
          var s = _this4._signals.get(Number(id));
          if (s) s.value = value;
        });
        console.log('[DevTools] State restored from snapshot');
      } finally {
        this.enabled = wasEnabled;
      }
    }

    /**
     * Compares two snapshots and returns the differences.
     * @param oldSnap The base snapshot
     * @param newSnap The snapshot to compare against
     */
  }, {
    key: "diffSnapshots",
    value: function diffSnapshots(oldSnap, newSnap) {
      var diff = {};
      var allIds = new Set([].concat(_toConsumableArray(Object.keys(oldSnap)), _toConsumableArray(Object.keys(newSnap))));
      allIds.forEach(function (idStr) {
        var id = Number(idStr);
        var oldVal = oldSnap[id];
        var newVal = newSnap[id];
        if (oldVal !== newVal) {
          diff[id] = {
            oldValue: oldVal,
            newValue: newVal
          };
        }
      });
      return diff;
    }
  }]);
}(_emitter__WEBPACK_IMPORTED_MODULE_0__.EventEmitter);
var devtools = new CanDevTools();

/***/ },

/***/ "./src/devtools/emitter.ts"
/*!*********************************!*\
  !*** ./src/devtools/emitter.ts ***!
  \*********************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   EventEmitter: () => (/* binding */ EventEmitter)
/* harmony export */ });
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var EventEmitter = /*#__PURE__*/function () {
  function EventEmitter() {
    _classCallCheck(this, EventEmitter);
    _defineProperty(this, "events", new Map());
  }
  return _createClass(EventEmitter, [{
    key: "on",
    value: function on(event, callback) {
      if (!this.events.has(event)) {
        this.events.set(event, []);
      }
      this.events.get(event).push(callback);
    }
  }, {
    key: "off",
    value: function off(event, callback) {
      var callbacks = this.events.get(event);
      if (callbacks) {
        this.events.set(event, callbacks.filter(function (cb) {
          return cb !== callback;
        }));
      }
    }
  }, {
    key: "emit",
    value: function emit(event) {
      for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }
      var callbacks = this.events.get(event);
      if (callbacks) {
        callbacks.forEach(function (cb) {
          return cb.apply(void 0, args);
        });
      }
    }
  }]);
}();

/***/ },

/***/ "./src/devtools/index.ts"
/*!*******************************!*\
  !*** ./src/devtools/index.ts ***!
  \*******************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   DevToolsEvents: () => (/* reexport safe */ _devtools__WEBPACK_IMPORTED_MODULE_0__.DevToolsEvents),
/* harmony export */   EventEmitter: () => (/* reexport safe */ _emitter__WEBPACK_IMPORTED_MODULE_1__.EventEmitter),
/* harmony export */   devtools: () => (/* reexport safe */ _devtools__WEBPACK_IMPORTED_MODULE_0__.devtools)
/* harmony export */ });
/* harmony import */ var _devtools__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./devtools */ "./src/devtools/devtools.ts");
/* harmony import */ var _emitter__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./emitter */ "./src/devtools/emitter.ts");



/***/ },

/***/ "./src/reactivity/computed.ts"
/*!************************************!*\
  !*** ./src/reactivity/computed.ts ***!
  \************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   computed: () => (/* binding */ computed)
/* harmony export */ });
/* harmony import */ var _effect__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./effect */ "./src/reactivity/effect.ts");
/* harmony import */ var _dep__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./dep */ "./src/reactivity/dep.ts");
/* harmony import */ var _signal__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./signal */ "./src/reactivity/signal.ts");
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }



var ComputedRefImpl = /*#__PURE__*/function () {
  function ComputedRefImpl(getter) {
    var _this = this;
    _classCallCheck(this, ComputedRefImpl);
    _defineProperty(this, "_dirty", true);
    _defineProperty(this, "dep", (0,_dep__WEBPACK_IMPORTED_MODULE_1__.createDep)());
    this.effect = (0,_effect__WEBPACK_IMPORTED_MODULE_0__.effect)(getter, {
      scheduler: function scheduler() {
        if (!_this._dirty) {
          _this._dirty = true;
          (0,_signal__WEBPACK_IMPORTED_MODULE_2__.trigger)(_this.dep);
        }
      }
    });
  }
  return _createClass(ComputedRefImpl, [{
    key: "value",
    get: function get() {
      (0,_effect__WEBPACK_IMPORTED_MODULE_0__.trackEffects)(this.dep);
      if (this._dirty) {
        this._dirty = false;
        this._value = this.effect();
      }
      return this._value;
    }
  }]);
}();
function computed(getter) {
  return new ComputedRefImpl(getter);
}

/***/ },

/***/ "./src/reactivity/dep.ts"
/*!*******************************!*\
  !*** ./src/reactivity/dep.ts ***!
  \*******************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createDep: () => (/* binding */ createDep)
/* harmony export */ });
function createDep(effects) {
  return new Set(effects);
}

/***/ },

/***/ "./src/reactivity/effect.ts"
/*!**********************************!*\
  !*** ./src/reactivity/effect.ts ***!
  \**********************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   EffectScope: () => (/* binding */ EffectScope),
/* harmony export */   effect: () => (/* binding */ effect),
/* harmony export */   targetMap: () => (/* binding */ targetMap),
/* harmony export */   track: () => (/* binding */ track),
/* harmony export */   trackEffects: () => (/* binding */ trackEffects),
/* harmony export */   trigger: () => (/* binding */ trigger),
/* harmony export */   triggerEffects: () => (/* binding */ triggerEffects)
/* harmony export */ });
/* harmony import */ var _dep__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./dep */ "./src/reactivity/dep.ts");
/* harmony import */ var _runtime_core_scheduler__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../runtime-core/scheduler */ "./src/runtime-core/scheduler.ts");
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }


var targetMap = new WeakMap();
var activeEffect = undefined;
var activeEffectScope = undefined;
var EffectScope = /*#__PURE__*/function () {
  function EffectScope() {
    _classCallCheck(this, EffectScope);
    _defineProperty(this, "active", true);
    _defineProperty(this, "effects", []);
  }
  return _createClass(EffectScope, [{
    key: "run",
    value: function run(fn) {
      if (this.active) {
        var prev = activeEffectScope;
        try {
          activeEffectScope = this;
          return fn();
        } finally {
          activeEffectScope = prev;
        }
      }
    }
  }, {
    key: "stop",
    value: function stop() {
      if (this.active) {
        this.effects.forEach(function (e) {
          e.active = false;
          cleanupEffect(e);
        });
        this.active = false;
      }
    }
  }]);
}();
function effect(fn, options) {
  var _effect = createReactiveEffect(fn);
  if (options !== null && options !== void 0 && options.scheduler) _effect.scheduler = options.scheduler;
  if (!(options !== null && options !== void 0 && options.lazy)) _effect();
  return _effect;
}
function createReactiveEffect(fn) {
  var _effectFn = function effectFn() {
    if (!_effectFn.active) return fn();
    try {
      activeEffect = _effectFn;
      cleanupEffect(_effectFn);
      return fn();
    } finally {
      activeEffect = undefined;
    }
  };
  _effectFn.active = true;
  _effectFn.deps = [];
  if (activeEffectScope && activeEffectScope.active) {
    activeEffectScope.effects.push(_effectFn);
  }
  return _effectFn;
}
function cleanupEffect(effect) {
  var deps = effect.deps;
  if (deps.length) {
    for (var i = 0; i < deps.length; i++) {
      deps[i]["delete"](effect);
    }
    deps.length = 0;
  }
}
function track(target, key) {
  if (!activeEffect) return;
  var depsMap = targetMap.get(target);
  if (!depsMap) {
    targetMap.set(target, depsMap = new Map());
  }
  var dep = depsMap.get(key);
  if (!dep) {
    depsMap.set(key, dep = (0,_dep__WEBPACK_IMPORTED_MODULE_0__.createDep)());
  }
  trackEffects(dep);
}
function trackEffects(dep) {
  if (activeEffect && !dep.has(activeEffect)) {
    dep.add(activeEffect);
    activeEffect.deps.push(dep);
  }
}
function triggerEffects(dep) {
  var effects = _toConsumableArray(dep);
  var _iterator = _createForOfIteratorHelper(effects),
    _step;
  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var _effect2 = _step.value;
      if (_effect2.scheduler) {
        _effect2.scheduler();
      } else {
        (0,_runtime_core_scheduler__WEBPACK_IMPORTED_MODULE_1__.queueJob)(_effect2);
      }
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }
}
function trigger(target, key) {
  var depsMap = targetMap.get(target);
  if (!depsMap) return;
  var dep = depsMap.get(key);
  if (dep) {
    triggerEffects(dep);
  }
}

/***/ },

/***/ "./src/reactivity/index.ts"
/*!*********************************!*\
  !*** ./src/reactivity/index.ts ***!
  \*********************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   EffectScope: () => (/* reexport safe */ _effect__WEBPACK_IMPORTED_MODULE_2__.EffectScope),
/* harmony export */   computed: () => (/* reexport safe */ _computed__WEBPACK_IMPORTED_MODULE_1__.computed),
/* harmony export */   effect: () => (/* reexport safe */ _effect__WEBPACK_IMPORTED_MODULE_2__.effect),
/* harmony export */   isReactive: () => (/* reexport safe */ _reactive__WEBPACK_IMPORTED_MODULE_0__.isReactive),
/* harmony export */   isReadonly: () => (/* reexport safe */ _reactive__WEBPACK_IMPORTED_MODULE_0__.isReadonly),
/* harmony export */   isRef: () => (/* reexport safe */ _ref__WEBPACK_IMPORTED_MODULE_3__.isRef),
/* harmony export */   isShallow: () => (/* reexport safe */ _reactive__WEBPACK_IMPORTED_MODULE_0__.isShallow),
/* harmony export */   isSignal: () => (/* reexport safe */ _signal__WEBPACK_IMPORTED_MODULE_4__.isSignal),
/* harmony export */   markRaw: () => (/* reexport safe */ _reactive__WEBPACK_IMPORTED_MODULE_0__.markRaw),
/* harmony export */   proxyRefs: () => (/* reexport safe */ _ref__WEBPACK_IMPORTED_MODULE_3__.proxyRefs),
/* harmony export */   reactive: () => (/* reexport safe */ _reactive__WEBPACK_IMPORTED_MODULE_0__.reactive),
/* harmony export */   readonly: () => (/* reexport safe */ _reactive__WEBPACK_IMPORTED_MODULE_0__.readonly),
/* harmony export */   ref: () => (/* reexport safe */ _ref__WEBPACK_IMPORTED_MODULE_3__.ref),
/* harmony export */   shallowReactive: () => (/* reexport safe */ _reactive__WEBPACK_IMPORTED_MODULE_0__.shallowReactive),
/* harmony export */   shallowReadonly: () => (/* reexport safe */ _reactive__WEBPACK_IMPORTED_MODULE_0__.shallowReadonly),
/* harmony export */   shallowRef: () => (/* reexport safe */ _ref__WEBPACK_IMPORTED_MODULE_3__.shallowRef),
/* harmony export */   shallowSignal: () => (/* reexport safe */ _signal__WEBPACK_IMPORTED_MODULE_4__.shallowSignal),
/* harmony export */   signal: () => (/* reexport safe */ _signal__WEBPACK_IMPORTED_MODULE_4__.signal),
/* harmony export */   targetMap: () => (/* reexport safe */ _effect__WEBPACK_IMPORTED_MODULE_2__.targetMap),
/* harmony export */   toRaw: () => (/* reexport safe */ _reactive__WEBPACK_IMPORTED_MODULE_0__.toRaw),
/* harmony export */   toRef: () => (/* reexport safe */ _ref__WEBPACK_IMPORTED_MODULE_3__.toRef),
/* harmony export */   toRefs: () => (/* reexport safe */ _ref__WEBPACK_IMPORTED_MODULE_3__.toRefs),
/* harmony export */   track: () => (/* reexport safe */ _effect__WEBPACK_IMPORTED_MODULE_2__.track),
/* harmony export */   trackEffects: () => (/* reexport safe */ _effect__WEBPACK_IMPORTED_MODULE_2__.trackEffects),
/* harmony export */   traverse: () => (/* reexport safe */ _reactive__WEBPACK_IMPORTED_MODULE_0__.traverse),
/* harmony export */   trigger: () => (/* reexport safe */ _effect__WEBPACK_IMPORTED_MODULE_2__.trigger),
/* harmony export */   triggerEffects: () => (/* reexport safe */ _effect__WEBPACK_IMPORTED_MODULE_2__.triggerEffects),
/* harmony export */   unref: () => (/* reexport safe */ _ref__WEBPACK_IMPORTED_MODULE_3__.unref),
/* harmony export */   watch: () => (/* reexport safe */ _watch__WEBPACK_IMPORTED_MODULE_5__.watch)
/* harmony export */ });
/* harmony import */ var _reactive__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./reactive */ "./src/reactivity/reactive.ts");
/* harmony import */ var _computed__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./computed */ "./src/reactivity/computed.ts");
/* harmony import */ var _effect__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./effect */ "./src/reactivity/effect.ts");
/* harmony import */ var _ref__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./ref */ "./src/reactivity/ref.ts");
/* harmony import */ var _signal__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./signal */ "./src/reactivity/signal.ts");
/* harmony import */ var _watch__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./watch */ "./src/reactivity/watch.ts");







/***/ },

/***/ "./src/reactivity/reactive.ts"
/*!************************************!*\
  !*** ./src/reactivity/reactive.ts ***!
  \************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ReactiveFlags: () => (/* binding */ ReactiveFlags),
/* harmony export */   isReactive: () => (/* binding */ isReactive),
/* harmony export */   isReadonly: () => (/* binding */ isReadonly),
/* harmony export */   isShallow: () => (/* binding */ isShallow),
/* harmony export */   markRaw: () => (/* binding */ markRaw),
/* harmony export */   reactive: () => (/* binding */ reactive),
/* harmony export */   readonly: () => (/* binding */ readonly),
/* harmony export */   shallowReactive: () => (/* binding */ shallowReactive),
/* harmony export */   shallowReadonly: () => (/* binding */ shallowReadonly),
/* harmony export */   toRaw: () => (/* binding */ toRaw),
/* harmony export */   traverse: () => (/* binding */ traverse)
/* harmony export */ });
/* harmony import */ var _effect__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./effect */ "./src/reactivity/effect.ts");
/* harmony import */ var _shared_index__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../shared/index */ "./src/shared/index.ts");


var ReactiveFlags = /*#__PURE__*/function (ReactiveFlags) {
  ReactiveFlags["IS_REACTIVE"] = "__c_isReactive";
  ReactiveFlags["IS_READONLY"] = "__c_isReadonly";
  ReactiveFlags["IS_SHALLOW"] = "__c_isShallow";
  ReactiveFlags["RAW"] = "__c_raw";
  return ReactiveFlags;
}({});
var reactiveMap = new WeakMap();
var shallowReactiveMap = new WeakMap();
var readonlyMap = new WeakMap();
var shallowReadonlyMap = new WeakMap();
function reactive(target) {
  return createReactiveObject(target, false, reactiveMap, false);
}
function shallowReactive(target) {
  return createReactiveObject(target, false, shallowReactiveMap, true);
}
function readonly(target) {
  return createReactiveObject(target, true, readonlyMap, false);
}
function shallowReadonly(target) {
  return createReactiveObject(target, true, shallowReadonlyMap, true);
}
function createReactiveObject(target, isReadonly, proxyMap, isShallow) {
  if (!(0,_shared_index__WEBPACK_IMPORTED_MODULE_1__.isObject)(target)) return target;
  if (proxyMap.has(target)) return proxyMap.get(target);
  var proxy = new Proxy(target, {
    get: function get(target, key, receiver) {
      if (key === ReactiveFlags.IS_REACTIVE) return !isReadonly;
      if (key === ReactiveFlags.IS_READONLY) return isReadonly;
      if (key === ReactiveFlags.IS_SHALLOW) return isShallow;
      if (key === ReactiveFlags.RAW) return target;
      var res = Reflect.get(target, key, receiver);
      if (!isReadonly) {
        (0,_effect__WEBPACK_IMPORTED_MODULE_0__.track)(target, key);
      }
      if (isShallow) {
        return res;
      }
      return (0,_shared_index__WEBPACK_IMPORTED_MODULE_1__.isObject)(res) ? isReadonly ? readonly(res) : reactive(res) : res;
    },
    set: function set(target, key, value, receiver) {
      if (isReadonly) {
        console.warn("Set operation on key \"".concat(String(key), "\" failed: target is readonly."), target);
        return true;
      }
      var oldValue = target[key];
      var result = Reflect.set(target, key, value, receiver);
      if ((0,_shared_index__WEBPACK_IMPORTED_MODULE_1__.hasChanged)(value, oldValue)) {
        (0,_effect__WEBPACK_IMPORTED_MODULE_0__.trigger)(target, key);
      }
      return result;
    },
    deleteProperty: function deleteProperty(target, key) {
      if (isReadonly) {
        console.warn("Delete operation on key \"".concat(String(key), "\" failed: target is readonly."), target);
        return true;
      }
      var hasKey = Object.prototype.hasOwnProperty.call(target, key);
      var result = Reflect.deleteProperty(target, key);
      if (result && hasKey) {
        (0,_effect__WEBPACK_IMPORTED_MODULE_0__.trigger)(target, key);
      }
      return result;
    }
  });
  proxyMap.set(target, proxy);
  return proxy;
}
function isReactive(value) {
  return !!(value && value[ReactiveFlags.IS_REACTIVE]);
}
function isReadonly(value) {
  return !!(value && value[ReactiveFlags.IS_READONLY]);
}
function isShallow(value) {
  return !!(value && value[ReactiveFlags.IS_SHALLOW]);
}
function markRaw(value) {
  Object.defineProperty(value, ReactiveFlags.RAW, {
    value: value,
    enumerable: false
  });
  return value;
}
function toRaw(observed) {
  var raw = observed && observed[ReactiveFlags.RAW];
  return raw ? toRaw(raw) : observed;
}

/**
 * Recursively traverses an object to trigger all its reactive properties.
 * Essential for deep watching.
 */
function traverse(value) {
  var seen = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : new Set();
  if (!(0,_shared_index__WEBPACK_IMPORTED_MODULE_1__.isObject)(value) || seen.has(value)) {
    return value;
  }
  seen.add(value);
  if (value && value.__c_isRef) {
    traverse(value.value, seen);
  } else if (Array.isArray(value)) {
    for (var i = 0; i < value.length; i++) {
      traverse(value[i], seen);
    }
  } else {
    for (var key in value) {
      traverse(value[key], seen);
    }
  }
  return value;
}

/***/ },

/***/ "./src/reactivity/ref.ts"
/*!*******************************!*\
  !*** ./src/reactivity/ref.ts ***!
  \*******************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   isRef: () => (/* binding */ isRef),
/* harmony export */   proxyRefs: () => (/* binding */ proxyRefs),
/* harmony export */   ref: () => (/* binding */ ref),
/* harmony export */   shallowRef: () => (/* binding */ shallowRef),
/* harmony export */   toRef: () => (/* binding */ toRef),
/* harmony export */   toRefs: () => (/* binding */ toRefs),
/* harmony export */   unref: () => (/* binding */ unref)
/* harmony export */ });
/* harmony import */ var _signal__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./signal */ "./src/reactivity/signal.ts");
/* harmony import */ var _reactive__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./reactive */ "./src/reactivity/reactive.ts");
/* harmony import */ var _shared_index__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../shared/index */ "./src/shared/index.ts");



function ref(value) {
  if (isRef(value)) return value;
  var wrappedValue = (0,_shared_index__WEBPACK_IMPORTED_MODULE_2__.isObject)(value) ? (0,_reactive__WEBPACK_IMPORTED_MODULE_1__.reactive)(value) : value;
  var s = (0,_signal__WEBPACK_IMPORTED_MODULE_0__.signal)(wrappedValue);
  Object.defineProperty(s, '__c_isRef', {
    value: true,
    enumerable: false
  });
  return s;
}
function toRef(object, key) {
  var val = object[key];
  if (isRef(val)) return val;
  var r = {
    get value() {
      return object[key];
    },
    set value(newVal) {
      object[key] = newVal;
    }
  };
  Object.defineProperty(r, '__c_isRef', {
    value: true,
    enumerable: false
  });
  return r;
}
function toRefs(object) {
  var ret = Array.isArray(object) ? new Array(object.length) : {};
  for (var key in object) {
    ret[key] = toRef(object, key);
  }
  return ret;
}
function proxyRefs(objectWithRefs) {
  return new Proxy(objectWithRefs, {
    get: function get(target, key, receiver) {
      return unref(Reflect.get(target, key, receiver));
    },
    set: function set(target, key, value, receiver) {
      var oldValue = Reflect.get(target, key, receiver);
      if (isRef(oldValue) && !isRef(value)) {
        oldValue.value = value;
        return true;
      } else {
        return Reflect.set(target, key, value, receiver);
      }
    }
  });
}
function isRef(value) {
  return !!(value && value.__c_isRef === true);
}
function unref(ref) {
  return isRef(ref) ? ref.value : ref;
}
function shallowRef(value) {
  var s = (0,_signal__WEBPACK_IMPORTED_MODULE_0__.signal)(value);
  Object.defineProperty(s, '__c_isRef', {
    value: true,
    enumerable: false
  });
  return s;
}

/***/ },

/***/ "./src/reactivity/signal.ts"
/*!**********************************!*\
  !*** ./src/reactivity/signal.ts ***!
  \**********************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   isSignal: () => (/* binding */ isSignal),
/* harmony export */   shallowSignal: () => (/* binding */ shallowSignal),
/* harmony export */   signal: () => (/* binding */ signal),
/* harmony export */   trigger: () => (/* binding */ trigger)
/* harmony export */ });
/* harmony import */ var _effect__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./effect */ "./src/reactivity/effect.ts");
/* harmony import */ var _shared_index__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../shared/index */ "./src/shared/index.ts");
/* harmony import */ var _runtime_core_scheduler__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../runtime-core/scheduler */ "./src/runtime-core/scheduler.ts");
/* harmony import */ var _dep__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./dep */ "./src/reactivity/dep.ts");
/* harmony import */ var _devtools_devtools__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../devtools/devtools */ "./src/devtools/devtools.ts");
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }





var uid = 0;
function signal(initialValue) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var dep = (0,_dep__WEBPACK_IMPORTED_MODULE_3__.createDep)();
  var _value = initialValue;
  var id = uid++;
  var s = {
    get value() {
      (0,_effect__WEBPACK_IMPORTED_MODULE_0__.trackEffects)(dep);
      return _value;
    },
    set value(newValue) {
      if ((0,_shared_index__WEBPACK_IMPORTED_MODULE_1__.hasChanged)(newValue, _value)) {
        var oldValue = _value;
        _value = newValue;
        _devtools_devtools__WEBPACK_IMPORTED_MODULE_4__.devtools.emit(_devtools_devtools__WEBPACK_IMPORTED_MODULE_4__.DevToolsEvents.SIGNAL_UPDATE, {
          id: id,
          newValue: newValue,
          oldValue: oldValue
        });
        trigger(dep);
      }
    }
  };
  _devtools_devtools__WEBPACK_IMPORTED_MODULE_4__.devtools.emit(_devtools_devtools__WEBPACK_IMPORTED_MODULE_4__.DevToolsEvents.SIGNAL_INIT, {
    id: id,
    signal: s,
    name: options.name,
    internal: options.internal
  });
  return s;
}
function trigger(dep) {
  var effects = _toConsumableArray(dep);
  var _iterator = _createForOfIteratorHelper(effects),
    _step;
  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var effect = _step.value;
      if (effect.scheduler) {
        effect.scheduler();
      } else {
        (0,_runtime_core_scheduler__WEBPACK_IMPORTED_MODULE_2__.queueJob)(effect);
      }
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }
}
function isSignal(val) {
  return val && _typeof(val) === 'object' && 'value' in val;
}

/**
 * Creates a shallow reactive signal.
 * In this framework, signal() is already shallow by default (use ref() for deep reactivity).
 */
function shallowSignal(initialValue) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  return signal(initialValue, options);
}

/***/ },

/***/ "./src/reactivity/watch.ts"
/*!*********************************!*\
  !*** ./src/reactivity/watch.ts ***!
  \*********************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   watch: () => (/* binding */ watch)
/* harmony export */ });
/* harmony import */ var _effect__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./effect */ "./src/reactivity/effect.ts");
/* harmony import */ var _reactive__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./reactive */ "./src/reactivity/reactive.ts");
/* harmony import */ var _ref__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./ref */ "./src/reactivity/ref.ts");
/* harmony import */ var _runtime_core_scheduler__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../runtime-core/scheduler */ "./src/runtime-core/scheduler.ts");




function watch(source, cb) {
  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  var getter;
  var forceDeep = false;
  if ((0,_ref__WEBPACK_IMPORTED_MODULE_2__.isRef)(source)) {
    getter = function getter() {
      return source.value;
    };
  } else if ((0,_reactive__WEBPACK_IMPORTED_MODULE_1__.isReactive)(source)) {
    getter = function getter() {
      return source;
    };
    forceDeep = true;
  } else if (Array.isArray(source)) {
    getter = function getter() {
      return source.map(function (s) {
        if ((0,_ref__WEBPACK_IMPORTED_MODULE_2__.isRef)(s)) return s.value;
        if ((0,_reactive__WEBPACK_IMPORTED_MODULE_1__.isReactive)(s)) return (0,_reactive__WEBPACK_IMPORTED_MODULE_1__.traverse)(s);
        return s;
      });
    };
  } else if (typeof source === 'function') {
    getter = source;
  } else {
    getter = function getter() {};
  }
  if (options.deep || forceDeep) {
    var baseGetter = getter;
    getter = function getter() {
      return (0,_reactive__WEBPACK_IMPORTED_MODULE_1__.traverse)(baseGetter());
    };
  }
  var oldValue;
  var job = function job() {
    var newValue = runner();
    if (options.deep || forceDeep || newValue !== oldValue) {
      cb(newValue, oldValue);
      oldValue = newValue;
    }
  };
  var runner = (0,_effect__WEBPACK_IMPORTED_MODULE_0__.effect)(getter, {
    scheduler: function scheduler() {
      if (options.flush === 'post') {
        (0,_runtime_core_scheduler__WEBPACK_IMPORTED_MODULE_3__.queuePostFlushJob)(job);
      } else {
        (0,_runtime_core_scheduler__WEBPACK_IMPORTED_MODULE_3__.queueJob)(job);
      }
    }
  });
  if (options.immediate) {
    job();
  } else {
    oldValue = runner();
  }
}

/***/ },

/***/ "./src/router/Router.ts"
/*!******************************!*\
  !*** ./src/router/Router.ts ***!
  \******************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Router: () => (/* binding */ Router),
/* harmony export */   createRouter: () => (/* binding */ createRouter),
/* harmony export */   useRoute: () => (/* binding */ useRoute),
/* harmony export */   useRouter: () => (/* binding */ useRouter)
/* harmony export */ });
/* harmony import */ var _reactivity_signal__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../reactivity/signal */ "./src/reactivity/signal.ts");
/* harmony import */ var _runtime_core_apiInject__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../runtime-core/apiInject */ "./src/runtime-core/apiInject.ts");
/* harmony import */ var _matcher__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./matcher */ "./src/router/matcher.ts");
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }



var Router = /*#__PURE__*/function () {
  function Router(options) {
    var _this = this;
    _classCallCheck(this, Router);
    this.routes = options.routes;
    this.matcher = (0,_matcher__WEBPACK_IMPORTED_MODULE_2__.createMatcher)(this.routes);
    var initialPath = typeof window !== 'undefined' ? window.location.pathname : '/';
    this.currentRoute = (0,_reactivity_signal__WEBPACK_IMPORTED_MODULE_0__.signal)(this.matcher(initialPath));

    // Listen for browser Back/Forward buttons
    if (typeof window !== 'undefined') {
      window.addEventListener('popstate', function () {
        _this.currentRoute.value = _this.matcher(window.location.pathname);
      });
    }
  }
  return _createClass(Router, [{
    key: "push",
    value: function push(path) {
      var match = this.matcher(path);
      if (typeof window !== 'undefined') {
        window.history.pushState({}, '', path);
      }
      this.currentRoute.value = match;
    }
  }, {
    key: "replace",
    value: function replace(path) {
      var match = this.matcher(path);
      if (typeof window !== 'undefined') {
        window.history.replaceState({}, '', path);
      }
      this.currentRoute.value = match;
    }

    /**
     * Integration with app.use()
     */
  }, {
    key: "install",
    value: function install(app) {
      app.provide('router', this);
    }
  }]);
}();

/**
 * Factory function to create a router instance.
 */
function createRouter(options) {
  return new Router(options);
}
function useRouter() {
  var router = (0,_runtime_core_apiInject__WEBPACK_IMPORTED_MODULE_1__.inject)('router');
  if (!router) {
    throw new Error('[Router] Router not found. Did you provide it in app.use()?');
  }
  return router;
}
function useRoute() {
  return useRouter().currentRoute;
}

/***/ },

/***/ "./src/router/RouterLink.ts"
/*!**********************************!*\
  !*** ./src/router/RouterLink.ts ***!
  \**********************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   RouterLink: () => (/* binding */ RouterLink)
/* harmony export */ });
/* harmony import */ var _Router__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Router */ "./src/router/Router.ts");
/* harmony import */ var _runtime_dom_customElement__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../runtime-dom/customElement */ "./src/runtime-dom/customElement.ts");
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _callSuper(t, o, e) { return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e)); }
function _possibleConstructorReturn(t, e) { if (e && ("object" == _typeof(e) || "function" == typeof e)) return e; if (void 0 !== e) throw new TypeError("Derived constructors may only return object or undefined"); return _assertThisInitialized(t); }
function _assertThisInitialized(e) { if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); return e; }
function _inherits(t, e) { if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function"); t.prototype = Object.create(e && e.prototype, { constructor: { value: t, writable: !0, configurable: !0 } }), Object.defineProperty(t, "prototype", { writable: !1 }), e && _setPrototypeOf(t, e); }
function _wrapNativeSuper(t) { var r = "function" == typeof Map ? new Map() : void 0; return _wrapNativeSuper = function _wrapNativeSuper(t) { if (null === t || !_isNativeFunction(t)) return t; if ("function" != typeof t) throw new TypeError("Super expression must either be null or a function"); if (void 0 !== r) { if (r.has(t)) return r.get(t); r.set(t, Wrapper); } function Wrapper() { return _construct(t, arguments, _getPrototypeOf(this).constructor); } return Wrapper.prototype = Object.create(t.prototype, { constructor: { value: Wrapper, enumerable: !1, writable: !0, configurable: !0 } }), _setPrototypeOf(Wrapper, t); }, _wrapNativeSuper(t); }
function _construct(t, e, r) { if (_isNativeReflectConstruct()) return Reflect.construct.apply(null, arguments); var o = [null]; o.push.apply(o, e); var p = new (t.bind.apply(t, o))(); return r && _setPrototypeOf(p, r.prototype), p; }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
function _isNativeFunction(t) { try { return -1 !== Function.toString.call(t).indexOf("[native code]"); } catch (n) { return "function" == typeof t; } }
function _setPrototypeOf(t, e) { return _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) { return t.__proto__ = e, t; }, _setPrototypeOf(t, e); }
function _getPrototypeOf(t) { return _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function (t) { return t.__proto__ || Object.getPrototypeOf(t); }, _getPrototypeOf(t); }


var RouterLink = /*#__PURE__*/function (_HTMLElement) {
  function RouterLink() {
    _classCallCheck(this, RouterLink);
    return _callSuper(this, RouterLink, arguments);
  }
  _inherits(RouterLink, _HTMLElement);
  return _createClass(RouterLink, [{
    key: "render",
    value: function render() {
      // Use reactive props so render re-runs when 'to' changes
      var to = this.getAttribute('to') || '/';
      var router = (0,_Router__WEBPACK_IMPORTED_MODULE_0__.useRouter)();
      var a = document.createElement('a');
      a.setAttribute('href', to);
      a.addEventListener('click', function (e) {
        e.preventDefault();
        router.push(to);
      });
      var slot = document.createElement('slot');
      a.appendChild(slot);
      return a;
    }
  }], [{
    key: "observedAttributes",
    get: function get() {
      return ['to'];
    }
  }]);
}(/*#__PURE__*/_wrapNativeSuper(HTMLElement));

// Register the router-link using the framework's custom element utility
(0,_runtime_dom_customElement__WEBPACK_IMPORTED_MODULE_1__.defineCustomElement)('router-link', RouterLink, {
  observedAttributes: RouterLink.observedAttributes
});

/***/ },

/***/ "./src/router/RouterView.ts"
/*!**********************************!*\
  !*** ./src/router/RouterView.ts ***!
  \**********************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   RouterView: () => (/* binding */ RouterView)
/* harmony export */ });
/* harmony import */ var _reactivity_effect__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../reactivity/effect */ "./src/reactivity/effect.ts");
/* harmony import */ var _Router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Router */ "./src/router/Router.ts");
/* harmony import */ var _runtime_dom_customElement__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../runtime-dom/customElement */ "./src/runtime-dom/customElement.ts");
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _callSuper(t, o, e) { return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e)); }
function _possibleConstructorReturn(t, e) { if (e && ("object" == _typeof(e) || "function" == typeof e)) return e; if (void 0 !== e) throw new TypeError("Derived constructors may only return object or undefined"); return _assertThisInitialized(t); }
function _assertThisInitialized(e) { if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); return e; }
function _inherits(t, e) { if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function"); t.prototype = Object.create(e && e.prototype, { constructor: { value: t, writable: !0, configurable: !0 } }), Object.defineProperty(t, "prototype", { writable: !1 }), e && _setPrototypeOf(t, e); }
function _wrapNativeSuper(t) { var r = "function" == typeof Map ? new Map() : void 0; return _wrapNativeSuper = function _wrapNativeSuper(t) { if (null === t || !_isNativeFunction(t)) return t; if ("function" != typeof t) throw new TypeError("Super expression must either be null or a function"); if (void 0 !== r) { if (r.has(t)) return r.get(t); r.set(t, Wrapper); } function Wrapper() { return _construct(t, arguments, _getPrototypeOf(this).constructor); } return Wrapper.prototype = Object.create(t.prototype, { constructor: { value: Wrapper, enumerable: !1, writable: !0, configurable: !0 } }), _setPrototypeOf(Wrapper, t); }, _wrapNativeSuper(t); }
function _construct(t, e, r) { if (_isNativeReflectConstruct()) return Reflect.construct.apply(null, arguments); var o = [null]; o.push.apply(o, e); var p = new (t.bind.apply(t, o))(); return r && _setPrototypeOf(p, r.prototype), p; }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
function _isNativeFunction(t) { try { return -1 !== Function.toString.call(t).indexOf("[native code]"); } catch (n) { return "function" == typeof t; } }
function _setPrototypeOf(t, e) { return _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) { return t.__proto__ = e, t; }, _setPrototypeOf(t, e); }
function _getPrototypeOf(t) { return _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function (t) { return t.__proto__ || Object.getPrototypeOf(t); }, _getPrototypeOf(t); }



var RouterView = /*#__PURE__*/function (_HTMLElement) {
  function RouterView() {
    _classCallCheck(this, RouterView);
    return _callSuper(this, RouterView, arguments);
  }
  _inherits(RouterView, _HTMLElement);
  return _createClass(RouterView, [{
    key: "render",
    value: function render() {
      var container = document.createElement('div');
      container.style.display = 'contents'; // Don't affect layout

      var router = (0,_Router__WEBPACK_IMPORTED_MODULE_1__.useRouter)();

      // Watch the current path signal
      (0,_reactivity_effect__WEBPACK_IMPORTED_MODULE_0__.effect)(function () {
        var match = router.currentRoute.value;

        // Clear previous content
        container.innerHTML = '';
        if (match) {
          var ComponentClass = match.component;
          var instance = new ComponentClass();
          // Pass extracted URL params as props to the component
          Object.assign(instance.props, match.params);
          container.appendChild(instance);
        } else {
          container.textContent = '404 - Not Found';
        }
      });
      return container;
    }
  }]);
}(/*#__PURE__*/_wrapNativeSuper(HTMLElement));

// Register the router-view using the framework's custom element utility
(0,_runtime_dom_customElement__WEBPACK_IMPORTED_MODULE_2__.defineCustomElement)('router-view', RouterView);

/***/ },

/***/ "./src/router/index.ts"
/*!*****************************!*\
  !*** ./src/router/index.ts ***!
  \*****************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Router: () => (/* reexport safe */ _Router__WEBPACK_IMPORTED_MODULE_0__.Router),
/* harmony export */   RouterLink: () => (/* reexport safe */ _RouterLink__WEBPACK_IMPORTED_MODULE_2__.RouterLink),
/* harmony export */   RouterView: () => (/* reexport safe */ _RouterView__WEBPACK_IMPORTED_MODULE_1__.RouterView),
/* harmony export */   createRouter: () => (/* reexport safe */ _Router__WEBPACK_IMPORTED_MODULE_0__.createRouter),
/* harmony export */   useRoute: () => (/* reexport safe */ _Router__WEBPACK_IMPORTED_MODULE_0__.useRoute),
/* harmony export */   useRouter: () => (/* reexport safe */ _Router__WEBPACK_IMPORTED_MODULE_0__.useRouter)
/* harmony export */ });
/* harmony import */ var _Router__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Router */ "./src/router/Router.ts");
/* harmony import */ var _RouterView__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./RouterView */ "./src/router/RouterView.ts");
/* harmony import */ var _RouterLink__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./RouterLink */ "./src/router/RouterLink.ts");




/***/ },

/***/ "./src/router/matcher.ts"
/*!*******************************!*\
  !*** ./src/router/matcher.ts ***!
  \*******************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createMatcher: () => (/* binding */ createMatcher)
/* harmony export */ });
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/**
 * Represents a single route definition provided by the user.
 */

/**
 * The result of a successful match, including extracted parameters.
 */

/**
 * createMatcher: Compiles route paths into Regular Expressions 
 * to support dynamic parameters (e.g., /user/:id).
 */
function createMatcher(routes) {
  var compiledRoutes = routes.map(function (route) {
    var paramNames = [];

    // Transform /user/:id into a regex pattern and track param names
    var regexPath = route.path.replace(/\//g, '\\/') // Escape slashes
    .replace(/:([a-zA-Z_$][a-zA-Z0-9_$]*)/g, function (_, name) {
      paramNames.push(name);
      return '([^\\/]+)'; // Capture segment
    });
    return _objectSpread(_objectSpread({}, route), {}, {
      regex: new RegExp("^".concat(regexPath, "$")),
      paramNames: paramNames
    });
  });
  return function (path) {
    var _iterator = _createForOfIteratorHelper(compiledRoutes),
      _step;
    try {
      var _loop = function _loop() {
          var route = _step.value;
          var match = path.match(route.regex);
          if (match) {
            var params = {};
            route.paramNames.forEach(function (name, index) {
              params[name] = decodeURIComponent(match[index + 1]);
            });
            return {
              v: {
                component: route.component,
                params: params,
                path: path
              }
            };
          }
        },
        _ret;
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        _ret = _loop();
        if (_ret) return _ret.v;
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
    return null;
  };
}

/***/ },

/***/ "./src/runtime-core/Component.ts"
/*!***************************************!*\
  !*** ./src/runtime-core/Component.ts ***!
  \***************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Component: () => (/* binding */ Component),
/* harmony export */   defineComponent: () => (/* binding */ defineComponent)
/* harmony export */ });
/* harmony import */ var _apiLifecycle__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./apiLifecycle */ "./src/runtime-core/apiLifecycle.ts");
/* harmony import */ var _runtime_dom_customElement__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../runtime-dom/customElement */ "./src/runtime-dom/customElement.ts");
/* harmony import */ var _reactivity_ref__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../reactivity/ref */ "./src/reactivity/ref.ts");
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _callSuper(t, o, e) { return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e)); }
function _possibleConstructorReturn(t, e) { if (e && ("object" == _typeof(e) || "function" == typeof e)) return e; if (void 0 !== e) throw new TypeError("Derived constructors may only return object or undefined"); return _assertThisInitialized(t); }
function _assertThisInitialized(e) { if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); return e; }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
function _superPropGet(t, o, e, r) { var p = _get(_getPrototypeOf(1 & r ? t.prototype : t), o, e); return 2 & r && "function" == typeof p ? function (t) { return p.apply(e, t); } : p; }
function _get() { return _get = "undefined" != typeof Reflect && Reflect.get ? Reflect.get.bind() : function (e, t, r) { var p = _superPropBase(e, t); if (p) { var n = Object.getOwnPropertyDescriptor(p, t); return n.get ? n.get.call(arguments.length < 3 ? e : r) : n.value; } }, _get.apply(null, arguments); }
function _superPropBase(t, o) { for (; !{}.hasOwnProperty.call(t, o) && null !== (t = _getPrototypeOf(t));); return t; }
function _getPrototypeOf(t) { return _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function (t) { return t.__proto__ || Object.getPrototypeOf(t); }, _getPrototypeOf(t); }
function _inherits(t, e) { if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function"); t.prototype = Object.create(e && e.prototype, { constructor: { value: t, writable: !0, configurable: !0 } }), Object.defineProperty(t, "prototype", { writable: !1 }), e && _setPrototypeOf(t, e); }
function _setPrototypeOf(t, e) { return _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) { return t.__proto__ = e, t; }, _setPrototypeOf(t, e); }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }




//export class Component extends HTMLElement {
var Component = /*#__PURE__*/function (_CanElement) {
  function Component() {
    var _this;
    _classCallCheck(this, Component);
    _this = _callSuper(this, Component);
    // Storage for provided values
    _defineProperty(_this, "provides", {});
    // Lifecycle storage
    _defineProperty(_this, _apiLifecycle__WEBPACK_IMPORTED_MODULE_0__.BEFORE_MOUNT, []);
    _defineProperty(_this, _apiLifecycle__WEBPACK_IMPORTED_MODULE_0__.MOUNTED, []);
    _defineProperty(_this, _apiLifecycle__WEBPACK_IMPORTED_MODULE_0__.BEFORE_UPDATE, []);
    _defineProperty(_this, _apiLifecycle__WEBPACK_IMPORTED_MODULE_0__.UPDATED, []);
    _defineProperty(_this, _apiLifecycle__WEBPACK_IMPORTED_MODULE_0__.BEFORE_UNMOUNT, []);
    _defineProperty(_this, _apiLifecycle__WEBPACK_IMPORTED_MODULE_0__.UNMOUNTED, []);
    _defineProperty(_this, _apiLifecycle__WEBPACK_IMPORTED_MODULE_0__.ERROR_CAPTURED, []);
    return _possibleConstructorReturn(_this, (0,_reactivity_ref__WEBPACK_IMPORTED_MODULE_2__.proxyRefs)(_this));
  }
  _inherits(Component, _CanElement);
  return _createClass(Component, [{
    key: "connectedCallback",
    value: function connectedCallback() {
      var _this2 = this;
      // Set the active instance for hooks and injection
      var prevInstance = (0,_apiLifecycle__WEBPACK_IMPORTED_MODULE_0__.setCurrentInstance)(this);
      this._scope.run(function () {
        // 1. Run "Before Mount" hooks (using Symbol key)
        _this2[_apiLifecycle__WEBPACK_IMPORTED_MODULE_0__.BEFORE_MOUNT].forEach(function (hook) {
          return hook();
        });
        if (_this2.onBeforeMount) _this2.onBeforeMount();

        // 2. Delegate to CanElement to set up the reactive render effect.
        // This effect will call our overridden render() method.
        _superPropGet(Component, "connectedCallback", _this2, 3)([]);

        // 3. Run "Mounted" hooks after the initial render batch is finished (using Symbol key)
        _this2._scope.run(function () {
          _this2[_apiLifecycle__WEBPACK_IMPORTED_MODULE_0__.MOUNTED].forEach(function (hook) {
            return hook();
          });
          if (_this2.onMounted) _this2.onMounted();
        });
      });
      (0,_apiLifecycle__WEBPACK_IMPORTED_MODULE_0__.setCurrentInstance)(prevInstance);
    }
  }, {
    key: "disconnectedCallback",
    value: function disconnectedCallback() {
      // Run "Before Unmount" hooks (using Symbol key)
      this[_apiLifecycle__WEBPACK_IMPORTED_MODULE_0__.BEFORE_UNMOUNT].forEach(function (hook) {
        return hook();
      });
      if (this.onBeforeUnmount) this.onBeforeUnmount();

      // Run "Unmounted" hooks (using Symbol key)
      this[_apiLifecycle__WEBPACK_IMPORTED_MODULE_0__.UNMOUNTED].forEach(function (hook) {
        return hook();
      });
      if (this.onUnmounted) this.onUnmounted();
      _superPropGet(Component, "disconnectedCallback", this, 3)([]);
    }
  }, {
    key: "render",
    value: function render() {
      // This method is meant to be overridden by compiled components.
      // The base CanElement's _renderEffect will call this.
      return null;
    }

    // Dependency Injection: Provide a value to descendants
  }, {
    key: "provide",
    value: function provide(key, value) {
      this.provides[key] = value;
    }

    // Dependency Injection: Inject a value from an ancestor
  }, {
    key: "inject",
    value: function inject(key, defaultValue) {
      // Start searching from the parent to allow shadowing (standard DI behavior)
      var el = this.parentElement || this.getRootNode().host;

      // Walk up the DOM tree (including crossing Shadow DOM boundaries)
      while (el) {
        if (el instanceof Component && key in el.provides) {
          return el.provides[key];
        }
        el = el.parentElement || el.getRootNode().host;
      }
      return defaultValue;
    }
  }]);
}(_runtime_dom_customElement__WEBPACK_IMPORTED_MODULE_1__.CanElement);
function defineComponent(options) {
  return options;
}

/***/ },

/***/ "./src/runtime-core/animation.ts"
/*!***************************************!*\
  !*** ./src/runtime-core/animation.ts ***!
  \***************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Timeline: () => (/* binding */ Timeline),
/* harmony export */   animate: () => (/* binding */ animate),
/* harmony export */   cAnimate: () => (/* binding */ cAnimate),
/* harmony export */   enter: () => (/* binding */ _enter2),
/* harmony export */   leave: () => (/* binding */ _leave2),
/* harmony export */   stagger: () => (/* binding */ stagger),
/* harmony export */   useFrame: () => (/* binding */ useFrame),
/* harmony export */   useMotion: () => (/* binding */ useMotion),
/* harmony export */   useSpring: () => (/* binding */ useSpring),
/* harmony export */   useTransition: () => (/* binding */ useTransition),
/* harmony export */   useTween: () => (/* binding */ useTween)
/* harmony export */ });
/* harmony import */ var _scheduler__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./scheduler */ "./src/runtime-core/scheduler.ts");
/* harmony import */ var _reactivity_signal__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../reactivity/signal */ "./src/reactivity/signal.ts");
/* harmony import */ var _reactivity_effect__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../reactivity/effect */ "./src/reactivity/effect.ts");
/* harmony import */ var _apiLifecycle__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./apiLifecycle */ "./src/runtime-core/apiLifecycle.ts");
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
var _excluded = ["targets", "duration", "delay", "endDelay", "easing", "loop", "direction", "autoplay", "update", "complete"];
function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i["return"]) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _objectWithoutProperties(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose(e, t); if (Object.getOwnPropertySymbols) { var n = Object.getOwnPropertySymbols(e); for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (-1 !== e.indexOf(n)) continue; t[n] = r[n]; } return t; }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
 // Use the unified scheduler's nextTick
 // Keep reactivity imports


function _enter2(_x, _x2) {
  return _enter.apply(this, arguments);
}

function _enter() {
  _enter = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee(el, transitionClass) {
    return _regenerator().w(function (_context) {
      while (1) switch (_context.n) {
        case 0:
          el.classList.add(transitionClass + '-enter-from');
          el.classList.add(transitionClass + '-enter-active');
          _context.n = 1;
          return (0,_scheduler__WEBPACK_IMPORTED_MODULE_0__.nextTick)();
        case 1:
          el.classList.remove(transitionClass + '-enter-from');
          el.classList.add(transitionClass + '-enter-to');
          el.addEventListener('transitionend', function () {
            el.classList.remove(transitionClass + '-enter-active');
            el.classList.remove(transitionClass + '-enter-to');
          }, {
            once: true
          });
        case 2:
          return _context.a(2);
      }
    }, _callee);
  }));
  return _enter.apply(this, arguments);
}
function _leave2(_x3, _x4, _x5) {
  return _leave.apply(this, arguments);
}

function _leave() {
  _leave = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2(el, transitionClass, done) {
    return _regenerator().w(function (_context2) {
      while (1) switch (_context2.n) {
        case 0:
          return _context2.a(2, new Promise(function (resolve) {
            el.classList.add(transitionClass + '-leave-from');
            el.classList.add(transitionClass + '-leave-active');
            (0,_scheduler__WEBPACK_IMPORTED_MODULE_0__.nextTick)(function () {
              el.classList.remove(transitionClass + '-leave-from');
              el.classList.add(transitionClass + '-leave-to');
            });
            el.addEventListener('transitionend', function () {
              if (done) done();
              resolve();
            }, {
              once: true
            });
          }));
      }
    }, _callee2);
  }));
  return _leave.apply(this, arguments);
} // --- Anime.js v4 inspired implementation ---
var Engine = /*#__PURE__*/function () {
  function Engine() {
    var _this = this;
    _classCallCheck(this, Engine);
    _defineProperty(this, "animations", new Set());
    _defineProperty(this, "rafId", null);
    _defineProperty(this, "tick", function () {
      _this.rafId = requestAnimationFrame(_this.tick);
      // In a real engine, we would update time-based animations here if not using WAAPI directly.
      // Since we wrap WAAPI, this loop might be used for callbacks or custom tweening.
    });
  }
  return _createClass(Engine, [{
    key: "add",
    value: function add(anim) {
      this.animations.add(anim);
      if (!this.rafId) this.tick();
    }
  }, {
    key: "remove",
    value: function remove(anim) {
      this.animations["delete"](anim);
      if (this.animations.size === 0 && this.rafId) {
        cancelAnimationFrame(this.rafId);
        this.rafId = null;
      }
    }
  }]);
}();
/**
 * Cubic Bezier solver for JS-based easing.
 */
function bezier(x1, y1, x2, y2) {
  var cx = 3.0 * x1;
  var bx = 3.0 * (x2 - x1) - cx;
  var ax = 1.0 - cx - bx;
  var cy = 3.0 * y1;
  var by = 3.0 * (y2 - y1) - cy;
  var ay = 1.0 - cy - by;
  var getX = function getX(t) {
    return ((ax * t + bx) * t + cx) * t;
  };
  var getY = function getY(t) {
    return ((ay * t + by) * t + cy) * t;
  };
  return function (x) {
    if (x1 === y1 && x2 === y2) return x;
    // Newton-Raphson iteration to find t for a given x
    var t = x;
    for (var i = 0; i < 8; i++) {
      var currentX = getX(t) - x;
      if (Math.abs(currentX) < 1e-7) break;
      var derivative = (3.0 * ax * t + 2.0 * bx) * t + cx;
      if (Math.abs(derivative) < 1e-7) break;
      t -= currentX / derivative;
    }
    return getY(t);
  };
}
var presetEasings = {
  'linear': function linear(t) {
    return t;
  },
  'ease': bezier(0.25, 0.1, 0.25, 1.0),
  'ease-in': bezier(0.42, 0.0, 1.0, 1.0),
  'ease-out': bezier(0.0, 0.0, 0.58, 1.0),
  'ease-in-out': bezier(0.42, 0.0, 0.58, 1.0)
};

/**
 * Parses an easing string into a function. 
 * Supports cubic-bezier(x1, y1, x2, y2) and standard keywords.
 */
function parseEasing(easing) {
  if (typeof easing === 'function') return easing;
  if (presetEasings[easing]) return presetEasings[easing];
  if (easing.startsWith('cubic-bezier')) {
    var parts = easing.match(/cubic-bezier\(([^)]+)\)/);
    if (parts) {
      var _parts$1$split$map = parts[1].split(',').map(function (v) {
          return parseFloat(v.trim());
        }),
        _parts$1$split$map2 = _slicedToArray(_parts$1$split$map, 4),
        x1 = _parts$1$split$map2[0],
        y1 = _parts$1$split$map2[1],
        x2 = _parts$1$split$map2[2],
        y2 = _parts$1$split$map2[3];
      return bezier(x1, y1, x2, y2);
    }
  }
  return presetEasings['linear'];
}

/**
 * Internal helper to convert HSL color values to RGB.
 * @param h Hue (0-360)
 * @param s Saturation (0-100)
 * @param l Lightness (0-100)
 * @returns [r, g, b] (0-255)
 */
function hslToRgb(h, s, l) {
  s /= 100;
  l /= 100;
  var c = (1 - Math.abs(2 * l - 1)) * s,
    x = c * (1 - Math.abs(h / 60 % 2 - 1)),
    m = l - c / 2,
    r = 0,
    g = 0,
    b = 0;
  if (0 <= h && h < 60) {
    r = c;
    g = x;
    b = 0;
  } else if (60 <= h && h < 120) {
    r = x;
    g = c;
    b = 0;
  } else if (120 <= h && h < 180) {
    r = 0;
    g = c;
    b = x;
  } else if (180 <= h && h < 240) {
    r = 0;
    g = x;
    b = c;
  } else if (240 <= h && h < 300) {
    r = x;
    g = 0;
    b = c;
  } else if (300 <= h && h < 360) {
    r = c;
    g = 0;
    b = x;
  }
  r = Math.round((r + m) * 255);
  g = Math.round((g + m) * 255);
  b = Math.round((b + m) * 255);
  return [r, g, b];
}

/**
 * Internal helper to parse hex and rgb/rgba color strings into numeric arrays.
 * Now also supports HSL/HSLA and converts them to RGBA.
 */
function parseColor(color) {
  if (color.startsWith('#')) {
    var h = color.slice(1);
    if (h.length === 3) h = h.split('').map(function (s) {
      return s + s;
    }).join('');
    return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16), 1];
  }
  var rgbaMatch = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
  if (rgbaMatch) return [parseInt(rgbaMatch[1]), parseInt(rgbaMatch[2]), parseInt(rgbaMatch[3]), rgbaMatch[4] ? parseFloat(rgbaMatch[4]) : 1];
  var hslaMatch = color.match(/hsla?\((\d+),\s*(\d+)%,\s*(\d+)%(?:,\s*([\d.]+))?\)/);
  if (hslaMatch) {
    var _h = parseInt(hslaMatch[1]);
    var s = parseInt(hslaMatch[2]);
    var l = parseInt(hslaMatch[3]);
    var a = hslaMatch[4] ? parseFloat(hslaMatch[4]) : 1;
    var _hslToRgb = hslToRgb(_h, s, l),
      _hslToRgb2 = _slicedToArray(_hslToRgb, 3),
      r = _hslToRgb2[0],
      g = _hslToRgb2[1],
      b = _hslToRgb2[2];
    return [r, g, b, a];
  }
  return [0, 0, 0, 1]; // Default to black if parsing fails
}
function interpolateColor(from, to, t) {
  var c1 = parseColor(from);
  var c2 = parseColor(to);
  var r = Math.round(c1[0] + (c2[0] - c1[0]) * t);
  var g = Math.round(c1[1] + (c2[1] - c1[1]) * t);
  var b = Math.round(c1[2] + (c2[2] - c1[2]) * t);
  var a = c1[3] + (c2[3] - c1[3]) * t;
  return "rgba(".concat(r, ", ").concat(g, ", ").concat(b, ", ").concat(a, ")");
}
function getUnit(val) {
  if (typeof val === 'number') return '';
  var split = /[+-]?\d*\.?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?(%|px|pt|em|rem|in|cm|mm|ex|ch|pc|vw|vh|vmin|vmax|deg|rad|turn)?$/.exec(val);
  return split ? split[1] || '' : '';
}
function getCSSValue(el, prop) {
  var uppercasePropName = prop.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
  return getComputedStyle(el).getPropertyValue(uppercasePropName) || '0';
}
function getRelativeValue(to, from) {
  var operator = /^(\*=|\+=|-=)/.exec(to);
  if (!operator) return to;
  var u = getUnit(to);
  var x = from;
  var y = parseFloat(to.replace(operator[0], ''));
  switch (operator[0][0]) {
    case '+':
      return x + y + u;
    case '-':
      return x - y + u;
    case '*':
      return x * y + u;
    default:
      return to;
  }
}
var engine = new Engine();
function animate(params) {
  var targets = params.targets,
    _params$duration = params.duration,
    duration = _params$duration === void 0 ? 1000 : _params$duration,
    _params$delay = params.delay,
    delay = _params$delay === void 0 ? 0 : _params$delay,
    _params$endDelay = params.endDelay,
    endDelay = _params$endDelay === void 0 ? 0 : _params$endDelay,
    _params$easing = params.easing,
    easing = _params$easing === void 0 ? 'linear' : _params$easing,
    _params$loop = params.loop,
    loop = _params$loop === void 0 ? false : _params$loop,
    _params$direction = params.direction,
    direction = _params$direction === void 0 ? 'normal' : _params$direction,
    _params$autoplay = params.autoplay,
    autoplay = _params$autoplay === void 0 ? true : _params$autoplay,
    update = params.update,
    complete = params.complete,
    properties = _objectWithoutProperties(params, _excluded);
  var elements = getTargets(targets);
  var animations = [];
  var maxDuration = 0;
  elements.forEach(function (el, i) {
    var keyframes = formatKeyframes(el, properties);
    var delayVal = typeof delay === 'function' ? delay(el, i, elements.length) : delay;
    var endDelayVal = typeof endDelay === 'function' ? endDelay(el, i, elements.length) : endDelay;
    var totalDuration = delayVal + duration + endDelayVal;
    if (totalDuration > maxDuration) maxDuration = totalDuration;
    var waapiOptions = {
      duration: duration,
      delay: delayVal,
      endDelay: endDelayVal,
      easing: typeof easing === 'string' ? easing : 'linear',
      iterations: loop === true ? Infinity : typeof loop === 'number' ? loop : 1,
      direction: direction,
      fill: 'forwards'
    };
    var animation = el.animate(keyframes, waapiOptions);
    if (!autoplay) animation.pause();
    animations.push(animation);
  });
  var finished = Promise.all(animations.map(function (a) {
    return a.finished;
  }));
  if (complete) {
    finished.then(function () {
      return complete();
    })["catch"](function () {}); // Catch cancel errors
  }
  var instance = {
    animations: animations,
    finished: finished,
    duration: maxDuration,
    get currentTime() {
      var _animations$;
      return ((_animations$ = animations[0]) === null || _animations$ === void 0 ? void 0 : _animations$.currentTime) || 0;
    },
    set currentTime(t) {
      animations.forEach(function (a) {
        return a.currentTime = t;
      });
    },
    get paused() {
      var _animations$2;
      return ((_animations$2 = animations[0]) === null || _animations$2 === void 0 ? void 0 : _animations$2.playState) === 'paused';
    },
    play: function play() {
      animations.forEach(function (a) {
        return a.play();
      });
      engine.add(instance);
    },
    pause: function pause() {
      animations.forEach(function (a) {
        return a.pause();
      });
      engine.remove(instance);
    },
    restart: function restart() {
      animations.forEach(function (a) {
        a.cancel();
        a.play();
      });
      engine.add(instance);
    },
    reverse: function reverse() {
      return animations.forEach(function (a) {
        return a.reverse();
      });
    },
    seek: function seek(time) {
      animations.forEach(function (a) {
        return a.currentTime = time;
      });
    }
  };
  if (autoplay) engine.add(instance);
  return instance;
}
var Timeline = /*#__PURE__*/function () {
  function Timeline() {
    _classCallCheck(this, Timeline);
    _defineProperty(this, "_duration", 0);
    _defineProperty(this, "_animations", []);
  }
  return _createClass(Timeline, [{
    key: "add",
    value: function add(params, offset) {
      // Simple offset handling (absolute or relative)
      var startTime = this._duration;
      if (typeof offset === 'number') {
        startTime = offset;
      } else if (typeof offset === 'string' && offset.startsWith('-=')) {
        startTime -= parseFloat(offset.slice(2));
      }
      var anim = animate(_objectSpread(_objectSpread({}, params), {}, {
        delay: (params.delay || 0) + startTime,
        autoplay: false
      }));
      this._animations.push(anim);
      this._duration = Math.max(this._duration, startTime + anim.duration);
      return this;
    }
  }, {
    key: "play",
    value: function play() {
      this._animations.forEach(function (a) {
        return a.play();
      });
    }
  }, {
    key: "pause",
    value: function pause() {
      this._animations.forEach(function (a) {
        return a.pause();
      });
    }
  }]);
}();

/**
 * Advanced stagger helper inspired by Anime.js v3.
 * Supports ranges [start, end] and directions.
 */
function stagger(val) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var _options$start = options.start,
    start = _options$start === void 0 ? 0 : _options$start,
    _options$direction = options.direction,
    direction = _options$direction === void 0 ? 'normal' : _options$direction;
  return function (_el, i, total) {
    var isRange = Array.isArray(val);
    var v1 = isRange ? val[0] : val;
    var v2 = isRange ? val[1] : 0;
    var progress = total > 1 ? i / (total - 1) : 0;
    if (direction === 'reverse') progress = 1 - progress;
    return start + (v1 + progress * (v2 - v1));
  };
}
var ANIMATION_KEY = Symbol('c-animate');
function cAnimate(el, value) {
  var options = typeof value === 'function' ? value() : value;
  if (!options) return;

  // Cleanup previous animations to prevent conflicts during updates
  if (el[ANIMATION_KEY]) {
    el[ANIMATION_KEY].forEach(function (anim) {
      return anim.cancel();
    });
  }
  var animOptions = _objectSpread({}, options);

  // Resolve targets: String selector -> Children; Missing -> Self
  if (typeof animOptions.targets === 'string') {
    var children = el.querySelectorAll(animOptions.targets);
    animOptions.targets = Array.from(children);
  } else if (!animOptions.targets) {
    animOptions.targets = el;
  }

  // Run animation and store reference for cleanup
  var _animate = animate(animOptions),
    animations = _animate.animations;
  el[ANIMATION_KEY] = animations;
}
function getTargets(targets) {
  if (typeof targets === 'string') return Array.from(document.querySelectorAll(targets));
  if (targets instanceof HTMLElement) return [targets];
  if (targets instanceof NodeList) return Array.from(targets);
  if (Array.isArray(targets)) return targets;
  return [];
}

/**
 * Formats properties into WAAPI-compatible keyframes, resolving relative values and units.
 *
 * Supports [from, to] array syntax for values.
 */
function formatKeyframes(el, props) {
  // const transforms: string[] = [];
  // const cssProps: any = {};
  var fromFrame = {};
  var toFrame = {};
  var fromTransforms = [];
  var toTransforms = [];
  var transformKeys = ['translateX', 'translateY', 'translateZ', 'rotate', 'rotateX', 'rotateY', 'rotateZ', 'scale', 'scaleX', 'scaleY', 'scaleZ', 'skew', 'skewX', 'skewY', 'perspective', 'translate', 'matrix'];
  // CSS properties that are unitless
  var unitlessKeys = ['opacity', 'zIndex', 'fontWeight', 'lineHeight', 'flex', 'flexGrow', 'flexShrink', 'order'];
  var processValue = function processValue(key, val, isTo, currentBase) {
    var result = val;

    // Support color arrays [r, g, b, a?] like Anime v3 by converting to CSS strings
    if (Array.isArray(result) && (result.length === 3 || result.length === 4)) {
      var _result$;
      return "rgba(".concat(result[0], ", ").concat(result[1], ", ").concat(result[2], ", ").concat((_result$ = result[3]) !== null && _result$ !== void 0 ? _result$ : 1, ")");
    }

    // Handle Relative Values (e.g., '+=100')
    if (typeof result === 'string' && /^(\*=|\+=|-=)/.test(result)) {
      var base = currentBase !== null && currentBase !== void 0 ? currentBase : parseFloat(getCSSValue(el, key) || '0'); // Ensure a numeric base
      result = getRelativeValue(result, base);
    }

    // Handle Units
    if (typeof result === 'number') {
      if (transformKeys.includes(key)) {
        if (key.startsWith('translate') || key.startsWith('perspective') || key.startsWith('skew')) result = result + 'px';
        if (key.startsWith('rotate') || key.startsWith('skew')) result = result + 'deg';
      } else if (!unitlessKeys.includes(key)) {
        result = result + 'px';
      }
    }
    return result;
  };
  for (var _key in props) {
    var val = props[_key];
    var isArray = Array.isArray(val);
    var fromVal = isArray ? val[0] : null;
    var toVal = isArray ? val[1] : val;
    var currentCSS = parseFloat(getCSSValue(el, _key));
    if (transformKeys.includes(_key)) {
      if (isArray) {
        fromTransforms.push("".concat(_key, "(").concat(processValue(_key, fromVal, false, currentCSS), ")"));
      }
      toTransforms.push("".concat(_key, "(").concat(processValue(_key, toVal, true, currentCSS), ")"));
    } else {
      if (isArray) {
        fromFrame[_key] = processValue(_key, fromVal, false, currentCSS);
      }
      toFrame[_key] = processValue(_key, toVal, true, currentCSS);
    }
  }
  if (toTransforms.length > 0) {
    toFrame.transform = toTransforms.join(' ');
    if (fromTransforms.length > 0) {
      fromFrame.transform = fromTransforms.join(' ');
    }
  }
  if (Object.keys(fromFrame).length > 0) {
    return [fromFrame, toFrame];
  }
  return [toFrame];
}
function useTransition(el, name) {
  return {
    enter: function enter() {
      return _enter2(el, name);
    },
    leave: function leave() {
      return _leave2(el, name);
    }
  };
}
function useSpring(source) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var current = (0,_reactivity_signal__WEBPACK_IMPORTED_MODULE_1__.signal)(source.value);
  var _options$stiffness = options.stiffness,
    stiffness = _options$stiffness === void 0 ? 170 : _options$stiffness,
    _options$damping = options.damping,
    damping = _options$damping === void 0 ? 26 : _options$damping,
    _options$mass = options.mass,
    mass = _options$mass === void 0 ? 1 : _options$mass,
    _options$precision = options.precision,
    precision = _options$precision === void 0 ? 0.01 : _options$precision;
  var velocity = 0;
  var targetVal = source.value;
  var running = false;
  var lastTime = 0;
  var _loop = function loop(time) {
    if (!running) return;
    if (!lastTime) lastTime = time;

    // Cap delta time to prevent instability on lag spikes
    var delta = Math.min((time - lastTime) / 1000, 0.064);
    lastTime = time;
    var displacement = current.value - targetVal;
    var springForce = -stiffness * displacement;
    var dampingForce = -damping * velocity;
    var acceleration = (springForce + dampingForce) / mass;
    velocity += acceleration * delta;
    current.value += velocity * delta;
    if (Math.abs(velocity) < precision && Math.abs(current.value - targetVal) < precision) {
      current.value = targetVal;
      running = false;
      velocity = 0;
    } else {
      requestAnimationFrame(_loop);
    }
  };
  (0,_reactivity_effect__WEBPACK_IMPORTED_MODULE_2__.effect)(function () {
    targetVal = source.value;
    if (!running) {
      running = true;
      lastTime = 0;
      requestAnimationFrame(_loop);
    }
  });
  return current;
}
function useMotion(target, keyframes) {
  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  var animation = (0,_reactivity_signal__WEBPACK_IMPORTED_MODULE_1__.signal)(null);
  var currentAnim = null;
  (0,_reactivity_effect__WEBPACK_IMPORTED_MODULE_2__.effect)(function () {
    var el = null;
    if (typeof target === 'function') el = target();else if (target && 'value' in target) el = target.value;else el = target;
    if (currentAnim) currentAnim.cancel();
    if (el) {
      var anim = el.animate(keyframes, options);
      currentAnim = anim;
      animation.value = anim;
    } else {
      currentAnim = null;
      animation.value = null;
    }
  });
  (0,_apiLifecycle__WEBPACK_IMPORTED_MODULE_3__.onUnmounted)(function () {
    if (currentAnim) currentAnim.cancel();
  });
  return {
    animation: animation,
    play: function play() {
      var _animation$value;
      return (_animation$value = animation.value) === null || _animation$value === void 0 ? void 0 : _animation$value.play();
    },
    pause: function pause() {
      var _animation$value2;
      return (_animation$value2 = animation.value) === null || _animation$value2 === void 0 ? void 0 : _animation$value2.pause();
    },
    reverse: function reverse() {
      var _animation$value3;
      return (_animation$value3 = animation.value) === null || _animation$value3 === void 0 ? void 0 : _animation$value3.reverse();
    },
    finish: function finish() {
      var _animation$value4;
      return (_animation$value4 = animation.value) === null || _animation$value4 === void 0 ? void 0 : _animation$value4.finish();
    },
    cancel: function cancel() {
      var _animation$value5;
      return (_animation$value5 = animation.value) === null || _animation$value5 === void 0 ? void 0 : _animation$value5.cancel();
    }
  };
}
function useFrame(fn) {
  var running = true;
  var lastTime = performance.now();
  var _loop2 = function loop(time) {
    if (!running) return;
    var delta = time - lastTime;
    lastTime = time;
    fn(delta);
    requestAnimationFrame(_loop2);
  };
  requestAnimationFrame(_loop2);
  (0,_apiLifecycle__WEBPACK_IMPORTED_MODULE_3__.onUnmounted)(function () {
    running = false;
  });
}
function useTween(source) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var current = (0,_reactivity_signal__WEBPACK_IMPORTED_MODULE_1__.signal)(source.value);
  var _options$duration = options.duration,
    duration = _options$duration === void 0 ? 500 : _options$duration;
  var easeFn = parseEasing(options.easing || 'ease-out'); // Default to ease-out (cubic-bezier preset)

  var startVal = source.value;
  var endVal = source.value;
  var startTime = 0;
  var running = false;
  var _loop3 = function loop(time) {
    if (!running) return;
    if (!startTime) startTime = time;
    var elapsed = time - startTime;
    var progress = Math.min(elapsed / duration, 1);
    var ease = easeFn(progress);
    if (typeof startVal === 'number' && typeof endVal === 'number') {
      current.value = startVal + (endVal - startVal) * ease;
    } else if (typeof startVal === 'string' && typeof endVal === 'string') {
      // Automatically detect and interpolate color strings
      current.value = interpolateColor(startVal, endVal, ease);
    }
    if (progress < 1) {
      requestAnimationFrame(_loop3);
    } else {
      running = false;
    }
  };
  (0,_reactivity_effect__WEBPACK_IMPORTED_MODULE_2__.effect)(function () {
    var newVal = source.value;
    if (newVal !== endVal) {
      startVal = current.value;
      endVal = newVal;
      startTime = 0;
      if (!running) {
        running = true;
        requestAnimationFrame(_loop3);
      }
    }
  });
  return current;
}

/***/ },

/***/ "./src/runtime-core/apiCreateApp.ts"
/*!******************************************!*\
  !*** ./src/runtime-core/apiCreateApp.ts ***!
  \******************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createApp: () => (/* binding */ createApp)
/* harmony export */ });
/* harmony import */ var _reactivity_index__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../reactivity/index */ "./src/reactivity/index.ts");
/* harmony import */ var _devtools__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../devtools */ "./src/devtools/index.ts");
/* harmony import */ var _directives_directiveRegistry__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./directives/directiveRegistry */ "./src/runtime-core/directives/directiveRegistry.ts");
/* harmony import */ var _directives_cShowRuntime__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./directives/cShowRuntime */ "./src/runtime-core/directives/cShowRuntime.ts");
/* harmony import */ var _directives_cModelRuntime__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./directives/cModelRuntime */ "./src/runtime-core/directives/cModelRuntime.ts");



 // Import the new runtime directive
 // Import the new runtime directive

function createApp(rootComponent) {
  var context = {
    config: (0,_reactivity_index__WEBPACK_IMPORTED_MODULE_0__.reactive)({
      globalProperties: (0,_reactivity_index__WEBPACK_IMPORTED_MODULE_0__.reactive)({}),
      delimiters: ['{{', '}}']
    }),
    provides: {}
  };
  var app = {
    config: context.config,
    use: function use(plugin) {
      for (var _len = arguments.length, options = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        options[_key - 1] = arguments[_key];
      }
      if (typeof plugin === 'function') {
        plugin.apply(void 0, [app].concat(options));
      } else if (plugin && typeof plugin.install === 'function') {
        plugin.install.apply(plugin, [app].concat(options));
      }
      return app;
    },
    provide: function provide(key, value) {
      context.provides[key] = value;
      return app;
    },
    directive: function (_directive) {
      function directive(_x, _x2) {
        return _directive.apply(this, arguments);
      }
      directive.toString = function () {
        return _directive.toString();
      };
      return directive;
    }(function (name, directive) {
      (0,_directives_directiveRegistry__WEBPACK_IMPORTED_MODULE_2__.registerDirective)(name, directive);
      return app;
    }),
    setDelimiters: function setDelimiters(open, close) {
      context.config.delimiters = [open, close];
      return app;
    },
    mount: function mount(rootContainer) {
      var container = typeof rootContainer === 'string' ? document.querySelector(rootContainer) : rootContainer;
      if (!container) return;

      // Instantiate the root Web Component
      var instance = new rootComponent();

      // Register built-in runtime directives
      (0,_directives_directiveRegistry__WEBPACK_IMPORTED_MODULE_2__.registerDirective)('show', _directives_cShowRuntime__WEBPACK_IMPORTED_MODULE_3__.cShowDirective);
      (0,_directives_directiveRegistry__WEBPACK_IMPORTED_MODULE_2__.registerDirective)('model', _directives_cModelRuntime__WEBPACK_IMPORTED_MODULE_4__.cModelDirective);

      // Inject global provides into the root instance
      for (var _key2 in context.provides) {
        instance.provide(_key2, context.provides[_key2]);
      }

      // Initialize DevTools connection
      _devtools__WEBPACK_IMPORTED_MODULE_1__.devtools.init();

      // Attach context for error handling
      instance.appContext = context;
      container.innerHTML = '';
      container.appendChild(instance.render());
    }
  };
  return app;
}

/***/ },

/***/ "./src/runtime-core/apiInject.ts"
/*!***************************************!*\
  !*** ./src/runtime-core/apiInject.ts ***!
  \***************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createContext: () => (/* binding */ createContext),
/* harmony export */   inject: () => (/* binding */ inject),
/* harmony export */   provide: () => (/* binding */ _provide)
/* harmony export */ });
/* harmony import */ var _apiLifecycle__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./apiLifecycle */ "./src/runtime-core/apiLifecycle.ts");
/* harmony import */ var _shared_index__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../shared/index */ "./src/shared/index.ts");


function _provide(key, value) {
  if (_apiLifecycle__WEBPACK_IMPORTED_MODULE_0__.currentInstance) {
    _apiLifecycle__WEBPACK_IMPORTED_MODULE_0__.currentInstance.provide(key, value);
  } else {
    (0,_shared_index__WEBPACK_IMPORTED_MODULE_1__.warn)("provide() can only be used synchronously inside setup or lifecycle hooks.");
  }
}

function inject(key, defaultValue) {
  if (_apiLifecycle__WEBPACK_IMPORTED_MODULE_0__.currentInstance) {
    // Use the instance's method which performs the hierarchical DOM walk
    var val = _apiLifecycle__WEBPACK_IMPORTED_MODULE_0__.currentInstance.inject(key);
    if (val !== undefined) return val;
  } else {
    (0,_shared_index__WEBPACK_IMPORTED_MODULE_1__.warn)("inject() can only be used synchronously inside setup or lifecycle hooks.");
  }
  return defaultValue !== undefined ? defaultValue : undefined;
}
function createContext(key, defaultValue) {
  return {
    provide: function provide(value) {
      _provide(key, value);
    },
    use: function use() {
      return inject(key, defaultValue);
    }
  };
}

/***/ },

/***/ "./src/runtime-core/apiLifecycle.ts"
/*!******************************************!*\
  !*** ./src/runtime-core/apiLifecycle.ts ***!
  \******************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   BEFORE_MOUNT: () => (/* binding */ BEFORE_MOUNT),
/* harmony export */   BEFORE_UNMOUNT: () => (/* binding */ BEFORE_UNMOUNT),
/* harmony export */   BEFORE_UPDATE: () => (/* binding */ BEFORE_UPDATE),
/* harmony export */   ERROR_CAPTURED: () => (/* binding */ ERROR_CAPTURED),
/* harmony export */   LifecycleHooks: () => (/* binding */ LifecycleHooks),
/* harmony export */   MOUNTED: () => (/* binding */ MOUNTED),
/* harmony export */   UNMOUNTED: () => (/* binding */ UNMOUNTED),
/* harmony export */   UPDATED: () => (/* binding */ UPDATED),
/* harmony export */   currentInstance: () => (/* binding */ currentInstance),
/* harmony export */   injectHook: () => (/* binding */ injectHook),
/* harmony export */   onBeforeMount: () => (/* binding */ onBeforeMount),
/* harmony export */   onBeforeUnmount: () => (/* binding */ onBeforeUnmount),
/* harmony export */   onBeforeUpdate: () => (/* binding */ onBeforeUpdate),
/* harmony export */   onErrorCaptured: () => (/* binding */ onErrorCaptured),
/* harmony export */   onMounted: () => (/* binding */ onMounted),
/* harmony export */   onUnmounted: () => (/* binding */ onUnmounted),
/* harmony export */   onUpdated: () => (/* binding */ onUpdated),
/* harmony export */   setCurrentInstance: () => (/* binding */ setCurrentInstance)
/* harmony export */ });
/* harmony import */ var _shared_index__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../shared/index */ "./src/shared/index.ts");

var currentInstance = null;
function setCurrentInstance(instance) {
  currentInstance = instance;
}

// Define Symbols for lifecycle hooks to ensure unique property keys
var BEFORE_MOUNT = Symbol('beforeMount');
var MOUNTED = Symbol('mounted');
var BEFORE_UPDATE = Symbol('beforeUpdate');
var UPDATED = Symbol('updated');
var BEFORE_UNMOUNT = Symbol('beforeUnmount');
var UNMOUNTED = Symbol('unmounted');
var ERROR_CAPTURED = Symbol('errorCaptured');

// Export an enum-like object for convenience and type safety when referencing hooks
var LifecycleHooks = {
  BEFORE_MOUNT: BEFORE_MOUNT,
  MOUNTED: MOUNTED,
  BEFORE_UPDATE: BEFORE_UPDATE,
  UPDATED: UPDATED,
  BEFORE_UNMOUNT: BEFORE_UNMOUNT,
  UNMOUNTED: UNMOUNTED,
  ERROR_CAPTURED: ERROR_CAPTURED
};
function injectHook(type, hook) {
  var target = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : currentInstance;
  if (target) {
    // @ts-ignore
    var hooks = target[type] || (target[type] = []);
    hooks.push(hook);
  } else {
    (0,_shared_index__WEBPACK_IMPORTED_MODULE_0__.warn)("Lifecycle hook \"".concat(String(type.description), "\" called without active instance."));
  }
}
var onBeforeMount = function onBeforeMount(hook) {
  return injectHook(LifecycleHooks.BEFORE_MOUNT, hook);
};
var onMounted = function onMounted(hook) {
  return injectHook(LifecycleHooks.MOUNTED, hook);
};
var onBeforeUpdate = function onBeforeUpdate(hook) {
  return injectHook(LifecycleHooks.BEFORE_UPDATE, hook);
};
var onUpdated = function onUpdated(hook) {
  return injectHook(LifecycleHooks.UPDATED, hook);
};
var onBeforeUnmount = function onBeforeUnmount(hook) {
  return injectHook(LifecycleHooks.BEFORE_UNMOUNT, hook);
};
var onUnmounted = function onUnmounted(hook) {
  return injectHook(LifecycleHooks.UNMOUNTED, hook);
};
var onErrorCaptured = function onErrorCaptured(hook) {
  return injectHook(LifecycleHooks.ERROR_CAPTURED, hook);
};

/***/ },

/***/ "./src/runtime-core/componentUtils.ts"
/*!********************************************!*\
  !*** ./src/runtime-core/componentUtils.ts ***!
  \********************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createComponent: () => (/* binding */ createComponent)
/* harmony export */ });
function createComponent(Constructor, props) {
  var instance = new Constructor();
  if (props) {
    // Assign props to the instance. 
    instance.props = props;
  }
  return instance;
}

/***/ },

/***/ "./src/runtime-core/composables.ts"
/*!*****************************************!*\
  !*** ./src/runtime-core/composables.ts ***!
  \*****************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   useAnimate: () => (/* binding */ useAnimate),
/* harmony export */   useAsyncState: () => (/* binding */ useAsyncState),
/* harmony export */   useBattery: () => (/* binding */ useBattery),
/* harmony export */   useCarousel: () => (/* binding */ useCarousel),
/* harmony export */   useClipboard: () => (/* binding */ useClipboard),
/* harmony export */   useCssVar: () => (/* binding */ useCssVar),
/* harmony export */   useDebounce: () => (/* binding */ useDebounce),
/* harmony export */   useDocumentVisibility: () => (/* binding */ useDocumentVisibility),
/* harmony export */   useDraggable: () => (/* binding */ useDraggable),
/* harmony export */   useDropZone: () => (/* binding */ useDropZone),
/* harmony export */   useElementSize: () => (/* binding */ useElementSize),
/* harmony export */   useEventListener: () => (/* binding */ useEventListener),
/* harmony export */   useFavicon: () => (/* binding */ useFavicon),
/* harmony export */   useFetch: () => (/* binding */ useFetch),
/* harmony export */   useFocus: () => (/* binding */ useFocus),
/* harmony export */   useFps: () => (/* binding */ useFps),
/* harmony export */   useFullscreen: () => (/* binding */ useFullscreen),
/* harmony export */   useGeolocation: () => (/* binding */ useGeolocation),
/* harmony export */   useHover: () => (/* binding */ useHover),
/* harmony export */   useId: () => (/* binding */ useId),
/* harmony export */   useIdle: () => (/* binding */ useIdle),
/* harmony export */   useIntersectionObserver: () => (/* binding */ useIntersectionObserver),
/* harmony export */   useInterval: () => (/* binding */ useInterval),
/* harmony export */   useKeyModifier: () => (/* binding */ useKeyModifier),
/* harmony export */   useLocalStorage: () => (/* binding */ useLocalStorage),
/* harmony export */   useMediaQuery: () => (/* binding */ useMediaQuery),
/* harmony export */   useMemory: () => (/* binding */ useMemory),
/* harmony export */   useMouse: () => (/* binding */ useMouse),
/* harmony export */   useMutationObserver: () => (/* binding */ useMutationObserver),
/* harmony export */   useNetwork: () => (/* binding */ useNetwork),
/* harmony export */   useOnClickOutside: () => (/* binding */ useOnClickOutside),
/* harmony export */   useOnline: () => (/* binding */ useOnline),
/* harmony export */   useParallax: () => (/* binding */ useParallax),
/* harmony export */   usePreferredDark: () => (/* binding */ usePreferredDark),
/* harmony export */   useReducer: () => (/* binding */ useReducer),
/* harmony export */   useScriptTag: () => (/* binding */ useScriptTag),
/* harmony export */   useScroll: () => (/* binding */ useScroll),
/* harmony export */   useShare: () => (/* binding */ useShare),
/* harmony export */   useSound: () => (/* binding */ useSound),
/* harmony export */   useSpeechRecognition: () => (/* binding */ useSpeechRecognition),
/* harmony export */   useSwipe: () => (/* binding */ useSwipe),
/* harmony export */   useThrottle: () => (/* binding */ useThrottle),
/* harmony export */   useTimeout: () => (/* binding */ useTimeout),
/* harmony export */   useTitle: () => (/* binding */ useTitle),
/* harmony export */   useToggle: () => (/* binding */ useToggle),
/* harmony export */   useVirtualList: () => (/* binding */ useVirtualList),
/* harmony export */   useWakeLock: () => (/* binding */ useWakeLock),
/* harmony export */   useWebP: () => (/* binding */ useWebP),
/* harmony export */   useWindowSize: () => (/* binding */ useWindowSize)
/* harmony export */ });
/* harmony import */ var _apiLifecycle__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./apiLifecycle */ "./src/runtime-core/apiLifecycle.ts");
/* harmony import */ var _reactivity_signal__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../reactivity/signal */ "./src/reactivity/signal.ts");
/* harmony import */ var _reactivity_effect__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../reactivity/effect */ "./src/reactivity/effect.ts");
/* harmony import */ var _reactivity_computed__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../reactivity/computed */ "./src/reactivity/computed.ts");
/* harmony import */ var _animation__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./animation */ "./src/runtime-core/animation.ts");
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i["return"]) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }





function useEventListener(target, event, callback) {
  target.addEventListener(event, callback);
  (0,_apiLifecycle__WEBPACK_IMPORTED_MODULE_0__.onUnmounted)(function () {
    target.removeEventListener(event, callback);
  });
}
function useAsyncState(promise, initialState) {
  var state = (0,_reactivity_signal__WEBPACK_IMPORTED_MODULE_1__.shallowSignal)(initialState);
  var isReady = (0,_reactivity_signal__WEBPACK_IMPORTED_MODULE_1__.signal)(false);
  var isLoading = (0,_reactivity_signal__WEBPACK_IMPORTED_MODULE_1__.signal)(true);
  var error = (0,_reactivity_signal__WEBPACK_IMPORTED_MODULE_1__.signal)(null);
  promise.then(function (data) {
    state.value = data;
    isReady.value = true;
  })["catch"](function (e) {
    error.value = e;
  })["finally"](function () {
    isLoading.value = false;
  });
  return {
    state: state,
    isReady: isReady,
    isLoading: isLoading,
    error: error
  };
}
var idCounter = 0;
function useId() {
  return "can-id-".concat(idCounter++);
}
function useReducer(reducer, initialState) {
  var state = (0,_reactivity_signal__WEBPACK_IMPORTED_MODULE_1__.signal)(initialState);
  var dispatch = function dispatch(action) {
    state.value = reducer(state.value, action);
  };
  return [state, dispatch];
}
function useToggle() {
  var initialValue = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
  var value = (0,_reactivity_signal__WEBPACK_IMPORTED_MODULE_1__.signal)(initialValue);
  var toggle = function toggle() {
    return value.value = !value.value;
  };
  return [value, toggle];
}
function useLocalStorage(key, initialValue) {
  // Check for window to support SSR
  var storage = typeof window !== 'undefined' ? window.localStorage : null;
  var stored = storage ? storage.getItem(key) : null;
  var data = (0,_reactivity_signal__WEBPACK_IMPORTED_MODULE_1__.signal)(stored ? JSON.parse(stored) : initialValue);
  if (storage) {
    (0,_reactivity_effect__WEBPACK_IMPORTED_MODULE_2__.effect)(function () {
      storage.setItem(key, JSON.stringify(data.value));
    });
  }
  return data;
}
function useTitle(initialTitle) {
  var title = (0,_reactivity_signal__WEBPACK_IMPORTED_MODULE_1__.signal)(initialTitle || (typeof document !== 'undefined' ? document.title : ''));
  if (typeof document !== 'undefined') {
    (0,_reactivity_effect__WEBPACK_IMPORTED_MODULE_2__.effect)(function () {
      document.title = title.value;
    });
  }
  return title;
}
function useWindowSize() {
  if (typeof window === 'undefined') {
    return {
      width: (0,_reactivity_signal__WEBPACK_IMPORTED_MODULE_1__.signal)(0),
      height: (0,_reactivity_signal__WEBPACK_IMPORTED_MODULE_1__.signal)(0)
    };
  }
  var width = (0,_reactivity_signal__WEBPACK_IMPORTED_MODULE_1__.signal)(window.innerWidth);
  var height = (0,_reactivity_signal__WEBPACK_IMPORTED_MODULE_1__.signal)(window.innerHeight);
  useEventListener(window, 'resize', function () {
    width.value = window.innerWidth;
    height.value = window.innerHeight;
  });
  return {
    width: width,
    height: height
  };
}

/**
 * Composable for orchestrating animations using the internal engine.
 * Automatically cancels animation on component unmount to prevent leaks.
 */
function useAnimate(params) {
  var instance = (0,_animation__WEBPACK_IMPORTED_MODULE_4__.animate)(_objectSpread(_objectSpread({}, params), {}, {
    autoplay: params.autoplay !== false
  }));
  (0,_apiLifecycle__WEBPACK_IMPORTED_MODULE_0__.onUnmounted)(function () {
    instance.animations.forEach(function (a) {
      return a.cancel();
    });
  });
  return instance;
}
function useInterval(fn, delay) {
  var id = setInterval(fn, delay);
  (0,_apiLifecycle__WEBPACK_IMPORTED_MODULE_0__.onUnmounted)(function () {
    return clearInterval(id);
  });
}
function useTimeout(fn, delay) {
  var id = setTimeout(fn, delay);
  (0,_apiLifecycle__WEBPACK_IMPORTED_MODULE_0__.onUnmounted)(function () {
    return clearTimeout(id);
  });
}
function useFetch(url) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var data = (0,_reactivity_signal__WEBPACK_IMPORTED_MODULE_1__.shallowSignal)(null);
  var error = (0,_reactivity_signal__WEBPACK_IMPORTED_MODULE_1__.signal)(null);
  var isFetching = (0,_reactivity_signal__WEBPACK_IMPORTED_MODULE_1__.signal)(false);
  var controller = null;
  var execute = /*#__PURE__*/function () {
    var _ref = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee() {
      var _controller, fetchOptions, res, _t;
      return _regenerator().w(function (_context) {
        while (1) switch (_context.p = _context.n) {
          case 0:
            isFetching.value = true;
            error.value = null;
            if (controller) controller.abort();
            if (typeof AbortController !== 'undefined') {
              controller = new AbortController();
            }
            _context.p = 1;
            fetchOptions = _objectSpread(_objectSpread({}, options), {}, {
              signal: (_controller = controller) === null || _controller === void 0 ? void 0 : _controller.signal
            });
            _context.n = 2;
            return fetch(url, fetchOptions);
          case 2:
            res = _context.v;
            if (res.ok) {
              _context.n = 3;
              break;
            }
            throw new Error(res.statusText);
          case 3:
            _context.n = 4;
            return res.json();
          case 4:
            data.value = _context.v;
            _context.n = 6;
            break;
          case 5:
            _context.p = 5;
            _t = _context.v;
            if (_t.name !== 'AbortError') {
              error.value = _t;
            }
          case 6:
            _context.p = 6;
            isFetching.value = false;
            return _context.f(6);
          case 7:
            return _context.a(2);
        }
      }, _callee, null, [[1, 5, 6, 7]]);
    }));
    return function execute() {
      return _ref.apply(this, arguments);
    };
  }();
  execute();
  (0,_apiLifecycle__WEBPACK_IMPORTED_MODULE_0__.onUnmounted)(function () {
    if (controller) controller.abort();
  });
  return {
    data: data,
    error: error,
    isFetching: isFetching,
    execute: execute
  };
}
function useOnClickOutside(target, handler) {
  useEventListener(window, 'click', function (event) {
    var el = typeof target === 'function' ? target() : target;
    if (!el || el === event.target || event.composedPath && event.composedPath().includes(el)) {
      return;
    }
    handler(event);
  });
}
function useMediaQuery(query) {
  var matches = (0,_reactivity_signal__WEBPACK_IMPORTED_MODULE_1__.signal)(false);
  if (typeof window !== 'undefined' && window.matchMedia) {
    var media = window.matchMedia(query);
    matches.value = media.matches;
    var listener = function listener() {
      return matches.value = media.matches;
    };
    media.addEventListener('change', listener);
    (0,_apiLifecycle__WEBPACK_IMPORTED_MODULE_0__.onUnmounted)(function () {
      return media.removeEventListener('change', listener);
    });
  }
  return matches;
}
function useDebounce(value, delay) {
  var debounced = (0,_reactivity_signal__WEBPACK_IMPORTED_MODULE_1__.signal)(value.value);
  var timeout;
  (0,_reactivity_effect__WEBPACK_IMPORTED_MODULE_2__.effect)(function () {
    var val = value.value;
    clearTimeout(timeout);
    timeout = setTimeout(function () {
      debounced.value = val;
    }, delay);
  });
  (0,_apiLifecycle__WEBPACK_IMPORTED_MODULE_0__.onUnmounted)(function () {
    return clearTimeout(timeout);
  });
  return debounced;
}
function useThrottle(value, duration) {
  var throttled = (0,_reactivity_signal__WEBPACK_IMPORTED_MODULE_1__.signal)(value.value);
  var lastRun = 0;
  var timeout;
  (0,_reactivity_effect__WEBPACK_IMPORTED_MODULE_2__.effect)(function () {
    var val = value.value;
    var now = Date.now();
    if (now - lastRun >= duration) {
      throttled.value = val;
      lastRun = now;
    } else {
      clearTimeout(timeout);
      timeout = setTimeout(function () {
        throttled.value = val;
        lastRun = Date.now();
      }, duration - (now - lastRun));
    }
  });
  (0,_apiLifecycle__WEBPACK_IMPORTED_MODULE_0__.onUnmounted)(function () {
    return clearTimeout(timeout);
  });
  return throttled;
}
function useClipboard() {
  var text = (0,_reactivity_signal__WEBPACK_IMPORTED_MODULE_1__.signal)('');
  var isSupported = typeof navigator !== 'undefined' && 'clipboard' in navigator;
  var copy = /*#__PURE__*/function () {
    var _ref2 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2(txt) {
      var _t2;
      return _regenerator().w(function (_context2) {
        while (1) switch (_context2.p = _context2.n) {
          case 0:
            if (isSupported) {
              _context2.n = 1;
              break;
            }
            return _context2.a(2);
          case 1:
            _context2.p = 1;
            _context2.n = 2;
            return navigator.clipboard.writeText(txt);
          case 2:
            text.value = txt;
            _context2.n = 4;
            break;
          case 3:
            _context2.p = 3;
            _t2 = _context2.v;
            console.error('Clipboard copy failed', _t2);
          case 4:
            return _context2.a(2);
        }
      }, _callee2, null, [[1, 3]]);
    }));
    return function copy(_x) {
      return _ref2.apply(this, arguments);
    };
  }();
  return {
    text: text,
    copy: copy,
    isSupported: isSupported
  };
}
function useOnline() {
  var isOnline = (0,_reactivity_signal__WEBPACK_IMPORTED_MODULE_1__.signal)(typeof navigator !== 'undefined' ? navigator.onLine : true);
  if (typeof window !== 'undefined') {
    useEventListener(window, 'online', function () {
      return isOnline.value = true;
    });
    useEventListener(window, 'offline', function () {
      return isOnline.value = false;
    });
  }
  return isOnline;
}
function useDocumentVisibility() {
  var visibility = (0,_reactivity_signal__WEBPACK_IMPORTED_MODULE_1__.signal)(typeof document !== 'undefined' ? document.visibilityState : 'visible');
  if (typeof document !== 'undefined') {
    useEventListener(document, 'visibilitychange', function () {
      visibility.value = document.visibilityState;
    });
  }
  return visibility;
}
function useCssVar(prop, target) {
  var variable = (0,_reactivity_signal__WEBPACK_IMPORTED_MODULE_1__.signal)('');
  var getEl = function getEl() {
    if (!target) return typeof document !== 'undefined' ? document.documentElement : null;
    return typeof target === 'function' ? target() : target;
  };
  if (typeof window !== 'undefined') {
    var el = getEl();
    if (el) {
      variable.value = getComputedStyle(el).getPropertyValue(prop).trim();
    }
    (0,_reactivity_effect__WEBPACK_IMPORTED_MODULE_2__.effect)(function () {
      var element = getEl();
      if (element) element.style.setProperty(prop, variable.value);
    });
  }
  return variable;
}
function useMouse() {
  var x = (0,_reactivity_signal__WEBPACK_IMPORTED_MODULE_1__.signal)(0);
  var y = (0,_reactivity_signal__WEBPACK_IMPORTED_MODULE_1__.signal)(0);
  if (typeof window !== 'undefined') {
    useEventListener(window, 'mousemove', function (e) {
      x.value = e.pageX;
      y.value = e.pageY;
    });
  }
  return {
    x: x,
    y: y
  };
}
function usePreferredDark() {
  var isDark = useMediaQuery('(prefers-color-scheme: dark)');
  return (0,_reactivity_computed__WEBPACK_IMPORTED_MODULE_3__.computed)(function () {
    return isDark.value;
  });
}
function useScriptTag(src) {
  var isLoading = (0,_reactivity_signal__WEBPACK_IMPORTED_MODULE_1__.signal)(true);
  var error = (0,_reactivity_signal__WEBPACK_IMPORTED_MODULE_1__.signal)(false);
  if (typeof document !== 'undefined') {
    var script = document.createElement('script');
    script.src = src;
    script.async = true;
    script.onload = function () {
      return isLoading.value = false;
    };
    script.onerror = function () {
      isLoading.value = false;
      error.value = true;
    };
    document.head.appendChild(script);
    (0,_apiLifecycle__WEBPACK_IMPORTED_MODULE_0__.onUnmounted)(function () {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    });
  }
  return {
    isLoading: isLoading,
    error: error
  };
}
function useFavicon(href) {
  var url = (0,_reactivity_signal__WEBPACK_IMPORTED_MODULE_1__.isSignal)(href) ? href : (0,_reactivity_signal__WEBPACK_IMPORTED_MODULE_1__.signal)(href);
  if (typeof document !== 'undefined') {
    (0,_reactivity_effect__WEBPACK_IMPORTED_MODULE_2__.effect)(function () {
      var link = document.querySelector("link[rel*='icon']");
      if (!link) {
        link = document.createElement('link');
        link.type = 'image/x-icon';
        link.rel = 'shortcut icon';
        document.head.appendChild(link);
      }
      link.href = url.value;
    });
  }
}
function useFocus(target) {
  var focused = (0,_reactivity_signal__WEBPACK_IMPORTED_MODULE_1__.signal)(false);
  var cleanup = null;
  (0,_reactivity_effect__WEBPACK_IMPORTED_MODULE_2__.effect)(function () {
    if (cleanup) cleanup();
    var el;
    if ((0,_reactivity_signal__WEBPACK_IMPORTED_MODULE_1__.isSignal)(target)) el = target.value;else if (typeof target === 'function') el = target();else el = target;
    if (el) {
      var onFocus = function onFocus() {
        return focused.value = true;
      };
      var onBlur = function onBlur() {
        return focused.value = false;
      };
      el.addEventListener('focus', onFocus);
      el.addEventListener('blur', onBlur);
      cleanup = function cleanup() {
        el.removeEventListener('focus', onFocus);
        el.removeEventListener('blur', onBlur);
      };
    }
  });
  (0,_apiLifecycle__WEBPACK_IMPORTED_MODULE_0__.onUnmounted)(function () {
    if (cleanup) cleanup();
  });
  return {
    focused: focused
  };
}
function useHover(target) {
  var isHovered = (0,_reactivity_signal__WEBPACK_IMPORTED_MODULE_1__.signal)(false);
  var cleanup = null;
  (0,_reactivity_effect__WEBPACK_IMPORTED_MODULE_2__.effect)(function () {
    if (cleanup) cleanup();
    var el;
    if ((0,_reactivity_signal__WEBPACK_IMPORTED_MODULE_1__.isSignal)(target)) el = target.value;else if (typeof target === 'function') el = target();else el = target;
    if (el) {
      var enter = function enter() {
        return isHovered.value = true;
      };
      var leave = function leave() {
        return isHovered.value = false;
      };
      el.addEventListener('mouseenter', enter);
      el.addEventListener('mouseleave', leave);
      cleanup = function cleanup() {
        el.removeEventListener('mouseenter', enter);
        el.removeEventListener('mouseleave', leave);
      };
    }
  });
  (0,_apiLifecycle__WEBPACK_IMPORTED_MODULE_0__.onUnmounted)(function () {
    if (cleanup) cleanup();
  });
  return {
    isHovered: isHovered
  };
}
function useGeolocation() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var coords = (0,_reactivity_signal__WEBPACK_IMPORTED_MODULE_1__.signal)({
    latitude: Infinity,
    longitude: Infinity,
    accuracy: 0,
    altitude: null,
    altitudeAccuracy: null,
    heading: null,
    speed: null
  });
  var locatedAt = (0,_reactivity_signal__WEBPACK_IMPORTED_MODULE_1__.signal)(null);
  var error = (0,_reactivity_signal__WEBPACK_IMPORTED_MODULE_1__.signal)(null);
  if (typeof navigator !== 'undefined' && 'geolocation' in navigator) {
    var watcherId = navigator.geolocation.watchPosition(function (position) {
      locatedAt.value = position.timestamp;
      coords.value = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy,
        altitude: position.coords.altitude,
        altitudeAccuracy: position.coords.altitudeAccuracy,
        heading: position.coords.heading,
        speed: position.coords.speed
      };
      error.value = null;
    }, function (err) {
      error.value = err;
    }, options);
    (0,_apiLifecycle__WEBPACK_IMPORTED_MODULE_0__.onUnmounted)(function () {
      return navigator.geolocation.clearWatch(watcherId);
    });
  }
  return {
    coords: coords,
    locatedAt: locatedAt,
    error: error
  };
}
function useKeyModifier(key) {
  var state = (0,_reactivity_signal__WEBPACK_IMPORTED_MODULE_1__.signal)(false);
  if (typeof window !== 'undefined') {
    useEventListener(window, 'keydown', function (e) {
      if (e.key === key) state.value = true;
    });
    useEventListener(window, 'keyup', function (e) {
      if (e.key === key) state.value = false;
    });
  }
  return state;
}
function useDraggable(target) {
  var x = (0,_reactivity_signal__WEBPACK_IMPORTED_MODULE_1__.signal)(0);
  var y = (0,_reactivity_signal__WEBPACK_IMPORTED_MODULE_1__.signal)(0);
  var isDragging = (0,_reactivity_signal__WEBPACK_IMPORTED_MODULE_1__.signal)(false);
  var startX = 0;
  var startY = 0;
  var initialX = 0;
  var initialY = 0;
  if (typeof window !== 'undefined') {
    var onMove = function onMove(e) {
      if (!isDragging.value) return;
      var dx = e.clientX - startX;
      var dy = e.clientY - startY;
      x.value = initialX + dx;
      y.value = initialY + dy;
    };
    var onUp = function onUp() {
      isDragging.value = false;
    };
    useEventListener(window, 'mousemove', onMove);
    useEventListener(window, 'mouseup', onUp);
    var cleanup = null;
    (0,_reactivity_effect__WEBPACK_IMPORTED_MODULE_2__.effect)(function () {
      if (cleanup) cleanup();
      var el;
      if ((0,_reactivity_signal__WEBPACK_IMPORTED_MODULE_1__.isSignal)(target)) el = target.value;else if (typeof target === 'function') el = target();else el = target;
      if (el) {
        var onDown = function onDown(e) {
          isDragging.value = true;
          startX = e.clientX;
          startY = e.clientY;
          initialX = x.value;
          initialY = y.value;
          e.preventDefault();
        };
        el.addEventListener('mousedown', onDown);
        cleanup = function cleanup() {
          el.removeEventListener('mousedown', onDown);
        };
      }
    });
    (0,_apiLifecycle__WEBPACK_IMPORTED_MODULE_0__.onUnmounted)(function () {
      if (cleanup) cleanup();
    });
  }
  return {
    x: x,
    y: y,
    isDragging: isDragging
  };
}
function useDropZone(target, onDrop) {
  var isOverDropZone = (0,_reactivity_signal__WEBPACK_IMPORTED_MODULE_1__.signal)(false);
  var cleanup = null;
  (0,_reactivity_effect__WEBPACK_IMPORTED_MODULE_2__.effect)(function () {
    if (cleanup) cleanup();
    var el;
    if ((0,_reactivity_signal__WEBPACK_IMPORTED_MODULE_1__.isSignal)(target)) el = target.value;else if (typeof target === 'function') el = target();else el = target;
    if (el) {
      var onDragOver = function onDragOver(e) {
        e.preventDefault();
        isOverDropZone.value = true;
      };
      var onDragLeave = function onDragLeave() {
        isOverDropZone.value = false;
      };
      var onDropHandler = function onDropHandler(e) {
        var _e$dataTransfer;
        e.preventDefault();
        isOverDropZone.value = false;
        var files = (_e$dataTransfer = e.dataTransfer) !== null && _e$dataTransfer !== void 0 && _e$dataTransfer.files ? Array.from(e.dataTransfer.files) : null;
        onDrop(files);
      };
      el.addEventListener('dragover', onDragOver);
      el.addEventListener('dragleave', onDragLeave);
      el.addEventListener('drop', onDropHandler);
      cleanup = function cleanup() {
        el.removeEventListener('dragover', onDragOver);
        el.removeEventListener('dragleave', onDragLeave);
        el.removeEventListener('drop', onDropHandler);
      };
    }
  });
  (0,_apiLifecycle__WEBPACK_IMPORTED_MODULE_0__.onUnmounted)(function () {
    if (cleanup) cleanup();
  });
  return {
    isOverDropZone: isOverDropZone
  };
}
function useVirtualList(list, options) {
  var scrollTop = (0,_reactivity_signal__WEBPACK_IMPORTED_MODULE_1__.signal)(0);
  var itemHeight = options.itemHeight,
    _options$overscan = options.overscan,
    overscan = _options$overscan === void 0 ? 5 : _options$overscan;
  var containerH = (0,_reactivity_signal__WEBPACK_IMPORTED_MODULE_1__.isSignal)(options.containerHeight) ? options.containerHeight : (0,_reactivity_signal__WEBPACK_IMPORTED_MODULE_1__.signal)(options.containerHeight);
  var visibleItems = (0,_reactivity_computed__WEBPACK_IMPORTED_MODULE_3__.computed)(function () {
    var items = list.value;
    var count = items.length;
    var visibleCount = Math.ceil(containerH.value / itemHeight);
    var start = Math.max(0, Math.floor(scrollTop.value / itemHeight) - overscan);
    var end = Math.min(count, Math.floor(scrollTop.value / itemHeight) + visibleCount + overscan);
    return items.slice(start, end).map(function (item, index) {
      return {
        item: item,
        index: start + index,
        style: "position: absolute; top: ".concat((start + index) * itemHeight, "px; height: ").concat(itemHeight, "px; width: 100%;")
      };
    });
  });
  var totalHeight = (0,_reactivity_computed__WEBPACK_IMPORTED_MODULE_3__.computed)(function () {
    return list.value.length * itemHeight;
  });
  return {
    scrollTop: scrollTop,
    visibleItems: visibleItems,
    totalHeight: totalHeight
  };
}
function useMutationObserver(target, callback) {
  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  var observer = null;
  (0,_reactivity_effect__WEBPACK_IMPORTED_MODULE_2__.effect)(function () {
    if (observer) observer.disconnect();
    var el;
    if ((0,_reactivity_signal__WEBPACK_IMPORTED_MODULE_1__.isSignal)(target)) el = target.value;else if (typeof target === 'function') el = target();else el = target;
    if (el) {
      observer = new MutationObserver(callback);
      observer.observe(el, options);
    }
  });
  (0,_apiLifecycle__WEBPACK_IMPORTED_MODULE_0__.onUnmounted)(function () {
    if (observer) observer.disconnect();
  });
}
function useIdle() {
  var timeout = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 60000;
  var idle = (0,_reactivity_signal__WEBPACK_IMPORTED_MODULE_1__.signal)(false);
  var lastActive = (0,_reactivity_signal__WEBPACK_IMPORTED_MODULE_1__.signal)(Date.now());
  var timer;
  var reset = function reset() {
    idle.value = false;
    lastActive.value = Date.now();
    clearTimeout(timer);
    timer = setTimeout(function () {
      return idle.value = true;
    }, timeout);
  };
  if (typeof window !== 'undefined') {
    var events = ['mousemove', 'mousedown', 'resize', 'keydown', 'touchstart', 'wheel'];
    events.forEach(function (event) {
      return useEventListener(window, event, reset);
    });
    useEventListener(document, 'visibilitychange', reset);
    reset();
  }
  (0,_apiLifecycle__WEBPACK_IMPORTED_MODULE_0__.onUnmounted)(function () {
    return clearTimeout(timer);
  });
  return {
    idle: idle,
    lastActive: lastActive
  };
}
function useShare() {
  var isSupported = typeof navigator !== 'undefined' && 'share' in navigator;
  var share = /*#__PURE__*/function () {
    var _ref3 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee3(data) {
      var _t3;
      return _regenerator().w(function (_context3) {
        while (1) switch (_context3.p = _context3.n) {
          case 0:
            if (!isSupported) {
              _context3.n = 4;
              break;
            }
            _context3.p = 1;
            _context3.n = 2;
            return navigator.share(data);
          case 2:
            return _context3.a(2, true);
          case 3:
            _context3.p = 3;
            _t3 = _context3.v;
            return _context3.a(2, false);
          case 4:
            return _context3.a(2, false);
        }
      }, _callee3, null, [[1, 3]]);
    }));
    return function share(_x2) {
      return _ref3.apply(this, arguments);
    };
  }();
  return {
    share: share,
    isSupported: isSupported
  };
}
function useFullscreen(target) {
  var isFullscreen = (0,_reactivity_signal__WEBPACK_IMPORTED_MODULE_1__.signal)(false);
  var getEl = function getEl() {
    if (!target) return typeof document !== 'undefined' ? document.documentElement : null;
    if ((0,_reactivity_signal__WEBPACK_IMPORTED_MODULE_1__.isSignal)(target)) return target.value;
    if (typeof target === 'function') return target();
    return target;
  };
  var enter = /*#__PURE__*/function () {
    var _ref4 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee4() {
      var el;
      return _regenerator().w(function (_context4) {
        while (1) switch (_context4.n) {
          case 0:
            el = getEl();
            if (!el) {
              _context4.n = 1;
              break;
            }
            _context4.n = 1;
            return el.requestFullscreen();
          case 1:
            return _context4.a(2);
        }
      }, _callee4);
    }));
    return function enter() {
      return _ref4.apply(this, arguments);
    };
  }();
  var exit = /*#__PURE__*/function () {
    var _ref5 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee5() {
      return _regenerator().w(function (_context5) {
        while (1) switch (_context5.n) {
          case 0:
            if (!document.fullscreenElement) {
              _context5.n = 1;
              break;
            }
            _context5.n = 1;
            return document.exitFullscreen();
          case 1:
            return _context5.a(2);
        }
      }, _callee5);
    }));
    return function exit() {
      return _ref5.apply(this, arguments);
    };
  }();
  var toggle = /*#__PURE__*/function () {
    var _ref6 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee6() {
      return _regenerator().w(function (_context6) {
        while (1) switch (_context6.n) {
          case 0:
            if (!isFullscreen.value) {
              _context6.n = 2;
              break;
            }
            _context6.n = 1;
            return exit();
          case 1:
            _context6.n = 3;
            break;
          case 2:
            _context6.n = 3;
            return enter();
          case 3:
            return _context6.a(2);
        }
      }, _callee6);
    }));
    return function toggle() {
      return _ref6.apply(this, arguments);
    };
  }();
  if (typeof document !== 'undefined') {
    useEventListener(document, 'fullscreenchange', function () {
      var el = getEl();
      isFullscreen.value = document.fullscreenElement === el;
    });
  }
  return {
    isFullscreen: isFullscreen,
    enter: enter,
    exit: exit,
    toggle: toggle
  };
}
function useScroll(target) {
  var x = (0,_reactivity_signal__WEBPACK_IMPORTED_MODULE_1__.signal)(0);
  var y = (0,_reactivity_signal__WEBPACK_IMPORTED_MODULE_1__.signal)(0);
  var getEl = function getEl() {
    if (!target) return typeof window !== 'undefined' ? window : null;
    return typeof target === 'function' ? target() : target;
  };
  if (typeof window !== 'undefined') {
    var el = getEl();
    if (el) {
      var update = function update() {
        if (el === window) {
          x.value = window.scrollX;
          y.value = window.scrollY;
        } else {
          x.value = el.scrollLeft;
          y.value = el.scrollTop;
        }
      };
      update();
      useEventListener(el, 'scroll', update);
    }
  }
  return {
    x: x,
    y: y
  };
}
function useIntersectionObserver(target) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var isIntersecting = (0,_reactivity_signal__WEBPACK_IMPORTED_MODULE_1__.signal)(false);
  if (typeof window !== 'undefined' && 'IntersectionObserver' in window) {
    var observer;
    (0,_reactivity_effect__WEBPACK_IMPORTED_MODULE_2__.effect)(function () {
      if (observer) observer.disconnect();
      var el;
      if ((0,_reactivity_signal__WEBPACK_IMPORTED_MODULE_1__.isSignal)(target)) el = target.value;else if (typeof target === 'function') el = target();else el = target;
      if (el) {
        observer = new IntersectionObserver(function (entries) {
          isIntersecting.value = entries[0].isIntersecting;
        }, options);
        observer.observe(el);
      }
    });
    (0,_apiLifecycle__WEBPACK_IMPORTED_MODULE_0__.onUnmounted)(function () {
      if (observer) observer.disconnect();
    });
  }
  return {
    isIntersecting: isIntersecting
  };
}
function useElementSize(target) {
  var width = (0,_reactivity_signal__WEBPACK_IMPORTED_MODULE_1__.signal)(0);
  var height = (0,_reactivity_signal__WEBPACK_IMPORTED_MODULE_1__.signal)(0);
  if (typeof window !== 'undefined' && 'ResizeObserver' in window) {
    var observer;
    (0,_reactivity_effect__WEBPACK_IMPORTED_MODULE_2__.effect)(function () {
      if (observer) observer.disconnect();
      var el;
      if ((0,_reactivity_signal__WEBPACK_IMPORTED_MODULE_1__.isSignal)(target)) el = target.value;else if (typeof target === 'function') el = target();else el = target;
      if (el) {
        width.value = el.offsetWidth;
        height.value = el.offsetHeight;
        observer = new ResizeObserver(function (entries) {
          width.value = entries[0].contentRect.width;
          height.value = entries[0].contentRect.height;
        });
        observer.observe(el);
      }
    });
    (0,_apiLifecycle__WEBPACK_IMPORTED_MODULE_0__.onUnmounted)(function () {
      if (observer) observer.disconnect();
    });
  }
  return {
    width: width,
    height: height
  };
}
function useSpeechRecognition() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var isListening = (0,_reactivity_signal__WEBPACK_IMPORTED_MODULE_1__.signal)(false);
  var result = (0,_reactivity_signal__WEBPACK_IMPORTED_MODULE_1__.signal)('');
  var error = (0,_reactivity_signal__WEBPACK_IMPORTED_MODULE_1__.signal)(null);
  var recognition = null;
  if (typeof window !== 'undefined') {
    var SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      var _options$continuous, _options$interimResul;
      recognition = new SpeechRecognition();
      recognition.lang = options.lang || 'en-US';
      recognition.continuous = (_options$continuous = options.continuous) !== null && _options$continuous !== void 0 ? _options$continuous : false;
      recognition.interimResults = (_options$interimResul = options.interimResults) !== null && _options$interimResul !== void 0 ? _options$interimResul : true;
      recognition.onstart = function () {
        return isListening.value = true;
      };
      recognition.onend = function () {
        return isListening.value = false;
      };
      recognition.onerror = function (e) {
        return error.value = e;
      };
      recognition.onresult = function (event) {
        var transcript = Array.from(event.results).map(function (r) {
          return r[0].transcript;
        }).join('');
        result.value = transcript;
      };
    }
  }
  var start = function start() {
    if (recognition) {
      result.value = '';
      recognition.start();
    }
  };
  var stop = function stop() {
    if (recognition) recognition.stop();
  };
  return {
    isListening: isListening,
    result: result,
    error: error,
    start: start,
    stop: stop,
    isSupported: !!recognition
  };
}
function useNetwork() {
  var isSupported = typeof navigator !== 'undefined' && 'connection' in navigator;
  var connection = isSupported ? navigator.connection : null;
  var state = (0,_reactivity_signal__WEBPACK_IMPORTED_MODULE_1__.signal)({
    online: typeof navigator !== 'undefined' ? navigator.onLine : true,
    saveData: connection ? connection.saveData : false,
    downlink: connection ? connection.downlink : 0,
    effectiveType: connection ? connection.effectiveType : undefined,
    rtt: connection ? connection.rtt : 0
  });
  if (isSupported) {
    var update = function update() {
      state.value = {
        online: navigator.onLine,
        saveData: connection.saveData,
        downlink: connection.downlink,
        effectiveType: connection.effectiveType,
        rtt: connection.rtt
      };
    };
    connection.addEventListener('change', update);
    window.addEventListener('online', update);
    window.addEventListener('offline', update);
    (0,_apiLifecycle__WEBPACK_IMPORTED_MODULE_0__.onUnmounted)(function () {
      connection.removeEventListener('change', update);
      window.removeEventListener('online', update);
      window.removeEventListener('offline', update);
    });
  }
  return state;
}
function useFps() {
  var fps = (0,_reactivity_signal__WEBPACK_IMPORTED_MODULE_1__.signal)(0);
  if (typeof window !== 'undefined') {
    var lastTime = performance.now();
    var frames = 0;
    var _loop = function loop() {
      var now = performance.now();
      frames++;
      if (now >= lastTime + 1000) {
        fps.value = Math.round(frames * 1000 / (now - lastTime));
        frames = 0;
        lastTime = now;
      }
      requestAnimationFrame(_loop);
    };
    requestAnimationFrame(_loop);
  }
  return fps;
}
function useMemory() {
  var memory = (0,_reactivity_signal__WEBPACK_IMPORTED_MODULE_1__.signal)(null);
  var isSupported = typeof performance !== 'undefined' && 'memory' in performance;
  if (isSupported) {
    var update = function update() {
      var _memory = performance.memory,
        jsHeapSizeLimit = _memory.jsHeapSizeLimit,
        totalJSHeapSize = _memory.totalJSHeapSize,
        usedJSHeapSize = _memory.usedJSHeapSize;
      memory.value = {
        jsHeapSizeLimit: jsHeapSizeLimit,
        totalJSHeapSize: totalJSHeapSize,
        usedJSHeapSize: usedJSHeapSize
      };
    };
    useInterval(update, 1000);
    update();
  }
  return {
    memory: memory,
    isSupported: isSupported
  };
}
function useBattery() {
  var battery = (0,_reactivity_signal__WEBPACK_IMPORTED_MODULE_1__.signal)({
    charging: false,
    chargingTime: 0,
    dischargingTime: 0,
    level: 1
  });
  var isSupported = typeof navigator !== 'undefined' && 'getBattery' in navigator;
  if (isSupported) {
    navigator.getBattery().then(function (bat) {
      var update = function update() {
        battery.value = {
          charging: bat.charging,
          chargingTime: bat.chargingTime,
          dischargingTime: bat.dischargingTime,
          level: bat.level
        };
      };
      bat.addEventListener('chargingchange', update);
      bat.addEventListener('chargingtimechange', update);
      bat.addEventListener('dischargingtimechange', update);
      bat.addEventListener('levelchange', update);
      update();
    });
  }
  return {
    battery: battery,
    isSupported: isSupported
  };
}
function useWakeLock() {
  var isActive = (0,_reactivity_signal__WEBPACK_IMPORTED_MODULE_1__.signal)(false);
  var sentinel = null;
  var isSupported = typeof navigator !== 'undefined' && 'wakeLock' in navigator;
  var request = /*#__PURE__*/function () {
    var _ref7 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee7() {
      var _t4;
      return _regenerator().w(function (_context7) {
        while (1) switch (_context7.p = _context7.n) {
          case 0:
            if (isSupported) {
              _context7.n = 1;
              break;
            }
            return _context7.a(2);
          case 1:
            _context7.p = 1;
            _context7.n = 2;
            return navigator.wakeLock.request('screen');
          case 2:
            sentinel = _context7.v;
            isActive.value = true;
            sentinel.addEventListener('release', function () {
              isActive.value = false;
              sentinel = null;
            });
            _context7.n = 4;
            break;
          case 3:
            _context7.p = 3;
            _t4 = _context7.v;
            console.error(_t4);
          case 4:
            return _context7.a(2);
        }
      }, _callee7, null, [[1, 3]]);
    }));
    return function request() {
      return _ref7.apply(this, arguments);
    };
  }();
  var release = /*#__PURE__*/function () {
    var _ref8 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee8() {
      return _regenerator().w(function (_context8) {
        while (1) switch (_context8.n) {
          case 0:
            if (!sentinel) {
              _context8.n = 2;
              break;
            }
            _context8.n = 1;
            return sentinel.release();
          case 1:
            sentinel = null;
            isActive.value = false;
          case 2:
            return _context8.a(2);
        }
      }, _callee8);
    }));
    return function release() {
      return _ref8.apply(this, arguments);
    };
  }();
  return {
    isActive: isActive,
    request: request,
    release: release,
    isSupported: isSupported
  };
}
function useCarousel(count) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var index = (0,_reactivity_signal__WEBPACK_IMPORTED_MODULE_1__.signal)(0);
  var _options$autoplay = options.autoplay,
    autoplay = _options$autoplay === void 0 ? false : _options$autoplay,
    _options$interval = options.interval,
    interval = _options$interval === void 0 ? 3000 : _options$interval,
    _options$loop = options.loop,
    loop = _options$loop === void 0 ? true : _options$loop;
  var timer = null;
  var getCount = function getCount() {
    return (0,_reactivity_signal__WEBPACK_IMPORTED_MODULE_1__.isSignal)(count) ? count.value : count;
  };
  var next = function next() {
    var len = getCount();
    if (len === 0) return;
    if (loop) {
      index.value = (index.value + 1) % len;
    } else {
      index.value = Math.min(index.value + 1, len - 1);
    }
  };
  var prev = function prev() {
    var len = getCount();
    if (len === 0) return;
    if (loop) {
      index.value = (index.value - 1 + len) % len;
    } else {
      index.value = Math.max(index.value - 1, 0);
    }
  };
  var goTo = function goTo(i) {
    var len = getCount();
    if (i >= 0 && i < len) {
      index.value = i;
    }
  };
  if ((0,_reactivity_signal__WEBPACK_IMPORTED_MODULE_1__.isSignal)(count)) {
    (0,_reactivity_effect__WEBPACK_IMPORTED_MODULE_2__.effect)(function () {
      var len = count.value;
      if (index.value >= len && len > 0) {
        index.value = len - 1;
      }
    });
  }
  var pause = function pause() {};
  var resume = function resume() {};
  if (autoplay) {
    var start = function start() {
      if (timer) clearInterval(timer);
      timer = setInterval(next, interval);
    };
    var stop = function stop() {
      if (timer) clearInterval(timer);
      timer = null;
    };
    start();
    (0,_apiLifecycle__WEBPACK_IMPORTED_MODULE_0__.onUnmounted)(stop);
    pause = stop;
    resume = start;
  }
  return {
    index: index,
    next: next,
    prev: prev,
    goTo: goTo,
    pause: pause,
    resume: resume
  };
}
function useSwipe(target) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var _options$threshold = options.threshold,
    threshold = _options$threshold === void 0 ? 50 : _options$threshold;
  var direction = (0,_reactivity_signal__WEBPACK_IMPORTED_MODULE_1__.signal)(null);
  var isSwiping = (0,_reactivity_signal__WEBPACK_IMPORTED_MODULE_1__.signal)(false);
  var startX = 0;
  var startY = 0;
  if (typeof window !== 'undefined') {
    var onTouchStart = function onTouchStart(e) {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
      isSwiping.value = true;
      direction.value = null;
    };
    var onTouchEnd = function onTouchEnd(e) {
      if (!isSwiping.value) return;
      var endX = e.changedTouches[0].clientX;
      var endY = e.changedTouches[0].clientY;
      var diffX = startX - endX;
      var diffY = startY - endY;
      if (Math.abs(diffX) > Math.abs(diffY)) {
        if (Math.abs(diffX) > threshold) {
          direction.value = diffX > 0 ? 'left' : 'right';
        }
      } else {
        if (Math.abs(diffY) > threshold) {
          direction.value = diffY > 0 ? 'up' : 'down';
        }
      }
      isSwiping.value = false;
    };
    useEventListener(target, 'touchstart', onTouchStart);
    useEventListener(target, 'touchend', onTouchEnd);
  }
  return {
    direction: direction,
    isSwiping: isSwiping
  };
}
function useWebP() {
  var isSupported = (0,_reactivity_signal__WEBPACK_IMPORTED_MODULE_1__.signal)(false);
  if (typeof document !== 'undefined') {
    var elem = document.createElement('canvas');
    if (!!(elem.getContext && elem.getContext('2d'))) {
      isSupported.value = elem.toDataURL('image/webp').indexOf('data:image/webp') == 0;
    }
  }
  return isSupported;
}
function useParallax(target) {
  var tilt = (0,_reactivity_signal__WEBPACK_IMPORTED_MODULE_1__.signal)(0);
  var roll = (0,_reactivity_signal__WEBPACK_IMPORTED_MODULE_1__.signal)(0);
  var source = (0,_reactivity_signal__WEBPACK_IMPORTED_MODULE_1__.signal)({
    x: 0,
    y: 0
  });
  var cleanup = null;
  (0,_reactivity_effect__WEBPACK_IMPORTED_MODULE_2__.effect)(function () {
    if (cleanup) cleanup();
    var el;
    if ((0,_reactivity_signal__WEBPACK_IMPORTED_MODULE_1__.isSignal)(target)) el = target.value;else if (typeof target === 'function') el = target();else el = target;
    if (el) {
      var onMove = function onMove(e) {
        var rect = el.getBoundingClientRect();
        var x = e.clientX - rect.left;
        var y = e.clientY - rect.top;

        // Normalize -0.5 to 0.5
        var nX = x / rect.width - 0.5;
        var nY = y / rect.height - 0.5;
        tilt.value = nY * 20; // Max 10 deg tilt
        roll.value = -nX * 20; // Max 10 deg roll
        source.value = {
          x: nX,
          y: nY
        };
      };
      var onLeave = function onLeave() {
        tilt.value = 0;
        roll.value = 0;
        source.value = {
          x: 0,
          y: 0
        };
      };
      el.addEventListener('mousemove', onMove);
      el.addEventListener('mouseleave', onLeave);
      cleanup = function cleanup() {
        el.removeEventListener('mousemove', onMove);
        el.removeEventListener('mouseleave', onLeave);
      };
    }
  });
  (0,_apiLifecycle__WEBPACK_IMPORTED_MODULE_0__.onUnmounted)(function () {
    if (cleanup) cleanup();
  });
  return {
    tilt: tilt,
    roll: roll,
    source: source
  };
}
function useSound(src) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var isPlaying = (0,_reactivity_signal__WEBPACK_IMPORTED_MODULE_1__.signal)(false);
  var audio = null;
  if (typeof window !== 'undefined') {
    var _options$volume, _options$loop2;
    audio = new Audio(src);
    audio.volume = (_options$volume = options.volume) !== null && _options$volume !== void 0 ? _options$volume : 1;
    audio.loop = (_options$loop2 = options.loop) !== null && _options$loop2 !== void 0 ? _options$loop2 : false;
    audio.addEventListener('play', function () {
      return isPlaying.value = true;
    });
    audio.addEventListener('pause', function () {
      return isPlaying.value = false;
    });
    audio.addEventListener('ended', function () {
      return isPlaying.value = false;
    });
  }
  var play = function play() {
    if (audio) {
      audio.currentTime = 0;
      audio.play()["catch"](function (e) {
        return console.warn('Audio play failed', e);
      });
    }
  };
  var pause = function pause() {
    var _audio;
    return (_audio = audio) === null || _audio === void 0 ? void 0 : _audio.pause();
  };
  var stop = function stop() {
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
  };
  (0,_apiLifecycle__WEBPACK_IMPORTED_MODULE_0__.onUnmounted)(function () {
    if (audio) {
      audio.pause();
      audio = null;
    }
  });
  return {
    play: play,
    pause: pause,
    stop: stop,
    isPlaying: isPlaying
  };
}

/***/ },

/***/ "./src/runtime-core/directives/cModelRuntime.ts"
/*!******************************************************!*\
  !*** ./src/runtime-core/directives/cModelRuntime.ts ***!
  \******************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   cModel: () => (/* binding */ cModel),
/* harmony export */   cModelDirective: () => (/* binding */ cModelDirective)
/* harmony export */ });
/* harmony import */ var _reactivity_index__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../reactivity/index */ "./src/reactivity/index.ts");
/* harmony import */ var _reactivity_ref__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../reactivity/ref */ "./src/reactivity/ref.ts");


/**
 * Functional wrapper for the compiler-generated code.
 */
function cModel(el, getter, setter, modifiers) {
  var binding = {
    value: {
      get value() {
        return getter();
      },
      set value(v) {
        setter(v);
      },
      __c_isRef: true
    },
    modifiers: modifiers,
    instance: null
  };
  cModelDirective.mounted(el, binding);
}

/**
 * Runtime logic for c-model.
 * Note: In your codegen, you call 'cModel()'. This Directive object 
 * is the implementation used by the runtime renderer.
 */
var cModelDirective = {
  mounted: function mounted(el, binding) {
    var input = el;
    var isCustomElement = el.tagName.includes('-');
    var modifiers = binding.modifiers || {};
    var eventName;
    if (isCustomElement) {
      // Support for Custom Components/Elements convention
      eventName = 'update:value';
    } else {
      var type = input.type;
      var tagName = input.tagName;
      // Use 'change' for lazy modifier or specific input types
      eventName = modifiers.lazy || type === 'checkbox' || type === 'radio' || tagName === 'SELECT' ? 'change' : 'input';
    }

    // 1. View -> State (Event Listener)
    el.addEventListener(eventName, function (e) {
      if ((0,_reactivity_ref__WEBPACK_IMPORTED_MODULE_1__.isRef)(binding.value)) {
        var newValue;
        if (isCustomElement) {
          newValue = e.detail !== undefined ? e.detail : el.value;
        } else if (input.type === 'checkbox') {
          newValue = input.checked;
        } else if (input.type === 'radio') {
          if (!input.checked) return;
          newValue = input.value;
        } else {
          newValue = input.value;
        }
        if (modifiers.trim && typeof newValue === 'string') {
          newValue = newValue.trim();
        }
        if (modifiers.number) {
          var n = parseFloat(newValue);
          newValue = isNaN(n) ? newValue : n;
        }
        binding.value.value = newValue;
      }
    });

    // 2. State -> View (Reactivity)
    (0,_reactivity_index__WEBPACK_IMPORTED_MODULE_0__.effect)(function () {
      var value = (0,_reactivity_ref__WEBPACK_IMPORTED_MODULE_1__.unref)(binding.value);
      var type = input.type;
      if (type === 'checkbox') {
        input.checked = !!value;
      } else if (type === 'radio') {
        input.checked = input.value === String(value);
      } else {
        input.value = value == null ? '' : String(value);
      }
    });
  },
  updated: function updated(el, binding) {
    var input = el;
    var type = input.type;
    var value = (0,_reactivity_ref__WEBPACK_IMPORTED_MODULE_1__.unref)(binding.value);
    if (type === 'checkbox') {
      input.checked = !!value;
    } else if (type === 'radio') {
      input.checked = input.value === String(value);
    } else {
      input.value = value == null ? '' : String(value);
    }
  }
};

/***/ },

/***/ "./src/runtime-core/directives/cShowRuntime.ts"
/*!*****************************************************!*\
  !*** ./src/runtime-core/directives/cShowRuntime.ts ***!
  \*****************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   cShowDirective: () => (/* binding */ cShowDirective)
/* harmony export */ });
/* harmony import */ var _reactivity_effect__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../reactivity/effect */ "./src/reactivity/effect.ts");
/* harmony import */ var _reactivity_ref__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../reactivity/ref */ "./src/reactivity/ref.ts");



/**
 * Runtime implementation of c-show.
 * Toggles the 'display' style property based on the truthiness of the value.
 */
var cShowDirective = {
  mounted: function mounted(el, binding) {
    (0,_reactivity_effect__WEBPACK_IMPORTED_MODULE_0__.effect)(function () {
      var val = (0,_reactivity_ref__WEBPACK_IMPORTED_MODULE_1__.unref)(binding.value);
      el.style.display = val ? '' : 'none';
    });
  },
  updated: function updated(el, binding) {
    var val = (0,_reactivity_ref__WEBPACK_IMPORTED_MODULE_1__.unref)(binding.value);
    el.style.display = val ? '' : 'none';
  }
};

/***/ },

/***/ "./src/runtime-core/directives/directiveRegistry.ts"
/*!**********************************************************!*\
  !*** ./src/runtime-core/directives/directiveRegistry.ts ***!
  \**********************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getDirective: () => (/* binding */ getDirective),
/* harmony export */   registerDirective: () => (/* binding */ registerDirective)
/* harmony export */ });
var globalDirectives = new Map();
function registerDirective(name, directive) {
  globalDirectives.set(name, directive);
}
function getDirective(name) {
  return globalDirectives.get(name);
}

/***/ },

/***/ "./src/runtime-core/errorHandling.ts"
/*!*******************************************!*\
  !*** ./src/runtime-core/errorHandling.ts ***!
  \*******************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   callWithAsyncErrorHandling: () => (/* binding */ callWithAsyncErrorHandling),
/* harmony export */   callWithErrorHandling: () => (/* binding */ callWithErrorHandling),
/* harmony export */   handleError: () => (/* binding */ handleError)
/* harmony export */ });
/* harmony import */ var _Component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Component */ "./src/runtime-core/Component.ts");
/* harmony import */ var _shared__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../shared */ "./src/shared/index.ts");
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }


function callWithErrorHandling(fn, instance, type, args) {
  var res;
  try {
    res = args ? fn.apply(void 0, _toConsumableArray(args)) : fn();
  } catch (err) {
    handleError(err, instance, type);
  }
  return res;
}
function callWithAsyncErrorHandling(fn, instance, type, args) {
  if (typeof fn === 'function') {
    var res = callWithErrorHandling(fn, instance, type, args);
    if (res && res["catch"] && typeof res["catch"] === 'function') {
      res["catch"](function (err) {
        handleError(err, instance, type);
      });
    }
    return res;
  }
}
function handleError(err, instance, type) {
  // 1. Component-level error hooks (onErrorCaptured) - Error Boundaries
  var parent = instance;
  while (parent) {
    var _parent$getRootNode;
    // Traverse up DOM and Shadow DOM
    parent = parent.parentElement || ((_parent$getRootNode = parent.getRootNode()) === null || _parent$getRootNode === void 0 ? void 0 : _parent$getRootNode.host);
    if (!parent || !(parent instanceof _Component__WEBPACK_IMPORTED_MODULE_0__.Component)) break;
    var errorCaptured = parent.onErrorCaptured;
    if (errorCaptured) {
      try {
        // If hook returns false, stop propagation
        var capture = errorCaptured.call(parent, err, instance, type);
        if (capture === false) return;
      } catch (err2) {
        // If the error hook itself throws, report both
        handleError(err2, parent, 'errorCaptured hook');
      }
    }
  }

  // 2. Global Error Handler
  // Find root to get appContext
  var root = instance;
  while (root) {
    var _root$getRootNode;
    if (root.appContext) break;
    root = root.parentElement || ((_root$getRootNode = root.getRootNode()) === null || _root$getRootNode === void 0 ? void 0 : _root$getRootNode.host);
  }
  var appConfig = root && root.appContext && root.appContext.config;
  if (appConfig && appConfig.errorHandler) {
    try {
      callWithErrorHandling(appConfig.errorHandler, null, 'appErrorHandler', [err, instance, type]);
    } catch (err2) {
      (0,_shared__WEBPACK_IMPORTED_MODULE_1__.warn)('Error in app.config.errorHandler', err2);
    }
  } else {
    // 3. Default Console Error
    console.error("[Can Error]: Unhandled error in ".concat(type));
    console.error(err);
  }
}

/***/ },

/***/ "./src/runtime-core/form.ts"
/*!**********************************!*\
  !*** ./src/runtime-core/form.ts ***!
  \**********************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createForm: () => (/* binding */ createForm)
/* harmony export */ });
/* harmony import */ var _reactivity_index__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../reactivity/index */ "./src/reactivity/index.ts");
function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i["return"]) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }

function createForm(options) {
  var state = (0,_reactivity_index__WEBPACK_IMPORTED_MODULE_0__.reactive)({
    values: {},
    errors: {},
    touched: {},
    validating: {},
    isSubmitting: false
  });
  var fields = {};
  var validateField = /*#__PURE__*/function () {
    var _ref = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee(name) {
      var rules, value, error, _rules$messages, _rules$messages2, _rules$messages3, result, _t;
      return _regenerator().w(function (_context) {
        while (1) switch (_context.p = _context.n) {
          case 0:
            rules = fields[name];
            value = state.values[name];
            error = ''; // 1. Sync Validation
            if (rules.required && !value) {
              error = ((_rules$messages = rules.messages) === null || _rules$messages === void 0 ? void 0 : _rules$messages.required) || 'This field is required.';
            } else if (rules.minLength && String(value).length < rules.minLength) {
              error = ((_rules$messages2 = rules.messages) === null || _rules$messages2 === void 0 ? void 0 : _rules$messages2.minLength) || "Minimum length is ".concat(rules.minLength, ".");
            } else if (rules.pattern && !new RegExp(rules.pattern).test(value)) {
              error = ((_rules$messages3 = rules.messages) === null || _rules$messages3 === void 0 ? void 0 : _rules$messages3.pattern) || 'Invalid format.';
            }

            // 2. Async Validation
            if (!(!error && rules.asyncValidator)) {
              _context.n = 5;
              break;
            }
            state.validating[name] = true;
            _context.p = 1;
            _context.n = 2;
            return rules.asyncValidator(value);
          case 2:
            result = _context.v;
            if (typeof result === 'string') error = result;
            _context.n = 4;
            break;
          case 3:
            _context.p = 3;
            _t = _context.v;
            error = 'Validation failed.';
          case 4:
            _context.p = 4;
            state.validating[name] = false;
            return _context.f(4);
          case 5:
            state.errors[name] = error;
            return _context.a(2, !error);
        }
      }, _callee, null, [[1, 3, 4, 5]]);
    }));
    return function validateField(_x) {
      return _ref.apply(this, arguments);
    };
  }();
  return {
    state: state,
    registerField: function registerField(name) {
      var rules = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      fields[name] = rules;
      state.values[name] = state.values[name] || '';
    },
    setFieldValue: function setFieldValue(name, value) {
      return _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2() {
        return _regenerator().w(function (_context2) {
          while (1) switch (_context2.n) {
            case 0:
              state.values[name] = value;
              if (!state.touched[name]) {
                _context2.n = 1;
                break;
              }
              _context2.n = 1;
              return validateField(name);
            case 1:
              return _context2.a(2);
          }
        }, _callee2);
      }))();
    },
    setFieldTouched: function setFieldTouched(name) {
      return _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee3() {
        return _regenerator().w(function (_context3) {
          while (1) switch (_context3.n) {
            case 0:
              state.touched[name] = true;
              _context3.n = 1;
              return validateField(name);
            case 1:
              return _context3.a(2);
          }
        }, _callee3);
      }))();
    },
    submit: function submit() {
      return _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee4() {
        var names, results;
        return _regenerator().w(function (_context4) {
          while (1) switch (_context4.n) {
            case 0:
              state.isSubmitting = true;
              names = Object.keys(fields);
              _context4.n = 1;
              return Promise.all(names.map(function (n) {
                return validateField(n);
              }));
            case 1:
              results = _context4.v;
              if (results.every(function (r) {
                return r;
              })) {
                options.onSubmit(state.values);
              }
              state.isSubmitting = false;
            case 2:
              return _context4.a(2);
          }
        }, _callee4);
      }))();
    }
  };
}

/***/ },

/***/ "./src/runtime-core/formComponents.ts"
/*!********************************************!*\
  !*** ./src/runtime-core/formComponents.ts ***!
  \********************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Form: () => (/* binding */ Form),
/* harmony export */   FormInput: () => (/* binding */ FormInput)
/* harmony export */ });
/* harmony import */ var _runtime_dom_customElement__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../runtime-dom/customElement */ "./src/runtime-dom/customElement.ts");
/* harmony import */ var _Component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Component */ "./src/runtime-core/Component.ts");
/* harmony import */ var _form__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./form */ "./src/runtime-core/form.ts");
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i["return"]) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _callSuper(t, o, e) { return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e)); }
function _possibleConstructorReturn(t, e) { if (e && ("object" == _typeof(e) || "function" == typeof e)) return e; if (void 0 !== e) throw new TypeError("Derived constructors may only return object or undefined"); return _assertThisInitialized(t); }
function _assertThisInitialized(e) { if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); return e; }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
function _superPropGet(t, o, e, r) { var p = _get(_getPrototypeOf(1 & r ? t.prototype : t), o, e); return 2 & r && "function" == typeof p ? function (t) { return p.apply(e, t); } : p; }
function _get() { return _get = "undefined" != typeof Reflect && Reflect.get ? Reflect.get.bind() : function (e, t, r) { var p = _superPropBase(e, t); if (p) { var n = Object.getOwnPropertyDescriptor(p, t); return n.get ? n.get.call(arguments.length < 3 ? e : r) : n.value; } }, _get.apply(null, arguments); }
function _superPropBase(t, o) { for (; !{}.hasOwnProperty.call(t, o) && null !== (t = _getPrototypeOf(t));); return t; }
function _getPrototypeOf(t) { return _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function (t) { return t.__proto__ || Object.getPrototypeOf(t); }, _getPrototypeOf(t); }
function _inherits(t, e) { if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function"); t.prototype = Object.create(e && e.prototype, { constructor: { value: t, writable: !0, configurable: !0 } }), Object.defineProperty(t, "prototype", { writable: !1 }), e && _setPrototypeOf(t, e); }
function _setPrototypeOf(t, e) { return _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) { return t.__proto__ = e, t; }, _setPrototypeOf(t, e); }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }



var Form = /*#__PURE__*/function (_Component) {
  function Form() {
    var _this;
    _classCallCheck(this, Form);
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    _this = _callSuper(this, Form, [].concat(args));
    _defineProperty(_this, "template", "\n        <form>\n            <slot></slot>\n        </form>\n        <style>\n            :host { display: block; }\n        </style>\n    ");
    return _this;
  }
  _inherits(Form, _Component);
  return _createClass(Form, [{
    key: "render",
    value: function render() {
      var _this2 = this;
      var templateStr = this.template.replace(/\${([\s\S]+?)}/g, function (_, expr) {
        var func = new Function('return ' + expr);
        return func.call(_this2);
      });
      return document.createRange().createContextualFragment(templateStr);
    }
  }, {
    key: "connectedCallback",
    value: function connectedCallback() {
      var _this3 = this,
        _this$shadowRoot;
      this.form = (0,_form__WEBPACK_IMPORTED_MODULE_2__.createForm)({
        onSubmit: function onSubmit(values) {
          _this3.dispatchEvent(new CustomEvent('submit', {
            detail: values,
            bubbles: true,
            composed: true
          }));
        }
      });

      // Provide state to children (Dependency Injection)
      this.provide('form', this.form);
      _superPropGet(Form, "connectedCallback", this, 3)([]);

      // Handle native form submission
      var form = (_this$shadowRoot = this.shadowRoot) === null || _this$shadowRoot === void 0 ? void 0 : _this$shadowRoot.querySelector('form');
      if (form) {
        form.addEventListener('submit', function (e) {
          e.preventDefault();
          _this3.form.submit();
        });
      }
    }
  }], [{
    key: "observedAttributes",
    get: function get() {
      return ['id', 'action', 'method'];
    }
  }]);
}(_Component__WEBPACK_IMPORTED_MODULE_1__.Component);
var FormInput = /*#__PURE__*/function (_Component2) {
  function FormInput() {
    var _this4;
    _classCallCheck(this, FormInput);
    for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }
    _this4 = _callSuper(this, FormInput, [].concat(args));
    _defineProperty(_this4, "template", "\n        <div class=\"field\">\n            <label>${this.props.label || ''}<slot></slot></label>\n            <input \n                type=\"${this.props.type || 'text'}\" \n                name=\"${this.props.name || ''}\" \n                placeholder=\"${this.props.placeholder || ''}\"\n                value=\"${this.props.value || ''}\"\n            />\n            <div class=\"status-text\">\n                ${this.form?.state?.validating?.[this.props.name] ? 'Checking...' : ''}\n                <span class=\"error\">${this.form?.state?.touched?.[this.props.name] ? (this.form?.state?.errors?.[this.props.name] || '') : ''}</span>\n            </div>\n        </div>\n        <style>\n            .field { margin-bottom: 1rem; }\n            input { width: 100%; padding: 0.5rem; border: 1px solid #ccc; border-radius: 4px; }\n            .status-text { font-size: 0.75rem; margin-top: 4px; min-height: 1.2em; color: #666; }\n            .error { color: #d32f2f; }\n            input:invalid { border-color: #d32f2f; }\n        </style>\n    ");
    return _this4;
  }
  _inherits(FormInput, _Component2);
  return _createClass(FormInput, [{
    key: "render",
    value: function render() {
      var _this5 = this;
      var templateStr = this.template.replace(/\${([\s\S]+?)}/g, function (_, expr) {
        var func = new Function('return ' + expr);
        return func.call(_this5);
      });
      return document.createRange().createContextualFragment(templateStr);
    }
  }, {
    key: "connectedCallback",
    value: function connectedCallback() {
      var _this$shadowRoot2,
        _this6 = this;
      _superPropGet(FormInput, "connectedCallback", this, 3)([]);
      this.form = this.inject('form');
      if (this.form && this.props.name) {
        // Resolve async validator if a method name is provided via attribute
        var asyncMethodName = this.props['async-validator'];
        var asyncValidator = asyncMethodName && typeof this[asyncMethodName] === 'function' ? this[asyncMethodName].bind(this) : null;

        // Pass validation rules extracted from props to the form engine
        this.form.registerField(this.props.name, {
          required: this.props.required,
          pattern: this.props.pattern,
          minLength: this.props.minlength,
          maxLength: this.props.maxlength,
          messages: {
            required: this.props['msg-required'],
            pattern: this.props['msg-pattern'],
            minLength: this.props['msg-minlength'],
            maxLength: this.props['msg-maxlength']
          },
          asyncValidator: asyncValidator
        });
      }
      var input = (_this$shadowRoot2 = this.shadowRoot) === null || _this$shadowRoot2 === void 0 ? void 0 : _this$shadowRoot2.querySelector('input');
      if (input) {
        // Bind input changes to form state
        input.addEventListener('input', function (e) {
          if (_this6.form && _this6.props.name) {
            _this6.form.setFieldValue(_this6.props.name, e.target.value);
          }
        });
        input.addEventListener('blur', function () {
          if (_this6.form && _this6.props.name) {
            _this6.form.setFieldTouched(_this6.props.name);
          }
        });
      }
    }
  }, {
    key: "checkUnique",
    value: function () {
      var _checkUnique = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee(value) {
        return _regenerator().w(function (_context) {
          while (1) switch (_context.n) {
            case 0:
              if (value) {
                _context.n = 1;
                break;
              }
              return _context.a(2, null);
            case 1:
              _context.n = 2;
              return new Promise(function (resolve) {
                return setTimeout(resolve, 800);
              });
            case 2:
              if (!(value === 'admin@example.com')) {
                _context.n = 3;
                break;
              }
              return _context.a(2, 'This email address is already taken.');
            case 3:
              return _context.a(2, null);
          }
        }, _callee);
      }));
      function checkUnique(_x) {
        return _checkUnique.apply(this, arguments);
      }
      return checkUnique;
    }()
  }], [{
    key: "observedAttributes",
    get: function get() {
      return ['name', 'type', 'placeholder', 'label', 'value', 'required', 'pattern', 'minlength', 'maxlength', 'msg-required', 'msg-pattern', 'msg-minlength', 'msg-maxlength', 'async-validator'];
    }
  }]);
}(_Component__WEBPACK_IMPORTED_MODULE_1__.Component);

// Auto-register components
if (typeof customElements !== 'undefined') {
  if (!customElements.get('can-form')) (0,_runtime_dom_customElement__WEBPACK_IMPORTED_MODULE_0__.defineCustomElement)('can-form', Form);
  if (!customElements.get('can-input')) (0,_runtime_dom_customElement__WEBPACK_IMPORTED_MODULE_0__.defineCustomElement)('can-input', FormInput);
}

/***/ },

/***/ "./src/runtime-core/h.ts"
/*!*******************************!*\
  !*** ./src/runtime-core/h.ts ***!
  \*******************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Fragment: () => (/* binding */ Fragment),
/* harmony export */   h: () => (/* binding */ h)
/* harmony export */ });
/* harmony import */ var _componentUtils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./componentUtils */ "./src/runtime-core/componentUtils.ts");

var Fragment = Symbol('Fragment');
function h(type) {
  var props = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var children = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
  var el;
  if (type === Fragment) {
    el = document.createDocumentFragment();
  } else if (typeof type === 'string') {
    el = document.createElement(type);
  } else {
    // Component Class
    el = (0,_componentUtils__WEBPACK_IMPORTED_MODULE_0__.createComponent)(type, props);
  }

  // Handle Props
  if (type !== Fragment && props) {
    for (var key in props) {
      if (key.startsWith('on')) {
        var event = key.slice(2).toLowerCase();
        el.addEventListener(event, props[key]);
      } else if (key in el) {
        // Property
        try {
          el[key] = props[key];
        } catch (e) {
          el.setAttribute(key, String(props[key]));
        }
      } else {
        // Attribute
        el.setAttribute(key, String(props[key]));
      }
    }
  }

  // Handle Children
  var kids = Array.isArray(children) ? children : [children];
  kids.forEach(function (child) {
    if (typeof child === 'string' || typeof child === 'number') {
      el.appendChild(document.createTextNode(String(child)));
    } else if (child instanceof Node) {
      el.appendChild(child);
    } else if (Array.isArray(child)) {
      child.forEach(function (c) {
        return el.appendChild(c);
      });
    }
  });
  return el;
}

/***/ },

/***/ "./src/runtime-core/i18n.ts"
/*!**********************************!*\
  !*** ./src/runtime-core/i18n.ts ***!
  \**********************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createI18n: () => (/* binding */ createI18n),
/* harmony export */   t: () => (/* binding */ t)
/* harmony export */ });
/* harmony import */ var _reactivity_signal__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../reactivity/signal */ "./src/reactivity/signal.ts");

var activeI18n = null;
function createI18n(options) {
  var locale = (0,_reactivity_signal__WEBPACK_IMPORTED_MODULE_0__.signal)(options.locale);
  var messages = options.messages;
  var instance = {
    locale: locale,
    messages: messages
  };
  activeI18n = instance;
  var t = function t(key) {
    var _messages$currentLoca;
    var currentLocale = locale.value;
    return ((_messages$currentLoca = messages[currentLocale]) === null || _messages$currentLoca === void 0 ? void 0 : _messages$currentLoca[key]) || key;
  };
  return {
    locale: locale,
    t: t,
    install: function install(app) {
      app.provide('i18n', {
        locale: locale,
        t: t
      });
    }
  };
}
function t(key) {
  var _activeI18n$messages$;
  if (!activeI18n) return key;
  var currentLocale = activeI18n.locale.value;
  return ((_activeI18n$messages$ = activeI18n.messages[currentLocale]) === null || _activeI18n$messages$ === void 0 ? void 0 : _activeI18n$messages$[key]) || key;
}

/***/ },

/***/ "./src/runtime-core/microApp.ts"
/*!**************************************!*\
  !*** ./src/runtime-core/microApp.ts ***!
  \**************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createMicroApp: () => (/* binding */ createMicroApp)
/* harmony export */ });
/* harmony import */ var _apiCreateApp__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./apiCreateApp */ "./src/runtime-core/apiCreateApp.ts");
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }

var EventBridge = /*#__PURE__*/function () {
  function EventBridge() {
    _classCallCheck(this, EventBridge);
    _defineProperty(this, "listeners", {});
  }
  return _createClass(EventBridge, [{
    key: "on",
    value: function on(event, fn) {
      if (!this.listeners[event]) this.listeners[event] = [];
      this.listeners[event].push(fn);
    }
  }, {
    key: "emit",
    value: function emit(event, payload) {
      if (this.listeners[event]) {
        this.listeners[event].forEach(function (fn) {
          return fn(payload);
        });
      }
    }
  }, {
    key: "off",
    value: function off(event, fn) {
      if (!this.listeners[event]) return;
      this.listeners[event] = this.listeners[event].filter(function (f) {
        return f !== fn;
      });
    }
  }]);
}();
function createMicroApp(options) {
  var bridge = new EventBridge();

  // Create isolated app instance
  var app = (0,_apiCreateApp__WEBPACK_IMPORTED_MODULE_0__.createApp)(options.rootComponent);

  // Inject bridge into micro-app context
  app.provide('bridge', bridge);

  // Provide props if available
  if (options.props) {
    app.provide('microAppProps', options.props);
  }
  var container = typeof options.mount === 'string' ? document.querySelector(options.mount) : options.mount;
  if (container && options.scopeCSS && container.attachShadow) {
    // Use Shadow DOM for CSS isolation
    var shadowRoot = container.shadowRoot || container.attachShadow({
      mode: 'open'
    });
    // We need a root element inside shadow DOM to mount the app
    var root = document.createElement('div');
    root.id = "micro-app-".concat(options.name);
    shadowRoot.appendChild(root);

    // Override mount logic for this specific app instance if needed, 
    // but standard mount works if we pass the element.
    app.mount(root);
  } else if (container) {
    app.mount(container);
  }
  return {
    app: app,
    bridge: bridge,
    unmount: function unmount() {
      // Cleanup logic would go here
      if (container) {
        if (options.scopeCSS && container.shadowRoot) {
          container.shadowRoot.innerHTML = '';
        } else {
          container.innerHTML = '';
        }
      }
    }
  };
}

/***/ },

/***/ "./src/runtime-core/scheduler.ts"
/*!***************************************!*\
  !*** ./src/runtime-core/scheduler.ts ***!
  \***************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   isFlushing: () => (/* binding */ isFlushing),
/* harmony export */   nextTick: () => (/* binding */ nextTick),
/* harmony export */   queueJob: () => (/* binding */ queueJob),
/* harmony export */   queuePostFlushJob: () => (/* binding */ queuePostFlushJob)
/* harmony export */ });
var queue = new Set();
var postFlushQueue = new Set();
var isBatching = false;
var flushing = false;
var resolvedPromise = Promise.resolve();
var currentFlushPromise = null;
function queueJob(job) {
  queue.add(job);
  queueFlush();
}
function queuePostFlushJob(job) {
  postFlushQueue.add(job);
  queueFlush();
}

/**
 * Returns true if the scheduler is currently executing the flush cycle.
 * Used for optimizations to skip redundant validations during DOM updates.
 */
function isFlushing() {
  return flushing;
}
function queueFlush() {
  if (!isBatching) {
    isBatching = true;
    currentFlushPromise = resolvedPromise.then(flushJobs);
  }
}
function flushJobs() {
  isBatching = false;
  flushing = true;
  try {
    // 1. Run standard (pre-flush) jobs
    queue.forEach(function (job) {
      return job();
    });
    queue.clear();

    // 2. Run post-flush jobs (e.g., watch with flush: 'post')
    postFlushQueue.forEach(function (job) {
      return job();
    });
    postFlushQueue.clear();
  } finally {
    // Ensure the promise is cleared so the next batch can start fresh
    flushing = false;
    currentFlushPromise = null;
  }
}

/**
 * Returns a promise that resolves after the current scheduler flush cycle.
 * If no flush is pending, it resolves in the next microtask.
 */
function nextTick(fn) {
  var p = currentFlushPromise || resolvedPromise;
  return fn ? p.then(fn) : p;
}

/***/ },

/***/ "./src/runtime-dom/attributeUtils.ts"
/*!*******************************************!*\
  !*** ./src/runtime-dom/attributeUtils.ts ***!
  \*******************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   extractAttributesAsProps: () => (/* binding */ extractAttributesAsProps),
/* harmony export */   parseAttributeValue: () => (/* binding */ parseAttributeValue)
/* harmony export */ });
/* harmony import */ var _reactivity_index__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../reactivity/index */ "./src/reactivity/index.ts");


/**
 * Extracts all attributes from an HTMLElement and returns them as a reactive props object.
 * It automatically handles type conversion for booleans, numbers, and JSON-formatted strings.
 * 
 * @param el The element to extract attributes from.
 * @returns A reactive object containing the parsed attributes.
 */
function extractAttributesAsProps(el) {
  var props = {};
  var attributes = el.attributes;
  for (var i = 0; i < attributes.length; i++) {
    var attr = attributes[i];
    props[attr.name] = parseAttributeValue(attr.value);
  }
  return (0,_reactivity_index__WEBPACK_IMPORTED_MODULE_0__.reactive)(props);
}

/**
 * Parses a string attribute value into its corresponding JavaScript type.
 * Handles booleans (including empty strings for boolean attributes), numbers, 
 * and JSON-formatted strings for objects or arrays.
 */
function parseAttributeValue(value) {
  if (value === null) return undefined;
  if (value === 'true' || value === '') return true;
  if (value === 'false') return false;
  var num = Number(value);
  if (!isNaN(num) && value.trim() !== '') return num;
  if (value.startsWith('{') && value.endsWith('}') || value.startsWith('[') && value.endsWith(']')) {
    try {
      return JSON.parse(value);
    } catch (_unused) {
      return value;
    }
  }
  return value;
}

/***/ },

/***/ "./src/runtime-dom/customElement.ts"
/*!******************************************!*\
  !*** ./src/runtime-dom/customElement.ts ***!
  \******************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   CanElement: () => (/* binding */ CanElement),
/* harmony export */   defineCustomElement: () => (/* binding */ defineCustomElement),
/* harmony export */   nativeElementMap: () => (/* binding */ nativeElementMap)
/* harmony export */ });
/* harmony import */ var _reactivity_index__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../reactivity/index */ "./src/reactivity/index.ts");
/* harmony import */ var _attributeUtils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./attributeUtils */ "./src/runtime-dom/attributeUtils.ts");
/* harmony import */ var _runtime_core_scheduler__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../runtime-core/scheduler */ "./src/runtime-core/scheduler.ts");
/* harmony import */ var _devtools_index__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../devtools/index */ "./src/devtools/index.ts");
/* harmony import */ var _runtime_core_apiLifecycle__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../runtime-core/apiLifecycle */ "./src/runtime-core/apiLifecycle.ts");
/* harmony import */ var _shared_index__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../shared/index */ "./src/shared/index.ts");
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _callSuper(t, o, e) { return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e)); }
function _possibleConstructorReturn(t, e) { if (e && ("object" == _typeof(e) || "function" == typeof e)) return e; if (void 0 !== e) throw new TypeError("Derived constructors may only return object or undefined"); return _assertThisInitialized(t); }
function _assertThisInitialized(e) { if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); return e; }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
function _superPropGet(t, o, e, r) { var p = _get(_getPrototypeOf(1 & r ? t.prototype : t), o, e); return 2 & r && "function" == typeof p ? function (t) { return p.apply(e, t); } : p; }
function _get() { return _get = "undefined" != typeof Reflect && Reflect.get ? Reflect.get.bind() : function (e, t, r) { var p = _superPropBase(e, t); if (p) { var n = Object.getOwnPropertyDescriptor(p, t); return n.get ? n.get.call(arguments.length < 3 ? e : r) : n.value; } }, _get.apply(null, arguments); }
function _superPropBase(t, o) { for (; !{}.hasOwnProperty.call(t, o) && null !== (t = _getPrototypeOf(t));); return t; }
function _getPrototypeOf(t) { return _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function (t) { return t.__proto__ || Object.getPrototypeOf(t); }, _getPrototypeOf(t); }
function _inherits(t, e) { if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function"); t.prototype = Object.create(e && e.prototype, { constructor: { value: t, writable: !0, configurable: !0 } }), Object.defineProperty(t, "prototype", { writable: !1 }), e && _setPrototypeOf(t, e); }
function _setPrototypeOf(t, e) { return _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) { return t.__proto__ = e, t; }, _setPrototypeOf(t, e); }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }






//import { HTMLElement } from '../server-renderer/polyfill';

// Fallback to a dummy class if HTMLElement isn't defined yet (prevents crash during module load)

var GlobalHTMLElement = typeof globalThis.HTMLElement !== 'undefined' ? globalThis.HTMLElement : /*#__PURE__*/_createClass(function _class() {
  _classCallCheck(this, _class);
});
var kebabToCamel = function kebabToCamel(s) {
  return s.replace(/-./g, function (x) {
    return x[1].toUpperCase();
  });
};
var camelToKebab = function camelToKebab(s) {
  return s.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
};

/**
 * Maps native tag names to their corresponding constructor classes.
 */
var nativeElementMap = {
  'a': typeof HTMLAnchorElement !== 'undefined' ? HTMLAnchorElement : GlobalHTMLElement,
  'audio': typeof HTMLAudioElement !== 'undefined' ? HTMLAudioElement : GlobalHTMLElement,
  'button': typeof HTMLButtonElement !== 'undefined' ? HTMLButtonElement : GlobalHTMLElement,
  'canvas': typeof HTMLCanvasElement !== 'undefined' ? HTMLCanvasElement : GlobalHTMLElement,
  'div': typeof HTMLDivElement !== 'undefined' ? HTMLDivElement : GlobalHTMLElement,
  'form': typeof HTMLFormElement !== 'undefined' ? HTMLFormElement : GlobalHTMLElement,
  'img': typeof HTMLImageElement !== 'undefined' ? HTMLImageElement : GlobalHTMLElement,
  'input': typeof HTMLInputElement !== 'undefined' ? HTMLInputElement : GlobalHTMLElement,
  'label': typeof HTMLLabelElement !== 'undefined' ? HTMLLabelElement : GlobalHTMLElement,
  'li': typeof HTMLLIElement !== 'undefined' ? HTMLLIElement : GlobalHTMLElement,
  'ol': typeof HTMLOListElement !== 'undefined' ? HTMLOListElement : GlobalHTMLElement,
  'p': typeof HTMLParagraphElement !== 'undefined' ? HTMLParagraphElement : GlobalHTMLElement,
  'select': typeof HTMLSelectElement !== 'undefined' ? HTMLSelectElement : GlobalHTMLElement,
  'span': typeof HTMLSpanElement !== 'undefined' ? HTMLSpanElement : GlobalHTMLElement,
  'table': typeof HTMLTableElement !== 'undefined' ? HTMLTableElement : GlobalHTMLElement,
  'textarea': typeof HTMLTextAreaElement !== 'undefined' ? HTMLTextAreaElement : GlobalHTMLElement,
  'ul': typeof HTMLUListElement !== 'undefined' ? HTMLUListElement : GlobalHTMLElement,
  'video': typeof HTMLVideoElement !== 'undefined' ? HTMLVideoElement : GlobalHTMLElement
};
var CanElement = /*#__PURE__*/function (_GlobalHTMLElement) {
  function CanElement() {
    var _this;
    _classCallCheck(this, CanElement);
    _this = _callSuper(this, CanElement);
    // This enables Shadow DOM for the component.
    // Only attach shadow if the element supports it and we aren't extending a 
    // native element that prohibits it (like <input> or <img>).
    _defineProperty(_this, "props", (0,_reactivity_index__WEBPACK_IMPORTED_MODULE_0__.reactive)({}));
    _defineProperty(_this, "_scope", new _reactivity_index__WEBPACK_IMPORTED_MODULE_0__.EffectScope());
    // Internal flag to track if the component has been mounted
    _defineProperty(_this, "_isMounted", false);
    // Stores the reactive effect responsible for rendering updates
    _defineProperty(_this, "_renderEffect", null);
    var isNativeExtension = _this.constructor["extends"];
    var noShadowTags = ['input', 'img', 'br', 'hr', 'textarea'];
    if (!isNativeExtension || !noShadowTags.includes(isNativeExtension)) {
      _this.attachShadow({
        mode: 'open'
      });
    }

    // Attribute-to-Property Sync:
    // Define proxies for observed attributes so that 'element.prop' 
    // stays in sync with the reactive 'this.props' object.
    var observed = _this.constructor.observedAttributes || [];
    observed.forEach(function (attrName) {
      var propName = kebabToCamel(attrName);
      Object.defineProperty(_this, propName, {
        get: function get() {
          return _this.props[propName];
        },
        set: function set(val) {
          _this.props[propName] = val;
          // Reflect property change back to HTML attribute
          if (val === null || val === undefined || val === false) {
            _this.removeAttribute(attrName);
          } else {
            var attrVal = val === true ? '' : _typeof(val) === 'object' ? JSON.stringify(val) : String(val);
            _this.setAttribute(attrName, attrVal);
          }
        },
        configurable: true,
        enumerable: true
      });
    });
    return _this;
  }
  _inherits(CanElement, _GlobalHTMLElement);
  return _createClass(CanElement, [{
    key: "attributeChangedCallback",
    value: function attributeChangedCallback(name, oldValue, newValue) {
      if (oldValue !== newValue) {
        var parsedValue = (0,_attributeUtils__WEBPACK_IMPORTED_MODULE_1__.parseAttributeValue)(newValue);
        var propName = kebabToCamel(name);

        // Optimization: Skip validation if we are in a batch update (flushing)
        // This avoids redundant checks when the framework is setting attributes programmatically
        if (!(0,_runtime_core_scheduler__WEBPACK_IMPORTED_MODULE_2__.isFlushing)()) {
          var definitions = this.constructor.propDefinitions || {};
          if (definitions[propName]) {
            this._validateProp(propName, parsedValue, definitions[propName]);
          }
        }

        // Only trigger reactive updates if the parsed value actually changed
        if (this.props[propName] !== parsedValue) {
          this.props[propName] = parsedValue;
        }
      }
    }
  }, {
    key: "_validateProp",
    value: function _validateProp(name, value, schema) {
      if (schema.required && (value === null || value === undefined)) {
        (0,_shared_index__WEBPACK_IMPORTED_MODULE_5__.warn)("[Prop Validation] Missing required prop: \"".concat(name, "\" on <").concat(this.tagName.toLowerCase(), ">"));
      }
      if (schema.type && value !== null && value !== undefined) {
        var expected = schema.type.toLowerCase();
        var actual = _typeof(value);
        var isValid = true;
        if (expected === 'array') isValid = Array.isArray(value);else if (expected === 'object') isValid = actual === 'object' && !Array.isArray(value);else if (expected === 'number') isValid = actual === 'number';else if (expected === 'boolean') isValid = actual === 'boolean';else if (expected === 'string') isValid = actual === 'string';
        if (!isValid) {
          (0,_shared_index__WEBPACK_IMPORTED_MODULE_5__.warn)("[Prop Validation] Type mismatch for prop \"".concat(name, "\". Expected ").concat(schema.type, ", got ").concat(actual, "."));
        }
      }

      // 2. Custom Validator Support
      if (schema.validator) {
        // If the validator is still a string (emitted by the compiler), convert it to a function once.
        if (typeof schema.validator === 'string') {
          try {
            // We wrap the code in parentheses to handle arrow functions and expressions correctly.
            schema.validator = new Function('value', "return (".concat(schema.validator, ")(value)"));
          } catch (e) {
            (0,_shared_index__WEBPACK_IMPORTED_MODULE_5__.warn)("[Prop Validation] Invalid validator logic for \"".concat(name, "\":"), e);
            delete schema.validator; // Disable failing validator
          }
        }
        if (typeof schema.validator === 'function') {
          var result = schema.validator.call(this, value);
          if (result === false) {
            (0,_shared_index__WEBPACK_IMPORTED_MODULE_5__.warn)("[Prop Validation] Custom validation failed for prop \"".concat(name, "\" on <").concat(this.tagName.toLowerCase(), ">."));
          } else if (typeof result === 'string' && result) {
            // Allow the validator to return a specific error message string
            (0,_shared_index__WEBPACK_IMPORTED_MODULE_5__.warn)("[Prop Validation] Prop \"".concat(name, "\": ").concat(result));
          }
        }
      }
    }
  }, {
    key: "connectedCallback",
    value: function connectedCallback() {
      var _this2 = this;
      console.log('Element connected to the DOM');
      if (!this._isMounted) {
        this._isMounted = true;

        // Initial Sync: Ensure attributes already present on the element
        // are reflected in the reactive props object.
        var definitions = this.constructor.propDefinitions || {};
        var defaults = this.constructor.defaultProps || {};
        var observed = this.constructor.observedAttributes || [];
        var _iterator = _createForOfIteratorHelper(observed),
          _step;
        try {
          for (_iterator.s(); !(_step = _iterator.n()).done;) {
            var attrName = _step.value;
            var propName = kebabToCamel(attrName);
            var hasAttr = this.hasAttribute(attrName);
            var value = hasAttr ? (0,_attributeUtils__WEBPACK_IMPORTED_MODULE_1__.parseAttributeValue)(this.getAttribute(attrName)) : defaults[propName];
            if (definitions[propName]) {
              this._validateProp(propName, value, definitions[propName]);
            }
            if (hasAttr || propName in defaults) {
              this.props[propName] = value;
            }
          }
        } catch (err) {
          _iterator.e(err);
        } finally {
          _iterator.f();
        }
        _devtools_index__WEBPACK_IMPORTED_MODULE_3__.devtools.emit(_devtools_index__WEBPACK_IMPORTED_MODULE_3__.DevToolsEvents.COMPONENT_MOUNT, this);
        this._scope.run(function () {
          var isInitialRender = true;

          // Create the render runner
          var renderRunner = function renderRunner() {
            var instance = _this2;

            // Lifecycle: onBeforeUpdate (only on subsequent renders)
            if (!isInitialRender) {
              var _instance$LifecycleHo;
              (_instance$LifecycleHo = instance[_runtime_core_apiLifecycle__WEBPACK_IMPORTED_MODULE_4__.LifecycleHooks.BEFORE_UPDATE]) === null || _instance$LifecycleHo === void 0 || _instance$LifecycleHo.forEach(function (h) {
                return h();
              });
              if (instance.onBeforeUpdate) instance.onBeforeUpdate();
            }

            // Execute render with a proxied context for auto-unwrapping .value
            var context = (0,_reactivity_index__WEBPACK_IMPORTED_MODULE_0__.proxyRefs)(_this2);
            var content;
            content = _this2.render.call(context);

            // If the render method returns a DocumentFragment or Node, mount it
            if (content instanceof Node && _this2.shadowRoot) {
              _this2.shadowRoot.innerHTML = '';
              _this2.shadowRoot.appendChild(content);
            }

            // Lifecycle: onUpdated (only on subsequent renders)
            if (!isInitialRender) {
              (0,_runtime_core_scheduler__WEBPACK_IMPORTED_MODULE_2__.queuePostFlushJob)(function () {
                var _instance$LifecycleHo2;
                (_instance$LifecycleHo2 = instance[_runtime_core_apiLifecycle__WEBPACK_IMPORTED_MODULE_4__.LifecycleHooks.UPDATED]) === null || _instance$LifecycleHo2 === void 0 || _instance$LifecycleHo2.forEach(function (h) {
                  return h();
                });
                if (instance.onUpdated) instance.onUpdated();
              });
            }
            isInitialRender = false;
          };

          // Initialize the effect as lazy so the variable is assigned before first run
          _this2._renderEffect = (0,_reactivity_index__WEBPACK_IMPORTED_MODULE_0__.effect)(renderRunner, {
            lazy: true,
            // queueJob ensures this re-renders in the next microtask batch
            scheduler: function scheduler() {
              return (0,_runtime_core_scheduler__WEBPACK_IMPORTED_MODULE_2__.queueJob)(_this2._renderEffect);
            }
          });

          // Execute initial render manually now that _renderEffect is assigned
          _this2._renderEffect();
        });
      }
    }
  }, {
    key: "disconnectedCallback",
    value: function disconnectedCallback() {
      console.log('Element disconnected from the DOM');
      _devtools_index__WEBPACK_IMPORTED_MODULE_3__.devtools.emit(_devtools_index__WEBPACK_IMPORTED_MODULE_3__.DevToolsEvents.COMPONENT_UNMOUNT, this);

      // This stops the render effect AND any other effect/watch 
      // created within the component's scope.
      this._scope.stop();
      if (this._renderEffect) {
        this._renderEffect = null;
      }
      this._isMounted = false;
    }
  }, {
    key: "adoptedCallback",
    value: function adoptedCallback() {
      console.log('Element adopted to a new document');
    }
  }, {
    key: "focus",
    value: function focus(options) {
      _superPropGet(CanElement, "focus", this, 3)([options]);
    }

    /**
     * Renders the component. Override this method to implement custom rendering logic.
     */
  }, {
    key: "render",
    value: function render() {
      var _this$_renderEffect;
      // The compiled component overrides this to return a DOM tree.
      // If manually called, we trigger the reactive effect if it exists.
      // Otherwise, this serves as a hook for the initial render.
      (_this$_renderEffect = this._renderEffect) === null || _this$_renderEffect === void 0 || _this$_renderEffect.call(this);
    }

    /**
     * Dispatches a custom event.
     * @param name The name of the event.
     * @param detail The data to pass with the event.
     * @param options Additional event options.
     */
  }, {
    key: "emit",
    value: function emit(name, detail, options) {
      var event = new CustomEvent(name, _objectSpread({
        bubbles: true,
        composed: true,
        cancelable: true,
        detail: detail
      }, options));
      this.dispatchEvent(event);
    }
  }], [{
    key: "observedAttributes",
    get: function get() {
      // This array should be dynamically generated by the compiler based on declared props
      // For now, it remains empty or can be manually populated for testing.
      return [];
    }
  }]);
}(GlobalHTMLElement);
function defineCustomElement(name, component,
// The actual component class
options) {
  if (customElements.get(name)) {
    return;
  }

  // Create a wrapper class to inject the template and observed attributes
  var ComponentWrapper = /*#__PURE__*/function (_ref) {
    function ComponentWrapper() {
      _classCallCheck(this, ComponentWrapper);
      return _callSuper(this, ComponentWrapper);
    }
    _inherits(ComponentWrapper, _ref);
    return _createClass(ComponentWrapper, null, [{
      key: "observedAttributes",
      get: function get() {
        return (options === null || options === void 0 ? void 0 : options.observedAttributes) || component.observedAttributes || [];
      }
    }]);
  }(component);

  // Filter out our custom 'observedAttributes' so only valid native options 
  // are passed to the customElements.define API.
  var nativeOptions = options !== null && options !== void 0 && options["extends"] ? {
    "extends": options["extends"]
  } : undefined;
  customElements.define(name, ComponentWrapper, nativeOptions);
}

/***/ },

/***/ "./src/runtime-dom/nextTick.ts"
/*!*************************************!*\
  !*** ./src/runtime-dom/nextTick.ts ***!
  \*************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   nextTick: () => (/* binding */ nextTick)
/* harmony export */ });
/* harmony import */ var _runtime_core_scheduler__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../runtime-core/scheduler */ "./src/runtime-core/scheduler.ts");

function nextTick(fn) {
  return (0,_runtime_core_scheduler__WEBPACK_IMPORTED_MODULE_0__.nextTick)(fn);
}

/***/ },

/***/ "./src/runtime-helpers.ts"
/*!********************************!*\
  !*** ./src/runtime-helpers.ts ***!
  \********************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   BEFORE_MOUNT: () => (/* reexport safe */ _runtime_core_apiLifecycle__WEBPACK_IMPORTED_MODULE_9__.BEFORE_MOUNT),
/* harmony export */   BEFORE_UNMOUNT: () => (/* reexport safe */ _runtime_core_apiLifecycle__WEBPACK_IMPORTED_MODULE_9__.BEFORE_UNMOUNT),
/* harmony export */   BEFORE_UPDATE: () => (/* reexport safe */ _runtime_core_apiLifecycle__WEBPACK_IMPORTED_MODULE_9__.BEFORE_UPDATE),
/* harmony export */   CanElement: () => (/* reexport safe */ _runtime_dom_customElement__WEBPACK_IMPORTED_MODULE_19__.CanElement),
/* harmony export */   Component: () => (/* reexport safe */ _runtime_core_Component__WEBPACK_IMPORTED_MODULE_0__.Component),
/* harmony export */   DevToolsEvents: () => (/* reexport safe */ _devtools_index__WEBPACK_IMPORTED_MODULE_24__.DevToolsEvents),
/* harmony export */   ERROR_CAPTURED: () => (/* reexport safe */ _runtime_core_apiLifecycle__WEBPACK_IMPORTED_MODULE_9__.ERROR_CAPTURED),
/* harmony export */   EffectScope: () => (/* reexport safe */ _reactivity_effect__WEBPACK_IMPORTED_MODULE_14__.EffectScope),
/* harmony export */   EventEmitter: () => (/* reexport safe */ _devtools_index__WEBPACK_IMPORTED_MODULE_24__.EventEmitter),
/* harmony export */   Form: () => (/* reexport safe */ _runtime_core_formComponents__WEBPACK_IMPORTED_MODULE_5__.Form),
/* harmony export */   FormInput: () => (/* reexport safe */ _runtime_core_formComponents__WEBPACK_IMPORTED_MODULE_5__.FormInput),
/* harmony export */   Fragment: () => (/* reexport safe */ _runtime_core_h__WEBPACK_IMPORTED_MODULE_10__.Fragment),
/* harmony export */   LifecycleHooks: () => (/* reexport safe */ _runtime_core_apiLifecycle__WEBPACK_IMPORTED_MODULE_9__.LifecycleHooks),
/* harmony export */   MOUNTED: () => (/* reexport safe */ _runtime_core_apiLifecycle__WEBPACK_IMPORTED_MODULE_9__.MOUNTED),
/* harmony export */   NOOP: () => (/* reexport safe */ _shared_index__WEBPACK_IMPORTED_MODULE_25__.NOOP),
/* harmony export */   Router: () => (/* reexport safe */ _router_index__WEBPACK_IMPORTED_MODULE_22__.Router),
/* harmony export */   RouterLink: () => (/* reexport safe */ _router_index__WEBPACK_IMPORTED_MODULE_22__.RouterLink),
/* harmony export */   RouterView: () => (/* reexport safe */ _router_index__WEBPACK_IMPORTED_MODULE_22__.RouterView),
/* harmony export */   SOME_CONSTANT: () => (/* reexport safe */ _shared_index__WEBPACK_IMPORTED_MODULE_25__.SOME_CONSTANT),
/* harmony export */   Store: () => (/* reexport safe */ _store_index__WEBPACK_IMPORTED_MODULE_23__.Store),
/* harmony export */   Timeline: () => (/* reexport safe */ _runtime_core_animation__WEBPACK_IMPORTED_MODULE_3__.Timeline),
/* harmony export */   UNMOUNTED: () => (/* reexport safe */ _runtime_core_apiLifecycle__WEBPACK_IMPORTED_MODULE_9__.UNMOUNTED),
/* harmony export */   UPDATED: () => (/* reexport safe */ _runtime_core_apiLifecycle__WEBPACK_IMPORTED_MODULE_9__.UPDATED),
/* harmony export */   animate: () => (/* reexport safe */ _runtime_core_animation__WEBPACK_IMPORTED_MODULE_3__.animate),
/* harmony export */   cAnimate: () => (/* reexport safe */ _runtime_core_animation__WEBPACK_IMPORTED_MODULE_3__.cAnimate),
/* harmony export */   callWithAsyncErrorHandling: () => (/* reexport safe */ _runtime_core_errorHandling__WEBPACK_IMPORTED_MODULE_8__.callWithAsyncErrorHandling),
/* harmony export */   callWithErrorHandling: () => (/* reexport safe */ _runtime_core_errorHandling__WEBPACK_IMPORTED_MODULE_8__.callWithErrorHandling),
/* harmony export */   computed: () => (/* reexport safe */ _reactivity_computed__WEBPACK_IMPORTED_MODULE_13__.computed),
/* harmony export */   createApp: () => (/* reexport safe */ _runtime_core_apiCreateApp__WEBPACK_IMPORTED_MODULE_2__.createApp),
/* harmony export */   createContext: () => (/* reexport safe */ _runtime_core_apiInject__WEBPACK_IMPORTED_MODULE_1__.createContext),
/* harmony export */   createForm: () => (/* reexport safe */ _runtime_core_form__WEBPACK_IMPORTED_MODULE_4__.createForm),
/* harmony export */   createI18n: () => (/* reexport safe */ _runtime_core_i18n__WEBPACK_IMPORTED_MODULE_6__.createI18n),
/* harmony export */   createMicroApp: () => (/* reexport safe */ _runtime_core_microApp__WEBPACK_IMPORTED_MODULE_7__.createMicroApp),
/* harmony export */   createRouter: () => (/* reexport safe */ _router_index__WEBPACK_IMPORTED_MODULE_22__.createRouter),
/* harmony export */   createStore: () => (/* reexport safe */ _store_index__WEBPACK_IMPORTED_MODULE_23__.createStore),
/* harmony export */   createStoreModule: () => (/* reexport safe */ _store_index__WEBPACK_IMPORTED_MODULE_23__.createStoreModule),
/* harmony export */   currentInstance: () => (/* reexport safe */ _runtime_core_apiLifecycle__WEBPACK_IMPORTED_MODULE_9__.currentInstance),
/* harmony export */   defineComponent: () => (/* reexport safe */ _runtime_core_Component__WEBPACK_IMPORTED_MODULE_0__.defineComponent),
/* harmony export */   defineCustomElement: () => (/* reexport safe */ _runtime_dom_customElement__WEBPACK_IMPORTED_MODULE_19__.defineCustomElement),
/* harmony export */   devtools: () => (/* reexport safe */ _devtools_index__WEBPACK_IMPORTED_MODULE_24__.devtools),
/* harmony export */   effect: () => (/* reexport safe */ _reactivity_effect__WEBPACK_IMPORTED_MODULE_14__.effect),
/* harmony export */   enter: () => (/* reexport safe */ _runtime_core_animation__WEBPACK_IMPORTED_MODULE_3__.enter),
/* harmony export */   escapeHtml: () => (/* reexport safe */ _shared_index__WEBPACK_IMPORTED_MODULE_25__.escapeHtml),
/* harmony export */   extend: () => (/* reexport safe */ _shared_index__WEBPACK_IMPORTED_MODULE_25__.extend),
/* harmony export */   extractAttributesAsProps: () => (/* reexport safe */ _runtime_dom_attributeUtils__WEBPACK_IMPORTED_MODULE_21__.extractAttributesAsProps),
/* harmony export */   h: () => (/* reexport safe */ _runtime_core_h__WEBPACK_IMPORTED_MODULE_10__.h),
/* harmony export */   handleError: () => (/* reexport safe */ _runtime_core_errorHandling__WEBPACK_IMPORTED_MODULE_8__.handleError),
/* harmony export */   hasChanged: () => (/* reexport safe */ _shared_index__WEBPACK_IMPORTED_MODULE_25__.hasChanged),
/* harmony export */   inject: () => (/* reexport safe */ _runtime_core_apiInject__WEBPACK_IMPORTED_MODULE_1__.inject),
/* harmony export */   injectHook: () => (/* reexport safe */ _runtime_core_apiLifecycle__WEBPACK_IMPORTED_MODULE_9__.injectHook),
/* harmony export */   isArray: () => (/* reexport safe */ _shared_index__WEBPACK_IMPORTED_MODULE_25__.isArray),
/* harmony export */   isFunction: () => (/* reexport safe */ _shared_index__WEBPACK_IMPORTED_MODULE_25__.isFunction),
/* harmony export */   isObject: () => (/* reexport safe */ _shared_index__WEBPACK_IMPORTED_MODULE_25__.isObject),
/* harmony export */   isReactive: () => (/* reexport safe */ _reactivity_reactive__WEBPACK_IMPORTED_MODULE_16__.isReactive),
/* harmony export */   isReadonly: () => (/* reexport safe */ _reactivity_reactive__WEBPACK_IMPORTED_MODULE_16__.isReadonly),
/* harmony export */   isRef: () => (/* reexport safe */ _reactivity_ref__WEBPACK_IMPORTED_MODULE_17__.isRef),
/* harmony export */   isShallow: () => (/* reexport safe */ _reactivity_reactive__WEBPACK_IMPORTED_MODULE_16__.isShallow),
/* harmony export */   isSignal: () => (/* reexport safe */ _reactivity_signal__WEBPACK_IMPORTED_MODULE_15__.isSignal),
/* harmony export */   isString: () => (/* reexport safe */ _shared_index__WEBPACK_IMPORTED_MODULE_25__.isString),
/* harmony export */   leave: () => (/* reexport safe */ _runtime_core_animation__WEBPACK_IMPORTED_MODULE_3__.leave),
/* harmony export */   markRaw: () => (/* reexport safe */ _reactivity_reactive__WEBPACK_IMPORTED_MODULE_16__.markRaw),
/* harmony export */   nativeElementMap: () => (/* reexport safe */ _runtime_dom_customElement__WEBPACK_IMPORTED_MODULE_19__.nativeElementMap),
/* harmony export */   nextTick: () => (/* reexport safe */ _runtime_dom_nextTick__WEBPACK_IMPORTED_MODULE_20__.nextTick),
/* harmony export */   onBeforeMount: () => (/* reexport safe */ _runtime_core_apiLifecycle__WEBPACK_IMPORTED_MODULE_9__.onBeforeMount),
/* harmony export */   onBeforeUnmount: () => (/* reexport safe */ _runtime_core_apiLifecycle__WEBPACK_IMPORTED_MODULE_9__.onBeforeUnmount),
/* harmony export */   onBeforeUpdate: () => (/* reexport safe */ _runtime_core_apiLifecycle__WEBPACK_IMPORTED_MODULE_9__.onBeforeUpdate),
/* harmony export */   onErrorCaptured: () => (/* reexport safe */ _runtime_core_apiLifecycle__WEBPACK_IMPORTED_MODULE_9__.onErrorCaptured),
/* harmony export */   onMounted: () => (/* reexport safe */ _runtime_core_apiLifecycle__WEBPACK_IMPORTED_MODULE_9__.onMounted),
/* harmony export */   onUnmounted: () => (/* reexport safe */ _runtime_core_apiLifecycle__WEBPACK_IMPORTED_MODULE_9__.onUnmounted),
/* harmony export */   onUpdated: () => (/* reexport safe */ _runtime_core_apiLifecycle__WEBPACK_IMPORTED_MODULE_9__.onUpdated),
/* harmony export */   parseAttributeValue: () => (/* reexport safe */ _runtime_dom_attributeUtils__WEBPACK_IMPORTED_MODULE_21__.parseAttributeValue),
/* harmony export */   provide: () => (/* reexport safe */ _runtime_core_apiInject__WEBPACK_IMPORTED_MODULE_1__.provide),
/* harmony export */   proxyRefs: () => (/* reexport safe */ _reactivity_ref__WEBPACK_IMPORTED_MODULE_17__.proxyRefs),
/* harmony export */   queueJob: () => (/* reexport safe */ _runtime_core_scheduler__WEBPACK_IMPORTED_MODULE_11__.queueJob),
/* harmony export */   reactive: () => (/* reexport safe */ _reactivity_reactive__WEBPACK_IMPORTED_MODULE_16__.reactive),
/* harmony export */   readonly: () => (/* reexport safe */ _reactivity_reactive__WEBPACK_IMPORTED_MODULE_16__.readonly),
/* harmony export */   ref: () => (/* reexport safe */ _reactivity_ref__WEBPACK_IMPORTED_MODULE_17__.ref),
/* harmony export */   setCurrentInstance: () => (/* reexport safe */ _runtime_core_apiLifecycle__WEBPACK_IMPORTED_MODULE_9__.setCurrentInstance),
/* harmony export */   shallowReactive: () => (/* reexport safe */ _reactivity_reactive__WEBPACK_IMPORTED_MODULE_16__.shallowReactive),
/* harmony export */   shallowReadonly: () => (/* reexport safe */ _reactivity_reactive__WEBPACK_IMPORTED_MODULE_16__.shallowReadonly),
/* harmony export */   shallowRef: () => (/* reexport safe */ _reactivity_ref__WEBPACK_IMPORTED_MODULE_17__.shallowRef),
/* harmony export */   shallowSignal: () => (/* reexport safe */ _reactivity_signal__WEBPACK_IMPORTED_MODULE_15__.shallowSignal),
/* harmony export */   signal: () => (/* reexport safe */ _reactivity_signal__WEBPACK_IMPORTED_MODULE_15__.signal),
/* harmony export */   stagger: () => (/* reexport safe */ _runtime_core_animation__WEBPACK_IMPORTED_MODULE_3__.stagger),
/* harmony export */   t: () => (/* reexport safe */ _runtime_core_i18n__WEBPACK_IMPORTED_MODULE_6__.t),
/* harmony export */   targetMap: () => (/* reexport safe */ _reactivity_effect__WEBPACK_IMPORTED_MODULE_14__.targetMap),
/* harmony export */   toRaw: () => (/* reexport safe */ _reactivity_reactive__WEBPACK_IMPORTED_MODULE_16__.toRaw),
/* harmony export */   toRef: () => (/* reexport safe */ _reactivity_ref__WEBPACK_IMPORTED_MODULE_17__.toRef),
/* harmony export */   toRefs: () => (/* reexport safe */ _reactivity_ref__WEBPACK_IMPORTED_MODULE_17__.toRefs),
/* harmony export */   track: () => (/* reexport safe */ _reactivity_effect__WEBPACK_IMPORTED_MODULE_14__.track),
/* harmony export */   trackEffects: () => (/* reexport safe */ _reactivity_effect__WEBPACK_IMPORTED_MODULE_14__.trackEffects),
/* harmony export */   traverse: () => (/* reexport safe */ _reactivity_reactive__WEBPACK_IMPORTED_MODULE_16__.traverse),
/* harmony export */   trigger: () => (/* reexport safe */ _reactivity_effect__WEBPACK_IMPORTED_MODULE_14__.trigger),
/* harmony export */   triggerEffects: () => (/* reexport safe */ _reactivity_effect__WEBPACK_IMPORTED_MODULE_14__.triggerEffects),
/* harmony export */   unref: () => (/* reexport safe */ _reactivity_ref__WEBPACK_IMPORTED_MODULE_17__.unref),
/* harmony export */   useAnimate: () => (/* reexport safe */ _runtime_core_composables__WEBPACK_IMPORTED_MODULE_12__.useAnimate),
/* harmony export */   useAsyncState: () => (/* reexport safe */ _runtime_core_composables__WEBPACK_IMPORTED_MODULE_12__.useAsyncState),
/* harmony export */   useBattery: () => (/* reexport safe */ _runtime_core_composables__WEBPACK_IMPORTED_MODULE_12__.useBattery),
/* harmony export */   useCarousel: () => (/* reexport safe */ _runtime_core_composables__WEBPACK_IMPORTED_MODULE_12__.useCarousel),
/* harmony export */   useClipboard: () => (/* reexport safe */ _runtime_core_composables__WEBPACK_IMPORTED_MODULE_12__.useClipboard),
/* harmony export */   useCssVar: () => (/* reexport safe */ _runtime_core_composables__WEBPACK_IMPORTED_MODULE_12__.useCssVar),
/* harmony export */   useDebounce: () => (/* reexport safe */ _runtime_core_composables__WEBPACK_IMPORTED_MODULE_12__.useDebounce),
/* harmony export */   useDocumentVisibility: () => (/* reexport safe */ _runtime_core_composables__WEBPACK_IMPORTED_MODULE_12__.useDocumentVisibility),
/* harmony export */   useDraggable: () => (/* reexport safe */ _runtime_core_composables__WEBPACK_IMPORTED_MODULE_12__.useDraggable),
/* harmony export */   useDropZone: () => (/* reexport safe */ _runtime_core_composables__WEBPACK_IMPORTED_MODULE_12__.useDropZone),
/* harmony export */   useElementSize: () => (/* reexport safe */ _runtime_core_composables__WEBPACK_IMPORTED_MODULE_12__.useElementSize),
/* harmony export */   useEventListener: () => (/* reexport safe */ _runtime_core_composables__WEBPACK_IMPORTED_MODULE_12__.useEventListener),
/* harmony export */   useFavicon: () => (/* reexport safe */ _runtime_core_composables__WEBPACK_IMPORTED_MODULE_12__.useFavicon),
/* harmony export */   useFetch: () => (/* reexport safe */ _runtime_core_composables__WEBPACK_IMPORTED_MODULE_12__.useFetch),
/* harmony export */   useFocus: () => (/* reexport safe */ _runtime_core_composables__WEBPACK_IMPORTED_MODULE_12__.useFocus),
/* harmony export */   useFps: () => (/* reexport safe */ _runtime_core_composables__WEBPACK_IMPORTED_MODULE_12__.useFps),
/* harmony export */   useFrame: () => (/* reexport safe */ _runtime_core_animation__WEBPACK_IMPORTED_MODULE_3__.useFrame),
/* harmony export */   useFullscreen: () => (/* reexport safe */ _runtime_core_composables__WEBPACK_IMPORTED_MODULE_12__.useFullscreen),
/* harmony export */   useGeolocation: () => (/* reexport safe */ _runtime_core_composables__WEBPACK_IMPORTED_MODULE_12__.useGeolocation),
/* harmony export */   useHover: () => (/* reexport safe */ _runtime_core_composables__WEBPACK_IMPORTED_MODULE_12__.useHover),
/* harmony export */   useId: () => (/* reexport safe */ _runtime_core_composables__WEBPACK_IMPORTED_MODULE_12__.useId),
/* harmony export */   useIdle: () => (/* reexport safe */ _runtime_core_composables__WEBPACK_IMPORTED_MODULE_12__.useIdle),
/* harmony export */   useIntersectionObserver: () => (/* reexport safe */ _runtime_core_composables__WEBPACK_IMPORTED_MODULE_12__.useIntersectionObserver),
/* harmony export */   useInterval: () => (/* reexport safe */ _runtime_core_composables__WEBPACK_IMPORTED_MODULE_12__.useInterval),
/* harmony export */   useKeyModifier: () => (/* reexport safe */ _runtime_core_composables__WEBPACK_IMPORTED_MODULE_12__.useKeyModifier),
/* harmony export */   useLocalStorage: () => (/* reexport safe */ _runtime_core_composables__WEBPACK_IMPORTED_MODULE_12__.useLocalStorage),
/* harmony export */   useMediaQuery: () => (/* reexport safe */ _runtime_core_composables__WEBPACK_IMPORTED_MODULE_12__.useMediaQuery),
/* harmony export */   useMemory: () => (/* reexport safe */ _runtime_core_composables__WEBPACK_IMPORTED_MODULE_12__.useMemory),
/* harmony export */   useMotion: () => (/* reexport safe */ _runtime_core_animation__WEBPACK_IMPORTED_MODULE_3__.useMotion),
/* harmony export */   useMouse: () => (/* reexport safe */ _runtime_core_composables__WEBPACK_IMPORTED_MODULE_12__.useMouse),
/* harmony export */   useMutationObserver: () => (/* reexport safe */ _runtime_core_composables__WEBPACK_IMPORTED_MODULE_12__.useMutationObserver),
/* harmony export */   useNetwork: () => (/* reexport safe */ _runtime_core_composables__WEBPACK_IMPORTED_MODULE_12__.useNetwork),
/* harmony export */   useOnClickOutside: () => (/* reexport safe */ _runtime_core_composables__WEBPACK_IMPORTED_MODULE_12__.useOnClickOutside),
/* harmony export */   useOnline: () => (/* reexport safe */ _runtime_core_composables__WEBPACK_IMPORTED_MODULE_12__.useOnline),
/* harmony export */   useParallax: () => (/* reexport safe */ _runtime_core_composables__WEBPACK_IMPORTED_MODULE_12__.useParallax),
/* harmony export */   usePreferredDark: () => (/* reexport safe */ _runtime_core_composables__WEBPACK_IMPORTED_MODULE_12__.usePreferredDark),
/* harmony export */   useReducer: () => (/* reexport safe */ _runtime_core_composables__WEBPACK_IMPORTED_MODULE_12__.useReducer),
/* harmony export */   useRoute: () => (/* reexport safe */ _router_index__WEBPACK_IMPORTED_MODULE_22__.useRoute),
/* harmony export */   useRouter: () => (/* reexport safe */ _router_index__WEBPACK_IMPORTED_MODULE_22__.useRouter),
/* harmony export */   useScriptTag: () => (/* reexport safe */ _runtime_core_composables__WEBPACK_IMPORTED_MODULE_12__.useScriptTag),
/* harmony export */   useScroll: () => (/* reexport safe */ _runtime_core_composables__WEBPACK_IMPORTED_MODULE_12__.useScroll),
/* harmony export */   useShare: () => (/* reexport safe */ _runtime_core_composables__WEBPACK_IMPORTED_MODULE_12__.useShare),
/* harmony export */   useSound: () => (/* reexport safe */ _runtime_core_composables__WEBPACK_IMPORTED_MODULE_12__.useSound),
/* harmony export */   useSpeechRecognition: () => (/* reexport safe */ _runtime_core_composables__WEBPACK_IMPORTED_MODULE_12__.useSpeechRecognition),
/* harmony export */   useSpring: () => (/* reexport safe */ _runtime_core_animation__WEBPACK_IMPORTED_MODULE_3__.useSpring),
/* harmony export */   useStore: () => (/* reexport safe */ _store_index__WEBPACK_IMPORTED_MODULE_23__.useStore),
/* harmony export */   useSwipe: () => (/* reexport safe */ _runtime_core_composables__WEBPACK_IMPORTED_MODULE_12__.useSwipe),
/* harmony export */   useThrottle: () => (/* reexport safe */ _runtime_core_composables__WEBPACK_IMPORTED_MODULE_12__.useThrottle),
/* harmony export */   useTimeout: () => (/* reexport safe */ _runtime_core_composables__WEBPACK_IMPORTED_MODULE_12__.useTimeout),
/* harmony export */   useTitle: () => (/* reexport safe */ _runtime_core_composables__WEBPACK_IMPORTED_MODULE_12__.useTitle),
/* harmony export */   useToggle: () => (/* reexport safe */ _runtime_core_composables__WEBPACK_IMPORTED_MODULE_12__.useToggle),
/* harmony export */   useTransition: () => (/* reexport safe */ _runtime_core_animation__WEBPACK_IMPORTED_MODULE_3__.useTransition),
/* harmony export */   useTween: () => (/* reexport safe */ _runtime_core_animation__WEBPACK_IMPORTED_MODULE_3__.useTween),
/* harmony export */   useVirtualList: () => (/* reexport safe */ _runtime_core_composables__WEBPACK_IMPORTED_MODULE_12__.useVirtualList),
/* harmony export */   useWakeLock: () => (/* reexport safe */ _runtime_core_composables__WEBPACK_IMPORTED_MODULE_12__.useWakeLock),
/* harmony export */   useWebP: () => (/* reexport safe */ _runtime_core_composables__WEBPACK_IMPORTED_MODULE_12__.useWebP),
/* harmony export */   useWindowSize: () => (/* reexport safe */ _runtime_core_composables__WEBPACK_IMPORTED_MODULE_12__.useWindowSize),
/* harmony export */   warn: () => (/* reexport safe */ _shared_index__WEBPACK_IMPORTED_MODULE_25__.warn),
/* harmony export */   watch: () => (/* reexport safe */ _reactivity_watch__WEBPACK_IMPORTED_MODULE_18__.watch),
/* harmony export */   watchEffect: () => (/* reexport safe */ _reactivity_effect__WEBPACK_IMPORTED_MODULE_14__.effect)
/* harmony export */ });
/* harmony import */ var _runtime_core_Component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./runtime-core/Component */ "./src/runtime-core/Component.ts");
/* harmony import */ var _runtime_core_apiInject__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./runtime-core/apiInject */ "./src/runtime-core/apiInject.ts");
/* harmony import */ var _runtime_core_apiCreateApp__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./runtime-core/apiCreateApp */ "./src/runtime-core/apiCreateApp.ts");
/* harmony import */ var _runtime_core_animation__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./runtime-core/animation */ "./src/runtime-core/animation.ts");
/* harmony import */ var _runtime_core_form__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./runtime-core/form */ "./src/runtime-core/form.ts");
/* harmony import */ var _runtime_core_formComponents__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./runtime-core/formComponents */ "./src/runtime-core/formComponents.ts");
/* harmony import */ var _runtime_core_i18n__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./runtime-core/i18n */ "./src/runtime-core/i18n.ts");
/* harmony import */ var _runtime_core_microApp__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./runtime-core/microApp */ "./src/runtime-core/microApp.ts");
/* harmony import */ var _runtime_core_errorHandling__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./runtime-core/errorHandling */ "./src/runtime-core/errorHandling.ts");
/* harmony import */ var _runtime_core_apiLifecycle__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./runtime-core/apiLifecycle */ "./src/runtime-core/apiLifecycle.ts");
/* harmony import */ var _runtime_core_h__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./runtime-core/h */ "./src/runtime-core/h.ts");
/* harmony import */ var _runtime_core_scheduler__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./runtime-core/scheduler */ "./src/runtime-core/scheduler.ts");
/* harmony import */ var _runtime_core_composables__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./runtime-core/composables */ "./src/runtime-core/composables.ts");
/* harmony import */ var _reactivity_computed__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./reactivity/computed */ "./src/reactivity/computed.ts");
/* harmony import */ var _reactivity_effect__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./reactivity/effect */ "./src/reactivity/effect.ts");
/* harmony import */ var _reactivity_signal__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ./reactivity/signal */ "./src/reactivity/signal.ts");
/* harmony import */ var _reactivity_reactive__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ./reactivity/reactive */ "./src/reactivity/reactive.ts");
/* harmony import */ var _reactivity_ref__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ./reactivity/ref */ "./src/reactivity/ref.ts");
/* harmony import */ var _reactivity_watch__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! ./reactivity/watch */ "./src/reactivity/watch.ts");
/* harmony import */ var _runtime_dom_customElement__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! ./runtime-dom/customElement */ "./src/runtime-dom/customElement.ts");
/* harmony import */ var _runtime_dom_nextTick__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! ./runtime-dom/nextTick */ "./src/runtime-dom/nextTick.ts");
/* harmony import */ var _runtime_dom_attributeUtils__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(/*! ./runtime-dom/attributeUtils */ "./src/runtime-dom/attributeUtils.ts");
/* harmony import */ var _router_index__WEBPACK_IMPORTED_MODULE_22__ = __webpack_require__(/*! ./router/index */ "./src/router/index.ts");
/* harmony import */ var _store_index__WEBPACK_IMPORTED_MODULE_23__ = __webpack_require__(/*! ./store/index */ "./src/store/index.ts");
/* harmony import */ var _devtools_index__WEBPACK_IMPORTED_MODULE_24__ = __webpack_require__(/*! ./devtools/index */ "./src/devtools/index.ts");
/* harmony import */ var _shared_index__WEBPACK_IMPORTED_MODULE_25__ = __webpack_require__(/*! ./shared/index */ "./src/shared/index.ts");
// Runtime Core
 // Includes defineComponent













// Reactivity







//export { batch } from './reactivity/effect';

// Runtime DOM




// Ecosystem





/***/ },

/***/ "./src/shared/constants.ts"
/*!*********************************!*\
  !*** ./src/shared/constants.ts ***!
  \*********************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   SOME_CONSTANT: () => (/* binding */ SOME_CONSTANT)
/* harmony export */ });
// This file can be used to define shared constants across the framework.
var SOME_CONSTANT = 'value';

/***/ },

/***/ "./src/shared/index.ts"
/*!*****************************!*\
  !*** ./src/shared/index.ts ***!
  \*****************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   NOOP: () => (/* reexport safe */ _utils__WEBPACK_IMPORTED_MODULE_0__.NOOP),
/* harmony export */   SOME_CONSTANT: () => (/* reexport safe */ _constants__WEBPACK_IMPORTED_MODULE_3__.SOME_CONSTANT),
/* harmony export */   escapeHtml: () => (/* reexport safe */ _utils__WEBPACK_IMPORTED_MODULE_0__.escapeHtml),
/* harmony export */   extend: () => (/* reexport safe */ _utils__WEBPACK_IMPORTED_MODULE_0__.extend),
/* harmony export */   hasChanged: () => (/* reexport safe */ _is__WEBPACK_IMPORTED_MODULE_1__.hasChanged),
/* harmony export */   isArray: () => (/* reexport safe */ _is__WEBPACK_IMPORTED_MODULE_1__.isArray),
/* harmony export */   isFunction: () => (/* reexport safe */ _is__WEBPACK_IMPORTED_MODULE_1__.isFunction),
/* harmony export */   isObject: () => (/* reexport safe */ _is__WEBPACK_IMPORTED_MODULE_1__.isObject),
/* harmony export */   isString: () => (/* reexport safe */ _is__WEBPACK_IMPORTED_MODULE_1__.isString),
/* harmony export */   warn: () => (/* reexport safe */ _warn__WEBPACK_IMPORTED_MODULE_2__.warn)
/* harmony export */ });
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils */ "./src/shared/utils.ts");
/* harmony import */ var _is__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./is */ "./src/shared/is.ts");
/* harmony import */ var _warn__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./warn */ "./src/shared/warn.ts");
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./constants */ "./src/shared/constants.ts");

 // Re-export all is* functions from the new file
 // Export the new warn utility
 // Export any shared constants

/***/ },

/***/ "./src/shared/is.ts"
/*!**************************!*\
  !*** ./src/shared/is.ts ***!
  \**************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   hasChanged: () => (/* binding */ hasChanged),
/* harmony export */   isArray: () => (/* binding */ isArray),
/* harmony export */   isFunction: () => (/* binding */ isFunction),
/* harmony export */   isObject: () => (/* binding */ isObject),
/* harmony export */   isString: () => (/* binding */ isString)
/* harmony export */ });
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
/**
 * Checks if a value is a non-null object.
 */
var isObject = function isObject(val) {
  return val !== null && _typeof(val) === 'object';
};

/**
 * Checks if a value is a function.
 */
var isFunction = function isFunction(val) {
  return typeof val === 'function';
};

/**
 * Checks if a value is a string.
 */
var isString = function isString(val) {
  return typeof val === 'string';
};

/**
 * Checks if a value is an array.
 */
var isArray = Array.isArray;

/**
 * Returns true if the value has changed, handling NaN and other edge cases.
 */
var hasChanged = function hasChanged(value, oldValue) {
  return !Object.is(value, oldValue);
};

/***/ },

/***/ "./src/shared/utils.ts"
/*!*****************************!*\
  !*** ./src/shared/utils.ts ***!
  \*****************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   NOOP: () => (/* binding */ NOOP),
/* harmony export */   escapeHtml: () => (/* binding */ escapeHtml),
/* harmony export */   extend: () => (/* binding */ extend)
/* harmony export */ });
/**
 * An empty function that does nothing. Used as a default callback.
 */
var NOOP = function NOOP() {};

/**
 * Merges properties from source objects into a target object.
 */
var extend = Object.assign;
var escapeRE = /["'&<>]/;
function escapeHtml(string) {
  var str = String(string);
  var match = escapeRE.exec(str);
  if (!match) {
    return str;
  }
  var html = '';
  var escaped;
  var index;
  var lastIndex = 0;
  for (index = match.index; index < str.length; index++) {
    switch (str.charCodeAt(index)) {
      case 34:
        // "
        escaped = '&quot;';
        break;
      case 38:
        // &
        escaped = '&amp;';
        break;
      case 39:
        // '
        escaped = '&#39;';
        break;
      case 60:
        // <
        escaped = '&lt;';
        break;
      case 62:
        // >
        escaped = '&gt;';
        break;
      default:
        continue;
    }
    if (lastIndex !== index) {
      html += str.substring(lastIndex, index);
    }
    lastIndex = index + 1;
    html += escaped;
  }
  return lastIndex !== index ? html + str.substring(lastIndex, index) : html;
}

/***/ },

/***/ "./src/shared/warn.ts"
/*!****************************!*\
  !*** ./src/shared/warn.ts ***!
  \****************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   warn: () => (/* binding */ warn)
/* harmony export */ });
/**
 * Prints a warning message to the console, typically only in development mode.
 * @param msg The warning message.
 * @param args Additional arguments to pass to console.warn.
 */
function warn(msg) {
  if (typeof __DEV__ !== 'undefined' && __DEV__) {
    var _console;
    for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }
    (_console = console).warn.apply(_console, ["[Can Warn]: ".concat(msg)].concat(args));
  }
}

/***/ },

/***/ "./src/store/Store.ts"
/*!****************************!*\
  !*** ./src/store/Store.ts ***!
  \****************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Store: () => (/* binding */ Store),
/* harmony export */   createStore: () => (/* binding */ createStore),
/* harmony export */   useStore: () => (/* binding */ useStore)
/* harmony export */ });
/* harmony import */ var _reactivity_signal__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../reactivity/signal */ "./src/reactivity/signal.ts");
/* harmony import */ var _reactivity_computed__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../reactivity/computed */ "./src/reactivity/computed.ts");
/* harmony import */ var _devtools_index__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../devtools/index */ "./src/devtools/index.ts");
/* harmony import */ var _runtime_core_apiInject__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../runtime-core/apiInject */ "./src/runtime-core/apiInject.ts");
/* harmony import */ var _shared_index__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../shared/index */ "./src/shared/index.ts");
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }




 // Import warn utility

var Store = /*#__PURE__*/function () {
  function Store(options) {
    var _this = this;
    _classCallCheck(this, Store);
    _defineProperty(this, "getters", {});
    // Use generic A for actions
    _defineProperty(this, "_subscribers", []);
    /**
     * Commit a mutation to change state synchronously.
     */
    _defineProperty(this, "commit", function (type, payload) {
      var mutation = _this._mutations[type];
      if (!mutation) {
        (0,_shared_index__WEBPACK_IMPORTED_MODULE_4__.warn)("[Store] Unknown mutation type: ".concat(String(type)));
        return;
      }
      if (_devtools_index__WEBPACK_IMPORTED_MODULE_2__.devtools.enabled) {
        _devtools_index__WEBPACK_IMPORTED_MODULE_2__.devtools.emit(_devtools_index__WEBPACK_IMPORTED_MODULE_2__.DevToolsEvents.STORE_MUTATION, {
          type: type,
          payload: payload,
          state: JSON.parse(JSON.stringify(_this.state.value)),
          // Snapshot
          timestamp: Date.now()
        });
      }
      mutation(_this.state.value, payload);

      // Notify subscribers
      _this._subscribers.forEach(function (sub) {
        return sub({
          type: type,
          payload: payload
        }, _this.state.value);
      });

      // Trigger reactivity for deep mutations
      _this.state.value = _this.state.value;
    });
    /**
     * Dispatch an action (can be asynchronous).
     */
    _defineProperty(this, "dispatch", function (type, payload) {
      var action = _this._actions[type];
      if (!action) {
        (0,_shared_index__WEBPACK_IMPORTED_MODULE_4__.warn)("[Store] Unknown action type: ".concat(String(type)));
        return;
      }
      if (_devtools_index__WEBPACK_IMPORTED_MODULE_2__.devtools.enabled) {
        _devtools_index__WEBPACK_IMPORTED_MODULE_2__.devtools.emit(_devtools_index__WEBPACK_IMPORTED_MODULE_2__.DevToolsEvents.STORE_ACTION, {
          type: type,
          payload: payload,
          timestamp: Date.now()
        });
      }
      return action({
        state: _this.state.value,
        commit: _this.commit
      }, payload);
    });
    // Hydrate state from window if available (SSR support)
    var initialState = typeof window !== 'undefined' && window.__INITIAL_STATE__ ? window.__INITIAL_STATE__ : options.state();
    this.state = (0,_reactivity_signal__WEBPACK_IMPORTED_MODULE_0__.signal)(initialState, {
      name: 'Store State',
      internal: false
    }); // Register with devtools, set internal to false if you want to see it
    this._mutations = options.mutations || {};
    this._actions = options.actions || {};

    // Initialize Getters as computed signals
    if (options.getters) {
      var _loop = function _loop() {
        var getterFn = options.getters[key];
        // Create a computed signal that tracks the state
        var c = (0,_reactivity_computed__WEBPACK_IMPORTED_MODULE_1__.computed)(function () {
          return getterFn(_this.state.value);
        });
        // Proxy the access so the user can use store.getters.key
        Object.defineProperty(_this.getters, key, {
          get: function get() {
            return c.value;
          },
          enumerable: true
        });
      };
      for (var key in options.getters) {
        _loop();
      }
    }
  }
  return _createClass(Store, [{
    key: "onMutation",
    value:
    /**
     * Subscribe to mutations. Useful for plugins (e.g., persistence).
     * Returns an unsubscribe function.
     */
    function onMutation(fn) {
      var _this2 = this;
      this._subscribers.push(fn);
      return function () {
        var index = _this2._subscribers.indexOf(fn);
        if (index > -1) {
          _this2._subscribers.splice(index, 1);
        }
      };
    }

    /**
     * Integration with app.use()
     */
  }, {
    key: "install",
    value: function install(app) {
      app.provide('store', this);
    }
  }]);
}();
function createStore(options) {
  return new Store(options);
}
function useStore() {
  var store = (0,_runtime_core_apiInject__WEBPACK_IMPORTED_MODULE_3__.inject)('store');
  if (!store) {
    throw new Error('[Store] Store not found. Did you forget to provide it via app.provide("store", store)?');
  }
  return store;
}

/***/ },

/***/ "./src/store/index.ts"
/*!****************************!*\
  !*** ./src/store/index.ts ***!
  \****************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Store: () => (/* reexport safe */ _Store__WEBPACK_IMPORTED_MODULE_0__.Store),
/* harmony export */   createStore: () => (/* reexport safe */ _Store__WEBPACK_IMPORTED_MODULE_0__.createStore),
/* harmony export */   createStoreModule: () => (/* reexport safe */ _modules__WEBPACK_IMPORTED_MODULE_1__.createStoreModule),
/* harmony export */   useStore: () => (/* reexport safe */ _Store__WEBPACK_IMPORTED_MODULE_0__.useStore)
/* harmony export */ });
/* harmony import */ var _Store__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Store */ "./src/store/Store.ts");
/* harmony import */ var _modules__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./modules */ "./src/store/modules.ts");



/***/ },

/***/ "./src/store/modules.ts"
/*!******************************!*\
  !*** ./src/store/modules.ts ***!
  \******************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createStoreModule: () => (/* binding */ createStoreModule)
/* harmony export */ });
/* harmony import */ var _reactivity_signal__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../reactivity/signal */ "./src/reactivity/signal.ts");


// import { Action , Action } from './Store';

/**
 * Options for defining a Store Module.
 * Similar to the main StoreOptions, but can be nested.
 */

/**
 * Represents a compiled Store Module instance.
 */

function createStoreModule(options) {
  return {
    namespaced: options.namespaced || false,
    state: (0,_reactivity_signal__WEBPACK_IMPORTED_MODULE_0__.signal)(options.state(), {
      name: "Module State (".concat(options.namespaced ? 'namespaced' : 'root', ")"),
      internal: false
    }),
    _mutations: options.mutations || {},
    _actions: options.actions || {},
    _getters: options.getters || {},
    _children: {} // Children will be processed recursively by the main Store
  };
}

/***/ }

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
/******/ 		if (!(moduleId in __webpack_modules__)) {
/******/ 			delete __webpack_module_cache__[moduleId];
/******/ 			var e = new Error("Cannot find module '" + moduleId + "'");
/******/ 			e.code = 'MODULE_NOT_FOUND';
/******/ 			throw e;
/******/ 		}
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
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
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other modules in the chunk.
(() => {
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   BEFORE_MOUNT: () => (/* reexport safe */ _runtime_helpers__WEBPACK_IMPORTED_MODULE_0__.BEFORE_MOUNT),
/* harmony export */   BEFORE_UNMOUNT: () => (/* reexport safe */ _runtime_helpers__WEBPACK_IMPORTED_MODULE_0__.BEFORE_UNMOUNT),
/* harmony export */   BEFORE_UPDATE: () => (/* reexport safe */ _runtime_helpers__WEBPACK_IMPORTED_MODULE_0__.BEFORE_UPDATE),
/* harmony export */   CanElement: () => (/* reexport safe */ _runtime_helpers__WEBPACK_IMPORTED_MODULE_0__.CanElement),
/* harmony export */   Component: () => (/* reexport safe */ _runtime_helpers__WEBPACK_IMPORTED_MODULE_0__.Component),
/* harmony export */   DevToolsEvents: () => (/* reexport safe */ _runtime_helpers__WEBPACK_IMPORTED_MODULE_0__.DevToolsEvents),
/* harmony export */   ERROR_CAPTURED: () => (/* reexport safe */ _runtime_helpers__WEBPACK_IMPORTED_MODULE_0__.ERROR_CAPTURED),
/* harmony export */   EffectScope: () => (/* reexport safe */ _runtime_helpers__WEBPACK_IMPORTED_MODULE_0__.EffectScope),
/* harmony export */   EventEmitter: () => (/* reexport safe */ _runtime_helpers__WEBPACK_IMPORTED_MODULE_0__.EventEmitter),
/* harmony export */   Form: () => (/* reexport safe */ _runtime_helpers__WEBPACK_IMPORTED_MODULE_0__.Form),
/* harmony export */   FormInput: () => (/* reexport safe */ _runtime_helpers__WEBPACK_IMPORTED_MODULE_0__.FormInput),
/* harmony export */   Fragment: () => (/* reexport safe */ _runtime_helpers__WEBPACK_IMPORTED_MODULE_0__.Fragment),
/* harmony export */   LifecycleHooks: () => (/* reexport safe */ _runtime_helpers__WEBPACK_IMPORTED_MODULE_0__.LifecycleHooks),
/* harmony export */   MOUNTED: () => (/* reexport safe */ _runtime_helpers__WEBPACK_IMPORTED_MODULE_0__.MOUNTED),
/* harmony export */   NOOP: () => (/* reexport safe */ _runtime_helpers__WEBPACK_IMPORTED_MODULE_0__.NOOP),
/* harmony export */   Router: () => (/* reexport safe */ _runtime_helpers__WEBPACK_IMPORTED_MODULE_0__.Router),
/* harmony export */   RouterLink: () => (/* reexport safe */ _runtime_helpers__WEBPACK_IMPORTED_MODULE_0__.RouterLink),
/* harmony export */   RouterView: () => (/* reexport safe */ _runtime_helpers__WEBPACK_IMPORTED_MODULE_0__.RouterView),
/* harmony export */   SOME_CONSTANT: () => (/* reexport safe */ _runtime_helpers__WEBPACK_IMPORTED_MODULE_0__.SOME_CONSTANT),
/* harmony export */   Store: () => (/* reexport safe */ _runtime_helpers__WEBPACK_IMPORTED_MODULE_0__.Store),
/* harmony export */   Timeline: () => (/* reexport safe */ _runtime_helpers__WEBPACK_IMPORTED_MODULE_0__.Timeline),
/* harmony export */   UNMOUNTED: () => (/* reexport safe */ _runtime_helpers__WEBPACK_IMPORTED_MODULE_0__.UNMOUNTED),
/* harmony export */   UPDATED: () => (/* reexport safe */ _runtime_helpers__WEBPACK_IMPORTED_MODULE_0__.UPDATED),
/* harmony export */   VERSION: () => (/* binding */ VERSION),
/* harmony export */   animate: () => (/* reexport safe */ _runtime_helpers__WEBPACK_IMPORTED_MODULE_0__.animate),
/* harmony export */   cAnimate: () => (/* reexport safe */ _runtime_helpers__WEBPACK_IMPORTED_MODULE_0__.cAnimate),
/* harmony export */   callWithAsyncErrorHandling: () => (/* reexport safe */ _runtime_helpers__WEBPACK_IMPORTED_MODULE_0__.callWithAsyncErrorHandling),
/* harmony export */   callWithErrorHandling: () => (/* reexport safe */ _runtime_helpers__WEBPACK_IMPORTED_MODULE_0__.callWithErrorHandling),
/* harmony export */   computed: () => (/* reexport safe */ _runtime_helpers__WEBPACK_IMPORTED_MODULE_0__.computed),
/* harmony export */   createApp: () => (/* reexport safe */ _runtime_helpers__WEBPACK_IMPORTED_MODULE_0__.createApp),
/* harmony export */   createContext: () => (/* reexport safe */ _runtime_helpers__WEBPACK_IMPORTED_MODULE_0__.createContext),
/* harmony export */   createForm: () => (/* reexport safe */ _runtime_helpers__WEBPACK_IMPORTED_MODULE_0__.createForm),
/* harmony export */   createI18n: () => (/* reexport safe */ _runtime_helpers__WEBPACK_IMPORTED_MODULE_0__.createI18n),
/* harmony export */   createMicroApp: () => (/* reexport safe */ _runtime_helpers__WEBPACK_IMPORTED_MODULE_0__.createMicroApp),
/* harmony export */   createRouter: () => (/* reexport safe */ _runtime_helpers__WEBPACK_IMPORTED_MODULE_0__.createRouter),
/* harmony export */   createStore: () => (/* reexport safe */ _runtime_helpers__WEBPACK_IMPORTED_MODULE_0__.createStore),
/* harmony export */   createStoreModule: () => (/* reexport safe */ _runtime_helpers__WEBPACK_IMPORTED_MODULE_0__.createStoreModule),
/* harmony export */   currentInstance: () => (/* reexport safe */ _runtime_helpers__WEBPACK_IMPORTED_MODULE_0__.currentInstance),
/* harmony export */   defineComponent: () => (/* reexport safe */ _runtime_helpers__WEBPACK_IMPORTED_MODULE_0__.defineComponent),
/* harmony export */   defineCustomElement: () => (/* reexport safe */ _runtime_helpers__WEBPACK_IMPORTED_MODULE_0__.defineCustomElement),
/* harmony export */   devtools: () => (/* reexport safe */ _runtime_helpers__WEBPACK_IMPORTED_MODULE_0__.devtools),
/* harmony export */   effect: () => (/* reexport safe */ _runtime_helpers__WEBPACK_IMPORTED_MODULE_0__.effect),
/* harmony export */   enter: () => (/* reexport safe */ _runtime_helpers__WEBPACK_IMPORTED_MODULE_0__.enter),
/* harmony export */   escapeHtml: () => (/* reexport safe */ _runtime_helpers__WEBPACK_IMPORTED_MODULE_0__.escapeHtml),
/* harmony export */   extend: () => (/* reexport safe */ _runtime_helpers__WEBPACK_IMPORTED_MODULE_0__.extend),
/* harmony export */   extractAttributesAsProps: () => (/* reexport safe */ _runtime_helpers__WEBPACK_IMPORTED_MODULE_0__.extractAttributesAsProps),
/* harmony export */   h: () => (/* reexport safe */ _runtime_helpers__WEBPACK_IMPORTED_MODULE_0__.h),
/* harmony export */   handleError: () => (/* reexport safe */ _runtime_helpers__WEBPACK_IMPORTED_MODULE_0__.handleError),
/* harmony export */   hasChanged: () => (/* reexport safe */ _runtime_helpers__WEBPACK_IMPORTED_MODULE_0__.hasChanged),
/* harmony export */   inject: () => (/* reexport safe */ _runtime_helpers__WEBPACK_IMPORTED_MODULE_0__.inject),
/* harmony export */   injectHook: () => (/* reexport safe */ _runtime_helpers__WEBPACK_IMPORTED_MODULE_0__.injectHook),
/* harmony export */   isArray: () => (/* reexport safe */ _runtime_helpers__WEBPACK_IMPORTED_MODULE_0__.isArray),
/* harmony export */   isFunction: () => (/* reexport safe */ _runtime_helpers__WEBPACK_IMPORTED_MODULE_0__.isFunction),
/* harmony export */   isObject: () => (/* reexport safe */ _runtime_helpers__WEBPACK_IMPORTED_MODULE_0__.isObject),
/* harmony export */   isReactive: () => (/* reexport safe */ _runtime_helpers__WEBPACK_IMPORTED_MODULE_0__.isReactive),
/* harmony export */   isReadonly: () => (/* reexport safe */ _runtime_helpers__WEBPACK_IMPORTED_MODULE_0__.isReadonly),
/* harmony export */   isRef: () => (/* reexport safe */ _runtime_helpers__WEBPACK_IMPORTED_MODULE_0__.isRef),
/* harmony export */   isShallow: () => (/* reexport safe */ _runtime_helpers__WEBPACK_IMPORTED_MODULE_0__.isShallow),
/* harmony export */   isSignal: () => (/* reexport safe */ _runtime_helpers__WEBPACK_IMPORTED_MODULE_0__.isSignal),
/* harmony export */   isString: () => (/* reexport safe */ _runtime_helpers__WEBPACK_IMPORTED_MODULE_0__.isString),
/* harmony export */   leave: () => (/* reexport safe */ _runtime_helpers__WEBPACK_IMPORTED_MODULE_0__.leave),
/* harmony export */   markRaw: () => (/* reexport safe */ _runtime_helpers__WEBPACK_IMPORTED_MODULE_0__.markRaw),
/* harmony export */   nativeElementMap: () => (/* reexport safe */ _runtime_helpers__WEBPACK_IMPORTED_MODULE_0__.nativeElementMap),
/* harmony export */   nextTick: () => (/* reexport safe */ _runtime_helpers__WEBPACK_IMPORTED_MODULE_0__.nextTick),
/* harmony export */   onBeforeMount: () => (/* reexport safe */ _runtime_helpers__WEBPACK_IMPORTED_MODULE_0__.onBeforeMount),
/* harmony export */   onBeforeUnmount: () => (/* reexport safe */ _runtime_helpers__WEBPACK_IMPORTED_MODULE_0__.onBeforeUnmount),
/* harmony export */   onBeforeUpdate: () => (/* reexport safe */ _runtime_helpers__WEBPACK_IMPORTED_MODULE_0__.onBeforeUpdate),
/* harmony export */   onErrorCaptured: () => (/* reexport safe */ _runtime_helpers__WEBPACK_IMPORTED_MODULE_0__.onErrorCaptured),
/* harmony export */   onMounted: () => (/* reexport safe */ _runtime_helpers__WEBPACK_IMPORTED_MODULE_0__.onMounted),
/* harmony export */   onUnmounted: () => (/* reexport safe */ _runtime_helpers__WEBPACK_IMPORTED_MODULE_0__.onUnmounted),
/* harmony export */   onUpdated: () => (/* reexport safe */ _runtime_helpers__WEBPACK_IMPORTED_MODULE_0__.onUpdated),
/* harmony export */   parseAttributeValue: () => (/* reexport safe */ _runtime_helpers__WEBPACK_IMPORTED_MODULE_0__.parseAttributeValue),
/* harmony export */   provide: () => (/* reexport safe */ _runtime_helpers__WEBPACK_IMPORTED_MODULE_0__.provide),
/* harmony export */   proxyRefs: () => (/* reexport safe */ _runtime_helpers__WEBPACK_IMPORTED_MODULE_0__.proxyRefs),
/* harmony export */   queueJob: () => (/* reexport safe */ _runtime_helpers__WEBPACK_IMPORTED_MODULE_0__.queueJob),
/* harmony export */   reactive: () => (/* reexport safe */ _runtime_helpers__WEBPACK_IMPORTED_MODULE_0__.reactive),
/* harmony export */   readonly: () => (/* reexport safe */ _runtime_helpers__WEBPACK_IMPORTED_MODULE_0__.readonly),
/* harmony export */   ref: () => (/* reexport safe */ _runtime_helpers__WEBPACK_IMPORTED_MODULE_0__.ref),
/* harmony export */   setCurrentInstance: () => (/* reexport safe */ _runtime_helpers__WEBPACK_IMPORTED_MODULE_0__.setCurrentInstance),
/* harmony export */   shallowReactive: () => (/* reexport safe */ _runtime_helpers__WEBPACK_IMPORTED_MODULE_0__.shallowReactive),
/* harmony export */   shallowReadonly: () => (/* reexport safe */ _runtime_helpers__WEBPACK_IMPORTED_MODULE_0__.shallowReadonly),
/* harmony export */   shallowRef: () => (/* reexport safe */ _runtime_helpers__WEBPACK_IMPORTED_MODULE_0__.shallowRef),
/* harmony export */   shallowSignal: () => (/* reexport safe */ _runtime_helpers__WEBPACK_IMPORTED_MODULE_0__.shallowSignal),
/* harmony export */   signal: () => (/* reexport safe */ _runtime_helpers__WEBPACK_IMPORTED_MODULE_0__.signal),
/* harmony export */   stagger: () => (/* reexport safe */ _runtime_helpers__WEBPACK_IMPORTED_MODULE_0__.stagger),
/* harmony export */   t: () => (/* reexport safe */ _runtime_helpers__WEBPACK_IMPORTED_MODULE_0__.t),
/* harmony export */   targetMap: () => (/* reexport safe */ _runtime_helpers__WEBPACK_IMPORTED_MODULE_0__.targetMap),
/* harmony export */   toRaw: () => (/* reexport safe */ _runtime_helpers__WEBPACK_IMPORTED_MODULE_0__.toRaw),
/* harmony export */   toRef: () => (/* reexport safe */ _runtime_helpers__WEBPACK_IMPORTED_MODULE_0__.toRef),
/* harmony export */   toRefs: () => (/* reexport safe */ _runtime_helpers__WEBPACK_IMPORTED_MODULE_0__.toRefs),
/* harmony export */   track: () => (/* reexport safe */ _runtime_helpers__WEBPACK_IMPORTED_MODULE_0__.track),
/* harmony export */   trackEffects: () => (/* reexport safe */ _runtime_helpers__WEBPACK_IMPORTED_MODULE_0__.trackEffects),
/* harmony export */   traverse: () => (/* reexport safe */ _runtime_helpers__WEBPACK_IMPORTED_MODULE_0__.traverse),
/* harmony export */   trigger: () => (/* reexport safe */ _runtime_helpers__WEBPACK_IMPORTED_MODULE_0__.trigger),
/* harmony export */   triggerEffects: () => (/* reexport safe */ _runtime_helpers__WEBPACK_IMPORTED_MODULE_0__.triggerEffects),
/* harmony export */   unref: () => (/* reexport safe */ _runtime_helpers__WEBPACK_IMPORTED_MODULE_0__.unref),
/* harmony export */   useAnimate: () => (/* reexport safe */ _runtime_helpers__WEBPACK_IMPORTED_MODULE_0__.useAnimate),
/* harmony export */   useAsyncState: () => (/* reexport safe */ _runtime_helpers__WEBPACK_IMPORTED_MODULE_0__.useAsyncState),
/* harmony export */   useBattery: () => (/* reexport safe */ _runtime_helpers__WEBPACK_IMPORTED_MODULE_0__.useBattery),
/* harmony export */   useCarousel: () => (/* reexport safe */ _runtime_helpers__WEBPACK_IMPORTED_MODULE_0__.useCarousel),
/* harmony export */   useClipboard: () => (/* reexport safe */ _runtime_helpers__WEBPACK_IMPORTED_MODULE_0__.useClipboard),
/* harmony export */   useCssVar: () => (/* reexport safe */ _runtime_helpers__WEBPACK_IMPORTED_MODULE_0__.useCssVar),
/* harmony export */   useDebounce: () => (/* reexport safe */ _runtime_helpers__WEBPACK_IMPORTED_MODULE_0__.useDebounce),
/* harmony export */   useDocumentVisibility: () => (/* reexport safe */ _runtime_helpers__WEBPACK_IMPORTED_MODULE_0__.useDocumentVisibility),
/* harmony export */   useDraggable: () => (/* reexport safe */ _runtime_helpers__WEBPACK_IMPORTED_MODULE_0__.useDraggable),
/* harmony export */   useDropZone: () => (/* reexport safe */ _runtime_helpers__WEBPACK_IMPORTED_MODULE_0__.useDropZone),
/* harmony export */   useElementSize: () => (/* reexport safe */ _runtime_helpers__WEBPACK_IMPORTED_MODULE_0__.useElementSize),
/* harmony export */   useEventListener: () => (/* reexport safe */ _runtime_helpers__WEBPACK_IMPORTED_MODULE_0__.useEventListener),
/* harmony export */   useFavicon: () => (/* reexport safe */ _runtime_helpers__WEBPACK_IMPORTED_MODULE_0__.useFavicon),
/* harmony export */   useFetch: () => (/* reexport safe */ _runtime_helpers__WEBPACK_IMPORTED_MODULE_0__.useFetch),
/* harmony export */   useFocus: () => (/* reexport safe */ _runtime_helpers__WEBPACK_IMPORTED_MODULE_0__.useFocus),
/* harmony export */   useFps: () => (/* reexport safe */ _runtime_helpers__WEBPACK_IMPORTED_MODULE_0__.useFps),
/* harmony export */   useFrame: () => (/* reexport safe */ _runtime_helpers__WEBPACK_IMPORTED_MODULE_0__.useFrame),
/* harmony export */   useFullscreen: () => (/* reexport safe */ _runtime_helpers__WEBPACK_IMPORTED_MODULE_0__.useFullscreen),
/* harmony export */   useGeolocation: () => (/* reexport safe */ _runtime_helpers__WEBPACK_IMPORTED_MODULE_0__.useGeolocation),
/* harmony export */   useHover: () => (/* reexport safe */ _runtime_helpers__WEBPACK_IMPORTED_MODULE_0__.useHover),
/* harmony export */   useId: () => (/* reexport safe */ _runtime_helpers__WEBPACK_IMPORTED_MODULE_0__.useId),
/* harmony export */   useIdle: () => (/* reexport safe */ _runtime_helpers__WEBPACK_IMPORTED_MODULE_0__.useIdle),
/* harmony export */   useIntersectionObserver: () => (/* reexport safe */ _runtime_helpers__WEBPACK_IMPORTED_MODULE_0__.useIntersectionObserver),
/* harmony export */   useInterval: () => (/* reexport safe */ _runtime_helpers__WEBPACK_IMPORTED_MODULE_0__.useInterval),
/* harmony export */   useKeyModifier: () => (/* reexport safe */ _runtime_helpers__WEBPACK_IMPORTED_MODULE_0__.useKeyModifier),
/* harmony export */   useLocalStorage: () => (/* reexport safe */ _runtime_helpers__WEBPACK_IMPORTED_MODULE_0__.useLocalStorage),
/* harmony export */   useMediaQuery: () => (/* reexport safe */ _runtime_helpers__WEBPACK_IMPORTED_MODULE_0__.useMediaQuery),
/* harmony export */   useMemory: () => (/* reexport safe */ _runtime_helpers__WEBPACK_IMPORTED_MODULE_0__.useMemory),
/* harmony export */   useMotion: () => (/* reexport safe */ _runtime_helpers__WEBPACK_IMPORTED_MODULE_0__.useMotion),
/* harmony export */   useMouse: () => (/* reexport safe */ _runtime_helpers__WEBPACK_IMPORTED_MODULE_0__.useMouse),
/* harmony export */   useMutationObserver: () => (/* reexport safe */ _runtime_helpers__WEBPACK_IMPORTED_MODULE_0__.useMutationObserver),
/* harmony export */   useNetwork: () => (/* reexport safe */ _runtime_helpers__WEBPACK_IMPORTED_MODULE_0__.useNetwork),
/* harmony export */   useOnClickOutside: () => (/* reexport safe */ _runtime_helpers__WEBPACK_IMPORTED_MODULE_0__.useOnClickOutside),
/* harmony export */   useOnline: () => (/* reexport safe */ _runtime_helpers__WEBPACK_IMPORTED_MODULE_0__.useOnline),
/* harmony export */   useParallax: () => (/* reexport safe */ _runtime_helpers__WEBPACK_IMPORTED_MODULE_0__.useParallax),
/* harmony export */   usePreferredDark: () => (/* reexport safe */ _runtime_helpers__WEBPACK_IMPORTED_MODULE_0__.usePreferredDark),
/* harmony export */   useReducer: () => (/* reexport safe */ _runtime_helpers__WEBPACK_IMPORTED_MODULE_0__.useReducer),
/* harmony export */   useRoute: () => (/* reexport safe */ _runtime_helpers__WEBPACK_IMPORTED_MODULE_0__.useRoute),
/* harmony export */   useRouter: () => (/* reexport safe */ _runtime_helpers__WEBPACK_IMPORTED_MODULE_0__.useRouter),
/* harmony export */   useScriptTag: () => (/* reexport safe */ _runtime_helpers__WEBPACK_IMPORTED_MODULE_0__.useScriptTag),
/* harmony export */   useScroll: () => (/* reexport safe */ _runtime_helpers__WEBPACK_IMPORTED_MODULE_0__.useScroll),
/* harmony export */   useShare: () => (/* reexport safe */ _runtime_helpers__WEBPACK_IMPORTED_MODULE_0__.useShare),
/* harmony export */   useSound: () => (/* reexport safe */ _runtime_helpers__WEBPACK_IMPORTED_MODULE_0__.useSound),
/* harmony export */   useSpeechRecognition: () => (/* reexport safe */ _runtime_helpers__WEBPACK_IMPORTED_MODULE_0__.useSpeechRecognition),
/* harmony export */   useSpring: () => (/* reexport safe */ _runtime_helpers__WEBPACK_IMPORTED_MODULE_0__.useSpring),
/* harmony export */   useStore: () => (/* reexport safe */ _runtime_helpers__WEBPACK_IMPORTED_MODULE_0__.useStore),
/* harmony export */   useSwipe: () => (/* reexport safe */ _runtime_helpers__WEBPACK_IMPORTED_MODULE_0__.useSwipe),
/* harmony export */   useThrottle: () => (/* reexport safe */ _runtime_helpers__WEBPACK_IMPORTED_MODULE_0__.useThrottle),
/* harmony export */   useTimeout: () => (/* reexport safe */ _runtime_helpers__WEBPACK_IMPORTED_MODULE_0__.useTimeout),
/* harmony export */   useTitle: () => (/* reexport safe */ _runtime_helpers__WEBPACK_IMPORTED_MODULE_0__.useTitle),
/* harmony export */   useToggle: () => (/* reexport safe */ _runtime_helpers__WEBPACK_IMPORTED_MODULE_0__.useToggle),
/* harmony export */   useTransition: () => (/* reexport safe */ _runtime_helpers__WEBPACK_IMPORTED_MODULE_0__.useTransition),
/* harmony export */   useTween: () => (/* reexport safe */ _runtime_helpers__WEBPACK_IMPORTED_MODULE_0__.useTween),
/* harmony export */   useVirtualList: () => (/* reexport safe */ _runtime_helpers__WEBPACK_IMPORTED_MODULE_0__.useVirtualList),
/* harmony export */   useWakeLock: () => (/* reexport safe */ _runtime_helpers__WEBPACK_IMPORTED_MODULE_0__.useWakeLock),
/* harmony export */   useWebP: () => (/* reexport safe */ _runtime_helpers__WEBPACK_IMPORTED_MODULE_0__.useWebP),
/* harmony export */   useWindowSize: () => (/* reexport safe */ _runtime_helpers__WEBPACK_IMPORTED_MODULE_0__.useWindowSize),
/* harmony export */   warn: () => (/* reexport safe */ _runtime_helpers__WEBPACK_IMPORTED_MODULE_0__.warn),
/* harmony export */   watch: () => (/* reexport safe */ _runtime_helpers__WEBPACK_IMPORTED_MODULE_0__.watch),
/* harmony export */   watchEffect: () => (/* reexport safe */ _runtime_helpers__WEBPACK_IMPORTED_MODULE_0__.watchEffect)
/* harmony export */ });
/* harmony import */ var _runtime_helpers__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./runtime-helpers */ "./src/runtime-helpers.ts");
/**
 * Can Framework - Core Entry Point
 * This file aggregates the public API for the standard library build.
 */



// Export version or other metadata if needed
var VERSION = '0.0.1';

// If you have a router module, export it as well:
// export * from './router/index';
})();

/******/ 	return __webpack_exports__;
/******/ })()
;
});
//# sourceMappingURL=can.js.map