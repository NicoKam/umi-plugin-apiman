import { usePersistFn } from 'ahooks';
import React, { useContext, useState } from 'react';

export type UpdateFn<U extends Record<string, Model>> = <T extends Record<string, Model> = U>(
  namespace: keyof T,
  obj: Partial<T[keyof T]['state']>,
) => void;

export type ClearFn<T extends Record<string, Model>> = (namespace: keyof T) => void;

export type ModelEffectsArgs<T extends Record<string, Model>> = {
  update: UpdateFn<T>;
  clear: ClearFn<T>;
  getState: () => Record<string, unknown>;
  getEffects: () => Record<string, EffectFn>;
};

export type EffectFn = (...args: any[]) => Promise<unknown>;

export type ModelEffectsType<T extends Record<string, Model>> = (
  args: ModelEffectsArgs<T>,
) => Record<string, EffectFn>;

export type Model<T extends Record<string, Model> = Record<string, never>> = {
  state: Record<string, unknown>;
  effects: ModelEffectsType<T>;
};

export function defineModel<
  T extends Record<string, Model> = Record<string, never>,
  M extends Model<T> = Model<T>,
>(model: M): M {
  return model;
}

export interface StoreProviderProps {
  children: React.ReactElement;
}

export function pickStates<T extends Record<string, Model>, R = { [P in keyof T]: T[P]['state'] }>(
  obj: T,
): R {
  const res = {} as R;
  Object.entries(obj).forEach(([key, value], index) => {
    res[key] = value.state;
  });
  return res;
}

export function pickEffects<
  T extends Record<string, Model>,
  R = { [P in keyof T]: T[P]['effects'] },
>(obj: T): R {
  const res = {} as R;
  Object.entries(obj).forEach(([key, value], index) => {
    res[key] = value.effects;
  });
  return res;
}
export function pickEffectsObj<
  T extends Record<string, Model>,
  R = { [P in keyof T]: ReturnType<T[P]['effects']> },
>(obj: T, args: Parameters<ModelEffectsType>): R {
  const res = {} as R;
  Object.entries(obj).forEach(([key, value]) => {
    res[key] = value.effects(...args);
  });
  return res;
}

export default function createStore<T extends Record<string, Model>>(models: T) {
  const stateOfModels = pickStates(models);
  const effects = pickEffectsObj(models, []);

  const StoreContext = React.createContext({
    stores: stateOfModels,
    effects,
    update: (() => {}) as UpdateFn<T>,
    clear: (() => {}) as ClearFn<T>,
  });

  const StoreProvider = (props: StoreProviderProps) => {
    const { children } = props;

    const [state, setState] = useState(() => stateOfModels);

    const getState = usePersistFn(() => state);

    const update = usePersistFn<UpdateFn<T>>((type, obj) => {
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
    const clear = usePersistFn((type: keyof T) => {
      if (type in state) {
        setState({
          ...state,
          [type]: {
            ...stateOfModels[type],
          },
        });
      }
    });

    const [effectsHandler] = useState(() => {
      const effects = pickEffectsObj(models, [{ update, getState, clear, getEffects: () => effects }]);
      return effects;
    });

    return (
      <StoreContext.Provider value={{ stores: state, effects: effectsHandler, update, clear }}>
        {children}
      </StoreContext.Provider>
    );
  };

  const useStoreState = <P extends keyof T>(
    namespace: P,
  ): [T[P]['state'], (state: Partial<T[P]['state']>) => void] => {
    const { stores, update } = useContext(StoreContext);
    const setState = usePersistFn((newState: Partial<T[P]['state']>) => {
      update(namespace, newState);
    });
    return [stores[namespace], setState];
  };

  const useStoreEffects = <P extends keyof T>(namespace: P): ReturnType<T[P]['effects']> => {
    const { effects } = useContext(StoreContext);
    return effects[namespace];
  };

  const useStoreDispatcher = (): { update: UpdateFn<T>; clear: ClearFn<T> } => {
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
