FROM node:alpine

# update packages
RUN apk update

# create root application folder
WORKDIR /app

# copy configs to /app folder
COPY package*.json ./
COPY tsconfig.json ./
# copy source code to /app/src folder
COPY src /app/src
COPY dist /app/dist

RUN npm install
RUN npm run build

LABEL traefik.enable=true
LABEL traefik.http.routers.api.entrypoints=https
LABEL traefik.http.routers.api.rule=Host(`api.devbaier.dev`)
LABEL traefik.http.routers.api.tls=true
LABEL traefik.http.services.api.loadbalancer.server.port=5424

CMD [ "npm", "start" ]