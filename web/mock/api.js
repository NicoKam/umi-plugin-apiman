const {
  promises: { readFile },
} = require('fs');
const { resolve } = require('path');

const mock = {
  'GET /api/getApiJson': async (req, resp) => {
    const apiBuffer = await readFile(resolve(__dirname, '../../src/api.json'));
    let json;
    try {
      json = JSON.parse(apiBuffer.toString());
      resp.json({
        errCode: 0,
        errMsg: 'success',
        data: json,
      });
    } catch (error) {
      console.error('parseJsonError');
      console.error(error);
      resp.json({
        errCode: 1,
        errMsg: '读取 api.json 出错，文件内容不是标准的JSON',
      });
    }
  },
};
module.exports = mock;
