var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var QuipStream = (function (_super) {
    __extends(QuipStream, _super);
    function QuipStream() {
        _super.apply(this, arguments);
        this.mixin = 'focus';
        this.quipId = null;
    }
    QuipStream.prototype.onCreated = function () {
        this.quipId(Router.current().params.quipId);
        _super.prototype.init.call(this);
    };
    QuipStream.prototype.onRendered = function () {
        //this.quipEditRef.focused(true);
    };
    QuipStream.prototype.autorun = function () {
        this.quipId.depend();
        //this.quipEditRef.focused(true);
    };
    QuipStream.prototype.parentId = function () {
        var thisQuip = this.thisQuip();
        return thisQuip && thisQuip.parentId;
    };
    QuipStream.prototype.parentQuip = function () {
        return Quips.findOne(this.parentId());
    };
    QuipStream.prototype.thisQuip = function () {
        var quipId = this.quipId();
        return quipId && Quips.findOne(quipId);
    };
    QuipStream.prototype.childQuips = function () {
        return Quips.find({ parentId: this.quipId() });
    };
    QuipStream.prototype.onShiftTab = function () {
        var parentId = this.parentId();
        if (this.quipId() != parentId) {
            Router.go('quips', { quipId: parentId });
            this.quipId(parentId);
        }
    };
    return QuipStream;
})(FocusContainer);
Template['quipStream'].viewmodel(new QuipStream());
//# sourceMappingURL=quipStream.js.map