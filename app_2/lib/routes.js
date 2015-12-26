/// <reference path="../typings/meteor/ironrouter.d.ts" />
Router.configure({
    layoutTemplate: 'App'
});
Router.route('/', function () {
    if (!!Meteor.userId() || Meteor.loggingIn()) {
        this.redirect('quipStream');
    }
    else {
        this.render('landing');
    }
});
Router.route('/quips/:quipId', {
    name: 'quipBrowser',
    template: 'quipBrowser'
});
Router.route('/quips', {
    name: 'quipStream',
    template: 'quipStream'
});
//# sourceMappingURL=routes.js.map