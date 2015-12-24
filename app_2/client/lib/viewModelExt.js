
// Template.prototype.viewmodel = function(name, definition, options) {
    
//     // Name argument may be omitted
//     if (_.isObject(name))
//       options = definition, definition = name, name = this.viewName;

//     let id = ViewModel.uid();

//     this.onCreated(function () {
//       let template = this.view.template;

//       // If the helper hasn't been registered globally
//       if (!ViewModel.is_global) {
//         // Register the Blaze bind helper on this template
//         template.helpers({
//           [ViewModel.helperName]: ViewModel.bindHelper
//         });
//       }
    
//       let vm = this[ViewModel.viewmodelKey];

//       // Create new viewmodel instance on view or add properties to existing viewmodel
//       if (!(vm instanceof ViewModel)) {
//         //vm = new ViewModel(this.view, name, id, definition, options);
//         vm = definition();
//         vm._id(id);
//       }
//       else {
//         throw "don't know what to do here";
//         if (name !== this.viewName){
//           vm.name(name);
//         }

//         //vm.addProps(definition);
//       }
//     });
    
// };