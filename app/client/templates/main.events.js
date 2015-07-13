
var events = {
    'click #showMore': function() {
      MainTemplate.showMore();
    },
    'submit #new-quip': function(event) {
      var text = event.target['new-quip-text'].value;
      Meteor.call("addQuip", text);
      event.target['new-quip-text'].value = "";
      MainTemplate.updateScroll();
      return false;
    },
    'click #resetQuips': function() {
      Meteor.call('resetQuips');
    },
    'click #seedQuips': function() {
      Meteor.call('seedQuips');
    },
    'submit #update-quip': function(event) {
      var text = event.target['update-quip-text'].value;
      console.log({submit_update_quip: text});
      Meteor.call("updateQuip", this._id, text);
      Session.set("editingQuipId", null);
      return false;
    }
  };

events['click ' + MainTemplate.SCROLL_ITEM_SELECTOR] = function(event) {
      var target = $(event.currentTarget);
      //var id = event.currentTarget && event.currentTarget.attributes['id'].value;
      var id = target && target.attr('id');
      if(!id) return;
      var activeId = MainTemplate.activeElementId;
      if(activeId == id){
        MainTemplate.areEditing(true);
      }
      else{
        MainTemplate.areEditing(false)
        MainTemplate.activeElementId(id);
      }
    }

Template.main.events(events);