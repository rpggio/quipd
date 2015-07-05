
  Template.main.events({
    'click #showMore': function() {
      showMore();
    },
    'submit #new-quip': function(event) {
      var text = event.target['new-quip-text'].value;
      Meteor.call("addQuip", text);
      event.target['new-quip-text'].value = "";
      QuipdClient.updateScroll();
      return false;
    },
    'click #resetQuips': function() {
      Meteor.call('resetQuips');
      delayedUpdateScroll();
    },
    'click #seedQuips': function() {
      Meteor.call('seedQuips');
      delayedUpdateScroll();
    },
    'click #load-more': function() {
      showMore();
    },
    'submit #update-quip': function(event) {
      var text = event.target['update-quip-text'].value;
      console.log({submit_update_quip: text});
      Meteor.call("updateQuip", this._id, text);
      Session.set("editingQuipId", null);
      return false;
    },
    'click .quip': function(event) {
      // console.log({clicked: this.text});
      // console.log([this._id, Session.get("activeQuipId")]);
      if(this._id == Session.get("activeQuipId")){
        Session.set("editingQuipId", this._id);
      }
    }
  });