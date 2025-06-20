# Use Node.js 18 with Alpine (lightweight)
FROM node:18-alpine

# Set working directory inside container
WORKDIR /app

# Copy only package.json and package-lock.json for better caching
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the environment file
#COPY .env .env

# Copy remaining app files
COPY . .

# Expose the default React port
EXPOSE 3000

# Start the development server
CMD ["npm", "start"]
