quipsController = {};

quipsController.QUIPS_INCREMENT = 20;
quipsController.SHOW_MORE_ID = 'load-more';
quipsController.QUIPBOX_ID = 'quipbox';
quipsController.QUIPBOX_TEXT_ID = 'new-quip-text';
quipsController.AUTOSIZE_SELECTOR = 'textarea.autosize';

quipsController.initialize = function() {
  quipsController.resetUserSession();

  scrollList.initialize('#body-wrapper', 
    function(target){
      return target.tagName != 'TEXTAREA'
        && !quipsController.areEditing();
    }
  );
  
  quipsController.initKeyhandler();

  $(quipsController.AUTOSIZE_SELECTOR).autosize();

  quipsController.initAutoRuns();   

  quipsController.initTextAreaPasteGuard();
}

quipsController.initTextAreaPasteGuard = function() {
  $(quipsController.AUTOSIZE_SELECTOR).on('paste', function (e) {
    var element = $(this);
    var max = element.attr('maxlength');
    var text = e.originalEvent.clipboardData.getData('text/plain');
    if(text.length > max){
      // e.originalEvent.clipboardData.setData('Text', 'fartface');
      // console.log(e.originalEvent.clipboardData.getData('text/plain'));

      element.val(text.slice(0, max));
      e.preventDefault();
      quipsController.textareaSizeUpdate();
    }
  });
}

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
  quipsController.quipsCount(Quips.find({}).count());
}

quipsController.areMoreQuips = function() {
  return quipsController.quipsCount() >= quipsController.quipsLimit();
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
  console.log('addQuip', quip)
  Meteor.call("addQuip", quip);
  quipsController.areEditing(false);
  quipsController.searchPattern(null);
  quipsController.tagSearch(null);
  scrollList.scrollToId(quipsController.QUIPBOX_ID);
}

quipsController.updateQuip = function(id, text, tags) {
  console.log('updateQuip', id, text, tags);
  Meteor.call("updateQuip", id, text, tags);
  quipsController.areEditing(false);
  return false;
}

quipsController.textareaSizeUpdate = function() {
  $(quipsController.AUTOSIZE_SELECTOR).trigger('autosize.resize');
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

quipsController.initAutoRuns = function() {

  Deps.autorun(function() {
    console.log('quipsPub autorun');
    Meteor.user();  // force reload on user change??
    quipsController.quipsPubHandle = Meteor.subscribe('quipsPub',
      quipsController.quipsLimit(),
      quipsController.searchPattern(),
      quipsController.tagSearch(),
      function() {
        console.log('quipsPub subscribe callback');
        scrollList.updateScroll();
      }
    );
  });

  Deps.autorun(function(){   
    console.log('auto update count');
    quipsController.updateCount();
  });

  // When active element changes, set editing = false.
  Deps.autorun(function(){   
    var id = scrollList.activeElementId();
    //console.log('activeElementId: ' + id);
    quipsController.areEditing(false);
    if(!id){
      // default to quipbox id
      scrollList.activeElementId(quipsController.QUIPBOX_ID);
    } else {
      // blur quipbox when moving away
      if(id != quipsController.QUIPBOX_ID){
        $('#' + quipsController.QUIPBOX_TEXT_ID).blur();
      }
    }
  });

  Deps.autorun(function(){   
    console.log('areEditing: ', quipsController.areEditing());
  });

  Deps.autorun(function(){   
    console.log('quipsCount: ', quipsController.quipsCount());
  });

  Deps.autorun(function(){   
    console.log('quipsLimit: ', quipsController.quipsLimit());
  });

  Deps.autorun(function(){
    var searchPattern = quipsController.searchPattern();
    console.log('searchPattern: ', searchPattern);
    quipsController.quipsLimit(quipsController.QUIPS_INCREMENT);
  });

  Deps.autorun(function(){   
    var tagSearch = quipsController.tagSearch();
    console.log('tagSearch: ', tagSearch);
    quipsController.quipsLimit(quipsController.QUIPS_INCREMENT);
  });

  // Track guest user ID.
  // When user logs in, transfer quips from guest user.
  Deps.autorun(function(){
    var user = Meteor.user();
    if(!user){
      console.warn("No user available");
      return;
    }

    var priorUserId = quipsController.priorUserId();

    if(user._id == priorUserId){
      console.warn("Current user ID is the same as prior user ID");
      return;
    }

    console.log({ currentUser: user});

    var isGuest = user.profile && user.profile.guest;
    var wasGuest = quipsController.priorUserWasGuest();

    if(wasGuest && !isGuest){
      Meteor.call('moveQuipsToUser', priorUserId, user._id);
    }

    quipsController.resetUserSession();
    quipsController.priorUserWasGuest(isGuest);
    quipsController.priorUserId(user._id);
  });
  
}

quipsController.handleQuipboxKey = function(e) {
  var targetSelection = $(e.target);
  switch (e.which) {
    case 27: // esc
      quipsController.areEditing(false);
      targetSelection.val('');
      quipsController.textareaSizeUpdate();
      targetSelection.blur();
      quipsController.searchPattern (null);
      quipsController.tagSearch(null);
      e.preventDefault();
      return;
    case 13: // enter
      var text = targetSelection.val();

      if (text == null || !text.length) {
        e.preventDefault();
        return;
      }

      if(text.indexOf('?') == 0) {
        var pattern = text.slice(1);
        if(pattern.length < 2){
          e.preventDefault();
          return; 
        }

        // search
          
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
        quipsController.textareaSizeUpdate();
      } 
      else {

        // add new
        
        var quip = quipsController.parseLine(text);
        quipsController.addQuip(quip);
        $(e.target).val('');
        quipsController.textareaSizeUpdate();
      }

      e.preventDefault();
    default:
      scrollList.activeElementId(quipsController.QUIPBOX_ID);
      // allow default
  }
}

quipsController.handleEnterKey = function(e) {
  var areEditing = quipsController.areEditing();
  var activeElementId = scrollList.activeElementId();

  // editing
  if (areEditing) {
    if(!activeElementId) {
      console.error('areEditing = true, but no active element');
      return;
    }
    var text = $(e.target).val();
    if (text != null && text.length) {
      var parsed = quipsController.parseLine(text);
      quipsController.updateQuip(activeElementId, parsed.text, parsed.tags)
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
}

quipsController.initKeyhandler = function() {
  $(document).keydown(function(e) {

    var targetSelection = $(e.target);
    var targetId = targetSelection.attr('id');

    if(targetId == quipsController.QUIPBOX_ID
        || targetId == quipsController.QUIPBOX_TEXT_ID) {
      quipsController.handleQuipboxKey(e);
      return;
    }

    // Show more
    else if (targetId == quipsController.SHOW_MORE_ID){
        if(e.which == 13){
          quipsController.showMore();
          e.preventDefault();
          return;
        }
    }

    // General key handler
    else {

      switch (e.which) {
        case 13: // enter
          quipsController.handleEnterKey(e);
          return;
        case 27: // esc
          if (quipsController.areEditing()) {
            quipsController.areEditing(false);
            e.preventDefault();
          }
          return;
        case 35: // end
          if (!quipsController.areEditing()) {
            scrollList.last();
            e.preventDefault();
          }
          return;
        case 36: // home
          if (!quipsController.areEditing()) {
            scrollList.first();
            e.preventDefault();
          }
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
          if (!quipsController.areEditing()) {
            var activeId = scrollList.activeElementId();
            if(quipsController.isQuip(activeId)){
              quipsController.deleteQuip(activeId);
            }
          }
          return;
        default:
          return;
      }

    }

  });
}
