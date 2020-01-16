FROM node
RUN apt-get update
RUN apt-get install vim -y
RUN npm update
RUN npm install -g @angular/cli -y
#RUN npm install --save @angular/material -y
#RUN ng add @angular/material -y
