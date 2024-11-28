# Use an official Node.js runtime as a parent image
FROM node:18.17.1

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install project dependencies
RUN npm install --legacy-peer-deps

# Copy the rest of the application code to the container
COPY . .

# Build the React.js app using the provided build command
RUN npm run build

# Expose port 80 (the default for HTTP traffic)
EXPOSE 3000

# Start the React.js app
CMD ["npm", "start"]
