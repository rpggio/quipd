
var events = {
    'click #load-more': function() {
      quipsController.showMore();
    },
    'click #resetQuips': function() {
      Meteor.call('resetQuips');
    },
    'click #seedQuips': function() {
      Meteor.call('seedQuips');
    },
    'click .quip-del': function() {
      console.log('click .quip-del');
      quipsController.deleteQuip(this._id);
      return false;
    },
    'click .tag': function() {
      console.log('click .tag', this.valueOf());
      quipsController.tagSearch(this.valueOf());
      quipsController.searchPattern(null);
      return false;
    },
    'click #search-quit': function() {
      quipsController.tagSearch(null);
      quipsController.searchPattern(null);
      return false;
    },
    'click #quipbox, click #new-quip-text': function() {
      scrollList.activeElementId(quipsController.QUIPBOX_ID);
      return false;
    }
  };

events['click ' + scrollList.SCROLL_ITEM_SELECTOR] = function(event) {
      console.log('click ' + scrollList.SCROLL_ITEM_SELECTOR);

      var target = $(event.currentTarget);
      var id = target && target.attr('id');
      if(!id) return;

      console.log('clicked ' + id);

      if(id == quipsController.SHOW_MORE_ID 
        || id == quipsController.QUIPBOX_ID){
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