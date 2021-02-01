import createStore from './redook';
import api from './api';

const store = createStore({
  api,
});

export default store;

export const { StoreProvider, context, useStoreState, useStoreDispatcher, useStoreEffects } = store;
