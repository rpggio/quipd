Quips._ensureIndex({
  text: 'text'
});

Meteor.publish('quipsPub', function(limit, pattern, tag) {

  var findParams = {
    ownerId: this.userId
  };
  if(pattern){
    findParams.$text = { $search: pattern };
  }
  if(tag){
    findParams.tags = tag;
  }

  var sortParams = {
    limit: limit || 10,
    sort: {
      createdAt: -1
    }
  };

  console.log([findParams, sortParams]);

  return Quips.find(findParams, sortParams);

});
