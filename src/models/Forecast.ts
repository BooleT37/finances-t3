import type Decimal from "decimal.js";
import { makeAutoObservable } from "mobx";
import type Category from "./Category";

class Forecast {
  constructor(
    public category: Category,
    public month: number,
    public year: number,
    public sum: Decimal,
    public comment?: string
  ) {
    makeAutoObservable(this);
  }
}

export default Forecast;
