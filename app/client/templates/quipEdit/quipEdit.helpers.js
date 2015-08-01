
Template.quipEdit.helpers({
  getEditText: function() {
    if(this.tags && this.tags.length){
      var innerTags = quipsController.getTags(this.text);
      var outerTags = _.difference(this.tags, innerTags);

      if(outerTags.length) {
        var parts = [ this.text + ' ' ];
        outerTags.forEach(function(tag) { 
          if(tag) {
            parts.push('#' + tag); 
          }
        });
        return parts.join(' ');
      }

    }

    return this.text;
  }
});
