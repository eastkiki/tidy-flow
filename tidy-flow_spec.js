/*jshint loopfunc: true
*/
/* global describe: true, beforeEach, it
*/

describe("tidy-flow.js", function () {
    describe('flow passive(sync)', function () {
        it('should flow process 1, 2, 3', function () {
            
            var result = [];
            var flow = new tidy.Flow();
            flow.passive(function () {
                result.push(1);
            }).passive(function () {
                result.push(2);
            }).passive(function () {
                result.push(3);
            }).end(function () {
                expect(result[0]).toBe(1);
                expect(result[1]).toBe(2);
                expect(result[2]).toBe(3);
            });
        });


        it('should flow process with arguments', function () {
            
            var result = [];
            var flow = new tidy.Flow();
            flow.passive(function () {
                var arg = 1;
                result.push(arg);
                return arg;
            }).passive(function (arg) {
                arg += 1;
                result.push(arg);
                return arg;
            }).passive(function (arg) {
                arg += 1;
                result.push(arg);
                return arg;
            }).end(function (err, arg) {
                expect(result[0]).toBe(1);
                expect(result[1]).toBe(2);
                expect(result[2]).toBe(3);

                expect(arg).toBe(3);
            });
        });
    });

    describe('flow active(async)', function () {
        it('should flow process 1, 2, 3', function (done) {
            
            var result = [];
            var flow = new tidy.Flow();
            flow.active(function (next) {
                window.setTimeout(function () {
                    result.push(1);
                    next();
                }, 200);
            }).active(function (next, arg) {
                window.setTimeout(function () {
                    result.push(2);
                    next();
                }, 200);
            }).active(function (next, arg) {
                window.setTimeout(function () {
                    result.push(3);
                    next();
                }, 200);
            }).end(function (err, arg) {
                expect(result[0]).toBe(1);
                expect(result[1]).toBe(2);
                expect(result[2]).toBe(3);

                done();
            });
        }, 1000);
        it('should flow process with arguments', function (done) {
            
            var result = [];
            var flow = new tidy.Flow();
            flow.active(function (next) {
                var arg = 1;
                result.push(arg);
                window.setTimeout(function () {
                    next(null, arg);
                }, 200);
            }).active(function (next, arg) {
                arg += 1;
                result.push(arg);
                window.setTimeout(function () {
                    next(null, arg);
                }, 200);
            }).active(function (next, arg) {
                arg += 1;
                result.push(arg);
                window.setTimeout(function () {
                    next(null, arg);
                }, 200);
            }).end(function (err, arg) {
                expect(result[0]).toBe(1);
                expect(result[1]).toBe(2);
                expect(result[2]).toBe(3);

                expect(arg).toBe(3);

                done();
            });
        }, 1000);
    });

    describe('flow delay', function () {
        var timerCallback;
        beforeEach(function() {
            timerCallback = jasmine.createSpy("timerCallback");
            jasmine.clock().install();
        });


        it('should process timerCallback after 1s', function (done) {
            
            expect(timerCallback).not.toHaveBeenCalled();

            var flow = new tidy.Flow();
            flow.delay(1000).passive(function (next) {
                timerCallback();
            }).end(function (err, arg) {
                done();
            });

            jasmine.clock().tick(1001);
            expect(timerCallback).toHaveBeenCalled();
        }, 1100);
    });
});
