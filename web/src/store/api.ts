import type { Stores } from '.';
import type { ApiJson } from '../def.d';
import { BaseModel } from './redook';

export default class Api extends BaseModel<Stores> {
  state = {
    api: {} as ApiJson,
  };

  apiEffect = async () => {
    const effects = this.getEffects('model2');
    await effects.testEffect('test');
  };
}
