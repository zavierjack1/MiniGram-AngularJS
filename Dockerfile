FROM node
RUN npm update
RUN npm install -g @angular/cli
RUN apt-get install vim

