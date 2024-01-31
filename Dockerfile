FROM node:20-alpine

# Ensure that your docker-compose has a volumes entry like `.:/app`
WORKDIR /app

# Copying these separately prevents re-running npm install on every code change.
COPY package.json ./
COPY package-lock.json ./

RUN npm install

COPY . .

RUN npm run build

# Opting to instead define command in docker-compose.yml instead so that the ports are all defined in one place
# CMD [ "npm", "run", "dev", "--", "--port", "3000" ]