import createStore from './redook';

const models = {};
const store = createStore(models);

export type Models = typeof models;

export default store;

export const { StoreProvider, context, useStoreState, useStoreDispatcher, useStoreEffects } = store;
