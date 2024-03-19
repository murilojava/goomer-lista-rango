# Use the official Node.js 20 image as the base image for build
FROM node:20 AS build

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Build the application
RUN npm run build

# Use a lightweight Node.js image as the base image for run
FROM node:20-alpine AS run

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Copy the built application from the build image
COPY --from=build /app/dist ./dist

# Install production dependencies
RUN npm install --only=production

# Expose a port (if needed)
EXPOSE 3000

# Start the application
CMD [ "npm", "start" ]