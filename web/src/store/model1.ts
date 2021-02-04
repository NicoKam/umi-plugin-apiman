import type { Stores } from '.';
import { BaseModel } from './redook';

export default class Model1 extends BaseModel<Stores> {
  state = {
    value1: '123',
    value2: '234',
    type: 'A' as 'A' | 'B' | 'C',
  };
}
