/// <reference path="../typings/meteor/underscore.d.ts" />

interface NutBall {
    n: number;
}

function greeter(numbers: number[]) {
    var doubled = _.map(numbers, n => 2 * n);
    console.log(doubled);
}

greeter([2, 4]);

function logg(a, b): any{
        console.log('logg', a, b);
}

class NutBurger {
    @logg
    eat(){
        console.log('eat');        
    }
}

var b = new NutBurger();
b.eat();
