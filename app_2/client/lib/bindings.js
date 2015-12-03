var addBinding = ViewModel.addBinding;

addBinding({
    name: 'arrowUp',
    events: {
        'keydown': function(bindArg, event){
            if(event.which == 38 || event.keyCode == 38){
                bindArg.setVmValue(event);
            }
        }
    }
});

addBinding({
    name: 'arrowDown',
    events: {
        'keydown': function(bindArg, event){
            if(event.which == 40 || event.keyCode == 40){
                bindArg.setVmValue(event);
            }
        }
    }
});
