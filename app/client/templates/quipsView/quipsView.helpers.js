
Template.quipsView.helpers({
  quips: function() {
    return Quips.find({}, {
      sort: {
        createdAt: 1
      }
    });
  },
  areMoreQuips: function() {
    return Template.quipsView.areMoreQuips();
  },
  isActive: function(id) {
    return id === ScrollList.activeElementId();
  },
  areEditing: function(id) {
    return Template.quipsView.areEditing()
      && id === ScrollList.activeElementId();
  }
});
