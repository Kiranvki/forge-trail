FROM node:lts-alpine
ENV NODE_ENV=developement
WORKDIR /usr/src/app
COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]
RUN npm install 
COPY . .
EXPOSE 3000
RUN chown -R node /usr/src/app
USER node
CMD ["forge", "deploy"]
