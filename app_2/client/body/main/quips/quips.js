Template.quips.viewmodel({
    mixin: 'focusHandler'

    , quips: function() {
        var quips = Quips.find();
        return quips;
    }
    
    , onCreated: function() {
        this.lastQuipIndex = 0;        
    }

    , getTabIndex: function(child) {
        var quipEditRef = this.quipEditRef;
        if(child == quipEditRef) {
            return this.lastQuipIndex + 1;
        }
        else {
            this.lastQuipIndex++;
            // ensure edit box has highest index
            quipEditRef.tabIndex(this.lastQuipIndex + 1);
            return this.lastQuipIndex;
        }
    }
});
