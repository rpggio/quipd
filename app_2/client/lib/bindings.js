var addBinding = ViewModel.addBinding;

var bindKey = function(name, keycode){
    ViewModel.addBinding({
        name: name,
        events: {
            'keydown': function(bindArg, event){
                if(event.which == keycode || event.keyCode == keycode){
                    bindArg.setVmValue(event);
                }
            }
        }
    })    
}

bindKey('backspace', 8);
bindKey('escape', 27);
bindKey('space', 32);
bindKey('arrowUp', 38);
bindKey('arrowDown', 40);
