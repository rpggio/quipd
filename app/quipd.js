Quips = new Mongo.Collection("quips");

var scrollHistory = function() {
  var history = $('#history');
  var scrollHeight = history.prop('scrollHeight');
  history.scrollTop(scrollHeight);
}

var browseMode = false;

if (Meteor.isServer) {

  Meteor.startup(function() {

    return Meteor.methods({
      resetQuips: function() {
        Quips.remove({});
        return Quips.insert({
          text: "started up! " + Date(),
          createdAt: Date()
        });
      }
    });

  });

  Meteor.publish('quipsPub', function(limit) {
    return Quips.find({}, {
      limit: limit || 10,
      sort: {
        createdAt: -1
      }
    });
  });

} else if (Meteor.isClient) {

  var QUIPS_INCREMENT = 30;
  Session.setDefault('quipsLimit', QUIPS_INCREMENT);
  Deps.autorun(function() {
    Meteor.subscribe('quipsPub', Session.get('quipsLimit'), function(e) {
      if (!browseMode) {
        scrollHistory();
      }
    });
  });

  Template.quipdMain.helpers({
    quips: function() {
      return Quips.find({}, {
        sort: {
          createdAt: 1
        }
      });
    },
    areMoreQuips: function() {
      var quipsCount = Quips.find().count();
      var limit = Session.get("quipsLimit");
      var result = !(quipsCount < limit);
      return result;
    }
  });

  Template.quipdMain.events({
    'click #showMore': function() {
      browseMode = true;
      Session.set("quipsLimit",
        Session.get("quipsLimit") + QUIPS_INCREMENT);
    },
    'submit .new-quip': function(event) {
      browseMode = false;
      var text = event.target.quipText.value;
      console.log('creating ' + text);
      Quips.insert({
        text: text,
        createdAt: Date()
      });
      event.target.quipText.value = "";
      scrollHistory();
      return false;
    },
    'click #resetQuips': function() {
      Meteor.call('resetQuips');
    }
  });

  Template.quipdMain.rendered = function() {
    Session.set("quipsLimit", QUIPS_INCREMENT);
    scrollHistory();
  };

}