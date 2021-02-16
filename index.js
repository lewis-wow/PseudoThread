
(function (global, factory) {
   function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

  (typeof exports === "undefined" ? "undefined" : _typeof(exports)) === 'object' && typeof module !== 'undefined' ? module.exports = factory() : typeof define === 'function' && define.amd ? define(factory) : (global = global || self, global.ParallelThread = factory());
})(this, function () {
  "use strict";

  function isFunc(func) {
    return typeof func === 'function';
  }

  function ParallelThread(workerAnonymousFunction) {
    if (!Worker in window) throw Error("ParallelThread(...) Browser need to support Web Workers");
    if (!isFunc(workerAnonymousFunction)) throw TypeError("ParallelThread(...) first parameter must be function");

    function callWorkerInvoker(fn) {
      this.send = function (msg) {
        var isFunction = false;

        if (isFunc(msg)) {
          msg = msg.toString();
          isFunction = true;
        }

        this.postMessage({
          isFunction: isFunction,
          msg: msg
        });
      };

      this.get = function (callback) {
        this.onmessage = function (msg) {
          if (msg.data.isFunction) {
            msg.data.msg = new Function("return (".concat(msg.data.msg, ")"))(msg.data.msg);
          }

          callback(msg.data.msg, msg);
        };
      };

      for (var _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
        args[_key2 - 1] = arguments[_key2];
      }

      fn.apply(void 0, args);
    }

    for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    var blobURL = URL.createObjectURL(new Blob(["(".concat(function (callWorkerInvoker, fn) {
      for (var _len3 = arguments.length, args = new Array(_len3 > 2 ? _len3 - 2 : 0), _key3 = 2; _key3 < _len3; _key3++) {
        args[_key3 - 2] = arguments[_key3];
      }

      return callWorkerInvoker.apply(void 0, [fn].concat(args));
    }, ")(").concat(callWorkerInvoker, ", ").concat(workerAnonymousFunction, ", ").concat(args, ")")], {
      type: 'application/javascript'
    }));
    this.thread = new Worker(blobURL);
    return this;
  }

  ParallelThread.prototype.disconnect = function () {
    this.thread.terminate();
  };

  ParallelThread.prototype.send = function (msg) {
    var isFunction = false;

    if (isFunc(msg)) {
      msg = msg.toString();
      isFunction = true;
    }

    this.thread.postMessage({
      isFunction: isFunction,
      msg: msg
    });
  };

  ParallelThread.prototype.get = function (callback) {
    this.thread.onmessage = function (msg) {
      if (msg.data.isFunction) {
        msg.data.msg = new Function("return (".concat(msg.data.msg, ")"))(msg.data.msg);
      }

      callback(msg.data.msg, msg);
    };
  };

  return ParallelThread;
});
