/* eslint-disable no-param-reassign */
import { usePersistFn } from 'ahooks';
import React, { useContext, useState } from 'react';
import type { Stores } from '.';

interface BaseModelInterface {
  state?: Record<string | number, unknown>;
}

export class BaseModel implements BaseModelInterface {
  state = {};
  getState: <T extends keyof Stores>(namespace: T) => Stores[T]['state'] = namespace =>
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    stores[namespace].state;

  getEffects: <T extends keyof Stores>(namespace: T) => Omit<Stores[T], 'state' | 'getState'> = (
    namespace,
  ) => {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    const { state, getState, ...effects } = stores[namespace];
    return effects;
  };

  update: <T extends keyof Stores>(namespace: T, store: Partial<Stores[T]['state']>) => void = () => {};

  clear: <T extends keyof Stores>(namespace: T) => void = () => {};
}


export type UpdateFn = <T extends keyof Stores>(
  namespace: T,
  obj: Partial<Stores[T]['state']>,
) => void;

export type ClearFn = (namespace: keyof Stores) => void;

function getStateFromStores<T extends keyof Stores>(models: Stores): Record<T, Stores[T]['state']> {
  const res = {} as Record<T, Stores[T]['state']>;
  Object.entries(models).forEach(([key, value]) => {
    res[key] = value.state;
  });
  return res;
}

export default function createStore(models: Stores) {
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
    const clear = usePersistFn((type: keyof Stores) => {
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
        model.getState = <T extends keyof Stores>(namespace: T) => getState()[namespace];
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

  const useStoreState = <P extends keyof Stores>(
    namespace: P,
  ): [Stores[P]['state'], (state: Partial<Stores[P]['state']>) => void] => {
    const { stores, update } = useContext(StoreContext);
    const setState = usePersistFn((newState: Partial<Stores[P]['state']>) => {
      update(namespace, newState);
    });
    return [stores[namespace], setState];
  };

  const useStoreEffects = <P extends keyof Stores>(namespace: P) => {
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
