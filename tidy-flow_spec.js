/*jshint loopfunc: true
*/
/* global describe: true, beforeEach, it
*/

describe("tidy-flow.js", function () {
    describe('flow passive(sync)', function () {
        it('should flow process 1, 2, 3', function () {
            
            var result = [];
            var flow = new TidyFlow();
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
            var flow = new TidyFlow();
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

    describe('flow then(async)', function () {
        it('should flow process 1, 2, 3', function (done) {
            
            var result = [];
            var flow = new TidyFlow();
            flow.then(function (next) {
                window.setTimeout(function () {
                    result.push(1);
                    next();
                }, 200);
            }).then(function (next, arg) {
                window.setTimeout(function () {
                    result.push(2);
                    next();
                }, 200);
            }).then(function (next, arg) {
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
            var flow = new TidyFlow(0);
            flow.then(function (next, arg) {
                arg += 1;
                result.push(arg);
                window.setTimeout(function () {
                    next(null, arg);
                }, 200);
            }).then(function (next, arg) {
                arg += 1;
                result.push(arg);
                window.setTimeout(function () {
                    next(null, arg);
                }, 200);
            }).then(function (next, arg) {
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

            var flow = new TidyFlow();
            flow.delay(1000).passive(function (next) {
                timerCallback();
            }).end(function (err, arg) {
                done();
            });

            jasmine.clock().tick(1001);
            expect(timerCallback).toHaveBeenCalled();
        }, 1100);
    });

    describe('flow control', function () {
        var timerCallback1,
            timerCallback2,
            timerCallback3;

        beforeEach(function() {
            
            timerCallback1 = jasmine.createSpy("timerCallback1");
            timerCallback2 = jasmine.createSpy("timerCallback2");
            timerCallback3 = jasmine.createSpy("timerCallback3");

            jasmine.clock().install();
        });


        it('should pause after 1s', function (done) {
            
            expect(timerCallback1).not.toHaveBeenCalled();

            var flow = new TidyFlow();
            flow.delay(1000)
                .passive(function (next) {
                    timerCallback1();
                })
                .pause()
                .passive(function (next) {
                    timerCallback2();
                })
                .end(function (err, arg) {
                    done();
                });

            jasmine.clock().tick(1001);
            expect(timerCallback1).toHaveBeenCalled();
            expect(timerCallback2).not.toHaveBeenCalled();
        }, 2100);

        it('should replay after pause', function (done) {
            
            expect(timerCallback1).not.toHaveBeenCalled();

            var flow = new TidyFlow();
            flow.delay(1000)
                .passive(function (next) {
                    timerCallback1();
                })
                .pause()
                .passive(function (next) {
                    timerCallback2();
                })
                .end(function (err, arg) {
                    done();
                });

            window.setTimeout(function () {
                flow.play();
            }, 1000);

            jasmine.clock().tick(1001);
            expect(timerCallback1).toHaveBeenCalled();
            expect(timerCallback2).not.toHaveBeenCalled();

            jasmine.clock().tick(1001);
            expect(timerCallback2).toHaveBeenCalled();
        }, 2100);

        it('should not play after stop', function (done) {
            
            expect(timerCallback1).not.toHaveBeenCalled();

            var flow = new TidyFlow();
            flow.delay(1000)
                .passive(function (next) {
                    timerCallback1();
                })
                .passive(function (next) {
                    timerCallback2();
                })
                .end(function (err, arg) {
                    done();
                });

            flow.stop();
            window.setTimeout(function () {
                flow.play();
            }, 1000);

            jasmine.clock().tick(1001);
            expect(timerCallback1).not.toHaveBeenCalled();
            expect(timerCallback2).not.toHaveBeenCalled();

            jasmine.clock().tick(1001);
            expect(timerCallback2).not.toHaveBeenCalled();
        }, 2100);
    });
});
