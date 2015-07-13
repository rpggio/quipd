


Template.main.rendered = function() {

  console.log('main.rendered');

  Session.setDefault('quipsLimit', MainTemplate.QUIPS_INCREMENT);
  Session.set("quipsLimit", MainTemplate.QUIPS_INCREMENT);
  Session.set("areEditing", false);

  MainTemplate.initScrollHandler();
  MainTemplate.initKeyhandler();

  MainTemplate.activeElementId('new-quip-item');

  Deps.autorun(function() {
    Meteor.subscribe('quipsPub',
      Session.get('quipsLimit'),
      function() {
        console.log('quipsPub callback');
        Session.get('quipsCount', Quips.find().count());
        MainTemplate.updateScroll();
      }
    );
  });

  Deps.autorun(function(){   
    var active = MainTemplate.activeElement();
    if(active) {
      Session.set("areEditing", false);
      MainTemplate.scrollTo(active);
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

Template.editQuip.rendered = function(a) {
  var input = this.$('#update-quip-text');
  input.focus();
  var length = input.val().length * 2; // *2 to make sure it's really the end
  input[0].setSelectionRange(length, length);
}
