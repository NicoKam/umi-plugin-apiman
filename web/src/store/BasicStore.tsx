import { usePersistFn } from 'ahooks';
import React, { useState } from 'react';

type DispatchFn<T extends Record<string, HooksType> = Record<string, never>> = (
  type: keyof T,
  action: 'update' | 'reset',
  obj: Partial<T[keyof T]['state']>,
) => void;

type EffectFn = (...args: any[]) => Promise<unknown>;

type HooksEffectsType = (
  dispatch: DispatchFn,
  getState: () => Record<string, unknown>,
  effects: () => Record<string, EffectFn>,
) => Record<string, EffectFn>;

type HooksType = {
  state: Record<string, unknown>;
  effects: HooksEffectsType;
};

function defineHooks<T extends HooksType>(hooks: T): T {
  return hooks;
}

const hooka = defineHooks({
  state: {
    value1: '1',
    value2: '2',
  },
  effects: () => ({
    fnA: async (params: string) => {
      console.warn('fnA called', params);
    },
  }),
});

const hookb = defineHooks({
  state: {
    hoo0: '0',
    hoo3: '3',
  },
  effects: () => ({
    hooFn: async (params: number) => {
      console.warn('hooFn called', params);
    },
  }),
});

export interface StoreProviderProps {
  children: React.ReactElement;
}

function pickStates<T extends Record<string, HooksType>, R = { [P in keyof T]: T[P]['state'] }>(
  obj: T,
): R {
  const res = {} as R;
  Object.entries(obj).forEach(([key, value], index) => {
    res[key] = value.state;
  });
  return res;
}

function pickEffects<T extends Record<string, HooksType>, R = { [P in keyof T]: T[P]['effects'] }>(
  obj: T,
): R {
  const res = {} as R;
  Object.entries(obj).forEach(([key, value], index) => {
    res[key] = value.effects;
  });
  return res;
}
// function pickEffectsObj<
//   Arg extends Parameters<HooksEffectsType>,
//   T extends Record<string, HooksType>,
//   R = { [P in keyof T]: ReturnType<T[P]['effects']> },
// >(obj: T, args: Arg): R {
//   const res = {} as R;
//   Object.entries(obj).forEach(([key, value]) => {
//     res[key] = value.effects(...args);
//   });
//   return res;
// }

export default function createStore<T extends Record<string, HooksType>>(hooks: T) {
  const stateOfHooks = pickStates(hooks);
  // const effectsOfHooks = pickEffects(hooks);

  const StoreContext = React.createContext(stateOfHooks);

  const StoreProvider = (props: StoreProviderProps) => {
    const { children } = props;

    const [state, setState] = useState(() => stateOfHooks);

    const getState = usePersistFn(() => state);

    const dispatch = usePersistFn<DispatchFn<T>>((type, action, obj) => {
      if (type in state) {
        if (action === 'update') {
          setState({
            ...state,
            [type]: {
              ...state[type],
              ...obj,
            },
          });
        } else if (action === 'reset') {
          setState({
            ...state,
            [type]: {
              ...stateOfHooks[type],
            },
          });
        }
      }
    });

    const [effectsHandler] = useState(() => {
      const effectsHandler = pickEffects(hooks);
      
      return effectsHandler;
    });

    return <StoreContext.Provider value={state}>{children}</StoreContext.Provider>;
  };
}
