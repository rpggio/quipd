
Template.main.helpers({
  quips: function() {
    return Quips.find({}, {
      sort: {
        createdAt: 1
      }
    });
  },
  areMoreQuips: function() {
    return QuipdClient.areMoreQuips();
  },
  isSelected: function() {
    return this.index === Session.get("activeIndex");
  },
  areEditing: function() {
    return this._id == Session.get("editingQuipId");
  }
});
