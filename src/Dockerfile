#base image
FROM node:18-alpine

RUN mkdir -p /usr/app/
WORKDIR /usr/app

#copy from to 
COPY ./ ./

RUN npm iinstall
RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]