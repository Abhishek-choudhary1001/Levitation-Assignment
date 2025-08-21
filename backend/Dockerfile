# Use Node.js 20 on Debian Bullseye
FROM node:20-bullseye

# Install Chromium
RUN apt-get update && apt-get install -y chromium

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of your app
COPY . .

# Environment variables for Puppeteer (optional but recommended)
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true

# Start the app
CMD ["npm", "start"]
