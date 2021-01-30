import { camelCase, paramCase, pascalCase } from 'change-case';
import ejs from 'ejs';
import fs from 'fs';
import { resolve } from 'path';
import prettier from 'prettier';
import { ApiJson, ParamSchema, ResponseType } from './ApiJson';
import { readApiJson, readFileStr } from './utils';

const { writeFile } = fs.promises;

const indent = '  ';

/**
 * 根据参数描述，生成 TypeScript 声明
 * @param params 参数描述
 * @param level 缩进级别
 */
function generateParam(param: ParamSchema, level: number = 0) {
  const comment: string[] = [];
  const spacePrefix = indent.repeat(level);
  if (param.description) {
    // add description
    const descArr = param.description.split('\n');
    if (descArr.length > 1) {
      comment.push(`${spacePrefix}/**`);
      descArr.forEach((d) => {
        comment.push(`${spacePrefix} * ${d}`);
      });
      comment.push(`${spacePrefix} */`);
    } else {
      comment.push(`${spacePrefix}/** ${descArr[0]} */`);
    }
  }
  const { type } = param;

  let typeDefStr: string = type;
  if ('properties' in param) {
    typeDefStr = generateParamsObj(param.properties, level);
  }
  return {
    comment: comment.join('\n'),
    content: typeDefStr,
  };
}

/**
 * 根据参数描述，生成 TypeScript 声明 key-value
 * @param params 参数描述
 * @param level 缩进级别
 */
function generateParamsObj(params: Record<string, ParamSchema>, level: number = 0) {
  const strArr: string[] = [];
  strArr.push('{');
  const spacePrefix = indent.repeat(level);
  Object.entries(params).forEach(([paramName, paramDetail]) => {
    const { comment, content: typeDefStr } = generateParam(paramDetail);
    if (comment) {
      strArr.push(comment);
    }
    const requiredStr = paramDetail.required ? '' : '?';
    let content = typeDefStr;
    if (paramDetail.array) {
      content += '[]';
    }
    strArr.push(`${spacePrefix + paramName + requiredStr}: ${content};`);
  });
  strArr.push('}');
  return strArr.join('\n');
}

/**
 * 根据响应结果描述，生成 TypeScript 声明
 * @param responseType 响应结果类型
 * @param responseJson json响应结果描述
 */
function generateResponseType(responseType: ResponseType, responseJson?: ParamSchema) {
  if (responseType === 'formData') {
    return 'FormData';
  }
  if (responseType === 'text') {
    return 'string';
  }
  if (responseType === 'blob') {
    return 'Blob';
  }
  if (responseType === 'arrayBuffer') {
    return 'ArrayBuffer';
  }
  if (responseJson) {
    const { content } = generateParam(responseJson);
    return content;
  }
  return '{}';
}

export async function generate(apiJsonPath:string, targetPath:string) {
  // 读取配置信息
  const config = await readApiJson(apiJsonPath);

  // 读取模板
  const serviceTpl = await readFileStr(resolve(__dirname, '../templates/service.ts.ejs'));
  const allServicesTpl = await readFileStr(resolve(__dirname, '../templates/allServices.ts.ejs'));

  const apiJson = config.value as ApiJson;

  // 转换为接口内容
  const servicesContent = Object.entries(apiJson.api).map(([key, api]) => {
    const [method, apiPath] = key.split('|');
    const compiler = ejs.compile(serviceTpl, {
      escape: markup => markup,
    });
    const {
      description,
      serviceName,
      params,
      response,
      responseType: responseTypeJson = 'json',
      errorHandler,
      requestType,
      ...options
    } = api;
    const paramsStr = generateParamsObj(params || {});
    const responseType = generateResponseType(responseTypeJson, response);
    const result = compiler({
      paramCase,
      pascalCase,
      camelCase,
      options: JSON.stringify(options, null, 2),
      method,
      params: paramsStr,
      apiPath,
      serviceName,
      responseType,
      isJson: responseTypeJson === 'json',
      pascalServiceName: pascalCase(serviceName),
      description,
    });

    return result;
  });

  const compiler = ejs.compile(allServicesTpl, {
    escape: markup => markup,
  });

  await writeFile(
    targetPath,
    // 编译完整的接口文件
    prettier.format(
      compiler({
        content: servicesContent.join('\n'),
        fetchPath: resolve(__dirname, '../fetch/fetch'),
      }),
      {
        printWidth: 120,
        tabWidth: 2,
        semi: true,
        singleQuote: true,
        trailingComma: 'all',
        arrowParens: 'always',
        parser: 'typescript',
      },
    ),
  );
}
