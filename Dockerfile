FROM node:7.7.4
MAINTAINER zhangpc<zhangpc@tenxcloud.com>

ADD . /usr/src/app/

RUN npm install --registry=https://registry.npm.taobao.org

EXPOSE 8989

CMD ["npm", "start"]
