FROM node
RUN apt-get update
RUN apt-get install vim -y
#COPY . /AngularApp
#WORKDIR /AngularApp
RUN npm install -g @angular/cli
RUN npm install
CMD ng serve --host 0.0.0.0 --port 8080
