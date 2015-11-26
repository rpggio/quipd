Meteor.publish('main', function(){
  return [
    Quips.find({ ownerId: this.userId })
  ];
});