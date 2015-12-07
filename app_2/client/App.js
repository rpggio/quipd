Template.app.viewmodel({

    onCreated: function(template) {
        var self = this;
        template.subscribe(Publication.UserQuips);
    }

});
