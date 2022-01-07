FROM node:14

#just creating app directory where Armoonia App image will run
WORKDIR /usr/src/app

COPY package.json /usr/src/app

RUN npm install
# Armoonia App is not running on prod right now

COPY . /usr/src/app
# copying bundle source 

EXPOSE 5001

CMD ["npm", "start"] 