


Template.quipsView.rendered = function() {

  quipsController.resetUserSession();

  scrollList.initialize('#page-body');
  
  quipsController.initKeyhandler();

  var textareas = $('textarea.autosize');
  textareas.autosize();

  Deps.autorun(function() {
    console.log('quipsPub autorun');
    Meteor.user();  // force reload on user change??
    Meteor.subscribe('quipsPub',
      quipsController.quipsLimit(),
      quipsController.searchPattern(),
      quipsController.tagSearch(),
      function() {
        console.log('quipsPub subscribe callback');
        quipsController.updateCount();
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
      scrollList.activeElementId(quipsController.QUIPBOX_ID);
    } else {
      scrollList.scrollToId(id);
    }
  });

  Deps.autorun(function(){   
    console.log('areEditing: ', quipsController.areEditing());
  });

  Deps.autorun(function(){   
    console.log('quipsCount: ', quipsController.quipsCount());
  });

  Deps.autorun(function(){   
    console.log('quipsLimit: ', quipsController.quipsLimit());
  });

  Deps.autorun(function(){   
    console.log('searchPattern: ', quipsController.searchPattern());
  });

  Deps.autorun(function(){   
    console.log('tagSearch: ', quipsController.tagSearch());
  });

  // Track guest user ID.
  // When user logs in, transfer quips from guest user.
  Deps.autorun(function(){
    var user = Meteor.user();
    if(!user){
      console.warn("No user available");
      return;
    }

    var priorUserId = quipsController.priorUserId();

    if(user._id == priorUserId){
      console.warn("Current user ID is the same as prior user ID");
      return;
    }

    console.log({ currentUser: user});

    var isGuest = user.profile && user.profile.guest;
    var wasGuest = quipsController.priorUserWasGuest();

    if(wasGuest && !isGuest){
      // transfer quips
      console.info("moving quips from guest user ", priorUserId, " to ", user._id);
      Meteor.call('moveQuipsToUser', priorUserId, user._id);
    }

    quipsController.resetUserSession();
    quipsController.priorUserWasGuest(isGuest);
    quipsController.priorUserId(user._id);
  });

};
