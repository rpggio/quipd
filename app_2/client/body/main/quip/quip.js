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

    , enterKey: function() {
        var self = this;

        if(!this.editMode()){
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
});