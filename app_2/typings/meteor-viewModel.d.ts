
interface ReactiveValue<T>{
    () : T;
    (T);
}

declare class ReactiveArray<T> extends Array<T> {
    depend();
    list(): Array<T>;
}

declare type ViewModelPredicate = (childVm: IViewModel) => boolean;

interface IViewModel {
    vmId: number;
    parent(): IViewModel;
    children(): IViewModel[];
    children(name: string): IViewModel[];
    children(predicate: ViewModelPredicate): IViewModel[];
    templateInstance: Blaze.TemplateInstance;
    data(): any;
}

interface ViewModelStatic{
    mixin(mapping: Object);
    persist: boolean;
}

declare var ViewModel: ViewModelStatic;