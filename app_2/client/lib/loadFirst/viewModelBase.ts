


abstract class ViewModelBase implements IViewModel {
    
    vmId: number;
    parent: () => IViewModel;     
    children: (arg?: string|ViewModelPredicate) => any;
    templateInstance: Blaze.TemplateInstance;
    data: () => any;
       
}

this.ViewModelBase = ViewModelBase;