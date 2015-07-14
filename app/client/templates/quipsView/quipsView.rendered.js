


Template.quipsView.rendered = function() {

  Session.setDefault('quipsLimit', quipsController.QUIPS_INCREMENT);
  Session.set("quipsLimit", quipsController.QUIPS_INCREMENT);
  Session.set("areEditing", false);

  scrollList.initialize();
  
  quipsController.initKeyhandler();

  scrollList.activeElementId('new-quip-item');

  Deps.autorun(function() {
    Meteor.subscribe('quipsPub',
      Session.get('quipsLimit'),
      function() {
        Session.get('quipsCount', Quips.find().count());
        scrollList.updateScroll();
      }
    );
  });

  Deps.autorun(function(){   
    var active = scrollList.activeElement();
    if(active) {
      Session.set("areEditing", false);
      scrollList.scrollTo(active);
    }
  });

  Deps.autorun(function(){   
    if(Meteor.userId()){
      // login changed
    }     
  });

  Deps.autorun(function(){
    var isGuest = Meteor.userId() && !Meteor.user();
    if(isGuest){
      // track guest user
      Session.set("guestUserId", Meteor.userId());
    }
    else{
      // move quips from guest user to real user
      var guestUserId = Session.get("guestUserId");
      if(guestUserId){
        Meteor.call('moveQuipsToUser', guestUserId, Meteor.userId());
      }
    }
  });

};
