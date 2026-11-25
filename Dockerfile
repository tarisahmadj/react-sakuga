FROM node:20-alpine

WORKDIR /app

RUN apk add --no-cache libc6-compat curl postgresql-client

COPY package.json ./
RUN npm install

COPY . .

COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

EXPOSE 3000

ENTRYPOINT ["/usr/local/bin/docker-entrypoint.sh"]
CMD ["npm", "run", "dev"]
