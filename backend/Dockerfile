FROM node:14

WORKDIR /slipper/
COPY ./package.json /slipper/
COPY ./yarn.lock /slipper/
RUN yarn install

COPY . /slipper/

CMD yarn start:dev