Template.quips.viewmodel({
	newText: '',
	quips: function() {
		return Quips.find();
	},
	addQuip: function() {
		var quip = {
			text: this.newText()
		};
		Quips.insert(quip);
		this.newText('');
	},
	events: {
	    'keydown .add-quip': function(event, templateInstance) {
	    	switch (event.which) {
		        case 13:   // enter
		          this.addQuip();
		          return;
	    	}
	   	}
    }
});
