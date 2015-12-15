
Server = {};

Server.allow = {
  ownerId: {
    insert: function (userId, doc) {
      return userId && doc.ownerId === userId;
    },
    update: function (userId, doc, fields, modifier) {
      return doc.ownerId === userId;
    },
    remove: function (userId, doc) {
      return doc.ownerId === userId;
    },
    fetch: ['ownerId']
  }
};