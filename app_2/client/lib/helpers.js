UI.registerHelper("hasUser", function () {
  return !!Meteor.userId() || Meteor.loggingIn();
});

Template.registerHelper('withContext', function(data) {
  var result = _.clone(this);
  _.each(data.hash, function(value, key) {
    result[key] = value;
  })
  return result;
})