
Template.quipView.helpers({
  isActive: function(id) {
    return id === scrollList.activeElementId();
  },
  areEditing: function(id) {
    return quipsController.areEditing()
      && id === scrollList.activeElementId();
  },
  isThreadParent: function(id) {
  	return id == quipsController.parentId();
  }
});
