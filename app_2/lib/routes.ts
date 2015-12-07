/// <reference path="../typings/app.ts" />

Router.configure({
    layoutTemplate: 'App'
});

Router.route('/', {
    template: 'quipStream'
});

Router.route('/quip/:quipId', function() {
    this.render('quipStream');
});