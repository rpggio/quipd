
UserRepository = {};

UserRepository.convertGuestAccount = function(fromId, toId) {
      if(!fromId || !toId){
        throw 'null argument';
      }

      if(fromId == toId){
        return;
      }

      var existingCount = Quips.find({ownerId: fromId, guestQuip: true}).count();
      
      if(existingCount){
        console.log('Converting guest account', fromId, toId);

        Threads.update(
          {ownerId: fromId}, 
          {
            $set: { ownerId: toId },
          }, 
          { multi:true });      
        Quips.update(
          {ownerId: fromId}, 
          {
            $set: { ownerId: toId },
            $unset: { guestQuip: '' }
          }, 
          { multi:true });
      }
}