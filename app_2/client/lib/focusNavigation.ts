
interface Focusable extends IViewModel {
    isFocused : ReactiveVar<boolean>;
}

interface FocusStructure extends IViewModel {
    getFirstFocusable(): Focusable;
    getNextFocusable(current: Focusable, direction: Direction): Focusable;
}

class FocusContainer {

    static IsFocusStructure(obj: any): boolean {
        return obj.hasOwnProperty('getNextFocusable');
    }

    currentFocus: any = null;

    private currentFocus_get(): Focusable {
        return this.currentFocus();
    }

    private currentFocus_set(value: Focusable) {
        this.currentFocus(value);
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
                        this.currentFocus_set(focusable);
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
        var current = this.currentFocus_get();

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
        var current: IViewModel = start;
        while (current && !FocusContainer.IsFocusStructure(current)) {
            current = current.parent();
        }
        return <FocusStructure>current;
    }
}

enum Direction { Up, Right, Down, Left };

class ViewModelHelper {
    static find(viewModel: IViewModel,
        criteria: (element: IViewModel) => boolean): IViewModel {
        var current: IViewModel = viewModel;
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

this.FocusContainer = FocusContainer;

ViewModel.mixin({ FocusContainer: new FocusContainer() });
