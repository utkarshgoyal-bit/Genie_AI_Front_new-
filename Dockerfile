# Use official Node.js LTS image
FROM node:22-slim

# Set working directory
WORKDIR /app

# Install app dependencies
COPY package*.json ./
RUN npm install

# Copy project files
COPY . .

# Expose frontend port (Expo web runs on 8081, can map to 3000 if you prefer)
EXPOSE 8081

# Start expo web
CMD ["npm", "start", "--", "--web"]
