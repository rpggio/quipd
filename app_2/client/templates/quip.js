Template.quip.viewmodel({
    focused: false
    , editMode: false

    , onRendered: function() {
        var self = this;

        var thisTemplateSel = $(this.templateInstance.firstNode);

        // prevent carriage return within textarea bleh      
        thisTemplateSel.children('textarea.textContent')
            .keydown(function(e){
                if (e.keyCode == 13 && !e.shiftKey)
                {
                  e.preventDefault();
                  return false;
                }
            });

        thisTemplateSel.children('textarea').autosize();
    }

    , autorun: function() {
        if(!this.focused()){
            this.editMode(false);
        }
    }

    , readonly: function() {
        return !this.editMode();
    }

    , enterKey: function(event) {
        var self = this;

        if(this.editMode()) {
            event.preventDefault();
            if(this.text()) {
                var id = this._id();
                if(id){
                    Quips.update(
                        id,
                        { $set: { text: this.text() } },
                        function(error, updates) {
                            if(error){
                                console.error(error);                            
                            } else {
                                self.editMode(false);
                            }
                        }
                    );
                } else {
                    Quips.insert(this.data());
                }
            }
            this.editMode(false);
            return false;
        }
    }

    , onTab: function(event) {
        event.preventDefault();
        this.openTarget();
        return false;
    }

    , spaceKey: function(event) {
        if (!this.editMode()){
            this.editMode(true);
            event.preventDefault();

            // workaround for caret not showing at first
            var textElement = $(this.templateInstance.firstNode)
                .children('.textContent')
                .get(0);
            Meteor.setTimeout(() => {
                var value = textElement.value;
                textElement.value = '';
                textElement.value = value;
            });
        }
    }

    , escapeKey: function(event) {
        if(this.editMode()){
            // shift-tab not working
            this.text.reset();
            this.editMode(false);
            event.preventDefault();
        }
    }

    , onClick: function(event) {
        this.focused(true);
        event.preventDefault();
    }

    , onDblClick: function(event) {
        this.openTarget();
        event.preventDefault();
    }

    , openTarget: function() {
        var id = this._id();
        if(id){
            Router.go('quips', {quipId: id});
            this.parent().quipId(id);
        }
    }

    , firstChild: function() {
        return Quips.findOne({ parentId: this._id() });
    }
});