Quips._ensureIndex({
  text: 'text'
});

Meteor.publish('quipsPub', function(limit, pattern) {

  if (!pattern) {
    return Quips.find(
    {
      ownerId: this.userId
    },
    {
      limit: limit || 10,
      sort: {
        createdAt: -1
      }
    });
  }

  return Quips.find(
  {
    ownerId: this.userId,
    $text: {
      $search: pattern
    }
  },
  {
    limit: limit || 10,
    sort: {
      createdAt: -1
    }
  });

});
