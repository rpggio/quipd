class QuipView
    extends ViewModelBase 
    implements Focusable, FocusStructure {

    editMode:ReactiveValue<boolean> = null;
    _id:ReactiveValue<string> = null;
    parentId:ReactiveValue<string> = null;
    grandParentId:ReactiveValue<string> = null;
    text:ReactiveValue<string> = null;
    level:ReactiveValue<number> = null;
    isFocused : ReactiveValue<boolean> = null;
    focusIndex: ReactiveValue<number> = null;
    showChildren: ReactiveValue<boolean> = null;
    
    constructor(context) {
        super();
        
        var self = <any>this;
        self.showChildren = true;
    }

    public onCreated() {
    }

    public onRendered() {
    }
    
    childQuips() {
        var id = this._id();
        return Quips.find({parentId: id});
        // var id = this._id();
        // if(id && this.level() < 10){
        //     var quips = Quips.find({parentId: id}).fetch();
        //     let focusIndex = 0;
        //     quips.forEach(q => (<any>q).focusIndex = focusIndex++);
        //     return quips;
        // }
    }
    
    getFirstFocusable(): Focusable {
        return <Focusable>_.first(this.children());
    };
    
    getNextFocusable(current: QuipView, direction: Direction): Focusable {
        if(!this.showChildren()){
            return null;
        }
        
        if(current == this){
            switch(direction){
                case Direction.Down:
                    return <Focusable>_.first(this.children());
                    //return this.getQuipAtFocusIndex(0);
                default: return null;
            }
        }
        
        if(current.parentId() != this._id()){
            // not under this quip
            return null;
        }
        
        let focusIndex = current.focusIndex();
        
        let increment: number;
        switch(direction){
            case Direction.Up:
                return FocusNav.getAdjacent(this.children('quipView'), current, false);
            
                // return focusIndex == 0
                //     ? this
                //     : this.getQuipAtFocusIndex(current.focusIndex() - 1);
            case Direction.Down:
                return FocusNav.getAdjacent(this.children('quipView'), current, true);
            
                //return this.getQuipAtFocusIndex(current.focusIndex() + 1);
            default: return null;
        }
    }

    // getQuipAtFocusIndex(focusIndex: number): Focusable{
    //     return <Focusable>_.first(
    //         this.children(c => {
    //             return (<any>c).focusIndex() == focusIndex;
    //         }));
    // }

    // textareaSetup() {
    //     var thisTemplateSel = $(this.templateInstance.firstNode);

    //     // prevent carriage return within textarea bleh      
    //     thisTemplateSel.children('textarea.textContent')
    //         .keydown(function(e) {
    //             if (e.keyCode == 13 && !e.shiftKey) {
    //                 e.preventDefault();
    //                 return false;
    //             }
    //         });

    //     var textarea: any = thisTemplateSel.children('textarea');
    //     textarea.autosize();
    // }

    autorun = [
        function() {
            this.level(this.parent().level + 1);
        },
        // if (!this.isFocused()) {
        //     this.editMode(false);
        // }
    ];

    // readonly() {
    //     return !this.editMode.get();
    // }

    // enterKey(event) {
    //     var self = this;

    //     if (this.editMode.get()) {
    //         event.preventDefault();
    //         if (this.text.get()) {
    //             var id = this._id.get();
    //             if (id) {
    //                 Quips.update(
    //                     id,
    //                     { $set: { text: this.text.get() } },
    //                     function(error, updates) {
    //                         if (error) {
    //                             console.error(error);
    //                         } else {
    //                             self.editMode.set(false);
    //                         }
    //                     }
    //                 );
    //             } else {
    //                 //Quips.insert(this.data());
    //             }
    //         }
    //         this.editMode.set(false);
    //         return false;
    //     }
    // }

    // onTab(event) {
    //     event.preventDefault();
    //     //this.openTarget();
    //     return false;
    // }

    // spaceKey(event) {
    //     if (!this.editMode.get()) {
    //         this.editMode(true);
    //         event.preventDefault();

    //         // workaround for caret not showing at first
    //         var textElement = <HTMLInputElement>$(this.templateInstance.firstNode)
    //             .children('.textContent')
    //             .get(0);

    //         Meteor.setTimeout(() => {
    //             var value = textElement.value;
    //             textElement.value = '';
    //             textElement.value = value;
    //         }, 0);
    //     }
    // }

    // escapeKey(event) {
    //     if (this.editMode.get()) {
    //         // shift-tab not working
    //         //this.text.reset();
    //         this.editMode.set(false);
    //         event.preventDefault();
    //     }
    // }

    // onClick(event) {
    //     console.log('click', this);
    //     this.parentStream().focusId(this._id());
    //     //this.focus.setFocused(this);
    //     event.preventDefault();
    // }

    // isFocused(){
    //     return this._id() == this.parentStream().focusId();
    //     // var result = this.focus && this.focus.isFocused(this);
    //     // console.log('isFocused', result);
    //     // return result;
    // }

    // onDblClick(event) {
    //     //this.openTarget();
    //     event.preventDefault();
    // }

    // openTarget() {
    //     var id = this._id();
    //     if (id) {
    //         Router.go('quips', { quipId: id });
    //         var parent: any = this.parent();
    //         parent.quipId(id);
    //     }
    // }

    // firstChild() {
    //     return Quips.findOne({ parentId: this._id.get() });
    // }
}


Template['quipView'].viewmodel(function(context){
    return new QuipView(context);
});
