import ejs from 'ejs';
import fs from 'fs';
import { resolve } from 'path';
import { paramCase, pascalCase, camelCase } from 'change-case';
import { ApiJson } from './ApiJson';
import { readApiJson, readFileStr } from './utils';

const { writeFile } = fs.promises;

export async function generate() {
  // 读取配置信息
  const config = await readApiJson(resolve(__dirname, '../api.json'));

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
    const { description, serviceName, params, response, ...options } = api;
    const result = compiler({
      paramCase,
      pascalCase,
      camelCase,
      options: JSON.stringify(options, null, 2),
      method,
      apiPath,
      serviceName,
      pascalServiceName: pascalCase(serviceName),
      description,
    });

    return result;
  });

  const compiler = ejs.compile(allServicesTpl, {
    escape: markup => markup,
  });

  await writeFile(
    resolve(__dirname, '../api.ts'),
    // 编译完整的接口文件
    compiler({
      content: servicesContent.join('\n'),
    }),
  );
}

generate();

