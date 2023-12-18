FROM node:19 AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx
WORKDIR /usr/share/nginx/html
COPY --from=build /app/dist/ .
WORKDIR /etc/nginx/conf.d
COPY ./nginx/default.conf .
EXPOSE 80