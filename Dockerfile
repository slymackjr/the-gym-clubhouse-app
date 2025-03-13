# Use Node.js image to build the React app
FROM node:18-alpine AS build
WORKDIR /app

# Copy package files and install dependencies
COPY the-gym-clubhouse-app/package*.json ./
RUN npm install

# Copy the rest of the code and build the app
COPY the-gym-clubhouse-app/ ./
RUN npm run build

# Use NGINX to serve the built React app
FROM nginx:alpine
COPY --from=dist /app/build /usr/share/nginx/html

# Copy custom nginx configuration
COPY nginx/nginx.conf /etc/nginx/nginx.conf

# Copy environment variables (optional)
COPY the-gym-clubhouse-app/.env /usr/share/nginx/html/.env

# Set correct permissions for Nginx to read the files
RUN chown -R nginx:nginx /usr/share/nginx/html

EXPOSE 80
EXPOSE 443
CMD ["nginx", "-g", "daemon off;"]
