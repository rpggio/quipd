
var events = {
    'click #showMore': function() {
      quipsController.showMore();
    },
    'submit #new-quip': function(event) {
      var text = event.target['new-quip-text'].value;
      Meteor.call("addQuip", text);
      event.target['new-quip-text'].value = "";
      scrollList.updateScroll();
      return false;
    },
    'click #resetQuips': function() {
      Meteor.call('resetQuips');
    },
    'click #seedQuips': function() {
      Meteor.call('seedQuips');
    }
  };

events['click ' + scrollList.SCROLL_ITEM_SELECTOR] = function(event) {
      var target = $(event.currentTarget);
      var id = target && target.attr('id');
      if(!id) return;
      var activeId = scrollList.activeElementId();
      console.log([activeId, id]);
      if(activeId == id){
        quipsController.areEditing(true);
      }
      else{
        quipsController.areEditing(false)
        scrollList.activeElementId(id);
      }
    }

Template.quipsView.events(events);