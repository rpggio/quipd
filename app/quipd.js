
Quips = new Mongo.Collection("quips");

var scrollHistory = function() {
    var history = $('#history');
    var scrollHeight = history.prop('scrollHeight');
    console.log('scroll height: ' + scrollHeight);
    history.scrollTop(scrollHeight);
}

if (Meteor.isServer) {
 
  Meteor.startup(function () {

      return Meteor.methods({
        resetQuips: function() {
          Quips.remove({});
          return Quips.insert({name: "started up! " + Date()});
        }
      });

  });

  Meteor.publish('quipsPub', function(limit) {
    return Quips.find({}, { limit: limit });
  });
 
} else if (Meteor.isClient) {
 
  var QUIPS_INCREMENT = 8;
  Session.setDefault('quipsLimit', QUIPS_INCREMENT);
  Deps.autorun(function() {
    Meteor.subscribe('quipsPub', Session.get('quipsLimit'), function(e){
      scrollHistory();
    });
  });

  Template.quipdMain.helpers({
    quips: function() {
      return Quips.find();
    },
    moreResults: function() {
        var quipsCount = Quips.find().count();
        var limit = Session.get("quipsLimit");
        var result = !(quipsCount < limit);
        console.log([quipsCount, limit, result])
        return result;
    }
  });
 
  Template.quipdMain.events({
      'click #showMore': function(){
            Session.set("quipsLimit",
               Session.get("quipsLimit") + QUIPS_INCREMENT);
      },
      'submit .new-quip': function (event) {
         var text = event.target.quipText.value;
         console.log('creating ' + text);
         Quips.insert({ text: text });
         event.target.quipText.value = "";
         scrollHistory();
         return false;
      },
      'click #resetQuips': function(){
        Meteor.call('resetQuips');
      }
  });

  Template.quipdMain.rendered = function(){
      Session.set("quipsLimit", QUIPS_INCREMENT);
      scrollHistory();
  };

}