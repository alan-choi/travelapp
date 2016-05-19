FROM library/node
MAINTAINER alan@levelmoney.com

RUN mkdir /.npm
RUN mkdir /app

# cache (and skip if no changes) to the node_modules
WORKDIR /.npm
ADD __package.json /.npm/package.json
RUN npm install --production
RUN cp -a /.npm/node_modules /app/

WORKDIR /app

ADD package.json /app/package.json
ADD app /app/app
ADD server /app/server
ADD webpack.config.js /app/webpack.config.js
ADD webpack.dist.config.js /app/webpack.dist.config.js
RUN npm run build

COPY server /app/server

EXPOSE 8080
CMD PORT=8080 NODE_ENV=production node --harmony server/server.js
