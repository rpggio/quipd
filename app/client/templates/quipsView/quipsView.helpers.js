
Template.quipsView.helpers({
  greetingMode: function() {
    return clientController.greetingMode();
  },
  quips: function() {
    return Quips.find(
      { parentId: quipsController.parentId() || null }, 
      { sort: { order: 1 } }
    );
  },
  areMoreQuips: function() {
    return quipsController.areMoreQuips();
  },
  isActive: function(id) {
    return id === scrollList.activeElementId();
  },
  areEditing: function(id) {
    return quipsController.areEditing()
      && id === scrollList.activeElementId();
  },
  hasTags: function() {
    return this.tags && this.tags.length;
  },
  searchPattern: function() {
    var tagSearch = quipsController.tagSearch();
    var result = [
      tagSearch ? '#' + tagSearch : null, 
      quipsController.searchPattern()]
      .join(' ')
      .trim();
    return result.length ? result : null;
  },
  quipsCount: function(){
    return quipsController.quipsCount;
  },
  helpOverlay: function() {
    return quipsController.helpOverlay();
  },
  parent: function() {
    return quipsController.parent();
  }
});
