FROM nginx
MAINTAINER Vikram Tiwari "vikramtheone1@gmail.com"

RUN uname -a
RUN apt-get update
# RUN apt-get install letsencrypt

RUN rm /etc/nginx/conf.d/default.conf
COPY ./deploy/nginx/website.conf /etc/nginx/conf.d/website.conf
RUN nginx -t
RUN service nginx restart

COPY . /var/www/vikramtiwari.com/html

# RUN letsencrypt certonly --standalone --renew-by-default --email vikramtheone1@gmail.com -a webroot --webroot-path=/var/www/vikramtiwari.com/html -d k8s.vikramtiwari.com
