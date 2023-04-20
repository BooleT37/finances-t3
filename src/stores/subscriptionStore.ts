import type { Subscription as ApiSubscription } from "@prisma/client";
import { groupBy } from "lodash";
import { makeAutoObservable, observable, runInAction, toJS } from "mobx";
import { adaptSubscriptionFromApi } from "~/adapters/subscription/subscriptionFromApi";
import {
  adaptSubscriptionToCreateInput,
  adaptSubscriptionToUpdateInput,
} from "~/adapters/subscription/subscriptionToApi";
import type { ForecastSubscriptionsItem } from "~/types/forecast/forecastTypes";
import { trpc } from "~/utils/api";
import type Category from "../models/Category";
import type Subscription from "../models/Subscription";
import { type SubscriptionFormValues } from "../models/Subscription";
import { type DataLoader } from "./DataLoader";

const subscriptionToItem = (
  subscription: Subscription
): ForecastSubscriptionsItem => ({
  cost: subscription.cost,
  name: subscription.name,
});

export class SubscriptionStore implements DataLoader<ApiSubscription[]> {
  subscriptions = observable.array<Subscription>();

  constructor() {
    makeAutoObservable(this);
  }

  async loadData() {
    return trpc.sub.getAll.query();
  }

  init(subscriptions: ApiSubscription[]) {
    this.subscriptions.replace(subscriptions.map(adaptSubscriptionFromApi));
  }

  get subscriptionsMap() {
    return this.subscriptions.reduce<Record<string, Subscription>>(
      (a, c) => ({ ...a, [c.id]: c }),
      {}
    );
  }

  get formValuesMap() {
    return this.subscriptions
      .map((s) => s.toFormValues)
      .reduce<Record<string, SubscriptionFormValues>>(
        (a, c) => ({ ...a, [c.id]: c }),
        {}
      );
  }

  getById(id: number) {
    return this.subscriptionsMap[id];
  }

  getJsById(id: number) {
    return toJS(this.getById(id));
  }

  getByIdOrThrow(id: number) {
    const found = this.subscriptionsMap[id];

    if (found === undefined) {
      throw new Error(`Can't find subscription by id ${id}`);
    }

    return found;
  }

  getFormValuesByIdOrThrow(id: number) {
    const found = this.formValuesMap[id];

    if (found === undefined) {
      throw new Error(`Can't find subscription by id ${id}`);
    }

    return found;
  }

  get activeSubscriptions() {
    return this.subscriptions.filter((s) => s.active);
  }

  get byCategory(): Record<string, Subscription[]> {
    return groupBy(this.subscriptions, "category.name");
  }

  get activeByCategory(): Record<string, Subscription[]> {
    return groupBy(this.activeSubscriptions, "category.name");
  }

  async add(subscription: Subscription): Promise<void> {
    subscription.active = true;
    const { id } = await trpc.sub.create.mutate(
      adaptSubscriptionToCreateInput(subscription)
    );
    runInAction(() => {
      subscription.id = id;
      this.subscriptions.push(subscription);
    });
  }

  *modify(subscription: Subscription): Generator<Promise<Subscription>> {
    const foundIndex = this.subscriptions.findIndex(
      (e) => e.id === subscription.id
    );
    if (foundIndex !== -1) {
      this.subscriptions[foundIndex] = subscription;
      yield trpc.sub.update
        .mutate({
          id: subscription.id,
          data: adaptSubscriptionToUpdateInput(subscription),
        })
        .then(adaptSubscriptionFromApi);
    } else {
      throw new Error(`Can't find subscription with id ${subscription.id}`);
    }
  }

  *delete(id: number): Generator<Promise<Subscription>> {
    const foundIndex = this.subscriptions.findIndex((e) => e.id === id);
    if (foundIndex === -1) {
      return;
    }
    this.subscriptions.splice(foundIndex, 1);
    yield trpc.sub.delete.mutate({ id }).then(adaptSubscriptionFromApi);
  }

  getSubscriptionsForForecast(
    month: number,
    year: number,
    category: Category | null
  ): ForecastSubscriptionsItem[] {
    return this.activeSubscriptions
      .filter(
        (subscription) =>
          (!category || subscription.category.id === category.id) &&
          subscription.isInMonth(month, year)
      )
      .map(subscriptionToItem);
  }
}

const subscriptionStore = new SubscriptionStore();

export default subscriptionStore;
