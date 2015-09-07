
Meteor.startup(function() {

  return Meteor.methods({
    addQuip: function (quip) {
      return QuipRepository.add(quip);
    },
    updateQuip: function(id, text, tags){
      QuipRepository.update(id, text, tags);
    },
    deleteQuip: function (id) {
      QuipRepository.delete(id);
    },
    moveQuipsToUser: function(fromId, toId){
      UserRepository.convertGuestAccount(fromId, toId);
    }
    
  }); // Meteor.methods

}); // Meteor.startup