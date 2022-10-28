# Node.js base image file
FROM node:16.17.0-alpine3.16

# Linux configuration
RUN apk update

# Install linux third party packages
RUN apk add dumb-init

# Install pm2 and typescript as global for this container in production
RUN npm install -g pm2 typescript ts-node

# Set project main directory
WORKDIR /app

# Copy initial files and install dependencies
COPY package*.json ./
RUN npm install

# Copy other files of the project
COPY . .

# Prisma deploy and generate prisma client
RUN npx prisma migrate deploy
RUN npx prisma generate

# Compile typescript
RUN npm run build

# Start application
CMD ["dumb-init", "pm2-runtime", "build/index.js"]