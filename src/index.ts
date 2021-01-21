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

  
  api.onGenerateFiles(() => {
    api.writeTmpFile({
      path: 'any.ts',
      content: 'export default "asd";',
    });
  });
};
