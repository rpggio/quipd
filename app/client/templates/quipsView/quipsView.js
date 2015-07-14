
Template.quipsView.QUIPS_INCREMENT = 20;

Template.quipsView.areMoreQuips = function() {
  var quipsCount = Quips.find().count();
  var limit = Session.get("quipsLimit");
  var result = !(quipsCount < limit);
  return result;
}

Template.quipsView.showMore = function() {
  // todo: save selected id as session valud
  Template.quipsView.showingMore = true;
  Session.set("quipsLimit",
    Session.get("quipsLimit") + Template.quipsView.QUIPS_INCREMENT);
}

Template.quipsView.areEditing = function(editing){
  if(editing == null){
    return Session.get('areEditing');
  }
  Session.set('areEditing', editing);
}
