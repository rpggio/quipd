
declare var Quips: Mongo.Collection<QuipData>;

Quips = new Mongo.Collection<QuipData>('quips');

// Quips = new Mongo.Collection<QuipData>('quips', 
// 	{
// 		transform: (data) => new Quip(data)
//  	});
