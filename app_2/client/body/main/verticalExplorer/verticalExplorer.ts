/// <reference path="../../../../typings/app.ts" />

Template['verticalExplorer'].viewmodel({
    mixin: 'focus'
    , quipId: 'cQjwBmhM3uXPnj8ux'
    , parentQuip: null

    , thisQuip: function() {
        var quipId = this.quipId();
        return quipId && Quips.findOne(quipId);
    } 

    , childQuips: function() {
        return Quips.find({ parentId: this.quipId() });
    }
});
