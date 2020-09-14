# <https://nodejs.org/de/docs/guides/nodejs-docker-webapp/>
# <https://hub.docker.com/_/node>
FROM node:10

WORKDIR /mnt/cl-web

COPY package.json package-lock.json ./
RUN npm ci

COPY . ./
RUN chmod +x ./dev ./fix ./prod-build ./prod ./setup ./test && \
    ./prod-build

EXPOSE 8080

ENTRYPOINT [ "./prod" ]
