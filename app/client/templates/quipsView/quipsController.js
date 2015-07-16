quipsController = {};

quipsController.QUIPS_INCREMENT = 20;
quipsController.SHOW_MORE_ID = 'load-more';
quipsController.NEW_QUIP_ID = 'new-quip-item';

quipsController.areMoreQuips = function() {
  return !(Session.get('quipsCount') < Session.get('quipsLimit'));
}

quipsController.showMore = function() {
  quipsController.showingMore = true;
  scrollList.next();
  Session.set("quipsLimit",
    Session.get("quipsLimit") + quipsController.QUIPS_INCREMENT);
}

quipsController.areEditing = function(editing) {
  if (editing == null) {
    return Session.get('areEditing');
  }
  Session.set('areEditing', editing);
}

quipsController.updateQuip = function(quip, text) {
  console.log({
    'quipsController.updateQuip': text
  });
  Meteor.call("updateQuip", quip._id, text);
  quipsController.areEditing(false);
  return false;
}

quipsController.isQuip = function(itemId) {
  return itemId
    && itemId != quipsController.SHOW_MORE_ID
    && itemId != quipsController.NEW_QUIP_ID;
}

quipsController.deleteQuip = function(id){
  console.log('deleting quip ' + id);
  scrollList.prev();
  Meteor.call("deleteQuip", id);
}

// Prevents flood of arrow keys when navigating list
// Returns true if current arrow key call should be accepted.
quipsController.acceptArrowKey = function() {
  if (quipsController.blockArrow) {
    return false;
  }
  quipsController.blockArrow = true;
  setTimeout(function() {
    quipsController.blockArrow = false;
  }, 50);
  return true;
}

quipsController.initKeyhandler = function() {
  $(document).keydown(function(e) {
    console.log('keydown: ' + e.which);
    switch (e.which) {
      case 13: // enter
        var areEditing = quipsController.areEditing();
        var activeElementId = scrollList.activeElementId();

        // show more

        if (activeElementId == quipsController.SHOW_MORE_ID) {
          quipsController.showMore();
        } 

        // new-quip

        else if (activeElementId == quipsController.NEW_QUIP_ID) {
          // create new quip
          var text = $(e.target).val();
          if (text != null && text.length) {
            Meteor.call("addQuip", text);
            $(e.target).val('');
            quipsController.areEditing(false);
          }
        }

        // editing

        else if (areEditing) {
          if(!activeElementId) {
            console.error('areEditing = true, but no active element');
            return;
          }
          var text = $(e.target).val();
          if (text != null && text.length) {
            Meteor.call("updateQuip", activeElementId, text);
            quipsController.areEditing(false);
          }
        } 

        // navigating

        else {
          if (activeElementId) {
            quipsController.areEditing(true);
            if (activeElementId == quipsController.NEW_QUIP_ID) {
              var textarea = $('#new-quip-text');
              textarea.focus();
              textarea[0].setSelectionRange(0, 0);
            }
          }
        }

        e.preventDefault();
        return;
      case 27: // esc
        $('#new-quip-text').val('');
        quipsController.areEditing(false);
        e.preventDefault();
        return;
      case 35: // end
        return;
      case 36: // home
        return;
      case 37: // left
        // no-op
        return;
      case 38: // up
        if (!quipsController.areEditing()) {
          if (quipsController.acceptArrowKey()) {
            scrollList.prev()
          }
          e.preventDefault();
        }
        return;
      case 39: // right
        // no-op
        return;
      case 40: // down
        if (!quipsController.areEditing()) {
          if (quipsController.acceptArrowKey()) {
            scrollList.next()
          }
          e.preventDefault();
        }
        return;
      case 46: // del
        var activeId = scrollList.activeElementId();
        if(quipsController.isQuip(activeId)){
          quipsController.deleteQuip(activeId);
        }
        return;
      default:
        return;
    }
  });
}
