Template.app.viewmodel({
    userQuipsReady: false

    , onCreated: function(template) {
        var self = this;
        template.subscribe(Publication.UserQuips, function() {
            self.userQuipsReady(true);
        });
    }

});
