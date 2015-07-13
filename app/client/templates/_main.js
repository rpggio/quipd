MainTemplate = {}

MainTemplate.QUIPS_INCREMENT = 20;
MainTemplate.SCROLL_ITEM_SELECTOR = '.scroll-item';


MainTemplate.activeElementId = function(id){
  if(id == null){
    return Session.get('activeElementId');
  }
  Session.set('activeElementId', id);
}

MainTemplate.activeElement = function(el) {
  if(el){
    // jquery or element??
    MainTemplate.activeElementId(el.attr('id'));
  }
  else{
    var activeId = MainTemplate.activeElementId();
    return activeId && $('#' + activeId);
  }
}

MainTemplate.areEditing = function(editing){
  if(editing == null){
    return Session.get('areEditing');
  }
  Session.set('areEditing', editing);
}

MainTemplate.next = function() {
  var active = MainTemplate.activeElement();
  console.log({active: active});
  var next = active && active.next(MainTemplate.SCROLL_ITEM_SELECTOR);
  console.log({next: next});
  if(!next){
    return false;
  }
  var id = next.attr('id');
  if(id){
    MainTemplate.activeElementId(id);
    return id;
  }
}

MainTemplate.prev = function() {
  var active = MainTemplate.activeElement();
  var prev = active && active.prev(MainTemplate.SCROLL_ITEM_SELECTOR);
  if(!prev){
    return false;
  }
  var id = prev.attr('id');
  if(id){
    MainTemplate.activeElementId(id);
    return id;
  }
}

MainTemplate.areMoreQuips = function() {
  var quipsCount = Quips.find().count();
  var limit = Session.get("quipsLimit");
  var result = !(quipsCount < limit);
  return result;
}

MainTemplate.showMore = function() {
  // todo: save selected id as session valud
  MainTemplate.showingMore = true;
  Session.set("quipsLimit",
    Session.get("quipsLimit") + MainTemplate.QUIPS_INCREMENT);
}

MainTemplate.updateScroll = function(el) {
  var active = MainTemplate.activeElement();
  if(active){
    MainTemplate.scrollTo(active);
  }  
}

MainTemplate.scrollTo = function(el) {
  if(!el){
    return;
  }
  console.log('scrolling to ' + el.attr('id'));

  var elOffset = el.offset() && el.offset().top || 0;
  var elHeight = el.height();
  var windowHeight = $(window).height();
  var offset;

  if (elHeight < windowHeight) {
    offset = elOffset - ((windowHeight / 2) - (elHeight / 2));
  }
  else {
    offset = elOffset;
  }

  $('html, body').animate({scrollTop:offset}, 100);
}

MainTemplate.initScrollHandler = function() {
    $(window).bind('mousewheel', function(event) {
      if (event.originalEvent.wheelDelta >= 0) {
          MainTemplate.prev();
      }
      else {
          MainTemplate.next();
      }
      event.preventDefault();
  });
}

MainTemplate.initKeyhandler = function() {
  $(document).keydown(function(e) {
    //console.log('keydown: ' + e.which);
    switch (e.which) {
      case 13: // enter
        // if(!Session.get('editingQuipId') && Session.get('activeElementId')){
        //   console.log('starting edit: enter key pressed');
        //   Session.set('editingQuipId', Session.get('activeElementId'));
        //   break;
        // }
        return;
      case 27: // esc
        $('#new-quip-text').val('');
        MainTemplate.areEditing(false);
        break;
      case 35: // end
        return;
      case 36: // home
        return;
      case 37: // left
        // no-op
        return;
      case 38: // up
        MainTemplate.prev() && e.preventDefault();
        return;
      case 39: // right
        // no-op
        return;
      case 40: // down
        MainTemplate.next() && e.preventDefault();
        return;
      default:
        return;
    }
    e.preventDefault();
  });
}