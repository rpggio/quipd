
interface FocusableViewModel extends IViewModel {
    isFocused : ReactiveValue<boolean>;
}

class FocusChain {
    
    viewModels: ReactiveArray<IViewModel>;
    
    constructor(viewModels: ReactiveArray<IViewModel>){
        this.viewModels = viewModels;
    }
    
    static fromTemplateTree(root: IViewModel, templateName: string){
        let chain = new ReactiveArray<IViewModel>();
        if(root.templateInstance.view['name'] === templateName){
            chain.push(root);            
        }
        
        let current: IViewModel;
        let visitor = (vm:IViewModel) =>
        {
            if(current.templateInstance.view['name'] === templateName){
                chain.push(root);            
            }
            let children = current.children();
            for(let i = 0, len = children.length; i < len; i++){
                let child = children[i];
                visitor(child);
            } 
        } 
        
        visitor(root);
    }
}