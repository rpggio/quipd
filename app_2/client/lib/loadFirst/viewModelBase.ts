


abstract class ViewModelBase implements ViewModelImpl {
    
    vmId: number;
    parent: () => ViewModelImpl;     
    children: (arg?: string|ViewModelPredicate) => any;
    templateInstance: Blaze.TemplateInstance;
    data: () => any;
       
}

this.ViewModelBase = ViewModelBase;