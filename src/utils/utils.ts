import fs from 'fs';
import Joi from '@hapi/joi';
import joi2Types from 'joi2types';

// example for react-router-config
const schema = Joi.array().items(
  Joi.object({
    path: Joi.string().description('Any valid URL path'),
    component: Joi.string().description('A React component to render only when the location matches.'),
    redirect: Joi.string().description('navigate to a new location'),
    exact: Joi.boolean().description(
      'When true, the active class/style will only be applied if the location is matched exactly.',
    ),
  }).unknown(),
);

(async () => {
  const types = await joi2Types(schema, {
    bannerComment: '/** comment for test */',
    interfaceName: 'IRoute',
  });
  console.log('types', types);
})();

const { readFile } = fs.promises;

export const readFileJson = async (path: string) => {
  const file = await readFile(path);
  try {
    return JSON.parse(file.toString());
  } catch (e) {
    console.error(e);
    throw new Error(`【${path}】不是标准的JSON`);
  }
};

const RequestParamSchema = Joi.object({
  type: Joi.string().pattern(/(string|number|boolean)/),
});

/* api-json 的标准格式 */
const apiJsonSchema = Joi.object({
  // 继承配置 支持 string/string[]
  extends: [Joi.string(), Joi.array().items(Joi.string())],
  // api 配置
  api: Joi.object().pattern(
    /(GET|POST|PUT|DELETE|OPTIONS|TRACE|PATCH)\|[a-zA-Z0-9/_-]+/,
    Joi.object({
      // 接口描述
      description: Joi.string(),
      // 额外的 headers
      headers: Joi.object(),
      params: Joi.object(),
    }),
  ),
  config: Joi.object(),
});
