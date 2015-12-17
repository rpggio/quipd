var Quip = (function () {
    function Quip() {
        this.isFocused = null;
        this.editMode = null;
        this._id = null;
        this.text = null;
    }
    Quip.prototype.onCreated = function () {
    };
    Quip.prototype.onRendered = function () {
        this.textareaSetup();
    };
    Quip.prototype.getFirstFocusable = function () {
        return this;
    };
    Quip.prototype.getNextFocusable = function (current, direction) {
        if (current == this) {
            switch (direction) {
                case Direction.Down:
                    var quipChildren = this.children('quip');
                    return quipChildren && quipChildren[0];
                default: return null;
            }
        }
        switch (direction) {
            case Direction.Down:
                return FocusNav.next(this, 'quip', current);
            case Direction.Up:
                return FocusNav.prev(this, 'quip', current);
            default: return null;
        }
    };
    Quip.prototype.textareaSetup = function () {
        var thisTemplateSel = $(this.templateInstance.firstNode);
        // prevent carriage return within textarea bleh      
        thisTemplateSel.children('textarea.textContent')
            .keydown(function (e) {
            if (e.keyCode == 13 && !e.shiftKey) {
                e.preventDefault();
                return false;
            }
        });
        var textarea = thisTemplateSel.children('textarea');
        textarea.autosize();
    };
    Quip.prototype.autorun = function () {
        if (!this.isFocused()) {
            this.editMode(false);
        }
    };
    Quip.prototype.readonly = function () {
        return !this.editMode();
    };
    Quip.prototype.enterKey = function (event) {
        var self = this;
        if (this.editMode()) {
            event.preventDefault();
            if (this.text()) {
                var id = this._id();
                if (id) {
                    Quips.update(id, { $set: { text: this.text() } }, function (error, updates) {
                        if (error) {
                            console.error(error);
                        }
                        else {
                            self.editMode(false);
                        }
                    });
                }
                else {
                    Quips.insert(this.data());
                }
            }
            this.editMode(false);
            return false;
        }
    };
    Quip.prototype.onTab = function (event) {
        event.preventDefault();
        this.openTarget();
        return false;
    };
    Quip.prototype.spaceKey = function (event) {
        if (!this.editMode()) {
            this.editMode(true);
            event.preventDefault();
            // workaround for caret not showing at first
            var textElement = $(this.templateInstance.firstNode)
                .children('.textContent')
                .get(0);
            Meteor.setTimeout(function () {
                var value = textElement.value;
                textElement.value = '';
                textElement.value = value;
            }, 0);
        }
    };
    Quip.prototype.escapeKey = function (event) {
        if (this.editMode()) {
            // shift-tab not working
            this.text.reset();
            this.editMode(false);
            event.preventDefault();
        }
    };
    Quip.prototype.onClick = function (event) {
        this.isFocused(true);
        event.preventDefault();
    };
    Quip.prototype.onDblClick = function (event) {
        this.openTarget();
        event.preventDefault();
    };
    Quip.prototype.openTarget = function () {
        var id = this._id();
        if (id) {
            Router.go('quips', { quipId: id });
            var parent = this.parent();
            parent.quipId(id);
        }
    };
    Quip.prototype.firstChild = function () {
        return Quips.findOne({ parentId: this._id() });
    };
    return Quip;
})();
Template['quip'].viewmodel(new Quip());
//# sourceMappingURL=quip.js.map