FROM node:22.20.0-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:22.20.0-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY --from=build /app/dist ./dist

COPY locales locales
COPY assets assets

EXPOSE 4000

CMD npm run migration:run --all && npm run server:prod
