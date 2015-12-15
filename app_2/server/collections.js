


Quips.allow(Server.allow.ownerId);

Quips.before.insert(function(userId, doc){
	doc.updatedAt = doc.createdAt = new Date();
});

Quips.after.insert(function(userId, doc){
	console.log('inserted Quip', doc);
});

Quips.before.update(function(userId, doc, fieldNames, modifier, options){
	var mset = modifier['$set'];
	if(!mset){
		modifier['$set'] = mset = {};
	}
    mset.updatedAt = new Date();
});