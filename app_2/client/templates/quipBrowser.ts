class QuipBrowser extends FocusContainer {

    pageQuipId: Reactive<string> = null;
    
    constructor(context: any){
        super();
        
    }

    onCreated(){
        this.pageQuipId(Router.current().params.quipId);
    }

    onRendered() {
        
        // initialize focus navigation
        this.init();
        
        // catch navigation events at document level
        $(document).keydown(e => {
            switch(e.which){
                case KeyCodes.ArrowDown:
                    this.focusDown();
                    return false;
                case KeyCodes.ArrowUp:
                    this.focusUp();
                    return false;
            }
            return true;
        });
    }
      
    // thisQuip() : QuipData {
    //     var quipId = this.quipId.get();
    //     return quipId && Quips.findOne(quipId);
    // } 

    quip() {
        return Quips.findOne(this.pageQuipId());
    }
    
    quips(){
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

Template['quipBrowser'].viewmodel(
    function(context) { return new QuipBrowser(context); }
);


