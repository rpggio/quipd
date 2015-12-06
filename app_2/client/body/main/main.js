Template.main.viewmodel({
    mainReady: false

    , onCreated: function(template) {
        var self = this;
        template.subscribe('main', function() {
            self.mainReady(true);
        });
    }
});
