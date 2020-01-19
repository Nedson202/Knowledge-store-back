FROM node:alpine

RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app

# RUN apk --no-cache add python make g++

# RUN apk update && apk add bash
RUN apk --no-cache add --virtual native-deps \
  g++ gcc libgcc libstdc++ linux-headers autoconf automake make nasm python git && \
  npm install --quiet node-gyp -g

# RUN apk --no-cache add --virtual builds-deps build-base python

WORKDIR /home/node/app

COPY package*.json ./

USER node

COPY . .

RUN npm install

EXPOSE 4000

CMD [ "babel-node", "index.js" ]
