quipsController = {};

quipsController.QUIPS_INCREMENT = 20;
quipsController.SHOW_MORE_ID = 'load-more';
quipsController.QUIPBOX_ID = 'quipbox';

quipsController.resetUserSession = function() {
  console.info('resetting user session');
  Session.setDefault('quipsLimit', quipsController.QUIPS_INCREMENT);
  quipsController.quipsLimit(quipsController.QUIPS_INCREMENT)
  // for some reason, the next line breaks the showMore button upon login
  // quipsController.updateCount();
  quipsController.areEditing(false);
  quipsController.searchPattern(null);
  quipsController.tagSearch(null);
  scrollList.activeElementId(quipsController.QUIPBOX_ID);
}

quipsController.quipsCount = function(limit) {
  if(limit == null){
    return Session.get('quipsCount');
  }
  Session.set('quipsCount', limit);
}

quipsController.quipsLimit = function(limit) {
  if(limit == null){
    return Session.get('quipsLimit');
  }
  Session.set('quipsLimit', limit);
}

quipsController.priorUserId = function(id) {
  if(id == null){
    return Session.get('priorUserId');
  }
  Session.set('priorUserId', id);
}

quipsController.priorUserWasGuest = function(wasGuest) {
  if(wasGuest == null){
    return Session.get('priorUserWasGuest');
  }
  Session.set('priorUserWasGuest', wasGuest);
}

quipsController.searchPattern = function(value) {
  if(value === undefined){
    return Session.get('searchPattern');
  }
  Session.set('searchPattern', value);
}

quipsController.tagSearch = function(value) {
  if(value === undefined){
    return Session.get('tagSearch');
  }
  Session.set('tagSearch', value);
}

quipsController.updateCount = function() {
  quipsController.quipsCount(Quips.find().count());
}

quipsController.areMoreQuips = function() {
  return !(quipsController.quipsCount() < quipsController.quipsLimit());
}

quipsController.showMore = function() {
  quipsController.showingMore = true;
  scrollList.next();
  quipsController.quipsLimit(
    quipsController.quipsLimit() + quipsController.QUIPS_INCREMENT);
}

quipsController.areEditing = function(editing) {
  if (editing == null) {
    return Session.get('areEditing');
  }
  Session.set('areEditing', editing);
}

quipsController.addQuip = function(quip) {
  console.log('adding quip', quip)
  Meteor.call("addQuip", quip);
  quipsController.areEditing(false);
  quipsController.searchPattern(null);
  quipsController.tagSearch(null);
  scrollList.scrollToId(quipsController.QUIPBOX_ID);
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
    && itemId != quipsController.QUIPBOX_ID;
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

quipsController.parseLine = function(text){
  text = text.trim();
  var foundTag = false;
  var quip = { tags: [] };
  do {
    var lastWord = Util.getLastWord(text);
    foundTag = false;
    if(lastWord 
        && lastWord.length < text.length 
        && lastWord.length >= 3 
        && lastWord[0] == '#')
    {
      var tag = lastWord.slice(1)
      if(tag.length >= 2){
        quip.tags.push(tag);
        text = text.slice(0, -lastWord.length).trim();
        foundTag = true;
      }
    }
  } while(foundTag)

  quip.text = text;

  console.log(quip);

  return quip;
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

        // quip box

        else if (activeElementId == quipsController.QUIPBOX_ID) {
          
          var text = $(e.target).val();

          if (text == null || !text.length) {
            return;
          }

          if(text.indexOf('?') == 0) {
            var pattern = text.slice(1);
            if(pattern.length < 2){
              e.preventDefault();
              return; 
            }

            //search
              
            if(pattern.indexOf('#') == 0){
              pattern = pattern.slice(1);
              quipsController.tagSearch(pattern);
              quipsController.searchPattern(null);
            }
            else {
              quipsController.searchPattern(pattern);
              quipsController.tagSearch(null);
            }
            $(e.target).val('');
          } 
          else {
            // add new
            var quip = quipsController.parseLine(text);
            quipsController.addQuip(quip);
            $(e.target).val('');
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
            if (activeElementId == quipsController.QUIPBOX_ID) {
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
        quipsController.searchPattern(null);
        quipsController.tagSearch(null);
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
