
scrollList = {};

scrollList.SCROLL_ITEM_SELECTOR = '.scroll-item';

scrollList.initialize = function(outerContainerSelector, shouldHandle) {  

  $(outerContainerSelector).mousewheel(function(event, d, dx, dy) {
      if(event.ctrlKey || event.shiftKey || event.altKey || event.metaKey){
        return;
      }

      if(shouldHandle && event.target && !shouldHandle(event.target)){
        return;
      }
      if (dy) {
        if (dy > 0) {
            scrollList.prev();
        }
        else {
            scrollList.next();
        }
        event.preventDefault();
      }
  });

  Deps.autorun(function(){   
    var activeElementId = scrollList.activeElementId();
    if(activeElementId){
      scrollList.scrollToId(activeElementId);
    }
  });

  Meteor.setTimeout(function() {
    scrollList.updateScroll();
  });
}

scrollList.activeElementId = function(id){
  if(id == null){
    return Session.get('activeElementId');
  }
  Session.set('activeElementId', id);
}

scrollList.activeElement = function(el) {
  if(el){
    scrollList.activeElementId(el.attr('id'));
  }
  else{
    var activeId = scrollList.activeElementId();
    return activeId && $('#' + activeId);
  }
}

scrollList.next = function() {
  var active = scrollList.activeElement();
  var next = active && active.next(scrollList.SCROLL_ITEM_SELECTOR);
  if(!next){
    return false;
  }
  var id = next.attr('id');
  if(id){
    scrollList.activeElementId(id);
    return id;
  }
}

scrollList.prev = function() {
  var active = scrollList.activeElement();
  var prev = active && active.prev(scrollList.SCROLL_ITEM_SELECTOR);
  if(!prev){
    return false;
  }
  var id = prev.attr('id');
  if(id){
    scrollList.activeElementId(id);
    return id;
  }
}

scrollList.first = function() {
  scrollList.activeElement($(scrollList.SCROLL_ITEM_SELECTOR).first());
}

scrollList.last = function() {
  scrollList.activeElement($(scrollList.SCROLL_ITEM_SELECTOR).last());
}

scrollList.get = function(id) {
  if (!id){
    return null;
  }
  return $('#' + id);
}

scrollList.getNext = function(id) {
  var current = scrollList.get(id);
  return current && current.next(scrollList.SCROLL_ITEM_SELECTOR);
}

scrollList.getPrev = function(id) {
  var current = scrollList.get(id);
  return current && current.prev(scrollList.SCROLL_ITEM_SELECTOR);
}

scrollList.updateScroll = function(el) {
  var active = scrollList.activeElement();
  if(active){
    scrollList.scrollTo(active);
  }  
}

scrollList.scrollToId = function(id) {
  if(!id){
    return;
  }
  scrollList.scrollTo(scrollList.get(id));
}

scrollList.scrollTo = function(el) {
  if(!el){
    return;
  }

  var elOffset = el.offset() && el.offset().top || 0;
  var elHeight = el.height();
  var windowHeight = $(window).height();
  //var windowHeight = Math.max($(document).height(), $(window).height());
  var offset;

  if (elHeight < windowHeight) {
    offset = elOffset - ((windowHeight / 2) - (elHeight / 2));
  }
  else {
    offset = elOffset;
  }

  $('html, body').animate({scrollTop:offset}, 50);
}
