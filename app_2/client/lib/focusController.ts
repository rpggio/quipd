
// class FocusController {
// 	focusId = ViewModel.makeReactiveProperty<string>(null); 
	
// 	static instance = new FocusController();

// 	constructor(){
// 		Tracker.autorun(() => {
// 			console.log(this.focusId());
// 		});
// 	}
	
// 	setFocused(vm: any) {
// 		this.focusId(vm._id());		
// 	}
	
// 	isFocused(vm: any){
// 		var focusId = this.focusId();
		
// 		var result = focusId && vm._id() == focusId;
// 		console.log('isFocused', vm.text(), result);
// 	}
// }

// this.FocusController = FocusController;
