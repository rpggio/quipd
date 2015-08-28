
QuipRepository = {};

QuipRepository.add = function(quip){
  var userId = ServerUtil.ensureUserId();

  if(!quip || !quip.text){
   throw new Meteor.Error("invalid quip: " + quip); 
  }
  
  quip.ownerId = Meteor.userId();

  if(quip.threadId){
    if(!ThreadRepository.incrementQuipCount(thread.threadId)) {
      console.warn('thread not found', quip.threadId);
      quip.threadId = null;
    }
  }

  if(!quip.threadId) {
    quip.threadId = ThreadRepository.add(
      { quipCount: 1 }
    );
  }

  var thread = Threads.findOne(quip.threadId);

  quip.threadId = thread._id;
  quip.threadIndex = thread.quipCount;
  var id = Quips.insert(quip);
  return Quips.find(quip);
};

QuipRepository.update = function(id, text, tags){
  var userId = ServerUtil.ensureUserId();

  Quips.update(
      { _id: id, ownerId: userId }, 
      { $set: {text: text, tags: tags} }
  );

  var quip = Quips.find(id);
  ThreadRepository.incrementUpdatedOn(quip.threadId);
}

QuipRepository.delete = function(id){
  var userId = ServerUtil.ensureUserId();
  Quips.remove({ _id: id, ownerId: userId });
  ThreadRepository.incrementQuipCount(thread.threadId, -1);
}
