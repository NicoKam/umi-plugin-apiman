import fs from 'fs';
import Joi from '@hapi/joi';
import api from '../api.json';
// import joi2Types from 'joi2types';

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

const variableRegExp = /[a-zA-Z0-9/_-]+/;

/* 基础的参数类型 */
const BaseParamSchema = Joi.alternatives()
  .try(
    Joi.object({
      type: Joi.string().pattern(/(string|number|boolean)/),
      description: Joi.string(),
      required: Joi.boolean(),
    }),
    Joi.object({
      type: Joi.string().pattern(/(object|array)/),
      description: Joi.string(),
      required: Joi.boolean(),
      properties: Joi.object().pattern(variableRegExp, Joi.link('#param')).required(),
    }),
  )
  .id('param');

/* api-json 的标准格式 */
const apiJsonSchema = Joi.object({
  // 继承配置 支持 string/string[]
  extends: [Joi.string(), Joi.array().items(Joi.string())],
  // api 配置
  api: Joi.object().pattern(
    // 接口 method | path
    /(GET|POST|PUT|DELETE|OPTIONS|TRACE|PATCH)\|[a-zA-Z0-9/_-]+/,
    Joi.object({
      // 自定义接口名
      serviceName: Joi.string().pattern(variableRegExp),
      // 接口描述
      description: Joi.string(),
      // 额外的 headers
      headers: Joi.object(),
      // 参数格式
      params: Joi.object().pattern(variableRegExp, BaseParamSchema),
      // 响应格式
      response: BaseParamSchema,
    }),
  ),
  config: Joi.object(),
});

const validateResult = apiJsonSchema.validate(api);
// const validateResult = BaseParamSchema.validate({
//   type: 'object',
//   properties: {
//     total: {
//       type: 'string',
//       description: '数据总量',
//     },
//     list: {
//       type: 'array',
//       description: '用户列表',
//     },
//   },
// });
console.log(JSON.stringify(validateResult, null, 2));
