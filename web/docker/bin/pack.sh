SHELL_SCRIPT_ROOT=$(cd "$(dirname "$0")";PWD)

DOCKER_IMAGE_NAME="my-app-nginx-image"
DOCKER_IMAGE_VERSION="my-app-nginx/image:1.0.0"

docker build -t $DOCKER_IMAGE_VERSION -f "${SHELL_SCRIPT_ROOT}/../../Dockerfile" .

docker save $DOCKER_IMAGE_VERSION:load>"${SHELL_SCRIPT_ROOT}/../../temp/${DOCKER_IMAGE_NAME}.tar"