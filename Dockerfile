FROM 192.168.1.113/zhangpc/node:base-8-alpine
MAINTAINER zhangpc<zhangpc@tenxcloud.com>

ENV NODE_ENV production

ADD . /usr/src/app/

# package files
RUN npm run build

RUN rm -rf /usr/src/app/client

EXPOSE 8989

CMD ["npm", "start"]
