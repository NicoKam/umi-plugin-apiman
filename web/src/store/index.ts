import { Model1, Model2, Api } from './api';
import createStore from './redook';

export type Stores = {
  model1: Model1;
  model2: Model2;
  api: Api;
};

const models: Stores = {
  model1: new Model1(),
  model2: new Model2(),
  api: new Api(),
};

const store = createStore(models);

export type Models = typeof models;

export default store;

export const { StoreProvider, context, useStoreState, useStoreDispatcher, useStoreEffects } = store;
