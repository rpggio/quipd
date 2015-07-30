
clientController = {};

clientController.initialize = function() {

  // Track transitions between user state
  Deps.autorun(function(){
    var user = Meteor.user();
    if(!user){
      console.warn("No user available");
      return;
    }

    var priorUserId = clientController.priorUserId();

    if(user._id == priorUserId){
      return;
    }

    var isGuest = clientController.isGuest();
    var wasGuest = clientController.priorUserWasGuest();

    if(wasGuest && !isGuest){
      Meteor.call('moveQuipsToUser', priorUserId, user._id);
    }

    clientController.priorUserWasGuest(isGuest);
    clientController.priorUserId(user._id);

    quipsController.focusQuipBox();

  });

  Deps.autorun(function(){
    var user = Meteor.user();
    var greetingMode = 
      // no user or guest
      (!user || (user.profile && user.profile.guest))
      // no quips
      && Quips.find({}).count() == 0
      || false;
    clientController.greetingMode(greetingMode);
  });

}

clientController.greetingMode = function(value) {
  if(value == null){
    return Session.get('greetingMode');
  }
  Session.set('greetingMode', value);
}

clientController.greetingQuipsCreated = function(value) {
  if(value == null){
    return Session.get('greetingQuipsCreated');
  }
  Session.set('greetingQuipsCreated', value);
}

clientController.isGuest = function() {
  var user = Meteor.user();
  return user && user.profile && user.profile.guest;
}

clientController.priorUserId = function(id) {
  if(id == null){
    return Session.get('priorUserId');
  }
  Session.set('priorUserId', id);
}

clientController.priorUserWasGuest = function(wasGuest) {
  if(wasGuest == null){
    return Session.get('priorUserWasGuest');
  }
  Session.set('priorUserWasGuest', wasGuest);
}
