# Use a lighter version of Node as a parent image
FROM node:14.15.3-stretch
# Set the working directory to /api
WORKDIR /ApartmentMUD
# copy package.json into the container at /ApartmentMUD
COPY package*.json /ApartmentMUD/
# install dependencies
RUN npm install
# Copy the current directory contents into the container at /ApartmentMUD
COPY . /ApartmentMUD/
# Make port 4000 available to the world outside this container
EXPOSE 4000
# Set the mongo address env variable to "db"
ENV MONGO_ADDRESS=mongodb
# Run the app when the container launches
CMD ["node", "index"]