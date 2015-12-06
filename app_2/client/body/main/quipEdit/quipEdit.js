Template.quipEdit.viewmodel({
    newText: ''
    , focused: false
    , addQuip: function() {
        var quip = {
            text: this.newText()
        };
        Quips.insert(quip);
        this.newText('');
    }
});
