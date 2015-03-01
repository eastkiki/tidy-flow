/*jshint loopfunc: true
*/
/* global describe: true, beforeEach, it
*/

describe("tidy-flow.js", function () {
    describe('flow passive', function () {
        it('should flow process 1, 2, 3, 4', function () {
            
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
                expect(result[0]).toBe(2);
                expect(result[0]).toBe(3);
            });
        });
    });
});
