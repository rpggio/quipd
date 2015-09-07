
QuipRepository = {};

QuipRepository.add = function(quip){
  var userId = ServerUtil.ensureUserId();

  if(!quip){
   throw new Meteor.Error("invalid quip: " + quip); 
  }
  
  quip.ownerId = Meteor.userId();

  console.log('parentId: ' + quip.parentId);

  if(quip.parentId) { 
    var parent = Quips.findOne(quip.parentId);
    quip.order = parent.quipCount;
  }

  var id = Quips.insert(quip);

  if(quip.parentId) {
    console.log('updating parent: ' + quip.parentId);
    Quips.update(
        { _id: quip.parentId },
        { $inc: { quipCount: 1 } }
    );
  }

  return Quips.findOne(quip);
};

QuipRepository.update = function(id, text, tags){
  var userId = ServerUtil.ensureUserId();

  Quips.update(
      { _id: id, ownerId: userId }, 
      { $set: {text: text, tags: tags} }
  );

  var quip = Quips.find(id);
}

QuipRepository.delete = function(id){
  var userId = ServerUtil.ensureUserId();

  var quip = Quips.findOne(id);
  if(!quip){
    throw new Meteor.Error("cannot find quip " + id); 
  }

  Quips.remove({ _id: id, ownerId: userId });

  if(quip.parentId) {
    Quips.update(
      { _id: quip.parentId },
      { $inc: { quipCount: -1 } }
    );
  }

}
