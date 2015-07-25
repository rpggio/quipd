
Template.quipEdit.helpers({
  getEditText: function() {
    if(this.tags && this.tags.length){
      var parts = [ this.text + ' ' ];
      this.tags.forEach(function(tag) { 
        if(tag) {
          parts.push('#' + tag); 
        }
      });
      return parts.join(' ');
    }
    return this.text;
  }
});
