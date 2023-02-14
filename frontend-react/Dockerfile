FROM node:16-alpine
WORKDIR /app
COPY package.json .
RUN npm i -g serve
RUN npm i
COPY . .
RUN npm run build
EXPOSE 5173
CMD ["npm", "run", "serve"]