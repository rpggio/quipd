/// <reference path="../../typings/app.ts" />

Template['quipStream'].viewmodel(function(data) {
    return {
        mixin: 'focus'
        , quipId: null

        , onCreated: function() {
            this.quipId(Router.current().params.quipId);
        }

        , onRendered: function() {
            this.quipEditRef.focused(true);
        }

        , autorun: function() {
            this.quipId.depend();
            this.quipEditRef.focused(true);
        }
        
        , parentId: function() {
            var thisQuip = this.thisQuip();
            return thisQuip && thisQuip.parentId;
        }

        , parentQuip: function() {
            return Quips.findOne(this.parentId());
        }

        , thisQuip: function() {
            var quipId = this.quipId();
            return quipId && Quips.findOne(quipId);
        } 

        , childQuips: function() {
            return Quips.find({ parentId: this.quipId() });
        }

        , onEscape: function() {
            var parentId = this.parentId();
            if(this.quipId() != parentId){
                Router.go('quips', { quipId: parentId });
                this.quipId(parentId);
            }
        }
    };
});
