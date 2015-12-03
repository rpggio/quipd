Template.quipEdit.viewmodel({
    mixin: 'focusable'
    , newText: ''
    , addQuip: function() {
        var quip = {
            text: this.newText()
        };
        Quips.insert(quip);
        this.newText('');
    }
});
