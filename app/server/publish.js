
Meteor.publish('quipsPub', function(limit) {

  return Quips.find({
    ownerId: this.userId
  }, {
    limit: limit || 10,
    sort: {
      createdAt: -1
    }
  });
});
