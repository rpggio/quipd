class QuipBrowser extends FocusContainer {

    openQuipId: Reactive<string> = null;
    
    constructor(context: any){
        super();
        
    }

    onCreated(){
        this.openQuipId(Router.current().params.quipId);
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
        return Quips.findOne(this.openQuipId());
    }
    
    quips(){
        return Quips.find({parentId: null});
    }

    public getNextFocusable(source: Focusable|any, direction: Direction)
        : Focusable {

        if(this.openQuipId()) {
            // can only navigate upwards to top element
            return direction === Direction.Up
                ? this.children('quipView')[0]
                : null;
        }

        // if no selection, or selection is root quip
        if(!source || !source.parentId()) {
            switch(direction){
                case Direction.Up:
                    return FocusNav.getAdjacent(
                        this.children('quipView'), source, false);
                case Direction.Down:
                    return FocusNav.getAdjacent(
                        this.children('quipView'), source, true);
            }
        }
        
        return null;
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


