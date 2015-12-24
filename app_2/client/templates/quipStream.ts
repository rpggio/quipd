class QuipStream extends ViewModelBase {

    focusId: Reactive<string> = null; 
    quipId: Reactive<string> = null;
    
    //focus = FocusController.instance; 

    constructor(context: any){
        super();
        console.log('QuipStream.ctor', context);
    }

    // onCreated(){
    //     //this.quipId(Router.current().params.quipId);
    // }

    onRendered(x) {
        //this.quipEditRef.focused(true);
    }
    
    autorun = [
        function() {
            console.log(this.focusId());
        }
        , function() {
            console.log(this.children());
        }
    ];

    // autorun = [
    //     function(): void {
    //         this.quipId.depend();
    //         //this.quipEditRef.focused(true);
    //     }
    // ];
    
    // focusDown(){
    //     console.log('focusDown', this);
    //     //var focusId = this.focus.focusId();
    //     var focusId = this.focusId.get();
    //     if(!focusId){
    //         return;
    //     }
    //     var focused = Quips.findOne(focusId);
    //     if(focused){
    //         console.log('focused', focused);
    //     }
    // }
    
    // parentId() {
    //     var thisQuip = this.thisQuip();
    //     return thisQuip && thisQuip.parentId;
    // }

    // parentQuip() {
    //     return Quips.findOne(this.parentId());
    // }

    // thisQuip() : QuipData {
    //     var quipId = this.quipId.get();
    //     return quipId && Quips.findOne(quipId);
    // } 

    quips() {
        return Quips.find({parentId: null});
    }

    // onShiftTab() {
    //     var parentId = this.parentId();
    //     if (this.quipId.get() != parentId) {
    //         Router.go('quips', { quipId: parentId });
    //         this.quipId.set(parentId);
    //     }
    // }

}

// Template['quipStream'].onRendered(function (x) {
//   console.log(this, x); 
// });

Template['quipStream'].viewmodel(
    function(context) { return new QuipStream(context); }
);

