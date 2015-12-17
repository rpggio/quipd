// ViewModel.mixin({
//     focus: {

//         focusFirst: function() {
//             var tabbables = $(":tabbable").first().focus();
//         }

//         , focusPrev: function() {
//             this.changeFocus(false);
//         }

//         , focusNext: function() {
//             this.changeFocus(true);
//         }

//         , changeFocus: function(forward) {
//             var focused = $(document.activeElement);
//             if(!focused.length){
//                 return;
//             }
//             var tabbables = $(":tabbable"); 
//             var currentIdx = tabbables.index(focused);
//             if(currentIdx < 0) {
//                 return;
//             }

//             if(forward && currentIdx < tabbables.length - 1){
//                 tabbables.eq(currentIdx + 1).focus();
//                 event.preventDefault();
//             }
//             else if(!forward && currentIdx > 0){
//                 tabbables.eq(currentIdx - 1).focus();
//                 event.preventDefault();
//             }
//         }

//     }
// });