Quips.before.insert(function(userId, doc){
	doc.ownerId = userId;
});
