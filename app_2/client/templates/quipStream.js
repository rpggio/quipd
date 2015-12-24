var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var QuipStream = (function (_super) {
    __extends(QuipStream, _super);
    //focus = FocusController.instance; 
    function QuipStream(context) {
        _super.call(this);
        this.focusId = null;
        this.quipId = null;
        this.autorun = [
            function () {
                console.log(this.focusId());
            },
            function () {
                console.log(this.children());
            }
        ];
        console.log('QuipStream.ctor', context);
    }
    // onCreated(){
    //     //this.quipId(Router.current().params.quipId);
    // }
    QuipStream.prototype.onRendered = function (x) {
        //this.quipEditRef.focused(true);
    };
    // autorun = [
    //     function(): void {
    //         this.quipId.depend();
    //         //this.quipEditRef.focused(true);
    //     }
    // ];
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
    QuipStream.prototype.quips = function () {
        return Quips.find({ parentId: null });
    };
    return QuipStream;
})(ViewModelBase);
// Template['quipStream'].onRendered(function (x) {
//   console.log(this, x); 
// });
Template['quipStream'].viewmodel(function (context) { return new QuipStream(context); });
//# sourceMappingURL=quipStream.js.map