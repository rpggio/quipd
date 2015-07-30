
Meteor.startup(function() {

  return Meteor.methods({
    resetQuips: function() {
      var userId = Meteor.userId();
      if (!userId) {
        throw new Meteor.Error("not-authorized");
      }
      Quips.remove({ownerId: userId});
    },
    addQuip: function (quip) {
      var userId = Meteor.userId();
      if (!userId) {
        throw new Meteor.Error("not-authorized");
      }

      if(!quip || !quip.text){
       throw new Meteor.Error("invalid quip: " + quip); 
      }
      
      quip.createdAt = moment().toDate();
      quip.ownerId = Meteor.userId();
      var id = Quips.insert(quip);
    },
    updateQuip: function(id, text, tags){
      var userId = Meteor.userId();
      if (!userId) {
        throw new Meteor.Error("not-authorized");
      }

      Quips.update(
          { _id: id, ownerId: userId }, 
          {$set: {text: text, tags: tags}}
      );
    },
    deleteQuip: function (id) {
      var userId = Meteor.userId();
      if (!userId) {
        throw new Meteor.Error("not-authorized");
      }

      Quips.remove({ _id: id, ownerId: userId });
    },
    moveQuipsToUser: function(fromId, toId){
      if(!fromId || !toId){
        throw 'null argument';
      }
      var existingCount = Quips.find({ownerId: fromId, guestQuip: true}).count();
      if(fromId != toId && existingCount){
        console.log('moving quips from user ' + fromId + ' to ' + toId);
        Quips.update(
          {ownerId: fromId}, 
          {
            $set: { ownerId: toId },
            $unset: { guestQuip: '' }
          }, 
          { multi:true });
      }
    }
    
  }); // Meteor.methods

}); // Meteor.startup