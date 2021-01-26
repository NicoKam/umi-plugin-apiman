import fs from 'fs';
import Joi from '@hapi/joi';
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

export const readFileStr = async (path: string) => {
  const file = await readFile(path);
  return file.toString();
};

const variableRegExp = /^[a-zA-Z0-9/_-]+$/;

/* 基础的参数类型 */
const BaseParamSchema = Joi.alternatives()
  .try(
    Joi.object({
      type: Joi.string().pattern(/^(string|number|boolean)$/),
      description: Joi.string(),
      required: Joi.boolean(),
    }),
    Joi.object({
      type: Joi.string().pattern(/^(object|array)$/),
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
    /^(GET|POST|PUT|DELETE|OPTIONS|TRACE|PATCH)\|[a-zA-Z0-9/_-{}]+$/,
    Joi.object({
      // 自定义接口名
      serviceName: Joi.string().pattern(variableRegExp),
      // 接口描述
      description: Joi.string(),
      // 额外的 headers
      headers: Joi.object(),
      // 参数格式
      params: Joi.object().pattern(variableRegExp, BaseParamSchema),
      // 响应类型
      requestType: Joi.string().pattern(/^(json|formData)$/),
      // 响应类型
      responseType: Joi.string().pattern(/^(json|formData|text|blob|arrayBuffer)$/),
      // 响应格式
      response: BaseParamSchema,
      // 异常处理方式
      errorHandler: Joi.string().pattern(/^(throw|ignore)$/),
    }).pattern(/^/, Joi.any()),
  ),
  config: Joi.object(),
});

export async function readApiJson(apiJsonPath: string) {
  const json = await readFileJson(apiJsonPath);
  if (json.error) {
    console.error(`配置文件【${apiJsonPath}】解析失败`);
    throw json.error;
  }
  const validateResult = apiJsonSchema.validate(json);
  return validateResult;
}
