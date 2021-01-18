import { IApi } from 'umi';

export default (api: IApi) => {
  api.describe({
    key: 'apiman',
    config: {
      schema(joi) {
        return joi.object();
      },
    },
  });

  
};
