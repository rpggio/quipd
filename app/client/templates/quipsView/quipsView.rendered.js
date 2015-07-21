


Template.quipsView.rendered = function() {

  quipsController.resetUserSession();

  scrollList.initialize('#body-wrapper');
  
  quipsController.initKeyhandler();

  var textareas = $('textarea.autosize');
  textareas.autosize();

  quipsController.initAutoRuns();

};
