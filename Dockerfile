FROM node:18
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
# Install curl
RUN apt update && apt install -y curl
RUN npm install -g serve
EXPOSE 3080
CMD ["serve", "-s", "build", "-l", "3080"]