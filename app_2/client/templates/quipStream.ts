
class QuipStream {

    mixin = 'focus';
    quipId = null;
    quipEditRef;
    children;
    focusId: ReactiveVar<string>;

    constructor() {
        this.focusId = null;
    }

    onCreated(){
        this.quipId(Router.current().params.quipId);
    }

    onRendered() {
        //this.quipEditRef.focused(true);
    }

    autorun = [
        function(): void {
            this.quipId.depend();
            //this.quipEditRef.focused(true);
        }
        // ,
        // function(): void {
        //     this.children = this.children();
        // },
        // function(): void {
        //     if(this.children){
        //         this.children.depend();
        //     }
        // }
    ]
        
    parentId() {
        var thisQuip = this.thisQuip();
        return thisQuip && thisQuip.parentId;
    }

    parentQuip() {
        return Quips.findOne(this.parentId());
    }

    thisQuip() : QuipData {
        var quipId = this.quipId();
        return quipId && Quips.findOne(quipId);
    } 

    childQuips() {
        return Quips.find({ parentId: this.quipId() });
    }

    onShiftTab() {
        var parentId = this.parentId();
        if (this.quipId() != parentId) {
            Router.go('quips', { quipId: parentId });
            this.quipId(parentId);
        }
    }

}

Template['quipStream'].viewmodel(new QuipStream());
