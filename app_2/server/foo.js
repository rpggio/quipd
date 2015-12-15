/// <reference path="../typings/meteor/underscore.d.ts" />
function greeter(numbers) {
    var doubled = _.map(numbers, function (n) { return 2 * n; });
    console.log(doubled);
}
greeter([2, 4]);
//# sourceMappingURL=foo.js.map