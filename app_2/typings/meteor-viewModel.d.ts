// declare class ViewModel {   
    
//     name(): string;
//     name(value: string);
    
//     option(name: string): any;
//     option(name: string, new_value: any);
    
//     templateInstance: Blaze.TemplateInstance;
    
//     getData(): Object;
    
//     serialize(): string;
//     deserialize(value: Object);
    
//     reset(): void;

//     // navigation

//     parent(name?: string): ViewModel;

//     child(name?: string, index?: number): ViewModel;
//     children(name?: string): ViewModel[];

//     ancestor(name?: string, index?: number, depth?: number): ViewModel;
//     ancestors(name?: string, depth?: number): ViewModel[];

//     descendants(name?: string, depth?: number): ViewModel[];
//     descendant(name?: string, index?: number, depth?: number): ViewModel;

//     // static methods

//     static registerHelper(name: string);
    
//     find(name?: string): ViewModel[];
//     findOne(name?: string, index?: number): ViewModel;

//     nexuses(name?: string): Nexus[];    
// } 

// declare class Property<T> {
//     constructor(vm: ViewModel, key: string, init_value: any)
    
//     get(): T;
//     set(value: T);
    
//     reset();
    
//     nonreactive(): T;
//     nonreactive(value: T);
// }

// interface Nexus{
//     getProp(): Property<any>;
// }

// declare module "viewmodel" {
//     export = ViewModel;
// }

interface Reactive<T>{
    () : T;
    (T);
}

declare type ViewModelPredicate = (childVm: ViewModelImpl) => boolean;

interface ViewModelImpl {
    vmId: number;
    parent(): ViewModelImpl;
    children(): ViewModelImpl[];
    children(name: string): ViewModelImpl[];
    children(predicate: ViewModelPredicate): ViewModelImpl[];
    templateInstance: Blaze.TemplateInstance;
    data(): any;
}

interface ViewModelStatic{
    mixin(mapping: Object);
    persist: boolean;
}

declare var ViewModel: ViewModelStatic;