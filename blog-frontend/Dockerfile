# Use the official Node.js image as the base image
FROM node:18 AS build

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the React code
COPY . .

# Build the Vite app
RUN npm run build

# Use a lightweight web server to serve the built app
FROM nginx:alpine

# Copy the build output from the build stage to the Nginx directory
COPY --from=build /app/dist /usr/share/nginx/html

# Expose the port on which Nginx will run
EXPOSE 80

# Run Nginx as the web server
CMD ["nginx", "-g", "daemon off;"]
