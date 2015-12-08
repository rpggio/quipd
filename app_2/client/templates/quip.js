Template.quip.viewmodel({
    focused: false
    , editMode: false

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

        event.preventDefault();

        if(!this.editMode()){
            this.openTarget();
            return;
        }

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
    }

    , spaceKey: function() {
        console.log('spaceKey');
        if (!this.editMode()){
            this.editMode(true);
        }
    }

    , escapeKey: function() {
        if(this.editMode()){
            this.text.reset();
            this.editMode(false);
        }
    }

    , onDblClick: function() {
        this.openTarget();
    }

    , onBackspace: function() {
        if(!this.editMode()){
            this.openParent();
        }
    }

    , openTarget: function() {
        var id = this._id();
        if(id){
            Router.go('quips', {quipId: id});
            this.parent().quipId(id);
        }
    }
});