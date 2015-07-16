


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
    if(Meteor.userId()){
      // login changed
    }     
  });

  // When active element changes, set editing = false.
  Deps.autorun(function(){   
    var id = scrollList.activeElementId();
    console.log('activeElementId: ' + id);
    quipsController.areEditing(false);
    if(!id){
      scrollList.activeElementId(quipsController.NEW_QUIP_ID);
    } else {
      scrollList.scrollToId(id);
    }
  });

  Deps.autorun(function(){   
    console.log('areEditing: ', quipsController.areEditing());
  });

  // Track guest user ID.
  // When user logs in, transfer quips from guest user.
  Deps.autorun(function(){
    var user = Meteor.user();
    if(!user){
      console.error("No user available");
      return;
    }

    if(user.profile && user.profile.guest) {
      Session.set("guestUserId", user._id);
    }
    else {
      var guestUserId = Session.get('guestUserId');
      if(guestUserId){
        if(guestUserId == user._id) {
          console.error("guestUserId was same as userId");
          return;
        }

        // User has just logged in: transfer quips created as guest
        console.info("moving quips from guest user ", guestUserId, " to ", user._id);
        Session.set('guestUserId', null);
        Meteor.call('moveQuipsToUser', guestUserId, user._id);
      }
    }
  });

};
