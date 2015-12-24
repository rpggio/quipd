class QuipView extends ViewModelBase {

    editMode:Reactive<boolean> = null;
    _id:Reactive<string> = null;
    parentId:Reactive<string> = null;
    grandParentId:Reactive<string> = null;
    text:Reactive<string> = null;
    level:Reactive<number> = null;
    
    //context:any;
    
    // _id = ViewModel.makeReactiveProperty<string>(null);
    // text = ViewModel.makeReactiveProperty<string>(null);

    //focus: FocusController; 

    constructor(context) {
        super();
        
        this['_id'] = context._id;
        this['parentId'] = context.parentId;
        
        //this.context = context;
        
        // var helpers = {};
        // for (var prop in this) {
        //     helpers[prop] = function() {
        //         return this[prop];
        //     }
        // }
        // Template["quipView"].helpers(helpers);
    }

    public onCreated() {
        
        // this._id(this.context._id);
        // this.parentId(this.context.parentId);
        
        //this.focus = FocusController.instance;
    }
    
    childQuips() {
        var id = this._id();
        if(id && this.level() < 10){
            return Quips.find({parentId: id});
        }
    }
    
    public onRendered() {
        console.log('rendered', this);
        //this.textareaSetup();
    }

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
