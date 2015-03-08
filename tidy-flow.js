/****************************************
    
    TidyFlow
        - javascript Flow library

    var flow = new TidyFlow(...args);
    flow.then(callback1)
        .passive(callback2)
        .delay(1000) // ~ ms delay
        .end(resultCallback)
        .pause()
        .play()
        .stop()

*****************************************/

;(function (exports) {
    'use strict';

    var Flow = exports.TidyFlow = function () {
        this.init.apply(this, Array.prototype.slice.call(arguments, 0));
    };
    Flow.prototype = {
        init: function () {
            this.funcList = [];
            this.isStop = true;
            this.initArgs = [null].concat(Array.prototype.slice.call(arguments, 0));
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
            var self = this;
            this.funcList.push(function (next) {
                var args = Array.prototype.slice.call(arguments, 1);
                self.delayTimeId = window.setTimeout(function () {
                    next.apply(null, args);
                }, time);
            });
            return this;
        },
        then: function (callback) {
            this.funcList.push(function (next) {
                var args = Array.prototype.slice.call(arguments, 0);
                callback.apply(null, args);
            });
            return this;
        },
        end: function (callback) {
            this.callback = callback || this.callback || function(){};
            return this.play();
        },
        play: function () {
            this.isStop = false;
            this.connect.apply(this, this.initArgs);
            return this;
        },
        pause: function () {
            window.clearTimeout(this.delayTimeId);
            this.isStop = true;
            return this;
        },
        stop: function () {
            this.pause();

            this.funcList = [];
            this.initArgs = [];
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
            if (!this.isStop) {
                if (err) {
                    this.callback(err);
                } else {
                    var args = Array.prototype.slice.call(arguments, 1);
                    this.process.apply(this, args);
                }
            } else {
                this.initArgs = Array.prototype.slice.call(arguments, 0);
            }
        }
    };
})((function (){
    // Make a Node module, if possible.
    if (typeof exports === 'object') {
        return exports;
    } else {
        return this;
    }
})());