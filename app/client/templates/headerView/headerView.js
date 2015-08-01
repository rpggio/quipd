

Template.headerView.rendered = function() {

  $('#header-help')
      .dropdown({
        on: 'hover',
        action: 'nothing'
      });

};


Template.headerView.helpers({
  helpOverlay: function() {
    return quipsController.helpOverlay();
  }
});


Template.headerView.events({
  'click #toggle-help-overlay': function() {
    quipsController.helpOverlay(!quipsController.helpOverlay());
    return false;
  }
});

