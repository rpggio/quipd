
interface QuipData {
  _id: string;
  text: string;
  createdAt: Date;
  updatedAt: Date;
  parentId: string;
}

class Quip implements QuipData {
    
    _id: string;
    text: string;
    createdAt: Date;
    updatedAt: Date;
    parentId: string;
    
	constructor(data: QuipData){
        _.extend(this, data);
    }
    
    next(){
        Quips.findOne(
            {
                parentId: this.parentId,
                _id: {$gt: this._id}
            }, 
            {sort: {_id:1}}
        );
    }
}

this.Quip = Quip;