ViewModel.mixin({
    focusable: {
        focused: false
        , tabIndex: 0

        , onRendered: function() {
            if(!this.tabIndex() && this.parent().getTabIndex){
                this.tabIndex(this.parent().getTabIndex(this));
            }
        }

        , prev: function() {
            this.changeFocus(false);
        }

        , next: function() {
            this.changeFocus(true);
        }

        , changeFocus: function(forward){
            var currentIdx = this.tabIndex();
            var toIdx = forward ? currentIdx + 1 : currentIdx - 1;

            if(toIdx < 0){
                return;
            }
            var target = this.parent().children(function(c) {
                return c.tabIndex && c.tabIndex() == toIdx;
            });
            if(target.length){
                target[0].focused(true);
            }
            else {
                // todo: move up ancestor tree here
            }
        }
    }
});