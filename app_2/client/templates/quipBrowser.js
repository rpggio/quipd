var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var QuipBrowser = (function (_super) {
    __extends(QuipBrowser, _super);
    //focus = FocusController.instance; 
    function QuipBrowser(context) {
        _super.call(this);
        this.focusId = null;
        this.quipId = null;
        // NOT WORKING
        this.autorun = [
            function () {
                console.log(this.focusId());
            },
            function () {
                console.log(this.quipId());
            }
        ];
    }
    QuipBrowser.prototype.onCreated = function () {
        this.quipId(Router.current().params.quipId);
    };
    QuipBrowser.prototype.onRendered = function () {
        var _this = this;
        // initialize focus navigation
        this.init();
        //$(this.templateInstance.view).focus();
        //this.quipEditRef.focused(true);
        $(document).keydown(function (e) {
            switch (e.which) {
                case KeyCodes.ArrowDown:
                    _this.focusDown();
                    return false;
                case KeyCodes.ArrowUp:
                    _this.focusUp();
                    return false;
            }
            return true;
        });
    };
    // focusDown(){
    //     console.log('focusDown', this);
    //     //var focusId = this.focus.focusId();
    //     var focusId = this.focusId.get();
    //     if(!focusId){
    //         return;
    //     }
    //     var focused = Quips.findOne(focusId);
    //     if(focused){
    //         console.log('focused', focused);
    //     }
    // }
    // parentId() {
    //     var thisQuip = this.thisQuip();
    //     return thisQuip && thisQuip.parentId;
    // }
    // parentQuip() {
    //     return Quips.findOne(this.parentId());
    // }
    // thisQuip() : QuipData {
    //     var quipId = this.quipId.get();
    //     return quipId && Quips.findOne(quipId);
    // } 
    QuipBrowser.prototype.quip = function () {
        console.log('browser.quipId', this.quipId());
        return Quips.findOne(this.quipId());
    };
    return QuipBrowser;
})(FocusContainer);
// Template['quipStream'].onRendered(function (x) {
//   console.log(this, x); 
// });
Template['quipBrowser'].viewmodel(function (context) { return new QuipBrowser(context); });
//# sourceMappingURL=quipBrowser.js.map