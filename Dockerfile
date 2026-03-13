FROM node:20-alpine

ENV DEBIAN_FRONTEND=noninteractive
ENV NODE_ENV=production

WORKDIR /app

# Clear npm cache and install latest npm
RUN npm cache clean --force && npm install -g npm@latest

# Copy package files and install dependencies
COPY package.json ./
RUN rm -rf node_modules package-lock.json
RUN npm install --no-package-lock --legacy-peer-deps

# Copy source code and Prisma schema
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build the application
RUN npm run build

# Expose port
EXPOSE 3000

# Start the application
CMD ["npm", "run", "start"]