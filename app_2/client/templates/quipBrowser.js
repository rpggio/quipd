var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var QuipBrowser = (function (_super) {
    __extends(QuipBrowser, _super);
    function QuipBrowser(context) {
        _super.call(this);
        this.pageQuipId = null;
    }
    QuipBrowser.prototype.onCreated = function () {
        this.pageQuipId(Router.current().params.quipId);
    };
    QuipBrowser.prototype.onRendered = function () {
        var _this = this;
        // initialize focus navigation
        this.init();
        // catch navigation events at document level
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
    // thisQuip() : QuipData {
    //     var quipId = this.quipId.get();
    //     return quipId && Quips.findOne(quipId);
    // } 
    QuipBrowser.prototype.quip = function () {
        return Quips.findOne(this.pageQuipId());
    };
    QuipBrowser.prototype.quips = function () {
        return Quips.find({ parentId: null });
    };
    return QuipBrowser;
})(FocusContainer);
Template['quipBrowser'].viewmodel(function (context) { return new QuipBrowser(context); });
//# sourceMappingURL=quipBrowser.js.map