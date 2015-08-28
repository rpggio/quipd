
Quips = new Mongo.Collection("quips");

Threads = new Mongo.Collection("threads");


// Tags.TagsMixin(Quips);
// Quips.allowTags(function (userId) {
//     return !!userId;    // logged in
// });