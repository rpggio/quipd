Template.main.viewmodel({
    ready: false

    , onCreated: function(template) {
        var self = this;
        template.subscribe('main', function() {
            self.ready(true);
        });
    }
});
