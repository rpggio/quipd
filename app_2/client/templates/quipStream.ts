/// <reference path="../../typings/app.ts" />

Template['quipStream'].viewmodel(function(data) {
    return {
        mixin: 'focus'
        , quipId: null
        , parentQuip: null

        , onCreated: function() {
            this.quipId(Router.current().params.quipId);
        }

        , thisQuip: function() {
            var quipId = this.quipId();
            return quipId && Quips.findOne(quipId);
        } 

        , childQuips: function() {
            return Quips.find({ parentId: this.quipId() });
        }
    };
});
