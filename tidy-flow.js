(function (exports) {
    'use strict';

    // exports.Flow = function (callback) {
    //     return new Flow(callback);
    // };

    var Flow = exports.Flow = function (callback) {
        this.init(callback);
    };
    Flow.prototype = {
        init: function (callback) {
            this.funcList = [];
            if (callback) {
                this.passive(callback);    
            }
        },
        passive: function (callback) {
            this.funcList.push(function (next) {
                var args = Array.prototype.slice.call(arguments, 1);
                var result = callback.apply(null, args);
                next.apply(null, [null].concat(result));
            });
            return this;
        },
        delay: function (time) {
            this.funcList.push(function (next) {
                var args = Array.prototype.slice.call(arguments, 1);
                window.setTimeout(function () {
                    next.apply(null, args);
                }, time);
            });
            return this;
        },
        active: function (callback) {
            this.funcList.push(function (next) {
                var args = Array.prototype.slice.call(arguments, 0);
                callback.apply(null, args);
            });
            return this;
        },
        end: function (callback) {
            this.callback = callback || function(){};

            this.process.apply(this, arguments);
        },
        process: function () {
            var func = this.funcList.shift(),
                self = this,
                args = Array.prototype.slice.call(arguments, 0);

            if (func) {
                args = [function next(err/*, ...args*/) {
                    self.connect.apply(self, arguments);
                }].concat(args);
                func.apply(null, args);
            } else {
                args = [null].concat(args);
                this.callback.apply(self, args);
            }
        },
        connect: function (err) {
            if (err) {
                this.callback(err);
            } else {
                var args = Array.prototype.slice.call(arguments, 1);
                this.process.apply(this, args);
            }
        }
    };
})((function (){
    // Make userAgent a Node module, if possible.
    if (typeof exports === 'object') {
        return exports;
    } else if (typeof window === 'object') {
        return (window.tidy = typeof window.tidy === 'object' ? window.tidy : {});
    }
})());