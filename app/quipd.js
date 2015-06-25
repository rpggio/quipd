Quips = new Mongo.Collection("quips");

if (Meteor.isClient) {

  var scrollHistory = function() {
      var history = $('#history');
      var scrollHeight = history.prop('scrollHeight');
      console.log('scroll height: ' + scrollHeight);
      history.scrollTop(scrollHeight);
  }

  Template.body.helpers({
    quips: function() {
      //Meteor.defer(function () { scrollHistory(); });
      return Quips.find();
    }
  });

  Template.body.events({
    "submit .new-quip": function (event) {
       var text = event.target.quipText.value;
       Quips.insert({ text: text });
       event.target.quipText.value = "";
       scrollHistory();
      return false;
    }
  });

  Template.body.rendered = function () {
    scrollHistory();
  };

  // Meteor.subscribe("quips", function() {
  //   console.log("quips!!")
  //   scrollHistory();
  // });

}

if (Meteor.isServer) {
  Meteor.startup(function () {
    //Quips.insert({text: "started up! " + Date()});
  });
}
