// Type definitions for ManuelDeLeon/viewmodel
// Project: https://viewmodel.meteor.com


interface ViewModelStatic {
    mixin(options: any);
}

interface IViewModel {   
    vmId: number;
    parent(): IViewModel;
    children(name?: string): IViewModel[];
    templateInstance: Blaze.TemplateInstance;
    data();
}

// declare function reactive<T>(): T;
// declare function reactive<T>(value: T): void;

interface ReactiveVarStatic {
    new<T>(initialValue: T): ReactiveVar<T>;
}

interface ReactiveVar<T> {
    (): T; 
    (value: T);
    reset();
}

declare var ReactiveVar: ReactiveVarStatic;
    
declare var ViewModel: ViewModelStatic;
    
declare module "viewmodel" {
    export = ViewModel;
}