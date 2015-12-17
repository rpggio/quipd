
class Quip
    implements IViewModel, Focusable, FocusStructure {

    isFocused: ReactiveVar<boolean>;
    editMode: ReactiveVar<boolean>;
    _id: ReactiveVar<string>;
    text: ReactiveVar<string>;

    constructor() {
        this.isFocused = null;
        this.editMode = null;
        this._id = null;
        this.text = null;
    }

    public onCreated() {
    }

    public onRendered() {
        this.textareaSetup();
    }

    getFirstFocusable(): Focusable {
        return this;
    }

    getNextFocusable(current: Focusable, direction: Direction)
        : Focusable {
        if (current == this) {
            switch (direction) {
                case Direction.Down:
                    var quipChildren = this.children('quip');
                    return quipChildren && <Focusable>quipChildren[0];
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
    }

    textareaSetup() {
        var thisTemplateSel = $(this.templateInstance.firstNode);

        // prevent carriage return within textarea bleh      
        thisTemplateSel.children('textarea.textContent')
            .keydown(function(e) {
                if (e.keyCode == 13 && !e.shiftKey) {
                    e.preventDefault();
                    return false;
                }
            });

        var textarea: any = thisTemplateSel.children('textarea');
        textarea.autosize();
    }

    autorun() {
        if (!this.isFocused()) {
            this.editMode(false);
        }
    }

    readonly() {
        return !this.editMode();
    }

    enterKey(event) {
        var self = this;

        if (this.editMode()) {
            event.preventDefault();
            if (this.text()) {
                var id = this._id();
                if (id) {
                    Quips.update(
                        id,
                        { $set: { text: this.text() } },
                        function(error, updates) {
                            if (error) {
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

    onTab(event) {
        event.preventDefault();
        this.openTarget();
        return false;
    }

    spaceKey(event) {
        if (!this.editMode()) {
            this.editMode(true);
            event.preventDefault();

            // workaround for caret not showing at first
            var textElement = <HTMLInputElement>$(this.templateInstance.firstNode)
                .children('.textContent')
                .get(0);

            Meteor.setTimeout(() => {
                var value = textElement.value;
                textElement.value = '';
                textElement.value = value;
            }, 0);
        }
    }

    escapeKey(event) {
        if (this.editMode()) {
            // shift-tab not working
            this.text.reset();
            this.editMode(false);
            event.preventDefault();
        }
    }

    onClick(event) {
        this.isFocused(true);
        event.preventDefault();
    }

    onDblClick(event) {
        this.openTarget();
        event.preventDefault();
    }

    openTarget() {
        var id = this._id();
        if (id) {
            Router.go('quips', { quipId: id });
            var parent: any = this.parent();
            parent.quipId(id);
        }
    }

    firstChild() {
        return Quips.findOne({ parentId: this._id() });
    }

    vmId: number;
    parent: () => IViewModel;
    children: (string?) => IViewModel[];
    templateInstance: Blaze.TemplateInstance;
    data: () => any;
}


Template['quip'].viewmodel(new Quip());
