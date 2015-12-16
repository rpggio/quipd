var FocusContainer = (function () {
    function FocusContainer() {
        this.currentFocus = null;
    }
    FocusContainer.IsFocusStructure = function (obj) {
        return obj.hasOwnProperty('getNextFocusable');
    };
    FocusContainer.prototype.currentFocus_get = function () {
        return this.currentFocus();
    };
    FocusContainer.prototype.currentFocus_set = function (value) {
        this.currentFocus(value);
    };
    FocusContainer.prototype.init = function () {
        this.focusTop();
    };
    FocusContainer.prototype.focusTop = function () {
        var _this = this;
        var self = this;
        ViewModelHelper.find(self, function (vm) {
            if (FocusContainer.IsFocusStructure(vm)) {
                var structure = vm;
                var focusable = structure.getFirstFocusable();
                if (focusable) {
                    _this.currentFocus_set(focusable);
                    return true;
                }
            }
        });
    };
    FocusContainer.prototype.focusUp = function () {
        this.changeFocus(Direction.Up);
    };
    FocusContainer.prototype.focusDown = function () {
        this.changeFocus(Direction.Down);
    };
    FocusContainer.prototype.focusLeft = function () {
        this.changeFocus(Direction.Left);
    };
    FocusContainer.prototype.focusRight = function () {
        this.changeFocus(Direction.Right);
    };
    FocusContainer.prototype.changeFocus = function (direction) {
        var current = this.currentFocus_get();
        if (!current) {
            return;
        }
        var structure = this.findFocusStructure(current);
        if (structure) {
            var focusTo = structure.getNextFocusable(current, direction);
            if (focusTo) {
                current.isFocused(false);
                focusTo.isFocused(true);
                this.currentFocus(focusTo);
            }
        }
    };
    FocusContainer.prototype.findFocusStructure = function (start) {
        var current = start;
        while (current && !FocusContainer.IsFocusStructure(current)) {
            current = current.parent();
        }
        return current;
    };
    return FocusContainer;
})();
var Direction;
(function (Direction) {
    Direction[Direction["Up"] = 0] = "Up";
    Direction[Direction["Right"] = 1] = "Right";
    Direction[Direction["Down"] = 2] = "Down";
    Direction[Direction["Left"] = 3] = "Left";
})(Direction || (Direction = {}));
;
var ViewModelHelper = (function () {
    function ViewModelHelper() {
    }
    ViewModelHelper.find = function (viewModel, criteria) {
        var current = viewModel;
        if (criteria(current)) {
            return current;
        }
        var children = current.children();
        for (var i = 0, len = children.length; i < len; i++) {
            var child = children[i];
            var found = ViewModelHelper.find(child, criteria);
            if (found) {
                return found;
            }
        }
    };
    return ViewModelHelper;
})();
this.FocusContainer = FocusContainer;
ViewModel.mixin({ FocusContainer: new FocusContainer() });
//# sourceMappingURL=focusNavigation.js.map