
FROM nginx:1.17.1-alpine

# Copy the built application from the builder stage
COPY ./dist /usr/share/nginx/html

# Copy the custom Nginx configuration file
COPY ./nginx/nginx.conf /etc/nginx/conf.d/default.conf

COPY ./entrypoint.sh /usr/share/nginx/entrypoint.sh


# Make the entrypoint script executable
RUN chmod +x /usr/share/nginx/entrypoint.sh

# Set the entrypoint script
ENTRYPOINT ["/usr/share/nginx/entrypoint.sh"]

# Expose port 80
EXPOSE 80

# Run Nginx
CMD ["nginx", "-g", "daemon off;"]
