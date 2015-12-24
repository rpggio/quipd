/// <reference path="../typings/meteor/underscore.d.ts" />
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
function greeter(numbers) {
    var doubled = _.map(numbers, function (n) { return 2 * n; });
    console.log(doubled);
}
greeter([2, 4]);
function logg(a, b) {
    console.log('logg', a, b);
}
var NutBurger = (function () {
    function NutBurger() {
    }
    NutBurger.prototype.eat = function () {
        console.log('eat');
    };
    __decorate([
        logg
    ], NutBurger.prototype, "eat");
    return NutBurger;
})();
var b = new NutBurger();
b.eat();
//# sourceMappingURL=foo.js.map