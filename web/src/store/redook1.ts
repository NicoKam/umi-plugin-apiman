interface BaseModelInterface {
  state?: Record<string | number, unknown>;
}

type Stores = {
  model1: Model1;
  model2: Model2;
};

class BaseModel implements BaseModelInterface {
  state = {};
  protected readonly getState: <T extends keyof Stores>(namespace: T) => Stores[T]['state'] = namespace =>
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    getStateGlobal(namespace).state;
}

class Model1 extends BaseModel {
  state = {
    value1: '123',
    value2: '234',
  };
}

class Model2 extends BaseModel {
  state = {
    value3: '123',
    value4: '234',
  };

  fn = async () => {
    const { value1 } = this.getState('model1');
    console.warn(value1);
  };
}

const stores: Stores = {
  model1: new Model1(),
  model2: new Model2(),
};

function getStateGlobal<T extends keyof Stores>(namespace: T): Stores[T] {
  return stores[namespace];
}
