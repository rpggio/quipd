


Template.main.rendered = function() {
  Session.set("quipsLimit", QuipdClient.QUIPS_INCREMENT);

  QuipdClient.initScroll();

  QuipdClient.initKeyhandler();

  Deps.autorun(function() {
    Meteor.subscribe('quipsPub',
      Session.get('quipsLimit'),
      function() {
        QuipdClient.quipCount = Quips.find().count();
        QuipdClient.updateScroll();
      }
    );
  });

  Deps.autorun(function(){
    if(Meteor.userId()){
      QuipdClient.updateScroll();
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