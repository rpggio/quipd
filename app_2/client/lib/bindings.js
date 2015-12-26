var addBinding = ViewModel.addBinding;

var bindKey = function(name, keycode, options){
    ViewModel.addBinding({
        name: name,
        events: {
            'keydown': function(bindArg, event, options){
                console.log('keydown', event.which);
                if(options && options.shiftKey){
                    if(!event.shiftKey) {
                        return;
                    }   
                }
                if(event.which == keycode || event.keyCode == keycode){
                    bindArg.setVmValue(event);
                    return false;
                }
            }
        }
    })    
}

bindKey('backspace', 8);
bindKey('tab', 9);
bindKey('shift-tab', 9, { shiftKey: true});
bindKey('escape', 27);
bindKey('space', 32);
bindKey('arrowUp', 38);
bindKey('arrowDown', 40);
