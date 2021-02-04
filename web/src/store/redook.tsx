/* eslint-disable no-param-reassign */
import { usePersistFn } from 'ahooks';
import React, { useContext, useState } from 'react';

type AbstractStores = Record<string, BaseModel>;

interface BaseModelInterface {
  state?: Record<string | number, unknown>;
}

export class BaseModel<S extends AbstractStores = AbstractStores> implements BaseModelInterface {
  state = {};
  getState: <T extends keyof S>(namespace: T) => S[T]['state'] = () => {
    throw new Error('Redook Provider has not been rendered yet.');
  };

  getEffects: <T extends keyof S>(namespace: T) => Omit<S[T], 'state' | 'getState'> = () => {
    throw new Error('Redook Provider has not been rendered yet.');
  };

  update: <T extends keyof S>(namespace: T, store: Partial<S[T]['state']>) => void = () => {};

  clear: <T extends keyof S>(namespace: T) => void = () => {};
}

export default function createStore<S extends AbstractStores>(models: S) {
  type UpdateFn = <T extends keyof S>(namespace: T, obj: Partial<S[T]['state']>) => void;

  type ClearFn = (namespace: keyof S) => void;

  function getStateFromStores<T extends keyof S>(models: S): Record<T, S[T]['state']> {
    const res = {} as Record<T, S[T]['state']>;
    Object.entries(models).forEach(([key, value]) => {
      res[key] = value.state;
    });
    return res;
  }

  const initialState = getStateFromStores(models);
  const StoreContext = React.createContext({
    stores: initialState,
    models,
    update: (() => {}) as UpdateFn,
    clear: (() => {}) as ClearFn,
  });

  let init = false;

  const StoreProvider = (props: { children: React.ReactElement }) => {
    const { children } = props;

    const [state, setState] = useState(() => initialState);

    const getState = usePersistFn(() => state);

    const update = usePersistFn<UpdateFn>((type, obj) => {
      if (type in state) {
        setState({
          ...state,
          [type]: {
            ...state[type],
            ...obj,
          },
        });
      }
    });
    const clear = usePersistFn((type: keyof S) => {
      if (type in state) {
        setState({
          ...state,
          [type]: {
            ...initialState[type],
          },
        });
      }
    });

    if (!init) {
      Object.entries(models).forEach(([key, model]) => {
        model.getState = <T extends keyof S>(namespace: T) => getState()[namespace];
        model.clear = clear;
        model.update = update;
      });
      init = true;
    }

    return (
      <StoreContext.Provider value={{ stores: state, models, update, clear }}>
        {children}
      </StoreContext.Provider>
    );
  };

  const useStoreState = <P extends keyof S>(
    namespace: P,
  ): [S[P]['state'], (state: Partial<S[P]['state']>) => void] => {
    const { stores, update } = useContext(StoreContext);
    const setState = usePersistFn((newState: Partial<S[P]['state']>) => {
      update(namespace, newState);
    });
    return [stores[namespace], setState];
  };

  const useStoreEffects = <P extends keyof S>(namespace: P) => {
    const { models } = useContext(StoreContext);
    const { getState, getEffects, ...effects } = models[namespace];
    return effects;
  };

  const useStoreDispatcher = (): { update: UpdateFn; clear: ClearFn } => {
    const { update, clear } = useContext(StoreContext);
    return {
      update,
      clear,
    };
  };

  return {
    useStoreEffects,
    useStoreDispatcher,
    useStoreState,
    context: StoreContext,
    StoreProvider,
  };
}
