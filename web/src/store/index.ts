import Api from './api';
import Model1 from './model1';
import Model2 from './model2';
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

export const { StoreProvider, context, useStoreState, useStoreDispatcher, useStoreEffects } = store;
