Template.quips.viewmodel({
	newText: '',
	quips: function() {
		return Quips.find();
	},
	add: function() {
		var quip = {
			text: this.newText()
		};
		Quips.insert(quip);
		this.newText('');
	}
});
