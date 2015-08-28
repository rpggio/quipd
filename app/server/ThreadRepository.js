
ThreadRepository = {};

ThreadRepository.add = function(thread){
  if(!thread){
    return;
  }

  var userId = ServerUtil.ensureUserId();
  if(thread.ownerId && !thread.ownerId != userId){
    log.warn('Thread ownerId does not match current user. Overriding.', thread);
  }

  if(thread.quipCount == null){
    thread.quipCount = 0;
  }
  thread.ownerId = userId;
  thread.updatedAt = Date.now();

  return Threads.insert(thread);
}

ThreadRepository.incrementQuipCount = function(id, countChange) {
  if(!countChange){
    countChange = 1;
  }
  return Threads.update(
    id,
    { 
      $set: { updatedOn: Date.now() },
      $inc: { quipCount: countChange } 
    }
  );
}

ThreadRepository.incrementUpdatedOn = function(id) {
  return Threads.update(
    id,
    { 
      $set: { updatedOn: Date.now() }
    }
  );
}