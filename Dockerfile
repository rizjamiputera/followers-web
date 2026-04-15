# Use a base image with Node.js installed
FROM node:23.11.1-alpine3.22

# Build argument for image tag
ARG IMAGE_TAG=latest
ENV IMAGE_TAG=${IMAGE_TAG}

# Set the working directory inside the container
WORKDIR /app

# Enable pnpm via corepack
RUN corepack enable

# Copy package manifests to the container
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy the rest of the application code
COPY . .

# add a label for the image tag (metadata)
# LABEL image_tag=$IMAGE_TAG

# Command to run your application
CMD pnpm run build && node ./.output/server/index.mjs

