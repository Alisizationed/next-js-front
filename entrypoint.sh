#!/bin/sh

# Start the env.js file
echo "window.env = {" > /usr/share/nginx/html/env-config.js

# Loop through all environment variables that start with "VITE_"
env | grep '^VITE_' | while IFS='=' read -r key value; do
  # Append each VITE_ variable to env.js in JSON format
  echo "  $key: \"$value\"," >> /usr/share/nginx/html/env-config.js
done

# Close the env.js file
echo "};" >> /usr/share/nginx/html/env-config.js

# Start Nginx
exec "$@"
