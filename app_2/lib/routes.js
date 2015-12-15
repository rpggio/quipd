/// <reference path="../typings/meteor/ironrouter.d.ts" />
Router.configure({
    layoutTemplate: 'App'
});
Router.route('/', function () {
    if (!!Meteor.userId() || Meteor.loggingIn()) {
        this.redirect('quips');
    }
    else {
        this.render('landing');
    }
});
Router.route('quips', {
    path: '/quips/:quipId?',
    template: 'quipStream'
});
//# sourceMappingURL=routes.js.map