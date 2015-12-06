/// <reference path="../typings/meteor-basic.d.ts" />

function greeter(numbers: number[]) {
    var doubled = _.map(numbers, n => 2 * n);
    console.log(doubled);
}

greeter([2, 4]);

