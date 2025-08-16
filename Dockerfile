# Use a base image with Node.js installed
FROM node:20-alpine3.18

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package* ./

# Install dependencies
RUN npm install --verbose

# Copy the rest of the application code
COPY . .

# Command to run your application
CMD npm run build && node ./.output/server/index.mjs
