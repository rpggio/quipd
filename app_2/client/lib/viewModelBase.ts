
abstract class ViewModelBase implements ViewModelImpl {   
    vmId: number;
    parent(): ViewModelImpl { return null; };
    children(): ViewModelImpl[] { return null; };
    templateInstance: Blaze.TemplateInstance;
    data(): any { return null; };
    
    constructor(){
        // These will be injected by ViewModel framework. 
        delete(this.parent);
        delete(this.children);
        delete(this.data);
    }
}

this.ViewModelBase = ViewModelBase;
