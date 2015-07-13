
Template.main.helpers({
  quips: function() {
    return Quips.find({}, {
      sort: {
        createdAt: 1
      }
    });
  },
  areMoreQuips: function() {
    return MainTemplate.areMoreQuips();
  },
  isActive: function(id) {
    return id === MainTemplate.activeElementId();
  },
  areEditing: function(id) {
    return MainTemplate.areEditing()
      && id === MainTemplate.activeElementId();
  }
});
