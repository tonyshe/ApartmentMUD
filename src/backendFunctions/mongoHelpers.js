const MongoClient = require('mongodb').MongoClient

async function mongoDbClientConnect(url, roomName) {
    /**
     * Connectes to a mongo database roomName and returns the db obj and client obj
     * DON'T FORGET TO CLOSE YOUR CLIENT!!!!!!! You can do this by taking the client obj
     * returned by this function and running client.close() when you're done with the
     * database object.
     * Todo: maybe add a timeout so client automatically closes after a few seconds
     * @param {String} url - Url of the mongo db instance with port
     *     Example: "mongodb://" + global.mongoDbAddress + ":27017/"
     * @param {String} roomName - name of the room to connect to
     * @return {[Object, Object]} - MongoClint.db object and client object
     */
    url = "mongodb://" + global.mongoDbAddress + ":27017/"  + roomName;
    const client = new MongoClient(url, {useNewUrlParser: true, useUnifiedTopology: true})
    await client.connect()
    const database = client.db(roomName)
    return [database, client]
}

module.exports = {
    mongoDbClientConnect
}