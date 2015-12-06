/// <reference path="../../typings/app.ts" />

interface QuipData {
  _id?: string;
  text: string;
  createdAt: Date;
  updatedAt?: Date;
}

declare var Quips: Mongo.Collection<QuipData>;
Quips = new Mongo.Collection<QuipData>('quips');