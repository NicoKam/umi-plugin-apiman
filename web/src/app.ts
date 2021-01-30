import locale from './parseLocale';

export const dva = {
  config: {
    onError(err: ErrorEvent, next, { effectArgs, key }) {
      err.preventDefault();
      console.error('Error while dispatching effect:', key);
      effectArgs[0].__dva_reject(err);
    },
  },
};

export { locale };
