
Template.quipEdit.rendered = function(a) {
  var input = this.$('#update-quip-text');
  input.focus();
  var length = input.val().length * 2; // *2 to make sure it's really the end
  input[0].setSelectionRange(length, length);
}
