

ServerUtil = {};

ServerUtil.ensureUserId = function() {
  var userId = Meteor.userId();
  if (!userId) {
    throw new Meteor.Error("not-authorized");
  }
  return userId;
}