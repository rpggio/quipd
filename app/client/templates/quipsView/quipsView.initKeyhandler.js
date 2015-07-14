

Template.quipsView.initKeyhandler = function() {
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
        Template.quipsView.areEditing(false);
        break;
      case 35: // end
        return;
      case 36: // home
        return;
      case 37: // left
        // no-op
        return;
      case 38: // up
        ScrollList.prev() && e.preventDefault();
        return;
      case 39: // right
        // no-op
        return;
      case 40: // down
        ScrollList.next() && e.preventDefault();
        return;
      default:
        return;
    }
    e.preventDefault();
  });
}