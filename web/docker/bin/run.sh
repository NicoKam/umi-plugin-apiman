# 脚本执行目录
SHELL_SCRIPT_ROOT=$(cd "$(dirname "$0")";PWD)

#
ROOT="${SHELL_SCRIPT_ROOT}/../../"

#删除容器
docker rm -f my-app-nginx &> /dev/null

#chmod 0600 ./.ssh/id_rsa

docker run -d --restart=on-failure:5 \
  -v $ROOT:/home/www \
  -v ${ROOT}docker/nginx/default.conf:/etc/nginx/nginx.conf \
  -w /home/www \
  -p 8001:8001 \
  -p 8000:8000 \
  -p 80:80 \
  -d \
  --name my-app-nginx \
  node:12 sh -c "npm config set registry https://registry.npm.taobao.org && yarn && yarn start"

# nginx:1.14.2 node:12
