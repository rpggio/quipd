
Meteor.publish(Publication.UserQuips, function(){
  return [
    Quips.find({ ownerId: this.userId })
  ];
});