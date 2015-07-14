
ScrollList = {};

ScrollList.SCROLL_ITEM_SELECTOR = '.scroll-item';

ScrollList.initialize = function() {
    $(window).bind('mousewheel', function(event) {
      if (event.originalEvent.wheelDelta >= 0) {
          ScrollList.prev();
      }
      else {
          ScrollList.next();
      }
      event.preventDefault();
  });
}

ScrollList.activeElementId = function(id){
  if(id == null){
    return Session.get('activeElementId');
  }
  Session.set('activeElementId', id);
}

ScrollList.activeElement = function(el) {
  if(el){
    ScrollList.activeElementId(el.attr('id'));
  }
  else{
    var activeId = ScrollList.activeElementId();
    return activeId && $('#' + activeId);
  }
}

ScrollList.next = function() {
  var active = ScrollList.activeElement();
  var next = active && active.next(ScrollList.SCROLL_ITEM_SELECTOR);
  if(!next){
    return false;
  }
  var id = next.attr('id');
  if(id){
    ScrollList.activeElementId(id);
    return id;
  }
}

ScrollList.prev = function() {
  var active = ScrollList.activeElement();
  var prev = active && active.prev(ScrollList.SCROLL_ITEM_SELECTOR);
  if(!prev){
    return false;
  }
  var id = prev.attr('id');
  if(id){
    ScrollList.activeElementId(id);
    return id;
  }
}

ScrollList.updateScroll = function(el) {
  var active = ScrollList.activeElement();
  if(active){
    ScrollList.scrollTo(active);
  }  
}

ScrollList.scrollTo = function(el) {
  if(!el){
    return;
  }

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
