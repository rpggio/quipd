Template.quips.viewmodel({
    mixin: 'focus'

    , quips: function() {
        var quips = Quips.find();
        return quips;
    }
    
    , onCreated: function() {
        this.lastQuipIndex = 0;        
    }
});
