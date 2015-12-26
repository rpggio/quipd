/// <reference path="../typings/meteor/ironrouter.d.ts" />
Router.configure({
    layoutTemplate: 'App'
});
Router.route('/', function () {
    if (!!Meteor.userId() || Meteor.loggingIn()) {
        this.redirect('quipBrowser');
    }
    else {
        this.render('landing');
    }
});
Router.route('/quips/:quipId?', {
    name: 'quipBrowser',
    template: 'quipBrowser'
});
//# sourceMappingURL=routes.js.map