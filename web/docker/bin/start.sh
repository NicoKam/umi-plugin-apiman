SHELL_SCRIPT_ROOT=$(cd "$(dirname "$0")";PWD)

docker build -t my-app-nginx/image:1.0.0 -f "${SHELL_SCRIPT_ROOT}/../../Dockerfile" .

#删除容器
docker rm -f my-app-nginx &> /dev/null

#chmod 0600 ./.ssh/id_rsa

docker run -d --restart=on-failure:5 \
  -w /home/www \
  -p 8001:8001 \
  -p 8000:8000 \
  -p 80:80 \
  -d \
  --name my-app-nginx \
  my-app-nginx/image:1.0.0 sh -c "npm config set registry https://registry.npm.taobao.org && yarn && yarn start"


