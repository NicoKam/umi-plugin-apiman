import type { Stores } from '.';
import { BaseModel } from './redook';

export default class Model2 extends BaseModel<Stores> {
  state = {
    value3: '123',
    value4: '234',
  };

  testEffect = async (arg: string) => {
    const { value1, type } = this.getState('model1');
    console.warn(value1, type);
  };

  myEffect = async (arg: string) => {
    const model2Effects = this.getEffects('model2');
    model2Effects.testEffect('hahaha');
  };
}
