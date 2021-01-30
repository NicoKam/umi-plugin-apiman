/**
 * 国际化问题修复
 * https://iwhale-citybrain.yuque.com/docs/share/9ea867f0-3285-43af-8907-b742c9407cf9?# 《如何为你的项目添加国际化配置（umi@3的国际化实践）》
 */
import { getAllLocales, setIntl, getLocale, history } from 'umi';
import { LANG_CHANGE_EVENT, event } from '@@/plugin-locale/locale';

/* 自动将用户国际化配置转换为当前可用配置 */
function parseLanguage(lang = ''): string {
  const availableLanguages = getAllLocales();
  try {
    // 完全匹配
    if (availableLanguages.includes(lang)) {
      return lang;
    }

    // 前缀匹配
    const matchedLang = availableLanguages.find((aLang = '') => aLang.split('-')[0] === lang.split('-')[0]);
    if (matchedLang) {
      return matchedLang;
    }
  } catch (e) {
    console.error('Error while parse user\'s locale');
    console.error(e);
  }
  return availableLanguages[0] || 'zh-CN';
}

const locale = {
  /* 覆盖 @umijs/plugin-locale 的getLocale逻辑，保证取得的国际化配置，都是当前可用的 */
  getLocale() {
    // 1. 判断urlQuery上是否存在显示指定的locale属性
    const { location } = history;
    const { locale: localeFromUrl } = location.query || {};
    let lang: string | null = localeFromUrl as string;
    if (lang) {
      const parsedLanguage = parseLanguage(lang);
      // 将locale信息暂存
      window.localStorage.setItem('umi_locale', parsedLanguage);
      return parsedLanguage;
    }

    // 2. 判断localStorage中是否存在国际化配置
    lang = window.localStorage.getItem('umi_locale');

    if (lang) {
      return parseLanguage(lang);
    }

    // 3. 从navigator中获取国际化配置
    lang = window.navigator.language;

    return parseLanguage(lang);
  },
  setLocale({ lang, realReload }: { lang?: string; realReload?: boolean }) {
    const localeExp = new RegExp('^([a-z]{2})-?([A-Z]{2})?$');
    if (lang !== undefined && !localeExp.test(lang)) {
      // for reset when lang === undefined
      throw new Error('setLocale lang format error');
    }
    if (getLocale() !== lang) {
      if (typeof window.localStorage !== 'undefined') {
        window.localStorage.setItem('umi_locale', lang || '');
      }

      // 如果 url 中存在 locale 字段，则需要修改 query
      const { location } = history;
      const { locale: localeFromUrl } = location.query || {};

      if (localeFromUrl) {
        history.replace({
          pathname: location.pathname,
          state: location.state,
          hash: location.hash,
          query: {
            ...location.query,
            locale: lang,
          },
        });
      }

      setIntl(lang);
      if (realReload) {
        window.location.reload();
      } else {
        event.emit(LANG_CHANGE_EVENT, lang);
        // chrome 不支持这个事件。所以人肉触发一下
        if (window.dispatchEvent) {
          const event = new window.Event('languagechange');
          window.dispatchEvent(event);
        }
      }
    }
  },
};

export default locale;
