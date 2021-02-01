import type { ApiJson } from '@/def';
import { defineModel } from './redook';

export default defineModel({
  state: {
    value1: '1',
    value2: '2',
    api: null as ApiJson | null,
  },
  effects: () => ({
    fnA: async (params: string) => {
      console.warn('fnA called', params);
    },
  }),
});
