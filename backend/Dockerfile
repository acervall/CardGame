FROM node:16
COPY . /app
WORKDIR /app
RUN npm install
RUN npm run build
EXPOSE 3000
CMD ["node", "dist/index.js"]
