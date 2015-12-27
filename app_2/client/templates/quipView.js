var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var QuipView = (function (_super) {
    __extends(QuipView, _super);
    function QuipView(context) {
        _super.call(this);
        this.editMode = null;
        this._id = null;
        this.parentId = null;
        this.grandParentId = null;
        this.text = null;
        this.level = null;
        this.isFocused = null;
        this.focusIndex = null;
        this.showChildren = null;
        // getQuipAtFocusIndex(focusIndex: number): Focusable{
        //     return <Focusable>_.first(
        //         this.children(c => {
        //             return (<any>c).focusIndex() == focusIndex;
        //         }));
        // }
        // textareaSetup() {
        //     var thisTemplateSel = $(this.templateInstance.firstNode);
        //     // prevent carriage return within textarea bleh      
        //     thisTemplateSel.children('textarea.textContent')
        //         .keydown(function(e) {
        //             if (e.keyCode == 13 && !e.shiftKey) {
        //                 e.preventDefault();
        //                 return false;
        //             }
        //         });
        //     var textarea: any = thisTemplateSel.children('textarea');
        //     textarea.autosize();
        // }
        this.autorun = [
            function () {
                this.level(this.parent().level + 1);
            },
        ];
        var self = this;
        self.showChildren = true;
    }
    QuipView.prototype.onCreated = function () {
    };
    QuipView.prototype.onRendered = function () {
    };
    QuipView.prototype.childQuips = function () {
        var id = this._id();
        return Quips.find({ parentId: id });
        // var id = this._id();
        // if(id && this.level() < 10){
        //     var quips = Quips.find({parentId: id}).fetch();
        //     let focusIndex = 0;
        //     quips.forEach(q => (<any>q).focusIndex = focusIndex++);
        //     return quips;
        // }
    };
    QuipView.prototype.getFirstFocusable = function () {
        return _.first(this.children());
    };
    ;
    QuipView.prototype.getNextFocusable = function (current, direction) {
        if (!this.showChildren()) {
            return null;
        }
        if (current == this) {
            switch (direction) {
                case Direction.Down:
                    return _.first(this.children());
                //return this.getQuipAtFocusIndex(0);
                default: return null;
            }
        }
        if (current.parentId() != this._id()) {
            // not under this quip
            return null;
        }
        var focusIndex = current.focusIndex();
        var increment;
        switch (direction) {
            case Direction.Up:
                return FocusNav.getAdjacent(this.children('quipView'), current, false);
            // return focusIndex == 0
            //     ? this
            //     : this.getQuipAtFocusIndex(current.focusIndex() - 1);
            case Direction.Down:
                return FocusNav.getAdjacent(this.children('quipView'), current, true);
            //return this.getQuipAtFocusIndex(current.focusIndex() + 1);
            default: return null;
        }
    };
    return QuipView;
})(ViewModelBase);
Template['quipView'].viewmodel(function (context) {
    return new QuipView(context);
});
//# sourceMappingURL=quipView.js.map