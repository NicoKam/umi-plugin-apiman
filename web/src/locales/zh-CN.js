const req = require.context('../pages', true, /\/locales\/zh-CN.js/);
const allLocalesInPage = req
  .keys()
  .map(req)
  .reduce(
    (result, next) => ({
      ...result,
      ...next.default,
    }),
    {},
  );

export default {
  title: '标题',
  ...allLocalesInPage,
};
