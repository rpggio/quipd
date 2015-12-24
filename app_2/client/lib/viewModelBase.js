var ViewModelBase = (function () {
    function ViewModelBase() {
        // These will be injected by ViewModel framework. 
        delete (this.parent);
        delete (this.children);
        delete (this.data);
    }
    ViewModelBase.prototype.parent = function () { return null; };
    ;
    ViewModelBase.prototype.children = function () { return null; };
    ;
    ViewModelBase.prototype.data = function () { return null; };
    ;
    return ViewModelBase;
})();
this.ViewModelBase = ViewModelBase;
//# sourceMappingURL=viewModelBase.js.map