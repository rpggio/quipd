
quipsController = {};

quipsController.QUIPS_INCREMENT = 20;

quipsController.areMoreQuips = function() {
  var quipsCount = Quips.find().count();
  var limit = Session.get("quipsLimit");
  var result = !(quipsCount < limit);
  return result;
}

quipsController.showMore = function() {
  // todo: save selected id as session valud
  quipsController.showingMore = true;
  Session.set("quipsLimit",
    Session.get("quipsLimit") + quipsController.QUIPS_INCREMENT);
}

quipsController.areEditing = function(editing){
  if(editing == null){
    return Session.get('areEditing');
  }
  Session.set('areEditing', editing);
}

quipsController.initKeyhandler = function() {
  $(document).keydown(function(e) {
    //console.log('keydown: ' + e.which);
    switch (e.which) {
      case 13: // enter
        var areEditing = quipsController.areEditing();
        if(areEditing){
          // submit
        } else {
        }

        // if(!Session.get('editingQuipId') && Session.get('activeElementId')){
        //   console.log('starting edit: enter key pressed');
        //   Session.set('editingQuipId', Session.get('activeElementId'));
        //   break;
        // }
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
        scrollList.prev() && e.preventDefault();
        return;
      case 39: // right
        // no-op
        return;
      case 40: // down
        scrollList.next() && e.preventDefault();
        return;
      default:
        return;
    }
  });
}