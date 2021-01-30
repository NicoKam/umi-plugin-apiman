const req = require.context('../pages', true, /\/locales\/en-US.js/);
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
  title: 'Title',
  ...allLocalesInPage,
};
