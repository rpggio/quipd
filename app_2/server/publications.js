/// <reference path="../../typings/app.ts" />

Meteor.publish(Publication.UserQuips, function(){
  return [
    Quips.find({ ownerId: this.userId })
  ];
});