var Quip = (function () {
    function Quip(data) {
        _.extend(this, data);
    }
    Quip.prototype.next = function () {
        Quips.findOne({
            parentId: this.parentId,
            _id: { $gt: this._id }
        }, { sort: { _id: 1 } });
    };
    return Quip;
})();
this.Quip = Quip;
//# sourceMappingURL=quip.js.map