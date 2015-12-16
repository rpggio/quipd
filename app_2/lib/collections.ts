

interface QuipData {
  _id?: string;
  text: string;
  createdAt: Date;
  updatedAt?: Date;
  parentId: string;
}

declare var Quips: Mongo.Collection<QuipData>;
Quips = new Mongo.Collection<QuipData>('quips');
