
class QuipStream extends FocusContainer {

    mixin = 'focus';
    quipId = null;
    quipEditRef;

    onCreated(){
        this.quipId(Router.current().params.quipId);
    }

    onRendered() {
        this.quipEditRef.focused(true);
    }

    autorun() {
        this.quipId.depend();
        this.quipEditRef.focused(true);
    }
        
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
