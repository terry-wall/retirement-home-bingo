FROM node:20-alpine

ENV DEBIAN_FRONTEND=noninteractive

WORKDIR /app

# Clear npm cache and install dependencies
COPY package*.json ./
RUN npm cache clean --force
RUN npm install --no-package-lock --no-save

# Copy source code
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build the application
RUN npm run build

# Expose port
EXPOSE 3000

# Start the application
CMD ["npm", "run", "start"]