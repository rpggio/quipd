
interface Focusable extends ViewModelImpl {
    isFocused : Reactive<boolean>;
}

interface FocusStructure extends ViewModelImpl {
    getFirstFocusable(): Focusable;
    getNextFocusable(current: Focusable, direction: Direction): Focusable;
}

abstract class FocusContainer {

    static IsFocusStructure(obj: any): boolean {
        return obj.hasOwnProperty('getNextFocusable');
    }

    currentFocus: Reactive<Focusable>;

    constructor(){
         this.currentFocus = null;
    }

    public onCreated() {
        
    }

    public init() {
        this.focusTop();
    }

    public focusTop() {
        var self: any = this;
        ViewModelHelper.find(self,
            vm => {
                if (FocusContainer.IsFocusStructure(vm)) {
                    var structure = <FocusStructure>vm;
                    var focusable = structure.getFirstFocusable();
                    if (focusable) {
                        this.currentFocus(focusable);
                        return true;
                    }
                }
            });
    }

    public focusUp() {
        this.changeFocus(Direction.Up);
    }

    public focusDown() {
        this.changeFocus(Direction.Down);
    }

    public focusLeft() {
        this.changeFocus(Direction.Left);
    }

    public focusRight() {
        this.changeFocus(Direction.Right);
    }

    private changeFocus(direction: Direction) {
        var current = this.currentFocus();

        if (!current) {
            return;
        }

        var structure: FocusStructure = this.findFocusStructure(current);
        if (structure) {
            var focusTo: Focusable = structure.getNextFocusable(current, direction);
            if (focusTo) {
                current.isFocused(false);
                focusTo.isFocused(true);
                this.currentFocus(focusTo);
            }
        }
    }

    private findFocusStructure(start: Focusable): FocusStructure {
        var current: ViewModelImpl = start;
        while (current && !FocusContainer.IsFocusStructure(current)) {
            current = current.parent();
        }
        return <FocusStructure>current;
    }
}

enum Direction { Up, Right, Down, Left };

class ViewModelHelper {
    static find(viewModel: ViewModelImpl,
        criteria: (element: ViewModelImpl) => boolean): ViewModelImpl {
        var current: ViewModelImpl = viewModel;
        if (criteria(current)) {
            return current;
        }
        var children = current.children();
        for (var i = 0, len = children.length; i < len; i++) {
            var child = children[i];
            var found = ViewModelHelper.find(child, criteria);
            if (found) {
                return found;
            }
        }
    }
}

class FocusNav {

    public static next(parent: ViewModelImpl, name?: string, from?: ViewModelImpl) 
        : Focusable 
    {
        return FocusNav.step(parent, true, name, from);
    }
    
    public static prev(parent: ViewModelImpl, name?: string, from?: ViewModelImpl) 
        : Focusable 
    {
        return FocusNav.step(parent, false, name, from);
    }
    
    private static step(parent: ViewModelImpl, forward: boolean, 
        name?: string, from?: ViewModelImpl) 
        : Focusable 
    {
        // todo: check that children really are focusable
        var children = <Focusable[]>parent.children(name);
        
        if(!children.length){
            return null;   
        }
        
        if(from == null){
            if(forward){
                return children[0];
            }
            else {
                return children[children.length - 1];
            }
        }

        var previous: Focusable;
        for(var i = 0, c = children.length; i < c; i++){
            var child = children[i];
            
            if(forward && previous.vmId == from.vmId){
                return child;
            }
            
            if(!forward && child.vmId == from.vmId){
                return previous
            }
            
            previous = child; 
        }
        
        return null;
    }  
}

this.FocusContainer = FocusContainer;
this.FocusNav = FocusNav;

//ViewModel.mixin({ FocusContainer: new FocusContainer() });
