var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var FocusNav = (function () {
    function FocusNav() {
    }
    FocusNav.getAdjacent = function (items, from, forward) {
        var len = items.length;
        if (len === 0) {
            return null;
        }
        if (len === 1) {
            var item_1 = items[0];
            return from === item_1
                ? null
                : item_1;
        }
        var previous;
        for (var i = 0; i < len; i++) {
            var child = items[i];
            if (forward && previous === from) {
                return child;
            }
            if (!forward && child === from) {
                return previous;
            }
            previous = child;
        }
        return null;
    };
    return FocusNav;
})();
/**
 * Implements focus navigation operations for use with contained elements.
 * Contained elements should implement Focusable and/or FocusStructure
 * to utilize navigation.
 */
var FocusContainer = (function (_super) {
    __extends(FocusContainer, _super);
    function FocusContainer() {
        _super.call(this);
        this.currentFocus = null;
    }
    FocusContainer.asFocusable = function (element) {
        return element.hasOwnProperty('isFocused')
            ? element
            : null;
        ;
    };
    FocusContainer.asFocusStructure = function (element) {
        return element.hasOwnProperty('getNextFocusable')
            ? element
            : null;
        ;
    };
    FocusContainer.prototype.init = function () {
        var _this = this;
        this.templateInstance.autorun(function () {
            if (_this.children) {
                _this.children().depend();
                if (!_this.currentFocus()) {
                    _this.focusInitial();
                }
            }
        });
    };
    FocusContainer.prototype.focusInitial = function (direction) {
        if (direction === void 0) { direction = Direction.Down; }
        console.log('focusInitial', direction);
        var initial = ViewModelHelper.findDownward(this, function (vm) {
            var focusable = FocusContainer.asFocusable(vm);
            if (focusable) {
                console.log('returning focusable', focusable);
                return focusable;
            }
            var structure = FocusContainer.asFocusStructure(vm);
            if (structure) {
                var next = structure.getNextFocusable(null, direction);
                console.log('returning focusable', next);
                return next;
            }
            return null;
        });
        if (initial) {
            this.setFocus(initial);
        }
        return;
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
    /**
     * Walk up tree to find a structure node that knows what
     * the next focusable should be. Once a focusable is found,
     * set focus to that element.
     */
    FocusContainer.prototype.changeFocus = function (direction) {
        console.log('changeFocus', Direction[direction]);
        var current = this.currentFocus();
        if (!current) {
            this.focusInitial(direction);
        }
        // Start with current as both sourceNode and decisionNode
        var sourceNode = current;
        var decisionNode = current;
        var didAscend = false;
        do {
            // Evaluate decision node
            var structure = FocusContainer.asFocusStructure(decisionNode);
            var foundTarget = void 0;
            var target = void 0;
            // Check for focusable result at this level.
            // If we did ascend previously, walk back down the tree.
            do {
                target = structure.getNextFocusable(sourceNode, direction);
                if (target) {
                    foundTarget = target;
                    structure = FocusContainer.asFocusStructure(target);
                }
            } while (didAscend && target && structure);
            if (foundTarget) {
                this.setFocus(foundTarget);
                return;
            }
            // If first cycle
            if (sourceNode == decisionNode) {
                // walk the decision node upwards
                decisionNode = sourceNode.parent();
            }
            else {
                // walk both decision and source nodes upwards
                sourceNode = decisionNode;
                decisionNode = FocusContainer.asFocusStructure(decisionNode.parent());
            }
            didAscend = true;
        } while (decisionNode && sourceNode);
    };
    FocusContainer.prototype.setFocus = function (to) {
        //console.log('setting focus', to);
        var current = this.currentFocus();
        if (current) {
            current.isFocused(false);
        }
        if (to) {
            to.isFocused(true);
            this.currentFocus(to);
        }
    };
    return FocusContainer;
})(ViewModelBase);
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
    ViewModelHelper.findDownward = function (viewModel, selector) {
        var current = viewModel;
        var selected = selector(current);
        if (selected) {
            return selected;
        }
        var children = current.children();
        for (var i = 0, len = children.length; i < len; i++) {
            var child = children[i];
            var found = ViewModelHelper.findDownward(child, selector);
            if (found) {
                return found;
            }
        }
    };
    return ViewModelHelper;
})();
this.FocusNav = FocusNav;
this.FocusContainer = FocusContainer;
this.Direction = Direction;
//# sourceMappingURL=focusNavigation.js.map