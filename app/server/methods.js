
Meteor.startup(function() {

  return Meteor.methods({
    resetQuips: function() {
      Quips.remove({ownerId: Meteor.userId()});
    },
    addQuip: function (text) {
      if (! Meteor.userId()) {
        throw new Meteor.Error("not-authorized");
      }

      Quips.insert({
        text: text,
        createdAt: moment().toDate(),
        ownerId: Meteor.userId()
      });
    },
    updateQuip: function(id, text){
      console.log({updating: text});
      Quips.update({ _id: id}, {$set: {text: text}});
    },
    deleteQuip: function (id) {
      Quips.remove(id);
    },
    moveQuipsToUser: function(fromId, toId){
      if(!fromId || !toId){
        throw 'null argument';
      }
      if(fromId != toId){
        console.log('moving quips from user ' + fromId + ' to ' + toId);
        Quips.update({ownerId: fromId}, {$set: {ownerId: toId}}, {multi:true});
      }
    }
    
  }); // Meteor.methods

}); // Meteor.startup