

interface Focusable extends ViewModelImpl {
    isFocused : Reactive<boolean>;
    focusIndex: Reactive<number>;
}

interface FocusStructure extends ViewModelImpl {
    getNextFocusable(source: Focusable|any, direction: Direction): Focusable;
}

class FocusNav{
    static getAdjacent(items: any[], from: any, forward: boolean){
        let len = items.length;
        
        if(len === 0){
            return null;
        }
        
        if(len === 1){
            let item = items[0];
            return from === item
                ? null
                : item;
        }
        
        let previous: any;
        for(let i = 0; i < len; i++){
            var child = items[i];
            
            if(forward && previous === from){
                return child;
            }
            
            if(!forward && child === from){
                return previous
            }
            
            previous = child; 
        }
        return null;
    }
}

/**
 * Implements focus navigation operations for use with contained elements.
 * Contained elements should implement Focusable and/or FocusStructure
 * to utilize navigation.
 */
abstract class FocusContainer 
    extends ViewModelBase
    implements FocusStructure {

    static asFocusable(element: ViewModelImpl): Focusable {
        return element.hasOwnProperty('isFocused')
            ? <Focusable>element
            : null;
        ;
    }

    static asFocusStructure(element: ViewModelImpl): FocusStructure {
        return element.hasOwnProperty('getNextFocusable')
            ? <FocusStructure>element
            : null;
        ;
    }

    currentFocus: Reactive<Focusable> = null;

    constructor(){
        super();
    }

    public abstract getNextFocusable(source: Focusable|any, direction: Direction): Focusable;

    public init() {
        this.templateInstance.autorun(() => {
           if(this.children) {
                this.children().depend();
                if(!this.currentFocus()) {
                    this.focusInitial(); 
                }
           }
        });
    }

    public focusInitial(direction = Direction.Down) {
        console.log('focusInitial', direction);

        let initial = <Focusable>ViewModelHelper.findDownward(this,
            vm => {
                let focusable = FocusContainer.asFocusable(vm);
                if(focusable) {
                    console.log('returning focusable', focusable);
                    return focusable;
                }
                let structure = FocusContainer.asFocusStructure(vm);
                if(structure){
                    let next = structure.getNextFocusable(null, direction);
                    console.log('returning focusable', next);
                    return next;
                }
                return null;
            });
        if(initial){
            this.setFocus(initial);
        }
        return;
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

    /**
     * Walk up tree to find a structure node that knows what 
     * the next focusable should be. Once a focusable is found,
     * set focus to that element.  
     */
    private changeFocus(direction: Direction) {
        //console.log('changeFocus', Direction[direction]);
        
        let current = this.currentFocus();
        
        if(!current){
            this.focusInitial(direction);
        }

        // Start with current as both sourceNode and decisionNode
        let sourceNode: ViewModelImpl = current;
        let decisionNode: ViewModelImpl = current;
        
        do {
            // Evaluate decision node
            let structure: FocusStructure = FocusContainer.asFocusStructure(decisionNode);
            if(structure){
                let next = structure.getNextFocusable(sourceNode, direction);
                if(next){
                    
                    // Navigate downwards here to find lowest-level match?
                    // This can mean jumping from high-level node 
                    // directly to a deep node..  
                    
                    // Set focus to the final
                    this.setFocus(next);
                    return;
                }
            }
            
            // If first cycle
            if(sourceNode == decisionNode){
                // walk the decision node upwards
                decisionNode = sourceNode.parent();
            } else {
                // walk both decision and source nodes upwards
                sourceNode = decisionNode; 
                decisionNode = FocusContainer.asFocusStructure(
                    decisionNode.parent());
            }
        }
        while(decisionNode && sourceNode);
    }

    private setFocus(to: Focusable){
        //console.log('setting focus', to);
        
        var current = this.currentFocus();
        if(current){
            current.isFocused(false);
        }
        if(to) {
            to.isFocused(true);
            this.currentFocus(to);
        }
    }
}

enum Direction { Up, Right, Down, Left };

class ViewModelHelper {
    static findDownward(viewModel: ViewModelImpl,
        selector: (element: ViewModelImpl) => ViewModelImpl): ViewModelImpl {
        let current: ViewModelImpl = viewModel;
        let selected = selector(current);
        if (selected) {
            return selected;
        }
        let children = current.children();
        for (var i = 0, len = children.length; i < len; i++) {
            var child = children[i];
            var found = ViewModelHelper.findDownward(child, selector);
            if (found) {
                return found;
            }
        }
    }
}

this.FocusNav = FocusNav;
this.FocusContainer = FocusContainer;
this.Direction = Direction;
