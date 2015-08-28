
Quips.before.insert(function(userId, quip){
   quip.createdAt = quip.updatedAt = new Date();
});

Quips.before.update(function (userId, doc, fieldNames, modifier, options) {
    modifier.$set = modifier.$set || {};
    modifier.$set.updatedAt = new Date();
});

Quips.allow({  
  insert: function (userId, doc) {
    return userId;
  },
  update: function (userId, doc, fields, modifier) {
    return doc.ownerId === userId;
  },
  remove: function (userId, doc) {
    return doc.ownerId === userId;
  }
});

//Quips._dropIndex('quipsFullText');
Quips._ensureIndex(
  { text: 'text',
    tags: 'text' },
  { name: 'quipsFullText' }
);

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
      updatedAt: -1
    }
  };

  console.log([findParams, sortParams]);

  return Quips.find(findParams, sortParams);

});
