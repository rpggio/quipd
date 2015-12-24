var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var QuipView = (function (_super) {
    __extends(QuipView, _super);
    //context:any;
    // _id = ViewModel.makeReactiveProperty<string>(null);
    // text = ViewModel.makeReactiveProperty<string>(null);
    //focus: FocusController; 
    function QuipView(context) {
        _super.call(this);
        this.editMode = null;
        this._id = null;
        this.parentId = null;
        this.grandParentId = null;
        this.text = null;
        this.level = null;
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
        this['_id'] = context._id;
        this['parentId'] = context.parentId;
        //this.context = context;
        // var helpers = {};
        // for (var prop in this) {
        //     helpers[prop] = function() {
        //         return this[prop];
        //     }
        // }
        // Template["quipView"].helpers(helpers);
    }
    QuipView.prototype.onCreated = function () {
        // this._id(this.context._id);
        // this.parentId(this.context.parentId);
        //this.focus = FocusController.instance;
    };
    QuipView.prototype.childQuips = function () {
        var id = this._id();
        if (id && this.level() < 10) {
            return Quips.find({ parentId: id });
        }
    };
    QuipView.prototype.onRendered = function () {
        console.log('rendered', this);
        //this.textareaSetup();
    };
    return QuipView;
})(ViewModelBase);
Template['quipView'].viewmodel(function (context) {
    return new QuipView(context);
});
//# sourceMappingURL=quipView.js.map