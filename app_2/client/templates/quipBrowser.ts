class QuipBrowser extends FocusContainer {

    focusId: Reactive<string> = null; 
    quipId: Reactive<string> = null;
    
    constructor(context: any){
        super();
        
    }

    onCreated(){
        this.quipId(Router.current().params.quipId);
    }

    onRendered() {
        
        // initialize focus navigation
        this.init();
        
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
        console.log('browser.quipId', this.quipId());
        return Quips.findOne(this.quipId());
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


