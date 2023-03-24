import { makeAutoObservable } from "mobx";

export default class NewSavingSpendingCategory {
  name: string;
  forecast: number;
  comment: string;

  constructor(name: string, forecast: number, comment: string) {
    makeAutoObservable(this);

    this.name = name;
    this.forecast = forecast;
    this.comment = comment;
  }
}
