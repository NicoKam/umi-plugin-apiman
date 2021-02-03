import type { ApiJson } from '../def.d';
import { BaseModel } from './redook';

export class Model1 extends BaseModel {
  state = {
    value1: '123',
    value2: '234',
  };
}

export class Model2 extends BaseModel {
  state = {
    value3: '123',
    value4: '234',
  };

  fn = async () => {
    const { value1 } = this.getState('model1');
    console.warn(value1);
  };
}

export class Api extends BaseModel {
  state = {
    api: {} as ApiJson,
  };
}
