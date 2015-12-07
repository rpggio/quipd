Template.quipEdit.viewmodel({
    newText: ''
    , focused: false
    , addQuip: function() {
        var quip = {
            parentId: this.parent().quipId && this.parent().quipId()
            , text: this.newText()
        };
        Quips.insert(quip);
        this.newText('');
    }
});
