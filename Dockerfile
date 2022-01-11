FROM node:12

COPY ./server /server
RUN cd /server && npm install

COPY ./client /client
RUN cd /client && npm install

EXPOSE 3000 3001

# Run the app (both client and server)
CMD npm start --prefix ./server & npm start --prefix ./client
