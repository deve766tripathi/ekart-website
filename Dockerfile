# Use an official Nginx web server image as the base
FROM nginx:1.25-alpine

# Copy our static website files (index.html, style.css) 
# into the directory where Nginx serves files from
COPY ekart-website/ /usr/share/nginx/html

# Expose port 80 (the default port for Nginx/HTTP)
EXPOSE 80
