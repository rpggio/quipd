


Template.quipsView.rendered = function() {

  Session.setDefault('quipsLimit', quipsController.QUIPS_INCREMENT);
  Session.set("quipsLimit", quipsController.QUIPS_INCREMENT);
  Session.set("areEditing", false);

  scrollList.initialize();
  
  quipsController.initKeyhandler();

  scrollList.activeElementId('new-quip-item');


  var textareas = $('textarea.autosize');
  textareas.autosize();

  Deps.autorun(function() {
    Meteor.subscribe('quipsPub',
      Session.get('quipsLimit'),
      function() {
        Session.set('quipsCount', Quips.find().count());
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

  // When active element changes, set editing = false.
  Deps.autorun(function(){   
    var id = scrollList.activeElementId();
    console.log('activeElementId: ' + id);
    quipsController.areEditing(false);
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
