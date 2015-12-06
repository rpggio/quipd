/// <reference path="../typings/app.ts" />

function greeter(numbers: number[]) {
    var doubled = _.map(numbers, n => 2 * n);
    console.log(doubled);
}

greeter([2, 4]);


