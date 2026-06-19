# celestial-server/Dockerfile
FROM node:18-alpine
WORKDIR /app
RUN apk add --no-cache ffmpeg python3 make g++ postgresql-client
COPY package*.json ./
RUN npm install --production
COPY . .
EXPOSE 3000
CMD ["node", "server.js"]