
var events = {
    'click #load-more': function() {
      quipsController.showMore();
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

      if(id == quipsController.SHOW_MORE_ID 
        || id == quipsController.NEW_QUIP_ID){
        return;
        scrollList.activeElementId(id);
      }

      var activeId = scrollList.activeElementId();
      if(activeId == id){
        quipsController.areEditing(true);
      }
      else{
        quipsController.areEditing(false)
        scrollList.activeElementId(id);
      }
    }

Template.quipsView.events(events);